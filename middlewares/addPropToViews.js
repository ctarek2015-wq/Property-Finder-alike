const Property = require("../models/property");
const Appointment = require("../models/appointment");

const addPropToViews = async (req, res, next) => {
  const properties = await Property.find().populate("owner", "username");
  const locations = Property.schema.path("location").options.enum;
  const timeSlots = await Appointment.schema.path("time").options.enum;
  console.log(locations);
  res.locals.locations = locations;
  res.locals.timeSlots = timeSlots;
  res.locals.properties = properties;
  next();
};

module.exports = addPropToViews;
