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
        <main className="page-content space-top p-b200">
          {userData ? (
            <div className="container overflow-hidden">
              {displayCartItems.map((item, index) => (
                <div key={index} className="m-b5 dz-flex-box">
                  <div className="dz-cart-list m-b30">
                    <div className="dz-media">
                      <Link to={`/ProductDetails/${item.menu_id}`}>
                        <img
                          src={item.image || images} // Use default image if image is null
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "110px",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.src = images; // Set local image source on error
                          }}
                        />
                      </Link>
                    </div>

                    <div>
                      <div className="dz-content">
                        <h5 className="title">{item.name}</h5>
                        <ul className="dz-meta">
                          <li className="current-price">
                            <span
                              style={{
                                color: "#4E74FC",
                                fontSize: "18px",
                                marginBottom: "0",
                                marginRight: "10px",
                              }}
                            >
                              ₹{item.price}
                            </span>
                            <del
                              style={{
                                position: "relative",
                                fontSize: "13px",
                                color: "#a5a5a5",
                                textDecoration: "line-through",
                              }}
                            >
                              ₹{item.oldPrice}
                            </del>
                          </li>
                        </ul>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="dz-stepper style-2">
                          <div className="dz-stepper2 input-group">
                            <div className="dz-stepper2">
                              <i
                                className="ri-subtract-line"
                                onClick={() => decrementQuantity(index)}
                              ></i>
                            </div>
                            <input
                              className="form-control stepper-input1 text-center"
                              type="text"
                              value={item.quantity}
                              readOnly
                            />
                            <div className="dz-stepper2">
                              <i
                                className="ri-add-line"
                                onClick={() => incrementQuantity(index)}
                              ></i>
                            </div>
                          </div>
                        </div>

                        <div
                          className="remove"
                          onClick={() => removeFromCart(index)}
                        >
                          <i className="ri-delete-bin-6-line"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <SigninButton></SigninButton>
          )}
        </main>
      )}

      {/* Footer Fixed Button */}
      {userData && (
        <div className="footer-fixed-btn bottom-40">
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
      )}
      <Bottom></Bottom>
    </div>
  );
};

export default Cart;

