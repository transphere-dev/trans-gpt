"use client"
import { useAuth } from '../../components/AuthContextWrapper';
import { Box, Button, Center, Heading, Image, Text , useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function Page({params}) {
  const [verificationStatus, setVerificationStatus] = useState('');
  const router = useRouter();
  const {logout} = useAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = params.token;
      try {
        const response = await fetch(`http://${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_PORT}/api/users/verify/${token}`);
        if (response.ok) {
          setVerificationStatus('success');
        } else {
          setVerificationStatus('error');
        }
      } catch (error) {
        setVerificationStatus('error');
      }
    };

    verifyEmail();
  }, []);

  return (
    <Center p={'4%'} flexDirection={'column'} bg={useColorModeValue('white', 'gray.900')} h={'100%'} >
      {verificationStatus === 'success' && (

        <>
                <Heading className="success-message">
          Email successfully verified! You can now <a href="/login">log in</a>.
        </Heading>

        </>
      )}
      {verificationStatus === 'error' && (
        <>
        <Heading className="error-message">
          Email verification failed. 
        </Heading>
        <Text mt={'2%'} align={'center'}>The verification link may be invalid or expired. Log into your account to verify your email.</Text>

        </>
      )}
        <Button
                mt={'2%'}
            onClick={() =>{logout(); router.push("/login")}}
            _hover={{ background: "#fff" , color: '#000' }}
            color={"#fff"}
            bg={"#F79229"}
            variant={"solid"}
          >
            Login
          </Button>
                          <Image 
                    position={'fixed'}
                    left={-50}
                    bottom={-35}
          display={['none','none','flex','flex','flex']}
            alt={'Login Image'}
            h={'40%'}
            src={
              '/images/signup.svg'
            }
          />
                    <Image
                     position={'fixed'}
                     right={-50}
                     bottom={-0} 
                    src={"/images/home.svg"} alt={"TransGPT Onboarding"} />
    </Center>
  );
}

export default Page;
