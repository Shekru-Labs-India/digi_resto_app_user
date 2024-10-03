import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import { useRestaurantId } from "../context/RestaurantIdContext";
import { useCart } from "../hooks/useCart";
import Bottom from "../component/bottom";

const MenuDetails = () => {
  const [productDetails, setProductDetails] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [showQuantityError, setShowQuantityError] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0); // Total amount state
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const { menuId } = useParams();
  const { restaurantId } = useRestaurantId();
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const { addToCart } = useCart();
  const location = useLocation();
  const menu_cat_id = location.state?.menu_cat_id || 1;

  const toTitleCase = (str) => {
    if (!str) return "";
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  // Fetch product details
  const fetchProductDetails = async () => {
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
            menu_cat_id: menu_cat_id,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data); // Debugging line

        if (data.st === 1 && data.details) {
          const {
            menu_name,
            category_name,
            spicy_index,
            price,
            description,
            image,
            offer,
            rating,
          } = data.details;

          const discountedPrice = offer ? price - (price * offer) / 100 : price;
          const oldPrice = offer ? Math.floor(price * 1.1) : null; // Calculate

          setProductDetails({
            name: menu_name,
            veg_nonveg: category_name,
            spicy_index,
            price,
            discountedPrice,
            oldPrice,
            description,
            image,
            menu_cat_name: category_name,
            menu_id: menuId,
            offer,
            rating,
          });

          // Set the initial total amount
          setTotalAmount(discountedPrice * quantity);
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

  // Function to create a new cart
  const createCart = async (customerId, restaurantId) => {
    try {
      const response = await fetch(
        "https://menumitra.com/user_api/create_cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            customer_id: customerId,
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1) {
        localStorage.setItem("cartId", data.cart_id);
        return data.cart_id;
      } else {
        console.error("Failed to create cart:", data.msg);
        return null;
      }
    } catch (error) {
      console.error("Error creating cart:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchProductDetails();
    fetchCartDetails();
  }, [menuId, restaurantId]);

  const fetchCartDetails = async () => {
    const customerId = JSON.parse(
      localStorage.getItem("userData")
    )?.customer_id;
    let cartId = localStorage.getItem("cartId");

    console.log("Customer ID:", customerId);
    console.log("Restaurant ID:", restaurantId);
    console.log("Cart ID:", cartId);

    if (!customerId || !restaurantId) {
      console.error("Missing required data");
      return;
    }

    if (!cartId) {
      cartId = await createCart(customerId, restaurantId);
      if (!cartId) {
        console.error("Failed to create cart");
        return;
      }
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
      console.log("API response data:", data);

      if (data.st === 1) {
        setCartItems(data.order_items);
      } else if (data.st === 2) {
        console.error("Cart not found, creating a new cart.");
        cartId = await createCart(customerId, restaurantId);
        if (cartId) {
          fetchCartDetails(); // Retry fetching cart details
        }
      } else {
        console.error("Failed to fetch cart details:", data.msg);
      }
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  };

  const handleAddToCart = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData || !userData.customer_id) {
      navigate("/Signinscreen");
      return;
    }

    const existingCartItem = cartItems.find((item) => item.menu_id === menuId);
    const currentQuantity = existingCartItem ? existingCartItem.quantity : 0;

    // Ensure the total quantity does not exceed 20
    if (currentQuantity + quantity > 20) {
      alert("You cannot add more than 20 items of this product.");
      return;
    }

    const isAlreadyInCart = cartItems.some((item) => item.menu_id === menuId);
    if (isAlreadyInCart) {
      alert("The item is already added in the cart.");
      return;
    }

    const customerId = userData.customer_id;
    let cartId = localStorage.getItem("cartId");

    if (!cartId) {
      cartId = await createCart(customerId, restaurantId);
      if (!cartId) {
        console.error("Failed to create cart");
        return;
      }
    }

    try {
      const response = await fetch(
        "https://menumitra.com/user_api/add_to_cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            menu_id: menuId,
            customer_id: customerId,
            cart_id: cartId,
            quantity: quantity,
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1) {
        console.log("Item added to cart successfully.");
        fetchCartDetails(); // Refresh cart details
        navigate("/Cart");
      } else {
        console.error("Failed to add item to cart:", data.msg);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  // Function to handle favorite status toggle
  const handleLikeClick = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData || !restaurantId) {
      console.error("Missing required data");
      return;
    }

    if (!userData.customer_id) {
      navigate("/Signinscreen");
      return;
    }

    const apiUrl = isFavorite
      ? "https://menumitra.com/user_api/remove_favourite_menu"
      : "https://menumitra.com/user_api/save_favourite_menu";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          menu_id: menuId,
          customer_id: userData.customer_id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1) {
          setIsFavorite(!isFavorite);
          console.log(
            isFavorite ? "Removed from favorites" : "Added to favorites"
          );
        } else {
          console.error("Failed to update favorite status:", data.msg);
        }
      } else {
        console.error("Network response was not ok.");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

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
                <i className="ri-arrow-left-line fs-3"></i>
              </div>
            </div>
            <div className="mid-content">
              <h5 className="title fs-5">Product Details</h5>
            </div>
          </div>
        </header>

        <main className="page-content pb-5">
          <div className="swiper product-detail-swiper">
            <div className="product-detail-image img">
              <img
                className="product-detail-image mt-5 pt-2"
                src={productDetails.image || images}
                alt={productDetails.name}
                style={{}}
                onError={(e) => {
                  e.target.src = images;
                }}
              />
            </div>
          </div>

          <div className="container">
            <div className="dz-product-detail">
              <div className="detail-content mt-0 mb-1">
                {productDetails.menu_cat_name && (
                  <h3 className="product-title">
                    {/* {toTitleCase(productDetails.menu_cat_name)} */}
                  </h3>
                )}
                <div className="row mt-0 me-1">
                  <div className="col-7 mt-2">
                    <h4 className="title fs-sm">
                      {toTitleCase(productDetails.name)}
                    </h4>
                  </div>
                </div>
              </div>

              <div className="product-meta">
                <div className="row me-1">
                  <div className="col-5 pe-0 ps-1">
                    <div className="dz-quantity detail-content category-text m-0 ps-2 text-primary fs-6 px-0">
                      <i className="ri-restaurant-line  me-1 fs-6"></i>
                      {productDetails.menu_cat_name || "Category Name"}
                    </div>
                  </div>

                  <div className="col-3 ps-4 text-center">
                    {productDetails.spicy_index && (
                      <div className="spicy-index">
                        {Array.from({ length: 5 }).map((_, index) =>
                          index < productDetails.spicy_index ? (
                            <i
                              key={index}
                              className="ri-fire-fill firefill offer-code"
                            ></i>
                          ) : (
                            <i
                              key={index}
                              className="ri-fire-line  gray-text"
                            ></i>
                          )
                        )}
                      </div>
                    )}
                  </div>
                  <div className="col-4 text-end px-0 ">
                    <i className="ri-star-half-line fs-6 pe-1 ratingStar"></i>
                    <span className="fs-6 fw-semibold gray-text">
                      {productDetails.rating}
                    </span>
                  </div>
                </div>
              </div>
              <div className="container">
                <div className="row">
                  <div className="col-4 py-1 ps-0 quantity-container">
                    <button
                      onClick={() =>
                        setQuantity(quantity > 1 ? quantity - 1 : 1)
                      }
                      className="quantity-button"
                    >
                      <i className="ri-subtract-line"></i>
                    </button>

                    <span className="quantity-text">{quantity}</span>

                    <button
                      onClick={() => {
                        if (quantity < 20) {
                          setQuantity(quantity + 1);
                        } else {
                          alert("You cannot add more than 20 items.");
                        }
                      }}
                      className="quantity-button"
                    >
                      <i className="ri-add-line"></i>
                    </button>
                  </div>
                  <div className="col-8 pe-2 text-end">
                    <i
                      className={`ri-${
                        isFavorite ? "hearts-fill" : "heart-2-line"
                      } fs-3`}
                      onClick={handleLikeClick}
                      style={{
                        cursor: "pointer",
                        color: isFavorite ? "#fe0809" : "#73757b",
                      }}
                    ></i>
                  </div>
                </div>
              </div>

              <div className="container">
                <div className="product-info">
                  <div>
                    <p className="fs-7 text-wrap m-0">
                      {productDetails.description}
                    </p>
                  </div>

                  {showQuantityError && (
                    <div className="text-danger">Please add a quantity.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        <div className="container py-0">
          <footer className=" footer fixed-bottom-custom">
            <div className="row">
              <hr className="dashed-line me-5 pe-5" />

              <div className="col-6 ps-3 ">
                <div className="d-flex align-items-center justify-content-between mb-5">
                  <div className="d-flex flex-column">
                    <h5 className="mb-2 fs-6 fw-medium">Total amount</h5>
                    <div className="d-flex align-items-baseline">
                      <h4 className="mb-0 price fs-4 text-info">
                        ₹{(productDetails.price * quantity).toFixed(0)}
                      </h4>
                      <span className="text-decoration-line-through ms-2 fs-6 gray-text">
                        ₹{(productDetails.oldPrice * quantity).toFixed(0)}
                      </span>
                    </div>
                    <div className="fw-medium d-flex fs-6 offer-color pt-1">
                      {productDetails.offer}% Off
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 text-end">
                <button
                  to="#"
                  className="btn btn-color fs-3 py-4 me-2  rounded-pill"
                  onClick={handleAddToCart}
                >
                  <i className="ri-shopping-cart-line  pe-1 text-white"></i>
                  <div className="font-poppins fs-6 text-nowrap  text-white">
                    Add to Cart
                  </div>
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
      <Bottom />
    </>
  );
};

export default MenuDetails;
