
// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes');
const glossariesRoutes = require('./routes/glossaries');


// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS for all origins
app.use(cors());

// API routes
app.use('/api', routes);
app.use('/glossaries', glossariesRoutes);

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

