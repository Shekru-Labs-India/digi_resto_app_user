import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import SigninButton from "../constants/SigninButton";
import Bottom from "../component/bottom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import "../assets/css/custom.css";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/saga-blue/theme.css"; // Choose a theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const Cart = () => {
  const isLoggedIn = !!localStorage.getItem("userData");
  const [userData, setUserData] = useState(null);
  const [cartDetails, setCartDetails] = useState({ order_items: [] });
  const navigate = useNavigate();
  const toastBottomCenter = useRef(null);
  const toast = useRef(null);
  const { restaurantId } = useRestaurantId();
  const { restaurantName } = useRestaurantId();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize state from local storage
    return localStorage.getItem("isDarkMode") === "true";
  }); // State for theme
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setUserData(storedUserData);
    } else {
      console.error("User data not found in local storage.");
    }
    fetchCartDetails();
  }, []);

  const getCustomerId = () => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    return storedUserData?.customer_id || null;
  };

  const getRestaurantId = () => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    return storedUserData?.restaurantId || null;
  };

  const getCartId = () => {
    const cartId = localStorage.getItem("cartId");
    return cartId ? parseInt(cartId, 10) : 1;
  };

  const fetchCartDetails = async () => {
    const customerId = getCustomerId();
    const restaurantId = getRestaurantId();
    const cartId = getCartId();

    if (!customerId || !restaurantId) {
      console.error("Customer ID or Restaurant ID is not available.");
      return;
    }

    try {
      const response = await fetch(
        "https://menumitra.com/user_api/get_cart_detail_add_to_cart",
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
      console.log("API response data:", data);

      if (data.st === 1) {
        const updatedOrderItems = data.order_items.map((item) => ({
          ...item,
          oldPrice: Math.floor(item.price * 1.1),
        }));
        setCartDetails({ ...data, order_items: updatedOrderItems });
        console.log("Cart details set:", data);
      } else if (data.st === 2) {
        setCartDetails({ order_items: [] });
      } else {
        console.error("Failed to fetch cart details:", data.msg);
      }
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  };

  const removeFromCart = async (item, index) => {
    const customerId = getCustomerId();
    const restaurantId = getRestaurantId();
    const cartId = getCartId();
    const menuId = item.menu_id;

    try {
      const response = await fetch(
        "https://menumitra.com/user_api/remove_from_cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: cartId,
            customer_id: customerId,
            restaurant_id: restaurantId,
            menu_id: menuId,
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1) {
        console.log("Item removed from cart successfully.");
        removeCartItemByIndex(index); // Remove item from local storage using index
        fetchCartDetails(); // Refresh cart details
        toast.current.show({
          severity: "success",
          summary: "Item Removed",
          detail: `${item.menu_name} has been removed from your cart.`,
          life: 2000,
        });
      } else {
        console.error("Failed to remove item from cart:", data.msg);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const removeCartItemByIndex = (index) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const updatedCartItems = cartItems.filter((_, i) => i !== index);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    console.log("Updated cart items in local storage:", updatedCartItems); // Debug log
  };

  // ... existing code ...

  const updateCartQuantity = async (menuId, quantity) => {
    const customerId = getCustomerId();
    const restaurantId = getRestaurantId();
    const cartId = getCartId();

    try {
      const response = await fetch(
        "https://menumitra.com/user_api/update_cart_menu_quantity",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: cartId,
            customer_id: customerId,
            restaurant_id: restaurantId,
            menu_id: menuId,
            quantity: quantity,
          }),
        }
      );
      const data = await response.json();
      if (data.st === 1) {
        fetchCartDetails(); // Refresh cart details
      } else {
        console.error("Failed to update cart quantity:", data.msg);
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  // ... existing code ...

  // ... existing code ...

  const incrementQuantity = (item) => {
    if (item.quantity < 20) {
      const newQuantity = item.quantity + 1;
      updateCartQuantity(item.menu_id, newQuantity);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `Increased quantity of ${item.menu_name} to ${newQuantity}`,
        life: 2000,
      });
    } else {
      toast.current.show({
        severity: "warn",
        summary: "Limit Reached",
        detail: "You cannot add more than 20 items of this product.",
        life: 2000,
      });
    }
  };

  const decrementQuantity = (item) => {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      updateCartQuantity(item.menu_id, newQuantity);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `Decreased quantity of ${item.menu_name} to ${newQuantity}`,
        life: 2000,
      });
    }
  };

  const displayCartItems = cartDetails.order_items; // Debug log

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
    <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
      <Toast ref={toast} position="bottom-center" className="custom-toast" />
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className={`page-wrapper ${sidebarOpen ? "sidebar-open" : ""}`}>
            <header className="header header-fixed pt-2">
              <div className="header-content d-flex justify-content-between">
                <div className="left-content">
                  <Link
                    to={`/HomeScreen/${userData?.restaurantId || ""}/${
                      userData?.tableNumber || ""
                    }`}
                    className="back-btn dz-icon icon-sm"
                    onClick={() => navigate(-1)}
                  >
                    <i className="ri-arrow-left-line fs-3"></i>
                  </Link>
                </div>
                <div className="mid-content">
                  <span className="custom_font_size_bold me-3">
                    My Cart{" "}
                    {displayCartItems.length > 0 && (
                      <span className="small-number gray-text">
                        ({displayCartItems.length})
                      </span>
                    )}
                  </span>
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

      {displayCartItems.length === 0 ? (
        <main className="page-content ">
          <div
            className="container overflow-hidden d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <div className="m-b20 dz-flex-box text-center">
              <div className="dz-cart-about">
                <h5 className="custom_font_size_bold">Your Cart is Empty</h5>
                <p className="custom_font_size">
                  Add items to your cart from the product details page.
                </p>
                <Link to="/Menu" className="btn btn-outline-primary btn-sm">
                  Return to Shop
                </Link>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main className="page-content space-top p-b200">
          <div className="container scrollable-section pt-0">
            <div className="container py-3 p-0">
              <div className="d-flex justify-content-start">
                <div className="d-flex flex-column">
                  <span className=" fw-medium hotel-name">
                    <i className="ri-store-2-line me-2"></i>
                    {restaurantName.toUpperCase() || "Restaurant Name"}
                  </span>
                  <span className="fw-medium custom-text-gray">
                    <i class="ri-user-location-line me-2 gray-text"></i>
                    {userData.tableNumber || ""}
                  </span>
                </div>
              </div>
            </div>

            {displayCartItems.map((item, index) => (
              <div
                key={index}
                className="card mb-3"
                style={{
                  borderRadius: "15px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <div className="row my-auto" style={{ height: "110px" }}>
                  <div className="col-3 px-0">
                    <Link
                      to={{
                        pathname: `/ProductDetails/${item.menu_id}`,
                      }}
                      state={{
                        restaurant_id: userData.restaurantId,
                        menu_cat_id: item.menu_cat_id,
                      }}
                    >
                      <img
                        src={item.image || images}
                        alt={item.menu_name}
                        style={{
                          height: "110px",
                          width: "110px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          position: "relative",
                          left: "10px",
                        }}
                        onError={(e) => {
                          e.target.src = images;
                        }}
                      />
                    </Link>
                  </div>
                  <div className="col-9 pt-2 pb-0">
                    <div className="row">
                      <div className="col-9 my-auto">
                        <Link
                          to={{
                            pathname: `/ProductDetails/${item.menu_id}`,
                          }}
                          state={{
                            restaurant_id: userData.restaurantId,
                            menu_cat_id: item.menu_cat_id,
                          }}
                        >
                          <span className="custom_font_size_bold text-truncate">
                            {item.menu_name}
                          </span>
                        </Link>
                      </div>

                      <div className="col-3 text-end pe-4">
                        <div onClick={() => removeFromCart(item, index)}>
                          <i className="ri-close-line fs-4  mb-5 icon-adjust"></i>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={{
                        pathname: `/ProductDetails/${item.menu_id}`,
                      }}
                      state={{
                        restaurant_id: userData.restaurantId,
                        menu_cat_id: item.menu_cat_id,
                      }}
                    >
                      <div className="row">
                        <div className="col-4 fs-sm p-0 fw-medium ms-3 category-text mt-1">
                          <Link
                            to={{
                              pathname: `/ProductDetails/${item.menu_id}`,
                            }}
                            state={{
                              restaurant_id: userData.restaurantId,
                              menu_cat_id: item.menu_cat_id,
                            }}
                            className=" category-text "
                          >
                            <i className="ri-restaurant-line me-2 category-text"></i>
                            {item.menu_cat_name}
                          </Link>
                        </div>
                        <div className="col-4 pe-0 ps-2">
                          <div className="offer-code my-auto ">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <i
                                key={index}
                                className={`ri-fire-${
                                  index < (item.spicy_index || 0)
                                    ? "fill fs-6"
                                    : "line fs-6"
                                }`}
                                style={{
                                  color:
                                    index < (item.spicy_index || 0)
                                      ? "#eb8e57"
                                      : "#bbbaba",
                                }}
                              ></i>
                            ))}
                          </div>
                        </div>
                        <div className="col-3 px-1 text-start ">
                          <span className="custom_font_size fw-semibold gray-text">
                            <i className="ri-star-half-line  ratingStar"></i>
                            {item.rating}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <div className="row pt-2">
                      <div className="col-10 mx-0 my-auto px-0">
                        <Link
                          to={{
                            pathname: `/ProductDetails/${item.menu_id}`,
                          }}
                          state={{
                            restaurant_id: userData.restaurantId,
                            menu_cat_id: item.menu_cat_id,
                          }}
                        >
                          <p className="mb-0  fw-medium">
                            <span className="ms-3 custom_font_size me-2 text-info">
                              ₹{item.price}
                            </span>
                            <span className="gray-text custom_font_size text-decoration-line-through">
                              ₹{item.oldPrice || item.price}
                            </span>

                            <span className="custom_font_size ps-2 offer-color">
                              {item.offer || "No "}% Off
                            </span>
                          </p>
                        </Link>
                      </div>

                      <div className="col-2">
                        <div className="d-flex justify-content-end align-items-center mt-1">
                          <i
                            className="ri-subtract-line custom_font_size mx-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => decrementQuantity(item)}
                          ></i>
                          <span className="text-light custom_font_size">
                            {item.quantity}
                          </span>
                          <i
                            className="ri-add-line mx-2 custom_font_size"
                            style={{ cursor: "pointer" }}
                            onClick={() => incrementQuantity(item)}
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {cartDetails && displayCartItems.length > 0 && (
            <div
              className="pb-5 mb-5"
              style={{ bottom: "75px", backgroundColor: "transparent" }}
            >
              <div className="container">
                <div className="">
                  <div className="card mx-auto rounded-2">
                    <div className="row px-1 py-1">
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center py-1">
                          <span className="ps-2 custom_font_size_bold fw-medium">
                            Total
                          </span>

                          <span className="pe-2 custom_font_size_bold fw-medium">
                            ₹{cartDetails?.total_bill || 0}
                          </span>
                        </div>
                        <hr className=" me-3 p-0 m-0  text-primary" />
                      </div>
                      <div className="col-12 pt-0">
                        <div className="d-flex justify-content-between align-items-center py-0">
                          <span
                            className="ps-2 custom_font_size pt-1"
                            style={{ color: "#a5a5a5" }}
                          >
                            Service Charges (
                            {cartDetails.service_charges_percent}
                            %)
                          </span>
                          <span className="pe-2 custom_font_size fw-medium">
                            ₹{cartDetails?.service_charges_amount || 0}
                          </span>
                        </div>
                      </div>
                      <div className="col-12 mb-0 py-1">
                        <div className="d-flex justify-content-between align-items-center py-0">
                          <span
                            className="ps-2 custom_font_size"
                            style={{ color: "#a5a5a5" }}
                          >
                            GST ({cartDetails.gst_percent}%)
                          </span>
                          <span className="pe-2 custom_font_size fw-medium text-start">
                            ₹{cartDetails?.gst_amount || 0}
                          </span>
                        </div>
                      </div>
                      <div className="col-12 mb-0 pt-0 pb-1">
                        <div className="d-flex justify-content-between align-items-center py-0">
                          <span
                            className="ps-2 custom_font_size"
                            style={{ color: "#a5a5a5" }}
                          >
                            Discount ({cartDetails?.discount_percent || 0}%)
                          </span>
                          <span className="pe-2 custom_font_size">
                            ₹{cartDetails?.discount_amount || 0}
                          </span>
                        </div>
                      </div>
                      <div>
                        <hr className=" me-3 p-0 m-0 text-primary" />
                      </div>
                      <div className="col-12 ">
                        <div className="d-flex justify-content-between align-items-center py-1 fw-medium pb-0 mb-0">
                          <span className="ps-2 custom_font_size_bold">
                            Grand Total
                          </span>
                          <span className="pe-2 custom_font_size_bold">
                            ₹{cartDetails?.grand_total || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container d-flex align-items-center justify-content-center pt-0">
                <Link
                  to="/Checkout"
                  state={{ cartItems: displayCartItems }}
                  className="btn btn-color custom_font_size rounded-pill text-white px-5"
                >
                  Proceed to Buy &nbsp;{" "}
                  <b>
                    {" "}
                    <span className="small-number gray-text">
                      ({displayCartItems.length} items)
                    </span>
                  </b>
                </Link>
              </div>
            </div>
          )}
        </main>
      )}
      <Bottom />
    </div>
  );
};

export default Cart;
