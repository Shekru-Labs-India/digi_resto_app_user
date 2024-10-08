import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";

const Bottom = () => {
  const location = useLocation();
  const { restaurantCode } = useRestaurantId();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || {}
  );

  useEffect(() => {
    const updateCartItemCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      setCartItemCount(cartItems.length);
    };

    const handleStorageChange = (e) => {
      if (e.key === "cartItems") {
        updateCartItemCount();
      } else if (e.key === "userData") {
        setUserData(JSON.parse(e.newValue) || {});
      }
    };

    updateCartItemCount();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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
          <span className="name customFontSizeBold">Home</span>
        </Link>
        <Link
          to="/Wishlist"
          className={
            location.pathname === "/Wishlist" ? "nav-link active" : "nav-link"
          }
        >
          <i className="ri-heart-2-line fs-3"></i>
          <span className="name customFontSizeBold">Favourite</span>
        </Link>
        <Link
          to="/Cart"
          className={
            location.pathname === "/Cart" ? "nav-link active" : "nav-link"
          }
        >
          <i className="ri-shopping-cart-line fs-3"></i>
          <span className="name customFontSizeBold">Cart</span>
        </Link>
        <Link
          to="/Search"
          className={
            location.pathname === "/Search" ? "nav-link active" : "nav-link"
          }
        >
          <i className="ri-search-line fs-3"></i>
          <span className="name customFontSizeBold">Search</span>
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
          <span className="name customFontSizeBold">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Bottom;
