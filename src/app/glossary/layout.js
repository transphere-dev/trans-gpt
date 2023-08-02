"use client";
import { SidebarContent } from "../components/Sidebar";
import { NavBar } from "../components/NavBar";
import {
  Box,
  Drawer,
  DrawerContent,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { useAuth } from "../components/AuthContextWrapper";
import ChatList from "../components/ChatList";
import Modules from "../components/Modules";

export default function Layout({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
        module={<Modules />}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent
            onClose={onClose}
            userId={user}
            module={<ChatList />}
          />
        </DrawerContent>
      </Drawer>

      <NavBar onOpen={onOpen} user={user} />
      <Box ml={{ base: 0, md: 60, lg: 300 }}>{children}</Box>
      <Box h={"12rem"}></Box>
    </Box>
  );
}
