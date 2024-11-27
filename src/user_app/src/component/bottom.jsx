import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import UserAuthPopup from './UserAuthPopup';

const Bottom = () => {
  const location = useLocation();
  const { restaurantCode } = useRestaurantId();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [userData] = useState(
    JSON.parse(localStorage.getItem("userData")) || {}
  );

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
