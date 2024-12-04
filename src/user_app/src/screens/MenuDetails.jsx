import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import { useRestaurantId } from "../context/RestaurantIdContext";
import { useCart } from "../context/CartContext";
import Bottom from "../component/bottom";
import Header from "../components/Header";
import HotelNameAndTable from "../components/HotelNameAndTable";
import LoaderGif from "./LoaderGIF";
import { getUserData, getRestaurantData } from "../utils/userUtils";
import { usePopup } from "../context/PopupContext";
import config from "../component/config";
import RestaurantSocials from "../components/RestaurantSocials";
import { renderSpicyLevel } from "../component/config";

// Add this function before your MenuDetails component
const getFoodTypeStyles = (foodType) => {
  switch (foodType?.toLowerCase()) {
    case "veg":
      return {
        icon: "fa-solid fa-circle",
        textColor: "text-success",
        border: "border-success"
      };
    case "nonveg":
      return {
        icon: "fa-solid fa-play fa-rotate-270",
        textColor: "text-danger",
        border: "border-danger"
      };
    case "egg":
      return {
        icon: "fa-solid fa-egg",
        textColor: "gray-text",
        border: "border-muted"
      };
    case "vegan":
      return {
        icon: "fa-solid fa-leaf",
        textColor: "text-success",
        border: "border-success"
      };
    default:
      return {
        icon: "fa-solid fa-circle",
        textColor: "text-success",
        border: "border-success"
      };
  }
};

