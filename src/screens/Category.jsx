import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Bottom from "../component/bottom";
import defaultImg from "../assets/MenuDefault.png";
import { useRestaurantId } from "../context/RestaurantIdContext";
import south from "../assets/MenuDefault.png";
import OrderGif from "./OrderGif";
import LoaderGif from "./LoaderGIF";

const Category = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize state from local storage
    return localStorage.getItem("isDarkMode") === "true";
  }); // State for theme
  const { restaurantName } = useRestaurantId();
  const isLoggedIn = !!localStorage.getItem("userData");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    navigate(`/Menu/${category.menu_cat_id}`);
  };
  

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle the sidebar state
  };

  const getFirstName = (name) => {
    if (!name) return "User"; // Return "User" if name is undefined or null
    const words = name.split(" ");
    return words[0]; // Return the first word
  };

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    localStorage.setItem("isDarkMode", newIsDarkMode);
  };

  useEffect(() => {
    // Apply the theme class based on the current state
    if (isDarkMode) {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
    }
  }, [isDarkMode]); // Depend on isDarkMode to re-apply on state change

  return (
    <div className="page-wrapper">
      {loading ? (
        <div id="preloader">
          <div className="loader">
            {/* <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div> */}
            <LoaderGif />
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="header header-fixed style-3">
            <div className="header-content">
              <div
                className={`page-wrapper ${sidebarOpen ? "sidebar-open" : ""}`}
              >
                <header className="header header-fixed pt-2 shadow-sm">
                  <div className="header-content d-flex justify-content-between">
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
                      <span className="custom_font_size_bold  title">
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
                    <div className="right-content gap-1">
                      <div className="menu-toggler" onClick={toggleSidebar}>
                        {isLoggedIn ? (
                          <i className="ri-menu-line fs-1"></i>
                        ) : (
                          <Link to="/Signinscreen">
                            <i className="ri-login-circle-line fs-1"></i>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </header>

                {/* Dark overlay for sidebar */}
                <div
                  className={`dark-overlay ${
                    sidebarOpen ? "dark-overlay active" : ""
                  }`}
                  onClick={toggleSidebar}
                ></div>

                {/* Sidebar */}
                <div className={`sidebar ${sidebarOpen ? "sidebar show" : ""}`}>
                  <div className="author-box">
                    <div className="d-flex justify-content-start align-items-center m-0">
                      <i
                        className={
                          userData && userData.customer_id
                            ? "ri-user-3-fill fs-3"
                            : "ri-user-3-line fs-3"
                        }
                      ></i>
                    </div>
                    <div className="custom_font_size_bold">
                      <span className="ms-3 pt-4">
                        {userData?.name
                          ? `Hello, ${toTitleCase(getFirstName(userData.name))}`
                          : "Hello, User"}
                      </span>
                      <div className="mail ms-3 gray-text custom_font_size_bold">
                        {userData?.mobile}
                      </div>
                      <div className="dz-mode mt-3 me-4">
                        <div className="theme-btn" onClick={toggleTheme}>
                          <i
                            className={`ri ${
                              isDarkMode ? "ri-sun-line" : "ri-moon-line"
                            } sun`}
                          ></i>
                          <i
                            className={`ri ${
                              isDarkMode ? "ri-moon-line" : "ri-sun-line"
                            } moon`}
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ul className="nav navbar-nav">
                    <li>
                      <Link className="nav-link active" to="/Menu">
                        <span className="dz-icon icon-sm">
                          <i className="ri-bowl-line fs-3"></i>
                        </span>
                        <span className="custom_font_size_bold">Menu</span>
                      </Link>
                    </li>
                    <li>
                      <Link className="nav-link active" to="/Category">
                        <span className="dz-icon icon-sm">
                          <i className="ri-list-check-2 fs-3"></i>
                        </span>
                        <span className="custom_font_size_bold">Category</span>
                      </Link>
                    </li>
                    <li>
                      <Link className="nav-link active" to="/Wishlist">
                        <span className="dz-icon icon-sm">
                          <i className="ri-heart-2-line fs-3"></i>
                        </span>
                        <span className="custom_font_size_bold">Favourite</span>
                      </Link>
                    </li>
                    <li>
                      <Link className="nav-link active" to="/MyOrder">
                        <span className="dz-icon icon-sm">
                          <i className="ri-drinks-2-line fs-3"></i>
                        </span>
                        <span className="custom_font_size_bold">My Orders</span>
                      </Link>
                    </li>
                    <li>
                      <Link className="nav-link active" to="/Cart">
                        <span className="dz-icon icon-sm">
                          <i className="ri-shopping-cart-line fs-3"></i>
                        </span>
                        <span className="custom_font_size_bold">Cart</span>
                      </Link>
                    </li>
                    <li>
                      <Link className="nav-link active" to="/Profile">
                        <span className="dz-icon icon-sm">
                          <i
                            className={
                              userData && userData.customer_id
                                ? "ri-user-3-fill fs-3"
                                : "ri-user-3-line fs-3"
                            }
                          ></i>
                        </span>
                        <span className="custom_font_size_bold">Profile</span>
                      </Link>
                    </li>
                  </ul>
                  {/* <div className="dz-mode mt-4 me-4">
          <div className="theme-btn" onClick={toggleTheme}>
            <i
              className={`ri ${
                isDarkMode ? "ri-sun-line" : "ri-moon-line"
              } sun`}
            ></i>
            <i
              className={`ri ${
                isDarkMode ? "ri-moon-line" : "ri-sun-line"
              } moon`}
            ></i>
          </div>
        </div> */}
                  <div className="sidebar-bottom"></div>
                </div>
              </div>
            </div>
          </header>
          {/* Header End */}

          <main className="page-content space-top p-b70">
            <div className="container pb-1">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <i className="ri-store-2-line me-2"></i>
                  <span className="fw-medium hotel-name">
                    {restaurantName.toUpperCase() || "Restaurant Name"}
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="ri-user-location-line me-2 gray-text"></i>
                  <span className="fw-medium custom-text-gray">
                    {userData.tableNumber
                      ? `Table ${userData.tableNumber}`
                      : ""}
                  </span>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row g-3">
                {categories.map((category, index) => (
                  <div className="col-6" key={index}>
                    <div className="dz-category-items border border-success overflow-hidden rounded-top-3 rounded-bottom-3 d-flex flex-column">
                      <Link
                        to={`/Menu/${category.menu_cat_id}`}
                        className="d-block"
                      >
                        <div className="d-flex justify-content-center bg-white">
                          <span className="py-2 rounded-bottom-3 text-center m-0 custom_font_size_bold">
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
