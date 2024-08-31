import React, { createContext, useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

const RestaurantIdContext = createContext();

export const useRestaurantId = () => {
  return useContext(RestaurantIdContext);
};

export const RestaurantIdProvider = ({ children }) => {
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const [loading, setLoading] = useState(true); // State for loader
  const [error, setError] = useState(null); // State for error handling
  const { restaurantCode } = useParams(); // Extract restaurantCode from URL params

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      setLoading(true); // Start loading
      setError(null); // Clear previous errors

      try {
        const response = await fetch(
          "https://menumitra.com/user_api/get_restaurant_details_by_code",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              restaurant_code: restaurantCode, // Use the dynamic restaurantCode
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setRestaurantDetails(data.restaurant_details);
          setRestaurantId(data.restaurant_details.restaurant_id);
        } else {
          throw new Error("Failed to fetch restaurant details");
        }
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
        setError("Failed to load restaurant details. Please try again later.");
        setRestaurantDetails(null); // Handle error state
        setRestaurantId(null); // Handle error state
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (restaurantCode) {
      fetchRestaurantDetails();
    } else {
      setLoading(false); // Stop loading if no restaurantCode is available
    }
  }, [restaurantCode]);

  return (
    <RestaurantIdContext.Provider
      value={{
        restaurantDetails,
        restaurantId,
        restaurantCode,
        loading,
        error,
      }}
    >
      {children}
    </RestaurantIdContext.Provider>
  );
};
