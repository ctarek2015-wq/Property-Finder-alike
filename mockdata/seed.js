require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const Appointment = require("../models/appointment");
const Property = require("../models/property");
const User = require("../models/users");
const properties = require("./properties");

const MOCK_OWNER_PASSWORD = "MockOwner123!";

async function seedMockData() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required to seed mock data.");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  try {
    const owners = new Map();

    for (const propertyData of properties) {
      let owner = owners.get(propertyData.ownerEmail);
      if (!owner) {
        owner = await User.findOneAndUpdate(
          { email: propertyData.ownerEmail },
          {
            username: propertyData.ownerName,
            email: propertyData.ownerEmail,
            password: bcrypt.hashSync(MOCK_OWNER_PASSWORD, 10),
            role: "owner",
          },
          {
            returnDocument: "after",
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
          },
        );
        owners.set(propertyData.ownerEmail, owner);
      }

      const existingProperty = await Property.findOne({
        title: propertyData.title,
      });
      let appointment;

      if (existingProperty?.availableAppointments) {
        appointment = await Appointment.findByIdAndUpdate(
          existingProperty.availableAppointments,
          {
            dateFrom: new Date("2026-09-01"),
            dateTo: new Date("2026-12-31"),
            time: ["10:00 AM", "2:00 PM", "5:00 PM"],
          },
          { returnDocument: "after", upsert: true, runValidators: true },
        );
      } else {
        appointment = await Appointment.create({
          dateFrom: new Date("2026-09-01"),
          dateTo: new Date("2026-12-31"),
          time: ["10:00 AM", "2:00 PM", "5:00 PM"],
        });
      }

      await Property.findOneAndUpdate(
        { title: propertyData.title },
        {
          ...propertyData,
          mainImagePublicId: propertyData.images[0].publicId,
          owner: owner._id,
          availableAppointments: appointment._id,
        },
        {
          returnDocument: "after",
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        },
      );
    }

    console.log(
      `Seeded ${properties.length} mock properties for ${owners.size} owners.`,
    );
    console.log(
      `Mock owner password for all seeded accounts: ${MOCK_OWNER_PASSWORD}`,
    );
  } finally {
    await mongoose.disconnect();
  }
}

seedMockData().catch((error) => {
  console.error("Mock data seed failed:", error.message);
  process.exitCode = 1;
});
