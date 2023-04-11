"use client";
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Updock } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerUser } from "../lib/requests";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const router = useRouter();


    const signup = () => {
      setLoading(true)

      registerUser( `U-${Date.now()}` , email, password , confirmPassword).then(
        (success) => {
          if (success) {
            console.log("User registered successfully");
            router.push("/chat")
          } else {
            console.log("User registration failed");
            
          }
        }
      )
      .finally(() => {
        setLoading(false)
      })
    }
  return (
    <Stack
      bgColor={"#27272F"}
      minH={"100vh"}
      direction={{ base: "column", md: "row" }}
    >
      <Flex
        pl={["3%", "3%", "3%", "4%", "7%"]}
        alignItems={"flex-start"}
        justifyContent={"center"}
        flexDirection={"column"}
        flex={1}
      >
        <Heading color={"#F79229"} mb={"4%"}>
          Get Started Now
        </Heading>

        <Text mb={"9%"}>
          Enhance your translations, grammar and knowledge with TransGPT!
        </Text>
        <Image
          display={["none", "none", "flex", "flex", "flex"]}
          alt={"Login Image"}
          h={"40%"}
          src={"/images/signup.svg"}
        />
      </Flex>
      <Flex
        color={"#27272F"}
        bgColor={"#fff"}
        p={"12%"}
        flexDirection={"column"}
        flex={1}
        align={"center"}
        justify={"center"}
      >
        <Heading pb={["5%", "5%", "5%", "11%", "11%"]}>Sign up now</Heading>

        <Stack spacing={4} w={"full"} maxW={"md"}>
          <FormControl
            _hover={{ border: "#F79229" }}
            border={"#27272F"}
            id="email"
          >
            <FormLabel>Email address</FormLabel>
            <Input onInput={(e) => setEmail(e.target.value)} type="email" />
          </FormControl>
          <FormControl
            _hover={{ border: "#F79229" }}
            border={"#27272F"}
            id="password"
          >
            <FormLabel>Password</FormLabel>
            <Input onInput={(e) => setPassword(e.target.value)} type="password" />
          </FormControl>
          <FormControl
            _hover={{ border: "#F79229" }}
            border={"#27272F"}
            id="con-password"
          >
            <FormLabel>Confirm Password</FormLabel>
            <Input onInput={(e) => setConfirmPassword(e.target.value)} type="password" />
          </FormControl>
          <Stack spacing={6}>
            <Stack
              direction={{ base: "column", sm: "row" }}
              align={"start"}
              justify={"space-between"}
            >
              <Checkbox>Remember me</Checkbox>
              <Text>Forgot password?</Text>
            </Stack>
            <Button
            isLoading={loading}
            loadingText={"Signing Up..."}
              onClick={signup}
              _hover={{ background: "#27272F" }}
              color={"#fff"}
              bg={"#F79229"}
              variant={"solid"}
            >
              Sign up
            </Button>
            <Text
              onClick={() => router.push("/login")}
              cursor={"pointer"}
              align={"center"}
            >
              Already have an account? Log in
            </Text>
          </Stack>
        </Stack>
      </Flex>
    </Stack>
  );
}
