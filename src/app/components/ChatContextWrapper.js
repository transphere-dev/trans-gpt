import ChatContext from "../contexts/ChatContext.js";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SSE } from "sse.js";
import { useAuth } from "./AuthContextWrapper.js";
import { getCurrentDateTime } from "../lib/requests.js";

const url = "https://api.openai.com/v1";
const endpoint = "/chat/completions";
const apiKey = "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";

function ChatContextWrapper({ children }) {
  const { user } = useAuth();
  const [chatList, setChatList] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [messageHistory,setMessageHistory] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [streaming, setStreaming] = useState(false);
  const chatRoomId = usePathname().split("/")[2];
  const [result, setResult] = useState("");

  // Define a function to check if the id already exists in the array
  function idExists(id, arr) {
    return arr.some((object) => object?.id === id);
  }

  // Save Message to LocalStorage



  // Save chat Messages
  async function saveChatMessage(chat_message_data) {
    const response = await fetch(
      "http://192.168.4.62:8080/api/chats/chat-msg",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chat_message_data),
      }
    );

    if (!response.ok) {
      throw new Error(`Error saving chat message: ${response.statusText}`);
    }

    const savedMessage = await response.json();
    return savedMessage;
  }

  // Save chat sessions
  async function saveChatSession(chatSession) {
    const response = await fetch(
      "http://192.168.4.62:8080/api/chats/chat-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatSession),
      }
    );

    if (!response.ok) {
      throw new Error(`Error saving chat session: ${response.statusText}`);
    }

    const savedMessage = await response.json();
    return savedMessage;
  }

  const sendMessage = async (e) => {
    setMessage("");

    e.preventDefault();
    setStreaming(true);

    // Create prompt object
    const promptObj = {
      id: Date.now().toString(),
      content: message,
      model: model,
      senderId: user.id,
      sender: "user",
      title: message.substring(0, 50),
      chatRoomId: chatRoomId,
      role: "user",
    };

    // Add chat messages to UI

    setChatMessages((prevChatMessages) => [...prevChatMessages, promptObj]);
    // Filter chatmessages
    const filteredChatMessages = chatMessages.map((each) => {
      return {
        role: each?.role,
        content: each.content || each?.choices[0].delta.content,
      }
    }
     );

     
    // Create request body
    const payload = {
      model: model,
      messages: [...filteredChatMessages,{ role: "user", content: message }],

      stream: true,
    };

    await postRequest(payload, promptObj)
      .then(() => {
          
        // Save prompt to db
        saveChatMessage(promptObj)
        .catch(e => {
          console.log(e.message)
        })

      })
      .catch((e) => {
        console.log(e.messsage);
      });
  };

  // OPENAI API request
  async function postRequest(payload, promptObj) {
    let source = new SSE(url + endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "access-control-allow-origin": "*",
      },
      method: "POST",
      payload: JSON.stringify(payload),
    });
    let tempText = ''
    source.addEventListener("message", (e) => {

      if (e.data != "[DONE]") {
        let payload = JSON.parse(e.data);
        
        let text = payload.choices[0].delta.content;

        if (text != undefined) {
 
          if (payload && !payload.id && !payload.title) {
            payload.id = chatRoomId;
            payload.title = text.substring(0, 40);
          }
          
          // Stream-like part
          setChatMessages((prevResult) => {

            let foundObject = prevResult.find((obj) => obj?.id === payload?.id) || {};

            if (foundObject && foundObject.id) {
              tempText = foundObject.choices[0].delta.content ;
              // if(text == '\n' || text == ':') foundObject.choices[0].delta.content +='<br/>'
              foundObject.choices[0].delta.content += text;
              
              foundObject.sender = 'ai'
              foundObject.role = 'assistant'
              
              
              return [...prevResult, foundObject].filter((obj, index, self) => {
                return index === self.findIndex((t) => t.id === obj.id);
              });

            } else {
              return [...prevResult, payload];
            }
          });
        }
      } else {
        source.close();
        setStreaming(false);


        const respObj = {
          id: Date.now().toString(),
          content: tempText,
          model: payload.model,
          senderId: 0,
          sender: "ai",
          title: message.substring(0, 50),
          chatRoomId: chatRoomId,
          role: "assistant",
        };
        const chats = [ promptObj,respObj]

        

        // Check if Chat ID exists
        // Create one if not
        if (idExists(chatRoomId, chatList)) {
          console.log("chatroom Id exists");
          saveChatMessage(chats)
        } else { 
          const data = {
            user_id: user.id,
            created_at: getCurrentDateTime(),
            id: chatRoomId,
            title: promptObj.content.substring(0, 20),
          };


          
              
         saveChatSession(data)
         .then(() =>{ 
           console.log('Session created');
        
                  // Update Chat List
                  setChatList((prevChatList) => {
                    return [data, ...prevChatList];
                  });
                              // Create response object
    
          saveChatMessage(chats)
          .then(() =>{ 
            console.log('msg saved');
        
         })
          .catch((err) => console.log(err.message))
        })
         .catch((err) => console.log(err.message))
      }

      }
    });

    source.addEventListener("readystatechange", (e) => {
      if (e.readyState >= 2) {
        // setIsLoading(false);
      }
    });
// Add an event listener for the 'error' event
source.addEventListener('error', function(event) {
  // Handle connection errors
  console.log('Error connecting to the server:', event.data);
  setStreaming(false)
});
    source.stream();

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
    result,
  };
  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
}

export default ChatContextWrapper;
