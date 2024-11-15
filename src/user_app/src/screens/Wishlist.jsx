import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Bottom from "../component/bottom";
import SigninButton from "../constants/SigninButton";
import { useRestaurantId } from "../context/RestaurantIdContext";
import images from "../assets/MenuDefault.png";
import LoaderGif from "./LoaderGIF";
import Header from "../components/Header";
import HotelNameAndTable from "../components/HotelNameAndTable";
import { useCart } from "../context/CartContext";
import { usePopup } from '../context/PopupContext';
import config from "../component/config"
import { getUserData, getRestaurantData } from "../utils/userUtils";

const Wishlist = () => {
  const [checkedItems, setCheckedItems] = useState({});
  const [expandAll, setExpandAll] = useState(false);
  const [hasFavorites, setHasFavorites] = useState(false);
  const [wishlistItems, setWishlistItems] = useState({});
  const { restaurantId, restaurantName } = useRestaurantId();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [customerType, setCustomerType] = useState(null);

  const toggleChecked = (restaurantName) => {
    setCheckedItems((prev) => ({
      ...prev,
      [restaurantName]: !prev[restaurantName],
    }));
  };

  const toggleExpandAll = () => {
    const newExpandAll = !expandAll;
    setExpandAll(newExpandAll);
    const newCheckedItems = {};
    Object.keys(menuList).forEach((restaurantName) => {
      newCheckedItems[restaurantName] = newExpandAll;
    });
    setCheckedItems(newCheckedItems);
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("isDarkMode") === "true";
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuList, setMenuList] = useState({});

  const navigate = useNavigate();
  const { addToCart, removeFromCart, isMenuItemInCart } = useCart();

  const [showModal, setShowModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [portionSize, setPortionSize] = useState("full");
  const [notes, setNotes] = useState("");
  const [halfPrice, setHalfPrice] = useState(null);
  const [fullPrice, setFullPrice] = useState(null);
  const [isPriceFetching, setIsPriceFetching] = useState(false);

  const [cartRestaurantId, setCartRestaurantId] = useState(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    return cartItems.length > 0 ? cartItems[0].restaurant_id : null;
  });

  const { showLoginPopup } = usePopup();

  // Single useEffect for initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      const { customerId, customerType } = getUserData();
      const { restaurantId } = getRestaurantData();

      setIsLoggedIn(!!customerId);
      setCustomerId(customerId);
      setCustomerType(customerType);

      if (customerId) {
        await fetchFavoriteItems();
      } else {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []); // Empty dependency array - runs only on mount

  // Remove these duplicate/unnecessary effects
  // useEffect(() => {
  //   fetchFavoriteItems();
  //   updateCartRestaurantId();
  // }, [customerId, restaurantId]);

  // useEffect(() => {
  //   const storedCustomerId = localStorage.getItem("customer_id");
  //   ...
  // }, []);

  const handleMenuClick = (menu) => {
    // If the menu is from a different restaurant
    if (menu.restaurant_id !== restaurantId) {
      // Store both current and target restaurant IDs
      localStorage.setItem("previousRestaurantId", restaurantId);
      localStorage.setItem("currentRestaurantId", menu.restaurant_id);
      localStorage.setItem("restaurantId", menu.restaurant_id);
    }
  };

  const fetchFavoriteItems = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id) {
     
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
         `${config.apiDomain}/user_api/get_favourite_list`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: userData.customer_id,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1 && data.lists) {
          setWishlistItems(data.lists);
          setMenuList(data.lists);
          setHasFavorites(Object.keys(data.lists).length > 0);
        } else {
        
          setWishlistItems({});
          setMenuList({});
          setHasFavorites(false);
        }
      } else {
        
        setWishlistItems({});
        setMenuList({});
        setHasFavorites(false);
      }
    } catch (error) {
     
      setWishlistItems({});
      setMenuList({});
      setHasFavorites(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Keep the favorite update listener
  useEffect(() => {
    const handleFavoriteUpdate = (event) => {
      const { menuId, isFavorite } = event.detail;
      setWishlistItems((prevWishlistItems) => {
        const updatedWishlistItems = { ...prevWishlistItems };
        Object.keys(updatedWishlistItems).forEach((restaurantName) => {
          updatedWishlistItems[restaurantName] = updatedWishlistItems[
            restaurantName
          ].map((item) =>
            item.menu_id === menuId
              ? { ...item, is_favourite: isFavorite }
              : item
          );
        });
        return updatedWishlistItems;
      });
    };

    window.addEventListener("favoriteUpdated", handleFavoriteUpdate);
    return () => {
      window.removeEventListener("favoriteUpdated", handleFavoriteUpdate);
    };
  }, []);

  // 3. Update cart restaurant ID when needed
  useEffect(() => {
    if (customerId && restaurantId) {
      updateCartRestaurantId();
    }
  }, [customerId, restaurantId]);

  const updateCartRestaurantId = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    if (cartItems.length > 0) {
      setCartRestaurantId(cartItems[0].restaurant_id);
    } else {
      setCartRestaurantId(restaurantId);
    }
  };

  const isCartFromDifferentRestaurant = (itemRestaurantId) => {
    return cartRestaurantId && cartRestaurantId !== itemRestaurantId;
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
      } else {
      
        window.showToast("error", data.msg || "Failed to fetch price information");
      }
    } catch (error) {
      
      window.showToast("error", "Failed to fetch price information");
    } finally {
      setIsPriceFetching(false);
    }
  };

  const handleAddToCartClick = (menu) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id || userData.customer_type === 'guest') {
      showLoginPopup();
      return;
    }

    if (isCartFromDifferentRestaurant(menu.restaurant_id)) {
      window.showToast("warning", "Please complete or clear your existing cart first");
      return;
    }

    setSelectedMenu(menu);
    setPortionSize('full');
    fetchHalfFullPrices(menu.menu_id);
    setShowModal(true);
  };

  const handleConfirmAddToCart = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id || userData.customer_type === 'guest') {
      showLoginPopup();
      return;
    }

    if (!selectedMenu) return;

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
        },
        restaurantId
      );

      window.showToast("success", `${selectedMenu.menu_name} added to cart`);

      setShowModal(false);
      setNotes("");
      setPortionSize("full");
      setSelectedMenu(null);

      updateCartRestaurantId();

      // Dispatch cart update event
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
   
      window.showToast("error", "Failed to add item to cart. Please try again.");
    }
  };

  const handleModalClick = (e) => {
    if (e.target.classList.contains("modal")) {
      setShowModal(false);
    }
  };

  const wishlistCount = Object.keys(menuList).reduce(
    (total, key) => total + menuList[key].length,
    0
  );

  const handleRemoveItemClick = async (restaurantName, menuId, restaurantId) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id || !menuId || !restaurantId) {
      
      window.showToast("error", "Missing required information");
      return;
    }

    try {
      const response = await fetch(
         `${config.apiDomain}/user_api/remove_favourite_menu`,
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

      const data = await response.json();

      if (response.ok && data.st === 1) {
        setMenuList((prevMenuList) => {
          const updatedMenuList = { ...prevMenuList };
          updatedMenuList[restaurantName] = updatedMenuList[restaurantName]
            .filter((item) => item.menu_id !== menuId);

          if (updatedMenuList[restaurantName].length === 0) {
            delete updatedMenuList[restaurantName];
          }

          setHasFavorites(Object.keys(updatedMenuList).length > 0);
          return updatedMenuList;
        });

        window.showToast("success", "Item has been removed from favorites");
      } else {
    
        window.showToast("error", "Failed to remove item from favorites");
      }
    } catch (error) {
     
      window.showToast("error", "An error occurred while removing the item");
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
    }
  }, [isDarkMode]);

  if (isLoading) {
    return (
      <div id="preloader">
        <div className="loader">
          <LoaderGif />
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper full-height">
      <main className="page-content space-top mb-5 pb-5">
        <div className="container ">
          <Header title="Favourite" count={wishlistCount} />

          <HotelNameAndTable
            restaurantName={restaurantName}
            tableNumber={customerType?.tableNumber || "1"}
          />
        </div>
        {isLoading ? (
          <LoaderGif />
        ) : isLoggedIn ? (
          hasFavorites ? (
            <>
              <div className="container d-flex justify-content-end mb-1 mt-0 ps-0 py-0 ">
                <div
                  className="d-flex align-items-center cursor-pointer ps-0 py-0 icon-border"
                  onClick={toggleExpandAll}
                  role="button"
                  aria-label={expandAll ? "Collapse All" : "Expand All"}
                >
                  <span className="icon-circle">
                    <i
                      className={`ri-arrow-down-s-line arrow-icon ${
                        expandAll ? "rotated" : "rotated-1"
                      }`}
                    ></i>
                  </span>
                </div>
              </div>
              {Object.keys(wishlistItems).map((restaurantName) =>
                menuList[restaurantName] &&
                menuList[restaurantName].length > 0 ? (
                  <div className="container py-0" key={restaurantName}>
                    <div className="tab pt-0">
                      <input
                        type="checkbox"
                        id={`chck${restaurantName}`}
                        checked={checkedItems[restaurantName] || false}
                        onChange={() => toggleChecked(restaurantName)}
                      />
                      <label
                        className="tab-label pb-0 px-0 pt-2"
                        htmlFor={`chck${restaurantName}`}
                      >
                        <span className="">
                          <span className="font_size_14 fw-medium">
                            <i className="ri-store-2-line me-2"></i>
                            {restaurantName.toUpperCase()}
                          </span>
                        </span>
                        <span className="">
                          <span className="gray-text ps-2 pe-2 small-number">
                            {menuList[restaurantName].length}
                          </span>
                          <span className="icon-circle">
                            <i
                              className={`ri-arrow-down-s-line arrow-icon pt-0 ${
                                checkedItems[restaurantName]
                                  ? "rotated"
                                  : "rotated-1"
                              }`}
                            ></i>
                          </span>
                        </span>
                      </label>

                      <div className="tab-content">
                        {menuList[restaurantName].map((menu, index) => (
                          <div className="container py-1 px-0" key={index}>
                            <div className="custom-card rounded-4">
                              <Link
                                to={`/user_app/ProductDetails/${menu.menu_id}`}
                                state={{
                                  restaurant_id: menu.restaurant_id,
                                  menu_cat_id: menu.menu_cat_id,
                                  fromWishlist: true,
                                  fromDifferentRestaurant:
                                    menu.restaurant_id !== restaurantId,
                                  previousRestaurantId: restaurantId,
                                }}
                                className="text-decoration-none text-reset"
                                onClick={() => handleMenuClick(menu)}
                              >
                                <div className="card-body py-0">
                                  <div className="row">
                                    <div className="col-3 px-0">
                                      <img
                                        src={menu.image || images}
                                        alt={menu.menu_name}
                                        className="rounded-4 img-fluid"
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          aspectRatio: "1/1",
                                    
                                        }}
                                        onError={(e) => {
                                          e.target.src = images;
                                          e.target.style.width = "100%";
                                          e.target.style.height = "100%";
                                          e.target.style.aspectRatio = "1/1";
                                        }}
                                      />
                                      <div
                                        className={`border border-1 rounded-circle ${
                                          isDarkMode ? "bg-dark" : "bg-white"
                                        } opacity-75 d-flex justify-content-center align-items-center`}
                                        style={{
                                          position: "absolute",
                                          bottom: "3px",
                                          right: "76%",
                                          height: "20px",
                                          width: "20px",
                                        }}
                                      >
                                        <i
                                          className={`ri-heart-3-fill text-danger fs-6`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleRemoveItemClick(
                                              restaurantName,
                                              menu.menu_id,
                                              menu.restaurant_id
                                            );
                                          }}
                                        ></i>
                                      </div>
                                      <div
                                        className={`border ${
                                          isDarkMode ? "bg-dark" : "bg-white"
                                        } opacity-75 d-flex justify-content-center align-items-center ${
                                          menu.menu_veg_nonveg.toLowerCase() ===
                                          "veg"
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
                                            menu.menu_veg_nonveg.toLowerCase() ===
                                            "veg"
                                              ? "ri-checkbox-blank-circle-fill text-success"
                                              : "ri-checkbox-blank-circle-fill text-danger"
                                          } font_size_12`}
                                        ></i>
                                      </div>
                                      {menu.offer && menu.offer !== "0" && (
                                        <div
                                          className="gradient_bg d-flex justify-content-center align-items-center gradient_bg_offer"
                                        >
                                          <span className="font_size_10 text-white">
                                            <i className="ri-percent-line me-1 "></i>
                                              {menu.offer}% Off
                                            </span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-9 pt-1 p-0">
                                      <div className="row">
                                        <div className="col-10">
                                          <div className="ps-2 font_size_14 fw-medium">
                                            {menu.menu_name}
                                          </div>
                                        </div>
                                        <div className="col-2 text-end font_size_10">
                                          <div
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleRemoveItemClick(
                                                restaurantName,
                                                menu.menu_id,
                                                menu.restaurant_id
                                              );
                                            }}
                                          >
                                            <i className="ri-close-fill me-1 font_size_14 gray-text"></i>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row mt-1">
                                        <div className="col-5 text-start">
                                          <span className="ps-2 font_size_10 text-success">
                                            <i className="ri-restaurant-line mt-0 me-1"></i>
                                            {menu.category_name}
                                          </span>
                                        </div>
                                        <div className="col-3 text-center">
                                          {menu.spicy_index && (
                                            <div className="">
                                              {Array.from({ length: 5 }).map(
                                                (_, index) =>
                                                  index < menu.spicy_index ? (
                                                    <i
                                                      className="ri-fire-fill font_size_12 text-danger"
                                                      key={index}
                                                    ></i>
                                                  ) : (
                                                    <i
                                                      className="ri-fire-line font_size_12 gray-text"
                                                      key={index}
                                                    ></i>
                                                  )
                                              )}
                                            </div>
                                          )}
                                        </div>
                                        <div className="col-4 text-end ">
                                          <i className="ri-star-half-line font_size_10 ratingStar "></i>
                                          <span className="font_size_10  fw-normal gray-text">
                                            {menu.rating || 0.1}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="row mt-1">
                                        <div className="col-6">
                                          <p className="ms-2 mb-0 fw-medium">
                                            <span className="font_size_14 fw-semibold text-info">
                                              ₹{menu.price}
                                            </span>
                                            <span className="gray-text font_size_12 text-decoration-line-through fw-normal ms-2">
                                              ₹{menu.oldPrice || menu.price}
                                            </span>
                                          </p>
                                        </div>

                                        <div className="col-6 d-flex justify-content-end">
                                          {customerId &&
                                          menu.restaurant_id ===
                                            restaurantId ? (
                                            <div
                                              className="border border-1 rounded-circle bg-white opacity-75 d-flex align-items-center justify-content-center"
                                              style={{
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
                                                  isCartFromDifferentRestaurant(
                                                    menu.restaurant_id
                                                  )
                                                    ? ""
                                                    : isMenuItemInCart(
                                                        menu.menu_id
                                                      )
                                                    ? "fill text-black"
                                                    : "line"
                                                } fs-6`}
                                                title={
                                                  isCartFromDifferentRestaurant(
                                                    menu.restaurant_id
                                                  )
                                                    ? "Different Restaurant"
                                                    : ""
                                                }
                                              ></i>
                                            </div>
                                          ) : null}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null
              )}
            </>
          ) : (
            <div
              className="container overflow-hidden d-flex justify-content-center align-items-center"
              style={{ height: "78vh" }}
            >
              <div className="m-b20 dz-flex-box text-center">
                <div className="dz-cart-about">
                  <h5 className=" ">Nothing to show in favourites.</h5>
                  <p>Add some products to show here!</p>
                  <Link to="/Menu" className="btn btn-outline-primary btn-sm">
                    Browse Menus
                  </Link>
                </div>
              </div>
            </div>
          )
        ) : (
          <div
            className="container overflow-hidden d-flex justify-content-center align-items-center"
            style={{ height: "80vh" }}
          >
            <div className="m-b20 dz-flex-box text-center">
              <div className="dz-cart-about">
                <div className="">
                  <button
                    className="btn btn-outline-primary rounded-pill"
                    onClick={showLoginPopup}
                  >
                    <i className="ri-lock-2-line me-2 fs-3"></i> Login
                  </button>
                </div>
                <span className="mt-4">
                  Access fresh flavors with a quick login.
                </span>
              </div>
            </div>
          </div>
        )}
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
                    className="form-control fs-6 border border-primary rounded-4"
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
                  <i className="ri-shopping-cart-line pe-1 text-white"></i>
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

export default Wishlist;
