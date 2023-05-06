"use client"
import { Box, Button, FormControl, FormLabel, Input, Text, useDisclosure } from '@chakra-ui/react'
import React, { useRef } from 'react'
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

export default function Page() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const fileInput = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const file = fileInput.current.files[0];
        const formData = new FormData();
        formData.append('file', file);
    
        try {
          const response = await fetch('http://192.168.4.62:8080/glossaries/upload', {
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
      <Tr>
        <Td>爆红娱乐圈</Td>
        <Td>zh-CN</Td>
        <Td >Entertainment</Td>
        <Td></Td>
        <Td></Td>
        <Td>Terms</Td>
        <Td>Active</Td>
      </Tr>
    </Tbody>

  </Table>
</TableContainer>

<Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent >
          <ModalHeader>Create glossary</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          {/* <FormControl _hover={{border: '#F79229'}} border={'#27272F'} id="name">
              <FormLabel>Name</FormLabel>
              <Input  onInput={(e) => setPassword(e.target.value)} type="text" />
            </FormControl>
          <FormControl _hover={{border: '#F79229'}} border={'#27272F'} id="industry">
              <FormLabel>Industry</FormLabel>
              <Input  onInput={(e) => setPassword(e.target.value)} type="text" />
            </FormControl> */}
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
