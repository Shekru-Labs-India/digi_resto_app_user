import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import SigninButton from "../constants/SigninButton";
import Bottom from "../component/bottom";
import "../assets/css/custom.css";

const Cart = () => {
  const [cartDetails, setCartDetails] = useState(null);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  // Retrieve Customer ID from localStorage
  const getCustomerId = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    return userData ? userData.customer_id : null;
  };

  // Retrieve Restaurant ID from localStorage
  const getRestaurantId = () => {
    const restaurantId = localStorage.getItem("restaurantId");
    return restaurantId ? parseInt(restaurantId, 10) : null;
  };

  // Retrieve Cart ID from localStorage or set a default
  const getCartId = () => {
    const cartId = localStorage.getItem("cartId");
    return cartId ? parseInt(cartId, 10) : 1; // Default to 1 if not found
  };

  useEffect(() => {
    const fetchCartDetails = async () => {
      const customerId = getCustomerId();
      const restaurantId = getRestaurantId();
      const cartId = getCartId();

      if (!customerId || !restaurantId) {
        console.error("Customer ID or Restaurant ID is not available.");
        return;
      }

      try {
        const response = await fetch(
          "https://menumitra.com/user_api/get_cart_detail",
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
        if (data.st === 1) {
          setCartDetails(data);
        } else {
          console.error("Failed to fetch cart details:", data.msg);
        }
      } catch (error) {
        console.error("Error fetching cart details:", error);
      }
    };

    fetchCartDetails();
  }, []);

  const handleRemoveClick = (index, item) => {
    setItemToRemove({ index, item });
    setShowPopup(true);
  };

  const decrementQuantity = (index) => {
    // Add functionality to decrement quantity
  };

  const incrementQuantity = (index) => {
    // Add functionality to increment quantity
  };

  const userData = JSON.parse(localStorage.getItem("userData"));
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous screen
  };

  const displayCartItems = cartDetails ? cartDetails.order_items : [];

  const calculateSubtotal = () => {
    return displayCartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  return (
    <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
      {/* Header */}
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <Link to="/" className="back-btn dz-icon icon-fill icon-sm">
              <i className="ri-arrow-left-line"></i>
            </Link>
          </div>
          <div className="mid-content">
            <h5 className="title">
              My Cart{" "}
              {userData && (
                <span className="items-badge">{displayCartItems.length}</span>
              )}
            </h5>
          </div>
          <div className="right-content">
            <Link to="/Search" className="dz-icon icon-fill icon-sm">
              <i className="ri-search-line"></i>
            </Link>
          </div>
        </div>
      </header>

      {/* Cart Items */}
      {displayCartItems.length === 0 ? (
        <main className="page-content space-top p-b100">
          <div className="container overflow-hidden">
            <div className="m-b20 dz-flex-box">
              <div className="dz-cart-about text-center">
                <h5 className="title">Your Cart is Empty</h5>
                <p>Add items to your cart from the product details page.</p>
                <Link to="/Category" className="btn btn-outline-primary btn-sm">
                  Return to Shop
                </Link>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main
          className="page-content space-top p-b200"
          style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
        >
          {userData ? (
            <div className="container">
              {/* RESTAURANT NAME */}
              <div className="left-content gap-1 ps-2 py-2">
                <h3 className="title fw-medium">
                  <i
                    className="ri-store-2-line"
                    style={{ paddingRight: "10px" }}
                  ></i>
                  {cartDetails.restaurant_name || "Restaurant Name"}
                </h3>
              </div>
              {/* RESTAURANT NAME */}

              {displayCartItems.map((item, index) => (
                <div
                  key={index}
                  className="card mb-3"
                  style={{
                    borderRadius: "15px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="row g-0">
                    {/* Image Column */}
                    <div className="col-3">
                      <Link to={`/ProductDetails/${item.menu_id}`}>
                        <img
                          src={item.image || images}
                          alt={item.menu_name}
                          style={{
                            height: "110px",
                            width: "110px",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                          onError={(e) => {
                            e.target.src = images;
                          }}
                        />
                      </Link>
                    </div>

                    {/* Content Column */}
                    <div className="col-9">
                      {/* Name Row */}
                      <div className="row">
                        <div className="col-10 mt-2">
                          <h5 className="title fs-3">{item.menu_name}</h5>
                        </div>
                        <div className="col-2">
                          {/* Delete Button */}
                          <div onClick={() => handleRemoveClick(index, item)}>
                            <i className="ri-close-line fs-3"></i>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div
                          className="col-4 fs-4"
                          style={{ color: "#0d775e" }}
                        >
                          <i className="ri-restaurant-line me-2"></i>
                          {item.menu_cat_name}
                        </div>
                        <div className="col-4 fs-4">
                          {/* Offer icons can be customized based on offer data */}
                        </div>
                        <div className="col-4 fs-4">
                          <span className="d-flex text-end fw-semibold">
                            <i
                              className="ri-star-half-line px-1"
                              style={{ color: "#fda200" }}
                            ></i>{" "}
                            4.9
                          </span>
                        </div>
                      </div>

                      {/* Price Row */}
                      <div className="row mt-1">
                        <div className="col-4">
                          <p className="mb-2 fs-2 fw-semibold">
                            <span style={{ color: "#4E74FC" }}>
                              ₹{item.price}
                            </span>
                            <del
                              style={{
                                fontSize: "14px",
                                color: "#a5a5a5",
                                marginLeft: "5px",
                              }}
                            >
                              ₹{item.oldPrice || item.price}
                            </del>
                          </p>
                        </div>
                        <div className="col-4">
                          <div
                            className="fw-medium d-flex fs-5 mt-2 fw-semibold"
                            style={{ color: "#438a3c" }}
                          >
                            {item.offer || "No Offer"}
                          </div>
                        </div>

                        {/* Quantity Selector and Delete Button Row */}
                        <div className="col-4">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginTop: "10px",
                            }}
                          >
                            {/* Quantity Controls */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                border: "1px solid #e0e0e0",
                                borderRadius: "20px",
                              }}
                            >
                              <button
                                onClick={() => decrementQuantity(index)}
                                style={{
                                  border: "none",
                                  background: "none",
                                  fontSize: "20px",
                                  color: "#0d775e",
                                  padding: "5px 10px",
                                }}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                style={{
                                  border: "none",
                                  textAlign: "center",
                                  width: "50px",
                                  fontSize: "16px",
                                  color: "#0d775e",
                                  outline: "none",
                                }}
                                readOnly
                              />
                              <button
                                onClick={() => incrementQuantity(index)}
                                style={{
                                  border: "none",
                                  background: "none",
                                  fontSize: "20px",
                                  color: "#0d775e",
                                  padding: "5px 10px",
                                }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <SigninButton />
          )}
        </main>
      )}

      {/* Footer Fixed Button */}
      {userData && (
        <div
          className="container footer-fixed-bottom mb-5 pb-5 z-3"
          style={{ backgroundColor: "transparent" }}
        >
          <div className="card-body mt-2" style={{ padding: "0px" }}>
            <div className="card">
              <div className="row px-1">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center py-1">
                    <span className="ps-2 fs-4" style={{ color: "#a5a5a5" }}>
                      Subtotal
                    </span>
                    <span className="pe-2 fs-4">₹{calculateSubtotal()}</span>
                  </div>
                </div>
                <div className="col-12 mb-2">
                  <div className="d-flex justify-content-between align-items-center py-1">
                    <span className="ps-2 fs-4" style={{ color: "#a5a5a5" }}>
                      Discount
                    </span>
                    <span className="pe-2 fs-4">10%</span>
                  </div>
                </div>
                <div className="col-12 mb-2">
                  <div className="d-flex justify-content-between align-items-center py-1">
                    <span className="ps-2 fs-4" style={{ color: "#a5a5a5" }}>
                      Tax
                    </span>
                    <span className="pe-2 fs-4">₹200</span>
                  </div>
                </div>
                <div>
                  <hr className="dashed" />
                </div>
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center py-1 fw-medium mb-2">
                    <span className="ps-2 fs-4 fw-medium">Grand Total</span>
                    <span className="pe-2 fs-4 fw-medium">
                      ₹{calculateSubtotal() - calculateSubtotal() * 0.1 + 200}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container d-flex align-items-center justify-content-center">
            {displayCartItems.length > 0 && (
              <Link
                to="/Checkout"
                state={{ cartItems: displayCartItems }}
                className="btn btn-lg btn-thin rounded-xl btn-primary px-5"
              >
                Proceed to Buy &nbsp; <b> ({displayCartItems.length} items)</b>
              </Link>
            )}
          </div>
        </div>
      )}
      <Bottom />
    </div>
  );
};

export default Cart;
