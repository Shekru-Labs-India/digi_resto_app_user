// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// const RestaurantIdContext = createContext();

// export const useRestaurantId = () => {
//   return useContext(RestaurantIdContext);
// };

// export const RestaurantIdProvider = ({ children }) => {
//   const [restaurantId, setRestaurantId] = useState(null);
//   const { restaurantCode } = useParams(); // Extract restaurantCode from URL params

//   useEffect(() => {
//     console.log("Restaurant Code:", restaurantCode); // Debugging line

//     const fetchRestaurantDetails = async () => {
//       try {
//         const response = await fetch(
//           "https://menumitra.com/user_api/get_restaurant_details_by_code",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               restaurant_code: restaurantCode
//             }),
//           }
//         );
//         if (response.ok) {
//           const data = await response.json();
//           setRestaurantId(data.restaurant_details.restaurant_id);
//           console.log("Fetched Restaurant ID:", data.restaurant_details.restaurant_id); // Debugging line
//         } else {
//           throw new Error("Failed to fetch restaurant details");
//         }
//       } catch (error) {
//         console.error("Error fetching restaurant details:", error);
//         setRestaurantId(null); // Handle error state
//       }
//     };

//     if (restaurantCode) {
//       fetchRestaurantDetails();
//     }
//   }, [restaurantCode]);

//   return (
//     <RestaurantIdContext.Provider value={{ restaurantId, restaurantCode }}>
//       {children}
//     </RestaurantIdContext.Provider>
//   );
// };



















import React, { createContext, useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const RestaurantIdContext = createContext();

export const useRestaurantId = () => {
  return useContext(RestaurantIdContext);
};

export const RestaurantIdProvider = ({ children }) => {
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const { restaurantCode } = useParams(); // Extract restaurantCode from URL params

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
          setRestaurantDetails(data.restaurant_details);
          setRestaurantId(data.restaurant_details.restaurant_id);
        } else {
          throw new Error("Failed to fetch restaurant details");
        }
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
        setRestaurantDetails(null); // Handle error state
        setRestaurantId(null); // Handle error state
      }
    };

    if (restaurantCode) {
      fetchRestaurantDetails();
    }
  }, [restaurantCode]);

  return (
    <RestaurantIdContext.Provider value={{ restaurantDetails, restaurantId, restaurantCode }}>
      {children}
    </RestaurantIdContext.Provider>
  );
};
