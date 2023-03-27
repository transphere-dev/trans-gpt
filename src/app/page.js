"use client";

import { Inter } from "next/font/google";
import styles from "./page.module.css";
import onboarding from "../../public/images/home.svg";
import logo from "../../public/images/transgpt-dark.svg";
import { Image } from "@chakra-ui/next-js";
import { Box, Center, Flex, Heading , Text } from "@chakra-ui/react";
import HomeCard from "./components/HomeCard";
import {
  RiTranslate2,RiSearch2Line
} from 'react-icons/ri';
import ChatInput from "./components/ChatInput";
import { usePathname } from 'next/navigation';
import { useEffect } from "react";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const pathname = usePathname();

  useEffect(() => {
    
    console.log(pathname); // Log the current URL path

    return () => {
      null
    }
  }, [])

  return (
    <Flex position={'relative'} flexDirection={'column'} justifyContent={'space-between'}   h={'100%'} >
    {
      pathname === '/' ?
      <Flex flexDirection={'column'}>
    <Center mb={'3%'} >
     <Image src={logo} />
     </Center>
      <Heading mb={'4%'} align={'center'} size={'md'} fontWeight={'300'}>Use TransGPT for...</Heading>
      <Flex flexDirection={['column','column','column','row','row']} justifyContent={'space-evenly'} >
      <HomeCard icon={<RiTranslate2 fontSize={20}/>} title={'Translations'} description={'Use TransGPT to translate to any language'} />
      <HomeCard icon={<RiSearch2Line fontSize={20}/>} title={'Explanations'} description={'Use TransGPT to explain concepts'} />
      </Flex>
      
     
    </Flex>
    :
    <></>
    }
    
      <Flex flexDirection={'column'} w={'50%'} position={'fixed'} bottom={5} zIndex={2} left={'30%'} right={'30%'}  >
      { pathname === '/' &&
      <Center display={['none','none','none','flex','flex']}>
      <Image src={onboarding} />
      </Center>
      }
      <ChatInput />
      <Text mt={3} fontSize={'xs'} align={'center'} color={'#ACACBE'}>TransGPT March 27 Version.</Text>

      </Flex>
    </Flex>
  );
}
