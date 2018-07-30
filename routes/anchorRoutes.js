const express = require('express');
const router = express.Router();
const anchorController = require('../controllers/anchorController');

// Anchors list
router.get('/', anchorController.get);

// Add
router.post('/add', anchorController.add);

// Update
router.post('/update', anchorController.update);
router.post('/editable', anchorController.editable);

// Delete
router.get('/delete', anchorController.delete);

// For fastSelect HTML
router.get('/html', anchorController.html);
router.get('/weightage', anchorController.weightage);

module.exports = router;
