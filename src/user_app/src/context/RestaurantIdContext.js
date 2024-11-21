import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import config from "../component/config"
const RestaurantIdContext = createContext();

export const useRestaurantId = () => {
  return useContext(RestaurantIdContext);
};

export const RestaurantIdProvider = ({ children }) => {
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantCode, setRestaurantCode] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [restaurantStatus, setRestaurantStatus] = useState(null)
  const navigate = useNavigate();
  const location = useLocation();
  const lastFetchedCode = useRef(null);

  useEffect(() => {
    // Get table number from URL path
    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    
    // Validate table number: must be numeric and between 1 and 100
    if (lastPart && !isNaN(lastPart) && lastPart > 0 && lastPart <= 10) {
      // Make sure it's not the restaurant code
      const secondLastPart = pathParts[pathParts.length - 2];
      if (secondLastPart && secondLastPart !== lastPart) { // Ensure it's not the same as restaurant code
        setTableNumber(lastPart);
        localStorage.setItem("tableNumber", lastPart);
        
        // Update userData if it exists
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        if (Object.keys(userData).length > 0) {
          const updatedUserData = {
            ...userData,
            tableNumber: lastPart
          };
          localStorage.setItem("userData", JSON.stringify(updatedUserData));
        }
      }
    }
  }, [location]);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      if (!restaurantCode || restaurantCode === lastFetchedCode.current) return;

      lastFetchedCode.current = restaurantCode;

      try {
        const response = await fetch(
          `${config.apiDomain}/user_api/get_restaurant_details_by_code`,
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
          const { restaurant_id, name, account_status } = data.restaurant_details;
          setRestaurantId(restaurant_id);
          setRestaurantName(name);
          setRestaurantStatus(account_status)

          // Update restaurant data in localStorage
          localStorage.setItem("restaurantId", restaurant_id);
          localStorage.setItem("restaurantName", name);
          localStorage.setItem("restaurantCode", restaurantCode);
          localStorage.setItem("restaurantStatus", account_status)

          // Update userData if it exists
          const userData = JSON.parse(localStorage.getItem("userData") || "{}");
          if (Object.keys(userData).length > 0) {
            const updatedUserData = {
              ...userData,
              restaurantId: restaurant_id,
              restaurantName: name,
              restaurantCode: restaurantCode
            };
            localStorage.setItem("userData", JSON.stringify(updatedUserData));
          }
        } else if (data.st === 2) {
          // Invalid restaurant code
          setRestaurantId(null);
          setRestaurantName("");
          
          // Clear restaurant data from localStorage
          localStorage.removeItem("restaurantId");
          localStorage.removeItem("restaurantName");
          localStorage.removeItem("restaurantCode");
          
          // Update userData if it exists
          const userData = JSON.parse(localStorage.getItem("userData") || "{}");
          if (Object.keys(userData).length > 0) {
            const updatedUserData = {
              ...userData,
              restaurantId: null,
              restaurantName: "",
              restaurantCode: ""
            };
            localStorage.setItem("userData", JSON.stringify(updatedUserData));
          }
          
          // navigate("/user_app/Index");

          localStorage.setItem("restaurantStatus", false);
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

    if (storedRestaurantId) setRestaurantId(storedRestaurantId);
    if (storedRestaurantName) setRestaurantName(storedRestaurantName);
    if (storedRestaurantCode) setRestaurantCode(storedRestaurantCode);
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
