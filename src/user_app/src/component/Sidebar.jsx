import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import logo from "../assets/logos/menumitra_logo_128.png";
import { usePopup } from '../context/PopupContext';

export const SidebarToggler = () => {
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
    <>
      <div className="right-content gap-1">
        <div className="menu-toggler toggler-icon" onClick={toggleSidebar}>
          <i className="fa-solid fa-bars fs-3"></i>
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
                      <i className="fa-solid fa-lock me-2 fs-3"></i> Login
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
              className="nav-link active d-flex align-items-center justify-content-between"
              to="/user_app/Menu"
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
                      <i className="fa-solid fa-circle-check text-danger me-1"></i>
                      Non-Veg
                    </span>
                    <span className={`veg ${!isVegOnly ? "active" : ""}`}>
                      <i className="fa-solid fa-circle-check text-success me-1"></i>
                      Veg
                    </span>
                  </div>
                  <div className="toggle-button"></div>
                </div>
              </div> */}
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
                      className="fa-solid fa-circle-check text-success"
                      style={{ fontSize: "16px" }} // Adjust icon size
                    ></i>
                  ) : (
                    <i
                      className="fa-solid fa-caret-up text-danger"
                      style={{ fontSize: "16px" }} // Adjust icon size
                    ></i>
                  )}
                </div>
              </div>
            </Link>
          </li>
          <li>
            <Link className="nav-link active" to="/user_app/Category">
              <span className="dz-icon icon-sm">
                <i className="fa-solid fa-bars-staggered fs-4"></i>
              </span>
              <span className="  font_size_16 fw-medium">Category</span>
            </Link>
          </li>
          <li>
            <Link className="nav-link active" to="/user_app/Wishlist">
              <span className="dz-icon icon-sm">
                <i className="fa-regular fa-heart fs-4"></i>
              </span>
              <span className="  font_size_16  fw-medium">Favourite</span>
            </Link>
          </li>
          <li>
            <Link className="nav-link active" to="/user_app/MyOrder">
              <span className="dz-icon icon-sm">
                <i className="fa-solid fa-clock-rotate-left fs-4"></i>
              </span>
              <span className="  font_size_16 fw-medium ">My Orders</span>
            </Link>
          </li>
          <li>
            <Link className="nav-link active" to="/user_app/Cart">
              <span className="dz-icon icon-sm">
                <i className="fa-solid fa-cart-shopping fs-4"></i>
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
                      : "fa-solid fa-user fs-4"
                  }
                ></i>
              </span>
              <span className=" font_size_16 fw-medium  ">Profile</span>
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
              Shekru Labs India Pvt. Ltd. <br />
              Office no 6, 2nd Floor Manogat Appt Near Muktangan,Sahakar nagar, Pune, MH-411037
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

