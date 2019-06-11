// NOTE: Sub-categories routes commented just in case, can be removed totally in future if not required 
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController')

// Categories list
router.get('/', categoryController.get_cats);

// Subcategories list of a specific cateogory
// router.get('/view/:cat_id', categoryController.subcats_of_cat);

// Both these routes can be merged into one
router.post('/add_cat', categoryController.add_cat);
// router.post('/add_subcat', categoryController.add_subcat);

router.get('/delete', categoryController.delete);

// For fastSelect HTML used on video page
router.get('/html_cats', categoryController.html_cats);
// router.get('/html_subcats', categoryController.html_subcats);

module.exports = router;
