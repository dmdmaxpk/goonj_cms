const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');

// PROGRAM GET, POST and PUT
router.route('/')
	.get(programController.get)
	.post(programController.post)
	.delete(programController.delete);

// Update route for in-line edit
router.post('/editable', programController.editable);

// For fastSelect HTML used on video page
router.get('/html', programController.html);

module.exports = router;
