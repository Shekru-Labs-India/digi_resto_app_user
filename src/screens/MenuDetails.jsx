// import React, { useState, useEffect } from "react";
// import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import { useCart } from "../hooks/useCart";
// import Bottom from "../component/bottom";

// const MenuDetails = () => {
//   const [productDetails, setProductDetails] = useState(null);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [quantity, setQuantity] = useState(1);
//   const [showQuantityError, setShowQuantityError] = useState(false);
//   const navigate = useNavigate();
//   const [cartItemsCount, setCartItemsCount] = useState(0);
//   const { menuId } = useParams();
//   const { restaurantId } = useRestaurantId();
//   const [customerId, setCustomerId] = useState(null);
//   const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
//   const { addToCart, cartItems } = useCart();
//   const location = useLocation(); // For retrieving passed state
//   const menu_cat_id = location.state?.menu_cat_id || 1; // Defaulting to 1 if not passed

//   // Fetch customer ID from localStorage on component mount
//   useEffect(() => {
//     const storedUserData = localStorage.getItem("userData");
//     if (storedUserData) {
//       const userData = JSON.parse(storedUserData);
//       setCustomerId(userData.customer_id);
//     }
//   }, []);

//   // Convert string to Title Case
//   const toTitleCase = (str) => {
//     if (!str) return "";
//     return str.replace(
//       /\w\S*/g,
//       (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
//     );
//   };

