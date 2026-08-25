const Property = require("../models/property");
const Appointment = require("../models/appointment");
const Viewing = require("../models/viewing");
const Review = require("../models/review");

const index = async (req, res) => {
  res.render("users/properties/index.ejs");
};

const newProp = async (req, res) => {
  res.render("users/properties/new.ejs", { oldInput: {}, errors: [] });
};

const create = async (req, res) => {
  try {
    const oldInput = req.body;
    if (req.validationErrors) {
      return res.render("users/properties/new.ejs", {
        errors: req.validationErrors,
        oldInput,
      });
    }

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
  const propReviews = await Review.find({ propertyId: req.params.id });
  const seekerViewings = await Viewing.find({
    viewerId: req.session.user._id,
    propertyId: req.params.id,
  });

  res.render("users/properties/show.ejs", {
    property,
    seekerViewings,
    propReviews,
  });
};

const edit = async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate("availableAppointments")
    .populate("owner", "username");
  res.render("users/properties/edit.ejs", { property });
};

const update = async (req, res) => {
  try {
    const oldInput = req.body;
    if (req.validationErrors) {
      const property = await Property.findById(req.params.id).populate(
        "availableAppointments",
      );
      return res.render("users/properties/edit.ejs", {
        property,
        errors: req.validationErrors,
        oldInput,
      });
    }

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
  } catch (err) {
    console.log(err.message);
  }
};

const deleteProp = async (req, res) => {
  await Property.findByIdAndDelete(req.params.id);
  res.redirect("/properties");
};

module.exports = { index, newProp, create, show, edit, update, deleteProp };
