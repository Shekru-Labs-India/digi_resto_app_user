// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import Swiper from "swiper";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import images from "../assets/MenuDefault.png";

// const NearbyArea = () => {
//   const swiperRef = useRef(null);
//   const { restaurantId } = useRestaurantId();
//   const [menuItems, setMenuItems] = useState(() => {
//     const storedItems = localStorage.getItem("menuItems");
//     return storedItems ? JSON.parse(storedItems) : [];
//   });
//   const [cartItems, setCartItems] = useState([]);
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const [customerId, setCustomerId] = useState(null);

//   useEffect(() => {
//     const storedUserData = localStorage.getItem("userData");
//     if (storedUserData) {
//       const userData = JSON.parse(storedUserData);
//       setCustomerId(userData.customer_id);
//     }
//   }, []);

//   useEffect(() => {
//     const swiper = new Swiper(".product-swiper", {
//       loop: true,
//       slidesPerView: "auto",
//       centeredSlides: true,
//       spaceBetween: 65,
//     });

//     swiperRef.current = swiper;

//     const interval = setInterval(() => {
//       if (swiperRef.current) {
//         swiperRef.current.slideNext();
//       }
//     }, 3000);

//     return () => {
//       clearInterval(interval);
//       if (swiperRef.current) {
//         swiperRef.current.destroy();
//       }
//     };
//   }, []);

//   const toTitleCase = (str) => {
//     if (!str) return "";
//     return str
//       .toLowerCase()
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//   const fetchAllMenuListByCategory = async () => {
//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_all_menu_list_by_category",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             customer_id: customerId || null, // Send customer_id if logged in
//             restaurant_id: restaurantId,
//           }),
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         console.log("API response data:", data);
//         // Handle the response data as needed
//       } else {
//         console.error("Failed to fetch menu data. Status:", response.status);
//       }
//     } catch (error) {
//       console.error("Error fetching menu data:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchMenuData = async () => {
//       try {
//         const response = await fetch(
//           "https://menumitra.com/user_api/get_all_menu_list_by_category",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               customer_id: customerId || null, // Send customer_id if logged in
//               restaurant_id: restaurantId,
//             }),
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           console.log("API response data:", data);

//           if (data.st === 1 && Array.isArray(data.MenuList)) {
//             const formattedMenuItems = data.MenuList.map((menu) => ({
//               ...menu,
//               oldPrice: Math.floor(menu.price * 1.1),
//               is_favourite: menu.is_favourite === 1,
//             }));

//             setMenuItems(formattedMenuItems);
//             localStorage.setItem(
//               "menuItems",
//               JSON.stringify(formattedMenuItems)
//             );
//           } else {
//             console.error("Invalid menu data format:", data);
//           }
//         } else {
//           console.error("Failed to fetch menu data. Status:", response.status);
//         }
//       } catch (error) {
//         console.error("Error fetching menu data:", error);
//       }
//     };

//     if (restaurantId) {
//       fetchMenuData();
//     }
//   }, [restaurantId]);

//   const handleLikeClick = async (menuId) => {
//     if (!customerId) {
//       console.error("Customer ID is missing");
//       return;
//     }

//     try {
//       const menuItem = menuItems.find((item) => item.menu_id === menuId);
//       const isFavorite = menuItem.is_favourite;

//       const apiUrl = isFavorite
//         ? "https://menumitra.com/user_api/remove_favourite_menu"
//         : "https://menumitra.com/user_api/save_favourite_menu";

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
//           setMenuItems((prevItems) =>
//             prevItems.map((item) =>
//               item.menu_id === menuId
//                 ? { ...item, is_favourite: !item.is_favourite }
//                 : item
//             )
//           );
//           console.log(
//             isFavorite ? "Removed from favorites" : "Added to favorites"
//           );
//         } else {
//           console.error("Failed to update favorite status:", data.msg);
//         }
//       } else {
//         console.error("Network response was not ok.");
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
//     navigate("/Cart");
//   };

//   const isMenuItemInCart = (menuId) => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     return cartItems.some((item) => item.menu_id === menuId);
//   };

