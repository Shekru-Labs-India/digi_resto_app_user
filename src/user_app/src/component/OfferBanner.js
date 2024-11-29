import React, { useState, useEffect } from "react";
import Swiper from "swiper/bundle";
import "swiper/swiper-bundle.css"; // Correctly import Swiper CSS
import images from "../assets/MenuDefault.png";
import { Link, useNavigate } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import OrderGif from "../screens/OrderGif";
import LoaderGif from "../screens/LoaderGIF";
 import "../assets/css/toast.css"
import HotelNameAndTable from "../components/HotelNameAndTable";
import styled, { keyframes } from "styled-components";
import { useCart } from "../context/CartContext"; // Add this import
import { usePopup } from "../context/PopupContext";
import config from "./config";

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 123, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
  }
`;

const AnimatedCard = styled.div`
  animation: ${pulse} 2s infinite;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const OfferBanner = () => {
  const [banners, setBanners] = useState([]);
  const [menuLists, setMenuLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { restaurantId } = useRestaurantId();
  const { restaurantName } = useRestaurantId();
  const [userData, setUserData] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [customerType, setCustomerType] = useState(null);
  const navigate = useNavigate();
  const { cartItems, addToCart, isMenuItemInCart } = useCart(); // Add this line
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [portionSize, setPortionSize] = useState("full");
  const [halfPrice, setHalfPrice] = useState(null);
  const [fullPrice, setFullPrice] = useState(null);
  const [isPriceFetching, setIsPriceFetching] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [price, setPrice] = useState([]);
  const [discountAmount, setDiscountAmount] = useState([]);
  const { showLoginPopup } = usePopup();

  useEffect(() => {
    updateCartRestaurantId();
  }, []);

  const [cartRestaurantId, setCartRestaurantId] = useState(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    return cartItems.length > 0 ? cartItems[0].restaurant_id : null;
  });

  const updateCartRestaurantId = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    if (cartItems.length > 0) {
      setCartRestaurantId(cartItems[0].restaurant_id);
    } else {
      setCartRestaurantId(null);
    }
  };

  const isCartFromDifferentRestaurant = (itemRestaurantId) => {
    return cartRestaurantId && cartRestaurantId !== itemRestaurantId;
  };

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

  // Utility function to convert string to title case
  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  // Retrieve menuItems from localStorage
  const getLocalMenuItems = () => {
    const storedData = localStorage.getItem("menuItems");
    return storedData ? JSON.parse(storedData) : [];
  };

  // Save menuItems to localStorage
  const saveLocalMenuItems = (menuItems) => {
    localStorage.setItem("menuItems", JSON.stringify(menuItems));
  };

  const fetchData = async () => {
    try {
      if (!restaurantId) return;

      // Retrieve customer_id from state or localStorage
      const currentCustomerId =
        customerId || JSON.parse(localStorage.getItem("userData"))?.customer_id;

      const response = await fetch(
        `${config.apiDomain}/user_api/get_all_menu_list_by_category`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: currentCustomerId,
            restaurant_id: restaurantId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.st === 1) {
        const formattedMenuList = data.data.menus.map((menu) => ({
          ...menu,
          image: menu.image || images,
          name: toTitleCase(menu.menu_name),
          strikePrice: menu.offer ? menu.price : null,
          price: menu.offer
            ? Math.floor(menu.price * (1 - menu.offer / 100))
            : menu.price,
          is_favourite: menu.is_favourite === 1,
        }));

        setPrice(data.data.menus.price);
        setDiscountAmount(data.data.menus.offer);

        setMenuLists(formattedMenuList);
      }
    } catch (error) {
      console.clear();
    } finally {
      setLoading(false);
    }
  };

  // Load User Data and Fetch Menu Data on Initial Render
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setCustomerId(userData.customer_id);
      setCustomerType(userData.customer_type);
    }

    if (restaurantId) {
      fetchData();
    }
  }, [restaurantId]);

  // useEffect(() => {
  //   const pollInterval = setInterval(() => {
  //     if (restaurantId) {
  //       fetchData();
  //     }
  //   }, 30000); // Poll every 30 seconds

  //   return () => clearInterval(pollInterval);
  // }, [restaurantId, customerId]);

  useEffect(() => {
    const handleFavoriteUpdate = (event) => {
      const { menuId, isFavorite } = event.detail;
      setMenuLists((prevMenus) =>
        prevMenus.map((menu) =>
          menu.menu_id === menuId ? { ...menu, is_favourite: isFavorite } : menu
        )
      );
    };

    const handleCartUpdate = () => {
      setMenuLists((prevMenus) => [...prevMenus]); // Force re-render
    };

    window.addEventListener("favoriteStatusChanged", handleFavoriteUpdate);
    window.addEventListener("cartStatusChanged", handleCartUpdate);

    return () => {
      window.removeEventListener("favoriteStatusChanged", handleFavoriteUpdate);
      window.removeEventListener("cartStatusChanged", handleCartUpdate);
    };
  }, []);

  // useEffect(() => {
  //   if (banners.length > 0) {
  //     const swiper = new Swiper(".featured-swiper2", {
  //       slidesPerView: "auto",
  //       spaceBetween: 20,
  //       loop: true,
  //       autoplay: {
  //         delay: 2500,
  //         disableOnInteraction: false,
  //       },
  //     });

  //     return () => {
  //       swiper.destroy();
  //     };
  //   }
  // }, [banners]);

  useEffect(() => {
    if (menuLists.length > 0) {
      const swiper = new Swiper(".featured-swiper", {
        slidesPerView: "auto",
        spaceBetween: 20,
        loop: true,
        autoplay: {
          delay: 2500,
          // delay: 2500000,
          disableOnInteraction: false,
        },
      });

      return () => {
        swiper.destroy();
      };
    }
  }, [menuLists]);

  const handleUnauthorizedFavorite = () => {
    showLoginPopup();
  };

  const handleLikeClick = async (menuId) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id || userData.customer_type === "guest") {
      handleUnauthorizedFavorite();
      return;
    }

    const menuItem = menuLists.find((item) => item.menu_id === menuId);
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
        setMenuLists((prevMenuLists) =>
          prevMenuLists.map((item) =>
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
          isFavorite ? "Removed from favorites" : "Added to favorites"
        );
      }
    } catch (error) {
      console.clear();
      window.showToast(
        "error",
        "Failed to update favorite status. Please try again."
      );
    }
  };

  useEffect(() => {
    const handleFavoriteUpdate = (event) => {
      const { menuId, isFavorite } = event.detail;
      setMenuLists((prevMenuLists) =>
        prevMenuLists.map((item) =>
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
        if (data.menu_detail.half_price === null) {
          setPortionSize("full");
        }
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

  const handleAddToCartClick = async (menu) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id || !restaurantId) {
      return;
    }

    if (isCartFromDifferentRestaurant(restaurantId)) {
      window.showToast(
        "error",
        "This item is from a different restaurant. Clear your cart first."
      );
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
      showLoginPopup();
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

      window.showToast("success", selectedMenu.name);

      setShowModal(false);
      setNotes("");
      setPortionSize("full");
      setSelectedMenu(null);

      // Update cart items
      const updatedCartItems = await fetchCartItems();
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      window.dispatchEvent(
        new CustomEvent("cartUpdated", { detail: updatedCartItems })
      );
    } catch (error) {
      console.clear();
      window.showToast(
        "error",
        "Failed to add item to cart. Please try again."
      );
    }
  };

  const fetchCartItems = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id) return [];

    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/get_cart_detail_add_to_cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: localStorage.getItem("cartId"),
            customer_id: userData.customer_id,
            customer_type: userData.customer_type,
            restaurant_id: restaurantId,
          }),
        }
      );

      const data = await response.json();
      return response.ok && data.st === 1 && data.order_items
        ? data.order_items
        : [];
    } catch (error) {
      console.clear();
      return [];
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setUserData(userData);
      setCustomerId(userData.customer_id);
      setCustomerType(userData.customer_type);
    }
  }, []);

  const handleCartIconClick = (e, menu) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      showLoginPopup();
    } else {
      handleAddToCartClick(menu);
    }
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
      return (
        <i className="fa-solid fa-star font_size_10 ratingStar me-1"></i>
      );
    }

    return <i className="ri-star-line font_size_10 ratingStar me-1"></i>;
  };

  return (
    <div className="dz-box style-3">
      {/* {loading ? (
        <div id="preloader">
          <div className="loader">
            <LoaderGif />
          </div>
        </div>
      ) : (
        <> */}
      <div className="swiper featured-swiper mt-0">
        <div className="m-0">
          <HotelNameAndTable
            restaurantName={restaurantName}
            tableNumber={userData?.tableNumber || "1"}
          />
        </div>
        <div className="swiper-wrapper">
          {menuLists.map((menu) => (
            <div key={menu.menu_id} className="swiper-slide">
              <Link
                to={`/user_app/ProductDetails/${menu.menu_id}`}
                state={{ menu_cat_id: menu.menu_cat_id }}
              >
                <div
                  className="cart-list bg-white p-0 rounded-4"
                  style={{ width: "345px" }}
                >
                  <div className="dz-media media-100">
                    <img
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "fill",
                        aspectRatio: "1/1",
                      }}
                      className="object-fit-cover"
                      src={menu.image || images} // Use default image if menu.image is null
                      alt={menu.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = images; // Set local image source on error
                      }}
                    />
                    {menu.is_special && (
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
                        className={`${
                          menu.is_favourite
                            ? "fa-solid fa-heart text-danger"
                            : "fa-regular fa-heart"
                        } fs-6`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLikeClick(menu.menu_id);
                        }}
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
                  <div className="dz-content d-block">
                    {/* <div className="category-text">
                          <div className="row mt-1">
                            <div className="col-8 text-success font_size_10">
                              <i className="fa-solid fa-utensils pe-1"></i>
                              {menu.category_name}
                            </div>
                            <div className="col-4 ps-0 text-end">
                              <span className="font_size_10 fw-normal gray-text me-2">
                                <i className="fa-solid fa-star-half-stroke font_size_10  ratingStar me-1"></i>
                                {menu.rating}
                              </span>
                            </div>
                          </div>
                        </div> */}
                    <div className="category-text">
                      <div className="d-flex justify-content-between align-items-center justify-content-center mt-1">
                        <span className="font_size_14 fw-medium text-wrap">
                          {menu.name}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2">
                      <div className="row">
                        <div className="col-4 d-flex align-items-center">
                          <div className="text-success font_size_10">
                            <i className="fa-solid fa-utensils pe-1"></i>
                            {menu.category_name}
                          </div>
                        </div>
                        <div className="col-4 d-flex align-items-center">
                          {renderSpiceIcons(menu.spicy_index)}
                        </div>
                        <div className="col-4">
                          {menu.rating > 0 && (
                            <div className="text-end font_size_10 fw-normal gray-text me-1">
                              {renderStarRating(menu.rating)}
                              <span>{menu.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row ">
                      <div className="col-6 d-flex align-items-center">
                        <span className="me-2 text-info font_size_14 fw-semibold">
                          ₹{menu.price}
                        </span>
                        {menu.strikePrice && (
                          <span className="gray-text text-decoration-line-through font_size_12 fw-normal">
                            ₹{menu.strikePrice}
                          </span>
                        )}
                      </div>
                      <div className="col-6 d-flex align-items-center justify-content-end">
                        {userData ? (
                          <div
                            onClick={(e) => handleCartIconClick(e, menu)}
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
                                isMenuItemInCart(menu.menu_id)
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
                              showLoginPopup();
                            }}
                          >
                            <i className="fa-solid fa-cart-shopping fs-6"></i>
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
      {/* </>
      )} */}

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
                    more spicy 🥵
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
    </div>
  );
};

export default OfferBanner;
