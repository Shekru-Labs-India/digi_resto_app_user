import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import images from "../assets/MenuDefault.png";
import Swiper from "swiper/bundle";
import "swiper/swiper-bundle.css";
import "../assets/css/toast.css";
import LoaderGif from "../screens/LoaderGIF";
import debounce from "lodash/debounce";
import { useCart } from "../context/CartContext";
import { usePopup } from "../context/PopupContext";
import config from "./config";
import HotelNameAndTable from "../components/HotelNameAndTable";
import Notice from "./Notice";
import { renderSpicyLevel } from "./config";
import AddToCartUI from "../components/AddToCartUI";

const OfferBanner = () => {
  const [userData, setUserData] = useState(null);
  const { restaurantName } = useRestaurantId();
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { restaurantId } = useRestaurantId();
  const { cartItems, addToCart, isMenuItemInCart } = useCart();
  const [customerId, setCustomerId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [portionSize, setPortionSize] = useState("full");
  const [halfPrice, setHalfPrice] = useState(null);
  const [fullPrice, setFullPrice] = useState(null);
  const [isPriceFetching, setIsPriceFetching] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const hasFetchedData = useRef(false);
  const { showLoginPopup } = usePopup();
  const swiperRef = useRef(null);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize state from local storage
    return localStorage.getItem("isDarkMode") === "true";
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setCustomerId(userData.user_id);
    }

    // Only fetch if we have a restaurantId
    if (restaurantId) {
      fetchMenuData();
    }
  }, [restaurantId]);

  // const toTitleCase = (str) => {
  //   if (!str) return "";
  //   return str.replace(
  //     /\w\S*/g,
  //     (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  //   );
  // };

  useEffect(() => {
    const handleFavoriteUpdate = (event) => {
      const { menuId, isFavorite } = event.detail;
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item.menu_id === menuId ? { ...item, is_favourite: isFavorite } : item
        )
      );
    };

    const handleCartUpdate = (event) => {
      // Refresh cart status for all items
      setMenuItems((prevItems) => [...prevItems]); // Force re-render
    };

    window.addEventListener("favoriteStatusChanged", handleFavoriteUpdate);
    window.addEventListener("cartStatusChanged", handleCartUpdate);

    return () => {
      window.removeEventListener("favoriteStatusChanged", handleFavoriteUpdate);
      window.removeEventListener("cartStatusChanged", handleCartUpdate);
    };
  }, []);

  const fetchMenuData = useCallback(async () => {
    if (!restaurantId) return;
    const currentCustomerId =
      customerId || JSON.parse(localStorage.getItem("userData"))?.user_id;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/get_all_menu_list_by_category`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: currentCustomerId,
            restaurant_id: restaurantId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.st === 1) {
        // Format all menu items without filtering for is_special
        const formattedMenuItems = data.data.menus.map((menu) => ({
          ...menu,
          name: menu.menu_name,
          category_name: menu.category_name,
          image: menu.image || images,
          oldPrice: menu.offer ? menu.price : null,
          price: menu.offer
            ? Math.floor(menu.price * (1 - menu.offer / 100))
            : menu.price,
          is_favourite: menu.is_favourite === 1,
          menu_food_type: menu.menu_food_type?.toLowerCase(),
          category_food_type: menu.category_food_type?.toLowerCase(),
          rating: parseFloat(menu.rating) || 0,
          spicy_index: parseInt(menu.spicy_index) || 0,
        }));

        setMenuItems(formattedMenuItems);
      }
    } catch (error) {
      console.clear();
      setMenuItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId, customerId]);

  // 3. Modify handleConfirmAddToCart to remove unnecessary API call
  const handleConfirmAddToCart = async () => {
    if (!selectedMenu) return;

    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.user_id) {
      showLoginPopup();
      return;
    }

    const selectedPrice = portionSize === "half" ? halfPrice : fullPrice;

    try {
      const success = await addToCart({
        ...selectedMenu,
        quantity: 1,
        notes: notes,
        half_or_full: portionSize,
        price: selectedPrice,
        menu_name: selectedMenu.menu_name || selectedMenu.name
      }, restaurantId);

      if (success) {
        setShowModal(false);
        window.showToast("success", "Item added to cart");
        // Dispatch event to update cart UI
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        window.showToast("error", "Failed to add item to cart");
      }
    } catch (error) {
      window.showToast("error", "Failed to add item to cart");
    }
  };

  // 5. Keep the focus handler but with a debounce
  // useEffect(() => {
  //   const handleFocus = debounce(() => {
  //     if (restaurantId) {
  //       fetchMenuData();
  //     }
  //   }, 1000);

  //   window.addEventListener("focus", handleFocus);

  //   return () => {
  //     window.removeEventListener("focus", handleFocus);
  //     handleFocus.cancel();
  //   };
  // }, [fetchMenuData]);

  const getFoodTypeStyles = (foodType) => {
    // Convert foodType to lowercase for case-insensitive comparison
    const type = (foodType || "").toLowerCase();

    switch (type) {
      case "veg":
        return {
          icon: "fa-solid fa-circle text-success",
          border: "border-success",
          textColor: "text-success",
          categoryIcon: "fa-solid fa-utensils text-success me-1",
        };
      case "nonveg":
        return {
          icon: "fa-solid fa-play fa-rotate-270 text-danger",
          border: "border-danger",
          textColor: "text-success",
          categoryIcon: "fa-solid fa-utensils text-success me-1",
        };
      case "egg":
        return {
          icon: "fa-solid fa-egg gray-text",
          border: "gray-text",
          // textColor: "gray-text",
          categoryIcon: "fa-solid fa-utensils me-1",
        };
      case "vegan":
        return {
          icon: "fa-solid fa-leaf text-success",
          border: "border-success",
          textColor: "text-success",
          categoryIcon: "fa-solid fa-utensils text-success me-1",
        };
      default:
        return {
          icon: "fa-solid fa-circle text-success",
          border: "border-success",
          textColor: "text-success",
          categoryIcon: "fa-solid fa-utensils text-success me-1",
        };
    }
  };

  useEffect(() => {
    if (menuItems.length > 0) {
      swiperRef.current = new Swiper(".nearby-swiper", {
        slidesPerView: "auto",
        spaceBetween: 20,
        loop: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: true, // Changed to true
          pauseOnMouseEnter: true, // Added this
        },
        speed: 1000, // Added controlled speed
        touchRatio: 1, // Normal touch ratio
        preventClicks: false, // Allow clicks without stopping swiper
        preventClicksPropagation: false, // Allow click events to propagate
        grabCursor: true, // Shows grab cursor on hover
      });

      return () => {
        if (
          swiperRef.current &&
          typeof swiperRef.current.destroy === "function"
        ) {
          swiperRef.current.destroy(true, true);
          swiperRef.current = null;
        }
      };
    }
  }, [menuItems]);

  const renderSpiceIcons = (spicyIndex) => {
    return Array.from({ length: 5 }).map((_, index) =>
      index < spicyIndex ? (
        <i
          className="fa-solid fa-pepper-hot font_size_12 text-danger"
          key={index}
        ></i>
      ) : (
        <i
          className="fa-solid fa-pepper-hot font_size_12 text-secondary opacity-25"
          key={index}
        ></i>
      )
    );
  };

  const handleUnauthorizedFavorite = () => {
    showLoginPopup();
  };
  // Update handleLikeClick function
  const handleLikeClick = async (menuId) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.user_id || userData.role === "guest") {
      handleUnauthorizedFavorite(navigate);
      return;
    }

    const menuItem = menuItems.find((item) => item.menu_id === menuId);
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
            restaurant_id: restaurantId,
            menu_id: menuId,
            user_id: userData.user_id,
            role: userData.role,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.st === 1) {
        setMenuItems((prevItems) =>
          prevItems.map((item) =>
            item.menu_id === menuId
              ? { ...item, is_favourite: !isFavorite }
              : item
          )
        );

        window.dispatchEvent(
          new CustomEvent("favoriteUpdated", {
            detail: { menuId, isFavorite: !isFavorite },
          })
        );

        window.showToast(
          "success",
          isFavorite ? "Removed from favourites" : "Added to favourites"
        );
      }
    } catch (error) {
      console.clear();
      window.showToast("error", "Failed to update favorite status");
    }
  };

  // Add this useEffect hook to listen for favorite updates
  useEffect(() => {
    const handleFavoriteUpdate = (event) => {
      const { menuId, isFavorite } = event.detail;
      setMenuItems((prevMenuItems) =>
        prevMenuItems.map((item) =>
          item.menu_id === menuId ? { ...item, is_favourite: isFavorite } : item
        )
      );
    };

    window.addEventListener("favoriteUpdated", handleFavoriteUpdate);

    return () => {
      window.removeEventListener("favoriteUpdated", handleFavoriteUpdate);
    };
  }, []);

  const handleModalClick = (e) => {
    if (e.target.classList.contains("modal")) {
      setShowModal(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Simply set the suggestion as the new note value
    setNotes(suggestion);
  };
  const fetchHalfFullPrices = async (menuId) => {
    setIsPriceFetching(true);
    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/get_full_half_price_of_menu`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            menu_id: menuId,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.st === 1) {
        setHalfPrice(data.menu_detail.half_price);
        setFullPrice(data.menu_detail.full_price);
        if (data.menu_detail.half_price === null) {
          setPortionSize("full");
        }
      } else {
        console.clear();
        window.showToast("error", "Failed to fetch price information");
      }
    } catch (error) {
      console.clear();
      window.showToast("error", "Failed to fetch price information");
    } finally {
      setIsPriceFetching(false);
    }
  };

  // Update handleAddToCartClick function
  const handleAddToCartClick = (menuItem) => {
    // Check if item is already in cart
    if (isMenuItemInCart(menuItem.menu_id)) {
      window.showToast("info", "This item is already in your cart");
      return;
    }

    setSelectedMenu(menuItem);
    fetchHalfFullPrices(menuItem.menu_id);
    setShowModal(true);
  };

  // Update the rating function with the correct logic
  const renderStarRating = (rating) => {
    const numRating = parseFloat(rating);

    // 0 to 0.4: No star
    if (!numRating || numRating < 0.5) {
      return null; // Don't show anything
    }

    // 0.5 to 2.5: Blank star (grey)
    if (numRating >= 0.5 && numRating <= 2.5) {
      return (
        <i className="fa-regular fa-star font_size_10 gray-text me-1"></i>
      );
    }

    // 3 to 4.5: Half star
    if (numRating >= 3 && numRating <= 4.5) {
      return (
        <i className="fa-solid fa-star-half-stroke font_size_10 text-warning me-1"></i>
      );
    }

    // 5: Full star
    if (numRating === 5) {
      return (
        <i className="fa-solid fa-star font_size_10 text-warning me-1"></i>
      );
    }

    return null; // Default case
  };

  return (
    <div className="dz-box style-2 py-2">
      <div className="m-0">
        <HotelNameAndTable
          restaurantName={restaurantName}
          tableNumber={userData?.tableNumber || "1"}
        />
      </div>
      <div className="dz-box style-3">
        <div className="swiper nearby-swiper mt-0">
          <div className="swiper-wrapper">
            {menuItems.map((menuItem) => (
              <div key={menuItem.menu_id} className="swiper-slide">
                <div className="py-1 px-0">
                  <div className="custom-card rounded-4 shadow-sm">
                    <Link
                      to={`/user_app/ProductDetails/${menuItem.menu_id}`}
                      state={{ menu_cat_id: menuItem.menu_cat_id }}
                      className="text-decoration-none text-reset"
                    >
                      <div className="card-body py-0">
                        <div className="row">
                          <div className="col-3 px-0">
                            <img
                              src={menuItem.image || images}
                              alt={menuItem.name}
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
                                right: "76%",
                                height: "20px",
                                width: "20px",
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleLikeClick(menuItem.menu_id);
                              }}
                            >
                              <i
                                className={`${
                                  menuItem.is_favourite
                                    ? "fa-solid fa-heart text-danger"
                                    : "fa-regular fa-heart"
                                } fs-6`}
                              ></i>
                            </div>
                            {/* Special Star */}
                            {menuItem.is_special && (
                              <i
                                className="fa-solid fa-star border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center text-info"
                                style={{
                                  position: "absolute",
                                  top: 3,
                                  right: "76%",
                                  height: 17,
                                  width: 17,
                                }}
                              ></i>
                            )}
                            {/* Food Type Indicator */}
                            <div
                              className={`border rounded-3 bg-white opacity-100 d-flex justify-content-center align-items-center ${
                                getFoodTypeStyles(menuItem.menu_food_type)
                                  .border
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
                                  getFoodTypeStyles(menuItem.menu_food_type)
                                    .icon
                                } font_size_12`}
                              ></i>
                            </div>
                            {/* Offer Tag */}
                            {menuItem.offer !== 0 && (
                              <div className="gradient_bg d-flex justify-content-center align-items-center gradient_bg_offer">
                                <span className="font_size_10 text-white">
                                  {menuItem.offer}% Off
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="col-9 pt-1 p-0 pe-2">
                            <div className="row d-flex align-items-center mt-1">
                              <div className="col-12">
                                <div className="ps-2 font_size_14 fw-medium">
                                  {menuItem.name}
                                </div>
                              </div>
                            </div>
                            <div className="row d-flex align-items-center mt-1">
                              <div className="col-6 d-flex align-items-center">
                                <span
                                  className={`ps-2 font_size_10 ${
                                    getFoodTypeStyles(
                                      menuItem.category_food_type
                                    ).textColor
                                  }`}
                                >
                                  <i
                                    className={
                                      getFoodTypeStyles(
                                        menuItem.category_food_type
                                      ).categoryIcon
                                    }
                                  ></i>
                                  {menuItem.category_name}
                                </span>
                              </div>
                              <div className="col-4 d-flex align-items-center ps-4 pe-3">
                                {menuItem.spicy_index && (
                                  <div className="">
                                    {renderSpicyLevel(menuItem.spicy_index)}
                                  </div>
                                )}
                              </div>
                              <div className="col-2 d-flex align-items-center justify-content-end">
                                {menuItem.rating > 0 && (
                                  <>
                                    {renderStarRating(menuItem.rating)}
                                    <span className="font_size_10 fw-normal gray-text">
                                      {menuItem.rating.toFixed(1)}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-7 mt-2">
                                <p className="ms-2 mb-0 fw-medium">
                                  {menuItem.offer ? (
                                    <>
                                      <span className="font_size_14 fw-semibold text-info">
                                        ₹
                                        {Math.floor(
                                          menuItem.price *
                                            (1 - menuItem.offer / 100)
                                        )}
                                      </span>
                                      <span className="gray-text font_size_12 text-decoration-line-through fw-normal ms-2">
                                        ₹{menuItem.price}
                                      </span>
                                    </>
                                  ) : (
                                    <span className="font_size_14 fw-semibold text-info">
                                      ₹{menuItem.price}
                                    </span>
                                  )}
                                </p>
                              </div>
                              <div className="col-5 d-flex align-items-center justify-content-end">
                                {customerId ? (
                                  <div
                                    className={`
                                      d-flex 
                                      align-items-center 
                                      justify-content-center 
                                      rounded-circle 
                                      bg-white 
                                      border-opacity-25 
                                      border-secondary 
                                      border
                                    `}
                                    style={{
                                      width: "25px",
                                      height: "25px",
                                      cursor: "pointer",
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleAddToCartClick(menuItem);
                                    }}
                                  >
                                    <i
                                      className={`fa-solid ${
                                        isMenuItemInCart(menuItem.menu_id)
                                          ? "fa-solid fa-circle-check text-success  "
                                          : "fa-solid fa-plus text-secondary"
                                      } fs-6`}
                                    ></i>
                                  </div>
                                ) : (
                                  <div
                                    className={`
                                      d-flex 
                                      align-items-center 
                                      justify-content-center 
                                      rounded-circle 
                                      bg-white 
                                      border-opacity-25 
                                      border-secondary 
                                      border
                                    `}
                                    style={{
                                      width: "25px",
                                      height: "25px",
                                      cursor: "pointer",
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      showLoginPopup();
                                    }}
                                  >
                                    <i className="fa-solid fa-plus text-secondary fs-6"></i>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <AddToCartUI
          showModal={showModal}
          setShowModal={setShowModal}
          productDetails={selectedMenu || {}}
          comment={notes}
          setComment={setNotes}
          portionSize={portionSize}
          setPortionSize={setPortionSize}
          halfPrice={halfPrice}
          fullPrice={fullPrice}
          originalHalfPrice={selectedMenu?.half_price}
          originalFullPrice={selectedMenu?.full_price}
          isPriceFetching={isPriceFetching}
          handleConfirmAddToCart={handleConfirmAddToCart}
          handleSuggestionClick={(suggestion) => setNotes(suggestion)}
          handleModalClick={(e) => {
            if (e.target.classList.contains("modal")) {
              setShowModal(false);
            }
          }}
        />
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default OfferBanner;
