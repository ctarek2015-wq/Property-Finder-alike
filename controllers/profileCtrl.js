const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/users");
const cloudinary = require("../config/cloudinary");
const uploadImageToCloudinary = require("../services/uploadImageToCloudinary");
const sendPasswordResetEmail = require("../services/sendPasswordResetEmail");

const SALT_ROUNDS = 10;
const RESET_CODE_LENGTH = 8;
const RESET_CODE_TTL_MS = 15 * 60 * 1000;

const generateResetCode = () =>
  crypto
    .randomBytes(RESET_CODE_LENGTH)
    .toString("base64")
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, RESET_CODE_LENGTH)
    .toUpperCase();

const renderProfile = (
  res,
  profileUser,
  { errors = [], message = null, codeSent = false } = {},
) =>
  res.render("users/profile/show.ejs", {
    profileUser,
    errors,
    message,
    codeSent,
  });

const show = async (req, res) => {
  const user = await User.findById(req.session.user._id);
  renderProfile(res, user);
};

const updateProfilePic = async (req, res) => {
  const user = await User.findById(req.session.user._id);
  try {
    if (req.uploadError) {
      return renderProfile(res, user, { errors: [req.uploadError] });
    }
    if (!req.file) {
      return renderProfile(res, user, {
        errors: ["Please choose an image to upload."],
      });
    }

    const uploaded = await uploadImageToCloudinary(req.file, "profiles");
    const previousPublicId = user.profileImage?.publicId;

    await User.findByIdAndUpdate(user._id, { profileImage: uploaded });
    if (previousPublicId) {
      await cloudinary.uploader.destroy(previousPublicId).catch(() => {});
    }

    res.redirect("/profile");
  } catch (err) {
    renderProfile(res, user, { errors: ["Unable to update profile picture."] });
  }
};

const sendResetCode = async (req, res) => {
  const user = await User.findById(req.session.user._id);
  try {
    const code = generateResetCode();
    await User.findByIdAndUpdate(user._id, {
      resetPasswordCode: code,
      resetPasswordExpires: new Date(Date.now() + RESET_CODE_TTL_MS),
    });
    await sendPasswordResetEmail(user, code);
    renderProfile(res, user, {
      message: "A verification code was sent to your email.",
      codeSent: true,
    });
  } catch (err) {
    renderProfile(res, user, {
      errors: ["Could not send verification code. Please try again."],
    });
  }
};

const verifyResetCode = async (req, res) => {
  const user = await User.findById(req.session.user._id);
  const { code, newPassword, confirmNewPassword } = req.body;

  if (!code || !newPassword || !confirmNewPassword) {
    return renderProfile(res, user, {
      errors: ["All fields are required."],
      codeSent: true,
    });
  }
  if (newPassword !== confirmNewPassword) {
    return renderProfile(res, user, {
      errors: ["Passwords do not match."],
      codeSent: true,
    });
  }
  if (
    !user.resetPasswordCode ||
    !user.resetPasswordExpires ||
    user.resetPasswordExpires < new Date()
  ) {
    return renderProfile(res, user, {
      errors: ["Verification code has expired. Please request a new one."],
    });
  }
  if (user.resetPasswordCode !== code.toUpperCase()) {
    return renderProfile(res, user, {
      errors: ["Invalid verification code."],
      codeSent: true,
    });
  }

  const hashed = bcrypt.hashSync(newPassword, SALT_ROUNDS);
  await User.findByIdAndUpdate(user._id, {
    password: hashed,
    resetPasswordCode: null,
    resetPasswordExpires: null,
  });

  renderProfile(res, user, { message: "Your password has been updated." });
};

module.exports = { show, updateProfilePic, sendResetCode, verifyResetCode };
