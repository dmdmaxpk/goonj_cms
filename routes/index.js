const express = require('express');
const router = express.Router();

router.use('/video',    require('./videoRoutes'));
router.use('/category', require('./categoryRoutes'));
router.use('/program',  require('./programRoutes'));
router.use('/topic',    require('./topicRoutes'));
router.use('/feed',     require('./feedRoutes'));
router.use('/anchor',   require('./anchorRoutes'));
router.use('/guest',    require('./guestRoutes'));
router.use('/channel',  require('./channelRoutes'));
// router.use('/curator',  require('./curatorRoutes'));

module.exports = router;