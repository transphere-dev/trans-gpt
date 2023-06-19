"use client"

import { Flex, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useColorMode } from '@chakra-ui/react';
import React, { useState } from 'react'
import TranslationBox from '../components/TranslationBox'
import { read, utils } from 'xlsx';

export default function Page() {
    const { colorMode } = useColorMode();
    const [text,setText] = useState();
    const [fileData, setFileData] = useState(null);

  const handleFileDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const workbook = read(new Uint8Array(e.target.result), { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = utils.sheet_to_json(worksheet, { header: 1 });
      // Extract data from "source" and "target" headers
      const headers = data[0];
      const sourceIndex =  headers.indexOf('正文');
      const translationIndex = headers.indexOf('Target');

      if (sourceIndex !== -1 && translationIndex !== -1) {
        const extractedData = data.slice(1).map((row) => ({
          source: row[sourceIndex],
          target: row[translationIndex],
        }));

        setFileData(extractedData);
      } else {
        console.log('Required headers not found');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Flex  color={colorMode === "light" ? "#343541" : "#D1D5DB"} 
    onDrop={handleFileDrop}
    onDragOver={(event) => event.preventDefault()}
    >
    <TableContainer whiteSpace={'break-spaces'} h={'100%'}  w={'100%'}  borderRadius={10}>
  <Table mt={'2%'} variant='simple'>
    <Thead >
      <Tr >
        <Th>Source</Th>
        <Th>Target</Th>

        
      </Tr>
    </Thead>
    <Tbody w={50}>
        {
          fileData?.slice(0,16).map((each,i) =>{

            return(
              
              each?.source && <TranslationBox source={each?.source} target={each?.target} key={i}/>
            )
          })
        }

    </Tbody>

  </Table>
</TableContainer>    </Flex>
  )
}
