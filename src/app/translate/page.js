"use client";

import {
  Flex,
  Table,
  Button,
  TableContainer,
  useColorModeValue,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorMode,
  useEventListener,
  useToast,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import TranslationBox from "../components/TranslationBox";
import DragFile from "../components/DragFile";
import { read, utils } from "xlsx";
import { useTranslation } from "../components/TranslationProvider";
import {
  RiChat1Line,
  RiPieChartLine,
  RiTranslate2,
  RiUpload2Fill,
} from "react-icons/ri";
import { generateTranslationPrompt } from "../lib/misc";
import { useGlossary } from "../components/GlossaryProvider";
import { useGPT } from "../components/GptProvider";
import Analysis from "../components/Analysis";
import { FiUpload } from "react-icons/fi";
import { useAuth } from "../components/AuthContextWrapper";

export default function Page() {
  const { colorMode } = useColorMode();
  const [text, setText] = useState();
  const [name,setName] = useState();
  const { fileData, setFileData } = useTranslation();
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const [allTranslation, setAllTranslation] = useState(false);
  const tableRef = useRef();
  const toast = useToast();
  const scheme = useColorMode();
  const [loading,setLoading] = useState(false);
  const { totalAccuracy } = useTranslation();
  const { terms, highlight, systemPrompt } = useGlossary();
  const { temperature, setTemperature } = useGPT();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalOpen,setModelOpen] = useState(false);
  const [modalClose,setModalClose] = useState(false);
  const btnRef = React.useRef();
  const fileInput = useRef();
  const {user} = useAuth();


  const translateAll = async () => {
    // Get all editable divs with className "source"
    const editableDivs = document.querySelectorAll(
      // 'div.source[contenteditable="true"]'
      "div.source"
    );

    // Store the inner text of each div in an array
    const innerTextArray = Array.from(editableDivs).map(
      (div) => `${div.getAttribute("sourceId")}.${div.innerText}`
    );

    // Output the inner text of each div
    innerTextArray.forEach((text) => console.log(text));

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        prompt: generateTranslationPrompt(systemPrompt, innerTextArray, terms),
        temperature: temperature,
      }),
    });

    if (!response.ok) {
      // setLoading(false);
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let isDone = false;
    let completeResp = "";

    while (!isDone) {
      const { value, done } = await reader.read();
      isDone = done;
      const chunkValue = decoder.decode(value);

      completeResp += chunkValue;

      if (chunkValue !== "[object Response]") {
        setAllTranslation((prev) =>
          prev === undefined ? "" : prev + chunkValue
        );
      } else
        toast({
          // id,
          title: "Too many translation requests",
          duration: 7000,
          status: "warning",
          description:
            "Please wait for less than 60 seconds before you translate the next string",
        });
    }

    // setLoading(false);
    // setTranslated(true);
  };

  const handleTranslateAll = async (e) => {
    setAllTranslation(true);
    console.log("clicked");
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp") {
      setActiveRowIndex((prevIndex) => Math.max(0, prevIndex - 1));
    } else if (event.key === "ArrowDown") {
      const numRows = tableRef.current.rows.length;
      setActiveRowIndex((prevIndex) => Math.min(prevIndex + 1, numRows - 1));
    }
  };

  const handleUploadComic = async (e) => {

    e.preventDefault();
  
        setLoading(true)

        const file = fileInput.current.files[0];
        const formData = new FormData();
        formData.append('user_id', user.id);
        formData.append('name', name);
        formData.append('file', file);
    
        try {
          const response = await fetch('http://localhost:8080/api/extract', {
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

  useEventListener("keydown", handleKeyDown);

  const handleFileDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const workbook = read(new Uint8Array(e.target.result), { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = utils.sheet_to_json(worksheet, { header: 1 });
      // Extract data from "source" and "target" headers
      const headers = data[0];
      const sourceIndex =
        headers.indexOf("正文") === -1
          ? headers.indexOf("Source")
          : headers.indexOf("正文");
      const translationIndex =
        headers.indexOf("目标") === -1
          ? headers.indexOf("Target")
          : headers.indexOf("目标");
      console.info(sourceIndex);

      if (sourceIndex !== -1 && translationIndex !== -1) {
        const extractedData = data.slice(1).map((row) => ({
          source: row[sourceIndex],
          target: row[translationIndex],
        }));

        setFileData(extractedData);
      } else {
        // toast.close(id);
        // if (!toast.isActive(id)) {
        toast({
          // id,
          title: "Required headers not found!",
          duration: 5000,
          status: "warning",
          description:
            "Ensure the glossary file has Source or 正文 and Target or 目标 column headers",
        });
        console.log("Required headers not found");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Flex
      h={"100%"}
      color={colorMode === "light" ? "#343541" : "#D1D5DB"}
      onDrop={handleFileDrop}
      onDragOver={(event) => {
        event.preventDefault();
        event.target.style.backgroundColor = "#ffffff20";
      }}
    >
      {!fileData ? (
        <DragFile />
      ) : (
        <TableContainer
          whiteSpace={"break-spaces"}
          h={"100%"}
          w={"100%"}
          borderRadius={10}
        >
          {fileData && (
            <Flex w={"100%"} p={"2%"}>
              <Button
                leftIcon={<RiTranslate2 />}
                onClick={handleTranslateAll}
                size={"sm"}
                colorScheme={"orange"}
              >
                Translate all
              </Button>

              <Button
                ml={"2%"}
                leftIcon={<RiPieChartLine />}
                onClick={onOpen}
                size={"sm"}
                colorScheme={"orange"}
              >
                Analytics
              </Button>
              <Button
                ml={"2%"}
                leftIcon={<RiUpload2Fill />}
                onClick={() => setModelOpen(!modalOpen)}
                size={"sm"}
                colorScheme={"orange"}
              >
                Upload Comic
              </Button>
            </Flex>
          )}
          <Table
            colorScheme={scheme.colorMode === "light" ? "facebook" : null}
            mt={"2%"}
            variant="striped"
            ref={tableRef}
          >
            <Thead>
              <Tr>
                <Th>Source</Th>
                <Th>Target</Th>
              </Tr>
            </Thead>
            <Tbody w={50}>
              {fileData?.slice(0, 42).map((each, i) => {
                return (
                  each?.source && (
                    <TranslationBox
                      scheme={scheme}
                      index={i}
                      activeRowIndex={activeRowIndex}
                      source={each?.source}
                      target={each?.target}
                      key={i}
                      allTranslation={allTranslation}
                      // translateAll={allTranslation}
                      translateAll={setAllTranslation}
                    />
                  )
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}

<Modal  isCentered isOpen={modalOpen} onClose={() => setModelOpen(false)}>
        <ModalOverlay />
        <ModalContent color={useColorModeValue("#444654", "#fff")} >
          <ModalHeader>Upload comic assets</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
        <form onSubmit={handleUploadComic}>
        <FormControl mb='5%' _hover={{border: '#F79229'}} border={'#27272F'} id="name">
              <FormLabel>Name</FormLabel>
              <Input required onInput={(e) => setName(e.target.value)} type="text" />
            </FormControl>

            <input type="file" ref={fileInput} accept=".zip,.rar" required />

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
          Upload comic
        </Button>
        </form>
          </ModalBody>

          <ModalFooter>
      
      
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Ananlytics</DrawerHeader>

          <DrawerBody>
            <Analysis accuracy={totalAccuracy} />
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}
