import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import images from "../assets/MenuDefault.png";
import Swiper from "swiper";
import { debounce } from "lodash";
import NearbyArea from "./NearbyArea";
import Signinscreen from "./../screens/Signinscreen";
import LoaderGif from "../screens/LoaderGIF";
import { Toast } from "primereact/toast";
import { useCart } from "../context/CartContext";

import "primereact/resources/themes/saga-blue/theme.css"; // Choose a theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

// Convert strings to Title Case
const toTitleCase = (text) => {
  if (!text) return "";
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

const ProductCard = () => {
  const [menuList, setMenuList] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [totalMenuCount, setTotalMenuCount] = useState(0);
  const [filteredMenuList, setFilteredMenuList] = useState([]);

  const navigate = useNavigate();
  const { restaurantId } = useRestaurantId();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const { cartItems, addToCart, removeFromCart } = useCart();
  const [customerId, setCustomerId] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const hasFetchedData = useRef(false);
  const swiperRef = useRef(null);
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setCustomerId(storedUserData.customer_id);
    }
  }, []);

  const fetchMenuData = useCallback(async (categoryId) => {
    if (!customerId || !restaurantId) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://menumitra.com/user_api/get_all_menu_list_by_category",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customer_id: customerId, restaurant_id: restaurantId }),
        }
      );

      const data = await response.json();

      if (response.ok && data.st === 1) {
        const formattedCategories = data.data.category.map((category) => ({
          ...category,
          name: toTitleCase(category.category_name),
        }));
        setMenuCategories(formattedCategories);

        const formattedMenuList = data.data.menus.map((menu) => ({
          ...menu,
          image: menu.image || images,
          category: toTitleCase(menu.category_name),
          name: toTitleCase(menu.menu_name),
          oldPrice: menu.offer ? menu.price : null,
          price: menu.offer ? Math.floor(menu.price * (1 - menu.offer / 100)) : menu.price,
          is_favourite: menu.is_favourite === 1,
        }));
        setMenuList(formattedMenuList);
        setTotalMenuCount(formattedMenuList.length);

        const filteredMenus = categoryId === null
          ? formattedMenuList
          : formattedMenuList.filter((menu) => menu.menu_cat_id === categoryId);
        setFilteredMenuList(filteredMenus);
      } else {
        setMenuCategories([]);
        setMenuList([]);
        setFilteredMenuList([]);
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
      setMenuCategories([]);
      setMenuList([]);
      setFilteredMenuList([]);
    } finally {
      setIsLoading(false);
    }
  }, [customerId, restaurantId]);

  useEffect(() => {
    if (customerId && restaurantId) {
      fetchMenuData(null);
    }
  }, [customerId, restaurantId, fetchMenuData]);

  useEffect(() => {
    const handleFavoritesUpdated = () => {
      fetchMenuData(selectedCategoryId);
    };

    window.addEventListener('favoritesUpdated', handleFavoritesUpdated);
    window.addEventListener('focus', handleFavoritesUpdated);

    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
      window.removeEventListener('focus', handleFavoritesUpdated);
    };
  }, [fetchMenuData, selectedCategoryId]);

  const debouncedFetchMenuData = useCallback(
    debounce((categoryId) => {
      fetchMenuData(categoryId);
    }, 300),
    [fetchMenuData]
  );

  useEffect(() => {
    if (restaurantId) {
      debouncedFetchMenuData(null);
      setSelectedCategoryId(null);
    }
  }, [restaurantId, debouncedFetchMenuData]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
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
    if (menuCategories.length > 0) {
      swiperRef.current = new Swiper(".category-slide", {
        slidesPerView: "auto",
        spaceBetween: 10,
      });

      // Add scroll event listener
      const swiperContainer = document.querySelector(".category-slide");
      swiperContainer.addEventListener("scroll", () => {
        if (swiperContainer.scrollLeft === 0) {
          handleCategorySelect(menuCategories[0].menu_cat_id);
        }
      });
    }
  }, [menuCategories]);

  const handleLikeClick = async (e, menuId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData || !userData.customer_id || !restaurantId) {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          menu_id: menuId,
          customer_id: userData.customer_id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1) {
          const updatedFavoriteStatus = !isFavorite;
          const updatedMenuList = menuList.map((item) =>
            item.menu_id === menuId ? { ...item, is_favourite: updatedFavoriteStatus } : item
          );
          setMenuList(updatedMenuList);
          setFilteredMenuList(updatedMenuList.filter(
            (item) => item.menu_cat_id === selectedCategoryId || selectedCategoryId === null
          ));

          toast.current.show({
            severity: updatedFavoriteStatus ? "success" : "info",
            summary: updatedFavoriteStatus ? "Added to Favorites" : "Removed from Favorites",
            detail: updatedFavoriteStatus
              ? "Item has been added to your favorites."
              : "Item has been removed from your favorites.",
            life: 2000,
          });
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

  const handleAddToCartClick = async (menu) => {
    if (!customerId || !restaurantId) {
      console.error("Missing required data");
      navigate("/Signinscreen");
      return;
    }
  
    try {
      if (isMenuItemInCart(menu.menu_id)) {
        // Remove from cart
        await removeFromCart(menu.menu_id, customerId, restaurantId);
        toast.current.show({
          severity: "info",
          summary: "Removed from Cart",
          detail: menu.name,
          life: 3000,
        });
      } else {
        // Add to cart
        await addToCart(menu, customerId, restaurantId);
        toast.current.show({
          severity: "success",
          summary: "Added to Cart",
          detail: menu.name,
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update cart. Please try again.",
        life: 3000,
      });
    }
  };

  const isMenuItemInCart = (menuId) => {
    return cartItems.some((item) => item.menu_id === menuId);
  };

  if (isLoading || menuList.length === 0) {
    return (
      <div id="preloader">
        <div className="loader">
          <LoaderGif />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toast ref={toast} position="bottom-center" className="custom-toast" />
      <div className="mb-2">
        {menuCategories && menuCategories.length > 0 && (
          <div className="title-bar">
            <span className=" font_size_14 fw-medium">Menu</span>
            <Link to="/Category">
              <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
        )}
        <div className="swiper category-slide">
          <div className="swiper-wrapper">
            {totalMenuCount > 0 && menuCategories.length > 0 && (
              <div
                className={`category-btn font_size_14 border border-2 rounded-5 swiper-slide     ${
                  selectedCategoryId === null ? "active" : ""
                }`}
                onClick={() => handleCategorySelect(null)}
                style={{
                  backgroundColor: selectedCategoryId === null ? "#0D775E" : "",
                  color: selectedCategoryId === null ? "#ffffff" : "",
                }}
              >
                All{" "}
                <span className="small-number gray-text">
                  ({totalMenuCount})
                </span>
              </div>
            )}

            {menuCategories.map((category) => (
              <div key={category.menu_cat_id} className="swiper-slide">
                <div
                  className={`category-btn font_size_14 border border-2 rounded-5     ${
                    selectedCategoryId === category.menu_cat_id ? "active" : ""
                  }`}
                  onClick={() => handleCategorySelect(category.menu_cat_id)}
                  style={{
                    backgroundColor:
                      selectedCategoryId === category.menu_cat_id
                        ? "#0D775E"
                        : "",
                    color:
                      selectedCategoryId === category.menu_cat_id
                        ? "#ffffff"
                        : "",
                  }}
                >
                  {category.name}{" "}
                  <span className="small-number gray-text">
                    ({category.menu_count})
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
              <div className="card-item style-6 style-6-1 rounded-3">
                <Link
                  to={`/ProductDetails/${menu.menu_id}`}
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
                      className=""
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "fill",
                        aspectRatio: 1,
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
                          menu.is_favourite
                            ? "ri-hearts-fill text-danger"
                            : "ri-heart-2-line"
                        } fs-6`}
                        onClick={(e) => handleLikeClick(e, menu.menu_id)}
                      ></i>
                    </div>

                    {menu.offer !== 0 && (
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
                            {menu.offer}% Off
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="dz-content pb-1">
                    <div className="detail-content category-text">
                      <div className="font_size_12 ">
                        <div className="row">
                          <div className="col-8 text-success">
                            <i className="ri-restaurant-line pe-1"></i>
                            <span className="font_size_10">
                              {menu.category}
                            </span>
                          </div>
                          <div className="col-4 text-end pe-2 d-flex justify-content-end align-items-center">
                            <i className="ri-star-half-line font_size_14 ratingStar me-1"></i>
                            <span className="font_size_12 fw-normal gray-text mt-1">
                              {menu.rating}
                            </span>
                          </div>
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
                                  className="ri-fire-fill text-danger font_size_14"
                                  key={index}
                                ></i>
                              ) : (
                                <i
                                  className="ri-fire-line font_size_14 gray-text"
                                  key={index}
                                ></i>
                              )
                            )}
                            <div className="price-wrapper d-flex align-items-baseline mt-1">
                              <span className="font_size_14 me-2 text-info fw-semibold">
                                ₹{menu.price}
                              </span>
                              {menu.oldPrice !== 0 && menu.oldPrice !== null && (
                                <span className="gray-text text-decoration-line-through font_size_12 fw-normal">
                                  ₹{menu.oldPrice}
                                </span>
                              )}
                             
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
                                handleAddToCartClick(menu);
                              }}
                            >
                              <i
                                className={`ri-shopping-cart-${
                                  isMenuItemInCart(menu.menu_id)
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
    </div>
  );
};

export default ProductCard;
