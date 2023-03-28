"use client";

import { Inter } from "next/font/google";
import styles from "./page.module.css";
import onboarding from "../../public/images/home.svg";
import logo from "../../public/images/transgpt-dark.svg";
import { Image } from "@chakra-ui/next-js";
import { Box, Center, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import HomeCard from "./components/HomeCard";
import { RiTranslate2, RiSearch2Line } from "react-icons/ri";
import ChatInput from "./components/ChatInput";
import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";
import ChatBox from "./components/ChatBox";
import NewChat from "./components/NewChat";
import ChatContext from "./contexts/ChatContext";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const pathname = usePathname();
  const { chatMessages , setChatMessages } = useContext(ChatContext);

  useEffect(() => {
    console.log(pathname); // Log the current URL path


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
      {pathname === "/" && chatMessages.length === 0 ? (
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
          
          <ChatInput />
          <Text mt={3} fontSize={"xs"} align={"center"} color={"#ACACBE"}>
          TransGPT March 27 Version.
        </Text>
        </Box>
       
      </Flex>
    </Flex>
  );
}
