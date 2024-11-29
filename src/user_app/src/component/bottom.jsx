import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import UserAuthPopup from './UserAuthPopup';
import config from "./config";

const Bottom = () => {
  const location = useLocation();
  const { restaurantCode } = useRestaurantId();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [userData] = useState(
    JSON.parse(localStorage.getItem("userData")) || {}
  );
  const [hasCartItems, setHasCartItems] = useState(false);

  const isHomePath = (pathname) => {
    const homePathPattern = new RegExp(
      `^/user_app/${restaurantCode}(?:/\\d+)?$`
    );
    return homePathPattern.test(pathname);
  };

  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setCartItemCount(cartItems.length);
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  useEffect(() => {
    // Initial check
    checkCartItems();

    // Listen for cart updates
    const handleCartUpdate = () => {
      checkCartItems();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const checkCartItems = async () => {
    const cartId = localStorage.getItem("cartId");
    const userData = JSON.parse(localStorage.getItem("userData"));
    const restaurantId = localStorage.getItem("restaurantId");

    if (cartId && userData?.customer_id && restaurantId) {
      try {
        const response = await fetch(
          `${config.apiDomain}/user_api/get_cart_detail_add_to_cart`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cart_id: cartId,
              customer_id: userData.customer_id,
              restaurant_id: restaurantId,
            }),
          }
        );

        const data = await response.json();
        setHasCartItems(data.st === 1 && data.order_items?.length > 0);
      } catch (error) {
        console.error("Error checking cart:", error);
      }
    }
  };

  return (
    <div className="menubar-area footer-fixed">
      <div className="toolbar-inner menubar-nav">
        <Link
          to={`/user_app/${restaurantCode}/${userData.tableNumber || ""}`}
          className={`nav-link ${
            isHomePath(location.pathname) ? "active" : ""
          }`}
        >
          <i className="fa-solid fa-house me-2 font_size_14"></i>
          <span className="name font_size_14">Home</span>
        </Link>

        <Link
          to="/user_app/Wishlist"
          className={`nav-link ${
            location.pathname === "/user_app/Wishlist" ? "active" : ""
          }`}
        >
          <i className="fa-regular fa-heart me-2 font_size_14"></i>
          <span className="name font_size_14">Favourite</span>
        </Link>

        <Link
          to="/user_app/Cart"
          className={`nav-link ${
            location.pathname === "/user_app/Cart" ? "active" : ""
          }`}
        >
          <div className="position-relative">
            <i className="fa-solid fa-cart-shopping me-2 font_size_14"></i>
            {hasCartItems && (
              <span 
                className="position-absolute"
                style={{
                  top: "-5px",
                  right: "5px",
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#ff0000",
                  borderRadius: "50%",
                  display: "block"
                }}
              />
            )}
          </div>
          <span className="name font_size_14">Cart</span>
        </Link>

        <Link
          to="/user_app/MyOrder"
          className={`nav-link ${
            location.pathname === "/user_app/MyOrder" ? "active" : ""
          }`}
        >
          <i className="fa-solid fa-clock-rotate-left me-2 font_size_14"></i>
          <span className="name font_size_14">My Order</span>
        </Link>

        <Link
          to="/user_app/Profile"
          className={`nav-link ${
            location.pathname.includes("/user_app/Profile") ? "active" : ""
          }`}
        >
          <i
            className={
              userData?.customer_id ? "fa-solid fa-user me-2 font_size_14" : "fa-regular fa-user me-2 font_size_14"
            }
          ></i>
          <span className="name font_size_14">Profile</span>
        </Link>
      </div>

      <UserAuthPopup />
    </div>
  );
};

export default Bottom;
