// import React, { useEffect, useState } from "react";
// import Swiper from "swiper";
// import images from "../assets/MenuDefault.png";
// import { Link } from "react-router-dom";
// import { useRestaurantId } from '../context/RestaurantIdContext';
// const FeaturedArea = () => {
//   const [menuLists, setMenuLists] = useState([]);
//   const { restaurantId } = useRestaurantId();
  
//   // Utility function to convert string to title case
//   const toTitleCase = (str) => {
//     return str.replace(/\w\S*/g, (txt) => {
//       return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//     });
//   };

//   useEffect(() => {
//     const fetchMenuData = async () => {
//       try {
//         const response = await fetch(
//           "https://menumitra.com/user_api/get_product_list_with_offer",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               restaurant_id: restaurantId, // Specify your restaurant ID here
//             }),
//           }
//         );
//    console.log(restaurantId)
//         if (response.ok) {
//           const data = await response.json();
//           if (data.st === 1) {
//             // Convert text fields to title case before setting the state
//             const formattedMenuLists = data.lists.map((menu) => ({
//               ...menu,
//               name: toTitleCase(menu.name),
//               menu_cat_name: toTitleCase(menu.menu_cat_name),
//             }));
//             setMenuLists(formattedMenuLists);

//             // Initialize Swiper after setting menu data
//             new Swiper(".featured-swiper", {
//               slidesPerView: "auto",
//               spaceBetween: 20,
//               loop: true,
//               autoplay: {
//                 delay: 2500,
//                 disableOnInteraction: false,
//               },
//             });
//           } else {
//             console.error("API Error:", data.msg);
//           }
//         } else {
//           console.error("Network response was not ok.");
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchMenuData();
//   }, [ restaurantId]);
 

//   return (
//     <div className="dz-box style-3">
//       <div className="swiper featured-swiper">
//         <div className="swiper-wrapper">
//           {menuLists.map((menu) => (
//             <div key={menu.menu_id} className="swiper-slide">
//               <Link to={`/ProductDetails/${menu.menu_id}`}>
//               <div className="cart-list style-2">
              
//                 <div className="dz-media media-75">
                  
//                   {/* <img src={menu.image} alt="" style={{
//                                             width: '100%',
//                                             height: '200px', // Set a fixed height for the image
//                                             objectFit: 'cover', // Ensure the image covers the entire space
//                                         }} /> */}
               
//                <img
//   style={{
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//   }}
//   src={menu.image || images} // Use default image if menu.image is null
//   alt={menu.name}
//   onError={(e) => {
//     e.target.src = images; // Set local image source on error
//   }}
// />

                
//                 </div>
                

//                 <div className="dz-content">
//                   <h6 className="title">
//                     {menu.name}
//                   </h6>
//                   <ul className="dz-meta">
//                     <li className="dz-price">
//                       ₹{menu.price} <del>₹{Math.floor(menu.price * 1.1)}</del>
//                     </li>
//                     {/* <li className="dz-review">
//                                             <i className="bx bxs-star staricons"></i>
//                                             <span>(2k Review)</span>
//                                         </li> */}
//                   </ul>
//                   <div className="dz-quantity">{menu.menu_cat_name}</div>
                  
//                 </div>
              
//               </div>
//               </Link>
//             </div>
            
//           ))}
          
//         </div>
        
//       </div>
      
//     </div>
    
//   );
// };

// export default FeaturedArea;


























jsx
import React, { useEffect, useState, useRef } from "react";
import Swiper from "swiper";
import images from "../assets/MenuDefault.png";
import { Link } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";

const FeaturedArea = () => {
  const [menuLists, setMenuLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { restaurantId } = useRestaurantId();
  const swiperRef = useRef(null);

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchMenuData = async (retryCount = 0) => {
      try {
        if (!restaurantId) {
          console.log("Restaurant ID is not available yet.");
          return;
        }

        const response = await fetch(
          "https://menumitra.com/user_api/get_product_list_with_offer",
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

        console.log("Restaurant ID:", restaurantId);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.st === 1) {
          const formattedMenuLists = data.lists.map((menu) => ({
            ...menu,
            name: toTitleCase(menu.name),
            menu_cat_name: toTitleCase(menu.menu_cat_name),
          }));

          if (isMounted) {
            setMenuLists(formattedMenuLists);
            setLoading(false);
            setError(null);

            if (!swiperRef.current) {
              swiperRef.current = new Swiper(".featured-swiper", {
                slidesPerView: "auto",
                spaceBetween: 20,
                loop: true,
                autoplay: {
                  delay: 2500,
                  disableOnInteraction: false,
                },
              });
            }
          }
        } else {
          throw new Error(data.msg || "Failed to fetch menu data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (retryCount < 3) {
          console.log(`Retrying... (${retryCount + 1})`);
          fetchMenuData(retryCount + 1);
        } else {
          if (isMounted) {
            setLoading(false);
            setError("Failed to fetch menu data. Please try again later.");
          }
        }
      }
    };

    fetchMenuData();

    return () => {
      isMounted = false;
    };
  }, [restaurantId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dz-box style-3">
      <div className="swiper featured-swiper">
        <div className="swiper-wrapper">
          {menuLists.map((menu) => (
            <div key={menu.menu_id} className="swiper-slide">
              <Link to={`/ProductDetails/${menu.menu_id}`}>
                <div className="cart-list style-2">
                  <div className="dz-media media-75">
                    <img
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      src={menu.image || images}
                      alt={menu.name}
                      onError={(e) => {
                        e.target.src = images;
                      }}
                    />
                  </div>
                  <div className="dz-content">
                    <h6 className="title">{menu.name}</h6>
                    <ul className="dz-meta">
                      <li className="dz-price">
                        ₹{menu.price} <del>₹{Math.floor(menu.price * 1.1)}</del>
                      </li>
                    </ul>
                    <div className="dz-quantity">{menu.menu_cat_name}</div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedArea;