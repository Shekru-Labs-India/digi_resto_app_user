import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

const RestaurantIdContext = createContext();

export const useRestaurantId = () => {
  return useContext(RestaurantIdContext);
};

export const RestaurantIdProvider = ({ children }) => {
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantCode, setRestaurantCode] = useState("");
  const navigate = useNavigate();
  const lastFetchedCode = useRef(null);

  useEffect(() => {
    
    const fetchRestaurantDetails = async () => {
      if (!restaurantCode || restaurantCode === lastFetchedCode.current) return;

      lastFetchedCode.current = restaurantCode;

      try {
        const response = await fetch(
          "https://menumitra.com/user_api/get_restaurant_details_by_code",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ restaurant_code: restaurantCode }),
          }
        );

        const data = await response.json();
        if (data.st === 1) {
          const { restaurant_id, name } = data.restaurant_details;
          setRestaurantId(restaurant_id);
          setRestaurantName(name);

          // Update userData in local storage
          const userData = JSON.parse(localStorage.getItem("userData")) || {};
          userData.restaurantId = restaurant_id;
          userData.restaurantName = name;
          localStorage.setItem("userData", JSON.stringify(userData));
        }

        if (data.st === 2) {
          navigate("QRScreen");
        } else {
          console.error("Failed to fetch restaurant details:", data.msg);
        }
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantCode, navigate]);

  return (
    <RestaurantIdContext.Provider
      value={{
        restaurantId,
        restaurantName,
        restaurantCode,
        setRestaurantCode,
      }}
    >
      {children}
    </RestaurantIdContext.Provider>
  );
};