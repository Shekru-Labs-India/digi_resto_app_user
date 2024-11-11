import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SigninButton from "../constants/SigninButton";
import { useRestaurantId } from "../context/RestaurantIdContext";
import Bottom from "../component/bottom";
import "../assets/css/custom.css";
import "../assets/css/Tab.css";
import OrderGif from "./OrderGif";
// import LoaderGif from "./LoaderGIF";
import Header from "../components/Header";

import config from "../component/config"
const MyOrder = () => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("isDarkMode") === "true";
  });

  const { restaurantName, restaurantId } = useRestaurantId();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [orders, setOrders] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [customerType, setCustomerType] = useState(null);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const currentCustomerId =
      userData?.customer_id || localStorage.getItem("customer_id");
    const currentCustomerType =
      userData?.customer_type || localStorage.getItem("customer_type");

    setIsLoggedIn(!!currentCustomerId);
    setCustomerId(currentCustomerId);
    setCustomerType(currentCustomerType);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        console.log("Fetching orders...");

        const userData = JSON.parse(localStorage.getItem("userData"));
        const currentCustomerId =
          userData?.customer_id || localStorage.getItem("customer_id");
        const currentCustomerType =
          userData?.customer_type || localStorage.getItem("customer_type");

        if (!currentCustomerId || !restaurantId) {
          console.log("Missing customerId or restaurantId");
          setLoading(false);
          return;
        }

        const response = await fetch(
           `${config.apiDomain}/user_api/get_order_list`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              restaurant_id: restaurantId,
              order_status: activeTab === "canceled" ? "cancle" : activeTab, // Update this line
              customer_id: currentCustomerId,
              customer_type: currentCustomerType,
            }),
          }
        );
        console.log("API response status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("API response data:", data);
          if (data.st === 1 && data.lists) {
            // Handle the response data mapping
            const mappedData = {};
            if (activeTab === "canceled" && data.lists.cancle) {
              // Map 'cancle' to 'canceled' in the response
              mappedData.canceled = data.lists.cancle;
            } else {
              mappedData[activeTab] = data.lists[activeTab];
            }
            setOrders(mappedData);
            console.log("Fetched Orders:", mappedData);
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
    }
  }, [activeTab, customerId, restaurantId]);

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

  const calculateOrderCount = (orders) => {
    if (!orders) return 0;

    try {
      return Object.values(orders).reduce((acc, curr) => {
        if (!curr) return acc;

        // Handle canceled orders which might be under 'cancle' key
        if (curr.cancle) {
          return acc + (Array.isArray(curr.cancle) ? curr.cancle.length : 0);
        }

        // Handle regular orders
        if (Array.isArray(curr)) {
          return acc + curr.length;
        }
        if (typeof curr === "object") {
          return (
            acc +
            Object.values(curr).reduce((sum, val) => {
              return sum + (Array.isArray(val) ? val.length : 0);
            }, 0)
          );
        }
        return acc;
      }, 0);
    } catch (error) {
      console.error("Error calculating order count:", error);
      return 0;
    }
  };

  return (
    <div className="page-wrapper">
      <Header
        title="My Order"
        count={
          orders &&
          (activeTab === "canceled" && orders.cancle
            ? Array.isArray(orders.cancle)
              ? orders.cancle.length
              : 0
            : calculateOrderCount(orders))
        }
      />

      <main className="page-content space-top mb-5 pb-3">
        <div className="container px-1">
          <div className="nav nav-tabs nav-fill" role="tablist">
            {["placed", "ongoing", "completed", "canceled"].map((tab) => (
              <button
                key={tab}
                className={`nav-link px-0 ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="container">
          {loading ? (
            <div id="">
              <div className="loader">{/* <LoaderGif /> */}</div>
            </div>
          ) : (
            <>
              {customerId ? (
                <div className="default-tab style-2 pb-5 mb-3">
                  <div className="tab-content">
                    <div
                      className={`tab-pane fade ${
                        activeTab === "ongoing" ? "show active" : ""
                      }`}
                      id="ongoing"
                      role="tabpanel"
                    >
                      <OrdersTab
                        orders={orders[activeTab]}
                        type={activeTab}
                        activeTab={activeTab}
                        setOrders={setOrders} // Make sure this prop is passed
                        setActiveTab={setActiveTab} // Also pass this for tab navigation
                      />
                    </div>
                    <div
                      className={`tab-pane fade ${
                        activeTab === "placed" ? "show active" : ""
                      }`}
                      id="placed"
                      role="tabpanel"
                    >
                      <OrdersTab
                        orders={orders[activeTab]}
                        type={activeTab}
                        activeTab={activeTab}
                        setOrders={setOrders} // Make sure this prop is passed
                        setActiveTab={setActiveTab} // Also pass this for tab navigation
                      />
                    </div>
                    <div
                      className={`tab-pane fade ${
                        activeTab === "completed" ? "show active" : ""
                      }`}
                      id="completed"
                      role="tabpanel"
                    >
                      <OrdersTab
                        orders={orders[activeTab]}
                        type={activeTab}
                        activeTab={activeTab}
                        setOrders={setOrders} // Make sure this prop is passed
                        setActiveTab={setActiveTab} // Also pass this for tab navigation
                      />
                    </div>
                    <div
                      className={`tab-pane fade ${
                        activeTab === "canceled" ? "show active" : ""
                      }`}
                      id="canceled"
                      role="tabpanel"
                    >
                      <OrdersTab
                        orders={orders[activeTab]}
                        type={activeTab}
                        activeTab={activeTab}
                        setOrders={setOrders} // Make sure this prop is passed
                        setActiveTab={setActiveTab} // Also pass this for tab navigation
                      />
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

const OrdersTab = ({ orders, type, activeTab, setOrders, setActiveTab }) => {
  const navigate = useNavigate();
  // const [activeTab, setActiveTab] = useState("ongoing");
  const [checkedItems, setCheckedItems] = useState({});
  const [expandAll, setExpandAll] = useState(false);
  const { restaurantId } = useRestaurantId();
  const [timeLeft, setTimeLeft] = useState(90);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    console.log("Orders received:", orders);
    console.log("Type:", type);

    if (orders && Object.keys(orders).length > 0) {
      // Get the first date (top-most order group)
      const firstDate = Object.keys(orders)[0];

      // Set only the first date group to be expanded
      setCheckedItems({
        [`${firstDate}-${type}`]: true,
      });
    } else {
      setCheckedItems({});
    }

    setExpandAll(false);
  }, [orders, type]);
  const [completedTimers, setCompletedTimers] = useState(new Set());
  const [showViewOngoingButton, setShowViewOngoingButton] = useState(false);

  const [completedOrders, setCompletedOrders] = useState(new Set());
  const [showOngoingButton, setShowOngoingButton] = useState(false);
  

  const handleOrderMore = (orderId) => {
    navigate("/user_app/Menu", {
      state: {
        existingOrderId: orderId,
        isAddingToOrder: true,
      },
    });
  };
  const toggleChecked = (date) => {
    setCheckedItems((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const handleOrderClick = (orderNumber) => {
    navigate(`/user_app/TrackOrder/${orderNumber}`);
  };

  const handleCompleteOrder = async (orderId) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    try {
      const response = await fetch(
         `${config.apiDomain}/user_api/complete_order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            order_id: orderId,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.st === 1) {
        // Update the local state to reflect the change
        setOrders((prevOrders) => {
          const updatedOrders = { ...prevOrders };
          const ongoingOrders = { ...updatedOrders.ongoing };
          const completedOrders = { ...updatedOrders.completed };

          // Find the order to move
          for (const date in ongoingOrders) {
            const orderIndex = ongoingOrders[date].findIndex(
              (order) => order.order_id === orderId
            );
            if (orderIndex !== -1) {
              const [movedOrder] = ongoingOrders[date].splice(orderIndex, 1);
              movedOrder.status = "completed";

              // Add to completed orders
              if (!completedOrders[date]) {
                completedOrders[date] = [];
              }
              completedOrders[date].push(movedOrder);

              // Remove date key if no orders left
              if (ongoingOrders[date].length === 0) {
                delete ongoingOrders[date];
              }

              break;
            }
          }

          return {
            ...updatedOrders,
            ongoing: ongoingOrders,
            completed: completedOrders,
          };
        });

        window.showToast("success", "Order has been completed successfully!");
        setActiveTab("completed");
      } else {
        throw new Error(data.msg || "Failed to complete order");
      }
    } catch (error) {
      console.error("Error completing order:", error);
      window.showToast("error", error.message || "Failed to complete order");
    }
  };

  const handleOrderStatusChange = async (orderId) => {
    try {
      const response = await fetch(
         `${config.apiDomain}/user_api/change_status_to_ongoing`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: orderId,
            restaurant_id: restaurantId,
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1) {
        localStorage.removeItem(`timer_${orderId}`);
        setCompletedTimers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(orderId);
          return newSet;
        });

        window.showToast("success", "Order moved to ongoing orders");
      }
    } catch (error) {
      console.error("Error changing order status:", error);
      window.showToast("error", "Failed to update order status");
    }
  };

  // Add this new useEffect for periodic API check
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Check all orders in completedTimers
      completedTimers.forEach((orderId) => {
        handleOrderStatusChange(orderId);
      });
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [completedTimers]);

  const handleCancelClick = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelReason("");
    setShowCancelModal(true);
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      window.showToast("error", "Please provide a reason for cancellation");
      return;
    }

    try {
      if (!selectedOrderId || !restaurantId) {
        console.error("Missing required data:", {
          selectedOrderId,
          restaurantId,
        });
        throw new Error("Missing required data for cancellation");
      }

      const userData = JSON.parse(localStorage.getItem("userData"));
      const response = await fetch(
         `${config.apiDomain}/user_api/cancle_order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            order_id: selectedOrderId.toString(),
            restaurant_id: restaurantId.toString(),
            note: cancelReason.trim(),
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1) {
        setShowCancelModal(false);
        setCancelReason("");
        setSelectedOrderId(null);

        window.showToast(
          "success",
          "Your order has been successfully canceled."
        );

        // Fetch updated order list
        const updatedResponse = await fetch(
           `${config.apiDomain}/user_api/get_order_list`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              restaurant_id: restaurantId,
              order_status: "canceled",
              customer_id: userData?.customer_id,
              customer_type: userData?.customer_type,
            }),
          }
        );

        if (updatedResponse.ok) {
          const result = await updatedResponse.json();
          if (result.st === 1) {
            setOrders(result.lists || {});
            setActiveTab("canceled");
          }
        }
      } else {
        throw new Error(data.msg || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      window.showToast(
        "error",
        error.message || "Failed to cancel order. Please try again."
      );
    }
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
  if (!orders || Object.keys(orders).length === 0) {
    return (
      <div className="text-center py-4">
        <p>No orders available</p>
        <Link to="/user_app/Menu" className="btn btn-outline-primary rounded-pill px-3 mt-3">
          Order More
        </Link>
      </div>
    );
  }

  return (
    <>
      {Object.entries(orders).map(([date, dateOrders]) => {
        // Filter out completed timers from dateOrders
        const activeOrders = dateOrders.filter(
          (order) => !completedTimers.has(order.order_id)
        );

        // Only render if there are active orders
        return activeOrders.length > 0 ? (
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
                  {activeOrders.length}
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
                {activeOrders.map((order) => (
                  <div
                    className="custom-card my-2 rounded-3 shadow-sm"
                    key={order.order_number}
                  >
                    <div
                      className="card-body py-2"
                      onClick={() => handleOrderClick(order.order_number)}
                    >
                      {/* Card body content remains the same */}
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
                          <i className="ri-map-pin-user-fill ps-2 pe-1 font_size_12 gray-text"></i>
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

                    <div className="card-footer bg-transparent border-top-0 pt-0 px-3">
                      {activeTab === "placed" && (
                        <div className="d-flex flex-column gap-2">
                          {!completedTimers.has(order.order_id) && (
                            <TimeRemaining
                              orderId={order.order_id}
                              completedTimers={completedTimers}
                            />
                          )}

                          <div className="d-flex justify-content-between align-items-center">
                            <div className="text-center">
                              <CircularCountdown
                                orderId={order.order_id}
                                onComplete={() => {
                                  handleOrderStatusChange(order.order_id);
                                  setCompletedTimers(
                                    (prev) => new Set([...prev, order.order_id])
                                  );
                                }}
                                setActiveTab={setActiveTab}
                              />
                            </div>

                            {!completedTimers.has(order.order_id) &&
                              localStorage.getItem(
                                `timer_${order.order_id}`
                              ) && (
                                <button
                                  className="btn btn-sm btn-danger rounded-pill px-4"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelClick(order.order_id);
                                  }}
                                >
                                  Cancel Order
                                </button>
                              )}
                          </div>
                        </div>
                      )}

                      {activeTab === "ongoing" && (
                        <div className="d-flex justify-content-between align-items-center">
                          <button
                            className="btn btn-sm btn-outline-primary rounded-pill px-4"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOrderMore(order.order_id);
                            }}
                          >
                            Order More
                          </button>
                          <button
                            className="btn btn-sm btn-success rounded-pill px-4"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompleteOrder(order.order_id);
                            }}
                          >
                            Complete Order
                          </button>
                        </div>
                      )}

                      {activeTab === "completed" && (
                        <div className="container py-0">
                          <div className="row">
                            <div className="col-11">
                              <div className="text-center">
                                <span className="text-success">
                                  <i className="ri-check-line me-1"></i>
                                  Order completed
                                </span>
                              </div>
                            </div>
                            <div className="col-1 pe-0 text-end">
                              {order.invoice_url ? (
                                <a
                                  href={order.invoice_url}
                                  download={`invoice_${order.order_number}.pdf`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="cursor-pointer text-decoration-none"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <i className="ri-download-2-line"></i>
                                </a>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "canceled" && (
                        <div className="text-center">
                          <span className="text-danger">
                            <i className="ri-close-circle-line me-1"></i>
                            Order canceled
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            </div>
          </div>
        ) : null;
      })}
      
      <div className="d-flex align-items-center justify-content-center mt-4 mb-4">
        <Link to="/user_app/Menu" className="btn btn-outline-primary rounded-pill px-3">
          Order More
        </Link>
      </div>
    </>
  );
};

  return (
    <>
      <div className="row g-1">
        {!orders || Object.keys(orders).length === 0 ? (
          <div className="d-flex justify-content-center align-items-center flex-column" style={{ height: "80vh" }}>
            <p className="fw-semibold gray-text">
              You haven't placed any {type} orders yet.
            </p>
            <Link to="/user_app/Menu" className="btn btn-outline-primary rounded-pill px-3 mt-2">
              Order More
            </Link>
          </div>
        ) : (
          renderOrders()
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Cancel Order</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCancelModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="cancelReason" className="form-label">
                      Please provide a reason for cancellation
                    </label>
                    <textarea
                      id="cancelReason"
                      className="form-control border border-primary"
                      rows="3"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Enter your reason here..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCancelModal(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleCancelOrder}
                  >
                    Confirm Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Bottom />
    </>
  );
};

const TimeRemaining = ({ orderId, completedTimers = new Set() }) => {
  const [timeLeft, setTimeLeft] = useState(90);
  const [isExpired, setIsExpired] = useState(false);
  const timerKey = `timer_${orderId}`;

  useEffect(() => {
    // Check if timer is already completed or expired in localStorage
    const startTime = localStorage.getItem(timerKey);
    if (!startTime) {
      // Set initial timer only if it doesn't exist
      localStorage.setItem(timerKey, new Date().getTime().toString());
    } else if (completedTimers?.has(orderId)) {
      setIsExpired(true);
      return;
    }

    const now = new Date().getTime();
    const elapsed = now - parseInt(startTime || new Date().getTime().toString());
    if (elapsed >= 90000) {
      setIsExpired(true);
      localStorage.removeItem(timerKey);
      return;
    }

    const calculateTimeLeft = () => {
      const start = parseInt(localStorage.getItem(timerKey));
      if (!start) {
        setIsExpired(true);
        return;
      }

      const now = new Date().getTime();
      const elapsed = now - start;
      const remaining = Math.max(90 - Math.floor(elapsed / 1000), 0);

      if (remaining === 0) {
        setIsExpired(true);
        localStorage.removeItem(timerKey);
        clearInterval(timer);
        return;
      }
      setTimeLeft(remaining);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [orderId, completedTimers, timerKey]);

  if (isExpired || timeLeft === 0) return null;
  return (
    <div className="text-muted font_size_14 text-center mb-2">
      You can cancel the order within{" "}
      <span className="fw-semibold">{timeLeft}</span> seconds
    </div>
  );
};

const CircularCountdown = ({ orderId, onComplete, setActiveTab }) => {
  const [timeLeft, setTimeLeft] = useState(90);
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef(null);
  const timerKey = `timer_${orderId}`;
  
  useEffect(() => {
    // Initialize timer if it doesn't exist
    const startTime = localStorage.getItem(timerKey);
    if (!startTime) {
      localStorage.setItem(timerKey, new Date().getTime().toString());
    }

    const now = new Date().getTime();
    const start = parseInt(localStorage.getItem(timerKey));
    const elapsed = now - start;

    if (elapsed >= 90000) {
      handleTimerComplete();
      return;
    }

    const calculateTimeLeft = () => {
      const start = parseInt(localStorage.getItem(timerKey));
      if (!start) {
        handleTimerComplete();
        return;
      }

      const now = new Date().getTime();
      const elapsed = now - start;
      const remaining = Math.max(90 - Math.floor(elapsed / 1000), 0);

      if (remaining <= 0) {
        clearInterval(timerRef.current);
        handleTimerComplete();
        return;
      }
      setTimeLeft(remaining);
    };

    calculateTimeLeft();
    timerRef.current = setInterval(calculateTimeLeft, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [orderId, onComplete]);

  const handleTimerComplete = () => {
    setTimeLeft(0);
    setIsCompleted(true);
    localStorage.removeItem(timerKey);
    onComplete();
    window.showToast("success", "Your order has moved to ongoing orders!");
    
    // Add a small delay before navigation to ensure toast is visible
    setTimeout(() => {
      setActiveTab("ongoing");
    }, 1000); // 1 second delay to show toast before navigation
  };
  if (isCompleted && timeLeft === 0) {
    return (
      <button
        className="btn btn-primary btn-sm rounded-pill px-3"
        onClick={() => setActiveTab("ongoing")}
      >
        View in Ongoing Orders
      </button>
    );
  }

  const percentage = (timeLeft / 90) * 100;

  return (
    <div className="circular-countdown">
      <svg viewBox="0 0 36 36" className="circular-timer">
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#eee"
          strokeWidth="3"
        />
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#2196f3"
          strokeWidth="3"
          strokeDasharray={`${percentage}, 100`}
        />
      </svg>
      <div className="timer-text-overlay">{timeLeft}s</div>
    </div>
  );
};

export default MyOrder;
