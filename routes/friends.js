const express =require('express');

const router = express.Router();
const passport = require('passport');
const friendController = require('../controllers/friends_controller');

router.get('/send/:userId', passport.checkAuthentication, friendController.sendRequest);
router.get('/accept/:friendId', passport.checkAuthentication, friendController.acceptRequest);
router.get('/withdraw/:friendId', passport.checkAuthentication, friendController.withdrawRequest);
router.get('/reject/:friendId', passport.checkAuthentication, friendController.rejectRequest);
router.get('/remove/:friendId', passport.checkAuthentication, friendController.removeFriend);


module.exports = router;