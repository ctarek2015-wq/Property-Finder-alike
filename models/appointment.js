const mongoose = require("mongoose");

const availableAppointmentsSchema = new mongoose.Schema({
  dateFrom: {
    type: Date,
    required: true,
  },
  dateTo: {
    type: Date,
    required: true,
  },
  time: {
    type: [String],
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
});

const Appointment = mongoose.model("Appointment", availableAppointmentsSchema);

module.exports = Appointment;
