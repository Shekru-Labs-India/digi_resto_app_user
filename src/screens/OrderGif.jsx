import React from 'react';
import stewGif from '../assets/gif/stew.gif';

const OrderGif = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <img src={stewGif} alt="Cooking stew" style={{ width: '100%', height: '70%' }} />
    </div>
  );
};

export default OrderGif;
