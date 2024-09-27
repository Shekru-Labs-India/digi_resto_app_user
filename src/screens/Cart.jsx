// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import SigninButton from "../constants/SigninButton";
// import Bottom from "../component/bottom";
// import "../assets/css/custom.css";

// const Cart = () => {
//   const [cartDetails, setCartDetails] = useState(null);
//   const navigate = useNavigate();
//   const [showPopup, setShowPopup] = useState(false);
//   const [itemToRemove, setItemToRemove] = useState(null);

//   // Retrieve Customer ID from localStorage
//   const getCustomerId = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     return userData ? userData.customer_id : null;
//   };

//   // Retrieve Restaurant ID from localStorage
//   const getRestaurantId = () => {
//     const restaurantId = localStorage.getItem("restaurantId");
//     return restaurantId ? parseInt(restaurantId, 10) : null;
//   };

//   // Retrieve Cart ID from localStorage or set a default
//   const getCartId = () => {
//     const cartId = localStorage.getItem("cartId");
//     return cartId ? parseInt(cartId, 10) : 1; // Default to 1 if not found
//   };

//   useEffect(() => {
//     const fetchCartDetails = async () => {
//       const customerId = getCustomerId();
//       const restaurantId = getRestaurantId();
//       const cartId = getCartId();

//       if (!customerId || !restaurantId) {
//         console.error("Customer ID or Restaurant ID is not available.");
//         return;
//       }

//       try {
//         const response = await fetch(
//           "https://menumitra.com/user_api/get_cart_detail",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               cart_id: cartId,
//               customer_id: customerId,
//               restaurant_id: restaurantId,
//             }),
//           }
//         );
//         const data = await response.json();
//         if (data.st === 1) {
//           setCartDetails(data);
//         } else if (data.st === 2) { // Check for empty cart
//           setCartDetails({ order_items: [] }); // Set empty order_items
//         } else {
//           console.error("Failed to fetch cart details:", data.msg);
//         }
//       } catch (error) {
//         console.error("Error fetching cart details:", error);
//       }
//     };

//     fetchCartDetails();
//   }, []);

//   const handleRemoveClick = (index, item) => {
//     setItemToRemove({ index, item });
//     setShowPopup(true);
//   };

//   const decrementQuantity = (index) => {
//     // Add functionality to decrement quantity
//   };

//   const incrementQuantity = (index) => {
//     // Add functionality to increment quantity
//   };

//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const handleBack = () => {
//     navigate(-1); // Navigate back to the previous screen
//   };

//   const displayCartItems = cartDetails ? cartDetails.order_items : [];

//   const calculateSubtotal = () => {
//     return displayCartItems.reduce((total, item) => {
//       return total + item.price * item.quantity;
//     }, 0);
//   };

//   return (
//     <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
//       {/* Header */}
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link to="/" className="back-btn dz-icon icon-fill icon-sm">
//               <i className="ri-arrow-left-line fs-3"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">
//               My Cart{" "}
//               {userData && (
//                 <span className="items-badge">{displayCartItems.length}</span>
//               )}
//             </h5>
//           </div>
//           <div className="right-content">
//             <Link to="/Search" className="dz-icon icon-fill icon-sm">
//               <i className="ri-search-line"></i>
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Cart Items */}
//       {displayCartItems.length === 0 ? (
//         <main className="page-content space-top p-b100">
//           <div className="container overflow-hidden">
//             <div className="m-b20 dz-flex-box">
//               <div className="dz-cart-about text-center">
//                 <h5 className="title">Your Cart is Empty</h5>
//                 <p>Add items to your cart from the product details page.</p>
//                 <Link to="/Category" className="btn btn-outline-primary btn-sm">
//                   Return to Shop
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </main>
//       ) : (
//         <main
//           className="page-content space-top p-b200"
//           style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
//         >
//           {userData ? (
//             <div className="container">
//               {/* RESTAURANT NAME */}
//               <div className="left-content gap-1 ps-2 py-2">
//                 <h3 className="title fw-medium">
//                   <i
//                     className="ri-store-2-line"
//                     style={{ paddingRight: "10px" }}
//                   ></i>
//                   {cartDetails.restaurant_name || "Restaurant Name"}
//                 </h3>
//               </div>
//               {/* RESTAURANT NAME */}

//               {displayCartItems.map((item, index) => (
//                 <div
//                   key={index}
//                   className="card mb-3"
//                   style={{
//                     borderRadius: "15px",
//                     boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                   }}
//                 >
//                   <div className="row g-0">
//                     {/* Image Column */}
//                     <div className="col-3">
//                       <Link to={`/ProductDetails/${item.menu_id}`}>
//                         <img
//                           src={item.image || images}
//                           alt={item.menu_name}
//                           style={{
//                             height: "110px",
//                             width: "110px",
//                             objectFit: "cover",
//                             borderRadius: "10px",
//                           }}
//                           onError={(e) => {
//                             e.target.src = images;
//                           }}
//                         />
//                       </Link>
//                     </div>

//                     {/* Content Column */}
//                     <div className="col-9">
//                       {/* Name Row */}
//                       <div className="row">
//                         <div className="col-10 mt-2">
//                           <h5 className="title fs-3">{item.menu_name}</h5>
//                         </div>
//                         <div className="col-2">
//                           {/* Delete Button */}
//                           <div onClick={() => handleRemoveClick(index, item)}>
//                             <i className="ri-close-line fs-3"></i>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="row">
//                         <div
//                           className="col-4 fs-4"
//                           style={{ color: "#0d775e" }}
//                         >
//                           <i className="ri-restaurant-line me-2"></i>
//                           {item.menu_cat_name}
//                         </div>
//                         <div className="col-4 fs-4">
//                           {/* Offer icons can be customized based on offer data */}
//                         </div>
//                         <div className="col-4 fs-4">
//                           <span className="d-flex text-end fw-semibold">
//                             <i
//                               className="ri-star-half-line px-1"
//                               style={{ color: "#fda200" }}
//                             ></i>{" "}
//                             4.9
//                           </span>
//                         </div>
//                       </div>

//                       {/* Price Row */}
//                       <div className="row mt-1">
//                         <div className="col-4">
//                           <p className="mb-2 fs-2 fw-semibold">
//                             <span style={{ color: "#4E74FC" }}>
//                               ₹{item.price}
//                             </span>
//                             <del
//                               style={{
//                                 fontSize: "14px",
//                                 color: "#a5a5a5",
//                                 marginLeft: "5px",
//                               }}
//                             >
//                               ₹{item.oldPrice || item.price}
//                             </del>
//                           </p>
//                         </div>
//                         <div className="col-4">
//                           <div
//                             className="fw-medium d-flex fs-5 mt-2 fw-semibold"
//                             style={{ color: "#438a3c" }}
//                           >
//                             {item.offer || "No Offer"}
//                           </div>
//                         </div>

//                         {/* Quantity Selector and Delete Button Row */}
//                         <div className="col-4">
//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "space-between",
//                               alignItems: "center",
//                               marginTop: "10px",
//                             }}
//                           >
//                             {/* Quantity Controls */}
//                             <div
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 border: "1px solid #e0e0e0",
//                                 borderRadius: "20px",
//                               }}
//                             >
//                               <button
//                                 onClick={() => decrementQuantity(index)}
//                                 style={{
//                                   border: "none",
//                                   background: "none",
//                                   fontSize: "20px",
//                                   color: "#0d775e",
//                                   padding: "5px 10px",
//                                 }}
//                               >
//                                 -
//                               </button>
//                               <input
//                                 type="number"
//                                 value={item.quantity}
//                                 style={{
//                                   border: "none",
//                                   textAlign: "center",
//                                   width: "50px",
//                                   fontSize: "16px",
//                                   color: "#0d775e",
//                                   outline: "none",
//                                 }}
//                                 readOnly
//                               />
//                               <button
//                                 onClick={() => incrementQuantity(index)}
//                                 style={{
//                                   border: "none",
//                                   background: "none",
//                                   fontSize: "20px",
//                                   color: "#0d775e",
//                                   padding: "5px 10px",
//                                 }}
//                               >
//                                 +
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <SigninButton />
//           )}
//         </main>
//       )}

//       {/* Footer Fixed Button */}
//       {userData && (
//         <div
//           className="container footer-fixed-bottom mb-5 pb-5 z-3"
//           style={{ backgroundColor: "transparent" }}
//         >
//           <div className="card-body mt-2" style={{ padding: "0px" }}>
//             <div className="card">
//               <div className="row px-1">
//                 <div className="col-12">
//                   <div className="d-flex justify-content-between align-items-center py-1">
//                     <span className="ps-2 fs-4" style={{ color: "#a5a5a5" }}>
//                       Subtotal
//                     </span>
//                     <span className="pe-2 fs-4">₹{calculateSubtotal()}</span>
//                   </div>
//                 </div>
//                 <div className="col-12 mb-2">
//                   <div className="d-flex justify-content-between align-items-center py-1">
//                     <span className="ps-2 fs-4" style={{ color: "#a5a5a5" }}>
//                       Discount
//                     </span>
//                     <span className="pe-2 fs-4">10%</span>
//                   </div>
//                 </div>
//                 <div className="col-12 mb-2">
//                   <div className="d-flex justify-content-between align-items-center py-1">
//                     <span className="ps-2 fs-4" style={{ color: "#a5a5a5" }}>
//                       Tax
//                     </span>
//                     <span className="pe-2 fs-4">₹200</span>
//                   </div>
//                 </div>
//                 <div>
//                   <hr className="dashed" />
//                 </div>
//                 <div className="col-12">
//                   <div className="d-flex justify-content-between align-items-center py-1 fw-medium mb-2">
//                     <span className="ps-2 fs-4 fw-medium">Grand Total</span>
//                     <span className="pe-2 fs-4 fw-medium">
//                       ₹{calculateSubtotal() - calculateSubtotal() * 0.1 + 200}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="container d-flex align-items-center justify-content-center">
//             {displayCartItems.length > 0 && (
//               <Link
//                 to="/Checkout"
//                 state={{ cartItems: displayCartItems }}
//                 className="btn btn-lg btn-thin rounded-xl btn-primary px-5"
//               >
//                 Proceed to Buy &nbsp; <b> ({displayCartItems.length} items)</b>
//               </Link>
//             )}
//           </div>
//         </div>
//       )}
//       <Bottom />
//     </div>
//   );
// };

// export default Cart;

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import SigninButton from "../constants/SigninButton";
// import Bottom from "../component/bottom";
// import "../assets/css/custom.css";

// const Cart = () => {
//   const [cartDetails, setCartDetails] = useState(null);
//   const navigate = useNavigate();
//   const [showPopup, setShowPopup] = useState(false);
//   const [itemToRemove, setItemToRemove] = useState(null);

//   // Retrieve Customer ID from localStorage
//   const getCustomerId = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     return userData ? userData.customer_id : null;
//   };

//   // Retrieve Restaurant ID from localStorage
//   const getRestaurantId = () => {
//     const restaurantId = localStorage.getItem("restaurantId");
//     return restaurantId ? parseInt(restaurantId, 10) : null;
//   };

//   // Retrieve Cart ID from localStorage or set a default
//   const getCartId = () => {
//     const cartId = localStorage.getItem("cartId");
//     return cartId ? parseInt(cartId, 10) : 1; // Default to 1 if not found
//   };

//   useEffect(() => {
//     const fetchCartDetails = async () => {
//       const customerId = getCustomerId();
//       const restaurantId = getRestaurantId();
//       const cartId = getCartId();

//       if (!customerId || !restaurantId) {
//         console.error("Customer ID or Restaurant ID is not available.");
//         return;
//       }

//       try {
//         const response = await fetch(
//           "https://menumitra.com/user_api/get_cart_detail",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               cart_id: cartId,
//               customer_id: customerId,
//               restaurant_id: restaurantId,
//             }),
//           }
//         );
//         const data = await response.json();
//         if (data.st === 1) {
//           setCartDetails(data);
//         } else {
//           console.error("Failed to fetch cart details:", data.msg);
//         }
//       } catch (error) {
//         console.error("Error fetching cart details:", error);
//       }
//     };

//     fetchCartDetails();
//   }, []);

//   const handleRemoveClick = (index, item) => {
//     setItemToRemove({ index, item });
//     setShowPopup(true);
//   };

//   const decrementQuantity = (index) => {
//     // Add functionality to decrement quantity
//   };

//   const incrementQuantity = (index) => {
//     // Add functionality to increment quantity
//   };

//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const handleBack = () => {
//     navigate(-1); // Navigate back to the previous screen
//   };

//   const displayCartItems = cartDetails ? cartDetails.order_items : [];

//   return (
//     <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
//       {/* Header */}
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link to="/" className="back-btn dz-icon icon-fill icon-sm">
//               <i className="ri-arrow-left-line fs-3"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">
//               My Cart{" "}
//               {userData && (
//                 <span className="items-badge">{displayCartItems.length}</span>
//               )}
//             </h5>
//           </div>
//           <div className="right-content">
//             <Link to="/Search" className="dz-icon icon-fill icon-sm">
//               <i className="ri-search-line"></i>
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Cart Items */}
//       {displayCartItems.length === 0 ? (
//         <main className="page-content space-top p-b100">
//           <div className="container overflow-hidden">
//             <div className="m-b20 dz-flex-box">
//               <div className="dz-cart-about text-center">
//                 <h5 className="title">Your Cart is Empty</h5>
//                 <p>Add items to your cart from the product details page.</p>
//                 <Link to="/Category" className="btn btn-outline-primary btn-sm">
//                   Return to Shop
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </main>
//       ) : (
//         <main
//           className="page-content space-top p-b200"
//           style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
//         >
//           {userData ? (
//             <div className="container">
//               {/* RESTAURANT NAME */}
//               <div className="left-content gap-1 ps-2 py-2">
//                 <h3 className="title fw-medium">
//                   <i
//                     className="ri-store-2-line"
//                     style={{ paddingRight: "10px" }}
//                   ></i>
//                   {cartDetails.restaurant_name || "Restaurant Name"}
//                 </h3>
//               </div>
//               {/* RESTAURANT NAME */}

//               {displayCartItems.map((item, index) => (
//                 <div
//                   key={index}
//                   className="card mb-3"
//                   style={{
//                     borderRadius: "15px",
//                     boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                   }}
//                 >
//                   <div className="row g-0">
//                     {/* Image Column */}
//                     <div className="col-3">
//                       <Link to={`/ProductDetails/${item.menu_id}`}>
//                         <img
//                           src={item.image || images}
//                           alt={item.menu_name}
//                           style={{
//                             height: "110px",
//                             width: "110px",
//                             objectFit: "cover",
//                             borderRadius: "10px",
//                           }}
//                           onError={(e) => {
//                             e.target.src = images;
//                           }}
//                         />
//                       </Link>
//                     </div>

//                     {/* Content Column */}
//                     <div className="col-9">
//                       {/* Name Row */}
//                       <div className="row">
//                         <div className="col-10 mt-2">
//                           <h5 className="title fs-3">{item.menu_name}</h5>
//                         </div>
//                         <div className="col-2">
//                           {/* Delete Button */}
//                           <div onClick={() => handleRemoveClick(index, item)}>
//                             <i className="ri-close-line fs-3"></i>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="row">
//                         <div
//                           className="col-4 fs-4"
//                           style={{ color: "#0d775e" }}
//                         >
//                           <i className="ri-restaurant-line me-2"></i>
//                           {item.menu_cat_name}
//                         </div>
//                         <div className="col-4 fs-4">
//                           <div className="offer-code mt-2">
//                             {Array.from({ length: 5 }).map((_, index) =>
//                               index < item.spicy_index ? (
//                                 <i
//                                   className="ri-fire-fill fs-6"
//                                   style={{ fontSize: "12px", color: "#fe0809" }} // Filled icon color
//                                   key={index}
//                                 ></i>
//                               ) : (
//                                 <i
//                                   className="ri-fire-line fs-6"
//                                   style={{ fontSize: "12px", color: "#bbbaba" }} // Unfilled icon color
//                                   key={index}
//                                 ></i>
//                               )
//                             )}
//                           </div>
//                         </div>

//                         <div className="col-4 fs-4 text-end">
//                           <span className="fw-semibold">
//                             <i
//                               className="ri-star-fill px-1"
//                               style={{ color: "#fda200" }}
//                             ></i>{" "}
//                             4.9
//                           </span>
//                         </div>
//                       </div>

//                       {/* Price Row */}
//                       <div className="row mt-1">
//                         <div className="col-4">
//                           <p className="mb-2 fs-2 fw-semibold">
//                             <span style={{ color: "#4E74FC" }}>
//                               ₹{item.price}
//                             </span>
//                             <del
//                               style={{
//                                 fontSize: "14px",
//                                 color: "#a5a5a5",
//                                 marginLeft: "5px",
//                               }}
//                             >
//                               ₹{item.oldPrice || item.price}
//                             </del>
//                           </p>
//                         </div>
//                         <div className="col-4 text-center">
//                           <span
//                             className="d-flex fs-6 fw-semibold"
//                             style={{ color: "#438a3c" }}
//                           >
//                             {item.offer || "No Offer"}
//                           </span>
//                         </div>

//                         {/* Quantity Selector and Delete Button Row */}
//                         <div className="col-4 text-end">
//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "space-between",
//                               alignItems: "center",
//                               marginTop: "10px",
//                             }}
//                           >
//                             {/* Quantity Controls */}
//                             <div
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 border: "1px solid #e0e0e0",
//                                 borderRadius: "20px",
//                               }}
//                             >
//                               <button
//                                 onClick={() => decrementQuantity(index)}
//                                 style={{
//                                   border: "none",
//                                   background: "none",
//                                   fontSize: "20px",
//                                   color: "#0d775e",
//                                   padding: "5px 10px",
//                                 }}
//                               >
//                                 -
//                               </button>
//                               <input
//                                 type="number"
//                                 value={item.quantity}
//                                 style={{
//                                   border: "none",
//                                   textAlign: "center",
//                                   width: "50px",
//                                   fontSize: "16px",
//                                   color: "#0d775e",
//                                   outline: "none",
//                                 }}
//                                 readOnly
//                               />
//                               <button
//                                 onClick={() => incrementQuantity(index)}
//                                 style={{
//                                   border: "none",
//                                   background: "none",
//                                   fontSize: "20px",
//                                   color: "#0d775e",
//                                   padding: "5px 10px",
//                                 }}
//                               >
//                                 +
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <SigninButton />
//           )}
//         </main>
//       )}

//       {/* Footer Fixed Button */}
//       {userData && (
//         <div
//           className="container footer-fixed-bottom mb-5 pb-5 z-3"
//           style={{ backgroundColor: "transparent" }}
//         >
//           <div className="card-body mt-2" style={{ padding: "0px" }}>
//             <div className="card">
//               <div className="row px-1">
//                 <div className="col-12">
//                   <div className="d-flex justify-content-between align-items-center py-1">
//                     <span className="ps-2 fs-4" style={{ color: "#a5a5a5" }}>
//                       Subtotal
//                     </span>
//                     <span className="pe-2 fs-4">
//                       ₹{cartDetails?.sub_total || 0}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="col-12 mb-2">
//                   <div className="d-flex justify-content-between align-items-center py-1">
//                     <span className="ps-2 fs-4" style={{ color: "#a5a5a5" }}>
//                       Discount
//                     </span>
//                     <span className="pe-2 fs-4">
//                       ₹{cartDetails?.discount || 0}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="col-12 mb-2">
//                   <div className="d-flex justify-content-between align-items-center py-1">
//                     <span className="ps-2 fs-4" style={{ color: "#a5a5a5" }}>
//                       Tax
//                     </span>
//                     <span className="pe-2 fs-4">₹{cartDetails?.tax || 0}</span>
//                   </div>
//                 </div>
//                 <div>
//                   <hr className="dashed" />
//                 </div>
//                 <div className="col-12">
//                   <div className="d-flex justify-content-between align-items-center py-1 fw-medium mb-2">
//                     <span className="ps-2 fs-4 fw-medium">Grand Total</span>
//                     <span className="pe-2 fs-4 fw-medium">
//                       ₹{cartDetails?.grand_total || 0}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="container d-flex align-items-center justify-content-center">
//             {displayCartItems.length > 0 && (
//               <Link
//                 to="/Checkout"
//                 state={{ cartItems: displayCartItems }}
//                 className="btn btn-lg btn-thin rounded-xl btn-primary px-5"
//               >
//                 Proceed to Buy &nbsp; <b> ({displayCartItems.length} items)</b>
//               </Link>
//             )}
//           </div>
//         </div>
//       )}
//       <Bottom />
//     </div>
//   );
// };

// export default Cart;

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import SigninButton from "../constants/SigninButton";
// import Bottom from "../component/bottom";
// import "../assets/css/custom.css";

// const Cart = () => {
//   const [cartDetails, setCartDetails] = useState(null);
//   const navigate = useNavigate();
//   const [itemToRemove, setItemToRemove] = useState(null);

