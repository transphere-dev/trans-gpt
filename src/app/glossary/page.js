"use client"
import ISO6391 from 'iso-639-1';
import { Box, Button, FormControl, FormLabel, Input, Text, useColorMode, useDisclosure ,Select, useColorModeValue} from '@chakra-ui/react'
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
    useToast
  } from '@chakra-ui/react'
import { FiUpload } from 'react-icons/fi'
import { useAuth } from '../components/AuthContextWrapper'
import { useRouter } from 'next/navigation'
import { read, utils } from 'xlsx';


export default function Page() {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const fileInput = useRef();
    const [name,setName] = useState();
    const [language,setLanguage] = useState()
    const [valid,setValid] = useState(false);
    const [loading,setLoading] = useState(false);
    const {user} = useAuth();
    const [glossaries,setGlossaries] = useState([]);
    const [langs,setLangs] = useState([]);
    const router = useRouter();
    const toast = useToast()

      
  const isFileValid = async (event) => {
    const file = fileInput.current.files[0];

    const reader = new FileReader();
    reader.onload = function (e) {
      const workbook = read(new Uint8Array(e.target.result), { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = utils.sheet_to_json(worksheet, { header: 1 });
      // Extract data from "source" and "target" headers
      const headers = data[0];
      const sourceIndex =  headers.indexOf('Source');
      const translationIndex = headers.indexOf('Target');


      if (sourceIndex !== -1 && translationIndex !== -1)  setValid(true)
      else {
        // toast.close(id);
        // if (!toast.isActive(id)) {
        toast({
          // id,
          title: "Required headers not found!",
          duration: 7000,
          status: "warning",
          description: 'Ensure the glossary file has Source and Target column headers'
        });
        console.log('Required headers not found');
        setValid(false)
      }
    };
    reader.readAsArrayBuffer(file);
    return valid
  };
    const handleSubmit = async (e) => {

      e.preventDefault();
    
          setLoading(true)

          const file = fileInput.current.files[0];
          const formData = new FormData();
          formData.append('user_id', user.id);
          formData.append('language', language);
          formData.append('name', name);
          formData.append('file', file);
      
          try {
            const response = await fetch(`http://${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_PORT}/glossaries/upload`, {
              method: 'POST',
              body: formData,
            });
            const data = await response.json()

            toast({
              // id,
              title: data?.message || "Uploaded successfully",
              duration: 7000,
              status: data?.success ? "success" : "warning",
              description: data?.success && !data?.success &&  'Ensure the glossary file has Source and Target column headers'

            })
            data?.id && setGlossaries(prev => setGlossaries([...prev,data]))
            setLoading(false)
          } catch (error) {
            setLoading(false)
            console.error('Error uploading glossaries:', error);

            toast({
              // id,
              title: "Required headers not found!",
              duration: 7000,
              status: "warning",
              description: 'Ensure the glossary file has Source and Target column headers'
            })
          }
        
       
      }

  useEffect(() => {
      setLangs(ISO6391.getAllCodes())

        fetch(`http://${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_PORT}/glossaries/${user?.id}`).then(response => {
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
    <Box color={useColorModeValue("#444654", "#fff")}  p={'3%'}>
                <Button
                mr={0}
                ml={'auto'}
          color={"#F79229"}
          borderColor={"#F79229"}
          mb={'2%'}
          mt={"auto"}
          variant={"outline"}
          borderWidth={2}
          w={"fit-content"}
          leftIcon={<FiUpload />}
          onClick={onOpen}
          isLoading={loading}
          loadingText={'Uploading...'}
        >
          Upload glossary
        </Button>
    <Text>Ensure the glossary file has Source and Target column headers</Text>
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
              <Tr cursor={'pointer'} onClick={() => router.push(`/glossary/terms/${each.id}`)}>
              <Td>{each.name}</Td>
              <Td>{each.language}</Td>
              <Td> - </Td>
              <Td>{each.created_at}</Td>
              <Td>{each.updated_at}</Td>
              <Td> - </Td>
              </Tr>
              </>
            )
          })
        }

    </Tbody>

  </Table>
</TableContainer>

<Modal  isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent color={useColorModeValue("#444654", "#fff")} >
          <ModalHeader>Create glossary</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
        <form onSubmit={handleSubmit}>
        <FormControl _hover={{border: '#F79229'}} border={'#27272F'} id="name">
              <FormLabel>Name</FormLabel>
              <Input required onInput={(e) => setName(e.target.value)} type="text" />
            </FormControl>
          <FormControl _hover={{border: '#F79229'}} border={'#27272F'} id="language">
              <FormLabel>Language</FormLabel>
              <Select required mt={'5%'} mb={'7%'} onChange={ (e) => setLanguage(e.target.value)} placeholder='Select Language'>
            {
                langs?.map((each,i) => {
                    return(
                        <option key={i} value={each}>{each}</option>

                    )
                })
            }

    </Select>
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

          isLoading={loading}
          loadingText={'Uploading...'}
          type="submit"
          >
          Upload glossary
        </Button>
        </form>
          </ModalBody>

          <ModalFooter>
      
      
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
