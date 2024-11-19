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

import config from "../component/config";
import { usePopup } from "../context/PopupContext";

const MyOrder = () => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("isDarkMode") === "true";
  });
  // const [orders, setOrders] = useState({ placed: [], ongoing: [] });
  const { restaurantName, restaurantId } = useRestaurantId();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("completed");
  const [orders, setOrders] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [customerType, setCustomerType] = useState(null);
  const [ongoingOrPlacedOrders, setOngoingOrPlacedOrders] = useState({
    placed: [],
    ongoing: [],
  });
  const [completedTimers, setCompletedTimers] = useState(new Set());
  const { showLoginPopup } = usePopup();

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
    const fetchOngoingOrPlacedOrder = async () => {
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem("userData"));
        const currentCustomerId =
          userData?.customer_id || localStorage.getItem("customer_id");

        if (!currentCustomerId || !restaurantId) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${config.apiDomain}/user_api/get_ongoing_or_placed_order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customer_id: currentCustomerId,
              restaurant_id: restaurantId,
            }),
          }
        );

        const data = await response.json();

        if (response.ok && data.st === 1) {
          const orders = data.data || [];
          if (orders.length > 0) {
            const status = orders[0]?.status;
            const orderList =
              status === "placed"
                ? { placed: orders, ongoing: [] }
                : { placed: [], ongoing: orders };
            setOngoingOrPlacedOrders(orderList);
          } else {
            setOngoingOrPlacedOrders({ placed: [], ongoing: [] });
          }
        } else {
          setOngoingOrPlacedOrders({ placed: [], ongoing: [] });
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOngoingOrPlacedOrders({ placed: [], ongoing: [] });
      } finally {
        setLoading(false);
      }
    };

    const userData = JSON.parse(localStorage.getItem("userData"));
    const currentCustomerId =
      userData?.customer_id || localStorage.getItem("customer_id");

    if (!currentCustomerId) {
      setLoading(false);
      return;
    }

    if (customerId && restaurantId) {
      fetchOngoingOrPlacedOrder();
    }
  }, [customerId, restaurantId]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem("userData"));
        const currentCustomerId =
          userData?.customer_id || localStorage.getItem("customer_id");
        const currentCustomerType =
          userData?.customer_type || localStorage.getItem("customer_type");

        if (!currentCustomerId || !restaurantId) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${config.apiDomain}/user_api/get_completed_and_cancle_order_list`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              restaurant_id: restaurantId,
              order_status: activeTab === "cancelled" ? "cancle" : activeTab,
              customer_id: currentCustomerId,
              customer_type: currentCustomerType,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();

          if (data.st === 1 && data.lists) {
            const mappedData = {};
            if (activeTab === "cancelled" && data.lists.cancle) {
              mappedData.cancelled = data.lists.cancle;
            } else if (data.lists[activeTab]) {
              mappedData[activeTab] = data.lists[activeTab];
            }
            setOrders(mappedData);
          } else {
            setOrders({});
          }
        } else {
          setOrders({});
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders({});
      } finally {
        setLoading(false);
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
      return 0;
    }
  };

  return (
    <div className="page-wrapper">
      <Header
        title="My Order"
        count={
          orders &&
          (activeTab === "cancelled" && orders.cancle
            ? Array.isArray(orders.cancle)
              ? orders.cancle.length
              : 0
            : calculateOrderCount(orders))
        }
      />

      <main className="page-content space-top mb-5 pb-3">
        <div className="container px-1">
          {ongoingOrPlacedOrders.placed.map((order, index) => (
            <OrderCard
              key={`${order.order_id}-${index}`}
              order={order}
              status="placed"
              setOngoingOrPlacedOrders={setOngoingOrPlacedOrders}
              completedTimers={completedTimers}
              setCompletedTimers={setCompletedTimers}
              setActiveTab={setActiveTab}
            />
          ))}

          {ongoingOrPlacedOrders.ongoing.map((order, index) => (
            <OrderCard
              key={`${order.order_id}-${index}`} // Combine order_id with index to make it unique
              order={order}
              status="ongoing"
              setOngoingOrPlacedOrders={setOngoingOrPlacedOrders}
            />
          ))}

          <div className="nav nav-tabs nav-fill" role="tablist">
            {["completed", "cancelled"].map((tab) => (
              <>
                <div
                  key={tab}
                  className={`nav-link px-0 ${
                    activeTab === tab ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "completed" && (
                    <i className="ri-checkbox-circle-line text-success me-2 fs-5"></i>
                  )}
                  {tab === "cancelled" && (
                    <i className="ri-close-circle-line text-danger me-2 fs-5"></i>
                  )}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </div>
              </>
            ))}
          </div>
          <Bottom />
        </div>

        <div className="container">
          {loading ? (
            <div id="">
              <div className="loader">{/* <LoaderGif /> */}</div>
            </div>
          ) : !customerId ? (
            <div
              className="container overflow-hidden d-flex justify-content-center align-items-center"
              style={{ height: "80vh" }}
            >
              <div className="m-b20 dz-flex-box text-center">
                <div className="dz-cart-about">
                  <div className="">
                    <button
                      className="btn btn-outline-primary rounded-pill"
                      onClick={showLoginPopup}
                    >
                      <i className="ri-lock-2-line me-2 fs-3"></i> Login
                    </button>
                  </div>
                  <span className="mt-4">
                    Access fresh flavors with a quick login.
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {customerId ? (
                <div className="default-tab style-2 pb-5 mb-3">
                  <div className="tab-content">
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
                        setOrders={setOrders}
                        setActiveTab={setActiveTab}
                      />
                    </div>
                    <div
                      className={`tab-pane fade ${
                        activeTab === "cancelled" ? "show active" : ""
                      }`}
                      id="cancelled"
                      role="tabpanel"
                    >
                      <OrdersTab
                        orders={orders[activeTab]}
                        type={activeTab}
                        activeTab={activeTab}
                        setOrders={setOrders} // Make sure this prop is passed
                        setActiveTab={setActiveTab}
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

export const OrderCard = ({
  order,
  status,
  setOngoingOrPlacedOrders,
  completedTimers = new Set(),
  setActiveTab,
  setCompletedTimers = () => {},
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const navigate = useNavigate();

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };
  const handleCompleteClick = () => {
    setShowCompleteModal(true);
  };
  const handleCompleteOrder = async () => {
    if (!paymentMethod) {
      window.showToast("error", "Please select a payment method.");
      return;
    }

    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/complete_order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: order.order_id,
            restaurant_id: order.restaurant_id,
            payment_method: paymentMethod, // Added payment method
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.st === 1) {
        window.showToast("success", data.msg);

        // Update the state to remove the order from "ongoing"
        setOngoingOrPlacedOrders((prevOrders) => {
          const updatedOngoing = prevOrders.ongoing.filter(
            (o) => o.order_id !== order.order_id
          );

          return {
            placed: prevOrders.placed,
            ongoing: updatedOngoing,
          };
        });

        setShowCompleteModal(false); // Close the modal
      } else {
        window.showToast("error", data.msg || "Failed to complete the order.");
      }
    } catch (error) {
      console.error("Error completing order:", error);
      window.showToast("error", "An error occurred. Please try again later.");
    }
  };

  const handleConfirmCancel = async () => {
    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/cancle_order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: order.restaurant_id,
            order_id: order.order_id,
            note: cancelReason,
          }),
        }
      );

      console.log("Response:", response); // Log the full response

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response Data:", data); // Log the parsed response data

      if (data.st === 1) {
        window.showToast("success", data.msg);
        setShowCancelModal(false);

        // Update the state to remove the canceled order
        setOngoingOrPlacedOrders((prevOrders) => ({
          placed: prevOrders.placed.filter(
            (o) => o.order_id !== order.order_id
          ),
          ongoing: prevOrders.ongoing, // Keep ongoing orders unchanged
        }));
        setActiveTab("cancelled");
      } else {
        window.showToast("error", data.msg || "Failed to cancel the order.");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      window.showToast("error", "An error occurred. Please try again later.");
    }
  };

  const handleOrderClick = (orderNumber) => {
    navigate(`/user_app/TrackOrder/${orderNumber}`);

    
  };



  const handleUpiPayment = async () => {

    const userData = JSON.parse(localStorage.getItem("userData"));
    const restaurantName = userData?.restaurantName;
    const customerName = userData?.name;
    
    

    const orderId = order.order_id;

    setPaymentMethod("UPI");

    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/complete_order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: order.order_id,
            restaurant_id: order.restaurant_id,
            payment_method: "UPI", // Added payment method
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.st === 1) {
        window.showToast("success", data.msg);

        // Update the state to remove the order from "ongoing"
        setOngoingOrPlacedOrders((prevOrders) => {
          const updatedOngoing = prevOrders.ongoing.filter(
            (o) => o.order_id !== order.order_id
          );

          return {
            placed: prevOrders.placed,
            ongoing: updatedOngoing,
          };
        });

        setShowCompleteModal(false); // Close the modal
      } else {
        window.showToast("error", data.msg || "Failed to complete the order.");
      }
    } catch (error) {
      console.error("Error completing order:", error);
      window.showToast("error", "An error occurred. Please try again later.");
    }

  
      // Wait 1 second before opening UPI deep link
      setTimeout(() => {
        const upiUrl = `upi://pay?pa=your-vpa@bank&pn=${restaurantName}&mc=1234&tid=${order.order_id}&tr=${order.order_id}&tn=${customerName} is paying Rs. ${order.grand_total} to ${order.restaurant_name} for order no. ${order.order_number}&am=${order.grand_total}&cu=INR`;
        window.location.href = upiUrl;
    }, 1000);
  };

  return (
    <div className="container pt-0">
      <div className="custom-card my-2 rounded-4 shadow-sm">
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
              <span className="gray-text font_size_12">{order.time}</span>
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
          {status === "placed" && (
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
                      setCompletedTimers(
                        (prev) => new Set([...prev, order.order_id])
                      );
                    }}
                    setOngoingOrPlacedOrders={setOngoingOrPlacedOrders}
                    order={order}
                  />
                </div>

                <button
                  className="btn btn-sm btn-outline-danger rounded-pill px-4 text-"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelClick();
                  }}
                >
                  Cancel Order
                </button>
              </div>
            </div>
          )}

          {status === "ongoing" && (
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-sm btn-outline-success rounded-pill px-4"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCompleteClick();
                }}
              >
                Complete Order
              </button>
            </div>
          )}
        </div>
        {showCompleteModal && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="col-6 text-start">
                    <div className="modal-title font_size_16 fw-medium">
                      Complete Order
                    </div>
                  </div>

                  <div className="col-6 text-end">
                    <div className="d-flex justify-content-end">
                      <span
                        className="m-2 font_size_16"
                        onClick={() => setShowCompleteModal(false)}
                        aria-label="Close"
                      >
                        <i className="ri-close-line text-muted"></i>
                      </span>
                    </div>
                  </div>
                </div>
                {/* <div className="modal-body">
                  <p>Are you sure you want to complete this order?</p>
                  <div className="d-flex justify-content-around">
                    {" "}
               
                    <button
                      type="button"
                      className={`border rounded-pill px-5 font_size_14 text-center ${
                        paymentMethod === "UPI"
                          ? "bg-info text-white"
                          : "border border-info"
                      }`}
                      onClick={() => setPaymentMethod("UPI")}
                    >
                      UPI
                    </button>
                    <button
                      type="button"
                      className={`border rounded-pill px-5 font_size_14 text-center ${
                        paymentMethod === "Card"
                          ? "bg-info text-white"
                          : "border border-info"
                      }`}
                      onClick={() => setPaymentMethod("Card")}
                    >
                      Card
                    </button>
                    <button
                      type="button"
                      className={`border rounded-pill px-5 py-2 font_size_14 text-center ${
                        paymentMethod === "Cash"
                          ? "bg-info text-white"
                          : "border border-info"
                      }`}
                      onClick={() => setPaymentMethod("Cash")}
                    >
                      Cash
                    </button>
                  </div>
                </div> */}

                <div className="modal-body">
                  <p className="text-center">
                    Are you sure you want to complete this order?
                  </p>
                  <div className="d-flex justify-content-center">
                    <button className="btn btn-info" onClick={() => {
                      setPaymentMethod("UPI");
                      handleUpiPayment();
                      
                    
                    }}>
                      Pay
                      <span className="fs-4 mx-1">₹{order.grand_total}</span> via
                      <img
                        className="text-white ms-1"
                        src="https://img.icons8.com/ios-filled/50/FFFFFF/bhim-upi.png"
                        width={45}
                      />
                    </button>
                  </div>
                  {/* <hr className="my-4" /> */}
                </div>

                <div className="text-center">
                  <div>or make payment via:</div>
                </div>
                <div className="d-flex justify-content-center pt-2 mb-4">
                  <button
                    type="button"
                    class={`px-2 bg-white mb-2 me-4 rounded-pill py-1 gray-text ${
                      paymentMethod === "Card"
                        ? "bg-success text-white"
                        : "border border-muted"
                    }`}
                    onClick={() => {
                      setPaymentMethod("Card");
                      handleCompleteOrder();
                    }}
                  >
                    <i class="ri-bank-card-line me-1"></i>
                    Card
                  </button>
                  <button
                    type="button"
                    class={`px-2 bg-white mb-2 me-2 rounded-pill py-1 gray-text ${
                      paymentMethod === "Cash"
                        ? "bg-success text-white"
                        : "border border-muted"
                    }`}
                    onClick={() => {
                      setPaymentMethod("Cash");
                      handleCompleteOrder();
                    }}
                  >
                    <i class="ri-wallet-3-fill me-1"></i>
                    Cash
                  </button>
                </div>

                {/* <hr className="my-4" />
                <div className="modal-body d-flex justify-content-around px-0 pt-2 pb-3">
                  <button
                    type="button"
                    className="btn btn-outline-dark rounded-pill font_size_14"
                    onClick={() => setShowCompleteModal(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-success rounded-pill"
                    onClick={handleCompleteOrder}
                  >
                    <i className="ri-checkbox-circle-line text-white me-2 fs-5"></i>
                    Confirm Complete
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        )}

        {showCancelModal && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="col-6 text-start">
                    <div className="modal-title font_size_16 fw-medium">
                      Cancel Order
                    </div>
                  </div>
                  <div class="col-6 text-end">
                    <button
                      class="btn p-0 fs-3 text-muted"
                      onClick={() => setShowCancelModal(false)}
                    >
                      <i class="ri-close-line text-muted"></i>
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCancelModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="cancelReason" className="form-label">
                      <span className="text-danger">*</span>
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
                <div className="modal-body">
                  <span className="text-danger">Reason for cancellation:</span>
                  <div className="form-check mt-2">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="delay"
                      name="cancelReason"
                      value="Delivery Delays: Waiting too long, I lost patience."
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="delay">
                      <span className="fw-semibold">Delivery Delays:</span>

                      <div className="">
                        Waiting too long, I lost patience.
                      </div>
                    </label>
                  </div>
                  <div className="form-check mt-3">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="mind"
                      name="cancelReason"
                      value="Change of Mind: Don't want it anymore, found something better."
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="mind">
                      <span className="fw-semibold">Change of Mind:</span>
                      <div className="">
                        Don't want it anymore, found something better.
                      </div>
                    </label>
                  </div>
                  <div className="form-check mt-2">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="price"
                      name="cancelReason"
                      value="Pricing Concerns: Extra charges made it too expensive."
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="price">
                      <span className="fw-semibold">Pricing Concerns:</span>
                      <div className="">
                        Extra charges made it too expensive.
                      </div>
                    </label>
                  </div>
                  <div className="form-check mt-2">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="error"
                      name="cancelReason"
                      value="Order Errors: Wrong customization or item, not worth it."
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="error">
                      <span className="fw-semibold">Order Errors:</span>
                      <div className="">
                        Wrong customization or item, not worth it.
                      </div>
                    </label>
                  </div>
                  <div className="form-check mt-2">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="quality"
                      name="cancelReason"
                      value="Poor Reviews/Quality Doubts: Doubts about quality, I canceled quickly."
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="quality">
                      <span className="fw-semibold">Poor Reviews/Quality Doubts:</span>
                      <div className="">
                        Doubts about quality, I canceled quickly.
                      </div>
                    </label>
                  </div>
                </div>
                <hr className="my-4" />
                <div className="d-flex justify-content-between pb-3 px-4">
                  <div className="col-4">
                    <button
                      type="button"
                      className="btn btn-outline-dark rounded-pill font_size_14"
                      onClick={() => setShowCancelModal(false)}
                    >
                      Close
                    </button>
                  </div>
                  <div className="col-6 text-end text-nowrap">
                    <button
                      type="button"
                      className="btn btn-danger  rounded-pill"
                      onClick={handleConfirmCancel}
                    >
                      <i class="ri-close-circle-line text-white me-2 fs-5"></i>
                      Confirm Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
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

  // Add this new useEffect for periodic API check
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Check all orders in completedTimers
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [completedTimers]);

  const handleCancelClick = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelReason("");
    setShowCancelModal(true);
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
          <p>No menus available</p>
          <Link
            to="/user_app/Menu"
            className="btn btn-outline-primary rounded-pill px-3 mt-3"
          >
            <i className="ri-add-circle-line me-1 fs-4"></i> Order More
          </Link>
        </div>
      );
    }

    return (
      <>
        {Object.entries(orders).map(([date, dateOrders]) => {
          const activeOrders = dateOrders.filter(
            (order) => !completedTimers.has(order.order_id)
          );

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
                        checkedItems[`${date}-${type}`]
                          ? "rotated"
                          : "rotated-1"
                      }`}
                    ></i>
                  </span>
                </span>
              </label>
              <div className="tab-content">
                <>
                  {activeOrders.map((order) => (
                    <div
                      className="custom-card my-2 rounded-4 shadow-sm"
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
                              {order.time}
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
                                  ? "No Menus"
                                  : `${order.menu_count} Menu`}
                              </span>
                            </div>
                          </div>
                          <div className="col-6 text-end">
                            <span className="text-info font_size_14 fw-semibold">
                              ₹{order.grand_total}
                            </span>
                            <span className="text-decoration-line-through ms-2 gray-text font_size_12 fw-normal">
                              ₹
                              {(parseFloat(order.grand_total) * 1.1).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="card-footer bg-transparent border-top-0 pt-0 px-3">
                        {activeTab === "completed" && (
                          <div className="container py-0">
                            <div className="row">
                              <div className="col-10 ps-0">
                                <div className="text-start text-nowrap">
                                  <span className="text-success">
                                    <i className="ri-checkbox-circle-line me-1"></i>
                                    Completed
                                  </span>
                                </div>
                              </div>
                              <div className="col-2 pe-0 font_size_14 text-end">
                                {order.payment_method && (
                                  <div className="border border-success rounded-pill py-0 px-2 font_size_14 text-center text-nowrap text-success">
                                    {order.payment_method}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {activeTab === "cancelled" && (
                          <div className="text-center">
                            <span className="text-danger">
                              <i className="ri-close-circle-line me-1"></i>
                              Order cancelled
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
      </>
    );
  };

  return (
    <>
      <div className="row g-1">
        {!orders || Object.keys(orders).length === 0
          ? (type === "completed" || type === "cancelled") && (
              <div
                className="d-flex justify-content-center align-items-center flex-column"
                style={{ height: "80vh" }}
              >
                <p className="fw-semibold gray-text">
                  You haven't placed any {type} orders yet.
                </p>
                <Link
                  to="/user_app/Menu"
                  className="btn btn-outline-primary rounded-pill px-3 mt-2"
                >
                  <i className="ri-add-circle-line me-1 fs-4"></i> Order More
                </Link>
              </div>
            )
          : renderOrders()}
      </div>
      <Bottom />
    </>
  );
};

export const TimeRemaining = ({ orderId, completedTimers = new Set() }) => {
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
    const elapsed =
      now - parseInt(startTime || new Date().getTime().toString());
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

export const CircularCountdown = ({
  orderId,
  onComplete,
  setOngoingOrPlacedOrders,
  order,
  setActiveTab,
}) => {
  const [timeLeft, setTimeLeft] = useState(90);
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef(null);
  const timerKey = `timer_${orderId}`;

  useEffect(() => {
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
  }, [orderId]);

  const handleTimerComplete = async () => {
    setTimeLeft(0);
    setIsCompleted(true);
    localStorage.removeItem(timerKey);

    // Call the API to fetch updated orders
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const currentCustomerId =
        userData?.customer_id || localStorage.getItem("customer_id");
      const restaurantId = order.restaurant_id; // Use the restaurant ID from the order object

      if (!currentCustomerId || !restaurantId) return;

      const response = await fetch(
        `${config.apiDomain}/user_api/get_ongoing_or_placed_order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: currentCustomerId,
            restaurant_id: restaurantId,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.st === 1) {
        const orders = data.data || [];
        if (orders.length > 0) {
          const status = orders[0]?.status;
          const orderList =
            status === "placed"
              ? { placed: orders, ongoing: [] }
              : { placed: [], ongoing: orders };
          setOngoingOrPlacedOrders(orderList);
        } else {
          setOngoingOrPlacedOrders({ placed: [], ongoing: [] });
        }
      } else {
        setOngoingOrPlacedOrders({ placed: [], ongoing: [] });
      }
    } catch (error) {
      console.error("Error fetching orders after timer complete:", error);
    }

    // Call the onComplete function
    onComplete();
    // window.showToast("success", "Your order has moved to ongoing orders!");
  };

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
