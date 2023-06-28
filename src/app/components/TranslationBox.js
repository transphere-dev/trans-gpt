import { Button, Editable, EditableInput, EditablePreview, Flex, Td, Tr , useToast, useOutsideClick } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { RiTranslate, RiTranslate2 } from 'react-icons/ri';
import { TailSpin } from 'react-loader-spinner';
import { generateTranslationPrompt } from '../lib/misc';
import { useGlossary } from './GlossaryProvider';
import { useGPT } from './GptProvider';
import { useTranslation } from './TranslationProvider';




export default function TranslationBox({source,target,activeRowIndex,index }) {
  const {temperature,setTemperature} = useGPT();
  const {terms,highlight,systemPrompt} = useGlossary();
  const [highlightGlossary,setHighlightGlossaryTerms] = useState();
  const [clicked,setClicked] = useState(false);
  const {sendTranslationRequest} = useTranslation();
  const [translation,setTranslation] = useState("");
  const [loading,setLoading] = useState(false);
  const editableDivRefs = useRef([]);
  const toast = useToast()

  useEffect(() => {
    if(terms.length > 0) {
      setHighlightGlossaryTerms(highlightGlossaryTerms(source, terms))
    }
       
 }, [terms]);
 
 useEffect(() => {
  const timer = setTimeout(() => {
    editableDivRefs.current[activeRowIndex]?.focus();
  }, 0);

  return () => clearTimeout(timer);
}, [activeRowIndex]);

 const translate = async (text) => {
  setTranslation("");
  setLoading(true);

  const payload = {
    messages: generateTranslationPrompt(systemPrompt,[text],terms),
    // max_tokens: 100,
    temperature: temperature,
    n: 1,
    // stop: '\nGlossary',
    model: "gpt-3.5-turbo",
    stream:true
  };
  
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload),
  });
  console.log(response.status)

  if (!response.ok) {
    setLoading(false);
    throw new Error(response.statusText);
    
  }

  const data = response.body;
  if (!data) {
    console.log(data);
    return;
  }
  const reader = data.getReader();
  const decoder = new TextDecoder();
  let isDone = false;

  while (!isDone) {
    const { value, done } = await reader.read();
    isDone = done;
    const chunkValue = decoder.decode(value);

    
    chunkValue !== '[object Response]' ? setTranslation((prev) => prev + chunkValue)
     : 
     toast({
      // id,
      title: "Too many translation requests",
      duration: 7000,
      status: "warning",
      description: 'Please wait for less than 60 seconds before you translate the next string'
    })
  }

  setLoading(false);
};

 const highlightGlossaryTerms = (text, glossary) => {
  let highlightedSentence = text;
  glossary.forEach((item) => {
    const term = item.term;
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    highlightedSentence = highlightedSentence.replace(term, `<strong><span id="${term.id}" class="highlight">${term}</span></strong>`);
  });
  return highlightedSentence;
};

const handleClickOutside = () => {
  // The click is outside the desired element
  // Add your desired logic here
  setClicked(!clicked)
};

const ref = useRef();

useOutsideClick({
  ref,
  handler: clicked && handleClickOutside,
});

  return (
    <Tr className='table-row' ref={ref}>
      <Td 
      bg={index === activeRowIndex && "orange.300" } color={index === activeRowIndex && "#000" } 
       
      onFocus={() => console.info('i')} 
       w={'50%'} onClick={() => setClicked(!clicked)}>
       
        {         
        highlight && terms.length > 0 ? <div contentEditable dangerouslySetInnerHTML={{ __html:  highlightGlossary}} />
        :
        <Editable ref={(element) => (editableDivRefs.current[index] = element)} className="string-div" defaultValue={source}>
        <EditablePreview />
        <EditableInput />

      </Editable>
}

{clicked && <Button leftIcon={<RiTranslate2 />} size={'sm'} onClick={() => translate(source)} mt="2%">Translate</Button>}
      </Td>
      <Td w={'50%'} >
    {loading &&  <TailSpin
            
            height="15"
            width="15"
            color="#f3843f"
            ariaLabel="tail-spin-loading"
            radius="2"
            wrapperStyle={{}}
            wrapperClass="loader"
            visible
          />}
        {/* <Editable defaultValue={ translation }>
          <EditablePreview  />
          <EditableInput />
        </Editable> */}
        <div>{translation ? translation : target}</div>
      </Td>
    </Tr>
  );
}
