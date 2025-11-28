// config/db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

const {
  DB_HOST = '127.0.0.1',
  DB_PORT = 3306,
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'ecomm_pos',
  DB_CONNECTION_LIMIT = 10
} = process.env;

/**
 * Create and export a MySQL pool using mysql2/promise.
 * All queries in the project MUST use this pool and prepared statements.
 */
const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(DB_CONNECTION_LIMIT),
  queueLimit: 0,
  // recommended timezone handling
  timezone: '+00:00',
  decimalNumbers: true
});

module.exports = pool;
