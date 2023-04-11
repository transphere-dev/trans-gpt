const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes');

// Load environment variables
require('dotenv').config();

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS for all origins
app.use(cors());

// API routes
app.use('/api', routes);

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

