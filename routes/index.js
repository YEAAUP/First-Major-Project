const express = require('express');

const router = express.Router();

console.log("Router loaded");

const homeController = require('../controllers/home_controller');

router.use('/', require('./home'));
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/likes', require('./likes'));
router.use('/friend',require('./friends'));

router.use('/api',require('./api'));

module.exports = router;