


// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import images from "../assets/MenuDefault.png";
// import Swiper from "swiper";
// import { useRestaurantId } from '../context/RestaurantIdContext';
// const ProductCard = () => {
//   const [menuList, setMenuList] = useState([]);
//   const navigate = useNavigate();
//   const [menuCategories, setMenuCategories] = useState([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState(null); // Track selected category ID
//   const userData = JSON.parse(localStorage.getItem('userData'));
//   const { restaurantId } = useRestaurantId();
//   const isMenuItemInCart = (menuId) => {
//     const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
//     return cartItems.some((item) => item.menu_id === menuId);
//   };

//   const handleCategorySelect = (categoryId) => {
//     setSelectedCategoryId(categoryId); // Update selected category ID
//     fetchMenuData(categoryId); // Fetch menu items for the selected category
//   };

//   const toTitleCase = (str) => {
//     return str.replace(/\w\S*/g, function (txt) {
//       return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//     });
//   };

//   const handleLikeClick = async (restaurantId, menuId, customerId) => {
//     try {
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
//         // Toggle is_favourite locally
//         const updatedMenuList = menuList.map((menuItem) =>
//           menuItem.menu_id === menuId ? { ...menuItem, is_favourite: !menuItem.is_favourite } : menuItem
//         );
//         setMenuList(updatedMenuList);
//         localStorage.setItem("menuItems", JSON.stringify(updatedMenuList));
//       } else {
//         console.error("Failed to add/remove item from favorites");
//       }
//     } catch (error) {
//       console.error("Error adding/removing item from favorites:", error);
//     }
//   };

//   const handleAddToCartClick = (menu) => {
//     const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

//     // Check if the menu item is already in the cart
//     const isAlreadyInCart = cartItems.some((item) => item.menu_id === menu.menu_id);

//     if (isAlreadyInCart) {
//       // Handle scenario where item is already in the cart (e.g., display message)
//       alert("This item is already in the cart!");
//       return; // Exit the function early
//     }

//     // If the menu item is not already in the cart, add it
//     const cartItem = {
//       image: menu.image,
//       name: menu.name,
//       price: menu.price,
//       oldPrice: menu.oldPrice,
//       quantity: 1,
//       menu_id: menu.menu_id,
//     };

//     const updatedCartItems = [...cartItems, cartItem];
//     localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

//     // Update menuList state to reflect cart changes
//     const updatedMenuList = menuList.map((menuItem) => {
//       if (menuItem.menu_id === menu.menu_id) {
//         return { ...menuItem, is_favourite: "1" };
//       }
//       return menuItem;
//     });

//     setMenuList(updatedMenuList);

//     // Navigate to Cart screen
//     navigate('/Cart');
//   };

//   const fetchMenuData = async (categoryId) => {
//     try {
//       const requestBody = {
//         restaurant_id: restaurantId, // Example restaurant_id, replace with the correct value
//         cat_id: categoryId === null ? "all" : categoryId.toString(), // Convert categoryId to string if not null
//       };
  
//       const response = await fetch("https://menumitra.com/user_api/get_menu_by_cat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestBody),
//       });
  
//       if (response.ok) {
//         const data = await response.json();
//         if (data.st === 1) {
//           const formattedMenuList = data.menu_list.map((menu) => ({
//             ...menu,
//             image: menu.image,
//             category: toTitleCase(menu.category),
//             name: toTitleCase(menu.name),
//             oldPrice: Math.floor(menu.price * 1.1),
//             is_favourite: menu.is_favourite === 1,
//           }));
//           setMenuList(formattedMenuList);
//           localStorage.setItem("menuItems", JSON.stringify(formattedMenuList));
//         } else {
//           console.error("API Error:", data.msg);
//         }
//       } else {
//         console.error("Network response was not ok.");
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };
  

//   useEffect(() => {
//     const fetchMenuCategories = async () => {
//       try {
//         const requestOptions = {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             restaurant_id: restaurantId,
//           }),
//         };
  
