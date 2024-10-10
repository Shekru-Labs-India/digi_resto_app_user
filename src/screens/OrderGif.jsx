import React, { useContext } from 'react';
import lightModeGif from "../assets/gif/order-success-test.gif";
import darkModeGif from "../assets/gif/order-success-test.gif";
import { ThemeContext } from '../context/ThemeContext.js';

const OrderGif = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <img 
        src={isDarkMode ? darkModeGif : lightModeGif} 
        alt="Cooking stew" 
        style={{ width: '100%', height: '70%' }} 
      />
    </div>
  );
};

export default OrderGif;