import { Box, Center, FormControl, Input, useColorModeValue ,Text, Button} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { FiSend } from "react-icons/fi";
import ChatContext from "../contexts/ChatContext";

export default function ChatInput() {
  const {chatMessage,message,setMessage,sendMessage,streaming} = useContext(ChatContext);
  
  return (

<>
{streaming && 
<Center>
  <Text
  pl={2}
  pr={2}
  pt={2}
  borderTopRightRadius={10}
  borderTopLeftRadius={10}
  bgColor={useColorModeValue('#fff','#444654')}
  width={'fit-content'}
  
  >Generating . . .</Text>
  </Center>}
<Center shadow={'md'} bg={'#444654'} w={'100%'} borderRadius={6} pr={5}  >
        <FormControl >
      <Input  onChange={(e) => setMessage(e.target.value)} border={0} type="email" />
    </FormControl>
    <Box
    _hover={{
      fontSize:18,
      color:'#f79229'
    }}
    pl={5} cursor={!streaming ? 'pointer' : 'not-allowed'} onClick={!streaming && message ? sendMessage : null}>
    <FiSend  />
    </Box>
    </Center>
</>
  );
}
