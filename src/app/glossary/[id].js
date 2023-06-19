"use client"
import { Box, Button, FormControl, FormLabel, Input, Text, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import { FiUpload } from 'react-icons/fi'
import { useAuth } from '../../components/AuthContextWrapper'
import { useRouter } from 'next/navigation'

export default function Page() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const fileInput = useRef();
    const [name,setName] = useState();
    const [language,setLanguage] = useState();
    const {user} = useAuth();
    const [glossaries,setGlossaries] = useState([]);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const file = fileInput.current.files[0];
        const formData = new FormData();
        formData.append('user_id', user.id);
        formData.append('language', language);
        formData.append('name', name);
        formData.append('file', file);
    
        try {
          const response = await fetch('http://localhost:8080/glossaries/upload', {
            method: 'POST',
            body: formData,
          });
    
          if (response.ok) {
            alert('Glossaries uploaded successfully!');
          } else {
            alert('Error uploading glossaries');
          }
        } catch (error) {
          console.error('Error uploading glossaries:', error);
          alert('Error uploading glossaries');
        }
      };

      useEffect(() => {
        fetch(`http://localhost:8080/glossaries/${user.id}`).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to fetch glossaries');
    }
  })
  .then(data => {
    // Process the fetched glossaries
    setGlossaries(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
      
        return () => {
          null
        }
      }, [])
      
  return (
    <Box p={'3%'}>
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
    <Text>Manage all your glossaries here!</Text>
    <TableContainer  borderRadius={10}>
  <Table mt={'2%'} variant='simple'>
    <Thead >
      <Tr >
        <Th>Name</Th>
        <Th>Language</Th>
        <Th >Industry</Th>
        <Th >Created</Th>
        <Th >Last Updated</Th>
        <Th >Status</Th>
        
      </Tr>
    </Thead>
    <Tbody>
        {
          glossaries?.map((each,i) =>{

            return(
              <>
              <Tr cursor={'pointer'} onClick={() => router.push(`/glossaries/${user.id}/${each.id}`)}>
              <Td>{each.name}</Td>
              <Td>{each.language}</Td>
              <Td>{each.language}</Td>
              <Td>{each.created_at}</Td>
              <Td>{each.updated_at}</Td>
              </Tr>
              </>
            )
          })
        }

    </Tbody>

  </Table>
</TableContainer>

<Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent >
          <ModalHeader>Create glossary</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <FormControl _hover={{border: '#F79229'}} border={'#27272F'} id="name">
              <FormLabel>Name</FormLabel>
              <Input  onInput={(e) => setName(e.target.value)} type="text" />
            </FormControl>
          <FormControl _hover={{border: '#F79229'}} border={'#27272F'} id="industry">
              <FormLabel>Language</FormLabel>
              <Input  onInput={(e) => setLanguage(e.target.value)} type="text" />
            </FormControl>
            <input type="file" ref={fileInput} accept=".xlsx,.xls" required />

            <Button
                mt={'2%'}
          color={"#F79229"}
          borderColor={"#F79229"}
          mb={0}
          variant={"outline"}
          borderWidth={2}
          w={"fit-content"}
          leftIcon={<FiUpload />}
          onClick={handleSubmit}
        >
          Upload glossary
        </Button>
          </ModalBody>

          <ModalFooter>
      
      
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
