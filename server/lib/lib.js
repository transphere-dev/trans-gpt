const jwt = require('jsonwebtoken');
const transporter = require('../mailer');

// Define a function for sending the email
async function sendVerificationEmail(email, token) {
  // Implement your email sending logic here
  // You can use nodemailer or any other email sending library

  const verificationLink = `http://localhost:3000/verify/${token}`;
  // Send the verification link to the user's email
  const mailOptions = {
    from: process.env.EMAIL_FROM, // The email address the verification email is sent from
    to: email, // The user's email address
    subject: 'Email Verification',
    text: `Please click the following link to verify your email: ${verificationLink}`,
    html: `<p>Please click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent');
  } catch (error) {
    console.log('Error sending email:', error);
  }
}
module.exports = {
    sendVerificationEmail
  };