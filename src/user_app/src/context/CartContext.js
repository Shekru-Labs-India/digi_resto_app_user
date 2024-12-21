import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import config from "../component/config"
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  const [cartId, setCartId] = useState(() => {
    return localStorage.getItem('cartId') || null;
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (cartId) {
      localStorage.setItem('cartId', cartId);
    } else {
      localStorage.removeItem('cartId');
    }
  }, [cartId]);

  const updateCart = useCallback(async (user_id, restaurantId) => {
    if (!user_id || !restaurantId || !cartId) return;

    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/get_cart_detail_add_to_cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: cartId,
            user_id: user_id,
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
      console.clear();
      setCartItems([]);
    }
  }, [cartId]);

  const isMenuItemInCart = useCallback((menuId) => {
    return cartItems.some(item => item.menu_id === menuId);
  }, [cartItems]);

  const navigate = useNavigate();

  const addToCart = async (item, restaurantId) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.user_id) {
      throw new Error("User not logged in");
    }
  
    if (!restaurantId) {
      const storedRestaurantId = localStorage.getItem("restaurantId");
      if (!storedRestaurantId) {
        throw new Error("Restaurant ID not found");
      }
      restaurantId = storedRestaurantId;
    }
  
    if (isMenuItemInCart(item.menu_id)) {
      throw new Error("Item is already in the cart");
    }
  
    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/add_to_cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userData.user_id,
            role: userData.role,
            restaurant_id: restaurantId,
            menu_id: item.menu_id,
            quantity: item.quantity || 1,
            half_or_full: item.half_or_full,
            comment: item.comment,
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1) {
        setCartItems((prevItems) => [...prevItems, { 
          ...item,
          quantity: item.quantity || 1,
          restaurant_id: restaurantId
        }]);
        setCartId(data.cart_id);
        
        if (!localStorage.getItem("restaurantId")) {
          localStorage.setItem("restaurantId", restaurantId);
        }
      } else {
        console.clear();
        throw new Error(data.msg || "Failed to add item to cart");
      }
    } catch (error) {
      console.clear();
      throw error;
    }
  };

  const removeFromCart = async (menuId, user_id, restaurantId) => {
    try {
      const cartId = localStorage.getItem("cartId");
      
      const response = await fetch(
        `${config.apiDomain}/user_api/remove_from_cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            menu_id: menuId,
            user_id: user_id,
            restaurant_id: restaurantId,
            cart_id: cartId
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1) {
        // Immediately update the cartItems state
        setCartItems(prevItems => prevItems.filter(item => item.menu_id !== menuId));
        window.dispatchEvent(new Event("cartUpdated"));
        return true;
      }
      return false;
    } catch (error) {
      console.clear();
      return false;
    }
  };

  const clearCart = () => {
    setCartItems([]);
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
    isMenuItemInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
