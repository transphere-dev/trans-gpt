"use client"
import React from 'react';
import { Button, Center, Heading, Text ,useColorModeValue} from '@chakra-ui/react';
import { useAuth } from '../components/AuthContextWrapper';
import { useSearchParams } from 'next/navigation';

const Page = () => {
    const textColor = useColorModeValue('#333333', '#D1D5DB');
    const {resendVerificationEmail} = useAuth();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');


  return (
    <Center color={textColor} bgColor={useColorModeValue('white','gray.900')} flexDirection={'column'} h={'100%'}>
      <Heading mb={'2%'}>Your email is not verified</Heading>
      <Text align={'center'}>
        <br/> Please check your inbox for a verification email. If you didn&apos;t receive the email or need a new one, click the
        button below.
      </Text>
      <Button mt={'2%'} onClick={() => resendVerificationEmail(email)}>Resend Verification Email</Button>

    </Center>
  );
};


export default Page;
