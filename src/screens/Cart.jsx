import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import SigninButton from "../constants/SigninButton";
import Bottom from "../component/bottom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import "../assets/css/custom.css";
import LoaderGif from "./LoaderGIF";
import Header from "../components/Header";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/saga-blue/theme.css"; // Choose a theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import HotelNameAndTable from '../components/HotelNameAndTable';

const Cart = () => {
  const isLoggedIn = !!localStorage.getItem("userData");
  const [userData, setUserData] = useState(null);
  const [cartDetails, setCartDetails] = useState({ order_items: [] });
  const navigate = useNavigate();
  const toastBottomCenter = useRef(null);
  const toast = useRef(null);
  const { restaurantId } = useRestaurantId();
  const { restaurantName } = useRestaurantId();
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    fetchCartDetails();
  }, []);

  const fetchCartDetails = async () => {
   
    const customerId = getCustomerId();
    const restaurantId = getRestaurantId();
    const cartId = getCartId();
  
    if (!customerId || !restaurantId) {
      console.error("Customer ID or Restaurant ID is not available.");
      setCartDetails({ order_items: [] });
      setIsLoading(false);
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
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
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
        setCartDetails({ order_items: [] });
      }
    } catch (error) {
      console.error("Error fetching cart details:", error);
      setCartDetails({ order_items: [] });
    } finally {
      setIsLoading(false);
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

  if (isLoading ) {
    return (
      <div id="preloader">
        <div className="loader">
          <LoaderGif />
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
      <Toast ref={toast} position="bottom-center" className="custom-toast" />
     
      <Header 
        title="Cart" 
        count={cartDetails.order_items.length} 
      />


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
        <main className="page-content space-top mb-5 pb-3">
         
         <HotelNameAndTable 
        restaurantName={restaurantName} 
        tableNumber={userData.tableNumber}
      />
          <div className="container scrollable-section pt-0">
            {displayCartItems.map((item, index) => (
              <Link
                key={index}
                to={{
                  pathname: `/ProductDetails/${item.menu_id}`,
                }}
                state={{
                  restaurant_id: userData.restaurantId,
                  menu_cat_id: item.menu_cat_id,
                }}
                className="text-decoration-none text-reset"
              >
                <div
                  className="card mb-3 rounded-3"
                >
                  <div className="row my-auto ps-3">
                    <div className="col-3 px-0">
                      <img
                        src={item.image || images}
                        alt={item.menu_name}
                        className="img-fluid rounded-start-3 rounded-end-0"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "fill",
                          aspectRatio: "1/1",
                        }}
                        onError={(e) => {
                          e.target.src = images;
                        }}
                      />
                    </div>
                    <div className="col-9 pt-2 pb-0">
                      <div className="row">
                        <div className="col-9 my-auto">
                          <span className="fs-6 fw-semibold text-truncate">
                            {item.menu_name}
                          </span>
                        </div>

                        <div className="col-3 text-end pe-4">
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeFromCart(item, index);
                            }}
                          >
                            <i className="ri-close-line fs-4 mb-5 icon-adjust"></i>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-4 fs-sm p-0 fw-medium ms-3 text-success mt-1">
                          <i className="ri-restaurant-line me-1 text-success"></i>
                          {item.menu_cat_name}
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
                        <div className="col-3 pe-3 text-center">
                          <span className="custom_font_size  gray-text">
                            <i className="ri-star-half-line  ratingStar"></i>
                            {item.rating}
                          </span>
                        </div>
                      </div>
                      <div className="row pt-2">
                        <div className="col-10 mx-0 my-auto px-0">
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
                        </div>

                        <div className="col-2">
                          <div className="d-flex justify-content-end align-items-center mt-1">
                            <i
                              className="ri-subtract-line custom_font_size mx-2"
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                decrementQuantity(item);
                              }}
                            ></i>
                            <span className="text-light custom_font_size">
                              {item.quantity}
                            </span>
                            <i
                              className="ri-add-line mx-2 custom_font_size"
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                incrementQuantity(item);
                              }}
                            ></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {cartDetails && displayCartItems.length > 0 && (
            <div
              className="pb-5 mb-5"
              style={{ bottom: "75px", backgroundColor: "transparent" }}
            >
              <div className="container">
                <div className="">
                  <div className="card mx-auto rounded-3">
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
                            className="ps-2 custom_font_size pt-1 gray-text"
                            s
                          >
                            Service Charges{" "}
                            <span className="gray-text small-number">
                              ({cartDetails.service_charges_percent}%)
                            </span>
                          </span>
                          <span className="pe-2 custom_font_size fw-medium gray-text">
                            ₹{cartDetails?.service_charges_amount || 0}
                          </span>
                        </div>
                      </div>
                      <div className="col-12 mb-0 py-1">
                        <div className="d-flex justify-content-between align-items-center py-0">
                          <span className="ps-2 custom_font_size gray-text">
                            GST{" "}
                            <span className="gray-text small-number">
                              ({cartDetails.gst_percent}%)
                            </span>
                          </span>
                          <span className="pe-2 custom_font_size fw-medium gray-text">
                            ₹{cartDetails?.gst_amount || 0}
                          </span>
                        </div>
                      </div>
                      <div className="col-12 mb-0 pt-0 pb-1">
                        <div className="d-flex justify-content-between align-items-center py-0">
                          <span className="ps-2 custom_font_size gray-text">
                            Discount{" "}
                            <span className="gray-text small-number">
                              (-{cartDetails?.discount_percent || 0}%)
                            </span>
                          </span>
                          <span className="pe-2 custom_font_size gray-text">
                            -₹{cartDetails?.discount_amount || 0}
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
