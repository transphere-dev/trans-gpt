"use client"
import { Box, Button, FormControl, FormLabel, Input, Tag, TagLabel, TagLeftIcon, Text, useColorMode, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,

  } from '@chakra-ui/react'
import { FiUpload } from 'react-icons/fi'
import { useAuth } from '../../../components/AuthContextWrapper'
import { useRouter } from 'next/navigation'

export default function Page({params}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const fileInput = useRef();
    const [name,setName] = useState();
    const [language,setLanguage] = useState();
    const {user} = useAuth();
    const router = useRouter();
    const [terms,setTerms] = useState([]);
    const { colorMode } = useColorMode();

    const glossary_id = params.id;



      useEffect(() => {
        fetch(`http://localhost:8080/glossaries/${user?.id}/glossary/${glossary_id}`).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to fetch terms');
    }
  })
  .then(data => {
    // Process the fetched terms
    setTerms(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
      
        return () => {
          null
        }
      }, [])
      
  return (
    <Box color={colorMode === "light" ? "#343541" : "#D1D5DB"} p={'3%'}>
                <Button
                mr={0}
                ml={'auto'}
          color={"#F79229"}
          borderColor={"#F79229"}
          mb={0}
          mt={"auto"}
          variant={"outline"}
          borderWidth={2}
          w={"fit-content"}
          leftIcon={<FiUpload />}
          onClick={onOpen}
        >
          Upload glossary
        </Button>
    <Text>Manage all your terms here!</Text>
    <TableContainer  borderRadius={10}>
  <Table  mt={'2%'} variant='striped'>
    <Thead >
      <Tr >
        <Th>Source</Th>
        <Th>Target</Th>
        <Th >Target Terms</Th>
        <Th >Created</Th>
        <Th >Last Updated</Th>
        <Th >Status</Th>
        
      </Tr>
    </Thead>
    <Tbody>
        {
          terms?.map((each,i) =>{

            return(
              <>
              <Tr cursor={'pointer'}
              //  onClick={() => router.push(`/glossaries/${user.id}/${each.id}`)}
               >
              <Td>{each.term}</Td>
              <Td>{each.target[0].term}</Td>
              <Td>{each.target.length}</Td>
              <Td>{each.created_at}</Td>
              <Td>{each.updated_at}</Td>
      <Td>
      <Tag size={'md'} key={i} variant='subtle' colorScheme='cyan' borderRadius='full'>
      {/* <TagLeftIcon boxSize='12px' as={AddIc} /> */}
      <TagLabel>Active</TagLabel>
    </Tag>
      </Td>
              </Tr>
              </>
            )
          })
        }

    </Tbody>

  </Table>
</TableContainer>


    </Box>
  )
}
