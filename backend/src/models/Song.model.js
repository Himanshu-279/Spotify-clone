/**
 * Song Model
 * ==========================================
 * Defines the schema for audio tracks/songs
 * Tracks metadata, file paths, and engagement metrics (plays/downloads)
 */

const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  // Song title
  title: { 
    type: String, 
    required: [true, 'Song title is required'],
    trim: true,
    minlength: [1, 'Title cannot be empty'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  // Reference to the artist (User with 'artist' role)
  artist: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Artist reference is required']
  },
  
  // Optional song description or lyrics
  description: { 
    type: String, 
    default: '',
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Music genre for categorization
  genre: { 
    type: String, 
    default: 'Unknown',
    enum: {
      values: ['Unknown', 'Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'Country', 'R&B', 'Indie', 'Other'],
      message: 'Genre must be from predefined list'
    }
  },
  
  // Track duration in seconds
  duration: { 
    type: Number, 
    default: 0,
    min: [0, 'Duration cannot be negative']
  },
  
  // Path to the uploaded audio file
  // Format: /uploads/{filename}
  fileUrl: { 
    type: String, 
    required: [true, 'Audio file URL is required']
  },
  
  // URL to cover art/thumbnail image (optional)
  coverUrl: { 
    type: String, 
    default: ''
  },
  
  // Number of times the song has been played
  plays: { 
    type: Number, 
    default: 0,
    min: 0
  },
  
  // Number of times the song has been downloaded
  downloads: { 
    type: Number, 
    default: 0,
    min: 0
  },
}, { 
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Index for frequently queried fields for better performance
songSchema.index({ artist: 1, createdAt: -1 });
songSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Song', songSchema);
