import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext.js';
import OrderGifOP from "../assets/gif/cooking.gif";

const OrderGif = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div>
      <img src={OrderGifOP} alt="Cooking stew" className="img-fluid" />
    </div>
  );
};

export default OrderGif;