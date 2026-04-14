/**
 * Authentication Middleware
 * ==========================================
 * Middleware functions for JWT token verification and role-based authorization
 */

const jwt = require('jsonwebtoken');

/**
 * Protect Route Middleware
 * Verifies JWT token from Authorization header and attaches user info to request
 * 
 * Usage: router.get('/protected-route', protect, controllerFunction)
 * 
 * Expected Authorization header: "Bearer <token>"
 */
exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // Check if authorization header exists and has correct format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'No token provided. Please include Authorization header with "Bearer <token>"' 
    });
  }

  try {
    // Extract token from "Bearer <token>" format
    const token = authHeader.split(' ')[1];
    
    // Verify token signature and expiration
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    // Token is invalid, expired, or signature doesn't match
    const message = err.name === 'TokenExpiredError' 
      ? 'Token has expired. Please login again.' 
      : 'Invalid or tampered token';
    
    return res.status(401).json({ 
      success: false, 
      message 
    });
  }
};

/**
 * Artist Role Middleware
 * Ensures user has 'artist' role
 * Must be used AFTER protect middleware
 * 
 * Usage: router.post('/artist-only', protect, artist, controllerFunction)
 */
exports.artist = (req, res, next) => {
  if (req.user.role !== 'artist') {
    return res.status(403).json({ 
      success: false, 
      message: 'Artist access required. Please create an artist account to access this feature.' 
    });
  }
  next();
};
