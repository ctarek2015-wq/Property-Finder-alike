const User = require("../models/users");
const Property = require("../models/property");

const index = async (req, res) => {
  const properties = await Property.find({ owner: req.session.user._id });
  res.render("users/owners/properties/index.ejs", { properties });
};

const newProp = async (req, res) => {
  const locations = Property.schema.path("location").enumValues;
  res.render("users/owners/properties/new.ejs", { locations });
};

const create = async (req, res) => {
  try {
    const newProp = await Property.create(req.body);
    newProp.owner = req.session.user._id;
    await newProp.save();
    res.redirect("/owners/properties");
  } catch (err) {
    console.log(err.message);
  }
};

const show = async (req, res) => {
  const property = await Property.findById(req.params.id);
  res.render("users/owners/properties/show.ejs", { property });
};

const edit = async (req, res) => {
  const locations = Property.schema.path("location").enumValues;
  const property = await Property.findById(req.params.id);
  res.render("users/owners/properties/edit.ejs", { property, locations });
};

const update = async (req, res) => {
  const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.redirect(`/owners/properties/${property._id}`);
};

const deleteProp = async (req, res) => {
  await Property.findByIdAndDelete(req.params.id);
  res.redirect("/owners/properties");
};

module.exports = { index, newProp, create, show, edit, update, deleteProp };
