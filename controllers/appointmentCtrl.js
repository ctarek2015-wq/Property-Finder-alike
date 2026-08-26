const Viewing = require("../models/viewing");
const Property = require("../models/property");
const Review = require("../models/review");
const User = require("../models/users");
const sendAppointmentNotification = require("../services/sendAppointmentNotification");

const index = async (req, res) => {
  try {
    const viewings = await Viewing.find()
      .populate("propertyId", "title")
      .populate("ownerId", "username")
      .populate("viewerId", "username");
    const userReviews = await Review.find({ reviewerId: req.session.user._id });
    res.render("users/appointments/index.ejs", { viewings, userReviews });
  } catch (err) {
    console.error(err.message);
  }
};

const newAppointment = async (req, res) => {
  const prop = await Property.findById(req.query.propertyId).populate(
    "availableAppointments",
  );
  const dateFrom = prop.availableAppointments.dateFrom;
  const dateTo = prop.availableAppointments.dateTo;
  const time = prop.availableAppointments.time;
  const daysAvailable = (dateTo - dateFrom) / (1000 * 60 * 60 * 24);
  let availableDates = [];
  // Build selectable appointment dates
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
    if (req.validationErrors) {
      return res.status(400).send(req.validationErrors.join(" "));
    }

    const prop = await Property.findById(req.query.propertyId);
    if (!prop) {
      return res.status(404).send("Property not found.");
    }
    const newViewing = new Viewing(req.body);
    newViewing.viewerId = req.session.user._id;
    newViewing.propertyId = req.query.propertyId;
    newViewing.ownerId = prop.owner._id;
    await newViewing.save();

    try {
      const owner = await User.findById(prop.owner);
      if (owner) {
        await sendAppointmentNotification({
          owner,
          seeker: req.session.user,
          property: prop,
          viewing: newViewing,
        });
      }
    } catch (emailError) {
      console.log(
        "Booking notification email could not be sent:",
        emailError.message,
      );
    }

    res.redirect(`/appointments`);
  } catch (err) {
    console.error(err.message);
  }
};

const edit = async (req, res) => {
  try {
    const viewing = await Viewing.findById(req.params.id);
    const prop = await Property.findById(viewing.propertyId._id).populate(
      "availableAppointments",
    );
    const dateFrom = prop.availableAppointments.dateFrom;
    const dateTo = prop.availableAppointments.dateTo;
    const time = prop.availableAppointments.time;
    const daysAvailable = (dateTo - dateFrom) / (1000 * 60 * 60 * 24);
    let availableDates = [];
    // Build selectable appointment dates
    for (let i = 0; i <= daysAvailable; i++) {
      const date = new Date(dateFrom);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split("T")[0];
      availableDates.push(dateString);
    }
    res.render("users/appointments/edit.ejs", {
      viewing,
      time,
      availableDates,
    });
  } catch (err) {
    console.error(err.message);
  }
};

const update = async (req, res) => {
  try {
    req.body.status = req.query.status;
    const updateViewing = await Viewing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.redirect(`/appointments`);
  } catch (err) {
    console.error(err.message);
  }
};

const deleteAppointment = async (req, res) => {
  try {
    await Viewing.findByIdAndDelete(req.params.id);
    res.redirect(`/appointments`);
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  index,
  newAppointment,
  create,
  edit,
  update,
  deleteAppointment,
};
