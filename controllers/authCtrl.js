const User = require("../models/users");
const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 10;
const sendWelcomeEmail = require("../services/sendWelcomeEmail");

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

    // verify all fields are not empty
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return renderAuthError(
        res,
        "auth/sign-up.ejs",
        "All fields are required.",
        req.body,
      );
    }

    //verify if the user name exists
    //if the uer exists , send err msg
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

    //else check the pw match
    // else send err msg
    if (req.body.password !== req.body.confirmPassword) {
      return renderAuthError(
        res,
        "auth/sign-up.ejs",
        "Passwords do not match.",
        req.body,
      );
    }
    //encrypt the pw

    const hashed = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
    req.body.password = hashed;
    // if yes, create new user, redirect home page
    const createUser = await User.create(req.body);

    try {
      await sendWelcomeEmail(createUser);
    } catch (emailError) {
      console.log("Welcome email could not be sent:", emailError.message);
    }
    req.session.user = {
      username: createUser.username,
      role: createUser.role,
      _id: createUser._id,
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

    //allow user if exists
    if (!userExists) {
      return renderAuthError(
        res,
        "auth/sign-in.ejs",
        "Email or password is incorrect.",
        req.body,
      );
    }
    //make sure if user pw matches the db pw (compare)
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
