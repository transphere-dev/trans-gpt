import React, {  } from "react";
import {
  IconButton,
  Avatar,
  Box,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Text,
  Menu,
  MenuButton,
  MenuList,
  useColorMode,
  Button,
} from "@chakra-ui/react";
import {
  FiMenu,
  FiChevronDown,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContextWrapper";
import { useGlossary } from "./GlossaryProvider";

export const NavBar = ({ onOpen, ...rest }) => {
  const { colorMode } = useColorMode();
  const {models,model} = useGlossary()

  const {user}  =useAuth()
  const router = useRouter();
  const bgColor =useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
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
                bg={bgColor}
                borderColor={borderColor}
              >
                {/* <MenuItem>Profile</MenuItem> */}
                {/* <MenuItem>Settings</MenuItem> */}
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
