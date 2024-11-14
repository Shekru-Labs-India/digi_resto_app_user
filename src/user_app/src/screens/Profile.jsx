import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Bottom from "../component/bottom";
import logo from "../assets/logos/menumitra_logo_128.png";
import "../assets/css/custom.css";
import "../assets/css/style.css";
import Sidebar, { SidebarToggler } from "../component/Sidebar";
import { usePopup } from '../context/PopupContext';
import Header from "../components/Header";

const Profile = () => {
  const navigate = useNavigate();
  const { showLoginPopup } = usePopup();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("isDarkMode") === "true");

  const handleLogout = () => {
    const restaurantCode = localStorage.getItem("restaurantCode");
    const tableNumber = localStorage.getItem("tableNumber");
    
    localStorage.removeItem("customer_id");
    localStorage.removeItem("userData");
    localStorage.removeItem("cartItems");
    
    showLoginPopup();
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
        {/* <header className="header header-fixed style-3 shadow-sm">
          <div className="header-content ">
            <div className="left-content">
              <Link
                to={`/user_app/${userData?.restaurantId || ""}/${userData?.tableNumber || ""}`}
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
        </header> */}

        <Header title="Profile" />

        <main className="page-content space-top p-b40">
          <div className="container">
            <div className="profile-area">
              <div className="main-profile">
                <div className="d-flex align-items-center">
                  <h4 className="name mb-0">
                    <div className="text-end">
                      {isLoggedIn ? (
                        <>
                          <Link to="/user_app/Profile">
                            <i className="ri-user-3-fill me-2 font_size_14 "></i>
                            <span className="font_size_14">
                              Hello, {toTitleCase(getFirstName(userData.name))}
                            </span>
                          </Link>
                        </>
                      ) : (
                        <button
                          className="btn btn-outline-primary rounded-pill"
                          onClick={showLoginPopup}
                        >
                          <i className="ri-lock-2-line me-2 fs-3"></i> Login
                        </button>
                      )}
                    </div>
                  </h4>
                </div>
              </div>
              <div className="content-box">
                <ul className="row g-2">
                  <li className="col-6">
                    <Link
                      to="/user_app/Menu"
                      className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
                    >
                      <i className="ri-bowl-line me-2 fs-2"></i>
                      <span className=" ">Menu</span>
                    </Link>
                  </li>
                  <li className="col-6">
                    <Link
                      to="/user_app/MyOrder"
                      className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
                    >
                      <i className="ri-drinks-2-line me-2 fs-2"></i>
                      <span className=" ">My Order</span>
                    </Link>
                  </li>
                  <li className="col-6">
                    <Link
                      to="/user_app/Cart"
                      className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
                    >
                      <i className="ri-shopping-cart-line me-2 fs-2"></i>
                      <span className=" ">Cart</span>
                    </Link>
                  </li>
                  <li className="col-6">
                    <Link
                      to="/user_app/Wishlist"
                      className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
                    >
                      <i className="ri-heart-3-line me-2 fs-2"></i>
                      <span className=" ">Favourite</span>
                    </Link>
                  </li>
                </ul>
              </div>
              {isLoggedIn && (
                <div className="container p-0">
                  <div className="title-bar">
                    <span className="mb-0 fw-bold">Account</span>
                  </div>
                  <Link
                    to="/user_app/EditProfile"
                    className="item-content item-link"
                  >
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
          <div className="d-flex justify-content-center align-items-center">
            <div className="" onClick={handleLogout}>
              <i className="ri-shut-down-line fs-3"></i>
              <span className="ms-2">Logout</span>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-center align-items-center mt-2">
          <Link to="/user_app/index">
            <i className="ri-store-2-line gray-text fs-4"></i>
            <span className="ms-2 gray-text ">All Hotels</span>
          </Link>
        </div>
        <div className="mt-5">
          <div className="text-center pt-3">
            <a
              href="https://www.facebook.com/people/Menu-Mitra/61565082412478/"
              className="footer-link mx-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="ri-facebook-circle-fill ri-xl"></i>
            </a>
            <a
              href="https://www.instagram.com/menumitra/"
              className="footer-link mx-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="ri-instagram-line ri-xl"></i>
            </a>
            <a
              href="https://www.youtube.com/@menumitra"
              className="footer-link mx-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="ri-youtube-line ri-xl"></i>
            </a>
            <a
              href="https://www.linkedin.com/company/102429337/admin/dashboard/"
              className="footer-link mx-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="ri-linkedin-fill ri-xl"></i>
            </a>
            <a
              href="https://www.threads.net/@menumitra"
              className="footer-link mx-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="ri-twitter-x-line ri-xl"></i>
            </a>
            <a
              href="https://t.me/MenuMitra"
              className="footer-link mx-2"
              target="_blank"
              rel="noopener noreferrer"
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
                width="30"
                height="30"
              />
              <span className="text-dark mb-0 fw-bolder font_size_18">
                MenuMitra
              </span>
            </Link>
          </div>

          <div className="text-center text-md-center mt-2 gray-text">
            <i className="ri-flashlight-fill ri-lg"></i> Powered by <br />
            <a
              className="gray-text"
              href="https://www.shekruweb.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#0d775e" }}
            >
              Shekru Labs India Pvt. Ltd.
            </a>
            {/* <div className="">v1.1</div> */}
          </div>
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
