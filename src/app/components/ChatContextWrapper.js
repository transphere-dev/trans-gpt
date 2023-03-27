import ChatContext from "../contexts/ChatContext.js";
import { useState, useEffect, useContext, useMemo } from "react";
import AuthContext from "../contexts/AuthContext.js";

function ChatContextWrapper({ children }) {
    const chats = {
        chats: [
          { name: "Explain quantum computing in simple terms", id: "1" },
          { name: "Explain quantum computing in simple terms", id: "2" },
          { name: "Explain quantum computing in simple terms", id: "3" },
          { name: "Explain quantum computing in simple terms", id: "4" },
          { name: "Explain quantum computing in simple terms", id: "5" },
        ],
      };  
      

  const [chatList, setChatList] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [newChat, setNewChat] = useState(true);

  function mimicAPIRequest() {
    setTimeout(() => {
      const response = { data: { message: "Hello, world!" } };
      console.log(response);

    }, 2000); // Simulate a 2 second delay
  }

  const sendMessage = () => {
    mimicAPIRequest();
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
  };
  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
}

export default ChatContextWrapper;
