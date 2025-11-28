// controllers/panelController.js

async function dashboardPanel(req, res) {
  return res.render('admin/panels/dashboard', {
    session: req.session,
    user: req.session.user
  });
}

async function productsPanel(req, res) {
  return res.send(`<div style="padding:20px;">Products panel coming soon...</div>`);
}

async function posPanel(req, res) {
  return res.send(`<div style="padding:20px;">POS panel coming soon...</div>`);
}

async function strategyPanel(req, res) {
  return res.send(`<div style="padding:20px;">Strategy panel coming soon...</div>`);
}

module.exports = {
  dashboardPanel,
  productsPanel,
  posPanel,
  strategyPanel
};
