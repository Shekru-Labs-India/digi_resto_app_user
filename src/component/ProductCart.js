// import React, { useState, useEffect } from 'react';
// import product1 from '../assets/images/product/1.jpg';
// import '../assets/css/style.css';
// import PeopleAlsoViewed from './PeopleAlsoViewed';

// const ProductCard = () => {
//     const [menuList, setMenuList] = useState([]);

//     // Function to convert string to title case
//     const toTitleCase = (str) => {
//         return str.replace(/\w\S*/g, function(txt) {
//             return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//         });
//     };

//     useEffect(() => {
//         const fetchMenuData = async () => {
//             try {
//                 const response = await fetch('http://194.195.116.199/user_api/get_menu_by_cat', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({
//                         restaurant_code: 611447,
//                         cat_id: 18
//                     })
//                 });

//                 if (response.ok) {
//                     const data = await response.json();
//                     if (data.st === 1) {
//                         // Update menu names to title case
//                         const formattedMenuList = data.menu_list.map((menu) => ({
//                             ...menu,
//                             name: toTitleCase(menu.name),
//                             oldPrice: Math.floor(menu.price * 1.1)
//                         }));
//                         setMenuList(formattedMenuList);
//                     } else {
//                         console.error('API Error:', data.msg);
//                     }
//                 } else {
//                     console.error('Network response was not ok.');
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         };

//         fetchMenuData();
//     }, []);

//     return (
//         <div className="row g-3 grid-style-1">
//             {menuList.map((menu) => (
//                 <div key={menu.menu_id} className="col-6">
//                     <div className="card-item style-6">
//                         <a href="product-detail.html" className="dz-media">
//                             <img src={product1} alt="image" />
//                         </a>
//                         <div className="dz-content">
//                             <span className="product-title">{menu.category}</span>
//                             {/* <i class="bx bx-heart"></i> */}
//                             {/* <i className='bx bx-heart bx-sm' ></i> */}
//                             {/* <i className='bx bx-heart'></i> */}
//                             <h4 className="item-name">
//                                 <a href="product-detail.html">{menu.name}</a>
//                             </h4>
//                             <div className="offer-code">Spicy Level: {menu.spicy_index}</div>
//                             <div className="footer-wrapper">
//                                 <div className="price-wrapper">
//                                     <h6 className="current-price">₹{menu.price}</h6>
//                                     <span className="old-price">₹{menu.oldPrice}</span>
//                                 </div>
//                                 <a href="product-detail.html" className="btn btn-xs btn-outline-primary">
//                                     ADD
//                                 </a>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//             <PeopleAlsoViewed/>
//         </div>
//     );
// };

// export default ProductCard;

// import React, { useState, useEffect } from 'react';
// import '../assets/css/style.css';
// import PeopleAlsoViewed from './PeopleAlsoViewed';

// const ProductCard = () => {
//     const [menuList, setMenuList] = useState([]);

//     // Function to convert a string to title case
//     const toTitleCase = (str) => {
//         return str.replace(/\w\S*/g, function(txt) {
//             return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//         });
//     };

//     useEffect(() => {
//         const fetchMenuData = async () => {
//             try {
//                 const response = await fetch('http://194.195.116.199/user_api/get_menu_by_cat', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({
//                         restaurant_code: 611447,
//                         cat_id: 18
//                     })
//                 });

//                 if (response.ok) {
//                     const data = await response.json();
//                     if (data.st === 1) {
//                         // Update menu names to title case and include image URLs
//                         const formattedMenuList = data.menu_list.map((menu) => ({
//                             ...menu,
//                             imageUrl: menu.image,
//                             category: toTitleCase(menu.category),
//                             name: toTitleCase(menu.name), // Convert name to title case
//                             oldPrice: Math.floor(menu.price * 1.1)
//                         }));
//                         setMenuList(formattedMenuList);
//                     } else {
//                         console.error('API Error:', data.msg);
//                     }
//                 } else {
//                     console.error('Network response was not ok.');
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         };

