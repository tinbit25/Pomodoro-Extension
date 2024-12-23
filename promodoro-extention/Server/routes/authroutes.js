const express = require('express');
const router = express.Router();
const { signup, verifyEmail, login, logout, forgotPassword, resetPassword } = require('../controllers/authController');

const {isAuthenticated}=require('../middleware/verifyToken')
// Auth routes

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword); 
router.post('/reset-password/:token', resetPassword); 

module.exports = router;