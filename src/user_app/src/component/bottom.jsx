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
          <i className="fa-solid fa-house"></i>
          <span className="name">Home</span>
        </Link>

        <Link
          to="/user_app/Wishlist"
          className={`nav-link ${
            location.pathname === "/user_app/Wishlist" ? "active" : ""
          }`}
        >
          <i className="fa-regular fa-heart"></i>
          <span className="name">Favourite</span>
        </Link>

        <Link
          to="/user_app/Cart"
          className={`nav-link ${
            location.pathname === "/user_app/Cart" ? "active" : ""
          }`}
        >
          <div className="position-relative">
            <i className="fa-solid fa-cart-shopping"></i>
            {/* {cartItemCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartItemCount}
              </span>
            )} */}
          </div>
          <span className="name">Cart</span>
        </Link>

        {/* <Link
          to="/user_app/Search"
          className={`nav-link ${location.pathname === "/user_app/Search" ? "active" : ""}`}
        >
          <i className="ri-search-line"></i>
          <span className="name">Search</span>
        </Link> */}
        <Link
          to="/user_app/MyOrder"
          className={`nav-link ${
            location.pathname === "/user_app/MyOrder" ? "active" : ""
          }`}
        >
          <i className="fa-solid fa-clock-rotate-left"></i>
          <span className="name">My Order</span>
        </Link>

        <Link
          to="/user_app/Profile"
          className={`nav-link ${
            location.pathname.includes("/user_app/Profile") ? "active" : ""
          }`}
        >
          <i
            className={
              userData?.customer_id ? "fa-solid fa-user" : "fa-regular fa-user"
            }
          ></i>
          <span className="name">Profile</span>
        </Link>
      </div>

      <UserAuthPopup />
    </div>
  );
};

export default Bottom;
