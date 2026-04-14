const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { 
  getAllSongs, 
  getSongById, 
  createSong, 
  updateSong, 
  deleteSong, 
  playSong, 
  downloadSong,
  getArtistSongs 
} = require('../controllers/song.controller');
const { protect, artist } = require('../middleware/auth.middleware');

// Multer config
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

/**
 * @swagger
 * /api/v1/songs:
 *   get:
 *     summary: Get all songs
 *     tags: [Songs]
 *     responses:
 *       200:
 *         description: List of songs
 *   post:
 *     summary: Upload new song (Artist only)
 *     tags: [Songs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               genre: { type: string }
 *               duration: { type: number }
 *               file: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Song uploaded
 */
router.route('/').get(getAllSongs).post(protect, artist, upload.single('file'), createSong);

/**
 * @swagger
 * /api/v1/songs/my-songs:
 *   get:
 *     summary: Get artist's songs
 *     tags: [Songs]
 *     responses:
 *       200:
 *         description: Artist's songs
 */
router.get('/my-songs', protect, artist, getArtistSongs);

/**
 * @swagger
 * /api/v1/songs/{id}:
 *   get:
 *     summary: Get song by ID
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 */
router.get('/:id', getSongById);

/**
 * @swagger
 * /api/v1/songs/{id}/play:
 *   post:
 *     summary: Increment play count
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 */
router.post('/:id/play', playSong);

/**
 * @swagger
 * /api/v1/songs/{id}/download:
 *   post:
 *     summary: Download song
 *     tags: [Songs]
 */
router.post('/:id/download', downloadSong);

/**
 * @swagger
 * /api/v1/songs/{id}:
 *   put:
 *     summary: Update song (Artist only)
 *     tags: [Songs]
 *   delete:
 *     summary: Delete song (Artist only)
 *     tags: [Songs]
 */
router.route('/:id').put(protect, artist, updateSong).delete(protect, artist, deleteSong);

module.exports = router;
