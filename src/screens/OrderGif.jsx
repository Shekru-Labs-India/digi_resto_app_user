import React, { useContext } from 'react';
import lightModeGif from "../assets/gif/order-success-test.gif";
import darkModeGif from "../assets/gif/order-success-test.gif";
import { ThemeContext } from '../context/ThemeContext.js';

const OrderGif = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div >
      <img 
        src={isDarkMode ? darkModeGif : lightModeGif} 
        alt="Cooking stew" 
        className='img-fluid'
      />
    </div>
  );
};

export default OrderGif;