const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const authMiddleware = require('../authMiddleware');
const { getUserById } = require('../models/users');
const jwt = require('jsonwebtoken');
const { getUserByEmail, checkPassword } = require('../db');
const SECRET_KEY = 'your-secret-key'; // Replace this with your actual secret key


router.use('/me', authMiddleware);

router.get('/me', async (req, res) => {
  // req.userId now contains the authenticated user's ID
  console.log(req)
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

  const passwordIsValid = await checkPassword(password, user.password);
  if (!passwordIsValid) {
    return res.status(400).json({ error: 'Invalid password' });
  }

  const token = jwt.sign({ id: user.id }, SECRET_KEY, {
    expiresIn: '1h', // Set the token expiration time as needed
  });

  // Remove sensitive information (e.g., password) from the user object before returning it
  delete user.password;

  res.json({ token, user });
});

module.exports = router;
