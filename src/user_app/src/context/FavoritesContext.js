import React, { createContext, useState, useContext, useCallback } from 'react';
import config from "../component/config"
import { usePopup } from './PopupContext';
import { getDeviceToken } from "../services/apiService";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { showLoginPopup } = usePopup();

  const fetchFavorites = useCallback(async (user_id, restaurantId) => {
    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/get_all_menu_list_by_category`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },

          body: JSON.stringify({
            user_id: user_id,
            outlet_id: restaurantId,
          }),
        }
      );

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

  const addFavorite = async (item, user_id, restaurantId) => {
    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/save_favourite_menu`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            user_id: user_id,
            outlet_id: restaurantId,
            menu_id: item.menu_id,
            device_token: getDeviceToken(),
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("user_id");
        localStorage.removeItem("userData");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("access_token");
        localStorage.removeItem("customerName");
        localStorage.removeItem("mobile");
        showLoginPopup();
        return;
      }

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

  const removeFavorite = async (itemId, user_id, restaurantId) => {
    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/remove_favourite_menu`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            user_id: user_id,
            outlet_id: restaurantId,
            menu_id: itemId,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("user_id");
        localStorage.removeItem("userData");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("access_token");
        localStorage.removeItem("customerName");
        localStorage.removeItem("mobile");
        showLoginPopup();
        return;
      }

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