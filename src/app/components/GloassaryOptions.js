import { Select, Switch, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { highlightGlossaryTerms } from '../lib/misc';
import { useGlossary } from './GlossaryProvider';

export default function GloassaryOptions() {
    const {glossaries,fetchTerms,terms,glossary,setGlossary,setHighlight,highlight} = useGlossary()

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
       if(terms.length > 0) {

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
        <Select mt={'5%'} mb={'7%'} onChange={ e =>{ setGlossary(e.target.innerText); fetchTerms(e.target.value)}} placeholder='Select Glossary'>
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
        </>
  )
}
