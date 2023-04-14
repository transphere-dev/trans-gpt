"use client"
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
  } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
  
  export default function Page({params}) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const router = useRouter();

    const handleResetPasswordSubmit = async () => {
      const token = params.token
      if (password !== confirmPassword) {
        // Show an error message
        setError("Passwords don't match!")
        return;
      }
  
      try {
        setSuccess('');
        setError('');
        const response = await fetch('http://localhost:8080/api/users/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, password }),
        });
  
        if (response.ok) {
          // Show a success message or navigate to the login page
          setSuccess('A password reset link has beeen set to your email!')

        } else {
          // Show an error message
          const res = await response.json()
          const err = res.msg
          setError(err)

        }
      } catch (error) {
        console.error('Error submitting reset password form:', error);
        // Show an error message
        setError(error.message)

      }
    };

    return (
      <Stack  bgColor={'#27272F'}  minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
        
                <Flex  pl={['3%','3%','3%','4%','7%']} alignItems={'flex-start'} justifyContent={'center'} flexDirection={'column'} flex={1}>
                <Heading color={'#F79229'} mb={'4%'}>
                Welcome back!
                                  </Heading>

                  <Text  mb={'9%'}>Enhance your translations, grammar and knowledge with TransGPT!</Text>
          <Image
          display={['none','none','flex','flex','flex']}
            alt={'Login Image'}
            h={'40%'}
            src={
              '/images/signup.svg'
            }
          />
        </Flex>
        <Flex color={'#27272F'} bgColor={'#fff'} p={'12%'} flexDirection={'column'} flex={1} align={'center'} justify={'center'}>
        <Heading pb={['5%','5%','5%','11%','11%']}>Reset Password</Heading>
        <Text fontWeight={"500"} color={error ? 'red' : 'green'}>{error || success}</Text>

          <Stack spacing={4} w={'full'} maxW={'md'}>
          <FormControl _hover={{border: '#F79229'}} border={'#27272F'} id="email">
              <FormLabel>New Password</FormLabel>
              <Input onInput={(e) => setPassword(e.target.value)} type="password" />
            </FormControl>
            <FormControl _hover={{border: '#F79229'}} border={'#27272F'} id="email">
              <FormLabel>Confirm Password</FormLabel>
              <Input onInput={(e) => setConfirmPassword(e.target.value)} type="password" />
            </FormControl>


            <Stack spacing={6}>

              <Button onClick={handleResetPasswordSubmit}  _hover={{background: '#27272F'}} color={'#fff'} bg={'#F79229'} variant={'solid'}>
                Reset
              </Button>
              <Text cursor={'pointer'} onClick={() => router.push('/login')} align={'center'} >Already have an account? Log in</Text>

            </Stack>
          </Stack>
        </Flex>

      </Stack>
    );
  }