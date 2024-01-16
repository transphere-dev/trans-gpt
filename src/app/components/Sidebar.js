import React from "react";
import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Text,
  useColorMode,
  Button,
  Image,
  FormControl,
  Input,
  Select,
} from "@chakra-ui/react";
import { FiMoon, FiSun, FiPlus, FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContextWrapper";
import { useGPT } from "./GptProvider";

const light_logo = "/images/logo-color.png";
const dark_logo = "/images/logo-white.png";

export const SidebarContent = ({ module, onClose, ...rest }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const { logout } = useAuth();
  const { models, setApiKey, apiKey, setModel, model ,loadingModels} = useGPT();

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
        <FormControl mt="5%">
          <Input
            placeholder="OpenAI API Key"
            onInput={(e) => {
              setApiKey(e.target.value);
              localStorage.setItem("AK", e.target.value);
            }}
            type="password"
            value={apiKey}
          />
        </FormControl>
        <Select
          mt={"5%"}
          mb={"7%"}
          onChange={(e) => {
            setModel(e.target.value);
          }}
          placeholder={loadingModels ? `Loading models...` : `GPT model`}
        >
          {models?.map((each, i) => {
            return (
              <option key={i} value={each?.id}>
                {each?.id}
              </option>
            );
          })}
        </Select>

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
