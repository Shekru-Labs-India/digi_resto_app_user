import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import { useRestaurantId } from "../context/RestaurantIdContext";
import "../assets/css/toast.css";
import LoaderGif from "./LoaderGIF";
import Header from "../components/Header";
import Bottom from "../component/bottom";
import { usePopup } from "../context/PopupContext";
import HotelNameAndTable from "../components/HotelNameAndTable";
import { useCart } from "../context/CartContext";
import NearbyArea from "../component/NearbyArea";
import { getUserData } from "../utils/userUtils";
import config from "../component/config";
import RestaurantSocials from "../components/RestaurantSocials";
import { renderSpicyLevel } from "../component/config";
// import { useCart } from "../context/CartContext";
const Cart = () => {
  const location = useLocation();
  const magicMessage = location.state?.magicMessage;
  const { restaurantId, restaurantName } = useRestaurantId();
  const { updateCart, removeFromCart } = useCart();
  const [userData, setUserData] = useState(null);
  const [cartDetails, setCartDetails] = useState({ order_items: [] });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [customerType, setCustomerType] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const { clearCart } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const { showLoginPopup } = usePopup();
  // Helper function to get stored restaurant ID
  const getStoredRestaurantId = useCallback(() => {
    return localStorage.getItem("restaurantId") || restaurantId;
  }, [restaurantId]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("isDarkMode") === "true";
  });

  // Define fetchCartDetails with proper checks
  const fetchCartDetails = useCallback(async () => {
    const user_id = getCustomerId();
    // const cartId = getCartId();

    const cartId = getCartId() || localStorage.getItem("cartId");

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
            user_id: user_id,
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
            order_items: data.order_items.map((item) => ({
              ...item,
              oldPrice: Math.floor(item.price * 1.1),
            })),
          });
        } else {
          setCartDetails({ order_items: [] });
        }
      } else {
        console.clear();
        setCartDetails({ order_items: [] });
      }
    } catch (error) {
      console.clear();
      setCartDetails({ order_items: [] });
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId]);

  // Initial load effect with restaurant ID check
  useEffect(() => {
    const initializeCart = async () => {
      const { user_id, role } = getUserData();
      const currentRestaurantId = getStoredRestaurantId();

      if (user_id && currentRestaurantId) {
        setIsLoggedIn(true);
        setCustomerId(user_id);
        setCustomerType(role);
        setUserData({ user_id: user_id, role: role });
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

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [fetchCartDetails, restaurantId]);

  const handleClearCart = async () => {
    const user_id = getCustomerId();
    const cartId = getCartId() || localStorage.getItem("cartId");

    if (!user_id || !cartId || !restaurantId) {
      window.showToast("error", "Required information is missing.");
      return;
    }

    try {
      const response = await fetch(
        "https://men4u.xyz/user_api/delete_entire_cart",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart_id: cartId,
            user_id: user_id,
            restaurant_id: restaurantId,
          }),
        }
      );

      const data = await response.json();

      if (data.st === 1) {
        clearCartData();
        window.showToast("success", data.msg || "Cart cleared successfully.");
        setCartDetails({ order_items: [] }); // Clear cart details in state
        localStorage.removeItem("cartId"); // Optionally remove cartId from localStorage
      } else {
        window.showToast("error", data.msg || "Failed to clear the cart.");
      }
    } catch (error) {
      console.clear();
      window.showToast("error", "An error occurred. Please try again later.");
    }
  };

  const clearCartData = () => {
    clearCart(); // Clear cart context
    localStorage.removeItem("cartItems"); // Clear cart items from localStorage
    localStorage.removeItem("cartId"); // Clear cart ID from localStorage
    setCartItems([]); // Clear cart items state if you're using it
  };
  // Window focus handler with restaurant ID check
  useEffect(() => {
    if (userData && restaurantId) {
      const handleFocus = () => {
        fetchCartDetails();
      };

      window.addEventListener("focus", handleFocus);
      return () => window.removeEventListener("focus", handleFocus);
    }
  }, [userData, fetchCartDetails, restaurantId]);

  const getCustomerId = useCallback(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    return userData?.user_id || localStorage.getItem("user_id") || null;
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
        (cartItem) => cartItem.menu_id !== item.menu_id
      );

      // Update localStorage
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

      // Dispatch removal event
      window.dispatchEvent(
        new CustomEvent("cartItemRemoved", {
          detail: { menuId: item.menu_id },
        })
      );

      // Update cart details
      setCartDetails((prev) => ({
        ...prev,
        order_items: updatedCartItems,
      }));

      window.showToast(
        "success",
        `${item.menu_name} has been removed from your cart.`
      );
      fetchCartDetails();
    } catch (error) {
      console.clear();
      window.showToast("error", "Failed to remove item from cart.");
    }
  };

  const updateCartQuantity = async (menuId, quantity) => {
    const user_id = getCustomerId();
    const cartId = getCartId();

    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/update_cart_menu_quantity`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart_id: cartId,
            user_id: user_id,
            restaurant_id: restaurantId,
            menu_id: menuId,
            quantity: quantity,
          }),
        }
      );
      const data = await response.json();
      if (data.st === 1) {
        fetchCartDetails();
      } else {
        console.clear();
      }
    } catch (error) {
      console.clear();
    }
  };

  const incrementQuantity = (item) => {
    if (item.quantity < 20) {
      updateCartQuantity(item.menu_id, item.quantity + 1);
    } else {
      window.showToast(
        "warn",
        "You cannot add more than 20 items of this product."
      );
    }
  };

  const decrementQuantity = (item) => {
    if (item.quantity > 1) {
      updateCartQuantity(item.menu_id, item.quantity - 1);
    }
  };

  const handleUnauthorizedFavorite = (navigate) => {
    showLoginPopup();
  };

  const handleLikeClick = async (menuId) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.user_id || userData.role === "guest") {
      handleUnauthorizedFavorite(navigate);
      return;
    }

    const currentRestaurantId = getStoredRestaurantId();
    if (!currentRestaurantId) {
      window.showToast("error", "Restaurant information is missing");
      return;
    }

    const menuItem = cartDetails.order_items.find(
      (item) => item.menu_id === menuId
    );
    if (!menuItem) {
      return;
    }

    const isFavorite = menuItem.is_favourite;

    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/${
          isFavorite ? "remove" : "save"
        }_favourite_menu`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurant_id: currentRestaurantId,
            menu_id: menuId,
            user_id: userData.user_id,
            role: userData.role,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.st === 1) {
        setCartDetails((prevCart) => ({
          ...prevCart,
          order_items: prevCart.order_items.map((item) =>
            item.menu_id === menuId
              ? { ...item, is_favourite: !isFavorite }
              : item
          ),
        }));

        window.dispatchEvent(
          new CustomEvent("favoriteUpdated", {
            detail: { menuId, isFavorite: !isFavorite },
          })
        );

        window.showToast(
          "success",
          isFavorite ? "Removed from favourites" : "Added to favourites"
        );
      } else {
        console.clear();
        throw new Error(data.msg || "Failed to update favorite status");
      }
    } catch (error) {
      console.clear();
      window.showToast(
        "error",
        error.message || "Failed to update favorite status"
      );
    }
  };

  // Add the standardized rating function
  const renderStarRating = (rating) => {
    const numRating = parseFloat(rating);

    if (!numRating || numRating < 0.5) {
      return <i className="font_size_10 text-warning me-1"></i>;
    }

    if (numRating >= 0.5 && numRating <= 2.5) {
      return (
        <i className="fa-solid fa-star-half-stroke font_size_10 text-warning me-1"></i>
      );
    }

    if (numRating >= 3 && numRating <= 4.5) {
      return (
        <i className="fa-solid fa-star-half-stroke font_size_10 text-warning me-1"></i>
      );
    }

    if (numRating === 5) {
      return (
        <i className="fa-solid fa-star font_size_10 text-warning me-1"></i>
      );
    }

    return (
      <i className="fa-solid fa-star-half-stroke font_size_10 text-warning me-1"></i>
    );
  };

  const getFoodTypeStyles = (foodType) => {
    // Convert foodType to lowercase for case-insensitive comparison
    const type = (foodType || "").toLowerCase();

    switch (type) {
      case "veg":
        return {
          icon: "fa-solid fa-circle text-success",
          border: "border-success",
          textColor: "text-success",
          categoryIcon: "fa-solid fa-utensils text-success me-1", // Added for category
        };
      case "nonveg":
        return {
          icon: "fa-solid fa-play fa-rotate-270 text-danger",
          border: "border-danger",
          textColor: "text-success", // Changed to green for category name
          categoryIcon: "fa-solid fa-utensils text-success me-1", // Added for category
        };
      case "egg":
        return {
          icon: "fa-solid fa-egg",
          border: "gray-text",
          textColor: "gray-text", // Changed to green for category name
          categoryIcon: "fa-solid fa-utensils text-success me-1", // Added for category
        };
      case "vegan":
        return {
          icon: "fa-solid fa-leaf text-success",
          border: "border-success",
          textColor: "text-success",
          categoryIcon: "fa-solid fa-utensils text-success me-1", // Added for category
        };
      default:
        return {
          icon: "fa-solid fa-circle text-success",
          border: "border-success",
          textColor: "text-success",
          categoryIcon: "fa-solid fa-utensils text-success me-1", // Added for category
        };
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
            <div className="fs-4 fw-medium text-dark">Your Cart is Empty</div>
            <p>Add items to your cart from the product details page.</p>

            <div className="d-flex align-items-center justify-content-center mt-2">
              <Link
                className="btn btn-sm btn-outline-primary  rounded-pill  px-3"
                to="/user_app/Menu"
              >
                <i className="bx bx-plus me-1 fs-4"></i> Order More
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
          {magicMessage && (
            <div className="container py-0">
              <div className="font_size_14 text-center text-info mt-2 mb-3 bg-white rounded-pill px-3 py-2">
                <i className="fa-solid fa-wand-magic-sparkles me-2"></i>
                {magicMessage}
              </div>
            </div>
          )}
          <div className="container scrollable-section pt-0">
            {cartDetails.order_items.map((item, index) => (
              <div className="py-1 px-0" key={index}>
                <div className="custom-card rounded-4 shadow-sm">
                  <Link
                    to={`/user_app/ProductDetails/${item.menu_id}`}
                    state={{
                      restaurant_id: userData.restaurantId,
                      menu_cat_id: item.menu_cat_id,
                    }}
                    className="text-decoration-none text-reset"
                  >
                    <div className="card-body py-0">
                      <div className="row">
                        {/* Image Column */}
                        <div className="col-3 px-0 position-relative">
                          <img
                            src={item.image || images}
                            alt={item.menu_name}
                            className="rounded-4 img-fluid object-fit-cover"
                            style={{
                              width: "100%",
                              height: "100%",
                              aspectRatio: "1/1",
                            }}
                            onError={(e) => {
                              e.target.src = images;
                              e.target.style.width = "100%";
                              e.target.style.height = "100%";
                              e.target.style.aspectRatio = "1/1";
                            }}
                          />
                          {/* Like Button */}
                          <div
                            className={`border border-1 rounded-circle ${
                              isDarkMode ? "bg-dark" : "bg-white"
                            } opacity-75 d-flex justify-content-center align-items-center`}
                            style={{
                              position: "absolute",
                              bottom: "3px",
                              right: "3px",
                              height: "20px",
                              width: "20px",
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleLikeClick(item.menu_id);
                            }}
                          >
                            <i
                              className={`${
                                item.is_favourite
                                  ? "fa-solid fa-heart text-danger"
                                  : "fa-regular fa-heart"
                              } fs-6`}
                            ></i>
                          </div>
                          {/* Special Star */}
                          {item.is_special && (
                            <i
                              className="fa-solid fa-star border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center text-info"
                              style={{
                                position: "absolute",
                                top: 3,
                                right: 3,
                                height: 17,
                                width: 17,
                              }}
                            ></i>
                          )}
                          {/* Food Type Icon */}
                          <div
                            className={`border rounded-3 bg-white opacity-100 d-flex justify-content-center align-items-center ${
                              getFoodTypeStyles(item.menu_food_type).border
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
                                getFoodTypeStyles(item.menu_food_type).icon
                              } font_size_12`}
                            ></i>
                          </div>
                          {/* Offer Tag */}
                          {item.offer !== 0 && (
                            <div className="gradient_bg d-flex justify-content-center align-items-center gradient_bg_offer">
                              <span className="font_size_10 text-white">
                                {item.offer || "No"}% Off
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content Column */}
                        <div className="col-9 pt-1 p-0 pe-2">
                          {/* Title Row */}
                          <div className="row d-flex align-items-center mt-1">
                            <div className="col-10">
                              <div className="ps-2 font_size_14 fw-medium">
                                {item.menu_name}
                              </div>
                            </div>
                            <div className="col-2 text-end font_size_10">
                              <div
                                className="d-flex align-items-center justify-content-end"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleRemoveFromCart(item);
                                }}
                              >
                                <i className="fa-solid fa-xmark gray-text font_size_14"></i>
                              </div>
                            </div>
                          </div>

                          {/* Category & Spicy Row */}
                          <div className="row">
                            <div className="col-8">
                              <div className="ps-2">
                                <span className="font_size_10 text-success">
                                  <i className="fa-solid fa-utensils text-success me-1"></i>
                                  {item.menu_cat_name}
                                </span>
                              </div>
                            </div>
                            {item.offer > 0 && (
                              <div className="col-4 text-end px-0">
                                <span className="ps-2 text-success font_size_10">
                                  {item.offer}% Off
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Price & Quantity Row */}
                          <div className="row">
                            <div className="col-7 mt-2">
                              <p className="ms-2 mb-0 fw-medium">
                                {item.offer ? (
                                  <>
                                    <span className="font_size_14 fw-semibold text-info">
                                      ₹
                                      {Math.floor(
                                        item.price * (1 - item.offer / 100)
                                      )}
                                    </span>
                                    <span className="gray-text font_size_12 text-decoration-line-through fw-normal ms-2">
                                      ₹{item.price}
                                    </span>
                                  </>
                                ) : (
                                  <span className="font_size_14 fw-semibold text-info">
                                    ₹{item.price}
                                  </span>
                                )}
                              </p>
                            </div>

                            <div className="col-5 ps-2 my-1">
                              <div className="dz-stepper style-3 d-flex justify-content-end">
                                <div className="input-group bootstrap-touchspin bootstrap-touchspin-injected d-flex align-items-center justify-content-between w-100">
                                  <span className="input-group-btn input-group-prepend">
                                    <button
                                      className="btn btn-primary bootstrap-touchspin-down"
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        decrementQuantity(item);
                                      }}
                                    >
                                      <i className="fa-solid fa-minus fs-6"></i>
                                    </button>
                                  </span>
                                  <span className="text-dark font_size_14 px-2">
                                    {item.quantity}
                                  </span>
                                  <span className="input-group-btn input-group-append">
                                    <button
                                      className="btn btn-primary bootstrap-touchspin-up"
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        incrementQuantity(item);
                                      }}
                                    >
                                      <i className="fa-solid fa-plus fs-6"></i>
                                    </button>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="container py-0">
            <div
              className="d-flex justify-content-end align-items-center gray-text font_size_14"
              onClick={handleClearCart} // Attach the event handler
              style={{ cursor: "pointer" }}
            >
              <i className="fa-solid fa-xmark gray-text font_size_14 pe-2"></i>
              Clear Cart
            </div>
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
                      <div className="col-12 mb-0 pt-0">
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
                      <div className="col-12 pt-0">
                        <div className="d-flex justify-content-between align-items-center py-0">
                          <span className="ps-2 font_size_14 pt-1 gray-text">
                            Total after discount
                            {/* <span className="gray-text small-number">
                              ({cartDetails.service_charges_percent}%)
                            </span> */}
                          </span>
                          <span className="pe-2 font_size_14 gray-text">
                            ₹{cartDetails?.total_after_discount || ""}
                          </span>
                        </div>
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
                  className="btn btn-sm btn-outline-primary  rounded-pill  px-3"
                >
                  <i className="bx bx-plus me-1 fs-4"></i> Order More
                </Link>
              </div>
            </div>
          )}
          <div className="container py-0">
            <NearbyArea />
            <RestaurantSocials />
          </div>
        </main>
      )}

      <Bottom />
    </div>
  );
};

export default Cart;
