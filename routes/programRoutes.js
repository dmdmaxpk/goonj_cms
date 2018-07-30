const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');

// Programs list
router.get('/', programController.get);

// Add
router.post('/add', programController.add);

// Update
router.post('/editable', programController.editable);

// Delete
router.get('/delete', programController.delete);

// For fastSelect HTML
router.get('/html', programController.html);

module.exports = router;
