import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/navigation";

export default function HomeCard({ icon, title, description, path }) {
  const bgColor = useColorModeValue("#fff", "#444654");
  const router = useRouter();
  return (
    <Box
      p={"1"}
      cursor={"pointer"}
      borderRadius={10}
      mt={5}
      w={["100%", "100%", "100%", "25%", "25%"]}
      onClick={() => router.push(path)}
      bgGradient={"linear-gradient(90.54deg, #aa1ecd 36.69%, #f79229 91.01%)"}
    >
      <Card bg={bgColor}>
        <CardHeader pb={0}>{icon}</CardHeader>
        <CardBody pb={0}>
          <Heading size={"sm"}>{title}</Heading>
        </CardBody>
        <CardFooter>{description}</CardFooter>
      </Card>
    </Box>
  );
}
