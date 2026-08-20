const mongoose = require("mongoose");

//create the schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
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
});

// init the model

const User = mongoose.model("User", userSchema);

//Export

module.exports = User;
