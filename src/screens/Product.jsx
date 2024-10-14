import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import { useRestaurantId } from "../context/RestaurantIdContext";
import Slider from "@mui/material/Slider"; // Import the Slider component
import Bottom from "../component/bottom";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/saga-blue/theme.css"; // Choose a theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

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
  const [cartItemsCount, setCartItemsCount] = useState(0);
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
  const [cartItems, setCartItems] = useState([]); // Define cartItems and setCartItems
  const { restaurantName } = useRestaurantId();

  const toast = useRef(null);
  const { table_number } = useParams();
  const location = useLocation();

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
        "https://menumitra.com/user_api/get_all_menu_list_by_category",
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

        // Formatting the categories
        const formattedCategories = data.data.category.map((category) => ({
          ...category,
          name: toTitleCase(category.category_name || ""),
        }));

        setCategories(formattedCategories);

        // Initialize category counts correctly
        const counts = { All: formattedMenuList.length };

        formattedCategories.forEach((category) => {
          counts[category.name] = 0;
        });

        formattedMenuList.forEach((item) => {
          counts[item.category] = (counts[item.category] || 0) + 1;
        });

        setCategoryCounts(counts);

        // Handle favorites
        const favoriteItems = formattedMenuList.filter(
          (item) => item.is_favourite
        );
        setFavorites(favoriteItems);

        // Set the filtered menu list (initially show all)
        setFilteredMenuList(formattedMenuList);
      } else {
        throw new Error("API request unsuccessful");
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId, isLoading, userData]);

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

  // Handle favorites (like/unlike)
  const handleLikeClick = async (menuId) => {
    if (!userData || !restaurantId) return;

    if (!userData.customer_id) {
      navigate("/Signinscreen");
      return;
    }

    const menuItem = menuList.find((item) => item.menu_id === menuId);
    const isFavorite = menuItem.is_favourite;

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
          toast.current.show({
            severity: isFavorite ? "info" : "success",
            summary: isFavorite
              ? "Removed from Favourites"
              : "Added to Favourites",
            detail: isFavorite
              ? "Item has been removed from your favourites."
              : "Item has been added to your favourites.",
            life: 3000,
          });
        }
      }
    } catch (error) {
      console.error("Error updating favourite status:", error);
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === null) {
      setFilteredMenuList(menuList);
    } else {
      const filteredMenus = menuList.filter(
        (menu) => menu.menu_cat_id === categoryId
      );
      setFilteredMenuList(filteredMenus);
    }
  };

  useEffect(() => {
    // Extract category ID from query parameters
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get("category");

    if (categoryId) {
      setSelectedCategory(parseInt(categoryId, 10));
    }
  }, [location.search]);

  useEffect(() => {
    if (categories.length > 0) {
      swiperRef.current = new Swiper(".category-slide", {
        slidesPerView: "auto",
        spaceBetween: 10,
        initialSlide: categories.findIndex(
          (category) => category.menu_cat_id === selectedCategory
        ),
      });

      // Add scroll event listener
      const swiperContainer = document.querySelector(".category-slide");
      swiperContainer.addEventListener("scroll", () => {
        if (swiperContainer.scrollLeft === 0) {
          handleCategorySelect(categories[0].menu_cat_id);
        }
      });
    }
  }, [categories, selectedCategory]);

  // Add item to cart
  const handleAddToCartClick = async (menuItem) => {
    if (!userData || !userData.customer_id) {
      navigate("/Signinscreen");
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const isAlreadyInCart = cartItems.some(
      (item) => item.menu_id === menuItem.menu_id
    );

    if (isAlreadyInCart) {
      toast.current.show({
        severity: "error",
        summary: "Item in Cart",
        detail: "This item is already in the cart!",
        life: 3000,
      });
      return;
    }

    // Update local storage and state immediately
    const updatedCartItems = [...cartItems, { ...menuItem, quantity: 1 }];
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setCartItemsCount(updatedCartItems.length);

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
            menu_id: menuItem.menu_id,
            customer_id: userData.customer_id,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.st === 1) {
        console.log("Item added to cart successfully.");
        localStorage.setItem("cartId", data.cart_id); // Store the cart ID in local storage
        toast.current.show({
          severity: "success",
          summary: "Added to Cart",
          detail: "Item has been added to your cart.",
          life: 3000,
        });
      } else {
        console.error("Failed to add item to cart:", data.msg);
        // Revert the local storage and state update if the API call fails
        const revertedCartItems = updatedCartItems.filter(
          (cartItem) => cartItem.menu_id !== menuItem.menu_id
        );
        localStorage.setItem("cartItems", JSON.stringify(revertedCartItems));
        setCartItemsCount(revertedCartItems.length);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      // Revert the local storage and state update if the API call fails
      const revertedCartItems = updatedCartItems.filter(
        (cartItem) => cartItem.menu_id !== menuItem.menu_id
      );
      localStorage.setItem("cartItems", JSON.stringify(revertedCartItems));
      setCartItemsCount(revertedCartItems.length);
    }
  };

  // Check if a menu item is in the cart
  const isMenuItemInCart = (menuId) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    return cartItems.some((item) => item.menu_id === menuId);
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

  return (
    <div>
      <Toast ref={toast} position="bottom-center" className="custom-toast" />
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className={`page-wrapper ${sidebarOpen ? "sidebar-open" : ""}`}>
            <header className="header header-fixed pt-2">
              <div className="header-content d-flex justify-content-between">
                <div className="left-content">
                  <Link to="#">
                    <div
                      className="back-btn icon-sm"
                      onClick={() => navigate(-1)}
                    >
                      <i className="ri-arrow-left-line fs-3"></i>
                    </div>
                  </Link>
                </div>
                <div className="mid-content">
                  <span className="custom_font_size_bold me-3 title">
                    Menu{" "}
                    {categories.length > 0 && (
                      <span className="small-number gray-text">
                        ({menuList.length})
                      </span>
                    )}
                  </span>
                </div>
                <div className="right-content gap-1">
                  <div className="menu-toggler" onClick={toggleSidebar}>
                    {isLoggedIn ? (
                      <i className="ri-menu-line fs-1"></i>
                    ) : (
                      <Link to="/Signinscreen">
                        <i className="ri-login-circle-line fs-1"></i>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </header>

            {/* Dark overlay for sidebar */}
            <div
              className={`dark-overlay ${
                sidebarOpen ? "dark-overlay active" : ""
              }`}
              onClick={toggleSidebar}
            ></div>

            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? "sidebar show" : ""}`}>
              <div className="author-box">
                <div className="d-flex justify-content-start align-items-center m-0">
                  <i
                    className={
                      userData && userData.customer_id
                        ? "ri-user-3-fill fs-3"
                        : "ri-user-3-line fs-3"
                    }
                  ></i>
                </div>
                <div className="custom_font_size_bold">
                  <span className="ms-3 pt-4">
                    {userData?.name
                      ? `Hello, ${toTitleCase(getFirstName(userData.name))}`
                      : "Hello, User"}
                  </span>
                  <div className="mail ms-3 gray-text custom_font_size_bold">
                    {userData?.mobile}
                  </div>
                  <div className="dz-mode mt-3 me-4">
                    <div className="theme-btn" onClick={toggleTheme}>
                      <i
                        className={`ri ${
                          isDarkMode ? "ri-sun-line" : "ri-moon-line"
                        } sun`}
                      ></i>
                      <i
                        className={`ri ${
                          isDarkMode ? "ri-moon-line" : "ri-sun-line"
                        } moon`}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
              <ul className="nav navbar-nav">
                <li>
                  <Link className="nav-link active" to="/Menu">
                    <span className="dz-icon icon-sm">
                      <i className="ri-bowl-line fs-3"></i>
                    </span>
                    <span className="custom_font_size_bold">Menu</span>
                  </Link>
                </li>
                <li>
                  <Link className="nav-link active" to="/Category">
                    <span className="dz-icon icon-sm">
                      <i className="ri-list-check-2 fs-3"></i>
                    </span>
                    <span className="custom_font_size_bold">Category</span>
                  </Link>
                </li>
                <li>
                  <Link className="nav-link active" to="/Wishlist">
                    <span className="dz-icon icon-sm">
                      <i className="ri-heart-2-line fs-3"></i>
                    </span>
                    <span className="custom_font_size_bold">Favourite</span>
                  </Link>
                </li>
                <li>
                  <Link className="nav-link active" to="/MyOrder">
                    <span className="dz-icon icon-sm">
                      <i className="ri-drinks-2-line fs-3"></i>
                    </span>
                    <span className="custom_font_size_bold">My Orders</span>
                  </Link>
                </li>
                <li>
                  <Link className="nav-link active" to="/Cart">
                    <span className="dz-icon icon-sm">
                      <i className="ri-shopping-cart-line fs-3"></i>
                    </span>
                    <span className="custom_font_size_bold">Cart</span>
                  </Link>
                </li>
                <li>
                  <Link className="nav-link active" to="/Profile">
                    <span className="dz-icon icon-sm">
                      <i
                        className={
                          userData && userData.customer_id
                            ? "ri-user-3-fill fs-3"
                            : "ri-user-3-line fs-3"
                        }
                      ></i>
                    </span>
                    <span className="custom_font_size_bold">Profile</span>
                  </Link>
                </li>
              </ul>
              {/* <div className="dz-mode mt-4 me-4">
          <div className="theme-btn" onClick={toggleTheme}>
            <i
              className={`ri ${
                isDarkMode ? "ri-sun-line" : "ri-moon-line"
              } sun`}
            ></i>
            <i
              className={`ri ${
                isDarkMode ? "ri-moon-line" : "ri-sun-line"
              } moon`}
            ></i>
          </div>
        </div> */}
              <div className="sidebar-bottom"></div>
            </div>
          </div>
        </div>
      </header>

      <main className={`page-content space-top p-b80`}>
        <div className="container pb-3 pt-4">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <i className="ri-store-2-line me-2"></i>
              <span className="fw-medium hotel-name">
                {restaurantName.toUpperCase() || "Restaurant Name"}
              </span>
            </div>
            <div className="d-flex align-items-center">
              <i className="ri-user-location-line me-2 gray-text"></i>
              <span className="fw-medium custom-text-gray">
                {userData.tableNumber ? `Table ${userData.tableNumber}` : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Category Swiper */}
        <div className="container pb-0 pt-0">
          <div className="swiper category-slide">
            <div className="swiper-wrapper">
              {categories.length > 0 && (
                <div
                  className={`category-btn border border-2 rounded-5 swiper-slide custom_font_size_bold ${
                    selectedCategory === null ? "active" : ""
                  }`}
                  onClick={() => handleCategorySelect(null)}
                  style={{
                    backgroundColor: selectedCategory === null ? "#0D775E" : "",
                    color: selectedCategory === null ? "#ffffff" : "",
                  }}
                >
                  All{" "}
                  <span className="small-number gray-text">
                    ({categoryCounts.All})
                  </span>
                </div>
              )}
              {categories.map((category) => (
                <div key={category.menu_cat_id} className="swiper-slide">
                  <div
                    className={`category-btn border border-2 rounded-5 custom_font_size_bold ${
                      selectedCategory === category.menu_cat_id ? "active" : ""
                    }`}
                    onClick={() => handleCategorySelect(category.menu_cat_id)}
                    style={{
                      backgroundColor:
                        selectedCategory === category.menu_cat_id
                          ? "#0D775E"
                          : "",
                      color:
                        selectedCategory === category.menu_cat_id
                          ? "#ffffff"
                          : "",
                    }}
                  >
                    {category.name}{" "}
                    <span className="small-number gray-text">
                      ({categoryCounts[category.name] || 0})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="container mb-5 pt-0">
          <div className="row g-3 grid-style-1">
            {filteredMenuList.map((menuItem) => (
              <div key={menuItem.menu_id} className="col-6">
                <div className="card-item style-6 rounded-3">
                  <div className="dz-media">
                    <Link
                      to={`/ProductDetails/${menuItem.menu_id}`}
                      state={{ menu_cat_id: menuItem.menu_cat_id }} // Pass menu_cat_id here
                    >
                      <img
                        src={menuItem.image || images}
                        alt={menuItem.name || "Menu item"}
                        style={{
                          aspectRatio: "1/1",
                          objectFit: "cover",
                          height: "100%",
                        }}
                        onError={(e) => {
                          e.target.src = images;
                        }}
                      />
                    </Link>
                  </div>

                  <div className="dz-content">
                    <div
                      className="detail-content"
                      style={{ position: "relative" }}
                    >
                      <h3>
                        <Link
                          className="product-title fs-xs fw-medium category-text"
                          style={{ color: "#0a795b" }}
                          to={`/ProductDetails/${menuItem.menu_id}`}
                          state={{ menu_cat_id: menuItem.menu_cat_id }} // Pass menu_cat_id here
                        >
                          <i className="ri-restaurant-line pe-1"></i>
                          {categories.find(
                            (category) =>
                              category.menu_cat_id === menuItem.menu_cat_id
                          )?.name || menuItem.category}
                        </Link>
                      </h3>
                      <i
                        className={`${
                          menuItem.is_favourite
                            ? "ri-hearts-fill fs-3 mt-0"
                            : "ri-heart-2-line fs-3 mt-0"
                        }`}
                        onClick={() => handleLikeClick(menuItem.menu_id)}
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0",
                          fontSize: "23px",
                          cursor: "pointer",
                          color: menuItem.is_favourite ? "#fe0809" : "#73757b",
                        }}
                      ></i>
                    </div>

                    {menuItem.name && (
                      <div className="">
                        <Link
                          to={`/ProductDetails/${menuItem.menu_id}`}
                          state={{ menu_cat_id: menuItem.menu_cat_id }} // Pass menu_cat_id here
                          className="custom_font_size_bold text-wrap"
                        >
                          {menuItem.name}
                        </Link>
                      </div>
                    )}
                    {menuItem.spicy_index && (
                      <div className="row">
                        <div className="col-6">
                          <div className="offer-code mt-2">
                            {Array.from({ length: 5 }).map((_, index) =>
                              index < menuItem.spicy_index ? (
                                <i
                                  className="ri-fire-fill fs-6"
                                  key={index}
                                ></i>
                              ) : (
                                <i
                                  className="ri-fire-line fs-6"
                                  style={{ color: "#bbbaba" }}
                                  key={index}
                                ></i>
                              )
                            )}
                          </div>
                        </div>
                        <div className="col-6 text-end mt-2">
                          <i className="ri-star-half-line pe-1 custom_font_size_bold ratingStar"></i>
                          <span className="custom_font_size_bold fw-semibold gray-text">
                            {menuItem.rating}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="row">
                      <div className="col-8">
                        <div className="footer-wrapper">
                          <div className="price-wrapper d-flex align-items-baseline">
                            <Link
                              to={`/ProductDetails/${menuItem.menu_id}`}
                              state={{ menu_cat_id: menuItem.menu_cat_id }} // Pass menu_cat_id here
                            >
                              <p className="mb-1 custom_font_size_bold fw-medium">
                                <span className="ms- me-2 text-info">
                                  ₹{menuItem.price}
                                </span>
                                <span className="gray-text custom_font_size_bold text-decoration-line-through">
                                  ₹{menuItem.oldPrice || menuItem.price}
                                </span>
                              </p>
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="col-4">
                        {userData ? (
                          <div
                            onClick={() => handleAddToCartClick(menuItem)}
                            className="cart-btn text-end"
                          >
                            <i
                              className={`ri-shopping-cart-${
                                isMenuItemInCart(menuItem.menu_id)
                                  ? "fill"
                                  : "line"
                              } fs-2`}
                            ></i>
                          </div>
                        ) : (
                          <i className="ri-shopping-cart-line fs-2"></i>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <span className="custom_font_size_bold offer-color">
                          {menuItem.offer || "No "}% Off
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sort and Filter Buttons */}
        {/* <div
          className="footer fixed"
          style={{ zIndex: 1, position: "fixed", bottom: "70px" }}
        >
          <ul className="dz-product-filter">
            <li>
              <a className="custom_font_size_bold"
                href="javascript:void(0);"
                onClick={() => setSortByOpen(!sortByOpen)}
              >
                <i className="fi fi-rr-arrow-up"></i>Sort
              </a>
            </li>
            <li>
              <a className="custom_font_size_bold"
                href="javascript:void(0);"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <i className="fi fi-rr-filter"></i>Filter
              </a>
            </li>
          </ul>

        
          {sortByOpen && (
            <div
              className="offcanvas offcanvas-bottom p-b60"
              tabIndex="-1"
              id="offcanvasBottom1"
              aria-labelledby="offcanvasBottomLabel1"
            >
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasBottomLabel1">
                  Sort By
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSortByOpen(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body">
                <ul>
                  <li
                    onClick={() => {
                      setSortCriteria("popularity");
                      applySort();
                    }}
                  >
                    Popularity
                  </li>
                  <li
                    onClick={() => {
                      setSortCriteria("discount");
                      applySort();
                    }}
                  >
                    Discount
                  </li>
                  <li
                    onClick={() => {
                      setSortCriteria("priceHighToLow");
                      applySort();
                    }}
                  >
                    Price High to Low
                  </li>
                  <li
                    onClick={() => {
                      setSortCriteria("priceLowToHigh");
                      applySort();
                    }}
                  >
                    Price Low to High
                  </li>
                  <li
                    onClick={() => {
                      setSortCriteria("rating");
                      applySort();
                    }}
                  >
                    Rating
                  </li>
                </ul>
              </div>
            </div>
          )}

          
          {filterOpen && (
            <div
              className="offcanvas offcanvas-bottom p-b60"
              tabIndex="-1"
              id="offcanvasBottom2"
              aria-labelledby="offcanvasBottomLabel2"
            >
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasBottomLabel2">
                  Filters
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setFilterOpen(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body">
                <div className="filter-inner-content">
                  <div className="title-bar">
                    <h5 className="sub-title">Price Range:</h5>
                    <Slider
                      value={priceRange}
                      onChange={(e, newValue) => setPriceRange(newValue)}
                      valueLabelDisplay="auto"
                      min={0}
                      max={2000}
                      step={10}
                    />
                  </div>
                 
                </div>
              </div>
            </div>
          )}
        </div> */}
      </main>

      <Bottom />
    </div>
  );
};

export default Product;
