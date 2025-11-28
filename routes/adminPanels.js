// routes/adminPanels.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

// CONTROLLERS FOR PANELS
const panelController = require('../controllers/panelController');

// All panel routes must be authenticated
router.use(ensureAuthenticated());
router.use(ensureAdmin());

// PANEL ENDPOINTS (AJAX loaded)
router.get('/dashboard', panelController.dashboardPanel);
router.get('/products', panelController.productsPanel);
router.get('/pos', panelController.posPanel);
router.get('/strategy', panelController.strategyPanel);

module.exports = router;
