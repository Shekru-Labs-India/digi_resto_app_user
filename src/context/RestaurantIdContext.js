import React, { createContext, useState, useContext, useEffect } from 'react';

const RestaurantIdContext = createContext();

export const useRestaurantId = () => {
  return useContext(RestaurantIdContext);
};

export const RestaurantIdProvider = ({ children }) => {
  const [restaurantId, setRestaurantId] = useState(null);

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
              // restaurant_code: 611447,
             restaurant_code: 117802,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setRestaurantId(data.restaurant_details.restaurant_id);
        } else {
          console.error("Failed to fetch restaurant details");
        }
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    };

    fetchRestaurantDetails();
  }, []);

  return (
    <RestaurantIdContext.Provider value={{ restaurantId }}>
      {children}
    </RestaurantIdContext.Provider>
  );
};