//   // Retrieve Customer ID from localStorage
//   const getCustomerId = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     return userData ? userData.customer_id : null;
//   };

//   // Retrieve Restaurant ID from localStorage
//   const getRestaurantId = () => {
//     const restaurantId = localStorage.getItem("restaurantId");
//     return restaurantId ? parseInt(restaurantId, 10) : null;
//   };

//   // Retrieve Cart ID from localStorage or set a default
//   const getCartId = () => {
//     const cartId = localStorage.getItem("cartId");
//     return cartId ? parseInt(cartId, 10) : 1; // Default to 1 if not found
//   };

//   useEffect(() => {
//     fetchCartDetails();
//   }, []);

//   const fetchCartDetails = async () => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     if (!customerId || !restaurantId) {
//       console.error("Customer ID or Restaurant ID is not available.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_cart_detail_add_to_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data.st === 1) {
//         setCartDetails(data);
//       } else {
//         console.error("Failed to fetch cart details:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error fetching cart details:", error);
//     }
//   };

//   const removeFromCart = async (item) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();
//     const menuId = item.menu_id; // Get the menu ID from the item to be removed

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/remove_from_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data.st === 1) {
//         console.log("Item removed from cart successfully.");
//         // Fetch the updated cart details
//         fetchCartDetails();
//       } else {
//         console.error("Failed to remove item from cart:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error removing item from cart:", error);
//     }
//   };

//   const handleRemoveClick = (item) => {
//     removeFromCart(item);
//   };

//   const decrementQuantity = (index) => {
//     // Add functionality to decrement quantity
//   };

//   const incrementQuantity = (index) => {
//     // Add functionality to increment quantity
//   };

//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const handleBack = () => {
//     navigate(-1); // Navigate back to the previous screen
//   };

//   const displayCartItems = cartDetails ? cartDetails.order_items : [];

//   return (
//     <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
//       {/* Header */}
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link to="/" className="back-btn dz-icon icon-fill icon-sm">
//               <i className="ri-arrow-left-line fs-3"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">
//               My Cart{" "}
//               {userData && (
//                 <span className="items-badge">{displayCartItems.length}</span>
//               )}
//             </h5>
//           </div>
//           <div className="right-content">
//             <Link to="/Search" className="dz-icon icon-fill icon-sm">
//               <i className="ri-search-line"></i>
//             </Link>
//           </div>
//         </div>
//       </header>
//       {/* Cart Items */}
//       {displayCartItems.length === 0 ? (
//         <main className="page-content space-top p-b100">
//           <div className="container overflow-hidden">
//             <div className="m-b20 dz-flex-box">
//               <div className="dz-cart-about text-center">
//                 <h5 className="title">Your Cart is Empty</h5>
//                 <p>Add items to your cart from the product details page.</p>
//                 <Link to="/Category" className="btn btn-outline-primary btn-sm">
//                   Return to Shop
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </main>
//       ) : (
//         <main
//           className="page-content space-top p-b200"
//           style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
//         >
//           {userData ? (
//             <div className="container">
//               {/* RESTAURANT NAME */}
//               <div className="left-content gap-1 ps-2 py-2">
//                 <h3 className="title fw-medium">
//                   <i
//                     className="ri-store-2-line"
//                     style={{ paddingRight: "10px" }}
//                   ></i>
//                   {cartDetails.restaurant_name || "Restaurant Name"}
//                 </h3>
//               </div>
//               {/* RESTAURANT NAME */}

//               {displayCartItems.map((item, index) => (
//                 <div
//                   key={index}
//                   className="card mb-3"
//                   style={{
//                     borderRadius: "15px",
//                     boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                   }}
//                 >
//                   <div className="row g-0">
//                     {/* Image Column */}
//                     <div className="col-3">
//                       <Link to={`/ProductDetails/${item.menu_id}`}>
//                         <img
//                           src={item.image || images}
//                           alt={item.menu_name}
//                           style={{
//                             height: "110px",
//                             width: "110px",
//                             objectFit: "cover",
//                             borderRadius: "10px",
//                           }}
//                           onError={(e) => {
//                             e.target.src = images;
//                           }}
//                         />
//                       </Link>
//                     </div>

//                     {/* Content Column */}
//                     <div className="col-9">
//                       {/* Name Row */}
//                       <div className="row">
//                         <div className="col-10 mt-2">
//                           <h5 className="title fs-3">{item.menu_name}</h5>
//                         </div>
//                         <div className="col-2">
//                           {/* Delete Button */}
//                           <div onClick={() => handleRemoveClick(item)}>
//                             <i className="ri-close-line fs-3"></i>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="row">
//                         <div
//                           className="col-4 fs-6"
//                           style={{ color: "#0d775e" }}
//                         >
//                           <i className="ri-restaurant-line me-2"></i>
//                           {item.menu_cat_name}
//                         </div>
//                         <div className="col-4 fs-4">
//                           <div className="offer-code mt-2">
//                             {Array.from({ length: 5 }).map((_, index) =>
//                               index < item.spicy_index ? (
//                                 <i
//                                   className="ri-fire-fill fs-6"
//                                   style={{ fontSize: "12px", color: "#eb8e57" }}
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

//                         <div className="col-4 fs-4 text-end">
//                           <span className="fw-semibold">
//                             <i
//                               className="ri-star-fill px-1"
//                               style={{ color: "#fda200" }}
//                             ></i>{" "}
//                             4.9
//                           </span>
//                         </div>
//                       </div>

//                       {/* Price Row */}
//                       <div className="row mt-1">
//                         <div className="col-4">
//                           <p className="mb-2 fs-2 fw-semibold">
//                             <span style={{ color: "#4E74FC" }}>
//                               ₹{item.price}
//                             </span>
//                             <del
//                               style={{
//                                 fontSize: "14px",
//                                 color: "#a5a5a5",
//                                 marginLeft: "5px",
//                               }}
//                             >
//                               ₹{item.oldPrice || item.price}
//                             </del>
//                           </p>
//                         </div>
//                         <div className="col-4 text-center">
//                           <span
//                             className="d-flex fs-6 fw-semibold"
//                             style={{ color: "#438a3c" }}
//                           >
//                             {item.offer || "No Offer"}
//                           </span>
//                         </div>

//                         {/* Quantity Selector and Delete Button Row */}
//                         <div className="col-4 text-end">
//                           <div className="d-flex justify-content-end align-items-center">
//                             {/* Decrement Button */}
//                             <i
//                               className="ri-subtract-line mx-3"
//                               style={{
//                                 fontSize: "20px",
//                                 color: "#0d775e",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => decrementQuantity(index)}
//                             ></i>

//                             {/* Quantity Display */}
//                             <span className="fs-4" style={{ color: "#0d775e" }}>
//                               {item.quantity}
//                             </span>

//                             {/* Increment Button */}
//                             <i
//                               className="ri-add-line mx-3"
//                               style={{
//                                 fontSize: "20px",
//                                 color: "#0d775e",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => incrementQuantity(index)}
//                             ></i>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <SigninButton />
//           )}
//         </main>
//       )}
//       {/* Footer Fixed Button */}
//       {userData &&
//         displayCartItems.length > 0 && ( // Only render if user is logged in and cart is not empty
//           <div
//             className="container footer-fixed-bottom mb-5 pb-5 z-3"
//             style={{ backgroundColor: "transparent" }}
//           >
//             <div className="card-body mt-2" style={{ padding: "0px" }}>
//               <div className="card">
//                 <div className="row px-1">
//                   <div className="col-12">
//                     <div className="d-flex justify-content-between align-items-center py-1">
//                       <span className="ps-2 fs-4" style={{ color: "#a5a5a5" }}>
//                         Subtotal
//                       </span>
//                       <span className="pe-2 fs-4">
//                         ₹{cartDetails?.sub_total || 0}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="col-12 mb-2">
//                     <div className="d-flex justify-content-between align-items-center py-1">
//                       <span className="ps-2 fs-4" style={{ color: "#a5a5a5" }}>
//                         Discount
//                       </span>
//                       <span className="pe-2 fs-4">
//                         ₹{cartDetails?.discount || 0}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="col-12 mb-2">
//                     <div className="d-flex justify-content-between align-items-center py-1">
//                       <span className="ps-2 fs-4" style={{ color: "#a5a5a5" }}>
//                         Tax
//                       </span>
//                       <span className="pe-2 fs-4">
//                         ₹{cartDetails?.tax || 0}
//                       </span>
//                     </div>
//                   </div>
//                   <div>
//                     <hr className="dashed" />
//                   </div>
//                   <div className="col-12">
//                     <div className="d-flex justify-content-between align-items-center py-1 fw-medium mb-2">
//                       <span className="ps-2 fs-4 fw-medium">Grand Total</span>
//                       <span className="pe-2 fs-4 fw-medium">
//                         ₹{cartDetails?.grand_total || 0}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="container d-flex align-items-center justify-content-center">
//               {displayCartItems.length > 0 && (
//                 <Link
//                   to="/Checkout"
//                   state={{ cartItems: displayCartItems }}
//                   className="btn btn-lg btn-thin rounded-xl btn-primary px-5"
//                 >
//                   Proceed to Buy &nbsp;{" "}
//                   <b> ({displayCartItems.length} items)</b>
//                 </Link>
//               )}
//             </div>
//           </div>
//         )}
//       <Bottom />
//     </div>
//   );
// };

// export default Cart;

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import SigninButton from "../constants/SigninButton";
// import Bottom from "../component/bottom";
// import "../assets/css/custom.css";

// const Cart = () => {
//   const [cartDetails, setCartDetails] = useState(null);
//   const navigate = useNavigate();

// const getCustomerId = () => {
//   const userData = JSON.parse(localStorage.getItem("userData"));
//   if (!userData || !userData.customer_id) {
//     console.error("Customer ID is not available.");
//     return null;
//   }
//   return userData.customer_id;
// };

// const getRestaurantId = () => {
//   const restaurantId = localStorage.getItem("restaurantId");
//   if (!restaurantId) {
//     console.error("Restaurant ID is not available.");
//     return null;
//   }
//   return parseInt(restaurantId, 10);
// };

//   // Retrieve Cart ID from localStorage
//   const getCartId = () => {
//     const cartId = localStorage.getItem("cartId");
//     return cartId ? parseInt(cartId, 10) : 1; // Default to 1 if not found
//   };

// useEffect(() => {
//   const customerId = getCustomerId();
//   const restaurantId = getRestaurantId();

//   console.log("Customer ID:", customerId);
//   console.log("Restaurant ID:", restaurantId);

//   if (customerId && restaurantId) {
//     fetchCartDetails();
//   } else {
//     console.error("Customer ID or Restaurant ID is missing.");
//   }
// }, []);

//   // Fetch cart details from API
//   const fetchCartDetails = async () => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     if (!customerId || !restaurantId) {
//       console.error("Customer ID or Restaurant ID is not available.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_cart_detail_add_to_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data.st === 1) {
//         setCartDetails(data);
//         localStorage.setItem("cartItems", JSON.stringify(data.order_items));
//       } else {
//         console.error("Failed to fetch cart details:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error fetching cart details:", error);
//     }
//   };

//   // Update cart item quantity in API
//   const updateCartItemQuantity = async (item, newQuantity) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/update_cart_quantity",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: item.menu_id,
//             quantity: newQuantity,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.st === 1) {
//         fetchCartDetails(); // Re-fetch the cart details to update the state
//       } else {
//         console.error("Failed to update item quantity:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error updating item quantity:", error);
//     }
//   };

//   const incrementQuantity = (item) => {
//     updateCartItemQuantity(item, item.quantity + 1);
//   };

//   const decrementQuantity = (item) => {
//     if (item.quantity > 1) {
//       updateCartItemQuantity(item, item.quantity - 1);
//     }
//   };

//   // Remove item from cart
//   const removeFromCart = async (item) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();
//     const menuId = item.menu_id;

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/remove_from_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data.st === 1) {
//         fetchCartDetails(); // Re-fetch the cart details to update the state
//       } else {
//         console.error("Failed to remove item from cart:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error removing item from cart:", error);
//     }
//   };

//   const handleRemoveClick = (item) => {
//     removeFromCart(item);
//   };

//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const displayCartItems = cartDetails ? cartDetails.order_items : [];

//   return (
//     <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
//       {/* Header */}
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link to="/" className="back-btn dz-icon icon-fill icon-sm">
//               <i className="ri-arrow-left-line fs-3"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">
//               My Cart{" "}
//               {userData && (
//                 <span className="items-badge">{displayCartItems.length}</span>
//               )}
//             </h5>
//           </div>
//           <div className="right-content">
//             <Link to="/Search" className="dz-icon icon-fill icon-sm">
//               <i className="ri-search-line"></i>
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Cart Items */}
//       {displayCartItems.length === 0 ? (
//         <main className="page-content space-top p-b100">
//           <div className="container overflow-hidden">
//             <div className="m-b20 dz-flex-box">
//               <div className="dz-cart-about text-center">
//                 <h5 className="title">Your Cart is Empty</h5>
//                 <p>Add items to your cart from the product details page.</p>
//                 <Link to="/Category" className="btn btn-outline-primary btn-sm">
//                   Return to Shop
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </main>
//       ) : (
//         <main
//           className="page-content space-top p-b200"
//           style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
//         >
//           {userData ? (
//             <div className="container">
//               {/* RESTAURANT NAME */}
//               <div className="left-content gap-1 ps-2 py-2">
//                 <h3 className="title fw-medium">
//                   <i
//                     className="ri-store-2-line"
//                     style={{ paddingRight: "10px" }}
//                   ></i>
//                   {cartDetails.restaurant_name || "Restaurant Name"}
//                 </h3>
//               </div>

//               {displayCartItems.map((item, index) => (
//                 <div
//                   key={index}
//                   className="card mb-3"
//                   style={{
//                     borderRadius: "15px",
//                     boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                   }}
//                 >
//                   <div className="row g-0">
//                     <div className="col-3">
//                       <Link to={`/ProductDetails/${item.menu_id}`}>
//                         <img
//                           src={item.image || images}
//                           alt={item.menu_name}
//                           style={{
//                             height: "110px",
//                             width: "110px",
//                             objectFit: "cover",
//                             borderRadius: "10px",
//                           }}
//                           onError={(e) => {
//                             e.target.src = images;
//                           }}
//                         />
//                       </Link>
//                     </div>

//                     <div className="col-9">
//                       <div className="row">
//                         <div className="col-10 mt-2">
//                           <h5 className="title fs-3">{item.menu_name}</h5>
//                         </div>
//                         <div className="col-2">
//                           <div onClick={() => handleRemoveClick(item)}>
//                             <i className="ri-close-line fs-3"></i>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="row">
//                         <div
//                           className="col-4 fs-6"
//                           style={{ color: "#0d775e" }}
//                         >
//                           <i className="ri-restaurant-line me-2"></i>
//                           {item.menu_cat_name}
//                         </div>

//                         <div className="col-4 fs-4 text-end">
//                           <span className="fw-semibold">
//                             <i
//                               className="ri-star-fill px-1"
//                               style={{ color: "#fda200" }}
//                             ></i>
//                             4.9
//                           </span>
//                         </div>
//                       </div>

//                       <div className="row mt-1">
//                         <div className="col-4">
//                           <p className="mb-2 fs-2 fw-semibold">
//                             <span style={{ color: "#4E74FC" }}>
//                               ₹{item.price}
//                             </span>
//                             <del
//                               style={{
//                                 fontSize: "14px",
//                                 color: "#a5a5a5",
//                                 marginLeft: "5px",
//                               }}
//                             >
//                               ₹{item.oldPrice || item.price}
//                             </del>
//                           </p>
//                         </div>

//                         <div className="col-4 text-center">
//                           <span
//                             className="d-flex fs-6 fw-semibold"
//                             style={{ color: "#438a3c" }}
//                           >
//                             {item.offer || "No Offer"}
//                           </span>
//                         </div>

//                         <div className="col-4 text-end">
//                           <div className="d-flex justify-content-end align-items-center">
//                             <i
//                               className="ri-subtract-line mx-3"
//                               style={{
//                                 fontSize: "20px",
//                                 color: "#0d775e",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => decrementQuantity(item)}
//                             ></i>
//                             <span className="fs-4" style={{ color: "#0d775e" }}>
//                               {item.quantity}
//                             </span>
//                             <i
//                               className="ri-add-line mx-3"
//                               style={{
//                                 fontSize: "20px",
//                                 color: "#0d775e",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => incrementQuantity(item)}
//                             ></i>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <SigninButton />
//           )}
//         </main>
//       )}

//       {/* Footer Fixed Button */}
//       {userData && displayCartItems.length > 0 && (
//         <div
//           className="container footer-fixed-bottom mb-5 pb-5 z-3"
//           style={{ backgroundColor: "transparent" }}
//         >
//           <div className="card-body mt-2" style={{ padding: "0px" }}>
//             <div className="card">
//               <div className="row px-1">
//                 <div className="col-12">
//                   <div className="d-flex justify-content-between align-items-center py-1">
//                     <span className="ps-2 fs-4" style={{ color: "#a5a5a5" }}>
//                       Subtotal
//                     </span>
//                     <span className="pe-2 fs-4">
//                       ₹{cartDetails?.sub_total || 0}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="col-12 mb-2">
//                   <div className="d-flex justify-content-between align-items-center py-1">
//                     <span className="ps-2 fs-4" style={{ color: "#a5a5a5" }}>
//                       Discount
//                     </span>
//                     <span className="pe-2 fs-4">
//                       ₹{cartDetails?.discount || 0}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="col-12 mb-2">
//                   <div className="d-flex justify-content-between align-items-center py-1">
//                     <span className="ps-2 fs-4" style={{ color: "#a5a5a5" }}>
//                       Tax
//                     </span>
//                     <span className="pe-2 fs-4">₹{cartDetails?.tax || 0}</span>
//                   </div>
//                 </div>
//                 <div>
//                   <hr className="dashed" />
//                 </div>
//                 <div className="col-12">
//                   <div className="d-flex justify-content-between align-items-center py-1 fw-medium mb-2">
//                     <span className="ps-2 fs-4 fw-medium">Grand Total</span>
//                     <span className="pe-2 fs-4 fw-medium">
//                       ₹{cartDetails?.grand_total || 0}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="container d-flex align-items-center justify-content-center">
//             {displayCartItems.length > 0 && (
//               <Link
//                 to="/Checkout"
//                 state={{ cartItems: displayCartItems }}
//                 className="btn btn-lg btn-thin rounded-xl btn-primary px-5"
//               >
//                 Proceed to Buy &nbsp; <b> ({displayCartItems.length} items)</b>
//               </Link>
//             )}
//           </div>
//         </div>
//       )}
//       <Bottom />
//     </div>
//   );
// };

// export default Cart;

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import SigninButton from "../constants/SigninButton";
// import Bottom from "../component/bottom";
// import "../assets/css/custom.css";

// const Cart = () => {
//   const [cartDetails, setCartDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const getCustomerId = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     return userData?.customer_id || null;
//   };

//   const getRestaurantId = () => {
//     const restaurantId = localStorage.getItem("restaurantId");
//     return restaurantId ? parseInt(restaurantId, 10) : null;
//   };

//   const getCartId = () => {
//     const cartId = localStorage.getItem("cartId");
//     return cartId ? parseInt(cartId, 10) : 1; // Default to 1 if not found
//   };

//   useEffect(() => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();

//     if (customerId && restaurantId) {
//       fetchCartDetails();
//     } else {
//       console.error("Customer ID or Restaurant ID is missing.");
//     }
//   }, []);

//   const fetchCartDetails = async () => {
//     setLoading(true);
//     setError(null);
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     if (!customerId || !restaurantId) {
//       setError("Customer ID or Restaurant ID is not available.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_cart_detail_add_to_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data.st === 1) {
//         setCartDetails(data);
//         localStorage.setItem("cartItems", JSON.stringify(data.order_items));
//       } else {
//         setError("Failed to fetch cart details: " + data.msg);
//       }
//     } catch (error) {
//       setError("Error fetching cart details: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateCartItemQuantity = async (item, newQuantity) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/update_cart_quantity",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: item.menu_id,
//             quantity: newQuantity,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.st === 1) {
//         fetchCartDetails(); // Re-fetch the cart details to update the state
//       } else {
//         setError("Failed to update item quantity: " + data.msg);
//       }
//     } catch (error) {
//       setError("Error updating item quantity: " + error.message);
//     }
//   };

//   const incrementQuantity = (item) => {
//     updateCartItemQuantity(item, item.quantity + 1);
//   };

//   const decrementQuantity = (item) => {
//     if (item.quantity > 1) {
//       updateCartItemQuantity(item, item.quantity - 1);
//     }
//   };

//   const removeFromCart = async (item) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/remove_from_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: item.menu_id,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data.st === 1) {
//         fetchCartDetails(); // Re-fetch the cart details to update the state
//       } else {
//         setError("Failed to remove item from cart: " + data.msg);
//       }
//     } catch (error) {
//       setError("Error removing item from cart: " + error.message);
//     }
//   };

//   const handleRemoveClick = (item) => {
//     removeFromCart(item);
//   };

//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const displayCartItems = cartDetails ? cartDetails.order_items : [];

//   return (
//     <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
//       {/* Header */}
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link to="/" className="back-btn dz-icon icon-fill icon-sm">
//               <i className="ri-arrow-left-line fs-3"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">
//               My Cart{" "}
//               {userData && (
//                 <span className="items-badge">{displayCartItems.length}</span>
//               )}
//             </h5>
//           </div>
//           <div className="right-content">
//             <Link to="/Search" className="dz-icon icon-fill icon-sm">
//               <i className="ri-search-line"></i>
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Loading and Error Handling */}
//       {loading && <p>Loading cart details...</p>}
//       {error && <p className="text-danger">{error}</p>}

