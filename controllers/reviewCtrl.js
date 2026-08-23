const Review = require("../models/review");
const Property = require("../models/property");

const create = async (req, res) => {
  try {
    const newReview = await Review.create(req.body);
    newReview.reviewerId = req.session.user._id;
    newReview.propertyId = req.query.propertyId;
    newReview.reviewed = true;
    await newReview.save();
    res.redirect(`/properties/${req.query.propertyId}`);
  } catch (err) {
    console.log(err.message);
  }
};

const edit = async (req, res) => {};

const update = async (req, res) => {};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    res.redirect(`/properties/${req.query.propertyId}`);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  create,
  edit,
  update,
  deleteReview,
};
