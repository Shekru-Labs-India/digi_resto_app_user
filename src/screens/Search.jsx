// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import images from '../assets/MenuDefault.png'

// const Search = () => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchedMenu, setSearchedMenu] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);

//     const handleSearch = async (event) => {
//         const term = event.target.value;
//         setSearchTerm(term);
//     };

//     const toTitleCase = (str) => {
//         return str.replace(/\w\S*/g, function(txt) {
//             return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//         });
//     };

//     useEffect(() => {
//         const fetchSearchedMenu = async () => {
//             if (searchTerm.trim() === '') {
//                 setSearchedMenu([]); // Clear the menu list if search term is empty
//                 return;
//             }

//             setIsLoading(true);

//             try {
//                 const response = await fetch('http://194.195.116.199/user_api/search_menu', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({
//                         restaurant_id: 13,
//                         keyword: searchTerm.trim()
//                     })
//                 });

//                 if (response.ok) {
//                     const data = await response.json();
//                     if (data.st === 1 && Array.isArray(data.lists)) {
//                         const formattedMenu = data.lists.map(menu => ({
//                             ...menu,
//                             name: toTitleCase(menu.name) // Convert menu name to title case
//                         }));
//                         setSearchedMenu(formattedMenu);
//                     } else {
//                         console.error('Invalid data format:', data);
//                     }
//                 } else {
//                     console.error('Network response was not ok.');
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }

//             setIsLoading(false);
//         };

//         fetchSearchedMenu();
//     }, [searchTerm]);

//     const handleClearAll = () => {
//         setSearchedMenu([]);
//     };

//     return (
//         <div className="page-wrapper">
//             {/* Header */}
//             <header className="header header-fixed style-3 py-2">
//                 <div className="header-content">
//                     <div className="search-area">
//                         <Link to="/HomeScreen" className="back-btn icon-fill dz-icon">
//                             <i className='ri-arrow-left-line'></i>
//                         </Link>
//                         <div className="input w-100">
//                             <input
//                                 type="search"
//                                 className="form-control rounded-md style-2"
//                                 placeholder="Search Best items for You"
//                                 onChange={handleSearch}
//                                 value={searchTerm}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </header>
//             {/* Header End */}

//             {/* Main Content Start */}
//             <main className="page-content p-t80 p-b40">
//                 <div className="container">
//                     {/* Searched Menu List */}
//                     <div className="title-bar mb-2">
//                         <h4 className="title mb-0 font-w500">Searched Menu</h4>
//                         <div className="font-w500 font-12" onClick={handleClearAll}>Clear All</div>
//                     </div>

//                     {isLoading && <p>Loading...</p>}

//                     {searchedMenu.map((menu) => (
//                         <div className="swiper-slide search-content1" key={menu.menu_id}>
//                             <div className="cart-list style-2">
//                                 <div className="dz-media media-75">
//                                     {/* <img src={menu.image} alt={menu.name} /> */}
//                                     <img

//                                      style={{
//                                         width: '100%',
//                                         height: '100%',
//                                         objectFit: "cover",
//                                       }}
//   src={menu.image}
//   alt={menu.name}
//   onError={(e) => {
//     e.target.src = images; // Set local image source on error
//     e.target.style.width = '80px'; // Example: Set width of the local image
//     e.target.style.height = '80px'; // Example: Set height of the local image

//   }}
// />
//                                 </div>
//                                 <div className="dz-content">
//                                     <h6 className="title">{menu.name}</h6>
//                                     <ul className="dz-meta">
//                                         <li className="dz-price">₹{menu.price.toFixed(2)}</li>

//                                     </ul>
//                                     <div className="dz-off">{menu.veg_nonveg === 'veg' ? 'Veg' : 'Non-Veg'}</div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </main>
//             {/* Main Content End */}
//         </div>
//     );
// };

// export default Search;

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
// import images from '../assets/MenuDefault.png';
// import { useRestaurantId } from '../context/RestaurantIdContext';
// import Bottom from '../component/bottom';

// const Search = () => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchedMenu, setSearchedMenu] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate(); // Access the navigate function using useNavigate
//     const { restaurantId } = useRestaurantId();
//     const handleSearch = async (event) => {
//         const term = event.target.value;
//         setSearchTerm(term);
//     };

