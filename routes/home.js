const express =require('express');
const homeController = require('../controllers/home_controller')
const router = express.Router();
const passport = require('passport');



router.get('/',homeController.home);
router.get('/friend', homeController.homeFriend);
router.get('/request', passport.checkAuthentication, homeController.homeReceived);
router.get('/sent', passport.checkAuthentication, homeController.homeSent);


module.exports = router;