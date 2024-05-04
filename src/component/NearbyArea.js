// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import Swiper from "swiper";

// import images from "../assets/MenuDefault.png";

// const NearbyArea = () => {
//   const swiperRef = useRef(null);
//   const [menuItems, setMenuItems] = useState(() => {
//     const storedItems = localStorage.getItem("menuItems");
//     return storedItems ? JSON.parse(storedItems) : [];
//   });

//   const [cartItems, setCartItems] = useState([]); 
//   const navigate = useNavigate();

//   useEffect(() => {
//     const swiper = new Swiper(".product-swiper", {
//       loop: true,
//       slidesPerView: "auto",
//       centeredSlides: true,
//       spaceBetween: 10,
//     });

//     swiperRef.current = swiper;

//     const interval = setInterval(() => {
//       if (swiperRef.current) {
//         swiperRef.current.slideNext();
//       }
//     }, 2000);

//     return () => {
//       clearInterval(interval);
//       if (swiperRef.current) {
//         swiperRef.current.destroy();
//       }
//     };
//   }, []);

//   const toTitleCase = (str) => {
//     return str.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
//   };

//   useEffect(() => {
//     const fetchMenuData = async () => {
//       try {
//         const response = await fetch(
//           "https://menumitra.com/user_api/get_special_menu_list",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               restaurant_id: 13,
//             }),
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           console.log("API response data:", data);

//           if (data.st === 1 && Array.isArray(data.MenuList)) {
//             // const formattedMenuItems = data.MenuList.map((menu) => ({
//             //   ...menu,
//             //   oldPrice: Math.floor(menu.price * 1.1),
//             //   // is_favourite: false, // Initialize is_favourite state
          
//             // }));
//             const formattedMenuItems = data.MenuList.map((menu) => ({
//               ...menu,
//               oldPrice: Math.floor(menu.price * 1.1),
//               is_favourite: menu.is_Favourite === 1, // Initialize is_favourite based on backend response
//             }));
            

//             // Update state and store in local storage
//             setMenuItems(formattedMenuItems);
//             localStorage.setItem("menuItems", JSON.stringify(formattedMenuItems));
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

//     fetchMenuData();
//   }, []);

//   // const handleLikeClick = async (restaurantId, menuId, customerId) => {
//   //   try {
//   //     const response = await fetch(
//   //       "https://menumitra.com/user_api/save_favourite_menu",
//   //       {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify({
//   //           restaurant_id: restaurantId,
//   //           menu_id: menuId,
//   //           customer_id: customerId,
//   //         }),
//   //       }
//   //     );
  
//   //     if (response.ok) {
//   //       // Update the state based on the current state
//   //       setMenuItems((prevMenuItems) => {
//   //         return prevMenuItems.map((menuItem) =>
//   //           menuItem.menu_id === menuId
//   //             ? { ...menuItem, is_favourite: !menuItem.is_favourite }
//   //             : menuItem
//   //         );
//   //       });
 
//   //       // Display a message indicating whether the item was added or removed from favorites
//   //       const updatedMenuItem = menuItems.find((item) => item.menu_id === menuId);
//   //       if (updatedMenuItem && updatedMenuItem.is_favourite) {
//   //         alert("Added to favorites!");
//   //       }
//   //     } else {
//   //       console.error("Failed to add/remove item from favorites");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error adding/removing item from favorites:", error);
//   //   }
//   // };
  
//   const handleLikeClick = async (restaurantId, menuId, customerId) => {
//     try {
//       // Make API call to toggle favorite status
//       const response = await fetch("https://menumitra.com/user_api/save_favourite_menu", {
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
//         // Update the state to toggle is_favourite
//         setMenuItems((prevMenuItems) =>
//           prevMenuItems.map((menuItem) =>
//             menuItem.menu_id === menuId
//               ? { ...menuItem, is_favourite: !menuItem.is_favourite }
//               : menuItem
//           )
//         );
//       } else {
//         console.error("Failed to add/remove item from favorites");
//       }
//     } catch (error) {
//       console.error("Error adding/removing item from favorites:", error);
//     }
//   };
  
  

//   const handleAddToCartClick = (menuItem) => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

