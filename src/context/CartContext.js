import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

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

  const updateCart = useCallback(async (customerId, restaurantId) => {
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
  }, [cartId]);

  const isMenuItemInCart = useCallback((menuId) => {
    return cartItems.some(item => item.menu_id === menuId);
  }, [cartItems]);

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
            half_or_full: item.half_or_full,
            notes: item.notes,
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1) {
        setCartItems((prevItems) => {
          const existingItem = prevItems.find(i => i.menu_id === item.menu_id);
          if (existingItem) {
            return prevItems.map(i => 
              i.menu_id === item.menu_id ? { ...i, quantity: i.quantity + 1 } : i
            );
          }
          return [...prevItems, { ...item, quantity: 1 }];
        });
        setCartId(data.cart_id);
      } else {
        // Handle error case
        console.error("Failed to add item to cart:", data.msg);
        throw new Error(data.msg || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error; // Re-throw the error so it can be caught in the component
    }
  };

  const removeFromCart = async (itemId, customerId, restaurantId) => {
    if (!cartId) {
      console.error("Cart ID is missing");
      return;
    }
  
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
        setCartItems((prevItems) => {
          const updatedItems = prevItems.filter((item) => item.menu_id !== itemId);
          return updatedItems;
        });
  
        if (cartItems.length === 0) {  // It will be 0 after the removal
          setCartId(null);
        }
      } else {
        console.error("Failed to remove item from cart:", data.msg);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
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
