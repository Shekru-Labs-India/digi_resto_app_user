import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Bottom from "../component/bottom";
import defaultImg from "../assets/MenuDefault.png";
import { useRestaurantId } from "../context/RestaurantIdContext";
import south from "../assets/MenuDefault.png";
import LoaderGif from "./LoaderGIF";
import Header from "../components/Header";
import HotelNameAndTable from '../components/HotelNameAndTable';
import config from "../component/config"
const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { restaurantId: contextRestaurantId, restaurantName } = useRestaurantId();
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const restaurantId = userData.restaurantId || contextRestaurantId;
  const tableNumber = userData.tableNumber || '1';

  useEffect(() => {
    const fetchCategories = async () => {
      if (!restaurantId) {
        setLoading(false);
        window.showToast("error", "Restaurant information is missing");
        
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
           `${config.apiDomain}/user_api/get_category_list_with_image`,
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

        if (response.ok) {
          const data = await response.json();
          if (data && data.st === 1 && data.menu_list) {
            setCategories(data.menu_list);
          } else {
            window.showToast("error", "Failed to load categories");
            console.error("Invalid data format:", data);
          }
        } else {
          window.showToast("error", "Failed to fetch categories");
          console.error("Network response was not ok.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        window.showToast("error", "Error loading categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [restaurantId, navigate]);

  const toTitleCase = (str) => {
    if (!str) return "";
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const handleCategoryClick = (category) => {
    try {
      navigate(`/user_app/Menu`, {
        state: { 
          selectedCategory: category.menu_cat_id,
          categoryName: category.category_name
        }
      });
      window.showToast("info", `Viewing ${category.category_name} menu items`);
    } catch (error) {
      console.error("Navigation error:", error);
      window.showToast("error", "Failed to load category menu");
    }
  };

  if (!userData.restaurantId) {
    // navigate("/user_app/Signinscreen", { 
    //   state: { 
    //     returnTo: "/user_app/Category" 
    //   } 
    // });
  }

  // if (userData?.customer_type === 'guest') {
  //   window.showToast("info", "Please login to view categories");
  //   navigate("/user_app/Category");
  //   return;
  // }

  if (!contextRestaurantId) {
    const restaurantCode = localStorage.getItem("restaurantCode");
    const tableNumber = localStorage.getItem("tableNumber") || "1";
    navigate(`/user_app/${restaurantCode}/${tableNumber}`);
    return;
  }

  return (
    <div className="page-wrapper">
      <Header title="Categories" count={categories.length} />
      
      {loading ? (
        <div id="preloader">
          <div className="loader">
            <LoaderGif />
          </div>
        </div>
      ) : (
        <main className="page-content space-top mb-5 pb-3">
          <div className="container px-3 py-0">
            <HotelNameAndTable 
              restaurantName={restaurantName}
              tableNumber={tableNumber}
            />
            
            <div className="page-header">
              <h5 className="header-title text-muted">What's on your mind?</h5>
            </div>
          </div>
          
          {categories.length > 0 ? (
            <div className="container">
              <div className="category-grid">
                {categories.map((category, index) => (
                 <Link
                 key={index}
                 to={`/user_app/Menu/${category.menu_cat_id}`}
                 className="category-card"
                 onClick={() => handleCategoryClick(category)}
               >
                 <div className="category-image-container">
                   <img
                     className="category-image"
                     src={category.image || defaultImg}
                     alt={category.category_name}
                     onError={(e) => {
                       e.target.src = defaultImg;
                     }}
                   />
                 </div>
                 <div className="category-text-container">
                   <div className=" font_size_10">
                     {toTitleCase(category.category_name)}
                   </div>
                   <div className="category-count">
                     ({category.menu_count})
                   </div>
                 </div>
               </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="container text-center mt-5">
              <h2>No categories available</h2>
              {!userData.restaurantId && (
                <p>Please log in or scan a QR code to view categories.</p>
              )}
              {window.showToast("warning", "Please log in or scan a QR code to view categories")}
            </div>
          )}
        </main>
      )}
      <Bottom />
    </div>
  );
};

export default Category;


