// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import Swiper from "swiper/bundle";
// import "swiper/css/bundle";
// import { Link } from "react-router-dom";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import Slider from "@mui/material/Slider";
// import { debounce } from 'lodash'; // Make sure to install lodash if not already installed
// import Bottom from "../component/bottom";

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
//   const [favoriteCats, setFavoriteCats] = useState([]);
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const { restaurantId } = useRestaurantId();
//   const [sortCriteria, setSortCriteria] = useState(null);

//   const [isLoading, setIsLoading] = useState(false);
//   const initialFetchDone = useRef(false);

//   const toTitleCase = (text) => {
//     if (!text) return "";
//     return text.replace(/\b\w/g, (char) => char.toUpperCase());
//   };

//   const fetchMenuData = useCallback(async () => {
//     console.log("fetchMenuData called"); // Add this line
//     if (!restaurantId || isLoading) return;

//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_product_list",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             restaurant_id: restaurantId,
//             cat_id: "all",
//           }),
//         }
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch menu data");
//       }

//       const data = await response.json();

//       if (data.st === 1) {
//         const formattedMenuList = data.MenuList.map((menuItem) => ({
//           ...menuItem,
//           name: toTitleCase(menuItem.name || ""),
//           category: toTitleCase(menuItem.menu_cat_name || ""),
//           oldPrice: Math.floor(menuItem.price * 1.1),
//           is_favourite: menuItem.is_favourite === 1,
//         }));

//         setMenuList(formattedMenuList);
//         localStorage.setItem("menuItems", JSON.stringify(formattedMenuList));

//         const formattedCategories = data.MenuCatList.map((category) => ({
//           ...category,
//           name: toTitleCase(category.name || ""),
//         }));

//         setCategories(formattedCategories);
//         const counts = { All: formattedMenuList.length };
//         formattedMenuList.forEach((item) => {
//           counts[item.category] = (counts[item.category] || 0) + 1;
//         });
//         setCategoryCounts(counts);
//         setFilteredMenuList(formattedMenuList);
//       } else {
//         throw new Error("API request unsuccessful");
//       }
//     } catch (error) {
//       console.error("Error fetching menu data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [restaurantId, isLoading]);

//   const fetchFavorites = useCallback(async () => {
//     if (!userData || !restaurantId || isLoading) return;

