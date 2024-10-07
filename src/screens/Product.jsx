

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import Swiper from "swiper/bundle";
// import "swiper/css/bundle";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import Slider from "@mui/material/Slider"; // Import the Slider component
// import Bottom from "../component/bottom";

// // Convert strings to Title Case
// const toTitleCase = (text) => {
//   if (!text) return "";
//   return text.replace(/\b\w/g, (char) => char.toUpperCase());
// };

// const Product = () => {
//   const [menuList, setMenuList] = useState([]);
//   const [favorites, setFavorites] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [cartItemsCount, setCartItemsCount] = useState(0);
//   const [filteredMenuList, setFilteredMenuList] = useState([]);
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [sortByOpen, setSortByOpen] = useState(false);
//   const [priceRange, setPriceRange] = useState([100, 1000]);
//   const [filterOpen, setFilterOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [categoryCounts, setCategoryCounts] = useState({});
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const { restaurantId } = useRestaurantId();
//   const [sortCriteria, setSortCriteria] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const initialFetchDone = useRef(false);

//   // Fetch menu data using a single API
//   const fetchMenuData = useCallback(async () => {
//     if (!restaurantId || isLoading) return;

//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_all_menu_list_by_category",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             customer_id: userData ? userData.customer_id : null,
//             restaurant_id: restaurantId,
//           }),
//         }
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch menu data");
//       }

//       const data = await response.json();

//       if (data.st === 1) {
//         // Formatting the menu list
//         const formattedMenuList = data.data.menus.map((menuItem) => ({
//           ...menuItem,
//           name: toTitleCase(menuItem.menu_name || ""),
//           category: toTitleCase(menuItem.category_name || ""),
//           oldPrice: Math.floor(menuItem.price * 1.1),
//           is_favourite: menuItem.is_favourite === 1,
//         }));

//         setMenuList(formattedMenuList);
//         localStorage.setItem("menuItems", JSON.stringify(formattedMenuList));

//         // Formatting the categories
//         const formattedCategories = data.data.category.map((category) => ({
//           ...category,
//           name: toTitleCase(category.category_name || ""),
//         }));

//         setCategories(formattedCategories);

//         // Initialize category counts correctly
//         const counts = { All: formattedMenuList.length };

//         formattedCategories.forEach((category) => {
//           counts[category.name] = 0;
//         });

//         formattedMenuList.forEach((item) => {
//           counts[item.category] = (counts[item.category] || 0) + 1;
//         });

//         setCategoryCounts(counts);

//         // Handle favorites
//         const favoriteItems = formattedMenuList.filter(
//           (item) => item.is_favourite
//         );
//         setFavorites(favoriteItems);

//         // Set the filtered menu list (initially show all)
//         setFilteredMenuList(formattedMenuList);
//       } else {
//         throw new Error("API request unsuccessful");
//       }
//     } catch (error) {
//       console.error("Error fetching menu data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [restaurantId, isLoading, userData]);

//   useEffect(() => {
//     let isMounted = true;
//     if (restaurantId && !isLoading && !initialFetchDone.current && isMounted) {
//       fetchMenuData();
//       initialFetchDone.current = true;
//     }
//     return () => {
//       isMounted = false;
//     };
//   }, [restaurantId, isLoading, fetchMenuData]);

//   // Update cart items count
//   useEffect(() => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     setCartItemsCount(cartItems.length);
//   }, []);

//   // Handle favorites (like/unlike)
//   const handleLikeClick = async (menuId) => {
//     if (!userData || !restaurantId) return;

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
//           customer_id: userData.customer_id,
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
//                 item.menu_cat_id === selectedCategory ||
//                 selectedCategory === null
//             )
//           );
//           setFavorites(updatedMenuList.filter((item) => item.is_favourite));
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

//   // Add item to cart
//   const handleAddToCartClick = (menuItem) => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     const isAlreadyInCart = cartItems.some(
//       (item) => item.menu_id === menuItem.menu_id
//     );

//     if (isAlreadyInCart) {
//       alert("This item is already in the cart!");
//       return;
//     }

//     const cartItem = {
//       image: menuItem.image,
//       name: menuItem.name,
//       price: menuItem.price,
//       oldPrice: menuItem.oldPrice,
//       quantity: 1,
//       menu_id: menuItem.menu_id,
//     };

//     const updatedCartItems = [...cartItems, cartItem];
//     localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
//     setCartItemsCount(updatedCartItems.length);
//     navigate("/Cart");
//   };

//   // Check if a menu item is in the cart
//   const isMenuItemInCart = (menuId) => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     return cartItems.some((item) => item.menu_id === menuId);
//   };

//   // Category filter
//   const handleCategoryFilter = (categoryName) => {
//     if (categoryName === selectedCategory) {
//       setSelectedCategory(null);
//       setFilteredMenuList(menuList);
//     } else {
//       setSelectedCategory(categoryName);
//       const filteredItems = menuList.filter(
//         (item) =>
//           toTitleCase(item.category || "") === toTitleCase(categoryName || "")
//       );
//       setFilteredMenuList(filteredItems);
//     }
//   };

//   // Swiper initialization for categories
//   useEffect(() => {
//     const swiper = new Swiper(".category-slide", {
//       slidesPerView: "auto",
//       spaceBetween: 10,
//     });
//     return () => swiper.destroy(true, true);
//   }, [categories]);

//   // Handle sorting criteria
//   const handleSort = (criteria) => {
//     setSortCriteria(criteria);
//   };

//   // Apply sorting
//   const applySort = () => {
//     let sortedList = [...filteredMenuList];
//     switch (sortCriteria) {
//       case "priceHighToLow":
//         sortedList.sort((a, b) => b.price - a.price);
//         break;
//       case "priceLowToHigh":
//         sortedList.sort((a, b) => a.price - b.price);
//         break;
//       default:
//         break;
//     }
//     setFilteredMenuList(sortedList);
//     setSortByOpen(false);
//   };

//   // Handle price range change
//   const handlePriceChange = (event, newValue) => {
//     setPriceRange(newValue);
//   };

//   // Apply price filter
//   const handlePriceFilter = () => {
//     const filteredItems = menuList.filter(
//       (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
//     );
//     setFilteredMenuList(filteredItems);
//     setFilterOpen(false);
//   };

//   return (
//     <div className={`page-wrapper ${sortByOpen || filterOpen ? "open" : ""}`}>
//       <header className="header header-fixed style-3 ">
//         <div className="header-content">
//           <div className="left-content">
//             <Link to="/Category">
//               <div className="back-btn dz-icon icon-fill icon-sm">
//                 <i className="ri-arrow-left-line fs-3"></i>
//               </div>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">Menu</h5>
//           </div>
//         </div>
//       </header>

//       <main className={`page-content space-top p-b80`}>
//         <div className="container mt-2 mb-0">
//           <div className="row">
//             <div className="col-12 fw-medium text-end hotel-name">
//               <span className="ps-2">
//                 {userData.restaurantName.toUpperCase()}
//               </span>
//               <i className="ri-store-2-line ps-2"></i>
//               <h6 className="title fw-medium h6 custom-text-gray table-number pe-5 me-5">
//                 Table: {userData.tableNumber || ""}
//               </h6>
//             </div>
//           </div>
//         </div>

