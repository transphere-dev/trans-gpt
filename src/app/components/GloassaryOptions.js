import { Select, Switch, Text , Button} from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import { Router } from 'next/router';
import React, { useEffect, useState } from 'react'
import { highlightGlossaryTerms } from '../lib/misc';
import { useGlossary } from './GlossaryProvider';
import { useTranslation } from './TranslationProvider';

export default function GloassaryOptions() {
    const {glossaries,fetchTerms,terms,glossary,setGlossary,setHighlight,highlight} = useGlossary()
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
    
    useEffect(() => {
      if(glossaryMap) {
        const t = lookupGlossaryTerm(terms[10].term)
       

      }
   }, [glossaryMap]);

   const lookupGlossaryTerm = (term) => {
    return glossaryMap.get(term) || [];
  };
  return (
        <>
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
             {fileData && <Button onClick={() => setFileData(null)} mt={'5%'} w={'100%'}>Remove translations</Button>}
        </>
  )
}
