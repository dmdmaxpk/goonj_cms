const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController')

// Videos List
router.get('/', videoController.getAllVideos);

// Add
router.route('/add')
    .get(videoController.videoAddScreen)
    .post(videoController.postVideo);

// View
router.get('/view/:_id', videoController.view);

// Edit
router.route('/edit/:_id')
    .get(videoController.editView)
    .post(videoController.editPost);

// Delete
router.get('/delete', videoController.delete);

// Pinned Videos Page
router.get('/pinned', videoController.pinned);

// Retranscode Route
router.post('/retranscode', videoController.retranscode);

// For video file and thumb uploads
router.post('/uploadvideofile', videoController.uploadVideoFile);
router.post('/uploadthumbnail', videoController.uploadThumbnail);

module.exports = router;
