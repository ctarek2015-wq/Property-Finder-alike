const Viewing = require("../models/viewing");
const Property = require("../models/property");

const index = (req, res) => {
  res.send("Appointment index");
};

const newAppointment = async (req, res) => {
  const prop = await Property.findById(req.params.id).populate(
    "availableAppointments",
  );
  const dateFrom = prop.availableAppointments.dateFrom;
  const dateTo = prop.availableAppointments.dateTo;
  const time = prop.availableAppointments.time;
  const daysAvailable = (dateTo - dateFrom) / (1000 * 60 * 60 * 24);
  let availableDates = [];
  for (let i = 0; i <= daysAvailable; i++) {
    const date = new Date(dateFrom);
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split("T")[0];
    availableDates.push(dateString);
  }
  console.log("Available Dates:", availableDates);
  res.render("users/appointments/new.ejs", { prop, time, availableDates });
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
