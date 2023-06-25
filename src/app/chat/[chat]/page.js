"use client";


import { Box, Center, Flex, Text } from "@chakra-ui/react";
import ChatInput from "../../components/ChatInput";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import ChatBox from "../../components/ChatBox";
import NewChat from "../../components/NewChat";
import ChatContext from "../../contexts/ChatContext";
import { useAuth } from "../../components/AuthContextWrapper";

export default function Page({ params }) {
  const pathname = usePathname();
  const {user} = useAuth();
  const [loading,setLoading] = useState(true);

  const { chatMessages, result, setChatMessages, chatRoomId } =  useContext(ChatContext);

  // Fetch chat messages for a specific chat session
  async function fetchChatMessages(sessionId) {
    const response = await fetch(`http://192.168.4.62:8080/api/chats/sessions/${sessionId}/messages/${user.id}`);

    if (!response.ok) {
      throw new Error(`Error fetching chat messages: ${response.statusText}`);
    }

    const chatMessages = await response.json();
    return chatMessages;
  }

  useEffect(() => {

    fetchChatMessages(params.chat)
    .then(data =>{
      
      setChatMessages(data)
      setLoading(false);

    })
    .catch(err => {
      setLoading(false);

      console.log(err.message);
    })


    return () => {
      setChatMessages([]);
    };
  }, []);


  return (
    <Flex
      position={"relative"}
      flexDirection={"column"}
      justifyContent={"space-between"}
      h={"100%"}
    >
      {chatMessages?.length === 0 ? (
        <>
          <NewChat />
        </>
      ) : (
        <>
          <Center flexDirection={"column"}>
            {chatMessages?.map((each) => {
              return (
                <>
                  <ChatBox key={each.id} chat={each} />
                </>
              );
            })}
          </Center>
        </>
      )}

      <Flex
        flexDirection={"column"}
        w={"50%"}
        position={"fixed"}
        bottom={0}
        zIndex={2}
        left={"30%"}
        right={"30%"}
      >
        <Box
          // bg={useColorModeValue("#fff", "#2D2D36")}
          w={"100%"}
          p={10}
        >
          <ChatInput />
          <Text mt={3} fontSize={"xs"} align={"center"} color={"#ACACBE"}>
            TransGPT March 29 Version. This a pre-release for testing and
            evaluation purposes.
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}
