import { Avatar, Box, Center, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import ChatContext from "../contexts/ChatContext";
import BlinkingCursor from "./BlinkingCursor";

export default function ChatBox({ chat }) {
  const {streaming} = useContext(ChatContext)
  const {user} = useContext(AuthContext)
  return (
    <Box mb={'3%'} border={`2px solid ${useColorModeValue('#D1D5DB', '#9292A3')}`} borderRadius={6} w={"100%"}>
      <Center bg={user.userId == chat?.senderId ? useColorModeValue('#fff', '#343541') : useColorModeValue('#F7F7F8', '#444654')} p={"2%"} justifyContent={"left"}>
        <Avatar size={"sm"} src={user.userId != chat?.senderId ? '/images/logo-circle.jpg' : null} />
        <Text ml={"3%"}>{chat?.message}</Text>{ streaming && <BlinkingCursor />}
      </Center>
      {/* <Center bg={useColorModeValue('#F7F7F8', '#444654')} p={"2%"} justifyContent={"left"}>
        <Avatar size={"sm"} />
        
        <Text ml={"3%"}>{chat?.message}</Text>
        
      </Center> */}
    </Box>
  );
}
