import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import { useRestaurantId } from "../context/RestaurantIdContext";
import Slider from "@mui/material/Slider"; // Import the Slider component
import Bottom from "../component/bottom";
import Header from "../components/Header";
import HotelNameAndTable from "../components/HotelNameAndTable";
import { useCart } from "../context/CartContext";

import "../assets/css/toast.css";
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
  const [portionSize, setPortionSize] = useState('full');
  const [notes, setNotes] = useState('');
  const [halfPrice, setHalfPrice] = useState(null);
  const [fullPrice, setFullPrice] = useState(null);
  const [isPriceFetching, setIsPriceFetching] = useState(false);

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

  const handleUnauthorizedFavorite = (navigate) => {
    window.showToast("info", "Please login to use favorites functionality");
    setTimeout(() => {
      navigate("/Signinscreen");
    }, 1500);
  };

  // Handle favorites (like/unlike)
  const handleLikeClick = async (menuId) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData?.customer_id || userData.customer_type === 'guest') {
    handleUnauthorizedFavorite(navigate);
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
          window.showToast(
            isFavorite ? "info" : "success",
            isFavorite
              ? "Item has been removed from your favourites."
              : "Item has been added to your favourites."
          );
        }
      }
    } catch (error) {
      console.error("Error updating favourite status:", error);
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

  const fetchHalfFullPrices = async (menuId) => {
    if (!restaurantId) {
      console.error("Restaurant ID is missing");
      return;
    }

    setIsPriceFetching(true);
    try {
      const response = await fetch(
        "https://menumitra.com/user_api/get_full_half_price_of_menu",
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
      } else {
        throw new Error(data.msg || "Failed to fetch price information");
      }
    } catch (error) {
      console.error("Error fetching half/full prices:", error);
      window.showToast("error", "Failed to fetch price information");
    } finally {
      setIsPriceFetching(false);
    }
  };

  // Add item to cart
  const handleAddToCartClick = (menu) => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    // Check if user is logged in or is a guest
    if (!userData?.customer_id ) {
      window.showToast("info", "Please login to add items to cart");
      setTimeout(() => {
        navigate("/Signinscreen");
      }, 1500);
      return;
    }

    if (!restaurantId) {
      window.showToast("error", "Restaurant information is missing");
      return;
    }

    setSelectedMenu(menu);
    setPortionSize('full');
    fetchHalfFullPrices(menu.menu_id);
    setShowModal(true);
  };

  const handleConfirmAddToCart = async () => {
    if (!selectedMenu) return;

    const selectedPrice = portionSize === 'half' ? halfPrice : fullPrice;
    
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

      await addToCart({
        ...selectedMenu,
        quantity: 1,
        notes,
        half_or_full: portionSize,
        price: selectedPrice,
        restaurant_id: restaurantId
      }, restaurantId);

      window.showToast("success", `${selectedMenu.name} added to cart`);

      setShowModal(false);
      setNotes('');
      setPortionSize('full');
      setSelectedMenu(null);
      
      window.dispatchEvent(new Event('cartUpdated'));

    } catch (error) {
      console.error("Error adding item to cart:", error);
      window.showToast(
        "error", 
        error.message || "Failed to add item to cart. Please try again."
      );
    }
  };

  const handleModalClick = (e) => {
    if (e.target.classList.contains('modal')) {
      setShowModal(false);
    }
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
        <div className="container mb-5 pt-0 pb-5">
          <div className="row g-3 grid-style-1 pb-5">
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
                            menuItem.is_favourite
                              ? "ri-heart-3-fill text-danger"
                              : "ri-heart-3-line"
                          } fs-6`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleLikeClick(menuItem.menu_id);
                          }}
                        ></i>
                      </div>
                      <div
                        className={`border bg-white opacity-75 d-flex justify-content-center align-items-center ${
                          menuItem.menu_veg_nonveg.toLowerCase() === "veg"
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
                            menuItem.menu_veg_nonveg.toLowerCase() === "veg"
                              ? "ri-checkbox-blank-circle-fill text-success"
                              : "ri-checkbox-blank-circle-fill text-danger"
                          } font_size_12`}
                        ></i>
                      </div>
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
                          
                            <span className="font_size_10 text-white">
                            <i className="ri-percent-line me-1 font_size_14"></i>
                              {menuItem.offer}% Off
                            </span>
                          
                        </div>
                      )}
                    </div>

                    <div className="dz-content pb-1">
                      <div className="detail-content" style={{ position: "relative" }}>
                        {menuItem.is_special && (
                          <div className="row">
                            <div className="col-12 text-success text-center font_size_12 fw-medium my-1 py-0 mx-0 px-0">
                              Special
                              <hr className="mt-2 mb-0" />
                            </div>
                          </div>
                        )}
                        <div className="row">
                          <div className="col-6">
                            <div className="fw-medium text-success font_size_10">
                              <i className="ri-restaurant-line pe-1"></i>
                              {categories.find(
                                (category) =>
                                  category.menu_cat_id === menuItem.menu_cat_id
                              )?.name || menuItem.category}
                            </div>
                          </div>
                          <div className="col-6 text-end">
                            <i className="ri-star-half-line font_size_10 ratingStar"></i>
                            <span className="font_size_10 fw-normal gray-text">
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
                                window.showToast("info", "Please login to add items to cart");
                                setTimeout(() => {
                                  navigate("/Signinscreen");
                                }, 1500);
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
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
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
                    className="form-control fs-6 border border-primary rounded-3"
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
                  <i class="ri-shopping-cart-line pe-1 text-white"></i>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}

      <Bottom />
    </div>
  );
};

export default Product;