//         fetchMenuData();
//     }, []);

//     return (
//         <div className="row g-3 grid-style-1">
//             {menuList.map((menu) => (
//                 <div key={menu.menu_id} className="col-6">
//                     <div className="card-item style-6">
//                         <a href="product-detail.html" className="dz-media">
//                             <img src={menu.imageUrl} alt="Menu Item" />
//                         </a>
//                         <div className="dz-content">
//                         <span className="product-title">
//   {menu.category}

//     <i className='bx bx-heart ' style={{ marginLeft: '80px', fontSize:'20px' }}></i>

// </span>

//                             <h4 className="item-name">
//                                 <a href="product-detail.html">{menu.name}</a>
//                             </h4>
//                             <div className="offer-code">Spicy Level: {menu.spicy_index}</div>
//                             <div className="footer-wrapper">
//                                 <div className="price-wrapper">
//                                     <h6 className="current-price">₹{menu.price}</h6>
//                                     <span className="old-price">₹{menu.oldPrice}</span>
//                                 </div>
//                                 <a href="product-detail.html" className="btn btn-xs btn-outline-primary">
//                                     ADD
//                                 </a>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//             <PeopleAlsoViewed />
//         </div>
//     );
// };

// export default ProductCard;

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import PeopleAlsoViewed from './PeopleAlsoViewed';

// const ProductCard = () => {
//     const [menuList, setMenuList] = useState([]);
//     const navigate = useNavigate();

//     // Function to convert a string to title case
//     const toTitleCase = (str) => {
//         return str.replace(/\w\S*/g, function(txt) {
//             return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//         });
//     };

//   const handleAddToCartClick = () => {
//     // Create an item object to add to cart
//     const item = {
//       image,
//       name,
//       price,
//       oldPrice,
//       restaurantName
//     };

//     // Call the onAddToCart callback function passed from the parent component
//     onAddToCart(item);
//     navigate('/Cart');
//   };

//     const handleLikeClick = async (restaurantId, menuId, customerId) => {
//         try {
//             const response = await fetch('http://194.195.116.199/user_api/save_favourite_menu', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     restaurant_id: restaurantId,
//                     menu_id: menuId,
//                     customer_id: customerId
//                 })
//             });

//             if (response.ok) {
//                 // Handle success response as needed
//                 console.log('Item added to favorites successfully');
//                 navigate('/Wishlist');
//             } else {
//                 console.error('Failed to add item to favorites');
//             }
//         } catch (error) {
//             console.error('Error adding item to favorites:', error);
//         }
//     };

//     useEffect(() => {
//         const fetchMenuData = async () => {
//             try {
//                 const response = await fetch('http://194.195.116.199/user_api/get_menu_by_cat', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({
//                         restaurant_code: 611447,
//                         cat_id: 18
//                     })
//                 });

//                 if (response.ok) {
//                     const data = await response.json();
//                     if (data.st === 1) {
//                         // Update menu names to title case and include image URLs
//                         const formattedMenuList = data.menu_list.map((menu) => ({
//                             ...menu,
//                             image: menu.image,
//                             category: toTitleCase(menu.category),
//                             name: toTitleCase(menu.name), // Convert name to title case
//                             oldPrice: Math.floor(menu.price * 1.1)
//                         }));
//                         setMenuList(formattedMenuList);
//                     } else {
//                         console.error('API Error:', data.msg);
//                     }
//                 } else {
//                     console.error('Network response was not ok.');
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         };

//         fetchMenuData();
//     }, []);

