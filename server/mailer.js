// mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.transphere.com', // Replace with your email service's SMTP host
  port: 587, // Replace with your email service's SMTP port
  secure: false, // Set to true for port 465, false for other ports
  auth: {
    user: "noreply@transphere.com", // Your email service's username
    pass: "dA3,wM62dn", // Your email service's password
  },
  tls: {
    rejectUnauthorized: false,
  },
});
console.log(process.env.EMAIL_USER);
module.exports = transporter;
