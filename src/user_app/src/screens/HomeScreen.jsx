import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../assets/css/style.css";

import Bottom from "../component/bottom";
import OfferBanner from "../component/OfferBanner";
import ProductCart from "../component/ProductCart";
import { useRestaurantId } from "../context/RestaurantIdContext";
import logo from "../assets/logos/menumitra_logo_128.png";
import NearbyArea from "../component/NearbyArea";
import { usePopup } from "../context/PopupContext";
import OrdersPlacedOngoing from "./OrdersPlacedOngoing";
import RestaurantSocials from "../components/RestaurantSocials";
import Notice from "../component/Notice";
import { APP_VERSION } from "../component/config";
import config from "../component/config";
import OrderTypeModal from "../components/OrderTypeModal";
const HomeScreen = () => {
  const { restaurantCode, table_number } = useParams();
  const tableNumber = localStorage.getItem("tableNumber");
  const sectionId = localStorage.getItem("sectionId");
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

  const [showRestaurantDisabledModal, setShowRestaurantDisabledModal] =
    useState(null);

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

  useEffect(() => {
    if (restaurantStatus !== true) {
      setShowRestaurantDisabledModal(false);
    }
  }, [restaurantStatus]);

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
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?.user_id) {
        showLoginPopup();
        return;
      }

      const response = await fetch(
        `${config.apiDomain}/common_api/call_waiter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            outlet_id: restaurantId,
            user_id: userData.user_id,
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1) {
        alert("Waiter has been called successfully!" || data.msg);
      } else {
        alert("Failed to call waiter. Please try again." || data.msg);
      }
    } catch (error) {
      console.error("Error calling waiter:", error);
      alert("Failed to call waiter. Please try again.");
    }
  };

  return (
    <div>
      <OrderTypeModal />
      <div className="page-wrapper">
        <header className="header header-fixed style-3 shadow-sm">
          <div
            className="header-content space-top d-flex justify-content-between"
            style={{ zIndex: 1040, position: "relative" }}
          >
            <div className="d-flex align-items-center">
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
                to={`/user_app/o${restaurantCode?.replace(/^o/, '')}/s${sectionId?.replace(/^s/, '')}/t${tableNumber?.replace(/^t/, '')}`}
                onClick={(e) => {
                  e.preventDefault();
                  toggleSidebar();
                }}
              >
                <span className="dz-icon icon-sm">
                  <i className="fa-solid fa-house fs-3"></i>
                </span>
                <span className="font_size_16 fw-medium">Home</span>
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
                <span className=" font_size_16  fw-medium">Orders</span>
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
            <li>
              <Link
                className="nav-link active"
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  callWaiter();
                }}
              >
                <span className="dz-icon icon-sm">
                  <i className="fa-solid fa-bell fs-4"></i>
                </span>
                <span className=" font_size_16 fw-medium  ">Call Waiter</span>
              </Link>
            </li>
          </ul>
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

        <main className="page-content space-top mb-5 p-b40">
          <div className="container overflow-hidden pt-0">
            {/* {isNonProductionDomain() && <Notice />} */}
            <OfferBanner />
            <OrdersPlacedOngoing />
            <ProductCart isVegOnly={isVegOnly} />
            <div className="mb-3">
              <NearbyArea />
              <div className="pb-2">
                <RestaurantSocials />
              </div>
            </div>
          </div>
        </main>

        <Bottom />
      </div>
    </div>
  );
};

export default HomeScreen;
