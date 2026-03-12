const express = require('express');
const { uploadVideo, getVideos, deleteVideo, getUploadSignature, saveVideoRecord } = require('../controllers/videoController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.post('/', protect, adminOnly, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), uploadVideo);
router.get('/', protect, getVideos);
router.delete('/:id', protect, adminOnly, deleteVideo);

// New Direct Upload Routes
router.get('/sign', protect, adminOnly, getUploadSignature);
router.post('/record', protect, adminOnly, saveVideoRecord);

module.exports = router;
