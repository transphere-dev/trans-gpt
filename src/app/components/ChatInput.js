import { Box, Center, FormControl, Input } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { FiSend } from "react-icons/fi";
import ChatContext from "../contexts/ChatContext";

export default function ChatInput() {
  const {chatMessage,setMessage,sendMessage} = useContext(ChatContext);
  return (
    <Center bg={'#444654'} w={'100%'} borderRadius={6} pr={5} >
        <FormControl id="email">
      <Input onChange={(e) => setMessage(e.target.value)} border={0} type="email" />
    </FormControl>
    <Box cursor={'pointer'} onClick={sendMessage}>
    <FiSend  />
    </Box>
    </Center>
  );
}
