const User = require("../models/users");
const Property = require("../models/property");

const index = async (req, res) => {
  const properties = await Property.find({ owner: req.session.user._id });
  res.render("users/owners/properties/index.ejs", { properties });
};

const newProp = async (req, res) => {
  res.render("users/owners/properties/new.ejs");
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

const show = async (req, res) => {};

const edit = async (req, res) => {};

const update = async (req, res) => {};

const deleteProp = async (req, res) => {};

module.exports = { index, newProp, create, show, edit, update, deleteProp };
