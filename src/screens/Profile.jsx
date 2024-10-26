import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Bottom from "../component/bottom";
import logo from "../assets/logos/mmua_transparent.png";
import "../assets/css/custom.css";
import "../assets/css/style.css";
import Sidebar, { SidebarToggler } from "../component/Sidebar";

const Profile = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("isDarkMode") === "true");

  const handleLogout = () => {
    const { restaurantId, tableNumber, restaurantCode } = JSON.parse(
      localStorage.getItem("userData") || "{}"
    );
    localStorage.removeItem("customer_id");
    localStorage.removeItem("userData");
    localStorage.removeItem("cartItems");
    localStorage.setItem("RestaurantId", restaurantId);
    localStorage.setItem("TableNumber", tableNumber);
    localStorage.setItem("RestaurantCode", restaurantCode);
    navigate("/Signinscreen");
  };

  const toTitleCase = (str) => {
    if (!str) {
      return "";
    }
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const getFirstName = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    return words[0];
  };

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

  const renderContent = () => {
    const isLoggedIn = userData && userData.customer_id;

    return (
      <>
        <header className="header header-fixed style-3 shadow-sm">
          <div className="header-content ">
            <div className="left-content">
              <Link
                to={`/${userData?.restaurantId || ""}/${
                  userData?.tableNumber || ""
                }`}
                className="back-btn fs-3"
                onClick={() => navigate(-1)}
              >
                <i className="ri-arrow-left-line "></i>
              </Link>
            </div>
            <div className="mid-content">
              <span className="me-2 title">Profile</span>
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
                      to="/Signinscreen"
                    >
                      <i className="ri-lock-2-line me-2 fs-3"></i> Login
                    </Link>
                  </>
                )}
              </span>
              <div className="mail ms-3 gray-text  ">{userData?.mobile}</div>
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
                <span className="   ">Menu</span>
              </Link>
            </li>
            <li>
              <Link className="nav-link active" to="/Category">
                <span className="dz-icon icon-sm">
                  <i className="ri-list-check-2 fs-3"></i>
                </span>
                <span className="   ">Category</span>
              </Link>
            </li>
            <li>
              <Link className="nav-link active" to="/Wishlist">
                <span className="dz-icon icon-sm">
                  <i className="ri-heart-2-line fs-3"></i>
                </span>
                <span className="   ">Favourite</span>
              </Link>
            </li>
            <li>
              <Link className="nav-link active" to="/MyOrder">
                <span className="dz-icon icon-sm">
                  <i className="ri-drinks-2-line fs-3"></i>
                </span>
                <span className="   ">My Orders</span>
              </Link>
            </li>
            <li>
              <Link className="nav-link active" to="/Cart">
                <span className="dz-icon icon-sm">
                  <i className="ri-shopping-cart-line fs-3"></i>
                </span>
                <span className="   ">Cart</span>
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
                <span className="   ">Profile</span>
              </Link>
            </li>
          </ul>
          <div className="sidebar-bottom">
            <div className="text-center pt-3">
              <a
                href="https://www.facebook.com/share/ra9cKRDkDpy2W94j/?mibextid=qi2Omg"
                className="footer-link mx-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="ri-facebook-circle-fill ri-xl"></i>
              </a>
              <a
                href="https://www.instagram.com/autoprofito/?next=%2F"
                className="footer-link mx-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="ri-instagram-line ri-xl"></i>
              </a>
              <a
                href="https://www.youtube.com/channel/UCgfTIIUL16SyHAQzQNmM52A"
                className="footer-link mx-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="ri-youtube-line ri-xl"></i>
              </a>
              <a
                href="https://www.linkedin.com/company/104616702/admin/dashboard/"
                className="footer-link mx-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="ri-linkedin-fill ri-xl"></i>
              </a>
              <a
                href="https://www.threads.net/@autoprofito"
                className="footer-link mx-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="ri-twitter-x-line ri-xl"></i>
              </a>
              <a
                href="https://t.me/Autoprofito"
                className="footer-link mx-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="ri-telegram-line ri-xl"></i>
              </a>
            </div>
            <div className="sidebar-logo text-center mt-5">
              <img
                src={logo}
                alt="logo"
                className="me-2"
                width="30"
                height="30"
              />
              <span className="text-dark mb-0 mt-1 fw-bolder">MenuMitra</span>
            </div>

            <p className="text-center text-md-center mt-2 gray-text">
              <i className="ri-flashlight-fill ri-lg"></i> Powered by <br />
              <a
                className="gray-text"
                href="https://www.shekruweb.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Shekru Labs India Pvt. Ltd.
              </a>
              <div className="">v1.1</div>
            </p>
          </div>
        </div>

        <main className="page-content space-top p-b40">
          <div className="container">
            <div className="profile-area">
              <div className="main-profile">
                <div className="d-flex align-items-center">
                  <h4 className="name mb-0">
                    <div className="text-end">
                      {isLoggedIn ? (
                        <>
                          <i className="ri-user-3-fill me-2 fs-3"></i>
                          Hello, {toTitleCase(getFirstName(userData.name))}
                        </>
                      ) : (
                        <Link
                          className="btn btn-outline-primary rounded-pill "
                          to="/Signinscreen"
                        >
                          <i className="ri-lock-2-line me-2 fs-3"></i> Login
                        </Link>
                      )}
                    </div>
                  </h4>
                </div>
              </div>
              <div className="content-box">
                <ul className="row g-2">
                  <li className="col-6">
                    <Link
                      to="/Menu"
                      className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
                    >
                      <i className="ri-bowl-line me-2 fs-2"></i>
                      <span className=" ">Menu</span>
                    </Link>
                  </li>
                  <li className="col-6">
                    <Link
                      to="/MyOrder"
                      className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
                    >
                      <i className="ri-drinks-2-line me-2 fs-2"></i>
                      <span className=" ">My Order</span>
                    </Link>
                  </li>
                  <li className="col-6">
                    <Link
                      to="/Cart"
                      className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
                    >
                      <i className="ri-shopping-cart-line me-2 fs-2"></i>
                      <span className=" ">Cart</span>
                    </Link>
                  </li>
                  <li className="col-6">
                    <Link
                      to="/Wishlist"
                      className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
                    >
                      <i className="ri-heart-2-line me-2 fs-2"></i>
                      <span className=" ">Favourite</span>
                    </Link>
                  </li>
                </ul>
              </div>
              {isLoggedIn && (
                <div className="container p-0">
                  <Link to="/EditProfile" className="item-content item-link">
                    <div className="title-bar">
                      <span className="mb-0      ">Account Settings</span>
                    </div>
                    <div className="row align-items-center ms-0">
                      <div className="col-auto px-0">
                        {/* <i className={localStorage.getItem("userData") ? "ri-user-3-fill fs-3" : "ri-user-3-line fs-3"}></i> */}
                        <i className="ri-user-3-line fs-3"></i>
                      </div>
                      <div className="col text-start px-1    ">
                        Edit Profile
                      </div>
                      <div className="col-auto text-end ms-auto">
                        <i className="ri-arrow-right-s-line fs-4"></i>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>

        {isLoggedIn && (
          <div className="d-flex justify-content-center align-items-center text-danger">
            <i className="ri-shut-down-line fs-3" onClick={handleLogout}></i>
            <span className="ms-2">LogOut</span>
          </div>
        )}

        <div className="mt-5">
          <div className="text-center pt-3">
            <a
              href="https://www.facebook.com/share/ra9cKRDkDpy2W94j/?mibextid=qi2Omg"
              className="footer-link mx-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="ri-facebook-circle-fill ri-xl"></i>
            </a>
            <a
              href="https://www.instagram.com/autoprofito/?next=%2F"
              className="footer-link mx-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="ri-instagram-line ri-xl"></i>
            </a>
            <a
              href="https://www.youtube.com/channel/UCgfTIIUL16SyHAQzQNmM52A"
              className="footer-link mx-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="ri-youtube-line ri-xl"></i>
            </a>
            <a
              href="https://www.linkedin.com/company/104616702/admin/dashboard/"
              className="footer-link mx-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="ri-linkedin-fill ri-xl"></i>
            </a>
            <a
              href="https://www.threads.net/@autoprofito"
              className="footer-link mx-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="ri-twitter-x-line ri-xl"></i>
            </a>
            <a
              href="https://t.me/Autoprofito"
              className="footer-link mx-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="ri-telegram-line ri-xl"></i>
            </a>
          </div>
          <div className="sidebar-logo text-center mt-5">
            <img
              src={logo}
              alt="logo"
              className="me-2"
              width="30"
              height="30"
            />
            <span className="text-dark mb-0 mt-1 fw-bolder">MenuMitra</span>
          </div>

          <p className="text-center text-md-center mt-2 gray-text">
            <i className="ri-flashlight-fill ri-lg"></i> Powered by <br />
            <a
              className="gray-text"
              href="https://www.shekruweb.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shekru Labs India Pvt. Ltd.
            </a>
            <div className="">v1.1</div>
          </p>
        </div>
      </>
    );
  };

  return (
    <div className="page-wrapper">
      {renderContent()}
      <Bottom />
    </div>
  );
};

export default Profile;
