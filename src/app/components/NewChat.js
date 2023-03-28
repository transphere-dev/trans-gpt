import React from 'react'
import onboarding from "../../../public/images/home.svg";
import logo from "../../../public/images/transgpt-dark.svg";
import { Image } from "@chakra-ui/next-js";
import { Box, Center, Flex, Heading , Text } from "@chakra-ui/react";
import HomeCard from "../components/HomeCard";
import {
  RiTranslate2,RiSearch2Line
} from 'react-icons/ri';


export default function NewChat() {
  return (
<>
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
    

    
    
      <Flex flexDirection={'column'} w={'50%'} position={'fixed'} bottom={'8%'} zIndex={2} left={'30%'} right={'30%'}  >
      <Center display={['none','none','none','flex','flex']}>
      <Image src={onboarding} />
      </Center>
      

      </Flex>
    </>
  )
}
