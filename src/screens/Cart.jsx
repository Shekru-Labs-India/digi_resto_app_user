import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import SigninButton from "../constants/SigninButton";
import Bottom from "../component/bottom";
import "../assets/css/custom.css";

const Cart = () => {
  const [userData, setUserData] = useState(null);
  const [cartDetails, setCartDetails] = useState({ order_items: [] });
  const navigate = useNavigate();

  const getCustomerId = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    return userData ? userData.customer_id : null;
  };

  const getRestaurantId = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    return userData && userData.restaurantId ? userData.restaurantId : null;
  };

  const getCartId = () => {
    const cartId = localStorage.getItem("cartId");
    return cartId ? parseInt(cartId, 10) : 1;
  };

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    setUserData(storedUserData);
    fetchCartDetails();
  }, []);

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
      console.log("API response data:", data); // Debug log

      if (data.st === 1) {
        // Calculate old price for each item
        const updatedOrderItems = data.order_items.map((item) => ({
          ...item,
          oldPrice: Math.floor(item.price * 1.1), // Old price calculation
        }));
        setCartDetails({ ...data, order_items: updatedOrderItems });
        console.log("Cart details set:", data); // Debug log
      } else if (data.st === 2) {
        setCartDetails({ order_items: [] });
      } else {
        console.error("Failed to fetch cart details:", data.msg);
      }
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  };

  const removeFromCart = async (item, index) => {
    const customerId = getCustomerId();
    const restaurantId = getRestaurantId();
    const cartId = getCartId();
    const menuId = item.menu_id;

    try {
      const response = await fetch(
        "https://menumitra.com/user_api/remove_from_cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: cartId,
            customer_id: customerId,
            restaurant_id: restaurantId,
            menu_id: menuId,
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1) {
        console.log("Item removed from cart successfully.");
        removeCartItemByIndex(index); // Remove item from local storage using index
        setCartDetails((prevDetails) => ({
          ...prevDetails,
          order_items: prevDetails.order_items.filter((_, i) => i !== index),
        })); // Update local state
      } else {
        console.error("Failed to remove item from cart:", data.msg);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const removeCartItemByIndex = (index) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const updatedCartItems = cartItems.filter((_, i) => i !== index);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    console.log("Updated cart items in local storage:", updatedCartItems); // Debug log
  };

  // ... existing code ...

  // ... existing code ...

  const updateCartQuantity = async (menuId, quantity) => {
    const customerId = getCustomerId();
    const restaurantId = getRestaurantId();
    const cartId = getCartId();

    try {
      const response = await fetch(
        "https://menumitra.com/user_api/update_cart_menu_quantity",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: cartId,
            customer_id: customerId,
            restaurant_id: restaurantId,
            menu_id: menuId,
            quantity: quantity,
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1) {
        // Update the local state
        setCartDetails((prevDetails) => {
          const updatedItems = prevDetails.order_items.map((item) =>
            item.menu_id === menuId ? { ...item, quantity: quantity } : item
          );
          const updatedTotalBill = updatedItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          );
          const serviceCharges =
            (updatedTotalBill * prevDetails.service_charges_percent) / 100;
          const gstAmount = (updatedTotalBill * prevDetails.gst_percent) / 100;
          const discountAmount =
            (updatedTotalBill * prevDetails.discount_percent) / 100;
          const updatedGrandTotal =
            updatedTotalBill + serviceCharges + gstAmount - discountAmount;

          return {
            ...prevDetails,
            order_items: updatedItems,
            total_bill: updatedTotalBill,
            service_charges_amount: serviceCharges,
            gst_amount: gstAmount,
            discount_amount: discountAmount,
            grand_total: updatedGrandTotal,
          };
        });
      } else {
        console.error("Failed to update cart quantity:", data.msg);
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  // ... existing code ...

  // ... existing code ...

  const incrementQuantity = (item) => {
    if (item.quantity < 20) {
      const newQuantity = item.quantity + 1;
      updateCartQuantity(item.menu_id, newQuantity);
    } else {
      alert("You cannot add more than 20 items of this product.");
    }
  };

  const decrementQuantity = (item) => {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      updateCartQuantity(item.menu_id, newQuantity);
    }
  };

  const displayCartItems = cartDetails.order_items; // Debug log

  return (
    <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <Link
              to={`/HomeScreen/${userData?.restaurantId || ""}/${
                userData?.tableNumber || ""
              }`}
              className="back-btn dz-icon icon-sm"
              onClick={() => navigate(-1)}
            >
              <i className="ri-arrow-left-line fs-2"></i>
            </Link>
          </div>
          <div className="mid-content">
            <h5 className="title">
              My Cart{" "}
              {/* {displayCartItems.length > 0 && (
                <span className="">({displayCartItems.length})</span>
              )} */}
            </h5>
          </div>
        </div>
      </header>

      {displayCartItems.length === 0 ? (
        <main className="page-content ">
          <div
            className="container overflow-hidden d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <div className="m-b20 dz-flex-box text-center">
              <div className="dz-cart-about">
                <h5 className="title">Your Cart is Empty</h5>
                <p>Add items to your cart from the product details page.</p>
                <Link to="/Menu" className="btn btn-outline-primary btn-sm">
                  Return to Shop
                </Link>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main className="page-content space-top p-b200">
          <div className="container scrollable-section">
            <div className="container mt-0 pt-0 mb-0">
              <div className="row">
                <div className="col-12 fw-medium text-end hotel-name">
                  <span className="ps-2">
                    {userData?.restaurantName?.toUpperCase() || "UNKNOWN"}
                  </span>
                  <i className="ri-store-2-line ps-2"></i>
                  <h6 className="title fw-medium h6 custom-text-gray table-number pe-5 me-5">
                    Table: {userData.tableNumber || ""}
                  </h6>
                </div>
              </div>
            </div>
            {displayCartItems.map((item, index) => (
              <div
                key={index}
                className="card mb-3"
                style={{
                  borderRadius: "15px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <div className="row my-auto" style={{ height: "110px" }}>
                  <div className="col-3 px-0">
                    <Link
                      to={{
                        pathname: `/ProductDetails/${item.menu_id}`,
                      }}
                      state={{
                        restaurant_id: userData.restaurantId,
                        menu_cat_id: item.menu_cat_id,
                      }}
                    >
                      <img
                        src={item.image || images}
                        alt={item.menu_name}
                        style={{
                          height: "110px",
                          width: "110px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          position: "relative",
                          left: "10px",
                        }}
                        onError={(e) => {
                          e.target.src = images;
                        }}
                      />
                    </Link>
                  </div>
                  <div className="col-9 pt-2 pb-2">
                    <div className="row">
                      <div className="col-9 my-auto">
                        <Link
                          to={{
                            pathname: `/ProductDetails/${item.menu_id}`,
                          }}
                          state={{
                            restaurant_id: userData.restaurantId,
                            menu_cat_id: item.menu_cat_id,
                          }}
                        >
                          <h5 className="title text-truncate">
                            {item.menu_name}
                          </h5>
                        </Link>
                      </div>

                      <div className="col-3 text-end pe-4">
                        <div onClick={() => removeFromCart(item, index)}>
                          <i className="ri-close-line fs-4  mb-5 icon-adjust"></i>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={{
                        pathname: `/ProductDetails/${item.menu_id}`,
                      }}
                      state={{
                        restaurant_id: userData.restaurantId,
                        menu_cat_id: item.menu_cat_id,
                      }}
                    >
                      <div className="row">
                        <div className="col-4 fs-sm p-0 fw-medium ms-3 category-text mt-1">
                          <Link
                            to={{
                              pathname: `/ProductDetails/${item.menu_id}`,
                            }}
                            state={{
                              restaurant_id: userData.restaurantId,
                              menu_cat_id: item.menu_cat_id,
                            }}
                            className=" category-text "
                          >
                            <i className="ri-restaurant-line me-2 category-text"></i>
                            {item.menu_cat_name}
                          </Link>
                        </div>
                        <div className="col-4 px-0 ps-1">
                          <div className="offer-code my-auto ">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <i
                                key={index}
                                className={`ri-fire-${
                                  index < (item.spicy_index || 0)
                                    ? "fill fs-6"
                                    : "line fs-6"
                                }`}
                                style={{
                                  color:
                                    index < (item.spicy_index || 0)
                                      ? "#eb8e57"
                                      : "#bbbaba",
                                }}
                              ></i>
                            ))}
                          </div>
                        </div>
                        <div className="col-3 ps-1 text-center">
                          <span className="fs-6 fw-semibold gray-text">
                            <i className="ri-star-half-line px-1 ratingStar "></i>{" "}
                            {item.rating}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <div className="row pt-2">
                      <div className="col-10 mx-0 my-auto px-0">
                        <Link
                          to={{
                            pathname: `/ProductDetails/${item.menu_id}`,
                          }}
                          state={{
                            restaurant_id: userData.restaurantId,
                            menu_cat_id: item.menu_cat_id,
                          }}
                        >
                          <p className="mb-2  fw-medium">
                            <span className="ms-3 fs-4 me-2 text-info">
                              ₹{item.price}
                            </span>
                            <span className="gray-text fs-sm text-decoration-line-through">
                              ₹{item.oldPrice || item.price}
                            </span>

                            <span className="fs-6 ps-2 offer-color">
                              {item.offer || "No "}% Off
                            </span>
                          </p>
                        </Link>
                      </div>

                      <div className="col-2">
                        <div className="d-flex justify-content-end align-items-center mt-1">
                          <i
                            className="ri-subtract-line fs-6 mx-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => decrementQuantity(item)}
                          ></i>
                          <span className="text-light ">{item.quantity}</span>
                          <i
                            className="ri-add-line mx-2 fs-6"
                            style={{ cursor: "pointer" }}
                            onClick={() => incrementQuantity(item)}
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {cartDetails && displayCartItems.length > 0 && (
            <div
              className="pb-5 mb-5"
              style={{ bottom: "75px", backgroundColor: "transparent" }}
            >
              <div className="card-body">
                <div className="card mx-auto">
                  <div className="row px-1 py-1">
                    <div className="col-12">
                      <div className="d-flex justify-content-between align-items-center py-2">
                        <span className="ps-2 fs-3 fw-medium">Total</span>

                        <span className="pe-2 fs-3 fw-medium">
                          ₹{cartDetails?.total_bill || 0}
                        </span>
                      </div>
                      <hr className=" me-3 p-0 m-0  text-primary" />
                    </div>
                    <div className="col-12 py-1">
                      <div className="d-flex justify-content-between align-items-center py-0">
                        <span
                          className="ps-2 fs-sm pt-1"
                          style={{ color: "#a5a5a5" }}
                        >
                          Service Charges ({cartDetails.service_charges_percent}
                          %)
                        </span>
                        <span className="pe-2 fs-sm fw-medium">
                          ₹{cartDetails?.service_charges_amount || 0}
                        </span>
                      </div>
                    </div>
                    <div className="col-12 mb-0 py-1">
                      <div className="d-flex justify-content-between align-items-center py-0">
                        <span
                          className="ps-2 fs-sm"
                          style={{ color: "#a5a5a5" }}
                        >
                          GST ({cartDetails.gst_percent}%)
                        </span>
                        <span className="pe-2 fs-sm fw-medium text-start">
                          ₹{cartDetails?.gst_amount || 0}
                        </span>
                      </div>
                    </div>
                    <div className="col-12 mb-0 pt-1 pb-2">
                      <div className="d-flex justify-content-between align-items-center py-0">
                        <span
                          className="ps-2 fs-sm"
                          style={{ color: "#a5a5a5" }}
                        >
                          Discount ({cartDetails?.discount_percent || 0}%)
                        </span>
                        <span className="pe-2 fs-sm fw-medium">
                          ₹{cartDetails?.discount_amount || 0}
                        </span>
                      </div>
                    </div>
                    <div>
                      <hr
                        className=" me-3 p-0 m-0"
                        style={{ color: "#0d775e" }}
                      />
                    </div>
                    <div className="col-12 py-1">
                      <div className="d-flex justify-content-between align-items-center py-1 fw-medium pb-0 mb-0">
                        <span className="ps-2 fs-3 fw-medium">Grand Total</span>
                        <span className="pe-2 fs-3 ">
                          ₹{cartDetails?.grand_total || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container d-flex align-items-center justify-content-center pt-0">
                <Link
                  to="/Checkout"
                  state={{ cartItems: displayCartItems }}
                  className="btn btn-lg btn-thin rounded-xl btn-primary px-5"
                >
                  Proceed to Buy &nbsp; <b>({displayCartItems.length} items)</b>
                </Link>
              </div>
            </div>
          )}
        </main>
      )}
      <Bottom />
    </div>
  );
};

export default Cart;