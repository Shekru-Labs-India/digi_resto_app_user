import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import { Link } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import Slider from "@mui/material/Slider";
import { debounce } from 'lodash'; // Make sure to install lodash if not already installed
import Bottom from "../component/bottom";

const Product = () => {
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
  const [favoriteCats, setFavoriteCats] = useState([]);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const { restaurantId } = useRestaurantId();
  const [sortCriteria, setSortCriteria] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const initialFetchDone = useRef(false);

  const toTitleCase = (text) => {
    if (!text) return "";
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  };
  

  const fetchMenuData = useCallback(async () => {
    console.log("fetchMenuData called"); // Add this line
    if (!restaurantId || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://menumitra.com/user_api/get_product_list",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            cat_id: "all",
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch menu data");
      }

      const data = await response.json();

      if (data.st === 1) {
        const formattedMenuList = data.MenuList.map((menuItem) => ({
          ...menuItem,
          name: toTitleCase(menuItem.name || ""),
          category: toTitleCase(menuItem.menu_cat_name || ""),
          oldPrice: Math.floor(menuItem.price * 1.1),
          is_favourite: menuItem.is_favourite === 1,
        }));

        setMenuList(formattedMenuList);
        localStorage.setItem("menuItems", JSON.stringify(formattedMenuList));

        const formattedCategories = data.MenuCatList.map((category) => ({
          ...category,
          name: toTitleCase(category.name || ""),
        }));

        setCategories(formattedCategories);
        const counts = { All: formattedMenuList.length };
        formattedMenuList.forEach((item) => {
          counts[item.category] = (counts[item.category] || 0) + 1;
        });
        setCategoryCounts(counts);
        setFilteredMenuList(formattedMenuList);
      } else {
        throw new Error("API request unsuccessful");
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId, isLoading]);

  const fetchFavorites = useCallback(async () => {
    if (!userData || !restaurantId || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://menumitra.com/user_api/get_favourite_list",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: userData.customer_id,
            restaurant_id: restaurantId,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1 && data.lists) {
          setFavorites(data.lists);
        }
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId, userData]);

  useEffect(() => {
    let isMounted = true;
    console.log("useEffect triggered");
    if (restaurantId && !isLoading && !initialFetchDone.current && isMounted) {
      console.log("Fetching menu data");
      fetchMenuData();
      initialFetchDone.current = true;
    }
    return () => {
      isMounted = false;
    };
  }, [restaurantId, isLoading, fetchMenuData]);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItemsCount(cartItems.length);
  }, []);

  

  const handleLikeClick = async (menuId) => {
    if (!userData || !restaurantId) return;

    const isFavorite = favorites.some((fav) => fav.menu_id === menuId);
    const apiUrl = isFavorite
      ? "https://menumitra.com/user_api/delete_favourite_menu"
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
          if (isFavorite) {
            setFavorites(favorites.filter((fav) => fav.menu_id !== menuId));
          } else {
            const menuItem = menuList.find((item) => item.menu_id === menuId);
            setFavorites([...favorites, menuItem]);
          }
        }
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const handleAddToCartClick = (menuItem) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const isAlreadyInCart = cartItems.some(
      (item) => item.menu_id === menuItem.menu_id
    );

    if (isAlreadyInCart) {
      alert("This item is already in the cart!");
      return;
    }

    const cartItem = {
      image: menuItem.image,
      name: menuItem.name,
      price: menuItem.price,
      oldPrice: menuItem.oldPrice,
      quantity: 1,
      menu_id: menuItem.menu_id,
    };

    const updatedCartItems = [...cartItems, cartItem];
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setCartItemsCount(updatedCartItems.length);
    navigate("/Cart");
  };

  const isMenuItemInCart = (menuId) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    return cartItems.some((item) => item.menu_id === menuId);
  };

  const handleCategoryFilter = (categoryName) => {
    if (categoryName === selectedCategory) {
      setSelectedCategory(null);
      setFilteredMenuList(menuList);
    } else {
      setSelectedCategory(categoryName);
      const filteredItems = menuList.filter(
        (item) =>
          toTitleCase(item.menu_cat_name || "") ===
          toTitleCase(categoryName || "")
      );
      setFilteredMenuList(filteredItems);
    }
  };

  const handleSort = (criteria) => {
    setSortCriteria(criteria);
  };

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
    setSortByOpen(false);
  };

  const handlePriceFilter = () => {
    const filteredItems = menuList.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    setFilteredMenuList(filteredItems);
    setFilterOpen(false);
  };

  const toggleFavoriteCategory = (categoryName) => {
    setFavoriteCats((prev) =>
      prev.includes(categoryName)
        ? prev.filter((cat) => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const debouncedHandleSort = useCallback(
    debounce((criteria) => {
      setSortCriteria(criteria);
      applySort();
    }, 300),
    []
  );

  const debouncedHandlePriceFilter = useCallback(
    debounce(() => {
      handlePriceFilter();
    }, 300),
    [priceRange, menuList]
  );

  return (
    <div className={`page-wrapper ${sortByOpen || filterOpen ? "open" : ""}`}>
      <header className="header header-fixed style-3 ">
        <div className="header-content">
          <div className="left-content">
            <div
              className="back-btn dz-icon icon-fill icon-sm"
              onClick={() => navigate(-1)}
            >
              <i className="ri-arrow-left-line"></i>
            </div>
          </div>
          <div className="mid-content">
            <h5 className="title">Menu</h5>
          </div>
          <div className="right-content">
            <Link
              to="/Cart"
              className="ri-shopping-cart-2-line"
              style={{ fontSize: "25px" }}
            >
              {userData && (
                <span className="badge badge-danger">{cartItemsCount}</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main
        className={`page-content space-top p-b80 ${
          sortByOpen || filterOpen ? "open" : ""
        }`}
      >
        <div
          className={`container pb-0 ${sortByOpen || filterOpen ? "open" : ""}`}
        >
          <div className="swiper category-slide">
            <div className="swiper-wrapper">
              <div
                className={`category-btn swiper-slide ${
                  selectedCategory === null ? "active" : ""
                }`}
                onClick={() => handleCategoryFilter(null)}
                style={{
                  backgroundColor: selectedCategory === null ? "#0D775E" : "",
                  color: selectedCategory === null ? "#ffffff" : "",
                }}
              >
                All ({categoryCounts.All})
              </div>
              {categories.map((category) => (
                <div key={category.menu_cat_id} className="swiper-slide">
                  <div
                    className={`category-btn ${
                      selectedCategory === category.name ? "active" : ""
                    }`}
                    onClick={() => handleCategoryFilter(category.name)}
                    style={{
                      backgroundColor:
                        selectedCategory === category.name ? "#0D775E" : "",
                      color:
                        selectedCategory === category.name ? "#ffffff" : "",
                    }}
                  >
                    {category.name} ({categoryCounts[category.name] || 0})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container pb-0">
          <div className="row g-3 grid-style-1">
            {filteredMenuList.map((menuItem) => (
              <div key={menuItem.menu_id} className="col-6">
                <div className="card-item style-6">
                  <div className="dz-media">
                    <Link to={`/ProductDetails/${menuItem.menu_id}`}>
                      <img
                        src={menuItem.image || images}
                        alt={menuItem.name || "Menu item"}
                        style={{ height: "150px" }}
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
                      <h3 className="product-title">
                        <i
                          className="ri-restaurant-line"
                          style={{ paddingRight: "5px" }}
                        ></i>
                        {categories.find(category => category.menu_cat_id === menuItem.menu_cat_id)?.name || menuItem.category}
                      </h3>

                      {userData ? (
                        <i
                          className={`ri-heart-${
                            favorites.some(
                              (fav) => fav.menu_id === menuItem.menu_id
                            )
                              ? "fill"
                              : "line"
                          }`}
                          onClick={() => handleLikeClick(menuItem.menu_id)}
                          style={{
                            position: "absolute",
                            top: "0",
                            right: "0",
                            fontSize: "23px",
                            cursor: "pointer",
                            color: "red",
                          }}
                        ></i>
                      ) : (
                        <i
                          className="ri-heart-line"
                          style={{
                            position: "absolute",
                            top: "0",
                            right: "0",
                            fontSize: "23px",
                            cursor: "pointer",
                          }}
                        ></i>
                      )}
                    </div>

                    <h4 className="item-name">{menuItem.name}</h4>
                    <div className="offer-code">
                      {Array.from({ length: 5 }).map((_, index) =>
                        index < menuItem.spicy_index ? (
                          <i
                            className="ri-fire-fill"
                            style={{ fontSize: "12px" }}
                            key={index}
                          ></i>
                        ) : (
                          <i
                            className="ri-fire-line"
                            style={{ fontSize: "12px", color: "#0000001a" }}
                            key={index}
                          ></i>
                        )
                      )}
                    </div>
                    <div className="footer-wrapper">
                      <div className="price-wrapper">
                        <h6 className="current-price">₹{menuItem.price}</h6>
                        <span className="old-price">₹{menuItem.oldPrice}</span>
                      </div>
                      {userData ? (
                        <div
                          onClick={() => handleAddToCartClick(menuItem)}
                          className="cart-btn"
                        >
                          {isMenuItemInCart(menuItem.menu_id) ? (
                            <i
                              className="ri-shopping-cart-2-fill"
                              style={{ fontSize: "25px" }}
                            ></i>
                          ) : (
                            <i
                              className="ri-shopping-cart-2-line"
                              style={{ fontSize: "25px" }}
                            ></i>
                          )}
                        </div>
                      ) : (
                        <i
                          className="ri-shopping-cart-2-line"
                          style={{ fontSize: "25px" }}
                        ></i>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Sort and Filter Footer */}
      <div className="footer fixed">
        <ul className="dz-product-filter">
          <li>
            <a
              href="javascript:void(0);"
              onClick={() => setSortByOpen(!sortByOpen)}
            >
              <i className="ri-arrow-up-line"></i>Sort
            </a>
          </li>
          <li>
            <a
              href="javascript:void(0);"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <i className="ri-equalizer-3-line"></i>Filter
            </a>
          </li>
        </ul>

        {sortByOpen && (
          <div
            className="offcanvas offcanvas-bottom p-b60 show "
            tabIndex="-1"
            id="offcanvasBottom1"
          >
            <div className="offcanvas-header d-flex justify-content-center align-items-center">
              <h4 className="offcanvas-title text-center">Sort By</h4>
              <button
                type="button"
                className="btn-close style-2"
                onClick={() => setSortByOpen(!sortByOpen)}
                aria-label="Close"
                style={{ position: 'absolute', right: '15px' }}
              >
                <i className="ri-close-line" style={{ fontSize: "18px" }}></i>
              </button>
            </div>
            <div className="offcanvas-body">
              <div className="dz-sorting">
                <ul className="list-unstyled mb-0">
                  {[
                    {
                      key: "discount",
                      icon: "ri-discount-percent-line",
                      label: "Discount",
                    },
                    {
                      key: "priceHighToLow",
                      icon: "ri-arrow-up-line",
                      label: "Price High to Low",
                    },
                    {
                      key: "priceLowToHigh",
                      icon: "ri-arrow-down-line",
                      label: "Price Low to High",
                    },
                  ].map(({ key, icon, label }) => (
                    <li
                      key={key}
                      className={`sort-item ${
                        sortCriteria === key ? "active" : ""
                      }`}
                      onClick={() => debouncedHandleSort(key)}
                      style={{
                        backgroundColor:
                          sortCriteria === key ? "#0D775E" : "transparent",
                        color: sortCriteria === key ? "#ffffff" : "inherit",
                        padding: "10px 15px",
                        borderRadius: "8px",
                        marginBottom: "10px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <i
                        className={`${icon} me-2`}
                        style={{ fontSize: "18px" }}
                      ></i>
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="d-flex justify-content-between mt-4">
                <button
                  onClick={() => setSortByOpen(false)}
                  className="btn btn-outline-secondary w-45 rounded-xl"
                  style={{ borderColor: "#0D775E", color: "#0D775E" }}
                >
                  Cancel
                </button>
                <button
                  onClick={applySort}
                  className="btn btn-primary w-45 rounded-xl"
                  style={{ backgroundColor: "#0D775E", borderColor: "#0D775E" }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {filterOpen && (
          <div
            className="offcanvas offcanvas-bottom p-b60 show "
            tabIndex="-1"
            id="offcanvasBottom2"
          >
            <div className="offcanvas-header">
              <div className="d-flex justify-content-center align-items-center" style={{ flex: 1 }}>
                <h4 className="offcanvas-title m-0">Filters</h4>
              </div>
              <button
                type="button"
                className="btn-close style-2"
                onClick={() => setFilterOpen(!filterOpen)}
                aria-label="Close"
              >
                <i className="ri-close-line" style={{ fontSize: "18px" }}></i>
              </button>
            </div>
            <div className="offcanvas-body">
              <div className="swiper category-slide">
                <h5 className="sub-title">Category</h5>
                <div className="swiper-wrapper">
                  {categories.map((category) => (
                    <div key={category.menu_cat_id} className="swiper-slide">
                      <div
                        className={`category-btn ${
                          selectedCategory === category.name ? "active" : ""
                        }`}
                        onClick={() => handleCategoryFilter(category.name)}
                        style={{
                          backgroundColor:
                            selectedCategory === category.name ? "#0D775E" : "",
                          color:
                            selectedCategory === category.name ? "#ffffff" : "",
                        }}
                      >
                        {category.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="filter-inner-content">
                <h5 className="sub-title">Price</h5>
                <div className="title-bar">
                  <div
                    className="price-range-slider"
                    style={{
                      width: "100%",
                      padding: "0 20px",
                      marginBottom: "20px",
                    }}
                  >
                    <Slider
                      value={priceRange}
                      onChange={handlePriceChange}
                      valueLabelDisplay="auto"
                      min={100}
                      max={1000}
                      sx={{
                        color: "#0D775E",
                        width: "100%",
                        "& .MuiSlider-thumb": {
                          backgroundColor: "#0D775E",
                          border: "2px solid #0D775E",
                        },
                        "& .MuiSlider-rail": {
                          height: 4,
                          backgroundColor: "#9ec8be",
                        },
                        "& .MuiSlider-track": {
                          height: 4,
                        },
                      }}
                    />
                    <div
                      className="price-labels"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "10px",
                      }}
                    >
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                <div
                  className="filter-buttons"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    width: "100%",
                    padding: "0 20px",
                  }}
                >
                  <button
                    onClick={debouncedHandlePriceFilter}
                    className="apply-btn"
                    style={{
                      padding: "12px 20px",
                      backgroundColor: "#0D775E",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      width: "100%",
                      fontWeight: "bold",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => setPriceRange([100, 1000])}
                    className="reset-btn"
                    style={{
                      padding: "12px 20px",
                      backgroundColor: "#f0f0f0",
                      color: "#333",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      width: "100%",
                      fontWeight: "bold",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {sortByOpen || filterOpen ? (
        <div className="offcanvas-backdrop fade show"></div>
      ) : null}

      <Bottom />
    </div>
  );
};

export default Product;
