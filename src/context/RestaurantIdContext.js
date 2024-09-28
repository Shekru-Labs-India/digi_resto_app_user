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














// import React, { createContext, useState, useContext, useEffect } from "react";

// const RestaurantIdContext = createContext();

// export const useRestaurantId = () => {
//   return useContext(RestaurantIdContext);
// };

// export const RestaurantIdProvider = ({ children }) => {
//   const [restaurantDetails, setRestaurantDetails] = useState(null);
//   const [restaurantId, setRestaurantId] = useState(null);
//   const [restaurantCode, setRestaurantCode] = useState(null);

//   // Function to update local storage with new data without overwriting existing userData
//   const updateLocalStorage = (restaurantId, restaurantName) => {
//     const userData = JSON.parse(localStorage.getItem("userData")) || {}; // Get existing userData or empty object

//     // Only insert new values without overwriting the entire userData object
//     if (restaurantId) {
//       userData.restaurantId = restaurantId; // Update restaurantId
//     }
//     if (restaurantName) {
//       userData.restaurantName = restaurantName; // Update restaurant name
//     }

//     localStorage.setItem("userData", JSON.stringify(userData)); // Update local storage
//   };

//  useEffect(() => {
//    const fetchRestaurantDetails = async () => {
//      if (restaurantCode) {
//        try {
//          const response = await fetch(
//            "https://menumitra.com/user_api/get_restaurant_details_by_code",
//            {
//              method: "POST",
//              headers: {
//                "Content-Type": "application/json",
//              },
//              body: JSON.stringify({
//                restaurant_code: restaurantCode,
//              }),
//            }
//          );

//          if (response.ok) {
//            const data = await response.json();
//            if (data.st === 1 && data.restaurant_details) {
//              setRestaurantDetails(data.restaurant_details);
//              setRestaurantId(data.restaurant_details.restaurant_id);
//              console.log(
//                "Restaurant ID set:",
//                data.restaurant_details.restaurant_id
//              );

//              // Update local storage with restaurant details immediately after getting the response
//              updateLocalStorage(
//                data.restaurant_details.restaurant_id,
//                data.restaurant_details.name // Store the restaurant name
//              );
//            } else {
//              throw new Error("Invalid response format");
//            }
//          } else {
//            throw new Error("Failed to fetch restaurant details");
//          }
//        } catch (error) {
//          console.error("Error fetching restaurant details:", error);
//          setRestaurantDetails(null);
//          setRestaurantId(null);
//        }
//      }
//    };

//    fetchRestaurantDetails();
//  }, [restaurantCode]);


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














// ------------24-09-24-----------










// import React, { createContext, useState, useContext, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

// const RestaurantIdContext = createContext();

// export const useRestaurantId = () => {
//   return useContext(RestaurantIdContext);
// };

// export const RestaurantIdProvider = ({ children }) => {
//   const [restaurantDetails, setRestaurantDetails] = useState(null);
//   const [restaurantId, setRestaurantId] = useState(null);
//   const [restaurantCode, setRestaurantCode] = useState(null);
//   const [loading, setLoading] = useState(false);  // Loading state
//   const [error, setError] = useState(null); // Error state
//   const navigate = useNavigate(); // Hook to programmatically navigate

//   // Utility function to update local storage without overwriting existing data
//   const updateLocalStorage = (restaurantId, restaurantName) => {
//     const userData = JSON.parse(localStorage.getItem("userData")) || {}; // Get existing userData or empty object

//     // Only insert new values without overwriting the entire userData object
//     if (restaurantId) {
//       userData.restaurantId = restaurantId; // Update restaurantId
//     }
//     if (restaurantName) {
//       userData.restaurantName = restaurantName; // Update restaurant name
//     }

//     localStorage.setItem("userData", JSON.stringify(userData)); // Update local storage
//   };

//   // Fetch restaurant details based on restaurant code
//   useEffect(() => {
//     const fetchRestaurantDetails = async () => {
//       if (restaurantCode) {
//         setLoading(true); // Start loading state
//         setError(null); // Reset error state

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
            
//             // Check if restaurant exists (st: 1)
//             if (data.st === 1 && data.restaurant_details) {
//               setRestaurantDetails(data.restaurant_details);
//               setRestaurantId(data.restaurant_details.restaurant_id);

