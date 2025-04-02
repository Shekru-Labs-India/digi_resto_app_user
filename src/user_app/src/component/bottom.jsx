import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import { useCart } from "../context/CartContext";
import UserAuthPopup from './UserAuthPopup';
import config from "./config";

const Bottom = () => {
  const location = useLocation();
  const { restaurantCode, isOutletOnlyUrl } = useRestaurantId();
  const { cartItems } = useCart();
  const tableNumber = localStorage.getItem("tableNumber");
  const sectionId = localStorage.getItem("sectionId");
  const [userData] = useState(
    JSON.parse(localStorage.getItem("userData")) || {}
  );

  const isHomePath = (pathname) => {
    const cleanRestaurantCode = restaurantCode ? restaurantCode.replace(/^o/, '') : '';
    const homePathPattern = new RegExp(
      `^/user_app/o${cleanRestaurantCode}(?:/s\\d+)?(?:/t\\d+)?$`
    );
    return homePathPattern.test(pathname);
  };

  // Function to generate the correct home URL based on isOutletOnlyUrl
  const getHomeUrl = () => {
    const cleanRestaurantCode = restaurantCode ? restaurantCode.replace(/^o/, '') : '';
    const currentPath = location.pathname;
    
    // Get saved isOutletOnlyUrl value from localStorage (more reliable across navigation)
    const savedIsOutletOnly = localStorage.getItem("isOutletOnlyUrl") === "true";
    
    // Check if the current URL is directly an outlet-only URL
    const currentIsOutletOnly = /^\/user_app\/o\d+\/?$/.test(currentPath);
    
    // Use saved value or current URL check or context value (in order of reliability)
    if (savedIsOutletOnly || currentIsOutletOnly || isOutletOnlyUrl) {
      // If we're in outlet-only mode, return URL with just the outlet code
      return `/user_app/o${cleanRestaurantCode}`;
    } else {
      // Otherwise include section and table if available
      return `/user_app/o${cleanRestaurantCode}${
        sectionId ? `/s${sectionId.replace(/^s/, '')}` : ''
      }${
        tableNumber ? `/t${tableNumber.replace(/^t/, '')}` : ''
      }`;
    }
  };

  return (
    <div className="menubar-area footer-fixed">
      <div className="toolbar-inner menubar-nav">
        <Link
          to={getHomeUrl()}
          className={`nav-link d-flex flex-column align-items-center ${
            isHomePath(location.pathname) ? "active" : ""
          }`}
          style={{ gap: "2px", minWidth: "60px" }}
        >
          <i className="fa-solid fa-house font_size_14"></i>
          <span style={{ display: "block", fontSize: "12px", marginTop: "2px" }}>Home</span>
        </Link>

        <Link
          to="/user_app/Wishlist"
          className={`nav-link d-flex flex-column align-items-center ${
            location.pathname === "/user_app/Wishlist" ? "active" : ""
          }`}
          style={{ gap: "2px", minWidth: "60px" }}
        >
          <i className="fa-regular fa-heart font_size_14"></i>
          <span style={{ display: "block", fontSize: "12px", marginTop: "2px" }}>Favourite</span>
        </Link>

        <Link
          to="/user_app/Checkout"
          className={`nav-link d-flex flex-column align-items-center ${
            location.pathname === "/user_app/Checkout" ? "active" : ""
          }`}
          style={{ gap: "2px", minWidth: "60px" }}
        >
          <div className="position-relative d-flex flex-column align-items-center">
            <i className="fa-solid fa-check-to-slot font_size_14"></i>
            {(() => {
              const storedCart = localStorage.getItem("restaurant_cart_data"); 
              const hasItems = storedCart
                ? JSON.parse(storedCart).order_items?.length > 0
                : false;

              return (
                hasItems && (
                  <span
                    className="position-absolute p-1 bg-danger rounded-circle"
                    style={{
                      top: "-5px",
                      right: "-5px",
                      width: "5px",
                      height: "5px",
                    }}
                  />
                )
              );
            })()}
          </div>
          <span style={{ display: "block", fontSize: "12px", marginTop: "2px" }}>Checkout</span>
        </Link>

        <Link
          to="/user_app/MyOrder"
          className={`nav-link d-flex flex-column align-items-center ${
            location.pathname === "/user_app/MyOrder" ? "active" : ""
          }`}
          style={{ gap: "2px", minWidth: "60px" }}
        >
          <i className="fa-solid fa-clock-rotate-left font_size_14"></i>
          <span style={{ display: "block", fontSize: "12px", marginTop: "2px" }}>Orders</span>
        </Link>

        <Link
          to="/user_app/Profile"
          className={`nav-link d-flex flex-column align-items-center ${
            location.pathname.includes("/user_app/Profile") ? "active" : ""
          }`}
          style={{ gap: "2px", minWidth: "60px" }}
        >
          <i
            className={
              userData?.user_id
                ? "fa-solid fa-user font_size_14"
                : "fa-regular fa-user font_size_14"
            }
          ></i>
          <span style={{ display: "block", fontSize: "12px", marginTop: "2px" }}>Profile</span>
        </Link>
      </div>

      <UserAuthPopup />
    </div>
  );
};

export default Bottom;
