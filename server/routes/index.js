const express = require('express');
const router = express.Router();

// Import your route handlers here
// Example: const userRoutes = require('./userRoutes');

// Use your route handlers here
// Example: router.use('/users', userRoutes);
const userRoutes = require('./users');
const chatRoutes = require('./chats');

router.use('/users', userRoutes);
router.use('/chats', chatRoutes);
module.exports = router;
