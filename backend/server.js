/**
 * ============================================
 * SPOTIFY CLONE - BACKEND SERVER
 * ============================================
 * Main application entry point
 * Initializes Express server, middleware, routes, and database connection
 * 
 * Author: Himanshu Verma
 * Year: 3rd Year B.Tech Student Project
 * ============================================
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
require('dotenv').config();

const app = express();

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON request bodies
app.use('/uploads', express.static('uploads')); // Serve uploaded audio files as static assets

// ============================================
// API DOCUMENTATION
// ============================================
// Swagger UI documentation will be available at /api/v1/docs
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ============================================
// ROUTES
// ============================================
app.use('/api/v1/auth', require('./src/routes/auth.routes'));
app.use('/api/v1/songs', require('./src/routes/song.routes'));

// Health check endpoint
app.get('/', (req, res) => 
  res.json({ 
    success: true, 
    message: 'Spotify Clone API v1.0 - Running',
    documentation: 'Visit /api/v1/docs for API documentation'
  })
);

// ============================================
// GLOBAL ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Internal Server Error' 
  });
});

// ============================================
// DATABASE & SERVER INITIALIZATION
// ============================================
const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✓ MongoDB connected successfully');
    app.listen(PORT, () => 
      console.log(`✓ Server running on http://localhost:${PORT}`)
    );
  })
  .catch(err => {
    console.error('✗ MongoDB connection failed:', err.message);
    process.exit(1);
  });
