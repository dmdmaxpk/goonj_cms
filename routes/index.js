const express = require('express');
const router = express.Router();

// Default route to /video
router.get('/', (req, res) => res.redirect('/video'));

router.use('/video',    require('./videoRoutes'));
router.use('/category', require('./categoryRoutes'));
router.use('/subcategory', require('./subcategoryRoutes'));
router.use('/program',  require('./programRoutes'));
router.use('/topic',    require('./topicRoutes'));
router.use('/anchor',   require('./anchorRoutes'));
// router.use('/guest',    require('./guestRoutes'));
router.use('/channel',  require('./channelRoutes'));

module.exports = router;