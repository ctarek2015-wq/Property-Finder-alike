const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  listingType: {
    type: String,
    enum: ["sale", "rent"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  location: {
    type: String,
    enum: [
      "manama",
      "al hidd",
      "muharraq",
      "rifaa",
      "jidd hafs",
      "hamad town",
      "isa town",
      "hawar islands",
      "sitra",
    ],
    required: true,
  },
  area: {
    type: Number,
    required: true,
    min: 0,
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 0,
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0,
  },
  images: [
    {
      type: String,
      match: /^https?:\/\/\S+$/i,
    },
  ],
  averageRating: {
    type: Number,
    default: 0,
  },
  available: {
    type: Boolean,
    default: true,
  },
  availableAppointments: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