//     return (
//         <div className="row g-3 grid-style-1">
//             {menuList.map((menu) => (
//                 <div key={menu.menu_id} className="col-6">
//                     <div className="card-item style-6">
//                         <div  className="dz-media">
//                             <img src={menu.image} alt="Menu Item"  style={{height:'150px'}}/>
//                         </div>
//                         <div className="dz-content">
//                             <span className="product-title">
//                                 {menu.category}
//                                 <i
//                                     className='bx bx-heart bx-sm'
//                                     style={{ marginLeft: '80px', fontSize: '20px', cursor: 'pointer' }}
//                                     onClick={() => handleLikeClick(13, menu.menu_id, 1)} // Customize with your parameters
//                                 ></i>
//                             </span>
//                             <h4 className="item-name">
//                                 <a href="product-detail.html">{menu.name}</a>
//                             </h4>
//                             <div className="offer-code">Spicy Level: {menu.spicy_index}</div>
//                             <div className="footer-wrapper">
//                                 <div className="price-wrapper">
//                                     <h6 className="current-price">₹{menu.price}</h6>
//                                     <span className="old-price">₹{menu.oldPrice}</span>
//                                 </div>
//                                 {/* <a href="product-detail.html" className="btn btn-xs btn-outline-primary">
//                                     ADD
//                                 </a> */}
//                                 <div onClick={handleAddToCartClick}  className="cart-btn btn-outline-primary">
//                   <i className="bx bx-cart bx-sm"></i>
//                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//             {/* <PeopleAlsoViewed /> */}
//         </div>
//     );
// };

// export default ProductCard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = () => {
  const [menuList, setMenuList] = useState([]);
  const navigate = useNavigate();

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const handleLikeClick = async (restaurantId, menuId, customerId) => {
    try {
      const response = await fetch(
        "http://194.195.116.199/user_api/save_favourite_menu",
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
        // Handle success response as needed
        console.log("Item added to favorites successfully");
        navigate("/Wishlist");
      } else {
        console.error("Failed to add item to favorites");
      }
    } catch (error) {
      console.error("Error adding item to favorites:", error);
    }
  };

  const handleAddToCartClick = (menu) => {
    const cartItem = {
      image: menu.image,
      name: menu.name,
      price: menu.price,
      oldPrice: menu.oldPrice,
      quantity: 1, // Default quantity is 1
    };

    // Simulate adding to local storage (replace with your logic)
    const updatedCartItems =
      JSON.parse(localStorage.getItem("cartItems")) || [];
    updatedCartItems.push(cartItem);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

    // Navigate to Cart screen
    navigate("/Cart");
  };

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(
          "http://194.195.116.199/user_api/get_menu_by_cat",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              restaurant_code: 611447,
              cat_id: 18,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.st === 1) {
            const formattedMenuList = data.menu_list.map((menu) => ({
              ...menu,
              image: menu.image,
              category: toTitleCase(menu.category),
              name: toTitleCase(menu.name),
              oldPrice: Math.floor(menu.price * 1.1),
            }));
            setMenuList(formattedMenuList);
          } else {
            console.error("API Error:", data.msg);
          }
        } else {
          console.error("Network response was not ok.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMenuData();
  }, []);

  return (
    <div className="row g-3 grid-style-1">
      {menuList.map((menu) => (
        <div key={menu.menu_id} className="col-6">
          <div className="card-item style-6">
            <div className="dz-media">
              <img
                src={menu.image}
                alt="Menu Item"
                style={{ height: "150px" }}
              />
            </div>
            <div className="dz-content">
              <span className="product-title">
                {menu.category}
              
               <i
                  className="bx bx-heart bx-sm"
                 style={{marginLeft:'77px'}}
                  onClick={() => handleLikeClick(13, menu.menu_id, 1)} // Customize with your parameters
                ></i>
                
              </span>
              <h4 className="item-name">
                <a href="product-detail.html">{menu.name}</a>
              </h4>
              <div className="offer-code">Spicy Level: {menu.spicy_index}</div>
              <div className="footer-wrapper">
                <div className="price-wrapper">
                  <h6 className="current-price">₹{menu.price}</h6>
                  <span className="old-price">₹{menu.oldPrice}</span>
                </div>
                <div
                  onClick={() => handleAddToCartClick(menu)}
                  className="cart-btn btn-outline-primary"
                >
                  <i
                    className="bx bx-cart bx-sm"
                   
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
