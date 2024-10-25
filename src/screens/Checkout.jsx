import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Bottom from "../component/bottom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import "../assets/css/custom.css";
import OrderGif from "../assets/gif/cooking.gif";
import { ThemeContext } from "../context/ThemeContext.js"; // Adjust the import path as needed
import Header from "../components/Header";
import HotelNameAndTable from "../components/HotelNameAndTable";
import NearbyArea from "../component/NearbyArea";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize state from local storage
    return localStorage.getItem("isDarkMode") === "true";
  }); // State for theme
  const { restaurantName } = useRestaurantId();
  const isLoggedIn = !!localStorage.getItem("userData");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { restaurantId } = useRestaurantId();
  console.log("Restaurant ID:", restaurantId);
  // const { isDarkMode } = useContext(ThemeContext);
  const { clearCart } = useCart();

  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [serviceCharges, setServiceCharges] = useState(0);
  const [serviceChargesPercent, setServiceChargesPercent] = useState(0);
  const [gstPercent, setGstPercent] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [notes, setNotes] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [showNotePopup, setShowNotePopup] = useState(false); // State to show/hide note popup
  const [orderCount, setOrderCount] = useState(0);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const customerId = userData ? userData.customer_id : null;
  const tableNumber = userData ? userData.tableNumber : null; // Retrieve table_number
  console.log("Customer ID:", customerId);
  console.log("Table Number:", tableNumber); // Log the table number
  const [restaurantCode, setRestaurantCode] = useState(
    () => localStorage.getItem("restaurantCode") || ""
  );
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [showOngoingOrderPopup, setShowOngoingOrderPopup] = useState(false);
  const [ongoingOrderId, setOngoingOrderId] = useState(null);

  const getCartId = () => {
    const cartId = localStorage.getItem("cartId");
    console.log("Cart ID:", cartId);
    return cartId ? parseInt(cartId, 10) : null;
  };

  const fetchCartDetails = async () => {
    const cartId = getCartId();
    console.log("Fetching cart details with:", {
      cartId,
      customerId,
      restaurantId,
    });

    if (!cartId || !customerId || !restaurantId) {
      console.log(
        "Missing cart, customer, or restaurant data. Navigating to home."
      );
      return;
    }

    try {
      const response = await fetch(
        "https://menumitra.com/user_api/get_cart_detail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: cartId,
            customer_id: customerId,
            restaurant_id: restaurantId,
          }),
        }
      );

      const data = await response.json();
      console.log("API Data:", data);

      if (response.ok) {
        const updatedOrderItems = data.order_items.map((item) => ({
          ...item,
          oldPrice: Math.floor(item.price * 1.1),
        }));
        setCartItems(updatedOrderItems);
        setTotal(parseFloat(data.total_bill) || 0);
        setDiscount(parseFloat(data.discount_amount) || 0);
        setTax(parseFloat(data.gst_amount) || 0);
        setGrandTotal(parseFloat(data.grand_total) || 0);
        setServiceCharges(parseFloat(data.service_charges_amount) || 0);
        setServiceChargesPercent(parseFloat(data.service_charges_percent) || 0);
        setGstPercent(parseFloat(data.gst_percent) || 0);
        setDiscountPercent(parseFloat(data.discount_percent) || 0);
        const uniqueMenuIds = new Set(
          data.order_items.map((item) => item.menu_id)
        );
        setOrderCount(uniqueMenuIds.size);
      } else {
        console.error("Failed to fetch cart details:", data.msg);
        navigate(`/${restaurantCode}/${tableNumber || ""}`);
      }
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  };

  useEffect(() => {
    const storedRestaurantCode = localStorage.getItem("restaurantCode");
    if (storedRestaurantCode) {
      setRestaurantCode(storedRestaurantCode);
    }
    fetchCartDetails();
  }, [restaurantId, customerId]);

  const handleNotesChange = (e) => {
    const value = e.target.value;
    const regex = /^[a-zA-Z0-9\s.]*$/;

    if (value.length < 3 || value.length > 200) {
      setValidationMessage("Notes must be between 3 and 200 characters.");
    } else if (!regex.test(value)) {
      setValidationMessage("Special characters are not allowed.");
    } else {
      setValidationMessage("");
    }

    setNotes(value);
  };

  const handleSubmitOrder = async () => {
    try {
      // Check for ongoing orders first
      const ongoingResponse = await fetch(
        "https://menumitra.com/user_api/get_order_list",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            
            customer_id: customerId,
          }),
        }
      );

      const ongoingData = await ongoingResponse.json();
      if (
        ongoingResponse.ok &&
        ongoingData.st === 1 &&
        ongoingData.lists &&
        ongoingData.lists.ongoing
      ) {
        // There's an ongoing order
        const ongoingOrders = Object.values(ongoingData.lists.ongoing).flat();
        if (ongoingOrders.length > 0) {
          setOngoingOrderId(ongoingOrders[0].order_number);
          setShowOngoingOrderPopup(true);
          return;
        }
      }

      // If no ongoing orders, proceed with order submission
      await proceedWithOrderSubmission();
    } catch (error) {
      console.error(
        "Error checking ongoing orders or submitting order:",
        error
      );
      setErrorMessage("An error occurred. Please try again.");
      setShowErrorPopup(true);
    }
  };

  const proceedWithOrderSubmission = async () => {
    const orderItems = cartItems.map((item) => ({
      menu_id: item.menu_id,
      quantity: item.quantity,
    }));

    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    const orderData = {
      customer_id: customerId,
      restaurant_id: restaurantId,
      cart_id: getCartId(),
      note: notes,
      order_items: orderItems,
      table_number: tableNumber,
      order_time: formattedTime,
    };

    try {
      const response = await fetch(
        "https://menumitra.com/user_api/create_order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      const responseData = await response.json();

      if (response.ok && responseData.st === 1) {
        setShowPopup(true);
        clearCart();
      } else if (responseData.st === 2) {
        setErrorMessage(responseData.msg);
        setShowErrorPopup(true);
      } else {
        throw new Error(responseData.msg || "Failed to submit order");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      setErrorMessage(`Failed to submit order: ${error.message}`);
      setShowErrorPopup(true);
    }
  };

  const handleCancelOrders = async () => {
    try {
      const response = await fetch(
        "https://menumitra.com/user_api/cancle_order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: ongoingOrderId,
            restaurant_id: restaurantId,
            note: notes,
          }),
        }
      );
  
      const data = await response.json();
      if (response.ok && data.st === 1) {
        clearCart();
        setShowOngoingOrderPopup(false);
        navigate("/MyOrder", { state: { activeTab: "placed" } });
      } else {
        throw new Error(data.msg || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling orders:", error);
      setErrorMessage("Failed to cancel orders. Please try again.");
      setShowErrorPopup(true);
    }
  };
  
  const handleCompleteAndProceed = async () => {
    try {
      // First, complete the ongoing order
      const completeResponse = await fetch(
        "https://menumitra.com/user_api/complete_order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: ongoingOrderId,
            customer_id: customerId,
            restaurant_id: restaurantId,
          }),
        }
      );
  
      const completeData = await completeResponse.json();
      if (completeResponse.ok && completeData.st === 1) {
        // Then, change the status to completed
        const changeStatusResponse = await fetch(
          "https://menumitra.com/user_api/change_status_to_ongoing",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              restaurant_id: restaurantId,
              order_id: ongoingOrderId,
            }),
          }
        );
  
        const changeStatusData = await changeStatusResponse.json();
        if (changeStatusResponse.ok && changeStatusData.st === 1) {
          setShowOngoingOrderPopup(false);
          navigate("/MyOrder", { state: { activeTab: "completed" } });
        } else {
          throw new Error(changeStatusData.msg || "Failed to change order status");
        }
      } else {
        throw new Error(completeData.msg || "Failed to complete order");
      }
    } catch (error) {
      console.error("Error completing order:", error);
      setErrorMessage("Failed to complete order. Please try again.");
      setShowErrorPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate("/MyOrder", { state: { selectedTab: "placed" } });
  };

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
    <div className="page-wrapper full-height">
      <Header title="Checkout" count={cartItems.length} />

      <main className="page-content space-top mb-5 pb-3">
        <div className="container py-0 my-0">
          <HotelNameAndTable
            restaurantName={restaurantName}
            tableNumber={userData?.tableNumber || "1"}
          />
        </div>

        {showOngoingOrderPopup && (
          <div className="popup-overlay">
            <div className="popup-content ">
              <h3>Ongoing Order Detected</h3>
              <p>You have an ongoing order. What would you like to do?</p>
              <button
                className="btn btn-danger rounded-pill text-white me-2 my-3"
                onClick={handleCancelOrders}
              >
                Cancel Order
              </button>
              <button
                className="btn btn-success rounded-pill text-white"
                onClick={handleCompleteAndProceed}
              >
                Complete Order
              </button>
            </div>
          </div>
        )}

        {showErrorPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h3>Error</h3>
              <p>{errorMessage}</p>
              <button
                className="btn btn-primary rounded-pill text-white"
                onClick={() => setShowErrorPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="m-3">
          <div className="dz-flex-box">
            <ul className="dz-list-group">
              <div className="mb-2">
                <label className="    pb-2 ps-2" htmlFor="notes">
                  Additional Notes:
                </label>
                <textarea
                  className="form-control dz-textarea   pb-0"
                  name="notes"
                  id="notes"
                  rows="4"
                  placeholder="Write Here"
                  value={notes}
                  onChange={handleNotesChange}
                  style={{ height: "60px" }}
                ></textarea>
                {/* {validationMessage && (
                  <div className="text-danger mb-3 ms-1 mt-2">
                    {validationMessage}
                  </div>
                )} */}
              </div>
              <ul className="hints ">
                <li className="  gray-text">
                  &bull; Make mutton thali a bit less spicy
                </li>
                <li className="gray-text">
                  &bull; Make my panipuri more spicy
                </li>
              </ul>
            </ul>

            <div className="dz-flex-box mt-2">
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <>
                    <Link
                      to={{
                        pathname: `/ProductDetails/${item.menu_id}`,
                      }}
                      state={{ menu_cat_id: item.menu_cat_id }}
                    >
                      <div className="card rounded-3 my-1">
                        <div className="card-body py-2 rounded-3 px-0">
                          <div className="row" key={index}>
                            <div className="row">
                              <div className="col-7 pe-0 ">
                                <span className="mb-0 fs-6 fw-medium ps-2">
                                  {item.menu_name}
                                </span>
                              </div>
                              <div className="col-4 p-0 text-end">
                                <span className="ms-0 me-2 text-info fs-5 fw-semibold">
                                  ₹{item.price}
                                </span>

                                <span className="gray-text fs-6 fw-normal text-decoration-line-through">
                                  ₹ {item.oldPrice || item.price}
                                </span>
                              </div>
                              <div className="col-1     text-end px-0">
                                <span>x {item.quantity}</span>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-8">
                                <div className="ps-2">
                                  <span className="text-success font_size_12">
                                    <i className="ri-restaurant-line me-2"></i>
                                    {item.menu_cat_name}
                                  </span>
                                </div>
                              </div>
                              <div className="col-4 text-end px-0">
                                <span className="ps-2 text-success font_size_12">
                                  {item.offer || "No "}% Off
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </>
                ))
              ) : (
                <div className="   ">No items in the cart.</div>
              )}
            </div>
            <div className="card mx-auto rounded-3 mt-2">
              <div className="row px-2 py-1">
                <div className="col-12 px-2">
                  <div className="d-flex justify-content-between align-items-center py-1">
                    <span className="ps-2 font_size_14 fw-semibold">Total</span>
                    <span className="pe-2 font_size_14 fw-semibold">
                      ₹{parseFloat(total).toFixed(2)}
                    </span>
                  </div>
                  <hr className="me-0 p-0 m-0 text-primary" />
                </div>
                <div className="col-12 pt-0 px-2">
                  <div className="d-flex justify-content-between align-items-center py-0">
                    <span className="ps-2 font_size_14 pt-1 gray-text">
                      Service Charges{" "}
                      <span className="gray-text small-number">
                        ({serviceChargesPercent}%)
                      </span>
                    </span>
                    <span className="pe-2 font_size_14 gray-text">
                      ₹{parseFloat(serviceCharges).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="col-12 mb-0 py-1 px-2">
                  <div className="d-flex justify-content-between align-items-center py-0">
                    <span className="ps-2 font_size_14 gray-text">
                      GST{" "}
                      <span className="gray-text small-number">
                        ({gstPercent}%)
                      </span>
                    </span>
                    <span className="pe-2 font_size_14 gray-text text-start">
                      ₹{parseFloat(tax).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="col-12 mb-0 pt-0 pb-1 px-2">
                  <div className="d-flex justify-content-between align-items-center py-0 pb-2">
                    <span className="ps-2 font_size_14 gray-text">
                      Discount{" "}
                      <span className="gray-text small-number">
                        (-{discountPercent}%)
                      </span>
                    </span>
                    <span className="pe-2 font_size_14 gray-text">
                      -₹{parseFloat(discount).toFixed(2)}
                    </span>
                  </div>
                  <hr className="me-0 p-0 m-0 text-primary" />
                </div>

                <div className="col-12 px-2">
                  <div className="d-flex justify-content-between align-items-center py-1 fw-medium pb-0 mb-0">
                    <span className="ps-2 fs-6 fw-semibold">Grand Total</span>
                    <span className="pe-2 fs-5 fw-semibold">
                      ₹{parseFloat(grandTotal).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Link
                to="#"
                className="btn btn-color rounded-pill     text-white"
                onClick={handleSubmitOrder}
              >
                Place Order
                <span className="small-number gray-text ps-1">
                  ({orderCount} Items)
                </span>
              </Link>
            </div>
            <div className="d-flex align-items-center justify-content-center mt-3">
              <Link
                to="/Menu"
                className="btn btn-outline-primary  rounded-pill  px-3"
              >
                Order More
              </Link>
            </div>
          </div>
        </div>

        <div className="container py-0">
          <NearbyArea />
        </div>
      </main>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="circle">
              <img src={OrderGif} alt="Order Success" className="popup-gif" />
            </div>

            <span className="text-dark     my-5">
              Order placed successfully
            </span>
            <p className="gray-text  ">
              You have successfully made payment and placed your order.
            </p>
            <button
              className="btn btn-color rounded-pill     text-white"
              onClick={closePopup}
            >
              View Order
            </button>
          </div>
        </div>
      )}

      <Bottom />
    </div>
  );
};

export default Checkout;
