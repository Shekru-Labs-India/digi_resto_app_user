import React, { createContext, useState, useContext, useEffect } from 'react';

const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [lastOnlineTime, setLastOnlineTime] = useState(Date.now());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNetworkModal(false);
      setLastOnlineTime(Date.now());
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNetworkModal(true);
    };

    // Check connection speed
    const checkConnectionSpeed = async () => {
      if (!navigator.onLine) return;

      try {
        const startTime = performance.now();
        const response = await fetch('https://www.google.com/favicon.ico');
        const endTime = performance.now();
        
        const duration = endTime - startTime;
        if (duration > 3000) { // If response takes more than 3 seconds
          setShowNetworkModal(true);
        }
      } catch (error) {
        setShowNetworkModal(true);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection speed every 30 seconds
    const intervalId = setInterval(checkConnectionSpeed, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, []);

  const networkAwareFetch = async (fetchFunction, options = {}) => {
    if (!isOnline) {
      setShowNetworkModal(true);
      throw new Error('No internet connection');
    }

    try {
      const result = await fetchFunction();
      return result;
    } catch (error) {
      if (!navigator.onLine) {
        setShowNetworkModal(true);
      }
      throw error;
    }
  };

  return (
    <NetworkContext.Provider value={{
      isOnline,
      showNetworkModal,
      setShowNetworkModal,
      networkAwareFetch,
      lastOnlineTime
    }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};