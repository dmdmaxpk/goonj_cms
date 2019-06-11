const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');

router.route('/')
	.get(topicController.get)
	.post(topicController.post)
	.delete(topicController.delete);

// Update route for in-line edit
router.post('/editable', topicController.editable);

// For fastSelect HTML used on video page
router.get('/html', topicController.html);

module.exports = router;