//   const renderSpiceIcons = (spicyIndex) => {
//     return Array.from({ length: 5 }).map((_, index) =>
//       index < spicyIndex ? (
//         <i className="ri-fire-fill fs-6" key={index}></i>
//       ) : (
//         <i
//           className="ri-fire-line fs-6"
//           style={{ color: "#0000001a" }}
//           key={index}
//         ></i>
//       )
//     );
//   };

//   return (
//     <div className="dz-box style-2 nearby-area">
//       <div className="title-bar1 align-items-start">
//         <div className="left">
//           <h4 className="title mb-1 fs-5">Special Menu</h4>
//         </div>
//       </div>
//       <div className="swiper product-swiper swiper-center">
//         <div className="swiper-wrapper">
//           {menuItems.map((menuItem, index) => (
//             <div className="swiper-slide col-6" key={index}>
//               <div className="row g-3 grid-style-1">
//                 <div>
//                   <div
//                     className="card-item style-6"
//                     style={{ width: "216px", height: "auto" }}
//                   >
//                     <div className="dz-media">
//                       <Link to={`/ProductDetails/${menuItem.menu_id}`}>
//                         <img
//                           src={menuItem.image || images}
//                           style={{ height: "150px", width: "400px" }}
//                           onError={(e) => {
//                             e.target.src = images;
//                           }}
//                         />
//                       </Link>
//                     </div>
//                     <div className="dz-content">
//                       <div
//                         className="detail-content"
//                         style={{ position: "relative" }}
//                       >
//                         <div
//                           className="dz-quantity detail-content fs-6 fw-medium text-truncate"
//                           style={{ color: "#0a795b" }}
//                         >
//                           <i
//                             className="ri-restaurant-line "
//                             style={{ paddingRight: "5px" }}
//                           ></i>
//                           {toTitleCase(menuItem.category_name)}
//                         </div>
//                         <i
//                           className={` ${
//                             menuItem.is_favourite
//                               ? "ri-hearts-fill"
//                               : "ri-heart-2-line"
//                           } fs-2`}
//                           onClick={() => handleLikeClick(menuItem.menu_id)}
//                           style={{
//                             position: "absolute",
//                             top: "0",
//                             right: "0",
//                             fontSize: "23px",
//                             cursor: "pointer",
//                             color: menuItem.is_favourite
//                               ? "#fe0809"
//                               : "#73757b",
//                           }}
//                         ></i>
//                       </div>
//                       <h4 className="item-name ">
//                         <a href="product-detail.html">
//                           {toTitleCase(menuItem.name)}
//                         </a>
//                       </h4>
//                       <div className="row">
//                         <div className="col-6">
//                           <div className="offer-code mx-0">
//                             {renderSpiceIcons(menuItem.spicy_index)}
//                           </div>
//                         </div>
//                         <div className="col-6 text-end">
//                           <i
//                             className="ri-star-half-line fs-6 pe-1"
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
//                       <div className="footer-wrapper">
//                         {/* <div className="price-wrapper d-flex align-items-baseline">
//                           <h6 className="current-price me-0 fs-6 fw-medium">
//                             ₹{menuItem.price}
//                           </h6>
//                           <span className="old-price ms-0 fs-8 ms-1">
//                             ₹{menuItem.oldPrice}
//                           </span>
//                         </div>

//                         <div className="small-offer-text">{menuItem.offer} off</div> */}
//                         <p className="mb-2 fs-4 fw-medium">
//                           <span className="ms-0 me-2 text-info">
//                             ₹{menuItem.price}
//                           </span>
//                           <span className="text-muted fs-6 text-decoration-line-through">
//                             ₹{menuItem.oldPrice || menuItem.price}
//                           </span>

//                           <span className="fs-6 ps-2 text-primary">
//                             {menuItem.offer || "No "}% Off
//                           </span>
//                         </p>
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
//                       </div>
//                       {/* <div className="footer-wrapper mt-2">
//                         <div className="price-wrapper d-flex align-items-baseline">
//                           <h6 className="current-price me-0 fs-6 fw-medium">
//                             ₹{menuItem.price}
//                           </h6>
//                           <span className="old-price ms-0 fs-8 ms-1">
//                             ₹{menuItem.oldPrice}
//                           </span>
//                         </div>

