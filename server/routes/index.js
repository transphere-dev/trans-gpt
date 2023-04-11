const express = require('express');
const router = express.Router();

// Import your route handlers here
// Example: const userRoutes = require('./userRoutes');

// Use your route handlers here
// Example: router.use('/users', userRoutes);
const userRoutes = require('./users');

router.use('/users', userRoutes);
module.exports = router;
