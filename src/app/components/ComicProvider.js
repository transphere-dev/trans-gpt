// ComicContext.js
import React, {  useState, useEffect, useContext, createContext } from "react";
import { useAuth } from "./AuthContextWrapper";
import {useTranslation} from './TranslationProvider'


const ComicContext = createContext({});

export const ComicProvider = ({children}) => {
  const {user} = useAuth();
  const [error, setError] = useState("");
  const [ocrLoading, setOCRLoading] = useState(false);
  const [comics, setComics] = useState([]);
  const [comic, setComic] = useState(null);
  const {fileData,setFileData} = useTranslation()
 

  const fetchComics = async () => {
    await fetch(`http://${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_PORT}/api/comics/${user?.id}`).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to fetch comics');
      }
    })
    .then(data => {
      // Process the fetched terms
      setComics(data.files);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
  const handleOCR = async (comicId) => {
    setOCRLoading(true)
    const payload = {
      userId: user?.id,
      comicName: comic
    }
    
   await fetch(`http://${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_PORT}/api/comics/ocr`,{

     method:"POST",
     mode:"cors",
     headers: {
     "Content-Type": "application/json",
     },
     body: JSON.stringify(payload)
   })
   .then(response => {
     if (response.ok) {
       return response.json();
     } else {
       throw new Error('Failed to extract test from the comic');
     }
   })
   .then(data => {
     const comicData = JSON.parse(data.data)

      setFileData(comicData.comic)
       })
   .catch(error => {
     console.error('Error:', error);
   })
   .finally(() => setOCRLoading(false))
 }

  return (
    <ComicContext.Provider value={{fetchComics,handleOCR,comics,comic,setComic,ocrLoading, setComics }}>
      {children}

    </ComicContext.Provider>
  );
};

export const useComic = () => useContext(ComicContext);
