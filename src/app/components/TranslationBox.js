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
  Slider,
  Image,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  ButtonGroup,
  IconButton,
  CheckboxIcon,
  Input,
  useEditableControls,
} from "@chakra-ui/react";
import { set } from "nprogress";
import React, { useEffect, useRef, useState } from "react";
import { RiCheckLine, RiCloseLine, RiEdit2Line, RiGoogleFill, RiTranslate, RiTranslate2 } from "react-icons/ri";
import { TailSpin } from "react-loader-spinner";
import { generateTranslationPrompt } from "../lib/misc";
import ComicDialog from "./comicDialog";
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
  allTranslation,
  imagePath
}) {
  const { temperature, setTemperature } = useGPT();
  const { terms, highlight, systemPrompt, model } = useGlossary();
  const [highlightGlossary, setHighlightGlossaryTerms] = useState();
  const [clicked, setClicked] = useState(false);
  const { sendTranslationRequest, setTimer } = useTranslation();
  const [translation, setTranslation] = useState("");
  const [googleTranslation, setGoogleTranslation] = useState("");
  const [deeplTranslation, setDeeplTranslation] = useState("");
  const [translated, setTranslated] = useState(false);
  const [toggleContent, setToggleContent] = useState(false);
  const [termInfo, setTermInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [deeplLoading, setDeeplLoading] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [translationHistory, setTranslationHistory] = useState([]);
  const editableDivRefs = useRef([]);
  const toast = useToast();
  const { isOpen, onToggle } = useDisclosure();

  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls()

    return isEditing ? (
      <ButtonGroup justifyContent='center' size='sm'>
        <IconButton icon={<RiCheckLine />} {...getSubmitButtonProps()} />
        <IconButton icon={<RiCloseLine />} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <Flex justifyContent='center'>
        <IconButton size='sm' icon={<RiEdit2Line />} {...getEditButtonProps()} />
      </Flex>
    )
  }



  useEffect(() => {
    if (terms.length > 0) {
      setHighlightGlossaryTerms(highlightGlossaryTerms(source, terms));
    }
  }, [terms]);


  useEffect(() => {
    const timer = setTimeout(() => {
      editableDivRefs.current[activeRowIndex]?.focus();
    }, 0);

    return () => clearTimeout(timer);
  }, [activeRowIndex]);

  useEffect(() => {
    if (allTranslation) {
      translate(index);

      translateAll(false);
    }

    return () => {
      null;
    };
  }, [allTranslation]);

  const translate = async (id) => {
    const text = document.getElementById(id).innerText;
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
        model: model,
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

      // if (isDone) {

      //   setTranslationHistory((prevHistory) =>
      //     setTranslationHistory([
      //       ...prevHistory,
      //       { role: "assistant", content: completeResp },
      //       generateTranslationPrompt(systemPrompt, [text], terms)[1],
      //     ])
      //   );
      // }
    }

    setLoading(false);
    setTranslated(true);
  };
  const googleTranslate = async (id) => {
    const text = document.getElementById(id).innerText;
    setGoogleTranslation("");
    setTranslated(false);
    setGoogleLoading(true);
    // console.log([
    //   ...generateTranslationPrompt(systemPrompt, [text], terms),
    //   ...translationHistory,
    // ]);

    const response = await fetch("http://192.168.4.62:8080/api/translate/g", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        target: 'en',
        source: text
      }),
    });

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }

    response.json()
    .then(data => console.log(data))
    .catch(err => {
      console.log(err.message);
      setGoogleLoading(false);
    })
    
    setGoogleLoading(false);
    setTranslated(true);
  };

  const deeplTranslate = async (id) => {
    const text = document.getElementById(id).innerText;
    setDeeplTranslation("");
    setTranslated(false);
    setDeeplLoading(true);
    const res = await fetch("http://192.168.4.62:8080/api/translate/d/", {
      method: "POST",
      mode: "cors",
      
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `&text=${text}&target_lang=${'en-US'}&source_lang=${'zh'}`
    })

    const translations = await res.json()
    
     setDeeplTranslation(JSON.parse(translations).translation)
     setDeeplLoading(false)

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
    <Tr className="table-row" ref={ref}>
      <Td
        bg={index === activeRowIndex && "orange.300"}
        color={index === activeRowIndex && "#000"}
        onFocus={() => console.info("i")}
        w={"50%"}
        onClick={() => setClicked(true)}
      >
        {highlight && terms.length > 0 ? (
          <div
            id={index}
            sourceId={index}
            className="source"
            style={{ padding: "2% 0px" }}
            onClick={clickOnHighlightedTerm}
            suppressContentEditableWarning
            contentEditable
            dangerouslySetInnerHTML={{ __html: highlightGlossary }}
          />
        ) : (
          <Editable
            id={index}
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
        <Flex mt={"2%"} w={"100%"} alignItems={"center"}>
            <Button
              w={"20%"}
              colorScheme={scheme.colorMode === "light" ? "orange" : null}
              leftIcon={<RiTranslate2 />}
              size={"sm"}
              onClick={() => translate(index)}
              mt="2%"
            >
              {!translated ? "Translate" : "Retranslate"}
            </Button>
            {translation && (
              <Box ml={"10%"} w={"80%"}>
                <Text fontWeight={600} size={"sm"}>
                  Accuracy: {accuracy}%
                </Text>
                <Slider
                  step={1}
                  min={0}
                  max={100}
                  defaultValue={accuracy}
                  aria-label="slider-ex-6"
                  w={"30%"}
                  onChange={(val) => setAccuracy(val)}
                >
                  <SliderTrack bg={"#F7922920"}>
                    <SliderFilledTrack bg={"#F79229"} />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Box>
            )}
                  </Flex>      
              {/* <Flex mt={"2%"} w={"100%"} alignItems={"center"}>
            <Button
              w={"20%"}
              loadingText={'Translating'}
              isLoading={googleLoading}
              colorScheme={scheme.colorMode === "light" ? "orange" : null}
              leftIcon={<RiGoogleFill />}
              size={"sm"}
              onClick={() => googleTranslate(index)}
              mt="2%"
            >
              {!translated ? "Google" : "Retranslate"}
            </Button>
            {translation && (
              <Box ml={"10%"} w={"80%"}>
                <Text fontWeight={600} size={"sm"}>
                  Accuracy: {accuracy}%
                </Text>
                <Slider
                  step={1}
                  min={0}
                  max={100}
                  defaultValue={accuracy}
                  aria-label="slider-ex-6"
                  w={"30%"}
                  onChange={(val) => setAccuracy(val)}
                >
                  <SliderTrack bg={"#F7922920"}>
                    <SliderFilledTrack bg={"#F79229"} />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Box>
            )}
          </Flex> */}
          <Flex mt={"2%"} w={"100%"} alignItems={"center"}>
            <Button
              w={"20%"}
              loadingText={'Translating'}
              isLoading={deeplLoading}
              colorScheme={scheme.colorMode === "light" ? "orange" : null}
              leftIcon={<RiTranslate />}
              size={"sm"}
              onClick={() => deeplTranslate(index)}
              mt="2%"
            >
              DeepL
              {/* {!translated ? "DeepL" : "Retranslate"} */}
            </Button>
            {/* {translation && (
              <Box ml={"10%"} w={"80%"}>
                <Text fontWeight={600} size={"sm"}>
                  Accuracy: {accuracy}%
                </Text>
                <Slider
                  step={1}
                  min={0}
                  max={100}
                  defaultValue={accuracy}
                  aria-label="slider-ex-6"
                  w={"30%"}
                  onChange={(val) => setAccuracy(val)}
                >
                  <SliderTrack bg={"#F7922920"}>
                    <SliderFilledTrack bg={"#F79229"} />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Box>
            )} */}
          </Flex>

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

{ clicked && <ComicDialog fallbackSrc='https://via.placeholder.com/150' imagePath={imagePath} />}

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

        <Flex flexDirection={"column"}>
          <div style={{marginBottom: translation && 17}} suppressContentEditableWarning contentEditable className={translation ? `gpt-translation` : null}>{translation}</div>
          
        </Flex>
     
        <Collapse in={clicked} animateOpacity>
        <Flex mt={"2%"} w={"100%"} alignItems={"center"}>

          </Flex>      
              
          {googleLoading && (
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

        <Flex flexDirection={"column"}>
          <div style={{marginBottom:deeplTranslation && 17}} suppressContentEditableWarning contentEditable className={deeplTranslation ? `deepl-translation` : null}>{deeplTranslation}</div>
          
        </Flex>
        {deeplLoading && (
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

        <Flex flexDirection={"column"}>
          <div style={{marginBottom:googleTranslation && 17}} suppressContentEditableWarning contentEditable className={googleTranslation ? `google-translation` : null}>{googleTranslation}</div>
          
        </Flex>
          
        </Collapse>
      </Td>
    </Tr>
  );
}
