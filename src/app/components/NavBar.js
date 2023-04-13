import React, { ReactNode, useContext } from "react";
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
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContextWrapper";

export const NavBar = ({ onOpen, ...rest }) => {
  const { colorMode } = useColorMode();
  const {user}  =useAuth()
  const router = useRouter();

  return (
    <Flex

    // ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      w={"100%"}
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        {/* {colorMode === 'light' ? <Image src={light_logo} /> : <Image src={dark_logo}   />} */}
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        {user ? (
          <Flex
            color={colorMode === "light" ? "#343541" : "#D1D5DB"}
            alignItems={"center"}
          >
            <Menu>
              <MenuButton
                py={2}
                transition="all 0.3s"
                _focus={{ boxShadow: "none" }}
              >
                <HStack>
                  <Avatar
                    size={"sm"}
                    src={
                      "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                    }
                  />
                  <VStack
                    display={{ base: "none", md: "flex" }}
                    alignItems="flex-start"
                    spacing="1px"
                    ml="2"
                  >
                    <Text fontSize="sm">{user?.username}</Text>
                    <Text fontSize="xs" color="gray.600">
                      {user?.email}
                    </Text>
                  </VStack>
                  <Box display={{ base: "none", md: "flex" }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList
                bg={useColorModeValue("white", "gray.900")}
                borderColor={useColorModeValue("gray.200", "gray.700")}
              >
                <MenuItem>Profile</MenuItem>
                <MenuItem>Settings</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        ) : (
          <Button
            onClick={() => router.push("/login")}
            _hover={{ background: "#fff" , color: '#000' }}
            color={"#fff"}
            bg={"#F79229"}
            variant={"solid"}
          >
            Login
          </Button>
        )}
      </HStack>
    </Flex>
  );
};
