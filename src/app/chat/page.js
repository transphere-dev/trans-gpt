"use client";

import { Box, Center, Flex, Text } from "@chakra-ui/react";
import ChatInput from "../components/ChatInput";
import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";
import ChatBox from "../components/ChatBox";
import NewChat from "../components/NewChat";
import ChatContext from "../contexts/ChatContext";

export default function Page() {
  const pathname = usePathname();
  const { chatMessages, setChatMessages } = useContext(ChatContext);

  useEffect(() => {
    return () => {
      setChatMessages([]);
    };
  }, []);

  useEffect(() => {
    return () => {
      null;
    };
  }, [chatMessages]);

  return (
    <Flex
      position={"relative"}
      flexDirection={"column"}
      justifyContent={"space-between"}
      h={"100%"}
    >
      {pathname === "/chat" && chatMessages.length === 0 ? (
        <>
          <NewChat />
        </>
      ) : (
        <>
          <Center flexDirection={"column"}>
            {chatMessages?.map((each) => {
              return (
                <>
                  <ChatBox key={each?.id} chat={each} />
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
          {pathname != "/chat" && <ChatInput />}
          <Text mt={3} fontSize={"xs"} align={"center"} color={"#ACACBE"}>
            TransGPT {process.env.NEXT_PUBLIC_VERSION_DATE} Version. This a
            pre-release for testing and evaluation purposes.
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}
