import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";

const Bottom = () => {
  const location = useLocation();
  const { restaurantCode } = useRestaurantId();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [userData] = useState(JSON.parse(localStorage.getItem("userData")) || {});
  const hasFetchedCart = useRef(false);

  // Update cart count whenever cart changes
  useEffect(() => {
    // Initial cart count
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setCartItemCount(cartItems.length);
    };

    // Listen for cart updates (add, remove, update)
    const handleCartUpdate = (event) => {
      if (event.detail) {
        setCartItemCount(event.detail.length);
      } else {
        updateCartCount();
      }
    };

    // Listen for cart item removal
    const handleCartRemove = () => {
      updateCartCount();
    };

    // Initial count
    updateCartCount();

    // Add event listeners
    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("cartItemRemoved", handleCartRemove);
    window.addEventListener("cartItemAdded", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("cartItemRemoved", handleCartRemove);
      window.removeEventListener("cartItemAdded", handleCartUpdate);
    };
  }, []);

  const getActiveClass = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <div className="menubar-area footer-fixed">
      <div className="toolbar-inner menubar-nav">
        <Link
          to={`/${restaurantCode}/${userData.tableNumber || ""}`}
          className={
            location.pathname ===
            `/${restaurantCode}/${userData.tableNumber || ""}`
              ? "nav-link active"
              : "nav-link"
          }
        >
          <i className="ri-home-2-line fs-3"></i>
          <span className="name    ">Home</span>
        </Link>
        <Link
          to="/Wishlist"
          className={
            location.pathname === "/Wishlist" ? "nav-link active" : "nav-link"
          }
        >
          <i className="ri-heart-3-line fs-3"></i>
          <span className="name    ">Favourite</span>
        </Link>
        <Link
          to="/Cart"
          className={
            location.pathname === "/Cart" ? "nav-link active" : "nav-link"
          }
        >
          <div className="position-relative">
            <i className="ri-shopping-cart-line fs-3"></i>
          </div>
          <span className="name">
            Cart
            {cartItemCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartItemCount}
              </span>
            )}
          </span>
        </Link>
        <Link
          to="/Search"
          className={
            location.pathname === "/Search" ? "nav-link active" : "nav-link"
          }
        >
          <i className="ri-search-line fs-3"></i>
          <span className="name    ">Search</span>
        </Link>
        <Link
          to="/Profile"
          className={
            location.pathname === "/Profile" ||
            location.pathname === "/EditProfile"
              ? "nav-link active"
              : "nav-link"
          }
        >
          <i
            className={
              userData && userData.customer_id
                ? "ri-user-3-fill fs-3"
                : "ri-user-3-line fs-3"
            }
          ></i>
          <span className="name    ">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Bottom;
