import React, { createContext, useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const RestaurantIdContext = createContext();

export const useRestaurantId = () => {
  return useContext(RestaurantIdContext);
};

export const RestaurantIdProvider = ({ children }) => {
  const [restaurantId, setRestaurantId] = useState(null);
  const { restaurantCode } = useParams();
  console.log("Restaurant Code:", restaurantCode);
  useEffect(() => {
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
              restaurant_code: restaurantCode
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Assuming data.restaurant_details.restaurant_id is the correct property
          setRestaurantId(data.restaurant_details.restaurant_id);
        } else {
          console.error("Failed to fetch restaurant details");
        }
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    };

    if (restaurantCode) {
      fetchRestaurantDetails();
    }
  }, [restaurantCode]);

  return (
    <RestaurantIdContext.Provider value={{ restaurantId }}>
      {children}
    </RestaurantIdContext.Provider>
  );
};
