const Property = require("../models/property");
const Appointment = require("../models/appointment");

const index = async (req, res) => {
  res.render("users/properties/index.ejs");
};

const newProp = async (req, res) => {
  res.render("users/properties/new.ejs");
};

const create = async (req, res) => {
  try {
    const newProp = await Property.create(req.body);
    const newAppointment = await Appointment.create(req.body);
    newProp.owner = req.session.user._id;
    newProp.availableAppointments = newAppointment._id;
    await newAppointment.save();
    await newProp.save();
    res.redirect("/properties");
  } catch (err) {
    console.log(err.message);
  }
};

const show = async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate("availableAppointments")
    .populate("owner", "username");
  res.render("users/properties/show.ejs", { property });
};

const edit = async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate("availableAppointments")
    .populate("owner", "username");
  res.render("users/properties/edit.ejs", { property });
};

const update = async (req, res) => {
  const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  await Appointment.findByIdAndUpdate(
    property.availableAppointments,
    req.body,
    {
      new: true,
    },
  );
  res.redirect(`/properties/${property._id}`);
};

const deleteProp = async (req, res) => {
  await Property.findByIdAndDelete(req.params.id);
  res.redirect("/properties");
};

module.exports = { index, newProp, create, show, edit, update, deleteProp };
