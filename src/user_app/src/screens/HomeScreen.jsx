import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../assets/css/style.css";

import Bottom from "../component/bottom";
import OfferBanner from "../component/OfferBanner";
import ProductCart from "../component/ProductCart";
import { useRestaurantId } from "../context/RestaurantIdContext";
import logo from "../assets/logos/menumitra_logo_128.png";
import NearbyArea from "../component/NearbyArea";
import { usePopup } from '../context/PopupContext';
import OrdersPlacedOngoing from "./OrdersPlacedOngoing";
import RestaurantSocials from "../components/RestaurantSocials";
import Notice from "../component/Notice";
import { APP_VERSION } from "../component/config";
import { isNonProductionDomain } from "../component/config";
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

  const [showRestaurantDisabledModal, setShowRestaurantDisabledModal] = useState(null)

  const restaurantStatus = localStorage.getItem("restaurantStatus");

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

  useEffect(()=>{
    if(restaurantStatus !== true){
      setShowRestaurantDisabledModal(false)
    }
  },[restaurantStatus])

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
          <div
            className="header-content space-top d-flex justify-content-between"
            style={{ zIndex: 1040, position: "relative" }}
          >
            <div className="d-flex align-items-center">
              <Link to="/" className="d-flex align-items-center">
                <img src={logo} alt="logo" width="40" height="40" />
                <span className="text-dark mb-0 ms-2 fw-semibold font_size_18">
                  MenuMitra
                </span>
              </Link>
            </div>
            <div className="right-content gap-1">
              <span className=""> </span>
              <div className="menu-toggler toggler-icon">
                <Link to="/user_app/Search">
                  <i className="fa-solid fa-magnifying-glass me-3 fs-6 gray-text"></i>
                </Link>

                <i
                  className="fa-solid fa-bars-staggered fs-3"
                  onClick={toggleSidebar}
                ></i>
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
              <Link to="/user_app/Profile">
                <span className="ms-3 pt-4    ">
                  <i
                    className={
                      userData?.user_id
                        ? "fa-solid fa-user me-2 font_size_14"
                        : "fa-regular fa-user me-2 font_size_14"
                    }
                  ></i>
                  {userData?.name ? (
                    `Hello, ${toTitleCase(getFirstName(userData.name))}`
                  ) : (
                    <>
                      <Link
                        className="btn btn-outline-primary rounded-pill"
                        onClick={() => {
                          showLoginPopup();
                          toggleSidebar();
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
              <Link
                className="nav-link active"
                to={`/user_app/${restaurantCode}`}
              >
                <span className="dz-icon icon-sm">
                  <i className="fa-solid fa-house fs-3"></i>
                </span>
                <span className="font_size_16 fw-medium">Home</span>
                {/* <div className="ms-5 ps-5">
                  <div
                    className={`  border ${
                      isVegOnly ? "border-success" : "border-danger"
                    } p-1`}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleVegNonVeg();
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "24px", // Adjust height
                      width: "24px", // Adjust width
                      backgroundColor: "#d4e3dd",
                    }}
                  >
                    {isVegOnly ? (
                      <i
                        className="fa-solid fa-circle text-success"
                        style={{ fontSize: "16px" }} // Adjust icon size
                      ></i>
                    ) : (
                      <i
                        className="fa-solid fa-play fa-rotate-270 text-danger"
                        style={{ fontSize: "16px" }} // Adjust icon size
                      ></i>
                    )}
                  </div>
                </div> */}
              </Link>
            </li>
            <li>
              <Link
                className="nav-link active d-flex align-items-center justify-content-between"
                to="/user_app/Menu"
              >
                <div className="d-flex align-items-center">
                  <span className="dz-icon icon-sm">
                    <i className="fa-solid fa-bowl-rice fs-4"></i>
                  </span>
                  <span className="font_size_16 fw-medium">Menu</span>
                </div>

                {/* <div className="">
                  <div
                    className={`  border ${
                      isVegOnly ? "border-success" : "border-danger"
                    } p-1`}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleVegNonVeg();
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "24px", // Adjust height
                      width: "24px", // Adjust width
                      backgroundColor: "#d4e3dd",
                    }}
                  >
                    {isVegOnly ? (
                      <i
                        className="fa-solid fa-circle text-success"
                        style={{ fontSize: "16px" }} // Adjust icon size
                      ></i>
                    ) : (
                      <i
                        className="fa-solid fa-play fa-rotate-270 text-danger"
                        style={{ fontSize: "16px" }} // Adjust icon size
                      ></i>
                    )}
                  </div>
                </div> */}

                {/* <div className="dz-mode ">
                <div
                  className={`theme-btn ${isVegOnly ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleVegNonVeg();
                  }}
                >
                  
                    <span className={`non-veg ${isVegOnly ? "active" : ""}`}>
                      <i className="fa-solid fa-circle text-danger me-1"></i>
                    
                    </span>
                    <span className={`veg ${!isVegOnly ? "active" : ""}`}>
                      <i className="fa-solid fa-circle text-success me-1"></i>
                  
                    </span>
                  
                  
                </div>
              </div> */}

                {/* <div className="dz-mode">
  <div
    className={`theme-btn ${isVegOnly ? "active" : ""}`}
    onClick={(e) => {
      e.preventDefault();
      toggleVegNonVeg();
    }}
  >
    <span className={`non-veg ${isVegOnly ? "active" : ""}`}>
      <i
        className="fa-solid fa-circle text-danger me-1"
        style={{
          border: '1px solid red', // Set border color for Non-Veg icon
          fontSize: '16px',
          padding: '4px', // Adjust padding if needed
        }}
      ></i>
    </span>
    <span className={`veg ${!isVegOnly ? "active" : ""}`}>
      <i
        className="fa-solid fa-circle text-success me-1"
        style={{
          border: '2px solid green', // Set border color for Veg icon
          
          padding: '2px', // Adjust padding if needed
        }}
      ></i>
    </span>
  </div>
</div> */}
              </Link>
            </li>
            <li>
              <Link className="nav-link active" to="/user_app/Category">
                <span className="dz-icon icon-sm">
                  <i className="fa-solid fa-layer-group fs-3"></i>
                </span>
                <span className="  font_size_16 fw-medium">Category</span>
              </Link>
            </li>
            <li>
              <Link className="nav-link active" to="/user_app/Wishlist">
                <span className="dz-icon icon-sm">
                  <i className="fa-regular fa-heart fs-4"></i>
                </span>
                <span className=" font_size_16  fw-medium ">Favourite</span>
              </Link>
            </li>
            <li>
              <Link className="nav-link active" to="/user_app/MyOrder">
                <span className="dz-icon icon-sm">
                  <i className="fa-solid fa-clock-rotate-left fs-4"></i>
                </span>
                <span className=" font_size_16  fw-medium">My Orders</span>
              </Link>
            </li>
            <li>
              <Link className="nav-link active" to="/user_app/Checkout">
                <span className="dz-icon icon-sm">
                  <i className="fa-solid fa-check-to-slot fs-4"></i>
                </span>
                <span className=" font_size_16  fw-medium">Checkout</span>
              </Link>
            </li>
            <li>
              <Link className="nav-link active" to="/user_app/Search">
                <span className="dz-icon icon-sm">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </span>
                <span className=" font_size_16 fw-medium  ">Search</span>
              </Link>
            </li>
            <li>
              <Link className="nav-link active" to="/user_app/Profile">
                <span className="dz-icon icon-sm">
                  <i
                    className={
                      userData?.user_id
                        ? "fa-solid fa-user"
                        : "fa-regular fa-user"
                    }
                  ></i>
                </span>
                <span className="  font_size_16 fw-medium ">Profile</span>
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
                <img
                  src={logo}
                  alt="logo"
                  className="me-2"
                  width="40"
                  height="40"
                />
                <span className="text-dark mb-0 fw-semibold font_size_18">
                  MenuMitra
                </span>
              </Link>
            </div>

            <div className="text-center text-md-center mt-2 gray-text mb-5 font_size_12">
              <i className="fa-solid fa-bolt "></i> Powered by <br />
              <a
                className="text-success font_size_12"
                href="https://www.shekruweb.com"
                target="_blank"
              >
                Shekru Labs India Pvt. Ltd.
              </a>
            </div>
          </div> */}{" "}
          <div className="align-bottom border-top">
            <div className="d-flex justify-content-center py-0">
              <Link to="/">
                {" "}
                <div className="d-flex align-items-center mt-4 mb-0">
                  <img src={logo} alt="logo" width="40" height="40" />
                  <div className="text-dark mb-0 mt-1 fw-semibold font_size_18">
                    MenuMitra
                  </div>
                </div>
              </Link>
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

        <main className="page-content space-top mb-5 p-b40">
          <div className="container overflow-hidden pt-0">
            {/* {isNonProductionDomain() && <Notice />} */}
            <OfferBanner />
            <OrdersPlacedOngoing />
            <ProductCart isVegOnly={isVegOnly} />
            <div className="mb-3">
              <NearbyArea />
            <RestaurantSocials />
            </div>
          </div>
        </main>

        <Bottom />
      </div>
    </div>
  );
};

export default HomeScreen;
