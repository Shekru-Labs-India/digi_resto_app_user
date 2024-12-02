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
const NearbyArea = () => {
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

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setCustomerId(userData.customer_id);
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
      customerId || JSON.parse(localStorage.getItem("userData"))?.customer_id;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/get_special_menu_list`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: currentCustomerId,
            restaurant_id: restaurantId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.st === 1 && Array.isArray(data.data.special_menu_list)) {
        const formattedMenuItems = data.data.special_menu_list.map((menu) => ({
          ...menu,
          name: menu.menu_name,
          category_name: menu.category_name,
          oldPrice: menu.offer ? menu.price : null,
          price: menu.offer
            ? Math.floor(menu.price * (1 - menu.offer / 100))
            : menu.price,
          is_favourite: menu.is_favourite === 1,
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
    if (!userData?.customer_id) {
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
      console.clear();
      window.showToast(
        "error",
        "Failed to add item to cart. Please try again."
      );
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
  switch (foodType?.toLowerCase()) {
    case "veg":
      return {
        icon: "fa-solid fa-circle text-success",
        border: "border-success",
      };
    case "non-veg":
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
    if (menuItems.length > 0) {
      swiperRef.current = new Swiper(".nearby-swiper", {
        slidesPerView: "auto",
        spaceBetween: 20,
        loop: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
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
    if (!userData?.customer_id || userData.customer_type === "guest") {
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
            customer_id: userData.customer_id,
            customer_type: userData.customer_type,
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
          isFavorite ? "Removed from favourite" : "Added to favourite"
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
  const handleAddToCartClick = async (menuItem) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id || !restaurantId) {
      showLoginPopup();
      return;
    }

    if (isMenuItemInCart(menuItem.menu_id)) {
      window.showToast("info", "This item is already in your cart.");
      return;
    }

    setSelectedMenu(menuItem);
    fetchHalfFullPrices(menuItem.menu_id);
    setShowModal(true);
  };

  // Update the rating function with the correct logic
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

  return (
    <div className="dz-box style-2 nearby-area pb-3">
      <div className=" align-items-start mb-0 ">
        <div className="">
          {menuItems.length > 0 && (
            <div className="title-bar">
              <span className="font_size_14 fw-medium">Our Speciality</span>
              <Link to="/user_app/Menu">
                <span>see all</span>
                <i className="fa-solid fa-arrow-right ms-2"></i>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="dz-box style-3">
        <div className="swiper nearby-swiper mt-0">
          <div className="swiper-wrapper">
            {menuItems.map((menuItem) => (
              <div key={menuItem.menu_id} className="swiper-slide">
                <Link
                  to={`/user_app/ProductDetails/${menuItem.menu_id}`}
                  state={{ menu_cat_id: menuItem.menu_cat_id }}
                  className="card-link"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                  }}
                >
                  <div className="cart-list bg-white p-0 rounded-4">
                    <div className="dz-media media-100">
                      <img
                        src={menuItem.image || images}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          aspectRatio: 1,
                        }}
                        className="object-fit-cover"
                        onError={(e) => {
                          e.target.src = images;
                        }}
                        alt={menuItem.name}
                        loading="lazy"
                      />
                      {menuItem.is_special && (
                        <i
                          className="fa-solid fa-star border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center text-info"
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
                      {menuItem.offer !== 0 && (
                        <div className="gradient_bg d-flex justify-content-center align-items-center gradient_bg_offer">
                          <span className="font_size_10 text-white">
                            {menuItem.offer}% Off
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="dz-content d-block">
                      <div className="d-flex justify-content-between align-items-center mt-1">
                        <span className="font_size_14 fw-medium text-wrap">
                          {menuItem.name}
                        </span>
                      </div>

                      <div className="mt-2">
                        <div className="row d-flex align-items-center">
                          <div className="col-4 d-flex align-items-center">
                            <div className="text-success font_size_10 d-flex align-items-center">
                              <i className="fa-solid fa-utensils pe-1"></i>
                              {menuItem.category_name}
                            </div>
                          </div>
                          <div className="col-4 d-flex aign-items-center justify-content-center">
                            {renderSpiceIcons(menuItem.spicy_index)}
                          </div>
                          <div className="col-4 d-flex aign-items-center justify-content-end">
                            {menuItem.rating > 0 && (
                              <div className="text-end pe-2 d-flex justify-content-end align-items-center">
                                {renderStarRating(menuItem.rating)}
                                <span className="font_size_10 fw-normal gray-text">
                                  {menuItem.rating}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="row ">
                        <div className="col-6 pe-0 mt-1 mb-1">
                          <span className="me-2 text-info font_size_14 fw-semibold">
                            ₹{menuItem.price}
                          </span>
                          {menuItem.oldPrice && (
                            <span className="gray-text text-decoration-line-through font_size_12 fw-normal">
                              ₹{menuItem.oldPrice}
                            </span>
                          )}
                        </div>
                        <div className="col-6 d-flex align-items-center justify-content-end">
                          {customerId ? (
                            <div
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAddToCartClick(menuItem);
                              }}
                              className="border border-1 rounded-circle bg-white opacity-75 me-1"
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
                              <i
                                className={`fa-solid ${
                                  isMenuItemInCart(menuItem.menu_id)
                                    ? "fa-solid fa-circle-check"
                                    : "fa-solid fa-plus text-secondary"
                                } fs-6`}
                              ></i>
                            </div>
                          ) : (
                            <div
                              className="border border-1 rounded-circle bg-white opacity-75 me-1"
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
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
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
                  <i className="fa-solid fa-cart-shopping  pe-1 text-white"></i>
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

export default NearbyArea;
