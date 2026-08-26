const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendPasswordResetEmail = async (user, code) => {
  await transporter.sendMail({
    from: `PropertySeeker <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Your PropertySeeker password reset code",
    text: `Hello ${user.username},\n\nUse this code to reset your password: ${code}\n\nThis code expires in 15 minutes. If you did not request this, you can ignore this email.\n\nBest regards,\nThe PropertySeeker Team`,
  });
};

module.exports = sendPasswordResetEmail;
