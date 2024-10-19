import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import { useRestaurantId } from "../context/RestaurantIdContext";
import { useCart } from "../hooks/useCart";
import Bottom from "../component/bottom";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/saga-blue/theme.css"; // Choose a theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Header from "../components/Header";
import HotelNameAndTable from "../components/HotelNameAndTable";

const MenuDetails = () => {
  const toast = useRef(null);
  const [productDetails, setProductDetails] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [showQuantityError, setShowQuantityError] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0); // Total amount state
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cartItems")) || [];
  });
  const { restaurantName } = useRestaurantId();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { menuId: menuIdString } = useParams();
  const menuId = parseInt(menuIdString, 10);
  const { restaurantId } = useRestaurantId();
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const { addToCart } = useCart();
  const location = useLocation();
  const [favorites, setFavorites] = useState([]);
  const menu_cat_id = location.state?.menu_cat_id || 1;
  const [cartDetails, setCartDetails] = useState({ order_items: [] });
  const customerId = JSON.parse(localStorage.getItem("userData"))?.customer_id;
  const toTitleCase = (str) => {
    if (!str) return "";
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  const [isFromDifferentRestaurant, setIsFromDifferentRestaurant] =
    useState(false);

  const orderedItems = location.state?.orderedItems || [];

  const isItemOrdered = (menuId) => {
    return orderedItems.some((item) => item.menu_id === menuId);
  };

  // Fetch product details
  const fetchProductDetails = async () => {
    const { state } = location;
    const currentRestaurantId = state?.fromWishlist
      ? state.restaurant_id
      : restaurantId;
    try {
      const response = await fetch(
        "https://menumitra.com/user_api/get_menu_details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: currentRestaurantId,
            menu_id: menuId,
            menu_cat_id: menu_cat_id,
            customer_id: customerId,
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
            is_favorite,
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
            is_favorite,
            restaurant_id: currentRestaurantId,
          });

          setIsFavorite(data.details.is_favourite); // Use the correct source

          // Set the initial total amount
          setTotalAmount(discountedPrice * quantity);
          setIsFromDifferentRestaurant(
            data.details.restaurant_id !== restaurantId
          );
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
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setUserData(storedUserData);
    } else {
      console.error("User data not found in local storage.");
    }
    fetchProductDetails();
  }, []);

  useEffect(() => {
    fetchProductDetails();
  }, [menuId, location.state]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData || !userData.customer_id) {
      navigate("/Signinscreen");
      return;
    }

    const customerId = userData.customer_id;
    let cartId = localStorage.getItem("cartId");

    if (!cartId) {
      cartId = await (customerId, restaurantId);
      if (!cartId) {
        console.error("Failed to create cart");
        return;
      }
      localStorage.setItem("cartId", cartId); // Store the cart ID
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
            customer_id: customerId,
            restaurant_id: restaurantId,
            menu_id: menuId,
            quantity: quantity,
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1) {
        console.log("Item added to cart successfully.");
        const updatedCartItems = [
          ...cartItems,
          { ...productDetails, quantity: 1 },
        ];
        setCartItems(updatedCartItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        localStorage.setItem("cartId", data.cart_id);
        toast.current.show({
          severity: "success",
          summary: "Added to Cart",
          detail: "Item has been added to your cart.",
          life: 2000,
        });

        setTimeout(() => {
          navigate("/Cart");
        }, 2000);
      } else {
        console.error("Failed to add item to cart:", data.msg);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const isMenuItemInCart = (menuId) => {
    return cartItems.some((item) => item.menu_id === menuId);
  };

  if (!productDetails) {
    return <div></div>;
  }

  // Function to handle favorite status toggle
  const handleLikeClick = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData || !restaurantId) {
      console.error("Missing required data");
      navigate("/Signinscreen");
      return;
    }

    if (!userData.customer_id) {
      navigate("/Signinscreen");
      return;
    }

    const apiUrl = isFavorite
      ? "https://menumitra.com/user_api/remove_favourite_menu"
      : "https://menumitra.com/user_api/save_favourite_menu";

      const currentRestaurantId = productDetails.restaurant_id || restaurantId; 

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurant_id: currentRestaurantId,
          menu_id: menuId,
          customer_id: userData.customer_id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1) {
          const updatedFavoriteStatus = !isFavorite;
          setIsFavorite(updatedFavoriteStatus);
          setProductDetails({
            ...productDetails,
            is_favourite: updatedFavoriteStatus,
          });
          toast.current.show({
            severity: updatedFavoriteStatus ? "success" : "info",
            summary: updatedFavoriteStatus
              ? "Added to Favorites"
              : "Removed from Favorites",
            detail: updatedFavoriteStatus
              ? "Item has been added to your favorites."
              : "Item has been removed from your favorites.",
            life: 2000,
          });
          window.dispatchEvent(new CustomEvent("favoritesUpdated"));
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

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 20) {
      setQuantity(newQuantity);
      toast.current.show({
        severity: "info",
        summary: "Quantity Updated",
        detail: `Quantity set to ${newQuantity}.`,
        life: 2000,
      });
    } else if (newQuantity > 20) {
      toast.current.show({
        severity: "warn",
        summary: "Limit Reached",
        detail: "You cannot add more than 20 items.",
        life: 2000,
      });
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <Toast ref={toast} position="bottom-center" className="custom-toast" />
        <Header
          className="fs-6 fw-medium"
          title={toTitleCase(productDetails.name)}
        />

        <main className="page-content ">
          <div className="mt-5 pt-1">
            <div className="container py-0 my-0 ">
              <HotelNameAndTable
                restaurantName={restaurantName}
                tableNumber={userData?.tableNumber || "1"}
              />
            </div>
          </div>
          <div className="swiper product-detail-swiper">
            <div className="product-detail-image img">
              <img
                className="product-detail-image"
                src={productDetails.image || images}
                alt={productDetails.name}
                style={{
                  aspectRatio: "16/9",
                  objectFit: "cover",
                  height: "100%",
                }}
                onError={(e) => {
                  e.target.src = images;
                }}
              />
            </div>
          </div>

          {isFromDifferentRestaurant && (
            <div className="container mt-3">
              <div className="alert alert-warning" role="alert">
                This Menu is from a different restaurant. You can view details,
                but can't add it to your current cart.
              </div>
            </div>
          )}

          <div className="container py-0">
            <div className="dz-product-detail">
              <div className="detail-content mt-0 mb-0">
                {productDetails.menu_cat_name && (
                  <h3 className="product-title">
                    {/* {toTitleCase(productDetails.menu_cat_name)} */}
                  </h3>
                )}
                <div className="row mt-0 me-1">
                  <div className="col-12">
                    <span className=" font_size_14 fw-semibold mb-1">
                      {toTitleCase(productDetails.name)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="product-meta ">
                <div className="row me-1">
                  <div className="col-5 px-0 pt-2">
                    <div className="ps-3 text-success font_size_12 ">
                      <i className="ri-restaurant-line  me-1 text-success "></i>
                      {productDetails.menu_cat_name || "Category Name"}
                    </div>
                  </div>

                  <div className="col-3 ps-4 pt-1 text-center">
                    {productDetails.spicy_index && (
                      <div className="spicy-index">
                        {Array.from({ length: 5 }).map((_, index) =>
                          index < productDetails.spicy_index ? (
                            <i
                              key={index}
                              className="ri-fire-fill text-danger font_size_14 firefill offer-code"
                            ></i>
                          ) : (
                            <i
                              key={index}
                              className="ri-fire-line  gray-text font_size_14"
                            ></i>
                          )
                        )}
                      </div>
                    )}
                  </div>
                  <div className="col-4 text-end px-0 ">
                    <i className="ri-star-half-line font_size_14 ratingStar"></i>
                    <span className="font_size_12  fw-normal gray-text">
                      {productDetails.rating}
                    </span>
                  </div>
                </div>
              </div>
              <div className="container ps-2 pt-1">
                <div className="row">
                  <div className="col-6 pt-1 ps-0">
                    {!isFromDifferentRestaurant && (
                      <div className="dz-stepper style-3 ">
                        <div className="input-group bootstrap-touchspin bootstrap-touchspin-injected menu_details-quantity">
                          <span className="input-group-btn input-group-prepend">
                            <i
                              className="ri-subtract-line fs-2 me-2"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleQuantityChange(-1)}
                            ></i>
                          </span>
                          <span className="stepper px-3 rounded-1 bg-light text-center">
                            {quantity}
                          </span>
                          <span className="input-group-btn input-group-append">
                            <i
                              className="ri-add-line fs-2 ms-2"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleQuantityChange(1)}
                            ></i>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="col-6 pe-1 text-end pt-1">
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

              <div className="container ps-0 pt-1">
                <div className="product-info menu_details-description">
                  <div>
                    <span className="  text-wrap m-0">
                      {productDetails.description}
                    </span>
                  </div>

                  {showQuantityError && (
                    <div className="text-danger">Please add a quantity.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <div className="footer-fixed-btn bottom-0 pt-0 pe-0">
          <div className="container pt-0">
            <footer className="footer mb-2">
              <div className="row">
                <hr className="dashed-line me-5 pe-5" />

                <div className="col-5 ps-1 pe-0">
                  <div className="d-flex align-items-center justify-content-between mb-5">
                    <div className="d-flex flex-column">
                      <span className="mb-2     ps-0 menu_details-total-amount">
                        Total amount
                      </span>
                      <div className="d-flex align-items-baseline">
                        <h4 className="font_size_14 fw-semibold text-info">
                          ₹{(productDetails.price * quantity).toFixed(0)}
                        </h4>
                        <span className="text-decoration-line-through ms-2 font_size_12 fw-normal gray-text">
                          ₹{(productDetails.oldPrice * quantity).toFixed(0)}
                        </span>
                      </div>
                      <div className="font_size_12 text-success">
                        {productDetails.offer}% Off
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-7 px-0 text-center menu_details-add-to-cart">
                  {isFromDifferentRestaurant ? (
                    <button
                      className="btn btn-outline-secondary rounded-pill p-3"
                      disabled
                    >
                      <div className="font-poppins text-break">
                        Different Restaurant
                      </div>
                    </button>
                  ) : isItemOrdered(menuId) ? (
                    <button
                      className="btn btn-outline-primary rounded-pill"
                      disabled
                    >
                      <i className="ri-check-line pe-1"></i>
                      <div className="font-poppins text-nowrap">Ordered</div>
                    </button>
                  ) : isMenuItemInCart(menuId) ? (
                    <button
                      className="btn btn-color rounded-pill"
                      onClick={() => navigate("/Cart")}
                    >
                      <i className="ri-shopping-cart-line pe-1 text-white"></i>
                      <div className="font-poppins text-nowrap text-white">
                        Go to Cart
                      </div>
                    </button>
                  ) : (
                    <button
                      className="btn btn-color rounded-pill"
                      onClick={handleAddToCart}
                    >
                      <i className="ri-shopping-cart-line pe-1 text-white"></i>
                      <div className="text-nowrap text-white">Add to Cart</div>
                    </button>
                  )}
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
      <Bottom />
    </>
  );
};

export default MenuDetails;