//     const toTitleCase = (str) => {
//         return str.replace(/\w\S*/g, function(txt) {
//             return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//         });
//     };

//     useEffect(() => {
//         const fetchSearchedMenu = async () => {
//             if (searchTerm.trim() === '') {
//                 setSearchedMenu([]); // Clear the menu list if search term is empty
//                 return;
//             }

//             setIsLoading(true);

//             try {
//                 const response = await fetch('https://menumitra.com/user_api/search_menu', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({
//                         restaurant_id:13,
//                         keyword: searchTerm.trim()
//                     })
//                 });
// console.log(restaurantId)
//                 if (response.ok) {
//                     const data = await response.json();
//                     if (data.st === 1 && Array.isArray(data.lists)) {
//                         const formattedMenu = data.lists.map(menu => ({
//                             ...menu,
//                             name: toTitleCase(menu.name) // Convert menu name to title case
//                         }));
//                         setSearchedMenu(formattedMenu);
//                     } else {
//                         console.error('Invalid data format:', data);
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }

//             setIsLoading(false);
//         };

//         fetchSearchedMenu();
//     }, [searchTerm, restaurantId]);

//     const handleClearAll = () => {
//         setSearchedMenu([]);
//     };

//     return (
//         <div className="page-wrapper">
//             {/* Header */}
//             <header className="header header-fixed style-3 py-2">
//                 <div className="header-content">
//                     <div className="search-area">
//                     <div onClick={() => navigate(-1)} className="back-btn icon-fill dz-icon">
//                             <i className='ri-arrow-left-line'></i>
//                         </div>
//                         <div className="input w-100">
//                             <input
//                                 type="search"
//                                 className="form-control rounded-md style-2"
//                                 placeholder="Search Best items for You"
//                                 onChange={handleSearch}
//                                 value={searchTerm}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </header>
//             {/* Header End */}

//             {/* Main Content Start */}
//             <main className="page-content p-t80 p-b40">
//                 <div className="container">
//                     {/* Searched Menu List */}
//                     <div className="title-bar mb-2">
//                         <h4 className="title mb-0 font-w500">Searched Menu</h4>
//                         <div className="font-w500 font-12" onClick={handleClearAll}>Clear All</div>
//                     </div>

//                     {isLoading && <p>Loading...</p>}

//                     {searchedMenu.map((menu) => (
//                         <div className="swiper-slide search-content1" key={menu.menu_id}>
//                             {/* Use onClick to fetch menu details and navigate to ProductDetails */}
//                             <div className="cart-list style-2" >
//                                 <div className="dz-media media-75">
//                                 <Link to={`/ProductDetails/${menu.menu_id}`}>
//                                     <img
//                                         style={{
//                                             width: '100%',
//                                             height: '100%',
//                                             objectFit: "cover",
//                                             borderRadius: "10px",
//                                         }}
//                                         src={menu.image}
//                                         alt={menu.name}
//                                         onError={(e) => {
//                                             e.target.src = images; // Set local image source on error
//                                             e.target.style.width = '80px'; // Example: Set width of the local image
//                                             e.target.style.height = '80px'; // Example: Set height of the local image
//                                         }}
//                                     />
//                                     </Link>
//                                 </div>
//                                 <div className="dz-content">
//                                     <h6 className="title">{menu.name}</h6>
//                                     <ul className="dz-meta">
//                                         <li className="dz-price">₹{menu.price.toFixed(2)}</li>
//                                     </ul>
//                                     <div className="dz-off">{menu.veg_nonveg === 'veg' ? 'Veg' : 'Non-Veg'}</div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </main>
//             {/* Main Content End */}
//             <Bottom></Bottom>
//         </div>
//     );
// };

// export default Search;





























// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import Bottom from "../component/bottom";

// const Search = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
//   const [searchedMenu, setSearchedMenu] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   // Fetch the restaurant ID from local storage
//   const restaurantId = localStorage.getItem("restaurantId");

//   console.log("Restaurant ID:", restaurantId);

//   // Debounce the search input to avoid too many API calls
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearchTerm(searchTerm);
//     }, 300); // 300ms debounce time

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [searchTerm]);

//   const handleSearch = (event) => {
//     const term = event.target.value;
//     setSearchTerm(term);
//   };

//   const toTitleCase = (str) => {
//     return str.replace(/\w\S*/g, function (txt) {
//       return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//     });
//   };

