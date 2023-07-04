import React from "react";
import onboarding from "../../../public/images/home.svg";
import logoDark from "../../../public/images/transgpt-dark.svg";
import logoLight from "../../../public/images/transgpt-light.svg";
import { Image } from "@chakra-ui/next-js";
import {
  Box,
  Center,
  Flex,
  Heading,
  Tag,
  TagLabel,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import HomeCard from "../components/HomeCard";
import { Kbd } from "@chakra-ui/react";
import { RiTranslate2, RiSearch2Line } from "react-icons/ri";

export default function NewChat() {
  const textColor = useColorModeValue("#444654", "#fff");
  const { colorMode } = useColorMode();

  return (
    <>
      <Flex flexDirection={"column"}>
        <Center mb={"3%"} mt={"3%"}>
          {colorMode === "light" ? (
            <Image src={logoLight} alt={"TransGPT Logo"} />
          ) : (
            <Image src={logoDark} alt={"TransGPT Logo"} />
          )}
        </Center>
        <Heading
          mb={"3%"}
          color={textColor}
          align={"center"}
          size={"md"}
          fontWeight={"300"}
        >
          Use TransGPT for...
        </Heading>

        <Flex
          flexDirection={["column", "column", "column", "row", "row"]}
          justifyContent={"space-evenly"}
        >
          <HomeCard
            icon={<RiTranslate2 fontSize={20} />}
            title={"Translations"}
            description={"Use TransGPT to translate to any language"}
            path={'translate'}
          />
          <HomeCard
            icon={<RiSearch2Line fontSize={20} />}
            title={"Glossary"}
            description={"Use TransGPT with your own glossaries"}
            path={'glossary'}
          />
        </Flex>
        <Center justify={'left'} color={textColor} flexDirection={'column'}>
        <Text>To start, Click on New Chat</Text>
        <br/>
          <Flex>
            New Line: <Kbd ml={4} mr={4}>shift</Kbd> + <Kbd ml={4}>Enter</Kbd>
            
          </Flex>
          <br/>
          <Flex>
          Submit: <Kbd ml={4}>Enter</Kbd>
          </Flex>
        </Center>
      </Flex>

      <Flex
        flexDirection={"column"}
        w={"50%"}
        position={"fixed"}
        bottom={"8%"}
        zIndex={2}
        left={"30%"}
        right={"30%"}
      >
        <Center display={["none", "none", "none", "flex", "flex"]}>
          <Image src={onboarding} alt={"TransGPT Onboarding"} />
        </Center>
      </Flex>
    </>
  );
}
