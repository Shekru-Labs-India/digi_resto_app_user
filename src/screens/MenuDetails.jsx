// import React, { useState, useEffect } from 'react';
// import { Link, useParams, useNavigate } from 'react-router-dom';
// import images from "../assets/MenuDefault.png";
// import heartIcon from '../assets/images/heart-regular-24 (1).png';
// import { useRestaurantId } from '../context/RestaurantIdContext';
// const MenuDetails = () => {
//   const [productDetails, setProductDetails] = useState(null);
//   const [isLiked, setIsLiked] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false); 
//   const [quantity, setQuantity] = useState(1);
//   const [showQuantityError, setShowQuantityError] = useState(false);
//   const navigate = useNavigate();
//   const [cartItemsCount, setCartItemsCount] = useState(0);
//   const [customer_id] = useState(1); // Set a default customer_id (for testing)
//   const { menuId } = useParams(); // Extract menu_id from URL parameters
//   const userData = JSON.parse(localStorage.getItem('userData'));
//   // Utility function to convert a string to title case
//   const { restaurantId } = useRestaurantId();
  
//   console.log("Restaurant ID:", restaurantId);
//   const toTitleCase = (str) => {
//     if (!str) {
//       return ''; // Handle undefined or null input gracefully
//     }
  
//     return str.replace(/\w\S*/g, function(txt) {
//       return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//     });
//   };
  

//   // Fetch product details based on menuId
//   const fetchProductDetails = async (menuId) => {
//     try {
//       const response = await fetch('https://menumitra.com/user_api/get_menu_details', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           restaurant_id:restaurantId,
//           menu_id: menuId
//         })
//       });

//       if (response.ok) {
//         const data = await response.json();
       
//         if (data.st === 1 && data.lists) {
//           const { name, veg_nonveg, spicy_index, price, description, image, is_favourite,menu_cat_name } = data.lists;
//           const oldPrice = Math.floor(price * 1.1);
//           setProductDetails({ name, veg_nonveg, spicy_index, price, oldPrice, description, image ,menu_cat_name});
//           setIsFavorite(is_favourite === 1); // Update favorite status based on API response
//         } else {
//           console.error('Invalid data format:', data);
//         }
//       } else {
//         console.error('Network response was not ok.');
//       }
//     } catch (error) {
//       console.error('Error fetching product details:', error);
//     }
//   };

//   useEffect(() => {
//     fetchProductDetails(menuId); // Fetch product details when component mounts or menuId changes
//   }, [menuId, restaurantId]);

//   useEffect(() => {
//     const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
//     setCartItemsCount(cartItems.length);
//   }, []);

//   const handleLikeClick = async (menuId) => {
//     setIsLiked(!isLiked);
//     try {
//       const response = await fetch('https://menumitra.com/user_api/save_favourite_menu', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           restaurant_id: 13,
//           menu_id: menuId,
//           customer_id: 1
//         })
//       });

//       if (response.ok) {
//         console.log(`Product (menu_id: ${menuId}) added to favorites successfully!`);
//         navigate('/Wishlist');
//         // Optionally, you can update local state or perform additional actions upon success
//       } else {
//         console.error('Failed to add product to favorites.');
//       }
//     } catch (error) {
//       console.error('Error adding product to favorites:', error);
//     }
//   };


//   const handleAddToCart = () => {
//     if (quantity === 0) {
//       setShowQuantityError(true);
//       return;
//     }
  
//     if (!productDetails) return;
  
//     if (isMenuItemInCart()) {
//       // Item is already in the cart, do not add it again
//       return;
//     }
  
//     const cartItem = { ...productDetails, quantity };
//     let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
//     cartItems.push(cartItem);
//     localStorage.setItem('cartItems', JSON.stringify(cartItems));
  
//     // Update cart item count immediately
//     setCartItemsCount(cartItems.length);
  
//     // Navigate to the cart page
//     navigate('/Cart');
//   };
  
  

//   const incrementQuantity = () => {
//     if (quantity < 20) {
//       setQuantity((prevQuantity) => prevQuantity + 1);
//       setShowQuantityError(false);
//     } else {
//       alert("Maximum limit reached for this item.");
//     }
//   };

//   const decrementQuantity = () => {
//     if (quantity > 0) {
//       setQuantity((prevQuantity) => prevQuantity - 1);
//       setShowQuantityError(false);
//     }
//   };

//   if (!productDetails) {
//     return <div>Loading...</div>;
//   }

//   const handleBack = () => {
//     navigate(-1);
//   };

