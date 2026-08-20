const User = require("../models/users");

const home = async (req, res) => {
  if (!req.session.user) {
    return res.render("index.ejs");
  }
  const user = await User.findOne({
    _id: req.session.user._id,
  });
  res.render("index.ejs", { role: user.role });
};

module.exports = { home };
