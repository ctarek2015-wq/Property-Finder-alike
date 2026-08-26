const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendAppointmentNotification = async ({
  owner,
  seeker,
  property,
  viewing,
}) => {
  await transporter.sendMail({
    from: `PropertySeeker <${process.env.EMAIL_USER}>`,
    to: owner.email,
    subject: `New viewing booked for ${property.title}`,
    text: `Hello ${owner.username},\n\n${seeker.username} booked a viewing for "${property.title}" on ${viewing.appointmentDate.toDateString()} at ${viewing.appointmentTime}.\n\nBest regards,\nThe PropertySeeker Team`,
  });
};

module.exports = sendAppointmentNotification;
