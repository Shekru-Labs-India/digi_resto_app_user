import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SigninButton from "../constants/SigninButton";
import { useRestaurantId } from "../context/RestaurantIdContext";
import Bottom from "../component/bottom";
import "../assets/css/custom.css";

const MyOrder = () => {
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
              order_status: activeTab === "ongoing" ? "Ongoing" : "Completed",
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

  return (
    <div className="page-wrapper">
      <header className="header header-fixed style-3">
        <div className="header-content">
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
            <h5 className="title">My Order</h5>
          </div>
        </div>
      </header>

      <main className="page-content space-top p-b70">
        <div className="container">
          {loading ? (
            <div id="preloader">
              <div className="loader">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
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
                          className={`nav-link ${
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
                          className={`nav-link ${
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

  const calculateOldPrice = (totalBill) => {
    // Calculate the old price as 10% more than the total bill
    return (parseFloat(totalBill) * 1.1).toFixed(2);
  };

  const handleOrderClick = (orderNumber) => {
    // Navigate to the TrackOrder component with the order_number
    navigate(`/TrackOrder/${orderNumber}`);
  };

  const formatDateTime = (dateTime) => {
    const [date, time, period] = dateTime.split(" ");
    return `${time} ${period} ${date}`;
  };

  return (
    <div className="row g-1">
      {orders.length === 0 ? (
        <div
          className="d-flex justify-content-center align-items-center flex-column"
          style={{ height: "80vh" }}
        >
          <p className="fs-6 fw-semibold gray-text">
            You haven't placed any orders yet.
          </p>
          <Link
            to="/Menu"
            className="mt-2 fs-6 fw-semibold"
            style={{ color: "#4f74fd" }}
          >
            Explore our menus
          </Link>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.order_number}
            className="card mb-3"
            onClick={() => handleOrderClick(order.order_number)} // Add click handler
            style={{ cursor: "pointer" }} // Add pointer cursor for better UX
          >
            <div className="card-body" style={{ height: "90px" }}>
              <div className="row align-items-center">
                <div className="col-4">
                  <h5 className="card-title mb-1">{order.order_number}</h5>
                </div>
                <div className="col-8 text-end">
                  <span className="card-text gray-text mb-0">
                    {formatDateTime(order.date_time)}
                  </span>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-6">
                  <p className="mb-0 fs-6 ">
                    <i className="ri-store-2-line pe-2"></i>
                    {order.restaurant_name}
                    <i className="ri-user-location-line ps-2 pe-1"></i>
                    {order.table_number}
                  </p>
                </div>
                <div className="col-4 text-start p-0 gray-text">
                  <p className="mb-0 fs-6">
                    <i className="ri-bowl-line pe-2"></i>
                    {order.menu_count === 0
                      ? "No ongoing orders"
                      : order.menu_count}{" "}
                    Menu
                  </p>
                </div>
                <div className="col-2 p-0">
                  <div className="price-wrapper">
                    <p className="mb-2 fs-4 fw-medium text-end">
                      <span className="text-info ">₹{order.total_bill}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
      <Bottom />
    </div>
  );
};

export default MyOrder;