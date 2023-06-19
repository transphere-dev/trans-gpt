import React, { ReactNode, useContext, useState } from "react";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorMode,
  Button,
  Image,
  Skeleton,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiMoon,
  FiSun,
  FiMessageCircle,
  FiPlus,
  FiLogOut,
  FiUpload,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { ReactText } from "react";
import ChatContext from "../contexts/ChatContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContextWrapper";

const light_logo = "/images/logo-color.png";
const dark_logo = "/images/logo-white.png";

export const SidebarContent = ({ module,onClose, ...rest }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const pathname = usePathname();
  const { logout,user } = useAuth();

  // Add new chat to the chat list

  const addNewChat = () => {
    const chatRoomId = Date.now();
    router.push(`/chat/${chatRoomId}`);
  };

  return (
    <Box
      color={colorMode === "light" ? "#343541" : "#D1D5DB"}
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60, lg: 300 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          {colorMode === "light" ? (
            <Image src={light_logo} alt={"Transphere Sunyu Logo"} />
          ) : (
            <Image src={dark_logo} alt={"Transphere Sunyu Logo"} />
          )}
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <Box p={4} overflowY={"auto"} h={"70%"}>
        {/* Modules */}
        <Button
          color={"#F79229"}
          borderColor={"#F79229"}
          mb={0}
          mt={"auto"}
          variant={"outline"}
          borderWidth={2}
          w={"100%"}
          leftIcon={<FiPlus />}
          onClick={addNewChat}
        >
          New Chat
        </Button>

            {module}

      </Box>
      <Box p={"4"}>
        <Button
          mb={7}
          mt={"auto"}
          variant={"outline"}
          borderWidth={2}
          w={"100%"}
          leftIcon={colorMode === "light" ? <FiMoon /> : <FiSun />}
          onClick={toggleColorMode}
        >
          {colorMode === "light" ? "Dark Mode" : "Light Mode"}
        </Button>
        <Button
          leftIcon={<FiLogOut />}
          variant={"ghost"}
          w={"100%"}
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