//     const isAlreadyInCart = cartItems.some((item) => item.menu_id === menuItem.menu_id);

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

//     navigate('/Cart');
//   };

//   const isMenuItemInCart = (menuId) => {
//     const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
//     return cartItems.some((item) => item.menu_id === menuId);
//   };

//   return (
//     <div className="dz-box style-2 nearby-area">
//       <div className="title-bar1 align-items-start">
//         <div className="left">
//           <h4 className="title mb-1">Special Menu</h4>
//         </div>
//       </div>
//       <div className="swiper product-swiper swiper-center">
//         <div className="swiper-wrapper">
//           {menuItems.map((menuItem, index) => (
//             <div className="swiper-slide col-6" key={index}>
//               <div className="row g-3 grid-style-1">
//                 <div>
//                   <div className="card-item style-6">
//                     <div className="dz-media">
//                       <Link to={`/ProductDetails/${menuItem.menu_id}`}>
//                         <img
//                           src={menuItem.image}
//                           style={{ height: "150px", width: "400px" }}
//                           onError={(e) => {
//                             e.target.src = images; // Set local image source on error
//                           }}
//                         />
//                       </Link>
//                     </div>
//                     <div className="dz-content">
//                       {/* <span className="product-title">
//                         {toTitleCase(menuItem.menu_cat_name)}
//                         <i
//   className={`bx ${menuItem.is_favourite ? 'bxs-heart text-red' : 'bx-heart'} bx-sm`}
//   onClick={() => handleLikeClick(13, menuItem.menu_id, 1)}
// ></i>
//                       </span> */}

// <div className="detail-content" style={{ position: 'relative' }}>
//   <h3 className="product-title">
//   {toTitleCase(menuItem.menu_cat_name)} 
//   </h3>
//   {/* <i

// className={`bx ${menuItem.is_favourite ? 'bxs-heart text-red' : 'bx-heart'} bx-sm`}
// onClick={() => handleLikeClick(13, menuItem.menu_id, 1)}

//     style={{
//       position: 'absolute',
//       top: '0',
//       right: '0',
//       fontSize: '23px',
//       cursor: 'pointer',
//     }}
  
//   ></i> */}

// <i
//   className={`bx ${menuItem.is_favourite ? 'bxs-heart text-red' : 'bx-heart'} bx-sm`}
//   onClick={() => handleLikeClick(13, menuItem.menu_id, 1)}
//   style={{
//     position: 'absolute',
//     top: '0',
//     right: '0',
//     fontSize: '23px',
//     cursor: 'pointer',
//   }}
// ></i>


// </div>
//                       <h4 className="item-name">
//                         <a href="product-detail.html">
//                           {toTitleCase(menuItem.name)}
//                         </a>
//                       </h4>
//                       <div className="offer-code">
//                         Spicy Level: {toTitleCase(menuItem.spicy_index)}
//                       </div>
//                       <div className="footer-wrapper">
//                   <div className="price-wrapper">
//                     <h6 className="current-price">₹{menuItem.price}</h6>
//                     <span className="old-price">₹{menuItem.oldPrice}</span>
//                   </div>
//                       <div
//                         onClick={() => handleAddToCartClick(menuItem)}
//                         className="cart-btn"
//                       >
//                         {isMenuItemInCart(menuItem.menu_id) ? (
//                           <i className="bx bxs-cart bx-sm"></i>
//                         ) : (
//                           <i className="bx bx-cart-add bx-sm"></i>
//                         )}
//                       </div>
//                       </div>
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


import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swiper from "swiper";
import { useRestaurantId } from '../context/RestaurantIdContext';
import images from "../assets/MenuDefault.png";

