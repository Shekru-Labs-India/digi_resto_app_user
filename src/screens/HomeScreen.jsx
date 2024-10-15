import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../assets/css/style.css";
import "../assets/css/custom.css";
import Bottom from "../component/bottom";
import OfferBanner from "../component/OfferBanner";
import ProductCart from "../component/ProductCart";
import { useRestaurantId } from "../context/RestaurantIdContext";
import logo from "../assets/logos/mmua_transparent.png";

const HomeScreen = () => {
  const { restaurantCode, table_number } = useParams();
  const { setRestaurantCode, restaurantId, restaurantDetails, restaurantName } = useRestaurantId();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("isDarkMode") === "true");
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("userData")) || {});
  const isLoggedIn = !!localStorage.getItem("userData");

  useEffect(() => {
    if (restaurantCode) {
      setRestaurantCode(restaurantCode);
      localStorage.setItem("restaurantCode", restaurantCode);
      localStorage.removeItem("menuItems");
    }
  }, [restaurantCode, setRestaurantCode]);

  useEffect(() => {
    if (restaurantId && restaurantDetails) {
      const updatedUserData = { ...userData, restaurantId, restaurantName: restaurantDetails.name, tableNumber: table_number || '1' };
      setUserData(updatedUserData);
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
      localStorage.setItem("restaurantId", restaurantId);
    }
  }, [restaurantId, restaurantDetails, table_number]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    localStorage.setItem("isDarkMode", newIsDarkMode.toString());
    if (newIsDarkMode) {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
    }
  };

  const getFirstName = (name) => {
    if (!name) return "User";
    return name.split(" ")[0];
  };

  const toTitleCase = (str) => {
    if (!str) return "";
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  return (
    <div>
      <div className="page-wrapper">
      <header className="header header-fixed style-3 shadow-sm">
        <div className="header-content d-flex justify-content-between">
          <div className="">
            

            <img
              src={logo}
              alt="logo"
              className="me-2"
              width="30"
              height="30"
            />
            <span className="text-dark mb-0 mt-1 fw-bolder">MenuMitra</span>
          </div>
          <div className="right-content gap-1">
            <div className="menu-toggler toggler-icon" onClick={toggleSidebar}>
              {isLoggedIn ? (
                <i className="ri-menu-line fs-3"></i>
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
        className={`dark-overlay ${sidebarOpen ? "dark-overlay active" : ""}`}
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
          <div className="custom_font_size">
            <span className="ms-3 pt-4 custom_font_size_bold">
              {userData?.name
                ? `Hello, ${toTitleCase(getFirstName(userData.name))}`
                : "Hello, User"}
            </span>
            <div className="mail ms-3 gray-text custom_font_size">
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
        <div className="sidebar-bottom">

      
        <div className="sidebar-logo text-center mt-6">
        <img
              src={logo}
              alt="logo"
              className="me-2"
              width="30"
              height="30"
            />
            <span className="text-dark mb-0 mt-1 fw-bolder">MenuMitra</span>
        </div>
        <div className="text-center mt-2">
          <div className="gray-text custom_font_size">Powered by </div>
          <div className="gray-text custom_font_size">
            Shekru Labs India Pvt. Ltd.
          </div>
          <div className="gray-text custom_font_size">v1.1</div>
        </div>
        </div>
      </div>

        <main className="page-content space-top mb-5 pb-3">
          <div className="container overflow-hidden pt-0">
            <OfferBanner />
            <ProductCart />
          </div>
        </main>

        <Bottom />
      </div>
    </div>
  );
};

export default HomeScreen;