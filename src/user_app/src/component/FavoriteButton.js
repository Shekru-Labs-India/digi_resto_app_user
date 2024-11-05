// import React, { useState } from 'react';
// import { useRestaurantId } from '../context/RestaurantIdContext';

// const FavoriteButton = ({ menuId, initialIsFavorite }) => {
//   const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
//   const { restaurantId } = useRestaurantId();
//   const userData = JSON.parse(localStorage.getItem('userData'));

//   const handleLikeClick = async () => {
//     if (!userData || !userData.customer_id || !restaurantId) {
//       console.error("Missing required data");
//       return;
//     }

//     const apiUrl = isFavorite
//       ? "https://men4u.xyz/user_api/delete_favourite_menu"
//       : "https://men4u.xyz/user_api/save_favourite_menu";

//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           restaurant_id: restaurantId,
//           menu_id: menuId,
//           customer_id: userData.customer_id,
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data.st === 1) {
//           setIsFavorite(!isFavorite);
//           console.log(isFavorite ? "Removed from favorites" : "Added to favorites");
//         } else {
//           console.error("Failed to update favorite status:", data.msg);
//         }
//       } else {
//         console.error("Network response was not ok");
//       }
//     } catch (error) {
//       console.error("Error updating favorite status:", error);
//     }
//   };

//   return (
//     <i
//       className={`bx ${isFavorite ? "bxs-heart text-red" : "bx-heart"} bx-sm`}
//       onClick={handleLikeClick}
//       style={{
//         position: "absolute",
//         top: "10px",
//         right: "10px",
//         fontSize: "24px",
//         cursor: "pointer",
//         color: isFavorite ? "red" : "inherit"
//       }}
//     ></i>
//   );
// };

// export default FavoriteButton;
