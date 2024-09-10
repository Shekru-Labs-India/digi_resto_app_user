

import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import { useRestaurantId } from "../context/RestaurantIdContext";
import Bottom from "../component/bottom";
import Devider from "../component/Devider";
import { useCart } from "../hooks/useCart";

const MenuDetails = () => {
  const [productDetails, setProductDetails] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showQuantityError, setShowQuantityError] = useState(false);
  const navigate = useNavigate();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const { menuId } = useParams();
  const { restaurantId } = useRestaurantId();
  const [customerId, setCustomerId] = useState(null);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  // Fetch customer ID from localStorage on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setCustomerId(userData.customer_id);
    }
  }, []);

  // Convert string to Title Case
  const toTitleCase = (str) => {
    if (!str) return "";
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  // Fetch product details based on menuId
  const fetchProductDetails = async (menuId) => {
    try {
      const response = await fetch(
        "https://menumitra.com/user_api/get_menu_details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            menu_id: menuId,
            customer_id: customerId,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1 && data.lists) {
          const {
            name,
            veg_nonveg,
            spicy_index,
            price,
            description,
            image,
            is_favourite,
            menu_cat_name,
          } = data.lists;
          const oldPrice = Math.floor(price * 1.1);
          setProductDetails({
            name,
            veg_nonveg,
            spicy_index,
            price,
            oldPrice,
            description,
            image,
            menu_cat_name,
            menu_id: menuId,
          });
          setIsFavorite(is_favourite === 1); // Update favorite status based on API response
        } else {
          console.error("Invalid data format:", data);
        }
      } else {
        console.error("Network response was not ok.");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    if (menuId && restaurantId && customerId !== null) {
      fetchProductDetails(menuId); // Fetch product details when component mounts or dependencies change
    }
  }, [menuId, restaurantId, customerId]);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItemsCount(cartItems.length);
  }, []);

  const handleLikeClick = async () => {
    if (!customerId || !restaurantId || !menuId) {
      console.error("Missing required IDs");
      return;
    }

    setIsFavoriteLoading(true);

    try {
      const apiUrl = isFavorite
        ? "https://menumitra.com/user_api/delete_favourite_menu"
        : "https://menumitra.com/user_api/save_favourite_menu";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          menu_id: menuId,
          customer_id: customerId,
        }),
      });

      const data = await response.json();
      console.log("API Response:", data); // Log the response for debugging

      if (data.st === 1) {
        setIsFavorite(!isFavorite);
        console.log("Favorite status updated successfully");
      } else if (data.st === 2 && !isFavorite) {
        console.log("Menu already in wishlist");
        setIsFavorite(true);
      } else if (data.st === 2 && isFavorite) {
        console.log("Menu already removed from wishlist");
        setIsFavorite(false);
      } else {
        console.error("Failed to update favorite status:", data.msg);
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (quantity === 0) {
      setShowQuantityError(true);
      return;
    }

    if (!productDetails || isMenuItemInCart()) return;

    const cartItem = { ...productDetails, quantity };
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems.push(cartItem);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    setCartItemsCount(cartItems.length);

    navigate("/Cart");
  };

  const incrementQuantity = () => {
    if (quantity < 20) {
      setQuantity((prevQuantity) => prevQuantity + 1);
      setShowQuantityError(false);
    } else {
      alert("Maximum limit reached for this item.");
    }
  };

  const decrementQuantity = () => {
    if (quantity > 0) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      setShowQuantityError(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const isMenuItemInCart = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    return cartItems.some((item) => item.menu_id === parseInt(menuId));
  };

  const shouldDisplayFooter = !isMenuItemInCart();

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="page-wrapper">
        <header className="header header-fixed style-3">
          <div className="header-content">
            <div className="left-content">
              <div
                className="back-btn dz-icon icon-fill icon-sm"
                onClick={handleBack}
              >
                <i className="ri-arrow-left-line"></i>
              </div>
            </div>
            <div className="mid-content">
              <h5 className="title">Product Details</h5>
            </div>
            <div className="right-content">
              <Link
                to="/Cart"
                className="notification-badge dz-icon icon-sm icon-fill"
              >
                <i className="ri-shopping-cart-2-line"></i>
                {cartItemsCount > 0 && (
                  <span className="badge badge-danger">{cartItemsCount}</span>
                )}
              </Link>
            </div>
          </div>
        </header>

        <main className="page-content p-b80">
          <div className="swiper product-detail-swiper">
            <div className="product-detail-image img">
              <img
                className="product-detail-image"
                src={productDetails.image || images} // Use default image if image is null
                alt={productDetails.name}
                onError={(e) => {
                  e.target.src = images;
                }}
              />
            </div>
            <div className="swiper-btn p-t15">
              <div className="swiper-pagination style-1"></div>
            </div>
          </div>
          <div className="container">
            <div className="dz-product-detail">
              <div className="detail-content" style={{ position: "relative" }}>
                {productDetails.menu_cat_name && (
                  <h3 className="product-title">
                    {/* {productDetails.menu_cat_name} */}
                  </h3>
                )}
                <div className="row">
                  <div className="col-6">
                    <h4 className="title" style={{ fontSize: "20px" }}>
                      {toTitleCase(productDetails.name)} (
                      {toTitleCase(productDetails.veg_nonveg)})
                    </h4>
                  </div>
                  <div className="col-6">
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      padding: '5px',
                      width: 'fit-content',
                      marginLeft: 'auto'
                    }}>
                      <button
                        onClick={decrementQuantity}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          border: '1px solid #ccc',
                          background: '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '10px'
                        }}
                      >
                        <i className="ri-subtract-line"></i>
                      </button>
                      <span style={{margin: '0 10px', fontSize: '18px'}}>{quantity}</span>
                      <button
                        onClick={incrementQuantity}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          border: '1px solid #ccc',
                          background: '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginLeft: '10px'
                        }}
                      >
                        <i className="ri-add-line"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* like button  */}

                {/* {customerId && (
                <i
                  className={`bx ${
                    isFavorite ? "bxs-heart text-red" : "bx-heart"
                  } bx-sm`}
                  onClick={handleLikeClick}
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    fontSize: "23px",
                    cursor: "pointer",
                  }}
                >
                  {isFavoriteLoading && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                    />
                  )}
                </i>
              )} */}
              </div>

              {/* <div className="rating-container">
                <i className="ri-star-half-line star" />
                <span className="rating-text">
                  4.9 <span className="rating-count">(570)</span>
                </span>
                <span className="separator">|</span>
                <span className="time">
                  <i className="ri-timer-line timer-icon" />
                  8-10 Min
                </span>
                <span className="separator">|</span>
              </div> */}

              <div className="product-meta">
                {/* <span>Spiciness Level:</span> */}
                {productDetails.spicy_index && (
                  <div
                    className="spicy-index"
                    style={{ paddingBottom: "10px" }}
                  >
                    {Array.from({ length: 5 }).map((_, index) =>
                      index < productDetails.spicy_index ? (
                        <i
                          key={index}
                          className="ri-fire-fill"
                          style={{ fontSize: "13px", color: "#eb8e57" }}
                        ></i>
                      ) : (
                        <i
                          key={index}
                          className="ri-fire-line"
                          style={{ fontSize: "13px", color: "#0000001a" }}
                        ></i>
                      )
                    )}
                  </div>
                )}
              </div>
              <div className="product-info">
                {/* <h4 className="">Description</h4> */}
                <div className="desc">
                  <p>{productDetails.description}</p>
                </div>

                <div className="d-flex align-items-center justify-content-between py-4">
                  {/* <div className="btn-group btn-quantity">
                  <button
                    className="btn btn-light btn-sm"
                    onClick={decrementQuantity}
                  >
                    <i className="ri-subtract-line"></i>
                  </button>
                  <span className="btn btn-light btn-sm">{quantity}</span>
                  <button
                    className="btn btn-light btn-sm"
                    onClick={incrementQuantity}
                  >
                    <i className="ri-add-line"></i>
                  </button>
                </div> */}
                  {/* <button
                    className="btn btn-primary btn-sm"
                    onClick={handleAddToCart}
                  >
                    <i
                      class="ri-shopping-cart-line"
                      style={{ fontSize: "25px", paddingRight: "10px" }}
                    ></i>
                    Add To Cart
                  </button> */}
                </div>
                {showQuantityError && (
                  <div className="text-danger">Please add a quantity.</div>
                )}
              </div>
            </div>
          </div>
        </main>
        <div className="container">

        <div className="row">
          <div className="col-12">
        <Devider />

        </div>
          </div>
        </div>

        {shouldDisplayFooter && (
          <footer
            className="footer fixed"
            style={{ position: "absolute", bottom: "70px" }}
          >
            <div className="container">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex flex-column">
                  <h5 className="mb-0">Total amount</h5>
                  <div className="d-flex align-items-baseline">
                    <h4 className="mb-0 price" style={{ color: "#4E74FC" }}>
                      ₹{productDetails.price}
                    </h4>
                    <span
                      className="price-old ms-2"
                      style={{
                        textDecoration: "line-through",
                        color: "#a5a5a5",
                        fontSize: "13px",
                        position: "relative",
                      }}
                    >
                      {/* {productDetails.oldPrice} */}
                    </span>
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ borderRadius: "100px" }}
                  onClick={() => navigate("/Cart")}
                >
                  <i
                    className="ri-shopping-cart-2-line"
                    style={{ fontSize: "25px", paddingRight: "10px" }}
                  ></i>
                  Add to Cart
                </button>
              </div>
            </div>
          </footer>
        )}
      </div>
      <Bottom />
    </>
  );
};

export default MenuDetails;
