// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import images from "../assets/MenuDefault.png";
// import Swiper from "swiper";
// import { debounce } from "lodash";

// const ProductCard = () => {
//   const [menuList, setMenuList] = useState([]);
//   const [menuCategories, setMenuCategories] = useState([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState(null);
//   const [totalMenuCount, setTotalMenuCount] = useState(0);
//   const [filteredMenuList, setFilteredMenuList] = useState([]);
//   const navigate = useNavigate();
//   const { restaurantId } = useRestaurantId();
//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const customerId = userData ? userData.customer_id : null;

//   const [isLoading, setIsLoading] = useState(false);
//   const hasFetchedData = useRef(false);

//   const fetchMenuData = useCallback(
//     async (categoryId) => {
//       if (isLoading || hasFetchedData.current) return;
//       setIsLoading(true);
//       hasFetchedData.current = true;
//       try {
//         const requestBody = {
//           customer_id: customerId,
//           restaurant_id: restaurantId,
//         };

//         console.log("Fetching menu data with:", requestBody);

//         const response = await fetch(
//           "https://menumitra.com/user_api/get_all_menu_list_by_category",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(requestBody),
//           }
//         );

//         const data = await response.json();
//         console.log("API Response:", data);

//         if (response.ok && data.st === 1) {
//           if (Array.isArray(data.data.category)) {
//             const formattedCategories = data.data.category.map((category) => ({
//               ...category,
//               name: toTitleCase(category.category_name),
//             }));
//             setMenuCategories(formattedCategories);
//           }

//           if (Array.isArray(data.data.menus)) {
//             const formattedMenuList = data.data.menus.map((menu) => ({
//               ...menu,
//               image: menu.image || images,
//               category: toTitleCase(menu.category_name),
//               name: toTitleCase(menu.menu_name),
//               oldPrice: Math.floor(menu.price * 1.1),
//               is_favourite: menu.is_favourite === 1,
//             }));
//             setMenuList(formattedMenuList);
//             setTotalMenuCount(formattedMenuList.length);

//             if (categoryId === null) {
//               setFilteredMenuList(formattedMenuList);
//             } else {
//               const filteredMenus = formattedMenuList.filter(
//                 (menu) => menu.menu_cat_id === categoryId
//               );
//               setFilteredMenuList(filteredMenus);
//             }
//             localStorage.setItem(
//               "menuItems",
//               JSON.stringify(formattedMenuList)
//             );
//           } else {
//             setMenuCategories([]);
//             setMenuList([]);
//             setFilteredMenuList([]);
//           }
//         } else {
//           console.error("API Error:", data.msg);
//           setMenuCategories([]);
//           setMenuList([]);
//           setFilteredMenuList([]);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setMenuCategories([]);
//         setMenuList([]);
//         setFilteredMenuList([]);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [customerId, restaurantId, isLoading]
//   );

//   const debouncedFetchMenuData = useCallback(
//     debounce((categoryId) => {
//       fetchMenuData(categoryId);
//     }, 300),
//     [fetchMenuData]
//   );

//   useEffect(() => {
//     if (restaurantId) {
//       debouncedFetchMenuData(selectedCategoryId);
//     }
//   }, [restaurantId, selectedCategoryId, debouncedFetchMenuData]);

//   useEffect(() => {
//     const swiper = new Swiper(".category-slide", {
//       slidesPerView: "auto",
//       spaceBetween: 10,
//     });
//     return () => swiper.destroy(true, true);
//   }, [menuCategories]);

//   const handleLikeClick = async (menuId) => {
//     if (!customerId || !restaurantId) {
//       console.error("Missing required data");
//       return;
//     }

//     const menuItem = menuList.find((item) => item.menu_id === menuId);
//     const isFavorite = menuItem.is_favourite;

//     const apiUrl = isFavorite
//       ? "https://menumitra.com/user_api/remove_favourite_menu"
//       : "https://menumitra.com/user_api/save_favourite_menu";

