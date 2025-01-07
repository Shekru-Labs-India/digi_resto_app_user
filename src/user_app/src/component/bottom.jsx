import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import { useCart } from "../context/CartContext";
import UserAuthPopup from './UserAuthPopup';
import config from "./config";

const Bottom = () => {
  const location = useLocation();
  const { restaurantCode } = useRestaurantId();
  const { cartItems } = useCart();
  const tableNumber = localStorage.getItem("tableNumber");
  const sectionId = localStorage.getItem("sectionId");
  const [userData] = useState(
    JSON.parse(localStorage.getItem("userData")) || {}
  );

  const isHomePath = (pathname) => {
    const homePathPattern = new RegExp(
      `^/user_app/${restaurantCode}(?:/\\d+)?(?:/\\d+)?$`
    );
    return homePathPattern.test(pathname);
  };

  return (
    <div className="menubar-area footer-fixed">
      <div className="toolbar-inner menubar-nav">
        <Link
          to={`/user_app/${restaurantCode}/${tableNumber}/${sectionId}`}
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
          to="/user_app/Checkout"
          className={`nav-link ${
            location.pathname === "/user_app/Checkout" ? "active" : ""
          }`}
        >
          <div className="position-relative d-inline-block">
            <i className="fa-solid fa-check-to-slot me-2 font_size_14"></i>
            {(() => {
              const storedCart = localStorage.getItem("restaurant_cart_data");
              const hasItems = storedCart
                ? JSON.parse(storedCart).order_items.length > 0
                : false;

              return (
                hasItems && (
                  <span
                    className="position-absolute p-1 bg-danger rounded-circle"
                    style={{
                      top: "-5px",
                      right: "20px",
                      width: "5px",
                      height: "5px",
                    }}
                  />
                )
              );
            })()}
          </div>
          <span className="name font_size_14">Checkout</span>
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
              userData?.user_id
                ? "fa-solid fa-user me-2 font_size_14"
                : "fa-regular fa-user me-2 font_size_14"
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