//   // Fetch product details based on menuId and menu_cat_id
//   const fetchProductDetails = async () => {
//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_menu_details",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//             menu_cat_id: menu_cat_id, // Dynamic menu_cat_id
//           }),
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         if (data.st === 1 && data.details) {
//           const {
//             menu_name,
//             category_name,
//             spicy_index,
//             price,
//             description,
//             image,
//             offer,
//             rating,
//           } = data.details;

//           // Parse the offer percentage
//           const offerPercentage = parseInt(offer.replace(/[^0-9]/g, "")); // Extract percentage
//           const discountedPrice = offerPercentage
//             ? price - (price * offerPercentage) / 100
//             : price; // Calculate discounted price

//           setProductDetails({
//             name: menu_name,
//             veg_nonveg: category_name,
//             spicy_index,
//             price,
//             discountedPrice, // Store the calculated discounted price
//             description,
//             image,
//             menu_cat_name: category_name,
//             menu_id: menuId,
//             offer,
//             rating,
//           });
//         } else {
//           console.error("Invalid data format:", data);
//         }
//       } else {
//         console.error("Network response was not ok.");
//       }
//     } catch (error) {
//       console.error("Error fetching product details:", error);
//     }
//   };

//   useEffect(() => {
//     if (menuId && restaurantId && customerId !== null) {
//       fetchProductDetails();
//     }
//   }, [menuId, restaurantId, customerId]);

//   useEffect(() => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     setCartItemsCount(cartItems.length);
//   }, []);

//   const handleLikeClick = async () => {
//     if (!customerId || !restaurantId || !menuId) {
//       console.error("Missing required IDs");
//       return;
//     }

//     setIsFavoriteLoading(true);

//     try {
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

//       const data = await response.json();
//       console.log("API Response:", data);

//       if (data.st === 1) {
//         setIsFavorite(!isFavorite);
//         console.log("Favorite status updated successfully");
//       } else if (data.st === 2 && !isFavorite) {
//         console.log("Menu already in wishlist");
//         setIsFavorite(true);
//       } else if (data.st === 2 && isFavorite) {
//         console.log("Menu already removed from wishlist");
//         setIsFavorite(false);
//       } else {
//         console.error("Failed to update favorite status:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error updating favorite status:", error);
//     } finally {
//       setIsFavoriteLoading(false);
//     }
//   };

//   const handleAddToCart = () => {
//     if (quantity === 0 || !productDetails) return;

//     addToCart({ ...productDetails, quantity });
//     navigate("/Cart");
//   };

// const totalAmount =
//   quantity * (productDetails?.discountedPrice || productDetails?.price || 0);

// const incrementQuantity = () => {
//   if (quantity < 20) {
//     setQuantity((prevQuantity) => prevQuantity + 1);
//     setShowQuantityError(false);
//   } else {
//     alert("Maximum limit reached for this item.");
//   }
// };

// const decrementQuantity = () => {
//   if (quantity > 1) {
//     // Prevent going below 1
//     setQuantity((prevQuantity) => prevQuantity - 1);
//     setShowQuantityError(false);
//   }
// };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   const shouldDisplayFooter = !cartItems.some(
//     (item) => item.menu_id === productDetails?.menu_id
//   );

//   if (!productDetails) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <div className="page-wrapper">
//         <header className="header header-fixed style-3">
//           <div className="header-content">
//             <div className="left-content">
//               <div
//                 className="back-btn dz-icon icon-fill icon-sm"
//                 onClick={handleBack}
//               >
//                 <i className="ri-arrow-left-line fs-3"></i>
//               </div>
//             </div>
//             <div className="mid-content">
//               <h5 className="title fs-5">Product Details</h5>
//             </div>
//             {/* <div className="right-content">
//               <Link
//                 to="/Cart"
//                 className="notification-badge dz-icon icon-sm icon-fill"
//               >
//                 <i className="ri-shopping-cart-2-line"></i>
//                 {cartItemsCount > 0 && (
//                   <span className="badge badge-danger">{cartItemsCount}</span>
//                 )}
//               </Link>
//             </div> */}
//           </div>
//         </header>

//         <main className="page-content p-b80">
//           <div className="swiper product-detail-swiper">
//             <div className="product-detail-image img">
//               <img
//                 className="product-detail-image"
//                 src={productDetails.image || images}
//                 alt={productDetails.name}
//                 style={{
//                   height: "335px",
//                   width: "360px",
//                   borderRadius: "10px",
//                   marginTop: "80px",
//                 }}
//                 onError={(e) => {
//                   e.target.src = images;
//                 }}
//               />
//             </div>
//             <div className="swiper-btn p-t15">
//               <div className="swiper-pagination style-1"></div>
//             </div>
//           </div>
//           <div className="container">
//             <div className="dz-product-detail">
//               <div className="detail-content" style={{}}>
//                 {productDetails.menu_cat_name && (
//                   <h3 className="product-title">
//                     {/* {productDetails.menu_cat_name} */}
//                   </h3>
//                 )}
//                 <div className="row mt-0">
//                   <div className="col-8">
//                     <h4 className="title fs-5">
//                       {toTitleCase(productDetails.name)}
//                       {/* ({toTitleCase(productDetails.veg_nonveg)}) */}
//                     </h4>
//                   </div>
//                   <div
//                     className="col-4 py-1"
//                     style={{
//                       // backgroundColor: "#f2eceb",
//                       borderRadius: "12px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-evenly",
//                       padding: "10px 15px",
//                     }}
//                   >
//                     <button
//                       onClick={decrementQuantity}
//                       style={{
//                         width: "25px",
//                         height: "25px",
//                         borderRadius: "50%",
//                         border: "1px solid #ccc",
//                         background: "#fff",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         cursor: "pointer",
//                       }}
//                     >
//                       <i
//                         className="ri-subtract-line"
//                         style={{ fontSize: "18px" }}
//                       ></i>
//                     </button>

//                     <span style={{ fontSize: "20px", fontWeight: "bold" }}>
//                       {quantity}
//                     </span>

//                     <button
//                       onClick={incrementQuantity}
//                       style={{
//                         width: "25px",
//                         height: "25px",
//                         borderRadius: "50%",
//                         border: "1px solid #ccc",
//                         background: "#fff",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         cursor: "pointer",
//                       }}
//                     >
//                       <i
//                         className="ri-add-line"
//                         style={{ fontSize: "20px" }}
//                       ></i>
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <div className="product-meta">
//                 <div className="row">
//                   <div className="col-4">
//                     <div
//                       className="dz-quantity detail-content fs-4 fw-medium m-0"
//                       style={{ color: "#0a795b" }}
//                     >
//                       <i
//                         className="ri-restaurant-line fs-3 "
//                         style={{ paddingRight: "5px" }}
//                       ></i>
//                       {productDetails.menu_cat_name || "Category Name"}
//                     </div>
//                   </div>
//                   <div className="col-4 text-center">
//                     <div className="d-flex align-items-center">
//                       <i
//                         className="ri-star-half-line pe-1"
//                         style={{ color: "#f8a500", fontSize: "23px" }}
//                       ></i>
//                       <span
//                         className="fs-3 fw-semibold"
//                         style={{ color: "#7f7e7e", marginLeft: "5px" }}
//                       >
//                         {productDetails.rating}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="col-4 text-end">
//                     {productDetails.spicy_index && (
//                       <div
//                         className="spicy-index"
//                         style={{ paddingBottom: "10px" }}
//                       >
//                         {Array.from({ length: 5 }).map((_, index) =>
//                           index < productDetails.spicy_index ? (
//                             <i
//                               key={index}
//                               className="ri-fire-fill fs-2"
//                               style={{ color: "#eb8e57" }}
//                             ></i>
//                           ) : (
//                             <i
//                               key={index}
//                               className="ri-fire-line fs-2"
//                               style={{ color: "#0000001a" }}
//                             ></i>
//                           )
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <div className="container">
//                 <div className="product-info">
//                   <div>
//                     <p className="fs-6 text-wrap text-break">
//                       {productDetails.description}
//                     </p>
//                   </div>

//                   <div className="d-flex align-items-center justify-content-between py-4"></div>

//                   {showQuantityError && (
//                     <div className="text-danger">Please add a quantity.</div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//         <div className="container">
//           <div className="row">
//             <div className="col-12">
//               <footer
//                 className="footer fixed"
//                 style={{ position: "absolute", bottom: "70px" }}
//               >
//                 <div className="container">
//                   <div
//                     className=""
//                     style={{ position: "relative", top: "-50px" }}
//                   >
//                     <hr className="dashed" />
//                   </div>
//                   <div className="row">
//                     <div className="col-6">
//                       <div className="d-flex align-items-center justify-content-between mb-5">
//                         <div className="d-flex flex-column">
//                           <h5 className="mb-2 fs-6 fw-medium">Total amount</h5>
//                           <div className="d-flex align-items-baseline">
//                             <h4
//                               className="mb-0 price fs-4"
//                               style={{ color: "#4E74FC" }}
//                             >
//                               ₹ {productDetails.price}
//                             </h4>
//                             <span
//                               className="text-decoration-line-through ms-2 fs-6"
//                               style={{ color: "#a5a5a5" }}
//                             >
//                               ₹{productDetails.discountedPrice}{" "}
//                             </span>
//                             <div
//                               className="fw-medium d-flex fs-6 ps-2"
//                               style={{ color: "#0D775E" }}
//                             >
//                               {productDetails.offer}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-6 text-end pt-2">
//                       <button
//                         className="btn btn-primary "
//                         style={{ borderRadius: "100px" }}
//                         onClick={handleAddToCart}
//                       >
//                         <i className="ri-shopping-cart-line fs-5 pe-3"></i>
//                         <div className="fs-6">Add to Cart</div>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </footer>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Bottom />
//     </>
//   );
// };

// export default MenuDetails;

// import React, { useState, useEffect } from "react";
// import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import { useCart } from "../hooks/useCart";
// import Bottom from "../component/bottom";

// const MenuDetails = () => {
//   const [productDetails, setProductDetails] = useState(null);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [quantity, setQuantity] = useState(1);
//   const [showQuantityError, setShowQuantityError] = useState(false);
//   const navigate = useNavigate();
//   const [cartItemsCount, setCartItemsCount] = useState(0);
//   const { menuId } = useParams();
//   const { restaurantId } = useRestaurantId();
//   const [customerId, setCustomerId] = useState(null);
//   const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
//   const { addToCart, cartItems } = useCart();
//   const location = useLocation();
//   const menu_cat_id = location.state?.menu_cat_id || 1;

//   useEffect(() => {
//     const storedUserData = localStorage.getItem("userData");
//     if (storedUserData) {
//       const userData = JSON.parse(storedUserData);
//       setCustomerId(userData.customer_id);
//     }
//   }, []);

//   const toTitleCase = (str) => {
//     if (!str) return "";
//     return str.replace(
//       /\w\S*/g,
//       (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
//     );
//   };

//   const fetchProductDetails = async () => {
//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_menu_details",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//             menu_cat_id: menu_cat_id,
//           }),
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         if (data.st === 1 && data.details) {
//           const {
//             menu_name,
//             category_name,
//             spicy_index,
//             price,
//             description,
//             image,
//             offer,
//             rating,
//           } = data.details;

//           const offerPercentage = parseInt(offer.replace(/[^0-9]/g, ""));
//           const discountedPrice = offerPercentage
//             ? price - (price * offerPercentage) / 100
//             : price;

//           setProductDetails({
//             name: menu_name,
//             veg_nonveg: category_name,
//             spicy_index,
//             price,
//             discountedPrice,
//             description,
//             image,
//             menu_cat_name: category_name,
//             menu_id: menuId,
//             offer,
//             rating,
//           });
//         } else {
//           console.error("Invalid data format:", data);
//         }
//       } else {
//         console.error("Network response was not ok.");
//       }
//     } catch (error) {
//       console.error("Error fetching product details:", error);
//     }
//   };

//   useEffect(() => {
//     if (menuId && restaurantId && customerId !== null) {
//       fetchProductDetails();
//     }
//   }, [menuId, restaurantId, customerId]);

//   useEffect(() => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     setCartItemsCount(cartItems.length);
//   }, []);

//   const handleLikeClick = async () => {
//     if (!customerId || !restaurantId || !menuId) {
//       console.error("Missing required IDs");
//       return;
//     }

//     setIsFavoriteLoading(true);

//     try {
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

//       const data = await response.json();
//       console.log("API Response:", data);

//       if (data.st === 1) {
//         setIsFavorite(!isFavorite);
//         console.log("Favorite status updated successfully");
//       } else if (data.st === 2 && !isFavorite) {
//         console.log("Menu already in wishlist");
//         setIsFavorite(true);
//       } else if (data.st === 2 && isFavorite) {
//         console.log("Menu already removed from wishlist");
//         setIsFavorite(false);
//       } else {
//         console.error("Failed to update favorite status:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error updating favorite status:", error);
//     } finally {
//       setIsFavoriteLoading(false);
//     }
//   };

//   const handleAddToCart = () => {
//     if (quantity === 0 || !productDetails) return;

//     addToCart({ ...productDetails, quantity });
//     navigate("/Cart");
//   };

//   const totalAmount =
//     quantity * (productDetails?.discountedPrice || productDetails?.price || 0);

//   const incrementQuantity = () => {
//     if (quantity < 20) {
//       setQuantity((prevQuantity) => prevQuantity + 1);
//       setShowQuantityError(false);
//     } else {
//       alert("Maximum limit reached for this item.");
//     }
//   };

//   const decrementQuantity = () => {
//     if (quantity > 1) {
//       // Prevent going below 1
//       setQuantity((prevQuantity) => prevQuantity - 1);
//       setShowQuantityError(false);
//     }
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   const shouldDisplayFooter = !cartItems.some(
//     (item) => item.menu_id === productDetails?.menu_id
//   );

//   if (!productDetails) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <div className="page-wrapper">
//         <header className="header header-fixed style-3">
//           <div className="header-content">
//             <div className="left-content">
//               <div
//                 className="back-btn dz-icon icon-fill icon-sm"
//                 onClick={handleBack}
//               >
//                 <i className="ri-arrow-left-line fs-3"></i>
//               </div>
//             </div>
//             <div className="mid-content">
//               <h5 className="title fs-5">Product Details</h5>
//             </div>
//             {/* <div className="right-content">
//               <Link
//                 to="/Cart"
//                 className="notification-badge dz-icon icon-sm icon-fill"
//               >
//                 <i className="ri-shopping-cart-2-line"></i>
//                 {cartItemsCount > 0 && (
//                   <span className="badge badge-danger">{cartItemsCount}</span>
//                 )}
//               </Link>
//             </div> */}
//           </div>
//         </header>

//         <main className="page-content p-b80">
//           <div className="swiper product-detail-swiper">
//             <div className="product-detail-image img">
//               <img
//                 className="product-detail-image"
//                 src={productDetails.image || images}
//                 alt={productDetails.name}
//                 style={{
//                   height: "100%",
//                   width: "100%",
//                 }}
//                 onError={(e) => {
//                   e.target.src = images;
//                 }}
//               />
//             </div>
//           </div>
//           <div className="container">
//             <div className="dz-product-detail">
//               <div className="detail-content" style={{}}>
//                 {productDetails.menu_cat_name && (
//                   <h3 className="product-title">
//                     {/* {productDetails.menu_cat_name} */}
//                   </h3>
//                 )}
//                 <div className="row mt-0 me-1">
//                   <div className="col-7 mt-2">
//                     <h4 className="title fs-5">
//                       {toTitleCase(productDetails.name)}
//                     </h4>
//                   </div>
//                   <div
//                     className="col-5 py-1  "
//                     style={{
//                       borderRadius: "5px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-evenly",
//                       padding: "10px 15px",
//                       backgroundColor: "#E6DFDF",
//                     }}
//                   >
//                     <button
//                       onClick={decrementQuantity}
//                       style={{
//                         width: "25px",
//                         height: "25px",
//                         borderRadius: "50%",
//                         border: "1px solid #ccc",
//                         background: "#fff",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         cursor: "pointer",
//                       }}
//                     >
//                       <i
//                         className="ri-subtract-line"
//                         style={{ fontSize: "18px" }}
//                       ></i>
//                     </button>

//                     <span style={{ fontSize: "20px" }}>{quantity}</span>

//                     <button
//                       onClick={incrementQuantity}
//                       style={{
//                         width: "25px",
//                         height: "25px",
//                         borderRadius: "50%",
//                         border: "1px solid #ccc",
//                         background: "#fff",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         cursor: "pointer",
//                       }}
//                     >
//                       <i
//                         className="ri-add-line"
//                         style={{ fontSize: "20px" }}
//                       ></i>
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <div className="product-meta">
//                 <div className="row me-1">
//                   <div className="col-4">
//                     <div
//                       className="dz-quantity detail-content fs-5 fw-medium m-0"
//                       style={{ color: "#0a795b" }}
//                     >
//                       <i
//                         className="ri-restaurant-line fs-4 "
//                         style={{ paddingRight: "5px" }}
//                       ></i>
//                       {productDetails.menu_cat_name || "Category Name"}
//                     </div>
//                   </div>
//                   <div className="col-4 text-center">
//                     <div className="d-flex align-items-center">
//                       <i
//                         className="ri-star-half-line pe-1"
//                         style={{ color: "#f8a500", fontSize: "23px" }}
//                       ></i>
//                       <span
//                         className="fs-5 fw-semibold"
//                         style={{ color: "#7f7e7e", marginLeft: "5px" }}
//                       >
//                         {productDetails.rating}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="col-4 text-end">
//                     {productDetails.spicy_index && (
//                       <div className="spicy-index">
//                         {Array.from({ length: 5 }).map((_, index) =>
//                           index < productDetails.spicy_index ? (
//                             <i
//                               key={index}
//                               className="ri-fire-fill fs-4"
//                               style={{ color: "#eb8e57" }}
//                             ></i>
//                           ) : (
//                             <i
//                               key={index}
//                               className="ri-fire-line fs-4"
//                               style={{ color: "#0000001a" }}
//                             ></i>
//                           )
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <div className="container">
//                 <div className="product-info">
//                   <div>
//                     <p className="fs-7 text-wrap ">
//                       {productDetails.description}
//                     </p>
//                   </div>

//                   <div className="d-flex align-items-center justify-content-between py-4"></div>

//                   {showQuantityError && (
//                     <div className="text-danger">Please add a quantity.</div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//         <div className="container">
//           <div className="row">
//             <div className="col-12">
//               <footer
//                 className="footer fixed"
//                 style={{ position: "absolute", bottom: "70px" }}
//               >
//                 <div className="container">
//                   <div
//                     className=""
//                     style={{ position: "relative", top: "-50px" }}
//                   ></div>
//                   <div className="row">
//                     <hr className="dashed-line me-3" />

//                     <div className="col-6 pt-2">
//                       <div className="d-flex align-items-center justify-content-between mb-5">
//                         <div className="d-flex flex-column">
//                           <h5 className="mb-2 fs-6 fw-medium">Total amount</h5>
//                           <div className="d-flex align-items-baseline">
//                             <h4
//                               className="mb-0 price fs-4"
//                               style={{ color: "#4E74FC" }}
//                             >
//                               ₹ {productDetails.price}
//                             </h4>
//                             <span
//                               className="text-decoration-line-through ms-2 fs-6"
//                               style={{ color: "#a5a5a5" }}
//                             >
//                               ₹{productDetails.discountedPrice}{" "}
//                             </span>
//                             <div
//                               className="fw-medium d-flex fs-6 ps-2"
//                               style={{ color: "#0D775E" }}
//                             >
//                               {productDetails.offer}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-6 text-end pt-4">
//                       <button
//                         className="btn btn-primary "
//                         style={{ borderRadius: "100px" }}
//                         onClick={handleAddToCart}
//                       >
//                         <i className="ri-shopping-cart-line fs-4 me-2"></i>
//                         <div className="fs-7">Add to Cart</div>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </footer>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Bottom />
//     </>
//   );
// };

// export default MenuDetails;

// import React, { useState, useEffect } from "react";
// import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import { useCart } from "../hooks/useCart";
// import Bottom from "../component/bottom";

// const MenuDetails = () => {
//   const [productDetails, setProductDetails] = useState(null);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [quantity, setQuantity] = useState(1);
//   const [showQuantityError, setShowQuantityError] = useState(false);
//   const navigate = useNavigate();
//   const [cartItemsCount, setCartItemsCount] = useState(0);
//   const { menuId } = useParams();
//   const { restaurantId } = useRestaurantId();
//   const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
//   const { addToCart, cartItems } = useCart();
//   const location = useLocation();
//   const menu_cat_id = location.state?.menu_cat_id || 1;

//   const toTitleCase = (str) => {
//     if (!str) return "";
//     return str.replace(
//       /\w\S*/g,
//       (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
//     );
//   };

//   const fetchProductDetails = async () => {
//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_menu_details",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//             menu_cat_id: menu_cat_id,
//           }),
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         if (data.st === 1 && data.details) {
//           const {
//             menu_name,
//             category_name,
//             spicy_index,
//             price,
//             description,
//             image,
//             offer,
//             rating,
//           } = data.details;

//           const discountedPrice = offer ? price - (price * offer) / 100 : price;

//           setProductDetails({
//             name: menu_name,
//             veg_nonveg: category_name,
//             spicy_index,
//             price,
//             discountedPrice,
//             description,
//             image,
//             menu_cat_name: category_name,
//             menu_id: menuId,
//             offer,
//             rating,
//           });
//         } else {
//           console.error("Invalid data format:", data);
//         }
//       } else {
//         console.error("Network response was not ok.");
//       }
//     } catch (error) {
//       console.error("Error fetching product details:", error);
//     }
//   };

//   // Fetch product details when menuId or restaurantId is available
//   useEffect(() => {
//     if (menuId && restaurantId) {
//       fetchProductDetails();
//     }
//   }, [menuId, restaurantId]);

//   // Update cart items count on mount
//   useEffect(() => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     setCartItemsCount(cartItems.length);
//   }, []);

//   const handleLikeClick = async () => {
//     if (!restaurantId || !menuId) {
//       console.error("Missing required IDs");
//       return;
//     }

//     setIsFavoriteLoading(true);

//     try {
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
//         }),
//       });

//       const data = await response.json();
//       if (data.st === 1) {
//         setIsFavorite(!isFavorite);
//         console.log("Favorite status updated successfully");
//       } else {
//         console.error("Failed to update favorite status:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error updating favorite status:", error);
//     } finally {
//       setIsFavoriteLoading(false);
//     }
//   };

//   const handleAddToCart = () => {
//     if (quantity === 0 || !productDetails) return;

//     addToCart({ ...productDetails, quantity });
//     navigate("/Cart");
//   };

//   const totalAmount =
//     quantity * (productDetails?.discountedPrice || productDetails?.price || 0);

//   const incrementQuantity = () => {
//     if (quantity < 20) {
//       setQuantity((prevQuantity) => prevQuantity + 1);
//       setShowQuantityError(false);
//     } else {
//       alert("Maximum limit reached for this item.");
//     }
//   };

//   const decrementQuantity = () => {
//     if (quantity > 1) {
//       setQuantity((prevQuantity) => prevQuantity - 1);
//       setShowQuantityError(false);
//     }
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   if (!productDetails) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <div className="page-wrapper">
//         <header className="header header-fixed style-3">
//           <div className="header-content">
//             <div className="left-content">
//               <div
//                 className="back-btn dz-icon icon-fill icon-sm"
//                 onClick={handleBack}
//               >
//                 <i className="ri-arrow-left-line fs-3"></i>
//               </div>
//             </div>
//             <div className="mid-content">
//               <h5 className="title fs-5">Product Details</h5>
//             </div>
//           </div>
//         </header>

//         <main className="page-content p-b80">
//           <div className="swiper product-detail-swiper">
//             <div className="product-detail-image img">
//               <img
//                 className="product-detail-image"
//                 src={productDetails.image || images}
//                 alt={productDetails.name}
//                 style={{
//                   height: "100%",
//                   width: "100%",
//                 }}
//                 onError={(e) => {
//                   e.target.src = images;
//                 }}
//               />
//             </div>
//           </div>
//           <div className="container">
//             <div className="dz-product-detail">
//               <div className="detail-content" style={{}}>
//                 {productDetails.menu_cat_name && (
//                   <h3 className="product-title">
//                     {toTitleCase(productDetails.menu_cat_name)}
//                   </h3>
//                 )}
//                 <div className="row mt-0 me-1">
//                   <div className="col-7 mt-2">
//                     <h4 className="title fs-5">
//                       {toTitleCase(productDetails.name)}
//                     </h4>
//                   </div>
//                   <div
//                     className="col-5 py-1"
//                     style={{
//                       borderRadius: "5px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-evenly",
//                       padding: "10px 15px",
//                       backgroundColor: "#E6DFDF",
//                     }}
//                   >
//                     <button
//                       onClick={decrementQuantity}
//                       style={{
//                         width: "25px",
//                         height: "25px",
//                         borderRadius: "50%",
//                         border: "1px solid #ccc",
//                         background: "#fff",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         cursor: "pointer",
//                       }}
//                     >
//                       <i
//                         className="ri-subtract-line"
//                         style={{ fontSize: "18px" }}
//                       ></i>
//                     </button>

//                     <span style={{ fontSize: "20px" }}>{quantity}</span>

//                     <button
//                       onClick={incrementQuantity}
//                       style={{
//                         width: "25px",
//                         height: "25px",
//                         borderRadius: "50%",
//                         border: "1px solid #ccc",
//                         background: "#fff",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         cursor: "pointer",
//                       }}
//                     >
//                       <i
//                         className="ri-add-line"
//                         style={{ fontSize: "20px" }}
//                       ></i>
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <div className="product-meta">
//                 <div className="row me-1">
//                   <div className="col-4">
//                     <div
//                       className="dz-quantity detail-content fs-5 fw-medium m-0"
//                       style={{ color: "#0a795b" }}
//                     >
//                       <i
//                         className="ri-restaurant-line fs-4 "
//                         style={{ paddingRight: "5px" }}
//                       ></i>
//                       {productDetails.menu_cat_name || "Category Name"}
//                     </div>
//                   </div>
//                   <div className="col-4 text-center">
//                     <div className="d-flex align-items-center">
//                       <i
//                         className="ri-star-half-line pe-1"
//                         style={{ color: "#f8a500", fontSize: "23px" }}
//                       ></i>
//                       <span
//                         className="fs-5 fw-semibold"
//                         style={{ color: "#7f7e7e", marginLeft: "5px" }}
//                       >
//                         {productDetails.rating}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="col-4 text-end">
//                     {productDetails.spicy_index && (
//                       <div className="spicy-index">
//                         {Array.from({ length: 5 }).map((_, index) =>
//                           index < productDetails.spicy_index ? (
//                             <i
//                               key={index}
//                               className="ri-fire-fill fs-4"
//                               style={{ color: "#eb8e57" }}
//                             ></i>
//                           ) : (
//                             <i
//                               key={index}
//                               className="ri-fire-line fs-4"
//                               style={{ color: "#0000001a" }}
//                             ></i>
//                           )
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <div className="container">
//                 <div className="product-info">
//                   <div>
//                     <p className="fs-7 text-wrap ">
//                       {productDetails.description}
//                     </p>
//                   </div>

//                   <div className="d-flex align-items-center justify-content-between py-4"></div>

//                   {showQuantityError && (
//                     <div className="text-danger">Please add a quantity.</div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//         <div className="container">
//           <div className="row">
//             <div className="col-12">
//               <footer
//                 className="footer fixed"
//                 style={{ position: "absolute", bottom: "70px" }}
//               >
//                 <div className="container">
//                   <div className="row">
//                     <hr className="dashed-line me-3" />

//                     <div className="col-6 pt-2">
//                       <div className="d-flex align-items-center justify-content-between mb-5">
//                         <div className="d-flex flex-column">
//                           <h5 className="mb-2 fs-6 fw-medium">Total amount</h5>
//                           <div className="d-flex align-items-baseline">
//                             <h4
//                               className="mb-0 price fs-4"
//                               style={{ color: "#4E74FC" }}
//                             >
//                               ₹ {productDetails.price}
//                             </h4>
//                             <span
//                               className="text-decoration-line-through ms-2 fs-6"
//                               style={{ color: "#a5a5a5" }}
//                             >
//                               ₹{productDetails.discountedPrice}
//                             </span>
//                             <div
//                               className="fw-medium d-flex fs-6 ps-2"
//                               style={{ color: "#0D775E" }}
//                             >
//                               {productDetails.offer}%
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-6 text-end pt-4">
//                       <button
//                         className="btn btn-primary "
//                         style={{ borderRadius: "100px" }}
//                         onClick={handleAddToCart}
//                       >
//                         <i className="ri-shopping-cart-line fs-4 me-2"></i>
//                         <div className="fs-7">Add to Cart</div>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </footer>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Bottom />
//     </>
//   );
// };

// export default MenuDetails;

// import React, { useState, useEffect } from "react";
// import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import { useCart } from "../hooks/useCart";
// import Bottom from "../component/bottom";

// const MenuDetails = () => {
//   const [productDetails, setProductDetails] = useState(null);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [quantity, setQuantity] = useState(1);
//   const [showQuantityError, setShowQuantityError] = useState(false);
//   const navigate = useNavigate();
//   const [cartItemsCount, setCartItemsCount] = useState(0);
//   const { menuId } = useParams();
//   const { restaurantId } = useRestaurantId();
//   const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
//   const { addToCart, cartItems } = useCart();
//   const location = useLocation();
//   const menu_cat_id = location.state?.menu_cat_id || 1;

//   const toTitleCase = (str) => {
//     if (!str) return "";
//     return str.replace(
//       /\w\S*/g,
//       (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
//     );
//   };

//   const fetchProductDetails = async () => {
//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/get_menu_details",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//             menu_cat_id: menu_cat_id,
//           }),
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         if (data.st === 1 && data.details) {
//           const {
//             menu_name,
//             category_name,
//             spicy_index,
//             price,
//             description,
//             image,
//             offer,
//             rating,
//           } = data.details;

//           const discountedPrice = offer ? price - (price * offer) / 100 : price;

//           setProductDetails({
//             name: menu_name,
//             veg_nonveg: category_name,
//             spicy_index,
//             price,
//             discountedPrice,
//             description,
//             image,
//             menu_cat_name: category_name,
//             menu_id: menuId,
//             offer,
//             rating,
//           });
//         } else {
//           console.error("Invalid data format:", data);
//         }
//       } else {
//         console.error("Network response was not ok.");
//       }
//     } catch (error) {
//       console.error("Error fetching product details:", error);
//     }
//   };

//   // Fetch product details when menuId or restaurantId is available
//   useEffect(() => {
//     if (menuId && restaurantId) {
//       fetchProductDetails();
//     }
//   }, [menuId, restaurantId]);

//   // Update cart items count on mount
//   useEffect(() => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     setCartItemsCount(cartItems.length);
//   }, []);

//   const handleLikeClick = async () => {
//     if (!restaurantId || !menuId) {
//       console.error("Missing required IDs");
//       return;
//     }

//     setIsFavoriteLoading(true);

//     try {
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
//         }),
//       });

//       const data = await response.json();
//       if (data.st === 1) {
//         setIsFavorite(!isFavorite);
//         console.log("Favorite status updated successfully");
//       } else {
//         console.error("Failed to update favorite status:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error updating favorite status:", error);
//     } finally {
//       setIsFavoriteLoading(false);
//     }
//   };

//   const handleAddToCart = () => {
//     if (quantity === 0 || !productDetails) return;

//     addToCart({ ...productDetails, quantity });
//     navigate("/Cart");
//   };

//   const totalAmount =
//     quantity * (productDetails?.discountedPrice || productDetails?.price || 0);

//   const incrementQuantity = () => {
//     if (quantity < 20) {
//       setQuantity((prevQuantity) => prevQuantity + 1);
//       setShowQuantityError(false);
//     } else {
//       alert("Maximum limit reached for this item.");
//     }
//   };

//   const decrementQuantity = () => {
//     if (quantity > 1) {
//       setQuantity((prevQuantity) => prevQuantity - 1);
//       setShowQuantityError(false);
//     }
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   if (!productDetails) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <div className="page-wrapper">
//         <header className="header header-fixed style-3">
//           <div className="header-content">
//             <div className="left-content">
//               <div
//                 className="back-btn dz-icon icon-fill icon-sm"
//                 onClick={handleBack}
//               >
//                 <i className="ri-arrow-left-line fs-3"></i>
//               </div>
//             </div>
//             <div className="mid-content">
//               <h5 className="title fs-5">Product Details</h5>
//             </div>
//           </div>
//         </header>

//         <main className="page-content p-b80">
//           <div className="swiper product-detail-swiper">
//             <div className="product-detail-image img">
//               <img
//                 className="product-detail-image"
//                 src={productDetails.image || images}
//                 alt={productDetails.name}
//                 style={{
//                   height: "100%",
//                   width: "100%",
//                 }}
//                 onError={(e) => {
//                   e.target.src = images;
//                 }}
//               />
//             </div>
//           </div>
//           <div className="container">
//             <div className="dz-product-detail">
//               <div className="detail-content" style={{}}>
//                 {productDetails.menu_cat_name && (
//                   <h3 className="product-title">
//                     {toTitleCase(productDetails.menu_cat_name)}
//                   </h3>
//                 )}
//                 <div className="row mt-0 me-1">
//                   <div className="col-7 mt-2">
//                     <h4 className="title fs-5">
//                       {toTitleCase(productDetails.name)}
//                     </h4>
//                   </div>
//                   <div
//                     className="col-5 py-1"
//                     style={{
//                       borderRadius: "5px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-evenly",
//                       padding: "10px 15px",
//                       backgroundColor: "#E6DFDF",
//                     }}
//                   >
//                     <button
//                       onClick={decrementQuantity}
//                       style={{
//                         width: "25px",
//                         height: "25px",
//                         borderRadius: "50%",
//                         border: "1px solid #ccc",
//                         background: "#fff",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         cursor: "pointer",
//                       }}
//                     >
//                       <i
//                         className="ri-subtract-line"
//                         style={{ fontSize: "18px" }}
//                       ></i>
//                     </button>

//                     <span style={{ fontSize: "20px" }}>{quantity}</span>

//                     <button
//                       onClick={incrementQuantity}
//                       style={{
//                         width: "25px",
//                         height: "25px",
//                         borderRadius: "50%",
//                         border: "1px solid #ccc",
//                         background: "#fff",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         cursor: "pointer",
//                       }}
//                     >
//                       <i
//                         className="ri-add-line"
//                         style={{ fontSize: "20px" }}
//                       ></i>
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <div className="product-meta">
//                 <div className="row me-1">
//                   <div className="col-4">
//                     <div
//                       className="dz-quantity detail-content fs-5 fw-medium m-0"
//                       style={{ color: "#0a795b" }}
//                     >
//                       <i
//                         className="ri-restaurant-line fs-4 "
//                         style={{ paddingRight: "5px" }}
//                       ></i>
//                       {productDetails.menu_cat_name || "Category Name"}
//                     </div>
//                   </div>
//                   <div className="col-4 text-center">
//                     <div className="d-flex align-items-center">
//                       <i
//                         className="ri-star-half-line pe-1"
//                         style={{ color: "#f8a500", fontSize: "23px" }}
//                       ></i>
//                       <span
//                         className="fs-5 fw-semibold"
//                         style={{ color: "#7f7e7e", marginLeft: "5px" }}
//                       >
//                         {productDetails.rating}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="col-4 text-end">
//                     {productDetails.spicy_index && (
//                       <div className="spicy-index">
//                         {Array.from({ length: 5 }).map((_, index) =>
//                           index < productDetails.spicy_index ? (
//                             <i
//                               key={index}
//                               className="ri-fire-fill fs-4"
//                               style={{ color: "#eb8e57" }}
//                             ></i>
//                           ) : (
//                             <i
//                               key={index}
//                               className="ri-fire-line fs-4"
//                               style={{ color: "#0000001a" }}
//                             ></i>
//                           )
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <div className="container">
//                 <div className="product-info">
//                   <div>
//                     <p className="fs-7 text-wrap ">
//                       {productDetails.description}
//                     </p>
//                   </div>

//                   <div className="d-flex align-items-center justify-content-between py-4"></div>

//                   {showQuantityError && (
//                     <div className="text-danger">Please add a quantity.</div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//         <div className="container">
//           <div className="row">
//             <div className="col-12">
//               <footer
//                 className="footer fixed"
//                 style={{ position: "absolute", bottom: "70px" }}
//               >
//                 <div className="container">
//                   <div className="row">
//                     <hr className="dashed-line me-3" />

//                     <div className="col-6 pt-2">
//                       <div className="d-flex align-items-center justify-content-between mb-5">
//                         <div className="d-flex flex-column">
//                           <h5 className="mb-2 fs-6 fw-medium">Total amount</h5>
//                           <div className="d-flex align-items-baseline">
//                             <h4
//                               className="mb-0 price fs-4"
//                               style={{ color: "#4E74FC" }}
//                             >
//                               ₹ {productDetails.price}
//                             </h4>
//                             <span
//                               className="text-decoration-line-through ms-2 fs-6"
//                               style={{ color: "#a5a5a5" }}
//                             >
//                               ₹{productDetails.discountedPrice}
//                             </span>
//                             <div
//                               className="fw-medium d-flex fs-6 ps-2"
//                               style={{ color: "#0D775E" }}
//                             >
//                               {productDetails.offer}%
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-6 text-end pt-4">
//                       <button
//                         className="btn btn-primary "
//                         style={{ borderRadius: "100px" }}
//                         onClick={handleAddToCart}
//                       >
//                         <i className="ri-shopping-cart-line fs-4 me-2"></i>
//                         <div className="fs-7">Add to Cart</div>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </footer>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Bottom />
//     </>
//   );
// };

// export default MenuDetails;

import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import { useRestaurantId } from "../context/RestaurantIdContext";
import { useCart } from "../hooks/useCart";
import Bottom from "../component/bottom";

const MenuDetails = () => {
  const [productDetails, setProductDetails] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [showQuantityError, setShowQuantityError] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0); // Total amount state
  const navigate = useNavigate();
  const { menuId } = useParams();
  const { restaurantId } = useRestaurantId();
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const { addToCart } = useCart();
  const location = useLocation();
  const menu_cat_id = location.state?.menu_cat_id || 1;

  const toTitleCase = (str) => {
    if (!str) return "";
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  // Fetch product details
  const fetchProductDetails = async () => {
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
            menu_cat_id: menu_cat_id,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1 && data.details) {
          const {
            menu_name,
            category_name,
            spicy_index,
            price,
            description,
            image,
            offer,
            rating,
          } = data.details;

          const discountedPrice = offer ? price - (price * offer) / 100 : price;

          setProductDetails({
            name: menu_name,
            veg_nonveg: category_name,
            spicy_index,
            price,
            discountedPrice,
            description,
            image,
            menu_cat_name: category_name,
            menu_id: menuId,
            offer,
            rating,
          });

          // Set the initial total amount
          setTotalAmount(discountedPrice * quantity);
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

  // Function to update cart quantity via API
  const updateCartQuantity = async (newQuantity) => {
    if (!restaurantId || !menuId) {
      console.error("Missing restaurant or menu ID");
      return;
    }

    try {
      const response = await fetch(
        "https://menumitra.com/user_api/update_cart_menu_quantity",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            menu_id: menuId,
            cart_id: localStorage.getItem("cartId") || 1,
            customer_id: JSON.parse(localStorage.getItem("userData"))
              ?.customer_id,
            quantity: newQuantity,
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1) {
        console.log("Menu quantity updated successfully.");
        setQuantity(newQuantity); // Update the quantity in the state

        // Recalculate the total amount
        const newTotalAmount =
          newQuantity *
          (productDetails?.discountedPrice || productDetails?.price);
        setTotalAmount(newTotalAmount);
      } else {
        console.error("Failed to update menu quantity:", data.msg);
      }
    } catch (error) {
      console.error("Error updating menu quantity:", error);
    }
  };

  // Fetch product details when menuId or restaurantId is available
  useEffect(() => {
    if (menuId && restaurantId) {
      fetchProductDetails();
    }
  }, [menuId, restaurantId]);

  const incrementQuantity = () => {
    if (quantity < 20) {
      const newQuantity = quantity + 1;
      updateCartQuantity(newQuantity); // Update the quantity and total amount
      setShowQuantityError(false);
    } else {
      alert("Maximum limit reached for this item.");
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      updateCartQuantity(newQuantity); // Update the quantity and total amount
      setShowQuantityError(false);
    }
  };

  const handleAddToCart = () => {
    if (quantity === 0 || !productDetails) return;

    addToCart({ ...productDetails, quantity });
    navigate("/Cart");
  };

  const handleBack = () => {
    navigate(-1);
  };

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
                <i className="ri-arrow-left-line fs-3"></i>
              </div>
            </div>
            <div className="mid-content">
              <h5 className="title fs-5">Product Details</h5>
            </div>
          </div>
        </header>

        <main className="page-content pb-5">
          {/* <main className="page-content p-b80"> */}
          <div className="swiper product-detail-swiper">
            <div className="product-detail-image img">
              <img
                className="product-detail-image"
                src={productDetails.image || images}
                alt={productDetails.name}
                style={{
                  height: "100%",
                  width: "100%",
                }}
                onError={(e) => {
                  e.target.src = images;
                }}
              />
            </div>
          </div>

          {/* make above constainers height till here so scroll will end and below container will not hide any thing */}

          <div className="container">
            <div className="dz-product-detail">
              <div className="detail-content mt-0" style={{}}>
                {productDetails.menu_cat_name && (
                  <h3 className="product-title">
                    {/* {toTitleCase(productDetails.menu_cat_name)} */}
                  </h3>
                )}
                <div className="row mt-0 me-1">
                  <div className="col-7 mt-2">
                    <h4 className="title fs-2">
                      {toTitleCase(productDetails.name)}
                    </h4>
                  </div>
                  <div
                    className="col-5 py-1"
                    style={{
                      borderRadius: "5px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      padding: "10px 15px",
                      backgroundColor: "#E6DFDF",
                    }}
                  >
                    <button
                      onClick={decrementQuantity}
                      style={{
                        width: "25px",
                        height: "25px",
                        borderRadius: "50%",
                        border: "1px solid #ccc",
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <i
                        className="ri-subtract-line"
                        style={{ fontSize: "18px" }}
                      ></i>
                    </button>

                    <span style={{ fontSize: "20px" }}>{quantity}</span>

                    <button
                      onClick={incrementQuantity}
                      style={{
                        width: "25px",
                        height: "25px",
                        borderRadius: "50%",
                        border: "1px solid #ccc",
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <i
                        className="ri-add-line"
                        style={{ fontSize: "20px" }}
                      ></i>
                    </button>
                  </div>
                  {/* <div className="col-5">
                    <div className="dz-stepper style-3">
                      <div className="input-group bootstrap-touchspin bootstrap-touchspin-injected">
                        <span className="input-group-btn input-group-prepend">
                          <button
                            className="btn btn-primary bootstrap-touchspin-down"
                            type="button"
                          >
                            -
                          </button>
                        </span>
                        <input
                          readOnly=""
                          className="stepper form-control"
                          type="text"
                          defaultValue={1}
                          name="demo3"
                        />
                        <span className="input-group-btn input-group-append">
                          <button
                            className="btn btn-primary bootstrap-touchspin-up"
                            type="button"
                          >
                            +
                          </button>
                        </span>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>

              <div className="product-meta">
                <div className="row me-1">
                  <div className="col-4">
                    <div
                      className="dz-quantity detail-content fs-5 fw-medium m-0"
                      style={{ color: "#0a795b" }}
                    >
                      <i
                        className="ri-restaurant-line fs-4 "
                        style={{ paddingRight: "5px" }}
                      ></i>
                      {productDetails.menu_cat_name || "Category Name"}
                    </div>
                  </div>
                  <div className="col-4 text-center">
                    <div className="d-flex align-items-center">
                      <i
                        className="ri-star-half-line pe-1"
                        style={{ color: "#f8a500", fontSize: "23px" }}
                      ></i>
                      <span
                        className="fs-5 fw-semibold"
                        style={{ color: "#7f7e7e", marginLeft: "5px" }}
                      >
                        {productDetails.rating}
                      </span>
                    </div>
                  </div>
                  <div className="col-4 text-end">
                    {productDetails.spicy_index && (
                      <div className="spicy-index">
                        {Array.from({ length: 5 }).map((_, index) =>
                          index < productDetails.spicy_index ? (
                            <i
                              key={index}
                              className="ri-fire-fill fs-4"
                              style={{ color: "#eb8e57" }}
                            ></i>
                          ) : (
                            <i
                              key={index}
                              className="ri-fire-line fs-4"
                              style={{ color: "#0000001a" }}
                            ></i>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="container">
                <div className="product-info">
                  <div>
                    <p className="fs-7 text-wrap m-0">
                      {productDetails.description}
                    </p>
                  </div>

                  {showQuantityError && (
                    <div className="text-danger">Please add a quantity.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        <footer className="footer sticky-bottom">
          <div className="container py-0">
            <div className="row">
              <hr className="dashed-line me-3 " />

              <div className="col-6 ps-3 ">
                <div className="d-flex align-items-center justify-content-between mb-5">
                  <div className="d-flex flex-column">
                    <h5 className="mb-2 fs-6 fw-medium">Total amount</h5>
                    <div className="d-flex align-items-baseline">
                      <h4
                        className="mb-0 price fs-4"
                        style={{ color: "#4E74FC" }}
                      >
                        ₹{totalAmount.toFixed(0)}
                      </h4>
                      <span
                        className="text-decoration-line-through ms-2 fs-6"
                        style={{ color: "#a5a5a5" }}
                      >
                        ₹{productDetails.price}
                      </span>
                      <div
                        className="fw-medium d-flex fs-6 ps-2"
                        style={{ color: "#0D775E" }}
                      >
                        {productDetails.offer}% Off
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 text-end">
                <button
                  className="btn btn-primary fs-3 py-1 rounded-pill"
                  onClick={handleAddToCart}
                >
                  <i className="ri-shopping-cart-line pe-2"></i>
                  <div className="font-poppins fs-6">Add to Cart</div>
                </button>
              </div>
            </div>
          </div>
        </footer>
        {/* <div className="container">
          <div className="row">
            <div className="col-12">
              <footer
                className="footer sticky-bottom"
                
              >
                <div className="container">
                  <div className="row">
                    <hr className="dashed-line me-3" />

                    <div className="col-6 pt-2">
                      <div className="d-flex align-items-center justify-content-between mb-5">
                        <div className="d-flex flex-column">
                          <h5 className="mb-2 fs-6 fw-medium">Total amount</h5>
                          <div className="d-flex align-items-baseline">
                            <h4
                              className="mb-0 price fs-4"
                              style={{ color: "#4E74FC" }}
                            >
                              ₹ {totalAmount}
                            </h4>
                            <span
                              className="text-decoration-line-through ms-2 fs-6"
                              style={{ color: "#a5a5a5" }}
                            >
                              ₹{productDetails.price}
                            </span>
                            <div
                              className="fw-medium d-flex fs-6 ps-2"
                              style={{ color: "#0D775E" }}
                            >
                              {productDetails.offer}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6 text-end pt-4">
                      <button
                        className="btn btn-primary "
                        style={{ borderRadius: "100px" }}
                        onClick={handleAddToCart}
                      >
                        <i className="ri-shopping-cart-line fs-4 me-2"></i>
                        <div className="fs-7">Add to Cart</div>
                      </button>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div> */}
      </div>
      <Bottom />
    </>
  );
};

export default MenuDetails;
