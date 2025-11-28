// services/authService.js
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

/**
 * Attempt login.
 * Returns { success: true, user } or { success: false, message }.
 */
async function login(username, password) {
  const user = await userModel.findByUsername(username);
  if (!user) {
    return { success: false, message: 'Invalid username or password.' };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return { success: false, message: 'Invalid username or password.' };
  }

  // Remove hashed password before storing in session
  const sessionUser = {
    id: user.id,
    username: user.username,
    role: user.role
  };

  return { success: true, user: sessionUser };
}

/**
 * Logout handler simply destroys session externally.
 */
function logout(req) {
  return new Promise((resolve, reject) => {
    req.session.destroy(err => {
      if (err) reject(err);
      else resolve();
    });
  });
}

module.exports = {
  login,
  logout
};
