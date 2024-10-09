

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Bottom from "../component/bottom";
import defaultImg from "../assets/MenuDefault.png";
import { useRestaurantId } from "../context/RestaurantIdContext";
import south from "../assets/MenuDefault.png";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [totalCategoriesCount, setTotalCategoriesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { restaurantId: contextRestaurantId } = useRestaurantId();
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const { restaurantId, tableNumber } = userData;

  useEffect(() => {
    const fetchCategories = async () => {
      if (!restaurantId) return;

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
            setTotalCategoriesCount(data.menu_list.length);
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
    if (!str) return ""; // Return an empty string if str is undefined or null
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const handleCategoryClick = (category) => {
    navigate(`/Product?category=${category.menu_cat_id}`);
  };

  return (
    <div className="page-wrapper">
      {loading ? (
        <div id="preloader">
          <div className="loader">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="header header-fixed style-3">
            <div className="header-content">
              <div className="left-conten ">
                <Link
                  to={"#"}
                  className="back-btn dz-icon icon-sm"
                  onClick={() => navigate(-1)}
                >
                  <i className="ri-arrow-left-line fs-2"></i>
                </Link>
              </div>
              <div className="mid-content">
                <span className="customFontSizeBold">
                  Category
                  {totalCategoriesCount > 0 && (
                    <span className=" small-number gray-text">
                      {" ("}
                      <span className="">{totalCategoriesCount}</span>
                      {")"}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </header>
          {/* Header End */}

          <main className="page-content space-top p-b70">
            <div className="container">
              <div className="row g-3">
                {categories.map((category, index) => (
                  <div className="col-6" key={index}>
                    <div className="dz-category-items border border-success overflow-hidden rounded-top-3 rounded-bottom-3 d-flex flex-column">
                      <Link
                        to="/Menu"
                        onClick={() => handleCategoryClick(category)}
                        className="d-block"
                      >
                        <div className="d-flex justify-content-center bg-white">
                          <span className="py-2 rounded-bottom-3 text-center m-0 customFontSizeBold">
                            {toTitleCase(category.category_name)}
                            <span className=" small-number gray-text">
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
          </main>

          {/* Footer */}
          <Bottom />
        </>
      )}
    </div>
  );
};

export default Category;
