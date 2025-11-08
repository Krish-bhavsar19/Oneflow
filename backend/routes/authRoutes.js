const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { 
  signup, 
  login, 
  getProfile, 
  verifyEmail, 
  resendOTP,
  googleCallback 
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { validateSignup, validateLogin } = require('../validators/authValidator');

// Local auth
router.post('/signup', validateSignup, signup);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOTP);
router.post('/login', validateLogin, login);
router.get('/profile', protect, getProfile);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);

module.exports = router;
