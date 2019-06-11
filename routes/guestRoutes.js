// NOTE: Guests are removed from app after revamp, can be used in future if required.
const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController')

// Guests list
router.get('/', guestController.get);

// Add
router.post('/add', guestController.add);

// Update
router.post('/update', guestController.update);
router.post('/editable', guestController.editable);

// Delete
router.get('/delete', guestController.delete);

// For fastSelect HTML
router.get('/html', guestController.html);
router.get('/weightage', guestController.weightage);

module.exports = router;
