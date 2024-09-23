// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useRestaurantId } from '../context/RestaurantIdContext';
// import Bottom from "../component/bottom";
// import { Divider } from "@mui/material";
// // import { useRestaurantId } from "./context/RestaurantIdContext";

// const Checkout = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [cartItems, setCartItems] = useState(location.state?.cartItems || []);
//   const { restaurantId } = useRestaurantId(); // Get restaurantId from context
//   console.log("Restaurant ID:", restaurantId);

//   const userData = JSON.parse(localStorage.getItem('userData'));
//   const customerId = userData ? userData.customer_id : null;

//   const handleBack = () => {
//     navigate(-1);
//   };

//   const handleSubmitOrder = async () => {
//     const notes = document
//       .getElementById("notes")
//       .value.trim()
//       .substring(0, 255); // Limit to 255 characters
//     const orderItems = cartItems.map((item) => ({
//       menu_id: item.menu_id,
//       quantity: item.quantity,
//     }));

//     const orderData = {
//       customer_id: customerId,
//       restaurant_id: restaurantId,
//       note: notes,
//       order_items: orderItems,
//     };

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/create_order",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(orderData),
//         }
//       );

//       const responseData = await response.json();

//       if (response.ok) {
//         // Handle successful submission
//         navigate("/MyOrder");
//       } else {
//         throw new Error(responseData.msg || "Failed to submit order");
//       }
//     } catch (error) {
//       console.error("Error submitting order:", error);
//       alert(`Failed to submit order: ${error.message}`);
//     }
//   };

//   // Define the calculateTotal function to compute the total price of cart items
//   const calculateTotal = () => {
//     return cartItems.reduce(
//       (total, item) => total + item.price * item.quantity,
//       0
//     );
//   };

//   useEffect(() => {
//     console.log("Restaurant ID from context:", restaurantId);
//   }, [restaurantId]);

//   return (
//     <div className="page-wrapper full-height">
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link
//               to=""
//               className="back-btn dz-icon icon-fill icon-sm"
//               onClick={handleBack}
//             >
//               <i className="ri-arrow-left-line"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">Checkout</h5>
//           </div>
//           <div className="right-content"></div>
//         </div>
//       </header>

//       <main className="page-content space-top p-b90">
//         <div className="container">
//           <div className="dz-flex-box">
//             {/* <div className="dz-list m-b20"> */}
//             <div className="row">
//               <div className="col-1">
//                 <i class="ri-map-pin-fill fs-2"></i>
//               </div>
//               <div className="col-11"> Delivery Address</div>
//             </div>
//             <div className="row">
//               <div className="col-1">
//                 <i class="ri-bank-card-fill fs-2"></i>
//               </div>
//               <div className="col-11">Payment</div>
//             </div>
//             <ul className="dz-list-group">
//               <div className="mb-3">
//                 <label className="form-label" htmlFor="notes">
//                   Additional Notes :
//                 </label>
//                 <textarea
//                   className="form-control dz-textarea"
//                   name="notes"
//                   id="notes"
//                   rows="4"
//                   placeholder="Write Here"
//                 ></textarea>
//               </div>

//               {cartItems.length > 0 ? (
//                 cartItems.map((item, index) => (
//                   <li key={index} className="list-group-items ">
//                     <div className="row align-items-center">
//                       <div class="col-7">
//                         <h5 className="title mb-2">{item.name}</h5>
//                       </div>
//                       <div class="col-5 text-end">
//                         <span>{item.quantity}x</span>
//                         <span className="ms-2 prize">
//                           ₹{item.price.toFixed(2)}
//                         </span>
//                       </div>
//                     </div>
//                   </li>
//                 ))
//               ) : (
//                 <li>No items in the cart.</li>
//               )}
//             </ul>

//             {/* </div> */}
//             {cartItems.length > 0 && (
//               <div className="view-cart mt-auto">
//                 {/* <ul>
//                   <li className="dz-total">
//                     <span className="name font-18 font-w600">Total</span>
//                     <h5 className="price">₹{calculateTotal().toFixed(2)}</h5>
//                   </li>
//                 </ul> */}
//               </div>
//             )}
//           </div>
//         </div>
//       </main>

//       <div className="container">
//         <div className=" bottom-40">
//           <ul className="total-prize">
//             <li className="name">My Order</li>
//             <li className="prize">₹{calculateTotal()}</li>
//           </ul>
//           <div className="d-flex justify-content-center align-items-center pt-3">
//             <Link
//               to="/MyOrder"
//               className="btn btn-primary btn-lg btn-thin rounded-xl"
//               onClick={handleSubmitOrder}
//             >
//               Submit Order
//             </Link>
//           </div>
//         </div>
//       </div>
//       <Bottom></Bottom>
//     </div>
//   );
// };

