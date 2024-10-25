import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import { useRestaurantId } from "../context/RestaurantIdContext";
import { useCart } from "../context/CartContext";
import Bottom from "../component/bottom";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Header from "../components/Header";
import HotelNameAndTable from "../components/HotelNameAndTable";
import LoaderGif from "./LoaderGIF";

const MenuDetails = () => {
  const toast = useRef(null);
  const [productDetails, setProductDetails] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showQuantityError, setShowQuantityError] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const { restaurantName } = useRestaurantId();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { menuId: menuIdString } = useParams();
  const menuId = parseInt(menuIdString, 10);
  const { restaurantId } = useRestaurantId();
  const { cartItems,  } = useCart();
  const { addToCart, removeFromCart, isMenuItemInCart } = useCart();
  
  const [customerId, setCustomerId] = useState(null);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
 
  const location = useLocation();
  const [favorites, setFavorites] = useState([]);
  const menu_cat_id = location.state?.menu_cat_id || 1;
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [portionSize, setPortionSize] = useState('full');
  const [halfPrice, setHalfPrice] = useState(null);
  const [fullPrice, setFullPrice] = useState(null);
  const [isPriceFetching, setIsPriceFetching] = useState(false);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setUserData(storedUserData);
      setCustomerId(storedUserData.customer_id);
    }
  }, []);
 
  const toTitleCase = (str) => {
    if (!str) return "";
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  const [isFromDifferentRestaurant, setIsFromDifferentRestaurant] = useState(false);

  const orderedItems = location.state?.orderedItems || [];

  const isItemOrdered = (menuId) => {
    return orderedItems.some((item) => item.menu_id === menuId);
  };

  const fetchProductDetails = async () => {
    setIsLoading(true);
    const { state } = location;
    const currentRestaurantId = state?.fromWishlist ? state.restaurant_id : restaurantId;
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
        console.log("API Response:", data);

        if (data.st === 1 && data.details) {
          const {
            menu_name,
            category_name,
            spicy_index,
            price,
            description,
            ingredients,
            image,
            offer,
            rating,
            is_favorite,
          } = data.details;

          const discountedPrice = offer ? price - (price * offer) / 100 : price;
          const oldPrice = offer ? Math.floor(price * 1.1) : null;

          setProductDetails({
            name: menu_name,
            veg_nonveg: category_name,
            spicy_index,
            price,
            discountedPrice,
            oldPrice,
            description,
            ingredients,
            image,
            menu_cat_name: category_name,
            menu_id: menuId,
            offer,
            rating,
            is_favorite,
            restaurant_id: currentRestaurantId,
          });

          setIsFavorite(data.details.is_favourite);
          setTotalAmount(discountedPrice * quantity);
          setIsFromDifferentRestaurant(data.details.restaurant_id !== restaurantId);
        } else {
          console.error("Invalid data format:", data);
        }
      } else {
        console.error("Network response was not ok.");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [menuId, location.state, customerId]);

  const fetchHalfFullPrices = async () => {
    setIsPriceFetching(true);
    try {
      const response = await fetch("https://menumitra.com/user_api/get_full_half_price_of_menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          menu_id: menuId
        }),
      });

      const data = await response.json();
      if (response.ok && data.st === 1) {
        setHalfPrice(data.menu_detail.half_price);
        setFullPrice(data.menu_detail.full_price);
      } else {
        console.error("API Error:", data.msg);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: data.msg || "Failed to fetch price information",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching half/full prices:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch price information",
        life: 3000,
      });
    } finally {
      setIsPriceFetching(false);
    }
  };

  const handleAddToCart = () => {
    if (!customerId || !restaurantId) {
      navigate("/Signinscreen");
      return;
    }

    fetchHalfFullPrices(); // Fetch prices when opening the modal
    setShowModal(true);
  };

  const handleConfirmAddToCart = async () => {
    const selectedPrice = portionSize === 'half' ? halfPrice : fullPrice;
    
    if (!selectedPrice) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Price information is not available.",
        life: 2000,
      });
      return;
    }

    try {
      await addToCart({ 
        ...productDetails, 
        quantity, 
        notes, 
        half_or_full: portionSize,
        price: selectedPrice
      }, customerId, restaurantId);
      
      toast.current.show({
        severity: "success",
        summary: "Added to Cart",
        detail: "Item has been added to your cart.",
        life: 2000,
      });

      setShowModal(false);
      setTimeout(() => {
        navigate("/Cart");
      }, 2000);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to add item to cart.",
        life: 2000,
      });
    }
  };

  const handleRemoveFromCart = async () => {
    try {
      await removeFromCart(productDetails.menu_id, customerId, restaurantId);
      toast.current.show({
        severity: "info",
        summary: "Removed from Cart",
        detail: "Item has been removed from your cart.",
        life: 2000,
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to remove item from cart.",
        life: 2000,
      });
    }
  };



  

  

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
          // half_or_full: portionSize,
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
      setTotalAmount(productDetails.discountedPrice * newQuantity);
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

  const handleModalClick = (e) => {
    // Close the modal if the click is outside the modal content
    if (e.target.classList.contains('modal')) {
      setShowModal(false);
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

  if (!productDetails) {
    return (
      <div className="page-wrapper">
        <Header title="Menu Details" />
        <main className="page-content">
          <div className="container">
            <p>Product not found or error loading details.</p>
          </div>
        </main>
        <Bottom />
      </div>
    );
  }




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
          <div className="container py-0">
            <div className="swiper product-detail-swiper">
              <div className="product-detail-image img">
                <img
                  className="product-detail-image rounded-3"
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
                    className={` ${
                      productDetails.is_favourite
                        ? "ri-hearts-fill text-danger"
                        : "ri-heart-2-line"
                    } fs-6`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLikeClick(productDetails.menu_id);
                    }}
                  ></i>
                </div>
              </div>
              <div
                className="gradient_bg d-flex justify-content-center align-items-center"
                style={{
                  position: "absolute",
                  top: "-1px",
                  left: "0px",
                  height: "17px",
                  width: "70px",
                  borderRadius: "7px 0px 7px 0px",
                }}
              >
                <span className="text-white">
                  <i className="ri-discount-percent-line me-1 font_size_14"></i>
                  <span className="font_size_10">
                    {productDetails.offer || "No "}% Off
                  </span>
                </span>
              </div>
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
                          <span className="input-group-btn input-group-prepend d-flex justify-content-center align-items-center">
                            <div
                              className="border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center"
                              style={{
                                height: "20px",
                                width: "20px",
                              }}
                            >
                              <i
                                className="ri-subtract-line fs-2"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleQuantityChange(-1)}
                              ></i>
                            </div>
                          </span>
                          <span className="stepper px-3 mx-2 rounded-1 bg-light text-center">
                            {quantity}
                          </span>
                          <span className="input-group-btn input-group-append d-flex justify-content-center align-items-center">
                            <div
                              className="border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center"
                              style={{
                                height: "20px",
                                width: "20px",
                              }}
                            >
                              <i
                                className="ri-add-line fs-2"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleQuantityChange(1)}
                              ></i>
                            </div>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="container ps-0 pt-1">
                <div className="product-info menu_details-description">
                  <div>
                    <i class="ri-restaurant-2-line me-2"></i>
                    <span className="  text-wrap m-0 gray-text font_size_12">
                      {toTitleCase(productDetails.ingredients)}
                    </span>
                  </div>
                  <hr />
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
                      onClick={handleRemoveFromCart}
                    >
                      <i className="ri-shopping-cart-line pe-1 text-white"></i>
                      <div className="font-poppins text-nowrap text-white">
                        Remove from Cart
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

      {showModal && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          style={{ display: "block" }}
          onClick={handleModalClick}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content"
              style={{
                width: "350px",
                margin: "auto",
              }}
            >
              <div className="modal-header d-flex justify-content-center">
                <div className="modal-title font_size_16 fw-medium">
                  Add to Cart
                </div>
                <button
                  type="button"
                  className="btn-close position-absolute top-0 end-0 m-2 bg-danger text-white"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
              <div className="modal-body py-3">
                <div className="mb-3 mt-0">
                  <label
                    htmlFor="notes"
                    className="form-label d-flex justify-content-center fs-5 fw-bold"
                  >
                    Special Instructions
                  </label>
                  <textarea
                    className="form-control fs-6"
                    id="notes"
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any special instructions here..."
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label d-flex justify-content-center">
                    Select Portion Size
                  </label>
                  <div className="d-flex justify-content-center">
                    {isPriceFetching ? (
                      <p>Loading prices...</p>
                    ) : (
                      <>
                        <button
                          type="button"
                          className={`btn rounded-pill me-2 font_size_14  ${
                            portionSize === "half"
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={() => setPortionSize("half")}
                          disabled={!halfPrice}
                        >
                          Half {halfPrice ? `(₹${halfPrice})` : "(N/A)"}
                        </button>
                        <button
                          type="button"
                          className={`btn rounded-pill font_size_14 ${
                            portionSize === "full"
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={() => setPortionSize("full")}
                          disabled={!fullPrice}
                        >
                          Full {fullPrice ? `(₹${fullPrice})` : "(N/A)"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer justify-content-center">
                <button
                  type="button"
                  className="btn btn-secondary rounded-pill"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary rounded-pill"
                  onClick={handleConfirmAddToCart}
                  disabled={isPriceFetching || (!halfPrice && !fullPrice)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default MenuDetails;