//                         <div className="small-offer-text">{menuItem.offer}</div>

//                         <div className="footer-btns">
//                           {userData ? (
//                             <div
//                               onClick={() => handleAddToCartClick(menuItem)}
//                               className="cart-btn"
//                             >
//                               {isMenuItemInCart(menuItem.menu_id) ? (
//                                 <i className="ri-shopping-cart-2-fill fs-2"></i>
//                               ) : (
//                                 <i className="ri-shopping-cart-2-line fs-2"></i>
//                               )}
//                             </div>
//                           ) : (
//                             <i className="ri-shopping-cart-2-line fs-2"></i>
//                           )}
//                         </div>
//                       </div> */}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NearbyArea;

// *-*-**










import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swiper from "swiper";
import { useRestaurantId } from "../context/RestaurantIdContext";
import images from "../assets/MenuDefault.png";

const NearbyArea = () => {
  const swiperRef = useRef(null);
  const { restaurantId } = useRestaurantId();
  const [menuItems, setMenuItems] = useState(() => {
    const storedItems = localStorage.getItem("menuItems");
    return storedItems ? JSON.parse(storedItems) : [];
  });
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setCustomerId(userData.customer_id);
    }
  }, []);

  useEffect(() => {
    const swiper = new Swiper(".product-swiper", {
      loop: true,
      slidesPerView: "2",
      centeredSlides: true,
      spaceBetween: 90,
    });

    swiperRef.current = swiper;

    const interval = setInterval(() => {
      if (swiperRef.current) {
        swiperRef.current.slideNext();
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      if (swiperRef.current) {
        swiperRef.current.destroy();
      }
    };
  }, []);

  const toTitleCase = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const fetchAllMenuListByCategory = async () => {
    try {
      const response = await fetch(
        "https://menumitra.com/user_api/get_all_menu_list_by_category",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: customerId || null, // Send customer_id if logged in
            restaurant_id: restaurantId,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("API response data:", data);
        // Handle the response data as needed
      } else {
        console.error("Failed to fetch menu data. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(
          "https://menumitra.com/user_api/get_all_menu_list_by_category",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customer_id: customerId || null, // Send customer_id if logged in
              restaurant_id: restaurantId,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("API response data:", data);

          if (data.st === 1 && Array.isArray(data.MenuList)) {
            const formattedMenuItems = data.MenuList.map((menu) => ({
              ...menu,
              oldPrice: Math.floor(menu.price * 1.1),
              is_favourite: menu.is_favourite === 1,
            }));

            setMenuItems(formattedMenuItems);
            localStorage.setItem(
              "menuItems",
              JSON.stringify(formattedMenuItems)
            );
          } else {
            console.error("Invalid data format:", data);
          }
        } else {
          console.error("Network response was not ok:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    if (restaurantId) {
      fetchMenuData();
    }
  }, [restaurantId]);

  const handleLikeClick = async (menuId) => {
    if (!customerId || !restaurantId) {
      console.error("Customer ID is missing");
      navigate('/Signinscreen')
      return;
    }

    try {
      const menuItem = menuItems.find((item) => item.menu_id === menuId);
      const isFavorite = menuItem.is_favourite;

      const apiUrl = isFavorite
        ? "https://menumitra.com/user_api/remove_favourite_menu"
        : "https://menumitra.com/user_api/save_favourite_menu";

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
          setMenuItems((prevItems) =>
            prevItems.map((item) =>
              item.menu_id === menuId
                ? { ...item, is_favourite: !item.is_favourite }
                : item
            )
          );
          console.log(
            isFavorite ? "Removed from favorites" : "Added to favorites"
          );
        } else {
          console.error("Failed to update favorite status:", data.msg);
        }
      } else {
        console.error("Network response was not ok.");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const handleAddToCartClick = async (menuItem) => {
    if (!customerId || !restaurantId) {
      console.error("Missing required data");
      navigate('/Signinscreen')
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
            menu_id: menuItem.menu_id,
            customer_id: customerId,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.st === 1) {
        const updatedCartItems = [...cartItems, { ...menuItem, quantity: 1 }];
        setCartItems(updatedCartItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        localStorage.setItem("cartId", data.cart_id);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const isMenuItemInCart = (menuId) => {
    return cartItems.some((item) => item.menu_id === menuId);
  };

  const renderSpiceIcons = (spicyIndex) => {
    return Array.from({ length: 5 }).map((_, index) =>
      index < spicyIndex ? (
        <i className="ri-fire-fill fs-6" key={index}></i>
      ) : (
        <i
          className="ri-fire-line fs-6"
          style={{ color: "#0000001a" }}
          key={index}
        ></i>
      )
    );
  };

  return (
    <div className="dz-box style-2 nearby-area">
      <div className="title-bar1 align-items-start mb-5">
        <div className="left">
          <h4 className="title mb-1 fs-5">Special Menu</h4>
        </div>
      </div>
      <div className="swiper product-swiper swiper-center">
        <div className="swiper-wrapper">
          {menuItems.map((menuItem, index) => (
            <div className="swiper-slide col-6" key={index}>
              <div className="row g-3 grid-style-1">
                <div>
                  <div
                    className="card-item style-6"
                    style={{ width: "216px", height: "auto" }}
                  >
                    <div className="dz-media">
                      <Link to={`/ProductDetails/${menuItem.menu_id}`}>
                        <img
                          src={menuItem.image || images}
                          style={{ height: "150px", width: "400px" }}
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
                        <div
                          className="dz-quantity detail-content category-text fw-medium text-truncate"
                          style={{ color: "#0a795b" }}
                        >
                          <i
                            className="ri-restaurant-line "
                            style={{ paddingRight: "5px" }}
                          ></i>
                          {toTitleCase(menuItem.category_name)}
                        </div>
                        <i
                          className={` ${
                            menuItem.is_favourite
                              ? "ri-hearts-fill"
                              : "ri-heart-2-line"
                          } fs-2`}
                          onClick={() => handleLikeClick(menuItem.menu_id)}
                          style={{
                            position: "absolute",
                            top: "0",
                            right: "0",
                            fontSize: "23px",
                            cursor: "pointer",
                            color: menuItem.is_favourite
                              ? "#fe0809"
                              : "#73757b",
                          }}
                        ></i>
                      </div>
                      <h4 className="item-name fs-sm text-wrap">
                        <a href="product-detail.html">
                          {toTitleCase(menuItem.name)}
                        </a>
                      </h4>
                      <div className="row">
                        <div className="col-6">
                          <div className="offer-code mx-0">
                            {renderSpiceIcons(menuItem.spicy_index)}
                          </div>
                        </div>
                        <div className="col-6 text-end">
                          <i
                            className="ri-star-half-line fs-6 pe-1"
                            style={{ color: "#f8a500" }}
                          ></i>
                          <span
                            className="fs-6 fw-semibold"
                            style={{ color: "#7f7e7e", marginLeft: "5px" }}
                          >
                            {menuItem.rating}
                          </span>
                        </div>
                      </div>
                      <div className="">
                        <div className="row">
                          <div className="col-9">
                            <p className="mb-2 fs-4 fw-medium">
                              <span className="ms-0 me-2 text-info">
                                ₹{menuItem.price}
                              </span>
                              <span className="gray-text fs-6 text-decoration-line-through">
                                ₹{menuItem.oldPrice || menuItem.price}
                              </span>
                            </p>
                          </div>
                          <div className="col-2 me-3">
                            <div
                              onClick={() => handleAddToCartClick(menuItem)}
                              className="cart-btn"
                            >
                              {isMenuItemInCart(menuItem.menu_id) ? (
                                <i className="ri-shopping-cart-2-fill fs-2"></i>
                              ) : (
                                <i className="ri-shopping-cart-2-line fs-2"></i>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <span className="fs-6 text-primary">
                            {menuItem.offer || "No "}% Off
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NearbyArea;