//       {/* Cart Items */}
//       {displayCartItems.length === 0 ? (
//         <main className="page-content space-top p-b100">
//           <div className="container overflow-hidden">
//             <div className="m-b20 dz-flex-box">
//               <div className="dz-cart-about text-center">
//                 <h5 className="title">Your Cart is Empty</h5>
//                 <p>Add items to your cart from the product details page.</p>
//                 <Link to="/Category" className="btn btn-outline-primary btn-sm">
//                   Return to Shop
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </main>
//       ) : (
//         <main
//           className="page-content space-top p-b200"
//           style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
//         >
//           {userData ? (
//             <div className="container">
//               {/* RESTAURANT NAME */}
//               <div className="left-content gap-1 ps-2 py-2">
//                 <h3 className="title fw-medium">
//                   <i
//                     className="ri-store-2-line"
//                     style={{ paddingRight: "10px" }}
//                   ></i>
//                   {cartDetails.restaurant_name || "Restaurant Name"}
//                 </h3>
//               </div>

//               {displayCartItems.map((item, index) => (
//                 <div
//                   key={index}
//                   className="card mb-3"
//                   style={{
//                     borderRadius: "15px",
//                     boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                   }}
//                 >
//                   <div className="row g-0">
//                     <div className="col-3">
//                       <Link to={`/ProductDetails/${item.menu_id}`}>
//                         <img
//                           src={item.image || images}
//                           alt={item.menu_name}
//                           style={{
//                             height: "110px",
//                             width: "110px",
//                             objectFit: "cover",
//                             borderRadius: "10px",
//                           }}
//                           onError={(e) => {
//                             e.target.src = images;
//                           }}
//                         />
//                       </Link>
//                     </div>

//                     <div className="col-9">
//                       <div className="row">
//                         <div className="col-10 mt-2">
//                           <h5 className="title fs-3">{item.menu_name}</h5>
//                         </div>
//                         <div className="col-2">
//                           <div onClick={() => handleRemoveClick(item)}>
//                             <i className="ri-close-line fs-3"></i>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="row">
//                         <div
//                           className="col-4 fs-6"
//                           style={{ color: "#0d775e" }}
//                         >
//                           <i className="ri-restaurant-line me-2"></i>
//                           {item.menu_cat_name}
//                         </div>

//                         <div className="col-4 fs-4 text-end">
//                           <span className="fw-semibold">
//                             <i
//                               className="ri-star-fill px-1"
//                               style={{ color: "#fda200" }}
//                             ></i>
//                             4.9
//                           </span>
//                         </div>
//                       </div>

//                       <div className="row mt-1">
//                         <div className="col-4">
//                           <p className="mb-2 fs-2 fw-semibold">
//                             <span style={{ color: "#4E74FC" }}>
//                               ₹{item.price}
//                             </span>
//                             <del
//                               style={{
//                                 fontSize: "14px",
//                                 color: "#a5a5a5",
//                                 marginLeft: "5px",
//                               }}
//                             >
//                               ₹{item.oldPrice || item.price}
//                             </del>
//                           </p>
//                         </div>

//                         <div className="col-4 text-center">
//                           <span
//                             className="d-flex fs-6 fw-semibold"
//                             style={{ color: "#438a3c" }}
//                           >
//                             {item.offer || "No Offer"}
//                           </span>
//                         </div>

//                         <div className="col-4 text-end">
//                           <div className="d-flex justify-content-end align-items-center">
//                             <i
//                               className="ri-subtract-line mx-3"
//                               style={{
//                                 fontSize: "20px",
//                                 color: "#0d775e",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => decrementQuantity(item)}
//                             ></i>
//                             <span className="fs-4" style={{ color: "#0d775e" }}>
//                               {item.quantity}
//                             </span>
//                             <i
//                               className="ri-add-line mx-3"
//                               style={{
//                                 fontSize: "20px",
//                                 color: "#0d775e",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => incrementQuantity(item)}
//                             ></i>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <SigninButton />
//           )}
//         </main>
//       )}

//       {/* Footer Fixed Button */}
//       {userData && displayCartItems.length > 0 && (
//         <div
//           className="container footer-fixed-bottom mb-5 pb-5 z-3"
//           style={{ backgroundColor: "transparent" }}
//         >
//           <div className="card-body mt-2" style={{ padding: "0px" }}>
//             <div className="card">
//               <div className="row px-1">
//                 <div className="col-12">
//                   <div className="d-flex justify-content-between align-items-center py-1">
//                     <span className="ps-2 fs-4" style={{ color: "#a5a5a5" }}>
//                       Subtotal
//                     </span>
//                     <span className="pe-2 fs-4">
//                       ₹{cartDetails?.sub_total || 0}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="col-12 mb-2">
//                   <div className="d-flex justify-content-between align-items-center py-1">
//                     <span className="ps-2 fs-4" style={{ color: "#a5a5a5" }}>
//                       Discount
//                     </span>
//                     <span className="pe-2 fs-4">
//                       ₹{cartDetails?.discount || 0}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="col-12 mb-2">
//                   <div className="d-flex justify-content-between align-items-center py-1">
//                     <span className="ps-2 fs-4" style={{ color: "#a5a5a5" }}>
//                       Tax
//                     </span>
//                     <span className="pe-2 fs-4">₹{cartDetails?.tax || 0}</span>
//                   </div>
//                 </div>
//                 <div>
//                   <hr className="dashed" />
//                 </div>
//                 <div className="col-12">
//                   <div className="d-flex justify-content-between align-items-center py-1 fw-medium mb-2">
//                     <span className="ps-2 fs-4 fw-medium">Grand Total</span>
//                     <span className="pe-2 fs-4 fw-medium">
//                       ₹{cartDetails?.grand_total || 0}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="container d-flex align-items-center justify-content-center">
//             {displayCartItems.length > 0 && (
//               <Link
//                 to="/Checkout"
//                 state={{ cartItems: displayCartItems }}
//                 className="btn btn-lg btn-thin rounded-xl btn-primary px-5"
//               >
//                 Proceed to Buy &nbsp; <b> ({displayCartItems.length} items)</b>
//               </Link>
//             )}
//           </div>
//         </div>
//       )}
//       <Bottom />
//     </div>
//   );
// };

// export default Cart;

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import SigninButton from "../constants/SigninButton";
// import Bottom from "../component/bottom";
// import "../assets/css/custom.css";

// const Cart = () => {
//   const [cartDetails, setCartDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const getCustomerId = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     return userData?.customer_id || null;
//   };

//   const getRestaurantId = () => {
//     return localStorage.getItem("restaurantId")
//       ? parseInt(localStorage.getItem("restaurantId"), 10)
//       : null;
//   };

//   const getCartId = () => {
//     return localStorage.getItem("cartId")
//       ? parseInt(localStorage.getItem("cartId"), 10)
//       : 1; // Default to 1 if not found
//   };

//   useEffect(() => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();

//     if (customerId && restaurantId) {
//       fetchCartDetails();
//     } else {
//       console.error("Customer ID or Restaurant ID is missing.");
//     }
//   }, []);

//   const fetchCartDetails = async () => {
//     setLoading(true);
//     setError(null);
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     if (!customerId || !restaurantId) {
//       setError("Customer ID or Restaurant ID is not available.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_cart_detail_add_to_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data.st === 1) {
//         setCartDetails(data);
//         localStorage.setItem("cartItems", JSON.stringify(data.order_items));
//       } else {
//         setError("Failed to fetch cart details: " + data.msg);
//       }
//     } catch (error) {
//       setError("Error fetching cart details: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateCartItemQuantity = async (item, newQuantity) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/update_cart_quantity",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: item.menu_id,
//             quantity: newQuantity,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.st === 1) {
//         fetchCartDetails(); // Re-fetch the cart details to update the state
//       } else {
//         setError("Failed to update item quantity: " + data.msg);
//       }
//     } catch (error) {
//       setError("Error updating item quantity: " + error.message);
//     }
//   };

//   const incrementQuantity = (item) => {
//     updateCartItemQuantity(item, item.quantity + 1);
//   };

//   const decrementQuantity = (item) => {
//     if (item.quantity > 1) {
//       updateCartItemQuantity(item, item.quantity - 1);
//     }
//   };

//   const removeFromCart = async (item) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/remove_from_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: item.menu_id,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data.st === 1) {
//         fetchCartDetails(); // Re-fetch the cart details to update the state
//       } else {
//         setError("Failed to remove item from cart: " + data.msg);
//       }
//     } catch (error) {
//       setError("Error removing item from cart: " + error.message);
//     }
//   };

//   const handleRemoveClick = (item) => {
//     removeFromCart(item);
//   };

//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const displayCartItems = cartDetails ? cartDetails.order_items : [];

//   return (
//     <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
//       {/* Header */}
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link to="/" className="back-btn dz-icon icon-fill icon-sm">
//               <i className="ri-arrow-left-line fs-3"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">
//               My Cart{" "}
//               {userData && (
//                 <span className="items-badge">{displayCartItems.length}</span>
//               )}
//             </h5>
//           </div>
//           <div className="right-content">
//             <Link to="/Search" className="dz-icon icon-fill icon-sm">
//               <i className="ri-search-line"></i>
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Loading and Error Handling */}
//       {loading && <p>Loading cart details...</p>}
//       {error && <p className="text-danger">{error}</p>}

//       {/* Cart Items */}
//       {displayCartItems.length === 0 ? (
//         <main className="page-content space-top p-b100">
//           <div className="container overflow-hidden">
//             <div className="m-b20 dz-flex-box">
//               <div className="dz-cart-about text-center">
//                 <h5 className="title">Your Cart is Empty</h5>
//                 <p>Add items to your cart from the product details page.</p>
//                 <Link to="/Category" className="btn btn-outline-primary btn-sm">
//                   Return to Shop
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </main>
//       ) : (
//         <main
//           className="page-content space-top p-b200"
//           style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
//         >
//           {userData ? (
//             <div className="container">
//               {/* Restaurant Name */}
//               <div className="left-content gap-1 ps-2 py-2">
//                 <h3 className="title fw-medium">
//                   <i
//                     className="ri-store-2-line"
//                     style={{ paddingRight: "10px" }}
//                   ></i>
//                   {cartDetails.restaurant_name || "Restaurant Name"}
//                 </h3>
//               </div>

//               {displayCartItems.map((item, index) => (
//                 <div
//                   key={index}
//                   className="card mb-3"
//                   style={{
//                     borderRadius: "15px",
//                     boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                   }}
//                 >
//                   <div className="row g-0">
//                     <div className="col-3">
//                       <Link to={`/ProductDetails/${item.menu_id}`}>
//                         <img
//                           src={item.image || images}
//                           alt={item.menu_name}
//                           style={{
//                             height: "110px",
//                             width: "110px",
//                             objectFit: "cover",
//                             borderRadius: "10px",
//                           }}
//                           onError={(e) => {
//                             e.target.src = images;
//                           }}
//                         />
//                       </Link>
//                     </div>
//                     <div className="col-9">
//                       <div className="row">
//                         <div className="col-10 mt-2">
//                           <h5 className="title fs-3">{item.menu_name}</h5>
//                         </div>
//                         <div className="col-2">
//                           <div onClick={() => handleRemoveClick(item)}>
//                             <i className="ri-close-line fs-3"></i>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="row">
//                         <div
//                           className="col-4 fs-6"
//                           style={{ color: "#0d775e" }}
//                         >
//                           <i className="ri-restaurant-line me-2"></i>
//                           {item.menu_cat_name}
//                         </div>

//                         <div className="col-4 fs-4 text-end">
//                           <span className="fw-semibold">
//                             <i
//                               className="ri-star-fill px-1"
//                               style={{ color: "#fda200" }}
//                             ></i>
//                             4.9
//                           </span>
//                         </div>
//                       </div>

//                       <div className="row mt-1">
//                         <div className="col-4">
//                           <p className="mb-2 fs-2 fw-semibold">
//                             <span style={{ color: "#4E74FC" }}>
//                               ₹{item.price}
//                             </span>
//                             <del
//                               style={{
//                                 fontSize: "14px",
//                                 color: "#a5a5a5",
//                                 marginLeft: "5px",
//                               }}
//                             >
//                               ₹{item.oldPrice || item.price}
//                             </del>
//                           </p>
//                         </div>

//                         <div className="col-4 text-center">
//                           <span
//                             className="d-flex fs-6 fw-semibold"
//                             style={{ color: "#438a3c" }}
//                           >
//                             {item.offer || "No Offer"}
//                           </span>
//                         </div>

//                         <div className="col-4 text-end">
//                           <div className="d-flex justify-content-end align-items-center">
//                             <i
//                               className="ri-subtract-line mx-3"
//                               style={{
//                                 fontSize: "20px",
//                                 color: "#0d775e",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => decrementQuantity(item)}
//                             ></i>
//                             <span className="fs-4" style={{ color: "#0d775e" }}>
//                               {item.quantity}
//                             </span>
//                             <i
//                               className="ri-add-line mx-3"
//                               style={{
//                                 fontSize: "20px",
//                                 color: "#0d775e",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => incrementQuantity(item)}
//                             ></i>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <SigninButton />
//           )}
//         </main>
//       )}

//       {/* Footer Fixed Button */}
//       {userData && displayCartItems.length > 0 && (
//         <div
//           className="container footer-fixed-bottom mb-5 pb-5 z-3"
//           style={{ backgroundColor: "transparent" }}
//         >
//           <div className="card-body mt-2" style={{ padding: "0px" }}>
//             <div className="card">
//               <div className="row px-1">
//                 <div className="col-12">
//                   <div className="d-flex justify-content-between align-items-center py-1">
//                     <span className="ps-2 fs-4" style={{ color: "#a5a5a5" }}>
//                       Subtotal
//                     </span>
//                     <span className="pe-2 fs-4">
//                       ₹{cartDetails?.sub_total || 0}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="col-12 mb-2">
//                   <div className="d-flex justify-content-between align-items-center py-1">
//                     <span className="ps-2 fs-4" style={{ color: "#a5a5a5" }}>
//                       Discount
//                     </span>
//                     <span className="pe-2 fs-4">
//                       ₹{cartDetails?.discount || 0}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="col-12 mb-2">
//                   <div className="d-flex justify-content-between align-items-center py-1">
//                     <span className="ps-2 fs-4" style={{ color: "#a5a5a5" }}>
//                       Tax
//                     </span>
//                     <span className="pe-2 fs-4">₹{cartDetails?.tax || 0}</span>
//                   </div>
//                 </div>
//                 <div>
//                   <hr className="dashed" />
//                 </div>
//                 <div className="col-12">
//                   <div className="d-flex justify-content-between align-items-center py-1 fw-medium mb-2">
//                     <span className="ps-2 fs-4 fw-medium">Grand Total</span>
//                     <span className="pe-2 fs-4 fw-medium">
//                       ₹{cartDetails?.grand_total || 0}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="container d-flex align-items-center justify-content-center">
//             {displayCartItems.length > 0 && (
//               <Link
//                 to="/Checkout"
//                 state={{ cartItems: displayCartItems }}
//                 className="btn btn-lg btn-thin rounded-xl btn-primary px-5"
//               >
//                 Proceed to Buy &nbsp; <b> ({displayCartItems.length} items)</b>
//               </Link>
//             )}
//           </div>
//         </div>
//       )}
//       <Bottom />
//     </div>
//   );
// };

// export default Cart;

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import "../assets/css/custom.css";

// const Cart = () => {
//   const [cartDetails, setCartDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Retrieve data from local storage
//   const getCustomerId = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     return userData?.customer_id || null;
//   };

//   const getRestaurantId = () => {
//     return localStorage.getItem("restaurantId")
//       ? parseInt(localStorage.getItem("restaurantId"), 10)
//       : null;
//   };

//   const getCartId = () => {
//     return localStorage.getItem("cartId")
//       ? parseInt(localStorage.getItem("cartId"), 10)
//       : 1; // Default to 1 if not found
//   };

//   useEffect(() => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();

//     if (customerId && restaurantId) {
//       fetchCartDetails();
//     } else {
//       setError("Customer ID or Restaurant ID is missing.");
//       console.error("Customer ID or Restaurant ID is missing:", {
//         customerId,
//         restaurantId,
//       });
//     }
//   }, []);

//   // Fetch cart details from the API
//   const fetchCartDetails = async () => {
//     setLoading(true);
//     setError(null);
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     if (!customerId || !restaurantId) {
//       setError("Customer ID or Restaurant ID is not available.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_cart_detail_add_to_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data.st === 1) {
//         setCartDetails(data);
//         localStorage.setItem("cartItems", JSON.stringify(data.order_items));
//       } else {
//         setError("Failed to fetch cart details: " + data.msg);
//       }
//     } catch (error) {
//       setError("Error fetching cart details: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update cart item quantity
//   const updateCartItemQuantity = async (item, newQuantity) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/update_cart_quantity",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: item.menu_id,
//             quantity: newQuantity,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.st === 1) {
//         fetchCartDetails(); // Re-fetch the cart details to update the state
//       } else {
//         setError("Failed to update item quantity: " + data.msg);
//       }
//     } catch (error) {
//       setError("Error updating item quantity: " + error.message);
//     }
//   };

//   // Increment item quantity
//   const incrementQuantity = (item) => {
//     updateCartItemQuantity(item, item.quantity + 1);
//   };

//   // Decrement item quantity
//   const decrementQuantity = (item) => {
//     if (item.quantity > 1) {
//       updateCartItemQuantity(item, item.quantity - 1);
//     }
//   };

//   // Remove item from cart
//   const removeFromCart = async (item) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/remove_from_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: item.menu_id,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data.st === 1) {
//         fetchCartDetails(); // Re-fetch the cart details to update the state
//       } else {
//         setError("Failed to remove item from cart: " + data.msg);
//       }
//     } catch (error) {
//       setError("Error removing item from cart: " + error.message);
//     }
//   };

//   // Handle remove button click
//   const handleRemoveClick = (item) => {
//     removeFromCart(item);
//   };

//   // Get user data and cart items
//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const displayCartItems = cartDetails ? cartDetails.order_items : [];

//   return (
//     <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
//       {/* Header */}
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link to="/" className="back-btn dz-icon icon-fill icon-sm">
//               <i className="ri-arrow-left-line fs-3"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">
//               My Cart{" "}
//               {userData && (
//                 <span className="items-badge">{displayCartItems.length}</span>
//               )}
//             </h5>
//           </div>
//           <div className="right-content">
//             <Link to="/Search" className="dz-icon icon-fill icon-sm">
//               <i className="ri-search-line"></i>
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Loading and Error Handling */}
//       {loading && <p>Loading cart details...</p>}
//       {error && <p className="text-danger">{error}</p>}

//       {/* Cart Items */}
//       {displayCartItems.length === 0 ? (
//         <main className="page-content space-top p-b100">
//           <div className="container overflow-hidden">
//             <div className="m-b20 dz-flex-box">
//               <div className="dz-cart-about text-center">
//                 <h5 className="title">Your Cart is Empty</h5>
//                 <p>Add items to your cart from the product details page.</p>
//                 <Link to="/Category" className="btn btn-outline-primary btn-sm">
//                   Return to Shop
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </main>
//       ) : (
//         <main
//           className="page-content space-top p-b200"
//           style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
//         >
//           {displayCartItems.map((item, index) => (
//             <div
//               key={index}
//               className="card mb-3"
//               style={{
//                 borderRadius: "15px",
//                 boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//               }}
//             >
//               <div className="row g-0">
//                 <div className="col-3">
//                   <Link to={`/ProductDetails/${item.menu_id}`}>
//                     <img
//                       src={item.image || images}
//                       alt={item.menu_name}
//                       style={{
//                         height: "110px",
//                         width: "110px",
//                         objectFit: "cover",
//                         borderRadius: "10px",
//                       }}
//                       onError={(e) => {
//                         e.target.src = images;
//                       }}
//                     />
//                   </Link>
//                 </div>
//                 <div className="col-9">
//                   <div className="row">
//                     <div className="col-10 mt-2">
//                       <h5 className="title fs-3">{item.menu_name}</h5>
//                     </div>
//                     <div className="col-2">
//                       <div onClick={() => handleRemoveClick(item)}>
//                         <i className="ri-close-line fs-3"></i>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="row">
//                     <div className="col-4 fs-6" style={{ color: "#0d775e" }}>
//                       <i className="ri-restaurant-line me-2"></i>
//                       {item.menu_cat_name}
//                     </div>
//                     <div className="col-8 text-end fs-6">
//                       ₹{item.menu_price} / {item.unit}
//                     </div>
//                   </div>
//                   <div className="row">
//                     <div className="col-4">
//                       <div className="input-group">
//                         <button
//                           className="btn btn-outline-secondary"
//                           onClick={() => decrementQuantity(item)}
//                         >
//                           -
//                         </button>
//                         <input
//                           type="text"
//                           className="form-control text-center"
//                           value={item.quantity}
//                           readOnly
//                         />
//                         <button
//                           className="btn btn-outline-secondary"
//                           onClick={() => incrementQuantity(item)}
//                         >
//                           +
//                         </button>
//                       </div>
//                     </div>
//                     <div className="col-8 text-end fs-6">
//                       Total: ₹{item.quantity * item.menu_price}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//           {/* Cart Totals */}
//           <div className="container">
//             <div className="row">
//               <div className="col-6">
//                 <h6>Subtotal:</h6>
//                 <p>₹{cartDetails?.sub_total}</p>
//               </div>
//               <div className="col-6 text-end">
//                 <h6>Grand Total:</h6>
//                 <p>₹{cartDetails?.grand_total}</p>
//               </div>
//             </div>
//           </div>
//         </main>
//       )}

