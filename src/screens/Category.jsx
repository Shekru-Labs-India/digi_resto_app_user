import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Bottom from "../component/bottom";
import defaultImg from "../assets/MenuDefault.png";
import { useRestaurantId } from "../context/RestaurantIdContext";
import south from "../assets/MenuDefault.png";
import LoaderGif from "./LoaderGIF";
import Header from "../components/Header";
import HotelNameAndTable from '../components/HotelNameAndTable';

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
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          "https://menumitra.com/user_api/get_category_list_with_image",
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
            console.error("Invalid data format:", data);
          }
        } else {
          console.error("Network response was not ok.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [restaurantId]);

  const toTitleCase = (str) => {
    if (!str) return "";
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const handleCategoryClick = (category) => {
    navigate(`/Menu`, {
      state: { 
        selectedCategory: category.menu_cat_id,
        categoryName: category.category_name
      }
    });
  };

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
          </div>
          
          {categories.length > 0 ? (
            <div className="container pt-0">
              <div className="row g-3">
                {categories.map((category, index) => (
                  <div className="col-6" key={index}>
                    <div className="dz-category-items border border-success overflow-hidden rounded-top-3 rounded-bottom-3 d-flex flex-column">
                      <Link
                        to={`/Menu/${category.menu_cat_id}`}
                        className="d-block"
                        onClick={() => handleCategoryClick(category)}
                      >
                        <div className="d-flex justify-content-center bg-white">
                          <span className="py-2 rounded-bottom-3 text-center m-0 font_size-14 text-success">
                            {toTitleCase(category.category_name)}
                            <span className="small-number gray-text">
                              <span className=""> ({category.menu_count})</span>
                            </span>
                          </span>
                        </div>
                        <div className="dz-media category-image flex-grow-1 rounded-top-0 rounded-bottom-0">
                          <img
                            style={{
                              width: "100%",
                              height: "180px",
                              objectFit: "cover",
                            }}
                            src={category.image || defaultImg}
                            alt={category.category_name}
                            onError={(e) => {
                              e.target.src = south;
                            }}
                          />
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="container text-center mt-5">
              <h2>No categories available</h2>
              {!userData.restaurantId && (
                <p>Please log in or scan a QR code to view categories.</p>
              )}
            </div>
          )}
        </main>
      )}
      <Bottom />
    </div>
  );
};

export default Category;