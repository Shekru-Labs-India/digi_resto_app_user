import React, { createContext, useState, useContext, useCallback } from 'react';
import config from "../component/config"
const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = useCallback(async (customerId, restaurantId) => {
    try {
      const response = await fetch(`${config.apiDomain}/user_api/get_all_menu_list_by_category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customerId,
          restaurant_id: restaurantId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1 && data.data && data.data.menus) {
          const favoriteItems = data.data.menus.filter(item => item.is_favourite === 1);
          setFavorites(favoriteItems);
        }
      }
    } catch (error) {
      console.clear();
    }
  }, []);

  const addFavorite = async (item, customerId, restaurantId) => {
    try {
      const response = await fetch(`${config.apiDomain}/user_api/save_favourite_menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customerId,
          restaurant_id: restaurantId,
          menu_id: item.menu_id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1) {
          setFavorites(prev => [...prev, {...item, is_favourite: 1}]);
        }
      }
    } catch (error) {
      console.clear();
    }
  };

  const removeFavorite = async (itemId, customerId, restaurantId) => {
    try {
      const response = await fetch(`${config.apiDomain}/user_api/remove_favourite_menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customerId,
          restaurant_id: restaurantId,
          menu_id: itemId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1) {
          setFavorites(prev => prev.filter(item => item.menu_id !== itemId));
        }
      }
    } catch (error) {
      console.clear();
    }
  };

  const isFavorite = (itemId) => favorites.some(item => item.menu_id === itemId);

  return (
    <FavoritesContext.Provider value={{ favorites, fetchFavorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);