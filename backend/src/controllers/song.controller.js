/**
 * Song Controller
 * ==========================================
 * Handles all song-related operations:
 * - Uploading new songs (artists only)
 * - Retrieving Songs
 * - Updating song metadata
 * - Deleting songs
 * - Tracking plays and downloads
 */

const Song = require('../models/Song.model');

/**
 * Get all songs in the library
 * GET /api/v1/songs
 * Returns: Paginated list of all songs with artist details
 */
exports.getAllSongs = async (req, res, next) => {
  try {
    // Populate artist info and sort by most recent
    const songs = await Song.find()
      .populate('artist', 'name email') // Include artist name and email
      .sort({ createdAt: -1 }); // Newest songs first
    
    res.json({ 
      success: true, 
      count: songs.length, 
      songs 
    });
  } catch (err) { 
    next(err); 
  }
};

/**
 * Get a specific song by ID
 * GET /api/v1/songs/:id
 */
exports.getSongById = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id)
      .populate('artist', 'name email');
    
    if (!song) {
      return res.status(404).json({ 
        success: false, 
        message: 'Song not found' 
      });
    }
    
    res.json({ 
      success: true, 
      song 
    });
  } catch (err) { 
    next(err); 
  }
};

/**
 * Upload a new song (Artists only)
 * POST /api/v1/songs
 * Requires: Multipart form data with file upload
 * Body: { title, description, genre, duration, file }
 */
exports.createSong = async (req, res, next) => {
  try {
    const { title, description, genre, duration, cover } = req.body;
    
    // Validate required file
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Audio file is required' 
      });
    }
    
    // Validate title
    if (!title) {
      return res.status(400).json({ 
        success: false, 
        message: 'Song title is required' 
      });
    }
    
    // Create new song document
    const song = await Song.create({
      title: title.trim(),
      artist: req.user.id, // req.user is set by auth middleware
      description: description || '',
      genre: genre || 'Unknown',
      duration: parseInt(duration) || 0,
      fileUrl: `/uploads/${req.file.filename}`, // Multer provides filename
      coverUrl: cover || '',
    });

    res.status(201).json({ 
      success: true, 
      message: 'Song uploaded successfully', 
      song 
    });
  } catch (err) { 
    next(err); 
  }
};

/**
 * Update song metadata (Artists only - must own the song)
 * PUT /api/v1/songs/:id
 * Body: { title, description, genre, ... }
 */
exports.updateSong = async (req, res, next) => {
  try {
    let song = await Song.findById(req.params.id);
    
    if (!song) {
      return res.status(404).json({ 
        success: false, 
        message: 'Song not found' 
      });
    }
    
    // Check authorization - only artist who uploaded can update
    if (song.artist.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this song' 
      });
    }

    // Update song with new data
    song = await Song.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    res.json({ 
      success: true, 
      message: 'Song updated successfully', 
      song 
    });
  } catch (err) { 
    next(err); 
  }
};

/**
 * Delete song (Artists only - must own the song)
 * DELETE /api/v1/songs/:id
 */
exports.deleteSong = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);
    
    if (!song) {
      return res.status(404).json({ 
        success: false, 
        message: 'Song not found' 
      });
    }
    
    // Check authorization - only artist who uploaded can delete
    if (song.artist.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this song' 
      });
    }
    
    await song.deleteOne();
    
    res.json({ 
      success: true, 
      message: 'Song deleted successfully' 
    });
  } catch (err) { 
    next(err); 
  }
};

/**
 * Increment play count for a song
 * POST /api/v1/songs/:id/play
 * Called when a user plays a song
 */
exports.playSong = async (req, res, next) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { $inc: { plays: 1 } }, // Increment plays by 1
      { new: true } // Return updated document
    );
    
    if (!song) {
      return res.status(404).json({ 
        success: false, 
        message: 'Song not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Play count incremented', 
      plays: song.plays 
    });
  } catch (err) { 
    next(err); 
  }
};

/**
 * Increment download count for a song
 * POST /api/v1/songs/:id/download
 * Called when a user downloads a song
 */
exports.downloadSong = async (req, res, next) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } }, // Increment downloads by 1
      { new: true }
    );
    
    if (!song) {
      return res.status(404).json({ 
        success: false, 
        message: 'Song not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Download recorded', 
      downloads: song.downloads 
    });
  } catch (err) { 
    next(err); 
  }
};

/**
 * Get all songs uploaded by the current artist
 * GET /api/v1/songs/my-songs
 * Requires: Artist role
 */
exports.getArtistSongs = async (req, res, next) => {
  try {
    const songs = await Song.find({ artist: req.user.id })
      .sort({ createdAt: -1 }); // Newest songs first
    
    res.json({ 
      success: true, 
      count: songs.length, 
      songs 
    });
  } catch (err) { 
    next(err); 
  }
};
