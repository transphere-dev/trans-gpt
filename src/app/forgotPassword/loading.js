"use client"
import { Center, Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

export default function loading() {
    let arr = [1,2,3]
  return (
<Stack>
    {
        arr.map((each,i) => (
        <Center key={i}>
        <Skeleton mt={'1%'} w={'90%'} height='20px' />
        </Center>
        ))
    }

  

</Stack>  )
}
