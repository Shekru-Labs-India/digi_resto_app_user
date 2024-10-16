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
  const [cartItems, setCartItems] = useState(
    () => JSON.parse(localStorage.getItem("cartItems")) || []
  );
  const navigate = useNavigate();
  const { restaurantId } = useRestaurantId();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const customerId = userData ? userData.customer_id : null;

  const [isLoading, setIsLoading] = useState(false);
  const hasFetchedData = useRef(false);
  const swiperRef = useRef(null);
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);

  // Sync cartItems with localStorage
  useEffect(() => {
    localStorage.removeItem("menuItems");
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const fetchMenuData = useCallback(
    async (categoryId) => {
      if (isLoading || hasFetchedData.current) return;
      setIsLoading(true);
      hasFetchedData.current = true;
      try {
        const requestBody = {
          customer_id: customerId,
          restaurant_id: restaurantId,
        };

        const response = await fetch(
          "https://menumitra.com/user_api/get_all_menu_list_by_category",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        const data = await response.json();

        if (response.ok && data.st === 1) {
          if (Array.isArray(data.data.category)) {
            const formattedCategories = data.data.category.map((category) => ({
              ...category,
              name: toTitleCase(category.category_name),
            }));
            setMenuCategories(formattedCategories);
          }

          if (Array.isArray(data.data.menus)) {
            const formattedMenuList = data.data.menus.map((menu) => ({
              ...menu,
              image: menu.image || images,
              category: toTitleCase(menu.category_name),
              name: toTitleCase(menu.menu_name),
              oldPrice: Math.floor(menu.price * 1.1),
              is_favourite: menu.is_favourite === 1,
            }));
            setMenuList(formattedMenuList);
            setTotalMenuCount(formattedMenuList.length);

            if (categoryId === null) {
              setFilteredMenuList(formattedMenuList);
            } else {
              const filteredMenus = formattedMenuList.filter(
                (menu) => menu.menu_cat_id === categoryId
              );
              setFilteredMenuList(filteredMenus);
            }
            localStorage.setItem(
              "menuItems",
              JSON.stringify(formattedMenuList)
            );
          } else {
            setMenuCategories([]);
            setMenuList([]);
            setFilteredMenuList([]);
          }
        } else {
          setMenuCategories([]);
          setMenuList([]);
          setFilteredMenuList([]);
        }
      } catch (error) {
        setMenuCategories([]);
        setMenuList([]);
        setFilteredMenuList([]);
      } finally {
        setIsLoading(false);
      }
    },
    [customerId, restaurantId, isLoading]
  );

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

  const handleLikeClick = async (menuId) => {
    if (!customerId || !restaurantId) {
      console.error("Missing required data");
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
          customer_id: customerId,
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
                item.menu_cat_id === selectedCategoryId ||
                selectedCategoryId === null
            )
          );

          // Show toast notification
          toast.current.show({
            severity: isFavorite ? "error" : "success",
            summary: isFavorite
              ? "Removed from Favourites"
              : "Added to Favourites",
            detail: menuItem.name,
            life: 2000,
            //  position: "bottom-center", // Change this line to set the position
          });
        }
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const [popupVisible, setPopupVisible] = useState(false);

  const handleAddToCartClick = async (menu) => {
    if (!customerId || !restaurantId) {
      console.error("Missing required data");
      navigate("/Signinscreen");
      return;
    }
    if (isMenuItemInCart(menu.menu_id)) {
      // Show toast notification for item already in cart
      toast.current.show({
        severity: "error",
        summary: "Item Already in Cart",
        detail: menu.name,
        life: 2000,
      });
      return;
    }

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
            menu_id: menu.menu_id,
            customer_id: customerId,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.st === 1) {
        const updatedCartItems = [...cartItems, { ...menu, quantity: 1 }];
        setCartItems(updatedCartItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        localStorage.setItem("cartId", data.cart_id);

        // Show toast notification for item added to cart
        toast.current.show({
          severity: "success",
          summary: "Added to Cart",
          detail: menu.name,
          life: 2000,
        });
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
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
                  </div>
                  <div className="dz-content pb-1">
                    <div
                      className="detail-content category-text"
                      style={{ position: "relative" }}
                    >
                      <div className="font_size_12 text-success">
                        <i className="ri-restaurant-line pe-1"></i>
                        {menu.category}
                      </div>
                      <i
                        className={` ${
                          menu.is_favourite
                            ? "ri-hearts-fill text-danger"
                            : "ri-heart-2-line gray-text"
                        } fs-3`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLikeClick(menu.menu_id);
                        }}
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0",
                        }}
                      ></i>
                    </div>
                    {menu.name && (
                      <div className="font_size_14 fw-medium text-wrap">
                        {menu.name}
                      </div>
                    )}
                    {menu.spicy_index && (
                      <div className="row">
                        <div className="col-6">
                          <div className=" mt-2">
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
                          </div>
                        </div>
                        <div className="col-6 text-end mt-2">
                          <i className="ri-star-half-line font_size_14  ratingStar"></i>
                          <span className="font_size_12 fw-normal gray-text">
                            {menu.rating}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="row mt-1">
                      <div className="col-8">
                        <div className="price-wrapper d-flex align-items-baseline">
                          <span className="font_size_14 me-2 text-info fw-semibold">
                            ₹{menu.price}
                          </span>
                          <span className="gray-text text-decoration-line-through font_size_12 fw-normal">
                            ₹{menu.oldPrice || menu.price}
                          </span>
                        </div>
                        <span className="font_size_12 text-success">
                          {menu.offer || "No "}% Off
                        </span>
                      </div>
                      <div className="col-4 text-end">
                        {userData ? (
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAddToCartClick(menu);
                            }}
                          >
                            <i
                              className={`ri-shopping-cart-${
                                isMenuItemInCart(menu.menu_id) ? "fill" : "line"
                              } fs-2 `}
                            ></i>
                          </div>
                        ) : (
                          <i
                            className="ri-shopping-cart-2-line fs-2"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate("/Signinscreen");
                            }}
                          ></i>
                        )}
                      </div>
                    </div>
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
