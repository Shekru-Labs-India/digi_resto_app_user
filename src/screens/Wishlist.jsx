// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import Bottom from "../component/bottom";
// import SigninButton from "../constants/SigninButton";
// import { useRestaurantId } from "../context/RestaurantIdContext"; // Ensure this context is used correctly

// const Wishlist = () => {
//   const [menuList, setMenuList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Fetch restaurant_id from context or local storage
//   const { restaurantId: contextRestaurantId } = useRestaurantId();
//   const storedRestaurantId = localStorage.getItem("restaurantId");
//   const restaurantId = contextRestaurantId || storedRestaurantId;

//   // Retrieve user data from local storage
//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const customerId = userData ? userData.customer_id : null;

//   // Debugging logs
//   console.log("UserData from LocalStorage:", userData);
//   console.log("Customer ID:", customerId);
//   console.log("Restaurant ID from context/localStorage:", restaurantId);

//   // Update local storage with restaurant_id
//   useEffect(() => {
//     if (restaurantId) {
//       localStorage.setItem("restaurantId", restaurantId);
//     }
//   }, [restaurantId]);

//   const removeItem = async (indexToRemove, menuId) => {
//     if (!customerId || !menuId || !restaurantId) {
//       console.error("Customer ID, Menu ID, or Restaurant ID is missing.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/remove_favourite_menu",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             restaurant_id: restaurantId, // Include restaurant_id
//             menu_id: menuId,
//             customer_id: customerId,
//           }),
//         }
//       );

//       if (response.ok) {
//         const updatedMenuList = [...menuList];
//         updatedMenuList.splice(indexToRemove, 1);
//         setMenuList(updatedMenuList);
//       } else {
//         console.error(
//           "Failed to remove item from wishlist:",
//           response.statusText
//         );
//       }
//     } catch (error) {
//       console.error("Error removing item from wishlist:", error);
//     }
//   };

//   const addToCart = (item) => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     const itemInCart = cartItems.find(
//       (cartItem) => cartItem.menu_id === item.menu_id
//     );

//     if (!itemInCart) {
//       const updatedCartItems = [...cartItems, { ...item, quantity: 1 }];
//       localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
//     } else {
//       console.log("Item already in cart");
//     }
//   };

//   const isMenuItemInCart = (menuId) => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     return cartItems.some((item) => item.menu_id === menuId);
//   };

