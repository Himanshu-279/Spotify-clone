/**
 * User Model
 * ==========================================
 * Defines the schema for user authentication and profile management
 * Supports two roles: 'user' (listener) and 'artist' (content creator)
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // User's full name
  name: { 
    type: String, 
    required: [true, 'Name is required'], 
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  
  // Unique email address used for authentication
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true, 
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  
  // Hashed password (should be hashed using bcryptjs before saving)
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries by default
  },
  
  // User role determines permissions
  // 'user': Can listen, download, and manage library
  // 'artist': Can upload, edit, and delete songs
  role: { 
    type: String, 
    enum: {
      values: ['user', 'artist'],
      message: 'Role must be either "user" or "artist"'
    },
    default: 'user' 
  },
}, { 
  timestamps: true // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);
