// import React, { useEffect, useState } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Link } from 'react-router-dom';
// import 'swiper/css';

// function CategorySlider() {
//   const [categories, setCategories] = useState([]);
//   const [menus, setMenus] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [filteredMenuList, setFilteredMenuList] = useState([]);
//   const images = "default-image-url.jpg"; // Replace with your default image URL

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (menus.length > 0) {
//       if (selectedCategory) {
//         setFilteredMenuList(menus.filter(menu => menu.menu_cat_id === selectedCategory));
//       } else {
//         setFilteredMenuList(menus);
//       }
//     }
//   }, [selectedCategory, menus]);

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch('https://men4u.xyz/user_api/get_all_menu_list_by_category', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           customer_id: 339,
//           restaurant_id: "7"
//         })
//       });
//       const data = await response.json();
//       if (data.st === 1) {
//         setCategories(data.data.category);
//         setMenus(data.data.menus);
//         setFilteredMenuList(data.data.menus);
//       }
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     }
//   };

//   const renderStarRating = (rating) => {
//     const starCount = parseFloat(rating);
//     return (
//       <i className="fa-solid fa-star text-warning font_size_10 me-1"></i>
//     );
//   };

//   return (
//     <div>
//       <Swiper
//         spaceBetween={5}
//         slidesPerView="auto"
//         className="category-slide mb-3"
//       >
//         <SwiperSlide>
//           <button 
//             className={`category-btn ${!selectedCategory ? 'active' : ''}`}
//             onClick={() => setSelectedCategory(null)}
//           >
//             All
//           </button>
//         </SwiperSlide>
//         {categories.map((category) => (
//           <SwiperSlide key={category.menu_cat_id}>
//             <button 
//               className={`category-btn ${selectedCategory === category.menu_cat_id ? 'active' : ''}`}
//               onClick={() => setSelectedCategory(category.menu_cat_id)}
//             >
//               {category.category_name}
//               {category.category_food_type && (
//                 <span className="food-type">({category.category_food_type})</span>
//               )}
//             </button>
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       <div className="container p-b70">
//         <div className="row g-3 grid-style-1">
//           {filteredMenuList.map((menuItem) => (
//             <div key={menuItem.menu_id} className="col-6">
//               <div className="card-item style-6 rounded-4">
//                 <Link
//                   to={`/user_app/ProductDetails/${menuItem.menu_id}`}
//                   state={{
//                     menu_cat_id: menuItem.menu_cat_id,
//                     fromProduct: true,
//                   }}
//                   className="card-link"
//                   style={{
//                     textDecoration: "none",
//                     color: "inherit",
//                     display: "block",
//                   }}
//                 >
//                   <div className="dz-media">
//                     <img
//                       src={menuItem.image || images}
//                       alt={menuItem.menu_name}
//                       style={{
//                         aspectRatio: "1/1",
//                         objectFit: "cover",
//                         height: "100%",
//                       }}
//                       className="object-fit-cover"
//                       onError={(e) => {
//                         e.target.src = images;
//                       }}
//                     />
//                     {menuItem.is_special && (
//                       <i className="fa-solid fa-star border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center text-info"
//                          style={{
//                            position: "absolute",
//                            top: 3,
//                            right: 5,
//                            height: 17,
//                            width: 17,
//                            zIndex: 2,
//                          }}
//                       ></i>
//                     )}
//                     {menuItem.offer !== 0 && (
//                       <div className="gradient_bg d-flex justify-content-center align-items-center gradient_bg_offer">
//                         <span className="font_size_10 text-white">
//                           {menuItem.offer}% Off
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   <div className="dz-content pb-1">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div className="fw-medium text-success font_size_10 d-flex align-items-center">
//                         <i className="fa-solid fa-utensils pe-1"></i>
//                         {menuItem.category_name}
//                       </div>
//                       <div className="text-end">
//                         {menuItem.rating > 0 && (
//                           <>
//                             {renderStarRating(menuItem.rating)}
//                             <span className="font_size_10 fw-normal gray-text">
//                               {menuItem.rating}
//                             </span>
//                           </>
//                         )}
//                       </div>
//                     </div>

//                     <div className="font_size_14 fw-medium text-wrap">
//                       {menuItem.menu_name}
//                     </div>

//                     <div className="row">
//                       <div className="col-9 d-flex align-items-end mb-1">
//                         <div className="price-wrapper d-flex align-items-baseline">
//                           {menuItem.offer ? (
//                             <>
//                               <span className="font_size_14 me-2 text-info fw-semibold">
//                                 ₹{Math.floor(menuItem.price * (1 - menuItem.offer / 100))}
//                               </span>
//                               <span className="gray-text text-decoration-line-through font_size_12 fw-normal">
//                                 ₹{menuItem.price}
//                               </span>
//                             </>
//                           ) : (
//                             <span className="font_size_14 me-2 text-info fw-semibold">
//                               ₹{menuItem.price}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CategorySlider;