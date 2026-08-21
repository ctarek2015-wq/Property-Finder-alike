const Property = require("../models/property");

const addPropToViews = async (req, res, next) => {
  const properties = await Property.find().populate("owner", "username");
  const locations = Property.schema.path("location").enumValues;
  res.locals.locations = locations;
  res.locals.properties = properties;
  next();
};

module.exports = addPropToViews;
