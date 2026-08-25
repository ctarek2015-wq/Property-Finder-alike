const Property = require("../models/property");
const Appointment = require("../models/appointment");
const Viewing = require("../models/viewing");
const Review = require("../models/review");
const cloudinary = require("../config/cloudinary");

const uploadImage = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "properties", resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        if (!result?.secure_url || !result?.public_id) {
          return reject(
            new Error("Cloudinary returned incomplete image data."),
          );
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    stream.end(file.buffer);
  });

const deleteImage = (publicId) =>
  publicId ? cloudinary.uploader.destroy(publicId) : Promise.resolve();

const deleteImages = async (images) => {
  await Promise.all(images.map((image) => deleteImage(image.publicId)));
};

const propertyFields = [
  "title",
  "description",
  "listingType",
  "price",
  "location",
  "area",
  "bedrooms",
  "bathrooms",
  "available",
];

const appointmentFields = ["dateFrom", "dateTo", "time"];

const pickFields = (body, fields) =>
  fields.reduce((values, field) => {
    if (body[field] !== undefined) values[field] = body[field];
    return values;
  }, {});

const renderPropertyFormError = async (
  res,
  view,
  error,
  oldInput,
  property,
) => {
  return res.render(view, {
    errors: [error.message || "Unable to save property."],
    oldInput,
    property,
  });
};

const index = async (req, res) => {
  res.render("users/properties/index.ejs");
};

const newProp = async (req, res) => {
  res.render("users/properties/new.ejs", { oldInput: {}, errors: [] });
};

const create = async (req, res) => {
  let uploadedImages = [];
  let createdAppointment;
  try {
    const oldInput = req.body;
    if (req.validationErrors) {
      return res.render("users/properties/new.ejs", {
        errors: req.validationErrors,
        oldInput,
      });
    }

    uploadedImages = await Promise.all((req.files || []).map(uploadImage));
    createdAppointment = await Appointment.create(
      pickFields(req.body, appointmentFields),
    );
    await Property.create({
      ...pickFields(req.body, propertyFields),
      images: uploadedImages,
      owner: req.session.user._id,
      availableAppointments: createdAppointment._id,
    });
    res.redirect("/properties");
  } catch (err) {
    await deleteImages(uploadedImages).catch(() => {});
    if (createdAppointment) {
      await Appointment.findByIdAndDelete(createdAppointment._id).catch(
        () => {},
      );
    }
    return renderPropertyFormError(
      res,
      "users/properties/new.ejs",
      err,
      req.body,
    );
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
  res.render("users/properties/edit.ejs", {
    property,
    errors: [],
    oldInput: {},
  });
};

const update = async (req, res) => {
  let uploadedImages = [];
  let propertySaved = false;
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

    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).send("Property not found.");
    if (property.owner.toString() !== req.session.user._id.toString()) {
      return res.status(403).send("You are not allowed to edit this property.");
    }

    const currentImages = Array.isArray(property.images) ? property.images : [];
    const removeImages =
      req.body.removeImages === undefined
        ? []
        : Array.isArray(req.body.removeImages)
          ? req.body.removeImages
          : [req.body.removeImages];
    const removedImages = currentImages.filter((image) =>
      removeImages.includes(image.publicId),
    );
    const retainedImages = currentImages.filter(
      (image) => !removeImages.includes(image.publicId),
    );
    uploadedImages = await Promise.all((req.files || []).map(uploadImage));
    const nextImages = [...retainedImages, ...uploadedImages];
    if (nextImages.length > 10) {
      await deleteImages(uploadedImages);
      return renderPropertyFormError(
        res,
        "users/properties/edit.ejs",
        new Error("A property can have at most 10 images."),
        oldInput,
        property,
      );
    }

    await Property.findByIdAndUpdate(
      req.params.id,
      {
        ...pickFields(req.body, propertyFields),
        images: nextImages,
      },
      { runValidators: true },
    );
    propertySaved = true;
    await Appointment.findByIdAndUpdate(
      property.availableAppointments,
      pickFields(req.body, appointmentFields),
      { runValidators: true },
    );
    await deleteImages(removedImages);
    res.redirect(`/properties/${property._id}`);
  } catch (err) {
    if (!propertySaved) await deleteImages(uploadedImages).catch(() => {});
    const property = await Property.findById(req.params.id)
      .populate("availableAppointments")
      .catch(() => null);
    return renderPropertyFormError(
      res,
      "users/properties/edit.ejs",
      err,
      req.body,
      property,
    );
  }
};

const deleteProp = async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).send("Property not found.");
  if (property.owner.toString() !== req.session.user._id.toString()) {
    return res.status(403).send("You are not allowed to delete this property.");
  }
  await deleteImages(Array.isArray(property.images) ? property.images : []);
  await Appointment.findByIdAndDelete(property.availableAppointments);
  await Property.findByIdAndDelete(req.params.id);
  res.redirect("/properties");
};

module.exports = { index, newProp, create, show, edit, update, deleteProp };
