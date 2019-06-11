const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channelController');

// Channels GET, POST and PUT
router.route('/')
	.get(channelController.get)
	.post(channelController.post)
	.put(channelController.put)
	.delete(channelController.delete);

// Update route for in-line edit
router.post('/editable', channelController.editable);

// For fastSelect HTML used on video page
router.get('/html', channelController.html);

module.exports = router;
