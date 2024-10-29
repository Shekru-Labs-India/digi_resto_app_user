import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import images from "../assets/MenuDefault.png";
import Swiper from "swiper";
import { debounce } from "lodash";
import NearbyArea from "./NearbyArea";
import Signinscreen from "./../screens/Signinscreen";
import LoaderGif from "../screens/LoaderGIF";
import { useCart } from "../context/CartContext";
import { getUserData, getRestaurantData } from "../utils/userUtils";

import "primereact/resources/themes/saga-blue/theme.css"; // Choose a theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

// Convert strings to Title Case
const toTitleCase = (text) => {
  if (!text) return "";
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
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
  const hasFetchedData = useRef(false);
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
  const [customerId, setCustomerId] = useState(null);
  const [customerType, setCustomerType] = useState(null);

  // Update the filtering logic
  const applyFilters = useCallback((menus, categoryId, vegOnly) => {
    let filteredMenus = [...menus];

    if (vegOnly) {
      filteredMenus = filteredMenus.filter(
        (menu) => menu.menu_veg_nonveg.toLowerCase() === "veg"
      );
    }

    if (categoryId !== null) {
      filteredMenus = filteredMenus.filter(
        (menu) => menu.menu_cat_id === categoryId
      );
    }

    setFilteredMenuList(filteredMenus);
    setTotalMenuCount(filteredMenus.length);

    // Update category counts
    const menuCountByCategory = filteredMenus.reduce((acc, menu) => {
      acc[menu.menu_cat_id] = (acc[menu.menu_cat_id] || 0) + 1;
      return acc;
    }, {});

    setMenuCategories((prevCategories) =>
      prevCategories.map((category) => ({
        ...category,
        menu_count: menuCountByCategory[category.menu_cat_id] || 0,
      }))
    );
  }, []);

  useEffect(() => {
    if (menuList.length > 0) {
      applyFilters(menuList, selectedCategoryId, isVegOnly);
    }
  }, [applyFilters, isVegOnly, menuList, selectedCategoryId]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    applyFilters(menuList, categoryId, isVegOnly);
  };

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData && storedUserData.customer_id) {
      setCustomerId(storedUserData.customer_id);
    }
  }, []);

  useEffect(() => {
    const storedCustomerId = localStorage.getItem("customer_id");
    const storedCustomerType = localStorage.getItem("customer_type");
    if (storedCustomerId && storedCustomerType) {
      setCustomerId(storedCustomerId);
      setCustomerType(storedCustomerType);
    }
  }, []);

  const fetchMenuData = useCallback(
    async (categoryId) => {
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      const currentCustomerId = storedUserData
        ? storedUserData.customer_id
        : null;
      const currentRestaurantId =
        restaurantId || localStorage.getItem("restaurantId");

      if (!currentRestaurantId) {
        console.log("Missing restaurantId:", { currentRestaurantId });
        return;
      }
      setIsLoading(true);
      try {
        console.log("Fetching menu data...");
        const response = await fetch(
          "https://menumitra.com/user_api/get_all_menu_list_by_category",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customer_id: currentCustomerId,
              restaurant_id: currentRestaurantId,
            }),
          }
        );

        const data = await response.json();
        console.log("API response:", data);

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

          const formattedCategories = data.data.category.map((category) => ({
            ...category,
            name: toTitleCase(category.category_name),
          }));
          setMenuCategories(formattedCategories);

          applyFilters(formattedMenuList, categoryId, isVegOnly);
        }
      } catch (error) {
        console.error("Error fetching menu data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [applyFilters, isVegOnly, restaurantId]
  );

  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  useEffect(() => {
    const handleFavoritesUpdated = () => {
      fetchMenuData(selectedCategoryId);
    };

    window.addEventListener("favoritesUpdated", handleFavoritesUpdated);
    window.addEventListener("focus", handleFavoritesUpdated);

    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdated);
      window.removeEventListener("focus", handleFavoritesUpdated);
    };
  }, [fetchMenuData, selectedCategoryId]);

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

  const handleUnauthorizedFavorite = (navigate) => {
  window.showToast("info", "Please login to use favorites functionality");
  setTimeout(() => {
    navigate("/Signinscreen");
  }, 1500);
};

  const handleLikeClick = async (e, menuId) => {
    e.preventDefault();
    e.stopPropagation();

    const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData?.customer_id || userData.customer_type === 'guest') {
    handleUnauthorizedFavorite(navigate);
    return;
  }

    const menuItem = menuList.find((item) => item.menu_id === menuId);
    const isFavorite = menuItem.is_favourite;

    try {
      const response = await fetch(
        `https://menumitra.com/user_api/${isFavorite ? 'remove' : 'save'}_favourite_menu`,
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
            updatedFavoriteStatus ? "Item has been added to your favorites." : "Item has been removed from your favorites."
          );
        } else {
          console.error("Failed to update favorite status:", data.msg);
          window.showToast("error", "Failed to update favorite status");
        }
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
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
        "https://menumitra.com/user_api/get_full_half_price_of_menu",
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
        console.error("API Error:", data.msg);
        window.showToast("error", data.msg || "Failed to fetch price information");
      }
    } catch (error) {
      console.error("Error fetching half/full prices:", error);
      window.showToast("error", "Failed to fetch price information");
    } finally {
      setIsPriceFetching(false);
    }
  };

  const handleAddToCartClick = (menu) => {
    const { customerId, customerType } = getUserData();
    const { restaurantId } = getRestaurantData();

    if (!customerId || !restaurantId) {
      console.error("Missing required data");
      navigate("/Signinscreen");
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

  const handleConfirmAddToCart = async () => {
    if (!selectedMenu) return;

    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id) {
      console.error("Customer ID not found");
      navigate("/Signinscreen");
      return;
    }

    const currentRestaurantId = restaurantId || localStorage.getItem("restaurantId");
    if (!currentRestaurantId) {
      console.error("Restaurant ID not found");
      window.showToast("error", "Restaurant information is missing.");
      return;
    }

    const selectedPrice = portionSize === "half" ? halfPrice : fullPrice;

    if (!selectedPrice) {
      window.showToast("error", "Price information is not available.");
      return;
    }

    try {
      await addToCart(
        {
          ...selectedMenu,
          quantity: 1,
          notes,
          half_or_full: portionSize,
          price: selectedPrice,
          restaurant_id: currentRestaurantId,
        },
        currentRestaurantId
      );

      window.showToast("success", `${selectedMenu.name} added to cart`);

      setShowModal(false);
      setNotes("");
      setPortionSize("full");
      setSelectedMenu(null);
    } catch (error) {
      if (error.message === "Item is already in the cart") {
        window.showToast("info", "This item is already in your cart.");
      } else {
        console.error("Error adding item to cart:", error);
        window.showToast("error", "Failed to add item to cart. Please try again.");
      }
    }
  };

  const handleModalClick = (e) => {
    // Close the modal if the click is outside the modal content
    if (e.target.classList.contains("modal")) {
      setShowModal(false);
    }
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
                      className={`border bg-white opacity-75 d-flex justify-content-center align-items-center ${
                        menu.menu_veg_nonveg.toLowerCase() === "veg"
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
                          menu.menu_veg_nonveg.toLowerCase() === "veg"
                            ? "ri-checkbox-blank-circle-fill text-success"
                            : "ri-checkbox-blank-circle-fill text-danger"
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
                            ? "ri-heart-3-fill text-danger"
                            : "ri-heart-3-line"
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
                        {menu.is_special && (
                          <div className="row ">
                            <div className="col-12 text-success text-center font_size_12 fw-medium my-1 py-0 mx-0 px-0">
                              Special
                              <hr className="mt-2 mb-0" />
                            </div>
                          </div>
                        )}
                        <div className="row">
                          <div className="col-8 text-success">
                            <i className="ri-restaurant-line pe-1"></i>
                            <span className="font_size_10">
                              {menu.category}
                            </span>
                          </div>
                          <div className="col-4 text-end pe-2 d-flex justify-content-end align-items-center">
                            <i className="ri-star-half-line font_size_10 ratingStar me-1"></i>
                            <span className="font_size_10 fw-normal gray-text mt-1">
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
                          {customerId ? (
                            <Link
                              to="#"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAddToCartClick(menu);
                              }}
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
                            >
                              <i className={`ri-shopping-cart-${isMenuItemInCart(menu.menu_id) ? "fill" : "line"} fs-6`}></i>
                            </Link>
                          ) : (
                            <Link
                              to="/Signinscreen"
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
                                navigate("/Signinscreen");
                              }}
                            >
                              <i className="ri-shopping-cart-2-line fs-6"></i>
                            </Link>
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
                <span
                  className="btn-close position-absolute top-0 end-0 m-2 bg-danger text-white fs-4"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                >
                  <i className="ri-close-line "></i>
                </span>
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
                  className="btn btn-outline-primary  rounded-pill"
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
                  <i class="ri-shopping-cart-line pe-2 text-white"></i>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default ProductCard;
