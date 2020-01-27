const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../passport');
const userController = require('../controllers/user');
const apiController = require('../controllers/api');

const passportJWT = passport.authenticate('jwt', { session: false });
const passportLocal = passport.authenticate('local', { session: false });
const passportGoogle = passport.authenticate('google', { scope: [' https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'] });
const passportGoogleCallBack = passport.authenticate('google', { failureRedirect: '/login' })
const passportFacebook = passport.authenticate('facebook', { scope: ['public_profile', 'email'] });
const passportFacebookCallBack = passport.authenticate('facebook', { failureRedirect: '/login' })
const passportfTwitter = passport.authenticate('twitter', { scope: ['public_profile', 'email'] });
const passportTwitterCallBack = passport.authenticate('twitter', { failureRedirect: '/login' })
const passportGitHub = passport.authenticate('github', { scope: ['user', 'repo'] });
const passportGitHubCallBack = passport.authenticate('github', { failureRedirect: '/login' });
const passportLinkedIn = passport.authenticate('linkedin', { scope: ['r_liteprofile', 'r_emailaddress'] });
const passportLinkedInCallBack = passport.authenticate('linkedin', { failureRedirect: '/login' });

router.route('/signup').post(userController.signup);

router.route('/signin').post(passportLocal, userController.signin);

router.route('/check-user').post(userController.checkUser);

router.route('/reset-password').post(passportLocal, userController.resetPassword);

router.route('/user-profile').get(passportJWT, apiController.get_data);

router.route('/auth/google').get(passportGoogle);

router.route('/auth/google/callback').get(passportGoogleCallBack, userController.signin);

router.route('/auth/facebook').get(passportFacebook);

router.route('/auth/facebook/callback').get(passportFacebookCallBack, userController.signin);

router.route('/auth/facebook').get(passportfTwitter);

router.route('/auth/facebook/callback').get(passportTwitterCallBack, userController.signin);

router.route('/auth/github').get(passportGitHub);

router.route('/auth/github/callback').get(passportGitHubCallBack, userController.signin);

router.route('/auth/linkedin').get(passportLinkedIn);

router.route('/auth/linkedin/callback').get(passportLinkedInCallBack, userController.signin);

module.exports = router;