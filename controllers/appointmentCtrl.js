const Viewing = require("../models/viewing");

const index = (req, res) => {
  res.send("Appointment index");
};

const newAppointment = (req, res) => {
  res.send("New appointment form");
};

const create = (req, res) => {
  res.send("Appointment created");
};

const show = (req, res) => {
  res.send("Appointment details");
};

const edit = (req, res) => {
  res.send("Edit appointment form");
};

const update = (req, res) => {
  res.send("Appointment updated");
};

const deleteAppointment = (req, res) => {
  res.send("Appointment deleted");
};

module.exports = {
  index,
  newAppointment,
  create,
  show,
  edit,
  update,
  deleteAppointment,
};
