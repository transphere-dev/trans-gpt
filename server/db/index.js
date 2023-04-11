const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/transgpt-db";
const bcrypt = require('bcrypt');

const pool = new Pool({ connectionString });

async function getUserByEmail(email) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rowCount > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

async function checkPassword(plaintextPassword, hashedPassword) {
  if (!plaintextPassword || !hashedPassword) {
    console.error('Error checking password: data and hash arguments required');
    return false;
  }

  try {
    return await bcrypt.compare(plaintextPassword, hashedPassword);
  } catch (error) {
    console.error('Error checking password:', error);
    return false;
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),getUserByEmail,checkPassword
};
