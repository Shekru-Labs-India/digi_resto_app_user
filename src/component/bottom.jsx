import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";

const Bottom = () => {
  const location = useLocation();
  const { restaurantCode } = useRestaurantId();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [userData] = useState(JSON.parse(localStorage.getItem("userData")) || {});

  useEffect(() => {
    // Create a reference to track if the API call has been made
    let isFirstCall = true;
    
    const updateCartItemCount = async () => {
      // Only proceed if this is the first call
      if (!isFirstCall) return;
      isFirstCall = false;

      const customerId = userData?.customer_id;
      const cartId = localStorage.getItem("cartId");
      const restaurantId = localStorage.getItem("restaurantId");

      if (!customerId || !cartId || !restaurantId) {
        setCartItemCount(0);
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
        if (data.st === 1 && data.order_items) {
          setCartItemCount(data.order_items.length);
        } else {
          setCartItemCount(0);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
        setCartItemCount(0);
      }
    };

    updateCartItemCount();

    // Cleanup function
    return () => {
      isFirstCall = false;
    };
  }, [userData]); // Only depend on userData

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
