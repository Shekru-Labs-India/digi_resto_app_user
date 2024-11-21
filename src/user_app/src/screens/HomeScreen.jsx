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
import OrdersPlacedOngoing from "./OrdersPlacedOngoing";
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
            className="header-content d-flex justify-content-between"
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
                        <i className="ri-lock-2-line me-2 fs-3"></i> Login
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
                    <i className="ri-bowl-line fs-4"></i>
                  </span>
                  <span className="font_size_16 fw-medium">Menu</span>
                </div>

                <div className="">
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
                        className="ri-checkbox-blank-circle-fill text-success"
                        style={{ fontSize: "16px" }} // Adjust icon size
                      ></i>
                    ) : (
                      <i
                        className="ri-triangle-fill text-danger"
                        style={{ fontSize: "16px" }} // Adjust icon size
                      ></i>
                    )}
                  </div>
                </div>

                {/* <div className="dz-mode ">
                <div
                  className={`theme-btn ${isVegOnly ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleVegNonVeg();
                  }}
                >
                  
                    <span className={`non-veg ${isVegOnly ? "active" : ""}`}>
                      <i className="ri-checkbox-blank-circle-fill text-danger me-1"></i>
                    
                    </span>
                    <span className={`veg ${!isVegOnly ? "active" : ""}`}>
                      <i className="ri-checkbox-blank-circle-fill text-success me-1"></i>
                  
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
        className="ri-checkbox-blank-circle-fill text-danger me-1"
        style={{
          border: '1px solid red', // Set border color for Non-Veg icon
          fontSize: '16px',
          padding: '4px', // Adjust padding if needed
        }}
      ></i>
    </span>
    <span className={`veg ${!isVegOnly ? "active" : ""}`}>
      <i
        className="ri-checkbox-blank-circle-fill text-success me-1"
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
                  <i className="ri-list-check-2 fs-4"></i>
                </span>
                <span className="  font_size_16 fw-medium">Category</span>
              </Link>
            </li>
            <li>
              <Link className="nav-link active" to="/user_app/Wishlist">
                <span className="dz-icon icon-sm">
                  <i className="ri-heart-3-line fs-4"></i>
                </span>
                <span className=" font_size_16  fw-medium ">Favourite</span>
              </Link>
            </li>
            <li>
              <Link className="nav-link active" to="/user_app/MyOrder">
                <span className="dz-icon icon-sm">
                  <i className="ri-history-line fs-4"></i>
                </span>
                <span className=" font_size_16  fw-medium">My Orders</span>
              </Link>
            </li>
            <li>
              <Link className="nav-link active" to="/user_app/Cart">
                <span className="dz-icon icon-sm">
                  <i className="ri-shopping-cart-line fs-4"></i>
                </span>
                <span className=" font_size_16  fw-medium">Cart</span>
              </Link>
            </li>
            <li>
              <Link className="nav-link active" to="/user_app/Profile">
                <span className="dz-icon icon-sm">
                  <i
                    className={
                      userData && userData.customer_id
                        ? "ri-user-3-fill fs-4"
                        : "ri-user-3-line fs-4"
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
              <i className="ri-flashlight-fill ri-lg"></i> Powered by <br />
              <a
                className="text-success font_size_12"
                href="https://www.shekruweb.com"
                target="_blank"
              >
                Shekru Labs India Pvt. Ltd.
              </a>
            </div>
          </div>
        </div>

        <main className="page-content space-top mb-5 pb-3">
          <div className="container overflow-hidden pt-0">
            {showRestaurantDisabledModal && (
              <div
                className="modal fade show d-block"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <div className="col-6 text-center">
                        <div className="modal-title font_size_16 fw-medium text-nowrap ">
                          This restaurant is disabled
                        </div>
                      </div>
                      {/* <div className="col-6 text-end">
                          <div className="d-flex justify-content-end">
                            <span
                              className="m-2 font_size_16"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            >
                              <i className="ri-close-line text-dark"></i>
                            </span>
                          </div>
                        </div> */}
                    </div>
                    <div className="modal-body">
                      <p className="text-center">
                        This restaurant is currently disabled. <br /> 
                        Please try again
                        later or contact support.
                      </p>
                      {/* <div className="d-flex justify-content-center">
                        <button
                          className="btn px-4 font_size_14 btn-outline-danger rounded-pill"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <OfferBanner />
            <OrdersPlacedOngoing />
            <ProductCart isVegOnly={isVegOnly} />
            <div className="mb-3">
              <NearbyArea />
            </div>
            <div className="divider border-success inner-divider transparent mb-5">
              <span className="bg-body">End</span>
            </div>
          </div>
        </main>

        <Bottom />
      </div>
    </div>
  );
};

export default HomeScreen;
