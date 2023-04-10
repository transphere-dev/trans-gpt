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
  
  export default function ForgotPassword() {
    const router = useRouter();

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

          <Stack spacing={4} w={'full'} maxW={'md'}>
            <FormControl _hover={{border: '#F79229'}} border={'#27272F'} id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" />
            </FormControl>


            <Stack spacing={6}>

              <Button  _hover={{background: '#27272F'}} color={'#fff'} bg={'#F79229'} variant={'solid'}>
                Reset
              </Button>
              <Text cursor={'pointer'} onClick={() => router.push('/login')} align={'center'} >Already have an account? Log in</Text>

            </Stack>
          </Stack>
        </Flex>

      </Stack>
    );
  }