//       {/* Footer */}
//       <footer className="footer text-center">
//         <Link to="/Checkout" className="btn btn-primary">
//           Proceed to Checkout
//         </Link>
//       </footer>
//     </div>
//   );
// };

// export default Cart;

// rerived from gh----->

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import SigninButton from "../constants/SigninButton";
// import Bottom from "../component/bottom";
// import "../assets/css/custom.css";
// import App from "./../App";

// const Cart = () => {
//   const [cartDetails, setCartDetails] = useState(null);
//   const navigate = useNavigate();
//   const [itemToRemove, setItemToRemove] = useState(null);

//   // Retrieve Customer ID from localStorage
//   const getCustomerId = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     return userData ? userData.customer_id : null;
//   };

//   // Retrieve Restaurant ID from localStorage
//   const getRestaurantId = () => {
//     const restaurantId = localStorage.getItem("restaurantId");
//     return restaurantId ? parseInt(restaurantId, 10) : null;
//   };

//   // Retrieve Cart ID from localStorage or set a default
//   const getCartId = () => {
//     const cartId = localStorage.getItem("cartId");
//     return cartId ? parseInt(cartId, 10) : 1; // Default to 1 if not found
//   };

//   useEffect(() => {
//     fetchCartDetails();
//   }, []);

//   const fetchCartDetails = async () => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     if (!customerId || !restaurantId) {
//       console.error("Customer ID or Restaurant ID is not available.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_cart_detail_add_to_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data.st === 1) {
//         setCartDetails(data);
//       } else if (data.st === 2) { // Check for empty cart
//         setCartDetails({ order_items: [] }); // Set empty order_items
//       } else {
//         console.error("Failed to fetch cart details:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error fetching cart details:", error);
//     }
//   };

