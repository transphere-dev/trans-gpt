import { Select, Switch, Text , Button, Circle, Flex, Center} from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { highlightGlossaryTerms } from '../lib/misc';
import { useGlossary } from './GlossaryProvider';
import { useTranslation } from './TranslationProvider';
import ExportButton from '../components/ExportButton'

export default function GloassaryOptions() {
    const {glossaries,fetchTerms,terms,glossary,setGlossary,setHighlight,highlight,onOpen,setModel,models,model} = useGlossary()
    const {fileData, setFileData} = useTranslation();
    const router = useRouter()
    const [glossaryMap, setGlossaryMap] = useState(null);
  

    // useEffect(() => {
    //   if(highlight){
    //     highlightGlossaryTerms(terms)
    //   }
    
    //   return () => {
    //     null
    //   }
    // }, [highlight])

    useEffect(() => {
       if(terms && terms.length > 0) {

        const buildGlossaryMap = () => {
          const map = new Map();
          for (const item of terms) {
            const term = item.term;
            const target = item.target;
            if (map.has(term)) {
              const existingTargets = map.get(term);
              map.set(term, [...existingTargets, ...target]);
            } else {
              map.set(term, target);
            }
          }
          setGlossaryMap(map);
        };
  
      buildGlossaryMap();
       }
    }, [glossary,terms]);

    const selectGlossary = (e) => {
      setGlossary(e.target.innerText); 
      fetchTerms(e.target.value)
    }
    
  //   useEffect(() => {
  //     if(glossaryMap) {
  //       const t = lookupGlossaryTerm(terms[0].term)
  //      console.log(t);

  //     }
  //  }, [glossaryMap]);

   const lookupGlossaryTerm = (term) => {
    return glossaryMap.get(term) || [];
  };
  return (
        <>
        {/* <Flex mt={'12%'} alignItems={'center'}>
        <Circle p={1} bg={'none'} border={'solid gray'} color={'gray'} borderWidth={2}  w={'5'} h={'5'}>
          <Center>
          <Text fontSize={11}>1</Text>
          </Center>
        </Circle>
        <Text fontSize={14} ml={'2%'}>Select the GPT model</Text>

        </Flex> */}
        <Select mt={'5%'} mb={'7%'} onChange={ e =>{ setModel(e.target.value)}}    placeholder='GPT model'>
            {
                models?.map((each,i) => {
                    return(
                        <option  key={i} value={each?.id}>{each?.id}</option>

                    )
                })
            }

    </Select>
    <Select mt={'5%'} mb={'7%'} onChange={ e =>{ selectGlossary(e)}} placeholder='Select Glossary'>
            {
                glossaries?.map((each,i) => {
                    return(
                        <option key={i} value={each?.id}>{each?.name}</option>

                    )
                })
            }

    </Select>
    <Text>Highlight terms in the glossary</Text>
               <Switch
               colorScheme={"orange"}
               id="diff-switcher"
               value={highlight}
               isChecked={highlight}
               onChange={(e) => setHighlight(!highlight)}
             />
             <Button onClick={() => router.push('/glossary')} mt={'5%'} w={'100%'}>Upload Glossary</Button>
              <Button onClick={onOpen} mt={'5%'} w={'100%'}>Prompt</Button>
              <ExportButton fileName="Translations" />
             {fileData && <Button onClick={() => setFileData(null)} mt={'5%'} w={'100%'}>Remove translations</Button>}
        </>
  )
}
