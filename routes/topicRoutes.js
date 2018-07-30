const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');

// Topics list
router.get('/', topicController.get);

// Add
router.post('/add', topicController.add);

// Update
router.post('/update', topicController.update);
router.post('/editable', topicController.editable);

// Delete
router.get('/delete', topicController.delete);

// For fastSelect HTML
router.get('/html', topicController.html);
router.get('/weightage', topicController.weightage);

module.exports = router;
