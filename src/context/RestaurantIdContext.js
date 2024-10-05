import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const RestaurantIdContext = createContext();

export const useRestaurantId = () => {
  return useContext(RestaurantIdContext);
};

export const RestaurantIdProvider = ({ children }) => {
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantName, setRestaurantName] = useState(
    localStorage.getItem("name") || ""
  );
  const [restaurantCode, setRestaurantCode] = useState(
    localStorage.getItem("restaurantCode") || ""
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      if (!restaurantCode) return;

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
          userData.restaurantCode = restaurantCode; // Store restaurantCode
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
  }, [restaurantCode]);

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