// import React, { useState, useEffect } from "react";
// import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import { useCart } from "../hooks/useCart";
// import Bottom from "../component/bottom";

// const MenuDetails = () => {
//   const [productDetails, setProductDetails] = useState(null);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [quantity, setQuantity] = useState(1); // Default quantity is 1
//   const [showQuantityError, setShowQuantityError] = useState(false);
//   const [totalAmount, setTotalAmount] = useState(0); // Total amount state
//   const navigate = useNavigate();
//   const { menuId } = useParams();
//   const { restaurantId } = useRestaurantId();
//   const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
//   const { addToCart } = useCart();
//   const location = useLocation();
//   const menu_cat_id = location.state?.menu_cat_id || 1;

//   const toTitleCase = (str) => {
//     if (!str) return "";
//     return str.replace(
//       /\w\S*/g,
//       (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
//     );
//   };

//   // Fetch product details
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

//           // Set the initial total amount
//           setTotalAmount(discountedPrice * quantity);
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

//   // Function to update cart quantity via API
//   const updateCartQuantity = async (newQuantity) => {
//     if (!restaurantId || !menuId) {
//       console.error("Missing restaurant or menu ID");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/update_cart_menu_quantity",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//             cart_id: localStorage.getItem("cartId") || 1,
//             customer_id: JSON.parse(localStorage.getItem("userData"))
//               ?.customer_id,
//             quantity: newQuantity,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.st === 1) {
//         console.log("Menu quantity updated successfully.");
//         setQuantity(newQuantity); // Update the quantity in the state

//         // Recalculate the total amount
//         const newTotalAmount =
//           newQuantity *
//           (productDetails?.discountedPrice || productDetails?.price);
//         setTotalAmount(newTotalAmount);
//       } else {
//         console.error("Failed to update menu quantity:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error updating menu quantity:", error);
//     }
//   };

//   // Fetch product details when menuId or restaurantId is available
//   useEffect(() => {
//     if (menuId && restaurantId) {
//       fetchProductDetails();
//     }
//   }, [menuId, restaurantId]);

//   const incrementQuantity = () => {
//     if (quantity < 20) {
//       const newQuantity = quantity + 1;
//       updateCartQuantity(newQuantity); // Update the quantity and total amount
//       setShowQuantityError(false);
//     } else {
//       alert("Maximum limit reached for this item.");
//     }
//   };

//   const decrementQuantity = () => {
//     if (quantity > 1) {
//       const newQuantity = quantity - 1;
//       updateCartQuantity(newQuantity); // Update the quantity and total amount
//       setShowQuantityError(false);
//     }
//   };

//   const handleAddToCart = async () => {
//     if (quantity === 0 || !productDetails) return;

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/add_to_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//             customer_id: JSON.parse(localStorage.getItem("userData"))
//               ?.customer_id,
//             quantity: quantity,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.st === 1) {
//         console.log("Item added to cart successfully.");
//         addToCart({ ...productDetails, quantity });
//         navigate("/Cart");
//       } else {
//         console.error("Failed to add item to cart:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error adding item to cart:", error);
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

//         <main className="page-content pb-5">
//           {/* <main className="page-content p-b80"> */}
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

//           {/* make above constainers height till here so scroll will end and below container will not hide any thing */}

//           <div className="container">
//             <div className="dz-product-detail">
//               <div className="detail-content mt-0" style={{}}>
//                 {productDetails.menu_cat_name && (
//                   <h3 className="product-title">
//                     {/* {toTitleCase(productDetails.menu_cat_name)} */}
//                   </h3>
//                 )}
//                 <div className="row mt-0 me-1">
//                   <div className="col-7 mt-2">
//                     <h4 className="title fs-2">
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
//                     <p className="fs-7 text-wrap m-0">
//                       {productDetails.description}
//                     </p>
//                   </div>

//                   {showQuantityError && (
//                     <div className="text-danger">Please add a quantity.</div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//         <footer className="footer sticky-bottom">
//           <div className="container py-0">
//             <div className="row">
//               <hr className="dashed-line me-3 " />

