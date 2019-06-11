const express = require('express');
const router = express.Router();
const anchorController = require('../controllers/anchorController');

// Anchors GET AND POST
router.route('/')
	.get(anchorController.get)
	.post(anchorController.post)
	.delete(anchorController.delete);

// Update route for in-line edit
router.post('/editable', anchorController.editable);

// For fastSelect HTML used on video page
router.get('/html', anchorController.html);

module.exports = router;
