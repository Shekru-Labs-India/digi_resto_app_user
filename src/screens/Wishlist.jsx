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





import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import Bottom from "../component/bottom";
import SigninButton from "../constants/SigninButton";
import { useRestaurantId } from "../context/RestaurantIdContext";

const Wishlist = () => {
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { restaurantId: contextRestaurantId } = useRestaurantId();
  const storedRestaurantId = localStorage.getItem("restaurantId");
  const restaurantId = contextRestaurantId || storedRestaurantId;

  const userData = JSON.parse(localStorage.getItem("userData"));
  const customerId = userData ? userData.customer_id : null;

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
            restaurant_id: restaurantId,
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

  const addToCart = (item) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const itemInCart = cartItems.find(
      (cartItem) => cartItem.menu_id === item.menu_id
    );

    if (!itemInCart) {
      const updatedCartItems = [...cartItems, { ...item, quantity: 1 }];
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    } else {
      console.log("Item already in cart");
    }
  };

  const isMenuItemInCart = (menuId) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    return cartItems.some((item) => item.menu_id === menuId);
  };

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const fetchFavoriteItems = async () => {
      if (!customerId || !restaurantId) {
        console.error("Customer ID or Restaurant ID is not available.");
        setLoading(false);
        return;
      }

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

  const handleAddToCartClick = (item) => {
    if (!isMenuItemInCart(item.menu_id)) {
      addToCart(item);
      navigate("/Cart");
    } else {
      console.log("Item is already in the cart");
    }
  };

  return (
    <div className="page-wrapper">
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
          <header className="header header-fixed style-3">
            <div className="header-content">
              <div className="left-content">
                <Link
                  to="/HomeScreen"
                  className="back-btn dz-icon  icon-sm"
                  onClick={() => navigate(-1)}
                >
                  <i className="ri-arrow-left-line fs-2"></i>
                </Link>
              </div>
              <div className="mid-content">
                <h5 className="title">
                  Favourite{" "}
                  {userData && <span className="">({menuList.length})</span>}
                </h5>
              </div>
            </div>
          </header>

          <main className="page-content space-top p-b0 mt-3">
            {menuList.length > 0 ? (
              menuList.map((menu, index) => (
                <div className="container py-1" key={index}>
                  <div className="card">
                    <div className="card-body py-0">
                      <div className="row">
                        <div className="col-3 px-0">
                          <img
                            src={menu.image || images}
                            alt={menu.menu_name}
                            className="rounded"
                            style={{ width: "120px", height: "120px" }}
                            onError={(e) => {
                              e.target.src = images;
                              e.target.style.width = "120px";
                              e.target.style.height = "120px";
                            }}
                          />
                        </div>
                        <div className="col-8 pt-2 p-0">
                          <h4>{toTitleCase(menu.menu_name)}</h4>
                          <div className="row">
                            <div className="col-4 ">
                              <i className="ri-restaurant-line mt-0 me-2 text-success"></i>
                              <span className="text-success">
                                {menu.category_name}
                              </span>
                            </div>
                            <div className="col-5 text-end">
                              <i
                                className="ri-fire-fill"
                                style={{ color: "#eb8e57" }}
                              ></i>
                              <i
                                className="ri-fire-fill"
                                style={{ color: "#eb8e57" }}
                              ></i>
                              <i
                                className="ri-fire-fill"
                                style={{ color: "#eb8e57" }}
                              ></i>
                              <i
                                className="ri-fire-line"
                                style={{
                                  color: "rgba(0, 0, 0, 0.1)",
                                }}
                              ></i>
                              <i
                                className="ri-fire-line"
                                style={{
                                  color: "rgba(0, 0, 0, 0.1)",
                                }}
                              ></i>
                            </div>
                            <div className="col-3 text-end ">
                              <span className="h6">
                                <i
                                  className="ri-star-half-line "
                                  style={{ color: "#eb8e57" }}
                                ></i>
                                {menu.rating || 0.1}
                              </span>
                            </div>
                          </div>
                          <div className="row mt-3">
                            <div className="col-7 pe-0">
                              <h3 className="text-info d-inline fs-5">
                                ₹ {menu.price}
                              </h3>
                              <span className="old-price ms-1 ">
                                {/* <del>₹ {menu.oldPrice}</del> */}
                                <del>₹ 100</del>
                              </span>
                              <span className="text-success ms-2">40% off</span>
                            </div>
                            <div className="col-3 ps-2 d-flex align-items-right">
                              <i
                                className="ri-store-2-line"
                                style={{ fontSize: "18px" }}
                              ></i>
                              <span className="ms-2 text-nowrap me-2">
                                {menu.restaurant_name}
                              </span>
                            </div>
                            <div
                              className="col-2 pe-0 ps-3 text-end"
                              style={{ fontSize: "18px" }}
                            >
                              <div className="d-flex justify-content-end">
                                <i
                                  className="ri-shopping-cart-2-line"
                                  onClick={() => handleAddToCartClick(menu)}
                                ></i>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-1 text-end ">
                          <i
                            className="ri-close-line text-muted h5"
                            onClick={() =>
                              handleRemoveItemClick(index, menu.menu_id)
                            }
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="empty-favorites d-flex flex-column justify-content-center align-items-center w-100"
                style={{ height: "100%" }}
              >
                <h5>Nothing to show in favorites.</h5>
                <p>Add some products to show here!</p>
                <Link to="/HomeScreen" className="btn btn-primary">
                  Browse Menus
                </Link>
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

