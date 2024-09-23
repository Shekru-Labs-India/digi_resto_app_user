// import React, { createContext, useState, useContext, useEffect } from "react";
// import { useParams } from "react-router-dom";

// const RestaurantIdContext = createContext();

// export const useRestaurantId = () => {
//   return useContext(RestaurantIdContext);
// };

// export const RestaurantIdProvider = ({ children }) => {
//   const [restaurantDetails, setRestaurantDetails] = useState(null);
//   const [restaurantId, setRestaurantId] = useState(null);
//   const [restaurantCode, setRestaurantCode] = useState(null);

//   useEffect(() => {
//     if (restaurantCode) {
//       const fetchRestaurantDetails = async () => {
//         try {
//           const response = await fetch(
//             "https://menumitra.com/user_api/get_restaurant_details_by_code",
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 restaurant_code: restaurantCode,
//               }),
//             }
//           );
//           if (response.ok) {
//             const data = await response.json();
//             if (data.st === 1 && data.restaurant_details) {
//               setRestaurantDetails(data.restaurant_details);
//               setRestaurantId(data.restaurant_details.restaurant_id);
//               console.log("Restaurant ID set:", data.restaurant_details.restaurant_id);
//             } else {
//               throw new Error("Invalid response format");
//             }
//           } else {
//             throw new Error("Failed to fetch restaurant details");
//           }
//         } catch (error) {
//           console.error("Error fetching restaurant details:", error);
//           setRestaurantDetails(null);
//           setRestaurantId(null);
//         }
//       };

//       fetchRestaurantDetails();
//     }
//   }, [restaurantCode]);

//   const value = {
//     restaurantDetails,
//     restaurantId,
//     restaurantCode,
//     setRestaurantCode,
//   };

//   return (
//     <RestaurantIdContext.Provider value={value}>
//       {children}
//     </RestaurantIdContext.Provider>
//   );
// };















// import React, { createContext, useState, useContext, useEffect } from "react";

// const RestaurantIdContext = createContext();

// export const useRestaurantId = () => {
//   return useContext(RestaurantIdContext);
// };

// export const RestaurantIdProvider = ({ children }) => {
//   const [restaurantDetails, setRestaurantDetails] = useState(null);
//   const [restaurantId, setRestaurantId] = useState(null);
//   const [restaurantCode, setRestaurantCode] = useState(null);

//   useEffect(() => {
//     if (restaurantCode) {
//       const fetchRestaurantDetails = async () => {
//         try {
//           const response = await fetch(
//             "https://menumitra.com/user_api/get_restaurant_details_by_code",
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 restaurant_code: restaurantCode,
//               }),
//             }
//           );

//           if (response.ok) {
//             const data = await response.json();
//             if (data.st === 1 && data.restaurant_details) {
//               setRestaurantDetails(data.restaurant_details);
//               setRestaurantId(data.restaurant_details.restaurant_id);
//               console.log(
//                 "Restaurant ID set:",
//                 data.restaurant_details.restaurant_id
//               );

//               // Update local storage with restaurant name
//               const userData =
//                 JSON.parse(localStorage.getItem("userData")) || {};
//               userData.restaurantName = data.restaurant_details.name; // Store the restaurant name
//               localStorage.setItem("userData", JSON.stringify(userData)); // Update local storage
//             } else {
//               throw new Error("Invalid response format");
//             }
//           } else {
//             throw new Error("Failed to fetch restaurant details");
//           }
//         } catch (error) {
//           console.error("Error fetching restaurant details:", error);
//           setRestaurantDetails(null);
//           setRestaurantId(null);
//         }
//       };

//       fetchRestaurantDetails();
//     }
//   }, [restaurantCode]);

//   const value = {
//     restaurantDetails,
//     restaurantId,
//     restaurantCode,
//     setRestaurantCode,
//   };

