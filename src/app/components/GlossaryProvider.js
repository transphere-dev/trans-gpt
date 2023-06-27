// GlossaryContext.js
import React, {  useState, useEffect, useContext, createContext } from "react";
import { useAuth } from "./AuthContextWrapper";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  useDisclosure,
  useColorModeValue,
  FormControl,
  Textarea,
  FormLabel,
  Button,
  Flex,
  FormHelperText
} from '@chakra-ui/react'
import { FiRefreshCcw, FiSave } from "react-icons/fi";
const GlossaryContext = createContext({});

const defaultSystemPrompt = `You are a veteran translator.\nYou will be provided with short sentences to translate.\nYou have these requirements:=
1. Translate the short sentences into English.
2. Use the glossary only if glossary terms are provided, for reference and ensure you replace any matching glossary terms in the sentences with matching translations. 
3. Aside from the translation, do not provide any other output. 
4. Do not use quotes, unless if they are part of the provided text.
`
const otherMsg = `5. Fictionalize any new character names into English ones. If there are any historical characters, use their internationally acknowledged English names.
6. Fictionalize any new real place names, such as country names and city names.
7. Fictionalize unit of currency, length, distance, area, capacity, temperature and weight.
8. American English is preferred as our comics are available mainly in North American markets.
9. Comic enjoys a big young market, so the texts should be translated in a flexible, colloquial and idiomatic way using popular words, idioms, slang words, etc. to cater to young readers. Free translation is recommended but accuracy and fluency must be maintained.
10. Sensitive words, such as fuck, damn, and shit in any language should have one of their letters be replaced with *.
11. Religious words or concepts, like god, karma, Jesus, devil, Taoism, Buddhism, Christianity should be avoided.
12. Content related to pornography, violence, gamble, drugs or underage children should be deleted or processed with caution.
13. Use English words for numbers from 0 to 10, and Arabic numerals for numbers above 10.
14. Use abbreviations whenever possible. For example, use OK instead of Okay.
15. Avoid real game names like Fortnite, Honor of Kings.`

export const GlossaryProvider = ({children}) => {
  const {user} = useAuth();
  const [error, setError] = useState("");
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [glossaries,setGlossaries] = useState([]);
  const [glossary,setGlossary] = useState(null);
  const [highlight,setHighlight] = useState(false);
  const [systemPrompt,setSystemPrompt] = useState(defaultSystemPrompt);
  const { isOpen, onOpen, onClose } = useDisclosure();



    useEffect(() => {
        fetch(`http://192.168.4.62:8080/glossaries/${user?.id}`).then(response => {
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
  


   const fetchTerms = async (glossary_id) => {
    await fetch(`http://192.168.4.62:8080/glossaries/${user?.id}/glossary/${glossary_id}`).then(response => {
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
  }

  return (
    <GlossaryContext.Provider value={{glossaries,fetchTerms,terms,glossary,setGlossary,highlight,setHighlight,onOpen,onclose,systemPrompt,setSystemPrompt}}>
      {children}
      <Modal  size={"lg"}  isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h={'70%'}  color={useColorModeValue("#444654", "#fff")} >
          <ModalHeader>GPT System message</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <FormControl h={'90%'}  _hover={{border: '#F79229'}} border={'#27272F'} id="name">
              <FormLabel>Prompt</FormLabel>
              <FormHelperText mb={'4%'} align={'left'} fontSize={13}>The default prompt has been carefully designed. Please use a similar format.  </FormHelperText>

              <Textarea size={'sm'} h={'70%'} value={systemPrompt}  onInput={(e) => setSystemPrompt(e.target.value)} defaultValue={systemPrompt} type="text" />
            </FormControl>
 
     
            <Flex justifyContent={'space-between'}>
        
        <Button
            color={"#F79229"}
            borderColor={"#F79229"}
            mb={0}
            variant={"outline"}
            borderWidth={2}
            w={"fit-content"}
            leftIcon={<FiSave />}
            onClick={() => {setSystemPrompt(systemPrompt);onClose()}}
            >
            Save
          </Button>   
          
                   <Button
            color={"#F79229"}
            borderColor={"#F79229"}
            mb={0}
            variant={"outline"}
            borderWidth={2}
            w={"fit-content"}
            leftIcon={<FiRefreshCcw />}
            onClick={() => setSystemPrompt(defaultSystemPrompt)}
            >
            Reset to default
          </Button>
        </Flex>

          </ModalBody>

          <ModalFooter>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </GlossaryContext.Provider>
  );
};

export const useGlossary = () => useContext(GlossaryContext);
