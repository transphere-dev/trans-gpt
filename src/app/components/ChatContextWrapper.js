import ChatContext from "../contexts/ChatContext.js";
import { useState, useEffect, useContext, useMemo } from "react";
import AuthContext from "../contexts/AuthContext.js";
import { userAgent } from "next/server.js";

function ChatContextWrapper({ children }) {
  const { user } = useContext(AuthContext);
  const chats = {
    chats: [
      { name: "Explain quantum computing in simple terms", id: "1" },
      { name: "Explain quantum computing in simple terms", id: "2" },
      { name: "Explain quantum computing in simple terms", id: "3" },
      { name: "Explain quantum computing in simple terms", id: "4" },
      { name: "Explain quantum computing in simple terms", id: "5" },
    ],
  };
  const chatMsgs = [
    {
      name: "Latest quantum computing in simple terms",
      prompt: "Latest quantum computing in simple terms",
      id: "1",
      created: 1648411200000,
      msg: "Quantum computing is a type of computing where information is processed using quantum-mechanical phenomena, such as superposition and entanglement. In traditional computing, information is processed using bits, which can have a value of either 0 or 1. In quantum computing, information is processed using quantum bits, or qubits, which can exist in multiple states simultaneously. This allows quantum computers to perform certain types of calculations much faster than traditional computers.",
    },
    {
      name: "Explain quantum computing in simple terms",
      prompt: "Explain quantum computing in simple terms",
      id: "2",
      created: 1648497600000,
      msg: "Quantum computing is a type of computing where information is processed using quantum-mechanical phenomena, such as superposition and entanglement. In traditional computing, information is processed using bits, which can have a value of either 0 or 1. In quantum computing, information is processed using quantum bits, or qubits, which can exist in multiple states simultaneously. This allows quantum computers to perform certain types of calculations much faster than traditional computers.",
    },
    {
      name: "Explain quantum computing in simple terms",
      prompt: "Explain quantum computing in simple terms",
      id: "3",
      created: 1648584000000,
      msg: "Quantum computing is a type of computing where information is processed using quantum-mechanical phenomena, such as superposition and entanglement. In traditional computing, information is processed using bits, which can have a value of either 0 or 1. In quantum computing, information is processed using quantum bits, or qubits, which can exist in multiple states simultaneously. This allows quantum computers to perform certain types of calculations much faster than traditional computers.",
    },
    {
      name: "Explain quantum computing in simple terms",
      prompt: "Now latest quantum computing in simple terms",
      id: "4",
      created: 1648670400000,
      msg: "Quantum computing is a type of computing where information is processed using quantum-mechanical phenomena, such as superposition and entanglement. In traditional computing, information is processed using bits, which can have a value of either 0 or 1. In quantum computing, information is processed using quantum bits, or qubits, which can exist in multiple states simultaneously. This allows quantum computers to perform certain types of calculations much faster than traditional computers.",
    },
  ];

  const [chatList, setChatList] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [newChat, setNewChat] = useState(true);
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [streaming, setStreaming] = useState(false);

  // Define a function to check if the id already exists in the array
  function idExists(id, arr) {
    console.log(arr.some((object) => object.chatId === id));
    return arr.some((object) => object.chatId === id);
  }

  function mimicAPIRequest(payload, promptObj) {
    setTimeout(() => {
      const resp = {
        id: "chatcmpl-6p9XYPYSTTRi0xEviKjjilqrWU2Ve",
        object: "chat.completion",
        created: 1677649420,
        model: "gpt-3.5-turbo",
        usage: { prompt_tokens: 56, completion_tokens: 31, total_tokens: 87 },
        choices: [
          {
            message: {
              role: "assistant",
              content:
                "The 2020 World Series was played in Arlington, Texas at the Globe Life Field, which was the new home stadium for the Texas Rangers.",
            },
            finish_reason: "stop",
            index: 0,
          },
        ],
      };
      const chatId = resp.id.split("-")[1];

      // Response object
      const msg = {
        chatId: chatId,
        id: resp.created,
        senderId: resp.model + "-" + resp.created,
        model: resp.model,
        message: resp.choices[0].message.content,
        name: promptObj?.name,
      };
      setStreaming(false);

      // Update chat messages
      setChatMessages((prevChatMessages) => [...prevChatMessages, msg]);

      // Check if Chat ID exists
      if (idExists(msg.chatId, chatList)) {
        console.log("chatroom Id exists");
      } else {
        // Update Chat List
        setChatList((prevChatList) => {
          return [...prevChatList, msg];
        });
      }
    }, 2000); // Simulate a 2 second delay
  }

  const sendMessage = () => {
    setStreaming(true);

    // Create prompt object
    const promptObj = {
      id: Date.now(),
      message: message,
      model: model,
      senderId: user.userId,
      name: message.substring(0, 20),
      chatId: "",
    };
    setChatMessages([...chatMessages, promptObj]);

    const payload = {
      model: model,
      messages: [{ role: "translator", content: message }],
    };
    mimicAPIRequest(payload, promptObj);
  };

  const values = {
    chatList,
    setChatList,
    newChat,
    setNewChat,
    chatMessages,
    setChatMessages,
    message,
    setMessage,
    sendMessage,
    streaming,
  };
  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
}

export default ChatContextWrapper;
