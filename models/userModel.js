// models/userModel.js
const pool = require('../config/db');

/**
 * Find user by username
 */
async function findByUsername(username) {
  const sql = `SELECT * FROM users WHERE username = ? LIMIT 1`;
  const [rows] = await pool.query(sql, [username]);
  return rows[0] || null;
}

/**
 * Find user by ID
 */
async function findById(id) {
  const sql = `SELECT * FROM users WHERE id = ? LIMIT 1`;
  const [rows] = await pool.query(sql, [id]);
  return rows[0] || null;
}

/**
 * Create a new user (admin or staff)
 */
async function createUser({ username, hashedPassword, role }) {
  const sql = `
    INSERT INTO users (username, password, role)
    VALUES (?, ?, ?)
  `;
  const [result] = await pool.query(sql, [
    username,
    hashedPassword,
    role || 'staff'
  ]);

  return result.insertId;
}

module.exports = {
  findByUsername,
  findById,
  createUser
};
