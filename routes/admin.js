// routes/admin.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

router.get('/', ensureAuthenticated(), ensureAdmin(), (req, res) => {
  res.render('admin/layout', {
    title: "Admin",
    user: req.session.user
  });
});

module.exports = router;

