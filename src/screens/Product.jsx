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
import Header from "../components/Header";
import HotelNameAndTable from "../components/HotelNameAndTable";
import { useCart } from "../context/CartContext";
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

  const { cartItems, addToCart } = useCart();
  const [cartItemsCount, setCartItemsCount] = useState(cartItems.length);

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

  // Handle favorites (like/unlike)
  const handleLikeClick = async (menuId) => {
    if (!userData || !userData.customer_id) {
      navigate("/Signinscreen");
      return;
    }

    if (!restaurantId) return;

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
            life: 2000,
          });
        }
      }
    } catch (error) {
      console.error("Error updating favourite status:", error);
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
    if (selectedCategory) {
      const filtered = menuList.filter(
        (item) => item.menu_cat_id === selectedCategory
      );
      setFilteredMenuList(filtered);
    } else {
      setFilteredMenuList(menuList);
    }
  }, [selectedCategory, menuList]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    if (swiperRef.current) {
      const activeIndex = categoryId
        ? categories.findIndex(
            (category) => category.menu_cat_id === categoryId
          )
        : 0;
      if (activeIndex !== -1) {
        swiperRef.current.slideTo(activeIndex);
      }
    }
  };

  const isMenuItemInCart = (menuItemId) => {
    return cartItems.some((item) => item.menu_id === menuItemId);
  };

  // Add item to cart
  const handleAddToCartClick = async (menuItem) => {
    if (!userData || !userData.customer_id) {
      navigate("/Signinscreen");
      return;
    }

    try {
      await addToCart(menuItem, userData.customer_id, restaurantId);
      setCartItemsCount(cartItems.length + 1);
      toast.current.show({
        severity: "success",
        summary: "Added to Cart",
        detail: "Item has been added to your cart.",
        life: 2000,
      });
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

  // Check if a menu item is in the cart

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
          <div className="swiper category-slide">
            <div className="swiper-wrapper">
              <div
                className={`category-btn border border-2 rounded-5 swiper-slide     ${
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
                  ({menuList.length})
                </span>
              </div>
              {categories.map((category) => (
                <div
                  key={category.menu_cat_id}
                  className={`category-btn border border-2 rounded-5 swiper-slide     ${
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
                  {category.category_name}{" "}
                  <span className="small-number gray-text">
                    ({category.menu_count})
                  </span>
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
                  <Link
                    to={`/ProductDetails/${menuItem.menu_id}`}
                    state={{ menu_cat_id: menuItem.menu_cat_id }}
                    className="card-link"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "block",
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
                        onError={(e) => {
                          e.target.src = images;
                        }}
                      />
                      {menuItem.offer !== 0 && (
                        <div
                          className="gradient_bg d-flex justify-content-center align-items-center"
                          style={{
                            position: "absolute",
                            top: "-1px",
                            left: "0px",
                            height: "17px",
                            width: "70px",
                            borderRadius: "0px 0px 7px 0px",
                          }}
                        >
                          <span className="text-white">
                            <i className="ri-discount-percent-line me-1 font_size_14"></i>
                            <span className="font_size_10">
                              {menuItem.offer}% Off
                            </span>
                          </span>
                        </div>
                      )}
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
                            menuItem.is_favourite
                              ? "ri-hearts-fill text-danger"
                              : "ri-heart-2-line"
                          } fs-6`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleLikeClick(menuItem.menu_id);
                          }}
                        ></i>
                      </div>
                    </div>

                    <div className="dz-content pb-1">
                      <div
                        className="detail-content"
                        style={{ position: "relative" }}
                      >
                        <div className="row">
                          <div className="col-6">
                            <div className="fw-medium text-success font_size_12">
                              <i className="ri-restaurant-line pe-1"></i>
                              {categories.find(
                                (category) =>
                                  category.menu_cat_id === menuItem.menu_cat_id
                              )?.name || menuItem.category}
                            </div>
                          </div>
                          <div className="col-6 text-end">
                            <i className="ri-star-half-line font_size_14 ratingStar"></i>
                            <span className="font_size_12 fw-normal gray-text">
                              {menuItem.rating}
                            </span>
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
                                    className="ri-fire-fill text-danger font_size_14"
                                    key={index}
                                  ></i>
                                ) : (
                                  <i
                                    className="ri-fire-line gray-text font_size_14"
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
                              <p className="mb-1 fs-5 fw-semibold text-info">
                                <span className="ms- me-2 text-info">
                                  ₹{menuItem.price}
                                </span>
                              </p>
                              <span className="gray-text text-decoration-line-through fs-6 fw-normal">
                                ₹{menuItem.oldPrice || menuItem.price}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="col-3 d-flex justify-content-end align-items-end mb-1 pe-2 ps-0">
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
                                className={`ri-shopping-cart-${
                                  isMenuItemInCart(menuItem.menu_id)
                                    ? "fill"
                                    : "line"
                                } fs-6 `}
                              ></i>
                            </div>
                          ) : (
                            <div
                              style={{
                                border: "1px solid gray",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "25px",
                                height: "25px",
                              }}
                            >
                              <i className="ri-shopping-cart-2-line fs-6"></i>
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
        </div>
      </main>

      <Bottom />
    </div>
  );
};

export default Product;
