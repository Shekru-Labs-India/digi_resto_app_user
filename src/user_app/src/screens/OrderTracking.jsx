// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import SigninButton from '../constants/SigninButton';
// import Bottom from '../component/bottom';
// import { useRestaurantId } from '../context/RestaurantIdContext';
// const  OrderTracking = () => {
//   const [orders, setOrders] = useState([]);
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem('userData'));
//   const customerId = userData ? userData.customer_id : null;
//   const { restaurantId } = useRestaurantId();
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     console.log("OrderTracking component received new restaurant ID:", restaurantId);
//   }, [restaurantId]);

//   useEffect(() => {
//     const fetchOngoingOrders = async () => {
//       if (customerId && restaurantId) {
//         // Fetch orders using customerId
//       }
//     };
//     fetchOngoingOrders();
//   }, [customerId, restaurantId]);

//   const handleBack = () => {
//     navigate(-1);
//   };

//   return (
//     <div className="page-wrapper">
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link to="" className="back-btn dz-icon icon-fill icon-sm"  onClick={handleBack}>
//               <i className="fa-solid fa-arrow-left fs-3"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">Track Order</h5>
//           </div>
         
//         </div>
//       </header>
      
//       <main className="page-content space-top p-b70">
//         <div className="container">
//         {loading ? (
//             <div id="preloader">
//               <div className="loader">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <>
//         {userData ? (
//             // User is authenticated, render ongoing orders
//             <div className="default-tab style-2">
//               <div className="dz-tabs">
//                 {/* No need for tab navigation since only ongoing orders are displayed */}
//               </div>
    
//               <div className="tab-content">
//                 <div className="tab-pane fade show active" id="home" role="tabpanel">
//                   <OrdersTab orders={orders} />
//                 </div>
//               </div>
//             </div>
//               ) : (
//                 // User is not authenticated, render sign-in button
//               <SigninButton></SigninButton>
//           )}
//             </>
//           )}
//         </div>
//       </main>
//       <Bottom></Bottom>
//     </div>
//   );
// };

// const OrdersTab = ({ orders }) => {
//   const navigate = useNavigate();

//   const handleTrackOrderClick = (orderNumber) => {
//     // Navigate to the track order screen with the order number
//     navigate(`/TrackOrder/${orderNumber}`);
//   };

//   return (
//     <div className="row g-3">
//       {orders.map(order => (
//         <div key={order.order_number} className="col-12">
//           <div className="dz-card list-style style-3">
//             <div className="dz-content1">
//               <Link to={`/TrackOrder/${order.order_number}`}>
//                 <h5 className="title" style={{ fontSize: '19px', paddingTop: '10px' }}>{order.order_number}</h5>
//                 <ul className="dz-meta">
//                   <li className="dz-price">₹{order.total_bill}</li>
//                 </ul>
//                 <span className="dz-off">{order.restaurant_name}</span>
//               </Link>
//               <button
//                 className="info-btn btn btn-primary btn-sm btn-xs font-13"
//                 onClick={() => handleTrackOrderClick(order.order_number)}
//               >
//                 Track Order
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default OrderTracking;




// 28-09




// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import SigninButton from "../constants/SigninButton";
// import Bottom from "../component/bottom";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import OrderGif from "./OrderGif";
// import LoaderGif from "./LoaderGIF";

// const OrderTracking = () => {
//   const [orders, setOrders] = useState([]);
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const customerId = userData ? userData.customer_id : null;
//   const { restaurantId, restaurantCode } = useRestaurantId();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     console.log(
//       "OrderTracking component received new restaurant ID:",
//       restaurantId
//     );
//     console.log(
//       "OrderTracking component received new restaurant Code:",
//       restaurantCode
//     );
//   }, [restaurantId, restaurantCode]);

//   useEffect(() => {
//     const fetchOngoingOrders = async () => {
//       if (customerId && restaurantId) {
//         // Fetch orders using customerId
//       }
//     };
//     fetchOngoingOrders();
//   }, [customerId, restaurantId]);

//   const handleBack = () => {
//     navigate(-1);
//   };

//   return (
//     <div className="page-wrapper">
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link
//               to=""
//               className="back-btn dz-icon icon-fill icon-sm"
//               onClick={handleBack}
//             >
//               <i className="fa-solid fa-arrow-left fs-3"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">Track Order</h5>
//           </div>
//         </div>
//       </header>

//       <main className="page-content space-top p-b70">
//         <div className="container">
//           {loading ? (
//             <div id="preloader">
//               <div className="loader">
//                 {/* <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading...</span>
//                 </div> */}
//                 <LoaderGif />
//               </div>
//             </div>
//           ) : (
//             <>
//               {userData ? (
//                 // User is authenticated, render ongoing orders
//                 <div className="default-tab style-2">
//                   <div className="dz-tabs">
//                     {/* No need for tab navigation since only ongoing orders are displayed */}
//                   </div>

//                   <div className="tab-content">
//                     <div
//                       className="tab-pane fade show active"
//                       id="home"
//                       role="tabpanel"
//                     >
//                       <OrdersTab orders={orders} />
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 // User is not authenticated, render sign-in button
//                 <SigninButton></SigninButton>
//               )}
//             </>
//           )}
//         </div>
//       </main>
//       <Bottom></Bottom>
//     </div>
//   );
// };

// const OrdersTab = ({ orders }) => {
//   const navigate = useNavigate();

//   const handleTrackOrderClick = (orderNumber) => {
//     // Navigate to the track order screen with the order number
//     navigate(`/TrackOrder/${orderNumber}`);
//   };

//   return (
//     <div className="row g-3">
//       {orders.map((order) => (
//         <div key={order.order_number} className="col-12">
//           <div className="dz-card list-style style-3">
//             <div className="dz-content1">
//               <Link to={`/TrackOrder/${order.order_number}`}>
//                 <h5
//                   className="title"
//                   style={{ fontSize: "19px", paddingTop: "10px" }}
//                 >
//                   #{order.order_number}
//                 </h5>
//                 <ul className="dz-meta">
//                   <li className="dz-price">₹{order.total_bill}</li>
//                 </ul>
//                 <span className="dz-off">{order.restaurant_name}</span>
//               </Link>
//               <button
//                 className="info-btn btn btn-primary btn-sm btn-xs font-13"
//                 onClick={() => handleTrackOrderClick(order.order_number)}
//               >
//                 Track Order
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default OrderTracking;