import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Td,
  Tr,
  useToast,
  useOutsideClick,
  Text,
  useDisclosure,
  Collapse,
} from "@chakra-ui/react";
import { set } from "nprogress";
import React, { useEffect, useRef, useState } from "react";
import { RiTranslate, RiTranslate2 } from "react-icons/ri";
import { TailSpin } from "react-loader-spinner";
import { generateTranslationPrompt } from "../lib/misc";
import { useGlossary } from "./GlossaryProvider";
import { useGPT } from "./GptProvider";
import { useTranslation } from "./TranslationProvider";

export default function TranslationBox({
  source,
  target,
  activeRowIndex,
  index,
  scheme,
  translateAll,
  allTranslation
}) {
  const { temperature, setTemperature } = useGPT();
  const { terms, highlight, systemPrompt } = useGlossary();
  const [highlightGlossary, setHighlightGlossaryTerms] = useState();
  const [clicked, setClicked] = useState(false);
  const { sendTranslationRequest,setTimer } = useTranslation();
  const [translation, setTranslation] = useState("");
  const [translated, setTranslated] = useState(false);
  const [toggleContent, setToggleContent] = useState(false);
  const [termInfo, setTermInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [translationHistory, setTranslationHistory] = useState([]);
  const editableDivRefs = useRef([]);
  const toast = useToast();
  const { isOpen, onToggle } = useDisclosure();


  

  useEffect(() => {
    if (terms.length > 0) {
      setHighlightGlossaryTerms(highlightGlossaryTerms(source, terms));
    }
  }, [terms]);

  //  useEffect(() => {
  //    if(highlight) {
  //     document.getElementById("term-1").addEventListener("click", function() { console.info(2)})
  //   }

  // }, [highlight]);

  useEffect(() => {
    const timer = setTimeout(() => {
      editableDivRefs.current[activeRowIndex]?.focus();
    }, 0);

    return () => clearTimeout(timer);
  }, [activeRowIndex]);

  useEffect(() => {
    if(allTranslation) {
      
    translate(source)

    translateAll(false)
    }
  
    return () => {
      null
    }
  }, [allTranslation])
  
  const translate = async (text) => {
    setTranslation("");
    setTranslated(false);
    setLoading(true);
    // console.log([
    //   ...generateTranslationPrompt(systemPrompt, [text], terms),
    //   ...translationHistory,
    // ]);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        prompt: generateTranslationPrompt(systemPrompt, [text], terms),
        temperature: temperature,
      }),
    });

    if (!response.ok) {
      setLoading(false);
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

      chunkValue !== "[object Response]"
        ? setTranslation((prev) => prev + chunkValue)
        : toast({
            // id,
            title: "Too many translation requests",
            duration: 7000,
            status: "warning",
            description:
              "Please wait for less than 60 seconds before you translate the next string",
          });

      if (isDone) {

        setTranslationHistory((prevHistory) =>
          setTranslationHistory([
            ...prevHistory,
            { role: "assistant", content: completeResp },
            generateTranslationPrompt(systemPrompt, [text], terms)[1],
          ])
        );
      }
    }

    setLoading(false);
    setTranslated(true);
  };

  const highlightGlossaryTerms = (text, glossary) => {
    let highlightedSentence = text;
    glossary.forEach((item) => {
      const term = item.term;
      const target = item.target[0].term;
      const regex = new RegExp(`\\b${term}\\b`, "gi");
      highlightedSentence = highlightedSentence.replace(
        term,
        `<strong><span id="term-${item.id}" class="highlight" target="${target}" >${term}</span></strong>`
      );
    });
    return highlightedSentence;
  };

  const handleClickOutside = () => {
    // The click is outside the desired element
    // Add your desired logic here
    setClicked(!clicked);
    setToggleContent(false);
  };
  const clickOnHighlightedTerm = (e) => {
    setClicked(true);
    const source = e.target.innerText;
    const target = e.target.getAttribute("target");

    if (highlight && source && target) {
      // const source = e.target.getAttribute("source");

      const id = e.target.id;
      const termObj = {
        id: id,
        source: source,
        target: target,
        remarks: null,
      };
      setToggleContent(true);
      setTermInfo(termObj);
    }
  };
  const ref = useRef();

  useOutsideClick({
    ref,
    handler: clicked && handleClickOutside,
  });

  return (
    <Tr  className="table-row" ref={ref}>
      <Td 
        bg={index === activeRowIndex && "orange.300"}
        color={index === activeRowIndex && "#000"}
        onFocus={() => console.info("i")}
        w={"50%"}
        onClick={() => setClicked(true)}
      >
        {highlight && terms.length > 0 ? (
          <div
          sourceId={index}
          className="source"
            style={{ padding: "2% 0px" }}
            onClick={clickOnHighlightedTerm}
            contentEditable
            dangerouslySetInnerHTML={{ __html: highlightGlossary }}
          />
        ) : (
          <Editable
          sourceId={index}
            ref={(element) => (editableDivRefs.current[index] = element)}
            className="source"
            defaultValue={source}
          >
            <EditablePreview />
            <EditableInput />
          </Editable>
        )}

        <Collapse in={clicked} animateOpacity>
          <Button
            colorScheme={scheme.colorMode === "light" ? "orange" : null}
            leftIcon={<RiTranslate2 />}
            size={"sm"}
            onClick={() => translate(source)}
            mt="2%"
          >
            {!translated ? "Translate" : "Retranslate"}
          </Button>

          {toggleContent && (
            <Flex mt={"3%"} flexDirection={"column"}>
              <Text fontWeight={300} mb={"1%"}>
                Glossary term:
              </Text>
              <Text fontWeight={600}>
                {termInfo?.source} : {termInfo?.target}
              </Text>
              {/* <Text>Target:</Text>
  <Text>{termInfo?.target}</Text> */}
              {/* <Text>Remarks:</Text>
  <Text>{termInfo?.remarks}</Text> */}
            </Flex>
          )}
        </Collapse>
      </Td>
      <Td w={"50%"}>
        {loading && (
          <TailSpin
            height="15"
            width="15"
            color="#f3843f"
            ariaLabel="tail-spin-loading"
            radius="2"
            wrapperStyle={{}}
            wrapperClass="loader"
            visible
          />
        )}
        {/* <Editable defaultValue={ translation }>
          <EditablePreview  />
          <EditableInput />
        </Editable> */}
        {/* TODO: target streaming problem */}
        <div>{translation}</div>
      </Td>
    </Tr>
  );
}
