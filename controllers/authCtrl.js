const User = require("../models/users");
const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 10;

const signup = async (req, res) => {
  res.render("auth/sign-up.ejs");
};

const register = async (req, res) => {
  try {
    // verify all fields are not empty
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.send("All fields are required");
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
      return res.send("email or password is incorrect");
    }
    if (req.body.role === "seeker" && seekerExists) {
      return res.send("email or password is incorrect");
    }

    //else check the pw match
    // else send err msg
    if (req.body.password !== req.body.confirmPassword) {
      return res.send("email or password is incorrect");
    }
    //encrypt the pw

    const hashed = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
    req.body.password = hashed;
    // if yes, create new user, redirect home page
    const createUser = await User.create(req.body);

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
  res.render("auth/sign-in.ejs");
};

const login = async (req, res) => {
  try {
    const userExists = await User.findOne({
      email: req.body.email,
      role: req.body.role,
    });

    //allow user if exists
    if (!userExists) {
      return res.send("email or password is incorrect");
    }
    //make sure if user pw matches the db pw (compare)
    if (!bcrypt.compareSync(req.body.password, userExists.password)) {
      return res.send("email or password is incorrect");
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
