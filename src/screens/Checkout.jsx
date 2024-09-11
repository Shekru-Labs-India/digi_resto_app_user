import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useRestaurantId } from '../context/RestaurantIdContext';
import Bottom from "../component/bottom";
import { Divider } from "@mui/material";
// import { useRestaurantId } from "./context/RestaurantIdContext";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState(location.state?.cartItems || []);
  const { restaurantId } = useRestaurantId(); // Get restaurantId from context
  console.log("Restaurant ID:", restaurantId);

  const userData = JSON.parse(localStorage.getItem('userData'));
  const customerId = userData ? userData.customer_id : null;

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmitOrder = async () => {
    const notes = document
      .getElementById("notes")
      .value.trim()
      .substring(0, 255); // Limit to 255 characters
    const orderItems = cartItems.map((item) => ({
      menu_id: item.menu_id,
      quantity: item.quantity,
    }));

    const orderData = {
      customer_id: customerId,
      restaurant_id: restaurantId,
      note: notes,
      order_items: orderItems,
    };

    try {
      const response = await fetch(
        "https://menumitra.com/user_api/create_order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        // Handle successful submission
        navigate("/MyOrder");
      } else {
        throw new Error(responseData.msg || "Failed to submit order");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      alert(`Failed to submit order: ${error.message}`);
    }
  };

  // Define the calculateTotal function to compute the total price of cart items
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  useEffect(() => {
    console.log("Restaurant ID from context:", restaurantId);
  }, [restaurantId]);

  return (
    <div className="page-wrapper full-height">
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <Link
              to=""
              className="back-btn dz-icon icon-fill icon-sm"
              onClick={handleBack}
            >
              <i className="ri-arrow-left-line"></i>
            </Link>
          </div>
          <div className="mid-content">
            <h5 className="title">Checkout</h5>
          </div>
          <div className="right-content"></div>
        </div>
      </header>

      <main className="page-content space-top p-b90">
        <div className="container">
          <div className="dz-flex-box">
            {/* <div className="dz-list m-b20"> */}
            <div className="row">
              <div className="col-1">
                <i class="ri-map-pin-fill fs-2"></i>
              </div>
              <div className="col-11"> Delivery Address</div>
            </div>
            <div className="row">
              <div className="col-1">
                <i class="ri-bank-card-fill fs-2"></i>
              </div>
              <div className="col-11">Payment</div>
            </div>
            <ul className="dz-list-group">
              <div className="mb-3">
                <label className="form-label" htmlFor="notes">
                  Additional Notes :
                </label>
                <textarea
                  className="form-control dz-textarea"
                  name="notes"
                  id="notes"
                  rows="4"
                  placeholder="Write Here"
                ></textarea>
              </div>

              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <li key={index} className="list-group-items ">
                    <div className="list-content">
                      <h5 className="title">{item.name}</h5>
                      <p className="about">
                        {item.quantity}x₹{item.price.toFixed(2)}
                        <span
                          className="price"
                          style={{ fontWeight: "bold", marginLeft: "220px" }}
                        >
                          ₹{(item.quantity * item.price).toFixed(2)}
                        </span>
                      </p>
                      {/* Display subtotal (quantity * price) */}
                    </div>
                  </li>
                ))
              ) : (
                <li>No items in the cart.</li>
              )}
            </ul>

            

            {/* </div> */}
            {cartItems.length > 0 && (
              <div className="view-cart mt-auto">
                {/* <ul>
                  <li className="dz-total">
                    <span className="name font-18 font-w600">Total</span>
                    <h5 className="price">₹{calculateTotal().toFixed(2)}</h5>
                  </li>
                </ul> */}
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="footer-fixed-btn bottom-40">
        <ul className="total-prize">
          <li className="name">Subtotal</li>
          <li className="prize">₹{calculateTotal()}</li>
        </ul>
        <Link
          to="/MyOrder"
          className="btn btn-primary btn-lg btn-thin rounded-xl w-100"
          onClick={handleSubmitOrder}
        >
          Submit Order
        </Link>
      </div>
      <Bottom></Bottom>
    </div>
  );
};

export default Checkout;
