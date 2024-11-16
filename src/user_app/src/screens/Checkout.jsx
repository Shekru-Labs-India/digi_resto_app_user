import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Bottom from "../component/bottom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import "../assets/css/custom.css";
import OrderGif from "../assets/gif/cooking.gif";
import { ThemeContext } from "../context/ThemeContext.js";
import Header from "../components/Header";
import HotelNameAndTable from "../components/HotelNameAndTable";
import NearbyArea from "../component/NearbyArea";
import { useCart } from "../context/CartContext";
import { Toast } from "primereact/toast";
import config from "../component/config";
import axios from 'axios';
const Checkout = () => {
  
  
  const navigate = useNavigate();
  const { restaurantId, restaurantName } = useRestaurantId();
  const { clearCart } = useCart();
  const toast = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [customerType, setCustomerType] = useState(null);

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
  
    if (!cartId || !currentCustomerId || !restaurantId) {
      return;
    }
  
    fetchCartDetails();
    
  }, [location]);
  
  const fetchCartDetails = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const currentCustomerId =
      userData?.customer_id || localStorage.getItem("customer_id");
    const cartId = getCartId();
  
    if (!cartId || !currentCustomerId || !restaurantId) {
      
      return;
    }
  
    try {
      const response = await axios.post(
       `${config.apiDomain}/user_api/get_cart_detail`,
        {
          cart_id: cartId,
          customer_id: currentCustomerId,
          restaurant_id: restaurantId,
        }
      );
  
      if (response.data.st === 1) {
        const data = response.data;
        setCartItems(data.order_items);
        setTotal(parseFloat(data.total_bill));
        setServiceChargesPercent(parseFloat(data.service_charges_percent));
        setServiceCharges(parseFloat(data.service_charges_amount));
        setGstPercent(parseFloat(data.gst_percent));
        setTax(parseFloat(data.gst_amount));
        setDiscountPercent(parseFloat(data.discount_percent));
        setDiscount(parseFloat(data.discount_amount));
        setGrandTotal(parseFloat(data.grand_total));
        setCartId(data.cart_id); // Store the cart ID for future use
      } else {
        console.error("Failed to fetch cart details:", response.data.msg);
        
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

      if (response.ok) {
        if (data.st === 1) {
          if (data.order_number === null && data.order_status === null) {
            // Show the modal for creating a new order
            setShowNewOrderModal(true);
          } else if (
            data.order_status === "ongoing" ||
            data.order_status === "placed"
          ) {
            // Store the order details, including order_id
            setExistingOrderDetails({
              orderNumber: data.order_number,
              orderStatus: data.order_status,
              orderId: data.order_id,
            });
            setShowExistingOrderModal(true);
          }
        } else if (data.st === 2) {
          
        } else {
          throw new Error("Failed to check order status");
        }
      } else {
        throw new Error("Failed to check order status");
      }
    } catch (error) {
      
    }
  };

  const handleCreateOrder = async () => {
    if (!cartId || !customerId || !restaurantId) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Missing required data to create an order",
        life: 3000,
      });
      return;
    }

    try {
      const response = await fetch(`${config.apiDomain}/user_api/create_order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart_id: cartId,
          customer_id: customerId,
          restaurant_id: restaurantId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.st === 1) {
        clearCartData();
        setShowNewOrderModal(false);
        await fetchCartDetails();
        navigate(`/user_app/MyOrder/`);
      } else {
        throw new Error(data.msg || "Failed to create order");
      }
    } catch (error) {
     
    }
  };

  const clearCartData = () => {
    clearCart(); // Clear cart context
    localStorage.removeItem("cartItems"); // Clear cart items from localStorage
    localStorage.removeItem("cartId"); // Clear cart ID from localStorage
    setCartItems([]); // Clear cart items state if you're using it
  };

  const handleOrderAction = async (orderStatus) => {
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
      return;
    }

    try {
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
            order_status: orderStatus, // Pass the order status dynamically
          }),
        }
      );

      const data = await response.json();

      if ( data.st === 1) {
        // Store the new order number from the API response
        const newOrderNumber = data.data.new_order_number;

        // Show success popup
        setShowPopup(true);
        setShowExistingOrderModal(false);
        clearCartData();
        setNewOrderNumber(newOrderNumber);
await fetchCartDetails()
        // Store the new order number in state or localStorage for navigation
        setNewOrderNumber(newOrderNumber); // Assuming you have a state for this
      } else {
        throw new Error(data.msg || "Failed to update order");
      }
    } catch (error) {
    
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
        throw new Error(
          data.msg || "Failed to add items to the existing order"
        );
      }
    } catch (error) {
     
    }
  };

  const closePopup = () => {
    setShowPopup(false);

    const orderNumber = newOrderNumber
      ? newOrderNumber
      : existingOrderDetails.orderNumber;

    // navigate(`/user_app/TrackOrder/${orderNumber}`);
    navigate(`/user_app/MyOrder/`);
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

        {showExistingOrderModal && (
          <div className="popup-overlay">
            <div className="popup-content rounded-4">
              <div className="p-2 pb-2 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="mb-0 fs-5 fw-semibold text-muted text-start">
                    Existing Order Found
                  </span>
                  <button
                    className="btn p-0 fs-3 text-muted"
                    onClick={() => setShowExistingOrderModal(false)}
                  >
                    <i className="ri-close-line text-muted"></i>
                  </button>
                </div>
              </div>

              <div className="py-3">
                <p className="text-center mb-4 text-muted">
                  You have an ongoing order (#{existingOrderDetails.orderNumber}
                  ). Would you like to add to this order or create a new one?
                </p>

                <div className="d-flex flex-column gap-2">
                  <button
                    className="btn btn-danger rounded-pill w-100 py-2"
                    onClick={() => handleOrderAction("cancle")}
                  >
                    Cancel Existing & Create New Order
                  </button>
                  <button
                    className="btn btn-success rounded-pill w-100 py-2"
                    onClick={() => handleOrderAction("completed")}
                  >
                    Complete Existing & Create New Order
                  </button>
                  <button
                    className="btn btn-info rounded-pill w-100 py-2"
                    onClick={handleAddToExistingOrder}
                  >
                    Add to Existing Order
                  </button>
                  <button
                    className="btn btn-outline-secondary rounded-pill w-100 py-2"
                    onClick={() => setShowExistingOrderModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content rounded-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fs-6 fw-semibold">Success</span>
                <button
                  className="btn-close"
                  onClick={() => setShowPopup(false)}
                ></button>
              </div>
              <div className="circle">
                <img src={OrderGif} alt="Order Success" className="popup-gif" />
              </div>
              <span className="text-dark my-2 d-block text-center">
                Order placed successfully
              </span>
              <div className="fs-6 fw-semibold">#{newOrderNumber||existingOrderDetails.orderNumber}</div>
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

        {showNewOrderModal && (
          <div className="popup-overlay">
            <div className="popup-content rounded-4">
              <div className="p-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-semibold text-muted">
                    Create New Order
                  </h5>
                  <button
                    className="btn p-0 fs-3 text-muted"
                    onClick={() => setShowNewOrderModal(false)}
                  >
                    <i className="ri-close-line text-muted"></i>
                  </button>
                </div>
              </div>

              <div className="p-3">
                <p className="text-center mb-4 text-muted">
                  No ongoing order found. Would you like to create a new order?
                </p>

                <button
                  className="btn btn-success rounded-pill w-100 py-2"
                  onClick={handleCreateOrder}
                >
                  Create Order
                </button>
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
                        <div className="col-7 pe-0 ">
                          <span className="mb-0 fw-medium ps-2 font_size_14">
                            {item.menu_name}
                          </span>
                        </div>
                        <div className="col-4 p-0 text-end">
                          <span className="ms-0 me-2 text-info font_size_14 fw-semibold">
                            ₹{item.price}
                          </span>
                          <span className="gray-text font_size_12 fw-normal text-decoration-line-through">
                            ₹ {item.oldPrice || item.price}
                          </span>
                        </div>
                        <div className="col-1 text-end px-0">
                          <span>x {item.quantity}</span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-8">
                          <div className="ps-2">
                            <span className="text-success font_size_10">
                              <i className="ri-restaurant-line me-2"></i>
                              {item.menu_cat_name}
                            </span>
                          </div>
                        </div>
                        <div className="col-4 text-end px-0">
                          <span className="ps-2 text-success font_size_10">
                            {item.offer || "No"}% Off
                          </span>
                        </div>
                      </div>
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
              <hr className="me-0 p-0 m-0 text-primary" />
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
            </div>
            <div className="col-12 mb-0 pt-0 pb-1 px-2">
              <div className="d-flex justify-content-between align-items-center py-0 pb-2">
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
              <hr className="me-0 p-0 m-0 text-primary" />
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
        <div className="d-flex align-items-center justify-content-center mt-3">
          <Link
            to="/user_app/Menu"
            className="btn btn-outline-primary rounded-pill px-3"
          >
            <i className="ri-add-circle-line me-1 fs-4"></i> Order More
          </Link>
        </div>
      </div>
    </div>

        <div className="container py-0">
          <NearbyArea />
        </div>
      </main>

      <Bottom />
    </div>
  );
};

export default Checkout;
