"use client"
import React, { useState } from 'react';
import { Button, Center, Heading, Text ,useColorModeValue} from '@chakra-ui/react';
import { useAuth } from '../components/AuthContextWrapper';
import { useSearchParams } from 'next/navigation';

const Page = () => {
    const textColor = useColorModeValue('#333333', '#D1D5DB');
    const {resendVerificationEmail} = useAuth();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const [loading,setLoading] = useState(false)

    const resendEmail = async () => {
      setLoading(true)
      await resendVerificationEmail(email)

      setLoading(false)
       
    }

  return (
    <Center color={textColor} bgColor={useColorModeValue('white','gray.900')} flexDirection={'column'} h={'100%'}>
      <Heading mb={'2%'}>Your email is not verified</Heading>
      <Text align={'center'}>
        <br/> Please check your inbox for a verification email. If you didn&apos;t receive the email or need a new one, click the
        button below.
      </Text>
      <Button isLoading={loading} mt={'2%'} onClick={resendEmail}>Resend Verification Email</Button>

    </Center>
  );
};


export default Page;
