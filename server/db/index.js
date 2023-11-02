const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;
const bcrypt = require("bcrypt");
const { matchSourceTargetTerms } = require("../lib/lib");

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

async function createChatSession(user_id, created_at, id, title) {
  try {
    const { rows } = await pool.query(
      "INSERT INTO chat_sessions (user_id, title,created_at,id,updated_at,last_active_at) VALUES ($1,$2,$3,$4,NOW(),NOW()) RETURNING *",
      [user_id, title, created_at, id]
    );
    return rows[0];
  } catch (error) {
    console.error("Error saving chat session:", error);
    throw error;
  }
}
async function createGlossary(user_id, name, language, created_at, terms) {
  try {
    const { rows } = await pool.query(
      "INSERT INTO glossaries (user_id, name,language,created_at,updated_at) VALUES ($1,$2,$3,$4,NOW())  RETURNING *",
      [user_id, name, language, created_at]
    );

    const gloassary = rows[0];

    let termList = [];

    // Save the glossaries to the database
    for (const term of terms) {
      const { Source, Target } = term;
      const { rows } = await pool.query(
        "INSERT INTO source_terms (glossary_id,term,created_at,updated_at) VALUES ($1,$2,$3,NOW() )  RETURNING *",
        [gloassary.id, Source, created_at]
      );
      await pool.query(
        "INSERT INTO target_terms (source_term_id,term,language,created_at,updated_at) VALUES ($1,$2,$3,$4,NOW() )  RETURNING *",
        [rows[0].id, Target, language, created_at]
      );
      // console.log(rows[0]);
      // termList.append(rows[0])
    }

    return rows[0];
  } catch (error) {
    console.error("Error creating glossary:", error);
    throw error;
  }
}

async function saveChatMessage(chat_message_data) {
  // const { id, content, senderId , sender ,model,role} = chat_message_data;
  const created_at = new Date();

  try {
    for (let index = 0; index < chat_message_data.length; index++) {
      await pool.query(
        "INSERT INTO chat_messages (chat_session_id, content, sender, sender_id, created_at, model, role) VALUES ($1, $2, $3, $4 , $5 , $6 , $7) RETURNING *",
        [
          chat_message_data[index].chatRoomId,
          chat_message_data[index].content,
          chat_message_data[index].sender,
          chat_message_data[index].senderId,
          created_at,
          chat_message_data[index].model,
          chat_message_data[index].role,
        ]
      );
    }
    return "Success";
  } catch (error) {
    console.error("Error saving chat msg:", error);
    throw error;
  }
}

async function getChatSessions(userId) {
  const result = await pool.query(
    "SELECT * FROM chat_sessions WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
}
async function getGlossary(userId) {
  const query = "SELECT * FROM glossaries WHERE user_id = $1";
  const result = await pool.query(query, [userId]);

  return result.rows;
}

async function getTerms(userId, glossary_id) {
  let tempTargetList = [];
  const result = await pool.query(
    "SELECT * FROM glossaries WHERE id=$1 AND user_id = $2",
    [glossary_id, userId]
  );

  const query = "SELECT * FROM source_terms WHERE glossary_id=$1";
  const { rows } = await pool.query(query, [result.rows[0].id]);

  for (const term of rows) {
    const target_terms = await pool.query(
      "SELECT * FROM target_terms WHERE source_term_id=$1",
      [term.id]
    );

    tempTargetList.push(target_terms.rows[0]);
  }
  const source_terms = rows;
  const source_target_terms = matchSourceTargetTerms(
    source_terms,
    tempTargetList
  );

  return source_target_terms;
}

async function getChatMessages(sessionId, userId) {
  const sessionResult = await pool.query(
    "SELECT * FROM chat_sessions WHERE id = $1 AND user_id = $2 ",
    [sessionId, userId]
  );

  if (sessionResult.rowCount === 0) {
    throw new Error("Chat session not found or not authorized");
  }

  const result = await pool.query(
    "SELECT * FROM chat_messages WHERE chat_session_id = $1 ORDER BY created_at ASC",
    [sessionId]
  );
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
  createGlossary,
  getGlossary,
  getTerms,
};
