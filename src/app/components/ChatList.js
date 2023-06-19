import React, {  useContext, useState } from "react";
import {
  Box,
  Flex,

  Icon,
  useColorModeValue,

  Skeleton,
  useColorMode,
} from "@chakra-ui/react";
import {

  FiMessageCircle,

} from "react-icons/fi";

import ChatContext from "../contexts/ChatContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./AuthContextWrapper";

export default function ChatList() {
    const [loading,setLoading] = useState(true);
    const { chatList, setChatList, setChatMessages } = useContext(ChatContext);
    const { user } = useAuth();
    const pathname = usePathname();
    const { colorMode } = useColorMode();

    async function fetchChatSessions() {
        const response = await fetch(`http://192.168.4.62:8080/api/chats/sessions/${user.id}`);
    
        if (!response.ok) {
          setLoading(false)
          throw new Error(`Error fetching chat sessions: ${response.statusText}`);
        }
    
        const chatSessions = await response.json();
        return chatSessions;
      }

      useEffect(() => {

        fetchChatSessions()
        .then(data =>{
          
          setChatList(data)
          setLoading(false);
    
        })
        .catch(err => {
          setLoading(false);
    
          console.log(err.message);
        })
        return () => {
            null;
          };
        }, []);
    
      useEffect(() => {
        return () => {
          null;
        };
      }, [chatList]);
    
  return (
    <>
            {!loading && chatList?.map((link) => (
          <NavItem
          
            path={pathname}
            id={link.id}
            colorMode={colorMode}
            key={link.id}
            icon={FiMessageCircle}
          >
            {link.title}
          </NavItem>
        
        ))}
          {loading && <>
            
            <Skeleton borderRadius={6} mt={'3%'} w={'100%'} height='40px' />

            </>}
    </>
  )
}


const NavItem = ({ id, path, icon, children, colorMode, ...rest }) => {
    const router = useRouter();
    const bgColor = useColorModeValue("#F7F7F8", "#444654");
  
    const pathId = path.split("/")[2];
  
    return (
      <Box
        onClick={() => router.push(`/chat/${id}`)}
        style={{ textDecoration: "none" }}
        _focus={{ boxShadow: "none" }}
        
      >
        <Flex
        
          isTruncated
          noOfLines={1}
          mt={"0.7em"}
          align="center"
          // bg={pathId === id ? '#F79229' :"#444654"}
          bg={pathId === id ? "#F79229" : bgColor}
          p="4"
          color={colorMode === "light" ? "#343541" : "#fff"}
          borderRadius="6"
          role="group"
          cursor="pointer"
          _hover={{
            bg: "#F79229",
            color: "white",
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: "white",
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Box>
    );
  };
