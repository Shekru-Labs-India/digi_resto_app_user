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
import config from "../component/config";
import axios from "axios";
import RestaurantSocials from "../components/RestaurantSocials.jsx";
const Checkout = () => {
  const navigate = useNavigate();
  const { restaurantId, restaurantName } = useRestaurantId();
  const { clearCart, removeFromCart } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user_id, setUser_id] = useState(null);
  const [role, setRole] = useState(null);
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
      userData?.user_id || localStorage.getItem("user_id");
    const currentCustomerType =
      userData?.role || localStorage.getItem("role");

    setIsLoggedIn(!!currentCustomerId);
    setUser_id(currentCustomerId);
    setRole(currentCustomerType);
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const currentCustomerId =
      userData?.user_id || localStorage.getItem("user_id");
    const cartId = getCartId();

    // if (!cartId || !currentCustomerId || !restaurantId) {
    //   return;
    // }

    fetchCartDetails();
  }, []);

  const fetchCartDetails = () => {
    try {
      const storedCart = localStorage.getItem('restaurant_cart_data');
      if (storedCart) {
        const cartData = JSON.parse(storedCart);
        
        // Calculate totals
        const total = cartData.order_items.reduce((sum, item) => 
          sum + (item.price * item.quantity), 0
        );

        const serviceChargesPercent = 5;
        const gstPercent = 5;
        const serviceCharges = (total * serviceChargesPercent) / 100;
        const tax = (total * gstPercent) / 100;
        const discount = 0;
        const totalAfterDiscount = total - discount;
        const grandTotal = totalAfterDiscount + serviceCharges + tax;

        // Map items to match API structure
        const mappedItems = cartData.order_items.map(item => ({
          ...item,
          discountedPrice: item.offer ? Math.floor(item.price * (1 - item.offer / 100)) : item.price,
          menu_cat_name: item.category_name || "Food",
          menu_id: item.id,
          quantity: item.quantity,
          price: item.price,
          offer: item.offer || 0
        }));

        // Update all states
        setCartItems(mappedItems);
        setTotal(total);
        setServiceChargesPercent(serviceChargesPercent);
        setServiceCharges(serviceCharges);
        setGstPercent(gstPercent);
        setTax(tax);
        setDiscountPercent(0);
        setDiscount(discount);
        setGrandTotal(grandTotal);
        setTotalAfterDiscount(totalAfterDiscount);
        setCartId(cartData.cart_id || Date.now()); // Generate temporary cart ID if none exists
      }
    } catch (error) {
      console.error('Error fetching cart details:', error);
    }
  };

  useEffect(() => {
    const storedRestaurantCode = localStorage.getItem("restaurantCode");
    if (storedRestaurantCode) {
      setRestaurantCode(storedRestaurantCode);
    }
    // fetchCartDetails();
  }, [restaurantId, user_id]);

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
      const userData = JSON.parse(localStorage.getItem("userData"));
      const storedCart = localStorage.getItem('restaurant_cart_data');

      if (!userData?.user_id) {
        window.showToast("error", "Please login to place order");
        return;
      }

      setIsProcessing(true); // Show loading state

      // Check for existing order
      const response = await fetch(`${config.apiDomain}/user_api/check_order_exist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userData.user_id,
          restaurant_id: restaurantId,
        }),
      });

      const data = await response.json();
      setIsProcessing(false);

      if (data.st === 1) {
        if (data.order_number) {
          // Existing order found - show existing order modal
          setExistingOrderDetails({
            orderNumber: data.order_number,
            orderStatus: data.order_status,
            orderId: data.order_id,
            orderType: data.order_type,
            grand_total: data.grand_total
          });
          setShowExistingOrderModal(true);
        } else {
          // No existing order - show order type selection
          setShowOrderTypeModal(true);
        }
      } else {
        throw new Error(data.msg || "Failed to check order status");
      }
    } catch (error) {
      setIsProcessing(false);
      window.showToast("error", "Failed to process order");
      console.error('Error:', error);
    }
  };

  const handleOrderTypeSelection = (orderType) => {
    setSelectedOrderType(orderType);
    if (pendingOrderAction) {
      handleOrderAction(pendingOrderAction, orderType);
    } else {
      handleCreateOrder(orderType);
    }
  };

  const handleCreateOrder = async (orderType) => {
    try {
      setIsProcessing(true); // Add loading state
      const userData = JSON.parse(localStorage.getItem("userData"));
      const storedCart = JSON.parse(localStorage.getItem('restaurant_cart_data'));

      if (!storedCart?.order_items) {
        window.showToast("error", "No items in cart");
        setIsProcessing(false);
        return;
      }

      const requestBody = {
        user_id: userData.user_id,
        restaurant_id: restaurantId,
        table_number: localStorage.getItem("tableNumber") || userData?.tableNumber || "1",
        section_id: userData?.sectionId || "1",
        order_type: orderType,
        order_items: storedCart.order_items.map(item => ({
          menu_id: item.menu_id,
          quantity: item.quantity,
          comment: item.comment || "",
          half_or_full: item.half_or_full || "full"
        }))
      };

      const response = await fetch(
        `${config.apiDomain}/user_api/create_order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody)
        }
      );

      const data = await response.json();

      if (response.ok && data.st === 1) {
        window.showToast("success", "Order placed successfully");
        setNewOrderNumber(data.order_number);
        clearCartData();
        setShowOrderTypeModal(false);
        
        // Small delay to ensure toast is visible
        setTimeout(() => {
          navigate("/user_app/MyOrder/");
        }, 500);
      } else {
        throw new Error(data.msg || "Failed to create order");
      }
    } catch (error) {
      window.showToast("error", error.message || "Failed to create order");
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearCartData = () => {
    clearCart(); // Clear cart context
    localStorage.removeItem("cartItems"); // Clear cart items from localStorage
    localStorage.removeItem("cartId"); // Clear cart ID from localStorage
    setCartItems([]); // Clear cart items state if you're using it
  };

  const handleOrderAction = async (orderStatus, orderType, paymentMethod = null) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const storedCart = JSON.parse(localStorage.getItem('restaurant_cart_data'));
      
      if (!existingOrderDetails.orderNumber) {
        throw new Error("Invalid order number");
      }

      const requestBody = {
        order_number: existingOrderDetails.orderNumber,
        user_id: userData.user_id,
        order_status: orderStatus,
        restaurant_id: restaurantId,
        table_number: userData?.tableNumber || "1",
        section_id: userData?.sectionId || "1",
        order_type: orderType,
        order_items: storedCart.order_items.map(item => ({
          menu_id: item.menu_id,
          quantity: item.quantity,
          comment: item.comment || "",
          half_or_full: item.half_or_full || "full"
        }))
      };

      if (orderStatus === "completed" && paymentMethod) {
        requestBody.payment_method = paymentMethod;
      }

      const response = await fetch(
        `${config.apiDomain}/user_api/complete_or_cancle_existing_order_create_new_order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody)
        }
      );

      const data = await response.json();

      if (data.st === 1) {
        setShowOrderTypeModal(false);
        setPendingOrderAction(null);
        clearCartData();
        if (data.data?.new_order_number) {
          setNewOrderNumber(data.data.new_order_number);
          setShowPopup(true);
          navigate(`/user_app/MyOrder/`);
        } else {
        }
      } else {
        throw new Error(data.msg);
      }
    } catch (error) {
      window.showToast("error", error.message || "Failed to process order");
      console.error('Error:', error);
    }
  };

  const handleAddToExistingOrder = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const storedCart = JSON.parse(localStorage.getItem('restaurant_cart_data'));

      if (!storedCart?.order_items || !existingOrderDetails.orderId) {
        window.showToast("error", "Failed to add items to order");
        return;
      }

      // Prepare request body with exact structure needed by the API
      const requestBody = {
        order_id: existingOrderDetails.orderId,
        user_id: userData.user_id,
        restaurant_id: restaurantId,
        order_items: storedCart.order_items.map(item => ({
          menu_id: item.menu_id,
          quantity: item.quantity,
          half_or_full: item.half_or_full || "full",
          comment: item.comment || ""
        }))
      };

      // Make API call to add items to existing order
      const response = await fetch(
        `${config.apiDomain}/user_api/add_to_existing_order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody)
        }
      );

      const data = await response.json();

      if (data.st === 1) {
        window.showToast("success", "Items added to order successfully");
        clearCartData();
        setShowExistingOrderModal(false);
        navigate('/user_app/MyOrder');
      } else {
        throw new Error(data.msg || "Failed to add items to order");
      }
    } catch (error) {
      window.showToast("error", error.message || "Failed to add items to order");
      console.error('Error:', error);
    }
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

  const initiatePayment = async (method, paymentUrl, setProcessing, timeoutKey) => {
    try {
      await handleOrderAction("completed", existingOrderDetails.orderType, method);
      
      if (paymentUrl) {
        window.location.href = paymentUrl;
        timeoutRef.current[timeoutKey] = setTimeout(() => {
          if (!document.hidden) {
            window.showToast("error", `No ${method} app found`);
          }
          setProcessing(false);
        }, 3000);
      } else {
        window.showToast("success", `Payment initiated successfully`);
        setProcessing(false);
      }
    } catch (error) {
      window.showToast("error", "Payment processing failed");
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
          icon: "fa-solid fa-egg",
          border: "gray-text",
          textColor: "gray-text", // Changed to green for category name
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
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [coupons, setCoupons] = useState([]);

  const fetchCoupons = async () => {
    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/get_all_coupons_by_restaurant_id`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1) {
        setCoupons(data.coupons);
      } else {
        window.showToast("error", "Failed to fetch coupons");
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      window.showToast("error", "Error fetching coupons");
    }
  };

  const [cartDetails, setCartDetails] = useState({
    total_bill: 0,
    discount_percent: 0,
    discount_amount: 0,
    grand_total: 0,
    service_charges_amount: 0,
    service_charges_percent: 0,
    gst_amount: 0,
    gst_percent: 0,
    total_after_discount: 0,
    order_items: [],
  });

  const handleApplyCoupon = async () => {
    if (!selectedCoupon) {
      window.showToast("error", "Please enter a coupon code");
      return;
    }

    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/verify_coupon`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            coupon_name: selectedCoupon,
            total_price: cartDetails.total_bill.toString(),
          }),
        }
      );

      const data = await response.json();

      if (data.st === 1) {
        setCartDetails((prevCart) => ({
          ...prevCart,
          discount_percent: data.discount_percent,
          discount_amount: prevCart.total_bill - data.discounted_price,
          grand_total: data.discounted_price,
          total_after_discount: data.discounted_price,
        }));

        window.showToast("success", data.msg || "Coupon applied successfully");
        setShowCouponModal(false);
      } else {
        window.showToast("error", data.msg || "Invalid coupon code");
      }
    } catch (error) {
      console.error("Error verifying coupon:", error);
      window.showToast("error", "Failed to verify coupon");
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

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem('restaurant_cart_data');
    if (storedCart) {
      try {
        const cartData = JSON.parse(storedCart);
        setCartItems(cartData.order_items || []);
      } catch (error) {
        console.error('Error parsing cart data:', error);
        setCartItems([]);
      }
    }
  }, []);

  const fetchCheckoutDetails = async () => {
    try {
      setLoading(true);
      const storedCart = localStorage.getItem('restaurant_cart_data');
      if (!storedCart) {
        setError("Add menus to order first");
        return;
      }

      const cartData = JSON.parse(storedCart);
      const response = await axios.post(
        `${config.apiDomain}/user_api/get_checkout_detail`,
        {
          order_items: cartData.order_items,
          restaurant_id: userData.restaurantId
        }
      );

      if (response.data.st === 1) {
        setCheckoutDetails(response.data);
        setCartItems(cartData.order_items);
      }
    } catch (err) {
      console.error('Error fetching checkout details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Call API on mount
  useEffect(() => {
    fetchCheckoutDetails();
  }, []);

  const incrementQuantity = async (menuItem) => {
    try {
      const storedCart = localStorage.getItem('restaurant_cart_data');
      if (storedCart) {
        const cartData = JSON.parse(storedCart);
        const updatedItems = cartData.order_items.map(item => {
          if (item.menu_id === menuItem.menu_id) {
            // Check if quantity would exceed 20
            if (item.quantity >= 20) {
              window.showToast("info", "Maximum quantity limit reached (20)");
              return item;
            }
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
        
        const updatedCart = { ...cartData, order_items: updatedItems };
        localStorage.setItem('restaurant_cart_data', JSON.stringify(updatedCart));
        await fetchCheckoutDetails(); // Fetch updated totals
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const decrementQuantity = async (menuItem) => {
    try {
      const storedCart = localStorage.getItem('restaurant_cart_data');
      if (storedCart) {
        const cartData = JSON.parse(storedCart);
        let updatedItems = cartData.order_items.map(item => 
          item.menu_id === menuItem.menu_id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ).filter(item => item.quantity > 0);
        
        const updatedCart = { ...cartData, order_items: updatedItems };
        localStorage.setItem('restaurant_cart_data', JSON.stringify(updatedCart));
        await fetchCheckoutDetails(); // Fetch updated totals
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (e, menuId) => {
    window.showToast("success", `Menu is removed.`);
    e.preventDefault();
    e.stopPropagation();
    try {
      const storedCart = localStorage.getItem('restaurant_cart_data');
      if (storedCart) {
        const cartData = JSON.parse(storedCart);
        const updatedItems = cartData.order_items.filter(item => item.menu_id !== menuId);
        
        if (updatedItems.length === 0) {
          // If no items left, clear cart data completely
          localStorage.removeItem('restaurant_cart_data');
          setCartItems([]); // Update state to trigger re-render
          setCheckoutDetails(null); // Reset checkout details
        } else {
          // Update cart with remaining items
          const updatedCart = { ...cartData, order_items: updatedItems };
          localStorage.setItem('restaurant_cart_data', JSON.stringify(updatedCart));
        }
        
        await fetchCheckoutDetails(); // This will handle empty cart case
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const [checkoutDetails, setCheckoutDetails] = useState({
    total_bill_amount: 0,
    total_bill_with_discount: 0,
    service_charges_percent: 0,
    service_charges_amount: 0,
    gst_percent: 0,
    gst_amount: 0,
    discount_percent: 0,
    discount_amount: 0,
    grand_total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const storedCart = localStorage.getItem('restaurant_cart_data');
      if (!storedCart) return;

      const cartData = JSON.parse(storedCart);
      const response = await axios.post(
        `${config.apiDomain}/user_api/get_checkout_detail`,
        {
          order_items: cartData.order_items,
          restaurant_id: restaurantId
        }
      );

      if (response.data.st === 1) {
        setCheckoutDetails(response.data);
        // Proceed with checkout process
        handlePlaceOrder();
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      window.showToast("error", "Failed to process checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper full-height">
      <Header title="Checkout" count={cartItems.length} />

      <main className="page-content mb-5 pb-3">
        <div className="container py-0 my-0">
          <HotelNameAndTable
            restaurantName={restaurantName}
            tableNumber={userData?.tableNumber || "1"}
          />
        </div>

        {showOrderTypeModal && (
          <div className="popup-overlay">
            <div className="modal-dialog w-75">
              <div className="modal-content">
                <div className="modal-header ps-3 pe-2">
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <div className="modal-title font_size_16 fw-medium mb-0 text-dark">
                      Select Order Type
                    </div>
                    <button
                      className="btn p-0 fs-3 gray-text"
                      onClick={() => setShowOrderTypeModal(false)}
                    >
                      <i className="fa-solid fa-xmark gray-text font_size_14 pe-3"></i>
                    </button>
                  </div>
                </div>

                <div className="modal-body py-2 px-3">
                  <div className="row g-3">
                    {/* Parcel Option */}
                    <div className="col-6">
                      <div
                        className="card h-100 border rounded-4 cursor-pointer"
                        onClick={() => handleOrderTypeSelection("Parcel")}
                      >
                        <div className="card-body d-flex justify-content-center align-items-center py-3">
                          <div className="text-center">
                            <i className="fa-solid fa-hand-holding-heart fs-2 mb-2 text-primary"></i>
                            <p className="mb-0 fw-medium">Parcel</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Drive-Through Option */}
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

                    {/* Dine-in Option */}
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
                            {availableTables > 0 && (
                              <small className="text-dark">
                                {availableTables} Tables Available
                              </small>
                            )}
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
                    {/* UPI Payment Button */}
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
                          Pay ₹{existingOrderDetails.grand_total} via Other UPI
                          Apps
                          <img
                            src="https://img.icons8.com/ios-filled/50/FFFFFF/bhim-upi.png"
                            width={45}
                            alt="UPI"
                          />
                        </>
                      )}
                    </button>

                    {/* PhonePe Button */}
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
                          Pay ₹{existingOrderDetails.grand_total} via PhonePe
                          <img
                            src="https://img.icons8.com/?size=100&id=OYtBxIlJwMGA&format=png&color=000000"
                            width={45}
                            alt="PhonePe"
                          />
                        </>
                      )}
                    </button>

                    {/* Google Pay Button */}
                    <button
                      className="btn text-white w-100 d-flex align-items-center justify-content-center gap-2"
                      style={{ backgroundColor: "#1a73e8" }}
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
                          Pay ₹{existingOrderDetails.grand_total} via Google Pay
                          <img
                            className="ms-2"
                            src="https://developers.google.com/static/pay/api/images/brand-guidelines/google-pay-mark.png"
                            width={45}
                            alt="Google Pay"
                          />
                        </>
                      )}
                    </button>

                    {/* Alternative Payment Methods */}
                    <div className="text-center mt-3">
                      <div>or make payment via:</div>
                    </div>
                    <div className="d-flex justify-content-center pt-2">
                      <button
                        type="button"
                        className="px-2 bg-white mb-2 me-4 rounded-pill py-1 text-dark border"
                        onClick={() => {
                          setProcessingPaymentMethod("card");
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
                          setProcessingPaymentMethod("cash");
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
          <div className="popup-overlay d-flex align-items-center justify-content-center min-vh-100">
            <div
              className="modal-dialog modal-dialog-centered"
              style={{ maxWidth: "350px" }}
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
                      onClick={() => handleOrderActionClick("cancelled")}
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
                          {/* Menu details row */}
                          <div className="row pe-2">
                            <div className="col-7 pe-0">
                              <span className="mb-0 fw-medium ps-2 font_size_14">
                                {item.menu_name}
                              </span>
                            </div>

                            <div className="col-5 text-end px-0">
                              <button
                                className="btn"
                                onClick={(e) =>
                                  handleRemoveItem(e, item.menu_id)
                                }
                                style={{
                                  padding: "4px 8px",
                                }}
                              >
                                <i className="fa-solid fa-times gray-text font_size_14"></i>
                              </button>
                            </div>
                            {/* <div className="col-1 text-end px-0">
                              <span>x {item.quantity}</span>
                            </div> */}
                          </div>
                          <div className="row">
                            <div className="col-6">
                              <div className="ps-2">
                                <div className="font_size_10 text-success">
                                  <i className="fa-solid fa-utensils text-success me-1"></i>
                                  {item.menu_cat_name || "category"}
                                </div>
                              </div>
                            </div>
                            {item.offer > 0 && (
                              <div className="col-6 text-end px-0">
                                <span className="ps-2 text-success font_size_10">
                                  {item.offer || "0"}% Off
                                </span>
                              </div>
                            )}
                          </div>
                          {item.comment && (
                            <p className="font_size_12 text-light mt-1 mb-0 ms-2">
                              <i className="fa-solid fa-comment-dots"></i>{" "}
                              {item.comment}
                            </p>
                          )}
                          {/* Quantity buttons at bottom right */}
                          <div className="row mt-2"></div>
                        </div>
                        <div className="row">
                          <div className="col-8 text-start">
                            {item.offer ? (
                              <>
                                <span className="ms-2 me-2 text-info font_size_14 fw-semibold">
                                  ₹{item.discountedPrice.toFixed(2)}
                                </span>
                                <span className="gray-text font_size_12 fw-normal text-decoration-line-through">
                                  ₹{item.price.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="ms-2 me-2 text-info font_size_14 fw-semibold">
                                ₹{item.price}
                              </span>
                            )}
                          </div>
                          <div className="col-4 d-flex justify-content-end pe-3">
                            <div className="dz-stepper style-3">
                              <div className="input-group bootstrap-touchspin bootstrap-touchspin-injected d-flex align-items-center justify-content-between w-100">
                                <span className="input-group-btn input-group-prepend">
                                  <button
                                    className="btn btn-primary bootstrap-touchspin-down"
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      decrementQuantity(item);
                                    }}
                                  >
                                    <i className="fa-solid fa-minus fs-6"></i>
                                  </button>
                                </span>
                                <span className="text-dark font_size_14 px-2">
                                  {item.quantity}
                                </span>
                                <span className="input-group-btn input-group-append">
                                  <button
                                    className="btn btn-primary bootstrap-touchspin-up"
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      incrementQuantity(item);
                                    }}
                                  >
                                    <i className="fa-solid fa-plus fs-6"></i>
                                  </button>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div></div>
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="card mx-auto rounded-4 mt-2">
                <div className="row px-2 py-1">
                  <div className="col-12 px-2">
                    <div className="d-flex justify-content-between align-items-center py-1">
                      <span className="ps-2 font_size_14 fw-semibold">
                        Total
                      </span>
                      <span className="pe-2 font_size_14 fw-semibold">
                        ₹{checkoutDetails.total_bill_amount}
                      </span>
                    </div>
                    <hr className="p-0 m-0 text-primary" />
                  </div>

                  <div className="col-12 mb-0 pt-0 pb-1 px-2">
                    <div className="d-flex justify-content-between align-items-center py-0">
                      <span className="ps-2 font_size_14 gray-text">
                        Discount{" "}
                        <span className="gray-text small-number">
                          ({checkoutDetails.discount_percent}%)
                        </span>
                      </span>
                      <span className="pe-2 font_size_14 gray-text">
                        -₹{checkoutDetails.discount_amount}
                      </span>
                    </div>
                  </div>

                  <div className="col-12 pt-0">
                    <div className="d-flex justify-content-between align-items-center py-0">
                      <span className="font_size_14 gray-text">
                        Total after discount
                      </span>
                      <span className="font_size_14 gray-text">
                        ₹{checkoutDetails.total_bill_with_discount}
                      </span>
                    </div>
                  </div>

                  <div className="col-12 pt-0 px-2">
                    <div className="d-flex justify-content-between align-items-center py-0">
                      <span className="ps-2 font_size_14 gray-text">
                        Service Charges{" "}
                        <span className="gray-text small-number">
                          ({checkoutDetails.service_charges_percent}%)
                        </span>
                      </span>
                      <span className="pe-2 font_size_14 gray-text">
                        ₹{checkoutDetails.service_charges_amount}
                      </span>
                    </div>
                  </div>

                  <div className="col-12 mb-0 py-1 px-2">
                    <div className="d-flex justify-content-between align-items-center py-0">
                      <span className="ps-2 font_size_14 gray-text">
                        GST{" "}
                        <span className="gray-text small-number">
                          ({checkoutDetails.gst_percent}%)
                        </span>
                      </span>
                      <span className="pe-2 font_size_14 gray-text">
                        ₹{checkoutDetails.gst_amount}
                      </span>
                    </div>

                    <div className="col-12 mb-0 py-1 px-2">
                      <div className="row align-items-center justify-content-center">
                        <div className="col-1 text-center">
                          <div
                            className="border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center"
                            style={{ height: "25px", width: "25px" }}
                          >
                            <i
                              className="fa-solid fa-list font_size_14 cursor-pointer"
                              onClick={() => {
                                setShowCouponModal(true);
                                fetchCoupons();
                              }}
                            ></i>
                          </div>
                        </div>
                        <div className="col-8 d-flex align-items-center px-3">
                          <input
                            type="text"
                            className="form-control form-control-sm rounded-pill border-primary"
                            placeholder="Enter coupon code"
                            value={selectedCoupon}
                            onChange={(e) => setSelectedCoupon(e.target.value)}
                          />
                        </div>
                        <div className="col-3 d-flex align-items-center ps-1">
                          <button
                            className="btn btn-sm btn-primary rounded-pill w-100"
                            onClick={handleApplyCoupon}
                          >
                            Apply
                          </button>
                        </div>
                        {couponError && (
                          <div className="col-12 text-center">
                            <div className="text-danger small mt-1">
                              {couponError}
                            </div>
                          </div>
                        )}
                        {appliedCoupon && (
                          <div className="col-12">
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
                          </div>
                        )}
                      </div>
                    </div>

                    <hr className="p-0  text-primary mb-2 mt-1" />
                  </div>

                  <div className="col-12 px-2">
                    <div className="d-flex justify-content-between align-items-center py-1 fw-medium pb-0 mb-0">
                      <span className="ps-2 fs-6 fw-semibold">Grand Total</span>
                      <span className="pe-2 fs-6 fw-semibold">
                        ₹{checkoutDetails.grand_total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {cartItems.length > 0 && (
              <div className="text-center mt-3">
                <button
                  onClick={handlePlaceOrder}
                  className="btn btn-success rounded-pill text-white px-4 py-2"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="d-flex align-items-center justify-content-center">
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Processing...
                    </div>
                  ) : (
                    <>
                      Place Order
                      <span className="small-number gray-text ps-1">
                        ({cartItems.length} Items)
                      </span>
                    </>
                  )}
                </button>
                <div className="d-flex flex-column align-items-center justify-content-center mt-3">
                  <div className="d-flex align-items-center justify-content-center">
                    <Link
                      to="/user_app/Menu"
                      className="btn btn-outline-primary rounded-pill px-3"
                    >
                      <i className="ri-add-circle-line me-1 fs-4"></i> Order
                      More
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {cartItems.length === 0 && (
              <div
                className="container overflow-hidden d-flex justify-content-center align-items-center"
                style={{ height: "78vh" }}
              >
                <div className="m-b20 dz-flex-box text-center">
                  <div className="dz-cart-about">
                    <h5 className=" ">Your cart is empty.</h5>
                    <p>Start ordering now!</p>
                    <Link
                      to="/user_app/Menu"
                      className="btn btn-outline-primary rounded-pill px-3"
                    >
                      <i className="ri-add-circle-line me-1 fs-4"></i> Order
                      More
                    </Link>
                  </div>
                </div>
              </div>
            )}
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