//               <div className="col-6 ps-3 ">
//                 <div className="d-flex align-items-center justify-content-between mb-5">
//                   <div className="d-flex flex-column">
//                     <h5 className="mb-2 fs-6 fw-medium">Total amount</h5>
//                     <div className="d-flex align-items-baseline">
//                       <h4
//                         className="mb-0 price fs-4"
//                         style={{ color: "#4E74FC" }}
//                       >
//                         ₹{totalAmount.toFixed(0)}
//                       </h4>
//                       <span
//                         className="text-decoration-line-through ms-2 fs-6"
//                         style={{ color: "#a5a5a5" }}
//                       >
//                         ₹{productDetails.price}
//                       </span>
//                       <div
//                         className="fw-medium d-flex fs-6 ps-2"
//                         style={{ color: "#0D775E" }}
//                       >
//                         {productDetails.offer}% Off
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-6 text-end">
//                 <button
//                   className="btn btn-primary fs-3 py-1 rounded-pill"
//                   onClick={handleAddToCart}
//                 >
//                   <i className="ri-shopping-cart-2-line pe-2"></i>
//                   <div className="font-poppins fs-6">Add to Cart</div>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </footer>
//         {/* <div className="container">
//           <div className="row">
//             <div className="col-12">
//               <footer
//                 className="footer sticky-bottom"

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
//                               ₹ {totalAmount}
//                             </h4>
//                             <span
//                               className="text-decoration-line-through ms-2 fs-6"
//                               style={{ color: "#a5a5a5" }}
//                             >
//                               ₹{productDetails.price}
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
//                         <i className="ri-shopping-cart-2-line fs-4 me-2"></i>
//                         <div className="fs-7">Add to Cart</div>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </footer>
//             </div>
//           </div>
//         </div> */}
//       </div>
//       <Bottom />
//     </>
//   );
// };

// export default MenuDetails;

// 25--

// import React, { useState, useEffect } from "react";
// import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import { useCart } from "../hooks/useCart";
// import Bottom from "../component/bottom";

// const MenuDetails = () => {
//   const [productDetails, setProductDetails] = useState(null);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [quantity, setQuantity] = useState(1); // Default quantity is 1
//   const [showQuantityError, setShowQuantityError] = useState(false);
//   const [totalAmount, setTotalAmount] = useState(0); // Total amount state
//   const navigate = useNavigate();
//   const { menuId } = useParams();
//   const { restaurantId } = useRestaurantId();
//   const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
//   const { addToCart } = useCart();
//   const location = useLocation();
//   const menu_cat_id = location.state?.menu_cat_id || 1;

//   const toTitleCase = (str) => {
//     if (!str) return "";
//     return str.replace(
//       /\w\S*/g,
//       (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
//     );
//   };

//   // Fetch product details
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
//         console.log("API Response:", data); // Debugging line

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

//           // Set the initial total amount
//           setTotalAmount(discountedPrice * quantity);
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

//   // Function to update cart quantity via API
//   const updateCartQuantity = async (newQuantity) => {
//     if (!restaurantId || !menuId) {
//       console.error("Missing restaurant or menu ID");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/update_cart_menu_quantity",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//             cart_id: localStorage.getItem("cartId") || 1,
//             customer_id: JSON.parse(localStorage.getItem("userData"))
//               ?.customer_id,
//             quantity: newQuantity,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.st === 1) {
//         console.log("Menu quantity updated successfully.");
//         setQuantity(newQuantity); // Update the quantity in the state

//         // Recalculate the total amount
//         const newTotalAmount =
//           newQuantity *
//           (productDetails?.discountedPrice || productDetails?.price);
//         setTotalAmount(newTotalAmount);
//       } else {
//         console.error("Failed to update menu quantity:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error updating menu quantity:", error);
//     }
//   };

//   // Fetch product details when menuId or restaurantId is available
//   useEffect(() => {
//     if (menuId && restaurantId) {
//       fetchProductDetails();
//     }
//   }, [menuId, restaurantId]);

//   useEffect(() => {
//     console.log("Product Details Updated:", productDetails); // Debugging line
//   }, [productDetails]);

