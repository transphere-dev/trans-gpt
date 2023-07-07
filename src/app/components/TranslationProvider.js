// TranslationContext.js
import React, {  useState, useEffect, useContext, createContext } from "react";
import { generateTranslationPrompt } from "../lib/misc";
import { OpenAIStream } from "../lib/OpenAIStream";
import { useAuth } from "./AuthContextWrapper";
import { useGlossary } from "./GlossaryProvider";

const apiKey = "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";

export const config = {
  runtime: "edge",
};

const TranslationContext = createContext({});

export const TranslationProvider = ({children}) => {
  const {user} = useAuth();
  const [error, setError] = useState("");
  const {terms, setTerms,systemPrompt} = useGlossary();
  const [loading, setLoading] = useState(false);
  const [glossaries,setTranslations] = useState([]);
  const [translation,setTranslation] = useState(null);
  const [highlight,setHighlight] = useState(false);
  const [fileData, setFileData] = useState(null)
  const [timeTaken, setTimeTaken] = useState(0)
  const [totalAccuracy, setTotalAccuracy] = useState(0)
  const [totalTranslation, setTotalTranslation] = useState(0)
  const [totalStrings, setTotalStrings] = useState(0)


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
        setTranslations(data);
    })
    .catch(error => {
    console.error('Error:', error);
    });
    
    return () => {
      null
    }
  }, [])
  
  async function sendTranslationRequest(text) {
    try {
      const requestBody = {
        messages: generateTranslationPrompt(systemPrompt,[text],terms),
        // max_tokens: 100,
        temperature: 0.7,
        n: 1,
        stop: '\nGlossary',
        model: "gpt-3.5-turbo",
      };
  
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
        "access-control-allow-origin": "*"
      });
  
      const responseData = await response.json();
      console.log(responseData.choices[0].message.content);
      try {

        const resp = JSON.parse(responseData.choices[0].message.content)
        return resp
      } catch (error) {
        console.log('wrong format')
      }

    } catch (error) {
      console.error('Error occurred:', error);
      throw error;
    }
  }
  

  


   const fetchTerms = async (translation_id) => {
    await fetch(`http://192.168.4.62:8080/glossaries/${user?.id}/translation/${translation_id}`).then(response => {
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
    <TranslationContext.Provider value={{sendTranslationRequest,fileData, setFileData,timeTaken,
      totalStrings, setTotalStrings, setTimeTaken,totalAccuracy, setTotalAccuracy,totalTranslation, setTotalTranslation}}>
      {children}

    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
