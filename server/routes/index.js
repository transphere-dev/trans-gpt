const express = require("express");
const router = express.Router();

// Import your route handlers here
// Example: const userRoutes = require('./userRoutes');

// Use your route handlers here
// Example: router.use('/users', userRoutes);
const userRoutes = require("./users");
const chatRoutes = require("./chats");
const buildRoutes = require("./build");
const translateRoutes = require("./translate");
// const extractRoutes = require('./extract');
const comicsRoute = require("./comics");

router.use("/users", userRoutes);
router.use("/chats", chatRoutes);
router.use("/app", buildRoutes);
router.use("/translate", translateRoutes);
// router.use('/extract', extractRoutes);
router.use("/comics", comicsRoute);
module.exports = router;
