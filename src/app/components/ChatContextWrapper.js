import ChatContext from "../contexts/ChatContext.js";
import { useState, useContext } from "react";
import AuthContext from "../contexts/AuthContext.js";
import { usePathname } from "next/navigation";

const url = "https://api.openai.com/v1";
const endpoint = "/chat/completions";
const apiKey = "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";

function ChatContextWrapper({ children }) {
  const { user } = useContext(AuthContext);
  const [chatList, setChatList] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [newChat, setNewChat] = useState(true);
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [streaming, setStreaming] = useState(false);
  const chatRoomId = usePathname().split("/")[2];

  // Define a function to check if the id already exists in the array
  function idExists(id, arr) {

    return arr.some((object) => object?.chatRoomId === id);
  }

  // Save Message to LocalStorage

  const saveMessage = (chatRoomId, msg) => {
    // Get Chatroom from localstorage
    const chatMessages = localStorage.getItem("chatRooms");

    chatMessages[chatRoomId]?.messages.push(msg);
  };

 // Create ChatRooms
 const createChatRooms = (payload) => {
  const arr = []
  arr.push(payload)

   localStorage.setItem("chatRooms",JSON.stringify(payload));

};

  const sendMessage = (e) => {
    console.log(e);
    e.preventDefault();
    setStreaming(true);

    // Create prompt object
    const promptObj = {
      id: Date.now(),
      chatId: Date.now(),
      content: message,
      model: model,
      senderId: user.userId,
      name: message.substring(0, 50),
      chatRoomId: chatRoomId ,
      role: "user",
    };

    // Add chat messages to localStorage

    setChatMessages((prevChatMessages) => [...prevChatMessages, promptObj]);

    // Filter chatmessages
    const filteredChatMessages = chatMessages.map((each) => ({
      role: each.role,
      content: each.content,
    }));
    console.log(filteredChatMessages);

    // Create request body
    const payload = {
      model: model,
      messages: [{ role: "system", content: message }],
    };

    postRequest(payload, promptObj);
  };

  async function postRequest(payload, promptObj) {
    await fetch(url + endpoint, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((resp) => {

        // Response object
        const msg = {
          chatRoomId: chatRoomId,
          chatId: resp.id,
          senderId: resp.model + "-" + resp.created,
          model: resp.model,
          content: resp.choices[0].message.content,
          name: promptObj?.name,
          role: resp.choices[0].message.role,
        };

        setStreaming(false);

        // Update chat messages
        setChatMessages((prevChatMessages) => {
          // Save chatMessages to LocalStorage
          const temp = [...prevChatMessages, msg];
          // localStorage.setItem("chatList", JSON.stringify(temp));
          const indexedObject = temp.reduce((acc, obj) => {
            acc[obj.chatRoomId] = obj;
            return acc;
          }, {});

          console.log(indexedObject);
          return [...prevChatMessages, msg];
        });
          console.log(chatList);
        // Check if Chat ID exists
        if (idExists(msg.chatRoomId, chatList)) {
          console.log("chatroom Id exists");

        } else {

          // Update Chat List
          setChatList((prevChatList) => {
            
            // Save ChatList to Localstorage
            const temp = [msg,...prevChatList];
            
            localStorage.setItem("chatList", JSON.stringify(temp));

            return [ msg,...prevChatList];
          });
        }
      })
      .catch((error) => console.error(error));
  }

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
    chatRoomId,
  };
  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
}

export default ChatContextWrapper;
