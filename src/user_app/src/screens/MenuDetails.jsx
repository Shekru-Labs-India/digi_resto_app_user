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
import AddToCartUI from "../components/AddToCartUI";

const storeToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Get data from localStorage
const getFromLocalStorage = (key) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

// Add this function before your MenuDetails component
const getFoodTypeStyles = (foodType) => {
  // Convert foodType to lowercase and handle null/undefined
  const type = (foodType || "").toLowerCase();

  switch (type) {
    case "veg":
      return {
        icon: "fa-solid fa-circle text-success",
        textColor: "text-success",
        border: "border-success",
        categoryIcon: "fa-solid fa-utensils text-success me-1",
      };
    case "nonveg":
      return {
        icon: "fa-solid fa-play fa-rotate-270 text-danger",
        textColor: "text-success", // Changed to green for category text
        border: "border-danger",
        categoryIcon: "fa-solid fa-utensils text-success me-1",
      };
    case "egg":
      return {
        icon: "fa-solid fa-egg",
        textColor: "gray-text", // Changed to green for category text
        border: "gray-text",
        categoryIcon: "fa-solid fa-utensils text-success me-1",
      };
    case "vegan":
      return {
        icon: "fa-solid fa-leaf text-success",
        textColor: "text-success",
        border: "border-success",
        categoryIcon: "fa-solid fa-utensils text-success me-1",
      };
    default:
      return {
        icon: "fa-solid fa-circle text-success",
        textColor: "text-success",
        border: "border-success",
        categoryIcon: "fa-solid fa-utensils text-success me-1",
      };
  }
};


// Add this function near the top with other utility functions
 const renderStarRating = (rating) => {
   const numRating = parseFloat(rating);

   // 0 to 0.4: No star
   if (!numRating || numRating < 0.5) {
     return null; // Don't show anything
   }

   // 0.5 to 2.5: Blank star (grey)
   if (numRating >= 0.5 && numRating <= 2.5) {
     return <i className="fa-regular fa-star font_size_10 gray-text me-1"></i>;
   }

   // 3 to 4.5: Half star
   if (numRating >= 3 && numRating <= 4.5) {
     return (
       <i className="fa-solid fa-star-half-stroke font_size_10 text-warning me-1"></i>
     );
   }

   // 5: Full star
   if (numRating === 5) {
     return <i className="fa-solid fa-star font_size_10 text-warning me-1"></i>;
   }

   return null; // Default case
 };

