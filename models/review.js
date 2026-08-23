const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: String,
    enum: ["1", "2", "3", "4", "5"],
    required: true,
  },
  comment: {
    type: String,
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
