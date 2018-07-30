const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channelController');

// Channels list
router.get('/', channelController.get);

// Add
router.post('/add', channelController.add);

// Update
router.post('/update', channelController.update);
router.post('/editable', channelController.editable);

// Delete
router.get('/delete', channelController.delete);

// For fastSelect HTML
router.get('/html', channelController.html);

module.exports = router;
