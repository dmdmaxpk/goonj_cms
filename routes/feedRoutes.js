const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');


// router.get('/', feedController.get);
// // router.get('/view or /:id', videoController.get);

// router.post('/add', tagController.post);

// router.get('/delete', tagController.delete);

router.get('/html', feedController.html);

module.exports = router;
