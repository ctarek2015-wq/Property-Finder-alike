const Viewing = require("../models/viewing");
const Review = require("../models/review");
const Property = require("../models/property");

const parseMinimum = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : undefined;
};

const parseRangeValue = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : undefined;
};

const home = async (req, res) => {
  try {
    const priceMin = parseRangeValue(req.query.priceMin);
    const priceMax = parseRangeValue(req.query.priceMax);
    const areaMin = parseRangeValue(req.query.areaMin);
    const areaMax = parseRangeValue(req.query.areaMax);
    const bedrooms = parseMinimum(req.query.bedrooms);
    const bathrooms = parseMinimum(req.query.bathrooms);
    const rating = parseMinimum(req.query.rating);
    const locations = Property.schema.path("location").options.enum;
    const location = locations.includes(req.query.location)
      ? req.query.location
      : "";
    const availability = ["available", "unavailable", "all"].includes(
      req.query.availability,
    )
      ? req.query.availability
      : "available";

    const propertyQuery = {};
    if (priceMin !== undefined && priceMin)
      propertyQuery.price = { $gte: priceMin };
    if (priceMax !== undefined && priceMax)
      propertyQuery.price = { ...propertyQuery.price, $lte: priceMax };
    if (areaMin !== undefined && areaMin)
      propertyQuery.area = { $gte: areaMin };
    if (areaMax !== undefined && areaMax)
      propertyQuery.area = { ...propertyQuery.area, $lte: areaMax };
    if (bedrooms !== undefined && bedrooms)
      propertyQuery.bedrooms = { $gte: bedrooms };
    if (bathrooms !== undefined && bathrooms)
      propertyQuery.bathrooms = { $gte: bathrooms };
    if (location) propertyQuery.location = location;
    if (availability !== "all" && availability)
      propertyQuery.available = availability === "available";

    if (rating !== undefined && rating) {
      const ratedProperties = await Review.aggregate([
        {
          $group: {
            _id: "$propertyId",
            averageRating: { $avg: { $toInt: "$rating" } },
          },
        },
        { $match: { averageRating: { $gte: rating } } },
      ]);
      propertyQuery._id = {
        $in: ratedProperties.map((property) => property._id),
      };
    }

    const properties = await Property.find(propertyQuery)
      .populate("owner", "username")
      .populate("availableAppointments");
    let seekerViewings = [];
    let userReviews = [];
    if (req.session.user) {
      seekerViewings = await Viewing.find({
        viewerId: req.session.user._id,
      });
      userReviews = await Review.find({
        reviewerId: req.session.user._id,
      });
    }
    return res.render("index.ejs", {
      properties,
      seekerViewings,
      userReviews,
      locations,
      filters: {
        priceMin: req.query.priceMin || "",
        priceMax: req.query.priceMax || "",
        areaMin: req.query.areaMin || "",
        areaMax: req.query.areaMax || "",
        bedrooms: req.query.bedrooms || "",
        bathrooms: req.query.bathrooms || "",
        location,
        rating: req.query.rating || "",
        availability,
      },
    });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { home };
