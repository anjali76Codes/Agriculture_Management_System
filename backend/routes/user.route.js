const express = require('express');
const { signup, signin, getProfile, updateProfile, updatePassword } = require('../controllers/user.controller');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile); // Add route for updating profile
router.put('/update-password', authMiddleware, updatePassword); // Add route for updating password

module.exports = router;
