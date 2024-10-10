import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Bottom from "../component/bottom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import "../assets/css/custom.css";
import OrderGif from "../assets/gif/order_success.gif";
import { ThemeContext } from "../context/ThemeContext.js"; // Adjust the import path as needed

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

  const userData = JSON.parse(localStorage.getItem("userData"));
  const customerId = userData ? userData.customer_id : null;
  const tableNumber = userData ? userData.tableNumber : null; // Retrieve table_number
  console.log("Customer ID:", customerId);
  console.log("Table Number:", tableNumber); // Log the table number

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
      alert("Missing cart, customer, or restaurant data.");
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
        // Calculate old price for each item
        const updatedOrderItems = data.order_items.map((item) => ({
          ...item,
          oldPrice: Math.floor(item.price * 1.1), // Old price calculation
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
      } else {
        console.error("Failed to fetch cart details:", data.msg);
        alert(`Error: ${data.msg}`);
      }
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  };

  useEffect(() => {
    console.log(
      "useEffect triggered, restaurantId:",
      restaurantId,
      "customerId:",
      customerId
    );
    fetchCartDetails();
  }, [restaurantId, customerId]);

  const handleNotesChange = (e) => {
    const value = e.target.value;
    const regex = /^[a-zA-Z0-9\s.]*$/; // Only allow alphanumeric characters, spaces, and dots // Only allow alphanumeric characters and spaces, no dots // Only allow alphanumeric characters and spaces

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
    const orderItems = cartItems.map((item) => ({
      menu_id: item.menu_id,
      quantity: item.quantity,
    }));

    // Capture the current system time
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Ensure local time zone is used
    });

    const orderData = {
      customer_id: customerId,
      restaurant_id: restaurantId,
      cart_id: getCartId(),
      note: notes,
      order_items: orderItems,
      table_number: tableNumber, // Use tableNumber from userData
      order_time: formattedTime, // Add the current time to the order data
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

      if (response.ok) {
        setShowPopup(true);
        localStorage.removeItem("cartItems"); // Clear cart items from local storage
      } else {
        throw new Error(responseData.msg || "Failed to submit order");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      alert(`Failed to submit order: ${error.message}`);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate("/MyOrder");
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
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className={`page-wrapper ${sidebarOpen ? "sidebar-open" : ""}`}>
            <header className="header header-fixed pt-2">
              <div className="header-content d-flex justify-content-between">
                <div className="left-content">
                  <Link
                    to=""
                    className="back-btn dz-icon icon-sm"
                    onClick={() => navigate(-1)}
                  >
                    <i className="ri-arrow-left-line fs-2"></i>
                  </Link>
                </div>
                <div className="mid-content">
                  <h5 className="custom_font_size_bold pe-3">Checkout</h5>
                </div>
                <div className="right-content gap-1">
                  <div className="menu-toggler" onClick={toggleSidebar}>
                    {isLoggedIn ? (
                      <i className="ri-menu-line fs-1"></i>
                    ) : (
                      <Link to="/Signinscreen">
                        <i className="ri-login-circle-line fs-1"></i>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </header>

            {/* Dark overlay for sidebar */}
            <div
              className={`dark-overlay ${
                sidebarOpen ? "dark-overlay active" : ""
              }`}
              onClick={toggleSidebar}
            ></div>

            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? "sidebar show" : ""}`}>
              <div className="author-box">
                <div className="d-flex justify-content-start align-items-center m-0">
                  <i
                    className={
                      userData && userData.customer_id
                        ? "ri-user-3-fill fs-3"
                        : "ri-user-3-line fs-3"
                    }
                  ></i>
                </div>
                <div className="custom_font_size_bold">
                  <span className="ms-3 pt-4">
                    {userData?.name
                      ? `Hello, ${toTitleCase(getFirstName(userData.name))}`
                      : "Hello, User"}
                  </span>
                  <div className="mail ms-3 gray-text custom_font_size_bold">
                    {userData?.mobile}
                  </div>
                  <div className="dz-mode mt-3 me-4">
                    <div className="theme-btn" onClick={toggleTheme}>
                      <i
                        className={`ri ${
                          isDarkMode ? "ri-sun-line" : "ri-moon-line"
                        } sun`}
                      ></i>
                      <i
                        className={`ri ${
                          isDarkMode ? "ri-moon-line" : "ri-sun-line"
                        } moon`}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
              <ul className="nav navbar-nav">
                <li>
                  <Link className="nav-link active" to="/Menu">
                    <span className="dz-icon icon-sm">
                      <i className="ri-bowl-line fs-3"></i>
                    </span>
                    <span className="custom_font_size_bold">Menu</span>
                  </Link>
                </li>
                <li>
                  <Link className="nav-link active" to="/Category">
                    <span className="dz-icon icon-sm">
                      <i className="ri-list-check-2 fs-3"></i>
                    </span>
                    <span className="custom_font_size_bold">Category</span>
                  </Link>
                </li>
                <li>
                  <Link className="nav-link active" to="/Wishlist">
                    <span className="dz-icon icon-sm">
                      <i className="ri-heart-2-line fs-3"></i>
                    </span>
                    <span className="custom_font_size_bold">Favourite</span>
                  </Link>
                </li>
                <li>
                  <Link className="nav-link active" to="/MyOrder">
                    <span className="dz-icon icon-sm">
                      <i className="ri-drinks-2-line fs-3"></i>
                    </span>
                    <span className="custom_font_size_bold">My Orders</span>
                  </Link>
                </li>
                <li>
                  <Link className="nav-link active" to="/Cart">
                    <span className="dz-icon icon-sm">
                      <i className="ri-shopping-cart-line fs-3"></i>
                    </span>
                    <span className="custom_font_size_bold">Cart</span>
                  </Link>
                </li>
                <li>
                  <Link className="nav-link active" to="/Profile">
                    <span className="dz-icon icon-sm">
                      <i
                        className={
                          userData && userData.customer_id
                            ? "ri-user-3-fill fs-3"
                            : "ri-user-3-line fs-3"
                        }
                      ></i>
                    </span>
                    <span className="custom_font_size_bold">Profile</span>
                  </Link>
                </li>
              </ul>
              {/* <div className="dz-mode mt-4 me-4">
          <div className="theme-btn" onClick={toggleTheme}>
            <i
              className={`ri ${
                isDarkMode ? "ri-sun-line" : "ri-moon-line"
              } sun`}
            ></i>
            <i
              className={`ri ${
                isDarkMode ? "ri-moon-line" : "ri-sun-line"
              } moon`}
            ></i>
          </div>
        </div> */}
              <div className="sidebar-bottom"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="page-content space-top p-b90">
        <div className="container">
          <div className="dz-flex-box">
            <ul className="dz-list-group">
              <div className="mb-3">
                <label
                  className="custom_font_size_bold pb-2 ps-2"
                  htmlFor="notes"
                >
                  Additional Notes:
                </label>
                <textarea
                  className="form-control dz-textarea custom_font_size_bold"
                  name="notes"
                  id="notes"
                  rows="4"
                  placeholder="Write Here"
                  value={notes}
                  onChange={handleNotesChange}
                ></textarea>
                {/* {validationMessage && (
                  <div className="text-danger mb-3 ms-1 mt-2">
                    {validationMessage}
                  </div>
                )} */}
              </div>
              <ul className="ms-2 customFontSizeBold  notes-ul">
                <li className=" gray-text">
                  &bull; Make mutton thali a bit less spicy
                </li>
                <li className="gray-text ">
                  &bull; Make my panipuri more spicy
                </li>
              </ul>
            </ul>

            <div className="dz-flex-box mt-3">
              <div className="card">
                <div className="card-body px-1 pb-0">
                  {cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                      <div className="row justify-content-center" key={index}>
                        <div className="col-6 pe-0   pb-1">
                          <span className="mb-0 custom_font_size_bold">
                            {item.menu_name}
                          </span>
                          <div className="">
                            <i className="ri-restaurant-line me-2 category-text fw-medium"></i>
                            <span className="category-text fw-medium">
                              {item.menu_cat_name}
                            </span>
                          </div>
                        </div>
                        <div className="col-1 custom_font_size_bold text-end px-0">
                          x {item.quantity}
                        </div>
                        <div className="col-5 text-end ps-0 pe-4">
                          <p className="mb-2 fs-4 fw-medium">
                            <span className="ms-0 me-2 text-info custom_font_size_bold">
                              ₹{item.price}
                            </span>

                            <span className="gray-text custom_font_size_bold text-decoration-line-through">
                              ₹ {item.oldPrice || item.price}
                            </span>
                            <div>
                              <span className="fs-6 ps-2 offer-color custom_font_size_bold">
                                {item.offer || "No "}% Off
                              </span>
                            </div>
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="custom_font_size_bold">
                      No items in the cart.
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="card mx-auto">
              <div className="row px-1 py-1">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center py-1">
                    <span className="ps-2 custom_font_size_bold fw-medium">
                      Total
                    </span>
                    <span className="pe-2 custom_font_size_bold fw-medium">
                      ₹{parseFloat(total).toFixed(2)}
                    </span>
                  </div>
                  <hr className="me-3 p-0 m-0 text-primary" />
                </div>
                <div className="col-12 pt-0">
                  <div className="d-flex justify-content-between align-items-center py-0">
                    <span
                      className="ps-2 custom_font_size pt-1"
                      style={{ color: "#a5a5a5" }}
                    >
                      Service Charges ({serviceChargesPercent}%)
                    </span>
                    <span className="pe-2 customFontSize gray-text">
                      ₹{parseFloat(serviceCharges).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="col-12 mb-0 py-1">
                  <div className="d-flex justify-content-between align-items-center py-0">
                    <span
                      className="ps-2 custom_font_size"
                      style={{ color: "#a5a5a5" }}
                    >
                      GST ({gstPercent}%)
                    </span>
                    <span className="pe-2 customFontSize gray-text text-start">
                      ₹{parseFloat(tax).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="col-12 mb-0 pt-0 pb-1">
                  <div className="d-flex justify-content-between align-items-center py-0">
                    <span
                      className="ps-2 custom_font_size"
                      style={{ color: "#a5a5a5" }}
                    >
                      Discount ({discountPercent}%)
                    </span>
                    <span className="pe-2 customFontSize gray-text">
                      ₹{parseFloat(discount).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div>
                  <hr className="me-3 p-0 m-0 text-primary" />
                </div>
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center py-1 fw-medium pb-0 mb-0">
                    <span className="ps-2 customFontSizeBold">Grand Total</span>
                    <span className="pe-2 customFontSizeBold">
                      ₹{parseFloat(grandTotal).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Link
                to="#"
                className="btn btn-color rounded-pill mt-3 custom_font_size_bold text-white"
                onClick={handleSubmitOrder}
              >
                Place Order
              </Link>
            </div>
          </div>
        </div>
      </main>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="circle">
              <img src={OrderGif} alt="Order Success" className="popup-gif" />
            </div>

            <span className="gray-text custom_font_size_bold">
              Your Order Successfully Placed
            </span>
            <p className="gray-text custom_font_size_bold">
              You have successfully made payment and placed your order.
            </p>
            <button
              className="btn btn-primary rounded-pill  mt-3 custom_font_size_bold"
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
