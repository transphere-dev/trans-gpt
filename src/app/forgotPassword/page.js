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
import  React ,{ useState } from 'react';
  
  export default function Page() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const router = useRouter();

    const handleForgotPasswordSubmit = async () => {
      try {
        setSuccess('');
        setError('');
        const response = await fetch('http://localhost:8080/api/users/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
  
        if (response.ok) {
          // Show a success message or navigate to a success page
          setSuccess('A password reset link has beeen set to your email!')
        } else {
          // Show an error message
          setError('A password reset failed')

        }
      } catch (error) {
        console.error('Error submitting forgot password form:', error);
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
        <Text fontWeight={"500"} color={error ? 'red' : 'green'}>{error || success}</Text>

        <Heading pb={['5%','5%','5%','11%','11%']}>Reset Password</Heading>

          <Stack spacing={4} w={'full'} maxW={'md'}>
            <FormControl _hover={{border: '#F79229'}} border={'#27272F'} id="email">
              <FormLabel>Email address</FormLabel>
              <Input onInput={(e) => setEmail(e.target.value)} type="text" />
            </FormControl>


            <Stack spacing={6}>

              <Button onClick={handleForgotPasswordSubmit}  _hover={{background: '#27272F'}} color={'#fff'} bg={'#F79229'} variant={'solid'}>
                Reset
              </Button>
              <Text cursor={'pointer'} onClick={() => router.push('/login')} align={'center'} >Already have an account? Log in</Text>

            </Stack>
          </Stack>
        </Flex>

      </Stack>
    );
  }