//   useEffect(() => {
//     const fetchSearchedMenu = async () => {
//       if (!restaurantId) {
//         console.error("Restaurant ID not found in local storage");
//         return;
//       }

//       if (debouncedSearchTerm.trim().length < 3) {
//         setSearchedMenu([]); // Clear the menu list if search term is less than 3 characters
//         return;
//       }

//       setIsLoading(true);

//       try {
//         // Assuming you have a way to get the customer ID when the user is logged in
//         const customerId = localStorage.getItem("customerId") || null; // Replace this with the actual logic to get customer ID if needed
//         const requestBody = {
//           restaurant_id: parseInt(restaurantId, 10), // Convert restaurant ID to a number if necessary
//           keyword: debouncedSearchTerm.trim(),
//           customer_id: customerId, // Pass null if customer ID is not available
//         };

//         const response = await fetch(
//           "https://menumitra.com/user_api/search_menu",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(requestBody),
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           if (data.st === 1 && Array.isArray(data.menu_list)) {
//             const formattedMenu = data.menu_list.map((menu) => ({
//               ...menu,
//               menu_name: toTitleCase(menu.menu_name), // Convert menu name to title case
//             }));
//             setSearchedMenu(formattedMenu);
//           } else {
//             console.error("Invalid data format:", data);
//           }
//         } else {
//           console.error("Response not OK:", response);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }

//       setIsLoading(false);
//     };

//     fetchSearchedMenu();
//   }, [debouncedSearchTerm, restaurantId]);

//   const handleClearAll = () => {
//     setSearchedMenu([]);
//     setSearchTerm("");
//   };

//   return (
//     <div className="page-wrapper">
//       {/* Header */}
//       <header className="header header-fixed style-3 py-2">
//         <div className="header-content">
//           <div className="search-area">
//             <div
//               onClick={() => navigate(-1)}
//               className="back-btn icon-fill dz-icon"
//             >
//               <i className="ri-arrow-left-line"></i>
//             </div>
//             <div className="input w-100">
//               <input
//                 type="search"
//                 className="form-control rounded-md style-2"
//                 placeholder="Search Best items for You"
//                 onChange={handleSearch}
//                 value={searchTerm}
//               />
//             </div>
//           </div>
//         </div>
//       </header>
//       {/* Header End */}

//       {/* Main Content Start */}
//       <main className="page-content p-t80 p-b40">
//         <div className="container">
//           {/* Searched Menu List */}
//           <div className="title-bar mb-2">
//             <h4 className="title mb-0 font-w500">Searched Menu</h4>
//             <div className="font-w500 font-12" onClick={handleClearAll}>
//               Clear All
//             </div>
//           </div>

//           {isLoading && <p>Loading...</p>}

//           {searchedMenu.map((menu) => (
//             <div className="swiper-slide search-content1" key={menu.menu_id}>
//               {/* Use onClick to fetch menu details and navigate to ProductDetails */}
//               <div className="cart-list style-2" style={{ padding: "0px" }}>
//                 <div className="dz-media media-75">
//                   <Link to={`/ProductDetails/${menu.menu_id}`}>
//                     <img
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                         borderRadius: "10px",
//                       }}
//                       src={menu.image || images} // Use default image if image is null
//                       alt={menu.menu_name}
//                       onError={(e) => {
//                         e.target.src = images; // Set local image source on error
//                         e.target.style.width = "80px"; // Example: Set width of the local image
//                         e.target.style.height = "80px"; // Example: Set height of the local image
//                       }}
//                     />
//                   </Link>
//                 </div>
//                 <div className="dz-content">
//                   <h6 className="title">{menu.menu_name}</h6>
//                   <div className="row">
//                     <div className="col-4">
//                       <div className="fs-4" style={{ color: "#0d775e" }}>
//                         <i className="ri-restaurant-line me-2"></i>
//                         {menu.category_name}
//                       </div>
//                     </div>
//                     <div className="col-4">
//                       {/* Spicy Indicator Inline Logic */}
//                       <div className="spicy-indicator">
//                         {Array.from({ length: 5 }).map((_, index) => (
//                           <i
//                             key={index}
//                             className={
//                               index < menu.spicy_index
//                                 ? "ri-fire-fill fs-6"
//                                 : "ri-fire-line fs-6"
//                             }
//                             style={{
//                               fontSize: "12px",
//                               color:
//                                 index < menu.spicy_index
//                                   ? "#f8a500"
//                                   : "#bbbaba",
//                             }}
//                           ></i>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                   <ul className="dz-meta">
//                     <li className="dz-price">₹{menu.price.toFixed(2)}</li>
//                     {/* Rating display similar to ProductCard */}
//                     <li className="dz-rating">
//                       <i
//                         className="ri-star-fill"
//                         style={{ color: "#f8a500", fontSize: "16px" }}
//                       ></i>
//                       <span className="ms-1">
//                         {parseFloat(menu.rating).toFixed(1)}
//                       </span>
//                     </li>
//                   </ul>
//                   <div className="dz-off">
//                     {menu.offer ? `Offer: ${menu.offer}` : ""}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>
//       {/* Main Content End */}
//       <Bottom />
//     </div>
//   );
// };

// export default Search;

















// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import Bottom from "../component/bottom";

// const Search = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
//   const [searchedMenu, setSearchedMenu] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   // Fetch the restaurant ID from local storage
//   const restaurantId = localStorage.getItem("restaurantId");
//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const customerId = userData ? userData.customer_id : null;

//   console.log("Restaurant ID:", restaurantId);

  
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearchTerm(searchTerm);
//     }, 300); 

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [searchTerm]);

