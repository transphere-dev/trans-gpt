import React, { useState } from "react";

import {
  Button,
  Center,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAuth } from "./AuthContextWrapper";

const EmailVerify = ({ email, onResendVerification }) => {
  const textColor = useColorModeValue("#333333", "#D1D5DB");
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const resendEmail = async () => {
    setLoading(true);
    await onResendVerification(email);

    setLoading(false);
  };

  return (
    <Center
      color={textColor}
      bgColor={useColorModeValue("white", "gray.900")}
      flexDirection={"column"}
      h={"100%"}
    >
      <Heading mb={"2%"}>Your email is not verified</Heading>
      <Text align={"center"}>
        We noticed that your email address (<strong>{email}</strong>) has not
        been verified yet.
        <br /> Please check your inbox for a verification email. If you
        didn&apos;t receive the email or need a new one, click the button below.
      </Text>
      <Button isLoading={loading} mt={"2%"} onClick={resendEmail}>
        Resend Verification Email
      </Button>
      <Button mt={"2%"} onClick={logout}>
        Logout
      </Button>
    </Center>
  );
};

export default EmailVerify;
