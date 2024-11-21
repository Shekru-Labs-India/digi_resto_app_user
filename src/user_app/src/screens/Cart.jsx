import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import { useRestaurantId } from "../context/RestaurantIdContext";
import "../assets/css/custom.css";
import LoaderGif from "./LoaderGIF";
import Header from "../components/Header";
import Bottom from "../component/bottom";

import HotelNameAndTable from "../components/HotelNameAndTable";
import { useCart } from "../context/CartContext";
import NearbyArea from "../component/NearbyArea";
import { getUserData } from "../utils/userUtils";
import config from "../component/config"
const Cart = () => {
  const { restaurantId, restaurantName } = useRestaurantId();
  const { cartItems, updateCart, removeFromCart } = useCart();
  const [userData, setUserData] = useState(null);
  const [cartDetails, setCartDetails] = useState({ order_items: [] });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [customerType, setCustomerType] = useState(null);
    const [menuItems, setMenuItems] = useState([]);

  // Helper function to get stored restaurant ID
  const getStoredRestaurantId = useCallback(() => {
    return localStorage.getItem("restaurantId") || restaurantId;
  }, [restaurantId]);

  // Define fetchCartDetails with proper checks
  const fetchCartDetails = useCallback(async () => {
    const customerId = getCustomerId();
    const cartId = getCartId();

    if (!customerId || !cartId || !restaurantId) {
      setCartDetails({ order_items: [] });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
         `${config.apiDomain}/user_api/get_cart_detail_add_to_cart`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart_id: cartId,
            customer_id: customerId,
            restaurant_id: restaurantId,
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1) {
        // Store cart_id in localStorage if it exists in the response
        if (data.cart_id) {
          localStorage.setItem("cartId", data.cart_id);
        }
        
        if (data.order_items?.length > 0) {
          setCartDetails({
            ...data,
            order_items: data.order_items.map(item => ({
              ...item,
              oldPrice: Math.floor(item.price * 1.1),
            }))
          });
        } else {
          setCartDetails({ order_items: [] });
        }
      } else {
        setCartDetails({ order_items: [] });
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartDetails({ order_items: [] });
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId]);

  // Initial load effect with restaurant ID check
  useEffect(() => {
    const initializeCart = async () => {
      const { customerId, customerType } = getUserData();
      const currentRestaurantId = getStoredRestaurantId();
      
      if (customerId && currentRestaurantId) {
        setIsLoggedIn(true);
        setCustomerId(customerId);
        setCustomerType(customerType);
        setUserData({ customer_id: customerId, customer_type: customerType });
        await fetchCartDetails();
      } else {
        setIsLoggedIn(false);
        setCustomerId(null);
        setCustomerType(null);
        setUserData(null);
        setIsLoading(false);
      }
    };
  
    initializeCart();
  }, [fetchCartDetails, getStoredRestaurantId]);

  // Cart update listener
  useEffect(() => {
    const handleCartUpdate = () => {
      if (restaurantId) {
        fetchCartDetails();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [fetchCartDetails, restaurantId]);

  // Window focus handler with restaurant ID check
  useEffect(() => {
    if (userData && restaurantId) {
      const handleFocus = () => {
        fetchCartDetails();
      };

      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, [userData, fetchCartDetails, restaurantId]);

  const getCustomerId = useCallback(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    return userData?.customer_id || localStorage.getItem("customer_id") || null;
  }, []);

  const getCartId = useCallback(() => {
    return localStorage.getItem("cartId") || null;
  }, []);

  const handleProceedToBuy = () => {
    // const checkoutData = {
    //   cartItems: cartDetails.order_items,
    //   totalBill: cartDetails.total_bill,
    //   serviceCharges: cartDetails.service_charges_amount,
    //   serviceChargesPercent: cartDetails.service_charges_percent,
    //   gstAmount: cartDetails.gst_amount,
    //   gstPercent: cartDetails.gst_percent,
    //   discountAmount: cartDetails.discount_amount,
    //   discountPercent: cartDetails.discount_percent,
    //   grandTotal: cartDetails.grand_total,
    //   customerId: userData.customer_id,
    //   customerType: userData.customer_type,
    //   restaurantId: restaurantId,
    //   restaurantName: restaurantName,
    //   cartId: getCartId(),
    // };
    navigate("/user_app/Checkout");
   // navigate("/user_app/Checkout", { state: { checkoutData } });
  };

  const handleRemoveFromCart = async (item) => {
    const currentCustomerId = getCustomerId();
    try {
      await removeFromCart(item.menu_id, currentCustomerId, restaurantId);
      
      // Update localStorage and dispatch events
      const updatedCartItems = cartDetails.order_items.filter(
        cartItem => cartItem.menu_id !== item.menu_id
      );
      
      // Update localStorage
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      
      // Dispatch removal event
      window.dispatchEvent(new CustomEvent("cartItemRemoved", {
        detail: { menuId: item.menu_id }
      }));
      
      // Update cart details
      setCartDetails(prev => ({
        ...prev,
        order_items: updatedCartItems
      }));

      window.showToast("success", `${item.menu_name} has been removed from your cart.`);
      fetchCartDetails();
    } catch (error) {
      console.error("Error removing item from cart:", error);
      window.showToast("error", "Failed to remove item from cart.");
    }
  };

  const updateCartQuantity = async (menuId, quantity) => {
    const customerId = getCustomerId();
    const cartId = getCartId();

    try {
      const response = await fetch(
         `${config.apiDomain}/user_api/update_cart_menu_quantity`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        fetchCartDetails();
        window.showToast("success", "Item quantity has been updated.");
      } else {
        console.error("Failed to update cart quantity:", data.msg);
        window.showToast("error", "Failed to update item quantity.");
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      window.showToast("error", "An error occurred while updating item quantity.");
    }
  };

  const incrementQuantity = (item) => {
    if (item.quantity < 20) {
      updateCartQuantity(item.menu_id, item.quantity + 1);
    } else {
      window.showToast("warn", "You cannot add more than 20 items of this product.");
    }
  };

  const decrementQuantity = (item) => {
    if (item.quantity > 1) {
      updateCartQuantity(item.menu_id, item.quantity - 1);
    }
  };

  const handleUnauthorizedFavorite = (navigate) => {
    window.showToast("info", "Please login to use favorites functionality");
    
  };

  const handleLikeClick = async (menuId) => {
   
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id || userData.customer_type === 'guest') {
      handleUnauthorizedFavorite(navigate);
      return;
    }

    const currentRestaurantId = getStoredRestaurantId();
    if (!currentRestaurantId) {
      window.showToast("error", "Restaurant information is missing");
      return;
    }

    const menuItem = cartDetails.order_items.find((item) => item.menu_id === menuId);
    if (!menuItem) {
      console.error("Menu item not found:", menuId);
      return;
    }

    const isFavorite = menuItem.is_favourite;

    try {
      const response = await fetch(
         `${config.apiDomain}/user_api/${isFavorite ? 'remove' : 'save'}_favourite_menu`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurant_id: currentRestaurantId,
            menu_id: menuId,
            customer_id: userData.customer_id,
            customer_type: userData.customer_type
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.st === 1) {
        setCartDetails((prevCart) => ({
          ...prevCart,
          order_items: prevCart.order_items.map((item) =>
            item.menu_id === menuId ? { ...item, is_favourite: !isFavorite } : item
          )
        }));

        window.dispatchEvent(
          new CustomEvent("favoriteUpdated", {
            detail: { menuId, isFavorite: !isFavorite },
          })
        );

        window.showToast(
          "success",
          isFavorite ? "Removed from favorites" : "Added to favorites"
        );
      } else {
        throw new Error(data.msg || 'Failed to update favorite status');
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      window.showToast("error", error.message || "Failed to update favorite status");
    }
  };

  if (isLoading) {
    return (
      <div id="preloader">
        <div className="loader">
          <LoaderGif />
        </div>
      </div>
    );
  }

  const renderEmptyCart = () => (
    <main className="page-content">
      <div
        className="container overflow-hidden d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="m-b20 dz-flex-box text-center">
          <div className="dz-cart-about">
            <h5>Your Cart is Empty</h5>
            <p>Add items to your cart from the product details page.</p>
       

            <div class="d-flex align-items-center justify-content-center mt-2">
              <Link
                class="btn btn-outline-primary  rounded-pill  px-3"
                to="/user_app/Menu"
              >
                <i class="ri-add-circle-line me-1 fs-4"></i> Order More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );

  return (
    <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
      <Header title="Cart" count={cartDetails.order_items.length} />

      {!userData || cartDetails.order_items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <main className="page-content space-top mb-5 pb-3">
          <div className="container py-0">
            <HotelNameAndTable
              restaurantName={restaurantName}
              tableNumber={userData?.tableNumber || "1"}
            />
          </div>
          <div className="container scrollable-section pt-0">
            {cartDetails.order_items.map((item, index) => (
              <Link
                key={index}
                to={`/user_app/ProductDetails/${item.menu_id}`}
                state={{
                  restaurant_id: userData.restaurantId,
                  menu_cat_id: item.menu_cat_id,
                }}
                className="text-decoration-none text-reset"
              >
                <div className="card mb-3 rounded-4">
                  <div className="row my-auto ps-3">
                    <div className="col-3 px-0 position-relative">
                      <img
                        src={item.image || images}
                        alt={item.menu_name}
                        className="img-fluid rounded-4 "
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "fill",
                          aspectRatio: "1/1",
                        }}
                        onError={(e) => {
                          e.target.src = images;
                        }}
                      />
                      <div
                        className={`border rounded-3 bg-white opacity-75 d-flex justify-content-center align-items-center ${
                          item.menu_veg_nonveg.toLowerCase() === "veg"
                            ? "border-success"
                            : "border-danger"
                        }`}
                        style={{
                          position: "absolute",
                          bottom: "3px",
                          left: "3px",
                          height: "20px",
                          width: "20px",
                          borderWidth: "2px",
                          borderRadius: "3px",
                        }}
                      >
                        <i
                          className={`${
                            item.menu_veg_nonveg.toLowerCase() === "veg"
                              ? "ri-checkbox-blank-circle-fill text-success"
                              : "ri-triangle-fill text-danger"
                          } font_size_12`}
                        ></i>
                      </div>
                      {item.offer && item.offer !== 0 && (
                        <div className="gradient_bg d-flex justify-content-center align-items-center gradient_bg_offer">
                          <span className="font_size_10 text-white">
                        
                            {item.offer}% Off
                          </span>
                        </div>
                      )}
                      <div
                        className="border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center"
                        style={{
                          position: "absolute",
                          bottom: "3px",
                          right: "3px",
                          height: "20px",
                          width: "20px",
                        }}
                      >
                        <i
                          className={`${
                            item.is_favourite
                              ? "ri-heart-3-fill text-danger"
                              : "ri-heart-3-line"
                          } fs-6`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleLikeClick(item.menu_id);
                          }}
                        ></i>
                      </div>
                    </div>
                    <div className="col-9 pt-1 pb-0">
                      <div className="row">
                        <div className="col-9 ">
                          <span className="font_size_14 fw-semibold">
                            {item.menu_name}
                          </span>
                        </div>

                        <div className="col-3 text-end pe-4">
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemoveFromCart(item, index);
                            }}
                          >
                            <i className="ri-close-line fs-4 mb-5 icon-adjust"></i>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-5 px-0">
                          <span className="ps-3 text-success mt-1 font_size_10">
                            <i className="ri-restaurant-line me-1 text-success"></i>
                            {item.menu_cat_name}
                          </span>
                        </div>
                        <div className="col-3 px-0">
                          <div className="offer-code my-auto">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <i
                                key={index}
                                className={`ri-fire-${
                                  index < (item.spicy_index || 0)
                                    ? "fill font_size_12 text-danger"
                                    : "line font_size_12 gray-text"
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
                        <div className="col-4 ps-0 text-end">
                          <span className="font_size_10 fw-normal gray-text me-2">
                            <i className="ri-star-half-line font_size_10 ratingStar me-1"></i>
                            {item.rating}
                          </span>
                        </div>
                      </div>
                      <div className="row"></div>
                      <div className="row pe-2">
                        <div className="col-8 mx-0 my-auto px-0">
                          <p className="mb-0 fw-medium">
                            
                            <span className="ms-3 font_size_14 fw-semibold text-info">
                              ₹
                              {item.offer
                                ? Math.floor(
                                    item.price * (1 - item.offer / 100)
                                  )
                                : item.price}
                            </span>
                            {item.offer && item.offer !== 0 ? (
                              <span className="gray-text font_size_12 text-decoration-line-through fw-normal ms-2">
                                ₹{item.price}
                              </span>
                            ) : null}
                          </p>
                        </div>

                        <div className="col-4 ps-2">
                          <div className="d-flex justify-content-center align-items-center mt-1 bg-light rounded-pill py-1 ">
                            <div
                              className="border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center"
                              style={{
                                height: "25px",
                                width: "25px",
                              }}
                            >
                              <i
                                className="ri-subtract-line fs-6"
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  decrementQuantity(item);
                                }}
                              ></i>
                            </div>
                            <span className="text-light  px-2">
                              {item.quantity}
                            </span>
                            <div
                              className="border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center"
                              style={{
                                height: "25px",
                                width: "25px",
                              }}
                            >
                              <i
                                className="ri-add-line  fs-6"
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  incrementQuantity(item);
                                }}
                              ></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {cartDetails && cartDetails.order_items.length > 0 && (
            <div
              className=""
              style={{ bottom: "75px", backgroundColor: "transparent" }}
            >
              <div className="container">
                <div className="">
                  <div className="card mx-auto rounded-4">
                    <div className="row px-1 py-1">
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center py-1">
                          <span className="ps-2 font_size_14 fw-semibold">
                            Total
                          </span>

                          <span className="pe-2 fw-semibold font_size_14">
                            ₹{cartDetails?.total_bill || 0}
                          </span>
                        </div>
                        <hr className=" me-3 p-0 m-0  text-primary" />
                      </div>
                      <div className="col-12 pt-0">
                        <div className="d-flex justify-content-between align-items-center py-0">
                          <span className="ps-2 font_size_14 pt-1 gray-text">
                            Service Charges{" "}
                            <span className="gray-text small-number">
                              ({cartDetails.service_charges_percent}%)
                            </span>
                          </span>
                          <span className="pe-2 font_size_14 gray-text">
                            ₹{cartDetails?.service_charges_amount || 0}
                          </span>
                        </div>
                      </div>
                      <div className="col-12 mb-0 py-1">
                        <div className="d-flex justify-content-between align-items-center py-0">
                          <span className="ps-2 font_size_14 gray-text">
                            GST{" "}
                            <span className="gray-text small-number">
                              ({cartDetails.gst_percent}%)
                            </span>
                          </span>
                          <span className="pe-2 font_size_14 gray-text">
                            ₹{cartDetails?.gst_amount || 0}
                          </span>
                        </div>
                      </div>
                      <div className="col-12 mb-0 pt-0 pb-1">
                        <div className="d-flex justify-content-between align-items-center py-0">
                          <span className="ps-2 font_size_14 gray-text">
                            Discount{" "}
                            <span className="gray-text small-number">
                              ({cartDetails?.discount_percent || 0}%)
                            </span>
                          </span>
                          <span className="pe-2 font_size_14 gray-text">
                            -₹{cartDetails?.discount_amount || 0}
                          </span>
                        </div>
                      </div>
                      <div>
                        <hr className=" me-3 p-0 m-0 text-primary" />
                      </div>
                      <div className="col-12 ">
                        <div className="d-flex justify-content-between align-items-center py-1 fw-medium pb-0 mb-0">
                          <span className="ps-2 fs-6 fw-semibold">
                            Grand Total
                          </span>
                          <span className="pe-2 fs-6 fw-semibold">
                            ₹{cartDetails?.grand_total || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container d-flex align-items-center justify-content-center pt-0">
                <button
                  onClick={handleProceedToBuy}
                  className="btn btn-success rounded-pill text-white px-5"
                >
                  Proceed to Buy &nbsp;{" "}
                  <b>
                    <span className="small-number gray-text">
                      ({cartDetails.order_items.length} items)
                    </span>
                  </b>
                </button>
              </div>
              <div className="d-flex align-items-center justify-content-center mt-2">
                <Link
                  to="/user_app/Menu"
                  className="btn btn-outline-primary  rounded-pill  px-3"
                >
                  <i className="ri-add-circle-line me-1 fs-4"></i> Order More
                </Link>
              </div>
            </div>
          )}
          <div className="container py-0">
            <NearbyArea />
            <div className="divider border-success inner-divider transparent mb-0" ><span className="bg-body">End</span></div>

          </div>

        </main>
      )}

      <Bottom />
    </div>
  );
};

export default Cart;