//   const incrementQuantity = () => {
//     if (quantity < 20) {
//       const newQuantity = quantity + 1;
//       updateCartQuantity(newQuantity); // Update the quantity and total amount
//       setShowQuantityError(false);
//     } else {
//       alert("Maximum limit reached for this item.");
//     }
//   };

//   const decrementQuantity = () => {
//     if (quantity > 1) {
//       const newQuantity = quantity - 1;
//       updateCartQuantity(newQuantity); // Update the quantity and total amount
//       setShowQuantityError(false);
//     }
//   };

//   const handleAddToCart = async () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     if (!userData){
//       navigate('/Signinscreen');
//       return;
//     }
//     if (quantity === 0 || !productDetails) return;

//     try {
//       const response = await fetch(
//         "https://menumitra.com/user_api/add_to_cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             restaurant_id: restaurantId,
//             menu_id: menuId,
//             customer_id: JSON.parse(localStorage.getItem("userData"))
//               ?.customer_id,
//             quantity: quantity,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.st === 1) {
//         console.log("Item added to cart successfully.");
//         addToCart({ ...productDetails, quantity });
//         // navigate("/Cart");
//       } else {
//         console.error("Failed to add item to cart:", data.msg);
//       }
//     } catch (error) {
//       console.error("Error adding item to cart:", error);
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

//         <main className="page-content pb-5">
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
//               <div className="detail-content mt-0" style={{}}>
//                 {productDetails.menu_cat_name && (
//                   <h3 className="product-title">
//                     {toTitleCase(productDetails.menu_cat_name)}
//                   </h3>
//                 )}
//                 <div className="row mt-0 me-1">
//                   <div className="col-7 mt-2">
//                     <h4 className="title fs-2">
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
//                     <p className="fs-7 text-wrap m-0">
//                       {productDetails.description}
//                     </p>
//                   </div>

//                   {showQuantityError && (
//                     <div className="text-danger">Please add a quantity.</div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//         <footer className="footer sticky-bottom">
//           <div className="container py-0">
//             <div className="row">
//               <hr className="dashed-line me-3 " />

//               <div className="col-6 ps-3 ">
//                 <div className="d-flex align-items-center justify-content-between mb-5">
//                   <div className="d-flex flex-column">
//                     <h5 className="mb-2 fs-6 fw-medium">Total amount</h5>
//                     <div className="d-flex align-items-baseline">
//                       <h4
//                         className="mb-0 price fs-4"
//                         style={{ color: "#4E74FC" }}
//                       >
//                         ₹{totalAmount.toFixed(0)}
//                       </h4>
//                       <span
//                         className="text-decoration-line-through ms-2 fs-6"
//                         style={{ color: "#a5a5a5" }}
//                       >
//                         ₹{productDetails.price}
//                       </span>
//                       <div
//                         className="fw-medium d-flex fs-6 ps-2"
//                         style={{ color: "#0D775E" }}
//                       >
//                         {productDetails.offer}% Off
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-6 text-end">
//                 <button
//                   className="btn btn-primary fs-3 py-1 rounded-pill"
//                   onClick={handleAddToCart}
//                 >
//                   <i className="ri-shopping-cart-2-line pe-2"></i>
//                   <div className="font-poppins fs-6">Add to Cart</div>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </footer>
//       </div>
//       <Bottom />
//     </>
//   );
// };

// export default MenuDetails;

