// mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // Replace with your email service's SMTP host
  port: process.env.EMAIL_PORT, // Replace with your email service's SMTP port
  secure: false, // Set to true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_FROM, // Your email service's username
    pass: process.env.EMAIL_PASSWORD, // Your email service's password
  },
  tls: {
    rejectUnauthorized: false,
  },
});
module.exports = transporter;