//   // const isMenuItemInCart = () => {
//   //   const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
//   //   return cartItems.some((item) => item.menu_id === parseInt(menuId));
//   // };
//   const isMenuItemInCart = () => {
//     const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
//     return cartItems.some((item) => item.menu_id === parseInt(menuId));
//   };
  

//   // const shouldDisplayFooter = !isMenuItemInCart();
//   const shouldDisplayFooter = !isMenuItemInCart() && !isLiked;

//   return (
//     <div className="page-wrapper">
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <div className="back-btn dz-icon icon-fill icon-sm" onClick={handleBack}>
//               <i className='bx bx-arrow-back'></i>
//             </div>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">Product Details</h5>
//           </div>
//           <div className="right-content">
//             <Link to="/Cart" className="notification-badge dz-icon icon-sm icon-fill">
//               <i className='bx bx-cart bx-sm'></i>
//               {userData &&    <span className="badge badge-danger">{cartItemsCount}</span>}
//             </Link>
//           </div>
//         </div>
//       </header>

//       <main className="page-content p-b80">
//         {/* <div className="container"> */}
//           <div className="swiper product-detail-swiper">
//             <div className="product-detail-image img">
//               {/* <img
//                 className="product-detail-image"
//                 src={productDetails.image}
//                 alt={productDetails.name}
//               /> */}
//                {/* <img
//                   className="product-detail-image"
//                       src={productDetails.image}
//                       alt={productDetails.name}
                   
//                       onError={(e) => {
//                         e.target.src = images;
//                       }}
//                     /> */}
//                      <img
//                       className="product-detail-image"
//             src={productDetails.image || images} // Use default image if image is null
//             alt={productDetails.name}
            
//             onError={(e) => {
//               e.target.src = images; // Set local image source on error
//             }}
//           />
//             </div>
//             <div className="swiper-btn p-t15">
//               <div className="swiper-pagination style-1"></div>
//             </div>
//           </div>
//           <div className="container">
//           <div className="dz-product-detail">
//             {/* <div className="detail-content">
//               <h3 className="title">{toTitleCase(productDetails.name)} ({toTitleCase(productDetails.veg_nonveg)})
//                 <i className={`bx bx-heart ${isLiked ? 'text-red' : ''}`} onClick={() => handleLikeClick(menuId)}
//                  style={{ marginLeft: '210px', fontSize: '23px', cursor: 'pointer' ,position:'fixed'}}
//                 ></i>
//               </h3>
//             </div> */}

// <div className="detail-content" style={{ position: 'relative' }}>
// <h3 className="product-title">{productDetails.menu_cat_name}</h3>

//   <h3 className="title">
//     {toTitleCase(productDetails.name)} ({toTitleCase(productDetails.veg_nonveg)})
//   </h3>
//   {userData ? (
//   <i
//      className={`bx ${isFavorite ? 'bx bxs-heart' : 'bx-heart'} `}
//      onClick={() => handleLikeClick(menuId)}
//     style={{
//       position: 'absolute',
//       top: '0',
//       right: '0',
//       fontSize: '23px',
//       cursor: 'pointer',
//       color: isFavorite ? '#f10b0b' : 'inherit'
//     }}
//   ></i>
//   ):( <i
//     className= " bx bx-heart"
  
//     style={{
//       position: "absolute",
//       top: "0",
//       right: "0",
//       fontSize: "23px",
//       cursor: "pointer",
//     }}
//   ></i>)}
// </div>

//             <div className="item-wrapper">
//               <div className="dz-meta-items">
//                 <div className="dz-price m-r60">
//                   <h6 className="sub-title">Price:</h6>
//                   <span className="price">₹{productDetails.price}<del>₹{productDetails.oldPrice}</del></span>
//                 </div>
//               </div>
//               <div className="description">
//                 <h6 className="sub-title"></h6>
//                 <h6 className=" sub-title">{toTitleCase(productDetails.spicy_index)}</h6>
//               </div>
//               <div className="description">
//                 <h6 className="sub-title">Description:</h6>
//                 <p className="mb-0">{toTitleCase(productDetails.description)}</p>
              
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
     
  
    
   

//                 {shouldDisplayFooter && (
//         <div className="footer-fixed-btn bottom-0">
          
