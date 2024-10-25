import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SigninButton from "../constants/SigninButton";
import { useRestaurantId } from "../context/RestaurantIdContext";
import Bottom from "../component/bottom";
import "../assets/css/custom.css";
import "../assets/css/Tab.css";
import OrderGif from "./OrderGif";
import LoaderGif from "./LoaderGIF";
import Header from "../components/Header";
import CountdownTimer from "../components/CountdownTimer";
import CircularCountdownTimer from "../components/CircularCountdownTimer";
import CircularCountdown from "../components/CircularCountdown"; // Update this import

const MyOrder = () => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("isDarkMode") === "true";
  });
  const { restaurantName } = useRestaurantId();
  const isLoggedIn = !!localStorage.getItem("userData");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [orders, setOrders] = useState({});
  const navigate = useNavigate();
  const { restaurantId, restaurantCode } = useRestaurantId();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const customerId = userData ? userData.customer_id : null;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set the active tab based on the navigation state, if provided
    if (location.state && location.state.selectedTab) {
      setActiveTab(location.state.selectedTab);
    }
  }, [location]);

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
              order_status: activeTab,
              customer_id: customerId,
            }),
          }
        );
        console.log("API response status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("API response data:", data);
          if (data.st === 1 && data.lists) {
            setOrders(data.lists);
            console.log("Fetched Orders:", data.lists);
          } else {
            console.error("Invalid data format:", data);
            setOrders({});
          }
        } else {
          console.error("Network response was not ok.");
          setOrders({});
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders({});
      } finally {
        setLoading(false);
        console.log("Loading state set to false");
      }
    };

    if (customerId && restaurantId) {
      fetchOrders();
    } else {
      console.log("Missing customerId or restaurantId");
      setLoading(false);
    }
  }, [activeTab, customerId, restaurantId]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getFirstName = (name) => {
    if (!name) return "User";
    const words = name.split(" ");
    return words[0];
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

  const toTitleCase = (text) => {
    if (!text) return "";
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="page-wrapper">
      <Header 
        title="My Order" 
        count={Object.values(orders).reduce((acc, curr) => acc + Object.values(curr).flat().length, 0)}
      />

      <main className="page-content space-top mb-5 pb-3">
      <div className="container mt-3">
        <div className="nav nav-tabs nav-fill" role="tablist">
          {["placed", "ongoing", "completed", "cancel"].map((tab) => (
            <button
              key={tab}
              className={`nav-link ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

        <div className="container">
          {loading ? (
            <div id="preloader">
              <div className="loader">
                <LoaderGif />
              </div>
            </div>
          ) : (
            <>
              {userData ? (
                <div className="default-tab style-2 pb-5 mb-3">
                  <div className="tab-content">
                    <div
                      className={`tab-pane fade ${
                        activeTab === "ongoing" ? "show active" : ""
                      }`}
                      id="home"
                      role="tabpanel"
                    >
                      <OrdersTab orders={orders[activeTab]} type={activeTab} activeTab={activeTab} />
                    </div>
                    <div
                      className={`tab-pane fade ${
                        activeTab === "completed" ? "show active" : ""
                      }`}
                      id="profile"
                      role="tabpanel"
                    >
                      <OrdersTab orders={orders[activeTab]} type={activeTab} activeTab={activeTab} />
                    </div>
                    <div
                      className={`tab-pane fade ${
                        activeTab === "placed" ? "show active" : ""
                      }`}
                      id="placed"
                      role="tabpanel"
                    >
                      <OrdersTab orders={orders[activeTab]} type={activeTab} activeTab={activeTab} />
                    </div>
                    <div
                      className={`tab-pane fade ${
                        activeTab === "cancel" ? "show active" : ""
                      }`}
                      id="cancel"
                      role="tabpanel"
                    >
                      <OrdersTab orders={orders[activeTab]} type={activeTab} activeTab={activeTab} />
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

const OrdersTab = ({ orders, type, activeTab }) => {
  const navigate = useNavigate();
  const [checkedItems, setCheckedItems] = useState({});
  const [expandAll, setExpandAll] = useState(false);

  useEffect(() => {
    console.log("Orders received:", orders);
    console.log("Type:", type);
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
    if (orders) {
      Object.keys(orders).forEach((date) => {
        newCheckedItems[`${date}-${type}`] = newExpandAll;
      });
    }
    setCheckedItems(newCheckedItems);
  };

  const renderOrders = () => {
    if (!orders) return <p>No orders available</p>;

    return (
      <>
        {Object.entries(orders).map(([date, dateOrders]) => (
          <div className="tab mt-0" key={`${date}-${type}`}>
            <input
              type="checkbox"
              id={`chck${date}-${type}`}
              checked={checkedItems[`${date}-${type}`] || false}
              onChange={() => toggleChecked(`${date}-${type}`)}
            />
            <label className="tab-label" htmlFor={`chck${date}-${type}`}>
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
              <>
                {dateOrders.map((order) => (
                  <div
                    className="custom-card my-2 rounded-3 shadow-sm"
                    key={order.order_number}
                  >
                    <div
                      className="card-body py-2"
                      onClick={() => handleOrderClick(order.order_number)}
                    >
                      <div className="row align-items-center">
                        <div className="col-4">
                          <span className="fw-semibold fs-6">
                            <i className="ri-hashtag pe-2"></i>
                            {order.order_number}
                          </span>
                        </div>
                        <div className="col-8 text-end">
                          <span className="gray-text font_size_12">
                            {order.date_time}
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-8 text-start">
                          <div className="restaurant">
                            <i className="ri-store-2-line pe-2"></i>
                            <span className="fw-medium font_size_14">
                              {order.restaurant_name.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="col-4 text-end">
                          <i className="ri-user-location-line ps-2 pe-1 font_size_12 gray-text"></i>
                          <span className="font_size_12 gray-text">
                            {order.table_number}
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <div className="menu-info">
                            <i className="ri-bowl-line pe-2 gray-text"></i>
                            <span className="gray-text font_size_14">
                              {order.menu_count === 0
                                ? "No orders"
                                : `${order.menu_count} Menu`}
                            </span>
                          </div>
                        </div>
                        <div className="col-6 text-end">
                          <span className="text-info font_size_14 fw-semibold">
                            ₹{order.grand_total}
                          </span>
                          <span className="text-decoration-line-through ms-2 gray-text font_size_12 fw-normal">
                            ₹{(parseFloat(order.grand_total) * 1.1).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            </div>
          </div>
        ))}
        {activeTab === "placed" && (
          <div className="d-flex justify-content-center justify-content-center my-5">
            {/* <CountdownTimer initialSeconds={90} /> */}
            <CircularCountdownTimer />
            <CircularCountdown endDate={getEndDate()} />
          </div>
        )}
      </>
    );
  };

  const getEndDate = (orderDateTime) => {
    const orderDate = new Date(orderDateTime);
    const endDate = new Date(orderDate.getTime() + 90 * 60 * 1000); // 90 minutes from order time
    return endDate.toISOString();
  };

  return (
    <div className="row g-1">
      {orders && Object.keys(orders).length > 0 && (
        <div className="d-flex justify-content-end my-2 me-3">
          <div
            className="d-flex align-items-center cursor-pointer icon-border py-0"
            onClick={toggleExpandAll}
            role="button"
            aria-label={expandAll ? "Collapse All" : "Expand All"}
          >
            <span className="icon-circle">
              <i className={`ri-arrow-down-s-line arrow-icon ${
                expandAll ? "rotated" : "rotated-1"
              }`}></i>
            </span>
          </div>
        </div>
      )}
      {!orders || Object.keys(orders).length === 0 ? (
        <div className="d-flex justify-content-center align-items-center flex-column" style={{ height: "80vh" }}>
          <p className="fw-semibold gray-text">You haven't placed any {type} orders yet.</p>
          <Link to="/Menu" className="mt-2 fw-semibold">Explore our menus</Link>
        </div>
      ) : (
        renderOrders()
      )}
      <Bottom />
    </div>
  );
};

export default MyOrder;