const MenuDetails = () => {
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
  const { cartItems } = useCart();
  const { addToCart, removeFromCart, isMenuItemInCart } = useCart();

  // At the top with other state declarations
  const [customerId, setCustomerId] = useState(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    return userData?.customer_id || null;
  });

  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const location = useLocation();
  const [favorites, setFavorites] = useState([]);
  const menu_cat_id = location.state?.menu_cat_id || 1;
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [portionSize, setPortionSize] = useState("full");
  const [halfPrice, setHalfPrice] = useState(null);
  const [fullPrice, setFullPrice] = useState(null);
  const [isPriceFetching, setIsPriceFetching] = useState(false);
  const [currentRestaurantId, setCurrentRestaurantId] = useState(() => {
    return localStorage.getItem("restaurantId") || null;
  });
  const [menuRestaurantId, setMenuRestaurantId] = useState(null);
  const [sourceRestaurantId, setSourceRestaurantId] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const storedRestaurantId = localStorage.getItem("restaurantId");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [customerType, setCustomerType] = useState(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    return userData?.customer_type || null;

    
  });

  const { showLoginPopup } = usePopup();

  const [originalHalfPrice, setOriginalHalfPrice] = useState(null);
  const [originalFullPrice, setOriginalFullPrice] = useState(null);

  useEffect(() => {
    // Get user data
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const storedCustomerId = storedUserData?.customer_id;
    const storedCustomerType = storedUserData?.customer_type;

    // Get restaurant data from location state or localStorage
    const locationState = location.state;
    let initialRestaurantId;

    if (locationState?.fromDifferentRestaurant) {
      // If coming from a different restaurant menu
      initialRestaurantId = locationState.restaurant_id;
      setCurrentRestaurantId(initialRestaurantId);

      // Persist the restaurant ID
      localStorage.setItem("currentRestaurantId", initialRestaurantId);
      localStorage.setItem("restaurantId", initialRestaurantId);
    } else {
      // Use stored restaurant ID
      initialRestaurantId =
        localStorage.getItem("currentRestaurantId") ||
        localStorage.getItem("restaurantId");
    }

    setCustomerId(storedCustomerId);
    setCustomerType(storedCustomerType);
    setCurrentRestaurantId(initialRestaurantId);



    

    // Clean up function
    return () => {
      if (!locationState?.fromDifferentRestaurant) {
        // Restore previous restaurant ID only if not viewing a different restaurant's menu
        const previousRestaurantId = localStorage.getItem(
          "previousRestaurantId"
        );
        if (previousRestaurantId) {
          localStorage.setItem("restaurantId", previousRestaurantId);
          localStorage.setItem("currentRestaurantId", previousRestaurantId);
        }
      }
    };
  }, [location.state]);

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
  const [previousRestaurantId, setPreviousRestaurantId] = useState(null);

  const isItemOrdered = (menuId) => {
    return orderedItems.some((item) => item.menu_id === menuId);
  };

  useEffect(() => {
    const storedPreviousRestaurantId = localStorage.getItem(
      "previousRestaurantId"
    );
    if (storedPreviousRestaurantId) {
      setPreviousRestaurantId(storedPreviousRestaurantId);
    }

    // Cleanup
    return () => {
      if (!location.state?.fromDifferentRestaurant) {
        localStorage.removeItem("previousRestaurantId");
      }
    };
  }, [location.state?.fromDifferentRestaurant]);

  const fetchProductDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/get_menu_details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: currentRestaurantId,
            menu_id: menuId,
            menu_cat_id: menu_cat_id,
            customer_id: customerId || null,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.st === 1 && data.details) {
          const {
            menu_name,
            category_name,
            spicy_index,
            price,
            description,
            ingredients,
            images,
            offer,
            rating,
            is_special,
            is_favorite,
            menu_food_type,
            restaurant_id: fetchedRestaurantId,
          } = data.details;

          // Update restaurant IDs
          setMenuRestaurantId(fetchedRestaurantId);
          if (fetchedRestaurantId) {
            localStorage.setItem("currentRestaurantId", fetchedRestaurantId);
          }

          if (location.state?.fromDifferentRestaurant) {
            setIsFromDifferentRestaurant(true);
            localStorage.setItem(
              "differentRestaurantName",
              data.details.restaurant_name || ""
            );
          }

          // Calculate discounted and old prices
          const discountedPrice = offer
            ? Math.floor(price * (1 - offer / 100))
            : price;
          const oldPrice = offer ? price : null;

          setProductDetails({
            name: menu_name,
            veg_nonveg: category_name,
            spicy_index,
            price,
            discountedPrice,
            oldPrice,
            description,
            ingredients,
            images: data.details.images,
            menu_cat_name: category_name,
            menu_id: menuId,
            offer,
            rating,
            is_special,
            is_favorite,
            menu_food_type,
            restaurant_id: fetchedRestaurantId,
          });

          setIsFavorite(data.details.is_favourite);
          setTotalAmount(discountedPrice * quantity);

          const contextRestaurantId = restaurantId;
          const isDifferent =
            fetchedRestaurantId &&
            contextRestaurantId &&
            fetchedRestaurantId !== contextRestaurantId;
          setIsFromDifferentRestaurant(isDifferent);
        }
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentRestaurantId) {
      // Remove customerId dependency
      fetchProductDetails();
    }
  }, [menuId, currentRestaurantId]); // Remove customerId from dependencies

  const fetchHalfFullPrices = async (menuId) => {
    setIsPriceFetching(true);
    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/get_full_half_price_of_menu`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            menu_id: menuId,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.st === 1) {
        // Calculate discounted prices if there's an offer
        const halfPriceWithOffer = data.menu_detail.half_price 
          ? productDetails.offer 
            ? Math.floor(data.menu_detail.half_price * (1 - productDetails.offer / 100))
            : data.menu_detail.half_price
          : null;

        const fullPriceWithOffer = data.menu_detail.full_price
          ? productDetails.offer
            ? Math.floor(data.menu_detail.full_price * (1 - productDetails.offer / 100))
            : data.menu_detail.full_price
          : null;

        setHalfPrice(halfPriceWithOffer);
        setFullPrice(fullPriceWithOffer);

        // Store original prices for display
        setOriginalHalfPrice(data.menu_detail.half_price);
        setOriginalFullPrice(data.menu_detail.full_price);
      }
    } catch (error) {
      console.clear();
    } finally {
      setIsPriceFetching(false);
    }
  };

  const handleAddToCart = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const currentCustomerId = userData?.customer_id;

    if (!currentCustomerId) {
      showLoginPopup();
      return;
    }

    fetchHalfFullPrices(menuId);
    setShowModal(true);
  };

  const handleConfirmAddToCart = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const currentCustomerId = userData?.customer_id;
    const currentCustomerType = userData?.customer_type;

    if (!currentCustomerId || !restaurantId) {
      return;
    }

    const selectedPrice = portionSize === "half" ? halfPrice : fullPrice;

    if (!selectedPrice) {
      window.showToast("error", "Price information is not available");
      return;
    }

    try {
      await addToCart(
        {
          ...productDetails,
          quantity,
          notes,
          half_or_full: portionSize,
          price: selectedPrice,
          restaurant_id: restaurantId,
        },
        restaurantId
      );

      window.showToast("success", "Item has been added to your cart");

      setShowModal(false);
      setTimeout(() => {
        navigate("/user_app/Cart");
      }, 2000);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      window.showToast("error", "Failed to add item to cart");
    }
  };

  const handleRemoveFromCart = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const currentCustomerId = userData?.customer_id;

    if (!currentCustomerId) {
      showLoginPopup();
      return;
    }

    try {
      await removeFromCart(
        productDetails.menu_id,
        currentCustomerId,
        currentRestaurantId
      );
      window.showToast("success", "Item has been removed from your cart");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      window.showToast("error", "Failed to remove item from cart");
    }
  };

  const handleUnauthorizedFavorite = () => {
    showLoginPopup();
  };

  // Function to handle favorite status toggle
  const handleLikeClick = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id || userData.customer_type === "guest") {
      handleUnauthorizedFavorite(navigate);
      return;
    }

    const apiUrl = isFavorite
      ? `${config.apiDomain}/user_api/remove_favourite_menu`
      : `${config.apiDomain}/user_api/save_favourite_menu`;

    const restaurantIdToUse =
      currentRestaurantId || productDetails?.restaurant_id;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant_id: restaurantIdToUse,
          menu_id: menuId,
          customer_id: userData.customer_id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1) {
          const updatedFavoriteStatus = !isFavorite;
          setIsFavorite(updatedFavoriteStatus);
          setProductDetails((prevDetails) => ({
            ...prevDetails,
            is_favourite: updatedFavoriteStatus,
          }));

          window.showToast(
            updatedFavoriteStatus ? "success" : "success",
            updatedFavoriteStatus
              ? "Item has been added to your favourite"
              : "Item has been removed from your favourite"
          );

          window.dispatchEvent(new CustomEvent("favoritesUpdated"));
        } else {
          console.error("Failed to update favorite status:", data.msg);
          window.showToast("error", "Failed to update favorite status");
        }
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      window.showToast("error", "Failed to update favorite status");
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 20) {
      setQuantity(newQuantity);
      setTotalAmount(productDetails.discountedPrice * newQuantity);
      window.showToast("info", `Quantity set to ${newQuantity}`);
    } else if (newQuantity > 20) {
      window.showToast("warn", "You cannot add more than 20 items");
    }
  };

  const handleModalClick = (e) => {
    // Close the modal if the click is outside the modal content
    if (e.target.classList.contains("modal")) {
      setShowModal(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Simply set the suggestion as the new note value
    setNotes(suggestion);
  };

  // Helper function to check if menu is veg
  const isVegMenu = (menuType) => {
    return menuType?.toLowerCase() === "veg";
  };

  // Navigation functions
  const handleNextSlide = useCallback(() => {
    if (productDetails?.images?.length) {
      setCurrentImageIndex((prev) =>
        prev === productDetails.images.length - 1 ? 0 : prev + 1
      );
    }
  }, [productDetails?.images]);

  const handlePrevSlide = useCallback(() => {
    if (productDetails?.images?.length) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? productDetails.images.length - 1 : prev - 1
      );
    }
  }, [productDetails?.images]);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (productDetails?.images?.length > 0) {
        handleNextSlide();
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [productDetails, handleNextSlide]);

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
      return <i className="fa-solid fa-star font_size_10 text-warning me-1"></i>;
    }

    return (
      <i className="fa-solid fa-star-half-stroke font_size_10 text-warning me-1"></i>
    );
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

  console.log("Product Details:", productDetails);
  console.log("Images Array:", productDetails?.images);

  return (
    <>
      <div className="page-wrapper">
        <Header
          className="fs-6 fw-medium"
          title={toTitleCase(productDetails.name)}
        />

        <main className="page-content p-b85">
          <div className="mt-5 pt-1">
            <div className="container py-0 my-0 ">
              <HotelNameAndTable
                restaurantName={restaurantName}
                tableNumber={userData?.tableNumber || "1"}
              />
            </div>
          </div>
          <div className="container py-0">
            <div
              className="border border-1"
              style={{
                position: "relative",
                width: "100%",
                height: "330px",
                borderRadius: "17px",
                overflow: "hidden",
                backgroundColor: "#f6f6f6",
              }}
            >
              {console.log("Checking images:", productDetails?.images)}
              {productDetails?.images && productDetails.images.length > 0 ? (
                <>
                  <img
                    className="object-fit-cover"
                    src={productDetails.images[currentImageIndex]}
                    alt={productDetails.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "opacity 0.3s ease",
                    }}
                    onError={(e) => {
                      e.target.src = images;
                    }}
                  />

                  {productDetails.images.length > 1 && (
                    <>
                      <div
                        onClick={handlePrevSlide}
                        className="border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center"
                        style={{
                          position: "absolute",
                          left: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          height: "30px",
                          width: "30px",
                          cursor: "pointer",
                          zIndex: 2,
                        }}
                      >
                        <i className="fa-solid fa-angle-left fs-4"></i>
                      </div>

                      <div
                        onClick={handleNextSlide}
                        className="border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center"
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          height: "30px",
                          width: "30px",
                          cursor: "pointer",
                          zIndex: 2,
                        }}
                      >
                        <i className="fa-solid fa-chevron-right fs-4"></i>
                      </div>

                      {/* Pagination Dots */}
                      <div
                        className=""
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          display: "flex",
                          gap: "8px",
                          zIndex: 2,
                          padding: "3px 7px",
                          borderRadius: "15px",
                          // background: "rgba(255, 255, 255, 0.3)",
                        }}
                      >
                        {productDetails.images.map((_, index) => (
                          <div
                            className=""
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            style={{
                              width: "7px",
                              height: "7px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              backgroundColor:
                                currentImageIndex === index
                                  ? "var(--primary)"
                                  : "rgba(128, 128, 128, .6)",
                              // border:
                              //   currentSlide === index
                              //     ? "none"
                              //     : "1px solid rgba(255, 255, 255, 0.8)",
                              transition: "all 0.3s ease",
                              opacity: currentImageIndex === index ? 1 : 0.8,
                              transform:
                                currentImageIndex === index
                                  ? "scale(1.2)"
                                  : "scale(1)",
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Veg/Non-veg indicator */}

                  <div
                    className="border rounded-3 bg-white opacity-100 d-flex justify-content-center align-items-center"
                    style={{
                      position: "absolute",
                      bottom: "3px",
                      left: "3px",
                      height: "20px",
                      width: "20px",
                      borderWidth: "2px",
                      borderColor:
                        productDetails.menu_food_type?.toLowerCase() ===
                        "nonveg"
                          ? "#dc3545"
                          : "#198754",
                    }}
                  >
                    <i
                      className={`${
                        getFoodTypeStyles(productDetails.menu_food_type).icon
                      } ${
                        getFoodTypeStyles(productDetails.menu_food_type)
                          .textColor
                      } font_size_12`}
                    ></i>
                  </div>

                  {/* Like button */}
                  <div
                    className="border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center"
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      height: "20px",
                      width: "20px",
                      zIndex: 2,
                    }}
                  >
                    <i
                      className={`${
                        isFavorite
                          ? "fa-solid fa-heart text-danger"
                          : "fa-regular fa-heart"
                      } fs-6`}
                      onClick={handleLikeClick}
                      style={{ cursor: "pointer" }}
                    ></i>
                  </div>

                  {/* Discount badge */}
                  {productDetails?.offer !== 0 && (
                    <div className="gradient_bg d-flex justify-content-center align-items-center gradient_bg_offer">
                      <span className="font_size_10 text-white">
                        {productDetails.offer}% Off
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <img
                    className="object-fit-cover"
                    src={images}
                    alt={productDetails.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  <div
                    className="border rounded-3 bg-white opacity-100 d-flex justify-content-center align-items-center"
                    style={{
                      position: "absolute",
                      bottom: "3px",
                      left: "3px",
                      height: "20px",
                      width: "20px",
                      borderWidth: "2px",
                      borderColor:
                        productDetails.menu_food_type?.toLowerCase() ===
                        "nonveg"
                          ? "#dc3545"
                          : "#198754",
                    }}
                  >
                    <i
                      className={`${
                        getFoodTypeStyles(productDetails.menu_food_type).icon
                      } ${
                        getFoodTypeStyles(productDetails.menu_food_type)
                          .textColor
                      } font_size_12`}
                    ></i>
                  </div>

                  {/* Like button */}
                  <div
                    className="border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center"
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      height: "20px",
                      width: "20px",
                      zIndex: 2,
                    }}
                  >
                    <i
                      className={`${
                        isFavorite
                          ? "fa-solid fa-heart text-danger"
                          : "fa-regular fa-heart"
                      } fs-6`}
                      onClick={handleLikeClick}
                      style={{ cursor: "pointer" }}
                    ></i>
                  </div>

                  {/* Discount badge */}
                  {productDetails?.offer !== 0 && (
                    <div className="gradient_bg d-flex justify-content-center align-items-center gradient_bg_offer">
                      <span className="font_size_10 text-white">
                        {productDetails.offer}% Off
                      </span>
                    </div>
                  )}
                </>
              )}
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
              {/* {productDetails.is_special && (
                <div className=" text-info text-center font_size_12 fw-medium my-1 py-0 mx-0 px-0">
                  <i className="fa-regular fa-star me-2"></i> Special
                  <hr className="mt-2 mb-0" />
                </div>
              )} */}
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
                    <div
                      className={`ps-3 ${
                        getFoodTypeStyles(productDetails.menu_food_type)
                          .textColor
                      } font_size_10`}
                    >
                      <i
                        className={`${
                          getFoodTypeStyles(productDetails.menu_food_type).icon
                        } me-1 ${
                          getFoodTypeStyles(productDetails.menu_food_type)
                            .textColor
                        }`}
                      ></i>
                      {productDetails.menu_cat_name || ""}
                    </div>
                  </div>

                  <div className="col-3 ps-4 pt-1 text-center px-0">
                    {productDetails.spicy_index && (
                      <div className="">
                        {renderSpicyLevel(productDetails.spicy_index)}
                      </div>
                    )}
                  </div>
                  <div className="col-4 text-end px-0">
                    {productDetails.rating > 0 && (
                      <>
                        {renderStarRating(productDetails.rating)}
                        <span className="font_size_10 fw-normal gray-text">
                          {productDetails.rating}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {/* <div className="container ps-2 pt-1">
                <div className="row">
                  <div className="col-12 pt-1 px-0 ">
                    {!isFromDifferentRestaurant && (
                      <div className="dz-stepper style-3">
                        
                          <div className="input-group bootstrap-touchspin bootstrap-touchspin-injected ">
                            <span className="input-group-btn input-group-prepend d-flex justify-content-center align-items-center">
                              <div
                                className="border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center"
                                style={{
                                  height: "30px",
                                  width: "30px",
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
                                  height: "30px",
                                  width: "30px",
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
              </div> */}

              <div className="container ps-0 pt-1">
                <div className="product-info menu_details-description">
                  <div>
                    <i className="fa-solid fa-spoon me-2 mt-4"></i>
                    <span className="text-wrap m-0 gray-text font_size_12">
                      {toTitleCase(productDetails.ingredients)}
                    </span>
                  </div>
                  <hr />
                  <div>
                    <span className="text-capitalize text-wrap m-0 font_size_12">
                      {productDetails.description}
                    </span>
                  </div>

                  {showQuantityError && (
                    <div className="text-danger">Please add a quantity.</div>
                  )}
                </div>

                {/* Add end border */}
                <RestaurantSocials />
              </div>
            </div>
          </div>
        </main>

        <div className="footer-fixed-btn bottom-0 pt-0 pe-0">
          <div className="container pt-0">
            <footer className="footer mb-2 pt-0">
              <div className="row">
                <hr className="dashed-line me-5 pe-5" />

                <div className="col-4 ps-1 pe-0">
                  <div className="d-flex align-items-center justify-content-between mb-5">
                    <div className="d-flex flex-column">
                      <span className="mb-2     ps-0 menu_details-total-amount">
                        Total amount
                      </span>
                      <div className="d-flex align-items-baseline">
                        <div className="font_size_14 fw-semibold text-info">
                          ₹
                          {(productDetails.discountedPrice * quantity).toFixed(
                            0
                          )}
                        </div>
                        {productDetails.oldPrice && (
                          <span className="text-decoration-line-through ms-2 font_size_12 fw-normal gray-text">
                            ₹{(productDetails.oldPrice * quantity).toFixed(0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-8 px-0 text-center">
                  {!customerId ? (
                    <button
                      className="btn btn-outline-primary rounded-pill"
                      onClick={showLoginPopup}
                    >
                      <i className="ri-login-box-line pe-1 "></i>
                      <div className="text-nowrap ">Login to Order</div>
                    </button>
                  ) : isFromDifferentRestaurant ? (
                    <button
                      className="btn btn-outline-white rounded-pill p-3"
                      disabled
                    >
                      <div className="font-poppins text-break text-dark">
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
                      className="btn btn-success rounded-pill"
                      onClick={handleRemoveFromCart}
                    >
                      <i className="fa-solid fa-xmark pe-1 text-white"></i>
                      <div className="font-poppins text-nowrap text-white">
                        Remove from Cart
                      </div>
                    </button>
                  ) : (
                    <button
                      className="btn btn-success rounded-pill"
                      onClick={handleAddToCart}
                    >
                      <i className="fa-solid fa-plus  pe-2 text-white"></i>
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
              <div className="modal-header ps-3 pe-2">
                <div className="col-10 text-start">
                  <div className="modal-title font_size_16 fw-medium">
                    Add {productDetails.name} to Cart
                  </div>
                </div>

                <div className="col-2 text-end">
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn p-0 fs-3 gray-text"
                      onClick={() => setShowModal(false)}
                      aria-label="Close"
                    >
                      <i className="fa-solid fa-xmark gray-text font_size_14 pe-3"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-body py-2 px-3">
                <div className="mb-3 mt-0">
                  <label
                    htmlFor="notes"
                    className="form-label d-flex justify-content-start font_size_14 fw-normal"
                  >
                    Special Instructions
                  </label>
                  <input
                    type="text"
                    className="form-control font_size_16 border border-dark rounded-4"
                    id="notes"
                    rows="2"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any special instructions here..."
                  />
                  <p
                    className="font_size_12 text-dark mt-2 mb-0 ms-2 cursor-pointer"
                    onClick={() =>
                      handleSuggestionClick("Make it more sweet 😋")
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fa-solid fa-comment-dots me-2"></i> Make it
                    more sweet 😋
                  </p>
                  <p
                    className="font_size_12 text-dark mt-2 mb-0 ms-2 cursor-pointer"
                    onClick={() => handleSuggestionClick("Make it more spicy ")}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fa-solid fa-comment-dots me-2"></i> Make it
                    more spicy
                  </p>
                </div>
                <hr className="my-4" />
                <div className="mb-2">
                  <label className="form-label d-flex justify-content-center my-4">
                    Select Portion Size
                  </label>
                  <div className="d-flex justify-content-center">
                    {isPriceFetching ? (
                      <p>Loading prices...</p>
                    ) : (
                      <div className="w-100">
                        {halfPrice !== null && (
                          <div 
                            className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3 cursor-pointer"
                            onClick={() => setPortionSize("half")}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="form-check">
                              <input
                                type="radio"
                                className="form-check-input"
                                id="halfPortion"
                                name="portionSize"
                                checked={portionSize === "half"}
                                onChange={() => setPortionSize("half")}
                              />
                              <label className="form-check-label font_size_14" htmlFor="halfPortion">
                                Half
                              </label>
                            </div>
                            <div>
                              <span className="font_size_14 fw-semibold text-info">₹{halfPrice}</span>
                              {productDetails.offer > 0 && (
                                <span className="gray-text font_size_12 text-decoration-line-through fw-normal ms-2">
                                  ₹{originalHalfPrice}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        <div 
                          className="d-flex justify-content-between align-items-center border-bottom pb-3"
                          onClick={() => setPortionSize("full")}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="form-check">
                            <input
                              type="radio"
                              className="form-check-input"
                              id="fullPortion"
                              name="portionSize"
                              checked={portionSize === "full"}
                              onChange={() => setPortionSize("full")}
                            />
                            <label className="form-check-label font_size_14" htmlFor="fullPortion">
                              Full
                            </label>
                          </div>
                          <div>
                            <span className="font_size_14 fw-semibold text-info">₹{fullPrice}</span>
                            {productDetails.offer > 0 && (
                              <span className="gray-text font_size_12 text-decoration-line-through fw-normal ms-2">
                                ₹{originalFullPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <hr className="my-4" />
              <div className="modal-body d-flex justify-content-around px-0 pt-2 pb-3">
                <button
                  type="button"
                  className="border border-1 border-muted bg-transparent px-4 font_size_14 rounded-pill text-dark"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary rounded-pill"
                  onClick={handleConfirmAddToCart}
                  disabled={isPriceFetching || (!halfPrice && !fullPrice)}
                >
                  <i className="fa-solid fa-plus pe-1 text-white"></i>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}

      {/* Add extra padding at the bottom to prevent footer overlap */}
      <div style={{ paddingBottom: "50px" }}></div>
    </>
  );
};

export default MenuDetails;
