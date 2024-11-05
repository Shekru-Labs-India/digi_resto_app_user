import React, { createContext, useContext, useState } from 'react';

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [showPWAPopup, setShowPWAPopup] = useState(false);

  const showLoginPopup = () => {
    setShowPWAPopup(true);
  };

  const hideLoginPopup = () => {
    setShowPWAPopup(false);
  };

  return (
    <PopupContext.Provider value={{ showPWAPopup, showLoginPopup, hideLoginPopup }}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
