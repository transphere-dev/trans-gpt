import { Button } from '@chakra-ui/react'
import React from 'react'
import { RiBook2Line, RiTranslate2 } from 'react-icons/ri'
import { useRouter } from "next/navigation";

export default function Modules() {
    const router = useRouter();

  return (
    <>
    
    <Button onClick={() => router.push('/translate')}  w={'100%'} mt={'4%'}  leftIcon={<RiTranslate2 />}>Translate</Button>
    <Button onClick={() => router.push('/glossary')} w={'100%'} mt={'4%'}  leftIcon={<RiBook2Line  />}>Glossary</Button>
    </>
  )
}
