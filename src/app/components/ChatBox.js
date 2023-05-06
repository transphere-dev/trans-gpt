import { Avatar, Box, Center, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useContext, useEffect, useRef } from "react";
import AuthContext from "../contexts/AuthContext";
import ChatContext from "../contexts/ChatContext";
import { useAuth } from "./AuthContextWrapper";
import BlinkingCursor from "./BlinkingCursor";


export default function ChatBox({ chat,result }) {
  const {streaming} = useContext(ChatContext)
  const {user} = useAuth();
  const userBgColor = useColorModeValue('#fff', '#343541');
  const botBgColor = useColorModeValue('#F7F7F8', '#444654');
  const textColor = useColorModeValue('#333333', '#D1D5DB');


  return (
<>
<Box  color={textColor} w={"100%"}>
      <Center bg={ chat?.sender === 'user' ? userBgColor : botBgColor } p={"2%"} justifyContent={"left"}>
        <Avatar bg={'#F79229'} size={"sm"} src={chat?.sender === 'ai' ? '/images/logo-circle.jpg' : null} />
        {chat?.sender === 'ai' && <Text fontWeight={500} ml={"3%"}>{chat?.content || chat?.choices[0].delta.content}</Text>}
        {chat?.sender === 'user' && <Text fontWeight={500} ml={"3%"}>{chat?.content }</Text>}
        {/* <div dangerouslySetInnerHTML={{__html: chat?.content || chat?.choices[0].delta.content}} /> */}

        {/* { streaming && <BlinkingCursor />} */}
      </Center>
    </Box>

</>
  );
}
