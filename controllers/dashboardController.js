// controllers/dashboardController.js

async function showDashboard(req, res, next) {
  try {
    // Load the main admin layout (sidebar + header + script)
    return res.render('admin/layout', {
      title: "Admin Dashboard",
      user: req.session.user
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  showDashboard
};
