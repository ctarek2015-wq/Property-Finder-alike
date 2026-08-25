const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendWelcomeEmail = async (user) => {
  await transporter.sendMail({
    from: `PropertySeeker <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Welcome to PropertySeeker!",
    text: `Hello ${user.username},\n\nWelcome to PropertySeeker! We're thrilled to have you on board. Start exploring properties and find your dream home today!\n\nBest regards,\nThe PropertySeeker Team`,
  });
};

module.exports = sendWelcomeEmail;