//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_favourite_list",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             customer_id: userData.customer_id,
//             restaurant_id: restaurantId,
//           }),
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         if (data.st === 1 && data.lists) {
//           setFavorites(data.lists);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching favorites:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [restaurantId, userData]);

//   useEffect(() => {
//     let isMounted = true;
//     console.log("useEffect triggered");
//     if (restaurantId && !isLoading && !initialFetchDone.current && isMounted) {
//       console.log("Fetching menu data");
//       fetchMenuData();
//       initialFetchDone.current = true;
//     }
//     return () => {
//       isMounted = false;
//     };
//   }, [restaurantId, isLoading, fetchMenuData]);

//   useEffect(() => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     setCartItemsCount(cartItems.length);
//   }, []);

//   const handleLikeClick = async (menuId) => {
//     if (!userData || !restaurantId) return;

//     const isFavorite = favorites.some((fav) => fav.menu_id === menuId);
//     const apiUrl = isFavorite
//       ? "https://menumitra.com/user_api/delete_favourite_menu"
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
//           if (isFavorite) {
//             setFavorites(favorites.filter((fav) => fav.menu_id !== menuId));
//           } else {
//             const menuItem = menuList.find((item) => item.menu_id === menuId);
//             setFavorites([...favorites, menuItem]);
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error updating favorite status:", error);
//     }
//   };

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

//   const isMenuItemInCart = (menuId) => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     return cartItems.some((item) => item.menu_id === menuId);
//   };

//   const handleCategoryFilter = (categoryName) => {
//     if (categoryName === selectedCategory) {
//       setSelectedCategory(null);
//       setFilteredMenuList(menuList);
//     } else {
//       setSelectedCategory(categoryName);
//       const filteredItems = menuList.filter(
//         (item) =>
//           toTitleCase(item.menu_cat_name || "") ===
//           toTitleCase(categoryName || "")
//       );
//       setFilteredMenuList(filteredItems);
//     }
//   };

//   const handleSort = (criteria) => {
//     setSortCriteria(criteria);
//   };

//   const applySort = () => {
//     let sortedList = [...filteredMenuList];
//     switch (sortCriteria) {
//       case "popularity":
//         sortedList.sort((a, b) => b.popularity - a.popularity);
//         break;
//       case "discount":
//         sortedList.sort((a, b) => b.discount - a.discount);
//         break;
//       case "priceHighToLow":
//         sortedList.sort((a, b) => b.price - a.price);
//         break;
//       case "priceLowToHigh":
//         sortedList.sort((a, b) => a.price - b.price);
//         break;
//       case "rating":
//         sortedList.sort((a, b) => b.rating - a.rating);
//         break;
//       default:
//         break;
//     }
//     setFilteredMenuList(sortedList);
//     setSortByOpen(false);
//   };

//   const handlePriceFilter = () => {
//     const filteredItems = menuList.filter(
//       (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
//     );

//     setFilteredMenuList(filteredItems);
//     setFilterOpen(false);
//   };

//   const toggleFavoriteCategory = (categoryName) => {
//     setFavoriteCats((prev) =>
//       prev.includes(categoryName)
//         ? prev.filter((cat) => cat !== categoryName)
//         : [...prev, categoryName]
//     );
//   };

//   const handlePriceChange = (event, newValue) => {
//     setPriceRange(newValue);
//   };

//   const debouncedHandleSort = useCallback(
//     debounce((criteria) => {
//       setSortCriteria(criteria);
//       applySort();
//     }, 300),
//     []
//   );

//   const debouncedHandlePriceFilter = useCallback(
//     debounce(() => {
//       handlePriceFilter();
//     }, 300),
//     [priceRange, menuList]
//   );

//   return (
//     <div className={`page-wrapper ${sortByOpen || filterOpen ? "open" : ""}`}>
//       <header className="header header-fixed style-3 ">
//         <div className="header-content">
//           <div className="left-content">
//             <div
//               className="back-btn dz-icon icon-fill icon-sm"
//               onClick={() => navigate(-1)}
//             >
//               <i className="ri-arrow-left-line fs-3"></i>
//             </div>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">Menu</h5>
//           </div>
//           {/* <div className="right-content">
//             <Link
//               to="/Cart"
//               className="ri-shopping-cart-2-line"
//               style={{ fontSize: "25px" }}
//             >
//               {userData && (
//                 <span className="badge badge-danger">{cartItemsCount}</span>
//               )}
//             </Link>
//           </div> */}
//         </div>
//       </header>

//       <main
//         className={`page-content space-top p-b80 ${
//           sortByOpen || filterOpen ? "open" : ""
//         }`}
//       >
//         {" "}
//         <div className="container mt-2 mb-0">
//           <div className="row">
//             <div className="col-12 fs-3  fw-medium">
//               <i class="ri-store-2-line "></i>
//               <span className="ps-2">Panchami</span>
//             </div>
//           </div>
//         </div>
//         <div
//           className={`container pb-0 pt-0 ${
//             sortByOpen || filterOpen ? "open" : ""
//           }`}
//         >
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
//                 All ({categoryCounts.All}) {/* Display total count */}
//               </div>
//               {categories.map((category) => (
//                 <div key={category.menu_cat_id} className="swiper-slide">
//                   <div
//                     className={`category-btn ${
//                       selectedCategory === category.menu_cat_id ? "active" : ""
//                     }`} // Use menu_cat_id for comparison
//                     onClick={() => handleCategoryFilter(category.menu_cat_id)} // Use menu_cat_id for filtering
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
//                     {category.name} ({categoryCounts[category.name] || 0}){" "}
//                     {/* Display count for each category */}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//         <div className="container pb-0">
//           <div className="row g-3 grid-style-1">
//             {filteredMenuList.map((menuItem) => (
//               <div key={menuItem.menu_id} className="col-6">
//                 <div className="card-item style-6">
//                   <div className="dz-media">
//                     <Link to={`/ProductDetails/${menuItem.menu_id}`}>
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
//                       <h3 className="product-title fs-6 fw-medium">
//                         <i
//                           className="ri-restaurant-line "
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
//                               ? "ri-hearts-fill fs-2" // If liked
//                               : "ri-heart-2-line fs-2" // If not liked
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
//                               ? "#fe0809" // Red if liked
//                               : "#73757b", // Grey if not liked
//                           }}
//                         ></i>
//                       ) : (
//                         <i
//                           className="ri-heart-2-line fs-2" // Default when user is not logged in
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

//                     <h4 className="item-name fs-6 fw-medium">
//                       {menuItem.name}
//                     </h4>
//                     <div className="offer-code">
//                       {Array.from({ length: 5 }).map((_, index) =>
//                         index < menuItem.spicy_index ? (
//                           <i className="ri-fire-fill fs-3" key={index}></i>
//                         ) : (
//                           <i
//                             className="ri-fire-line fs-3"
//                             style={{ color: "#0000001a" }}
//                             key={index}
//                           ></i>
//                         )
//                       )}
//                     </div>
//                     <div className="footer-wrapper">
//                       <div className="price-wrapper">
//                         <h6 className="current-price fs-2">
//                           ₹{menuItem.price}
//                         </h6>
//                         <span className="old-price">₹{menuItem.oldPrice}</span>
//                       </div>
//                       {userData ? (
//                         <div
//                           onClick={() => handleAddToCartClick(menuItem)}
//                           className="cart-btn"
//                         >
//                           {isMenuItemInCart(menuItem.menu_id) ? (
//                             <i
//                               className="ri-shopping-cart-2-fill"
//                               style={{ fontSize: "25px" }}
//                             ></i>
//                           ) : (
//                             <i
//                               className="ri-shopping-cart-2-line"
//                               style={{ fontSize: "25px" }}
//                             ></i>
//                           )}
//                         </div>
//                       ) : (
//                         <i
//                           className="ri-shopping-cart-2-line"
//                           style={{ fontSize: "25px" }}
//                         ></i>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>

//       {/* Sort and Filter Footer */}
//       <div
//         className="footer fixed"
//         style={{ position: "fixed", bottom: "-25px", zIndex: 9999 }}
//       >
//         <ul
//           className="dz-product-filter"
//           style={{ position: "absolute", bottom: "100px", zIndex: 6 }}
//         >
//           <li>
//             <a
//               href="javascript:void(0);"
//               // onClick={() => setSortByOpen(!sortByOpen)}
//               style={{ color: "#7f7e7e" }}
//             >
//               <i className="ri-sort-asc fs-5 pe-1"></i>Sort
//             </a>
//           </li>
//           <li>
//             <a
//               href="javascript:void(0);"
//               onClick={() => setFilterOpen(!filterOpen)}
//               style={{ color: "#7f7e7e" }}
//             >
//               <i className="ri-equalizer-line fs-5 pe-1"></i>Filter
//             </a>
//           </li>
//         </ul>

//         {sortByOpen && (
//           <div
//             className="offcanvas offcanvas-bottom p-b60 show"
//             tabIndex="-1"
//             id="offcanvasBottom1"
//             style={{ position: "absolute", bottom: "250px", zIndex: 9999 }}
//           >
//             <div className="offcanvas-header d-flex justify-content-center align-items-center">
//               <h4 className="offcanvas-title text-center">Sort By</h4>
//               <button
//                 type="button"
//                 className="btn-close style-2"
//                 onClick={() => setSortByOpen(!sortByOpen)}
//                 aria-label="Close"
//                 style={{ position: "absolute", right: "15px" }}
//               >
//                 <i className="ri-close-line" style={{ fontSize: "18px" }}></i>
//               </button>
//             </div>
//             <div className="offcanvas-body">
//               <div className="dz-sorting">
//                 <ul className="list-unstyled mb-0">
//                   {[
//                     {
//                       key: "discount",
//                       icon: "ri-discount-percent-line",
//                       label: "Discount",
//                     },
//                     {
//                       key: "priceHighToLow",
//                       icon: "ri-arrow-up-line",
//                       label: "Price High to Low",
//                     },
//                     {
//                       key: "priceLowToHigh",
//                       icon: "ri-arrow-down-line",
//                       label: "Price Low to High",
//                     },
//                   ].map(({ key, icon, label }) => (
//                     <li
//                       key={key}
//                       className={`sort-item ${
//                         sortCriteria === key ? "active" : ""
//                       }`}
//                       onClick={() => debouncedHandleSort(key)}
//                       style={{
//                         backgroundColor:
//                           sortCriteria === key ? "#0D775E" : "transparent",
//                         color: sortCriteria === key ? "#ffffff" : "inherit",
//                         padding: "10px 15px",
//                         borderRadius: "8px",
//                         marginBottom: "10px",
//                         cursor: "pointer",
//                         transition: "all 0.3s ease",
//                       }}
//                     >
//                       <i
//                         className={`${icon} me-2`}
//                         style={{ fontSize: "18px" }}
//                       ></i>
//                       {label}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="d-flex justify-content-between mt-4">
//                 <button
//                   onClick={() => setSortByOpen(false)}
//                   className="btn btn-outline-secondary w-45 rounded-xl"
//                   style={{ borderColor: "#0D775E", color: "#0D775E" }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={applySort}
//                   className="btn btn-primary w-45 rounded-xl"
//                   style={{ backgroundColor: "#0D775E", borderColor: "#0D775E" }}
//                 >
//                   Apply
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//         <Bottom />
//         {filterOpen && (
//           <div className="container">
//             <div
//               className="offcanvas offcanvas-bottom  show z-n1"
//               tabIndex="-1"
//               id="offcanvasBottom2"
//               style={{ paddingBottom: "120px  " }}
//             >
//               <div
//                 className="offcanvas-header mt-3"
//                 style={{ borderBottom: "transparent" }}
//               >
//                 <div
//                   className="d-flex justify-content-center align-items-center"
//                   style={{ flex: 1 }}
//                 >
//                   <h4 className="offcanvas-title m-0 fs-3">Filter</h4>
//                 </div>
//                 {/* <button
//                 type="button"
//                 className="btn-close style-2 "
//                 onClick={() => setFilterOpen(!filterOpen)}
//                 aria-label="Close"
//               >
//                 <i className="ri-close-line" style={{ fontSize: "18px" }}></i>
//               </button>
//                */}
//               </div>
//               <div className="offcanvas-body pt-0">
//                 <hr style={{ color: "#a5a5a5" }} />
//                 {/* <div className="swiper category-slide">
//                 <h5 className="sub-title">Category</h5>
//                 <div className="swiper-wrapper">
//                   {categories.map((category) => (
//                     <div key={category.menu_cat_id} className="swiper-slide">
//                       <div
//                         className={`category-btn ${
//                           selectedCategory === category.name ? "active" : ""
//                         }`}
//                         onClick={() => handleCategoryFilter(category.name)}
//                         style={{
//                           backgroundColor:
//                             selectedCategory === category.name ? "#0D775E" : "",
//                           color:
//                             selectedCategory === category.name ? "#ffffff" : "",
//                         }}
//                       >
//                         {category.name}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div> */}
//                 <div className="filter-inner-content">
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
//                   <div className="row">
//                     <div className="col-6">
//                       <button
//                         onClick={debouncedHandlePriceFilter}
//                         className="apply-btn"
//                         style={{
//                           padding: "12px 20px",
//                           backgroundColor: "#0D775E",
//                           color: "white",
//                           border: "none",
//                           borderRadius: "8px",
//                           width: "100%",
//                           fontWeight: "bold",
//                           fontSize: "16px",
//                           cursor: "pointer",
//                         }}
//                       >
//                         Apply
//                       </button>
//                     </div>
//                     <div className="col-6">
//                       <button
//                         onClick={() => setPriceRange([100, 1000])}
//                         className="reset-btn"
//                         style={{
//                           padding: "12px 20px",
//                           backgroundColor: "#f0f0f0",
//                           color: "#333",
//                           border: "1px solid #ccc",
//                           borderRadius: "8px",
//                           width: "100%",
//                           fontWeight: "bold",
//                           fontSize: "16px",
//                           cursor: "pointer",
//                         }}
//                       >
//                         Reset
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       {sortByOpen || filterOpen ? (
//         <div className="offcanvas-backdrop fade show"></div>
//       ) : null}
//       <div className="z-3">
//         <Bottom />
//       </div>
//     </div>
//   );
// };

// export default Product;

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import Swiper from "swiper/bundle";
// import "swiper/css/bundle";
// import { Link } from "react-router-dom";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import Slider from "@mui/material/Slider";
// import { debounce } from "lodash";
// import Bottom from "../component/bottom";

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

//   // Convert strings to Title Case
//   const toTitleCase = (text) => {
//     if (!text) return "";
//     return text.replace(/\b\w/g, (char) => char.toUpperCase());
//   };

//   // Fetch menu data using a single API, replacing the two separate APIs
// const fetchMenuData = useCallback(async () => {
//   if (!restaurantId || isLoading) return;

//   setIsLoading(true);
//   try {
//     const response = await fetch(
//       "https://menumitra.com/user_api/get_all_menu_list_by_category",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           customer_id: userData ? userData.customer_id : null,
//           restaurant_id: restaurantId,
//         }),
//       }
//     );
//     if (!response.ok) {
//       throw new Error("Failed to fetch menu data");
//     }

//     const data = await response.json();

//     if (data.st === 1) {
//       // Formatting the menu list
//       const formattedMenuList = data.data.menus.map((menuItem) => ({
//         ...menuItem,
//         name: toTitleCase(menuItem.menu_name || ""),
//         category: toTitleCase(menuItem.category_name || ""),
//         oldPrice: Math.floor(menuItem.price * 1.1),
//         is_favourite: menuItem.is_favourite === 1,
//       }));

//       setMenuList(formattedMenuList);
//       localStorage.setItem("menuItems", JSON.stringify(formattedMenuList));

//       // Formatting the categories
//       const formattedCategories = data.data.category.map((category) => ({
//         ...category,
//         name: toTitleCase(category.category_name || ""),
//       }));

//       setCategories(formattedCategories);

//       // Initialize category counts correctly
//       const counts = { All: formattedMenuList.length }; // Directly use menuList length for "All"

//       formattedCategories.forEach((category) => {
//         counts[category.name] = 0; // Initialize each category with 0
//       });

//       // Update counts based on the actual menu items
//       formattedMenuList.forEach((item) => {
//         counts[item.category] = (counts[item.category] || 0) + 1; // Increment the count for the item's category
//       });

//       setCategoryCounts(counts);

//       // Handle favorites
//       const favoriteItems = formattedMenuList.filter(
//         (item) => item.is_favourite
//       );
//       setFavorites(favoriteItems);

//       // Set the filtered menu list (initially show all)
//       setFilteredMenuList(formattedMenuList);
//     } else {
//       throw new Error("API request unsuccessful");
//     }
//   } catch (error) {
//     console.error("Error fetching menu data:", error);
//   } finally {
//     setIsLoading(false);
//   }
// }, [restaurantId, isLoading, userData]);

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

//     const isFavorite = favorites.some((fav) => fav.menu_id === menuId);
//     const apiUrl = isFavorite
//       ? "https://menumitra.com/user_api/delete_favourite_menu"
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
//           if (isFavorite) {
//             setFavorites(favorites.filter((fav) => fav.menu_id !== menuId));
//           } else {
//             const menuItem = menuList.find((item) => item.menu_id === menuId);
//             setFavorites([...favorites, menuItem]);
//           }
//         }
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

//   return (
//     <div className={`page-wrapper ${sortByOpen || filterOpen ? "open" : ""}`}>
//       <header className="header header-fixed style-3 ">
//         <div className="header-content">
//           <div className="left-content">
//             <div
//               className="back-btn dz-icon icon-fill icon-sm"
//               onClick={() => navigate(-1)}
//             >
//               <i className="ri-arrow-left-line fs-3"></i>
//             </div>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">Menu</h5>
//           </div>
//         </div>
//       </header>

//       <main className={`page-content space-top p-b80`}>
//         <div className="container mt-2 mb-0">
//           <div className="row">
//             <div className="col-12 fs-3  fw-medium">
//               <i class="ri-store-2-line "></i>
//               <span className="ps-2">Panchami</span>
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
//                 All ({categoryCounts.All}) {/* Display total count */}
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
//                     {category.name} ({categoryCounts[category.name] || 0}){" "}
//                     {/* Display count for each category */}
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
//                     <Link to={`/ProductDetails/${menuItem.menu_id}`}>
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
//                       <h3 className="product-title fs-6 fw-medium">
//                         <i
//                           className="ri-restaurant-line "
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
//                               ? "ri-hearts-fill fs-2" // If liked
//                               : "ri-heart-2-line fs-2" // If not liked
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
//                               ? "#fe0809" // Red if liked
//                               : "#73757b", // Grey if not liked
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

//                     <h4 className="item-name fs-6 fw-medium">
//                       {menuItem.name}
//                     </h4>
//                     <div className="footer-wrapper">
//                       <div className="price-wrapper">
//                         <h6 className="current-price fs-2">
//                           ₹{menuItem.price}
//                         </h6>
//                         <span className="old-price">₹{menuItem.oldPrice}</span>
//                       </div>
//                       {userData ? (
//                         <div
//                           onClick={() => handleAddToCartClick(menuItem)}
//                           className="cart-btn"
//                         >
//                           {isMenuItemInCart(menuItem.menu_id) ? (
//                             <i
//                               className="ri-shopping-cart-2-fill"
//                               style={{ fontSize: "25px" }}
//                             ></i>
//                           ) : (
//                             <i
//                               className="ri-shopping-cart-2-line"
//                               style={{ fontSize: "25px" }}
//                             ></i>
//                           )}
//                         </div>
//                       ) : (
//                         <i
//                           className="ri-shopping-cart-2-line"
//                           style={{ fontSize: "25px" }}
//                         ></i>
//                       )}
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























// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import Swiper from "swiper/bundle";
// import "swiper/css/bundle";
// import { useRestaurantId } from "../context/RestaurantIdContext";
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

//   // Fetch menu data using a single API, replacing the two separate APIs
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

//   return (
//     <div className={`page-wrapper ${sortByOpen || filterOpen ? "open" : ""}`}>
//       <header className="header header-fixed style-3 ">
//         <div className="header-content">
//           <div className="left-content">
//             <div
//               className="back-btn dz-icon icon-fill icon-sm"
//               onClick={() => navigate(-1)}
//             >
//               <i className="ri-arrow-left-line fs-3"></i>
//             </div>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">Menu</h5>
//           </div>
//         </div>
//       </header>

//       <main className={`page-content space-top p-b80`}>
//         <div className="container mt-2 mb-0">
//           <div className="row">
//             <div className="col-12 fs-3 fw-medium">
//               <i className="ri-store-2-line"></i>
//               <span className="ps-2">Panchami</span>
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
//                       <h3 className="product-title fs-6 fw-medium">
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

//                     <h4 className="item-name fs-6 fw-medium">
//                       {menuItem.name}
//                     </h4>
//                     <div className="footer-wrapper">
//                       <div className="price-wrapper">
//                         <h6 className="current-price fs-2">
//                           ₹{menuItem.price}
//                         </h6>
//                         <span className="old-price">₹{menuItem.oldPrice}</span>
//                       </div>
//                       {userData ? (
//                         <div
//                           onClick={() => handleAddToCartClick(menuItem)}
//                           className="cart-btn"
//                         >
//                           {isMenuItemInCart(menuItem.menu_id) ? (
//                             <i
//                               className="ri-shopping-cart-2-fill"
//                               style={{ fontSize: "25px" }}
//                             ></i>
//                           ) : (
//                             <i
//                               className="ri-shopping-cart-2-line"
//                               style={{ fontSize: "25px" }}
//                             ></i>
//                           )}
//                         </div>
//                       ) : (
//                         <i
//                           className="ri-shopping-cart-2-line"
//                           style={{ fontSize: "25px" }}
//                         ></i>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>
//       <div className="container">
//         <div className="row text-center">
//           <div className="col-6 fs-4 d-flex justify-content-center align-items-center">
//             <i className="ri-arrow-up-line me-2"></i>
//             Sort
//           </div>
//           <div className="col-6 fs-4 d-flex justify-content-center align-items-center">
//             <i className="ri-equalizer-line me-2"></i>
//             Filter
//           </div>
//         </div>
//       </div>

//       <Bottom />
//     </div>
//   );
// };

// export default Product;


















import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import { useRestaurantId } from "../context/RestaurantIdContext";
import Slider from "@mui/material/Slider"; // Import the Slider component
import Bottom from "../component/bottom";

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
          console.log(
            isFavorite ? "Removed from favorites" : "Added to favorites"
          );
        } else {
          console.error("Failed to update favorite status:", data.msg);
        }
      } else {
        console.error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  // Add item to cart
  const handleAddToCartClick = (menuItem) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const isAlreadyInCart = cartItems.some(
      (item) => item.menu_id === menuItem.menu_id
    );

    if (isAlreadyInCart) {
      alert("This item is already in the cart!");
      return;
    }

    const cartItem = {
      image: menuItem.image,
      name: menuItem.name,
      price: menuItem.price,
      oldPrice: menuItem.oldPrice,
      quantity: 1,
      menu_id: menuItem.menu_id,
    };

    const updatedCartItems = [...cartItems, cartItem];
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setCartItemsCount(updatedCartItems.length);
    navigate("/Cart");
  };

  // Check if a menu item is in the cart
  const isMenuItemInCart = (menuId) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    return cartItems.some((item) => item.menu_id === menuId);
  };

  // Category filter
  const handleCategoryFilter = (categoryName) => {
    if (categoryName === selectedCategory) {
      setSelectedCategory(null);
      setFilteredMenuList(menuList);
    } else {
      setSelectedCategory(categoryName);
      const filteredItems = menuList.filter(
        (item) =>
          toTitleCase(item.category || "") === toTitleCase(categoryName || "")
      );
      setFilteredMenuList(filteredItems);
    }
  };

  // Swiper initialization for categories
  useEffect(() => {
    const swiper = new Swiper(".category-slide", {
      slidesPerView: "auto",
      spaceBetween: 10,
    });
    return () => swiper.destroy(true, true);
  }, [categories]);

  // Handle sorting criteria
  const handleSort = (criteria) => {
    setSortCriteria(criteria);
  };

  // Apply sorting
  const applySort = () => {
    let sortedList = [...filteredMenuList];
    switch (sortCriteria) {
      case "priceHighToLow":
        sortedList.sort((a, b) => b.price - a.price);
        break;
      case "priceLowToHigh":
        sortedList.sort((a, b) => a.price - b.price);
        break;
      default:
        break;
    }
    setFilteredMenuList(sortedList);
    setSortByOpen(false);
  };

  // Handle price range change
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  // Apply price filter
  const handlePriceFilter = () => {
    const filteredItems = menuList.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
    );
    setFilteredMenuList(filteredItems);
    setFilterOpen(false);
  };

  return (
    <div className={`page-wrapper ${sortByOpen || filterOpen ? "open" : ""}`}>
      <header className="header header-fixed style-3 ">
        <div className="header-content">
          <div className="left-content">
            <Link to="/Category">
              <div
                className="back-btn dz-icon icon-fill icon-sm"
                // onClick={() => navigate(-1)}
              >
                <i className="ri-arrow-left-line fs-3"></i>
              </div>
            </Link>
          </div>
          <div className="mid-content">
            <h5 className="title">Menu</h5>
          </div>
        </div>
      </header>

      <main className={`page-content space-top p-b80`}>
        <div className="container mt-2 mb-0">
          <div className="row">
            <div className="col-12 fs-3 fw-medium">
              <i className="ri-store-2-line"></i>
              <span className="ps-2">Panchami</span>
            </div>
          </div>
        </div>

        {/* Category Swiper */}
        <div className="container pb-0 pt-0">
          <div className="swiper category-slide">
            <div className="swiper-wrapper">
              <div
                className={`category-btn swiper-slide ${
                  selectedCategory === null ? "active" : ""
                }`}
                onClick={() => handleCategoryFilter(null)}
                style={{
                  backgroundColor: selectedCategory === null ? "#0D775E" : "",
                  color: selectedCategory === null ? "#ffffff" : "",
                }}
              >
                All ({categoryCounts.All})
              </div>
              {categories.map((category) => (
                <div key={category.menu_cat_id} className="swiper-slide">
                  <div
                    className={`category-btn ${
                      selectedCategory === category.name ? "active" : ""
                    }`}
                    onClick={() => handleCategoryFilter(category.name)}
                    style={{
                      backgroundColor:
                        selectedCategory === category.name ? "#0D775E" : "",
                      color:
                        selectedCategory === category.name ? "#ffffff" : "",
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
                      <h3 className="product-title fs-6 fw-medium">
                        <i
                          className="ri-restaurant-line"
                          style={{ paddingRight: "5px" }}
                        ></i>
                        {categories.find(
                          (category) =>
                            category.menu_cat_id === menuItem.menu_cat_id
                        )?.name || menuItem.category}
                      </h3>

                      {userData ? (
                        <i
                          className={`${
                            favorites.some(
                              (fav) => fav.menu_id === menuItem.menu_id
                            )
                              ? "ri-hearts-fill fs-2"
                              : "ri-heart-2-line fs-2"
                          }`}
                          onClick={() => handleLikeClick(menuItem.menu_id)}
                          style={{
                            position: "absolute",
                            top: "0",
                            right: "0",
                            fontSize: "23px",
                            cursor: "pointer",
                            color: favorites.some(
                              (fav) => fav.menu_id === menuItem.menu_id
                            )
                              ? "#fe0809"
                              : "#73757b",
                          }}
                        ></i>
                      ) : (
                        <i
                          className="ri-heart-2-line fs-2"
                          style={{
                            position: "absolute",
                            top: "0",
                            right: "0",
                            fontSize: "23px",
                            cursor: "pointer",
                            color: "#73757b",
                          }}
                        ></i>
                      )}
                    </div>

                    <h4 className="item-name fs-6 fw-medium">
                      {menuItem.name}
                    </h4>
                    <div className="footer-wrapper">
                      {/* <div className="price-wrapper">
                        <h6 className="current-price fs-2">
                          ₹{menuItem.price}
                        </h6>
                        <span className="old-price">₹{menuItem.oldPrice}</span>
                      </div> */}
                      <p className="mb-2 fs-4 fw-medium">
                        <span className="me-1 text-info">
                          ₹{menuItem.price}
                        </span>
                        <span className="text-muted fs-6 text-decoration-line-through">
                          ₹{menuItem.oldPrice || menuItem.price}
                        </span>

                        <span className="fs-6 ps-2 text-primary">
                          {menuItem.offer || "No "}% Off
                        </span>
                      </p>
                      {userData ? (
                        <div
                          onClick={() => handleAddToCartClick(menuItem)}
                          className="cart-btn"
                        >
                          {isMenuItemInCart(menuItem.menu_id) ? (
                            <i
                              className="ri-shopping-cart-2-fill"
                              style={{ fontSize: "25px" }}
                            ></i>
                          ) : (
                            <i
                              className="ri-shopping-cart-2-line"
                              style={{ fontSize: "25px" }}
                            ></i>
                          )}
                        </div>
                      ) : (
                        <i
                          className="ri-shopping-cart-2-line"
                          style={{ fontSize: "25px" }}
                        ></i>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sort and Filter Footer */}

        {/* <h5 className="sub-title">Price</h5> */}
        {/* <div className="container" style={{position:"fixed", bottom:"80px"}}> 
          <div className="row">
            <div className="col-12">
              <div className="filter-inner-content rounded py-3 px-3 shadow" style={{backgroundColor:"#ffffff"}}>
                <h5 className="sub-title">Price</h5>
                <div className="title-bar">
                  <div
                    className="price-range-slider"
                    style={{
                      width: "100%",
                      padding: "0 20px",
                      marginBottom: "20px",
                    }}
                  >
                    <Slider
                      value={priceRange}
                      onChange={handlePriceChange}
                      valueLabelDisplay="auto"
                      min={100}
                      max={1000}
                      sx={{
                        color: "#0D775E",
                        width: "100%",
                        "& .MuiSlider-thumb": {
                          backgroundColor: "#0D775E",
                          border: "2px solid #0D775E",
                        },
                        "& .MuiSlider-rail": {
                          height: 4,
                          backgroundColor: "#9ec8be",
                        },
                        "& .MuiSlider-track": {
                          height: 4,
                        },
                      }}
                    />
                    <div
                      className="price-labels"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "10px",
                      }}
                    >
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                <div
                  className="filter-buttons"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    width: "100%",
                    padding: "0 20px",
                  }}
                >
                  <button
                    onClick={handlePriceFilter}
                    className="apply-btn"
                    style={{
                      padding: "12px 20px",
                      backgroundColor: "#0D775E",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      width: "100%",
                      fontWeight: "bold",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => setPriceRange([100, 1000])}
                    className="reset-btn"
                    style={{
                      padding: "12px 20px",
                      backgroundColor: "#f0f0f0",
                      color: "#333",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      width: "100%",
                      fontWeight: "bold",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    

        {sortByOpen && (
          <div
            className="offcanvas offcanvas-bottom show"
            tabIndex="-1"
            style={{ zIndex: 1050 }}
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title">Sort By</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setSortByOpen(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <button
                className={`btn btn-light w-100 mb-2 ${
                  sortCriteria === "priceLowToHigh"
                    ? "bg-primary text-white"
                    : ""
                }`}
                onClick={() => handleSort("priceLowToHigh")}
              >
                Price Low to High
              </button>
              <button
                className={`btn btn-light w-100 mb-2 ${
                  sortCriteria === "priceHighToLow"
                    ? "bg-primary text-white"
                    : ""
                }`}
                onClick={() => handleSort("priceHighToLow")}
              >
                Price High to Low
              </button>
              <div className="d-flex justify-content-between mt-3">
                <button
                  className="btn btn-outline-secondary w-45"
                  onClick={() => setSortByOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary w-45" onClick={applySort}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {filterOpen && (
          <div
            className="offcanvas offcanvas-bottom show"
            tabIndex="-1"
            style={{ zIndex: 1050 }}
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title">Filter By Price</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setFilterOpen(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <div
                className="slider-container"
                style={{ position: "relative", zIndex: 1000 }}
              >
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={100}
                  max={1000}
                  sx={{
                    color: "#0D775E",
                    width: "100%",
                    "& .MuiSlider-thumb": {
                      backgroundColor: "#0D775E",
                      border: "2px solid #0D775E",
                    },
                    "& .MuiSlider-rail": {
                      height: 4,
                      backgroundColor: "#9ec8be",
                    },
                    "& .MuiSlider-track": {
                      height: 4,
                    },
                  }}
                />
                <div className="d-flex justify-content-between mt-2">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
              <div className="d-flex justify-content-between mt-3">
                <button
                  className="btn btn-primary w-45"
                  onClick={handlePriceFilter}
                >
                  Apply Price Filter
                </button>
                <button
                  className="btn btn-light w-45"
                  onClick={() => setPriceRange([100, 1000])}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )} */}

        <div
          className="container d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            bottom: "75px",
            backgroundColor: "#ffffff",
            height: "80px",
            zIndex: 1,
          }}
        >
          <div className="row w-100">
            <div className="col-12 d-flex justify-content-center">
              <button
                className="btn "
                style={{
                  fontFamily: "poppins",
                }}
                onClick={() => setFilterOpen(true)}
              >
                <i className="ri-equalizer-line pe-3"></i>
                Filter
              </button>
            </div>
          </div>
        </div>

        {filterOpen && (
          <div
            className={`container ${filterOpen ? "slide-up" : "slide-down"}`}
            style={{ position: "fixed", bottom: "110px" }}
          >
            <div className="row">
              <div className="col-12">
                <div
                  className="filter-inner-content rounded py-3 px-3 shadow"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <h5 className="sub-title">Price</h5>
                  <div className="title-bar">
                    <div
                      className="price-range-slider"
                      style={{
                        width: "100%",
                        padding: "0 20px",
                        marginBottom: "20px",
                      }}
                    >
                      <Slider
                        value={priceRange}
                        onChange={handlePriceChange}
                        valueLabelDisplay="auto"
                        min={100}
                        max={1000}
                        sx={{
                          color: "#0D775E",
                          width: "100%",
                          "& .MuiSlider-thumb": {
                            backgroundColor: "#0D775E",
                            border: "2px solid #0D775E",
                          },
                          "& .MuiSlider-rail": {
                            height: 4,
                            backgroundColor: "#9ec8be",
                          },
                          "& .MuiSlider-track": {
                            height: 4,
                          },
                        }}
                      />
                      <div
                        className="price-labels"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "10px",
                        }}
                      >
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="filter-buttons"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      width: "100%",
                      padding: "0 20px",
                    }}
                  >
                    <div className="row">
                      <div className="col-6">
                        <button
                          onClick={() => {
                            setFilterOpen(false);
                            setTimeout(() => setPriceRange([100, 1000]), 400); // Slight delay to wait for the animation to finish
                          }}
                          className="reset-btn"
                          style={{
                            padding: "12px 20px",
                            backgroundColor: "#f0f0f0",
                            color: "#333",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            width: "100%",
                            fontWeight: "bold",
                            fontSize: "16px",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="col-6">
                        <button
                          onClick={handlePriceFilter}
                          className="apply-btn"
                          style={{
                            padding: "12px 20px",
                            backgroundColor: "#0D775E",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            width: "100%",
                            fontWeight: "bold",
                            fontSize: "16px",
                            cursor: "pointer",
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* {sortByOpen && (
          <div
            className="offcanvas offcanvas-bottom show"
            tabIndex="-1"
            style={{ zIndex: 1050 }}
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title">Sort By</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setSortByOpen(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <button
                className={`btn btn-light w-100 mb-2 ${
                  sortCriteria === "priceLowToHigh"
                    ? "bg-primary text-white"
                    : ""
                }`}
                onClick={() => handleSort("priceLowToHigh")}
              >
                Price Low to High
              </button>
              <button
                className={`btn btn-light w-100 mb-2 ${
                  sortCriteria === "priceHighToLow"
                    ? "bg-primary text-white"
                    : ""
                }`}
                onClick={() => handleSort("priceHighToLow")}
              >
                Price High to Low
              </button>
              <div className="d-flex justify-content-between mt-3">
                <button
                  className="btn btn-outline-secondary w-45"
                  onClick={() => setSortByOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary w-45" onClick={applySort}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        )} */}
      </main>

      <Bottom />
    </div>
  );
};

export default Product;