//         const response = await fetch(
//           "https://menumitra.com/user_api/get_category_list",
//           requestOptions
//         );
  
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
  
//         const data = await response.json();
  
//         if (data.st === 1 && Array.isArray(data.lists)) {
//           // Convert category names to title case before setting state
//           const formattedCategories = data.lists.map((category) => ({
//             ...category,
//             name: toTitleCase(category.name), // Convert category name to title case
//           }));
//           setMenuCategories(formattedCategories);
          
//           // Fetch menu items for all categories when component mounts or refreshes
//           fetchMenuData(null); // Pass null to fetch all categories
//         } else {
//           setMenuCategories([]);
//         }
//       } catch (error) {
//         console.error("Error fetching menu categories:", error);
//         setMenuCategories([]);
//       }
//     };
  
//     fetchMenuCategories(); // Trigger fetching categories on component render
//   }, [restaurantId]);
  

//   useEffect(() => {
//     const swiper = new Swiper(".category-slide", {
//       slidesPerView: "auto",
//       spaceBetween: 10,
//     });
//   }, [menuCategories]);

//   return (
//     <div>
//       <div className="dz-box">
//         <div className="title-bar">
//           <h5 className="title p-r50">Menu Category</h5>
//           <Link to="/Category">
//             <i className="bx bx-right-arrow-alt bx-sm"></i>
//           </Link>
//         </div>
//         <div className="swiper category-slide">
//           <div className="swiper-wrapper">
//             <div
//               className={`category-btn swiper-slide ${selectedCategoryId === null ? "active" : ""}`}
//               onClick={() => handleCategorySelect(null)}
//               style={{ backgroundColor: selectedCategoryId === null ? "#0D775E" : "", color: selectedCategoryId === null ? "#ffffff" : "", }}
//             >
//               All
//             </div>
//             {menuCategories.map((category) => (
//               <div key={category.menu_cat_id} className="swiper-slide">
//                 <div className={`category-btn ${selectedCategoryId === category.menu_cat_id ? "active" : ""}`}
//                   onClick={() => handleCategorySelect(category.menu_cat_id)}>
//                   {category.name}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="row g-3 grid-style-1">
//         {menuList.map((menu) => (
//           <div key={menu.menu_id} className="col-6">
//             <div className="card-item style-6">
//               <div className="dz-media">
//                 <Link to={`/ProductDetails/${menu.menu_id}`}>
//                   <img
//                     src={menu.image}
//                     alt={menu.name}
//                     style={{ height: "150px" }}
//                     onError={(e) => {
//                       e.target.src = images; // Set local image source on error
//                     }}
//                   />
//                 </Link>
//               </div>
//               <div className="dz-content">
//                 <div className="detail-content" style={{ position: 'relative' }}>
//                   <h3 className="product-title">
//                     {menu.category}
//                   </h3>
//                   {userData ?(
//                     <i
//                       className={`bx ${menu.is_favourite ? "bxs-heart text-red" : "bx-heart"} bx-sm`}
//                       onClick={() => handleLikeClick(13, menu.menu_id, 1)}
//                       style={{
//                         position: "absolute",
//                         top: "0",
//                         right: "0",
//                         fontSize: "23px",
//                         cursor: "pointer",
//                       }}
//                     ></i>
//                   ):(
//                     <i
//                       className= " bx bx-heart"
                    
//                       style={{
//                         position: "absolute",
//                         top: "0",
//                         right: "0",
//                         fontSize: "23px",
//                         cursor: "pointer",
//                       }}
//                     ></i>
//                   )}
//                 </div>
//                 <h4 className="item-name">
                 
//                     {menu.name}
                 
