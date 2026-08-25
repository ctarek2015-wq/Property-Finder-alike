const Review = require("../models/review");
const Property = require("../models/property");

const create = async (req, res) => {
  try {
    if (req.validationErrors) {
      return res.status(400).send(req.validationErrors.join(" "));
    }

    const property = await Property.findById(req.query.propertyId);
    if (!property) {
      return res.status(404).send("Property not found.");
    }

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

const edit = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    res.render("users/reviews/edit.ejs", { review });
  } catch (err) {
    console.log(err.message);
  }
};

const update = async (req, res) => {
  try {
    if (req.validationErrors) {
      return res.status(400).send(req.validationErrors.join(" "));
    }

    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.redirect(`/properties/${req.query.propertyId}`);
  } catch (err) {
    console.log(err.message);
  }
};

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
