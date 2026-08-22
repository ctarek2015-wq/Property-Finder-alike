const mongoose = require("mongoose");

const viewingSchema = new mongoose.Schema({
  appointmentDate: {
    type: Date,
    required: true,
  },
  appointmentTime: {
    type: String,
    enum: [
      "8:00 AM",
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
      "6:00 PM",
      "7:00 PM",
      "8:00 PM",
    ],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
  },
  viewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Viewing = mongoose.model("Viewing", viewingSchema);

module.exports = Viewing;
