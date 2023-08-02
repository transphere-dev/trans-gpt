import {
  Box,
  Center,
  Image,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { TailSpin } from "react-loader-spinner";
import onboarding from "../../../public/images/home.svg";

export default function Loading() {
  const { colorMode } = useColorMode();

  return (
    <Center
      position={"relative"}
      justifyContent={"space-evenly"}
      flexDirection={"column"}
      bgColor={useColorModeValue("white", "gray.900")}
      h={"100%"}
    >
      {colorMode === "light" ? (
        <Image src={"/images/transgpt-light.svg"} alt={"TransGPT Logo"} />
      ) : (
        <Image src={"/images/transgpt-light.svg"} alt={"TransGPT Logo"} />
      )}
      <TailSpin
        height="60"
        width="60"
        color="#f3843f"
        ariaLabel="tail-spin-loading"
        radius="2"
        wrapperStyle={{}}
        wrapperClass="loader"
        visible
      />

      <Image
        position={"fixed"}
        left={-50}
        bottom={-35}
        display={["none", "none", "flex", "flex", "flex"]}
        alt={"Login Image"}
        h={"40%"}
        src={"/images/signup.svg"}
      />
      <Image
        position={"fixed"}
        right={-50}
        bottom={-0}
        src={"/images/home.svg"}
        alt={"TransGPT Onboarding"}
      />
    </Center>
  );
}