//           {showQuantityError && <p style={{ color: 'red', textAlign: 'center' }}>Please select a quantity.</p>}
//           <div className="d-flex align-items-center gap-2 justify-content-between">
//             <div className="dz-stepper1 input-group">
//               <div className="dz-stepper1" onClick={decrementQuantity}>
//                 <i className="bx bx-minus"></i>
//               </div>
//               <input
//                 className="form-control stepper-input1 text-center"
//                 type="text"
//                 value={quantity}
//                 readOnly
//               />
//               <div className="dz-stepper1" onClick={incrementQuantity}>
//                 <i className="bx bx-plus"></i>
//               </div>
//             </div>
//             <button onClick={handleAddToCart} className="btn btn-primary btn-lg btn-thin rounded-xl gap-3 w-100">
//             <i class='bx bx-cart-add bx-sm' ></i>Add to Cart
//             </button>
//           </div>
//         </div>
//       )}
      
//     </div>
//   );
// };

// export default MenuDetails;










































import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import { useRestaurantId } from "../context/RestaurantIdContext";
import 'remixicon/fonts/remixicon.css';

const MenuDetails = () => {
  const [productDetails, setProductDetails] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showQuantityError, setShowQuantityError] = useState(false);
  const navigate = useNavigate();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const { menuId } = useParams();
  const { restaurantId } = useRestaurantId();
  const [customerId, setCustomerId] = useState(null);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  // Fetch customer ID from localStorage on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setCustomerId(userData.customer_id);
    }
  }, []);

  // Convert string to Title Case
  const toTitleCase = (str) => {
    if (!str) return "";
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  // Fetch product details based on menuId
  const fetchProductDetails = async (menuId) => {
    try {
      const response = await fetch(
        "https://menumitra.com/user_api/get_menu_details",
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
        const data = await response.json();
        if (data.st === 1 && data.lists) {
          const {
            name,
            veg_nonveg,
            spicy_index,
            price,
            description,
            image,
            is_favourite,
            menu_cat_name,
          } = data.lists;
          const oldPrice = Math.floor(price * 1.1);
          setProductDetails({
            name,
            veg_nonveg,
            spicy_index,
            price,
            oldPrice,
            description,
            image,
            menu_cat_name,
            menu_id: menuId,
          });
          setIsFavorite(is_favourite === 1); // Update favorite status based on API response
        } else {
          console.error("Invalid data format:", data);
        }
      } else {
        console.error("Network response was not ok.");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    if (menuId && restaurantId && customerId !== null) {
      fetchProductDetails(menuId); // Fetch product details when component mounts or dependencies change
    }
  }, [menuId, restaurantId, customerId]);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItemsCount(cartItems.length);
  }, []);

  const handleLikeClick = async () => {
    if (!customerId || !restaurantId || !menuId) {
      console.error("Missing required IDs");
      return;
    }

    setIsFavoriteLoading(true);

    try {
      const apiUrl = isFavorite
        ? "https://menumitra.com/user_api/delete_favourite_menu"
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

      const data = await response.json();
      console.log("API Response:", data); // Log the response for debugging

      if (data.st === 1) {
        setIsFavorite(!isFavorite);
        console.log("Favorite status updated successfully");
      } else if (data.st === 2 && !isFavorite) {
        console.log("Menu already in wishlist");
        setIsFavorite(true);
      } else if (data.st === 2 && isFavorite) {
        console.log("Menu already removed from wishlist");
        setIsFavorite(false);
      } else {
        console.error("Failed to update favorite status:", data.msg);
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (quantity === 0) {
      setShowQuantityError(true);
      return;
    }

    if (!productDetails || isMenuItemInCart()) return;

    const cartItem = { ...productDetails, quantity };
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems.push(cartItem);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    setCartItemsCount(cartItems.length);

    navigate("/Cart");
  };

  const incrementQuantity = () => {
    if (quantity < 20) {
      setQuantity((prevQuantity) => prevQuantity + 1);
      setShowQuantityError(false);
    } else {
      alert("Maximum limit reached for this item.");
    }
  };

  const decrementQuantity = () => {
    if (quantity > 0) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      setShowQuantityError(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const isMenuItemInCart = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    return cartItems.some((item) => item.menu_id === parseInt(menuId));
  };

  const shouldDisplayFooter = !isMenuItemInCart();

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="page-wrapper">
        <header className="header header-fixed style-3">
          <div className="header-content">
            <div className="left-content">
              <div
                className="back-btn dz-icon icon-fill icon-sm"
                onClick={handleBack}
              >
                <i className="bx bx-arrow-back"></i>
              </div>
            </div>
            <div className="mid-content">
              <h5 className="title">Product Details</h5>
            </div>
            <div className="right-content">
              <Link
                to="/Cart"
                className="notification-badge dz-icon icon-sm icon-fill"
              >
                <i className="bx bx-cart bx-sm"></i>
                {cartItemsCount > 0 && (
                  <span className="badge badge-danger">{cartItemsCount}</span>
                )}
              </Link>
            </div>
          </div>
        </header>

        <main className="page-content p-b80">
          <div className="swiper product-detail-swiper">
            <div className="product-detail-image img">
              <img
                className="product-detail-image"
                src={productDetails.image || images} // Use default image if image is null
                alt={productDetails.name}
                onError={(e) => {
                  e.target.src = images;
                }}
              />
            </div>
            <div className="swiper-btn p-t15">
              <div className="swiper-pagination style-1"></div>
            </div>
          </div>
          <div className="container">
            <div className="dz-product-detail">
              <div className="detail-content" style={{ position: "relative" }}>
                {productDetails.menu_cat_name && (
                  <h3 className="product-title">
                    {/* {productDetails.menu_cat_name} */}
                  </h3>
                )}
                <h4 className="title">
                  {toTitleCase(productDetails.name)} (
                  {toTitleCase(productDetails.veg_nonveg)})
                  {/* ---quantity------- */}
                  <div
                    className="btn-group btn-quantity"
                    style={{ paddingLeft: "50px" }}
                  >
                    <button
                      className="btn btn-light btn-sm"
                      onClick={decrementQuantity}
                    >
                      <i className="ri-subtract-line"></i>
                    </button>
                    <span className="btn btn-light btn-sm">{quantity}</span>
                    <button
                      className="btn btn-light btn-sm"
                      onClick={incrementQuantity}
                    >
                      <i className="ri-add-line"></i>
                    </button>
                  </div>
                </h4>

                {/* like button  */}

                {/* {customerId && (
                <i
                  className={`bx ${
                    isFavorite ? "bxs-heart text-red" : "bx-heart"
                  } bx-sm`}
                  onClick={handleLikeClick}
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    fontSize: "23px",
                    cursor: "pointer",
                  }}
                >
                  {isFavoriteLoading && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                    />
                  )}
                </i>
              )} */}
              </div>
              <div className="rating-container">
                <i className="ri-star-half-line star" />
                <span className="rating-text">
                  4.9 <span className="rating-count">(570)</span>
                </span>
                <span className="separator">|</span>
                <span className="time">
                  <i className="ri-timer-line timer-icon" />
                  8-10 Min
                </span>
                <span className="separator">|</span>
              </div>

              <div className="product-meta">
                {/* <span>Spiciness Level:</span> */}
                {productDetails.spicy_index && (
                  <div className="spicy-index">
                    {Array.from({ length: 5 }).map((_, index) =>
                      index < productDetails.spicy_index ? (
                        <i
                          key={index}
                          className="ri-fire-fill"
                          style={{ fontSize: "20px", color: "#eb8e57" }}
                        ></i>
                      ) : (
                        <i
                          key={index}
                          className="ri-fire-line"
                          style={{ fontSize: "20px", color: "#eb8e57" }}
                        ></i>
                      )
                    )}
                  </div>
                )}
              </div>

              <div className="d-flex">
                <h4 className="price">{productDetails.price}</h4>
                <h4
                  className="price-old  ms-2"
                  style={{ textDecoration: "line-through", color: "#a5a5a5" }}
                >
                  {productDetails.oldPrice}
                </h4>
              </div>
              <div className="product-info">
                <h4 className="">Description</h4>
                <div className="desc">
                  <p>{productDetails.description}</p>
                </div>

                <div className="d-flex align-items-center justify-content-between py-4">
                  {/* <div className="btn-group btn-quantity">
                  <button
                    className="btn btn-light btn-sm"
                    onClick={decrementQuantity}
                  >
                    <i className="ri-subtract-line"></i>
                  </button>
                  <span className="btn btn-light btn-sm">{quantity}</span>
                  <button
                    className="btn btn-light btn-sm"
                    onClick={incrementQuantity}
                  >
                    <i className="ri-add-line"></i>
                  </button>
                </div> */}
                  {/* <button
                    className="btn btn-primary btn-sm"
                    onClick={handleAddToCart}
                  >
                    <i
                      class="ri-shopping-cart-line"
                      style={{ fontSize: "25px", paddingRight: "10px" }}
                    ></i>
                    Add To Cart
                  </button> */}
                </div>
                {showQuantityError && (
                  <div className="text-danger">Please add a quantity.</div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* {shouldDisplayFooter && (
        <footer className="footer fixed">
          <div className="container">
            <div className="d-flex align-items-center justify-content-between">
              <button className="btn btn-light">More Menu</button>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/Cart")}
              >
                Go to Cart
              </button>
            </div>
          </div>
        </footer>
      )} */}
      
      </div>
      
    </>
  );
};

export default MenuDetails;
