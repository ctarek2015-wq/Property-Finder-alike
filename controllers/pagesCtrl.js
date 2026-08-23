const Viewing = require("../models/viewing");
const Review = require("../models/review");

const home = async (req, res) => {
  try {
    let seekerViewings = [];
    let userReviews = [];
    if (req.session.user) {
      seekerViewings = await Viewing.find({
        viewerId: req.session.user._id,
      });
      userReviews = await Review.find({
        reviewerId: req.session.user._id,
      });
    }
    return res.render("index.ejs", { seekerViewings, userReviews });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { home };
