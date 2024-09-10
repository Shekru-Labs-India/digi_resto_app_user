import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRestaurantId } from '../context/RestaurantIdContext';

const Bottom = () => {
  const location = useLocation();
  const { restaurantCode } = useRestaurantId();
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const updateCartItemCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      setCartItemCount(cartItems.length);
    };

    updateCartItemCount();
    window.addEventListener('storage', updateCartItemCount);

    return () => {
      window.removeEventListener('storage', updateCartItemCount);
    };
  }, []);

  const isProfileActive = location.pathname === "/Profile" || location.pathname === "/EditProfile";

  return (
    <div className="menubar-area footer-fixed">
      <div className="toolbar-inner menubar-nav">
        <Link
          to={`/HomeScreen/${143061}`}
          className={
            location.pathname === `/HomeScreen/${143061}`
              ? "nav-link active"
              : "nav-link"
          }
        >
          <i className="ri-home-2-line" style={{fontSize:"24px"}}></i>
          <span className="name">Home</span>
        </Link>
        <Link
          to="/Wishlist"
          className={
            location.pathname === "/Wishlist" ? "nav-link active" : "nav-link"
          }
        >
          <i className="ri-heart-line" style={{fontSize:"24px"}}></i>
          <span className="name">Favourite</span>
        </Link>
        <Link
          to="/Cart"
          className={
            location.pathname === "/Cart" ? "nav-link active" : "nav-link"
          }
        >
          <i className="ri-shopping-cart-2-line" style={{fontSize:"24px"}}></i>
          <span className="name">Cart {cartItemCount > 0 && `(${cartItemCount})`}</span>
        </Link>
        <Link
          to="/Search"
          className={
            location.pathname === "/Search" ? "nav-link active" : "nav-link"
          }
        >
          <i className="ri-search-line" style={{fontSize:"24px"}}></i>
          <span className="name">Search</span>
        </Link>
        <Link
          to="/Profile"
          className={
            isProfileActive ? "nav-link active" : "nav-link"
          }
        >
          <i className="ri-account-circle-line" style={{fontSize:"24px"}}></i>
          <span className="name">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Bottom;

