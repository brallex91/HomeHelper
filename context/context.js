// GlobalContext.js
import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const GlobalProvider = ({ children }) => {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [currentHousehold, setCurrentHousehold] = useState(null);

  const value = {
    currentProfile,
    setCurrentProfile,
    currentHousehold,
    setCurrentHousehold
  };

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};
