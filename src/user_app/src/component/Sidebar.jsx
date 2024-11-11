import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import logo from "../assets/logos/menumitra_logo_128.png";

export const SidebarToggler = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <div className="menu-toggler toggler-icon" onClick={toggleSidebar}>
        <i className="ri-menu-line fs-3"></i>
      </div>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || {}
  );
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("isDarkMode") === "true";
  });

  const [isVegOnly, setIsVegOnly] = useState(() => {
    return localStorage.getItem("isVegOnly") === "true";
  });

  const toggleVegNonVeg = () => {
    const newValue = !isVegOnly;
    setIsVegOnly(newValue);
    localStorage.setItem("isVegOnly", newValue);
  };
  const { restaurantName } = useRestaurantId();
  const navigate = useNavigate();

  const getFirstName = (name) => {
    if (!name) return "User";
    const words = name.split(" ");
    return words[0];
  };

  const toTitleCase = (str) => {
    if (!str) return "";
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    localStorage.setItem("isDarkMode", newIsDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
    }
  }, [isDarkMode]);

  const navLinks = [
    {
      path: "/user_app/Menu",
      icon: "ri-bowl-line",
      text: "Menu",
      hasVegToggle: true
    },
    {
      path: "/user_app/Category",
      icon: "ri-list-check-2",
      text: "Category"
    },
    {
      path: "/user_app/Wishlist",
      icon: "ri-heart-3-line",
      text: "Favourite"
    },
    {
      path: "/user_app/MyOrder",
      icon: "ri-drinks-2-line",
      text: "My Orders"
    },
    {
      path: "/user_app/Cart",
      icon: "ri-shopping-cart-line",
      text: "Cart"
    },
    {
      path: "/user_app/Profile",
      icon: userData && userData.customer_id ? "ri-user-3-fill" : "ri-user-3-line",
      text: "Profile"
    }
  ];

  return (
    <>
      <div className={`sidebar ${isOpen ? "show" : ""}`}>
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
          <div className=" ">
            <span className="ms-3 pt-4    ">
              {userData?.name
                ? `Hello, ${toTitleCase(getFirstName(userData.name))}`
                : "Hello, User"}
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
        <ul className="nav navbar-nav pe-0">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="nav-link active d-flex align-items-center justify-content-between"
                to={link.path}
              >
                <div className="d-flex align-items-center">
                  <span className="dz-icon icon-sm">
                    <i className={`${link.icon} fs-3`}></i>
                  </span>
                  <span className="">{link.text}</span>
                </div>
                {link.hasVegToggle && (
                  <div className="veg-toggle">
                    <div
                      className={`toggle-switch ${isVegOnly ? "active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleVegNonVeg();
                      }}
                    >
                      <div className="toggle-label">
                        <span className={`non-veg ${!isVegOnly ? "active" : ""}`}>
                          <i className="ri-checkbox-blank-circle-fill text-danger me-1"></i>
                          Non-Veg
                        </span>
                        <span className={`veg ${isVegOnly ? "active" : ""}`}>
                          <i className="ri-checkbox-blank-circle-fill text-success me-1"></i>
                          Veg
                        </span>
                      </div>
                      <div className="toggle-button"></div>
                    </div>
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
        <div className="sidebar-bottom">
          <div className="sidebar-logo text-center">
          <Link to="/">
            <img
              src={logo}
              alt="logo"
              className="me-2"
              width="30"
              height="30"
            />
            
            <span className="text-dark mb-0 mt-1 fw-bolder">MenuMitra</span>
            </Link>
          </div>
          <div className="text-center mt-2">
            <div className="gray-text  ">Powered by </div>
            <div className="gray-text  ">Shekru Labs India Pvt. Ltd.</div>
            <div className="gray-text  ">v1.1</div>
          </div>
        </div>
      </div>
      <div
        className={`dark-overlay ${isOpen ? "active" : ""}`}
        onClick={toggleSidebar}
      ></div>
    </>
  );
};

export default Sidebar;