//         {/* Category Swiper */}
//         <div className="container pb-0 pt-0">
//           <div className="swiper category-slide">
//             <div className="swiper-wrapper">
//               <div
//                 className={`category-btn swiper-slide ${
//                   selectedCategory === null ? "active" : ""
//                 }`}
//                 onClick={() => handleCategoryFilter(null)}
//                 style={{
//                   backgroundColor: selectedCategory === null ? "#0D775E" : "",
//                   color: selectedCategory === null ? "#ffffff" : "",
//                 }}
//               >
//                 All ({categoryCounts.All})
//               </div>
//               {categories.map((category) => (
//                 <div key={category.menu_cat_id} className="swiper-slide">
//                   <div
//                     className={`category-btn ${
//                       selectedCategory === category.name ? "active" : ""
//                     }`}
//                     onClick={() => handleCategoryFilter(category.name)}
//                     style={{
//                       backgroundColor:
//                         selectedCategory === category.name ? "#0D775E" : "",
//                       color:
//                         selectedCategory === category.name ? "#ffffff" : "",
//                     }}
//                   >
//                     {category.name} ({categoryCounts[category.name] || 0})
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Menu Items */}
//         <div className="container pb-0">
//           <div className="row g-3 grid-style-1">
//             {filteredMenuList.map((menuItem) => (
//               <div key={menuItem.menu_id} className="col-6">
//                 <div className="card-item style-6">
//                   <div className="dz-media">
//                     <Link
//                       to={`/ProductDetails/${menuItem.menu_id}`}
//                       state={{ menu_cat_id: menuItem.menu_cat_id }} // Pass menu_cat_id here
//                     >
//                       <img
//                         src={menuItem.image || images}
//                         alt={menuItem.name || "Menu item"}
//                         style={{ height: "150px" }}
//                         onError={(e) => {
//                           e.target.src = images;
//                         }}
//                       />
//                     </Link>
//                   </div>

//                   <div className="dz-content">
//                     <div
//                       className="detail-content"
//                       style={{ position: "relative" }}
//                     >
//                       <h3 className="product-title fs-xs fw-medium">
//                         <i
//                           className="ri-restaurant-line"
//                           style={{ paddingRight: "5px" }}
//                         ></i>
//                         {categories.find(
//                           (category) =>
//                             category.menu_cat_id === menuItem.menu_cat_id
//                         )?.name || menuItem.category}
//                       </h3>

//                       {userData ? (
//                         <i
//                           className={`${
//                             favorites.some(
//                               (fav) => fav.menu_id === menuItem.menu_id
//                             )
//                               ? "ri-hearts-fill fs-2"
//                               : "ri-heart-2-line fs-2"
//                           }`}
//                           onClick={() => handleLikeClick(menuItem.menu_id)}
//                           style={{
//                             position: "absolute",
//                             top: "0",
//                             right: "0",
//                             fontSize: "23px",
//                             cursor: "pointer",
//                             color: favorites.some(
//                               (fav) => fav.menu_id === menuItem.menu_id
//                             )
//                               ? "#fe0809"
//                               : "#73757b",
//                           }}
//                         ></i>
//                       ) : (
//                         <i
//                           className="ri-heart-2-line fs-2"
//                           style={{
//                             position: "absolute",
//                             top: "0",
//                             right: "0",
//                             fontSize: "23px",
//                             cursor: "pointer",
//                             color: "#73757b",
//                           }}
//                         ></i>
//                       )}
//                     </div>

//                     <div className="item-name  ">
//                       <p className="text-wrap fs-sm fw-medium mb-1">
//                         {menuItem.name}
//                       </p>
//                       {/* {menuItem.name} */}
//                     </div>
//                     <div className="row mb-0 pb-0">
//                       {/* <div className="price-wrapper">
//                         <h6 className="current-price fs-2">
//                           ₹{menuItem.price}
//                         </h6>
//                         <span className="old-price">₹{menuItem.oldPrice}</span>
//                       </div> */}
//                       <div className="col-9 mb-2 fw-medium">
//                         <span className="me-1 fs-5 text-info">
//                           ₹{menuItem.price}
//                         </span>
//                         <span className="gray-text fs-sm text-decoration-line-through">
//                           ₹{menuItem.oldPrice || menuItem.price}
//                         </span>
//                       </div>
//                       {/* <div className="col-5 p-0 ps-2  "></div> */}

//                       <div className="col-2 pe-1">
//                         {userData ? (
//                           <div
//                             onClick={() => handleAddToCartClick(menuItem)}
//                             className="cart-btn "
//                           >
//                             {isMenuItemInCart(menuItem.menu_id) ? (
//                               <i className="ri-shopping-cart-2-fill fs-3"></i>
//                             ) : (
//                               <i className="ri-shopping-cart-2-line fs-3"></i>
//                             )}
//                           </div>
//                         ) : (
//                           <i className="ri-shopping-cart-2-line fs-3"></i>
//                         )}
//                       </div>
//                     </div>
//                     {/* <div className="row pt-0 ps-2">
//                       {" "}
//                       <span className="fs-12px ps-1 text-primary fw-medium">
//                         {menuItem.offer || "No"}% Off
//                       </span>
//                     </div> */}
//                     <div className="row">
//                       <div className="col-12">
//                         <span className="fs-6 text-primary">
//                           {menuItem.offer || "No "}% Off
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Sort and Filter Footer */}

//         {/* <h5 className="sub-title">Price</h5> */}
//         {/* <div className="container" style={{position:"fixed", bottom:"80px"}}> 
//           <div className="row">
//             <div className="col-12">
//               <div className="filter-inner-content rounded py-3 px-3 shadow" style={{backgroundColor:"#ffffff"}}>
//                 <h5 className="sub-title">Price</h5>
//                 <div className="title-bar">
//                   <div
//                     className="price-range-slider"
//                     style={{
//                       width: "100%",
//                       padding: "0 20px",
//                       marginBottom: "20px",
//                     }}
//                   >
//                     <Slider
//                       value={priceRange}
//                       onChange={handlePriceChange}
//                       valueLabelDisplay="auto"
//                       min={100}
//                       max={1000}
//                       sx={{
//                         color: "#0D775E",
//                         width: "100%",
//                         "& .MuiSlider-thumb": {
//                           backgroundColor: "#0D775E",
//                           border: "2px solid #0D775E",
//                         },
//                         "& .MuiSlider-rail": {
//                           height: 4,
//                           backgroundColor: "#9ec8be",
//                         },
//                         "& .MuiSlider-track": {
//                           height: 4,
//                         },
//                       }}
//                     />
//                     <div
//                       className="price-labels"
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         marginTop: "10px",
//                       }}
//                     >
//                       <span>₹{priceRange[0]}</span>
//                       <span>₹{priceRange[1]}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div
//                   className="filter-buttons"
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: "10px",
//                     width: "100%",
//                     padding: "0 20px",
//                   }}
//                 >
//                   <button
//                     onClick={handlePriceFilter}
//                     className="apply-btn"
//                     style={{
//                       padding: "12px 20px",
//                       backgroundColor: "#0D775E",
//                       color: "white",
//                       border: "none",
//                       borderRadius: "8px",
//                       width: "100%",
//                       fontWeight: "bold",
//                       fontSize: "16px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Apply
//                   </button>
//                   <button
//                     onClick={() => setPriceRange([100, 1000])}
//                     className="reset-btn"
//                     style={{
//                       padding: "12px 20px",
//                       backgroundColor: "#f0f0f0",
//                       color: "#333",
//                       border: "1px solid #ccc",
//                       borderRadius: "8px",
//                       width: "100%",
//                       fontWeight: "bold",
//                       fontSize: "16px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Reset
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
    

