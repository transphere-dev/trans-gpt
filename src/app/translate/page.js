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
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import TranslationBox from "../components/TranslationBox";
import DragFile from "../components/DragFile";
import { read, utils } from "xlsx";
import { useTranslation } from "../components/TranslationProvider";
import { RiTranslate2 } from "react-icons/ri";
import { generateTranslationPrompt } from "../lib/misc";
import { useGlossary } from "../components/GlossaryProvider";
import { useGPT } from "../components/GptProvider";

export default function Page() {
  const { colorMode } = useColorMode();
  const [text, setText] = useState();
  const { fileData, setFileData } = useTranslation();
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const [allTranslation, setAllTranslation] = useState(false);
  const tableRef = useRef();
  const toast = useToast();
  const scheme = useColorMode();
  const { terms, highlight, systemPrompt } = useGlossary();
  const { temperature, setTemperature } = useGPT();


  const translateAll = async () => {
    // Get all editable divs with className "source"
    const editableDivs = document.querySelectorAll(
      // 'div.source[contenteditable="true"]'
      'div.source'

    );

    // Store the inner text of each div in an array
    const innerTextArray = Array.from(editableDivs).map((div) => `${div.getAttribute('sourceId')}.${div.innerText}`);

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

     if( chunkValue !== "[object Response]"){

        setAllTranslation((prev) =>  prev === undefined ? '' : prev + chunkValue)
      
      }
        else  toast({
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

  const handleTranslateAll = async  (e) => {
    setAllTranslation(true)
    console.log('clicked');
  }

  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp") {
      setActiveRowIndex((prevIndex) => Math.max(0, prevIndex - 1));
    } else if (event.key === "ArrowDown") {
      const numRows = tableRef.current.rows.length;
      setActiveRowIndex((prevIndex) => Math.min(prevIndex + 1, numRows - 1));
    }
  };

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
            <Flex p={"2%"}>
              <Button
                leftIcon={<RiTranslate2 />}
                onClick={handleTranslateAll}
                size={"sm"}
              >
                Translate all
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
              {fileData?.slice(0, 21).map((each, i) => {
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
    </Flex>
  );
}
