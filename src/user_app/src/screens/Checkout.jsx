import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Bottom from "../component/bottom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import "../assets/css/toast.css";
import OrderGif from "../assets/gif/cooking.gif";
import { ThemeContext } from "../context/ThemeContext.js";
import Header from "../components/Header";
import HotelNameAndTable from "../components/HotelNameAndTable";
import NearbyArea from "../component/NearbyArea";
import { useCart } from "../context/CartContext";
import { Toast } from "primereact/toast";
import config from "../component/config";
import axios from "axios";
import RestaurantSocials from "../components/RestaurantSocials.jsx";
const Checkout = () => {
  const navigate = useNavigate();
  const { restaurantId, restaurantName } = useRestaurantId();
  const { clearCart } = useCart();
  const toast = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [customerType, setCustomerType] = useState(null);
  const storedRestaurantId = localStorage.getItem("restaurantId");
  const [availableTables, setAvailableTables] = useState(0);

  const location = useLocation();
  // const [cartItems, setCartItems] = useState([]);

  const [showPopup, setShowPopup] = useState(false);

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [serviceChargesPercent, setServiceChargesPercent] = useState(0);
  const [serviceCharges, setServiceCharges] = useState(0);
  const [gstPercent, setGstPercent] = useState(0);
  const [tax, setTax] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [cartId, setCartId] = useState(null);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [showExistingOrderModal, setShowExistingOrderModal] = useState(false);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  const [newOrderNumber, setNewOrderNumber] = useState(null);
  const [existingOrderDetails, setExistingOrderDetails] = useState({
    orderNumber: "",
    orderStatus: "",
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize state from local storage
    return localStorage.getItem("isDarkMode") === "true";
  }); // State for theme

  const userData = JSON.parse(localStorage.getItem("userData"));

  const tableNumber = userData ? userData.tableNumber : null; // Retrieve table_number

  const [restaurantCode, setRestaurantCode] = useState(
    () => localStorage.getItem("restaurantCode") || ""
  );

  const getCartId = () => {
    const cartId = localStorage.getItem("cartId");

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

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const currentCustomerId =
      userData?.customer_id || localStorage.getItem("customer_id");
    const cartId = getCartId();

    // if (!cartId || !currentCustomerId || !restaurantId) {
    //   return;
    // }

    fetchCartDetails();
  }, []);

  const fetchCartDetails = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const currentCustomerId =
      userData?.customer_id || localStorage.getItem("customer_id");
    const cartId = getCartId();

    try {
      const response = await axios.post(
        `${config.apiDomain}/user_api/get_cart_detail`,
        {
          cart_id: cartId,
          customer_id: currentCustomerId,
          restaurant_id: storedRestaurantId,
        }
      );

      if (response.data.st === 1) {
        const data = response.data;

        // Map and update state
        const mappedItems = data.order_items.map((item) => ({
          ...item,
          discountedPrice: item.offer
            ? Math.floor(item.price * (1 - item.offer / 100))
            : item.price,
        }));

        // Update state immediately
        setCartItems(mappedItems);
        setTotal(parseFloat(data.total_bill));
        setServiceChargesPercent(parseFloat(data.service_charges_percent));
        setServiceCharges(parseFloat(data.service_charges_amount));
        setGstPercent(parseFloat(data.gst_percent));
        setTax(parseFloat(data.gst_amount));
        setDiscountPercent(parseFloat(data.discount_percent));
        setDiscount(parseFloat(data.discount_amount));
        setGrandTotal(parseFloat(data.grand_total));
        setCartId(data.cart_id);
        setTotalAfterDiscount(parseFloat(data.total_after_discount));
      } else {
        console.clear();
      }
    } catch (error) {
      console.clear();
    }
  };

  useEffect(() => {
    const storedRestaurantCode = localStorage.getItem("restaurantCode");
    if (storedRestaurantCode) {
      setRestaurantCode(storedRestaurantCode);
    }
    // fetchCartDetails();
  }, [restaurantId, customerId]);

  useEffect(() => {
    // Apply the theme class based on the current state
    if (isDarkMode) {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
    }
  }, [isDarkMode]);

  const [showOrderTypeModal, setShowOrderTypeModal] = useState(false);
  const [selectedOrderType, setSelectedOrderType] = useState("");

  const [pendingOrderAction, setPendingOrderAction] = useState(null);

  const handlePlaceOrder = async () => {
    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/check_order_exist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: customerId,
            restaurant_id: restaurantId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.st === 1) {
        setAvailableTables(data.available_tables);

        // If no existing order, show order type selection
        if (data.order_number === null && data.order_status === null) {
          setShowOrderTypeModal(true);
        }
        // If there's an ongoing or placed order, show modal with options
        else if (
          data.order_status === "ongoing" ||
          data.order_status === "placed"
        ) {
          setExistingOrderDetails({
            orderNumber: data.order_number,
            orderStatus: data.order_status,
            orderId: data.order_id,
            orderType: data.order_type, // Store order_type here
          });
          setShowExistingOrderModal(true);
        }
      } else {
        console.clear();
        throw new Error("Failed to check order status");
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to process order",
        life: 3000,
      });
      console.clear();
    }
  };

  const handleOrderTypeSelection = (orderType) => {
    if (pendingOrderAction) {
      handleOrderAction(pendingOrderAction, orderType);
    } else {
      handleCreateOrder(orderType);
    }
  };

  const handleCreateOrder = async (orderType) => {
    if (!cartId || !customerId || !restaurantId || !orderType) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Missing required data to create an order",
        life: 3000,
      });
      return;
    }

    const tableNumber =
      JSON.parse(localStorage.getItem("userData"))?.tableNumber ||
      localStorage.getItem("tableNumber") ||
      "1";

    const sectionId =
      JSON.parse(localStorage.getItem("userData"))?.sectionId ||
      localStorage.getItem("sectionId") ||
      "";

    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/create_order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: cartId,
            customer_id: customerId,
            restaurant_id: restaurantId,
            table_number: tableNumber,
            order_type: orderType,
            section_id: sectionId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.st === 1) {
        setNewOrderNumber(data.order_number);
        clearCartData();
        setShowOrderTypeModal(false);
        setShowPopup(true);
        await fetchCartDetails();
      } else if (response.ok && data.st === 2) {
        window.showToast("error", "Table is occupied");
      } else {
        console.clear();
        throw new Error(data.msg);
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to create order",
        life: 3000,
      });
      console.clear();
    }
  };

  const clearCartData = () => {
    clearCart(); // Clear cart context
    localStorage.removeItem("cartItems"); // Clear cart items from localStorage
    localStorage.removeItem("cartId"); // Clear cart ID from localStorage
    setCartItems([]); // Clear cart items state if you're using it
  };

  const handleOrderAction = async (orderStatus, orderType) => {
    if (
      !cartId ||
      !customerId ||
      !restaurantId ||
      !existingOrderDetails.orderNumber ||
      !orderType
    ) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Missing required data to proceed",
        life: 3000,
      });
      return;
    }

    try {
      const sectionId =
        JSON.parse(localStorage.getItem("userData"))?.sectionId ||
        localStorage.getItem("sectionId") ||
        "";

      const response = await fetch(
        `${config.apiDomain}/user_api/complete_or_cancle_existing_order_create_new_order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: cartId,
            customer_id: customerId,
            restaurant_id: restaurantId,
            order_number: existingOrderDetails.orderNumber,
            order_status: orderStatus,
            order_type: orderType,
            section_id: sectionId,
          }),
        }
      );

      const data = await response.json();

      if (data.st === 1) {
        setShowOrderTypeModal(false);
        setPendingOrderAction(null);
        clearCartData();
        await fetchCartDetails();
        navigate(`/user_app/MyOrder/`);
      } else {
        console.clear();
        throw new Error(data.msg || "Failed to update order");
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to process order",
        life: 3000,
      });
      console.clear();
    }
  };

  const handleAddToExistingOrder = async () => {
    try {
      // Construct the order items array
      const orderItems = cartItems.map((item) => ({
        menu_id: item.menu_id,
        quantity: item.quantity,
        half_or_full: item.half_or_full || "full",
      }));

      // Make the API call
      const response = await fetch(
        `${config.apiDomain}/user_api/add_to_existing_order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: existingOrderDetails.orderId, // Use the orderId from the existing order details
            customer_id: customerId,
            restaurant_id: restaurantId,
            cart_id: cartId,
            order_items: orderItems,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.st === 1) {
        setShowPopup(true);
        await fetchCartDetails();
        clearCartData();
        setShowExistingOrderModal(false); // Close the modal
      } else {
        console.clear();
        throw new Error(
          data.msg || "Failed to add items to the existing order"
        );
      }
    } catch (error) {}
  };

  const closePopup = () => {
    setShowPopup(false);

    navigate(`/user_app/MyOrder/`);
  };

  const handleOrderActionClick = (actionType) => {
    setPendingOrderAction(actionType);
    setShowExistingOrderModal(false);
    setShowOrderTypeModal(true);
  };

  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [isProcessingGPay, setIsProcessingGPay] = useState(false);
  const [isProcessingPhonePe, setIsProcessingPhonePe] = useState(false);
  const [isProcessingUPI, setIsProcessingUPI] = useState(false);

  const timeoutRef = useRef({});

  const [processingPaymentMethod, setProcessingPaymentMethod] = useState(""); // tracks which method is being processed

  const handleGenericUPI = async () => {
    if (processingPaymentMethod) return; // Prevents multiple payments at once
    try {
      setProcessingPaymentMethod("upi");
      if (timeoutRef.current.upi) clearTimeout(timeoutRef.current.upi);

      const amount = Math.round(parseFloat(existingOrderDetails.grand_total));
      const transactionNote = encodeURIComponent(
        `${
          userData?.name || "Customer"
        } is paying Rs. ${amount} to ${restaurantName} for order no. #${
          existingOrderDetails.orderNumber
        }`
      );
      const encodedRestaurantName = encodeURIComponent(restaurantName);
      const upiId = "hivirajkadam@okhdfcbank";

      const paymentUrl = `upi://pay?pa=${upiId}&pn=${encodedRestaurantName}&tr=${existingOrderDetails.orderNumber}&tn=${transactionNote}&am=${amount}&cu=INR&mc=1234`;
      console.log(paymentUrl);

      await initiatePayment(
        "UPI",
        paymentUrl,
        () => setProcessingPaymentMethod(""),
        "upi"
      );

      await initiatePayment(
        "UPI",
        paymentUrl,
        () => setProcessingPaymentMethod(""),
        "upi"
      );
    } catch (error) {
      window.showToast("error", "UPI payment initiation failed");
      setProcessingPaymentMethod("");
    }
  };

  const handlePhonePe = async () => {
    if (processingPaymentMethod) return; // Prevents multiple payments at once
    try {
      setProcessingPaymentMethod("phonepe");
      if (timeoutRef.current.phonepe) clearTimeout(timeoutRef.current.phonepe);

      const amount = Math.round(parseFloat(existingOrderDetails.grand_total));
      const transactionNote = encodeURIComponent(
        `${
          userData?.name || "Customer"
        } is paying Rs. ${amount} to ${restaurantName} for order no. #${
          existingOrderDetails.orderNumber
        }`
      );
      const encodedRestaurantName = encodeURIComponent(restaurantName);
      const upiId = "hivirajkadam@okhdfcbank";

      const paymentUrl = `phonepe://pay?pa=${upiId}&pn=${encodedRestaurantName}&tr=${existingOrderDetails.orderNumber}&tn=${transactionNote}&am=${amount}&cu=INR&mc=1234`;
      console.log(paymentUrl);

      await initiatePayment(
        "PhonePe",
        paymentUrl,
        () => setProcessingPaymentMethod(""),
        "phonepe"
      );

      await initiatePayment(
        "PhonePe",
        paymentUrl,
        () => setProcessingPaymentMethod(""),
        "phonepe"
      );
    } catch (error) {
      window.showToast("error", "PhonePe payment initiation failed");
      setProcessingPaymentMethod("");
    }
  };

  const handleGooglePay = async () => {
    if (processingPaymentMethod) return; // Prevents multiple payments at once
    try {
      setProcessingPaymentMethod("gpay");
      if (timeoutRef.current.gpay) clearTimeout(timeoutRef.current.gpay);

      const amount = Math.round(parseFloat(existingOrderDetails.grand_total));
      const transactionNote = encodeURIComponent(
        `${
          userData?.name || "Customer"
        } is paying Rs. ${amount} to ${restaurantName} for order no. #${
          existingOrderDetails.orderNumber
        }`
      );
      const encodedRestaurantName = encodeURIComponent(restaurantName);
      const upiId = "hivirajkadam@okhdfcbank";

      const paymentUrl = `gpay://upi/pay?pa=${upiId}&pn=${encodedRestaurantName}&tr=${existingOrderDetails.orderNumber}&tn=${transactionNote}&am=${amount}&cu=INR&mc=1234`;
      console.log(paymentUrl);

      await initiatePayment(
        "GooglePay",
        paymentUrl,
        () => setProcessingPaymentMethod(""),
        "gpay"
      );

      await initiatePayment(
        "GooglePay",
        paymentUrl,
        () => setProcessingPaymentMethod(""),
        "gpay"
      );
    } catch (error) {
      window.showToast("error", "Google Pay payment initiation failed");
      setProcessingPaymentMethod("");
    }
  };

  const initiatePayment = async (
    method,
    paymentUrl,
    setProcessing,
    timeoutKey
  ) => {
    if (
      !cartId ||
      !customerId ||
      !restaurantId ||
      !existingOrderDetails.orderNumber
    ) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Missing required data to proceed",
        life: 3000,
      });
      setProcessing(false);
      return;
    }

    try {
      const sectionId =
        JSON.parse(localStorage.getItem("userData"))?.sectionId ||
        localStorage.getItem("sectionId") ||
        "";

      const response = await fetch(
        `${config.apiDomain}/user_api/complete_or_cancle_existing_order_create_new_order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: cartId,
            customer_id: customerId,
            restaurant_id: restaurantId,
            order_number: existingOrderDetails.orderNumber,
            order_status: "completed",
            payment_method: method, // Include payment method
            order_type: existingOrderDetails.orderType, // Pass the order_type here
            section_id: sectionId,
          }),
        }
      );

      const data = await response.json();

      if (data.st === 1) {
        if (paymentUrl) {
          // Redirect if paymentUrl is provided
          window.location.href = paymentUrl;
          timeoutRef.current[timeoutKey] = setTimeout(() => {
            if (!document.hidden) {
              window.showToast(
                "error",
                `No ${method} app found. Please install the app.`
              );
            }
            setProcessing(false);
          }, 3000);
          navigate("/user_app/MyOrder");
          clearCartData();
        } else {
          // Handle successful API response without redirection
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: `Payment via ${method} initiated successfully.`,
            life: 3000,
          });
          setProcessing(false);
          navigate("/user_app/MyOrder");
          clearCartData();
        }
      } else {
        throw new Error(data.msg || "Failed to process payment");
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to process payment or order",
        life: 3000,
      });
      console.error("Error initiating payment:", error);
      setProcessing(false);
    }
  };

  const getFoodTypeStyles = (foodType) => {
    // Convert foodType to lowercase for case-insensitive comparison
    const type = (foodType || "").toLowerCase();

    switch (type) {
      case "veg":
        return {
          icon: "fa-solid fa-circle text-success",
          border: "border-success",
          textColor: "text-success",
          categoryIcon: "fa-solid fa-utensils text-success me-1", // Added for category
        };
      case "nonveg":
        return {
          icon: "fa-solid fa-play fa-rotate-270 text-danger",
          border: "border-danger",
          textColor: "text-success", // Changed to green for category name
          categoryIcon: "fa-solid fa-utensils text-success me-1", // Added for category
        };
      case "egg":
        return {
          icon: "fa-solid fa-egg gray-text",
          border: "border-muted",
          textColor: "text-success", // Changed to green for category name
          categoryIcon: "fa-solid fa-utensils text-success me-1", // Added for category
        };
      case "vegan":
        return {
          icon: "fa-solid fa-leaf text-success",
          border: "border-success",
          textColor: "text-success",
          categoryIcon: "fa-solid fa-utensils text-success me-1", // Added for category
        };
      default:
        return {
          icon: "fa-solid fa-circle text-success",
          border: "border-success",
          textColor: "text-success",
          categoryIcon: "fa-solid fa-utensils text-success me-1", // Added for category
        };
    }
  };

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    try {
      // API call will go here
      // const response = await fetch(`${config.apiDomain}/user_api/apply_coupon`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     coupon_code: couponCode,
      //     cart_id: cartId,
      //     restaurant_id: restaurantId,
      //     customer_id: customerId
      //   })
      // });
      // const data = await response.json();

      // Temporary success simulation
      setAppliedCoupon({
        code: couponCode,
        discount: "10%"
      });
      setCouponError("");
      setShowCouponModal(false);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Coupon applied successfully!",
        life: 3000,
      });
    } catch (error) {
      setCouponError("Failed to apply coupon");
      console.error("Error applying coupon:", error);
    }
  };

  const [showScanner, setShowScanner] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const videoRef = useRef(null);

  const validateCouponInput = (value) => {
    // Allow only alphanumeric, max 10 characters
    const regex = /^[a-zA-Z0-9]*$/;
    if (value.length <= 10 && regex.test(value)) {
      return value.toUpperCase();
    }
    return couponCode; // Return existing value if invalid
  };

  const handleScanQR = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Camera not supported on this device",
          life: 3000,
        });
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Prefer back camera
      });
      
      setShowScanner(true);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      setHasPermission(false);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Camera permission denied",
        life: 3000,
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowScanner(false);
  };

  return (
    <div className="page-wrapper full-height">
      <Header title="Checkout" count={cartItems.length} />
      <Toast ref={toast} position="bottom-center" className="custom-toast" />

      <main className="page-content mb-5 pb-3">
        <div className="container py-0 my-0">
          <HotelNameAndTable
            restaurantName={restaurantName}
            tableNumber={userData?.tableNumber || "1"}
          />
        </div>

        {showOrderTypeModal && (
          <div
            className="popup-overlay"
            onClick={(e) => {
              // Close modal only if the overlay itself is clicked
              if (e.target.className === "popup-overlay") {
                setShowOrderTypeModal(false);
              }
            }}
          >
            <div className="modal-dialog w-75" role="document">
              <div className="modal-content">
                <div className="modal-header ps-3 pe-2">
                  <div className="modal-title font_size_16 fw-medium mb-0 text-dark">
                    Select Order Type
                  </div>
                  {/* <button
                    className="btn p-0 fs-3 gray-text"
                    onClick={() => setShowOrderTypeModal(false)}
                  >
                    <i className="fa-solid fa-xmark text-dark font_size_14 pe-3"></i>
                  </button> */}
                </div>
                <div className="modal-body py-2 px-3">
                  <div className="row g-3">
                    {/* Parcel */}
                    <div className="col-6">
                      <div
                        className="card h-100 border rounded-4 cursor-pointer position-relative"
                        onClick={() => handleOrderTypeSelection("Parcel")}
                      >
                        {/* Icons container */}
                        {/* <div className="position-absolute top-0 end-0 p-2 pt-0">
                          <div className="d-flex flex-column gap-1">
                            <div
                              className="rounded-circle p-1"
                              style={{ width: "24px", height: "24px" }}
                            >
                              <img
                                src="https://play-lh.googleusercontent.com/ymXDmYihTOzgPDddKSvZRKzXkboAapBF2yoFIeQBaWSAJmC9IUpSPKgvfaAgS5yFxQ=w240-h480-rw"
                                className="img-fluid rounded-circle"
                                alt=""
                              />
                            </div>
                            <div
                              className="rounded-circle p-1 pt-0"
                              style={{ width: "24px", height: "24px" }}
                            >
                              <img
                                src="https://play-lh.googleusercontent.com/HJdzprqlCwh_8YNyhMBU6rIaGBGwxHXflZuuqI3iR4US7Jb-bSYiJk_DKV2la9SoBM0K=w240-h480-rw"
                                className="img-fluid rounded-circle"
                                alt=""
                              />
                            </div>
                          </div>
                        </div> */}

                        <div className="card-body d-flex justify-content-center align-items-center py-3">
                          <div className="text-center">
                            <i className="fa-solid fa-hand-holding-heart fs-2 mb-2 text-primary"></i>
                            <p className="mb-0 fw-medium">Parcel</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Drive-Through */}
                    <div className="col-6">
                      <div
                        className="card h-100 border rounded-4 cursor-pointer"
                        onClick={() =>
                          handleOrderTypeSelection("Drive-through")
                        }
                      >
                        <div className="card-body d-flex justify-content-center align-items-center py-3">
                          <div className="text-center">
                            <i className="fa-solid fa-car-side fs-2 mb-2 text-primary"></i>
                            <p className="mb-0 fw-medium">Drive-Through</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dine-in */}
                    <div className="col-12 mb-3">
                      <div
                        className="card h-100 border rounded-4 cursor-pointer"
                        onClick={() => handleOrderTypeSelection("Dine-in")}
                      >
                        <div className="card-body d-flex align-items-center py-3">
                          <div className="text-center me-3">
                            <i className="fa-solid fa-utensils fs-2 text-primary"></i>
                          </div>
                          <div>
                            <p className="mb-0 fw-medium">Dine-In</p>
                            {/* <small className="text-dark">
                              {availableTables} Tables Available
                            </small> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPaymentOptions && (
          <div className="popup-overlay">
            <div
              className="modal-dialog modal-dialog-centered"
              style={{ maxWidth: "350px", margin: "auto" }}
            >
              <div className="modal-content">
                <div className="modal-header ps-3 pe-2">
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <div className="modal-title font_size_16 fw-medium mb-0 text-dark">
                      Complete Payment
                    </div>
                    <button
                      className="btn p-0 fs-3 gray-text"
                      onClick={() => setShowPaymentOptions(false)}
                    >
                      <i className="fa-solid fa-xmark gray-text font_size_14 pe-3"></i>
                    </button>
                  </div>
                </div>

                <div className="modal-body py-2 px-3">
                  <p className="text-center mb-4">
                    Please select a payment method to complete your order #
                    {existingOrderDetails.orderNumber}
                  </p>
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-info text-white w-100 d-flex align-items-center justify-content-center gap-2"
                      onClick={handleGenericUPI}
                      disabled={
                        processingPaymentMethod &&
                        processingPaymentMethod !== "upi"
                      }
                    >
                      {processingPaymentMethod === "upi" ? (
                        "Processing..."
                      ) : (
                        <>
                          Pay via Other UPI Apps
                          <img
                            src="https://img.icons8.com/ios-filled/50/FFFFFF/bhim-upi.png"
                            width={45}
                            alt="UPI"
                          />
                        </>
                      )}
                    </button>

                    <button
                      className="btn text-white w-100 d-flex align-items-center justify-content-center gap-2"
                      style={{ backgroundColor: "#5f259f" }}
                      onClick={handlePhonePe}
                      disabled={
                        processingPaymentMethod &&
                        processingPaymentMethod !== "phonepe"
                      }
                    >
                      {processingPaymentMethod === "phonepe" ? (
                        "Processing..."
                      ) : (
                        <>
                          Pay via PhonePe
                          <img
                            src="https://img.icons8.com/?size=100&id=OYtBxIlJwMGA&format=png&color=000000"
                            width={45}
                            alt="PhonePe"
                          />
                        </>
                      )}
                    </button>

                    <button
                      className="btn text-white w-100 d-flex align-items-center justify-content-center gap-2"
                      style={{ backgroundColor: "#1a73e8" }} // Updated to Google Pay's brand color
                      onClick={handleGooglePay}
                      disabled={
                        processingPaymentMethod &&
                        processingPaymentMethod !== "gpay"
                      }
                    >
                      {processingPaymentMethod === "gpay" ? (
                        "Processing..."
                      ) : (
                        <>
                          Pay via Google Pay
                          <img
                            className="ms-2"
                            src="https://developers.google.com/static/pay/api/images/brand-guidelines/google-pay-mark.png"
                            width={45}
                            alt="Google Pay"
                          />
                        </>
                      )}
                    </button>

                    <div className="text-center mt-3">
                      <div>or make payment via:</div>
                    </div>
                    <div className="d-flex justify-content-center pt-2">
                      <button
                        type="button"
                        className="px-2 bg-white mb-2 me-4 rounded-pill py-1 text-dark border"
                        onClick={() => {
                          setProcessingPaymentMethod("card"); // Set processing state
                          initiatePayment(
                            "card",
                            null,
                            setProcessingPaymentMethod,
                            "card"
                          );
                        }}
                      >
                        <i className="ri-bank-card-line me-1"></i>
                        Card
                      </button>
                      <button
                        type="button"
                        className="px-2 bg-white mb-2 me-2 rounded-pill py-1 text-dark border"
                        onClick={() => {
                          setProcessingPaymentMethod("cash"); // Set processing state
                          initiatePayment(
                            "cash",
                            null,
                            setProcessingPaymentMethod,
                            "cash"
                          );
                        }}
                      >
                        <i className="ri-wallet-3-fill me-1"></i>
                        Cash
                      </button>
                    </div>

                    <button
                      className="btn btn-md border border-1 border-muted bg-transparent rounded-pill font_size_14 text-dark"
                      onClick={() => setShowPaymentOptions(false)}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showExistingOrderModal && (
          <div className="popup-overlay">
            <div
              className="modal-dialog modal-dialog-centered"
              style={{ maxWidth: "350px", margin: "auto" }}
            >
              <div className="modal-content">
                <div className="modal-header ps-3 pe-2">
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <div className="modal-title font_size_16 fw-medium mb-0 text-dark">
                      Existing Order Found
                    </div>
                    <button
                      className="btn p-0 fs-3 gray-text"
                      onClick={() => setShowExistingOrderModal(false)}
                    >
                      <i className="fa-solid fa-xmark gray-text font_size_14 pe-3"></i>
                    </button>
                  </div>
                </div>

                <div className="modal-body py-2 px-3">
                  <p className="text-center mb-4">
                    You have an ongoing order (#
                    {existingOrderDetails.orderNumber}). Would you like to add
                    to this order or create a new one?
                  </p>
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-danger rounded-pill font_size_14 text-white"
                      onClick={() => handleOrderActionClick("cancle")}
                    >
                      Cancel Existing & Create New Order
                    </button>
                    <button
                      className="btn btn-success rounded-pill font_size_14 text-white"
                      onClick={() => {
                        setShowExistingOrderModal(false);
                        setShowPaymentOptions(true);
                      }}
                    >
                      Complete Existing & Create New Order
                    </button>
                    <button
                      className="btn btn-info rounded-pill font_size_14 text-white"
                      onClick={handleAddToExistingOrder}
                    >
                      Add to Existing Order (#{existingOrderDetails.orderNumber}
                      )
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm border border-1 border-muted bg-transparent rounded-pill font_size_14 text-dark"
                      onClick={() => setShowExistingOrderModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPopup && (
          <div className="popup-overlay">
            <div className="container d-flex align-items-center justify-content-center">
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div className="modal-content">
                  <h5 className="modal-title border-bottom py-2 text-center text-dark">
                    Success
                  </h5>
                  <div className="modal-header py-0">
                    <button
                      className="btn-close"
                      onClick={() => setShowPopup(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="d-flex justify-content-center bg-light rounded-circle w-25 h-25 mx-auto">
                      <img
                        src={OrderGif}
                        alt="Order Success"
                        className="popup-gif"
                        height={100}
                        width={100}
                      />
                    </div>
                    <span className="text-dark my-2 d-block text-center">
                      Order placed successfully
                    </span>
                    <div className="fs-6 fw-semibold text-center">
                      #{newOrderNumber || existingOrderDetails.orderNumber}
                    </div>
                    <p className="text-dark text-center mb-4">
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
              </div>
            </div>
          </div>
        )}

        {showNewOrderModal && (
          <div className="popup-overlay">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="container">
                <div className="modal-content">
                  <div className="p-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 fw-semibold text-dark">
                        Create New Order
                      </h5>
                      <button
                        className="btn p-0 fs-3 text-dark"
                        onClick={() => setShowNewOrderModal(false)}
                      >
                        <i className="fa-solid fa-xmark gray-text font_size_14 pe-3"></i>
                      </button>
                    </div>
                  </div>

                  <div className="p-3">
                    <p className="text-center mb-4 text-dark">
                      No ongoing order found. <br />
                      Would you like to create a new order?
                    </p>

                    <button
                      className="btn btn-success rounded-pill w-100 py-2 text-white"
                      onClick={handleCreateOrder}
                    >
                      Create Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showCouponModal && (
          <div className="popup-overlay">
            <div
              className="modal-dialog modal-dialog-centered"
              style={{ maxWidth: "350px" }}
            >
              <div className="modal-content">
                <div className="modal-header ps-3 pe-2">
                  <div className="modal-title font_size_16 fw-medium mb-0 text-dark">
                    Apply Coupon
                  </div>
                  <button
                    className="btn p-0 fs-3 gray-text"
                    onClick={() => {
                      setShowCouponModal(false);
                      setCouponError("");
                      setCouponCode("");
                    }}
                  >
                    {/* <i className="fa-solid fa-xmark text-dark font_size_14 pe-3"></i> */}
                  </button>
                </div>

                <div className="modal-body py-3 px-3">
                  <div className="form-group">
                    <input
                      type="text"
                      className={`form-control rounded-pill ${
                        couponError ? "is-invalid" : ""
                      }`}
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError("");
                      }}
                    />
                    {couponError && (
                      <div className="invalid-feedback">{couponError}</div>
                    )}
                  </div>

                  <div className="d-grid gap-2 mt-3">
                    <button
                      className="btn btn-primary rounded-pill"
                      onClick={handleApplyCoupon}
                    >
                      Apply
                    </button>
                    {appliedCoupon && (
                      <button
                        className="btn btn-outline-danger rounded-pill"
                        onClick={() => {
                          setAppliedCoupon(null);
                          setCouponCode("");
                          setShowCouponModal(false);
                        }}
                      >
                        Remove Applied Coupon
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showScanner && (
          <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header border-bottom">
                  <h5 className="modal-title h6">Scan QR Code</h5>
                  <button 
                    type="button" 
                    className="btn-close"
                    onClick={stopCamera}
                    aria-label="Close"
                  ></button>
                </div>
                
                <div className="modal-body p-0 bg-dark position-relative">
                  <video
                    ref={videoRef}
                    className="w-100"
                    style={{ height: '300px', objectFit: 'cover' }}
                    autoPlay
                    playsInline
                  />
                  {/* Scanning overlay */}
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <div 
                      className="border border-2 border-primary"
                      style={{
                        width: '200px',
                        height: '200px',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }}
                    >
                      <div className="w-100 h-100 position-relative">
                        {/* Corner markers */}
                        <div className="position-absolute top-0 start-0 border-primary" 
                             style={{ width: '20px', height: '20px', borderLeft: '3px solid', borderTop: '3px solid' }}></div>
                        <div className="position-absolute top-0 end-0 border-primary" 
                             style={{ width: '20px', height: '20px', borderRight: '3px solid', borderTop: '3px solid' }}></div>
                        <div className="position-absolute bottom-0 start-0 border-primary" 
                             style={{ width: '20px', height: '20px', borderLeft: '3px solid', borderBottom: '3px solid' }}></div>
                        <div className="position-absolute bottom-0 end-0 border-primary" 
                             style={{ width: '20px', height: '20px', borderRight: '3px solid', borderBottom: '3px solid' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer border-top">
                  <button 
                    type="button" 
                    className="btn btn-secondary rounded-pill px-4"
                    onClick={stopCamera}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="m-3">
          <div className="dz-flex-box">
            <div className="dz-flex-box mt-2">
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <Link
                    key={index}
                    to={`/user_app/ProductDetails/${item.menu_id}`}
                    state={{ menu_cat_id: item.menu_cat_id }}
                  >
                    <div className="card rounded-4 my-1">
                      <div className="card-body py-2 rounded-4 px-0">
                        <div className="row">
                          <div className="row">
                            <div className="col-7 pe-0">
                              <span className="mb-0 fw-medium ps-2 font_size_14">
                                {item.menu_name}
                              </span>
                            </div>
                            <div className="col-4 p-0 text-end">
                              {item.offer ? (
                                <>
                                  <span className="ms-0 me-2 text-info font_size_14 fw-semibold">
                                    ₹{item.discountedPrice}
                                  </span>
                                  <span className="gray-text font_size_12 fw-normal text-decoration-line-through">
                                    ₹{item.price}
                                  </span>
                                </>
                              ) : (
                                <span className="ms-0 me-2 text-info font_size_14 fw-semibold">
                                  ₹{item.price}
                                </span>
                              )}
                            </div>
                            <div className="col-1 text-end px-0">
                              <span>x {item.quantity}</span>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-8">
                              <div className="ps-2">
                                <div className="font_size_10 text-success">
                                  <i className="fa-solid fa-utensils text-success me-1"></i>
                                  {item.menu_cat_name}
                                </div>
                              </div>
                            </div>
                            {item.offer > 0 && (
                              <div className="col-4 text-end px-0">
                                <span className="ps-2 text-success font_size_10">
                                  {item.offer}% Off
                                </span>
                              </div>
                            )}
                          </div>
                          {item.comment && (
                            <p className="font_size_12 text-muted  mt-1 mb-0 ms-2">
                              <i className="fa-solid fa-comment-dots me-2"></i>{" "}
                              {item.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div>No items in the cart.</div>
              )}
            </div>
            <div className="card mx-auto rounded-4 mt-2">
              <div className="row px-2 py-1">
                <div className="col-12 px-2">
                  <div className="d-flex justify-content-between align-items-center py-1">
                    <span className="ps-2 font_size_14 fw-semibold">Total</span>
                    <span className="pe-2 font_size_14 fw-semibold">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                  <hr className=" p-0 m-0 text-primary" />
                </div>

                <div className="col-12 mb-0 pt-0 pb-1 px-2">
                  <div className="d-flex justify-content-between align-items-center py-0">
                    <span className="ps-2 font_size_14 gray-text">
                      Discount{" "}
                      <span className="gray-text small-number">
                        ({discountPercent}%)
                      </span>
                    </span>
                    <span className="pe-2 font_size_14 gray-text">
                      -₹{discount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="col-12 pt-0">
                  <div className="d-flex justify-content-between align-items-center py-0">
                    <span className="font_size_14 gray-text">
                      Total after discount
                    </span>
                    <span className="font_size_14 gray-text">
                      ₹{totalAfterDiscount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="col-12 pt-0 px-2">
                  <div className="d-flex justify-content-between align-items-center py-0">
                    <span className="ps-2 font_size_14 gray-text">
                      Service Charges{" "}
                      <span className="gray-text small-number">
                        ({serviceChargesPercent}%)
                      </span>
                    </span>
                    <span className="pe-2 font_size_14 gray-text">
                      ₹{serviceCharges.toFixed(2)}
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
                    <span className="pe-2 font_size_14 gray-text">
                      ₹{tax.toFixed(2)}
                    </span>
                  </div>

                  <div className="col-12 mb-0 py-1">
                    <div className="d-flex justify-content-between">
                      <div
                        className="col-1 d-flex align-items-center cursor-pointer"
                        onClick={handleScanQR}
                      >
                        <i className="bx bx-qr-scan fs-1"></i>
                      </div>
                      <div className="col-11">
                        <div className="my-2 w-100">
                          <div className="input-group">
                            <input
                              type="text"
                              style={{ height: "40px" }}
                              className={`form-control rounded-pill border border-2 border-light me-2 ${
                                couponError ? "is-invalid" : ""
                              }`}
                              placeholder="coupon"
                              value={couponCode}
                              onChange={(e) => {
                                const validatedValue = validateCouponInput(e.target.value);
                                setCouponCode(validatedValue);
                                setCouponError("");
                              }}
                              maxLength={10}
                            />
                            <button
                              className="btn btn-primary rounded-pill px-4 btn-sm"
                              style={{ height: "40px" }}
                              onClick={handleApplyCoupon}
                            >
                              {appliedCoupon ? "Applied" : "Apply"}
                            </button>
                          </div>
                          {couponError && (
                            <div className="text-danger small mt-1">
                              {couponError}
                            </div>
                          )}
                          {appliedCoupon && (
                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <span className="text-success">
                                <i className="fa-solid fa-check-circle me-1"></i>
                                Coupon {appliedCoupon.code} applied
                              </span>
                              <button
                                className="btn btn-link text-danger p-0 small"
                                onClick={() => {
                                  setAppliedCoupon(null);
                                  setCouponCode("");
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="p-0  text-primary mb-2 mt-1" />
                </div>

                <div className="col-12 px-2">
                  <div className="d-flex justify-content-between align-items-center py-1 fw-medium pb-0 mb-0">
                    <span className="ps-2 fs-6 fw-semibold">Grand Total</span>
                    <span className="pe-2 fs-6 fw-semibold">
                      ₹{grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={handlePlaceOrder}
                className="btn btn-success rounded-pill text-white"
              >
                Place Order
                <span className="small-number gray-text ps-1">
                  ({cartItems.length} Items)
                </span>
              </button>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-center mt-3">
              <div className="d-flex align-items-center justify-content-center">
                <Link
                  to="/user_app/Menu"
                  className="btn btn-outline-primary rounded-pill px-3"
                >
                  <i className="ri-add-circle-line me-1 fs-4"></i> Order More
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-0">
          {/* <NearbyArea /> */}
          {/* <RestaurantSocials /> */}
          <RestaurantSocials />
        </div>
      </main>

      <Bottom />
    </div>
  );
};

export default Checkout;
