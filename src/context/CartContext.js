import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null);

  useEffect(() => {
    const storedCartId = localStorage.getItem('cartId');
    if (storedCartId) {
      setCartId(storedCartId);
    }
  }, []);

  const updateCart = async (customerId, restaurantId) => {
    if (!customerId || !restaurantId || !cartId) return;

    try {
      const response = await fetch(
        "https://menumitra.com/user_api/get_cart_detail_add_to_cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: cartId,
            customer_id: customerId,
            restaurant_id: restaurantId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.st === 1 && data.order_items) {
        setCartItems(data.order_items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart details:", error);
      setCartItems([]);
    }
  };

  const addToCart = async (item, customerId, restaurantId) => {
    try {
      const response = await fetch(
        "https://menumitra.com/user_api/add_to_cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: customerId,
            restaurant_id: restaurantId,
            menu_id: item.menu_id,
            quantity: item.quantity || 1,
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1) {
        setCartItems((prevItems) => [...prevItems, item]);
        setCartId(data.cart_id);
        localStorage.setItem('cartId', data.cart_id);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const removeFromCart = async (itemId, customerId, restaurantId) => {
    try {
      const response = await fetch(
        "https://menumitra.com/user_api/remove_from_cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: cartId,
            customer_id: customerId,
            restaurant_id: restaurantId,
            menu_id: itemId,
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1) {
        setCartItems((prevItems) => prevItems.filter((item) => item.menu_id !== itemId));
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartId');
    setCartId(null);
  };

  const value = {
    cartItems,
    cartId,
    setCartId,
    updateCart,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};