// addtocart*-*-*-*

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
  const [cartItems, setCartItems] = useState(
    () => JSON.parse(localStorage.getItem("cartItems")) || []
  );
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
        console.log("API Response:", data); // Debugging line

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

  // Function to create a new cart
  const createCart = async (customerId, restaurantId) => {
    try {
      const response = await fetch(
        "https://menumitra.com/user_api/create_cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            customer_id: customerId,
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1) {
        localStorage.setItem("cartId", data.cart_id);
        return data.cart_id;
      } else {
        console.error("Failed to create cart:", data.msg);
        return null;
      }
    } catch (error) {
      console.error("Error creating cart:", error);
      return null;
    }
  };

  // Function to add item to cart
  const handleAddToCart = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      navigate("/Signinscreen");
      return;
    }
    if (quantity === 0 || !productDetails) return;

    const customerId = userData.customer_id;
    const restaurantId = userData.restaurantId;

    let cartId = localStorage.getItem("cartId");
    if (!cartId) {
      cartId = await createCart(customerId, restaurantId);
      if (!cartId) return; // If cart creation failed, exit the function
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
            menu_id: menuId,
            customer_id: customerId,
            cart_id: cartId,
            quantity: quantity,
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1) {
        console.log("Item added to cart successfully.");
        const updatedCartItems = [
          ...cartItems,
          { ...productDetails, quantity },
        ];
        setCartItems(updatedCartItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      } else {
        console.error("Failed to add item to cart:", data.msg);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [menuId, restaurantId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  // Function to handle favorite status toggle
  const handleLikeClick = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData || !restaurantId) {
      console.error("Missing required data");
      return;
    }

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
          customer_id: userData.customer_id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1) {
          setIsFavorite(!isFavorite);
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

          <div className="container">
            <div className="dz-product-detail">
              <div className="detail-content mt-0 mb-1">
                {productDetails.menu_cat_name && (
                  <h3 className="product-title">
                    {/* {toTitleCase(productDetails.menu_cat_name)} */}
                  </h3>
                )}
                <div className="row mt-0 me-1">
                  <div className="col-7 mt-2">
                    <h4 className="title fs-sm">
                      {toTitleCase(productDetails.name)}
                    </h4>
                  </div>
                </div>
              </div>

              <div className="product-meta">
                <div className="row me-1">
                  <div className="col-4">
                    <div
                      className="dz-quantity detail-content category-text m-0"
                      style={{ color: "#0a795b" }}
                    >
                      <i
                        className="ri-restaurant-line "
                        style={{ paddingRight: "5px" }}
                      ></i>
                      {productDetails.menu_cat_name || "Category Name"}
                    </div>
                  </div>

                  <div className="col-4 text-end">
                    {productDetails.spicy_index && (
                      <div className="spicy-index">
                        {Array.from({ length: 5 }).map((_, index) =>
                          index < productDetails.spicy_index ? (
                            <i
                              key={index}
                              className="ri-fire-fill fs-6"
                              style={{ color: "#eb8e57" }}
                            ></i>
                          ) : (
                            <i
                              key={index}
                              className="ri-fire-line fs-6"
                              style={{ color: "#0000001a" }}
                            ></i>
                          )
                        )}
                      </div>
                    )}
                  </div>
                  <div className="col-4 text-end">
                    <i
                      className="ri-star-half-line fs-3 pe-1"
                      style={{ color: "#f8a500" }}
                    ></i>
                    <span
                      className="fs-5 fw-semibold"
                      style={{ color: "#7f7e7e", marginLeft: "5px" }}
                    >
                      {productDetails.rating}
                    </span>
                  </div>
                </div>
              </div>
              <div className="container">
                <div className="row">
                  <div
                    className="col-6 py-1"
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
                      onClick={() =>
                        setQuantity(quantity > 1 ? quantity - 1 : 1)
                      }
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
                      onClick={() => setQuantity(quantity + 1)}
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
                  <div className="col-6 text-end">
                    <i
                      className={`ri-${
                        isFavorite ? "hearts-fill" : "heart-2-line"
                      } fs-3`}
                      onClick={handleLikeClick}
                      style={{
                        cursor: "pointer",
                        color: isFavorite ? "#fe0809" : "#73757b",
                      }}
                    ></i>
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
        <div className="container py-0">
          <footer className="footer fixed-bottom-custom">
            <div className="row">
              <hr className="dashed-line me-5 pe-5" />

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
                <Link
                  to="/Cart"
                  className="btn btn-primary fs-3 py-2 rounded-pill"
                  onClick={handleAddToCart}
                >
                  <i className="ri-shopping-cart-line pe-2"></i>
                  <div className="font-poppins fs-6">Add to Cart</div>
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
      <Bottom />
    </>
  );
};

export default MenuDetails;
