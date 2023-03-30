import { Avatar, Box, Center, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useContext, useEffect, useRef } from "react";
import AuthContext from "../contexts/AuthContext";
import ChatContext from "../contexts/ChatContext";
import BlinkingCursor from "./BlinkingCursor";


export default function ChatBox({ chat,result }) {
  const {streaming} = useContext(ChatContext)
  const {user} = useContext(AuthContext)
  const userBgColor = useColorModeValue('#fff', '#343541');
  const botBgColor = useColorModeValue('#F7F7F8', '#444654');
  const textColor = useColorModeValue('#333333', '#D1D5DB');


  return (
<>
<Box  color={textColor} w={"100%"}>
      <Center bg={user.userId == chat?.senderId ? userBgColor : botBgColor } p={"2%"} justifyContent={"left"}>
        <Avatar size={"sm"} src={user.userId != chat?.senderId ? '/images/logo-circle.jpg' : null} />
        <Text fontWeight={500} ml={"3%"}>{chat?.content|| chat?.choices[0].delta.content}</Text>
        {/* { streaming && <BlinkingCursor />} */}
      </Center>
    </Box>

</>
  );
}
