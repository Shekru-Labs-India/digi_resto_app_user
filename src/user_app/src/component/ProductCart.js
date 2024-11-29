import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import images from "../assets/MenuDefault.png";
import Swiper from "swiper";
import { debounce } from "lodash";
import NearbyArea from "./NearbyArea";
 import "../assets/css/toast.css";
 
import LoaderGif from "../screens/LoaderGIF";
import { useCart } from "../context/CartContext";
import { getUserData, getRestaurantData } from "../utils/userUtils";

import { usePopup } from "../context/PopupContext";
import config from "./config";
import AI_Loading from "../assets/gif/AI_Loading.gif";

// Convert strings to Title Case
const toTitleCase = (text) => {
  if (!text) return "";
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

const renderStarRating = (rating) => {
  const numRating = parseFloat(rating);

  // 0 to 0.4: Show no star & value
  if (!numRating || numRating < 0.5) {
    return <i className=" font_size_10 ratingStar me-1"></i>;
  }

  // 0.5 to 2.5: Show blank star (grey color)
  if (numRating >= 0.5 && numRating <= 2.5) {
    return <i className="ri-star-line font_size_10 gray-text me-1"></i>;
  }

  // 3 to 4.5: Show half star
  if (numRating >= 3 && numRating <= 4.5) {
    return (
      <i className="fa-solid fa-star-half-stroke font_size_10 ratingStar me-1"></i>
    );
  }

  // 5: Show full star
  if (numRating === 5) {
    return (
      <i className="fa-solid fa-star font_size_10 ratingStar me-1"></i>
    );
  }

  // Default case (shouldn't reach here based on your ranges)
  return <i className="ri-star-line font_size_10 ratingStar me-1"></i>;
};

const ProductCard = ({ isVegOnly }) => {
  const [menuList, setMenuList] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [totalMenuCount, setTotalMenuCount] = useState(0);
  const [filteredMenuList, setFilteredMenuList] = useState([]);

  const navigate = useNavigate();
  const { restaurantId } = useRestaurantId();

  const [isLoading, setIsLoading] = useState(false);
  const swiperRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [portionSize, setPortionSize] = useState("full");
  const [halfPrice, setHalfPrice] = useState(null);
  const [fullPrice, setFullPrice] = useState(null);
  const [isPriceFetching, setIsPriceFetching] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const { cartItems, addToCart, removeFromCart, isMenuItemInCart } = useCart();

  // Add this state for tracking restaurant data
  const [currentRestaurantId, setCurrentRestaurantId] = useState(() => {
    return restaurantId || localStorage.getItem("restaurantId");
  });

  const { showLoginPopup } = usePopup();

  const restaurantStatus = localStorage.getItem("restaurantStatus");

  // Add state for loading if not already present
  const [isMagicLoading, setIsMagicLoading] = useState(false);

  // Add state for modal
  const [showAIModal, setShowAIModal] = useState(false);

  const [countdown, setCountdown] = useState(null);

  // Optimized applyFilters function
  const applyFilters = useCallback((menus, categoryId, vegOnly) => {
    let filteredMenus = [...menus];

    // Set total count before applying any filters
    setTotalMenuCount(menus.length);

    // Apply veg filter if needed
    if (vegOnly) {
      filteredMenus = filteredMenus.filter(
        (menu) => menu.menu_veg_nonveg === "veg"
      );
    }

    // Handle category filtering
    if (categoryId === "special") {
      filteredMenus = menus.filter((menu) => menu.is_special === true);
    } else if (categoryId === "offer") {
      filteredMenus = menus.filter((menu) => menu.offer > 0);
    } else if (categoryId) {
      filteredMenus = filteredMenus.filter(
        (menu) => menu.menu_cat_id === categoryId
      );
    }

    // If categoryId is null, show all menus
    if (categoryId === null) {
      filteredMenus = menus;
    }

    // If no items found after filtering, set empty array
    setFilteredMenuList(filteredMenus);

    // Update categories with counts
    const categoryCounts = menus.reduce((acc, menu) => {
      if (menu.menu_cat_id) {
        acc[menu.menu_cat_id] = (acc[menu.menu_cat_id] || 0) + 1;
      }
      return acc;
    }, {});

    // Update special count in UI
    setMenuCategories((prevCategories) => [
      ...prevCategories.map((category) => ({
        ...category,
        menu_count: categoryCounts[category.menu_cat_id] || 0,
      })),
    ]);
  }, []);

  // Optimized category selection handler
  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    applyFilters(menuList, categoryId, isVegOnly);
  };

  // Fetch menu data with optimized updates
  const fetchMenuData = useCallback(async () => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const storedRestaurantId =
      restaurantId || localStorage.getItem("restaurantId");

    if (!storedRestaurantId) return;

    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/get_all_menu_list_by_category`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: storedUserData?.customer_id || null,
            restaurant_id: storedRestaurantId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.st === 1) {
        const formattedMenuList = data.data.menus.map((menu) => ({
          ...menu,
          image: menu.image || images,
          category: toTitleCase(menu.category_name),
          name: toTitleCase(menu.menu_name),
          oldPrice: menu.offer ? menu.price : null,
          price: menu.offer
            ? Math.floor(menu.price * (1 - menu.offer / 100))
            : menu.price,
          is_favourite: menu.is_favourite === 1,
        }));

        setMenuList(formattedMenuList);
        setMenuCategories(
          data.data.category.map((category) => ({
            ...category,
            name: toTitleCase(category.category_name),
          }))
        );

        // Apply existing filters to new data
        applyFilters(formattedMenuList, selectedCategoryId, isVegOnly);
      }
    } catch (error) {
      console.clear();
    }
  }, [restaurantId, isVegOnly, selectedCategoryId, applyFilters]);

  // Initial data fetch
  useEffect(() => {
    if (restaurantId) {
      fetchMenuData();
    }
  }, [restaurantId, fetchMenuData]);

  // Polling for updates without affecting UI
  useEffect(() => {
    const pollInterval = setInterval(fetchMenuData, 30000);
    return () => clearInterval(pollInterval);
  }, [fetchMenuData]);

  // Update favorites handler to refetch data
  const handleFavoritesUpdated = useCallback(() => {
    fetchMenuData(selectedCategoryId);
  }, [fetchMenuData, selectedCategoryId]);

  // Update favorites useEffect
  useEffect(() => {
    window.addEventListener("favoritesUpdated", handleFavoritesUpdated);
    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdated);
    };
  }, [handleFavoritesUpdated]);

  const debouncedFetchMenuData = useCallback(
    debounce((categoryId) => {
      fetchMenuData(categoryId);
    }, 300),
    [fetchMenuData]
  );

  useEffect(() => {
    if (menuCategories.length > 0 && !swiperRef.current) {
      const timer = setTimeout(() => {
        swiperRef.current = new Swiper(".category-slide", {
          slidesPerView: "auto",
          spaceBetween: 10,
        });
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [menuCategories]);

  const handleUnauthorizedFavorite = () => {
    showLoginPopup();
  };

  const handleLikeClick = async (e, menuId) => {
    e.preventDefault();
    e.stopPropagation();

    // const userData = JSON.parse(localStorage.getItem("userData"));
    // if (!userData?.customer_id) {
    //   showLoginPopup();
    //   return;
    // }

    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id || userData.customer_type === "guest") {
      handleUnauthorizedFavorite();
      return;
    }

    const menuItem = menuList.find((item) => item.menu_id === menuId);
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
            customer_id: userData.customer_id,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1) {
          const updatedFavoriteStatus = !isFavorite;
          const updatedMenuList = menuList.map((item) =>
            item.menu_id === menuId
              ? { ...item, is_favourite: updatedFavoriteStatus }
              : item
          );
          setMenuList(updatedMenuList);
          setFilteredMenuList(
            updatedMenuList.filter(
              (item) =>
                item.menu_cat_id === selectedCategoryId ||
                selectedCategoryId === null
            )
          );

          window.dispatchEvent(
            new CustomEvent("favoriteUpdated", {
              detail: { menuId, isFavorite: updatedFavoriteStatus },
            })
          );

          window.showToast(
            "success",
            updatedFavoriteStatus
              ? "Item has been added to your favourite."
              : "Item has been removed from your favourite."
          );
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

  useEffect(() => {
    const handleFavoriteUpdate = (event) => {
      const { menuId, isFavorite } = event.detail;
      setMenuList((prevMenuList) =>
        prevMenuList.map((item) =>
          item.menu_id === menuId ? { ...item, is_favourite: isFavorite } : item
        )
      );
      setFilteredMenuList((prevFilteredMenuList) =>
        prevFilteredMenuList.map((item) =>
          item.menu_id === menuId ? { ...item, is_favourite: isFavorite } : item
        )
      );
    };

    window.addEventListener("favoriteUpdated", handleFavoriteUpdate);

    return () => {
      window.removeEventListener("favoriteUpdated", handleFavoriteUpdate);
    };
  }, []);

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
        setHalfPrice(data.menu_detail.half_price);
        setFullPrice(data.menu_detail.full_price);
      } else {
        console.clear();
        window.showToast(
          "error",
          data.msg || "Failed to fetch price information"
        );
      }
    } catch (error) {
      console.clear();
      window.showToast("error", "Failed to fetch price information");
    } finally {
      setIsPriceFetching(false);
    }
  };

  // Updated handleAddToCartClick
  const handleAddToCartClick = (menu) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id) {
      showLoginPopup();
      return;
    }

    if (isMenuItemInCart(menu.menu_id)) {
      window.showToast("info", "This item is already in your cart.");
      return;
    }

    setSelectedMenu(menu);
    fetchHalfFullPrices(menu.menu_id);
    setShowModal(true);
  };

  // Updated renderCartIcon
  const renderCartIcon = useCallback(
    (menu) => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      return (
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
            if (userData?.customer_id) {
              handleAddToCartClick(menu);
            } else {
              showLoginPopup();
            }
          }}
        >
          <i
            className={`fa-solid ${
              isMenuItemInCart(menu.menu_id)
                ? "fa-solid fa-circle-check"
                : "fa-solid fa-plus text-secondary"
            } fs-6`}
          ></i>
        </div>
      );
    },
    [handleAddToCartClick, isMenuItemInCart]
  );

  const handleConfirmAddToCart = async (e) => {
    e.preventDefault();  // Prevent event bubbling
    e.stopPropagation(); // Stop event propagation
    
    try {
      const itemToAdd = {
        ...selectedMenu,
        half_or_full: portionSize,
        notes: notes,
        quantity: 1  // Explicitly set quantity to 1
      };

      await addToCart(itemToAdd, restaurantId);
      setShowModal(false);
      setNotes("");
      setPortionSize("full");
      
      // Show success message or toast here if needed
      
    } catch (error) {
      // Handle error appropriately
      console.error("Error adding to cart:", error);
    }
  };

  const handleModalClick = (e) => {
    // Only close if clicking the backdrop
    if (e.target.classList.contains('modal')) {
      setShowModal(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Simply set the suggestion as the new note value
    setNotes(suggestion);
  };

  // Add the magic handler function
  const handleMagicClick = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setIsMagicLoading(true);
    setShowAIModal(true); // Show modal when starting
    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/auto_create_cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            customer_id: userData?.customer_id,
          }),
        }
      );

      const data = await response.json();
      
      if (data.st === 1) {
        localStorage.setItem("cartId", data.cart_id);
        setTimeout(() => {
          navigate("/user_app/Cart", { 
            state: { 
              cartId: data.cart_id,
              magicMessage: "Your magic cart has been created!"
            }
          });
        }, 5000);
      } else {
        window.showToast("error", data.msg || "Failed to create magic cart");
      }
    } catch (error) {
      console.clear();
      window.showToast("error", "Something went wrong. Please try again.");
    } finally {
      setTimeout(() => {
        setIsMagicLoading(false);
        setShowAIModal(false); // Hide modal when done
      }, 5000);
    }
  };

  useEffect(() => {
    if (showAIModal) {
      // Start countdown after 2s (5s total - 3s countdown)
      setTimeout(() => {
        setCountdown(3);
        const interval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(interval);
      }, 2000);
    } else {
      setCountdown(null);
    }
  }, [showAIModal]);

  if (isLoading || menuList.length === 0) {
    const restaurantStatus = localStorage.getItem("restaurantStatus");
    return (
      <div id="preloader">
        <div className="loader">
          <LoaderGif />
        </div>
      </div>
    );
  }

  if (restaurantStatus === "false") {
    setTimeout(() => {
      navigate("/user_app/Index");
    }, 3000);
  }
  const isRestaurantOpen = localStorage.getItem("isRestaurantOpen");

  if (isRestaurantOpen === "false") {
    setTimeout(() => {
      navigate("/user_app/Index");
    }, 3000);
  }

  return (
    <div>
      {restaurantStatus === "false" && (
        <div
          className="modal fade show d-block"
          style={{
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="col-6 text-center">
                  <div className="modal-title font_size_16 fw-medium text-nowrap ">
                    This restaurant is disabled
                  </div>
                </div>
              </div>
              <div className="modal-body">
                <p className="text-center">
                  This restaurant is currently disabled.
                  <br />
                  Please try again later or contact support.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {isRestaurantOpen === "false" && (
        <div
          className="modal fade show d-block"
          // style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          style={{
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="col-6 text-center">
                  <div className="modal-title font_size_16 fw-medium text-nowrap ">
                    This restaurant is closed
                  </div>
                </div>
              </div>
              <div className="modal-body">
                <p className="text-center">
                  This restaurant is currently closed.
                  <br />
                  Please try again later or come back tomorrow.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-2">
        {menuCategories && menuCategories.length > 0 && (
          <>
            <div className="title-bar">
              <span className="font_size_14 fw-medium">Menu</span>
              <Link to="/user_app/Menu">
                <span>see all</span>
                <i className="fa-solid fa-arrow-right ms-2"></i>
              </Link>
            </div>

            <div className="d-flex justify-content-between mb-3 pt-1">
              <div className="me-2 w-100" style={{ height: "40px" }}>
                <div
                  className={`category-btn font_size_14 rounded-pill border border-1 border-info text-info offer-menu-btn w-100 h-100 d-flex align-items-center justify-content-center ${
                    selectedCategoryId === "special"
                      ? "active bg-info text-white"
                      : "bg-transparent"
                  }`}
                  onClick={() => handleCategorySelect("special")}
                >
                  <i
                    className={`fa-solid fa-star me-2 ${
                      selectedCategoryId === "special"
                        ? "text-white"
                        : "text-info"
                    }`}
                  ></i>
                  Special
                  <span className="ms-1 font_size_10">
                    ({menuList.filter((menu) => menu.is_special).length})
                  </span>
                </div>
              </div>

              <div className="mx-2 w-100" style={{ height: "40px" }}>
                <div
                  className={`category-btn font_size_14 rounded-pill border border-1 border-success custom-menu-btn w-100 h-100 d-flex align-items-center justify-content-center ${
                    selectedCategoryId === "offer"
                      ? "active bg-success text-white"
                      : "bg-transparent text-success"
                  }`}
                  onClick={() => handleCategorySelect("offer")}
                >
                  <i
                    className={`fa-solid fa-percent me-2 ${
                      selectedCategoryId === "offer"
                        ? "text-white"
                        : "text-success"
                    }`}
                  ></i>
                  Offer
                  <span className="ms-1 font_size_10">
                    ({menuList.filter((menu) => menu.offer > 0).length})
                  </span>
                </div>
              </div>

              <div className="ms-2 w-100" style={{ height: "40px" }}>
                <div
                  className="category-btn font_size_14 rounded-pill btn magic-btn magic-button w-100 h-100 d-flex align-items-center justify-content-center"
                  onClick={handleMagicClick}
                >
                  <div className="position-relative z-1 magic-text">
                    {isMagicLoading ? (
                      <i className="fa-solid fa-spinner fa-spin me-2"></i>
                    ) : (
                      <i className="fa-solid fa-wand-magic-sparkles me-2"></i>
                    )}
                    Magic
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* <div className="d-flex justify-content-center">
          {totalMenuCount > 0 && menuCategories.length > 0 && (
            <div
              className={`btn mb-2 rounded-xl bg-info text-white py-1 px-3 font_size_14 ${
                selectedCategoryId === "special" ? "active " : ""
              }`}
              onClick={() => handleCategorySelect("special")}
            >
              <i className="fa-regular fa-star me-2"></i> Special{" "}
            </div>
          )}
        </div> */}

        <div className="swiper category-slide">
          <div className="swiper-wrapper">
            {/* Special button - always first */}
            {/* <div className="swiper-slide">
              <div
                className={`category-btn font_size_14 rounded-5 ${
                  selectedCategoryId === "special" ? "active" : ""
                }`}
                onClick={() => handleCategorySelect("special")}
                style={{
                  backgroundColor: "#0D9EDF", // Blue background
                  color: "#ffffff", // White text
                  border: "none",
                }}
              >
                <i className="fa-regular fa-star me-2"></i>
                Special
                <span className="gray-text font_size_10">
                  {" "}
                  ({menuList.filter((menu) => menu.is_special).length})
                </span>
              </div>
            </div> */}

            {/* All button */}
            <div className="swiper-slide">
              <div
                className={`category-btn font_size_14 rounded-5 ${
                  selectedCategoryId === null ? "active" : ""
                }`}
                onClick={() => handleCategorySelect(null)}
                // style={{
                //   backgroundColor: selectedCategoryId === null ? "#0D775E" : "",
                //   color: selectedCategoryId === null ? "#ffffff" : "",
                // }}
              >
                All{" "}
                <span className="font_size_12">
                  <span className="gray-text font_size_10">
                    ({totalMenuCount})
                  </span>
                </span>
              </div>
            </div>

            {/* Regular category buttons */}
            {menuCategories.map((category) => (
              <div key={category.menu_cat_id} className="swiper-slide">
                <div
                  className={`category-btn font_size_14 rounded-5 ${
                    selectedCategoryId === category.menu_cat_id ? "active" : ""
                  }`}
                  onClick={() => handleCategorySelect(category.menu_cat_id)}
                  style={{
                    backgroundColor:
                      selectedCategoryId === category.menu_cat_id
                        ? "linear-gradient(201deg, #7cffa8, #159e42)"
                        : "",
                    color:
                      selectedCategoryId === category.menu_cat_id
                        ? "#ffffff"
                        : "",
                  }}
                >
                  {category.name}
                  <span className="font_size_12 gray-text">
                    {" "}
                    <span className="gray-text font_size_10">
                      ({category.menu_count})
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-3 grid-style-1">
        {filteredMenuList.length > 0 ? (
          filteredMenuList.map((menu) => (
            <div key={menu.menu_id} className="col-6">
              <div className="card-item style-6 rounded-4">
                <Link
                  to={`/user_app/ProductDetails/${menu.menu_id}`}
                  state={{ menu_cat_id: menu.menu_cat_id }}
                  className="card-link"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                  }}
                >
                  <div className="dz-media">
                    <img
                      src={menu.image || images}
                      alt={menu.name}
                      className="object-fit-cover"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "fill",
                        aspectRatio: 1,
                      }}
                      onError={(e) => {
                        e.target.src = images;
                      }}
                      loading="lazy"
                    />
                    {menu.is_special && (
                      <i
                        // className="fa-solid fa-star border rounded-4 text-info bg-white opacity-75 d-flex justify-content-center align-items-center border-info"
                        className="fa-solid fa-star border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center text-info font_size_12"
                        style={{
                          position: "absolute",
                          top: 3,
                          right: 5,
                          height: 17,
                          width: 17,
                        }}
                      ></i>
                    )}
                    <div
                      className={`border rounded-3 bg-white opacity-100 d-flex justify-content-center align-items-center ${
                        menu.menu_veg_nonveg === "veg"
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
                          menu.menu_veg_nonveg === "veg"
                            ? "fa-solid fa-circle text-success"
                            : "fa-solid fa-play fa-rotate-270 text-danger"
                        } font_size_12`}
                      ></i>
                    </div>
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
                          menu.is_favourite
                            ? "fa-solid fa-heart text-danger"
                            : "fa-regular fa-heart"
                        } fs-6`}
                        onClick={(e) => handleLikeClick(e, menu.menu_id)}
                      ></i>
                    </div>

                    {menu.offer !== 0 && (
                      <div className="gradient_bg d-flex justify-content-center align-items-center gradient_bg_offer">
                        <span className="font_size_10 text-white">
                          {menu.offer}% Off
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="dz-content pb-1">
                    <div className="detail-content category-text">
                      <div className="font_size_12 ">
                        {/* {menu.is_special && (
                          <div className="row ">
                            <div className="col-12 text-info text-center font_size_12 fw-medium border-bottom pb-2 mb-2">
                              <i className="fa-regular fa-star me-2"></i>
                              Special
                            </div>
                          </div>
                        )} */}
                        <div className="row">
                          <div className="col-8 text-success">
                            <i className="fa-solid fa-utensils pe-1"></i>
                            <span className="font_size_10">
                              {menu.category}
                            </span>
                          </div>
                          {menu.rating > 0 && (
                            <div className="col-4 text-end pe-2 d-flex justify-content-end align-items-center">
                              {renderStarRating(menu.rating)}
                              <span className="font_size_10 fw-normal gray-text">
                                {menu.rating}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {menu.name && (
                      <div className="font_size_14 fw-medium text-wrap">
                        {menu.name}
                      </div>
                    )}
                    {menu.spicy_index && (
                      <div className="row mt-1">
                        <div className="col-9 pe-1">
                          <div>
                            {Array.from({ length: 5 }).map((_, index) =>
                              index < menu.spicy_index ? (
                                <i
                                  className="fa-solid fa-pepper-hot text-danger font_size_12"
                                  key={index}
                                ></i>
                              ) : (
                                <i
                                  className="fa-solid fa-pepper-hot font_size_12 text-secondary opacity-25"
                                  key={index}
                                ></i>
                              )
                            )}
                            <div className="price-wrapper d-flex align-items-baseline mt-1">
                              <span className="font_size_14 me-2 text-info fw-semibold">
                                ₹{menu.price}
                              </span>
                              {menu.oldPrice !== 0 &&
                                menu.oldPrice !== null && (
                                  <span className="gray-text text-decoration-line-through font_size_12 fw-normal">
                                    ₹{menu.oldPrice}
                                  </span>
                                )}
                            </div>
                          </div>
                        </div>
                        <div className="col-3 d-flex justify-content-end align-items-end mb-1 pe-2 ps-0">
                          {renderCartIcon(menu)}
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No items available in this category.</p>
        )}
      </div>

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
                    Add {selectedMenu.name} to Cart
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
                    onClick={() =>
                      handleSuggestionClick("Make it more spicy 🥵")
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fa-solid fa-comment-dots me-2"></i> Make it
                    more spicy ����
                  </p>
                </div>
                <hr className="my-4" />
                <div className="mb-2">
                  <label className="form-label d-flex justify-content-center">
                    Select Portion Size
                  </label>
                  <div
                    className={`d-flex ${
                      halfPrice !== null
                        ? "justify-content-between"
                        : "justify-content-center"
                    }`}
                  >
                    {isPriceFetching ? (
                      <p>Loading prices...</p>
                    ) : (
                      <>
                        {halfPrice !== null && (
                          <button
                            type="button"
                            className={`btn px-4 font_size_14 ${
                              portionSize === "half"
                                ? "btn-primary"
                                : "btn-outline-primary"
                            }`}
                            onClick={() => setPortionSize("half")}
                          >
                            Half (₹{halfPrice})
                          </button>
                        )}
                        <button
                          type="button"
                          className={`btn px-4 font_size_14 ${
                            portionSize === "full"
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={() => setPortionSize("full")}
                        >
                          Full (₹{fullPrice})
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <hr className="my-4" />
              <div className="modal-body d-flex justify-content-around px-0 pt-2 pb-3 ">
                <button
                  type="button"
                  className="border border-1 border-muted bg-transparent px-4 font_size_14  rounded-pill text-dark"
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
                  <i className="fa-solid fa-cart-shopping pe-1 text-white"></i>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}

      {/* Add modal JSX */}
      {showAIModal && (
        <div
          className="modal fade show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(5px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content border-0 shadow rounded-4"
              style={{
                position: "relative",
                padding: "4px",
                // background: "#fff",
                "--angle": "0deg",
                animation: "rotate 3s linear infinite",
              }}
            >
              <i
                className="fa-solid fa-xmark gray-text font_size_14"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  margin: "12px",
                  cursor: "pointer",
                  zIndex: 2,
                }}
                onClick={() => setShowAIModal(false)}
              ></i>
              <div
                style={{
                  content: '""',
                  position: "absolute",
                  inset: "-2px",
                  zIndex: "-1",
                  background:
                    "linear-gradient(var(--angle), #ffbe0b, #fb5607, #ff006e, #8338ec, #3a86ff)",
                  borderRadius: "1rem",
                  animation: "rotate 3s linear infinite",
                }}
              />
              <div
                style={{
                  content: '""',
                  position: "absolute",
                  inset: "1px",
                  zIndex: "-2",
                  background: "#fff",
                  borderRadius: "1rem",
                }}
              />
              <div className="modal-body bg-white text-center p-4">
                <img
                  src={AI_Loading}
                  alt="AI Loading"
                  style={{
                    width: "120px",
                    height: "120px",
                    marginBottom: "20px",
                  }}
                />
                <div className="mb-3">
                  {countdown !== null ? (
                    <div className="font_size_14">
                      Magic starts in{" "}
                      <span className="fw-bold">{countdown}</span>
                    </div>
                  ) : (
                    "AI is generating menu for you"
                  )}
                </div>
                {/* <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div> */}
              </div>
            </div>
            <style>
              {`
                @property --angle {
                  syntax: "<angle>";
                  initial-value: 0deg;
                  inherits: false;
                }
                @keyframes rotate {
                  0%     { --angle: 0deg; }
                  100%   { --angle: 360deg; }
                }
              `}
            </style>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
