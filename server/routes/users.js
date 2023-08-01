const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const authMiddleware = require('../authMiddleware');
const { getUserById } = require('../models/users');
const jwt = require('jsonwebtoken');
const { getUserByEmail, checkPassword } = require('../db');
const { sendVerificationEmail , sendResetPasswordEmail, verifyPasswordResetToken} = require('../lib/lib');

// Generate a password reset token
const crypto = require('crypto');


router.use('/me', authMiddleware);

router.get('/me', async (req, res) => {
  // req.userId now contains the authenticated user's ID

  const user = await getUserById(req.id);

  if (user) {
    // Remove sensitive information (e.g., password) from the user object before returning it
    delete user.password;

    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Route for creating a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate the input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the user already exists
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rowCount > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    const newUser = await db.query(
      'INSERT INTO users (username, email, password_hash, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id, username, email, created_at',
      [username, email, hashedPassword]
    );
      // Generate an email verification token
  const emailVerificationToken = jwt.sign(
    { email },
    process.env.EMAIL_VERIFICATION_SECRET ,
    { expiresIn: '24h' }
  );

  // Send a verification email to the user
  await sendVerificationEmail(email, emailVerificationToken);


    // Return the newly created user
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
});

// Route for user authentication (login)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const passwordIsValid = await checkPassword(password, user.password_hash);
  if (!passwordIsValid) {
    return res.status(400).json({ error: 'Invalid password' });
  }

  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: '1h', // Set the token expiration time as needed
  });

  // Remove sensitive information (e.g., password) from the user object before returning it
  delete user.password;

  res.json({ token, user });
});

router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET );
  
    const email = decoded.email;
    // Update the user's email verification status in the database
    await db.verifyEmail(email);

    res.send('Email successfully verified');
  } catch (error) {
    console.log(error);
    res.status(400).send('Invalid or expired email verification token');
  }
});

// server.js or routes.js
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (user && !user.emailverified) {
      const token = jwt.sign( 
        { email },
       process.env.EMAIL_VERIFICATION_SECRET ,
        { expiresIn: '24h' }
      );
      await sendVerificationEmail(user.email, token);
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  } catch (error) {
    console.error('Error resending verification email:', error);
    res.sendStatus(500);
  }
});

// server.js or routes.js
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (user) {
      const token = jwt.sign(
        { email },
        process.env.SECRET_KEY ,
        { expiresIn: '24h' })
      
      
      await sendResetPasswordEmail(user.email, token);
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.error('Error handling forgot password request:', error);
    res.sendStatus(500);
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  try {
    // 1. Verify the token and get the user's ID
    const userId = await verifyPasswordResetToken(token);

    // 2. Check if the user exists
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 3. Hash the new password
    const newPasswordHash = await bcrypt.hash(password, 10);

    // 4. Update the user's password in the database
    await updateUserPassword(userId, newPasswordHash);

    // 5. Send a success response
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ msg :  error.message });
  }
});



module.exports = router;
