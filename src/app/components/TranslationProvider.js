// TranslationContext.js
import React, { useState, useEffect, useContext, createContext } from "react";
import { generateTranslationPrompt } from "../lib/misc";
import { OpenAIStream } from "../lib/OpenAIStream";
import { useAuth } from "./AuthContextWrapper";
import { useGlossary } from "./GlossaryProvider";
import { useGPT } from "./GptProvider";

export const config = {
  runtime: "edge",
};

const TranslationContext = createContext({});

export const TranslationProvider = ({ children }) => {
  const { user } = useAuth();
  const { systemPrompt, apiKey } = useGPT();
  const [error, setError] = useState("");
  const { terms, setTerms } = useGlossary();
  const [loading, setLoading] = useState(false);
  const [glossaries, setTranslations] = useState([]);
  const [translation, setTranslation] = useState(null);
  const [highlight, setHighlight] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [totalAccuracy, setTotalAccuracy] = useState(0);
  const [totalTranslation, setTotalTranslation] = useState(0);
  const [totalStrings, setTotalStrings] = useState(0);

  useEffect(() => {
    fetch(
      `http://${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_PORT}/glossaries/${user?.id}`
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch glossaries");
        }
      })
      .then((data) => {
        // Process the fetched glossaries
        setTranslations(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    return () => {
      null;
    };
  }, []);

  const fetchTerms = async (translation_id) => {
    await fetch(
      `http://${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_PORT}/glossaries/${user?.id}/translation/${translation_id}`
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch terms");
        }
      })
      .then((data) => {
        // Process the fetched terms
        setTerms(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <TranslationContext.Provider
      value={{
        fileData,
        setFileData,
        timeTaken,
        totalStrings,
        setTotalStrings,
        setTimeTaken,
        totalAccuracy,
        setTotalAccuracy,
        totalTranslation,
        setTotalTranslation,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
