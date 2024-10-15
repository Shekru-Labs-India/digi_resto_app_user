import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SigninButton from "../constants/SigninButton";
import { useRestaurantId } from "../context/RestaurantIdContext";
import Bottom from "../component/bottom";
import "../assets/css/custom.css";
import "../assets/css/Tab.css";
import OrderGif from "./OrderGif";
import LoaderGif from "./LoaderGIF";

const MyOrder = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize state from local storage
    return localStorage.getItem("isDarkMode") === "true";
  }); // State for theme
  const { restaurantName } = useRestaurantId();
  const isLoggedIn = !!localStorage.getItem("userData");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { restaurantId, restaurantCode } = useRestaurantId();
  console.log("MyOrder component received new restaurant ID:", restaurantId);
  console.log(
    "MyOrder component received new restaurant Code:",
    restaurantCode
  );
  const userData = JSON.parse(localStorage.getItem("userData"));
  const customerId = userData ? userData.customer_id : null;
  const [loading, setLoading] = useState(true);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        console.log("Fetching orders...");
        const response = await fetch(
          "https://menumitra.com/user_api/get_order_list",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              restaurant_id: restaurantId,
              order_status: activeTab === "ongoing" ? "ongoing" : "completed",
              customer_id: customerId,
            }),
          }
        );
        console.log("API response status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("API response data:", data);
          if (data.st === 1 && data.lists) {
            setOrders(data.lists); // Ensure orders are being set correctly
            console.log("Fetched Orders:", data.lists); // Log the fetched orders
          } else {
            console.error("Invalid data format:", data);
            setOrders([]); // Set orders to empty if data format is incorrect
          }
        } else {
          console.error("Network response was not ok.");
          setOrders([]); // Set orders to empty if network response is not ok
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]); // Set orders to empty if there's an error
      } finally {
        setLoading(false); // Set loading to false after API call
        console.log("Loading state set to false");
      }
    };

    if (customerId && restaurantId) {
      fetchOrders();
    } else {
      console.log("Missing customerId or restaurantId");
      setLoading(false); // Set loading to false if customerId or restaurantId is missing
    }
  }, [activeTab, customerId, restaurantId]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle the sidebar state
  };

  const getFirstName = (name) => {
    if (!name) return "User"; // Return "User" if name is undefined or null
    const words = name.split(" ");
    return words[0]; // Return the first word
  };

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    localStorage.setItem("isDarkMode", newIsDarkMode);
  };

  useEffect(() => {
    // Apply the theme class based on the current state
    if (isDarkMode) {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
    }
  }, [isDarkMode]); // Depend on isDarkMode to re-apply on state change

  const toTitleCase = (text) => {
    if (!text) return "";
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="page-wrapper">
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className={`page-wrapper ${sidebarOpen ? "sidebar-open" : ""}`}>
            <header className="header header-fixed pt-2">
              <div className="header-content d-flex justify-content-between">
                <div className="left-content">
                  <Link
                    to="/Profile"
                    className="back-btn dz-icon  icon-sm"
                    onClick={() => navigate(-1)}
                  >
                    <i className="ri-arrow-left-line fs-3"></i>
                  </Link>
                </div>
                <div className="mid-content">
                  <span className="custom_font_size_bold me-3 title">
                    My Order
                    {orders.length > 0 && (
                      <span className="gray-text small-number">
                        {" "}
                        ({orders.length})
                      </span>
                    )}{" "}
                  </span>
                </div>
                <div className="right-content gap-1">
                  <div className="menu-toggler" onClick={toggleSidebar}>
                    {isLoggedIn ? (
                      <i className="ri-menu-line fs-1"></i>
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
              className={`dark-overlay ${
                sidebarOpen ? "dark-overlay active" : ""
              }`}
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
              <div className="sidebar-bottom"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="page-content space-top p-b70">
        <div className="container">
          {loading ? (
            <div id="preloader">
              <div className="loader">
                {/* <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div> */}
                <LoaderGif />
              </div>
            </div>
          ) : (
            <>
              {userData ? (
                <div className="default-tab style-2 pb-5 mb-3">
                  <div className="dz-tabs mb-5 pb-5">
                    <ul className="nav nav-tabs" role="tablist">
                      <li
                        className={`nav-item ${
                          activeTab === "ongoing" ? "active" : ""
                        }`}
                      >
                        <button
                          className={`nav-link custom_font_size_bold  ${
                            activeTab === "ongoing" ? "active" : ""
                          }`}
                          onClick={() => handleTabChange("ongoing")}
                        >
                          <i class="ri-timer-line pe-2"></i>
                          Ongoing
                        </button>
                      </li>
                      <li
                        className={`nav-item ${
                          activeTab === "completed" ? "active" : ""
                        }`}
                      >
                        <button
                          className={`nav-link custom_font_size_bold   ${
                            activeTab === "completed" ? "active" : ""
                          }`}
                          onClick={() => handleTabChange("completed")}
                        >
                          <i className="ri-checkbox-circle-line pe-2"></i>
                          Completed
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div className="tab-content">
                    <div
                      className={`tab-pane fade ${
                        activeTab === "ongoing" ? "show active" : ""
                      }`}
                      id="home"
                      role="tabpanel"
                    >
                      <OrdersTab orders={orders} type="ongoing" />
                    </div>
                    <div
                      className={`tab-pane fade ${
                        activeTab === "completed" ? "show active" : ""
                      }`}
                      id="profile"
                      role="tabpanel"
                    >
                      <OrdersTab orders={orders} type="completed" />
                    </div>
                  </div>
                </div>
              ) : (
                <SigninButton />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

const OrdersTab = ({ orders, type }) => {
  const navigate = useNavigate();
  const [checkedItems, setCheckedItems] = useState({});
  const [expandAll, setExpandAll] = useState(false);

  useEffect(() => {
    // Reset checkedItems when orders or type changes
    setCheckedItems({});
    setExpandAll(false);
  }, [orders, type]);

  const toggleChecked = (date) => {
    setCheckedItems((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const handleOrderClick = (orderNumber) => {
    navigate(`/TrackOrder/${orderNumber}`);
  };

  const toggleExpandAll = () => {
    const newExpandAll = !expandAll;
    setExpandAll(newExpandAll);
    const newCheckedItems = {};
    Object.keys(orders).forEach((date) => {
      newCheckedItems[`${date}-${type}`] = newExpandAll;
    });
    setCheckedItems(newCheckedItems);
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const [date, time] = dateTimeString.split(" ");
    if (!time || !date) return dateTimeString;
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes} ${date}`;
  };

  return (
    <div className="row g-1">
      {Object.keys(orders).length > 0 && (
        <div className="d-flex justify-content-end my-1 py-0 ps-0 pe-3">
          <div
            className="d-flex align-items-center cursor-pointer icon-border py-0"
            onClick={toggleExpandAll}
            role="button"
            aria-label={expandAll ? "Collapse All" : "Expand All"}
          >
            <span className="icon-circle">
              <i
                className={`ri-arrow-down-s-line arrow-icon ${
                  expandAll ? "rotated" : "rotated-1"
                }`}
              ></i>
            </span>
          </div>
        </div>
      )}
      {Object.keys(orders).length === 0 ? (
        <div
          className="d-flex justify-content-center align-items-center flex-column"
          style={{ height: "80vh" }}
        >
          <p className="custom_font_size_bold fw-semibold gray-text">
            You haven't placed any {type} orders yet.
          </p>
          <Link to="/Menu" className="mt-2 custom_font_size_bold fw-semibold">
            Explore our menus
          </Link>
        </div>
      ) : (
        Object.entries(orders).map(([date, dateOrders]) => (
          <div className="tab mt-0" key={`${date}-${type}`}>
            <input
              type="checkbox"
              id={`chck${date}-${type}`}
              checked={checkedItems[`${date}-${type}`] || false}
              onChange={() => toggleChecked(`${date}-${type}`)}
            />
            <label className="tab-label pt-1 pb-0" htmlFor={`chck${date}-${type}`}>
              <span>{date}</span>
              <span className="d-flex align-items-center">
                <span className="gray-text pe-2 small-number">
                  {dateOrders.length}
                </span>
                <span className="icon-circle">
                  <i
                    className={`ri-arrow-down-s-line arrow-icon ${
                      checkedItems[`${date}-${type}`] ? "rotated" : "rotated-1"
                    }`}
                  ></i>
                </span>
              </span>
            </label>
            <div className="tab-content">
              {dateOrders.map((order) => (
                <div className="custom-card my-2" key={order.order_number}>
                  <div
                    className="card-body"
                    onClick={() => handleOrderClick(order.order_number)}
                  >
                    <div className="row align-items-center">
                      <div className="col-4">
                        <span className="card-title mb-1 custom_font_size_bold">
                          {order.order_number}
                        </span>
                      </div>
                      <div className="col-8 text-end">
                        <span className="card-text gray-text mb-0 custom_font_size_bold">
                          {order.date_time}
                        </span>
                      </div>
                    </div>
                    <div className="order-details-row">
                      <div className="restaurant-info">
                        <i className="ri-store-2-line pe-2 custom_font_size_bold"></i>
                        <span className="restaurant-name custom_font_size_bold">
                          {order.restaurant_name.toUpperCase()}
                        </span>
                        <span className="table-number custom_font_size_bold gray-text">
                          <i className="ri-user-location-line ps-2 pe-1 custom_font_size_bold"></i>
                          {order.table_number}
                        </span>
                      </div>
                      <div className="menu-info">
                        <i className="ri-bowl-line pe-2 gray-text"></i>
                        <span className="gray-text">
                          {order.menu_count === 0
                            ? "No orders"
                            : `${order.menu_count} Menu`}
                        </span>
                      </div>
                      <div className="price-info">
                        <span className="text-info custom_font_size_bold">
                          ₹{order.grand_total}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
      <Bottom></Bottom>
    </div>
  );
};

export default MyOrder;
