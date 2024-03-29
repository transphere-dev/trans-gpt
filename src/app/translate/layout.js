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
import React from "react";
import { useAuth } from "../components/AuthContextWrapper";
import GloassaryOptions from "../components/GloassaryOptions";
import { GlossaryProvider } from "../components/GlossaryProvider";
import { TranslationProvider } from "../components/TranslationProvider";
import { ComicProvider } from "../components/ComicProvider";

export default function Layout({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();

  return (
    <GlossaryProvider>
      <TranslationProvider>
        <ComicProvider>
          <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
            <SidebarContent
              onClose={() => onClose}
              display={{ base: "none", md: "block" }}
              module={<GloassaryOptions />}
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
                  module={<GloassaryOptions />}
                />
              </DrawerContent>
            </Drawer>

            <NavBar onOpen={onOpen} user={user} />
            <Box ml={{ base: 0, md: 60, lg: 300 }}>{children}</Box>
            <Box h={"12rem"}></Box>
          </Box>
        </ComicProvider>
      </TranslationProvider>
    </GlossaryProvider>
  );
}
