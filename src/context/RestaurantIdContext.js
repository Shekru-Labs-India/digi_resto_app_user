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
  const [tableNumber, setTableNumber] = useState("");
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

          // Store restaurant data separately
          localStorage.setItem("restaurantId", restaurant_id);
          localStorage.setItem("restaurantName", name);
          localStorage.setItem("restaurantCode", restaurantCode);
        } else if (data.st === 2) {
          // Invalid restaurant code
          setRestaurantId(null);
          setRestaurantName("");
          localStorage.removeItem("restaurantId");
          localStorage.removeItem("restaurantName");
          localStorage.removeItem("restaurantCode");
          navigate("Index");
        } else {
          console.error("Failed to fetch restaurant details:", data.msg);
        }
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantCode, navigate]);

  useEffect(() => {
    // Load restaurant data from localStorage on initial render
    const storedRestaurantId = localStorage.getItem("restaurantId");
    const storedRestaurantName = localStorage.getItem("restaurantName");
    const storedRestaurantCode = localStorage.getItem("restaurantCode");
    const storedTableNumber = localStorage.getItem("tableNumber");

    if (storedRestaurantId) setRestaurantId(storedRestaurantId);
    if (storedRestaurantName) setRestaurantName(storedRestaurantName);
    if (storedRestaurantCode) setRestaurantCode(storedRestaurantCode);
    if (storedTableNumber) setTableNumber(storedTableNumber);
  }, []);

  const updateRestaurantCode = (code) => {
    setRestaurantCode(code);
    localStorage.setItem("restaurantCode", code);
  };

  const updateTableNumber = (number) => {
    setTableNumber(number);
    localStorage.setItem("tableNumber", number);
  };

  return (
    <RestaurantIdContext.Provider
      value={{
        restaurantId,
        restaurantName,
        restaurantCode,
        tableNumber,
        updateRestaurantCode,
        updateTableNumber,
        setRestaurantCode, 
      }}
    >
      {children}
    </RestaurantIdContext.Provider>
  );
};