import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import logo from "../assets/logos/menumitra_logo_128.png";
import { usePopup } from '../context/PopupContext';
import { useLocation } from "react-router-dom";
import { APP_VERSION } from "../component/config";
import config from "./config";

export const SidebarToggler = () => {
  const location = useLocation();
  const {  table_number } = useParams();
  const { showLoginPopup } = usePopup();
  const {  restaurantId, restaurantDetails, restaurantName } =
    useRestaurantId();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("isDarkMode") === "true"
  );
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || {}
  );
  const isLoggedIn = !!localStorage.getItem("userData");

  const [isVegOnly, setIsVegOnly] = useState(() => {
    return localStorage.getItem("isVegOnly") === "true" || false;
  });

  const [restaurantCode, setRestaurantCode] = useState('');
  const tableNumber = localStorage.getItem("tableNumber");
  const sectionId = localStorage.getItem("sectionId");

  useEffect(() => {
    // Try to get restaurantCode from multiple sources
    const storedCode = localStorage.getItem("restaurantCode");
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (storedCode) {
      setRestaurantCode(storedCode);
    } else if (userData?.restaurantCode) {
      setRestaurantCode(userData.restaurantCode);
    }
  }, []);

  const toggleVegNonVeg = () => {
    const newValue = !isVegOnly;
    setIsVegOnly(newValue);
    localStorage.setItem("isVegOnly", newValue.toString());
  };

  useEffect(() => {
    if (restaurantCode) {
      setRestaurantCode(restaurantCode);
      localStorage.setItem("restaurantCode", restaurantCode);
      localStorage.removeItem("menuItems");
      // localStorage.removeItem("cartItems");
      // localStorage.removeItem("cartId");
    }
  }, [restaurantCode, setRestaurantCode]);

  useEffect(() => {
    if (restaurantId && restaurantDetails) {
      const updatedUserData = {
        ...userData,
        restaurantId,
        restaurantName: restaurantDetails.name,
        tableNumber: table_number || "1",
      };
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
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };


  //call waiter
  const callWaiter = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData?.user_id) {
        showLoginPopup();
        return;
      }

      const response = await fetch(`${config.apiDomain}/common_api/call_waiter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          outlet_id: restaurantId,
          user_id: userData.user_id
        })
      });

      const data = await response.json();
      if (data.st === 1) {
       alert("Waiter has been called successfully!" || data.msg);
      } else {
        alert("Failed to call waiter. Please try again." || data.msg);
      }
    } catch (error) {
      console.error('Error calling waiter:', error);
      alert('Failed to call waiter. Please try again.');
    }
  };

  const handleClick = (e, path) => {
    if (location.pathname === path) {
      e.preventDefault();
      setSidebarOpen(false);
    }
  };

  return (
    <>
      <div className="right-content gap-1">
        <span className=""> </span>
        <div className="menu-toggler toggler-icon">
          {
            <Link to="/user_app/Search">
              <i className="fa-solid fa-magnifying-glass me-3 fs-6 gray-text"></i>
            </Link>
          }
          <i
            className="fa-solid fa-bars-staggered fs-3"
            onClick={toggleSidebar}
          ></i>
        </div>
      </div>

      <div
        className={`dark-overlay ${sidebarOpen ? "dark-overlay active" : ""}`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar show" : ""}`}>
        <div className="author-box">
          <div className=" ">
            <Link to="/user_app/Profile">
              <span className="ms-3 pt-4    ">
                {/* <i
                  className={
                    userData?.customer_id
                      ? "fa-solid fa-user me-2 font_size_14"
                      : "fa-regular fa-user me-2 font_size_14"
                  }
                ></i> */}

                {userData?.name ? (
                  `Hello, ${toTitleCase(getFirstName(userData.name))}`
                ) : (
                  <>
                    <Link
                      className="btn btn-outline-primary rounded-pill"
                      onClick={() => {
                        showLoginPopup(); // Opens the login popup
                        toggleSidebar(); // Closes the sidebar
                      }}
                    >
                      <i className="fa-solid fa-lock me-2 fs-6"></i> Login
                    </Link>
                  </>
                )}
              </span>
            </Link>
            <div className="font_size_12 ms-3 gray-text  ">
              {userData?.mobile}
            </div>
            <div className="dz-mode mt-3 me-4">
              <div className="theme-btn" onClick={toggleTheme}>
                <i
                  className={`fa-solid ${
                    isDarkMode ? "fa-sun" : "fa-moon"
                  } sun`}
                ></i>
                <i
                  className={`fa-solid ${
                    isDarkMode ? "fa-moon" : "fa-sun"
                  } moon`}
                ></i>
              </div>
            </div>
          </div>
        </div>
        <ul className="nav navbar-nav">
          <li>
            {restaurantCode ? (
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to={`/user_app/o${restaurantCode?.replace(/^o/, '')}/s${sectionId?.replace(/^s/, '')}/t${tableNumber?.replace(/^t/, '')}`}
                onClick={(e) => handleClick(e, `/user_app/o${restaurantCode?.replace(/^o/, '')}/s${sectionId?.replace(/^s/, '')}/t${tableNumber?.replace(/^t/, '')}`)}
              >
                <span className="dz-icon icon-sm">
                  <i className="fa-solid fa-house fs-3"></i>
                </span>
                <span className="font_size_16 fw-medium">Home</span>
              </NavLink>
            ) : (
              <Link
                className="nav-link"
                to="/user_app/Index"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="dz-icon icon-sm">
                  <i className="fa-solid fa-house fs-3"></i>
                </span>
                <span className="font_size_16 fw-medium">Home</span>
              </Link>
            )}
          </li>
          <li>
            <NavLink
              className={({ isActive }) => `nav-link d-flex align-items-center justify-content-between ${isActive ? 'active' : ''}`}
              to="/user_app/Menu"
              onClick={(e) => handleClick(e, "/user_app/Menu")}
            >
              <div className="d-flex align-items-center">
                <span className="dz-icon icon-sm">
                  <i className="fa-solid fa-bowl-rice fs-4"></i>
                </span>
                <span className="font_size_16 fw-medium">Menu</span>
              </div>
              {/* <div className="veg-toggle ">
                <div
                  className={`toggle-switch ${isVegOnly ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleVegNonVeg();
                  }}
                >
                  <div className="toggle-label">
                    <span className={`non-veg ${isVegOnly ? "active" : ""}`}>
                      <i className="fa-solid fa-circle text-danger me-1"></i>
                      Non-Veg
                    </span>
                    <span className={`veg ${!isVegOnly ? "active" : ""}`}>
                      <i className="fa-solid fa-circle text-success me-1"></i>
                      Veg
                    </span>
                  </div>
                  <div className="toggle-button"></div>
                </div>
              </div> */}
            </NavLink>
          </li>
          <li>
            <NavLink 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              to="/user_app/Category"
              onClick={(e) => handleClick(e, "/user_app/Category")}
            >
              <span className="dz-icon icon-sm">
                <i className="fa-solid fa-layer-group fs-3"></i>
              </span>
              <span className="font_size_16 fw-medium">Category</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              to="/user_app/Wishlist"
              onClick={(e) => handleClick(e, "/user_app/Wishlist")}
            >
              <span className="dz-icon icon-sm">
                <i className="fa-regular fa-heart fs-4"></i>
              </span>
              <span className="font_size_16 fw-medium">Favourite</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              to="/user_app/MyOrder"
              onClick={(e) => handleClick(e, "/user_app/MyOrder")}
            >
              <span className="dz-icon icon-sm">
                <i className="fa-solid fa-clock-rotate-left fs-4"></i>
              </span>
              <span className="font_size_16 fw-medium">Orders</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              to="/user_app/Checkout"
              onClick={(e) => handleClick(e, "/user_app/Checkout")}
            >
              <span className="dz-icon icon-sm">
                <i className="fa-solid fa-check-to-slot fs-4"></i>
              </span>
              <span className="font_size_16 fw-medium">Checkout</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              to="/user_app/Search"
              onClick={(e) => handleClick(e, "/user_app/Search")}
            >
              <span className="dz-icon icon-sm">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <span className="font_size_16 fw-medium">Search</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              to="/user_app/Profile"
              onClick={(e) => handleClick(e, "/user_app/Profile")}
            >
              <span className="dz-icon icon-sm">
                <i className={userData?.user_id ? "fa-solid fa-user" : "fa-regular fa-user"}></i>
              </span>
              <span className="font_size_16 fw-medium">Profile</span>
            </NavLink>
          </li>
          <li>
            <Link
              className="nav-link"
              to="#"
              onClick={(e) => {
                e.preventDefault();
                callWaiter();
              }}
            >
              <span className="dz-icon icon-sm">
                <i className="fa-solid fa-bell fs-4"></i>
              </span>
              <span className="font_size_16 fw-medium">Call Waiter</span>
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
        {/* <div className="sidebar-bottom">
          <div className="text-center pt-3">
            <a
              href="https://www.facebook.com/people/Menu-Mitra/61565082412478/"
              className="footer-link mx-2"
              target="_blank"
            >
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a
              href="https://www.instagram.com/menumitra/"
              className="footer-link mx-2"
              target="_blank"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a
              href="https://www.youtube.com/@menumitra"
              className="footer-link mx-2"
              target="_blank"
            >
              <i className="fa-brands fa-youtube"></i>
            </a>
            <a
              href="https://www.linkedin.com/company/102429337/admin/dashboard/"
              className="footer-link mx-2"
              target="_blank"
            >
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a
              href="https://x.com/MenuMitra"
              className="footer-link mx-2"
              target="_blank"
            >
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a
              href="https://t.me/MenuMitra"
              className="footer-link mx-2"
              target="_blank"
            >
              <i className="fa-brands fa-telegram"></i>
            </a>
          </div>
          <div className="sidebar-logo text-center mt-5">
            <Link
              to="/"
              className="d-flex align-items-center justify-content-center"
            >
              <img src={logo} alt="logo" width="40" height="40" />
              <span className="text-dark mb-0 fw-semibold font_size_18">
                MenuMitra
              </span>
            </Link>
          </div>

          <div className="text-center text-md-center mt-2 gray-text font_size_12">
            <i className="fa-solid fa-bolt "></i> Powered by <br />
          </div>
          <div className="text-center mb-5">
            <a
              className="text-success font_size_12"
              href="https://www.shekruweb.com"
              target="_blank"
            >
              Shekru Labs India Pvt. Ltd.
            </a>
          </div>
        </div> */}
        <div className="align-bottom border-top">
        <div className="d-flex justify-content-center py-0">
              <a
                href="https://menumitra.com/"
                className="d-flex align-items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={logo} alt="logo" width="40" height="40" />
                <span className="text-dark mb-0 ms-2 fw-semibold font_size_18 ">
                  MenuMitra
                </span>
              </a>
            </div>
          <div className="text-center text-md-center gray-text font_size_12 pb-5">
            <div className="my-4">
              <div className="text-center d-flex justify-content-center">
                <a
                  href="https://www.facebook.com/people/Menu-Mitra/61565082412478/"
                  className="footer-link mx-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-facebook fs-4"></i>
                </a>
                <a
                  href="https://www.instagram.com/menumitra/"
                  className="footer-link mx-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-instagram fs-4"></i>
                </a>
                <a
                  href="https://www.youtube.com/@menumitra"
                  className="footer-link mx-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-youtube fs-4"></i>
                </a>

                <a
                  href="https://x.com/MenuMitra"
                  className="footer-link mx-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-x-twitter fs-4"></i>
                </a>
              </div>
            </div>
            <i className="fa-solid fa-bolt"></i> Powered by <br />
            <a
              className="text-success font_size_12"
              href="https://www.shekruweb.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shekru Labs India Pvt. Ltd.
            </a>
            <p className="text-center font_size_12">version {APP_VERSION}</p>
          </div>
        </div>
      </div>
    </>
  );
};

