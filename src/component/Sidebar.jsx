import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import CompanyVersion from "../constants/CompanyVersion";
import logo from "../assets/logos/mmua_transparent.png";

const Sidebar = () => {
  const { restaurantName } = useRestaurantId();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { table_number } = useParams();

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || {}
  );
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize state from local storage
    return localStorage.getItem("isDarkMode") === "true";
  }); // State for theme
  const { restaurantDetails } = useRestaurantId(); // Consume context
  const isLoggedIn = !!localStorage.getItem("userData");
  // const [restaurantName, setRestaurantName] = useState(
  //   JSON.parse(localStorage.getItem("userData.name")) || {}
  // );

  useEffect(() => {
    if (table_number) {
      const updatedUserData = { ...userData, tableNumber: table_number };
      setUserData(updatedUserData);
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
    }
  }, [table_number]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle the sidebar state
  };

  const getFirstName = (name) => {
    if (!name) return "User"; // Return "User" if name is undefined or null
    const words = name.split(" ");
    return words[0]; // Return the first word
  };

  const toTitleCase = (str) => {
    if (!str) return "";
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  useEffect(() => {
    // Apply the theme class based on the current state
    if (isDarkMode) {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
    }
  }, [isDarkMode]); // Depend on isDarkMode to re-apply on state change

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    localStorage.setItem("isDarkMode", newIsDarkMode);
  };

  // Use useEffect to apply the theme on initial load
  useEffect(() => {
    const savedIsDarkMode = localStorage.getItem("isDarkMode") === "true";
    setIsDarkMode(savedIsDarkMode);
    if (savedIsDarkMode) {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
    }
  }, []);

  return (
    <div className={`page-wrapper ${sidebarOpen ? "sidebar-open" : ""}`}>
      <header className="header header-fixed pt-2 shadow-sm">
        <div className="header-content d-flex justify-content-between">
          <div className="">
            {/* <span className=" fw-medium hotel-name">
              <i className="ri-store-2-line me-2"></i>
              {restaurantName.toUpperCase() || "Restaurant Name"}
            </span>
            <span className="fw-medium custom-text-gray">
              <i class="ri-user-location-line me-2 gray-text"></i>
              {userData.tableNumber || ""}
            </span> */}

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
        <div className="sidebar-bottom2">

      
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
    </div>
  );
};

export default Sidebar;
