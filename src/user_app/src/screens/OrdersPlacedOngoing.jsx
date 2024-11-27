import React, { useState, useEffect , useRef} from 'react';
import config from "../component/config";
import { Link } from 'react-router-dom';

// Define TimeRemaining component
const TimeRemaining = ({ orderId, completedTimers = new Set() }) => {
  const [timeLeft, setTimeLeft] = useState(90);
  const [isExpired, setIsExpired] = useState(false);
  const timerKey = `timer_${orderId}`;

  useEffect(() => {
    const startTime = localStorage.getItem(timerKey);
    if (!startTime) {
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
      You can cancel the order within <span className="fw-semibold">{timeLeft}</span> seconds
    </div>
  );
};

// Define CircularCountdown component
const CircularCountdown = ({
  orderId,
  setOngoingOrPlacedOrders,
  order,
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

    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const currentCustomerId =
        userData?.customer_id || localStorage.getItem("customer_id");
      const restaurantId = order.restaurant_id;

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
      setOngoingOrPlacedOrders({ placed: [], ongoing: [] });
    }

    window.showToast("success", "Your order has moved to ongoing orders!");
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

// Define OrderCard component
const OrderCard = ({
  order,
  status,
  setOngoingOrPlacedOrders,
  completedTimers = new Set(),
  setCompletedTimers = () => {},
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleCompleteOrder = async () => {
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
          }),
        }
      );

      const data = await response.json();

      if (data.st === 1) {
        window.showToast("success", data.msg);

        setOngoingOrPlacedOrders((prevOrders) => {
          const ongoing = Array.isArray(prevOrders.ongoing) ? prevOrders.ongoing : [];
          const placed = Array.isArray(prevOrders.placed) ? prevOrders.placed : [];

          const updatedOngoing = ongoing.filter(
            (o) => o.order_id !== order.order_id
          );

          return {
            placed: placed,
            ongoing: updatedOngoing,
          };
        });
      } else {
        window.showToast("error", data.msg || "Failed to complete the order.");
      }
    } catch (error) {
      window.showToast("error", "An error occurred. Please try again later.");
    }
  };

  const handleConfirmCancel = async () => {
    try {
      const response = await fetch(`${config.apiDomain}/user_api/cancle_order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurant_id: order.restaurant_id,
          order_id: order.order_id,
          note: cancelReason,
        }),
      });

      const data = await response.json();

      if (data.st === 1) {
        window.showToast("success", data.msg);
        setShowCancelModal(false);

        setOngoingOrPlacedOrders((prevOrders) => {
          const ongoing = Array.isArray(prevOrders.ongoing) ? prevOrders.ongoing : [];
          const placed = Array.isArray(prevOrders.placed) ? prevOrders.placed : [];

          const updatedPlaced = placed.filter(
            (o) => o.order_id !== order.order_id
          );

          return {
            placed: updatedPlaced,
            ongoing: ongoing,
          };
        });
      } else {
        window.showToast("error", data.msg || "Failed to cancel the order.");
      }
    } catch (error) {
      window.showToast("error", "An error occurred. Please try again later.");
    }
  };

  const handleOrderClick = (orderNumber) => {
    // Navigation or other logic without console.log
  };

  return (
    <div className="container pt-0 px-0">
      <Link to={`/user_app/TrackOrder/${order.order_number}`}>
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
              <span className="gray-text font_size_12">{order.time?.split(":").slice(0,2).join(":")+" "+ order.time?.slice(-2)}

              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-8 text-start">
              <div className="restaurant">
                <i className="fa-solid fa-store pe-2"></i>
                <span className="fw-medium font_size_14">
                  {order.restaurant_name.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="col-4 text-end">
              <i className="fa-solid fa-location-dot ps-2 pe-1 font_size_12 gray-text"></i>
              <span className="font_size_12 gray-text">
                {order.table_number}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="menu-info">
                <i className="fa-solid fa-bowl-rice pe-2 gray-text"></i>
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

        {/* <div className="card-footer bg-transparent border-top-0 pt-0 px-3">
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
                    setOngoingOrPlacedOrders={setOngoingOrPlacedOrders}
                    order={order}
                  />
                </div>

                {!completedTimers.has(order.order_id) &&
                  localStorage.getItem(`timer_${order.order_id}`) && (
                    <button
                      className="btn btn-sm btn-outline-danger rounded-pill px-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelClick();
                      }}
                    >
                      Cancel Order
                    </button>
                  )}
              </div>
            </div>
          )}

          {status === "ongoing" && (
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-sm btn-outline-success rounded-pill px-4"
                onClick={handleCompleteOrder}
              >
                Complete Order
              </button>
            </div>
          )}
        </div> */}
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
                    onClick={handleConfirmCancel}
                  >
                    Confirm Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </Link>
    </div>
  );
};

function OrdersPlacedOngoing() {
  const [orders, setOrders] = useState({ placed: [], ongoing: [] });
  const [completedTimers, setCompletedTimers] = useState(new Set());
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const fetchData = async () => {
    // Check if we have required data before making the API call
    if (!userData?.customer_id || !userData?.restaurantId) {
      setOrders({ placed: [], ongoing: [] });
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(
        `${config.apiDomain}/user_api/get_ongoing_or_placed_order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: userData.customer_id,
            restaurant_id: userData.restaurantId,
          }),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      // Handle all non-200 responses silently
      if (!response.ok) {
        setOrders({ placed: [], ongoing: [] });
        return;
      }

      const data = await response.json();

      // Check if data exists and has the expected structure
      if (data?.st === 1 && Array.isArray(data.data)) {
        const ordersData = data.data;
        setOrders({
          placed: ordersData.filter(order => order.status === 'placed'),
          ongoing: ordersData.filter(order => order.status === 'ongoing')
        });
      } else {
        // Handle empty or invalid data structure silently
        setOrders({ placed: [], ongoing: [] });
      }
    } catch (error) {
      // Handle all errors silently (including abort errors)
      if (error.name !== 'AbortError') {
        setOrders({ placed: [], ongoing: [] });
      }
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      await fetchData();
    };

    loadData();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      {orders.placed.length > 0 && (
        <div>
          <i className="ri-file-list-3-line pe-2 font_size_14"></i>
          <span className="font_size_14 fw-medium">Placed Orders</span>

          {orders.placed.map((order, index) => (
            <OrderCard
              key={`placed-${order.order_id}-${index}`}
              order={order}
              status="placed"
              setOngoingOrPlacedOrders={setOrders}
              completedTimers={completedTimers}
              setCompletedTimers={setCompletedTimers}
            />
          ))}
        </div>
      )}

      {orders.ongoing.length > 0 && (
        <div>
          <i className="fa-solid fa-clock pe-2 font_size_14 text-warning"></i>
          <span className="font_size_14 fw-medium">Ongoing Orders</span>
          {orders.ongoing.map((order, index) => (
            <OrderCard
              key={`ongoing-${order.order_id}-${index}`}
              order={order}
              status="ongoing"
              setOngoingOrPlacedOrders={setOrders}
              completedTimers={completedTimers}
              setCompletedTimers={setCompletedTimers}
            />
          ))}
        </div>
      )}

      {/* {orders.placed.length === 0 && orders.ongoing.length === 0 && (
          <div className="text-center mt-4">
            <p>No orders found</p>
          </div>
        )} */}
    </div>
  );
}

export default OrdersPlacedOngoing;