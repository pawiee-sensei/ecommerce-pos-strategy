// models/productModel.js
const pool = require('../config/db');

/**
 * Get products with optional search, category filter, pagination
 */
async function getProducts({ search = "", category = "", limit = 10, offset = 0 }) {
  let sql = `
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE 1
  `;
  const params = [];

  if (search) {
    sql += ` AND (p.name LIKE ? OR p.sku LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  if (category) {
    sql += ` AND p.category_id = ?`;
    params.push(category);
  }

  sql += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));

  const [rows] = await pool.query(sql, params);
  return rows;
}

/** Count products (for pagination) */
async function countProducts({ search = "", category = "" }) {
  let sql = `SELECT COUNT(*) AS total FROM products WHERE 1`;
  const params = [];

  if (search) {
    sql += ` AND (name LIKE ? OR sku LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  if (category) {
    sql += ` AND category_id = ?`;
    params.push(category);
  }

  const [rows] = await pool.query(sql, params);
  return rows[0].total;
}

/** Get full product details for modal */
async function getProductById(id) {
  const sql = `
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.id = ?
    LIMIT 1
  `;
  const [rows] = await pool.query(sql, [id]);
  return rows[0] || null;
}

module.exports = {
  getProducts,
  countProducts,
  getProductById
};
