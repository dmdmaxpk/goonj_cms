// NOTE: Sub-categories routes commented just in case, can be removed totally in future if not required 
const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController')

// Categories list
router.get('/', subcategoryController.get_cats);

router.get('/drama', subcategoryController.get_drama_cats);

// Subcategories list of a specific cateogory
// router.get('/view/:cat_id', subcategoryController.subcats_of_cat);

// Both these routes can be merged into one
router.post('/add_cat', subcategoryController.add_cat);
// router.post('/add_subcat', subcategoryController.add_subcat);

router.get('/delete', subcategoryController.delete);

// For fastSelect HTML used on video page
router.get('/html_cats', subcategoryController.html_cats);
// router.get('/html_subcats', subcategoryController.html_subcats);

module.exports = router;