//   const handleSearch = (event) => {
//     const term = event.target.value;
//     setSearchTerm(term);
//   };

//   const toTitleCase = (str) => {
//     return str.replace(/\w\S*/g, function (txt) {
//       return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//     });
//   };

//   useEffect(() => {
//     const fetchSearchedMenu = async () => {
//       if (!restaurantId) {
//         console.error("Restaurant ID not found in local storage");
//         return;
//       }

//       if (debouncedSearchTerm.trim().length < 3 || debouncedSearchTerm.trim().length > 10) {
//         setSearchedMenu([]); // Clear the menu list if search term is less than 3 characters
//         return;
//       }

//       setIsLoading(true);

//       try {
//         const requestBody = {
//           restaurant_id: parseInt(restaurantId, 10), // Convert restaurant ID to a number if necessary
//           keyword: debouncedSearchTerm.trim(),
//           customer_id: customerId || null, // Pass null if customer ID is not available
//         };

//         const response = await fetch(
//           "https://menumitra.com/user_api/search_menu",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(requestBody),
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           if (data.st === 1 && Array.isArray(data.menu_list)) {
//             const formattedMenu = data.menu_list.map((menu) => ({
//               ...menu,
//               menu_name: toTitleCase(menu.menu_name), // Convert menu name to title case
//               is_favourite: menu.is_favourite === 1,
//               oldPrice: Math.floor(menu.price * 1.1), // Calculate the old price as 10% more than the current price
//             }));
//             setSearchedMenu(formattedMenu);
//           } else {
//             console.error("Invalid data format:", data);
//           }
//         } else {
//           console.error("Response not OK:", response);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }

//       setIsLoading(false);
//     };

//     fetchSearchedMenu();
//   }, [debouncedSearchTerm, restaurantId]);

//   const handleLikeClick = async (menuId) => {
//     if (!customerId || !restaurantId) {
//       console.error("Missing required data");
//       return;
//     }

//     const menuItem = searchedMenu.find((item) => item.menu_id === menuId);
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
//           // Update the favorite status in the state
//           const updatedMenu = searchedMenu.map((item) =>
//             item.menu_id === menuId
//               ? { ...item, is_favourite: !isFavorite }
//               : item
//           );
//           setSearchedMenu(updatedMenu);
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

//   // Handler to remove a specific item from the search results
//   const handleRemoveItem = (menuId) => {
//     setSearchedMenu(searchedMenu.filter((item) => item.menu_id !== menuId));
//   };

//   const handleClearAll = () => {
//     setSearchedMenu([]);
//     setSearchTerm("");
//   };

//   return (
//     <div className="page-wrapper">
//       {/* Header */}
//       <header
//         className="header header-fixed style-3 "
//         style={{ zIndex: "999" }}
//       >
//         <div className="header-content">
//           <div className="search-area">
//             <div onClick={() => navigate(-1)} className="back-btn  dz-icon">
//               <i className="ri-arrow-left-line fs-2"></i>
//             </div>
//             <div className="mid-content">
//               <h5 className="title me-3">Search</h5>
//             </div>
//           </div>
//         </div>
//       </header>
//       {/* Header End */}

//       {/* Main Content Start */}
//       <main className="page-content p-t80 p-b40">
//         <div className="container pt-0">
//           <div className="input-group w-100 my-2 border border-muted rounded">
//             <span className="input-group-text py-0">
//               <i className="ri-search-line fs-3 text-muted"></i>
//             </span>
//             <input
//               type="search"
//               className="form-control bg-white ps-2 "
//               placeholder="Search Best items for You"
//               onChange={handleSearch}
//               value={searchTerm}
//             />
//           </div>
//           {debouncedSearchTerm && (
//             <div className="title-bar my-3">
//               <div
//                 className=" fw-normal"
//                 style={{ fontSize: "1.25rem", color: "grey" }}
//               >
//                 Search Menu
//               </div>
//               <div
//                 className="fw-normal"
//                 style={{ fontSize: "1.25rem", color: "grey" }}
//                 onClick={handleClearAll}
//               >
//                 Clear All
//               </div>
//             </div>
//           )}

//           {isLoading && <p>Loading...</p>}

//           <div className="container p-0">
//             {searchedMenu.length > 0 ? (
//               searchedMenu.map((menu) => (
//                 <div className="card mb-3" key={menu.menu_id}>
//                   <div className="card-body py-0">
//                     <div className="row">
//                       <div className="col-3 px-0">
//                         <img
//                           src={menu.image || images}
//                           alt={menu.menu_name}
//                           className="img-fluid rounded"
//                           style={{ width: "100px", height: "108px" }}
//                           onError={(e) => {
//                             e.target.src = images;
//                           }}
//                         />
//                       </div>
//                       <div className="col-8 pt-2 pb-0 pe-0 ps-2">
//                         <h4>{menu.menu_name}</h4>
//                         <div className="row">
//                           <div className="col-4 mt-1 pe-0">
//                             <div className="mt-0">
//                               <i className="ri-restaurant-line mt-0 me-2 text-success"></i>
//                               <span className="text-success">
//                                 {menu.category_name}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="col-4 text-end pe-0">
//                             <span className="d-inline-block">
//                               <div
//                                 className="offer-code pt-1"
//                                 style={{ fontSize: "16px" }}
//                               >
//                                 {Array.from({ length: 5 }).map((_, index) => (
//                                   <i
//                                     key={index}
//                                     className={
//                                       index < menu.spicy_index
//                                         ? "ri-fire-fill"
//                                         : "ri-fire-line"
//                                     }
//                                     style={{
//                                       color:
//                                         index < menu.spicy_index
//                                           ? "#eb8e57"
//                                           : "rgba(0, 0, 0, 0.1)",
//                                     }}
//                                   ></i>
//                                 ))}
//                               </div>
//                             </span>
//                           </div>
//                           <div className="col-4 text-end p-0 mt-1">
//                             <span className="h6">
//                               <i
//                                 className="ri-star-half-line me-2"
//                                 style={{ color: "#eb8e57" }}
//                               ></i>
//                               {parseFloat(menu.rating).toFixed(1)}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="row mt-2">
//                           <div className="col-7 ps-0">
//                             <p className="mb-2 fs-4 fw-medium">
//                               <span className="ms-3 me-2 text-info">
//                                 ₹{menu.price}
//                               </span>
//                               <span className="text-muted fs-6 text-decoration-line-through">
//                                 ₹{menu.oldPrice || menu.price}
//                               </span>

//                               <span className="fs-6 ps-2 text-primary">
//                                 {menu.offer || "No "}% Off
//                               </span>
//                             </p>
//                             {/* <h3
//                               className=" d-inline fs-5 fw-medium"
//                               style={{ color: "#4E74FC" }}
//                             >
//                               ₹{menu.price.toFixed(2)}
//                             </h3>
//                             {menu.oldPrice && (
//                               <span className="text-muted ms-2 ">
//                                 <del style={{ fontSize: "0.8em" }}>
//                                   ₹{menu.oldPrice.toFixed(2)}
//                                 </del>
//                               </span>
//                             )} */}
//                           </div>
//                           {/* <div className="col-3 pe-0 ps-1 ">
//                             <div
//                               className="fw-medium fw-semibold pt-1"
//                               style={{ color: "#438a3c" }}
//                             >
//                               {menu.offer}%
//                               <span
//                                 style={{ fontSize: "0.8em" }}
//                                 className="pt-1"
//                               >
//                                 {" "}
//                                 Off
//                               </span>
//                             </div>
//                           </div> */}
//                           <div
//                             className="col-5 text-end  ps-4 "
//                             style={{ zIndex: "999" }}
//                           >
//                             <i
//                               className={`  ${
//                                 menu.is_favourite
//                                   ? "ri-hearts-fill fs-4 "
//                                   : "ri-heart-2-line fs-4  "
//                               }`}
//                               onClick={() => handleLikeClick(menu.menu_id)}
//                               style={{
//                                 cursor: "pointer",

//                                 color: menu.is_favourite ? "red" : "",
//                               }}
//                             ></i>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="col-1  p-0">
//                         <span
//                           className="text-muted fs-5 "
//                           onClick={() => handleRemoveItem(menu.menu_id)}
//                           style={{ cursor: "pointer" }}
//                         >
//                           <i className="ri-close-line"></i>
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center mt-3">No items found.</p>
//             )}
//           </div>
//         </div>
//       </main>
//       {/* Main Content End */}
//       <Bottom />
//     </div>
//   );
// };

// export default Search;

















import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import Bottom from "../component/bottom";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchedMenu, setSearchedMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch userData and extract restaurantId and customerId from local storage
  const userData = JSON.parse(localStorage.getItem("userData"));
  const restaurantId = userData ? userData.restaurantId : null; // Get restaurantId from userData
  const customerId = userData ? userData.customer_id : null;

  console.log("Restaurant ID:", restaurantId);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
  };

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  useEffect(() => {
    const fetchSearchedMenu = async () => {
      if (!restaurantId) {
        console.error("Restaurant ID not found in userData");
        return;
      }

      if (
        debouncedSearchTerm.trim().length < 3 ||
        debouncedSearchTerm.trim().length > 10
      ) {
        setSearchedMenu([]); // Clear the menu list if search term is less than 3 characters
        return;
      }

      setIsLoading(true);

      try {
        const requestBody = {
          restaurant_id: parseInt(restaurantId, 10), // Convert restaurant ID to a number if necessary
          keyword: debouncedSearchTerm.trim(),
          customer_id: customerId || null, // Pass null if customer ID is not available
        };

        const response = await fetch(
          "https://menumitra.com/user_api/search_menu",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.st === 1 && Array.isArray(data.menu_list)) {
            const formattedMenu = data.menu_list.map((menu) => ({
              ...menu,
              menu_name: toTitleCase(menu.menu_name), // Convert menu name to title case
              is_favourite: menu.is_favourite === 1,
              oldPrice: Math.floor(menu.price * 1.1), // Calculate the old price as 10% more than the current price
            }));
            setSearchedMenu(formattedMenu);
          } else {
            console.error("Invalid data format:", data);
          }
        } else {
          console.error("Response not OK:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      setIsLoading(false);
    };

    fetchSearchedMenu();
  }, [debouncedSearchTerm, restaurantId]);

  const handleLikeClick = async (menuId) => {
    if (!customerId || !restaurantId) {
      console.error("Missing required data");
      return;
    }

    const menuItem = searchedMenu.find((item) => item.menu_id === menuId);
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
          // Update the favorite status in the state
          const updatedMenu = searchedMenu.map((item) =>
            item.menu_id === menuId
              ? { ...item, is_favourite: !isFavorite }
              : item
          );
          setSearchedMenu(updatedMenu);
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

  // Handler to remove a specific item from the search results
  const handleRemoveItem = (menuId) => {
    setSearchedMenu(searchedMenu.filter((item) => item.menu_id !== menuId));
  };

  const handleClearAll = () => {
    setSearchedMenu([]);
    setSearchTerm("");
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <header
        className="header header-fixed style-3 "
        style={{ zIndex: "999" }}
      >
        <div className="header-content">
          <div className="search-area">
            <div onClick={() => navigate(-1)} className="back-btn dz-icon">
              <i className="ri-arrow-left-line fs-2"></i>
            </div>
            <div className="mid-content">
              <h5 className="title me-3">Search</h5>
            </div>
          </div>
        </div>
      </header>
      {/* Header End */}

      {/* Main Content Start */}
      <main className="page-content p-t80 p-b40">
        <div className="container pt-0">
          <div className="input-group w-100 my-2 border border-muted rounded">
            <span className="input-group-text py-0">
              <i className="ri-search-line fs-3 text-muted"></i>
            </span>
            <input
              type="search"
              className="form-control bg-white ps-2 "
              placeholder="Search Best items for You"
              onChange={handleSearch}
              value={searchTerm}
            />
          </div>
          {debouncedSearchTerm && (
            <div className="title-bar my-3">
              <div
                className="fw-normal"
                style={{ fontSize: "1.25rem", color: "grey" }}
              >
                Search Menu
              </div>
              <div
                className="fw-normal"
                style={{ fontSize: "1.25rem", color: "grey" }}
                onClick={handleClearAll}
              >
                Clear All
              </div>
            </div>
          )}

          {isLoading && <p>Loading...</p>}

          <div className="container p-0">
            {searchedMenu.length > 0 ? (
              searchedMenu.map((menu) => (
                <div className="card mb-3" key={menu.menu_id}>
                  <div className="card-body py-0">
                    <div className="row">
                      <div className="col-3 px-0">
                        <img
                          src={menu.image || images}
                          alt={menu.menu_name}
                          className="img-fluid rounded"
                          style={{ width: "100px", height: "108px" }}
                          onError={(e) => {
                            e.target.src = images;
                          }}
                        />
                      </div>
                      <div className="col-8 pt-2 pb-0 pe-0 ps-2">
                        <h4>{menu.menu_name}</h4>
                        <div className="row">
                          <div className="col-4 mt-1 pe-0">
                            <div className="mt-0">
                              <i className="ri-restaurant-line mt-0 me-2 text-success"></i>
                              <span className="text-success">
                                {menu.category_name}
                              </span>
                            </div>
                          </div>
                          <div className="col-4 text-end pe-0">
                            <span className="d-inline-block">
                              <div
                                className="offer-code pt-1"
                                style={{ fontSize: "16px" }}
                              >
                                {Array.from({ length: 5 }).map((_, index) => (
                                  <i
                                    key={index}
                                    className={
                                      index < menu.spicy_index
                                        ? "ri-fire-fill"
                                        : "ri-fire-line"
                                    }
                                    style={{
                                      color:
                                        index < menu.spicy_index
                                          ? "#eb8e57"
                                          : "rgba(0, 0, 0, 0.1)",
                                    }}
                                  ></i>
                                ))}
                              </div>
                            </span>
                          </div>
                          <div className="col-4 text-end p-0 mt-1">
                            <span className="h6">
                              <i
                                className="ri-star-half-line me-2"
                                style={{ color: "#eb8e57" }}
                              ></i>
                              {parseFloat(menu.rating).toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div className="row mt-2">
                          <div className="col-7 ps-0">
                            <p className="mb-2 fs-4 fw-medium">
                              <span className="ms-3 me-2 text-info">
                                ₹{menu.price}
                              </span>
                              <span className="text-muted fs-6 text-decoration-line-through">
                                ₹{menu.oldPrice || menu.price}
                              </span>

                              <span className="fs-6 ps-2 text-primary">
                                {menu.offer || "No "}% Off
                              </span>
                            </p>
                          </div>
                          <div
                            className="col-5 text-end ps-4 "
                            style={{ zIndex: "999" }}
                          >
                            <i
                              className={`${
                                menu.is_favourite
                                  ? "ri-hearts-fill fs-4"
                                  : "ri-heart-2-line fs-4"
                              }`}
                              onClick={() => handleLikeClick(menu.menu_id)}
                              style={{
                                cursor: "pointer",
                                color: menu.is_favourite ? "red" : "",
                              }}
                            ></i>
                          </div>
                        </div>
                      </div>
                      <div className="col-1 p-0">
                        <span
                          className="text-muted fs-5"
                          onClick={() => handleRemoveItem(menu.menu_id)}
                          style={{ cursor: "pointer" }}
                        >
                          <i className="ri-close-line"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center mt-3">No items found.</p>
            )}
          </div>
        </div>
      </main>
      {/* Main Content End */}
      <Bottom />
    </div>
  );
};

export default Search;
