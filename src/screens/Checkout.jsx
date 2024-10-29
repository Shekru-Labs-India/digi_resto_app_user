import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Bottom from "../component/bottom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import "../assets/css/custom.css";
import OrderGif from "../assets/gif/cooking.gif";
import { ThemeContext } from "../context/ThemeContext.js"; // Adjust the import path as needed
import Header from "../components/Header";
import HotelNameAndTable from "../components/HotelNameAndTable";
import NearbyArea from "../component/NearbyArea";
import { useCart } from "../context/CartContext";
import { Toast } from "primereact/toast";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurantId, restaurantName } = useRestaurantId();
  const { clearCart } = useCart();
  const toast = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [customerType, setCustomerType] = useState(null);

  const [checkoutData, setCheckoutData] = useState(null);
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
  const [orderCount, setOrderCount] = useState(0);
  const [showOngoingOrderPopup, setShowOngoingOrderPopup] = useState(false);
  const [ongoingOrderId, setOngoingOrderId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize state from local storage
    return localStorage.getItem("isDarkMode") === "true";
  }); // State for theme

  const [sidebarOpen, setSidebarOpen] = useState(false);

  console.log("Restaurant ID:", restaurantId);
  // const { isDarkMode } = useContext(ThemeContext);

  const [isNotesFocused, setIsNotesFocused] = useState(false);
  const notesRef = useRef(null);
  const [showExistingOrderModal, setShowExistingOrderModal] = useState(false);
  const [existingOrderId, setExistingOrderId] = useState(null);

  // Use the hook here

  const handleNotesFocus = () => {
    setIsNotesFocused(true);
  };

  const userData = JSON.parse(localStorage.getItem("userData"));

  const tableNumber = userData ? userData.tableNumber : null; // Retrieve table_number
  console.log("Customer ID:", customerId);
  console.log("Table Number:", tableNumber); // Log the table number
  const [restaurantCode, setRestaurantCode] = useState(
    () => localStorage.getItem("restaurantCode") || ""
  );

  const handleNotesBlur = () => {
    setIsNotesFocused(false);
  };
  const getCartId = () => {
    const cartId = localStorage.getItem("cartId");
    console.log("Cart ID:", cartId);
    return cartId ? parseInt(cartId, 10) : null;
  };

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

  const fetchCartDetails = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const currentCustomerId =
      userData?.customer_id || localStorage.getItem("customer_id");
    const cartId = getCartId();

    console.log("Fetching cart details with:", {
      cartId,
      currentCustomerId,
      restaurantId,
    });

    if (!cartId || !currentCustomerId || !restaurantId) {
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
            customer_id: currentCustomerId,
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
      navigate(`/${restaurantCode}/${tableNumber || ""}`);
    }
  };

  useEffect(() => {
    const data = location.state?.checkoutData;
    if (data) {
      setCheckoutData(data);
      setCartItems(data.cartItems);
      setTotal(data.totalBill);
      setDiscount(data.discountAmount);
      setTax(data.gstAmount);
      setGrandTotal(data.grandTotal);
      setServiceCharges(data.serviceCharges);
      setServiceChargesPercent(data.serviceChargesPercent);
      setGstPercent(data.gstPercent);
      setDiscountPercent(data.discountPercent);
      setOrderCount(data.cartItems.length);
    } else {
      // Instead of navigating, set an error state
    }
  }, [location.state]);

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

  const checkForOngoingOrder = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const currentCustomerId =
        userData?.customer_id || localStorage.getItem("customer_id");
      const currentCustomerType =
        userData?.customer_type || localStorage.getItem("customer_type");

      const response = await fetch(
        "https://menumitra.com/user_api/get_order_list",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            order_status: "ongoing",
            customer_id: currentCustomerId,
            customer_type: currentCustomerType,
          }),
        }
      );

      const data = await response.json();
      console.log("Ongoing order check response:", data);

      if (data.st === 1 && data.lists?.ongoing) {
        // Get the first date key from ongoing orders
        const dates = Object.keys(data.lists.ongoing);
        if (dates.length > 0) {
          // Get the orders for the first date
          const ongoingOrders = data.lists.ongoing[dates[0]];
          if (ongoingOrders && ongoingOrders.length > 0) {
            const ongoingOrder = ongoingOrders[0];
            console.log("Found ongoing order:", ongoingOrder);
            setOngoingOrderId(ongoingOrder.order_id);
            setShowOngoingOrderPopup(true);
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error("Error checking ongoing order:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to check ongoing orders",
        life: 3000,
      });
      return false;
    }
  };

  const handleCompleteOrder = async () => {
    if (!ongoingOrderId) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Order ID not found",
        life: 3000,
      });
      return;
    }

    try {
      console.log("Completing order with ID:", ongoingOrderId);

      const response = await fetch(
        "https://menumitra.com/user_api/complete_order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            order_id: ongoingOrderId.toString(),
          }),
        }
      );

      const data = await response.json();
      console.log("Complete order API Response:", data);

      if (response.ok && data.st === 1) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Order has been completed successfully!",
          life: 3000,
        });

        setShowOngoingOrderPopup(false);
        clearCart();
        navigate("/MyOrder", { state: { activeTab: "completed" } });
      } else {
        throw new Error(data.msg || "Failed to complete order");
      }
    } catch (error) {
      console.error("Error completing order:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to complete order. Please try again.",
        life: 3000,
      });
    }
  };

  // Add this to your useEffect or where appropriate
  useEffect(() => {
    const checkOrder = async () => {
      if (isLoggedIn && restaurantId) {
        await checkForOngoingOrder();
      }
    };
    checkOrder();
  }, [isLoggedIn, restaurantId]);

  const [showEmptyCheckoutModal, setShowEmptyCheckoutModal] = useState(false);

  const handleSubmitOrder = async () => {
    if (!checkoutData) {
      setShowEmptyCheckoutModal(true);
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const currentCustomerId =
        userData?.customer_id || localStorage.getItem("customer_id");
      const currentCustomerType =
        userData?.customer_type || localStorage.getItem("customer_type");

      // First check for ongoing orders
      const ongoingResponse = await fetch(
        "https://menumitra.com/user_api/get_order_list",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            customer_id: currentCustomerId,
            customer_type: currentCustomerType,
            order_status: "ongoing",
          }),
        }
      );

      const ongoingData = await ongoingResponse.json();

      if (
        ongoingData.st === 1 &&
        ongoingData.lists?.ongoing &&
        Object.keys(ongoingData.lists.ongoing).length > 0
      ) {
        setShowOngoingOrderPopup(true);
        return;
      }

      // If no ongoing orders, proceed with checking placed orders
      const placedResponse = await fetch(
        "https://menumitra.com/user_api/get_order_list",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            customer_id: currentCustomerId,
            customer_type: currentCustomerType,
            order_status: "placed",
          }),
        }
      );

      const placedData = await placedResponse.json();

      if (
        placedData.st === 1 &&
        placedData.lists?.placed &&
        Object.keys(placedData.lists.placed).length > 0
      ) {
        // Handle placed orders...
        const firstOrderKey = Object.keys(placedData.lists.placed)[0];
        const firstOrder = placedData.lists.placed[firstOrderKey][0];
        setExistingOrderId(firstOrder.order_id);
        setShowExistingOrderModal(true);
        return;
      }

      // If no ongoing or placed orders, proceed with new order
      await proceedWithOrderSubmission(currentCustomerId, currentCustomerType);
    } catch (error) {
      console.error("Error during order submission:", error);
      setErrorMessage(
        "An error occurred while processing your order. Please try again."
      );
      setShowErrorPopup(true);
    }
  };

  const handleAddToExistingOrder = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      // Get order list to find the order number
      const response = await fetch(
        "https://menumitra.com/user_api/get_order_list",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            order_status: "placed",
            customer_id: userData?.customer_id,
            customer_type: userData?.customer_type,
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1 && data.lists?.placed) {
        // Get the latest placed order
        const dates = Object.keys(data.lists.placed);
        if (dates.length > 0) {
          const placedOrders = data.lists.placed[dates[0]];
          const targetOrder = placedOrders.find(
            (order) => order.order_id === existingOrderId
          );

          if (targetOrder) {
            // Navigate using the found order_number
            navigate(`/TrackOrder/${targetOrder.order_number}`, {
              state: {
                orderStatus: "placed",
                order_id: existingOrderId,
              },
            });

            clearCart();
            localStorage.removeItem("cartItems");
            setShowExistingOrderModal(false);
            return;
          }
        }
      }
      throw new Error("Could not find order details");
    } catch (error) {
      console.error("Error navigating:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to navigate to order details",
        life: 3000,
      });
    }
  };

  // Update the handleCancelExistingOrder function
  const handleCancelExistingOrder = async () => {
    try {
      console.log("Cancelling order:", existingOrderId); // Debug log

      const response = await fetch(
        "https://menumitra.com/user_api/cancle_order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: existingOrderId.toString(),
            restaurant_id: restaurantId.toString(),
            note: "Canceled to place new order",
          }),
        }
      );

      const data = await response.json();
      console.log("Cancel Order Response:", data); // Debug log

      if (data.st === 1) {
        // After canceling, proceed with new order
        const userData = JSON.parse(localStorage.getItem("userData"));
        await proceedWithOrderSubmission(userData?.customer_id);
      } else {
        throw new Error(data.msg || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to cancel order",
        life: 3000,
      });
    } finally {
      setShowExistingOrderModal(false);
    }
  };

  const proceedWithOrderSubmission = async (
    currentCustomerId,
    currentCustomerType
  ) => {
    const orderItems = cartItems.map((item) => ({
      menu_id: item.menu_id,
      quantity: item.quantity,
      price: item.price,
      menu_name: item.menu_name,
      image: item.image,
      category_name: item.category_name,
      spicy_index: item.spicy_index,
      rating: item.rating,
      offer: item.offer,
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
      customer_id: currentCustomerId,
      customer_type: currentCustomerType,
      restaurant_id: restaurantId,
      cart_id: checkoutData.cartId,
      note: notes,
      order_items: orderItems,
      table_number: checkoutData.tableNumber || "1",
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
        // Store order items in localStorage
        const orderItemsForStorage = {
          items: orderItems,
          created_at: new Date().toISOString(),
          order_id: responseData.order_id,
          order_number: responseData.order_number,
          total_total: checkoutData.total,
          grand_total: checkoutData.grandTotal,
        };

        localStorage.setItem(
          `orderItems_${responseData.order_number}`,
          JSON.stringify(orderItemsForStorage)
        );

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

  // Add this function to handle order completion
  const handleCompleteAndProceed = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const currentCustomerId =
        userData?.customer_id || localStorage.getItem("customer_id");
      const currentCustomerType =
        userData?.customer_type || localStorage.getItem("customer_type");

      // Fetch the ongoing order details
      const response = await fetch(
        "https://menumitra.com/user_api/get_order_list",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            customer_id: currentCustomerId,
            customer_type: currentCustomerType,
            order_status: "ongoing",
          }),
        }
      );

      const data = await response.json();

      if (data.st === 1 && data.lists?.ongoing) {
        const ongoingOrders = data.lists.ongoing;
        if (Object.keys(ongoingOrders).length > 0) {
          const firstOrderKey = Object.keys(ongoingOrders)[0];
          const ongoingOrder = ongoingOrders[firstOrderKey][0];

          // Navigate to the order details page
          navigate(`/TrackOrder/${ongoingOrder.order_number}`, {
            state: {
              order_status: "ongoing",
              order_id: ongoingOrder.order_id,
            },
          });
        }
      } else {
        throw new Error("No ongoing order found");
      }
    } catch (error) {
      console.error("Error handling ongoing order:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to process ongoing order. Please try again.",
        life: 3000,
      });
    } finally {
      setShowOngoingOrderPopup(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate("/MyOrder", { state: { activeTab: "placed" } }); // Changed selectedTab to activeTab and value to "placed"
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
      <Toast ref={toast} position="bottom-center" className="custom-toast" />

      <main className="page-content space-top mb-5 pb-3">
        <div className="container py-0 my-0">
          <HotelNameAndTable
            restaurantName={restaurantName}
            tableNumber={userData?.tableNumber || "1"}
          />
        </div>

        {showOngoingOrderPopup && (
          <div className="popup-overlay">
            <div className="popup-content rounded-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="mb-0 text-muted">Ongoing Order Detected</h3>
                <button
                  className="btn p-0"
                  onClick={() => setShowOngoingOrderPopup(false)}
                >
                  <i className="ri-close-line text-muted fs-3"></i>
                </button>
              </div>
              <p className="text-muted mb-4">
                Please complete your ongoing order before placing a new one.
              </p>
              <div className="d-flex flex-column gap-2">
                <button
                  className="btn btn-success rounded-pill w-100 py-2"
                  onClick={handleCompleteOrder} // Removed the orderId parameter
                >
                  <i className="ri-checkbox-circle-line me-2"></i>
                  Complete Order
                </button>

                <button
                  className="btn btn-outline-primary rounded-pill w-100 py-2"
                  onClick={handleCompleteAndProceed}
                >
                  <i className="ri-eye-line me-2"></i>
                  View Order Details
                </button>
              </div>
            </div>
          </div>
        )}

        {showEmptyCheckoutModal && (
          <div
            className="d-flex align-items-center justify-content-center position-fixed top-0 start-0 w-100 h-100"
            style={{
              zIndex: 1050,
              background: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <div
              className="modal-dialog"
              style={{ maxWidth: "90%", width: "350px" }}
            >
              <div className="modal-content rounded-4 p-2">
                <div className="modal-body text-center px-2">
                  <div className="mb-3">
                    <i
                      className="ri-restaurant-2-line text-primary"
                      style={{ fontSize: "3.5rem" }}
                    ></i>
                  </div>
                  <h5 className="mb-3 fw-semibold">No Items in Cart!</h5>
                  <p className="text-muted mb-4">
                    Add some delicious dishes to your cart and place your order.
                  </p>
                  <button
                    className="btn btn-primary rounded-pill px-4 py-2"
                    onClick={() => {
                      setShowEmptyCheckoutModal(false);
                      const restaurantCode =
                        localStorage.getItem("restaurantCode");
                      const tableNumber =
                        localStorage.getItem("tableNumber") || "";
                      navigate(`/${restaurantCode}/${tableNumber}`);
                    }}
                  >
                    <i className="ri-restaurant-line me-2"></i>
                    Browse Menu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showExistingOrderModal && (
          <div className="popup-overlay">
            <div
              className="popup-content rounded-4 p-0"
              style={{ maxWidth: "90%", width: "400px" }}
            >
              {/* Header */}
              <div className="p-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-semibold text-muted">
                    Existing Order Found
                  </h5>
                  <button
                    className="btn p-0 fs-3 text-muted"
                    onClick={() => setShowExistingOrderModal(false)}
                  >
                    <i className="ri-close-line text-muted"></i>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-3">
                <p className="text-center mb-4 text-muted">
                  You have an existing order in progress. What would you like to
                  do?
                </p>

                {/* Buttons */}
                <div className="d-flex flex-column gap-2">
                  <button
                    className="btn btn-success rounded-pill w-100 py-2 my-1"
                    onClick={handleAddToExistingOrder}
                  >
                    <i className="ri-add-line me-2"></i>
                    Add to Existing Order
                  </button>

                  <button
                    className="btn btn-outline-danger rounded-pill w-100 py-2 my-1"
                    onClick={handleCancelExistingOrder}
                  >
                    <i className="ri-close-circle-line me-2 "></i>
                    Cancel Existing & Place New
                  </button>
                </div>
              </div>
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
                  className={`form-control dz-textarea rounded-3 pb-0 ${
                    isNotesFocused ? "border-primary" : "border-light"
                  }`}
                  name="notes"
                  id="notes"
                  rows="4"
                  placeholder="Write Here"
                  value={notes}
                  onChange={handleNotesChange}
                  onFocus={handleNotesFocus}
                  onBlur={handleNotesBlur}
                  ref={notesRef}
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
                className="btn btn-success rounded-pill     text-white"
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
          <div className="popup-content rounded-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="mb-0">Success</h3>
              <button
                className="btn-close"
                onClick={() => setShowPopup(false)}
              ></button>
            </div>
            <div className="circle">
              <img src={OrderGif} alt="Order Success" className="popup-gif" />
            </div>
            <span className="text-dark my-3 d-block text-center">
              Order placed successfully
            </span>
            <p className="text-muted text-center mb-4">
              You have successfully made payment and placed your order.
            </p>
            <button
              className="btn btn-success rounded-pill text-white w-100"
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
