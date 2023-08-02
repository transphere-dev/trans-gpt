const express = require("express");
const db = require("../db");

const router = express.Router();
const { createChatSession, saveChatMessage } = require("../db");

router.post("/chat-session", async (req, res) => {
  const { user_id, created_at, id, title } = req.body;

  try {
    const newChatSession = await createChatSession(
      user_id,
      created_at,
      id,
      title
    );
    res.status(201).json(newChatSession);
  } catch (error) {
    console.error("Error creating chat session:", error);
    res.status(500).json({ msg: "Error creating chat session" });
  }
});

router.post("/chat-msg", async (req, res) => {
  const chat_message_data = req.body;
  console.log(chat_message_data);

  try {
    const chatMSg = await saveChatMessage(chat_message_data);
    res.status(201).json({ msg: "Success!" });
  } catch (error) {
    console.error("Error creating chat session:", error);
    res.status(500).json({ msg: "Error creating chat session" });
  }
});

// Fetch chat sessions for a specific user
router.get("/sessions/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    const chatSessions = await db.getChatSessions(userId);
    res.json(chatSessions);
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    res.status(500).json({ error: "Error fetching chat sessions" });
  }
});

// Fetch chat messages for a specific chat session and user
router.get("/sessions/:sessionId/messages/:userId", async (req, res) => {
  const sessionId = parseInt(req.params.sessionId, 10);
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(sessionId) || isNaN(userId)) {
    res.status(400).json({ error: "Invalid chat session ID or user ID" });
    return;
  }

  try {
    const chatMessages = await db.getChatMessages(sessionId, userId);
    res.json(chatMessages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ error: "Error fetching chat messages" });
  }
});

module.exports = router;