const NearbyArea = () => {
  const swiperRef = useRef(null);
  const { restaurantId } = useRestaurantId(); 
  const [menuItems, setMenuItems] = useState(() => {
    const storedItems = localStorage.getItem("menuItems");
    return storedItems ? JSON.parse(storedItems) : [];
  });
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData'));
  useEffect(() => {
    const swiper = new Swiper(".product-swiper", {
      loop: true,
      slidesPerView: "auto",
      centeredSlides: true,
      spaceBetween: 10,
    });

    swiperRef.current = swiper;

    const interval = setInterval(() => {
      if (swiperRef.current) {
        swiperRef.current.slideNext();
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      if (swiperRef.current) {
        swiperRef.current.destroy();
      }
    };
  }, []);

  const toTitleCase = (str) => {
    if (!str) return ""; // Return an empty string if str is falsy
    return str.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };
  
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(
          "https://menumitra.com/user_api/get_special_menu_list",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
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
          } else {
            console.error("Invalid menu data format:", data);
          }
        } else {
          console.error("Failed to fetch menu data. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    if (restaurantId) {
      fetchMenuData();
    }
  }, [restaurantId]);

 

  const handleLikeClick = async (restaurantId, menuId, customerId) => {
    try {
      const response = await fetch("https://menumitra.com/user_api/save_favourite_menu", {
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
        // Toggle is_favourite locally
        const updatedMenuItems = menuItems.map((menuItem) =>
          menuItem.menu_id === menuId ? { ...menuItem, is_favourite: !menuItem.is_favourite } : menuItem
        );
        setMenuItems(updatedMenuItems);
        localStorage.setItem("menuItems", JSON.stringify(updatedMenuItems));
      } else {
        console.error("Failed to add/remove item from favorites");
      }
    } catch (error) {
      console.error("Error adding/removing item from favorites:", error);
    }
  };

  const handleAddToCartClick = (menuItem) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const isAlreadyInCart = cartItems.some((item) => item.menu_id === menuItem.menu_id);

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
    navigate("/Cart");
  };

  const isMenuItemInCart = (menuId) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    return cartItems.some((item) => item.menu_id === menuId);
  };

  return (
    <div className="dz-box style-2 nearby-area">
      <div className="title-bar1 align-items-start">
        <div className="left">
          <h4 className="title mb-1">Special Menu</h4>
        </div>
      </div>
      <div className="swiper product-swiper swiper-center">
        <div className="swiper-wrapper">
          {menuItems.map((menuItem, index) => (
            <div className="swiper-slide col-6" key={index}>
              <div className="row g-3 grid-style-1">
                <div>
                  <div className="card-item style-6">
                    <div className="dz-media">
                      <Link to={`/ProductDetails/${menuItem.menu_id}`}>
                        <img
                          src={menuItem.image}
                          style={{ height: "150px", width: "400px" }}
                          onError={(e) => {
                            e.target.src = images; // Set local image source on error
                          }}
                        />
                      </Link>
                    </div>
                    <div className="dz-content">
                      <div className="detail-content" style={{ position: "relative" }}>
                        <h3 className="product-title">{toTitleCase(menuItem.menu_cat_name)}</h3>
                        {userData ? ( <i
                          className={`bx ${menuItem.is_favourite ? "bxs-heart text-red" : "bx-heart"} bx-sm`}
                          onClick={() => handleLikeClick(13, menuItem.menu_id, 1)}
                          style={{
                            position: "absolute",
                            top: "0",
                            right: "0",
                            fontSize: "23px",
                            cursor: "pointer",
                          }}
                        ></i>):( <i
                          className= " bx bx-heart"
                        
                          style={{
                            position: "absolute",
                            top: "0",
                            right: "0",
                            fontSize: "23px",
                            cursor: "pointer",
                          }}
                        ></i>)}
                      </div>
                      <h4 className="item-name">
                        <a href="product-detail.html">{toTitleCase(menuItem.name)}</a>
                      </h4>
                      <div className="offer-code">Spicy Level: {toTitleCase(menuItem.spicy_index)}</div>
                      <div className="footer-wrapper">
                        <div className="price-wrapper">
                          <h6 className="current-price">₹{menuItem.price}</h6>
                          <span className="old-price">₹{menuItem.oldPrice}</span>
                        </div>
                        {userData ? ( <div onClick={() => handleAddToCartClick(menuItem)} className="cart-btn">
                          {isMenuItemInCart(menuItem.menu_id) ? (
                            <i className="bx bxs-cart bx-sm"></i>
                          ) : (
                            <i className="bx bx-cart-add bx-sm"></i>
                          )}
                        </div>
):(   <i className="bx bx-cart-add bx-sm"></i>)}
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



