const { Pool } = require("pg");
const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/transgpt-db";
const bcrypt = require("bcrypt");

const pool = new Pool({ connectionString });

async function getUserByEmail(email) {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rowCount > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}

async function checkPassword(plaintextPassword, hashedPassword) {
  if (!plaintextPassword || !hashedPassword) {
    console.error("Error checking password: data and hash arguments required");
    return false;
  }

  try {
    return await bcrypt.compare(plaintextPassword, hashedPassword);
  } catch (error) {
    console.error("Error checking password:", error);
    return false;
  }
}

async function verifyEmail(email) {
  // Update the user's email_verified field in the database
  const query = `UPDATE users SET emailverified = true WHERE email = $1`;
  await pool.query(query, [email]);
}

async function updateUserPassword(userId, newPasswordHash) {
  try {
    const { rowCount } = await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [newPasswordHash, userId]
    );

    if (rowCount === 0) {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error updating user password:", error);
    throw error;
  }
}

async function createChatSession(user_id,created_at,chatRoomId,title) {
  try {
    const { rows } = await pool.query(
      "INSERT INTO chat_sessions (user_id, title,created_at,chat_room_id,updated_at,last_active_at) VALUES ($1,$2,$3,$4,NOW(),NOW()) RETURNING *",
      [user_id,title,created_at,chatRoomId]
    );
    return rows[0];
  } catch (error) {
    console.error("Error creating chat session:", error);
    throw error;
  }
}

async function saveChatMessage(chat_message_data) {
  const { chatRoomId, content, senderId } = chat_message_data;
  const created_at = new Date();
  try {

  const { rows }  = await pool.query(
    'INSERT INTO chat_messages (chat_session_id, content, sender_id, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
    [chatRoomId, content, senderId, created_at]
  );

  return rows[0];
} catch (error) {
  console.error("Error creating chat session:", error);
  throw error;
}
}

async function getChatSessions(userId) {
  const result = await pool.query('SELECT * FROM chat_sessions WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return result.rows;
}


async function getChatMessages(sessionId, userId) {
  const sessionResult = await pool.query('SELECT * FROM chat_sessions WHERE chat_room_id = $1 AND user_id = $2', [sessionId, userId]);

  if (sessionResult.rowCount === 0) {
    throw new Error('Chat session not found or not authorized');
  }

  const result = await pool.query('SELECT * FROM chat_messages WHERE chat_session_id = $1 ORDER BY created_at ASC', [sessionId]);
  return result.rows;
}


module.exports = {
  query: (text, params) => pool.query(text, params),
  getUserByEmail,
  saveChatMessage,
  checkPassword,
  verifyEmail,
  getChatSessions,
  getChatMessages,
  updateUserPassword,
  createChatSession,
};
