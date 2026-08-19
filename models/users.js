const mongoose = require("mongoose");

//create the schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// init the model

const User = mongoose.model("User", userSchema);

//Export

module.exports = User;
