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
    const requiredFields = [
      "title",
      "description",
      "price",
      "location",
      "area",
      "bedrooms",
      "bathrooms",
      "dateFrom",
      "dateTo",
    ];
    const oldInput = req.body;
    let errors = [];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    if (Number(req.body.price) < 0) {
      errors.push("Invalid Price: Price cannot be negative.");
    }

    if (Number(req.body.area) < 0) {
      errors.push("Invalid Area: Area cannot be negative.");
    }

    if (Number(req.body.bedrooms) < 0) {
      errors.push("Invalid Bedrooms: Number of bedrooms cannot be negative.");
    }

    if (Number(req.body.bathrooms) < 0) {
      errors.push("Invalid Bathrooms: Number of bathrooms cannot be negative.");
    }

    if (
      new Date(req.body.dateFrom) <
      new Date(new Date().toISOString().split("T")[0])
    ) {
      errors.push("Invalid Start Date: Start date cannot be in the past.");
    }

    if (new Date(req.body.dateTo) < new Date(req.body.dateFrom)) {
      errors.push("Invalid End Date: End date cannot be before start date.");
    }

    if (errors.length > 0) {
      return res.render("users/properties/new.ejs", { errors, oldInput });
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
