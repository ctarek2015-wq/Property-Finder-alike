const User = require("../models/users");
const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 10;
const sendWelcomeEmail = require("../services/sendWelcomeEmail");
const uploadImageToCloudinary = require("../services/uploadImageToCloudinary");

const renderAuthError = (res, view, error, body) => {
  const oldInput = {
    username: body.username,
    email: body.email,
    role: body.role,
  };
  return res.render(view, { errors: [error], oldInput });
};

const signup = async (req, res) => {
  res.render("auth/sign-up.ejs", { errors: [], oldInput: {} });
};

const register = async (req, res) => {
  try {
    if (req.validationErrors) {
      return res.render("auth/sign-up.ejs", {
        errors: req.validationErrors,
        oldInput: {
          username: req.body.username,
          email: req.body.email,
          role: req.body.role,
        },
      });
    }

    // Validate required fields
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return renderAuthError(
        res,
        "auth/sign-up.ejs",
        "All fields are required.",
        req.body,
      );
    }

    if (req.uploadError) {
      return renderAuthError(
        res,
        "auth/sign-up.ejs",
        req.uploadError,
        req.body,
      );
    }

    // Check duplicate role email
    const ownerExists = await User.findOne({
      email: req.body.email,
      role: "owner",
    });

    const seekerExists = await User.findOne({
      email: req.body.email,
      role: "seeker",
    });

    if (req.body.role === "owner" && ownerExists) {
      return renderAuthError(
        res,
        "auth/sign-up.ejs",
        "An account already exists for this email and role.",
        req.body,
      );
    }
    if (req.body.role === "seeker" && seekerExists) {
      return renderAuthError(
        res,
        "auth/sign-up.ejs",
        "An account already exists for this email and role.",
        req.body,
      );
    }

    // Validate matching passwords
    if (req.body.password !== req.body.confirmPassword) {
      return renderAuthError(
        res,
        "auth/sign-up.ejs",
        "Passwords do not match.",
        req.body,
      );
    }
    // Hash the password
    const hashed = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
    req.body.password = hashed;

    if (req.file) {
      try {
        req.body.profileImage = await uploadImageToCloudinary(
          req.file,
          "profiles",
        );
      } catch (uploadErr) {
        return renderAuthError(
          res,
          "auth/sign-up.ejs",
          "Could not upload profile picture.",
          req.body,
        );
      }
    }

    // Create user and session
    const createUser = await User.create(req.body);
    // disabled email notification for now, as it was causing issues with the deployed app

    // try {
    //   await sendWelcomeEmail(createUser);
    // } catch (emailError) {
    //   console.log("Welcome email could not be sent:", emailError.message);
    // }
    req.session.user = {
      username: createUser.username,
      role: createUser.role,
      _id: createUser._id,
      profileImage: createUser.profileImage,
    };
    req.session.save(() => {
      res.redirect("/");
    });
  } catch (err) {
    res.redirect("/auth/sign-up");
  }
};

const signin = async (req, res) => {
  res.render("auth/sign-in.ejs", { errors: [], oldInput: {} });
};

const login = async (req, res) => {
  try {
    if (req.validationErrors) {
      return res.render("auth/sign-in.ejs", {
        errors: req.validationErrors,
        oldInput: { email: req.body.email, role: req.body.role },
      });
    }

    const userExists = await User.findOne({
      email: req.body.email,
      role: req.body.role,
    });

    // Reject unknown accounts
    if (!userExists) {
      return renderAuthError(
        res,
        "auth/sign-in.ejs",
        "Email or password is incorrect.",
        req.body,
      );
    }
    // Compare hashed passwords
    if (!bcrypt.compareSync(req.body.password, userExists.password)) {
      return renderAuthError(
        res,
        "auth/sign-in.ejs",
        "Email or password is incorrect.",
        req.body,
      );
    }

    req.session.user = {
      username: userExists.username,
      role: userExists.role,
      _id: userExists._id,
      profileImage: userExists.profileImage,
    };

    req.session.save(() => {
      res.redirect("/");
    });
  } catch (err) {
    res.redirect("/auth/sign-in");
  }
};

const signout = async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

module.exports = { signup, register, signin, login, signout };
