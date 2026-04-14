/**
 * Authentication Controller
 * ==========================================
 * Handles user registration, login, and profile management
 */

const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for authenticated user
 * @param {Object} user - User document from database
 * @returns {String} JWT token with 7-day expiration
 */
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '7d' }
  );

/**
 * Register a new user account
 * POST /api/v1/auth/register
 * Body: { name, email, password, role }
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and password are required' 
      });
    }
    
    // Check if email already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered. Please login or use a different email.' 
      });
    }

    // Hash password using bcryptjs (12 rounds for security)
    const hashed = await bcrypt.hash(password, 12);
    
    // Create new user
    const user = await User.create({ 
      name, 
      email, 
      password: hashed, 
      role: role || 'user' 
    });
    
    // Return success response with token
    res.status(201).json({ 
      success: true, 
      message: 'Account created successfully',
      token: generateToken(user), 
      user: { 
        id: user._id, 
        name, 
        email, 
        role: user.role 
      } 
    });
  } catch (err) { 
    next(err); 
  }
};

/**
 * Login existing user
 * POST /api/v1/auth/login
 * Body: { email, password }
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    
    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Return success response with token
    res.json({ 
      success: true, 
      message: 'Login successful',
      token: generateToken(user), 
      user: { 
        id: user._id, 
        name: user.name, 
        email, 
        role: user.role 
      } 
    });
  } catch (err) { 
    next(err); 
  }
};

/**
 * Get current authenticated user's profile
 * GET /api/v1/auth/me
 * Requires: Valid JWT token
 */
exports.getMe = async (req, res, next) => {
  try {
    // req.user.id is populated by auth middleware
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({ 
      success: true, 
      user 
    });
  } catch (err) { 
    next(err); 
  }
};