// Add this function to check cart status directly from localStorage
const isItemInCart = (menuId) => {
  try {
    const storedCart = localStorage.getItem('restaurant_cart_data');
    if (!storedCart) return false;
    
    const cartData = JSON.parse(storedCart);
    return cartData.order_items?.some(item => item.menu_id === menuId);
  } catch (error) {
    return false;
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
  const [userId, setUserId] = useState(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    return userData?.user_id || null;
  });

  const [role, setRole] = useState(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    return userData?.role || null;
  });

  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const location = useLocation();
  const [favorites, setFavorites] = useState([]);
  const menu_cat_id = location.state?.menu_cat_id || 1;
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState("");
  const [portionSize, setPortionSize] = useState("full");
  const [halfPrice, setHalfPrice] = useState(null);
  const [fullPrice, setFullPrice] = useState(null);
  const [isPriceFetching, setIsPriceFetching] = useState(false);
  const [currentRestaurantId, setCurrentRestaurantId] = useState(() => {
    return localStorage.getItem("outlet_id") || null;
  });
  const [menuRestaurantId, setMenuRestaurantId] = useState(null);
  const [sourceRestaurantId, setSourceRestaurantId] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const storedRestaurantId = localStorage.getItem("restaurantId");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isFromDifferentRestaurant, setIsFromDifferentRestaurant] = useState(
    () => {
      return (
        location.state?.fromDifferentRestaurant ||
        getFromLocalStorage("fromDifferentRestaurant") ||
        false
      );
    }
  );

  const [orderedItems, setOrderedItems] = useState(() => {
    return (
      location.state?.orderedItems || getFromLocalStorage("orderedItems") || []
    );
  });

  const { showLoginPopup } = usePopup();

  const [originalHalfPrice, setOriginalHalfPrice] = useState(null);
  const [originalFullPrice, setOriginalFullPrice] = useState(null);

  const [differentRestaurantName, setDifferentRestaurantName] = useState(
    localStorage.getItem("differentRestaurantName") || ""
  );

  useEffect(() => {
    // Get user data
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const storedUserId = storedUserData?.user_id;
    const storedRole = storedUserData?.role;

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

    setUserId(storedUserId);
    setRole(storedRole);
    setCurrentRestaurantId(initialRestaurantId);

    // Cleanup - restore previous restaurant when leaving
    return () => {
      if (!locationState?.fromDifferentRestaurant) {
        const previousRestaurantId = localStorage.getItem("previousRestaurantId");
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

  // const [isFromDifferentRestaurant, setIsFromDifferentRestaurant] =
  //   useState(false);

  // const orderedItems = location.state?.orderedItems || [];

  useEffect(() => {
    if (location.state) {
      if (location.state.fromDifferentRestaurant) {
        storeToLocalStorage(
          "fromDifferentRestaurant",
          location.state.fromDifferentRestaurant
        );
      }
      if (location.state.orderedItems) {
        storeToLocalStorage("orderedItems", location.state.orderedItems);
      }
    }
  }, [location.state]);
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
      const outlet_id = location.state?.fromDifferentRestaurant 
        ? location.state.outlet_id  
        : localStorage.getItem("outlet_id");

      const response = await fetch(
        `${config.apiDomain}/user_api/get_menu_details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            outlet_id: outlet_id,
            menu_id: menuId,
            menu_cat_id: menu_cat_id,
            user_id: userId || null,
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
            restaurant_name,
          } = data.details;

          // Update restaurant IDs
          setMenuRestaurantId(fetchedRestaurantId);
          if (fetchedRestaurantId) {
            localStorage.setItem("currentRestaurantId", fetchedRestaurantId);
          }

          if (location.state?.fromDifferentRestaurant) {
            setIsFromDifferentRestaurant(true);
            setDifferentRestaurantName(restaurant_name || "");
            localStorage.setItem("differentRestaurantName", restaurant_name || "");
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
      console.clear();
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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            outlet_id: localStorage.getItem("outlet_id"),
            menu_id: menuId,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.st === 1) {
        // Calculate discounted prices if there's an offer
        const halfPriceWithOffer = data.menu_detail.half_price
          ? productDetails.offer
            ? Math.floor(
                data.menu_detail.half_price * (1 - productDetails.offer / 100)
              )
            : data.menu_detail.half_price
          : null;

        const fullPriceWithOffer = data.menu_detail.full_price
          ? productDetails.offer
            ? Math.floor(
                data.menu_detail.full_price * (1 - productDetails.offer / 100)
              )
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
    const currentUserId = userData?.user_id;

    if (!currentUserId) {
      showLoginPopup();
      return;
    }

    fetchHalfFullPrices(menuId);
    setShowModal(true);
  };

  const handleConfirmAddToCart = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const currentUserId = userData?.user_id;
    const currentRole = userData?.role;

    if (!currentUserId || !restaurantId) {
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
          comment,
          half_or_full: portionSize,
          price: selectedPrice,
          outlet_id: restaurantId,
          menu_cat_id: menu_cat_id,
        },
        restaurantId
      );

      window.showToast("success", "Item has been added to your checkout");

      setShowModal(false);
      setTimeout(() => {
        navigate("/user_app/Menu");
      }, 2000);
    } catch (error) {
      console.clear();
      window.showToast("error", "Failed to add item to checkout");
    }
  };

  const handleRemoveFromCart = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const currentUserId = userData?.user_id;

    if (!currentUserId) {
      showLoginPopup();
      return;
    }

    try {
      await removeFromCart(
        productDetails.menu_id,
        currentUserId,
        currentRestaurantId
      );
      window.showToast("success", "Item has been removed from your checkout");
    } catch (error) {
      console.clear();
      window.showToast("error", "Failed to remove item from checkout");
    }
  };

  const handleUnauthorizedFavorite = () => {
    showLoginPopup();
  };

  // Function to handle favorite status toggle
  const handleLikeClick = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.user_id || userData.role === "guest") {
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          outlet_id: localStorage.getItem("outlet_id"),
          menu_id: menuId,
          user_id: userData.user_id,
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
              ? "Item has been added to your favourites"
              : "Item has been removed from your favourites"
          );

          window.dispatchEvent(new CustomEvent("favoritesUpdated"));
        } else {
          console.clear();
          window.showToast("error", "Failed to update favorite status");
        }
      }
    } catch (error) {
      console.clear();
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
    setComment(suggestion);
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

  // Add this useEffect to listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      // Force re-render to update cart icon
      setProductDetails(prevDetails => ({...prevDetails}));
    };

    const handleCartClear = () => {
      // Force re-render when cart is cleared
      setProductDetails(prevDetails => ({...prevDetails}));
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('cartCleared', handleCartClear);
    window.addEventListener('cartStatusChanged', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('cartCleared', handleCartClear);
      window.removeEventListener('cartStatusChanged', handleCartUpdate);
    };
  }, []);

  // Add this useEffect to check restaurant ID
  useEffect(() => {
    const checkRestaurant = () => {
      // Get current outlet ID from localStorage
      const currentOutletId = localStorage.getItem("outlet_id");
      
      // Get outlet ID from location state or API response
      const menuOutletId = location.state?.outlet_id || productDetails?.outlet_id;

      if (currentOutletId && menuOutletId) {
        const isDifferentRestaurant = currentOutletId !== menuOutletId.toString();
        setIsFromDifferentRestaurant(isDifferentRestaurant);

        // Store the state for persistence
        storeToLocalStorage("fromDifferentRestaurant", isDifferentRestaurant);
      }
    };

    checkRestaurant();
  }, [location.state?.outlet_id, productDetails]);

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
        <Header
          className="fs-6 fw-medium"
          title={toTitleCase(productDetails.name)}
        />

        <main className="page-content p-b85">
          <div className="mt-5 pt-1">
            <div className="container py-0 my-0 ">
              <HotelNameAndTable
                restaurantName={ restaurantName}
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
                      className={`border rounded-3 bg-white opacity-100 d-flex justify-content-center align-items-center ${
                        getFoodTypeStyles(productDetails.menu_food_type).border
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
                      className={`border rounded-3 bg-white opacity-100 d-flex justify-content-center align-items-center ${
                        getFoodTypeStyles(productDetails.menu_food_type).border
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
                <div className="d-flex align-items-center">
                  <i className="fa-solid fa-store me-2"></i>
                  <div>
                    <div className="fw-medium">{differentRestaurantName}</div>
                    <div className="font_size_12">
                      This menu is from a different restaurant. You can view details,
                      but can't add it to your current checkout.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="container py-0 mb-5">
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
                  <div className="col-8">
                    <div className="">
                      <span className="font_size_10 text-success">
                        <i className="fa-solid fa-utensils text-success me-1"></i>
                        {productDetails.menu_cat_name}
                      </span>
                    </div>
                  </div>
                  {productDetails.rating &&
  productDetails.rating !== "null" &&
  productDetails.rating !== "0.0" &&
  productDetails.rating !== "0" &&
  productDetails.rating !== null && (
    <div className="col-4 text-end px-0">
      <span className="ps-2 font_size_10">
        {renderStarRating(productDetails.rating)}
       
       
        {productDetails.rating}
      
      </span>
    </div>
  )}

                </div>
              </div>

              <div className=" ps-0 pt-1">
                <div className="product-info menu_details-description">
                  {productDetails.ingredients && (
                    <>
                      <i className="fa-solid fa-spoon me-2 mt-4"></i>
                      <span className="text-wrap m-0 gray-text font_size_12">
                        {toTitleCase(productDetails.ingredients)}
                      </span>
                      <hr className="" />
                    </>
                  )}
                </div>
                <div className="product-info menu_details-description">
                  <div>
                    <span className="text-capitalize text-wrap m-0 font_size_12">
                      {productDetails.description}
                    </span>
                  </div>
                </div>

                {showQuantityError && (
                  <div className="text-danger">Please add a quantity.</div>
                )}

                {/* Add end border */}
                <RestaurantSocials  />
              </div>
            </div>
          </div>
        </main>

        <div className="footer-fixed-btn bottom-0 pt-0 pe-0">
          <div className="container  pt-0">
            <footer className="footer mb-2 pt-0">
              <div className="row w-100">
                <hr className="dashed-line me-0 pe-0" />

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
                  {!userId ? (
                    <button
                      className="btn btn-outline-primary rounded-pill"
                      onClick={showLoginPopup}
                    >
                      <i className="ri-login-box-line pe-1 "></i>
                      <div className="text-nowrap ">Login to Order</div>
                    </button>
                  ) : isFromDifferentRestaurant ? (
                    <div>
                      <button
                        className="btn btn-outline-white rounded-pill p-3"
                        disabled
                      >
                        <div className="font-poppins text-break text-dark">
                          Different Restaurant
                        </div>
                      </button>
                      
                    </div>
                  ) : isItemOrdered(menuId) ? (
                    <button
                      className="btn btn-outline-primary rounded-pill"
                      disabled
                    >
                      <i className="fa-solid fa-check pe-1"></i>
                      <div className="font-poppins text-nowrap">Ordered</div>
                    </button>
                  ) : isItemInCart(menuId) ? (
                    <button
                      className="btn btn-success rounded-pill"
                      onClick={handleAddToCart}
                    >
                      <i className="fa-solid fa-plus  pe-2 text-white"></i>
                      <div className="text-nowrap text-white">Add</div>
                    </button>
                  ) : (
                    <button
                      className="btn btn-success rounded-pill"
                      onClick={handleAddToCart}
                    >
                      <i className="fa-solid fa-plus  pe-2 text-white"></i>
                      <div className="text-nowrap text-white">Add</div>
                    </button>
                  )}
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>

      <Bottom />

      <AddToCartUI
        showModal={showModal}
        setShowModal={setShowModal}
        productDetails={productDetails || {}}
        comment={comment}
        setComment={setComment}
        portionSize={portionSize}
        setPortionSize={setPortionSize}
        halfPrice={halfPrice}
        fullPrice={fullPrice}
        originalHalfPrice={originalHalfPrice}
        originalFullPrice={originalFullPrice}
        isPriceFetching={isPriceFetching}
        handleConfirmAddToCart={handleConfirmAddToCart}
        handleSuggestionClick={handleSuggestionClick}
        handleModalClick={handleModalClick}
      />

      {/* Add extra padding at the bottom to prevent footer overlap */}
      <div style={{ paddingBottom: "50px" }}></div>
    </>
  );
};

export default MenuDetails;
