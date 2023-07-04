// GptContext.js
import React, {  useState, useContext, createContext } from "react";

const GptContext = createContext({});

export const GptProvider = ({children}) => {

  const [temperature, setTemperature] = useState(0.3)


  return (
    <GptContext.Provider value={{temperature, setTemperature}}>
      {children}

    </GptContext.Provider>
  );
};

export const useGPT = () => useContext(GptContext);