//               // Update local storage with restaurant details
//               updateLocalStorage(
//                 data.restaurant_details.restaurant_id,
//                 data.restaurant_details.name // Store the restaurant name
//               );
//             } 
//             // If restaurant doesn't exist (st: 2), redirect to Signin
//             else if (data.st === 2) {
//               console.log("Restaurant not found:", data.msg);
//               navigate("/Signinscreen"); // Redirect to Signinscreen
//             } 
//             // Handle any other unexpected response
//             else {
//               throw new Error("Unexpected response format");
//             }
//           } else {
//             throw new Error("Failed to fetch restaurant details");
//           }
//         } catch (error) {
//           console.error("Error fetching restaurant details:", error);
//           setRestaurantDetails(null);
//           setRestaurantId(null);
//           setError("Failed to fetch restaurant details. Please try again.");
//         } finally {
//           setLoading(false); // End loading state
//         }
//       }
//     };

//     fetchRestaurantDetails();
//   }, [restaurantCode, navigate]);

//   // Memoize the value to avoid unnecessary re-renders
//   const value = useMemo(() => ({
//     restaurantDetails,
//     restaurantId,
//     restaurantCode,
//     setRestaurantCode,
//     loading,
//     error,
//   }), [restaurantDetails, restaurantId, restaurantCode, loading, error]);

//   return (
//     <RestaurantIdContext.Provider value={value}>
//       {children}
//     </RestaurantIdContext.Provider>
//   );
// };





// -*-*-*-*-*-*-*-









// import React, {
//   createContext,
//   useState,
//   useContext,
//   useEffect,
//   useMemo,
// } from "react";
// import { useNavigate } from "react-router-dom";

// const RestaurantIdContext = createContext();

// export const useRestaurantId = () => {
//   return useContext(RestaurantIdContext);
// };

// export const RestaurantIdProvider = ({ children, restaurantCode }) => {
//   const [restaurantDetails, setRestaurantDetails] = useState(null);
//   const [restaurantId, setRestaurantId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Set restaurant code
//   const [currentRestaurantCode, setRestaurantCode] = useState(restaurantCode);

//   useEffect(() => {
//     const fetchRestaurantDetails = async () => {
//       if (currentRestaurantCode) {
//         setLoading(true);
//         setError(null);

//         try {
//           const response = await fetch(
//             "https://menumitra.com/user_api/get_restaurant_details_by_code",
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 restaurant_code: currentRestaurantCode,
//               }),
//             }
//           );

//           if (response.ok) {
//             const data = await response.json();

//             if (data.st === 1 && data.restaurant_details) {
//               setRestaurantDetails(data.restaurant_details);
//               setRestaurantId(data.restaurant_details.restaurant_id);
//             } else if (data.st === 2) {
//               navigate("/Signinscreen");
//             }
//           } else {
//             throw new Error("Failed to fetch restaurant details");
//           }
//         } catch (error) {
//           console.error("Error fetching restaurant details:", error);
//           setError("Failed to fetch restaurant details. Please try again.");
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchRestaurantDetails();
//   }, [currentRestaurantCode, navigate]);

//   const value = useMemo(
//     () => ({
//       restaurantDetails,
//       restaurantId,
//       restaurantCode: currentRestaurantCode,
//       setRestaurantCode, // Make sure to include this
//       loading,
//       error,
//     }),
//     [restaurantDetails, restaurantId, currentRestaurantCode, loading, error]
//   );

//   return (
//     <RestaurantIdContext.Provider value={value}>
//       {children}
//     </RestaurantIdContext.Provider>
//   );
// };




// 28-09



import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";

const RestaurantIdContext = createContext();

export const useRestaurantId = () => {
  return useContext(RestaurantIdContext);
};

export const RestaurantIdProvider = ({ children, restaurantCode }) => {
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Set restaurant code
  const [currentRestaurantCode, setRestaurantCode] = useState(restaurantCode);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      if (currentRestaurantCode) {
        setLoading(true);
        setError(null);

        try {
          const response = await fetch(
            "https://menumitra.com/user_api/get_restaurant_details_by_code",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                restaurant_code: currentRestaurantCode,
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();

            if (data.st === 1 && data.restaurant_details) {
              setRestaurantDetails(data.restaurant_details);
              setRestaurantId(data.restaurant_details.restaurant_id);
            } else if (data.st === 2) {
              navigate("/Signinscreen");
            }
          } else {
            throw new Error("Failed to fetch restaurant details");
          }
        } catch (error) {
          console.error("Error fetching restaurant details:", error);
          setError("Failed to fetch restaurant details. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRestaurantDetails();
  }, [currentRestaurantCode, navigate]);

  return (
    <RestaurantIdContext.Provider
      value={{
        restaurantId,
        restaurantCode: currentRestaurantCode,
        setRestaurantCode,
      }}
    >
      {children}
    </RestaurantIdContext.Provider>
  );
};