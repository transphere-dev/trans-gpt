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

const sendResetPasswordEmail = async (email, token) => {
  try {
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset',
      text: `To reset your password, please click the following link: ${resetLink}`,
      html: `<p>To reset your password, please click the following link: <a href="${resetLink}">${resetLink}</a></p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to', email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};

function verifyPasswordResetToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY, { subject: 'password-reset' });
    return decoded.id;
  } catch (error) {
    console.error('Error verifying password reset token:', error);
    throw new Error('Invalid or expired token');
  }
}


module.exports = {
    sendVerificationEmail ,sendResetPasswordEmail,verifyPasswordResetToken
  };