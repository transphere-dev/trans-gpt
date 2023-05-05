// path/to/userModel.js
const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@192.168.4.62:5432/transgpt-db";
const pool = new Pool({ connectionString });

async function getUserById(userId) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

    if (result.rowCount > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}

module.exports = { getUserById };
