import React, { createContext, useState, useContext, useEffect } from 'react';
import config from '../component/config';

const CartContext = createContext();

// Custom hook for using cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart data from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem('restaurant_cart_data');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart).order_items || []);
    }
  }, []);

  // New function to fetch menu prices
  const fetchMenuPrices = async (restaurantId, menuId) => {
    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/get_full_half_price_of_menu`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },

          body: JSON.stringify({
            outlet_id: localStorage.getItem("outlet_id"),
            menu_id: menuId,
          }),
        }
      );

      const data = await response.json();
      
      if (data.st === 1) {
        return {
          halfPrice: data.menu_detail.half_price,
          fullPrice: data.menu_detail.full_price
        };
      }
      throw new Error('Failed to fetch menu prices');
    } catch (error) {
      console.error('Error fetching menu prices:', error);
      return null;
    }
  };

  const addToCart = async (menuItem, restaurantId) => {
    try {
      const prices = await fetchMenuPrices(restaurantId, menuItem.menu_id);
      if (!prices) {
        throw new Error('Failed to fetch menu prices');
      }

      const finalPrice = menuItem.half_or_full === 'half' ? prices.halfPrice : prices.fullPrice;
      const standardizedMenuItem = {
        menu_id: menuItem.menu_id,
        menu_name: menuItem.menu_name || menuItem.name || null,
        menu_food_type: menuItem.menu_food_type || menuItem.food_type || null,
        outlet_id: restaurantId || null,
        menu_cat_id: menuItem.menu_cat_id || menuItem.category_id || null,
        menu_cat_name: menuItem.menu_cat_name || menuItem.category_name || null,
        category_name: menuItem.category_name || menuItem.menu_cat_name || null,
        spicy_index: menuItem.spicy_index || null,
        price: finalPrice,
        rating: menuItem.rating || null,
        offer: menuItem.offer || 0,
        is_special: menuItem.is_special || false,
        is_favourite: menuItem.is_favourite || 0,
        image: menuItem.image || null,
        quantity: menuItem.quantity,
        comment: menuItem.comment || menuItem.notes || "",
        half_or_full: menuItem.half_or_full || "full",
        discountedPrice: menuItem.offer
          ? Math.floor(finalPrice * (1 - menuItem.offer / 100))
          : finalPrice,
      };

      const existingCartData = JSON.parse(localStorage.getItem('restaurant_cart_data') || '{"order_items": []}');
      const existingItemIndex = existingCartData.order_items.findIndex(
        item => item.menu_id === menuItem.menu_id && item.half_or_full === menuItem.half_or_full
      );

      let updatedOrderItems;
      if (existingItemIndex >= 0) {
        updatedOrderItems = existingCartData.order_items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, ...standardizedMenuItem, quantity: item.quantity + menuItem.quantity }
            : item
        );
      } else {
        updatedOrderItems = [...existingCartData.order_items, standardizedMenuItem];
      }

      const newCartData = {
        outlet_id: restaurantId,
        order_items: updatedOrderItems,
      };
      
      localStorage.setItem('restaurant_cart_data', JSON.stringify(newCartData));
      setCartItems(updatedOrderItems);

      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  const removeFromCart = async (menuId) => {
    try {
      const existingCartData = JSON.parse(localStorage.getItem('restaurant_cart_data') || '{"order_items": []}');
      const updatedOrderItems = existingCartData.order_items.filter(
        item => item.menu_id !== menuId
      );

      const newCartData = {
        ...existingCartData,
        order_items: updatedOrderItems
      };

      localStorage.setItem('restaurant_cart_data', JSON.stringify(newCartData));
      setCartItems(updatedOrderItems);
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  };

  const updateCartItemQuantity = async (menuId, quantity) => {
    try {
      const existingCartData = JSON.parse(localStorage.getItem('restaurant_cart_data') || '{"order_items": []}');
      const updatedOrderItems = existingCartData.order_items.map(item =>
        item.menu_id === menuId ? { ...item, quantity } : item
      );

      const newCartData = {
        ...existingCartData,
        order_items: updatedOrderItems
      };

      localStorage.setItem('restaurant_cart_data', JSON.stringify(newCartData));
      setCartItems(updatedOrderItems);
      return true;
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      return false;
    }
  };

  const clearCart = () => {
    try {
      localStorage.removeItem('restaurant_cart_data');
      setCartItems([]);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  };

  const isMenuItemInCart = (menuId) => {
    return cartItems.some(item => item.menu_id === menuId);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      clearCart,
      isMenuItemInCart,
      getCartItemCount,
      fetchMenuPrices
    }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };
