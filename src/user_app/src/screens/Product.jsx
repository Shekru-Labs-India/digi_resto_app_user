import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import { useRestaurantId } from "../context/RestaurantIdContext";
import { usePopup } from "../context/PopupContext";
import "../assets/css/toast.css";
import Bottom from "../component/bottom";
import Header from "../components/Header";
import HotelNameAndTable from "../components/HotelNameAndTable";
import { useCart } from "../context/CartContext";
import config from "../component/config";

import RestaurantSocials from "../components/RestaurantSocials";
import AI_Loading from "../assets/gif/AI_Loading.gif";
import CategorySlider from "./CategorySlider";
// Convert strings to Title Case
const toTitleCase = (text) => {
  if (!text) return "";
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

const Product = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize state from local storage
    return localStorage.getItem("isDarkMode") === "true";
  }); // State for theme

  const isLoggedIn = !!localStorage.getItem("userData");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuList, setMenuList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filteredMenuList, setFilteredMenuList] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [sortByOpen, setSortByOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([100, 1000]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryCounts, setCategoryCounts] = useState({});
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const { restaurantId } = useRestaurantId();
  const [sortCriteria, setSortCriteria] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const initialFetchDone = useRef(false);
  const swiperRef = useRef(null); // Define swiperRef
  const { restaurantName } = useRestaurantId();
  const { categoryId } = useParams();

  const { cartItems, addToCart, isMenuItemInCart } = useCart();
  const [cartItemsCount, setCartItemsCount] = useState(cartItems.length);

  const { table_number } = useParams();
  const location = useLocation();

  const [showModal, setShowModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [portionSize, setPortionSize] = useState("full");
  const [notes, setNotes] = useState("");
  const [halfPrice, setHalfPrice] = useState(null);
  const [fullPrice, setFullPrice] = useState(null);
  const [isPriceFetching, setIsPriceFetching] = useState(false);

  const { showLoginPopup } = usePopup();

  const [isMagicLoading, setIsMagicLoading] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [countdown, setCountdown] = useState(null);

  // Add a ref to track if the process should continue
  const magicProcessRef = useRef(true);

  // Define applySort function
  const applySort = () => {
    let sortedList = [...filteredMenuList];
    switch (sortCriteria) {
      case "popularity":
        sortedList.sort((a, b) => b.popularity - a.popularity);
        break;
      case "discount":
        sortedList.sort((a, b) => b.discount - a.discount);
        break;
      case "priceHighToLow":
        sortedList.sort((a, b) => b.price - a.price);
        break;
      case "priceLowToHigh":
        sortedList.sort((a, b) => a.price - b.price);
        break;
      case "rating":
        sortedList.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    setFilteredMenuList(sortedList);
    setSortByOpen(false); // Close sort modal after applying sort
  };

  // Fetch menu data using a single API
  const fetchMenuData = useCallback(async () => {
    if (!restaurantId || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/get_all_menu_list_by_category`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: userData ? userData.customer_id : null,
            restaurant_id: restaurantId,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch menu data");
      }

      const data = await response.json();

      if (data.st === 1) {
        // Formatting the menu list
        const formattedMenuList = data.data.menus.map((menuItem) => ({
          ...menuItem,
          name: toTitleCase(menuItem.menu_name || ""),
          category: toTitleCase(menuItem.category_name || ""),
          oldPrice: Math.floor(menuItem.price * 1.1),
          is_favourite: menuItem.is_favourite === 1,
        }));

        setMenuList(formattedMenuList);
        localStorage.setItem("menuItems", JSON.stringify(formattedMenuList));

        // Format categories without adding Special category to slider
        const formattedCategories = data.data.category.map((category) => ({
          ...category,
          name: toTitleCase(category.category_name || ""),
        }));

        setCategories(formattedCategories);

        // Handle special items in filtering logic
        const specialItems = formattedMenuList.filter(
          (item) => item.is_special
        );
        setFilteredMenuList(formattedMenuList);
      } else {
        throw new Error("API request unsuccessful");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId, isLoading, userData]);

  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(parseInt(categoryId, 10));
    } else {
      setSelectedCategory(null);
    }
  }, [categoryId]);

  useEffect(() => {
    let isMounted = true;
    if (restaurantId && !isLoading && !initialFetchDone.current && isMounted) {
      fetchMenuData();
      initialFetchDone.current = true;
    }
    return () => {
      isMounted = false;
    };
  }, [restaurantId, isLoading, fetchMenuData]);

  // Update cart items count
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItemsCount(cartItems.length);
  }, []);

  const handleUnauthorizedFavorite = (navigate) => {
    window.showToast("info", "Please login to use favourite functionality");
  };

  // Handle favorites (like/unlike)
  const handleLikeClick = async (menuId) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id || userData.customer_type === "guest") {
      showLoginPopup();
      return;
    }

    if (!restaurantId) return;

    const menuItem = menuList.find((item) => item.menu_id === menuId);
    const isFavorite = menuItem.is_favourite;

    const apiUrl = isFavorite
      ? `${config.apiDomain}/user_api/remove_favourite_menu`
      : `${config.apiDomain}/user_api/save_favourite_menu`;

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
          const updatedMenuList = menuList.map((item) =>
            item.menu_id === menuId
              ? { ...item, is_favourite: !isFavorite }
              : item
          );

          setMenuList(updatedMenuList);
          setFilteredMenuList(
            updatedMenuList.filter(
              (item) =>
                item.menu_cat_id === selectedCategory ||
                selectedCategory === null
            )
          );
          setFavorites(updatedMenuList.filter((item) => item.is_favourite));
          window.showToast(
            "success",
            isFavorite
              ? "Item has been removed from your favourites."
              : "Item has been added to your favourites."
          );
        }
      }
    } catch (error) {
      window.showToast("error", "Failed to update favourite status");
    }
  };

  useEffect(() => {
    if (location.state && location.state.selectedCategory) {
      setSelectedCategory(parseInt(location.state.selectedCategory, 10));
    }
  }, [location]);

  useEffect(() => {
    if (categories.length > 0) {
      if (swiperRef.current) {
        swiperRef.current.destroy();
      }
      swiperRef.current = new Swiper(".category-slide", {
        slidesPerView: "auto",
        spaceBetween: 10,
        initialSlide: selectedCategory
          ? categories.findIndex(
              (category) => category.menu_cat_id === selectedCategory
            )
          : 0,
      });
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    if (menuList.length > 0) {
      if (selectedCategory === "special") {
        setFilteredMenuList(menuList.filter((menu) => menu.is_special));
      } else if (selectedCategory === "offer") {
        setFilteredMenuList(menuList.filter((menu) => menu.offer > 0));
      } else if (selectedCategory === null) {
        setFilteredMenuList(menuList);
      } else {
        setFilteredMenuList(
          menuList.filter((menu) => menu.menu_cat_id === selectedCategory)
        );
      }
    }
  }, [selectedCategory, menuList]);

  const handleCategorySelect = useCallback((categoryId) => {
    // Force immediate state update
    setSelectedCategory((prevCategory) => {
      if (prevCategory === categoryId) {
        return null; // Reset to show all items if clicking the same category
      }
      return categoryId;
    });
  }, []);

  const fetchHalfFullPrices = async (menuId) => {
    if (!restaurantId) {
      return;
    }

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
        throw new Error(data.msg || "Failed to fetch price information");
      }
    } catch (error) {
      window.showToast("error", "Failed to fetch price information");
    } finally {
      setIsPriceFetching(false);
    }
  };

  // Add item to cart
  const handleAddToCartClick = (menu) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    // if (!userData?.customer_id || userData.customer_type === 'guest') {
    //   showLoginPopup();
    //   return;
    // }

    if (isMenuItemInCart(menu.menu_id)) {
      window.showToast("info", "This item is already in your cart.");
      return;
    }

    if (!restaurantId) {
      window.showToast("error", "Restaurant information is missing");
      return;
    }

    setSelectedMenu(menu);
    setPortionSize("full");
    fetchHalfFullPrices(menu.menu_id);
    setShowModal(true);
  };

  const handleConfirmAddToCart = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    // if (!userData?.customer_id || userData.customer_type === 'guest') {
    //   showLoginPopup();
    //   return;
    // }

    if (!selectedMenu) return;

    const selectedPrice = portionSize === "half" ? halfPrice : fullPrice;

    if (!selectedPrice) {
      window.showToast("error", "Price information is not available");
      return;
    }

    if (!restaurantId) {
      window.showToast("error", "Restaurant information is missing");
      return;
    }

    try {
      // Store restaurant ID in localStorage if not already stored
      if (!localStorage.getItem("restaurantId")) {
        localStorage.setItem("restaurantId", restaurantId);
      }

      await addToCart(
        {
          ...selectedMenu,
          quantity: 1,
          notes,
          half_or_full: portionSize,
          price: selectedPrice,
          restaurant_id: restaurantId,
        },
        restaurantId
      );

      window.showToast("success", `${selectedMenu.name} added to cart`);

      setShowModal(false);
      setNotes("");
      setPortionSize("full");
      setSelectedMenu(null);

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      window.showToast(
        "error",
        error.message || "Failed to add item to cart. Please try again."
      );
    }
  };

  const handleModalClick = (e) => {
    if (e.target.classList.contains("modal")) {
      setShowModal(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Simply set the suggestion as the new note value
    setNotes(suggestion);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle the sidebar state
  };

  const getFirstName = (name) => {
    if (!name) return "User"; // Return "User" if name is undefined or null
    const words = name.split(" ");
    return words[0]; // Return the first word
  };

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    localStorage.setItem("isDarkMode", newIsDarkMode);
  };

  useEffect(() => {
    // Apply the theme class based on the current state
    if (isDarkMode) {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
    }
  }, [isDarkMode]); // Depend on isDarkMode to re-apply on state change

  // Add the standardized rating function
  const renderStarRating = (rating) => {
    const numRating = parseFloat(rating);

    // 0 to 0.4: Show no star & value
    if (!numRating || numRating < 0.5) {
      return <i className="font_size_10 ratingStar me-1"></i>;
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
      return <i className="fa-solid fa-star font_size_10 ratingStar me-1"></i>;
    }

    return <i className="ri-star-line font_size_10 ratingStar me-1"></i>;
  };

  // Modify the handleMagicClick function
  const handleMagicClick = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setIsMagicLoading(true);
    setShowAIModal(true);
    magicProcessRef.current = true;

    try {
      // Only proceed if the process hasn't been cancelled
      if (magicProcessRef.current) {
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

        if (data.st === 1 && magicProcessRef.current) {
          localStorage.setItem("cartId", data.cart_id);
          setTimeout(() => {
            if (magicProcessRef.current) {
              navigate("/user_app/Cart", {
                state: {
                  cartId: data.cart_id,
                  magicMessage: "Your magic cart has been created!",
                },
              });
            }
          }, 5000);
        } else if (magicProcessRef.current) {
          window.showToast("error", data.msg || "Failed to create magic cart");
        }
      }
    } catch (error) {
      if (magicProcessRef.current) {
        console.clear();
        window.showToast("error", "Something went wrong. Please try again.");
      }
    } finally {
      if (!magicProcessRef.current) {
        setIsMagicLoading(false);
        setShowAIModal(false);
      } else {
        setTimeout(() => {
          if (magicProcessRef.current) {
            setIsMagicLoading(false);
            setShowAIModal(false);
          }
        }, 5000);
      }
    }
  };

  // Add handleCloseModal function
  const handleCloseModal = () => {
    magicProcessRef.current = false;
    setShowAIModal(false);
    setIsMagicLoading(false);
    setCountdown(null);
  };

    
  const getFoodTypeStyles = (foodType) => {
    switch (foodType?.toLowerCase()) {
      case "veg":
        return {
          icon: "fa-solid fa-circle text-success",
          border: "border-success",
        };
      case "nonveg":
        return {
          icon: "fa-solid fa-play fa-rotate-270 text-danger",
          border: "border-danger",
        };
      case "egg":
        return {
          icon: "fa-solid fa-egg text-warning",
          border: "border-warning",
        };
      case "vegan":
        return {
          icon: "fa-solid fa-leaf text-success",
          border: "border-success",
        };
      default:
        return {
          icon: "fa-solid fa-circle text-success",
          border: "border-success",
        };
    }
  };
  

  useEffect(() => {
    if (showAIModal) {
      setTimeout(() => {
        setCountdown(3);
        const interval = setInterval(() => {
          setCountdown((prev) => {
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

  return (
    <div>
      <Header title="Menu" count={menuList.length} />

      <main className={`page-content space-top`}>
        <div className="container px-3 py-0">
          <HotelNameAndTable
            restaurantName={restaurantName}
            tableNumber={userData?.tableNumber || "1"}
          />
        </div>

        {/* Category Swiper */}
        <div className="container pb-0 pt-0">
          <div className="d-flex justify-content-between gap-2 my-3">
            <div
              className={`category-btn font_size_14 rounded-pill border border-1 border-info text-info offer-menu-btn ${
                selectedCategory === "special"
                  ? "active bg-info text-white"
                  : "bg-transparent"
              }`}
              onClick={() => handleCategorySelect("special")}
            >
              <i
                className={`fa-solid fa-star me-2 ${
                  selectedCategory === "special" ? "text-white" : "text-info"
                }`}
              ></i>
              Special
              <span className="ms-1 font_size_10">
                ({menuList.filter((menu) => menu.is_special).length})
              </span>
            </div>

            <div className="mx-2 w-100" style={{ height: "40px" }}>
              <div
                className={`category-btn font_size_14 rounded-pill border border-1 border-success custom-menu-btn w-100 h-100 d-flex align-items-center justify-content-center ${
                  selectedCategory === "offer"
                    ? "active bg-success text-white"
                    : "bg-transparent text-success"
                }`}
                onClick={() => handleCategorySelect("offer")}
              >
                <i
                  className={`fa-solid fa-percent me-2 ${
                    selectedCategory === "offer" ? "text-white" : "text-success"
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

          {/* Category slider */}
          <div className="swiper category-slide">
            <div className="swiper-wrapper">
              {/* Add All button */}
              <div className="swiper-slide">
                <div
                  className={`category-btn font_size_14 rounded-5 py-1`}
                  onClick={() => handleCategorySelect(null)}
                  style={{
                    backgroundColor:
                      selectedCategory === null ? "#0D775E" : "#ffffff",
                    color: selectedCategory === null ? "#ffffff" : "#000000",
                    border: "1px solid #ddd",
                    cursor: "pointer",
                    padding: "8px 16px",
                    transition: "all 0.3s ease",
                  }}
                >
                  All{" "}
                  <span
                    style={{
                      color: selectedCategory === null ? "#ffffff" : "#666",
                      fontSize: "0.8em",
                    }}
                  >
                    ({menuList.length})
                  </span>
                </div>
              </div>

              {/* Existing category buttons */}
              {categories.map((category) => (
                <div key={category.menu_cat_id} className="swiper-slide">
                  <div
                    className={`category-btn font_size_14 rounded-5 py-1`}
                    onClick={() => handleCategorySelect(category.menu_cat_id)}
                    style={{
                      backgroundColor:
                        selectedCategory === category.menu_cat_id
                          ? "#0D775E"
                          : "#ffffff",
                      color:
                        selectedCategory === category.menu_cat_id
                          ? "#ffffff"
                          : "#000000",
                      border: "1px solid #ddd",
                      cursor: "pointer",
                      padding: "8px 16px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {category.menu_cat_id === "special"
                      ? category.category_name
                      : category.name || category.category_name}{" "}
                    <span
                      style={{
                        color:
                          selectedCategory === category.menu_cat_id
                            ? "#ffffff"
                            : "#666",
                        fontSize: "0.8em",
                      }}
                    >
                      ({category.menu_count})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Menu Items */}
        <div className="container p-b70 ">
          <div className="row g-3 grid-style-1">
            {filteredMenuList.map((menuItem) => (
              <div key={menuItem.menu_id} className="col-6">
                <div className="card-item style-6 rounded-4">
                  <Link
                    to={`/user_app/ProductDetails/${menuItem.menu_id}`}
                    state={{
                      menu_cat_id: menuItem.menu_cat_id,
                      fromProduct: true,
                    }}
                    className="card-link"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "block",
                    }}
                    onClick={(e) => {
                      // If clicking the cart icon, prevent navigation
                      if (e.defaultPrevented) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <div className="dz-media">
                      <img
                        src={menuItem.image || images}
                        alt={menuItem.name || "Menu item"}
                        style={{
                          aspectRatio: "1/1",
                          objectFit: "cover",
                          height: "100%",
                        }}
                        className="object-fit-cover"
                        onError={(e) => {
                          e.target.src = images;
                        }}
                      />
                      {/* Add special icon here */}
                      {menuItem.is_special && (
                        <i
                          className="fa-solid fa-star border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center text-info"
                          style={{
                            position: "absolute",
                            top: 3,
                            right: 5,
                            height: 17,
                            width: 17,
                            zIndex: 2,
                          }}
                        ></i>
                      )}
                      {/* Existing heart icon */}
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
                          className={`${
                            menuItem.is_favourite
                              ? "fa-solid fa-heart text-danger"
                              : "fa-regular fa-heart"
                          } fs-6`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleLikeClick(menuItem.menu_id);
                          }}
                        ></i>
                      </div>

                      <div
                        className={`border rounded-3 bg-white opacity-100 d-flex justify-content-center align-items-center ${
                          getFoodTypeStyles(menuItem.menu_food_type).border
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
                            getFoodTypeStyles(menuItem.menu_food_type).icon
                          } font_size_12`}
                        ></i>
                      </div>
                      {menuItem.offer !== 0 && (
                        <div className="gradient_bg d-flex justify-content-center align-items-center gradient_bg_offer">
                          <span className="font_size_10 text-white">
                            {menuItem.offer}% Off
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="dz-content pb-1">
                      <div
                        className="detail-content"
                        style={{ position: "relative" }}
                      >
                        {/* {menuItem.is_special && (
                          <div className="row">
                            <div className="col-12 text-info text-center font_size_12 fw-medium border-bottom pb-2 mb-2 ">
                              <i className="fa-regular fa-star me-2"></i>
                              Special
                            </div>
                          </div>
                        )} */}
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="fw-medium text-success font_size_10 d-flex align-items-center">
                            <i className="fa-solid fa-utensils pe-1"></i>
                            {categories.find(
                              (category) =>
                                category.menu_cat_id === menuItem.menu_cat_id
                            )?.name || menuItem.category}
                          </div>
                          <div className="text-end">
                            {menuItem.rating > 0 && (
                              <>
                                {renderStarRating(menuItem.rating)}
                                <span className="font_size_10 fw-normal gray-text">
                                  {menuItem.rating}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {menuItem.name && (
                        <div className="font_size_14 fw-medium text-wrap">
                          {menuItem.name}
                        </div>
                      )}
                      {menuItem.spicy_index && (
                        <div className="row">
                          <div className="col-6">
                            <div className="offer-code mt-2">
                              {Array.from({ length: 5 }).map((_, index) =>
                                index < menuItem.spicy_index ? (
                                  <i
                                    className="fa-solid fa-pepper-hot text-danger font_size_12"
                                    key={index}
                                  ></i>
                                ) : (
                                  <i
                                    className="fa-solid fa-pepper-hot font_size_12 text-secondary opacity-25"
                                    style={{ color: "#bbbaba" }}
                                    key={index}
                                  ></i>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="row">
                        <div className="col-9 d-flex align-items-end mb-1">
                          <div className="footer-wrapper">
                            <div className="price-wrapper d-flex align-items-baseline">
                              {menuItem.offer ? (
                                <>
                                  <span className="font_size_14 me-2 text-info fw-semibold">
                                    ₹
                                    {Math.floor(
                                      menuItem.price *
                                        (1 - menuItem.offer / 100)
                                    )}
                                  </span>
                                  <span className="gray-text text-decoration-line-through font_size_12 fw-normal">
                                    ₹{menuItem.price}
                                  </span>
                                </>
                              ) : (
                                <span className="font_size_14 me-2 text-info fw-semibold">
                                  ₹{menuItem.price}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="col-3 d-flex justify-content-end align-items-end mb-1 pe-3 ps-0">
                          {userData ? (
                            <div
                              className="border border-1 rounded-circle bg-white opacity-75"
                              style={{
                                border: "1px solid gray",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "25px",
                                height: "25px",
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
                                    ? "fa-circle-check "
                                    : "fa-solid fa-plus text-secondary"
                                } fs-6 `}
                              ></i>
                            </div>
                          ) : (
                            <div
                              className="border border-1 rounded-circle bg-white opacity-75"
                              style={{
                                border: "1px solid gray",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "25px",
                                height: "25px",
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
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="container">
            <RestaurantSocials />
          </div>
        </div>
      </main>

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
                    onClick={() => handleSuggestionClick("Make it more spicy ")}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fa-solid fa-comment-dots me-2"></i> Make it
                    more spicy
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
                  <i className="fa-solid fa-plus pe-1 text-white"></i>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}

      <Bottom />

      {/* Add AI Modal */}
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
                "--angle": "0deg",
                animation: "rotate 3s linear infinite",
              }}
            >
              <button
                className="btn p-0 fs-3 gray-text"
                onClick={handleCloseModal}
                aria-label="Close"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  margin: "12px",
                  cursor: "pointer",
                  zIndex: 2,
                }}
              >
                <i className="fa-solid fa-xmark gray-text font_size_14 pe-3"></i>
              </button>
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

export default Product;