//         {sortByOpen && (
//           <div
//             className="offcanvas offcanvas-bottom show"
//             tabIndex="-1"
//             style={{ zIndex: 1050 }}
//           >
//             <div className="offcanvas-header">
//               <h5 className="offcanvas-title">Sort By</h5>
//               <button
//                 type="button"
//                 className="btn-close"
//                 onClick={() => setSortByOpen(false)}
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div className="offcanvas-body">
//               <button
//                 className={`btn btn-light w-100 mb-2 ${
//                   sortCriteria === "priceLowToHigh"
//                     ? "bg-primary text-white"
//                     : ""
//                 }`}
//                 onClick={() => handleSort("priceLowToHigh")}
//               >
//                 Price Low to High
//               </button>
//               <button
//                 className={`btn btn-light w-100 mb-2 ${
//                   sortCriteria === "priceHighToLow"
//                     ? "bg-primary text-white"
//                     : ""
//                 }`}
//                 onClick={() => handleSort("priceHighToLow")}
//               >
//                 Price High to Low
//               </button>
//               <div className="d-flex justify-content-between mt-3">
//                 <button
//                   className="btn btn-outline-secondary w-45"
//                   onClick={() => setSortByOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button className="btn btn-primary w-45" onClick={applySort}>
//                   Apply
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {filterOpen && (
//           <div
//             className="offcanvas offcanvas-bottom show"
//             tabIndex="-1"
//             style={{ zIndex: 1050 }}
//           >
//             <div className="offcanvas-header">
//               <h5 className="offcanvas-title">Filter By Price</h5>
//               <button
//                 type="button"
//                 className="btn-close"
//                 onClick={() => setFilterOpen(false)}
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div className="offcanvas-body">
//               <div
//                 className="slider-container"
//                 style={{ position: "relative", zIndex: 1000 }}
//               >
//                 <Slider
//                   value={priceRange}
//                   onChange={handlePriceChange}
//                   valueLabelDisplay="auto"
//                   min={100}
//                   max={1000}
//                   sx={{
//                     color: "#0D775E",
//                     width: "100%",
//                     "& .MuiSlider-thumb": {
//                       backgroundColor: "#0D775E",
//                       border: "2px solid #0D775E",
//                     },
//                     "& .MuiSlider-rail": {
//                       height: 4,
//                       backgroundColor: "#9ec8be",
//                     },
//                     "& .MuiSlider-track": {
//                       height: 4,
//                     },
//                   }}
//                 />
//                 <div className="d-flex justify-content-between mt-2">
//                   <span>₹{priceRange[0]}</span>
//                   <span>₹{priceRange[1]}</span>
//                 </div>
//               </div>
//               <div className="d-flex justify-content-between mt-3">
//                 <button
//                   className="btn btn-primary w-45"
//                   onClick={handlePriceFilter}
//                 >
//                   Apply Price Filter
//                 </button>
//                 <button
//                   className="btn btn-light w-45"
//                   onClick={() => setPriceRange([100, 1000])}
//                 >
//                   Reset
//                 </button>
//               </div>
//             </div>
//           </div>
//         )} */}

//         <div
//           className="container d-flex justify-content-center align-items-center"
//           style={{
//             position: "fixed",
//             bottom: "75px",
//             backgroundColor: "#ffffff",
//             height: "80px",
//             zIndex: 1,
//           }}
//         >
//           <div className="row w-100">
//             <div className="col-12 d-flex justify-content-center">
//               <button
//                 className="btn "
//                 style={{
//                   fontFamily: "poppins",
//                 }}
//                 onClick={() => setFilterOpen(true)}
//               >
//                 <i className="ri-equalizer-line pe-3"></i>
//                 Filter
//               </button>
//             </div>
//           </div>
//         </div>

//         {filterOpen && (
//           <div
//             className={`container ${filterOpen ? "slide-up" : "slide-down"}`}
//             style={{ position: "fixed", bottom: "110px" }}
//           >
//             <div className="row">
//               <div className="col-12">
//                 <div
//                   className="filter-inner-content rounded py-3 px-3 shadow"
//                   style={{ backgroundColor: "#ffffff" }}
//                 >
//                   <h5 className="sub-title">Price</h5>
//                   <div className="title-bar">
//                     <div
//                       className="price-range-slider"
//                       style={{
//                         width: "100%",
//                         padding: "0 20px",
//                         marginBottom: "20px",
//                       }}
//                     >
//                       <Slider
//                         value={priceRange}
//                         onChange={handlePriceChange}
//                         valueLabelDisplay="auto"
//                         min={100}
//                         max={1000}
//                         sx={{
//                           color: "#0D775E",
//                           width: "100%",
//                           "& .MuiSlider-thumb": {
//                             backgroundColor: "#0D775E",
//                             border: "2px solid #0D775E",
//                           },
//                           "& .MuiSlider-rail": {
//                             height: 4,
//                             backgroundColor: "#9ec8be",
//                           },
//                           "& .MuiSlider-track": {
//                             height: 4,
//                           },
//                         }}
//                       />
//                       <div
//                         className="price-labels"
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           marginTop: "10px",
//                         }}
//                       >
//                         <span>₹{priceRange[0]}</span>
//                         <span>₹{priceRange[1]}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div
//                     className="filter-buttons"
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       gap: "10px",
//                       width: "100%",
//                       padding: "0 20px",
//                     }}
//                   >
//                     <div className="row">
//                       <div className="col-6">
//                         <button
//                           onClick={() => {
//                             setFilterOpen(false);
//                             setTimeout(() => setPriceRange([100, 1000]), 400); // Slight delay to wait for the animation to finish
//                           }}
//                           className="reset-btn"
//                           style={{
//                             padding: "12px 20px",
//                             backgroundColor: "#f0f0f0",
//                             color: "#333",
//                             border: "1px solid #ccc",
//                             borderRadius: "8px",
//                             width: "100%",
//                             fontWeight: "bold",
//                             fontSize: "16px",
//                             cursor: "pointer",
//                           }}
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                       <div className="col-6">
//                         <button
//                           onClick={handlePriceFilter}
//                           className="apply-btn"
//                           style={{
//                             padding: "12px 20px",
//                             backgroundColor: "#0D775E",
//                             color: "white",
//                             border: "none",
//                             borderRadius: "8px",
//                             width: "100%",
//                             fontWeight: "bold",
//                             fontSize: "16px",
//                             cursor: "pointer",
//                           }}
//                         >
//                           Apply
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* {sortByOpen && (
//           <div
//             className="offcanvas offcanvas-bottom show"
//             tabIndex="-1"
//             style={{ zIndex: 1050 }}
//           >
//             <div className="offcanvas-header">
//               <h5 className="offcanvas-title">Sort By</h5>
//               <button
//                 type="button"
//                 className="btn-close"
//                 onClick={() => setSortByOpen(false)}
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div className="offcanvas-body">
//               <button
//                 className={`btn btn-light w-100 mb-2 ${
//                   sortCriteria === "priceLowToHigh"
//                     ? "bg-primary text-white"
//                     : ""
//                 }`}
//                 onClick={() => handleSort("priceLowToHigh")}
//               >
//                 Price Low to High
//               </button>
//               <button
//                 className={`btn btn-light w-100 mb-2 ${
//                   sortCriteria === "priceHighToLow"
//                     ? "bg-primary text-white"
//                     : ""
//                 }`}
//                 onClick={() => handleSort("priceHighToLow")}
//               >
//                 Price High to Low
//               </button>
//               <div className="d-flex justify-content-between mt-3">
//                 <button
//                   className="btn btn-outline-secondary w-45"
//                   onClick={() => setSortByOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button className="btn btn-primary w-45" onClick={applySort}>
//                   Apply
//                 </button>
//               </div>
//             </div>
//           </div>
//         )} */}
//       </main>

//       <Bottom />
//     </div>
//   );
// };

// export default Product;





// *-*-*-*-




// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import Swiper from "swiper/bundle";
// import "swiper/css/bundle";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import Slider from "@mui/material/Slider"; // Import the Slider component
// import Bottom from "../component/bottom";

// // Convert strings to Title Case
// const toTitleCase = (text) => {
//   if (!text) return "";
//   return text.replace(/\b\w/g, (char) => char.toUpperCase());
// };

// const Product = () => {
//   const [menuList, setMenuList] = useState([]);
//   const [favorites, setFavorites] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [cartItemsCount, setCartItemsCount] = useState(0);
//   const [filteredMenuList, setFilteredMenuList] = useState([]);
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [sortByOpen, setSortByOpen] = useState(false);
//   const [priceRange, setPriceRange] = useState([100, 1000]);
//   const [filterOpen, setFilterOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [categoryCounts, setCategoryCounts] = useState({});
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const { restaurantId } = useRestaurantId();
//   const [sortCriteria, setSortCriteria] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const initialFetchDone = useRef(false);
//   const swiperRef = useRef(null);

//   // Fetch menu data using a single API
//   const fetchMenuData = useCallback(async () => {
//     if (!restaurantId || isLoading) return;

//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_all_menu_list_by_category",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             customer_id: userData ? userData.customer_id : null,
//             restaurant_id: restaurantId,
//           }),
//         }
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch menu data");
//       }

//       const data = await response.json();

//       if (data.st === 1) {
//         // Formatting the menu list
//         const formattedMenuList = data.data.menus.map((menuItem) => ({
//           ...menuItem,
//           name: toTitleCase(menuItem.menu_name || ""),
//           category: toTitleCase(menuItem.category_name || ""),
//           oldPrice: Math.floor(menuItem.price * 1.1),
//           is_favourite: menuItem.is_favourite === 1,
//         }));

//         setMenuList(formattedMenuList);
//         localStorage.setItem("menuItems", JSON.stringify(formattedMenuList));

//         // Formatting the categories
//         const formattedCategories = data.data.category.map((category) => ({
//           ...category,
//           name: toTitleCase(category.category_name || ""),
//         }));

//         setCategories(formattedCategories);

//         // Initialize category counts correctly
//         const counts = { All: formattedMenuList.length };

//         formattedCategories.forEach((category) => {
//           counts[category.name] = 0;
//         });

//         formattedMenuList.forEach((item) => {
//           counts[item.category] = (counts[item.category] || 0) + 1;
//         });

//         setCategoryCounts(counts);

//         // Handle favorites
//         const favoriteItems = formattedMenuList.filter(
//           (item) => item.is_favourite
//         );
//         setFavorites(favoriteItems);

//         // Set the filtered menu list (initially show all)
//         setFilteredMenuList(formattedMenuList);
//       } else {
//         throw new Error("API request unsuccessful");
//       }
//     } catch (error) {
//       console.error("Error fetching menu data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [restaurantId, isLoading, userData]);

//   useEffect(() => {
//     let isMounted = true;
//     if (restaurantId && !isLoading && !initialFetchDone.current && isMounted) {
//       fetchMenuData();
//       initialFetchDone.current = true;
//     }
//     return () => {
//       isMounted = false;
//     };
//   }, [restaurantId, isLoading, fetchMenuData]);

//   // Update cart items count
//   useEffect(() => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     setCartItemsCount(cartItems.length);
//   }, []);

//   // Handle favorites (like/unlike)
//   const handleLikeClick = async (menuId) => {
//     if (!userData || !restaurantId) return;

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
//           customer_id: userData.customer_id,
//         }),
//       });
//       const data = await response.json();
//       if (response.ok && data.st === 1) {
//         const updatedMenuList = menuList.map((item) =>
//           item.menu_id === menuId
//             ? { ...item, is_favourite: !isFavorite }
//             : item
//         );
//         setMenuList(updatedMenuList);
//         setFilteredMenuList(
//           updatedMenuList.filter(
//             (item) =>
//               item.menu_cat_id === selectedCategory || selectedCategory === null
//           )
//         );
//       }
//     } catch (error) {
//       console.error("Error updating favorite status:", error);
//     }
//   };

//   // Handle category selection
//   const handleCategorySelect = (categoryId) => {
//     setSelectedCategory(categoryId);
//     if (categoryId === null) {
//       setFilteredMenuList(menuList);
//     } else {
//       const filteredMenus = menuList.filter(
//         (menu) => menu.menu_cat_id === categoryId
//       );
//       setFilteredMenuList(filteredMenus);
//     }
//   };

//   useEffect(() => {
//     if (categories.length > 0) {
//       swiperRef.current = new Swiper(".category-slide", {
//         slidesPerView: "auto",
//         spaceBetween: 10,
//       });

//       // Add scroll event listener
//       const swiperContainer = document.querySelector(".category-slide");
//       swiperContainer.addEventListener("scroll", () => {
//         if (swiperContainer.scrollLeft === 0) {
//           handleCategorySelect(categories[0].menu_cat_id);
//         }
//       });
//     }
//   }, [categories]);

//   // Add item to cart
//   const handleAddToCartClick = (menuItem) => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     const isAlreadyInCart = cartItems.some(
//       (item) => item.menu_id === menuItem.menu_id
//     );

//     if (isAlreadyInCart) {
//       alert("This item is already in the cart!");
//       return;
//     }

//     const cartItem = {
//       image: menuItem.image,
//       name: menuItem.name,
//       price: menuItem.price,
//       oldPrice: menuItem.oldPrice,
//       quantity: 1,
//       menu_id: menuItem.menu_id,
//     };

//     const updatedCartItems = [...cartItems, cartItem];
//     localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
//     setCartItemsCount(updatedCartItems.length);
//     navigate("/Cart");
//   };

//   // Check if a menu item is in the cart
//   const isMenuItemInCart = (menuId) => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     return cartItems.some((item) => item.menu_id === menuId);
//   };

//   return (
//     <div>
//       <header className="header header-fixed style-3 ">
//         <div className="header-content">
//           <div className="left-content">
//             <Link to="/Category">
//               <div className="back-btn dz-icon icon-fill icon-sm">
//                 <i className="ri-arrow-left-line fs-3"></i>
//               </div>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">Menu</h5>
//           </div>
//         </div>
//       </header>

//       <main className={`page-content space-top p-b80`}>
//         <div className="container mt-2 mb-0">
//           <div className="row">
//             <div className="col-12 fw-medium text-end hotel-name">
//               <span className="ps-2">
//                 {userData.restaurantName.toUpperCase()}
//               </span>
//               <i className="ri-store-2-line ps-2"></i>
//               <h6 className="title fw-medium h6 custom-text-gray table-number pe-5 me-5">
//                 Table: {userData.tableNumber || ""}
//               </h6>
//             </div>
//           </div>
//         </div>

//         {/* Category Swiper */}
//         <div className="container pb-0 pt-0">
//           <div className="swiper category-slide">
//             <div className="swiper-wrapper">
//               <div
//                 className={`category-btn border border-2 rounded-5 swiper-slide fs-6 ${
//                   selectedCategory === null ? "active" : ""
//                 }`}
//                 onClick={() => handleCategorySelect(null)}
//                 style={{
//                   backgroundColor: selectedCategory === null ? "#0D775E" : "",
//                   color: selectedCategory === null ? "#ffffff" : "",
//                 }}
//               >
//                 All ({categoryCounts.All})
//               </div>
//               {categories.map((category) => (
//                 <div key={category.menu_cat_id} className="swiper-slide">
//                   <div
//                     className={`category-btn border border-2 rounded-5 fs-6 ${
//                       selectedCategory === category.menu_cat_id ? "active" : ""
//                     }`}
//                     onClick={() => handleCategorySelect(category.menu_cat_id)}
//                     style={{
//                       backgroundColor:
//                         selectedCategory === category.menu_cat_id
//                           ? "#0D775E"
//                           : "",
//                       color:
//                         selectedCategory === category.menu_cat_id
//                           ? "#ffffff"
//                           : "",
//                     }}
//                   >
//                     {category.name} ({categoryCounts[category.name] || 0})
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Menu Items */}
//         <div className="container pb-0">
//           <div className="row g-3 grid-style-1">
//             {filteredMenuList.map((menuItem) => (
//               <div key={menuItem.menu_id} className="col-6">
//                 <div className="card-item style-6">
//                   <div className="dz-media">
//                     <Link
//                       to={`/ProductDetails/${menuItem.menu_id}`}
//                       state={{ menu_cat_id: menuItem.menu_cat_id }} // Pass menu_cat_id here
//                     >
//                       <img
//                         src={menuItem.image || images}
//                         alt={menuItem.name || "Menu item"}
//                         style={{ height: "150px" }}
//                         onError={(e) => {
//                           e.target.src = images;
//                         }}
//                       />
//                     </Link>
//                   </div>

//                   <div className="dz-content">
//                     <div
//                       className="detail-content"
//                       style={{ position: "relative" }}
//                     >
//                       <h3 className="product-title fs-xs fw-medium">
//                         <i
//                           className="ri-restaurant-line"
//                           style={{ paddingRight: "5px" }}
//                         ></i>
//                         {categories.find(
//                           (category) =>
//                             category.menu_cat_id === menuItem.menu_cat_id
//                         )?.name || menuItem.category}
//                       </h3>
//                       <i
//                         className={`${
//                           menuItem.is_favourite
//                             ? "ri-hearts-fill fs-2"
//                             : "ri-heart-2-line fs-2"
//                         }`}
//                         onClick={() => handleLikeClick(menuItem.menu_id)}
//                         style={{
//                           position: "absolute",
//                           top: "0",
//                           right: "0",
//                           fontSize: "23px",
//                           cursor: "pointer",
//                           color: menuItem.is_favourite ? "#fe0809" : "#73757b",
//                         }}
//                       ></i>
//                     </div>

//                     {menuItem.name && (
//                       <div className="fs-sm mt-2 text-break">
//                         {menuItem.name}
//                       </div>
//                     )}
//                     {menuItem.spicy_index && (
//                       <div className="row">
//                         <div className="col-6">
//                           <div className="offer-code mt-2">
//                             {Array.from({ length: 5 }).map((_, index) =>
//                               index < menuItem.spicy_index ? (
//                                 <i
//                                   className="ri-fire-fill fs-6"
//                                   style={{ fontSize: "12px" }}
//                                   key={index}
//                                 ></i>
//                               ) : (
//                                 <i
//                                   className="ri-fire-line fs-6"
//                                   style={{ fontSize: "12px", color: "#bbbaba" }}
//                                   key={index}
//                                 ></i>
//                               )
//                             )}
//                           </div>
//                         </div>
//                         <div className="col-6 text-end mt-2">
//                           <i
//                             className="ri-star-half-line pe-1 fs-6"
//                             style={{ color: "#f8a500" }}
//                           ></i>
//                           <span
//                             className="fs-6 fw-semibold"
//                             style={{ color: "#7f7e7e", marginLeft: "5px" }}
//                           >
//                             {menuItem.rating}
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                     <div className="row">
//                       <div className="col-8">
//                         <div className="footer-wrapper">
//                           <div className="price-wrapper d-flex align-items-baseline">
//                             <p className="mb-1 fs-4 fw-medium">
//                               <span className="ms- me-2 text-info">
//                                 ₹{menuItem.price}
//                               </span>
//                               <span className="text-muted fs-6 text-decoration-line-through">
//                                 ₹{menuItem.oldPrice || menuItem.price}
//                               </span>
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="col-4">
//                         {userData ? (
//                           <div
//                             onClick={() => handleAddToCartClick(menuItem)}
//                             className="cart-btn text-end"
//                           >
//                             <i
//                               className={`ri-shopping-cart-2-${
//                                 isMenuItemInCart(menuItem.menu_id)
//                                   ? "fill"
//                                   : "line"
//                               } fs-2`}
//                             ></i>
//                           </div>
//                         ) : (
//                           <i className="ri-shopping-cart-2-line fs-2"></i>
//                         )}
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div className="col-12">
//                         <span className="fs-6  text-primary">
//                           {menuItem.offer || "No "}% Off
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>

//       <Bottom />
//     </div>
//   );
// };

// export default Product;






// *******



// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import Swiper from "swiper/bundle";
// import "swiper/css/bundle";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import Slider from "@mui/material/Slider"; // Import the Slider component
// import Bottom from "../component/bottom";

// // Convert strings to Title Case
// const toTitleCase = (text) => {
//   if (!text) return "";
//   return text.replace(/\b\w/g, (char) => char.toUpperCase());
// };

// const Product = () => {
//   const [menuList, setMenuList] = useState([]);
//   const [favorites, setFavorites] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [cartItemsCount, setCartItemsCount] = useState(0);
//   const [filteredMenuList, setFilteredMenuList] = useState([]);
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [sortByOpen, setSortByOpen] = useState(false);
//   const [priceRange, setPriceRange] = useState([100, 1000]);
//   const [filterOpen, setFilterOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [categoryCounts, setCategoryCounts] = useState({});
//   const [cartItems, setCartItems] = useState(
//     () => JSON.parse(localStorage.getItem("cartItems")) || []
//   );
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const { restaurantId } = useRestaurantId();
//   const [sortCriteria, setSortCriteria] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const initialFetchDone = useRef(false);
//   const swiperRef = useRef(null);

//   // Sync cartItems with localStorage
//   useEffect(() => {
//     localStorage.setItem("cartItems", JSON.stringify(cartItems));
//   }, [cartItems]);

//   // Fetch menu data using a single API
//   const fetchMenuData = useCallback(async () => {
//     if (!restaurantId || isLoading) return;

//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_all_menu_list_by_category",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             customer_id: userData ? userData.customer_id : null,
//             restaurant_id: restaurantId,
//           }),
//         }
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch menu data");
//       }

//       const data = await response.json();

//       if (data.st === 1) {
//         // Formatting the menu list
//         const formattedMenuList = data.data.menus.map((menuItem) => ({
//           ...menuItem,
//           name: toTitleCase(menuItem.menu_name || ""),
//           category: toTitleCase(menuItem.category_name || ""),
//           oldPrice: Math.floor(menuItem.price * 1.1),
//           is_favourite: menuItem.is_favourite === 1,
//         }));

//         setMenuList(formattedMenuList);
//         localStorage.setItem("menuItems", JSON.stringify(formattedMenuList));

//         // Formatting the categories
//         const formattedCategories = data.data.category.map((category) => ({
//           ...category,
//           name: toTitleCase(category.category_name || ""),
//         }));

//         setCategories(formattedCategories);

//         // Initialize category counts correctly
//         const counts = { All: formattedMenuList.length };

//         formattedCategories.forEach((category) => {
//           counts[category.name] = 0;
//         });

//         formattedMenuList.forEach((item) => {
//           counts[item.category] = (counts[item.category] || 0) + 1;
//         });

//         setCategoryCounts(counts);

//         // Handle favorites
//         const favoriteItems = formattedMenuList.filter(
//           (item) => item.is_favourite
//         );
//         setFavorites(favoriteItems);

//         // Set the filtered menu list (initially show all)
//         setFilteredMenuList(formattedMenuList);
//       } else {
//         throw new Error("API request unsuccessful");
//       }
//     } catch (error) {
//       console.error("Error fetching menu data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [restaurantId, isLoading, userData]);

//   useEffect(() => {
//     let isMounted = true;
//     if (restaurantId && !isLoading && !initialFetchDone.current && isMounted) {
//       fetchMenuData();
//       initialFetchDone.current = true;
//     }
//     return () => {
//       isMounted = false;
//     };
//   }, [restaurantId, isLoading, fetchMenuData]);

//   // Update cart items count
//   useEffect(() => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     setCartItemsCount(cartItems.length);
//   }, []);

//   // Handle favorites (like/unlike)
//   const handleLikeClick = async (menuId) => {
//     if (!userData || !restaurantId) return;

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
//           customer_id: userData.customer_id,
//         }),
//       });
//       const data = await response.json();
//       if (response.ok && data.st === 1) {
//         const updatedMenuList = menuList.map((item) =>
//           item.menu_id === menuId
//             ? { ...item, is_favourite: !isFavorite }
//             : item
//         );
//         setMenuList(updatedMenuList);
//         setFilteredMenuList(
//           updatedMenuList.filter(
//             (item) =>
//               item.menu_cat_id === selectedCategory || selectedCategory === null
//           )
//         );
//       }
//     } catch (error) {
//       console.error("Error updating favorite status:", error);
//     }
//   };

//   // Handle category selection
//   const handleCategorySelect = (categoryId) => {
//     setSelectedCategory(categoryId);
//     if (categoryId === null) {
//       setFilteredMenuList(menuList);
//     } else {
//       const filteredMenus = menuList.filter(
//         (menu) => menu.menu_cat_id === categoryId
//       );
//       setFilteredMenuList(filteredMenus);
//     }
//   };

//   useEffect(() => {
//     if (categories.length > 0) {
//       swiperRef.current = new Swiper(".category-slide", {
//         slidesPerView: "auto",
//         spaceBetween: 10,
//       });

//       // Add scroll event listener
//       const swiperContainer = document.querySelector(".category-slide");
//       swiperContainer.addEventListener("scroll", () => {
//         if (swiperContainer.scrollLeft === 0) {
//           handleCategorySelect(categories[0].menu_cat_id);
//         }
//       });
//     }
//   }, [categories]);

//   // Add item to cart
//   const handleAddToCartClick = async (menu) => {
//     if (!userData || !restaurantId) {
//       console.error("Missing required data");
//       navigate("/Signinscreen");
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
//             customer_id: userData.customer_id,
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

//   // Check if a menu item is in the cart
//   const isMenuItemInCart = (menuId) => {
//     return cartItems.some((item) => item.menu_id === menuId);
//   };

//   return (
//     <div>
//       <header className="header header-fixed style-3 ">
//         <div className="header-content">
//           <div className="left-content">
//             <Link to="/Category">
//               <div className="back-btn  icon-sm">
//                 <i className="ri-arrow-left-line fs-3"></i>
//               </div>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">Menu</h5>
//           </div>
//         </div>
//       </header>

//       <main className={`page-content space-top p-b80`}>
//         <div className="container mt-2 mb-0">
//           <div className="row">
//             <div className="col-12 fw-medium text-end hotel-name">
//               <span className="ps-2">
//                 {userData.restaurantName.toUpperCase()}
//               </span>
//               <i className="ri-store-2-line ps-2"></i>
//               <h6 className="title fw-medium h6 custom-text-gray table-number pe-5 me-5">
//                 Table: {userData.tableNumber || ""}
//               </h6>
//             </div>
//           </div>
//         </div>

//         {/* Category Swiper */}
//         <div className="container pb-0 pt-0">
//           <div className="swiper category-slide">
//             <div className="swiper-wrapper">
//               {categories.length > 0 && (
//                 <div
//                   className={`category-btn border border-2 rounded-5 swiper-slide fs-6 ${
//                     selectedCategory === null ? "active" : ""
//                   }`}
//                   onClick={() => handleCategorySelect(null)}
//                   style={{
//                     backgroundColor: selectedCategory === null ? "#0D775E" : "",
//                     color: selectedCategory === null ? "#ffffff" : "",
//                   }}
//                 >
//                   All ({categoryCounts.All})
//                 </div>
//               )}
//               {categories.map((category) => (
//                 <div key={category.menu_cat_id} className="swiper-slide">
//                   <div
//                     className={`category-btn border border-2 rounded-5 fs-6 ${
//                       selectedCategory === category.menu_cat_id ? "active" : ""
//                     }`}
//                     onClick={() => handleCategorySelect(category.menu_cat_id)}
//                     style={{
//                       backgroundColor:
//                         selectedCategory === category.menu_cat_id
//                           ? "#0D775E"
//                           : "",
//                       color:
//                         selectedCategory === category.menu_cat_id
//                           ? "#ffffff"
//                           : "",
//                     }}
//                   >
//                     {category.name} ({categoryCounts[category.name] || 0})
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Menu Items */}
//         <div className="container pb-0">
//           <div className="row g-3 grid-style-1">
//             {filteredMenuList.map((menuItem) => (
//               <div key={menuItem.menu_id} className="col-6">
//                 <div className="card-item style-6">
//                   <div className="dz-media">
//                     <Link
//                       to={`/ProductDetails/${menuItem.menu_id}`}
//                       state={{ menu_cat_id: menuItem.menu_cat_id }} // Pass menu_cat_id here
//                     >
//                       <img
//                         src={menuItem.image || images}
//                         alt={menuItem.name || "Menu item"}
//                         style={{ height: "150px" }}
//                         onError={(e) => {
//                           e.target.src = images;
//                         }}
//                       />
//                     </Link>
//                   </div>

//                   <div className="dz-content">
//                     <div
//                       className="detail-content"
//                       style={{ position: "relative" }}
//                     >
//                       <h3>
//                         <Link
//                           className="product-title fs-xs fw-medium category-text"
//                           style={{ color: "#0a795b" }}
//                           to={`/ProductDetails/${menuItem.menu_id}`}
//                           state={{ menu_cat_id: menuItem.menu_cat_id }} // Pass menu_cat_id here
//                         >
//                           <i
//                             className="ri-restaurant-line"
//                             style={{ paddingRight: "5px" }}
//                           ></i>
//                           {categories.find(
//                             (category) =>
//                               category.menu_cat_id === menuItem.menu_cat_id
//                           )?.name || menuItem.category}
//                         </Link>
//                       </h3>
//                       <i
//                         className={`${
//                           menuItem.is_favourite
//                             ? "ri-hearts-fill fs-3"
//                             : "ri-heart-2-line fs-3"
//                         }`}
//                         onClick={() => handleLikeClick(menuItem.menu_id)}
//                         style={{
//                           position: "absolute",
//                           top: "0",
//                           right: "0",
//                           fontSize: "23px",
//                           cursor: "pointer",
//                           color: menuItem.is_favourite ? "#fe0809" : "#73757b",
//                         }}
//                       ></i>
//                     </div>

//                     {menuItem.name && (
//                       <div className="item-name fs-sm text-wrap">
//                         <Link
//                           to={`/ProductDetails/${menuItem.menu_id}`}
//                           state={{ menu_cat_id: menuItem.menu_cat_id }} // Pass menu_cat_id here
//                         >
//                           {menuItem.name}
//                         </Link>
//                       </div>
//                     )}
//                     {menuItem.spicy_index && (
//                       <div className="row">
//                         <div className="col-6">
//                           <div className="offer-code mt-2">
//                             {Array.from({ length: 5 }).map((_, index) =>
//                               index < menuItem.spicy_index ? (
//                                 <i
//                                   className="ri-fire-fill fs-6"
//                                   key={index}
//                                 ></i>
//                               ) : (
//                                 <i
//                                   className="ri-fire-line fs-6"
//                                   style={{ color: "#bbbaba" }}
//                                   key={index}
//                                 ></i>
//                               )
//                             )}
//                           </div>
//                         </div>
//                         <div className="col-6 text-end mt-2">
//                           <i className="ri-star-half-line pe-1 fs-6 ratingStar"></i>
//                           <span
//                             className="fs-6 fw-semibold"
//                             style={{ color: "#7f7e7e", marginLeft: "5px" }}
//                           >
//                             {menuItem.rating}
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                     <div className="row">
//                       <div className="col-8">
//                         <div className="footer-wrapper">
//                           <div className="price-wrapper d-flex align-items-baseline">
//                             <Link
//                               to={`/ProductDetails/${menuItem.menu_id}`}
//                               state={{ menu_cat_id: menuItem.menu_cat_id }} // Pass menu_cat_id here
//                             >
//                               <p className="mb-1 fs-4 fw-medium">
//                                 <span className="ms- me-2 text-info">
//                                   ₹{menuItem.price}
//                                 </span>
//                                 <span className="text-muted fs-6 text-decoration-line-through">
//                                   ₹{menuItem.oldPrice || menuItem.price}
//                                 </span>
//                               </p>
//                             </Link>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="col-4">
//                         {userData ? (
//                           <div
//                             onClick={() => handleAddToCartClick(menuItem)}
//                             className="cart-btn text-end"
//                           >
//                             <i
//                               className={`ri-shopping-cart-${
//                                 isMenuItemInCart(menuItem.menu_id)
//                                   ? "fill"
//                                   : "line"
//                               } fs-2`}
//                             ></i>
//                           </div>
//                         ) : (
//                           <i className="ri-shopping-cart-line fs-2"></i>
//                         )}
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div className="col-12">
//                         <span className="fs-6  text-primary">
//                           {menuItem.offer || "No "}% Off
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>

//       <Bottom />
//     </div>
//   );
// };

// export default Product;




// *-*-*-*MenuIssues 




import React, { useState, useEffect, useCallback, useRef} from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import { useRestaurantId } from "../context/RestaurantIdContext";
import Slider from "@mui/material/Slider"; // Import the Slider component
import Bottom from "../component/bottom";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/saga-blue/theme.css"; // Choose a theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css"; 

// Convert strings to Title Case
const toTitleCase = (text) => {
  if (!text) return "";
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

const Product = () => {
  
  const [menuList, setMenuList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [filteredMenuList, setFilteredMenuList] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [sortByOpen, setSortByOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([100, 1000]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryCounts, setCategoryCounts] = useState({});
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const { restaurantId } = useRestaurantId();
  const [sortCriteria, setSortCriteria] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const initialFetchDone = useRef(false);
  const swiperRef = useRef(null); // Define swiperRef
  const [cartItems, setCartItems] = useState([]); // Define cartItems and setCartItems
  const { restaurantName } = useRestaurantId();
  
  const toast = useRef(null);
  const { table_number } = useParams();
      const location = useLocation();

  const applySort = () => {
    let sortedList = [...filteredMenuList];
    switch (sortCriteria) {
      case 'popularity':
        // Assuming there's a 'popularity' field in the menu items
        sortedList.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'discount':
        // Assuming there's a 'discount' field in the menu items
        sortedList.sort((a, b) => b.discount - a.discount);
        break;
      case 'priceHighToLow':
        sortedList.sort((a, b) => b.price - a.price);
        break;
      case 'priceLowToHigh':
        sortedList.sort((a, b) => a.price - b.price);
        break;
      case 'rating':
        // Assuming there's a 'rating' field in the menu items
        sortedList.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    setFilteredMenuList(sortedList);
  };

  

  // Fetch menu data using a single API
  const fetchMenuData = useCallback(async () => {
    if (!restaurantId || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://menumitra.com/user_api/get_all_menu_list_by_category",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: userData ? userData.customer_id : null,
            restaurant_id: restaurantId,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch menu data");
      }

      const data = await response.json();

      if (data.st === 1) {
        // Formatting the menu list
        const formattedMenuList = data.data.menus.map((menuItem) => ({
          ...menuItem,
          name: toTitleCase(menuItem.menu_name || ""),
          category: toTitleCase(menuItem.category_name || ""),
          oldPrice: Math.floor(menuItem.price * 1.1),
          is_favourite: menuItem.is_favourite === 1,
        }));

        setMenuList(formattedMenuList);
        localStorage.setItem("menuItems", JSON.stringify(formattedMenuList));

        // Formatting the categories
        const formattedCategories = data.data.category.map((category) => ({
          ...category,
          name: toTitleCase(category.category_name || ""),
        }));

        setCategories(formattedCategories);

        // Initialize category counts correctly
        const counts = { All: formattedMenuList.length };

        formattedCategories.forEach((category) => {
          counts[category.name] = 0;
        });

        formattedMenuList.forEach((item) => {
          counts[item.category] = (counts[item.category] || 0) + 1;
        });

        setCategoryCounts(counts);

        // Handle favorites
        const favoriteItems = formattedMenuList.filter(
          (item) => item.is_favourite
        );
        setFavorites(favoriteItems);

        // Set the filtered menu list (initially show all)
        setFilteredMenuList(formattedMenuList);
      } else {
        throw new Error("API request unsuccessful");
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId, isLoading, userData]);

  useEffect(() => {
    let isMounted = true;
    if (restaurantId && !isLoading && !initialFetchDone.current && isMounted) {
      fetchMenuData();
      initialFetchDone.current = true;
    }
    return () => {
      isMounted = false;
    };
  }, [restaurantId, isLoading, fetchMenuData]);

  // Update cart items count
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItemsCount(cartItems.length);
  }, []);

  // Handle favorites (like/unlike)
  const handleLikeClick = async (menuId) => {
    if (!userData || !restaurantId) return;

    if (!userData.customer_id) {
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
          customer_id: userData.customer_id,
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
                item.menu_cat_id === selectedCategory ||
                selectedCategory === null
            )
          );
          setFavorites(updatedMenuList.filter((item) => item.is_favourite));
          toast.current.show({
            severity: isFavorite ? "info" : "success",
            summary: isFavorite ? "Removed from Favorites" : "Added to Favorites",
            detail: isFavorite
              ? "Item has been removed from your favorites."
              : "Item has been added to your favorites.",
            life: 3000,
          });
        }
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
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
    // Extract category ID from query parameters
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get("category");

    if (categoryId) {
      setSelectedCategory(parseInt(categoryId, 10));
    }
  }, [location.search]);

  useEffect(() => {
    if (categories.length > 0) {
      swiperRef.current = new Swiper(".category-slide", {
        slidesPerView: "auto",
        spaceBetween: 10,
        initialSlide: categories.findIndex(
          (category) => category.menu_cat_id === selectedCategory
        ),
      });

      // Add scroll event listener
      const swiperContainer = document.querySelector(".category-slide");
      swiperContainer.addEventListener("scroll", () => {
        if (swiperContainer.scrollLeft === 0) {
          handleCategorySelect(categories[0].menu_cat_id);
        }
      });
    }
  }, [categories,selectedCategory]);

  // Add item to cart
  const handleAddToCartClick = async (menuItem) => {
    if (!userData || !userData.customer_id) {
      navigate("/Signinscreen");
      return;
    }
  
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const isAlreadyInCart = cartItems.some(
      (item) => item.menu_id === menuItem.menu_id
    );
  
    if (isAlreadyInCart) {
      toast.current.show({
        severity: "info",
        summary: "Item in Cart",
        detail: "This item is already in the cart!",
        life: 3000,
      });
      return;
    }
  
    // Update local storage and state immediately
    const updatedCartItems = [...cartItems, { ...menuItem, quantity: 1 }];
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setCartItemsCount(updatedCartItems.length);
  
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
            menu_id: menuItem.menu_id,
            customer_id: userData.customer_id,
            quantity: 1,
          }),
        }
      );
  
      const data = await response.json();
      if (response.ok && data.st === 1) {
        console.log("Item added to cart successfully.");
        localStorage.setItem("cartId", data.cart_id); // Store the cart ID in local storage
        toast.current.show({
          severity: "success",
          summary: "Added to Cart",
          detail: "Item has been added to your cart.",
          life: 3000,
        });
      } else {
        console.error("Failed to add item to cart:", data.msg);
        // Revert the local storage and state update if the API call fails
        const revertedCartItems = updatedCartItems.filter(
          (cartItem) => cartItem.menu_id !== menuItem.menu_id
        );
        localStorage.setItem("cartItems", JSON.stringify(revertedCartItems));
        setCartItemsCount(revertedCartItems.length);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      // Revert the local storage and state update if the API call fails
      const revertedCartItems = updatedCartItems.filter(
        (cartItem) => cartItem.menu_id !== menuItem.menu_id
      );
      localStorage.setItem("cartItems", JSON.stringify(revertedCartItems));
      setCartItemsCount(revertedCartItems.length);
    }
  };
  
  // Check if a menu item is in the cart
  const isMenuItemInCart = (menuId) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    return cartItems.some((item) => item.menu_id === menuId);
  };

  
 
  

  return (
    <div>
      <Toast ref={toast} position="bottom-center" className="custom-toast" />
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <Link to="#">
              <div className="back-btn  icon-sm" onClick={() => navigate(-1)}>
                <i className="ri-arrow-left-line fs-3"></i>
              </div>
            </Link>
          </div>
          <div className="mid-content">
            <h5 className="title">
              Menu{" "}
              {categories.length > 0 && (
                <span className="small-number gray-text">
                  ({menuList.length})
                </span>
              )}
            </h5>
          </div>
        </div>
      </header>

      <main className={`page-content space-top p-b80`}>
        <div className="container mt-2 mb-0">
          {/* <div className="row">
            <div className="col-12 fw-medium text-end hotel-name">
              <span className="ps-2">
                {userData?.restaurantName?.toUpperCase() || "Restaurant Name"}
              </span>
              <i className="ri-store-2-line ps-2"></i>
              <h6 className="title fw-medium h6 custom-text-gray table-number pe-5 me-5">
                Table: {userData?.tableNumber || ""}
              </h6>
            </div>
          </div> */}

          <div className="header-content d-flex justify-content-end">
            <div className="right-content gap-1">
            <h3 className="title fw-medium hotel-name">
              {/* {userData.restaurantName && userData.restaurantName.length > 0
                ? userData.restaurantName.toUpperCase()
                : "Restaurant Default"} */}

              {restaurantName || "Restaurant Name"}
              <i className="ri-store-2-line ps-2"></i>
            </h3>
            {/* <h2>{restaurantName || "Restaurant Name"}</h2> */}
            <h6 className="title fw-medium h6 custom-text-gray table-number">
              Table: {userData.tableNumber || ""}
            </h6>
            </div>
          </div>
        </div>

        {/* Category Swiper */}
        <div className="container pb-0 pt-0">
          <div className="swiper category-slide">
            <div className="swiper-wrapper">
              {categories.length > 0 && (
                <div
                  className={`category-btn border border-2 rounded-5 swiper-slide fs-6 ${
                    selectedCategory === null ? "active" : ""
                  }`}
                  onClick={() => handleCategorySelect(null)}
                  style={{
                    backgroundColor: selectedCategory === null ? "#0D775E" : "",
                    color: selectedCategory === null ? "#ffffff" : "",
                  }}
                >
                  All ({categoryCounts.All})
                </div>
              )}
              {categories.map((category) => (
                <div key={category.menu_cat_id} className="swiper-slide">
                  <div
                    className={`category-btn border border-2 rounded-5 fs-6 ${
                      selectedCategory === category.menu_cat_id ? "active" : ""
                    }`}
                    onClick={() => handleCategorySelect(category.menu_cat_id)}
                    style={{
                      backgroundColor:
                        selectedCategory === category.menu_cat_id
                          ? "#0D775E"
                          : "",
                      color:
                        selectedCategory === category.menu_cat_id
                          ? "#ffffff"
                          : "",
                    }}
                  >
                    {category.name} ({categoryCounts[category.name] || 0})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="container pb-0">
          <div className="row g-3 grid-style-1">
            {filteredMenuList.map((menuItem) => (
              <div key={menuItem.menu_id} className="col-6">
                <div className="card-item style-6">
                  <div className="dz-media">
                    <Link
                      to={`/ProductDetails/${menuItem.menu_id}`}
                      state={{ menu_cat_id: menuItem.menu_cat_id }} // Pass menu_cat_id here
                    >
                      <img
                        src={menuItem.image || images}
                        alt={menuItem.name || "Menu item"}
                        style={{ height: "150px" }}
                        onError={(e) => {
                          e.target.src = images;
                        }}
                      />
                    </Link>
                  </div>

                  <div className="dz-content">
                    <div
                      className="detail-content"
                      style={{ position: "relative" }}
                    >
                      <h3>
                        <Link
                          className="product-title fs-xs fw-medium category-text"
                          style={{ color: "#0a795b" }}
                          to={`/ProductDetails/${menuItem.menu_id}`}
                          state={{ menu_cat_id: menuItem.menu_cat_id }} // Pass menu_cat_id here
                        >
                          <i
                            className="ri-restaurant-line pe-1"
                            
                          ></i>
                          {categories.find(
                            (category) =>
                              category.menu_cat_id === menuItem.menu_cat_id
                          )?.name || menuItem.category}
                        </Link>
                      </h3>
                      <i
                        className={`${
                          menuItem.is_favourite
                            ? "ri-hearts-fill fs-3 mt-0"
                            : "ri-heart-2-line fs-3 mt-0"
                        }`}
                        onClick={() => handleLikeClick(menuItem.menu_id)}
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0",
                          fontSize: "23px",
                          cursor: "pointer",
                          color: menuItem.is_favourite ? "#fe0809" : "#73757b",
                        }}
                      ></i>
                    </div>

                    {menuItem.name && (
                      <div className="item-name fs-sm text-wrap">
                        <Link
                          to={`/ProductDetails/${menuItem.menu_id}`}
                          state={{ menu_cat_id: menuItem.menu_cat_id }} // Pass menu_cat_id here
                        >
                          {menuItem.name}
                        </Link>
                      </div>
                    )}
                    {menuItem.spicy_index && (
                      <div className="row">
                        <div className="col-6">
                          <div className="offer-code mt-2">
                            {Array.from({ length: 5 }).map((_, index) =>
                              index < menuItem.spicy_index ? (
                                <i
                                  className="ri-fire-fill fs-6"
                                  key={index}
                                ></i>
                              ) : (
                                <i
                                  className="ri-fire-line fs-6"
                                  style={{ color: "#bbbaba" }}
                                  key={index}
                                ></i>
                              )
                            )}
                          </div>
                        </div>
                        <div className="col-6 text-end mt-2">
                          <i className="ri-star-half-line pe-1 fs-6 ratingStar"></i>
                          <span
                            className="fs-6 fw-semibold"
                            style={{ color: "#7f7e7e", marginLeft: "5px" }}
                          >
                            {menuItem.rating}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="row">
                      <div className="col-8">
                        <div className="footer-wrapper">
                          <div className="price-wrapper d-flex align-items-baseline">
                            <Link
                              to={`/ProductDetails/${menuItem.menu_id}`}
                              state={{ menu_cat_id: menuItem.menu_cat_id }} // Pass menu_cat_id here
                            >
                              <p className="mb-1 fs-4 fw-medium">
                                <span className="ms- me-2 text-info">
                                  ₹{menuItem.price}
                                </span>
                                <span className="gray-text fs-6 text-decoration-line-through">
                                  ₹{menuItem.oldPrice || menuItem.price}
                                </span>
                              </p>
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="col-4">
                        {userData ? (
                          <div
                            onClick={() => handleAddToCartClick(menuItem)}
                            className="cart-btn text-end"
                          >
                            <i
                              className={`ri-shopping-cart-${
                                isMenuItemInCart(menuItem.menu_id)
                                  ? "fill"
                                  : "line"
                              } fs-2`}
                            ></i>
                          </div>
                        ) : (
                          <i className="ri-shopping-cart-line fs-2"></i>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <span className="fs-6  offer-color">
                          {menuItem.offer || "No "}% Off
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* <div className="dz-sorting">
        <ul className="list-unstyled mb-0">
          {[
            { key: 'popularity', icon: 'ri-star-line', label: 'Popularity' },
            { key: 'discount', icon: 'ri-discount-percent-line', label: 'Discount' },
            { key: 'priceHighToLow', icon: 'ri-arrow-up-line', label: 'Price High to Low' },
            { key: 'priceLowToHigh', icon: 'ri-arrow-down-line', label: 'Price Low to High' },
            { key: 'rating', icon: 'ri-star-half-line', label: 'Customer Rating' }
          ].map(({ key, icon, label }) => (
            <li
              key={key}
              className={`sort-item ${sortCriteria === key ? 'active' : ''}`}
              onClick={() => setSortCriteria(key)}
              style={{
                backgroundColor: sortCriteria === key ? '#0D775E' : 'transparent',
                color: sortCriteria === key ? '#ffffff' : 'inherit',
                padding: '10px 15px',
                borderRadius: '8px',
                marginBottom: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <i className={`${icon} me-2`} style={{ fontSize: '18px' }}></i>
              {label}
            </li>
          ))}
        </ul>
        <button
          onClick={() => setSortByOpen(false)}
          className="btn btn-outline-secondary w-45 rounded-xl"
          style={{ borderColor: '#0D775E', color: '#0D775E' }}
        >
          Cancel
        </button>
        <button
          onClick={applySort}
          className="btn btn-primary w-45 rounded-xl"
          style={{ backgroundColor: '#0D775E', borderColor: '#0D775E' }}
        >
          Apply
        </button>
      </div> */}
      </main>

      <Bottom />
    </div>
  );
};

export default Product;