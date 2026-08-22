const Viewing = require("../models/viewing");
const Property = require("../models/property");

const index = async (req, res) => {
  try {
    // populate just username of owner of propertyId and property title

    const viewings = await Viewing.find({
      viewerId: req.session.user._id,
    }).populate({
      path: "propertyId",
      select: "owner title",
      populate: {
        path: "owner",
        select: "username",
      },
    });
    console.log(viewings);
    res.render("users/appointments/index.ejs", { viewings });
  } catch (err) {
    console.error(err.message);
  }
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
  res.render("users/appointments/new.ejs", { prop, time, availableDates });
};

const create = async (req, res) => {
  try {
    const newViewing = new Viewing(req.body);
    newViewing.viewerId = req.session.user._id;
    newViewing.propertyId = req.params.id;
    await newViewing.save();
    res.redirect(`/properties/${req.params.id}/appointments`);
  } catch (err) {
    console.error(err.message);
  }
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
