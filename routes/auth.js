// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login pages
router.get('/login', authController.showLoginPage);
router.post('/login', authController.handleLogin);

// Logout
router.post('/logout', authController.handleLogout);

module.exports = router;