//   const toTitleCase = (str) => {
//     return str
//       .toLowerCase()
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//   useEffect(() => {
//     const fetchFavoriteItems = async () => {
//       // Check if customerId and restaurantId exist before making the API call
//       if (!customerId || !restaurantId) {
//         console.error("Customer ID or Restaurant ID is not available.");
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       try {
//         const response = await fetch(
//           "https://menumitra.com/user_api/get_favourite_list",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               customer_id: customerId,
//               restaurant_id: restaurantId, // Include restaurant_id in the request
//             }),
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           if (data.st === 1 && Array.isArray(data.lists)) {
//             setMenuList(data.lists);
//           } else {
//             console.error("Invalid data format:", data);
//           }
//         } else {
//           console.error("Network response was not ok:", response.statusText);
//         }
//       } catch (error) {
//         console.error("Error fetching favorite items:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFavoriteItems();
//   }, [customerId, restaurantId]); // Ensure customerId and restaurantId are included in the dependency array

//   const handleRemoveItemClick = (index, menuId) => {
//     removeItem(index, menuId);
//   };

//   const handleAddToCartClick = (item) => {
//     if (!isMenuItemInCart(item.menu_id)) {
//       addToCart(item);
//       navigate("/Cart");
//     } else {
//       console.log("Item is already in the cart");
//     }
//   };

//   return (
//     <div className="page-wrapper">
//       {loading ? (
//         <div id="preloader">
//           <div className="loader">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <>
//           <header className="header header-fixed style-3">
//             <div className="header-content">
//               <div className="left-content">
//                 <Link
//                   to="/HomeScreen"
//                   className="back-btn dz-icon icon-fill icon-sm"
//                   onClick={() => navigate(-1)}
//                 >
//                   <i className="ri-arrow-left-line fs-3"></i>
//                 </Link>
//               </div>
//               <div className="mid-content">
//                 <h5 className="title">
//                   Favourite{" "}
//                   {userData && (
//                     <span className="items-badge">{menuList.length}</span>
//                   )}
//                 </h5>
//               </div>
//               <div className="right-content">
//                 <Link to="/Search" className="dz-icon icon-fill icon-sm">
//                   <i className="ri-search-line"></i>
//                 </Link>
//               </div>
//             </div>
//           </header>

//           <main className="page-content space-top p-b70">
//             <div className="container">
//               {userData ? (
//                 menuList.length > 0 ? (
//                   <div className="row g-3">
//                     {menuList.map((menu, index) => (
//                       <div className="col-12" key={index}>
//                         <div
//                           className="dz-card list-style style-3"
//                           style={{ position: "relative" }}
//                         >
//                           <div className="dz-media">
//                             <Link to={`/ProductDetails/${menu.menu_id}`}>
//                               <img
//                                 style={{
//                                   width: "100px",
//                                   height: "100px",
//                                   borderRadius: "15px",
//                                 }}
//                                 src={menu.image || images}
//                                 alt={menu.menu_name}
//                                 onError={(e) => {
//                                   e.target.src = images;
//                                   e.target.style.width = "100px";
//                                   e.target.style.height = "100px";
//                                 }}
//                               />
//                             </Link>
//                           </div>
//                           <div className="dz-content">
//                             <h5 className="title">
//                               <Link to={`/ProductDetails/${menu.menu_id}`}>
//                                 {toTitleCase(menu.menu_name)}
//                               </Link>
//                             </h5>

//                             <ul className="dz-meta">
//                               <li
//                                 className="dz-price"
//                                 style={{ color: "#4E74FC" }}
//                               >
//                                 ₹{menu.price}
//                                 {menu.oldPrice && <del>₹{menu.oldPrice}</del>}
//                               </li>
//                               <li>
//                                 <i
//                                   className="ri-store-2-line"
//                                   style={{
//                                     paddingLeft: "20px",
//                                     fontSize: "18px",
//                                   }}
//                                 >
//                                   {" "}
//                                 </i>
//                                 {menu.restaurant_name}
//                               </li>
//                             </ul>

//                             {/* Remove Icon */}
//                             <div
//                               onClick={() =>
//                                 handleRemoveItemClick(index, menu.menu_id)
//                               }
//                               className="remove-text"
//                               style={{
//                                 position: "absolute",
//                                 top: "10px",
//                                 right: "10px",
//                                 cursor: "pointer",
//                               }}
//                             >
//                               <i
//                                 className="ri-close-line"
//                                 style={{ fontSize: "18px" }}
//                               ></i>
//                             </div>

//                             {/* Cart Icon */}
//                             <div
//                               onClick={() => handleAddToCartClick(menu)}
//                               className="cart-btn"
//                               style={{
//                                 position: "absolute",
//                                 bottom: "10px",
//                                 right: "10px",
//                                 cursor: "pointer",
//                               }}
//                             >
//                               {isMenuItemInCart(menu.menu_id) ? (
//                                 <i className="ri-shopping-cart-2-fill"></i>
//                               ) : (
//                                 <i className="ri-shopping-cart-2-line"></i>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div
//                     className="empty-favorites d-flex flex-column justify-content-center align-items-center w-100"
//                     style={{ height: "100%" }}
//                   >
//                     <h5>Nothing to show in favorites.</h5>
//                     <p>Add some products to show here!</p>
//                     <Link to="/HomeScreen" className="btn btn-primary">
//                       Browse Menus
//                     </Link>
//                   </div>
//                 )
//               ) : (
//                 <SigninButton />
//               )}
//             </div>
//           </main>
//         </>
//       )}

//       <Bottom activeMenu="favourite" />
//     </div>
//   );
// };

// export default Wishlist;

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import Bottom from "../component/bottom";
// import SigninButton from "../constants/SigninButton";
// import { useRestaurantId } from "../context/RestaurantIdContext";

// const Wishlist = () => {
//   const [menuList, setMenuList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const { restaurantId: contextRestaurantId } = useRestaurantId();
//   const storedRestaurantId = localStorage.getItem("restaurantId");
//   const restaurantId = contextRestaurantId || storedRestaurantId;

//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const customerId = userData ? userData.customer_id : null;

//   useEffect(() => {
//     if (restaurantId) {
//       localStorage.setItem("restaurantId", restaurantId);
//     }
//   }, [restaurantId]);

//   const removeItem = async (indexToRemove, menuId) => {
//     if (!customerId || !menuId || !restaurantId) {
//       console.error("Customer ID, Menu ID, or Restaurant ID is missing.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/remove_favourite_menu",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//             customer_id: customerId,
//           }),
//         }
//       );

//       if (response.ok) {
//         const updatedMenuList = [...menuList];
//         updatedMenuList.splice(indexToRemove, 1);
//         setMenuList(updatedMenuList);
//       } else {
//         console.error(
//           "Failed to remove item from wishlist:",
//           response.statusText
//         );
//       }
//     } catch (error) {
//       console.error("Error removing item from wishlist:", error);
//     }
//   };

//   const addToCart = (item) => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     const itemInCart = cartItems.find(
//       (cartItem) => cartItem.menu_id === item.menu_id
//     );

//     if (!itemInCart) {
//       const updatedCartItems = [...cartItems, { ...item, quantity: 1 }];
//       localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
//     } else {
//       console.log("Item already in cart");
//     }
//   };

//   const isMenuItemInCart = (menuId) => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     return cartItems.some((item) => item.menu_id === menuId);
//   };

//   const toTitleCase = (str) => {
//     return str
//       .toLowerCase()
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//   useEffect(() => {
//     const fetchFavoriteItems = async () => {
//       if (!customerId || !restaurantId) {
//         console.error("Customer ID or Restaurant ID is not available.");
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       try {
//         const response = await fetch(
//           "https://menumitra.com/user_api/get_favourite_list",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               customer_id: customerId,
//               restaurant_id: restaurantId,
//             }),
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           if (data.st === 1 && Array.isArray(data.lists)) {
//             setMenuList(data.lists);
//           } else {
//             console.error("Invalid data format:", data);
//           }
//         } else {
//           console.error("Network response was not ok:", response.statusText);
//         }
//       } catch (error) {
//         console.error("Error fetching favorite items:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFavoriteItems();
//   }, [customerId, restaurantId]);

//   const handleRemoveItemClick = (index, menuId) => {
//     removeItem(index, menuId);
//   };

//   const handleAddToCartClick = (item) => {
//     if (!isMenuItemInCart(item.menu_id)) {
//       addToCart(item);
//       navigate("/Cart");
//     } else {
//       console.log("Item is already in the cart");
//     }
//   };

//   return (
//     <div className="page-wrapper">
//       {loading ? (
//         <div id="preloader">
//           <div className="loader">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <>
//                     <header className="header header-fixed style-3">
//             <div className="header-content">
//               <div className="left-content">
//                 <Link
//                   to="/HomeScreen"
//                   className="back-btn dz-icon  icon-sm"
//                   onClick={() => navigate(-1)}
//                 >
//                   <i className="ri-arrow-left-line fs-2"></i>
//                 </Link>
//               </div>
//               <div className="mid-content">
//                 <h5 className="title">
//                   Favourite{" "}
//                   {userData && (
//                     <span className="">({menuList.length})</span>
//                   )}
//                 </h5>
//               </div>

//             </div>
//           </header>

//           <main className="page-content space-top p-b0 mt-3">
//             {menuList.length > 0 ? (
//               menuList.map((menu, index) => (
//                 <div className="container py-1" key={index}>
//                   <div className="card">
//                     <div className="card-body py-0">
//                       <div className="row">
//                         <div className="col-3 px-0">
//                           <img
//                             src={menu.image || images}
//                             alt={menu.menu_name}
//                             className="rounded"
//                             style={{ width: "120px", height: "120px" }}
//                             onError={(e) => {
//                               e.target.src = images;
//                               e.target.style.width = "120px";
//                               e.target.style.height = "120px";
//                             }}
//                           />
//                         </div>
//                         <div className="col-8 pt-2 p-0">
//                           <h4>{toTitleCase(menu.menu_name)}</h4>
//                           <div className="row">
//                             <div className="col-4 mt-1">
//                               <i className="ri-restaurant-line mt-0 me-2 text-success"></i>
//                               <span className="text-success">
//                                 {menu.category_name}
//                               </span>
//                             </div>
//                             <div className="col-4 text-end">
//                               <div
//                                 className="offer-code"
//                                 style={{ fontSize: "20px" }}
//                               >
//                                 <i
//                                   className="ri-fire-fill"
//                                   style={{ color: "#eb8e57" }}
//                                 ></i>
//                                 <i
//                                   className="ri-fire-fill"
//                                   style={{ color: "#eb8e57" }}
//                                 ></i>
//                                 <i
//                                   className="ri-fire-fill"
//                                   style={{ color: "#eb8e57" }}
//                                 ></i>
//                                 <i
//                                   className="ri-fire-line"
//                                   style={{
//                                     fontSize: "20px",
//                                     color: "rgba(0, 0, 0, 0.1)",
//                                   }}
//                                 ></i>
//                                 <i
//                                   className="ri-fire-line"
//                                   style={{
//                                     fontSize: "20px",
//                                     color: "rgba(0, 0, 0, 0.1)",
//                                   }}
//                                 ></i>
//                               </div>
//                             </div>
//                             <div className="col-4 text-end p-0 mt-1">
//                               <span className="h6">
//                                 <i
//                                   className="ri-star-half-line me-2"
//                                   style={{ color: "#eb8e57" }}
//                                 ></i>
//                                 {menu.rating}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="row mt-3">
//                             <div className="col-6 pe-0">
//                               <h3 className="text-info d-inline">
//                                 ₹ {menu.price}
//                               </h3>
//                               <span className="text-muted ms-2">
//                                 {/* <del>₹ {menu.oldPrice}</del> */}
//                                 <del>₹ 100</del>
//                               </span>
//                               <span className="text-success ps-2">40% off</span>
//                             </div>
//                             <div className="col-2 ps-2 d-flex align-items-right">
//                               <i
//                                 className="ri-store-2-line"
//                                 style={{ fontSize: "20px" }}
//                               ></i>
//                               <span className="ms-2 text-nowrap mt-1">
//                                 {menu.restaurant_name}
//                               </span>
//                             </div>
//                             <div
//                               className="col-4 pe-0 ps-0 text-end"
//                               style={{ fontSize: "20px" }}
//                             >
//                               <div className="d-flex justify-content-end">
//                                 <i
//                                   className="ri-shopping-cart-2-line"
//                                   onClick={() => handleAddToCartClick(menu)}
//                                 ></i>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="col-1 text-end pt-1">
//                           <i
//                             className="ri-close-line text-muted h5"
//                             onClick={() =>
//                               handleRemoveItemClick(index, menu.menu_id)
//                             }
//                           ></i>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div
//                 className="empty-favorites d-flex flex-column justify-content-center align-items-center w-100"
//                 style={{ height: "100%" }}
//               >
//                 <h5>Nothing to show in favorites.</h5>
//                 <p>Add some products to show here!</p>
//                 <Link to="/HomeScreen" className="btn btn-primary">
//                   Browse Menus
//                 </Link>

//               </div>
//             )}
//           </main>
//         </>
//       )}

//       <Bottom />
//     </div>
//   );
// };

// export default Wishlist;

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import Bottom from "../component/bottom";
// import SigninButton from "../constants/SigninButton";
// import { useRestaurantId } from "../context/RestaurantIdContext";

// const Wishlist = () => {
//   const [menuList, setMenuList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const { restaurantId: contextRestaurantId } = useRestaurantId();
//   const storedRestaurantId = localStorage.getItem("restaurantId");
//   const restaurantId = contextRestaurantId || storedRestaurantId;

//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const customerId = userData ? userData.customer_id : null;

//   useEffect(() => {
//     if (restaurantId) {
//       localStorage.setItem("restaurantId", restaurantId);
//     }
//   }, [restaurantId]);

//   const removeItem = async (indexToRemove, menuId) => {
//     if (!customerId || !menuId || !restaurantId) {
//       console.error("Customer ID, Menu ID, or Restaurant ID is missing.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/remove_favourite_menu",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//             customer_id: customerId,
//           }),
//         }
//       );

//       if (response.ok) {
//         const updatedMenuList = [...menuList];
//         updatedMenuList.splice(indexToRemove, 1);
//         setMenuList(updatedMenuList);
//       } else {
//         console.error(
//           "Failed to remove item from wishlist:",
//           response.statusText
//         );
//       }
//     } catch (error) {
//       console.error("Error removing item from wishlist:", error);
//     }
//   };

//   const addToCart = (item) => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     const itemInCart = cartItems.find(
//       (cartItem) => cartItem.menu_id === item.menu_id
//     );

//     if (!itemInCart) {
//       const updatedCartItems = [...cartItems, { ...item, quantity: 1 }];
//       localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
//     } else {
//       console.log("Item already in cart");
//     }
//   };

//   const isMenuItemInCart = (menuId) => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     return cartItems.some((item) => item.menu_id === menuId);
//   };

//   const toTitleCase = (str) => {
//     return str
//       .toLowerCase()
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//   useEffect(() => {
//     const fetchFavoriteItems = async () => {
//       if (!customerId || !restaurantId) {
//         console.error("Customer ID or Restaurant ID is not available.");
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       try {
//         const response = await fetch(
//           "https://menumitra.com/user_api/get_favourite_list",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               customer_id: customerId,
//               restaurant_id: restaurantId,
//             }),
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           if (data.st === 1 && Array.isArray(data.lists)) {
//             setMenuList(data.lists);
//           } else {
//             console.error("Invalid data format:", data);
//           }
//         } else {
//           console.error("Network response was not ok:", response.statusText);
//         }
//       } catch (error) {
//         console.error("Error fetching favorite items:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFavoriteItems();
//   }, [customerId, restaurantId]);

//   const handleRemoveItemClick = (index, menuId) => {
//     removeItem(index, menuId);
//   };

//   const handleAddToCartClick = (item) => {
//     if (!isMenuItemInCart(item.menu_id)) {
//       addToCart(item);

//     } else {
//       console.log("Item is already in the cart");
//     }
//   };

//   return (
//     <div className="page-wrapper">
//       {loading ? (
//         <div id="preloader">
//           <div className="loader">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <>
//           <header className="header header-fixed style-3">
//             <div className="header-content">
//               <div className="left-content">
//                 <Link
//                   to="/HomeScreen"
//                   className="back-btn dz-icon  icon-sm"
//                   onClick={() => navigate(-1)}
//                 >
//                   <i className="ri-arrow-left-line fs-2"></i>
//                 </Link>
//               </div>
//               <div className="mid-content">
//                 <h5 className="title">
//                   Favourite{" "}
//                   {userData && <span className="">({menuList.length})</span>}
//                 </h5>
//               </div>
//             </div>
//           </header>

//           <main className="page-content space-top p-b0 mt-3">
//             {menuList.length > 0 ? (
//               menuList.map((menu, index) => (
//                 <div className="container py-1" key={index}>
//                   <div className="card">
//                     <div className="card-body py-0">
//                       <div className="row">
//                         <div className="col-3 px-0">
//                           <img
//                             src={menu.image || images}
//                             alt={menu.menu_name}
//                             className="rounded"
//                             style={{ width: "100px", height: "102px" }}
//                             onError={(e) => {
//                               e.target.src = images;
//                               e.target.style.width = "100px";
//                               e.target.style.height = "100px";
//                             }}
//                           />
//                         </div>
//                         <div className="col-9 pt-2 p-0">
//                           {/* First Row: Menu Name and Close Icon */}
//                           <div className="row">
//                             <div className="col-8 ps-4">
//                               <h4>{toTitleCase(menu.menu_name)}</h4>
//                             </div>
//                             <div className="col-4 text-end ps-0 pe-4">
//                               <i
//                                 className="ri-close-line text-muted h5"
//                                 onClick={() =>
//                                   handleRemoveItemClick(index, menu.menu_id)
//                                 }
//                               ></i>
//                             </div>
//                           </div>
//                           {/* Second Row: Category Name, Spicy Index, and Rating */}
//                           <div className="row">
//                             <div className="col-4 pe-0 ps-4">
//                               <i className="ri-restaurant-line mt-0 me-2 text-success"></i>
//                               <span className="text-success">
//                                 {menu.category_name}
//                               </span>
//                             </div>
//                             <div className="col-5 pe-0 ps-1 text-center">
//                               {menu.spicy_index && (
//                                 <div className="offer-code">
//                                   {Array.from({ length: 5 }).map((_, index) =>
//                                     index < menu.spicy_index ? (
//                                       <i
//                                         className="ri-fire-fill fs-6"
//                                         style={{
//                                           fontSize: "12px",
//                                           color: "#eb8e57",
//                                         }}
//                                         key={index}
//                                       ></i>
//                                     ) : (
//                                       <i
//                                         className="ri-fire-line fs-6"
//                                         style={{
//                                           fontSize: "12px",
//                                           color: "#eb8e57",
//                                         }}
//                                         key={index}
//                                       ></i>
//                                     )
//                                   )}
//                                 </div>
//                               )}
//                             </div>
//                             <div className="col-3 text-center pe-3 ps-0">
//                               <span className="fs-6">
//                                 <i
//                                   className="ri-star-half-line me-1 "
//                                   style={{ color: "#eb8e57" }}
//                                 ></i>
//                                 {menu.rating || 0.1}
//                               </span>
//                             </div>
//                           </div>
//                           {/* Last Row: Pricing, Offer, and Restaurant Name */}
//                           <div className="row mt-2  align-items-center">
//                             {/* <div className="col-4 pe-0 ps-4 d-flex">
//                               <h6
//                                 className="text-info d-inline mb-0 fw-medium mt-1"
//                                 style={{ fontSize: "16px" }}
//                               >
//                                 ₹{menu.price}
//                               </h6>
//                               <span
//                                 className="old-price ms-1 mt-1"
//                                 style={{ fontSize: "13px", color: "#888" }}
//                               >
//                                 <del>₹{menu.price}</del>
//                               </span>
//                             </div> */}
//                             <div className="col-6 px-0 text-start">
//                               <p className="mb-2 ms-2 fs-4 fw-medium">
//                                 <span className="ms-3 me-2 text-info">
//                                   ₹{menu.price}
//                                 </span>
//                                 <span className="text-muted fs-6 text-decoration-line-through">
//                                   ₹{menu.oldPrice || menu.price}
//                                 </span>

//                                 <span className="fs-6 ps-2 text-primary">
//                                   {menu.offer || "No "}% Off
//                                 </span>
//                               </p>
//                             </div>
//                             {/* <div className="col-4 ps-0 d-flex align-items-center">
//                               <i
//                                 className="ri-store-2-line"
//                                 style={{ fontSize: "16px" }}
//                               ></i>
//                               <span className="ms-1 text-nowrap">
//                                 {menu.restaurant_name}
//                               </span>
//                             </div> */}
//                             <div className="col-5 text-end">
//                               <div
//                                 className="cart-btn"
//                                 onClick={() => handleAddToCartClick(menu)}
//                               >
//                                 {isMenuItemInCart(menu.menu_id) ? (
//                                   <i className="ri-shopping-cart-2-fill fs-4"></i>
//                                 ) : (
//                                   <i className="ri-shopping-cart-2-line fs-4"></i>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div
//                 className="empty-favorites d-flex flex-column justify-content-center align-items-center w-100"
//                 style={{ height: "100%" }}
//               >
//                 <h5>Nothing to show in favorites.</h5>
//                 <p>Add some products to show here!</p>
//                 <Link to="/HomeScreen" className="btn btn-primary">
//                   Browse Menus
//                 </Link>
//               </div>
//             )}
//           </main>
//         </>
//       )}

//       <Bottom />
//     </div>
//   );
// };

// export default Wishlist;

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import Bottom from "../component/bottom";

// const Wishlist = () => {
//   const [menuList, setMenuList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const userData = JSON.parse(localStorage.getItem("userData")) || {};
//   const customerId = userData.customer_id || null;
//   const storedRestaurantId = userData.restaurantId || null;

//   // No need to set the restaurantId in localStorage since it's already in userData

//   const removeItem = async (indexToRemove, menuId) => {
//     if (!customerId || !menuId || !storedRestaurantId) {
//       console.error("Customer ID, Menu ID, or Restaurant ID is missing.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/remove_favourite_menu",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             restaurant_id: storedRestaurantId,
//             menu_id: menuId,
//             customer_id: customerId,
//           }),
//         }
//       );

//       if (response.ok) {
//         const updatedMenuList = [...menuList];
//         updatedMenuList.splice(indexToRemove, 1);
//         setMenuList(updatedMenuList);
//       } else {
//         console.error("Failed to remove item from wishlist:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error removing item from wishlist:", error);
//     }
//   };

//   const addToCart = (item) => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     const itemInCart = cartItems.find(
//       (cartItem) => cartItem.menu_id === item.menu_id
//     );

//     if (!itemInCart) {
//       const updatedCartItems = [...cartItems, { ...item, quantity: 1 }];
//       localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
//     } else {
//       console.log("Item already in cart");
//     }
//   };

//   const isMenuItemInCart = (menuId) => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     return cartItems.some((item) => item.menu_id === menuId);
//   };

//   const fetchFavoriteItems = async () => {
//     if (!customerId || !storedRestaurantId) {
//       console.error("Customer ID or Restaurant ID is not available.");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_favourite_list",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             customer_id: customerId,
//             restaurant_id: storedRestaurantId,
//           }),
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         if (data.st === 1 && Array.isArray(data.lists)) {
//           setMenuList(data.lists);
//         } else {
//           console.error("Invalid data format:", data);
//         }
//       } else {
//         console.error("Network response was not ok:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error fetching favorite items:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFavoriteItems();
//   }, [customerId, storedRestaurantId]);

//   const handleRemoveItemClick = (index, menuId) => {
//     removeItem(index, menuId);
//   };

//   const handleAddToCartClick = (item) => {
//     if (!isMenuItemInCart(item.menu_id)) {
//       addToCart(item);
//     } else {
//       console.log("Item is already in the cart");
//     }
//   };

//   return (
//     <div className="page-wrapper">
//       {loading ? (
//         <div id="preloader">
//           <div className="loader">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <>
//           <header className="header header-fixed style-3">
//             <div className="header-content">
//               <div className="left-content">
//                 <Link
//                   to="/HomeScreen"
//                   className="back-btn dz-icon icon-sm"
//                   onClick={() => navigate(-1)}
//                 >
//                   <i className="ri-arrow-left-line fs-2"></i>
//                 </Link>
//               </div>
//               <div className="mid-content">
//                 <h5 className="title">
//                   Favourite{" "}
//                   {userData && <span className="">({menuList.length})</span>}
//                 </h5>
//               </div>
//             </div>
//           </header>

//           <main className="page-content space-top p-b0 mt-3">
//             {menuList.length > 0 ? (
//               menuList.map((menu, index) => (
//                 <div className="container py-1" key={index}>
//                   <div className="card">
//                     <div className="card-body py-0">
//                       <div className="row">
//                         <div className="col-3 px-0">
//                           <img
//                             src={menu.image || images}
//                             alt={menu.menu_name}
//                             className="rounded img-fluid"
//                             style={{ width: "100px", height: "125px" }}
//                             onError={(e) => {
//                               e.target.src = images;
//                               e.target.style.width = "100px";
//                               e.target.style.height = "100px";
//                             }}
//                           />
//                         </div>
//                         <div className="col-9 pt-2 p-0">
//                           <div className="row">
//                             <div className="col-8 ps-4">
//                               <h4>{menu.menu_name}</h4>
//                             </div>
//                             <div className="col-4 text-end ps-0 pe-4">
//                               <i
//                                 className="ri-close-line text-muted h5"
//                                 onClick={() =>
//                                   handleRemoveItemClick(index, menu.menu_id)
//                                 }
//                               ></i>
//                             </div>
//                           </div>
//                           <div className="row">
//                             <div className="col-6 pe-0 ps-4">
//                               <i className="ri-restaurant-line mt-0 me-2 text-success"></i>
//                               <span className="text-success">
//                                 {menu.category_name}
//                               </span>
//                             </div>
//                             <div className="col-3 pe-0 ps-1">
//                               {menu.spicy_index && (
//                                 <div className="offer-code">
//                                   {Array.from({ length: 5 }).map((_, index) =>
//                                     index < menu.spicy_index ? (
//                                       <i
//                                         className="ri-fire-fill fs-sm"
//                                         style={{
//                                           fontSize: "12px",
//                                           color: "#eb8e57",
//                                         }}
//                                         key={index}
//                                       ></i>
//                                     ) : (
//                                       <i
//                                         className="ri-fire-line fs-sm"
//                                         style={{
//                                           fontSize: "12px",
//                                           color: "#eb8e57",
//                                         }}
//                                         key={index}
//                                       ></i>
//                                     )
//                                   )}
//                                 </div>
//                               )}
//                             </div>
//                             <div className="col-3 text-center pe-3 ps-0">
//                               <span className="fs-6">
//                                 <i
//                                   className="ri-star-half-line me-1 "
//                                   style={{ color: "#eb8e57" }}
//                                 ></i>
//                                 {menu.rating || 0.1}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="row mt-2 align-items-center">
//                             <div className="col-5 px-0 text-start">
//                               <p className="mb-2 ms-2 fs-4 fw-medium">
//                                 <span className="ms-3 me-2 text-info">
//                                   ₹{menu.price}
//                                 </span>
//                                 <span className="text-muted fs-6 text-decoration-line-through">
//                                   ₹{menu.oldPrice || menu.price}
//                                 </span>
//                               </p>
//                             </div>
//                             <div className="col-4 p-0">
//                               {" "}
//                               <span className="fs-6 ps-2 text-primary">
//                                 {menu.offer || "No "}% Off
//                               </span>
//                             </div>
//                             <div className="col-3 text-center">
//                               <div
//                                 className="cart-btn"
//                                 onClick={() => handleAddToCartClick(menu)}
//                               >
//                                 {isMenuItemInCart(menu.menu_id) ? (
//                                   <i className="ri-shopping-cart-2-fill fs-4"></i>
//                                 ) : (
//                                   <i className="ri-shopping-cart-2-line fs-4"></i>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div
//                 className="empty-favorites d-flex flex-column justify-content-center align-items-center w-100"
//                 style={{ height: "100%" }}
//               >
//                 <h5>Nothing to show in favorites.</h5>
//                 <p>Add some products to show here!</p>
//                 <Link to="/HomeScreen" className="btn btn-primary">
//                   Browse Menus
//                 </Link>
//                 <div>
//                   <Link className="btn btn-primary mt-3" to="/HomeScreen">Login</Link>
//                 </div>
//               </div>
//             )}
//           </main>
//         </>
//       )}
//       <Bottom />
//     </div>
//   );
// };

// export default Wishlist;

// *********

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import Bottom from "../component/bottom";
// import SigninButton from "../constants/SigninButton";
// import { useRestaurantId } from "../context/RestaurantIdContext"; // Ensure this context is used correctly

// const Wishlist = () => {
//   const [menuList, setMenuList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Fetch restaurant_id from context or local storage
//   const { restaurantId: contextRestaurantId } = useRestaurantId();
//   const storedRestaurantId = localStorage.getItem("restaurantId");
//   const restaurantId = contextRestaurantId || storedRestaurantId;

//   // Retrieve user data from local storage
//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const customerId = userData ? userData.customer_id : null;

//   // Debugging logs
//   console.log("UserData from LocalStorage:", userData);
//   console.log("Customer ID:", customerId);
//   console.log("Restaurant ID from context/localStorage:", restaurantId);

//   // Update local storage with restaurant_id
//   useEffect(() => {
//     if (restaurantId) {
//       localStorage.setItem("restaurantId", restaurantId);
//     }
//   }, [restaurantId]);

//   const removeItem = async (indexToRemove, menuId) => {
//     if (!customerId || !menuId || !restaurantId) {
//       console.error("Customer ID, Menu ID, or Restaurant ID is missing.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/remove_favourite_menu",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             restaurant_id: restaurantId, // Include restaurant_id
//             menu_id: menuId,
//             customer_id: customerId,
//           }),
//         }
//       );

//       if (response.ok) {
//         const updatedMenuList = [...menuList];
//         updatedMenuList.splice(indexToRemove, 1);
//         setMenuList(updatedMenuList);
//       } else {
//         console.error(
//           "Failed to remove item from wishlist:",
//           response.statusText
//         );
//       }
//     } catch (error) {
//       console.error("Error removing item from wishlist:", error);
//     }
//   };

//   const addToCart = (item) => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     const itemInCart = cartItems.find(
//       (cartItem) => cartItem.menu_id === item.menu_id
//     );

//     if (!itemInCart) {
//       const updatedCartItems = [...cartItems, { ...item, quantity: 1 }];
//       localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
//     } else {
//       console.log("Item already in cart");
//     }
//   };

//   const isMenuItemInCart = (menuId) => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     return cartItems.some((item) => item.menu_id === menuId);
//   };

//   const toTitleCase = (str) => {
//     return str
//       .toLowerCase()
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//   useEffect(() => {
//     const fetchFavoriteItems = async () => {
//       // Check if customerId and restaurantId exist before making the API call
//       if (!customerId || !restaurantId) {
//         console.error("Customer ID or Restaurant ID is not available.");
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       try {
//         const response = await fetch(
//           "https://menumitra.com/user_api/get_favourite_list",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               customer_id: customerId,
//               restaurant_id: restaurantId,
//             }),
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           if (data.st === 1 && Array.isArray(data.lists)) {
//             setMenuList(data.lists);
//           } else {
//             console.error("Invalid data format:", data);
//           }
//         } else {
//           console.error("Network response was not ok:", response.statusText);
//         }
//       } catch (error) {
//         console.error("Error fetching favorite items:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFavoriteItems();
//   }, [customerId, restaurantId]);

//   const handleRemoveItemClick = (index, menuId) => {
//     removeItem(index, menuId);
//   };

//   const handleAddToCartClick = async (item) => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     const customerId = userData ? userData.customer_id : null;
//     const restaurantId = userData ? userData.restaurantId : null;

//     if (!customerId || !restaurantId) {
//       console.error("Customer ID or Restaurant ID is missing.");
//       navigate("/Signinscreen");
//       return;
//     }

//     if (!isMenuItemInCart(item.menu_id)) {
//       try {
//         const response = await fetch(
//           "https://menumitra.com/user_api/add_to_cart",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               restaurant_id: restaurantId,
//               menu_id: item.menu_id,
//               customer_id: customerId,
//               quantity: 1,
//             }),
//           }
//         );

//         const data = await response.json();
//         if (response.ok && data.st === 1) {
//           addToCart(item);
//           console.log("Item added to cart successfully.");
//           localStorage.setItem("cartId", data.cart_id); // Store the cart ID in local storage
//         } else {
//           console.error("Failed to add item to cart:", data.msg);
//         }
//       } catch (error) {
//         console.error("Error adding item to cart:", error);
//       }
//     } else {
//       console.log("Item is already in the cart");
//     }
//   };

//   return (
//     <div className="page-wrapper">
//       {loading ? (
//         <div id="preloader">
//           <div className="loader">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <>
//           <header className="header header-fixed style-3">
//             <div className="header-content">
//               <div className="left-content">
//                 <Link
//                   to="/HomeScreen"
//                   className="back-btn dz-icon icon-sm"
//                   onClick={() => navigate(-1)}
//                 >
//                   <i className="ri-arrow-left-line fs-2"></i>
//                 </Link>
//               </div>
//               <div className="mid-content">
//                 <h5 className="title">
//                   Favourite{" "}
//                   {userData && <span className="">({menuList.length})</span>}
//                 </h5>
//               </div>
//             </div>
//           </header>

//           <main className="page-content space-top p-b0 mt-3">
//             {customerId ? (
//               menuList.length > 0 ? (
//                 menuList.map((menu, index) => (
//                   <div className="container py-1" key={index}>
//                     <div className="card">
//                       <div className="card-body py-0">
//                         <div className="row">
//                           <div className="col-3 px-0">
//                             <img
//                               src={menu.image || images}
//                               alt={menu.menu_name}
//                               className="rounded img-fluid"
//                               style={{ width: "100px", height: "155px" }}
//                               onError={(e) => {
//                                 e.target.src = images;
//                                 e.target.style.width = "100px";
//                                 e.target.style.height = "100px";
//                               }}
//                             />
//                           </div>
//                           <div className="col-9 pt-2 p-0">
//                             <div className="row">
//                               <div className="col-8 ps-4">
//                                 <h4>{menu.menu_name}</h4>
//                               </div>
//                               <div className="col-4 text-end ps-0 pe-4">
//                                 <i
//                                   className="ri-close-line text-muted h5"
//                                   onClick={() =>
//                                     handleRemoveItemClick(index, menu.menu_id)
//                                   }
//                                 ></i>
//                               </div>
//                             </div>
//                             <div className="row">
//                               <div className="col-6 pe-0 ps-4">
//                                 <i className="ri-restaurant-line mt-0 me-2 text-success"></i>
//                                 <span className="text-success">
//                                   {menu.category_name}
//                                 </span>
//                               </div>
//                               <div className="col-3 pe-0 ps-1">
//                                 {menu.spicy_index && (
//                                   <div className="offer-code">
//                                     {Array.from({ length: 5 }).map((_, index) =>
//                                       index < menu.spicy_index ? (
//                                         <i
//                                           className="ri-fire-fill fs-sm"
//                                           style={{
//                                             fontSize: "12px",
//                                             color: "#eb8e57",
//                                           }}
//                                           key={index}
//                                         ></i>
//                                       ) : (
//                                         <i
//                                           className="ri-fire-line fs-sm"
//                                           style={{
//                                             fontSize: "12px",
//                                             color: "#eb8e57",
//                                           }}
//                                           key={index}
//                                         ></i>
//                                       )
//                                     )}
//                                   </div>
//                                 )}
//                               </div>
//                               <div className="col-3 text-center pe-3 ps-0">
//                                 <span className="fs-6">
//                                   <i
//                                     className="ri-star-half-line me-1 "
//                                     style={{ color: "#eb8e57" }}
//                                   ></i>
//                                   {menu.rating || 0.1}
//                                 </span>
//                               </div>
//                             </div>
//                             <div className="row mt-2 align-items-center">
//                               <div className="col-6 px-0 text-start">
//                                 <p className="mb-2 ms-2 fs-4 fw-medium">
//                                   <span className="ms-3 me-2 text-info">
//                                     ₹{menu.price}
//                                   </span>
//                                   <span className="text-muted fs-6 text-decoration-line-through ">
//                                     ₹{menu.oldPrice || menu.price}
//                                   </span>
//                                 </p>
//                               </div>
//                               <div className="col-4 p-0 text-end">
//                                 <div
//                                   className="cart-btn"
//                                   onClick={() => handleAddToCartClick(menu)}
//                                 >
//                                   {isMenuItemInCart(menu.menu_id) ? (
//                                     <i className="ri-shopping-cart-2-fill fs-4"></i>
//                                   ) : (
//                                     <i className="ri-shopping-cart-2-line fs-4"></i>
//                                   )}
//                                 </div>
//                               </div>
//                               <div className="row">
//                                 <div className="col-12">
//                                   {" "}
//                                   <span className="fs-6 ps-2 text-primary">
//                                     {menu.offer || "No "}% Off
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div
//                   className="empty-favorites d-flex flex-column justify-content-center align-items-center w-100"
//                   style={{ height: "100%" }}
//                 >
//                   <h5>Nothing to show in favorites.</h5>
//                   <p>Add some products to show here!</p>
//                   <Link to="/HomeScreen" className="btn btn-primary">
//                     Browse Menus
//                   </Link>
//                 </div>
//               )
//             ) : (
//               <div
//                 className="empty-favorites d-flex flex-column justify-content-center align-items-center w-100"
//                 style={{ height: "100%" }}
//               >
//                 <h5>Please log in to view your favorites.</h5>
//                 <Link className="btn btn-primary mt-3" to="/Signinscreen">
//                   Login
//                 </Link>
//               </div>
//             )}
//           </main>
//         </>
//       )}
//       <Bottom />
//     </div>
//   );
// };

// export default Wishlist;

// addtocart

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Bottom from "../component/bottom";
import SigninButton from "../constants/SigninButton";
import { useRestaurantId } from "../context/RestaurantIdContext"; // Ensure this context is used correctly

const Wishlist = () => {
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState(
    () => JSON.parse(localStorage.getItem("cartItems")) || []
  );
  const navigate = useNavigate();

  // Fetch restaurant_id from context or local storage
  const { restaurantId: contextRestaurantId } = useRestaurantId();
  const storedRestaurantId = localStorage.getItem("restaurantId");
  const restaurantId = contextRestaurantId || storedRestaurantId;

  // Retrieve user data from local storage
  const userData = JSON.parse(localStorage.getItem("userData"));
  const customerId = userData ? userData.customer_id : null;

  // Debugging logs
  console.log("UserData from LocalStorage:", userData);
  console.log("Customer ID:", customerId);
  console.log("Restaurant ID from context/localStorage:", restaurantId);

  // Update local storage with restaurant_id
  useEffect(() => {
    if (restaurantId) {
      localStorage.setItem("restaurantId", restaurantId);
    }
  }, [restaurantId]);

  const removeItem = async (indexToRemove, menuId) => {
    if (!customerId || !menuId || !restaurantId) {
      console.error("Customer ID, Menu ID, or Restaurant ID is missing.");
      return;
    }

    try {
      const response = await fetch(
        "https://menumitra.com/user_api/remove_favourite_menu",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId, // Include restaurant_id
            menu_id: menuId,
            customer_id: customerId,
          }),
        }
      );

      if (response.ok) {
        const updatedMenuList = [...menuList];
        updatedMenuList.splice(indexToRemove, 1);
        setMenuList(updatedMenuList);
      } else {
        console.error(
          "Failed to remove item from wishlist:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  const handleAddToCartClick = async (item) => {
    if (!customerId || !restaurantId) {
      console.error("Customer ID or Restaurant ID is missing.");
      navigate("/Signinscreen");
      return;
    }
   

    if (!isMenuItemInCart(item.menu_id)) {
      // Update local storage and state immediately
      const updatedCartItems = [...cartItems, { ...item, quantity: 1 }];
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);

      try {
        const response = await fetch(
          "https://menumitra.com/user_api/add_to_cart",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              restaurant_id: restaurantId,
              menu_id: item.menu_id,
              customer_id: customerId,
              quantity: 1,
            }),
          }
        );

        const data = await response.json();
        if (response.ok && data.st === 1) {
          console.log("Item added to cart successfully.");
          localStorage.setItem("cartId", data.cart_id); // Store the cart ID in local storage
        } else {
          console.error("Failed to add item to cart:", data.msg);
          // Revert the local storage and state update if the API call fails
          const revertedCartItems = updatedCartItems.filter(
            (cartItem) => cartItem.menu_id !== item.menu_id
          );
          localStorage.setItem("cartItems", JSON.stringify(revertedCartItems));
          setCartItems(revertedCartItems);
        }
      } catch (error) {
        console.error("Error adding item to cart:", error);
        // Revert the local storage and state update if the API call fails
        const revertedCartItems = updatedCartItems.filter(
          (cartItem) => cartItem.menu_id !== item.menu_id
        );
        localStorage.setItem("cartItems", JSON.stringify(revertedCartItems));
        setCartItems(revertedCartItems);
      }
    } else {
      alert(" This item is already in the cart");
    }
  };

  const isMenuItemInCart = (menuId) => {
    return cartItems.some((item) => item.menu_id === menuId);
  };

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  useEffect(() => {
    const fetchFavoriteItems = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://menumitra.com/user_api/get_favourite_list",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customer_id: customerId,
              restaurant_id: restaurantId,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.st === 1 && Array.isArray(data.lists)) {
            setMenuList(data.lists);
          } else {
            console.error("Invalid data format:", data);
          }
        } else {
          console.error("Network response was not ok:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching favorite items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteItems();
  }, [customerId, restaurantId]);

  const handleRemoveItemClick = (index, menuId) => {
    removeItem(index, menuId);
  };

  return (
    <div className="page-wrapper ">
      {loading ? (
        <div id="preloader">
          <div className="loader">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <header className="header header-fixed style-3 ">
            <div className="header-content">
              <div className="left-content">
                <Link
                  to="/HomeScreen"
                  className="back-btn dz-icon icon-sm"
                  onClick={() => navigate(-1)}
                >
                  <i className="ri-arrow-left-line fs-2"></i>
                </Link>
              </div>
              <div className="mid-content">
                <h5 className="title">
                  Favourite{" "}
                  {userData && menuList.length > 0 && (
                    <span className="small-number gray-text">
                      {" ("}
                      <span className="">{menuList.length}</span>
                      {")"}
                    </span>
                  )}
                </h5>
              </div>
            </div>
          </header>

          <main className="page-content space-top p-b70 mt-1">
            {customerId ? (
              menuList.length > 0 ? (
                menuList.map((menu, index) => (
                  <div className="container py-1 " key={index}>
                    <div className="card">
                      <div className="card-body py-0">
                        <div className="row">
                          <div className="col-3 px-0">
                            <img
                              src={menu.image || images}
                              alt={menu.menu_name}
                              className="rounded img-fluid"
                              style={{ width: "100px", height: "100px" }}
                              onError={(e) => {
                                e.target.src = images;
                                e.target.style.width = "100px";
                                e.target.style.height = "100px";
                              }}
                            />
                          </div>
                          <div className="col-9 pt-2 p-0">
                            <div className="row">
                              <div className="col-7 pe-2 menu_name">
                                <div>{menu.menu_name}</div>
                              </div>
                              <div className="col-4 text-end ps-0 pe-2">
                                <i
                                  className="ri-close-line  fs-4"
                                  onClick={() =>
                                    handleRemoveItemClick(index, menu.menu_id)
                                  }
                                ></i>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-5 pe-0 ps-4">
                                <i className="ri-restaurant-line mt-0 me-2 text-success"></i>
                                <span className="text-success">
                                  {menu.category_name}
                                </span>
                              </div>
                              <div className="col-4  px-0">
                                {menu.spicy_index && (
                                  <div className="offer-code">
                                    {Array.from({ length: 5 }).map((_, index) =>
                                      index < menu.spicy_index ? (
                                        <i
                                          className="ri-fire-fill fs-6"
                                          style={{
                                            color: "#eb8e57",
                                          }}
                                          key={index}
                                        ></i>
                                      ) : (
                                        <i
                                          className="ri-fire-line fs-6"
                                          style={{
                                            color: "#eb8e57",
                                          }}
                                          key={index}
                                        ></i>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="col-2 text-end  px-0">
                                <span className="fs-6 fw-semibold gray-text">
                                  <i className="ri-star-half-line me-1 ratingStar"></i>
                                  {menu.rating || 0.1}
                                </span>
                              </div>
                            </div>

                            <div className="row mt-2 align-items-center">

                              <div className="col-5 px-0 text-start">
                                <p className="mb-0 ms-2 fs-4 fw-medium">
                                  <span className="ms-3 me-2 text-info">
                                    ₹{menu.price}
                                  </span>
                                  <span className="gray-text fs-6 text-decoration-line-through ">
                                    ₹{menu.oldPrice || menu.price}
                                  </span>
                                </p>
                              </div> 
                              <div className="col-3 px-0 ">
                                  {" "}
                                  <span className="fs-6  text-primary ">
                                    {menu.offer || "No "}% Off
                                  </span>
                                </div>

                              <div className="col-3 text-end px-0 ">
                                <div
                                  className="cart-btn"
                                  onClick={() => handleAddToCartClick(menu)}
                                >
                                  {isMenuItemInCart(menu.menu_id) ? (
                                    <i className="ri-shopping-cart-fill fs-2"></i>
                                  ) : (
                                    <i className="ri-shopping-cart-line fs-2"></i>
                                  )}
                                </div>
                              </div>
                             
                               
                            
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="container overflow-hidden d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                  <div className="m-b20 dz-flex-box text-center">
                    <div className="dz-cart-about">
                      <h5 className="title">Nothing to show in favourites.</h5>
                      <p>Add some products to show here!</p>
                      <Link to="/Menu" className="btn btn-outline-primary btn-sm">
                        Browse Menus
                      </Link>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="container overflow-hidden d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="m-b20 dz-flex-box text-center">
                  <div className="dz-cart-about">
                    <h5>Please log in to view your favourites.</h5>
                    <Link className="btn btn-outline-primary mt-3" to="/Signinscreen">
                      <i className="ri-lock-2-line fs-4 me-2 "></i> Login
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </main>
        </>
      )}
      <Bottom />
    </div>
  );
};

export default Wishlist;
