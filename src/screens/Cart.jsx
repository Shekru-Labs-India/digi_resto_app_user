import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import images from "../assets/MenuDefault.png";
import SigninButton from '../constants/SigninButton';
import { useRestaurantId } from '../context/RestaurantIdContext';
import Bottom from "../component/bottom";
import { useCart } from '../hooks/useCart';
import '../assets/css/custom.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [localCartItems, setLocalCartItems] = useState([]);
  const { restaurantId } = useRestaurantId();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const handleRemoveClick = (index, item) => {
    setItemToRemove({ index, item });
    setShowPopup(true);
  };

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    console.log("Stored cart items:", storedCartItems);
    setLocalCartItems(storedCartItems);
  }, []);

  useEffect(() => {
    console.log("Cart items from useCart:", cartItems);
    console.log("Local cart items:", localCartItems);
  }, [cartItems, localCartItems]);

  useEffect(() => {
    const clearCartOnRestaurantChange = () => {
      const storedRestaurantId = localStorage.getItem("restaurantId");
      console.log("Stored restaurant ID:", storedRestaurantId);
      console.log("Current restaurant ID:", restaurantId);
      if (storedRestaurantId && restaurantId !== parseInt(storedRestaurantId)) {
        console.log("Clearing cart due to restaurant change");
        localStorage.removeItem("cartItems");
        setLocalCartItems([]);
      }
    };

    clearCartOnRestaurantChange();
  }, [restaurantId]);

  // Use localCartItems as a fallback if cartItems from useCart is empty
  const displayCartItems = cartItems.length > 0 ? cartItems : localCartItems;

  console.log("Display cart items:", displayCartItems);

  const calculateSubtotal = () => {
    return displayCartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const decrementQuantity = (index) => {
    if (displayCartItems[index].quantity > 1) {
      updateQuantity(index, displayCartItems[index].quantity - 1);
    }
  };

  const incrementQuantity = (index) => {
    updateQuantity(index, displayCartItems[index].quantity + 1);
  };

  const userData = JSON.parse(localStorage.getItem('userData'));
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous screen
  };

  console.log("Current restaurantId:", restaurantId);

  return (
    <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
      {/* Header */}
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <Link to="/Wishlist" className="back-btn dz-icon icon-fill icon-sm">
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
        <main className="page-content space-top p-b200" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          {userData ? (
            <div className="container">
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
                    <div className="col-4" style={{ padding: "10px" }}>
                      <Link to={`/ProductDetails/${item.menu_id}`}>
                        <img
                          src={item.image || images}
                          alt={item.name}
                          style={{
                            height: "110px",
                            width: "100%",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                          onError={(e) => {
                            e.target.src = images;
                          }}
                        />
                      </Link>
                    </div>
                    <div className="col-8">
                      <div className="card-body" style={{ padding: "10px" }}>
                        <h5
                          className="title"
                          style={{ fontSize: "18px", marginBottom: "5px" }}
                        >
                          {item.name}
                        </h5>
                        <p className="mb-2">
                          <span
                            style={{
                              color: "#4E74FC",
                              fontSize: "18px",
                              fontWeight: "bold",
                            }}
                          >
                            ₹{item.price}
                          </span>
                          <del
                            style={{
                              fontSize: "14px",
                              color: "#a5a5a5",
                              marginLeft: "5px",
                            }}
                          >
                            ₹{item.oldPrice}
                          </del>
                        </p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "10px",
                          }}
                        >
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
                                padding: "5px 10px",
                                fontSize: "18px",
                              }}
                            >
                              -
                            </button>
                            <span
                              style={{ padding: "0 10px", fontSize: "16px" }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => incrementQuantity(index)}
                              style={{
                                border: "none",
                                background: "none",
                                padding: "5px 10px",
                                fontSize: "18px",
                              }}
                            >
                              +
                            </button>
                          </div>
                          <div
                            onClick={() => removeFromCart(index)}
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              backgroundColor: "#FFE5E5",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                          >
                            <i
                              className="ri-delete-bin-6-line"
                              style={{ color: "#FF4D4F", fontSize: "20px" }}
                            ></i>
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
        <div className="footer-fixed-bottom">
          <div className="container">
            <ul className="total-prize">
              <li className="name">Subtotal</li>
              <li className="prize">₹{calculateSubtotal()}</li>
            </ul>
            {displayCartItems.length > 0 && (
              <Link
                to="/Checkout"
                state={{ cartItems: displayCartItems }}
                className="btn btn-lg btn-thin rounded-xl btn-primary w-100"
              >
                Proceed to Buy &nbsp; <b> ({displayCartItems.length} items)</b>
              </Link>
            )}
          </div>
        </div>
      )}
      <Bottom></Bottom>
    </div>
  );
};

export default Cart;

