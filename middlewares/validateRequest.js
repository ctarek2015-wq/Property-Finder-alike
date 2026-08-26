const mongoose = require("mongoose");

const isBlank = (value) =>
  value === undefined || value === null || String(value).trim() === "";

const addRequiredErrors = (body, fields, errors) => {
  for (const field of fields) {
    if (isBlank(body[field])) {
      errors.push(`Missing required field: ${field}`);
    }
  }
};

const addNumberErrors = (body, fields, errors) => {
  for (const field of fields) {
    if (isBlank(body[field])) continue;

    const value = Number(body[field]);
    if (!Number.isFinite(value)) {
      errors.push(`Invalid ${field}: must be a number.`);
    } else if (value < 0) {
      errors.push(`Invalid ${field}: cannot be negative.`);
    }
  }
};

const addEnumError = (body, field, allowedValues, errors) => {
  if (!isBlank(body[field]) && !allowedValues.includes(body[field])) {
    errors.push(`Invalid ${field}.`);
  }
};

const addDateErrors = (body, fields, errors) => {
  for (const field of fields) {
    if (isBlank(body[field])) continue;

    const date = new Date(body[field]);
    if (Number.isNaN(date.getTime())) {
      errors.push(`Invalid ${field}: must be a valid date.`);
    }
  }
};

const addDateRangeErrors = (body, startField, endField, errors) => {
  if (isBlank(body[startField]) || isBlank(body[endField])) return;

  const start = new Date(body[startField]);
  const end = new Date(body[endField]);
  if (
    !Number.isNaN(start.getTime()) &&
    !Number.isNaN(end.getTime()) &&
    end < start
  ) {
    errors.push(`Invalid ${endField}: cannot be before ${startField}.`);
  }
};

const addIdError = (value, field, errors) => {
  if (!mongoose.isValidObjectId(value)) {
    errors.push(`Invalid ${field}.`);
  }
};

const validateProperty = (req, res, next) => {
  const errors = [];
  const body = req.body;

  if (req.uploadError) errors.push(req.uploadError);

  addRequiredErrors(
    body,
    [
      "title",
      "description",
      "listingType",
      "price",
      "location",
      "area",
      "bedrooms",
      "bathrooms",
      "dateFrom",
      "dateTo",
    ],
    errors,
  );
  addNumberErrors(body, ["price", "area", "bedrooms", "bathrooms"], errors);
  addEnumError(body, "listingType", ["sale", "rent"], errors);
  addEnumError(
    body,
    "location",
    [
      "manama",
      "al hidd",
      "muharraq",
      "rifaa",
      "jidd hafs",
      "hamad town",
      "isa town",
      "hawar islands",
      "sitra",
    ],
    errors,
  );
  addDateErrors(body, ["dateFrom", "dateTo"], errors);
  addDateRangeErrors(body, "dateFrom", "dateTo", errors);
  if (!isBlank(body.dateFrom)) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(body.dateFrom);
    if (!Number.isNaN(startDate.getTime()) && startDate < today) {
      errors.push("Invalid dateFrom: cannot be in the past.");
    }
  }

  if (!isBlank(body.title) && String(body.title).trim().length > 100) {
    errors.push("Invalid title: maximum length is 100 characters.");
  }
  if (
    !isBlank(body.description) &&
    String(body.description).trim().length > 500
  ) {
    errors.push("Invalid description: maximum length is 500 characters.");
  }

  if (req.method === "POST" && (!req.files || req.files.length === 0)) {
    // Require images for new properties
    errors.push("At least one image is required.");
  }

  const removeImages =
    body.removeImages === undefined
      ? []
      : Array.isArray(body.removeImages)
        ? body.removeImages
        : [body.removeImages];
  if (removeImages.some((publicId) => isBlank(publicId))) {
    errors.push("Invalid image removal selection.");
  }

  if (errors.length > 0) {
    req.validationErrors = errors;
  }

  // Normalize accepted input
  if (!isBlank(body.title)) req.body.title = String(body.title).trim();
  if (!isBlank(body.description))
    req.body.description = String(body.description).trim();
  ["price", "area", "bedrooms", "bathrooms"].forEach((field) => {
    if (!isBlank(body[field])) req.body[field] = Number(body[field]);
  });
  next();
};

const validateId =
  (field, source = "params") =>
  (req, res, next) => {
    const value = req[source][field];
    if (!mongoose.isValidObjectId(value)) {
      return res.status(400).send(`Invalid ${field}.`);
    }
    next();
  };

const collectErrors = (req, errors) => {
  if (errors.length > 0) req.validationErrors = errors;
};

const validateRegister = (req, res, next) => {
  const errors = [];
  const body = req.body;
  addRequiredErrors(
    body,
    ["username", "email", "password", "confirmPassword", "role"],
    errors,
  );
  addEnumError(body, "role", ["owner", "seeker"], errors);

  if (
    !isBlank(body.email) &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email).trim())
  ) {
    errors.push("Invalid email.");
  }
  if (!isBlank(body.username) && String(body.username).trim().length < 2) {
    errors.push("Invalid username: minimum length is 2 characters.");
  }
  if (!isBlank(body.password) && String(body.password).length < 8) {
    errors.push("Invalid password: minimum length is 8 characters.");
  }
  if (!isBlank(body.password) && body.password !== body.confirmPassword) {
    errors.push("Passwords do not match.");
  }

  collectErrors(req, errors);
  body.username = isBlank(body.username)
    ? body.username
    : String(body.username).trim();
  body.email = isBlank(body.email)
    ? body.email
    : String(body.email).trim().toLowerCase();
  next();
};

const validateLogin = (req, res, next) => {
  const errors = [];
  addRequiredErrors(req.body, ["email", "password", "role"], errors);
  addEnumError(req.body, "role", ["owner", "seeker"], errors);
  if (
    !isBlank(req.body.email) &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(req.body.email).trim())
  ) {
    errors.push("Invalid credentials.");
  }
  collectErrors(req, errors);
  if (!isBlank(req.body.email))
    req.body.email = String(req.body.email).trim().toLowerCase();
  next();
};

const validateAppointment = (req, res, next) => {
  const errors = [];
  addRequiredErrors(req.body, ["appointmentDate", "appointmentTime"], errors);
  addDateErrors(req.body, ["appointmentDate"], errors);
  addEnumError(
    req.body,
    "appointmentTime",
    [
      "8:00 AM",
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
      "6:00 PM",
      "7:00 PM",
      "8:00 PM",
    ],
    errors,
  );
  if (!mongoose.isValidObjectId(req.query.propertyId))
    errors.push("Invalid propertyId.");
  collectErrors(req, errors);
  next();
};

const validateReview = (req, res, next) => {
  const errors = [];
  addRequiredErrors(req.body, ["rating"], errors);
  addEnumError(req.body, "rating", ["1", "2", "3", "4", "5"], errors);
  if (
    !isBlank(req.body.comment) &&
    String(req.body.comment).trim().length > 500
  ) {
    errors.push("Invalid comment: maximum length is 500 characters.");
  }
  if (
    !mongoose.isValidObjectId(req.query.propertyId) &&
    req.method === "POST"
  ) {
    errors.push("Invalid propertyId.");
  }
  collectErrors(req, errors);
  next();
};

module.exports = {
  validateProperty,
  validateId,
  validateRegister,
  validateLogin,
  validateAppointment,
  validateReview,
};
