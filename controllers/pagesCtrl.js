const Viewing = require("../models/viewing");

const home = async (req, res) => {
  try {
    const seekerViewings = await Viewing.find({
      viewerId: req.session.user._id,
    });
    return res.render("index.ejs", { seekerViewings });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { home };
