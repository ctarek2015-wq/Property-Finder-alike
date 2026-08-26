const mongoose = require("mongoose");

//create the schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["owner", "seeker"],
    default: "owner",
  },
  profileImage: {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
  },
  resetPasswordCode: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
});

// init the model

const User = mongoose.model("User", userSchema);

//Export

module.exports = User;
