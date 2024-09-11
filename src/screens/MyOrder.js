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
  const { restaurantId } = useRestaurantId();
  console.log("MyOrder component received new restaurant ID:", restaurantId);
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
        const response = await fetch(
          "https://menumitra.com/user_api/get_order_list",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              restaurant_id: restaurantId, // Change this line
              order_status: activeTab === "ongoing" ? "Ongoing" : "Completed",
              customer_id: customerId,
            }),
          }
        );
        console.log(restaurantId);
        console.log(customerId);
        if (response.ok) {
          const data = await response.json();
          if (data.st === 1 && data.lists) {
            setOrders(data.lists);
          } else {
            console.error("Invalid data format:", data);
          }
        } else {
          console.error("Network response was not ok.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false); // Set loading to false after API call
      }
    };

    if (customerId && restaurantId) {
      // Add restaurantId check
      fetchOrders();
    }
  }, [activeTab, customerId, restaurantId]);

  return (
    <div className="page-wrapper">
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <Link to="/Profile" className="back-btn dz-icon icon-fill icon-sm">
              <i className="ri-arrow-left-line"></i>
            </Link>
          </div>
          <div className="mid-content">
            <h5 className="title">My Order</h5>
          </div>
          <div className="right-content">
            <Link
              to={`/HomeScreen/${347279}`}
              className="dz-icon icon-sm icon-fill"
            >
              <i className="ri-home-2-line"></i>
            </Link>
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
                // User is authenticated, render order tabs
                <div className="default-tab style-2">
                  <div className="dz-tabs">
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
                      <OrdersTab orders={orders} type="Completed" />
                    </div>
                  </div>
                </div>
              ) : (
                // User is not authenticated, render sign-in button
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
  const filteredOrders = orders.filter(
    (order) => order.order_status.toLowerCase() === type.toLowerCase()
  );
  const navigate = useNavigate();

  const calculateOldPrice = (totalBill) => {
    // Calculate the old price as 10% more than the total bill
    return (parseFloat(totalBill) * 1.1).toFixed(2);
  };

  return (
    <div className="row g-1">
      {filteredOrders.map((order) => (
        <div key={order.order_number} className="card mb-3">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-6">
                <h5 className="card-title mb-1">{order.order_number}</h5>
              </div>
              <div className="col-6 text-end">
                <span className="card-text text-muted mb-0">
                  {order.date_time}
                </span>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-3">
                <p className="mb-0 fs-6">
                  <i className="ri-store-2-line pe-2"></i>
                  {order.restaurant_name}
                </p>
              </div>
              <div className="col-4 text-start" style={{ color: "#a5a5a5" }}>
                <p className="mb-0 fs-7">
                  <i className="ri-bowl-line pe-2"></i>
                  {order.menu_count === 0
                    ? "No onging orders"
                    : order.menu_count}
                </p>
              </div>
              <div
                className="col-4"
                style={{ position: "absolute", right: "-10px" }}
              >
                <div className="price-wrapper">
                  <h6 className="current-price fs-3">₹{order.total_bill}</h6>
                  <span className="old-price">
                    ₹{calculateOldPrice(order.total_bill)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrder;