//   const removeFromCart = async (item) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();
//     const menuId = item.menu_id; // Get the menu ID from the item to be removed

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/remove_from_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data.st === 1) {
//         console.log("Item removed from cart successfully.");
//         // Remove item from local storage
//         const updatedCartItems = displayCartItems.filter(cartItem => cartItem.menu_id !== menuId);
//         localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
//         // Fetch the updated cart details
//         fetchCartDetails();
//       } else {
//         console.error("Failed to remove item from cart:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error removing item from cart:", error);
//     }
//   };

//   const handleRemoveClick = (item) => {
//     removeFromCart(item);
//   };

//   const decrementQuantity = (index) => {
//     // Add functionality to decrement quantity
//   };

//   const incrementQuantity = (index) => {
//     // Add functionality to increment quantity
//   };

//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const handleBack = () => {
//     navigate(-1); // Navigate back to the previous screen
//   };

//   const displayCartItems = cartDetails ? cartDetails.order_items : [];

//   return (
//     <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
//       {/* Header */}
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link to="/" className="back-btn dz-icon  icon-sm">
//               <i className="ri-arrow-left-line fs-2"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">
//               My Cart{" "}
//               {userData && (
//                 <span className="">({displayCartItems.length})</span>
//               )}
//             </h5>
//           </div>
//         </div>
//       </header>
//       {/* Cart Items */}
//       {displayCartItems.length === 0 ? (
//         // <main className="page-content space-top p-b100">
//         <main
//           className="page-content space-top p-b100"
//           // style={{height:"1000px"}}
//         >
//           <div className="container overflow-hidden">
//             <div className="m-b20 dz-flex-box">
//               <div className="dz-cart-about text-center">
//                 <h5 className="title">Your Cart is Empty</h5>
//                 <p>Add items to your cart from the product details page.</p>
//                 <Link to="/Category" className="btn btn-outline-primary btn-sm">
//                   Return to Shop
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </main>
//       ) : (
//         <main
//           className="page-content space-top p-b200"
//           // style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
//         >
//           {userData ? (
//             <div className="container scrollable-section">
//               {/* RESTAURANT NAME */}
//               <div className="left-content gap-1 ps-2 py-2">
//                 <h3 className="title fw-medium">
//                   <i
//                     className="ri-store-2-line"
//                     style={{ paddingRight: "10px" }}
//                   ></i>
//                   {userData ? userData.restaurantName : "Restaurant Name"}
//                 </h3>
//               </div>
//               {/* RESTAURANT NAME */}

//               {displayCartItems.map((item, index) => (
//                 <div
//                   key={index}
//                   className="card mb-3"
//                   style={{
//                     borderRadius: "15px",
//                     boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                     position: "relative",
//                     left: "4px",
//                   }}
//                 >
//                   {/* <div className="row g-0">
//                     {}
//                     <div className="col-3">
//                       <Link to={`/ProductDetails/${item.menu_id}`}>
//                         <img
//                           src={item.image || images}
//                           alt={item.menu_name}
//                           style={{
//                             height: "110px",
//                             width: "110px",
//                             objectFit: "cover",
//                             borderRadius: "10px",
//                           }}
//                           onError={(e) => {
//                             e.target.src = images;
//                           }}
//                         />
//                       </Link>
//                     </div>

//                     {}
//                     <div className="col-8">
//                       {}
//                       <div className="row">
//                         <div className="col-10 mt-2">
//                           <h5 className="title fs-3">{item.menu_name}</h5>
//                         </div>
//                         <div className="col-2">
//                           {}
//                           <div onClick={() => handleRemoveClick(item)}>
//                             <i className="ri-close-line fs-3"></i>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="row">
//                         <div
//                           className="col-4 fs-6"
//                           style={{ color: "#0d775e" }}
//                         >
//                           <i className="ri-restaurant-line me-2"></i>
//                           {item.menu_cat_name}
//                         </div>
//                         <div className="col-4 fs-4">
//                           <div className="offer-code mt-2">
//                             {Array.from({ length: 5 }).map((_, index) =>
//                               index < item.spicy_index ? (
//                                 <i
//                                   className="ri-fire-fill fs-6"
//                                   style={{ fontSize: "12px", color: "#eb8e57" }}
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

//                         <div className="col-4 fs-4 text-end">
//                           <span className="fw-semibold">
//                             <i
//                               className="ri-star-fill px-1"
//                               style={{ color: "#fda200" }}
//                             ></i>{" "}
//                             4.9
//                           </span>
//                         </div>
//                       </div>

//                       {}
//                       <div className="row mt-1">
//                         <div className="col-4">
//                           <p className="mb-2 fs-2 fw-semibold">
//                             <span style={{ color: "#4E74FC" }}>
//                               ₹{item.price}
//                             </span>
//                             <del
//                               style={{
//                                 fontSize: "14px",
//                                 color: "#a5a5a5",
//                                 marginLeft: "5px",
//                               }}
//                             >
//                               ₹{item.oldPrice || item.price}
//                             </del>
//                           </p>
//                         </div>
//                         <div className="col-4 text-center">
//                           <span
//                             className="d-flex fs-6 fw-semibold"
//                             style={{ color: "#438a3c" }}
//                           >
//                             {item.offer || "No Offer"}
//                           </span>
//                         </div>

//                         {}
//                         <div className="col-4 text-end">
//                           <div className="d-flex justify-content-end align-items-center">
//                             {}
//                             <i
//                               className="ri-subtract-line mx-3"
//                               style={{
//                                 fontSize: "20px",
//                                 color: "#0d775e",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => decrementQuantity(index)}
//                             ></i>

//                             {}
//                             <span className="fs-4" style={{ color: "#0d775e" }}>
//                               {item.quantity}
//                             </span>

//                             {}
//                             <i
//                               className="ri-add-line mx-3"
//                               style={{
//                                 fontSize: "20px",
//                                 color: "#0d775e",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => incrementQuantity(index)}
//                             ></i>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div> */}

//                   {/* --------------- */}

//                   {/* <div className="row">
//                     <div className="col-3 ">
//                       <Link to={`/ProductDetails/${item.menu_id}`}>
//                         <img
//                           src={item.image || images}
//                           alt={item.menu_name}
//                           style={{
//                             height: "110px",
//                             width: "110px",
//                             objectFit: "cover",
//                             borderRadius: "10px",
//                           }}
//                           onError={(e) => {
//                             e.target.src = images;
//                           }}
//                         />
//                       </Link>
//                     </div>
//                     <div className="col-9 pt-1">
//                       <div className="row">
//                         <div className="col-6">
//                           <h5 className="title fs-">{item.menu_name}</h5>
//                         </div>
//                         <div className="col-6 text-end pe-4">
//                           <div onClick={() => handleRemoveClick(item)}>
//                             <i className="ri-close-line fs-3"></i>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="row">
//                         <div className="col-4">
//                           <i
//                             className="ri-restaurant-line me-2"
//                             style={{ color: "" }}
//                           ></i>
//                           {item.menu_cat_name}
//                         </div>
//                         <div className="col-4">
//                           <div className="offer-code mt-2">
//                             {Array.from({ length: 5 }).map((_, index) =>
//                               index < item.spicy_index ? (
//                                 <i
//                                   className="ri-fire-fill fs-6"
//                                   style={{ fontSize: "12px", color: "#eb8e57" }}
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
//                         <div className="col-4">
//                           <span className="fw-semibold">
//                             <i
//                               className="ri-star-fill px-1"
//                               style={{ color: "#fda200" }}
//                             ></i>{" "}
//                             4.9
//                           </span>
//                         </div>
//                       </div>
//                       <div className="row">
//                         <div className="col-4">
//                           {" "}
//                           <p className="mb-2 fs-2 fw-semibold">
//                             <span style={{ color: "#4E74FC" }}>
//                               ₹{item.price}
//                             </span>
//                             <del
//                               style={{
//                                 fontSize: "14px",
//                                 color: "#a5a5a5",
//                                 marginLeft: "5px",
//                               }}
//                             >
//                               ₹{item.oldPrice || item.price}
//                             </del>
//                           </p>
//                         </div>
//                         <div className="col-4">
//                           {" "}
//                           <span
//                             className="d-flex fs-6 fw-semibold"
//                             style={{ color: "#438a3c" }}
//                           >
//                             {item.offer || "No Offer"}
//                           </span>
//                         </div>
//                         <div className="col-4">
//                           {" "}
//                           <div className="d-flex justify-content-end align-items-center">

//                             <i
//                               className="ri-subtract-line mx-3"
//                               style={{
//                                 fontSize: "20px",
//                                 color: "#0d775e",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => decrementQuantity(index)}
//                             ></i>

//                             <span className="fs-4" style={{ color: "#0d775e" }}>
//                               {item.quantity}
//                             </span>

//                             <i
//                               className="ri-add-line mx-3"
//                               style={{
//                                 fontSize: "20px",
//                                 color: "#0d775e",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => incrementQuantity(index)}
//                             ></i>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div> */}

//                   {/* -----------new---------- */}

//                   <div className="row my-auto" style={{ height: "110px" }}>
//                     <div className="col-3 px-0" style={{}}>
//                       <Link to={`/ProductDetails/${item.menu_id}`}>
//                         <img
//                           src={item.image || images}
//                           alt={item.menu_name}
//                           style={{
//                             height: "110px",
//                             width: "110px",
//                             objectFit: "cover",
//                             borderRadius: "10px",
//                             position: "relative",
//                             left: "5px",
//                           }}
//                           onError={(e) => {
//                             e.target.src = images;
//                           }}
//                         />
//                       </Link>
//                     </div>
//                     <div className="col-9 pt-2 pb-2">
//                       <div className="row">
//                         <div className="col-9 my-auto">
//                           <h5 className="title text-truncate">
//                             {item.menu_name}
//                           </h5>
//                         </div>
//                         <div className="col-3 text-end pe-4">
//                           <div onClick={() => handleRemoveClick(item)}>
//                             <i
//                               className="ri-close-line fs-3"
//                               style={{ color: "#818180" }}
//                             ></i>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="row">
//                         <div
//                           className="col-5 fs-6 text-truncate fw-medium my-auto"
//                           style={{ color: "#438a3c" }}
//                         >
//                           <i className="ri-restaurant-line me-2"></i>
//                           {item.menu_cat_name}
//                         </div>
//                         <div className="col-3 px-0 ps-1">
//                           <div
//                             className="offer-code my-auto"
//                             style={{ width: "100px" }}
//                           >
//                             {Array.from({ length: 5 }).map((_, index) =>
//                               index < item.spicy_index ? (
//                                 <i
//                                   className="ri-fire-fill fs-6"
//                                   style={{ fontSize: "12px", color: "#eb8e57" }}
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
//                         <div className="col-4 px-0 ps-1 text-center">
//                           <span className="fw-semibold">
//                             <i
//                               className="ri-star-half-line px-1"
//                               style={{ color: "#fda200" }}
//                             ></i>{" "}
//                             4.9
//                           </span>
//                         </div>
//                       </div>
//                       <div className="row pt-2">
//                         <div
//                           className="col-6 mx-0 my-auto px-0"
//                           style={{ position: "relative", left: "15px" }}
//                         >
//                           {" "}
//                           <p className="mb-2 fs-4 fw-medium ">
//                             <span style={{ color: "#4E74FC" }}>
//                               ₹{item.price}
//                             </span>
//                             <del
//                               style={{
//                                 fontSize: "14px",
//                                 color: "#dedede",
//                                 marginLeft: "5px",
//                                 width: "100px",
//                               }}
//                             >
//                               ₹{item.oldPrice || item.price}
//                             </del>
//                           </p>
//                         </div>
//                         <div
//                           className="col-3 px-0 pt-1"
//                           style={{
//                             textAlign: "",
//                             position: "relative",
//                             right: "15px",
//                           }}
//                         >
//                           {" "}
//                           <span
//                             className="d-flex fs-7 fw-semibold mx-a text-truncate "
//                             style={{ color: "#438a3c" }}
//                           >
//                             <div className="d-flex align-items-center justify-content-center">
//                               {item.offer || "No "} Off
//                             </div>
//                           </span>
//                         </div>
//                         <div className="col-3">
//                           {" "}
//                           <div className="d-flex justify-content-end align-items-center">
//                             {/* Decrement Button */}
//                             <i
//                               className="ri-subtract-line mx-2"
//                               style={{
//                                 fontSize: "18px",
//                                 color: "",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => decrementQuantity(index)}
//                             ></i>

//                             {/* Quantity Display */}
//                             <span
//                               className="fs-4 px-2"
//                               style={{
//                                 color: "",
//                                 backgroundColor: "#a5a5a5",
//                               }}
//                             >
//                               {item.quantity}
//                             </span>

//                             {/* Increment Button */}
//                             <i
//                               className="ri-add-line mx-2"
//                               style={{
//                                 fontSize: "18px",
//                                 color: "",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => incrementQuantity(index)}
//                             ></i>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {/* Footer Fixed Button */}
//               {userData &&
//                 displayCartItems.length > 0 && ( // Only render if user is logged in and cart is not empty
//                   <div
//                     className="container  mb-5 pb-5 z-3 pt-10"
//                     style={{ backgroundColor: "transparent" }}
//                   >
//                     <div className="card-body mt-2" style={{ padding: "0px" }}>
//                       <div className="card mx-auto" style={{ width: "365px" }}>
//                         <div
//                           className="row px-1 py-1"
//                           style={{ height: "180px" }}
//                         >
//                           <div className="col-12">
//                             <div className="d-flex justify-content-between align-items-center py-0">
//                               <span
//                                 className="ps-2 fs-5"
//                                 style={{ color: "#a5a5a5" }}
//                               >
//                                 Subtotal
//                               </span>
//                               <span className="pe-2 fs-5 fw-semibold">
//                                 ₹{cartDetails?.sub_total || 0}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="col-12 mb-0">
//                             <div className="d-flex justify-content-between align-items-center py-0">
//                               <span
//                                 className="ps-2 fs-5"
//                                 style={{ color: "#a5a5a5" }}
//                               >
//                                 Discount
//                               </span>
//                               <span className="pe-2 fs-5 fw-semibold">
//                                 ₹{cartDetails?.discount || 0}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="col-12 mb-0">
//                             <div className="d-flex justify-content-between align-items-center py-0">
//                               <span
//                                 className="ps-2 fs-5"
//                                 style={{ color: "#a5a5a5" }}
//                               >
//                                 Tax
//                               </span>
//                               <span className="pe-2 fs-5 fw-semibold">
//                                 ₹{cartDetails?.tax || 0}
//                               </span>
//                             </div>
//                           </div>
//                           <div>
//                             <hr
//                               className="dashed-line me-3 p-0 m-0"
//                               style={{ color: "#0d775e" }}
//                             />
//                           </div>
//                           <div className="col-12 ">
//                             <div className="d-flex justify-content-between align-items-center py-1 fw-medium  pb-0 mb-0">
//                               <span className="ps-2 fs-5 fw-semibold ">
//                                 Grand Total
//                               </span>
//                               <span className="pe-2 fs-5 fw-semibold">
//                                 ₹{cartDetails?.grand_total || 0}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="container d-flex align-items-center justify-content-center">
//                       {displayCartItems.length > 0 && (
//                         <Link
//                           to="/Checkout"
//                           state={{ cartItems: displayCartItems }}
//                           className="btn btn-lg btn-thin rounded-xl btn-primary px-5"
//                         >
//                           Proceed to Buy &nbsp;{" "}
//                           <b> ({displayCartItems.length} items)</b>
//                         </Link>
//                       )}
//                     </div>
//                   </div>
//                 )}
//             </div>
//           ) : (
//             <SigninButton />
//           )}
//         </main>
//       )}
//       {/* Footer Fixed Button */}
//       {/* {userData &&
//         displayCartItems.length > 0 && ( // Only render if user is logged in and cart is not empty
//           <div
//             className="container  mb-5 pb-5 z-3 pt-10"
//             style={{ backgroundColor: "transparent" }}
//           >
//             <div className="card-body mt-2" style={{ padding: "0px" }}>
//               <div className="card mx-auto" style={{ width: "365px" }}>
//                 <div className="row px-1 py-1" style={{ height: "180px" }}>
//                   <div className="col-12">
//                     <div className="d-flex justify-content-between align-items-center py-0">
//                       <span className="ps-2 fs-5" style={{ color: "#a5a5a5" }}>
//                         Subtotal
//                       </span>
//                       <span className="pe-2 fs-5 fw-semibold">
//                         ₹{cartDetails?.sub_total || 0}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="col-12 mb-0">
//                     <div className="d-flex justify-content-between align-items-center py-0">
//                       <span className="ps-2 fs-5" style={{ color: "#a5a5a5" }}>
//                         Discount
//                       </span>
//                       <span className="pe-2 fs-5 fw-semibold">
//                         ₹{cartDetails?.discount || 0}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="col-12 mb-0">
//                     <div className="d-flex justify-content-between align-items-center py-0">
//                       <span className="ps-2 fs-5" style={{ color: "#a5a5a5" }}>
//                         Tax
//                       </span>
//                       <span className="pe-2 fs-5 fw-semibold">
//                         ₹{cartDetails?.tax || 0}
//                       </span>
//                     </div>
//                   </div>
//                   <div>
//                     <hr
//                       className="dashed-line me-3 p-0 m-0"
//                       style={{ color: "#0d775e" }}
//                     />
//                   </div>
//                   <div className="col-12 ">
//                     <div className="d-flex justify-content-between align-items-center py-1 fw-medium  pb-0 mb-0">
//                       <span className="ps-2 fs-5 fw-semibold ">
//                         Grand Total
//                       </span>
//                       <span className="pe-2 fs-5 fw-semibold">
//                         ₹{cartDetails?.grand_total || 0}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="container d-flex align-items-center justify-content-center">
//               {displayCartItems.length > 0 && (
//                 <Link
//                   to="/Checkout"
//                   state={{ cartItems: displayCartItems }}
//                   className="btn btn-lg btn-thin rounded-xl btn-primary px-5"
//                 >
//                   Proceed to Buy &nbsp;{" "}
//                   <b> ({displayCartItems.length} items)</b>
//                 </Link>
//               )}
//             </div>
//           </div>
//         )} */}
//       <Bottom />
//     </div>
//   );
// };

// export default Cart;

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import SigninButton from "../constants/SigninButton";
// import Bottom from "../component/bottom";
// import "../assets/css/custom.css";

// const Cart = () => {
//   const [cartDetails, setCartDetails] = useState(null);
//   const navigate = useNavigate();

//   // Retrieve Customer ID from localStorage
//   const getCustomerId = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     return userData ? userData.customer_id : null;
//   };

//   // Retrieve Restaurant ID from userData in localStorage
//   const getRestaurantId = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     return userData && userData.restaurantId ? userData.restaurantId : null;
//   };

//   // Retrieve Cart ID from localStorage or set a default
//   const getCartId = () => {
//     const cartId = localStorage.getItem("cartId");
//     return cartId ? parseInt(cartId, 10) : 1;
//   };

//   useEffect(() => {
//     fetchCartDetails();
//   }, []);

//   const fetchCartDetails = async () => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     if (!customerId || !restaurantId) {
//       console.error("Customer ID or Restaurant ID is not available.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_cart_detail_add_to_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data.st === 1) {
//         setCartDetails(data);
//       } else if (data.st === 2) {
//         setCartDetails({ order_items: [] });
//       } else {
//         console.error("Failed to fetch cart details:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error fetching cart details:", error);
//     }
//   };

//   const removeFromCart = async (item) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();
//     const menuId = item.menu_id;

//     // Update local storage to remove the item
//     const currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];
//     const updatedCart = currentCart.filter(
//       (cartItem) => cartItem.menu_id !== menuId
//     );
//     localStorage.setItem("cartItems", JSON.stringify(updatedCart));

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/remove_from_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.st === 1) {
//         console.log("Item removed from cart successfully.");
//         fetchCartDetails(); // Refresh cart details
//       } else {
//         console.error("Failed to remove item from cart:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error removing item from cart:", error);
//     }
//   };

//   const updateCartQuantity = async (menuId, newQuantity) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/update_cart_menu_quantity",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//             quantity: newQuantity,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.st === 1) {
//         console.log("Menu quantity updated successfully.");
//         fetchCartDetails();
//       } else {
//         console.error("Failed to update menu quantity:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error updating menu quantity:", error);
//     }
//   };

//   const incrementQuantity = (item) => {
//     const newQuantity = item.quantity + 1;
//     updateCartQuantity(item.menu_id, newQuantity);
//   };

//   const decrementQuantity = (item) => {
//     if (item.quantity > 1) {
//       const newQuantity = item.quantity - 1;
//       updateCartQuantity(item.menu_id, newQuantity);
//     }
//   };

//   const displayCartItems = cartDetails ? cartDetails.order_items : [];

//   return (
//     <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link to="/" className="back-btn dz-icon  icon-sm">
//               <i className="ri-arrow-left-line fs-2"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">
//               My Cart{" "}
//               {displayCartItems.length > 0 && (
//                 <span className="">({displayCartItems.length})</span>
//               )}
//             </h5>
//           </div>
//         </div>
//       </header>

//       {displayCartItems.length === 0 ? (
//         <main className="page-content space-top p-b100">
//           <div className="container overflow-hidden">
//             <div className="m-b20 dz-flex-box">
//               <div className="dz-cart-about text-center">
//                 <h5 className="title">Your Cart is Empty</h5>
//                 <p>Add items to your cart from the product details page.</p>
//                 <Link to="/Category" className="btn btn-outline-primary btn-sm">
//                   Return to Shop
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </main>
//       ) : (
//         <main className="page-content space-top p-b200">
//           <div className="container scrollable-section">
//             {displayCartItems.map((item, index) => (
//               <div
//                 key={index}
//                 className="card mb-3"
//                 style={{
//                   borderRadius: "15px",
//                   boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                 }}
//               >
//                 <div className="row my-auto" style={{ height: "110px" }}>
//                   <div className="col-3 px-0">
//                     <Link to={`/ProductDetails/${item.menu_id}`}>
//                       <img
//                         src={item.image || images}
//                         alt={item.menu_name}
//                         style={{
//                           height: "110px",
//                           width: "110px",
//                           objectFit: "cover",
//                           borderRadius: "10px",
//                           position: "relative",
//                           left: "10px",
//                         }}
//                         onError={(e) => {
//                           e.target.src = images;
//                         }}
//                       />
//                     </Link>
//                   </div>
//                   <div className="col-9 pt-2 pb-2">
//                     <div className="row">
//                       <div className="col-9 my-auto">
//                         <h5 className="title text-truncate">
//                           {item.menu_name}
//                         </h5>
//                       </div>
//                       <div className="col-3 text-end pe-4">
//                         <div onClick={() => removeFromCart(item)}>
//                           <i
//                             className="ri-close-line fs-3"
//                             style={{ color: "#818180" }}
//                           ></i>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div
//                         className="col-5 fs-6 text-truncate fw-medium my-auto"
//                         style={{ color: "#438a3c" }}
//                       >
//                         <i className="ri-restaurant-line me-2"></i>
//                         {item.menu_cat_name}
//                       </div>
//                       <div className="col-3 px-0 ps-1">
//                         <div
//                           className="offer-code my-auto"
//                           style={{ width: "100px" }}
//                         >
//                           {Array.from({ length: 5 }).map((_, index) =>
//                             index < item.spicy_index ? (
//                               <i
//                                 className="ri-fire-fill fs-6"
//                                 style={{ fontSize: "12px", color: "#eb8e57" }}
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
//                       <div className="col-4 px-0 ps-1 text-center">
//                         <span className="fw-semibold">
//                           <i
//                             className="ri-star-half-line px-1"
//                             style={{ color: "#fda200" }}
//                           ></i>{" "}
//                           4.9
//                         </span>
//                       </div>
//                     </div>
//                     <div className="row pt-2">
//                       <div className="col-6 mx-0 my-auto px-0">
//                         <p className="mb-2 fs-4 fw-medium">
//                           <span className="ms-3 me-2 text-info">
//                             ₹{item.price}
//                           </span>
//                           <span className="text-muted fs-6 text-decoration-line-through">
//                             ₹{item.oldPrice || item.price}
//                           </span>

//                           <span className="fs-6 ps-2 text-primary">
//                             {item.offer || "No "}% Off
//                           </span>
//                         </p>
//                       </div>
//                       <div className="col-3 px-0 pt-1"></div>
//                       <div className="col-3">
//                         <div className="d-flex justify-content-end align-items-center">
//                           <i
//                             className="ri-subtract-line mx-2"
//                             style={{
//                               fontSize: "18px",
//                               cursor: "pointer",
//                             }}
//                             onClick={() => decrementQuantity(item)}
//                           ></i>

//                           <span className="text-light ">{item.quantity}</span>

//                           <i
//                             className="ri-add-line mx-2"
//                             style={{
//                               fontSize: "18px",
//                               cursor: "pointer",
//                             }}
//                             onClick={() => incrementQuantity(item)}
//                           ></i>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {cartDetails && displayCartItems.length > 0 && (
//               <div className="container mb-5 pb-5 z-3 pt-10">
//                 <div className="card-body mt-2" style={{ padding: "0px" }}>
//                   <div className="card mx-auto" >
//                     <div
//                       className="row px-1 py-1"
//                       // style={{ height: "180px" }}
//                     >
//                       <div className="col-12">
//                         <div className="d-flex justify-content-between align-items-center py-0">
//                           <span
//                             className="ps-2 fs-5"
//                             // style={{ color: "#a5a5a5" }}
//                           >
//                             Total
//                           </span>
//                           <span className="pe-2 fs-5 fw-semibold">
//                             ₹{cartDetails?.total_bill || 0}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="col-12">
//                         <div className="d-flex justify-content-between align-items-center py-0">
//                           <span
//                             className="ps-2 fs-5"
//                             style={{ color: "#a5a5a5" }}
//                           >
//                             Service Charges (
//                             {cartDetails.service_charges_percent}%)
//                           </span>
//                           <span className="pe-2 fs-5 fw-semibold">
//                             ₹{cartDetails?.service_charges_amount || 0}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="col-12 mb-0">
//                         <div className="d-flex justify-content-between align-items-center py-0">
//                           <span
//                             className="ps-2 fs-5"
//                             style={{ color: "#a5a5a5" }}
//                           >
//                             GST ({cartDetails.gst_percent}%)
//                           </span>
//                           <span className="pe-2 fs-5 fw-semibold">
//                             ₹{cartDetails?.gst_amount || 0}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="col-12 mb-0">
//                         <div className="d-flex justify-content-between align-items-center py-0">
//                           <span
//                             className="ps-2 fs-5"
//                             style={{ color: "#a5a5a5" }}
//                           >
//                             Discount({cartDetails?.discount_percent || 0}%)
//                           </span>
//                           <span className="pe-2 fs-5 fw-semibold">
//                             ₹{cartDetails?.discount_amount || 0}
//                           </span>
//                         </div>
//                       </div>
//                       <div>
//                         <hr
//                           className="dashed-line me-3 p-0 m-0"
//                           style={{ color: "#0d775e" }}
//                         />
//                       </div>
//                       <div className="col-12">
//                         <div className="d-flex justify-content-between align-items-center py-1 fw-medium  pb-0 mb-0">
//                           <span className="ps-2 fs-5 fw-semibold">
//                             Grand Total
//                           </span>
//                           <span className="pe-2 fs-5 fw-semibold">
//                             ₹{cartDetails?.grand_total || 0}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="container d-flex align-items-center justify-content-center">
//                   <Link
//                     to="/Checkout"
//                     state={{ cartItems: displayCartItems }}
//                     className="btn btn-lg btn-thin rounded-xl btn-primary px-5"
//                   >
//                     Proceed to Buy &nbsp;{" "}
//                     <b> ({displayCartItems.length} items)</b>
//                   </Link>
//                 </div>
//               </div>
//             )}
//           </div>
//         </main>
//       )}
//       <Bottom />
//     </div>
//   );
// };

// export default Cart;

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import SigninButton from "../constants/SigninButton";
// import Bottom from "../component/bottom";
// import "../assets/css/custom.css";

// const Cart = () => {
//   const [cartDetails, setCartDetails] = useState(null);
//   const navigate = useNavigate();

//   const getCustomerId = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     return userData ? userData.customer_id : null;
//   };

//   const getRestaurantId = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     return userData && userData.restaurantId ? userData.restaurantId : null;
//   };

//   const getCartId = () => {
//     const cartId = localStorage.getItem("cartId");
//     return cartId ? parseInt(cartId, 10) : 1;
//   };

//   useEffect(() => {
//     fetchCartDetails();
//   }, []);

//   const fetchCartDetails = async () => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     if (!customerId || !restaurantId) {
//       console.error("Customer ID or Restaurant ID is not available.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_cart_detail_add_to_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data.st === 1) {
//         setCartDetails(data);
//       } else if (data.st === 2) {
//         setCartDetails({ order_items: [] });
//       } else {
//         console.error("Failed to fetch cart details:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error fetching cart details:", error);
//     }
//   };

//   const removeFromCart = async (item) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();
//     const menuId = item.menu_id;

//     // Update local storage to remove the item
//     const currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];
//     const updatedCart = currentCart.filter(
//       (cartItem) => cartItem.menu_id !== menuId
//     );
//     localStorage.setItem("cartItems", JSON.stringify(updatedCart));

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/remove_from_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.st === 1) {
//         console.log("Item removed from cart successfully.");
//         fetchCartDetails(); // Refresh cart details
//       } else {
//         console.error("Failed to remove item from cart:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error removing item from cart:", error);
//     }
//   };

//   const updateCartQuantity = async (menuId, newQuantity) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/update_cart_menu_quantity",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//             quantity: newQuantity,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.st === 1) {
//         console.log("Menu quantity updated successfully.");
//         fetchCartDetails();
//       } else {
//         console.error("Failed to update menu quantity:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error updating menu quantity:", error);
//     }
//   };

//   const incrementQuantity = (item) => {
//     const newQuantity = item.quantity + 1;
//     updateCartQuantity(item.menu_id, newQuantity);
//   };

//   const decrementQuantity = (item) => {
//     if (item.quantity > 1) {
//       const newQuantity = item.quantity - 1;
//       updateCartQuantity(item.menu_id, newQuantity);
//     }
//   };

//   const displayCartItems = cartDetails ? cartDetails.order_items : [];

//   return (
//     <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link to="/" className="back-btn dz-icon icon-sm">
//               <i className="ri-arrow-left-line fs-2"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">
//               My Cart{" "}
//               {displayCartItems.length > 0 && (
//                 <span className="">({displayCartItems.length})</span>
//               )}
//             </h5>
//           </div>
//         </div>
//       </header>

//       {displayCartItems.length === 0 ? (
//         <main className="page-content space-top p-b100">
//           <div className="container overflow-hidden">
//             <div className="m-b20 dz-flex-box">
//               <div className="dz-cart-about text-center">
//                 <h5 className="title">Your Cart is Empty</h5>
//                 <p>Add items to your cart from the product details page.</p>
//                 <Link to="/Category" className="btn btn-outline-primary btn-sm">
//                   Return to Shop
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </main>
//       ) : (
//         <main className="page-content space-top p-b200">
//           <div className="container scrollable-section">
//             {displayCartItems.map((item, index) => (
//               <div
//                 key={index}
//                 className="card mb-3"
//                 style={{
//                   borderRadius: "15px",
//                   boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                 }}
//               >
//                 <div className="row my-auto" style={{ height: "110px" }}>
//                   <div className="col-3 px-0">
//                     <Link to={`/ProductDetails/${item.menu_id}`}>
//                       <img
//                         src={item.image || images}
//                         alt={item.menu_name}
//                         style={{
//                           height: "110px",
//                           width: "110px",
//                           objectFit: "cover",
//                           borderRadius: "10px",
//                           position: "relative",
//                           left: "10px",
//                         }}
//                         onError={(e) => {
//                           e.target.src = images;
//                         }}
//                       />
//                     </Link>
//                   </div>
//                   <div className="col-9 pt-2 pb-2">
//                     <div className="row">
//                       <div className="col-9 my-auto">
//                         <h5 className="title text-truncate">
//                           {item.menu_name}
//                         </h5>
//                       </div>
//                       <div className="col-3 text-end pe-4">
//                         <div onClick={() => removeFromCart(item)}>
//                           <i
//                             className="ri-close-line fs-3"
//                             style={{ color: "#818180" }}
//                           ></i>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div
//                         className="col-5 fs-6 text-truncate fw-medium my-auto"
//                         style={{ color: "#438a3c" }}
//                       >
//                         <i className="ri-restaurant-line me-2"></i>
//                         {item.menu_cat_name}
//                       </div>
//                       <div className="col-3 px-0 ps-1">
//                         <div
//                           className="offer-code my-auto"
//                           style={{ width: "100px" }}
//                         >
//                           {Array.from({ length: 5 }).map((_, index) =>
//                             index < item.spicy_index ? (
//                               <i
//                                 className="ri-fire-fill fs-6"
//                                 style={{ fontSize: "12px", color: "#eb8e57" }}
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
//                       <div className="col-4 px-0 ps-1 text-center">
//                         <span className="fw-semibold">
//                           <i
//                             className="ri-star-half-line px-1"
//                             style={{ color: "#fda200" }}
//                           ></i>{" "}
//                           4.9
//                         </span>
//                       </div>
//                     </div>
//                     <div className="row pt-2">
//                       <div className="col-6 mx-0 my-auto px-0">
//                         <p className="mb-2 fs-4 fw-medium">
//                           <span className="ms-3 me-2 text-info">
//                             ₹{item.price}
//                           </span>
//                           <span className="text-muted fs-6 text-decoration-line-through">
//                             ₹{item.oldPrice || item.price}
//                           </span>
//                           <span className="fs-6 ps-2 text-primary">
//                             {item.offer || "No "}% Off
//                           </span>
//                         </p>
//                       </div>
//                       <div className="col-3 px-0 pt-1"></div>
//                       <div className="col-3">
//                         <div className="d-flex justify-content-end align-items-center">
//                           <i
//                             className="ri-subtract-line mx-2"
//                             style={{ fontSize: "18px", cursor: "pointer" }}
//                             onClick={() => decrementQuantity(item)}
//                           ></i>
//                           <span className="text-light ">{item.quantity}</span>
//                           <i
//                             className="ri-add-line mx-2"
//                             style={{ fontSize: "18px", cursor: "pointer" }}
//                             onClick={() => incrementQuantity(item)}
//                           ></i>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {cartDetails && displayCartItems.length > 0 && (
//               <div className="container mb-5 pb-5 z-3 pt-10">
//                 <div className="card-body mt-2" style={{ padding: "0px" }}>
//                   <div className="card mx-auto">
//                     <div className="row px-1 py-1">
//                       <div className="col-12">
//                         <div className="d-flex justify-content-between align-items-center py-0">
//                           <span className="ps-2 fs-5">Total</span>
//                           <span className="pe-2 fs-5 fw-semibold">
//                             ₹{cartDetails?.total_bill || 0}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="col-12">
//                         <div className="d-flex justify-content-between align-items-center py-0">
//                           <span
//                             className="ps-2 fs-5"
//                             style={{ color: "#a5a5a5" }}
//                           >
//                             Service Charges (
//                             {cartDetails.service_charges_percent}%)
//                           </span>
//                           <span className="pe-2 fs-5 fw-semibold">
//                             ₹{cartDetails?.service_charges_amount || 0}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="col-12 mb-0">
//                         <div className="d-flex justify-content-between align-items-center py-0">
//                           <span
//                             className="ps-2 fs-5"
//                             style={{ color: "#a5a5a5" }}
//                           >
//                             GST ({cartDetails.gst_percent}%)
//                           </span>
//                           <span className="pe-2 fs-5 fw-semibold">
//                             ₹{cartDetails?.gst_amount || 0}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="col-12 mb-0">
//                         <div className="d-flex justify-content-between align-items-center py-0">
//                           <span
//                             className="ps-2 fs-5"
//                             style={{ color: "#a5a5a5" }}
//                           >
//                             Discount({cartDetails?.discount_percent || 0}%)
//                           </span>
//                           <span className="pe-2 fs-5 fw-semibold">
//                             ₹{cartDetails?.discount_amount || 0}
//                           </span>
//                         </div>
//                       </div>
//                       <div>
//                         <hr
//                           className="dashed-line me-3 p-0 m-0"
//                           style={{ color: "#0d775e" }}
//                         />
//                       </div>
//                       <div className="col-12">
//                         <div className="d-flex justify-content-between align-items-center py-1 fw-medium pb-0 mb-0">
//                           <span className="ps-2 fs-5 fw-semibold">
//                             Grand Total
//                           </span>
//                           <span className="pe-2 fs-5 fw-semibold">
//                             ₹{cartDetails?.grand_total || 0}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="container d-flex align-items-center justify-content-center">
//                   <Link
//                     to="/Checkout"
//                     state={{ cartItems: displayCartItems }}
//                     className="btn btn-lg btn-thin rounded-xl btn-primary px-5"
//                   >
//                     Proceed to Buy &nbsp;{" "}
//                     <b>({displayCartItems.length} items)</b>
//                   </Link>
//                 </div>
//               </div>
//             )}
//           </div>
//         </main>
//       )}
//       <Bottom />
//     </div>
//   );
// };

// export default Cart;

// import React, { useEffect, useState,useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import SigninButton from "../constants/SigninButton";
// import Bottom from "../component/bottom";
// import "../assets/css/custom.css";
// import { UserContext } from "../context/UserContext";

// const Cart = () => {
//   const { userData } = useContext(UserContext);
//   const [cartDetails, setCartDetails] = useState({ order_items: [] });
//   const navigate = useNavigate();

//   const getCustomerId = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     return userData ? userData.customer_id : null;
//   };

//   const getRestaurantId = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     return userData && userData.restaurantId ? userData.restaurantId : null;
//   };

//   const getCartId = () => {
//     const cartId = localStorage.getItem("cartId");
//     return cartId ? parseInt(cartId, 10) : 1;
//   };

//   useEffect(() => {
//     // fetchCartDetails();
//   }, []);

//   const fetchCartDetails = async () => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     if (!customerId || !restaurantId) {
//       console.error("Customer ID or Restaurant ID is not available.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_cart_detail_add_to_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data.st === 1) {
//         setCartDetails(data);
//       } else if (data.st === 2) {
//         setCartDetails({ order_items: [] });
//       } else {
//         console.error("Failed to fetch cart details:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error fetching cart details:", error);
//     }
//   };

//   const removeFromCart = async (item) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();
//     const menuId = item.menu_id;

//     // Update local storage to remove the item
//     const currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];
//     const updatedCart = currentCart.filter(
//       (cartItem) => cartItem.menu_id !== menuId
//     );
//     localStorage.setItem("cartItems", JSON.stringify(updatedCart));

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/remove_from_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.st === 1) {
//         console.log("Item removed from cart successfully.");
//         fetchCartDetails(); // Refresh cart details
//       } else {
//         console.error("Failed to remove item from cart:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error removing item from cart:", error);
//     }
//   };

//   const updateCartQuantity = async (menuId, newQuantity) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/update_cart_menu_quantity",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//             quantity: newQuantity,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.st === 1) {
//         console.log("Menu quantity updated successfully.");
//         fetchCartDetails();
//       } else {
//         console.error("Failed to update menu quantity:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error updating menu quantity:", error);
//     }
//   };

//   const incrementQuantity = (item) => {
//     const newQuantity = item.quantity + 1;
//     updateCartQuantity(item.menu_id, newQuantity);
//   };

//   const decrementQuantity = (item) => {
//     if (item.quantity > 1) {
//       const newQuantity = item.quantity - 1;
//       updateCartQuantity(item.menu_id, newQuantity);
//     }
//   };

//   const displayCartItems = cartDetails.order_items.length > 0 ? cartDetails.order_items : JSON.parse(localStorage.getItem("cartItems")) || [];

//   return (
//     <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link to={`/HomeScreen/${userData?.restaurantId || ''}/${userData?.tableNumber || ''}`} className="back-btn dz-icon icon-sm">
//   <i className="ri-arrow-left-line fs-2"></i>
// </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">
//               My Cart{" "}
//               {displayCartItems.length > 0 && (
//                 <span className="">({displayCartItems.length})</span>
//               )}
//             </h5>
//           </div>
//         </div>
//       </header>

//       {displayCartItems.length === 0 ? (
//         <main className="page-content space-top p-b100">
//           <div className="container overflow-hidden">
//             <div className="m-b20 dz-flex-box">
//               <div className="dz-cart-about text-center">
//                 <h5 className="title">Your Cart is Empty</h5>
//                 <p>Add items to your cart from the product details page.</p>
//                 <Link to="/Category" className="btn btn-outline-primary btn-sm">
//                   Return to Shop
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </main>
//       ) : (
//         <main className="page-content space-top p-b200">
//           <div className="container scrollable-section">
//             {displayCartItems.map((item, index) => (
//               <div
//                 key={index}
//                 className="card mb-3"
//                 style={{
//                   borderRadius: "15px",
//                   boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                 }}
//               >
//                 <div className="row my-auto" style={{ height: "110px" }}>
//                   <div className="col-3 px-0">
//                     <Link to={`/ProductDetails/${item.menu_id}`}>
//                       <img
//                         src={item.image || images}
//                         alt={item.menu_name}
//                         style={{
//                           height: "110px",
//                           width: "110px",
//                           objectFit: "cover",
//                           borderRadius: "10px",
//                           position: "relative",
//                           left: "10px",
//                         }}
//                         onError={(e) => {
//                           e.target.src = images;
//                         }}
//                       />
//                     </Link>
//                   </div>
//                   <div className="col-9 pt-2 pb-2">
//                     <div className="row">
//                       <div className="col-9 my-auto">
//                         <h5 className="title text-truncate">
//                           {item.menu_name}
//                         </h5>
//                       </div>
//                       <div className="col-3 text-end pe-4">
//                         <div onClick={() => removeFromCart(item)}>
//                           <i
//                             className="ri-close-line fs-3"
//                             style={{ color: "#818180" }}
//                           ></i>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div
//                         className="col-5 fs-6 text-truncate fw-medium my-auto"
//                         style={{ color: "#438a3c" }}
//                       >
//                         <i className="ri-restaurant-line me-2"></i>
//                         {item.menu_cat_name}
//                       </div>
//                       <div className="col-3 px-0 ps-1">
//                         <div
//                           className="offer-code my-auto"
//                           style={{ width: "100px" }}
//                         >
//                           {Array.from({ length: 5 }).map((_, index) =>
//                             index < item.spicy_index ? (
//                               <i
//                                 className="ri-fire-fill fs-6"
//                                 style={{ fontSize: "12px", color: "#eb8e57" }}
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
//                       <div className="col-4 px-0 ps-1 text-center">
//                         <span className="fw-semibold">
//                           <i
//                             className="ri-star-half-line px-1"
//                             style={{ color: "#fda200" }}
//                           ></i>{" "}
//                           4.9
//                         </span>
//                       </div>
//                     </div>
//                     <div className="row pt-2">
//                       <div className="col-6 mx-0 my-auto px-0">
//                         <p className="mb-2 fs-4 fw-medium">
//                           <span className="ms-3 me-2 text-info">
//                             ₹{item.price}
//                           </span>
//                           <span className="text-muted fs-6 text-decoration-line-through">
//                             ₹{item.oldPrice || item.price}
//                           </span>
//                           <span className="fs-6 ps-2 text-primary">
//                             {item.offer || "No "}% Off
//                           </span>
//                         </p>
//                       </div>
//                       <div className="col-3 px-0 pt-1"></div>
//                       <div className="col-3">
//                         <div className="d-flex justify-content-end align-items-center">
//                           <i
//                             className="ri-subtract-line mx-2"
//                             style={{ fontSize: "18px", cursor: "pointer" }}
//                             onClick={() => decrementQuantity(item)}
//                           ></i>
//                           <span className="text-light ">{item.quantity}</span>
//                           <i
//                             className="ri-add-line mx-2"
//                             style={{ fontSize: "18px", cursor: "pointer" }}
//                             onClick={() => incrementQuantity(item)}
//                           ></i>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           {cartDetails && displayCartItems.length > 0 && (
//             <div className="container mb-5 pb-5 z-3 pt-10">
//               <div className="card-body mt-2" style={{ padding: "0px" }}>
//                 <div className="card mx-auto">
//                   <div className="row px-1 py-1">
//                     <div className="col-12">
//                       <div className="d-flex justify-content-between align-items-center py-0">
//                         <span className="ps-2 fs-5">Total</span>
//                         <span className="pe-2 fs-5 fw-semibold">
//                           ₹{cartDetails?.total_bill || 0}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="col-12">
//                       <div className="d-flex justify-content-between align-items-center py-0">
//                         <span
//                           className="ps-2 fs-5"
//                           style={{ color: "#a5a5a5" }}
//                         >
//                           Service Charges ({cartDetails.service_charges_percent}
//                           %)
//                         </span>
//                         <span className="pe-2 fs-5 fw-semibold">
//                           ₹{cartDetails?.service_charges_amount || 0}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="col-12 mb-0">
//                       <div className="d-flex justify-content-between align-items-center py-0">
//                         <span
//                           className="ps-2 fs-5"
//                           style={{ color: "#a5a5a5" }}
//                         >
//                           GST ({cartDetails.gst_percent}%)
//                         </span>
//                         <span className="pe-2 fs-5 fw-semibold">
//                           ₹{cartDetails?.gst_amount || 0}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="col-12 mb-0">
//                       <div className="d-flex justify-content-between align-items-center py-0">
//                         <span
//                           className="ps-2 fs-5"
//                           style={{ color: "#a5a5a5" }}
//                         >
//                           Discount({cartDetails?.discount_percent || 0}%)
//                         </span>
//                         <span className="pe-2 fs-5 fw-semibold">
//                           ₹{cartDetails?.discount_amount || 0}
//                         </span>
//                       </div>
//                     </div>
//                     <div>
//                       <hr
//                         className="dashed-line me-3 p-0 m-0"
//                         style={{ color: "#0d775e" }}
//                       />
//                     </div>
//                     <div className="col-12">
//                       <div className="d-flex justify-content-between align-items-center py-1 fw-medium pb-0 mb-0">
//                         <span className="ps-2 fs-5 fw-semibold">
//                           Grand Total
//                         </span>
//                         <span className="pe-2 fs-5 fw-semibold">
//                           ₹{cartDetails?.grand_total || 0}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="container d-flex align-items-center justify-content-center">
//                 <Link
//                   to="/Checkout"
//                   state={{ cartItems: displayCartItems }}
//                   className="btn btn-lg btn-thin rounded-xl btn-primary px-5"
//                 >
//                   Proceed to Buy &nbsp; <b>({displayCartItems.length} items)</b>
//                 </Link>
//               </div>
//             </div>
//           )}
//         </main>
//       )}
//       <Bottom />
//     </div>
//   );
// };

// export default Cart;

// -----------25-09---------

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import SigninButton from "../constants/SigninButton";
// import Bottom from "../component/bottom";
// import "../assets/css/custom.css";

// const Cart = () => {
//   const [userData, setUserData] = useState(null);
//   const [cartDetails, setCartDetails] = useState({ order_items: [] });
//   const navigate = useNavigate();

//   const getCustomerId = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     return userData ? userData.customer_id : null;
//   };

//   const getRestaurantId = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     return userData && userData.restaurantId ? userData.restaurantId : null;
//   };

//   const getCartId = () => {
//     const cartId = localStorage.getItem("cartId");
//     return cartId ? parseInt(cartId, 10) : 1;
//   };

//   useEffect(() => {
//     const storedUserData = JSON.parse(localStorage.getItem("userData"));
//     setUserData(storedUserData);
//     // fetchCartDetails();
//   }, []);

//   const fetchCartDetails = async () => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     if (!customerId || !restaurantId) {
//       console.error("Customer ID or Restaurant ID is not available.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_cart_detail_add_to_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data.st === 1) {
//         setCartDetails(data);
//       } else if (data.st === 2) {
//         setCartDetails({ order_items: [] });
//       } else {
//         console.error("Failed to fetch cart details:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error fetching cart details:", error);
//     }
//   };

//   const removeFromCart = async (item) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();
//     const menuId = item.menu_id;

//     // Update local storage to remove the item
//     const currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];
//     const updatedCart = currentCart.filter(
//       (cartItem) => cartItem.menu_id !== menuId
//     );
//     localStorage.setItem("cartItems", JSON.stringify(updatedCart));

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/remove_from_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.st === 1) {
//         console.log("Item removed from cart successfully.");
//         fetchCartDetails(); // Refresh cart details
//       } else {
//         console.error("Failed to remove item from cart:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error removing item from cart:", error);
//     }
//   };

//   const updateCartQuantity = async (menuId, newQuantity) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/update_cart_menu_quantity",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//             quantity: newQuantity,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.st === 1) {
//         console.log("Menu quantity updated successfully.");
//         fetchCartDetails();
//       } else {
//         console.error("Failed to update menu quantity:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error updating menu quantity:", error);
//     }
//   };

//   const incrementQuantity = (item) => {
//     const newQuantity = item.quantity + 1;
//     updateCartQuantity(item.menu_id, newQuantity);
//   };

//   const decrementQuantity = (item) => {
//     if (item.quantity > 1) {
//       const newQuantity = item.quantity - 1;
//       updateCartQuantity(item.menu_id, newQuantity);
//     }
//   };

//   const displayCartItems = cartDetails.order_items.length > 0 ? cartDetails.order_items : JSON.parse(localStorage.getItem("cartItems")) || [];

//   return (
//     <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link to={`/HomeScreen/${userData?.restaurantId || ''}/${userData?.tableNumber || ''}`} className="back-btn dz-icon icon-sm">
//               <i className="ri-arrow-left-line fs-2"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">
//               My Cart{" "}
//               {displayCartItems.length > 0 && (
//                 <span className="">({displayCartItems.length})</span>
//               )}
//             </h5>
//           </div>
//         </div>
//       </header>

//       {displayCartItems.length === 0 ? (
//         <main className="page-content space-top p-b100">
//           <div className="container overflow-hidden">
//             <div className="m-b20 dz-flex-box">
//               <div className="dz-cart-about text-center">
//                 <h5 className="title">Your Cart is Empty</h5>
//                 <p>Add items to your cart from the product details page.</p>
//                 <Link to="/Category" className="btn btn-outline-primary btn-sm">
//                   Return to Shop
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </main>
//       ) : (
//         <main className="page-content space-top p-b200">
//           <div className="container scrollable-section">
//             {displayCartItems.map((item, index) => (
//               <div
//                 key={index}
//                 className="card mb-3"
//                 style={{
//                   borderRadius: "15px",
//                   boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                 }}
//               >
//                 <div className="row my-auto" style={{ height: "110px" }}>
//                   <div className="col-3 px-0">
//                     <Link to={`/ProductDetails/${item.menu_id}`}>
//                       <img
//                         src={item.image || images}
//                         alt={item.menu_name}
//                         style={{
//                           height: "110px",
//                           width: "110px",
//                           objectFit: "cover",
//                           borderRadius: "10px",
//                           position: "relative",
//                           left: "10px",
//                         }}
//                         onError={(e) => {
//                           e.target.src = images;
//                         }}
//                       />
//                     </Link>
//                   </div>
//                   <div className="col-9 pt-2 pb-2">
//                     <div className="row">
//                       <div className="col-9 my-auto">
//                         <h5 className="title text-truncate">
//                           {item.menu_name}
//                         </h5>
//                       </div>
//                       <div className="col-3 text-end pe-4">
//                         <div onClick={() => removeFromCart(item)}>
//                           <i
//                             className="ri-close-line fs-3"
//                             style={{ color: "#818180" }}
//                           ></i>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div
//                         className="col-5 fs-6 text-truncate fw-medium my-auto"
//                         style={{ color: "#438a3c" }}
//                       >
//                         <i className="ri-restaurant-line me-2"></i>
//                         {item.menu_cat_name}
//                       </div>
//                       <div className="col-3 px-0 ps-1">
//                         <div
//                           className="offer-code my-auto"
//                           style={{ width: "100px" }}
//                         >
//                           {Array.from({ length: 5 }).map((_, index) =>
//                             index < item.spicy_index ? (
//                               <i
//                                 className="ri-fire-fill fs-6"
//                                 style={{ fontSize: "12px", color: "#eb8e57" }}
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
//                       <div className="col-4 px-0 ps-1 text-center">
//                         <span className="fw-semibold">
//                           <i
//                             className="ri-star-half-line px-1"
//                             style={{ color: "#fda200" }}
//                           ></i>{" "}
//                           4.9
//                         </span>
//                       </div>
//                     </div>
//                     <div className="row pt-2">
//                       <div className="col-6 mx-0 my-auto px-0">
//                         <p className="mb-2 fs-4 fw-medium">
//                           <span className="ms-3 me-2 text-info">
//                             ₹{item.price}
//                           </span>
//                           <span className="text-muted fs-6 text-decoration-line-through">
//                             ₹{item.oldPrice || item.price}
//                           </span>
//                           <span className="fs-6 ps-2 text-primary">
//                             {item.offer || "No "}% Off
//                           </span>
//                         </p>
//                       </div>
//                       <div className="col-3 px-0 pt-1"></div>
//                       <div className="col-3">
//                         <div className="d-flex justify-content-end align-items-center">
//                           <i
//                             className="ri-subtract-line mx-2"
//                             style={{ fontSize: "18px", cursor: "pointer" }}
//                             onClick={() => decrementQuantity(item)}
//                           ></i>
//                           <span className="text-light ">{item.quantity}</span>
//                           <i
//                             className="ri-add-line mx-2"
//                             style={{ fontSize: "18px", cursor: "pointer" }}
//                             onClick={() => incrementQuantity(item)}
//                           ></i>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           {cartDetails && displayCartItems.length > 0 && (
//             <div className="container mb-5 pb-5 z-3 pt-10">
//               <div className="card-body mt-2" style={{ padding: "0px" }}>
//                 <div className="card mx-auto">
//                   <div className="row px-1 py-1">
//                     <div className="col-12">
//                       <div className="d-flex justify-content-between align-items-center py-0">
//                         <span className="ps-2 fs-5">Total</span>
//                         <span className="pe-2 fs-5 fw-semibold">
//                           ₹{cartDetails?.total_bill || 0}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="col-12">
//                       <div className="d-flex justify-content-between align-items-center py-0">
//                         <span
//                           className="ps-2 fs-5"
//                           style={{ color: "#a5a5a5" }}
//                         >
//                           Service Charges ({cartDetails.service_charges_percent}
//                           %)
//                         </span>
//                         <span className="pe-2 fs-5 fw-semibold">
//                           ₹{cartDetails?.service_charges_amount || 0}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="col-12 mb-0">
//                       <div className="d-flex justify-content-between align-items-center py-0">
//                         <span
//                           className="ps-2 fs-5"
//                           style={{ color: "#a5a5a5" }}
//                         >
//                           GST ({cartDetails.gst_percent}%)
//                         </span>
//                         <span className="pe-2 fs-5 fw-semibold">
//                           ₹{cartDetails?.gst_amount || 0}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="col-12 mb-0">
//                       <div className="d-flex justify-content-between align-items-center py-0">
//                         <span
//                           className="ps-2 fs-5"
//                           style={{ color: "#a5a5a5" }}
//                         >
//                           Discount({cartDetails?.discount_percent || 0}%)
//                         </span>
//                         <span className="pe-2 fs-5 fw-semibold">
//                           ₹{cartDetails?.discount_amount || 0}
//                         </span>
//                       </div>
//                     </div>
//                     <div>
//                       <hr
//                         className="dashed-line me-3 p-0 m-0"
//                         style={{ color: "#0d775e" }}
//                       />
//                     </div>
//                     <div className="col-12">
//                       <div className="d-flex justify-content-between align-items-center py-1 fw-medium pb-0 mb-0">
//                         <span className="ps-2 fs-5 fw-semibold">
//                           Grand Total
//                         </span>
//                         <span className="pe-2 fs-5 fw-semibold">
//                           ₹{cartDetails?.grand_total || 0}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="container d-flex align-items-center justify-content-center">
//                 <Link
//                   to="/Checkout"
//                   state={{ cartItems: displayCartItems }}
//                   className="btn btn-lg btn-thin rounded-xl btn-primary px-5"
//                 >
//                   Proceed to Buy &nbsp; <b>({displayCartItems.length} items)</b>
//                 </Link>
//               </div>
//             </div>
//           )}
//              </main>
//       )}
//       <Bottom />
//     </div>
//   );
// };

// export default Cart;

// 25------






// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import SigninButton from "../constants/SigninButton";
// import Bottom from "../component/bottom";
// import "../assets/css/custom.css";

// const Cart = () => {
//   const [userData, setUserData] = useState(null);
//   const [cartDetails, setCartDetails] = useState({ order_items: [] });
//   const navigate = useNavigate();

//   const getCustomerId = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     return userData ? userData.customer_id : null;
//   };

//   const getRestaurantId = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     return userData && userData.restaurantId ? userData.restaurantId : null;
//   };

//   const getCartId = () => {
//     const cartId = localStorage.getItem("cartId");
//     return cartId ? parseInt(cartId, 10) : 1;
//   };

//   useEffect(() => {
//     const storedUserData = JSON.parse(localStorage.getItem("userData"));
//     setUserData(storedUserData);
//     fetchCartDetails();
//   }, []);

//   const fetchCartDetails = async () => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     if (!customerId || !restaurantId) {
//       console.error("Customer ID or Restaurant ID is not available.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_cart_detail",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data.st === 1) {
//         setCartDetails(data);
//       } else if (data.st === 2) {
//         setCartDetails({ order_items: [] });
//       } else {
//         console.error("Failed to fetch cart details:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error fetching cart details:", error);
//     }
//   };

//   const removeFromCart = async (item) => {
//   const customerId = getCustomerId();
//   const restaurantId = getRestaurantId();
//   const cartId = getCartId();
//   const menuId = item.menu_id;

//   try {
//     const response = await fetch(
//       "https://menumitra.com/user_api/remove_from_cart",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           cart_id: cartId,
//           customer_id: customerId,
//           restaurant_id: restaurantId,
//           menu_id: menuId,
//         }),
//       }
//     );

//     const data = await response.json();
//     if (data.st === 1) {
//       console.log("Item removed from cart successfully.");
//       removeCartItemById(menuId); // Remove item from local storage
//       fetchCartDetails(); // Refresh cart details
//     } else {
//       console.error("Failed to remove item from cart:", data.msg);
//     }
//   } catch (error) {
//     console.error("Error removing item from cart:", error);
//   }
// };

// const removeCartItemById = (menuId) => {
//   const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//   const updatedCartItems = cartItems.filter(item => item.menu_id !== menuId);
//   localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
// };

//   const updateCartQuantity = async (menuId, newQuantity) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/update_cart_menu_quantity",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//             quantity: newQuantity,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.st === 1) {
//         console.log("Menu quantity updated successfully.");
//         fetchCartDetails();
//       } else {
//         console.error("Failed to update menu quantity:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error updating menu quantity:", error);
//     }
//   };

//   const incrementQuantity = (item) => {
//     const newQuantity = item.quantity + 1;
//     updateCartQuantity(item.menu_id, newQuantity);
//   };

//   const decrementQuantity = (item) => {
//     if (item.quantity > 1) {
//       const newQuantity = item.quantity - 1;
//       updateCartQuantity(item.menu_id, newQuantity);
//     }
//   };

//   const displayCartItems = cartDetails.order_items;

//   return (
//     <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link
//               to={`/HomeScreen/${userData?.restaurantId || ""}/${
//                 userData?.tableNumber || ""
//               }`}
//               className="back-btn dz-icon icon-sm"
//             >
//               <i className="ri-arrow-left-line fs-2"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">
//               My Cart{" "}
//               {/* {displayCartItems.length > 0 && (
//                 <span className="">({displayCartItems.length})</span>
//               )} */}
//             </h5>
//           </div>
//         </div>
//       </header>

//       {displayCartItems.length === 0 ? (
//         <main className="page-content space-top p-b100">
//           <div className="container overflow-hidden">
//             <div className="m-b20 dz-flex-box">
//               <div className="dz-cart-about text-center">
//                 <h5 className="title">Your Cart is Empty</h5>
//                 <p>Add items to your cart from the product details page.</p>
//                 <Link to="/Category" className="btn btn-outline-primary btn-sm">
//                   Return to Shop
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </main>
//       ) : (
//         <main className="page-content space-top p-b200">
//           <div className="container scrollable-section">
//             <div className="container mt-0 pt-0 mb-0">
//               <div className="row">
//                 <div className="col-12 fw-medium text-end hotel-name">
//                   <span className="ps-2">{userData.restaurantName.toUpperCase()}</span>
//                   <i className="ri-store-2-line ps-2"></i>
//                   <h6 className="title fw-medium h6 custom-text-gray table-number pe-5 me-5">
//               Table: {userData.tableNumber || ""}
//             </h6>
//                 </div>
                  
//               </div>
//             </div>
//             {displayCartItems.map((item, index) => (
//               <div
//                 key={index}
//                 className="card mb-3"
//                 style={{
//                   borderRadius: "15px",
//                   boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                 }}
//               >
//                 <div className="row my-auto" style={{ height: "110px" }}>
//                   <div className="col-3 px-0">
//                     <Link to={`/ProductDetails/${item.menu_id}`}>
//                       <img
//                         src={item.image || images}
//                         alt={item.menu_name}
//                         style={{
//                           height: "110px",
//                           width: "110px",
//                           objectFit: "cover",
//                           borderRadius: "10px",
//                           position: "relative",
//                           left: "10px",
//                         }}
//                         onError={(e) => {
//                           e.target.src = images;
//                         }}
//                       />
//                     </Link>
//                   </div>
//                   <div className="col-9 pt-2 pb-2">
//                     <div className="row">
//                       <div className="col-9 my-auto">
//                         <h5 className="title text-truncate">
//                           {item.menu_name}
//                         </h5>
//                       </div>
//                       <div className="col-3 text-end pe-4">
//                         <div onClick={() => removeFromCart(item)}>
//                           <i
//                             className="ri-close-line fs-3"
//                             style={{ color: "#818180" }}
//                           ></i>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div
//                         className="col-5 fs-sm p-0 fw-medium ms-3"
//                         style={{ color: "#438a3c" }}
//                       >
//                         <i className="ri-restaurant-line me-2"></i>
//                         {item.menu_cat_name}
//                       </div>
//                       <div className="col-3 px-0 ps-1">
//                         <div className="offer-code my-auto ">
//                           {Array.from({ length: 5 }).map((_, index) => (
//                             <i
//                               key={index}
//                               className={`ri-fire-${
//                                 index < (item.spicy_index || 0)
//                                   ? "fill"
//                                   : "line"
//                               } fs-12px`}
//                               style={{
//                                 color:
//                                   index < (item.spicy_index || 0)
//                                     ? "#eb8e57"
//                                     : "#bbbaba",
//                               }}
//                             ></i>
//                           ))}
//                         </div>
//                       </div>
//                       <div className="col-3 ps-1 text-center">
//                         <span className="fw-semibold gray-text">
//                           <i
//                             className="ri-star-half-line px-1"
//                             style={{ color: "#fda200" }}
//                           ></i>{" "}
//                           4.9
//                         </span>
//                       </div>
//                     </div>
//                     <div className="row pt-2">
//                       <div className="col-10 mx-0 my-auto px-0">
//                         <p className="mb-2  fw-medium">
//                           <span className="ms-3 fs-4 me-2 text-info">
//                             ₹{item.price}
//                           </span>
//                           <span className="gray-text fs-sm text-decoration-line-through">
//                             ₹{item.oldPrice || item.price}
//                           </span>
//                           <span className="fs-6 ps-4 text-primary">
//                             {item.offer || "No "}% Off
//                           </span>
//                         </p>
//                       </div>

//                       <div className="col-2">
//                         <div className="d-flex justify-content-end align-items-center mt-1">
//                           <i
//                             className="ri-subtract-line fs-6 mx-2"
//                             style={{ cursor: "pointer" }}
//                             onClick={() => decrementQuantity(item)}
//                           ></i>
//                           <span className="text-light ">{item.quantity}</span>
//                           <i
//                             className="ri-add-line mx-2 fs-6"
//                             style={{ cursor: "pointer" }}
//                             onClick={() => incrementQuantity(item)}
//                           ></i>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           {cartDetails && displayCartItems.length > 0 && (
//             <div
//               className="pb-5 mb-5"
//               style={{ bottom: "75px", backgroundColor: "transparent" }}
//             >
//               <div className="card-body">
//                 <div className="card mx-auto">
//                   <div className="row px-1 py-1">
//                     <div className="col-12">
//                       <div className="d-flex justify-content-between align-items-center py-2">
//                         <span className="ps-2 fs-3 fw-medium">Total</span>

//                         <span className="pe-2 fs-3 fw-medium">
//                           ₹{cartDetails?.total_bill || 0}
//                         </span>
//                       </div>
//                       <hr
//                         className="dashed-line me-3 p-0 m-0"
//                         style={{ color: "#0d775e" }}
//                       />
//                     </div>
//                     <div className="col-12 py-1">
//                       <div className="d-flex justify-content-between align-items-center py-0">
//                         <span
//                           className="ps-2 fs-sm pt-1"
//                           style={{ color: "#a5a5a5" }}
//                         >
//                           Service Charges ({cartDetails.service_charges_percent}
//                           %)
//                         </span>
//                         <span className="pe-2 fs-sm fw-medium">
//                           ₹{cartDetails?.service_charges_amount || 0}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="col-12 mb-0 py-1">
//                       <div className="d-flex justify-content-between align-items-center py-0">
//                         <span
//                           className="ps-2 fs-sm"
//                           style={{ color: "#a5a5a5" }}
//                         >
//                           GST ({cartDetails.gst_percent}%)
//                         </span>
//                         <span className="pe-2 fs-sm fw-medium text-start">
//                           ₹{cartDetails?.gst_amount || 0}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="col-12 mb-0 pt-1 pb-2">
//                       <div className="d-flex justify-content-between align-items-center py-0">
//                         <span
//                           className="ps-2 fs-sm"
//                           style={{ color: "#a5a5a5" }}
//                         >
//                           Discount ({cartDetails?.discount_percent || 0}%)
//                         </span>
//                         <span className="pe-2 fs-sm fw-medium">
//                           ₹{cartDetails?.discount_amount || 0}
//                         </span>
//                       </div>
//                     </div>
//                     <div>
//                       <hr
//                         className="dashed-line me-3 p-0 m-0"
//                         style={{ color: "#0d775e" }}
//                       />
//                     </div>
//                     <div className="col-12 py-1">
//                       <div className="d-flex justify-content-between align-items-center py-1 fw-medium pb-0 mb-0">
//                         <span className="ps-2 fs-3 fw-medium">Grand Total</span>
//                         <span className="pe-2 fs-3 ">
//                           ₹{cartDetails?.grand_total || 0}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="container d-flex align-items-center justify-content-center pt-0">
//                 <Link
//                   to="/Checkout"
//                   state={{ cartItems: displayCartItems }}
//                   className="btn btn-lg btn-thin rounded-xl btn-primary px-5"
//                 >
//                   Proceed to Buy &nbsp; <b>({displayCartItems.length} items)</b>
//                 </Link>
//               </div>
//             </div>
//           )}
//         </main>
//       )}
//       <Bottom />
//     </div>
//   );
// };

// export default Cart;





// *******------*******



// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import SigninButton from "../constants/SigninButton";
// import Bottom from "../component/bottom";
// import "../assets/css/custom.css";

// const Cart = () => {
//   const [userData, setUserData] = useState(null);
//   const [cartDetails, setCartDetails] = useState({ order_items: [] });
//   const navigate = useNavigate();

//   const getCustomerId = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     return userData ? userData.customer_id : null;
//   };

//   const getRestaurantId = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     return userData && userData.restaurantId ? userData.restaurantId : null;
//   };

//   const getCartId = () => {
//     const cartId = localStorage.getItem("cartId");
//     return cartId ? parseInt(cartId, 10) : 1;
//   };

//   useEffect(() => {
//     const storedUserData = JSON.parse(localStorage.getItem("userData"));
//     setUserData(storedUserData);
//     fetchCartDetails();
//   }, []);

//   const fetchCartDetails = async () => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     if (!customerId || !restaurantId) {
//       console.error("Customer ID or Restaurant ID is not available.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_cart_detail_add_to_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data.st === 1) {
//         setCartDetails(data);
//       } else if (data.st === 2) {
//         setCartDetails({ order_items: [] });
//       } else {
//         console.error("Failed to fetch cart details:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error fetching cart details:", error);
//     }
//   };

//   const removeFromCart = async (item) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();
//     const menuId = item.menu_id;

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/remove_from_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.st === 1) {
//         console.log("Item removed from cart successfully.");
//         removeCartItemById(menuId); // Remove item from local storage
//         fetchCartDetails(); // Refresh cart details
//       } else {
//         console.error("Failed to remove item from cart:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error removing item from cart:", error);
//     }
//   };

//   const removeCartItemById = (menuId) => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     const updatedCartItems = cartItems.filter(
//       (item) => item.menu_id !== menuId
//     );
//     localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
//   };

//   const updateCartQuantity = async (menuId, quantity) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/update_cart_quantity",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//             quantity: quantity,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.st === 1) {
//         fetchCartDetails(); // Refresh cart details
//       } else {
//         console.error("Failed to update cart quantity:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error updating cart quantity:", error);
//     }
//   };

//   const incrementQuantity = (item) => {
//     const newQuantity = item.quantity + 1;
//     updateCartQuantity(item.menu_id, newQuantity);
//   };

//   const decrementQuantity = (item) => {
//     if (item.quantity > 1) {
//       const newQuantity = item.quantity - 1;
//       updateCartQuantity(item.menu_id, newQuantity);
//     }
//   };

//   const displayCartItems = cartDetails.order_items;

//   return (
//     <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link
//               to={`/HomeScreen/${userData?.restaurantId || ""}/${
//                 userData?.tableNumber || ""
//               }`}
//               className="back-btn dz-icon icon-sm"
//             >
//               <i className="ri-arrow-left-line fs-2"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">
//               My Cart{" "}
//               {/* {displayCartItems.length > 0 && (
//                 <span className="">({displayCartItems.length})</span>
//               )} */}
//             </h5>
//           </div>
//         </div>
//       </header>

//       {displayCartItems.length === 0 ? (
//         <main className="page-content space-top p-b100">
//           <div className="container overflow-hidden">
//             <div className="m-b20 dz-flex-box">
//               <div className="dz-cart-about text-center">
//                 <h5 className="title">Your Cart is Empty</h5>
//                 <p>Add items to your cart from the product details page.</p>
//                 <Link to="/Category" className="btn btn-outline-primary btn-sm">
//                   Return to Shop
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </main>
//       ) : (
//         <main className="page-content space-top p-b200">
//           <div className="container scrollable-section">
//             <div className="container mt-0 pt-0 mb-0">
//               <div className="row">
//                 <div className="col-12 fw-medium text-end hotel-name">
//                   <span className="ps-2">
//                     {userData.restaurantName.toUpperCase()}
//                   </span>
//                   <i className="ri-store-2-line ps-2"></i>
//                   <h6 className="title fw-medium h6 custom-text-gray table-number pe-5 me-5">
//                     Table: {userData.tableNumber || ""}
//                   </h6>
//                 </div>
//               </div>
//             </div>
//             {displayCartItems.map((item, index) => (
//               <div
//                 key={index}
//                 className="card mb-3"
//                 style={{
//                   borderRadius: "15px",
//                   boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                 }}
//               >
//                 <div className="row my-auto" style={{ height: "110px" }}>
//                   <div className="col-3 px-0">
//                     <Link to={`/ProductDetails/${item.menu_id}`}>
//                       <img
//                         src={item.image || images}
//                         alt={item.menu_name}
//                         style={{
//                           height: "110px",
//                           width: "110px",
//                           objectFit: "cover",
//                           borderRadius: "10px",
//                           position: "relative",
//                           left: "10px",
//                         }}
//                         onError={(e) => {
//                           e.target.src = images;
//                         }}
//                       />
//                     </Link>
//                   </div>
//                   <div className="col-9 pt-2 pb-2">
//                     <div className="row">
//                       <div className="col-9 my-auto">
//                         <h5 className="title text-truncate">
//                           {item.menu_name}
//                         </h5>
//                       </div>
//                       <div className="col-3 text-end pe-4">
//                         <div onClick={() => removeFromCart(item)}>
//                           <i
//                             className="ri-close-line fs-4"
//                             style={{ color: "#818180" }}
//                           ></i>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div
//                         className="col-5 fs-sm p-0 fw-medium ms-3"
//                         style={{ color: "#438a3c" }}
//                       >
//                         <i className="ri-restaurant-line me-2"></i>
//                         {item.menu_cat_name}
//                       </div>
//                       <div className="col-3 px-0 ps-1">
//                         <div className="offer-code my-auto ">
//                           {Array.from({ length: 5 }).map((_, index) => (
//                             <i
//                               key={index}
//                               className={`ri-fire-${
//                                 index < (item.spicy_index || 0)
//                                   ? "fill fs-6"
//                                   : "line fs-6"
//                               }`}
//                               style={{
//                                 color:
//                                   index < (item.spicy_index || 0)
//                                     ? "#eb8e57"
//                                     : "#bbbaba",
//                               }}
//                             ></i>
//                           ))}
//                         </div>
//                       </div>
//                       <div className="col-3 ps-1 text-center">
//                         <span className="fw-semibold gray-text">
//                           <i
//                             className="ri-star-half-line px-1"
//                             style={{ color: "#fda200" }}
//                           ></i>{" "}
//                           4.9
//                         </span>
//                       </div>
//                     </div>
//                     <div className="row pt-2">
//                       <div className="col-10 mx-0 my-auto px-0">
//                         <p className="mb-2  fw-medium">
//                           <span className="ms-3 fs-4 me-2 text-info">
//                             ₹{item.price}
//                           </span>
//                           <span className="gray-text fs-sm text-decoration-line-through">
//                             ₹{item.oldPrice || item.price}
//                           </span>
//                           <span className="fs-6 ps-4 text-primary">
//                             {item.offer || "No "}% Off
//                           </span>
//                         </p>
//                       </div>

//                       <div className="col-2">
//                         <div className="d-flex justify-content-end align-items-center mt-1">
//                           <i
//                             className="ri-subtract-line fs-6 mx-2"
//                             style={{ cursor: "pointer" }}
//                             onClick={() => decrementQuantity(item)}
//                           ></i>
//                           <span className="text-light ">{item.quantity}</span>
//                           <i
//                             className="ri-add-line mx-2 fs-6"
//                             style={{ cursor: "pointer" }}
//                             onClick={() => incrementQuantity(item)}
//                           ></i>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           {cartDetails && displayCartItems.length > 0 && (
//             <div
//               className="pb-5 mb-5"
//               style={{ bottom: "75px", backgroundColor: "transparent" }}
//             >
//               <div className="card-body">
//                 <div className="card mx-auto">
//                   <div className="row px-1 py-1">
//                     <div className="col-12">
//                       <div className="d-flex justify-content-between align-items-center py-2">
//                         <span className="ps-2 fs-3 fw-medium">Total</span>

//                         <span className="pe-2 fs-3 fw-medium">
//                           ₹{cartDetails?.total_bill || 0}
//                         </span>
//                       </div>
//                       <hr
//                         className="dashed-line me-3 p-0 m-0"
//                         style={{ color: "#0d775e" }}
//                       />
//                     </div>
//                     <div className="col-12 py-1">
//                       <div className="d-flex justify-content-between align-items-center py-0">
//                         <span
//                           className="ps-2 fs-sm pt-1"
//                           style={{ color: "#a5a5a5" }}
//                         >
//                           Service Charges ({cartDetails.service_charges_percent}
//                           %)
//                         </span>
//                         <span className="pe-2 fs-sm fw-medium">
//                           ₹{cartDetails?.service_charges_amount || 0}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="col-12 mb-0 py-1">
//                       <div className="d-flex justify-content-between align-items-center py-0">
//                         <span
//                           className="ps-2 fs-sm"
//                           style={{ color: "#a5a5a5" }}
//                         >
//                           GST ({cartDetails.gst_percent}%)
//                         </span>
//                         <span className="pe-2 fs-sm fw-medium text-start">
//                           ₹{cartDetails?.gst_amount || 0}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="col-12 mb-0 pt-1 pb-2">
//                       <div className="d-flex justify-content-between align-items-center py-0">
//                         <span
//                           className="ps-2 fs-sm"
//                           style={{ color: "#a5a5a5" }}
//                         >
//                           Discount ({cartDetails?.discount_percent || 0}%)
//                         </span>
//                         <span className="pe-2 fs-sm fw-medium">
//                           ₹{cartDetails?.discount_amount || 0}
//                         </span>
//                       </div>
//                     </div>
//                     <div>
//                       <hr
//                         className="dashed-line me-3 p-0 m-0"
//                         style={{ color: "#0d775e" }}
//                       />
//                     </div>
//                     <div className="col-12 py-1">
//                       <div className="d-flex justify-content-between align-items-center py-1 fw-medium pb-0 mb-0">
//                         <span className="ps-2 fs-3 fw-medium">Grand Total</span>
//                         <span className="pe-2 fs-3 ">
//                           ₹{cartDetails?.grand_total || 0}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="container d-flex align-items-center justify-content-center pt-0">
//                 <Link
//                   to="/Checkout"
//                   state={{ cartItems: displayCartItems }}
//                   className="btn btn-lg btn-thin rounded-xl btn-primary px-5"
//                 >
//                   Proceed to Buy &nbsp; <b>({displayCartItems.length} items)</b>
//                 </Link>
//               </div>
//             </div>
//           )}
//         </main>
//       )}
//       <Bottom />
//     </div>
//   );
// };

// export default Cart;



// *-*-*-*27


// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import SigninButton from "../constants/SigninButton";
// import Bottom from "../component/bottom";
// import "../assets/css/custom.css";

// const Cart = () => {
//   const [userData, setUserData] = useState(null);
//   const [cartDetails, setCartDetails] = useState({ order_items: [] });
//   const navigate = useNavigate();

//   const getCustomerId = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     return userData ? userData.customer_id : null;
//   };

//   const getRestaurantId = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     return userData && userData.restaurantId ? userData.restaurantId : null;
//   };

//   const getCartId = () => {
//     const cartId = localStorage.getItem("cartId");
//     return cartId ? parseInt(cartId, 10) : 1;
//   };

//   useEffect(() => {
//     const storedUserData = JSON.parse(localStorage.getItem("userData"));
//     setUserData(storedUserData);
//     fetchCartDetails();
//   }, []);

//   const fetchCartDetails = async () => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     if (!customerId || !restaurantId) {
//       console.error("Customer ID or Restaurant ID is not available.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_cart_detail_add_to_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data.st === 1) {
//         setCartDetails(data);
//       } else if (data.st === 2) {
//         setCartDetails({ order_items: [] });
//       } else {
//         console.error("Failed to fetch cart details:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error fetching cart details:", error);
//     }
//   };

//   const removeFromCart = async (item) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();
//     const menuId = item.menu_id;

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/remove_from_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.st === 1) {
//         console.log("Item removed from cart successfully.");
//         removeCartItemById(menuId); // Remove item from local storage
//         fetchCartDetails(); // Refresh cart details
//       } else {
//         console.error("Failed to remove item from cart:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error removing item from cart:", error);
//     }
//   };

//   const removeCartItemById = (menuId) => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     const updatedCartItems = cartItems.filter(
//       (item) => item.menu_id !== menuId
//     );
//     localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
//   };

//   const updateCartQuantity = async (menuId, quantity) => {
//     const customerId = getCustomerId();
//     const restaurantId = getRestaurantId();
//     const cartId = getCartId();

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/update_cart_quantity",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             cart_id: cartId,
//             customer_id: customerId,
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//             quantity: quantity,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.st === 1) {
//         fetchCartDetails(); // Refresh cart details
//       } else {
//         console.error("Failed to update cart quantity:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error updating cart quantity:", error);
//     }
//   };

//   const incrementQuantity = (item) => {
//     const newQuantity = item.quantity + 1;
//     updateCartQuantity(item.menu_id, newQuantity);
//   };

//   const decrementQuantity = (item) => {
//     if (item.quantity > 1) {
//       const newQuantity = item.quantity - 1;
//       updateCartQuantity(item.menu_id, newQuantity);
//     }
//   };

//   const displayCartItems = cartDetails.order_items;

//   return (
//     <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link
//               to={`/HomeScreen/${userData?.restaurantId || ""}/${
//                 userData?.tableNumber || ""
//               }`}
//               className="back-btn dz-icon icon-sm"
//             >
//               <i className="ri-arrow-left-line fs-2"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">
//               My Cart{" "}
//               {/* {displayCartItems.length > 0 && (
//                 <span className="">({displayCartItems.length})</span>
//               )} */}
//             </h5>
//           </div>
//         </div>
//       </header>

//       {displayCartItems.length === 0 ? (
//         <main className="page-content space-top p-b100">
//           <div className="container overflow-hidden">
//             <div className="m-b20 dz-flex-box">
//               <div className="dz-cart-about text-center">
//                 <h5 className="title">Your Cart is Empty</h5>
//                 <p>Add items to your cart from the product details page.</p>
//                 <Link to="/Category" className="btn btn-outline-primary btn-sm">
//                   Return to Shop
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </main>
//       ) : (
//         <main className="page-content space-top p-b200">
//           <div className="container scrollable-section">
//             <div className="container mt-0 pt-0 mb-0">
//               <div className="row">
//                 <div className="col-12 fw-medium text-end hotel-name">
//                   <span className="ps-2">
//                     {userData.restaurantName.toUpperCase()}
//                   </span>
//                   <i className="ri-store-2-line ps-2"></i>
//                   <h6 className="title fw-medium h6 custom-text-gray table-number pe-5 me-5">
//                     Table: {userData.tableNumber || ""}
//                   </h6>
//                 </div>
//               </div>
//             </div>
//             {displayCartItems.map((item, index) => (
//               <div
//                 key={index}
//                 className="card mb-3"
//                 style={{
//                   borderRadius: "15px",
//                   boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                 }}
//               >
//                 <div className="row my-auto" style={{ height: "110px" }}>
//                   <div className="col-3 px-0">
//                     <Link
//                       to={{
//                         pathname: `/ProductDetails/${item.menu_id}`,
//                       }}
//                       state={{
//                         restaurant_id: userData.restaurantId,
//                         menu_cat_id: item.menu_cat_id,
//                       }}
//                     >
//                       <img
//                         src={item.image || images}
//                         alt={item.menu_name}
//                         style={{
//                           height: "110px",
//                           width: "110px",
//                           objectFit: "cover",
//                           borderRadius: "10px",
//                           position: "relative",
//                           left: "10px",
//                         }}
//                         onError={(e) => {
//                           e.target.src = images;
//                         }}
//                       />
//                     </Link>
//                   </div>
//                   <div className="col-9 pt-2 pb-2">
//                     <div className="row">
//                       <div className="col-9 my-auto">
//                         <Link
//                           to={{
//                             pathname: `/ProductDetails/${item.menu_id}`,
//                           }}
//                           state={{
//                             restaurant_id: userData.restaurantId,
//                             menu_cat_id: item.menu_cat_id,
//                           }}
//                         >
//                           <h5 className="title text-truncate">
//                             {item.menu_name}
//                           </h5>
//                         </Link>
//                       </div>
//                       <div className="col-3 text-end pe-4">
//                         <div onClick={() => removeFromCart(item)}>
//                           <i
//                             className="ri-close-line fs-4"
//                             style={{ color: "#818180" }}
//                           ></i>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div
//                         className="col-4 fs-sm p-0 fw-medium ms-3 category-text"
                    
//                       >
//                         <Link
//                           to={{
//                             pathname: `/ProductDetails/${item.menu_id}`,
//                           }}
//                           state={{
//                             restaurant_id: userData.restaurantId,
//                             menu_cat_id: item.menu_cat_id,
//                           }}
//                         >
//                           <i className="ri-restaurant-line me-2"></i>
//                           {item.menu_cat_name}
//                         </Link>
//                       </div>
//                       <div className="col-4 px-0 ps-1">
//                         <div className="offer-code my-auto ">
//                           {Array.from({ length: 5 }).map((_, index) => (
//                             <i
//                               key={index}
//                               className={`ri-fire-${
//                                 index < (item.spicy_index || 0)
//                                   ? "fill fs-6"
//                                   : "line fs-6"
//                               }`}
//                               style={{
//                                 color:
//                                   index < (item.spicy_index || 0)
//                                     ? "#eb8e57"
//                                     : "#bbbaba",
//                               }}
//                             ></i>
//                           ))}
//                         </div>
//                       </div>
//                       <div className="col-3 ps-1 text-center">
//                         <span className="fw-semibold gray-text">
//                           <i
//                             className="ri-star-half-line px-1 ratingStar"
                         
//                           ></i>{" "}
//                           {item.rating} 5.1
//                         </span>
//                       </div>
//                     </div>
//                     <div className="row pt-2">
//                       <div className="col-10 mx-0 my-auto px-0">
//                         <p className="mb-2  fw-medium">
//                           <Link
//                       to={{
//                         pathname: `/ProductDetails/${item.menu_id}`,
//                       }}
//                       state={{
//                         restaurant_id: userData.restaurantId,
//                         menu_cat_id: item.menu_cat_id,
//                       }}
//                     >
//                           <span className="ms-3 fs-4 me-2 text-info">
//                             ₹{item.price}
//                           </span>
//                           <span className="gray-text fs-sm text-decoration-line-through">
//                             ₹{item.oldPrice || item.price}
//                           </span>
//                           </Link>
//                           <span className="fs-6 ps-4 text-primary">
//                             {item.offer || "No "}% Off
//                           </span>
//                         </p>
//                       </div>

//                       <div className="col-2">
//                         <div className="d-flex justify-content-end align-items-center mt-1">
//                           <i
//                             className="ri-subtract-line fs-6 mx-2"
//                             style={{ cursor: "pointer" }}
//                             onClick={() => decrementQuantity(item)}
//                           ></i>
//                           <span className="text-light ">{item.quantity}</span>
//                           <i
//                             className="ri-add-line mx-2 fs-6"
//                             style={{ cursor: "pointer" }}
//                             onClick={() => incrementQuantity(item)}
//                           ></i>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           {cartDetails && displayCartItems.length > 0 && (
//             <div
//               className="pb-5 mb-5"
//               style={{ bottom: "75px", backgroundColor: "transparent" }}
//             >
//               <div className="card-body">
//                 <div className="card mx-auto">
//                   <div className="row px-1 py-1">
//                     <div className="col-12">
//                       <div className="d-flex justify-content-between align-items-center py-2">
//                         <span className="ps-2 fs-3 fw-medium">Total</span>

//                         <span className="pe-2 fs-3 fw-medium">
//                           ₹{cartDetails?.total_bill || 0}
//                         </span>
//                       </div>
//                       <hr
//                         className="dashed-line me-3 p-0 m-0"
//                         style={{ color: "#0d775e" }}
//                       />
//                     </div>
//                     <div className="col-12 py-1">
//                       <div className="d-flex justify-content-between align-items-center py-0">
//                         <span
//                           className="ps-2 fs-sm pt-1"
//                           style={{ color: "#a5a5a5" }}
//                         >
//                           Service Charges ({cartDetails.service_charges_percent}
//                           %)
//                         </span>
//                         <span className="pe-2 fs-sm fw-medium">
//                           ₹{cartDetails?.service_charges_amount || 0}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="col-12 mb-0 py-1">
//                       <div className="d-flex justify-content-between align-items-center py-0">
//                         <span
//                           className="ps-2 fs-sm"
//                           style={{ color: "#a5a5a5" }}
//                         >
//                           GST ({cartDetails.gst_percent}%)
//                         </span>
//                         <span className="pe-2 fs-sm fw-medium text-start">
//                           ₹{cartDetails?.gst_amount || 0}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="col-12 mb-0 pt-1 pb-2">
//                       <div className="d-flex justify-content-between align-items-center py-0">
//                         <span
//                           className="ps-2 fs-sm"
//                           style={{ color: "#a5a5a5" }}
//                         >
//                           Discount ({cartDetails?.discount_percent || 0}%)
//                         </span>
//                         <span className="pe-2 fs-sm fw-medium">
//                           ₹{cartDetails?.discount_amount || 0}
//                         </span>
//                       </div>
//                     </div>
//                     <div>
//                       <hr
//                         className="dashed-line me-3 p-0 m-0"
//                         style={{ color: "#0d775e" }}
//                       />
//                     </div>
//                     <div className="col-12 py-1">
//                       <div className="d-flex justify-content-between align-items-center py-1 fw-medium pb-0 mb-0">
//                         <span className="ps-2 fs-3 fw-medium">Grand Total</span>
//                         <span className="pe-2 fs-3 ">
//                           ₹{cartDetails?.grand_total || 0}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="container d-flex align-items-center justify-content-center pt-0">
//                 <Link
//                   to="/Checkout"
//                   state={{ cartItems: displayCartItems }}
//                   className="btn btn-lg btn-thin rounded-xl btn-primary px-5"
//                 >
//                   Proceed to Buy &nbsp; <b>({displayCartItems.length} items)</b>
//                 </Link>
//               </div>
//             </div>
//           )}
//         </main>
//       )}
//       <Bottom />
//     </div>
//   );
// };

// export default Cart;



// oneItem



import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import SigninButton from "../constants/SigninButton";
import Bottom from "../component/bottom";
import "../assets/css/custom.css";

const Cart = () => {
  const [userData, setUserData] = useState(null);
  const [cartDetails, setCartDetails] = useState({ order_items: [] });
  const navigate = useNavigate();

  const getCustomerId = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    return userData ? userData.customer_id : null;
  };

  const getRestaurantId = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    return userData && userData.restaurantId ? userData.restaurantId : null;
  };

  const getCartId = () => {
    const cartId = localStorage.getItem("cartId");
    return cartId ? parseInt(cartId, 10) : 1;
  };

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    setUserData(storedUserData);
    fetchCartDetails();
  }, []);

  const fetchCartDetails = async () => {
    const customerId = getCustomerId();
    const restaurantId = getRestaurantId();
    const cartId = getCartId();

    if (!customerId || !restaurantId) {
      console.error("Customer ID or Restaurant ID is not available.");
      return;
    }

    try {
      const response = await fetch(
        "https://menumitra.com/user_api/get_cart_detail_add_to_cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: cartId,
            customer_id: customerId,
            restaurant_id: restaurantId,
          }),
        }
      );
      const data = await response.json();
      console.log("API response data:", data); // Debug log

      if (data.st === 1) {
        setCartDetails(data);
        console.log("Cart details set:", data); // Debug log
      } else if (data.st === 2) {
        setCartDetails({ order_items: [] });
      } else {
        console.error("Failed to fetch cart details:", data.msg);
      }
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  };

  const removeFromCart = async (item) => {
    const customerId = getCustomerId();
    const restaurantId = getRestaurantId();
    const cartId = getCartId();
    const menuId = item.menu_id;

    try {
      const response = await fetch(
        "https://menumitra.com/user_api/remove_from_cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: cartId,
            customer_id: customerId,
            restaurant_id: restaurantId,
            menu_id: menuId,
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1) {
        console.log("Item removed from cart successfully.");
        removeCartItemById(menuId); // Remove item from local storage
        fetchCartDetails(); // Refresh cart details
      } else {
        console.error("Failed to remove item from cart:", data.msg);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const removeCartItemById = (menuId) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const updatedCartItems = cartItems.filter(
      (item) => item.menu_id !== menuId
    );
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    console.log("Updated cart items in local storage:", updatedCartItems); // Debug log
  };

  const updateCartQuantity = async (menuId, quantity) => {
    const customerId = getCustomerId();
    const restaurantId = getRestaurantId();
    const cartId = getCartId();

    try {
      const response = await fetch(
        "https://menumitra.com/user_api/update_cart_quantity",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: cartId,
            customer_id: customerId,
            restaurant_id: restaurantId,
            menu_id: menuId,
            quantity: quantity,
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1) {
        fetchCartDetails(); // Refresh cart details
      } else {
        console.error("Failed to update cart quantity:", data.msg);
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  const incrementQuantity = (item) => {
    const newQuantity = item.quantity + 1;
    updateCartQuantity(item.menu_id, newQuantity);
  };

  const decrementQuantity = (item) => {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      updateCartQuantity(item.menu_id, newQuantity);
    }
  };

  const displayCartItems = cartDetails.order_items;
  console.log("Display cart items:", displayCartItems); // Debug log

  return (
    <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <Link
              to={`/HomeScreen/${userData?.restaurantId || ""}/${
                userData?.tableNumber || ""
              }`}
              className="back-btn dz-icon icon-sm"
            >
              <i className="ri-arrow-left-line fs-2"></i>
            </Link>
          </div>
          <div className="mid-content">
            <h5 className="title">
              My Cart{" "}
              {/* {displayCartItems.length > 0 && (
                <span className="">({displayCartItems.length})</span>
              )} */}
            </h5>
          </div>
        </div>
      </header>

      {displayCartItems.length === 0 ? (
        <main className="page-content space-top p-b100">
          <div className="container overflow-hidden">
            <div className="m-b20 dz-flex-box">
              <div className="dz-cart-about text-center">
                <h5 className="title">Your Cart is Empty</h5>
                <p>Add items to your cart from the product details page.</p>
                <Link to="/Menu" className="btn btn-outline-primary btn-sm">
                  Return to Shop
                </Link>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main className="page-content space-top p-b200">
          <div className="container scrollable-section">
            <div className="container mt-0 pt-0 mb-0">
              <div className="row">
                <div className="col-12 fw-medium text-end hotel-name">
                  <span className="ps-2">
                    {userData.restaurantName.toUpperCase()}
                  </span>
                  <i className="ri-store-2-line ps-2"></i>
                  <h6 className="title fw-medium h6 custom-text-gray table-number pe-5 me-5">
                    Table: {userData.tableNumber || ""}
                  </h6>
                </div>
              </div>
            </div>
            {displayCartItems.map((item, index) => (
              <div
                key={index}
                className="card mb-3"
                style={{
                  borderRadius: "15px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <div className="row my-auto" style={{ height: "110px" }}>
                  <div className="col-3 px-0">
                    <Link
                      to={{
                        pathname: `/ProductDetails/${item.menu_id}`,
                      }}
                      state={{
                        restaurant_id: userData.restaurantId,
                        menu_cat_id: item.menu_cat_id,
                      }}
                    >
                      <img
                        src={item.image || images}
                        alt={item.menu_name}
                        style={{
                          height: "110px",
                          width: "110px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          position: "relative",
                          left: "10px",
                        }}
                        onError={(e) => {
                          e.target.src = images;
                        }}
                      />
                    </Link>
                  </div>
                  <div className="col-9 pt-2 pb-2">
                    <div className="row">
                      <div className="col-9 my-auto">
                        <Link
                          to={{
                            pathname: `/ProductDetails/${item.menu_id}`,
                          }}
                          state={{
                            restaurant_id: userData.restaurantId,
                            menu_cat_id: item.menu_cat_id,
                          }}
                        >
                          <h5 className="title text-truncate">
                            {item.menu_name}
                          </h5>
                        </Link>
                      </div>
                      <div className="col-3 text-end pe-4">
                        <div onClick={() => removeFromCart(item)}>
                          <i
                            className="ri-close-line fs-4"
                            style={{ color: "#818180" }}
                          ></i>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-4 fs-sm p-0 fw-medium ms-3 category-text">
                        <Link
                          to={{
                            pathname: `/ProductDetails/${item.menu_id}`,
                          }}
                          state={{
                            restaurant_id: userData.restaurantId,
                            menu_cat_id: item.menu_cat_id,
                          }}
                        >
                          <i className="ri-restaurant-line me-2"></i>
                          {item.menu_cat_name}
                        </Link>
                      </div>
                      <div className="col-4 px-0 ps-1">
                        <div className="offer-code my-auto ">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <i
                              key={index}
                              className={`ri-fire-${
                                index < (item.spicy_index || 0)
                                  ? "fill fs-6"
                                  : "line fs-6"
                              }`}
                              style={{
                                color:
                                  index < (item.spicy_index || 0)
                                    ? "#eb8e57"
                                    : "#bbbaba",
                              }}
                            ></i>
                          ))}
                        </div>
                      </div>
                      <div className="col-3 ps-1 text-center">
                        <span className="fw-semibold gray-text">
                          <i className="ri-star-half-line px-1 ratingStar"></i>{" "}
                          {item.rating} 5.1
                        </span>
                      </div>
                    </div>
                    <div className="row pt-2">
                      <div className="col-10 mx-0 my-auto px-0">
                        <p className="mb-2  fw-medium">
                          <Link
                            to={{
                              pathname: `/ProductDetails/${item.menu_id}`,
                            }}
                            state={{
                              restaurant_id: userData.restaurantId,
                              menu_cat_id: item.menu_cat_id,
                            }}
                          >
                            <span className="ms-3 fs-4 me-2 text-info">
                              ₹{item.price}
                            </span>
                            <span className="gray-text fs-sm text-decoration-line-through">
                              ₹{item.oldPrice || item.price}
                            </span>
                          </Link>
                          <span className="fs-6 ps-4 text-primary">
                            {item.offer || "No "}% Off
                          </span>
                        </p>
                      </div>

                      <div className="col-2">
                        <div className="d-flex justify-content-end align-items-center mt-1">
                          <i
                            className="ri-subtract-line fs-6 mx-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => decrementQuantity(item)}
                          ></i>
                          <span className="text-light ">{item.quantity}</span>
                          <i
                            className="ri-add-line mx-2 fs-6"
                            style={{ cursor: "pointer" }}
                            onClick={() => incrementQuantity(item)}
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {cartDetails && displayCartItems.length > 0 && (
            <div
              className="pb-5 mb-5"
              style={{ bottom: "75px", backgroundColor: "transparent" }}
            >
              <div className="card-body">
                <div className="card mx-auto">
                  <div className="row px-1 py-1">
                    <div className="col-12">
                      <div className="d-flex justify-content-between align-items-center py-2">
                        <span className="ps-2 fs-3 fw-medium">Total</span>

                        <span className="pe-2 fs-3 fw-medium">
                          ₹{cartDetails?.total_bill || 0}
                        </span>
                      </div>
                      <hr
                        className="dashed-line me-3 p-0 m-0"
                        style={{ color: "#0d775e" }}
                      />
                    </div>
                    <div className="col-12 py-1">
                      <div className="d-flex justify-content-between align-items-center py-0">
                        <span
                          className="ps-2 fs-sm pt-1"
                          style={{ color: "#a5a5a5" }}
                        >
                          Service Charges ({cartDetails.service_charges_percent}
                          %)
                        </span>
                        <span className="pe-2 fs-sm fw-medium">
                          ₹{cartDetails?.service_charges_amount || 0}
                        </span>
                      </div>
                    </div>
                    <div className="col-12 mb-0 py-1">
                      <div className="d-flex justify-content-between align-items-center py-0">
                        <span
                          className="ps-2 fs-sm"
                          style={{ color: "#a5a5a5" }}
                        >
                          GST ({cartDetails.gst_percent}%)
                        </span>
                        <span className="pe-2 fs-sm fw-medium text-start">
                          ₹{cartDetails?.gst_amount || 0}
                        </span>
                      </div>
                    </div>
                    <div className="col-12 mb-0 pt-1 pb-2">
                      <div className="d-flex justify-content-between align-items-center py-0">
                        <span
                          className="ps-2 fs-sm"
                          style={{ color: "#a5a5a5" }}
                        >
                          Discount ({cartDetails?.discount_percent || 0}%)
                        </span>
                        <span className="pe-2 fs-sm fw-medium">
                          ₹{cartDetails?.discount_amount || 0}
                        </span>
                      </div>
                    </div>
                    <div>
                      <hr
                        className="dashed-line me-3 p-0 m-0"
                        style={{ color: "#0d775e" }}
                      />
                    </div>
                    <div className="col-12 py-1">
                      <div className="d-flex justify-content-between align-items-center py-1 fw-medium pb-0 mb-0">
                        <span className="ps-2 fs-3 fw-medium">Grand Total</span>
                        <span className="pe-2 fs-3 ">
                          ₹{cartDetails?.grand_total || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container d-flex align-items-center justify-content-center pt-0">
                <Link
                  to="/Checkout"
                  state={{ cartItems: displayCartItems }}
                  className="btn btn-lg btn-thin rounded-xl btn-primary px-5"
                >
                  Proceed to Buy &nbsp; <b>({displayCartItems.length} items)</b>
                </Link>
              </div>
            </div>
          )}
        </main>
      )}
      <Bottom />
    </div>
  );
};

export default Cart;