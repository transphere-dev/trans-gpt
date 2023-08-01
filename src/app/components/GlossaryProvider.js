// GlossaryContext.js
import React, { useState, useEffect, useContext, createContext } from "react";
import { useAuth } from "./AuthContextWrapper";

const GlossaryContext = createContext({});

// Glossary provider stores all Glossary-related data

export const GlossaryProvider = ({ children }) => {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [glossaries, setGlossaries] = useState([]);
  const [glossary, setGlossary] = useState(null);
  const [highlight, setHighlight] = useState(false);

  // Fetch user glossaries
  useEffect(() => {
    fetch(`http://192.168.4.62:8080/glossaries/${user?.id}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch glossaries");
        }
      })
      .then((data) => {
        // Process the fetched glossaries
        setGlossaries(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    return () => {
      null;
    };
  }, []);


  // Fetch terms of a specific glossary
  const fetchTerms = async (glossary_id) => {
    await fetch(
      `http://192.168.4.62:8080/glossaries/${user?.id}/glossary/${glossary_id}`
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
    <GlossaryContext.Provider
      value={{
        glossaries,
        fetchTerms,
        terms,
        glossary,
        setGlossary,
        highlight,
        setHighlight,
      }}
    >
      {children}

    </GlossaryContext.Provider>
  );
};

export const useGlossary = () => useContext(GlossaryContext);
