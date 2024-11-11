import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../assets/css/style.css";
import "../assets/css/custom.css";
import Bottom from "../component/bottom";
import OfferBanner from "../component/OfferBanner";
import ProductCart from "../component/ProductCart";
import { useRestaurantId } from "../context/RestaurantIdContext";
import logo from "../assets/logos/menumitra_logo_128.png";
import NearbyArea from "../component/NearbyArea";
import { usePopup } from '../context/PopupContext';
const HomeScreen = () => {
  const { restaurantCode, table_number } = useParams();
  const { showLoginPopup } = usePopup();
  const { setRestaurantCode, restaurantId, restaurantDetails, restaurantName } =
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

  return (
    <div>
      <div className="page-wrapper">
        <header className="header header-fixed style-3 shadow-sm">
          <div className="header-content d-flex justify-content-between"
            style={{ zIndex: 1040, position: 'relative' }}
          >
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
              <div
                className="menu-toggler toggler-icon"
                onClick={toggleSidebar}
              >
                <i className="ri-menu-line fs-3"></i>
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
            <div className=" ">
              <span className="ms-3 pt-4    ">
                {userData?.name ? (
                  `Hello, ${toTitleCase(getFirstName(userData.name))}`
                ) : (
                  <>
                    <Link
                      className="btn btn-outline-primary rounded-pill"
                      onClick={() => {
                        showLoginPopup(); // Opens the login popup
                        toggleSidebar();  // Closes the sidebar
                      }}
                    >
                      <i className="ri-lock-2-line me-2 fs-3"></i> Login
                    </Link>
                  </>
                )}
              </span>
              <div className="font_size_12 ms-3 gray-text  ">{userData?.mobile}</div>
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
              <Link
                className="nav-link active d-flex align-items-center justify-content-between"
                to="/user_app/Menu"
              >
                <div className="d-flex align-items-center">
                  <span className="dz-icon icon-sm">
                    <i className="ri-bowl-line fs-3"></i>
                  </span>
                  <span className="">Menu</span>
                </div>
                <div className="veg-toggle ">
                  <div
                    className={`toggle-switch ${isVegOnly ? "active" : ""}`}
                    onClick={(e) => {
                      e.preventDefault(); // Prevent navigation
                      toggleVegNonVeg();
                    }}
                  >
                    <div className="toggle-label">
                      <span className={`non-veg ${isVegOnly ? "active" : ""}`}>
                      <i className="ri-checkbox-blank-circle-fill text-danger me-1"></i>
                        
                        Non-Veg
                      </span>
                      <span className={`veg ${!isVegOnly ? "active" : ""}`}>
                      <i className="ri-checkbox-blank-circle-fill text-success me-1"></i>
                       
                        Veg
                      </span>
                    </div>
                    <div className="toggle-button"></div>
                  </div>
                </div>
              </Link>
            </li>
            <li>
              <Link className="nav-link active" to="/user_app/Category">
                <span className="dz-icon icon-sm">
                  <i className="ri-list-check-2 fs-3"></i>
                </span>
                <span className="   ">Category</span>
              </Link>
            </li>
            <li>
              <Link className="nav-link active" to="/user_app/Wishlist">
                <span className="dz-icon icon-sm">
                  <i className="ri-heart-3-line fs-3"></i>
                </span>
                <span className="   ">Favourite</span>
              </Link>
            </li>
            <li>
              <Link className="nav-link active" to="/user_app/MyOrder">
                <span className="dz-icon icon-sm">
                  <i className="ri-drinks-2-line fs-3"></i>
                </span>
                <span className="   ">My Orders</span>
              </Link>
            </li>
            <li>
              <Link className="nav-link active" to="/user_app/Cart">
                <span className="dz-icon icon-sm">
                  <i className="ri-shopping-cart-line fs-3"></i>
                </span>
                <span className="   ">Cart</span>
              </Link>
            </li>
            <li>
              <Link className="nav-link active" to="/user_app/Profile">
                <span className="dz-icon icon-sm">
                  <i
                    className={
                      userData && userData.customer_id
                        ? "ri-user-3-fill fs-3"
                        : "ri-user-3-line fs-3"
                    }
                  ></i>
                </span>
                <span className="   ">Profile</span>
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
            <div className="text-center pt-3">
              <a
                href="https://www.facebook.com/people/Menu-Mitra/61565082412478/"
                className="footer-link mx-2"
                target="_blank"
              >
                <i className="ri-facebook-circle-fill ri-xl"></i>
              </a>
              <a
                href="https://www.instagram.com/menumitra/"
                className="footer-link mx-2"
                target="_blank"
              >
                <i className="ri-instagram-line ri-xl"></i>
              </a>
              <a
                href="https://www.youtube.com/@menumitra"
                className="footer-link mx-2"
                target="_blank"
              >
                <i className="ri-youtube-line ri-xl"></i>
              </a>
              <a
                href="https://www.linkedin.com/company/102429337/admin/dashboard/"
                className="footer-link mx-2"
                target="_blank"
              >
                <i className="ri-linkedin-fill ri-xl"></i>
              </a>
              <a
                href="https://www.threads.net/@menumitra"
                className="footer-link mx-2"
                target="_blank"
              >
                <i className="ri-twitter-x-line ri-xl"></i>
              </a>
              <a
                href="https://t.me/MenuMitra"
                className="footer-link mx-2"
                target="_blank"
              >
                <i className="ri-telegram-line ri-xl"></i>
              </a>
            </div>
            <div className="sidebar-logo text-center mt-5">
            <Link to="/">
              <img
                src={logo}
                alt="logo"
                className="me-2"
                width="30"
                height="30"
              />
              </Link>
              <span className="text-dark mb-0 mt-1 fw-bolder">MenuMitra</span>
            </div>

            <div className="text-center text-md-center mt-2 gray-text">
              <i className="ri-flashlight-fill ri-lg"></i> Powered by <br />
              <a
                className="gray-text"
                href="https://www.shekruweb.com"
                target="_blank"
              >
                Shekru Labs India Pvt. Ltd.
              </a>
              <div className="">v1.1</div>
            </div>
          </div>
        </div>

        <main className="page-content space-top mb-5 pb-3">
          <div className="container overflow-hidden pt-0">
            <OfferBanner />
            <ProductCart isVegOnly={isVegOnly} />
            <div className="mb-3">
              <NearbyArea />
            </div>
          </div>
        </main>

        <Bottom />
      </div>
    </div>
  );
};

export default HomeScreen;