//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           restaurant_id: restaurantId,
//           menu_id: menuId,
//           customer_id: customerId,
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data.st === 1) {
//           const updatedMenuList = menuList.map((item) =>
//             item.menu_id === menuId
//               ? { ...item, is_favourite: !isFavorite }
//               : item
//           );
//           setMenuList(updatedMenuList);
//           setFilteredMenuList(
//             updatedMenuList.filter(
//               (item) =>
//                 item.menu_cat_id === selectedCategoryId ||
//                 selectedCategoryId === null
//             )
//           );
//           console.log(
//             isFavorite ? "Removed from favorites" : "Added to favorites"
//           );
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

//   const handleCategorySelect = useCallback(
//     (categoryId) => {
//       setSelectedCategoryId(categoryId);
//       hasFetchedData.current = false;
//       debouncedFetchMenuData(categoryId);
//     },
//     [debouncedFetchMenuData]
//   );

//   const toTitleCase = (str) => {
//     return str.replace(/\w\S*/g, function (txt) {
//       return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//     });
//   };

//  const handleAddToCartClick = async (menu) => {
//    if (!customerId || !restaurantId) {
//      console.error("Missing required data");
//      return;
//    }

//    try {
//      const response = await fetch(
//        "https://menumitra.com/user_api/add_to_cart",
//        {
//          method: "POST",
//          headers: {
//            "Content-Type": "application/json",
//          },
//          body: JSON.stringify({
//            restaurant_id: restaurantId,
//            menu_id: menu.menu_id,
//            customer_id: customerId,
//            quantity: 1,
//          }),
//        }
//      );

//      const data = await response.json();
//      if (response.ok && data.st === 1) {
//        console.log("Item successfully added to cart");

//        // Store the cart_id in local storage
//        localStorage.setItem("cartId", data.cart_id);

//        // Navigate to the Cart component
//        navigate("/Cart");
//      } else {
//        console.error("Failed to add item to cart:", data.msg);
//      }
//    } catch (error) {
//      console.error("Error adding item to cart:", error);
//    }
//  };


//   const isMenuItemInCart = (menuId) => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     return cartItems.some((item) => item.menu_id === menuId);
//   };

//   return (
//     <div>
//       <div className="dz-box">
//         {menuCategories && menuCategories.length > 0 && (
//           <div className="title-bar">
//             <h5 className="title p-r50 fs-5">Menu Category</h5>
//             <Link to="/Category">
//               <i
//                 className="ri-arrow-right-line fs-3"
                
//               ></i>
//             </Link>
//           </div>
//         )}
//         <div className="swiper category-slide">
//           <div className="swiper-wrapper">
//             <div
//               className={`category-btn border border-2 rounded-5 swiper-slide fs-6 ${
//                 selectedCategoryId === null ? "active" : ""
//               }`}
//               onClick={() => handleCategorySelect(null)}
//               style={{
//                 backgroundColor: selectedCategoryId === null ? "#0D775E" : "",
//                 color: selectedCategoryId === null ? "#ffffff" : "",
//               }}
//             >
//               All ({totalMenuCount})
//             </div>
//             {menuCategories.map((category) => (
//               <div key={category.menu_cat_id} className="swiper-slide">
//                 <div
//                   className={`category-btn border border-2 rounded-5 fs-${
//                     selectedCategoryId === category.menu_cat_id ? "active" : ""
//                   }`}
//                   onClick={() => handleCategorySelect(category.menu_cat_id)}
//                   style={{
//                     backgroundColor:
//                       selectedCategoryId === category.menu_cat_id
//                         ? "#0D775E"
//                         : "",
//                     color:
//                       selectedCategoryId === category.menu_cat_id
//                         ? "#ffffff"
//                         : "",
//                   }}
//                 >
//                   {category.category_name} ({category.menu_count})
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="row g-3 grid-style-1">
//         {filteredMenuList.length > 0 ? (
//           filteredMenuList.map((menu) => (
//             <div key={menu.menu_id} className="col-6">
//               <div className="card-item style-6">
//                 <div className="dz-media">
//                   <Link
//                     to={{
//                       pathname: `/ProductDetails/${menu.menu_id}`,
//                     }}
//                     state={{ menu_cat_id: menu.menu_cat_id }} // Pass menu_cat_id as state
//                   >
//                     <img
//                       src={menu.image || images}
//                       alt={menu.name}
//                       style={{ height: "200px", width: "300px" }}
//                       onError={(e) => {
//                         e.target.src = images;
//                       }}
//                     />
//                   </Link>
//                 </div>
//                 <div className="dz-content">
//                   <div
//                     className="detail-content category-text"
//                     style={{ position: "relative" }}
//                   >
//                     <div
//                       className="dz-quantity detail-content fs-6 fw-medium"
//                       style={{ color: "#0a795b" }}
//                     >
//                       <i
//                         className="ri-restaurant-line "
//                         style={{ paddingRight: "5px" }}
//                       ></i>
//                       {menu.category}
//                     </div>
//                     <i
//                       className={`${
//                         menu.is_favourite
//                           ? "ri-hearts-fill fs-2"
//                           : "ri-heart-2-line fs-2"
//                       }`}
//                       onClick={() => handleLikeClick(menu.menu_id)}
//                       style={{
//                         position: "absolute",
//                         top: "0",
//                         right: "0",
//                         fontSize: "23px",
//                         cursor: "pointer",
//                         color: menu.is_favourite ? "#fe0809" : "#73757b",
//                       }}
//                     ></i>
//                   </div>

//                   {menu.name && (
//                     <h4 className="item-name fs-6 mt-2">{menu.name}</h4>
//                   )}
//                   {menu.spicy_index && (
//                     <div className="row">
//                       <div className="col-6">
//                         <div className="offer-code mt-2">
//                           {Array.from({ length: 5 }).map((_, index) =>
//                             index < menu.spicy_index ? (
//                               <i
//                                 className="ri-fire-fill fs-6"
//                                 style={{ fontSize: "12px" }}
//                                 key={index}
//                               ></i>
//                             ) : (
//                               <i
//                                 className="ri-fire-line fs-6"
//                                 style={{ fontSize: "12px", color: "#bbbaba" }}
//                                 key={index}
//                               ></i>
//                             )
//                           )}
//                         </div>
//                       </div>
//                       <div className="col-6 text-end">
//                         <i
//                           className="ri-star-half-line pe-1 fs-6"
//                           style={{ color: "#f8a500", fontSize: "23px" }}
//                         ></i>
//                         <span
//                           className="fs-6 fw-semibold"
//                           style={{ color: "#7f7e7e", marginLeft: "5px" }}
//                         >
//                           {menu.rating}
//                         </span>
//                       </div>
//                     </div>
//                   )}

//                   <div className="footer-wrapper mt-2">
//                     <div className="price-wrapper">
//                       <h6 className="current-price fs-6 fw-medium">
//                         ₹{menu.price}
//                       </h6>
//                       <span className="old-price fs-6">₹{menu.oldPrice}</span>
//                     </div>
//                     <div
//                       className="fw-medium d-flex fs-6 fw-semibold"
//                       style={{ color: "#438a3c" }}
//                     >
//                       {menu.offer} Off
//                     </div>
//                     <div className="footer-btns">
//                       {userData ? (
//                         <div
//                           onClick={() => handleAddToCartClick(menu)}
//                           className="cart-btn"
//                         >
//                           {isMenuItemInCart(menu.menu_id) ? (
//                             <i className="ri-shopping-cart-2-fill fs-2"></i>
//                           ) : (
//                             <i className="ri-shopping-cart-2-line fs-2"></i>
//                           )}
//                         </div>
//                       ) : (
//                         <i className="ri-shopping-cart-2-line fs-2"></i>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p>No items available in this category.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductCard;























// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import images from "../assets/MenuDefault.png";
// import Swiper from "swiper";
// import { debounce } from "lodash";

// const ProductCard = () => {
//   const [menuList, setMenuList] = useState([]);
//   const [menuCategories, setMenuCategories] = useState([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState(null);
//   const [totalMenuCount, setTotalMenuCount] = useState(0);
//   const [filteredMenuList, setFilteredMenuList] = useState([]);
//   const navigate = useNavigate();
//   const { restaurantId } = useRestaurantId();
//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const customerId = userData ? userData.customer_id : null;

//   const [isLoading, setIsLoading] = useState(false);
//   const hasFetchedData = useRef(false);

//   const fetchMenuData = useCallback(
//     async (categoryId) => {
//       if (isLoading || hasFetchedData.current) return;
//       setIsLoading(true);
//       hasFetchedData.current = true;
//       try {
//         const requestBody = {
//           customer_id: customerId,
//           restaurant_id: restaurantId,
//         };

//         console.log("Fetching menu data with:", requestBody);

//         const response = await fetch(
//           "https://menumitra.com/user_api/get_all_menu_list_by_category",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(requestBody),
//           }
//         );

//         const data = await response.json();
//         console.log("API Response:", data);

//         if (response.ok && data.st === 1) {
//           if (Array.isArray(data.data.category)) {
//             const formattedCategories = data.data.category.map((category) => ({
//               ...category,
//               name: toTitleCase(category.category_name),
//             }));
//             setMenuCategories(formattedCategories);
//           }

//           if (Array.isArray(data.data.menus)) {
//             const formattedMenuList = data.data.menus.map((menu) => ({
//               ...menu,
//               image: menu.image || images,
//               category: toTitleCase(menu.category_name),
//               name: toTitleCase(menu.menu_name),
//               oldPrice: Math.floor(menu.price * 1.1),
//               is_favourite: menu.is_favourite === 1,
//             }));
//             setMenuList(formattedMenuList);
//             setTotalMenuCount(formattedMenuList.length);

//             if (categoryId === null) {
//               setFilteredMenuList(formattedMenuList);
//             } else {
//               const filteredMenus = formattedMenuList.filter(
//                 (menu) => menu.menu_cat_id === categoryId
//               );
//               setFilteredMenuList(filteredMenus);
//             }
//             localStorage.setItem(
//               "menuItems",
//               JSON.stringify(formattedMenuList)
//             );
//           } else {
//             setMenuCategories([]);
//             setMenuList([]);
//             setFilteredMenuList([]);
//           }
//         } else {
//           console.error("API Error:", data.msg);
//           setMenuCategories([]);
//           setMenuList([]);
//           setFilteredMenuList([]);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setMenuCategories([]);
//         setMenuList([]);
//         setFilteredMenuList([]);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [customerId, restaurantId, isLoading]
//   );

//   const debouncedFetchMenuData = useCallback(
//     debounce((categoryId) => {
//       fetchMenuData(categoryId);
//     }, 300),
//     [fetchMenuData]
//   );

//   useEffect(() => {
//     if (restaurantId) {
//       console.log("Restaurant ID in useEffect:", restaurantId);
//       debouncedFetchMenuData(selectedCategoryId);
//     }
//   }, [restaurantId, selectedCategoryId, debouncedFetchMenuData]);

//   useEffect(() => {
//     console.log("Menu Categories:", menuCategories);
//     const swiper = new Swiper(".category-slide", {
//       slidesPerView: "auto",
//       spaceBetween: 10,
//     });
//     return () => swiper.destroy(true, true);
//   }, [menuCategories]);

//   const handleLikeClick = async (menuId) => {
//     if (!customerId || !restaurantId) {
//       console.error("Missing required data");
//       return;
//     }

//     const menuItem = menuList.find((item) => item.menu_id === menuId);
//     const isFavorite = menuItem.is_favourite;

//     const apiUrl = isFavorite
//       ? "https://menumitra.com/user_api/remove_favourite_menu"
//       : "https://menumitra.com/user_api/save_favourite_menu";

//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           restaurant_id: restaurantId,
//           menu_id: menuId,
//           customer_id: customerId,
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data.st === 1) {
//           const updatedMenuList = menuList.map((item) =>
//             item.menu_id === menuId
//               ? { ...item, is_favourite: !isFavorite }
//               : item
//           );
//           setMenuList(updatedMenuList);
//           setFilteredMenuList(
//             updatedMenuList.filter(
//               (item) =>
//                 item.menu_cat_id === selectedCategoryId ||
//                 selectedCategoryId === null
//             )
//           );
//           console.log(
//             isFavorite ? "Removed from favorites" : "Added to favorites"
//           );
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

//   const handleCategorySelect = useCallback(
//     (categoryId) => {
//       setSelectedCategoryId(categoryId);
//       hasFetchedData.current = false;
//       debouncedFetchMenuData(categoryId);
//     },
//     [debouncedFetchMenuData]
//   );

//   const toTitleCase = (str) => {
//     return str.replace(/\w\S*/g, function (txt) {
//       return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//     });
//   };

// const handleAddToCartClick = async (menu) => {
//   if (!customerId || !restaurantId) {
//     console.error("Missing required data");
//     return;
//   }

//   try {
//     const requestBody = {
//       restaurant_id: restaurantId,
//       menu_id: menu.menu_id,
//       customer_id: customerId,
//       quantity: 1,
//     };

//     console.log("Request Payload for Add to Cart:", requestBody);

//     const response = await fetch("https://menumitra.com/user_api/add_to_cart", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(requestBody),
//     });

//     const data = await response.json();
//     if (response.ok && data.st === 1) {
//       console.log("Item successfully added to cart");

//       // Store the cart_id in local storage
//       localStorage.setItem("cartId", data.cart_id);

//       // Navigate to the Cart component
//       navigate("/Cart");
//     } else {
//       console.error("Failed to add item to cart:", data.msg);
//     }
//   } catch (error) {
//     console.error("Error adding item to cart:", error);
//   }
// };


//   const isMenuItemInCart = (menuId) => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     return cartItems.some((item) => item.menu_id === menuId);
//   };

//   return (
//     <div>
//       <div className="dz-box">
//         {menuCategories && menuCategories.length > 0 && (
//           <div className="title-bar">
//             <h5 className="title p-r50 fs-5">Menu Category</h5>
//             <Link to="/Category">
//               <i className="ri-arrow-right-line fs-3"></i>
//             </Link>
//           </div>
//         )}
//         <div className="swiper category-slide">
//           <div className="swiper-wrapper">
//             <div
//               className={`category-btn border border-2 rounded-5 swiper-slide fs-6 ${
//                 selectedCategoryId === null ? "active" : ""
//               }`}
//               onClick={() => handleCategorySelect(null)}
//               style={{
//                 backgroundColor: selectedCategoryId === null ? "#0D775E" : "",
//                 color: selectedCategoryId === null ? "#ffffff" : "",
//               }}
//             >
//               All ({totalMenuCount})
//             </div>
//             {menuCategories.map((category) => (
//               <div key={category.menu_cat_id} className="swiper-slide">
//                 <div
//                   className={`category-btn border border-2 rounded-5 fs-${
//                     selectedCategoryId === category.menu_cat_id ? "active" : ""
//                   }`}
//                   onClick={() => handleCategorySelect(category.menu_cat_id)}
//                   style={{
//                     backgroundColor:
//                       selectedCategoryId === category.menu_cat_id
//                         ? "#0D775E"
//                         : "",
//                     color:
//                       selectedCategoryId === category.menu_cat_id
//                         ? "#ffffff"
//                         : "",
//                   }}
//                 >
//                   {category.category_name} ({category.menu_count})
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="row g-3 grid-style-1">
//         {filteredMenuList.length > 0 ? (
//           filteredMenuList.map((menu) => (
//             <div key={menu.menu_id} className="col-6">
//               <div className="card-item style-6">
//                 <div className="dz-media">
//                   <Link
//                     to={{
//                       pathname: `/ProductDetails/${menu.menu_id}`,
//                     }}
//                     state={{ menu_cat_id: menu.menu_cat_id }} // Pass menu_cat_id as state
//                   >
//                     <img
//                       src={menu.image || images}
//                       alt={menu.name}
//                       style={{ height: "200px", width: "300px" }}
//                       onError={(e) => {
//                         e.target.src = images;
//                       }}
//                     />
//                   </Link>
//                 </div>
//                 <div className="dz-content">
//                   <div
//                     className="detail-content category-text"
//                     style={{ position: "relative" }}
//                   >
//                     <div
//                       className="dz-quantity detail-content fs-6 fw-medium"
//                       style={{ color: "#0a795b" }}
//                     >
//                       <i
//                         className="ri-restaurant-line "
//                         style={{ paddingRight: "5px" }}
//                       ></i>
//                       {menu.category}
//                     </div>
//                     <i
//                       className={`${
//                         menu.is_favourite
//                           ? "ri-hearts-fill fs-2"
//                           : "ri-heart-2-line fs-2"
//                       }`}
//                       onClick={() => handleLikeClick(menu.menu_id)}
//                       style={{
//                         position: "absolute",
//                         top: "0",
//                         right: "0",
//                         fontSize: "23px",
//                         cursor: "pointer",
//                         color: menu.is_favourite ? "#fe0809" : "#73757b",
//                       }}
//                     ></i>
//                   </div>

//                   {menu.name && (
//                     <h4 className="item-name fs-6 mt-2">{menu.name}</h4>
//                   )}
//                   {menu.spicy_index && (
//                     <div className="row">
//                       <div className="col-6">
//                         <div className="offer-code mt-2">
//                           {Array.from({ length: 5 }).map((_, index) =>
//                             index < menu.spicy_index ? (
//                               <i
//                                 className="ri-fire-fill fs-6"
//                                 style={{ fontSize: "12px" }}
//                                 key={index}
//                               ></i>
//                             ) : (
//                               <i
//                                 className="ri-fire-line fs-6"
//                                 style={{ fontSize: "12px", color: "#bbbaba" }}
//                                 key={index}
//                               ></i>
//                             )
//                           )}
//                         </div>
//                       </div>
//                       <div className="col-6 text-end">
//                         <i
//                           className="ri-star-half-line pe-1 fs-6"
//                           style={{ color: "#f8a500", fontSize: "23px" }}
//                         ></i>
//                         <span
//                           className="fs-6 fw-semibold"
//                           style={{ color: "#7f7e7e", marginLeft: "5px" }}
//                         >
//                           {menu.rating}
//                         </span>
//                       </div>
//                     </div>
//                   )}

//                   <div className="footer-wrapper mt-2">
//                     <div className="price-wrapper">
//                       <h6 className="current-price fs-6 fw-medium">
//                         ₹{menu.price}
//                       </h6>
//                       <span className="old-price fs-6">₹{menu.oldPrice}</span>
//                     </div>
//                     <div
//                       className="fw-medium d-flex fs-6 fw-semibold"
//                       style={{ color: "#438a3c" }}
//                     >
//                       {menu.offer} Off
//                     </div>
//                     <div className="footer-btns">
//                       {userData ? (
//                         <div
//                           onClick={() => handleAddToCartClick(menu)}
//                           className="cart-btn"
//                         >
//                           {isMenuItemInCart(menu.menu_id) ? (
//                             <i className="ri-shopping-cart-2-fill fs-2"></i>
//                           ) : (
//                             <i className="ri-shopping-cart-2-line fs-2"></i>
//                           )}
//                         </div>
//                       ) : (
//                         <i className="ri-shopping-cart-2-line fs-2"></i>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p>No items available in this category.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductCard;






// retrived from gh--->









// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import images from "../assets/MenuDefault.png";
// import Swiper from "swiper";
// import { debounce } from "lodash";

// const ProductCard = () => {
//   const [menuList, setMenuList] = useState([]);
//   const [menuCategories, setMenuCategories] = useState([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState(null);
//   const [totalMenuCount, setTotalMenuCount] = useState(0);
//   const [filteredMenuList, setFilteredMenuList] = useState([]);
//   const navigate = useNavigate();
//   const { restaurantId } = useRestaurantId();
//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const customerId = userData ? userData.customer_id : null;

//   const [isLoading, setIsLoading] = useState(false);
//   const hasFetchedData = useRef(false);
//   const swiperRef = useRef(null); // Declare the swiperRef using useRef


//   const fetchMenuData = useCallback(
//     async (categoryId) => {
//       if (isLoading || hasFetchedData.current) return;
//       setIsLoading(true);
//       hasFetchedData.current = true;
//       try {
//         const requestBody = {
//           customer_id: customerId,
//           restaurant_id: restaurantId,
//         };

//         console.log("Fetching menu data with:", requestBody);

//         const response = await fetch(
//           "https://menumitra.com/user_api/get_all_menu_list_by_category",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(requestBody),
//           }
//         );

//         const data = await response.json();
//         console.log("API Response:", data);

//         if (response.ok && data.st === 1) {
//           if (Array.isArray(data.data.category)) {
//             const formattedCategories = data.data.category.map((category) => ({
//               ...category,
//               name: toTitleCase(category.category_name),
//             }));
//             setMenuCategories(formattedCategories);
//           }

//           if (Array.isArray(data.data.menus)) {
//             const formattedMenuList = data.data.menus.map((menu) => ({
//               ...menu,
//               image: menu.image || images,
//               category: toTitleCase(menu.category_name),
//               name: toTitleCase(menu.menu_name),
//               oldPrice: Math.floor(menu.price * 1.1),
//               is_favourite: menu.is_favourite === 1,
//             }));
//             setMenuList(formattedMenuList);
//             setTotalMenuCount(formattedMenuList.length);

//             if (categoryId === null) {
//               setFilteredMenuList(formattedMenuList);
//             } else {
//               const filteredMenus = formattedMenuList.filter(
//                 (menu) => menu.menu_cat_id === categoryId
//               );
//               setFilteredMenuList(filteredMenus);
//             }
//             localStorage.setItem(
//               "menuItems",
//               JSON.stringify(formattedMenuList)
//             );
//           } else {
//             setMenuCategories([]);
//             setMenuList([]);
//             setFilteredMenuList([]);
//           }
//         } else {
//           console.error("API Error:", data.msg);
//           setMenuCategories([]);
//           setMenuList([]);
//           setFilteredMenuList([]);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setMenuCategories([]);
//         setMenuList([]);
//         setFilteredMenuList([]);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [customerId, restaurantId, isLoading]
//   );

//   const debouncedFetchMenuData = useCallback(
//     debounce((categoryId) => {
//       fetchMenuData(categoryId);
//     }, 300),
//     [fetchMenuData]
//   );

//   useEffect(() => {
//     if (restaurantId) {
//       debouncedFetchMenuData(null);
//       setSelectedCategoryId(null);
//     }
//   }, [restaurantId, selectedCategoryId, debouncedFetchMenuData]);

//   useEffect(() => {
//     if (menuCategories.length > 0) {
//       if (swiperRef.current) {
//         swiperRef.current.destroy(true, true); // Destroy previous instance if it exists
//       }

//       swiperRef.current = new Swiper(".category-slide", {
//         slidesPerView: "auto",
//         spaceBetween: 10,
//         observer: true, // Reinitialize when DOM changes
//         observeParents: true,
//       });
//     }
//     // Cleanup to destroy the swiper on unmount
//     return () => {
//       if (swiperRef.current) {
//         swiperRef.current.destroy(true, true);
//       }
//     };
//   }, [menuCategories, selectedCategoryId]); // Add selectedCategoryId to reinitialize on category change

//   const handleLikeClick = async (menuId) => {
//     if (!customerId || !restaurantId) {
//       console.error("Missing required data");
//       return;
//     }

//     const menuItem = menuList.find((item) => item.menu_id === menuId);
//     const isFavorite = menuItem.is_favourite;

//     const apiUrl = isFavorite
//       ? "https://menumitra.com/user_api/remove_favourite_menu"
//       : "https://menumitra.com/user_api/save_favourite_menu";

//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           restaurant_id: restaurantId,
//           menu_id: menuId,
//           customer_id: customerId,
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data.st === 1) {
//           const updatedMenuList = menuList.map((item) =>
//             item.menu_id === menuId
//               ? { ...item, is_favourite: !isFavorite }
//               : item
//           );
//           setMenuList(updatedMenuList);
//           setFilteredMenuList(
//             updatedMenuList.filter(
//               (item) =>
//                 item.menu_cat_id === selectedCategoryId ||
//                 selectedCategoryId === null
//             )
//           );
//           console.log(
//             isFavorite ? "Removed from favorites" : "Added to favorites"
//           );
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

//  const handleCategorySelect = useCallback(
//    (categoryId) => {
//      setSelectedCategoryId(categoryId); // Update the selected category
//      hasFetchedData.current = false;
//      debouncedFetchMenuData(categoryId); // Refetch data for the selected category
//    },
//    [debouncedFetchMenuData]
//  );


//   const toTitleCase = (str) => {
//     return str.replace(/\w\S*/g, function (txt) {
//       return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//     });
//   };

//   const handleAddToCartClick = async (menu) => {
//     if (!customerId || !restaurantId) {
//       console.error("Missing required data");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/add_to_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             restaurant_id: restaurantId,
//             menu_id: menu.menu_id,
//             customer_id: customerId,
//             quantity: 1,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (response.ok && data.st === 1) {
//         console.log("Item successfully added to cart");

//         // Store the cart_id in local storage
//         localStorage.setItem("cartId", data.cart_id);

//         // Navigate to the Cart component
//         navigate("");
//       } else {
//         console.error("Failed to add item to cart:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error adding item to cart:", error);
//     }
//   };

//   const isMenuItemInCart = (menuId) => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     return cartItems.some((item) => item.menu_id === menuId);
//   };

//   return (
//     <div>
//       <div className="dz-box">
//         {menuCategories && menuCategories.length > 0 && (
//           <div className="title-bar">
//             <h5 className="title p-r50 fs-5">Menu Category</h5>
//             <Link to="/Category">
//               <i className="ri-arrow-right-line fs-3"></i>
//             </Link>
//           </div>
//         )}
//         <div className="swiper category-slide">
//           <div className="swiper-wrapper">
//             {/* "All" Category */}
//             <div
//               className={`category-btn border border-2 rounded-5 swiper-slide fs-6 ${
//                 selectedCategoryId === null ? "active" : ""
//               }`}
//               onClick={() => handleCategorySelect(null)}
//               style={{
//                 backgroundColor: selectedCategoryId === null ? "#0D775E" : "",
//                 color: selectedCategoryId === null ? "#ffffff" : "",
//               }}
//             >
//               All ({totalMenuCount})
//             </div>

//             {/* Render other categories */}
//             {menuCategories.map((category) => (
//               <div key={category.menu_cat_id} className="swiper-slide">
//                 <div
//                   className={`category-btn border border-2 rounded-5 fs-6 ${
//                     selectedCategoryId === category.menu_cat_id ? "active" : ""
//                   }`}
//                   onClick={() => handleCategorySelect(category.menu_cat_id)}
//                   style={{
//                     backgroundColor:
//                       selectedCategoryId === category.menu_cat_id
//                         ? "#0D775E"
//                         : "",
//                     color:
//                       selectedCategoryId === category.menu_cat_id
//                         ? "#ffffff"
//                         : "",
//                   }}
//                 >
//                   {category.category_name} ({category.menu_count})
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="row g-3 grid-style-1">
//         {filteredMenuList.length > 0 ? (
//           filteredMenuList.map((menu) => (
//             <div key={menu.menu_id} className="col-6">
//               <div className="card-item style-6">
//                 <div className="dz-media">
//                   <Link
//                     to={{
//                       pathname: `/ProductDetails/${menu.menu_id}`,
//                     }}
//                     state={{ menu_cat_id: menu.menu_cat_id }} // Pass menu_cat_id as state
//                   >
//                     <img
//                       src={menu.image || images}
//                       alt={menu.name}
//                       style={{ height: "200px", width: "300px" }}
//                       onError={(e) => {
//                         e.target.src = images;
//                       }}
//                     />
//                   </Link>
//                 </div>
//                 <div className="dz-content">
//                   <div
//                     className="detail-content category-text"
//                     style={{ position: "relative" }}
//                   >
//                     <div
//                       className="dz-quantity detail-content fs-6 fw-medium"
//                       style={{ color: "#0a795b" }}
//                     >
//                       <i
//                         className="ri-restaurant-line "
//                         style={{ paddingRight: "5px" }}
//                       ></i>
//                       {menu.category}
//                     </div>
//                     <i
//                       className={`${
//                         menu.is_favourite
//                           ? "ri-hearts-fill fs-2"
//                           : "ri-heart-2-line fs-2"
//                       }`}
//                       onClick={() => handleLikeClick(menu.menu_id)}
//                       style={{
//                         position: "absolute",
//                         top: "0",
//                         right: "0",
//                         fontSize: "23px",
//                         cursor: "pointer",
//                         color: menu.is_favourite ? "#fe0809" : "#73757b",
//                       }}
//                     ></i>
//                   </div>

//                   {menu.name && (
//                     <h4 className="item-name fs-6 mt-2 text-break">
//                       {menu.name}
//                     </h4>
//                   )}
//                   {menu.spicy_index && (
//                     <div className="row">
//                       <div className="col-6">
//                         <div className="offer-code mt-2">
//                           {Array.from({ length: 5 }).map((_, index) =>
//                             index < menu.spicy_index ? (
//                               <i
//                                 className="ri-fire-fill fs-6"
//                                 style={{ fontSize: "12px" }}
//                                 key={index}
//                               ></i>
//                             ) : (
//                               <i
//                                 className="ri-fire-line fs-6"
//                                 style={{ fontSize: "12px", color: "#bbbaba" }}
//                                 key={index}
//                               ></i>
//                             )
//                           )}
//                         </div>
//                       </div>
//                       <div
//                         className="col-6 text-end"
//                         style={{ position: "relative", top: "8px" }}
//                       >
//                         <i
//                           className="ri-star-half-line pe-1 fs-6"
//                           style={{ color: "#f8a500", fontSize: "23px" }}
//                         ></i>
//                         <span
//                           className="fs-6 fw-semibold"
//                           style={{ color: "#7f7e7e", marginLeft: "5px" }}
//                         >
//                           {menu.rating}
//                         </span>
//                       </div>
//                     </div>
//                   )}

//                   <div className="footer-wrapper mt-2">
//                     <div className="price-wrapper d-flex align-items-baseline">
//                       <h6 className="current-price me-0 fs-6 fw-medium">
//                         ₹{menu.price}
//                       </h6>
//                       <span className="old-price ms-0 fs-8 ms-1">
//                         ₹{menu.oldPrice}
//                       </span>
//                     </div>

//                     <div className="small-offer-text">
//                       {menu.offer}
//                       {"%"} Off
//                     </div>

//                     <div className="footer-btns">
//                       {userData ? (
//                         <div
//                           onClick={() => handleAddToCartClick(menu)}
//                           className="cart-btn"
//                         >
//                           {isMenuItemInCart(menu.menu_id) ? (
//                             <i className="ri-shopping-cart-2-fill fs-2"></i>
//                           ) : (
//                             <i className="ri-shopping-cart-2-line fs-2"></i>
//                           )}
//                         </div>
//                       ) : (
//                         <i className="ri-shopping-cart-2-line fs-2"></i>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p>No items available in this category.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductCard;










// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import images from "../assets/MenuDefault.png";
// import Swiper from "swiper";
// import { debounce } from "lodash";
// import NearbyArea from "./NearbyArea";
// import Signinscreen from './../screens/Signinscreen';

// const ProductCard = () => {
//   const [menuList, setMenuList] = useState([]);
//   const [menuCategories, setMenuCategories] = useState([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState(null);
//   const [totalMenuCount, setTotalMenuCount] = useState(0);
//   const [filteredMenuList, setFilteredMenuList] = useState([]);
//   const [cartItems, setCartItems] = useState(
//     () => JSON.parse(localStorage.getItem("cartItems")) || []
//   );
//   const navigate = useNavigate();
//   const { restaurantId } = useRestaurantId();
//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const customerId = userData ? userData.customer_id : null;

//   const [isLoading, setIsLoading] = useState(false);
//   const hasFetchedData = useRef(false);
//   const swiperRef = useRef(null);

//   // Sync cartItems with localStorage
//   useEffect(() => {
//     localStorage.setItem("cartItems", JSON.stringify(cartItems));
//   }, [cartItems]);

//   const fetchMenuData = useCallback(
//     async (categoryId) => {
//       if (isLoading || hasFetchedData.current) return;
//       setIsLoading(true);
//       hasFetchedData.current = true;
//       try {
//         const requestBody = {
//           customer_id: customerId,
//           restaurant_id: restaurantId,
//         };

//         const response = await fetch(
//           "https://menumitra.com/user_api/get_all_menu_list_by_category",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(requestBody),
//           }
//         );

//         const data = await response.json();

//         if (response.ok && data.st === 1) {
//           if (Array.isArray(data.data.category)) {
//             const formattedCategories = data.data.category.map((category) => ({
//               ...category,
//               name: toTitleCase(category.category_name),
//             }));
//             setMenuCategories(formattedCategories);
//           }

//           if (Array.isArray(data.data.menus)) {
//             const formattedMenuList = data.data.menus.map((menu) => ({
//               ...menu,
//               image: menu.image || images,
//               category: toTitleCase(menu.category_name),
//               name: toTitleCase(menu.menu_name),
//               oldPrice: Math.floor(menu.price * 1.1),
//               is_favourite: menu.is_favourite === 1,
//             }));
//             setMenuList(formattedMenuList);
//             setTotalMenuCount(formattedMenuList.length);

//             if (categoryId === null) {
//               setFilteredMenuList(formattedMenuList);
//             } else {
//               const filteredMenus = formattedMenuList.filter(
//                 (menu) => menu.menu_cat_id === categoryId
//               );
//               setFilteredMenuList(filteredMenus);
//             }
//             localStorage.setItem(
//               "menuItems",
//               JSON.stringify(formattedMenuList)
//             );
//           } else {
//             setMenuCategories([]);
//             setMenuList([]);
//             setFilteredMenuList([]);
//           }
//         } else {
//           setMenuCategories([]);
//           setMenuList([]);
//           setFilteredMenuList([]);
//         }
//       } catch (error) {
//         setMenuCategories([]);
//         setMenuList([]);
//         setFilteredMenuList([]);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [customerId, restaurantId, isLoading]
//   );

//   const debouncedFetchMenuData = useCallback(
//     debounce((categoryId) => {
//       fetchMenuData(categoryId);
//     }, 300),
//     [fetchMenuData]
//   );

//   useEffect(() => {
//     if (restaurantId) {
//       debouncedFetchMenuData(null);
//       setSelectedCategoryId(null);
//     }
//   }, [restaurantId, selectedCategoryId, debouncedFetchMenuData]);

//   useEffect(() => {
//     if (menuCategories.length > 0) {
//       if (swiperRef.current) {
//         swiperRef.current.destroy(true, true); // Destroy previous instance if it exists
//       }

//       swiperRef.current = new Swiper(".category-slide", {
//         slidesPerView: "auto",
//         spaceBetween: 10,
//         observer: true,
//         observeParents: true,
//       });
//     }
//     // Cleanup to destroy the swiper on unmount
//     return () => {
//       if (swiperRef.current) {
//         swiperRef.current.destroy(true, true);
//       }
//     };
//   }, [menuCategories, selectedCategoryId]);

//   const handleLikeClick = async (menuId) => {
//     if (!customerId || !restaurantId) {
//       console.error("Missing required data");
//       navigate('/Signinscreen')
//       return;
//     }

//     const menuItem = menuList.find((item) => item.menu_id === menuId);
//     const isFavorite = menuItem.is_favourite;

//     const apiUrl = isFavorite
//       ? "https://menumitra.com/user_api/remove_favourite_menu"
//       : "https://menumitra.com/user_api/save_favourite_menu";

//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           restaurant_id: restaurantId,
//           menu_id: menuId,
//           customer_id: customerId,
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data.st === 1) {
//           const updatedMenuList = menuList.map((item) =>
//             item.menu_id === menuId
//               ? { ...item, is_favourite: !isFavorite }
//               : item
//           );
//           setMenuList(updatedMenuList);
//           setFilteredMenuList(
//             updatedMenuList.filter(
//               (item) =>
//                 item.menu_cat_id === selectedCategoryId ||
//                 selectedCategoryId === null
//             )
//           );
//         }
//       }
//     } catch (error) {
//       console.error("Error updating favorite status:", error);
//     }
//   };

//   const handleCategorySelect = useCallback(
//     (categoryId) => {
//       setSelectedCategoryId(categoryId);
//       hasFetchedData.current = false;
//       debouncedFetchMenuData(categoryId);
//     },
//     [debouncedFetchMenuData]
//   );

//   const toTitleCase = (str) => {
//     return str.replace(/\w\S*/g, function (txt) {
//       return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//     });
//   };

//   const handleAddToCartClick = async (menu) => {
//     if (!customerId || !restaurantId) {
//       console.error("Missing required data");
//       navigate('/Signinscreen')
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/add_to_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             restaurant_id: restaurantId,
//             menu_id: menu.menu_id,
//             customer_id: customerId,
//             quantity: 1,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (response.ok && data.st === 1) {
//         const updatedCartItems = [...cartItems, { ...menu, quantity: 1 }];
//         setCartItems(updatedCartItems);
//         localStorage.setItem("cartId", data.cart_id);
//       }
//     } catch (error) {
//       console.error("Error adding item to cart:", error);
//     }
//   };

//   const isMenuItemInCart = (menuId) => {
//     return cartItems.some((item) => item.menu_id === menuId);
//   };

//   return (
//     <div>
//       <div className="dz-box">
//         {menuCategories && menuCategories.length > 0 && (
//           <div className="title-bar">
//             <h5 className="title p-r50 fs-5">Menu Category</h5>
//             <Link to="/Category">
//               <i className="ri-arrow-right-line fs-3"></i>
//             </Link>
//           </div>
//         )}
//         <div className="swiper category-slide">
//           <div className="swiper-wrapper">
//             <div
//               className={`category-btn border border-2 rounded-5 swiper-slide fs-6 ${
//                 selectedCategoryId === null ? "active" : ""
//               }`}
//               onClick={() => handleCategorySelect(null)}
//               style={{
//                 backgroundColor: selectedCategoryId === null ? "#0D775E" : "",
//                 color: selectedCategoryId === null ? "#ffffff" : "",
//               }}
//             >
//               All ({totalMenuCount})
//             </div>

//             {menuCategories.map((category) => (
//               <div key={category.menu_cat_id} className="swiper-slide">
//                 <div
//                   className={`category-btn border border-2 rounded-5 fs-6 ${
//                     selectedCategoryId === category.menu_cat_id ? "active" : ""
//                   }`}
//                   onClick={() => handleCategorySelect(category.menu_cat_id)}
//                   style={{
//                     backgroundColor:
//                       selectedCategoryId === category.menu_cat_id
//                         ? "#0D775E"
//                         : "",
//                     color:
//                       selectedCategoryId === category.menu_cat_id
//                         ? "#ffffff"
//                         : "",
//                   }}
//                 >
//                   {category.category_name} ({category.menu_count})
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="row g-3 grid-style-1">
//         {filteredMenuList.length > 0 ? (
//           filteredMenuList.map((menu) => (
//             <div key={menu.menu_id} className="col-6">
//               <div className="card-item style-6">
//                 <div className="dz-media">
//                   <Link
//                     to={{
//                       pathname: `/ProductDetails/${menu.menu_id}`,
//                     }}
//                     state={{ menu_cat_id: menu.menu_cat_id }}
//                   >
//                     <img
//                       src={menu.image || images}
//                       alt={menu.name}
//                       style={{ height: "200px", width: "300px" }}
//                       onError={(e) => {
//                         e.target.src = images;
//                       }}
//                     />
//                   </Link>
//                 </div>
//                 <div className="dz-content">
//                   <div
//                     className="detail-content category-text"
//                     style={{ position: "relative" }}
//                   >
//                     <div
//                       className="dz-quantity detail-content fs-xs fw-medium"
//                       style={{ color: "#0a795b" }}
//                     >
//                       <i
//                         className="ri-restaurant-line"
//                         style={{ paddingRight: "5px" }}
//                       ></i>
//                       {menu.category}
//                     </div>
//                     <i
//                       className={`${
//                         menu.is_favourite
//                           ? "ri-hearts-fill fs-2"
//                           : "ri-heart-2-line fs-2"
//                       }`}
//                       onClick={() => handleLikeClick(menu.menu_id)}
//                       style={{
//                         position: "absolute",
//                         top: "0",
//                         right: "0",
//                         fontSize: "23px",
//                         cursor: "pointer",
//                         color: menu.is_favourite ? "#fe0809" : "#73757b",
//                       }}
//                     ></i>
//                   </div>

//                   {menu.name && (
//                     <div className="fs-sm mt-2 text-break">{menu.name}</div>
//                   )}
//                   {menu.spicy_index && (
//                     <div className="row">
//                       <div className="col-6">
//                         <div className="offer-code mt-2">
//                           {Array.from({ length: 5 }).map((_, index) =>
//                             index < menu.spicy_index ? (
//                               <i
//                                 className="ri-fire-fill fs-6"
//                                 style={{ fontSize: "12px" }}
//                                 key={index}
//                               ></i>
//                             ) : (
//                               <i
//                                 className="ri-fire-line fs-6"
//                                 style={{ fontSize: "12px", color: "#bbbaba" }}
//                                 key={index}
//                               ></i>
//                             )
//                           )}
//                         </div>
//                       </div>
//                       <div
//                         className="col-6 text-end mt-2" 
//                       >
//                         <i
//                           className="ri-star-half-line pe-1 fs-6"
//                           style={{ color: "#f8a500", }}
//                         ></i>
//                         <span
//                           className="fs-6 fw-semibold"
//                           style={{ color: "#7f7e7e", marginLeft: "5px" }}
//                         >
//                           {menu.rating}
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                   <div className="row">
//                     <div className="col-8">
//                       <div className="footer-wrapper">
//                         <div className="price-wrapper d-flex align-items-baseline">
//                           {/* <h6 className="current-price me-0 fs-6 fw-medium">
//                                 ₹{menu.price}
//                               </h6>
//                               <span className="old-price ms-0 fs-8 ms-1">
//                                 ₹{menu.oldPrice}
//                               </span> */}
//                           <p className="mb-1 fs-4 fw-medium">
//                             <span className="ms- me-2 text-info">
//                               ₹{menu.price}
//                             </span>
//                             <span className="text-muted fs-6 text-decoration-line-through">
//                               ₹{menu.oldPrice || menu.price}
//                             </span>
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* <div className="small-offer-text">
//                       {menu.offer}
//                       {"%"} Off
//                     </div> */}

//                     <div className="col-4">
//                       {userData ? (
//                         <div
//                           onClick={() => handleAddToCartClick(menu)}
//                           className="cart-btn text-end"
//                         >
//                           <i
//                             className={`ri-shopping-cart-2-${
//                               isMenuItemInCart(menu.menu_id) ? "fill" : "line"
//                             } fs-2`}
//                           ></i>
//                         </div>
//                       ) : (
//                         <i className="ri-shopping-cart-2-line fs-2"></i>
//                       )}
//                     </div>
//                   </div>
//                   <div className="row">
//                     <div className="col-12">
//                       <span className="fs-6  text-primary">
//                         {menu.offer || "No "}% Off
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p>No items available in this category.</p>
//         )}
//       </div>
//       <NearbyArea />
//     </div>
//   );
// };

// export default ProductCard;





import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import images from "../assets/MenuDefault.png";
import Swiper from "swiper";
import { debounce } from "lodash";
import NearbyArea from "./NearbyArea";
import Signinscreen from "./../screens/Signinscreen";

// Convert strings to Title Case
const toTitleCase = (text) => {
  if (!text) return "";
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

const ProductCard = () => {
  const [menuList, setMenuList] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [totalMenuCount, setTotalMenuCount] = useState(0);
  const [filteredMenuList, setFilteredMenuList] = useState([]);
  const [cartItems, setCartItems] = useState(
    () => JSON.parse(localStorage.getItem("cartItems")) || []
  );
  const navigate = useNavigate();
  const { restaurantId } = useRestaurantId();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const customerId = userData ? userData.customer_id : null;

  const [isLoading, setIsLoading] = useState(false);
  const hasFetchedData = useRef(false);
  const swiperRef = useRef(null);

  // Sync cartItems with localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const fetchMenuData = useCallback(
    async (categoryId) => {
      if (isLoading || hasFetchedData.current) return;
      setIsLoading(true);
      hasFetchedData.current = true;
      try {
        const requestBody = {
          customer_id: customerId,
          restaurant_id: restaurantId,
        };

        const response = await fetch(
          "https://menumitra.com/user_api/get_all_menu_list_by_category",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        const data = await response.json();

        if (response.ok && data.st === 1) {
          if (Array.isArray(data.data.category)) {
            const formattedCategories = data.data.category.map((category) => ({
              ...category,
              name: toTitleCase(category.category_name),
            }));
            setMenuCategories(formattedCategories);
          }

          if (Array.isArray(data.data.menus)) {
            const formattedMenuList = data.data.menus.map((menu) => ({
              ...menu,
              image: menu.image || images,
              category: toTitleCase(menu.category_name),
              name: toTitleCase(menu.menu_name),
              oldPrice: Math.floor(menu.price * 1.1),
              is_favourite: menu.is_favourite === 1,
            }));
            setMenuList(formattedMenuList);
            setTotalMenuCount(formattedMenuList.length);

            if (categoryId === null) {
              setFilteredMenuList(formattedMenuList);
            } else {
              const filteredMenus = formattedMenuList.filter(
                (menu) => menu.menu_cat_id === categoryId
              );
              setFilteredMenuList(filteredMenus);
            }
            localStorage.setItem(
              "menuItems",
              JSON.stringify(formattedMenuList)
            );
          } else {
            setMenuCategories([]);
            setMenuList([]);
            setFilteredMenuList([]);
          }
        } else {
          setMenuCategories([]);
          setMenuList([]);
          setFilteredMenuList([]);
        }
      } catch (error) {
        setMenuCategories([]);
        setMenuList([]);
        setFilteredMenuList([]);
      } finally {
        setIsLoading(false);
      }
    },
    [customerId, restaurantId, isLoading]
  );

  const debouncedFetchMenuData = useCallback(
    debounce((categoryId) => {
      fetchMenuData(categoryId);
    }, 300),
    [fetchMenuData]
  );

  useEffect(() => {
    if (restaurantId) {
      debouncedFetchMenuData(null);
      setSelectedCategoryId(null);
    }
  }, [restaurantId, debouncedFetchMenuData]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    if (categoryId === null) {
      setFilteredMenuList(menuList);
    } else {
      const filteredMenus = menuList.filter(
        (menu) => menu.menu_cat_id === categoryId
      );
      setFilteredMenuList(filteredMenus);
    }
  };

  useEffect(() => {
    if (menuCategories.length > 0) {
      swiperRef.current = new Swiper(".category-slide", {
        slidesPerView: "auto",
        spaceBetween: 10,
      });

      // Add scroll event listener
      const swiperContainer = document.querySelector(".category-slide");
      swiperContainer.addEventListener("scroll", () => {
        if (swiperContainer.scrollLeft === 0) {
          handleCategorySelect(menuCategories[0].menu_cat_id);
        }
      });
    }
  }, [menuCategories]);

  const handleLikeClick = async (menuId) => {
    if (!customerId || !restaurantId) {
      console.error("Missing required data");
      navigate("/Signinscreen");
      return;
    }

    const menuItem = menuList.find((item) => item.menu_id === menuId);
    const isFavorite = menuItem.is_favourite;

    const apiUrl = isFavorite
      ? "https://menumitra.com/user_api/remove_favourite_menu"
      : "https://menumitra.com/user_api/save_favourite_menu";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          menu_id: menuId,
          customer_id: customerId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1) {
          const updatedMenuList = menuList.map((item) =>
            item.menu_id === menuId
              ? { ...item, is_favourite: !isFavorite }
              : item
          );
          setMenuList(updatedMenuList);
          setFilteredMenuList(
            updatedMenuList.filter(
              (item) =>
                item.menu_cat_id === selectedCategoryId ||
                selectedCategoryId === null
            )
          );
        }
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const handleAddToCartClick = async (menu) => {
    if (!customerId || !restaurantId) {
      console.error("Missing required data");
      navigate("/Signinscreen");
      return;
    }

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
            menu_id: menu.menu_id,
            customer_id: customerId,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.st === 1) {
        const updatedCartItems = [...cartItems, { ...menu, quantity: 1 }];
        setCartItems(updatedCartItems);
        localStorage.setItem("cartId", data.cart_id);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const isMenuItemInCart = (menuId) => {
    return cartItems.some((item) => item.menu_id === menuId);
  };

  return (
    <div>
      <div className="dz-box">
        {menuCategories && menuCategories.length > 0 && (
          <div className="title-bar">
            <h5 className="title p-r50 fs-5">Menu Category</h5>
            <Link to="/Category">
              <i className="ri-arrow-right-line fs-3"></i>
            </Link>
          </div>
        )}
        <div className="swiper category-slide">
          <div className="swiper-wrapper">
            <div
              className={`category-btn border border-2 rounded-5 swiper-slide fs-6 ${
                selectedCategoryId === null ? "active" : ""
              }`}
              onClick={() => handleCategorySelect(null)}
              style={{
                backgroundColor: selectedCategoryId === null ? "#0D775E" : "",
                color: selectedCategoryId === null ? "#ffffff" : "",
              }}
            >
              All ({totalMenuCount})
            </div>

            {menuCategories.map((category) => (
              <div key={category.menu_cat_id} className="swiper-slide">
                <div
                  className={`category-btn border border-2 rounded-5 fs-6 ${
                    selectedCategoryId === category.menu_cat_id ? "active" : ""
                  }`}
                  onClick={() => handleCategorySelect(category.menu_cat_id)}
                  style={{
                    backgroundColor:
                      selectedCategoryId === category.menu_cat_id
                        ? "#0D775E"
                        : "",
                    color:
                      selectedCategoryId === category.menu_cat_id
                        ? "#ffffff"
                        : "",
                  }}
                >
                  {category.name} ({category.menu_count})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-3 grid-style-1">
        {filteredMenuList.length > 0 ? (
          filteredMenuList.map((menu) => (
            <div key={menu.menu_id} className="col-6">
              <div className="card-item style-6">
                <div className="dz-media">
                  <Link
                    to={{
                      pathname: `/ProductDetails/${menu.menu_id}`,
                    }}
                    state={{ menu_cat_id: menu.menu_cat_id }}
                  >
                    <img
                      src={menu.image || images}
                      alt={menu.name}
                      style={{ height: "200px", width: "300px" }}
                      onError={(e) => {
                        e.target.src = images;
                      }}
                    />
                  </Link>
                </div>
                <div className="dz-content">
                  <div
                    className="detail-content category-text"
                    style={{ position: "relative" }}
                  >
                    <div
                      className="dz-quantity detail-content fs-xs fw-medium"
                      style={{ color: "#0a795b" }}
                    >
                      <i
                        className="ri-restaurant-line"
                        style={{ paddingRight: "5px" }}
                      ></i>
                      {menu.category}
                    </div>
                    <i
                      className={`${
                        menu.is_favourite
                          ? "ri-hearts-fill fs-2"
                          : "ri-heart-2-line fs-2"
                      }`}
                      onClick={() => handleLikeClick(menu.menu_id)}
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        fontSize: "23px",
                        cursor: "pointer",
                        color: menu.is_favourite ? "#fe0809" : "#73757b",
                      }}
                    ></i>
                  </div>

                  {menu.name && (
                    <div className="item-name fs-sm text-wrap">
                      {menu.name}
                      </div>
                  )}
                  {menu.spicy_index && (
                    <div className="row">
                      <div className="col-6">
                        <div className="offer-code mt-2">
                          {Array.from({ length: 5 }).map((_, index) =>
                            index < menu.spicy_index ? (
                              <i
                                className="ri-fire-fill fs-6"
                                style={{ fontSize: "12px" }}
                                key={index}
                              ></i>
                            ) : (
                              <i
                                className="ri-fire-line fs-6"
                                style={{ fontSize: "12px", color: "#bbbaba" }}
                                key={index}
                              ></i>
                            )
                          )}
                        </div>
                      </div>
                      <div className="col-6 text-end mt-2">
                        <i
                          className="ri-star-half-line pe-1 fs-6"
                          style={{ color: "#f8a500" }}
                        ></i>
                        <span
                          className="fs-6 fw-semibold"
                          style={{ color: "#7f7e7e", marginLeft: "5px" }}
                        >
                          {menu.rating}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="row">
                    <div className="col-8">
                      <div className="footer-wrapper">
                        <div className="price-wrapper d-flex align-items-baseline">
                          <p className="mb-1 fs-4 fw-medium">
                            <span className="ms- me-2 text-info">
                              ₹{menu.price}
                            </span>
                            <span className="gray-text fs-6 text-decoration-line-through">
                              ₹{menu.oldPrice || menu.price}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-4">
                      {userData ? (
                        <div
                          onClick={() => handleAddToCartClick(menu)}
                          className="cart-btn text-end"
                        >
                          <i
                            className={`ri-shopping-cart-2-${
                              isMenuItemInCart(menu.menu_id) ? "fill" : "line"
                            } fs-2`}
                          ></i>
                        </div>
                      ) : (
                        <i className="ri-shopping-cart-2-line fs-2"></i>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <span className="fs-6  text-primary">
                        {menu.offer || "No "}% Off
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No items available in this category.</p>
        )}
      </div>
      <NearbyArea />
    </div>
  );
};

export default ProductCard;