//                 </h4>
//                 <div className="offer-code">
//                   Spicy Level: {menu.spicy_index}
//                 </div>
//                 <div className="footer-wrapper">
//                   <div className="price-wrapper">
//                     <h6 className="current-price">₹{menu.price}</h6>
//                     <span className="old-price">₹{menu.oldPrice}</span>
//                   </div>
//                   {userData ?(
//                     <div
//                       onClick={() => handleAddToCartClick(menu)}
//                       className="cart-btn"
//                     >
//                       {isMenuItemInCart(menu.menu_id) ? (
//                         <i className="bx bxs-cart bx-sm"></i>
//                       ) : (
//                         <i className="bx bx-cart-add bx-sm"></i>
//                       )}
//                     </div>
//                   ):(
//                     <i className="bx bx-cart-add bx-sm"></i>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductCard;




import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import Swiper from "swiper";
import { useRestaurantId } from '../context/RestaurantIdContext';

const ProductCard = () => {
  const [menuList, setMenuList] = useState([]);
  const navigate = useNavigate();
  const [menuCategories, setMenuCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // Track selected category ID
  const userData = JSON.parse(localStorage.getItem('userData'));
    const { restaurantId } = useRestaurantId();
    const [customerId, setCustomerId] = useState(null);

    useEffect(() => {
      // Fetch customerId from localStorage or state
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        setCustomerId(userData.customer_id);
      }
    }, []);
  const isMenuItemInCart = (menuId) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    return cartItems.some((item) => item.menu_id === menuId);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId); // Update selected category ID
    fetchMenuData(categoryId); // Fetch menu items for the selected category
  };

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  
  const handleLikeClick = async (restaurantId, menuId) => {
    if (!customerId) {
      console.error("Customer ID is missing");
      return; // Exit the function if customer ID is missing
    }

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
        const updatedMenuList = menuList.map((menuItem) =>
          menuItem.menu_id === menuId ? { ...menuItem, is_favourite: !menuItem.is_favourite } : menuItem
        );
        setMenuList(updatedMenuList);
        localStorage.setItem("menuItems", JSON.stringify(updatedMenuList));
      } else {
        console.error("Failed to add/remove item from favorites");
      }
    } catch (error) {
      console.error("Error adding/removing item from favorites:", error);
    }
  };

  const handleAddToCartClick = (menu) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Check if the menu item is already in the cart
    const isAlreadyInCart = cartItems.some((item) => item.menu_id === menu.menu_id);

    if (isAlreadyInCart) {
      // Handle scenario where item is already in the cart (e.g., display message)
      alert("This item is already in the cart!");
      return; // Exit the function early
    }

    // If the menu item is not already in the cart, add it
    const cartItem = {
      image: menu.image,
      name: menu.name,
      price: menu.price,
      oldPrice: menu.oldPrice,
      quantity: 1,
      menu_id: menu.menu_id,
    };

    const updatedCartItems = [...cartItems, cartItem];
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

    // Update menuList state to reflect cart changes
    const updatedMenuList = menuList.map((menuItem) => {
      if (menuItem.menu_id === menu.menu_id) {
        return { ...menuItem, is_favourite: "1" };
      }
      return menuItem;
    });

    setMenuList(updatedMenuList);

    // Navigate to Cart screen
    navigate('/Cart');
  };

  const fetchMenuData = async (categoryId) => {
    try {
      const requestBody = {
        restaurant_id: restaurantId, // Example restaurant_id, replace with the correct value
        cat_id: categoryId === null ? "all" : categoryId.toString(), // Convert categoryId to string if not null
      };
  
      const response = await fetch("https://menumitra.com/user_api/get_menu_by_cat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.st === 1) {
          const formattedMenuList = data.menu_list.map((menu) => ({
            ...menu,
            image: menu.image,
            category: toTitleCase(menu.category),
            name: toTitleCase(menu.name),
            oldPrice: Math.floor(menu.price * 1.1),
            is_favourite: menu.is_favourite === 1,
          }));
          setMenuList(formattedMenuList);
          localStorage.setItem("menuItems", JSON.stringify(formattedMenuList));
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
  

  useEffect(() => {
    const fetchMenuCategories = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
          }),
        };

        console.log("Fetching menu categories with restaurant_id:", restaurantId); // Debugging log

        const response = await fetch(
          "https://menumitra.com/user_api/get_category_list",
          requestOptions
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.st === 1 && Array.isArray(data.lists)) {
          // Convert category names to title case before setting state
          const formattedCategories = data.lists.map((category) => ({
            ...category,
            name: toTitleCase(category.name), // Convert category name to title case
          }));
          setMenuCategories(formattedCategories);
          
          // Fetch menu items for all categories when component mounts or refreshes
          fetchMenuData(null); // Pass null to fetch all categories
        } else {
          setMenuCategories([]);
        }
      } catch (error) {
        console.error("Error fetching menu categories:", error);
        setMenuCategories([]);
      }
    };

    if (restaurantId) {
      fetchMenuCategories(); // Trigger fetching categories on component render if restaurantId is available
    } else {
      console.error("Restaurant ID is not available");
    }
  }, [restaurantId]);

  useEffect(() => {
    const swiper = new Swiper(".category-slide", {
      slidesPerView: "auto",
      spaceBetween: 10,
    });
  }, [menuCategories]);

  return (
    <div>
      <div className="dz-box">
      {menuCategories && menuCategories.length > 0 && ( 
        <div className="title-bar">
      
          <h5 className="title p-r50">Menu Category</h5>
    
        <Link to="/Category">
          <i className="bx bx-right-arrow-alt bx-sm"></i>
        </Link>
     

        </div>
      )}
        <div className="swiper category-slide">
  <div className="swiper-wrapper">
    {menuCategories.length > 0 && (
      <div
        className={`category-btn swiper-slide ${selectedCategoryId === null ? "active" : ""}`}
        onClick={() => handleCategorySelect(null)}
        style={{ backgroundColor: selectedCategoryId === null ? "#0D775E" : "", color: selectedCategoryId === null ? "#ffffff" : "", }}
      >
        All
      </div>
    )}
    {menuCategories.map((category) => (
      <div key={category.menu_cat_id} className="swiper-slide">
        <div className={`category-btn ${selectedCategoryId === category.menu_cat_id ? "active" : ""}`}
          onClick={() => handleCategorySelect(category.menu_cat_id)}>
          {category.name}
        </div>
      </div>
    ))}
  </div>
</div>

      </div>

      <div className="row g-3 grid-style-1">
     
{menuList.map((menu) => (
  <div key={menu.menu_id} className="col-6">
    <div className="card-item style-6">
      <div className="dz-media">
        <Link to={`/ProductDetails/${menu.menu_id}`}>
          <img
            src={menu.image || images} // Use default image if image is null
            alt={menu.name}
            style={{ height: "150px" }}
            onError={(e) => {
              e.target.src = images; // Set local image source on error
            }}
          />
        </Link>
      </div>
      <div className="dz-content">
        <div className="detail-content" style={{ position: 'relative' }}>
          <h3 className="product-title">
            {menu.category}
          </h3>
          {userData && ( // Render like button only if userData is available
            <i
              className={`bx ${menu.is_favourite ? "bxs-heart text-red" : "bx-heart"} bx-sm`}
              onClick={() => handleLikeClick(restaurantId, menu.menu_id, userData.id)}
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                fontSize: "23px",
                cursor: "pointer",
              }}
            ></i>
          )}
        </div>
        {menu.name && ( // Render item name only if it's not null
          <h4 className="item-name">{menu.name}</h4>
        )}
        {menu.spicy_index && ( // Render offer code only if it's not null
          <div className="offer-code">{menu.spicy_index}</div>
        )}
        <div className="footer-wrapper">
          <div className="price-wrapper">
            <h6 className="current-price">₹{menu.price}</h6>
            <span className="old-price">₹{menu.oldPrice}</span>
          </div>
          {userData && ( // Render cart button only if userData is available
            <div
              onClick={() => handleAddToCartClick(menu)}
              className="cart-btn"
            >
              {isMenuItemInCart(menu.menu_id) ? (
                <i className="bx bxs-cart bx-sm"></i>
              ) : (
                <i className="bx bx-cart-add bx-sm"></i>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
))}

      </div>
    </div>
  );
};

export default ProductCard;
