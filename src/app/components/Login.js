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
import { useContext, useEffect, useState } from 'react';
import {  useAuth } from './AuthContextWrapper';
  
  export default function Login() {
    const router = useRouter();
    const {login,error,setError} = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading,setLoading] = useState(false);


    useEffect(() => {


      return () => {
        setError(null)
      };
    }, []);

    const userLogin = async  () => {
      if(email  && password){
        setLoading(true)

        try {
          await login(email, password)
          // ... handle successful login

        } catch (error) {
          // ... handle login error
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    }
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
        <Heading pb={['5%','5%','5%','11%','11%']}>Log in</Heading>
        <Text fontWeight={"500"} color={'red'}>{error}</Text>

          <Stack spacing={4} w={'full'} maxW={'md'}>
            <FormControl _hover={{border: '#F79229'}} border={'#27272F'} id="email">
              <FormLabel>Email address</FormLabel>
              <Input onInput={(e) => setEmail(e.target.value)} type="email" />
            </FormControl>
            <FormControl _hover={{border: '#F79229'}} border={'#27272F'} id="password">
              <FormLabel>Password</FormLabel>
              <Input  onInput={(e) => setPassword(e.target.value)} type="password" />
            </FormControl>

            <Stack spacing={6}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox>Remember me</Checkbox>
                <Text cursor={'pointer'} onClick={() => router.push('/forgotPassword')} >Forgot password?</Text>
              </Stack>
              <Button 
                       isLoading={loading}
                       loadingText={"Logging in..."}
                        onClick={userLogin}
              _hover={{background: '#27272F'}} color={'#fff'} bg={error ? 'red' : '#F79229'} variant={'solid'}>
                Login
              </Button>
              <Text cursor={'pointer'} onClick={() => router.push('/signup')} align={'center'} >Don&apos;t have an account? Sign up</Text>

            </Stack>
          </Stack>
        </Flex>

      </Stack>
    );
  }