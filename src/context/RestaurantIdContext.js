import React, { createContext, useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

const RestaurantIdContext = createContext();

export const useRestaurantId = () => {
  return useContext(RestaurantIdContext);
};

export const RestaurantIdProvider = ({ children }) => {
  const [restaurantDetails, setRestaurantDetails] = useState(() => {
    const savedDetails = localStorage.getItem("restaurantDetails");
    return savedDetails ? JSON.parse(savedDetails) : null;
  });
  const [restaurantId, setRestaurantId] = useState(() => {
    const savedId = localStorage.getItem("restaurantId");
    return savedId ? JSON.parse(savedId) : null;
  });
  const { restaurantCode } = useParams();

  useEffect(() => {
    console.log("Restaurant code changed:", restaurantCode); // Add this line
    const fetchRestaurantDetails = async () => {
      try {
        const response = await fetch(
          "https://menumitra.com/user_api/get_restaurant_details_by_code",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              restaurant_code: restaurantCode,
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data.st === 1 && data.restaurant_details) {
            console.log("New restaurant details:", data.restaurant_details); // Add this line
            console.log("New restaurant ID:", data.restaurant_details.restaurant_id); // Add this line
            setRestaurantDetails(data.restaurant_details);
            setRestaurantId(data.restaurant_details.restaurant_id);

            // Save fetched details to local storage
            localStorage.setItem(
              "restaurantDetails",
              JSON.stringify(data.restaurant_details)
            );
            localStorage.setItem(
              "restaurantId",
              JSON.stringify(data.restaurant_details.restaurant_id)
            );
          } else {
            throw new Error("Invalid response format");
          }
        } else {
          throw new Error("Failed to fetch restaurant details");
        }
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
        setRestaurantDetails(null);
        setRestaurantId(null);
        localStorage.removeItem("restaurantDetails");
        localStorage.removeItem("restaurantId");
      }
    };

    if (restaurantCode) {
      fetchRestaurantDetails();
    }
  }, [restaurantCode]);

  return (
    <RestaurantIdContext.Provider
      value={{ restaurantDetails, restaurantId, restaurantCode }}
    >
      {children}
    </RestaurantIdContext.Provider>
  );
};
