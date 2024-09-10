import React, { createContext, useContext, useState, useEffect } from "react";
import { useCart as useCartHook } from "../hooks/useCart";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } =
    useCartHook();

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