// export default Checkout;

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import Bottom from "../component/bottom";

// const Checkout = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [cartItems, setCartItems] = useState(location.state?.cartItems || []);
//   const { restaurantId } = useRestaurantId(); // Get restaurantId from context
//   console.log("Restaurant ID:", restaurantId);

//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const customerId = userData ? userData.customer_id : null;

//   // Retrieve cart_id from localStorage
//   const getCartId = () => {
//     const cartId = localStorage.getItem("cartId");
//     return cartId ? parseInt(cartId, 10) : null; // Return cartId or null if not found
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   const handleSubmitOrder = async () => {
//     const notes = document
//       .getElementById("notes")
//       .value.trim()
//       .substring(0, 255); // Limit to 255 characters
//     const orderItems = cartItems.map((item) => ({
//       menu_id: item.menu_id,
//       quantity: item.quantity,
//     }));

//     const orderData = {
//       customer_id: customerId,
//       restaurant_id: restaurantId,
//       cart_id: getCartId(), // Include cart_id
//       note: notes,
//       order_items: orderItems,
//     };

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/create_order",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(orderData),
//         }
//       );

//       const responseData = await response.json();

//       if (response.ok) {
//         // Handle successful submission
//         navigate("/MyOrder");
//       } else {
//         throw new Error(responseData.msg || "Failed to submit order");
//       }
//     } catch (error) {
//       console.error("Error submitting order:", error);
//       alert(`Failed to submit order: ${error.message}`);
//     }
//   };

//   // Define the calculateTotal function to compute the total price of cart items
//   const calculateTotal = () => {
//     return cartItems.reduce(
//       (total, item) => total + item.price * item.quantity,
//       0
//     );
//   };

//   useEffect(() => {
//     console.log("Restaurant ID from context:", restaurantId);
//   }, [restaurantId]);

//   return (
//     <div className="page-wrapper full-height">
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link
//               to=""
//               className="back-btn dz-icon icon-fill icon-sm"
//               onClick={handleBack}
//             >
//               <i className="ri-arrow-left-line"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">Checkout</h5>
//           </div>
//           <div className="right-content"></div>
//         </div>
//       </header>

//       <main className="page-content space-top p-b90">
//         <div className="container">
//           <div className="dz-flex-box">
//             <div className="row">
//               <div className="col-1">
//                 <i className="ri-map-pin-fill fs-2"></i>
//               </div>
//               <div className="col-11"> Delivery Address</div>
//             </div>
//             <div className="row">
//               <div className="col-1">
//                 <i className="ri-bank-card-fill fs-2"></i>
//               </div>
//               <div className="col-11">Payment</div>
//             </div>
//             <ul className="dz-list-group">
//               <div className="mb-3">
//                 <label className="form-label" htmlFor="notes">
//                   Additional Notes :
//                 </label>
//                 <textarea
//                   className="form-control dz-textarea"
//                   name="notes"
//                   id="notes"
//                   rows="4"
//                   placeholder="Write Here"
//                 ></textarea>
//               </div>

//               {cartItems.length > 0 ? (
//                 cartItems.map((item, index) => (
//                   <li key={index} className="list-group-items ">
//                     <div className="row align-items-center">
//                       <div className="col-7">
//                         <h5 className="title mb-2">{item.name}</h5>
//                       </div>
//                       <div className="col-5 text-end">
//                         <span>{item.quantity}x</span>
//                         <span className="ms-2 prize">
//                           ₹{item.price.toFixed(2)}
//                         </span>
//                       </div>
//                     </div>
//                   </li>
//                 ))
//               ) : (
//                 <li>No items in the cart.</li>
//               )}
//             </ul>
//           </div>
//         </div>
//       </main>

//       <div className="container">
//         <div className="bottom-40">
//           <ul className="total-prize">
//             <li className="name">My Order</li>
//             <li className="prize">₹{calculateTotal()}</li>
//           </ul>
//           <div className="d-flex justify-content-center align-items-center pt-3">
//             <Link
//               to="/MyOrder"
//               className="btn btn-primary btn-lg btn-thin rounded-xl"
//               onClick={handleSubmitOrder}
//             >
//               Submit Order
//             </Link>
//           </div>
//         </div>
//       </div>
//       <Bottom />
//     </div>
//   );
// };

// export default Checkout;

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import Bottom from "../component/bottom";

// const Checkout = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [cartItems, setCartItems] = useState(location.state?.cartItems || []);
//   const { restaurantId } = useRestaurantId(); // Get restaurantId from context
//   console.log("Restaurant ID:", restaurantId);

//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const customerId = userData ? userData.customer_id : null;

//   // Retrieve cart_id from localStorage
//   const getCartId = () => {
//     const cartId = localStorage.getItem("cartId");
//     return cartId ? parseInt(cartId, 10) : null; // Return cartId or null if not found
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   const handleSubmitOrder = async () => {
//     const notes = document
//       .getElementById("notes")
//       .value.trim()
//       .substring(0, 255); // Limit to 255 characters
//     const orderItems = cartItems.map((item) => ({
//       menu_id: item.menu_id,
//       quantity: item.quantity,
//     }));

//     const orderData = {
//       customer_id: customerId,
//       restaurant_id: restaurantId,
//       cart_id: getCartId(), // Include cart_id
//       note: notes,
//       order_items: orderItems,
//     };

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/create_order",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(orderData),
//         }
//       );

//       const responseData = await response.json();

//       if (response.ok) {
//         // Handle successful submission
//         navigate("/MyOrder");
//       } else {
//         throw new Error(responseData.msg || "Failed to submit order");
//       }
//     } catch (error) {
//       console.error("Error submitting order:", error);
//       alert(`Failed to submit order: ${error.message}`);
//     }
//   };

//   // Define the calculateTotal function to compute the total price of cart items
//   const calculateTotal = () => {
//     return cartItems.reduce(
//       (total, item) => total + item.price * item.quantity,
//       0
//     );
//   };

//   useEffect(() => {
//     console.log("Restaurant ID from context:", restaurantId);
//   }, [restaurantId]);

//   return (
//     <div className="page-wrapper full-height">
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link
//               to=""
//               className="back-btn dz-icon icon-fill icon-sm"
//               onClick={handleBack}
//             >
//               <i className="ri-arrow-left-line"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">Checkout</h5>
//           </div>
//           <div className="right-content"></div>
//         </div>
//       </header>

//       <main className="page-content space-top p-b90">
//         <div className="container">
//           <div className="dz-flex-box">
//             <ul className="dz-list-group">
//               <div className="mb-3">
//                 <label className="form-label" htmlFor="notes">
//                   Additional Notes :
//                 </label>
//                 <textarea
//                   className="form-control dz-textarea"
//                   name="notes"
//                   id="notes"
//                   rows="4"
//                   placeholder="Write Here"
//                 ></textarea>
//               </div>
//               <ul className="ms-3">
//                 <li className="my-2 text-muted">
//                   {" "}
//                   &bull; Make mutton thali a bit less spicy
//                 </li>
//                 <li className="my-2 text-muted">
//                   &bull; Make my panipuri more spicy
//                 </li>
//               </ul>
//             </ul>

//             <div className="dz-flex-box mt-3">
//               <div className="card">
//                 <div className="card-body">
//                   {cartItems.length > 0 ? (
//                     cartItems.map((item, index) => (
//                       <div
//                         className="row mb-3 justify-content-center"
//                         key={index}
//                       >
//                         <div className="col-4 mt-1">
//                           <h5 className="mb-0">{item.name}</h5>
//                           <div className="text-success">
//                             <i className="ri-restaurant-line me-2"></i>{" "}
//                             <span>{item.category || "Category"}</span>
//                           </div>
//                         </div>
//                         <div className="col-4 h5 text-end">
//                           x {item.quantity}
//                         </div>
//                         <div className="col-4 text-end">
//                           <span className="h5 text-info">
//                             ₹{(item.price * item.quantity).toFixed(2)}
//                           </span>
//                           <div className="mt-0 d-flex justify-content-end">
//                             <del className="text-muted small mt-1">
//                               ₹{item.price}
//                             </del>
//                             <span className="text-success text-end ms-1">
//                               {item.discount || "No discount"}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div>No items in the cart.</div>
//                   )}

//                   <hr />
//                   <div className="my-3">
//                     Subtotal{" "}
//                     <span className="float-end h5">
//                       ₹{calculateTotal().toFixed(2)}
//                     </span>
//                   </div>
//                   <div className="my-3">
//                     Discount <span className="float-end h5">₹200</span>
//                   </div>
//                   <div className="">
//                     Tax <span className="float-end h5 mb-2">₹200</span>
//                   </div>
//                   <h5 className="mt-3">
//                     Grand Total{" "}
//                     <span className="float-end">
//                       ₹{(calculateTotal() - 200).toFixed(2)}
//                     </span>
//                   </h5>
//                 </div>
//               </div>
//             </div>

//             <div className="text-center">
//               <Link
//                 to="/MyOrder"
//                 className="btn btn-primary rounded-pill w-50 mt-3"
//                 onClick={handleSubmitOrder}
//               >
//                 Place Order
//               </Link>
//             </div>
//           </div>
//         </div>
//       </main>

//       <Bottom />
//     </div>
//   );
// };

// export default Checkout;

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Bottom from "../component/bottom";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import "../assets/css/custom.css";
// import OrderGif from "../assets/gif/order_success.gif"; // Ensure this path is correct

// const Checkout = () => {
//   const navigate = useNavigate();
//   const { restaurantId } = useRestaurantId(); // Get restaurantId from context
//   const [cartItems, setCartItems] = useState([]);
//   const [subTotal, setSubTotal] = useState(0);
//   const [discount, setDiscount] = useState(0);
//   const [tax, setTax] = useState(0);
//   const [grandTotal, setGrandTotal] = useState(0);
//   const [showPopup, setShowPopup] = useState(false); // State to show/hide popup

//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const customerId = userData ? userData.customer_id : null;

//   const getCartId = () => {
//     const cartId = localStorage.getItem("cartId");
//     return cartId ? parseInt(cartId, 10) : null;
//   };

//   const fetchCartDetails = async () => {
//     const cartId = getCartId();
//     if (!cartId || !customerId || !restaurantId) {
//       alert("Missing cart, customer, or restaurant data.");
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

//       if (response.ok) {
//         setCartItems(data.order_items);
//         setSubTotal(parseFloat(data.sub_total));
//         setDiscount(parseFloat(data.discount));
//         setTax(parseFloat(data.tax));
//         setGrandTotal(parseFloat(data.grand_total));
//       } else {
//         console.error("Failed to fetch cart details:", data.msg);
//         alert(`Error: ${data.msg}`);
//       }
//     } catch (error) {
//       console.error("Error fetching cart details:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCartDetails();
//   }, [restaurantId, customerId]);

//   const handleSubmitOrder = async () => {
//     const notes = document
//       .getElementById("notes")
//       .value.trim()
//       .substring(0, 255);
//     const orderItems = cartItems.map((item) => ({
//       menu_id: item.menu_id,
//       quantity: item.quantity,
//     }));

//     const orderData = {
//       customer_id: customerId,
//       restaurant_id: restaurantId,
//       cart_id: getCartId(),
//       note: notes,
//       order_items: orderItems,
//     };

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/create_order",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(orderData),
//         }
//       );

//       const responseData = await response.json();

//       if (response.ok) {
//         setShowPopup(true); // Show the popup on successful order creation
//       } else {
//         throw new Error(responseData.msg || "Failed to submit order");
//       }
//     } catch (error) {
//       console.error("Error submitting order:", error);
//       alert(`Failed to submit order: ${error.message}`);
//     }
//   };

//   const closePopup = () => {
//     setShowPopup(false);
//     navigate("/MyOrder");
//   };

//   return (
//     <div className="page-wrapper full-height">
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link
//               to=""
//               className="back-btn dz-icon  icon-sm"
//               onClick={() => navigate(-1)}
//             >
//               <i className="ri-arrow-left-line fs-2"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title pe-3">Checkout</h5>
//           </div>
//         </div>
//       </header>

//       <main className="page-content space-top p-b90">
//         <div className="container">
//           <div className="dz-flex-box">
//             <ul className="dz-list-group">
//               <div className="mb-3">
//                 <label className="form-label" htmlFor="notes">
//                   Additional Notes :
//                 </label>
//                 <textarea
//                   className="form-control dz-textarea"
//                   name="notes"
//                   id="notes"
//                   rows="4"
//                   placeholder="Write Here"
//                 ></textarea>
//               </div>
//               <ul className="ms-3">
//               <li className="my-2 text-muted" > &bull; Make mutton thali a bit less spicy</li>
//               <li className="my-2 text-muted">&bull; Make my panipuri more spicy</li>
//             </ul>
//             </ul>

//             <div className="dz-flex-box mt-3">
//               <div className="card">
//                 <div className="card-body">
//                   {cartItems.length > 0 ? (
//                     cartItems.map((item, index) => (
//                       <div
//                         className="row mb-3 justify-content-center"
//                         key={index}
//                       >
//                         <div className="col-4  px-2 pb-1">
//                           <h5 className="mb-0">{item.menu_name}</h5>
//                           <div className="text-success">
//                             <i className="ri-restaurant-line me-2"></i>{" "}
//                             <span>{item.menu_cat_name}</span>
//                           </div>
//                         </div>
//                         <div className="col-4 h5 text-center px-2">
//                           x {item.quantity}
//                         </div>
//                         <div className="col-4 text-center px-2">
//                           <span className="h5 text-info ps-2">
//                             ₹{item.sub_total.toFixed(2)}
//                           </span>
//                           <div className="mt-0 d-flex justify-content-center">
//                             <del className="text-muted small mt-1">
//                               ₹{item.price}
//                             </del>
//                             <span className="text-success  ms-1" >
//                               {item.offer || "No discount"}{"%"} Off
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div>No items in the cart.</div>
//                   )}

//                   <hr />
//                   <div className="my-3">
//                     Subtotal{" "}
//                     <span className="float-end h5">₹{subTotal.toFixed(2)}</span>
//                   </div>
//                   <div className="my-3">
//                     Discount{" "}
//                     <span className="float-end h5">₹{discount.toFixed(2)}</span>
//                   </div>
//                   <div className="">
//                     Tax{" "}
//                     <span className="float-end h5 mb-2">₹{tax.toFixed(2)}</span>
//                   </div>
//                   <h5 className="mt-3">
//                     Grand Total{" "}
//                     <span className="float-end">₹{grandTotal.toFixed(2)}</span>
//                   </h5>
//                 </div>
//               </div>
//             </div>

//             <div className="text-center">
//               <Link
//                 to="#"
//                 className="btn btn-primary rounded-pill w-50 mt-3"
//                 onClick={handleSubmitOrder}
//               >
//                 Place Order
//               </Link>
//             </div>
//           </div>
//         </div>
//       </main>

//       {showPopup && (
//         <div className="popup-overlay">
//           <div className="popup-content">
//             {/* Display the GIF inside a circle */}
//             <div className="circle">
//               <img
//                 src={OrderGif} // Correct path to your GIF
//                 alt="Order Success"
//                 className="popup-gif"
//               />
//             </div>
//             <h4>Your Order Successfully Placed</h4>
//             <p>You have successfully made payment and placed your order.</p>
//             <button className="btn btn-success w-100 mt-3" onClick={closePopup}>
//               View Order
//             </button>
//           </div>
//         </div>
//       )}

//       <Bottom />
//     </div>
//   );
// };

// export default Checkout;




















// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Bottom from "../component/bottom";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import "../assets/css/custom.css";
// import OrderGif from "../assets/gif/order_success.gif"; // Ensure this path is correct

// const Checkout = () => {
//   const navigate = useNavigate();
//   const { restaurantId } = useRestaurantId();
//   console.log("Restaurant ID:", restaurantId); // Log the restaurant ID

//   const [cartItems, setCartItems] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [discount, setDiscount] = useState(0);
//   const [tax, setTax] = useState(0);
//   const [grandTotal, setGrandTotal] = useState(0);
//   const [showPopup, setShowPopup] = useState(false); // State to show/hide popup
//   const [serviceCharges, setServiceCharges] = useState(0);
//   const [serviceChargesPercent, setServiceChargesPercent] = useState(0);
//   const [gstPercent, setGstPercent] = useState(0);
//   const [discountPercent, setDiscountPercent] = useState(0);

//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const customerId = userData ? userData.customer_id : null;
//   console.log("Customer ID:", customerId); // Log the customer ID

//   const getCartId = () => {
//     const cartId = localStorage.getItem("cartId");
//     console.log("Cart ID:", cartId); // Log the cart ID
//     return cartId ? parseInt(cartId, 10) : null;
//   };

//   const fetchCartDetails = async () => {
//     const cartId = getCartId();
//     console.log("Fetching cart details with:", {
//       cartId,
//       customerId,
//       restaurantId,
//     });

//     if (!cartId || !customerId || !restaurantId) {
//       alert("Missing cart, customer, or restaurant data.");
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
//       console.log("API Data:", data);

//       if (response.ok) {
//         setCartItems(data.order_items || []);
//         setTotal(parseFloat(data.total_bill) || 0); // Access total_bill here
//         setDiscount(parseFloat(data.discount_amount) || 0);
//         setTax(parseFloat(data.gst_amount) || 0);
//         setGrandTotal(parseFloat(data.grand_total) || 0);
//         setServiceCharges(parseFloat(data.service_charges_amount) || 0);
//         setServiceChargesPercent(parseFloat(data.service_charges_percent) || 0);
//         setGstPercent(parseFloat(data.gst_percent) || 0);
//         setDiscountPercent(parseFloat(data.discount_percent) || 0);
//       } else {
//         console.error("Failed to fetch cart details:", data.msg);
//         alert(`Error: ${data.msg}`);
//       }
//     } catch (error) {
//       console.error("Error fetching cart details:", error);
//     }
//   };


//   useEffect(() => {
//     console.log(
//       "useEffect triggered, restaurantId:",
//       restaurantId,
//       "customerId:",
//       customerId
//     );
//     fetchCartDetails();
//   }, [restaurantId, customerId]);

//   const handleSubmitOrder = async () => {
//     const notes = document
//       .getElementById("notes")
//       .value.trim()
//       .substring(0, 255);
//     const orderItems = cartItems.map((item) => ({
//       menu_id: item.menu_id,
//       quantity: item.quantity,
//     }));

//     const orderData = {
//       customer_id: customerId,
//       restaurant_id: restaurantId,
//       cart_id: getCartId(),
//       note: notes,
//       order_items: orderItems,
//       table_number: table_number,
//     };

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/create_order",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(orderData),
//         }
//       );

//       const responseData = await response.json();

//       if (response.ok) {
//         setShowPopup(true); // Show the popup on successful order creation
//       } else {
//         throw new Error(responseData.msg || "Failed to submit order");
//       }
//     } catch (error) {
//       console.error("Error submitting order:", error);
//       alert(`Failed to submit order: ${error.message}`);
//     }
//   };

//   const closePopup = () => {
//     setShowPopup(false);
//     navigate("/MyOrder");
//   };

//   return (
//     <div className="page-wrapper full-height">
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link
//               to=""
//               className="back-btn dz-icon  icon-sm"
//               onClick={() => navigate(-1)}
//             >
//               <i className="ri-arrow-left-line fs-2"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title pe-3">Checkout</h5>
//           </div>
//         </div>
//       </header>

//       <main className="page-content space-top p-b90">
//         <div className="container">
//           <div className="dz-flex-box">
//             <ul className="dz-list-group">
//               <div className="mb-3">
//                 <label className="form-label" htmlFor="notes">
//                   Additional Notes :
//                 </label>
//                 <textarea
//                   className="form-control dz-textarea"
//                   name="notes"
//                   id="notes"
//                   rows="4"
//                   placeholder="Write Here"
//                 ></textarea>
//               </div>
//               <ul className="ms-3">
//                 <li className="my-2 text-muted">
//                   {" "}
//                   &bull; Make mutton thali a bit less spicy
//                 </li>
//                 <li className="my-2 text-muted">
//                   &bull; Make my panipuri more spicy
//                 </li>
//               </ul>
//             </ul>

//             <div className="dz-flex-box mt-3">
//               <div className="card">
//                 <div className="card-body px-0">
//                   {cartItems.length > 0 ? (
//                     cartItems.map((item, index) => (
//                       <div className="row  justify-content-center" key={index}>
//                         <div className="col-4  px-4 pb-1">
//                           <h5 className="mb-0">{item.menu_name}</h5>
//                           <div className="text-success">
//                             <i className="ri-restaurant-line me-2"></i>{" "}
//                             <span>{item.menu_cat_name}</span>
//                           </div>
//                         </div>
//                         <div className="col-4 h5 text-center px-2">
//                           x {item.quantity}
//                         </div>
//                         <div className="col-4 text-start px-2">
//                           {/* <span className="h5 text-info ps-2">
//                             ₹{item.price ? item.price.toFixed(2) : "0.00"}
//                           </span>
//                           <div className="mt-0 d-flex justify-content-center">
//                             <del className="text-muted small mt-1">
//                               ₹{item.price || "0.00"}
//                             </del>
//                             <span className="text-success  ms-1">
//                               {item.offer || "No discount"}
//                               {"%"} Off
//                             </span>
//                           </div> */}

//                           <p className="mb-2 fs-4 fw-medium">
//                             <span className="ms-0 me-2 text-info">
//                               ₹{item.price}
//                             </span>
//                             <div className="">
//                             <span className="text-muted fs-6 text-decoration-line-through">
//                               ₹ {item.oldPrice || item.price}
//                             </span>
//                               <span className="fs-6 ps-2 text-primary">
//                                 {item.offer || "No "}% Off
//                               </span>
//                             </div>
//                           </p>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div>No items in the cart.</div>
//                   )}

//                   {/* <div className="my-3 px-2">
//                     Service Charges ({serviceChargesPercent}%)
//                     <span className="float-end h5">
//                       ₹{parseFloat(serviceCharges).toFixed(2)}
//                     </span>
//                   </div>

//                   <div className="my-3 px-2">
//                     GST ({gstPercent}%)
//                     <span className="float-end h5">
//                       ₹{parseFloat(tax).toFixed(2)}
//                     </span>
//                   </div>

//                   <div className="px-2">
//                     Discount ({discountPercent}%)
//                     <span className="float-end h5 mb-2">
//                       ₹{parseFloat(discount).toFixed(2)}
//                     </span>
//                   </div>

//                   <h5 className="mt-2 px-2">
//                     Grand Total{" "}
//                     <span className="float-end">
//                       ₹{parseFloat(grandTotal).toFixed(2)}
//                     </span>
//                   </h5> */}
//                 </div>
//               </div>
//               <div className="card">
//                 <div className="card-body px-0 ">
//                   <div className="fs-5 fw-semibold px-2">
//                     Total
//                     <span className="float-end h5">
//                       ₹{parseFloat(total).toFixed(2)}
//                     </span>
//                     <hr />
//                   </div>
//                   <div className="my-3 px-2">
//                     Service Charges ({serviceChargesPercent}%)
//                     <span className="float-end h5">
//                       ₹{parseFloat(serviceCharges).toFixed(2)}
//                     </span>
//                   </div>

//                   <div className="my-3 px-2">
//                     GST ({gstPercent}%)
//                     <span className="float-end h5">
//                       ₹{parseFloat(tax).toFixed(2)}
//                     </span>
//                   </div>

//                   <div className="px-2">
//                     Discount ({discountPercent}%)
//                     <span className="float-end h5 mb-2">
//                       ₹{parseFloat(discount).toFixed(2)}
//                     </span>
//                   </div>

//                   <h5 className="mt-2 px-2">
//                     <hr />
//                     Grand Total{" "}
//                     <span className="float-end">
//                       ₹{parseFloat(grandTotal).toFixed(2)}
//                     </span>
//                   </h5>
//                 </div>
//               </div>
//             </div>

//             <div className="text-center">
//               <Link
//                 to="#"
//                 className="btn btn-primary rounded-pill w-50 mt-3"
//                 onClick={handleSubmitOrder}
//               >
//                 Place Order
//               </Link>
//             </div>
//           </div>
//         </div>
//       </main>

//       {showPopup && (
//         <div className="popup-overlay">
//           <div className="popup-content">
//             {/* Display the GIF inside a circle */}
//             <div className="circle">
//               <img
//                 src={OrderGif} // Correct path to your GIF
//                 alt="Order Success"
//                 className="popup-gif"
//               />
//             </div>
//             <h4>Your Order Successfully Placed</h4>
//             <p>You have successfully made payment and placed your order.</p>
//             <button className="btn btn-success w-100 mt-3" onClick={closePopup}>
//               View Order
//             </button>
//           </div>
//         </div>
//       )}

//       <Bottom />
//     </div>
//   );
// };

// export default Checkout;
























import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Bottom from "../component/bottom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import "../assets/css/custom.css";
import OrderGif from "../assets/gif/order_success.gif"; // Ensure this path is correct

const Checkout = () => {
  const navigate = useNavigate();
  const { restaurantId } = useRestaurantId();
  console.log("Restaurant ID:", restaurantId);

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [serviceCharges, setServiceCharges] = useState(0);
  const [serviceChargesPercent, setServiceChargesPercent] = useState(0);
  const [gstPercent, setGstPercent] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);

  const userData = JSON.parse(localStorage.getItem("userData"));
  const customerId = userData ? userData.customer_id : null;
  const tableNumber = userData ? userData.tableNumber : null; // Retrieve table_number
  console.log("Customer ID:", customerId);
  console.log("Table Number:", tableNumber); // Log the table number

  const getCartId = () => {
    const cartId = localStorage.getItem("cartId");
    console.log("Cart ID:", cartId);
    return cartId ? parseInt(cartId, 10) : null;
  };

  const fetchCartDetails = async () => {
    const cartId = getCartId();
    console.log("Fetching cart details with:", {
      cartId,
      customerId,
      restaurantId,
    });

    if (!cartId || !customerId || !restaurantId) {
      alert("Missing cart, customer, or restaurant data.");
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
      console.log("API Data:", data);

      if (response.ok) {
        setCartItems(data.order_items || []);
        setTotal(parseFloat(data.total_bill) || 0);
        setDiscount(parseFloat(data.discount_amount) || 0);
        setTax(parseFloat(data.gst_amount) || 0);
        setGrandTotal(parseFloat(data.grand_total) || 0);
        setServiceCharges(parseFloat(data.service_charges_amount) || 0);
        setServiceChargesPercent(parseFloat(data.service_charges_percent) || 0);
        setGstPercent(parseFloat(data.gst_percent) || 0);
        setDiscountPercent(parseFloat(data.discount_percent) || 0);
      } else {
        console.error("Failed to fetch cart details:", data.msg);
        alert(`Error: ${data.msg}`);
      }
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  };

  useEffect(() => {
    console.log(
      "useEffect triggered, restaurantId:",
      restaurantId,
      "customerId:",
      customerId
    );
    fetchCartDetails();
  }, [restaurantId, customerId]);

  const handleSubmitOrder = async () => {
    const notes = document
      .getElementById("notes")
      .value.trim()
      .substring(0, 255);
    const orderItems = cartItems.map((item) => ({
      menu_id: item.menu_id,
      quantity: item.quantity,
    }));

    const orderData = {
      customer_id: customerId,
      restaurant_id: restaurantId,
      cart_id: getCartId(),
      note: notes,
      order_items: orderItems,
      table_number: tableNumber, // Use tableNumber from userData
    };

    try {
      const response = await fetch(
        "https://menumitra.com/user_api/create_order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        setShowPopup(true);
      } else {
        throw new Error(responseData.msg || "Failed to submit order");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      alert(`Failed to submit order: ${error.message}`);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate("/MyOrder");
  };

  return (
    <div className="page-wrapper full-height">
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <Link
              to=""
              className="back-btn dz-icon icon-sm"
              onClick={() => navigate(-1)}
            >
              <i className="ri-arrow-left-line fs-2"></i>
            </Link>
          </div>
          <div className="mid-content">
            <h5 className="title pe-3">Checkout</h5>
          </div>
        </div>
      </header>

      <main className="page-content space-top p-b90">
        <div className="container">
          <div className="dz-flex-box">
            <ul className="dz-list-group">
              <div className="mb-3">
                <label className="form-label" htmlFor="notes">
                  Additional Notes:
                </label>
                <textarea
                  className="form-control dz-textarea"
                  name="notes"
                  id="notes"
                  rows="4"
                  placeholder="Write Here"
                ></textarea>
              </div>
              <ul className="ms-3">
                <li className="my-2 text-muted">
                  &bull; Make mutton thali a bit less spicy
                </li>
                <li className="my-2 text-muted">
                  &bull; Make my panipuri more spicy
                </li>
              </ul>
            </ul>

            <div className="dz-flex-box mt-3">
              <div className="card">
                <div className="card-body px-0">
                  {cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                      <div className="row justify-content-center" key={index}>
                        <div className="col-4 px-4 pb-1">
                          <h5 className="mb-0">{item.menu_name}</h5>
                          <div className="text-success">
                            <i className="ri-restaurant-line me-2"></i>
                            <span>{item.menu_cat_name}</span>
                          </div>
                        </div>
                        <div className="col-4 h5 text-center px-2">
                          x {item.quantity}
                        </div>
                        <div className="col-4 text-start px-2">
                          <p className="mb-2 fs-4 fw-medium">
                            <span className="ms-0 me-2 text-info">
                              ₹{item.price}
                            </span>
                            <div className="">
                              <span className="text-muted fs-6 text-decoration-line-through">
                                ₹ {item.oldPrice || item.price}
                              </span>
                              <span className="fs-6 ps-2 text-primary">
                                {item.offer || "No "}% Off
                              </span>
                            </div>
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>No items in the cart.</div>
                  )}

                  <div className="my-3 px-2">
                    Total
                    <span className="float-end h5">
                      ₹{parseFloat(total).toFixed(2)}
                    </span>
                  </div>
                  <div className="my-3 px-2">
                    Service Charges ({serviceChargesPercent}%)
                    <span className="float-end h5">
                      ₹{parseFloat(serviceCharges).toFixed(2)}
                    </span>
                  </div>
                  <div className="my-3 px-2">
                    GST ({gstPercent}%)
                    <span className="float-end h5">
                      ₹{parseFloat(tax).toFixed(2)}
                    </span>
                  </div>
                  <div className="px-2">
                    Discount ({discountPercent}%)
                    <span className="float-end h5 mb-2">
                      ₹{parseFloat(discount).toFixed(2)}
                    </span>
                  </div>
                  <h5 className="mt-2 px-2">
                    <hr />
                    Grand Total{" "}
                    <span className="float-end">
                      ₹{parseFloat(grandTotal).toFixed(2)}
                    </span>
                  </h5>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="#"
                className="btn btn-primary rounded-pill w-50 mt-3"
                onClick={handleSubmitOrder}
              >
                Place Order
              </Link>
            </div>
          </div>
        </div>
      </main>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="circle">
              <img src={OrderGif} alt="Order Success" className="popup-gif" />
            </div>
            <h4>Your Order Successfully Placed</h4>
            <p>You have successfully made payment and placed your order.</p>
            <button className="btn btn-success w-100 mt-3" onClick={closePopup}>
              View Order
            </button>
          </div>
        </div>
      )}

      <Bottom />
    </div>
  );
};

export default Checkout;
