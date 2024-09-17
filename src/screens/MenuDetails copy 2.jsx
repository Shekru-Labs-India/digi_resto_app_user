import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import { useRestaurantId } from "../context/RestaurantIdContext";
import { useCart } from "../hooks/useCart";
import Bottom from "../component/bottom";
import Devider from "../component/Devider";

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
  const { addToCart, cartItems } = useCart();

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
          setIsFavorite(is_favourite === 1);
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
      fetchProductDetails(menuId);
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
      console.log("API Response:", data);

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
    if (quantity === 0 || !productDetails) return;

    addToCart({ ...productDetails, quantity });
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

  const shouldDisplayFooter = !cartItems.some(
    (item) => item.menu_id === productDetails?.menu_id
  );

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
                src={productDetails.image || images}
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
              <div className="detail-content" style={{}}>
                {productDetails.menu_cat_name && (
                  <h3 className="product-title">
                    {/* {productDetails.menu_cat_name} */}
                  </h3>
                )}
                <div className="row  mt-0 ">
                  <div className="col-8">
                    <h4 className="title fs-2">
                      {toTitleCase(productDetails.name)} (
                      {toTitleCase(productDetails.veg_nonveg)})
                    </h4>
                  </div>
                  <div
                    className="col-4 py-1 rounded-3 text-"
                    style={{
                      backgroundColor: "#e7dedf",
                      width: "120px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={decrementQuantity}
                      style={{
                        width: "50px",
                        height: "30px",
                        borderRadius: "100%",
                        border: "1px solid #ccc",
                        background: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "10px",
                      }}
                    >
                      <i className="ri-subtract-line"></i>
                    </button>
                    <span style={{ margin: "0 10px", fontSize: "18px" }}>
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      style={{
                        width: "50px",
                        height: "30px",
                        borderRadius: "100%",
                        border: "1px solid #ccc",
                        background: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: "10px",
                      }}
                    >
                      <i className="ri-add-line"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="product-meta">
                <div className="row">
                  <div className="col-4">
                    <div
                      className="dz-quantity detail-content fs-4 fw-medium m-0"
                      style={{ color: "#0a795b" }}
                    >
                      <i
                        class="ri-restaurant-line fs-3"
                        style={{ paddingRight: "5px" }}
                      ></i>
                      Italian
                    </div>
                  </div>
                  <div className="col-4 text-center">
                    <div className="d-flex align-items-center">
                      <i
                        class="ri-star-half-line pe-1"
                        style={{ color: "#f8a500", fontSize: "23px" }}
                      ></i>
                      <span
                        className="fs-3 fw-semibold"
                        style={{ color: "#7f7e7e", marginLeft: "5px" }}
                      >
                        4.5
                      </span>
                    </div>
                  </div>
                  <div className="col-4 text-end">
                    {productDetails.spicy_index && (
                      <div
                        className="spicy-index"
                        style={{ paddingBottom: "10px" }}
                      >
                        {Array.from({ length: 5 }).map((_, index) =>
                          index < productDetails.spicy_index ? (
                            <i
                              key={index}
                              className="ri-fire-fill fs-2"
                              style={{ color: "#eb8e57" }}
                            ></i>
                          ) : (
                            <i
                              key={index}
                              className="ri-fire-line fs-2"
                              style={{ color: "#0000001a" }}
                            ></i>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="product-info ">
                <div className="desc ">
                  <p className="fs-3">{productDetails.description}</p>
                </div>

                <div className="d-flex align-items-center justify-content-between py-4"></div>
                {showQuantityError && (
                  <div className="text-danger">Please add a quantity.</div>
                )}
              </div>
            </div>
          </div>
        </main>
        <div className="container">
          <div className="row">
            <div className="col-12"></div>
          </div>
        </div>

        {shouldDisplayFooter && (
          <footer
            className="footer fixed"
            style={{ position: "absolute", bottom: "70px" }}
          >
            {/* <Devider style={{position:"absolute", top:"100px"}}/> */}
            <div className="container">
              <div className="" style={{ position: "relative", top: "-50px" }}>
                <hr className="dashed" />
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="d-flex align-items-center justify-content-between mb-5">
                    <div className="d-flex flex-column">
                      <h5 className="mb-2">Total amount</h5>
                      <div className="d-flex align-items-baseline">
                        <h4
                          className="mb-0 price fs-1"
                          style={{ color: "#4E74FC" }}
                        >
                          ₹{productDetails.price}
                        </h4>
                        <span
                          className=" text-decoration-line-through ms-2"
                          style={{ color: "#a5a5a5" }}
                        >
                          ₹500
                        </span>
                        <div
                          className="fw-medium d-flex fs-5 ps-2"
                          style={{ color: "#0D775E" }}
                        >
                          40% off
                        </div>
                        {/* <span
                          className="price-old ms-2"
                          style={{
                            textDecoration: "line-through",
                            color: "#a5a5a5",
                            fontSize: "13px",
                            position: "relative",
                          }}
                        ></span> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6 text-end pt-2">
                  <button
                    className="btn btn-primary"
                    style={{ borderRadius: "100px" }}
                    onClick={handleAddToCart}
                  >
                    <i
                      className="ri-shopping-cart-line fs-1 pe-3 "
                      style={{}}
                    ></i>
                    Add to Cart
                  </button>
                </div>
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
