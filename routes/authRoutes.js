const express = require('express');
const router = express.Router();
const { signup, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { validateSignup, validateLogin } = require('../validators/authValidator');

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.get('/profile', protect, getProfile);

module.exports = router;
