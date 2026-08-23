const Viewing = require("../models/viewing");
const Property = require("../models/property");

const index = async (req, res) => {
  try {
    const viewings = await Viewing.find()
      .populate("propertyId", "title")
      .populate("ownerId", "username")
      .populate("viewerId", "username");
    res.render("users/appointments/index.ejs", { viewings });
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
    const prop = await Property.findById(req.query.propertyId);
    const newViewing = new Viewing(req.body);
    newViewing.viewerId = req.session.user._id;
    newViewing.propertyId = req.query.propertyId;
    newViewing.ownerId = prop.owner._id;
    await newViewing.save();
    res.redirect(`/appointments`);
  } catch (err) {
    console.error(err.message);
  }
};

// const show = (req, res) => {
//   res.send("Appointment details");
// };

const edit = async (req, res) => {
  try {
    const viewing = await Viewing.findById(req.params.id).populate({
      path: "propertyId",
      select: "owner title",
      populate: {
        path: "owner",
        select: "username",
      },
    });
    const prop = await Property.findById(viewing.propertyId).populate(
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
  // show,
  edit,
  update,
  deleteAppointment,
};
