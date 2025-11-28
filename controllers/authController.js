// controllers/authController.js
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const authService = require('../services/authService');

/**
 * Show login page.
 * Additionally: if the default admin (admin@example.com) doesn't exist,
 * create it automatically with password '12345' and role 'admin'.
 */
async function showLoginPage(req, res, next) {
  try {
    // Auto-create default admin if not present (convenience for initial setup)
    const defaultAdminEmail = 'admin@example.com';
    const defaultAdminPassword = '12345';
    let admin = await userModel.findByUsername(defaultAdminEmail);
    if (!admin) {
      const hashed = await bcrypt.hash(defaultAdminPassword, 10);
      await userModel.createUser({
        username: defaultAdminEmail,
        hashedPassword: hashed,
        role: 'admin'
      });
      // Optional: update local variable so we can show notice
      admin = await userModel.findByUsername(defaultAdminEmail);
      // we won't reveal the password in the UI, just a gentle notice
      res.locals._defaultAdminCreated = true;
    }

    // Render login page (any message passed via query or locals)
    return res.render('auth/login', {
      session: req.session,
      message: req.query.msg || null,
      error: null,
      username: ''
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * Handle login form POST
 */
async function handleLogin(req, res, next) {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).render('auth/login', {
        session: req.session,
        message: null,
        error: 'Please provide username and password.',
        username: username || ''
      });
    }

    const result = await authService.login(username, password);
    if (!result.success) {
      return res.status(401).render('auth/login', {
        session: req.session,
        message: null,
        error: result.message || 'Invalid credentials.',
        username
      });
    }

    // success — set session and redirect to admin dashboard
    req.session.user = result.user;
    // optional: regenerate session id on login for security
    req.session.save(err => {
      if (err) {
        // non-fatal: log and continue
        console.error('Session save error after login:', err);
      }
      return res.redirect('/admin');

    });
  } catch (err) {
    return next(err);
  }
}

/**
 * Handle logout (POST /logout)
 */
async function handleLogout(req, res, next) {
  try {
    await authService.logout(req);
    // after logout, redirect to login
    if (req.accepts('html')) {
      return res.redirect('/login');
    }
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  showLoginPage,
  handleLogin,
  handleLogout
};
