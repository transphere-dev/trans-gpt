
// Load environment variables
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

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
app.listen(process.env.NEXT_PUBLIC_PORT, () => {
  console.log(`Server is running on port ${process.env.NEXT_PUBLIC_PORT}`);
});

