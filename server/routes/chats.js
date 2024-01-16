const express = require("express");
const db = require("../db");

const router = express.Router();
const { createChatSession, saveChatMessage , getChatMessages} = require("../db");
const { default: OpenAI } = require("openai");
const { default: fetch } = require("node-fetch");

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

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
    console.error( error.message);
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
    const chatMessages = await getChatMessages(sessionId, userId);
    res.json(chatMessages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ error: "Error fetching chat messages" });
  }
});

// OpenAI Models API endpoint request

router.get('/models', async (req, res) => {

  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
     
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: error.message });
  }
});


// OpenAI Completions API endpoint request
router.post("/completions", async (req, res) => {
  const { model, messages} = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
      stream: true,
    });
  
    for await (const chunk of completion) {
      console.log(chunk.choices[0].delta.content);
    }
  
  
    res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