//   return (
//     <RestaurantIdContext.Provider value={value}>
//       {children}
//     </RestaurantIdContext.Provider>
//   );
// };












// import React, { createContext, useState, useContext, useEffect } from "react";

// const RestaurantIdContext = createContext();

// export const useRestaurantId = () => {
//   return useContext(RestaurantIdContext);
// };

// export const RestaurantIdProvider = ({ children }) => {
//   const [restaurantDetails, setRestaurantDetails] = useState(null);
//   const [restaurantId, setRestaurantId] = useState(null);
//   const [restaurantCode, setRestaurantCode] = useState(null);

//   useEffect(() => {
//     const fetchRestaurantDetails = async () => {
//       if (restaurantCode) {
//         try {
//           const response = await fetch(
//             "https://menumitra.com/user_api/get_restaurant_details_by_code",
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 restaurant_code: restaurantCode,
//               }),
//             }
//           );

//           if (response.ok) {
//             const data = await response.json();
//             if (data.st === 1 && data.restaurant_details) {
//               setRestaurantDetails(data.restaurant_details);
//               setRestaurantId(data.restaurant_details.restaurant_id);
//               console.log(
//                 "Restaurant ID set:",
//                 data.restaurant_details.restaurant_id
//               );

//               // Update local storage with restaurant name
//               const userData =
//                 JSON.parse(localStorage.getItem("userData")) || {};
//               userData.restaurantName = data.restaurant_details.name; // Store the restaurant name
//               localStorage.setItem("userData", JSON.stringify(userData)); // Update local storage
//             } else {
//               throw new Error("Invalid response format");
//             }
//           } else {
//             throw new Error("Failed to fetch restaurant details");
//           }
//         } catch (error) {
//           console.error("Error fetching restaurant details:", error);
//           setRestaurantDetails(null);
//           setRestaurantId(null);
//         }
//       }
//     };

//     fetchRestaurantDetails();
//   }, [restaurantCode]);

//   const value = {
//     restaurantDetails,
//     restaurantId,
//     restaurantCode,
//     setRestaurantCode,
//   };

//   return (
//     <RestaurantIdContext.Provider value={value}>
//       {children}
//     </RestaurantIdContext.Provider>
//   );
// };














import React, { createContext, useState, useContext, useEffect } from "react";

const RestaurantIdContext = createContext();

export const useRestaurantId = () => {
  return useContext(RestaurantIdContext);
};

export const RestaurantIdProvider = ({ children }) => {
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantCode, setRestaurantCode] = useState(null);

  // Function to update local storage with new data without overwriting existing userData
  const updateLocalStorage = (restaurantId, restaurantName) => {
    const userData = JSON.parse(localStorage.getItem("userData")) || {}; // Get existing userData or empty object

    // Only insert new values without overwriting the entire userData object
    if (restaurantId) {
      userData.restaurantId = restaurantId; // Update restaurantId
    }
    if (restaurantName) {
      userData.restaurantName = restaurantName; // Update restaurant name
    }

    localStorage.setItem("userData", JSON.stringify(userData)); // Update local storage
  };

 useEffect(() => {
   const fetchRestaurantDetails = async () => {
     if (restaurantCode) {
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
             setRestaurantDetails(data.restaurant_details);
             setRestaurantId(data.restaurant_details.restaurant_id);
             console.log(
               "Restaurant ID set:",
               data.restaurant_details.restaurant_id
             );

             // Update local storage with restaurant details immediately after getting the response
             updateLocalStorage(
               data.restaurant_details.restaurant_id,
               data.restaurant_details.name // Store the restaurant name
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
       }
     }
   };

   fetchRestaurantDetails();
 }, [restaurantCode]);


  const value = {
    restaurantDetails,
    restaurantId,
    restaurantCode,
    setRestaurantCode,
  };

  return (
    <RestaurantIdContext.Provider value={value}>
      {children}
    </RestaurantIdContext.Provider>
  );
};
