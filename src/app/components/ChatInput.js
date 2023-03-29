import {
  Box,
  Center,
  FormControl,
  Input,
  useColorModeValue,
  Text,
  Button,
  Textarea,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { FiSend } from "react-icons/fi";
import ChatContext from "../contexts/ChatContext";
import { TailSpin } from "react-loader-spinner";

export default function ChatInput() {
  const { chatMessage, message, setMessage, sendMessage, streaming } =
    useContext(ChatContext);
  const bgColor = useColorModeValue("#fff", "#444654");
  const textColor = useColorModeValue("#444654", "#fff");

  return (
    <>
      {streaming && (
        <Center>
          <Center
            pl={2}
            pr={2}
            pt={2}
            borderTopRightRadius={10}
            borderTopLeftRadius={10}
            bgColor={bgColor}
            color={textColor}
            width={"fit-content"}
          >
            <TailSpin
            
              height="24"
              width="24"
              color="#f3843f"
              ariaLabel="tail-spin-loading"
              radius="2"
              wrapperStyle={{}}
              wrapperClass="loader"
              visible={streaming}
            />
            <Text pl={3}>Generating . . .</Text>
          </Center>
        </Center>
      )}
      <Center
        color={textColor}
        shadow={"md"}
        bg={bgColor}
        w={"100%"}
        borderRadius={6}
        pr={5}
      >
        <form style={{width: "100%"}} onSubmit={!streaming && message ? sendMessage : null}>
        <FormControl>
          <Textarea
          placeholder="Enter your text here"
            onChange={(e) => setMessage(e.target.value)}
            border={0}
            type="text"
          />
        </FormControl>
        </form>
        <Box
          _hover={{
            fontSize: 20,
            color: "#f79229",
          }}
          pl={5}
          cursor={!streaming ? "pointer" : "not-allowed"}
          onClick={!streaming && message ? sendMessage : null}
        >
          <FiSend />
        </Box>
      </Center>
    </>
  );
}
