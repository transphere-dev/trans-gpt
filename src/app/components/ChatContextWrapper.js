import ChatContext from "../contexts/ChatContext.js";
import { useState, useContext } from "react";
import AuthContext from "../contexts/AuthContext.js";
import { usePathname } from "next/navigation";

const url = 'https://api.openai.com/v1'
const endpoint = '/chat/completions'
const apiKey = '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'

function ChatContextWrapper({ children }) {
  const { user } = useContext(AuthContext);
  const [chatList, setChatList] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [newChat, setNewChat] = useState(true);
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [streaming, setStreaming] = useState(false);
  const chatRoomId = usePathname().split('/')[2];

  // Define a function to check if the id already exists in the array
  function idExists(id, arr) {
    console.log(arr.some((object) => object.chatId === id));
    return arr.some((object) => object.chatRoomId === id);
  }

    const sendMessage =  (e) => {
      console.log(e);
      e.preventDefault();
    setStreaming(true);

    // Create prompt object
    const promptObj = {
      id: Date.now(),
      content: message,
      model: model,
      senderId: user.userId,
      name: message.substring(0, 50),
      chatRoomId: chatRoomId,
      role: "user"
    };

    // Add chat messages to localStorage


    setChatMessages((prevChatMessages) => [...prevChatMessages, promptObj]);

    // Filter chatmessages
    const filteredChatMessages = chatMessages.map(each => ( {role: each.role,content: each.content}))
    console.log(filteredChatMessages);

  

    // Create request body
    const payload = {
      model: model,
      messages: [
        { role: "system", content: message},
       
    ],
    };
    console.log(payload);
    postRequest(payload, promptObj);
  };


  async function postRequest(payload, promptObj) {

    await fetch(url+endpoint, {
      method: 'POST',
      mode: "cors",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload),
      
    })
      .then(response => response.json())
      .then(resp =>{
         console.log(resp);

      // Response object
      const msg = {
        chatRoomId: chatRoomId,
        chatId: resp.id,
        senderId: resp.model + "-" + resp.created,
        model: resp.model,
        content: resp.choices[0].message.content,
        name: promptObj?.name,
        role: resp.choices[0].message.role
      };

      setStreaming(false);

      // Update chat messages
      setChatMessages((prevChatMessages) => [...prevChatMessages, msg]);

      // Check if Chat ID exists
      if (idExists(msg.chatRoomId, chatList)) {
        console.log("chatroom Id exists");
      } else {
        // Update Chat List
        setChatList((prevChatList) => {
          const temp = [...prevChatList, msg]
          localStorage.setItem('chatList',JSON.stringify(temp))

          return [...prevChatList, msg];
          
        });

      }
        })
      .catch(error => console.error(error));
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
    chatRoomId
  };
  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
}

export default ChatContextWrapper;
