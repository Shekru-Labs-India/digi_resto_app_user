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
import { usePopup } from "../context/PopupContext";
import config from "../component/config";
import { getUserData, getRestaurantData } from "../utils/userUtils";
import RestaurantSocials from "../components/RestaurantSocials";
import "../assets/css/toast.css";
import { renderSpicyLevel } from "../component/config";
import AddToCartUI from "../components/AddToCartUI";

const Wishlist = () => {
  const [checkedItems, setCheckedItems] = useState({});
  const [expandAll, setExpandAll] = useState(false);
  const [hasFavorites, setHasFavorites] = useState(false);
  const [wishlistItems, setWishlistItems] = useState({});
  const { restaurantId, restaurantName } = useRestaurantId();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user_id, setUser_id] = useState(null);
  const [role, setRole] = useState(null);

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
  const [comment, setComment] = useState("");
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
      const userData = JSON.parse(localStorage.getItem("userData"));
      setIsLoggedIn(!!userData?.user_id);
      setUser_id(userData?.user_id);
      setRole(userData?.role);

      if (userData?.user_id) {
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
    if (menu.outlet_id !== restaurantId) {
      // Store both current and target restaurant IDs
      localStorage.setItem("previousRestaurantId", restaurantId);
      localStorage.setItem("currentRestaurantId", menu.outlet_id);
      localStorage.setItem("restaurantId", menu.outlet_id);
    }
  };

  const fetchFavoriteItems = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const storedRestaurantId = localStorage.getItem("restaurantId"); // Get current restaurant ID

    if (!userData?.user_id) {
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
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },

          body: JSON.stringify({
            user_id: userData.user_id,
            outlet_id: localStorage.getItem("outlet_id"),
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1 && data.lists) {
          setWishlistItems(data.lists);
          setMenuList(data.lists);
          setHasFavorites(Object.keys(data.lists).length > 0);

          const firstRestaurantName = Object.keys(data.lists)[0];
          setCheckedItems({ [firstRestaurantName]: true });
        } else {
          setWishlistItems({});
          setMenuList({});
          setHasFavorites(false);
        }
      } else {
        console.clear();
        setWishlistItems({});
        setMenuList({});
        setHasFavorites(false);
      }
    } catch (error) {
      console.clear();
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
    if (user_id && restaurantId) {
      updateCartRestaurantId();
    }
  }, [user_id, restaurantId]);

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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            outlet_id: localStorage.getItem("outlet_id"),
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

  const handleAddToCartClick = (menu) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.user_id || userData.role === "guest") {
      showLoginPopup();
      return;
    }
    // if (isMenuItemInCart(menu.menu_id)) {
    //   window.showToast("info", "This item is already in your checkout.");
    //   return;
    // }

    if (isCartFromDifferentRestaurant(menu.outlet_id)) {
      window.showToast(
        "warning",
        "Please complete or clear your existing cart first"
      );
      return;
    }

    setSelectedMenu(menu);
    setPortionSize("full");
    fetchHalfFullPrices(menu.menu_id);
    setShowModal(true);
  };

  const handleConfirmAddToCart = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.user_id || userData.role === "guest") {
      showLoginPopup();
      return;
    }

    if (!selectedMenu) return;

    if (comment && (comment.length < 5 || comment.length > 30)) {
      window.showToast(
        "error",
        "Comment should be between 5 and 30 characters."
      );
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
          comment,
          half_or_full: portionSize,
          price: selectedPrice,
        },
        restaurantId
      );

      window.showToast("success", `${selectedMenu.menu_name} is added.`);

      setShowModal(false);
      setComment("");
      setPortionSize("full");
      setSelectedMenu(null);

      updateCartRestaurantId();

      // Dispatch cart update event
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.clear();
      window.showToast(
        "error",
        "Failed to add item to cart. Please try again."
      );
    }
  };

  const handleModalClick = (e) => {
    if (e.target.classList.contains("modal")) {
      setShowModal(false);
    }
  };
  const handleSuggestionClick = (suggestion) => {
    // Simply set the suggestion as the new note value
    setComment(suggestion);
  };

  const wishlistCount = Object.keys(menuList).reduce(
    (total, key) => total + menuList[key].length,
    0
  );
  const handleRemoveItemClick = async (restaurantName, menuId, outletId) => {
    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem("userData"));
  
    // Extract user_id from userData
    const userId = userData?.user_id;
  
    if (!userId || !menuId || !outletId) {
      window.showToast("error", "Missing required information");
      return;
    }
  
    try {
      const response = await fetch(`${config.apiDomain}/user_api/remove_favourite_menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          outlet_id: outletId,
          menu_id: menuId,
          user_id: userId, // Use userId from userData
        }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.st === 1) {
        setMenuList((prevMenuList) => {
          const updatedMenuList = { ...prevMenuList };
          updatedMenuList[restaurantName] = updatedMenuList[restaurantName].filter(
            (item) => item.menu_id !== menuId
          );
  
          if (updatedMenuList[restaurantName].length === 0) {
            delete updatedMenuList[restaurantName];
          }
  
          setHasFavorites(Object.keys(updatedMenuList).length > 0);
          return updatedMenuList;
        });
  
        window.showToast("success", "Item has been removed from favourites");
      } else {
        window.showToast("error", "Failed to remove item from favourites");
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

  // Add the standardized rating function
 const renderStarRating = (rating) => {
   const numRating = parseFloat(rating);

   // 0 to 0.4: No star
   if (!numRating || numRating < 0.5) {
     return null; // Don't show anything
   }

   // 0.5 to 2.5: Blank star (grey)
   if (numRating >= 0.5 && numRating <= 2.5) {
     return <i className="fa-regular fa-star font_size_10 gray-text me-1"></i>;
   }

   // 3 to 4.5: Half star
   if (numRating >= 3 && numRating <= 4.5) {
     return (
       <i className="fa-solid fa-star-half-stroke font_size_10 text-warning me-1"></i>
     );
   }

   // 5: Full star
   if (numRating === 5) {
     return <i className="fa-solid fa-star font_size_10 text-warning me-1"></i>;
   }

   return null; // Default case
 };



  const getFoodTypeStyles = (foodType) => {
    // Convert foodType to lowercase for case-insensitive comparison
    const type = (foodType || "").toLowerCase();

    switch (type) {
      case "veg":
        return {
          icon: "fa-solid fa-circle text-success",
          border: "border-success",
        };
      case "nonveg":
        return {
          icon: "fa-solid fa-play fa-rotate-270 text-danger",
          border: "border-danger",
        };
      case "egg":
        return {
          icon: "fa-solid fa-egg gray-text",
          border: "gray-text",
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
      <Header title="Favourite" count={wishlistCount} />
      <main className="page-content space-top p-b70">
        <div className="container px-3 py-0 mb-0">
          <HotelNameAndTable
            restaurantName={restaurantName}
            tableNumber={role?.tableNumber || "1"}
          />
        </div>
        {isLoading ? (
          <LoaderGif />
        ) : isLoggedIn ? (
          hasFavorites ? (
            <>
              <div className="d-flex justify-content-end mb-2 pe-0">
                <div className="tab-label me-3">
                  <button
                    className="btn btn-link text-decoration-none pe-0 pb-0"
                    onClick={() => {
                      const allRestaurants = Object.keys(menuList);
                      const newCheckedItems = {};

                      // If any restaurant is collapsed, expand all. Otherwise, collapse all
                      const shouldExpand = allRestaurants.some(
                        (restaurant) => !checkedItems[restaurant]
                      );

                      allRestaurants.forEach((restaurant) => {
                        newCheckedItems[restaurant] = shouldExpand;
                      });

                      setCheckedItems(newCheckedItems);
                    }}
                  >
                    <span className="d-flex align-items-center">
                      <span className="text-secondary opacity-25 pe-2 font_size_10">
                        {Object.values(checkedItems).every(Boolean)
                          ? "Collapse All"
                          : "Expand All"}
                      </span>
                      <span className="icon-circle">
                        <i
                          className={`fas fa-chevron-down arrow-icon ${
                            Object.values(checkedItems).every(Boolean)
                              ? "rotated"
                              : "rotated-1"
                          }`}
                        ></i>
                      </span>
                    </span>
                  </button>
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
                            {/* <i className="fa-solid fa-store me-2"></i> */}
                            {restaurantName.toUpperCase()}
                          </span>
                        </span>
                        <span className="">
                          <span className="gray-text ps-2 pe-2 small-number">
                            {menuList[restaurantName].length}
                          </span>
                          <span className="icon-circle">
                            <i
                              className={`fas fa-chevron-down arrow-icon pt-0 ${
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
                          <div className="py-1 px-0" key={index}>
                            <div className="custom-card rounded-4 shadow-sm">
                              <Link
                                to={`/user_app/ProductDetails/${menu.menu_id}`}
                                state={{
                                  ...(menu.outlet_id !== restaurantId && { outlet_id: menu.outlet_id }),
                                  menu_cat_id: menu.menu_cat_id,
                                  fromWishlist: true,
                                  fromDifferentRestaurant: menu.outlet_id !== restaurantId,
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
                                        className="rounded-4 img-fluid object-fit-cover"
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
                                      />{" "}
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
                                          className={`fa-solid fa-heart text-danger fs-6`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleRemoveItemClick(
                                              restaurantName,
                                              menu.menu_id,
                                              menu.outlet_id
                                             
                                            );
                                          }}
                                        ></i>
                                      </div>
                                      {menu.is_special && (
                                        <i
                                          className="fa-solid fa-star border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center text-info"
                                          style={{
                                            position: "absolute",
                                            top: 3,
                                            right: "76%",
                                            height: 17,
                                            width: 17,
                                          }}
                                        ></i>
                                      )}
                                      <div
                                        className={`border rounded-3 bg-white opacity-100 d-flex justify-content-center align-items-center ${
                                          getFoodTypeStyles(menu.menu_food_type)
                                            .border
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
                                            getFoodTypeStyles(
                                              menu.menu_food_type
                                            ).icon
                                          } font_size_12`}
                                        ></i>
                                      </div>
                                      {menu.offer !== 0 && (
                                        <div className="gradient_bg d-flex justify-content-center align-items-center gradient_bg_offer">
                                          <span className="font_size_10 text-white">
                                            {menu.offer || "No"}% Off
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-9 pt-1 p-0 pe-2">
                                      <div className="row d-flex align-items-center mt-1">
                                        <div className="col-10">
                                          <div className="ps-2 font_size_14 fw-medium">
                                            {menu.menu_name}
                                          </div>
                                        </div>
                                        <div className="col-2 text-end font_size_10 ">
                                          <div
                                            className="d-flex align-items-center ps-1"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleRemoveItemClick(
                                                restaurantName,
                                                menu.menu_id,
                                                menu.outlet_id
                                               
                                              );
                                            }}
                                          >
                                            <i className="fa-solid fa-xmark gray-text font_size_14"></i>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row d-flex align-items-center mt-1">
                                        <div className="col-6 d-flex align-items-center">
                                          <span className="ps-2 font_size_10 text-success">
                                            <i className="fa-solid fa-utensils text-success me-1"></i>
                                            {menu.category_name}
                                          </span>
                                        </div>
                                        <div className="col-4 d-flex aign-items-center ps-4 pe-3">
                                          {menu.spicy_index && (
                                            <div className="">
                                              {renderSpicyLevel(
                                                menu.spicy_index
                                              )}
                                            </div>
                                          )}
                                        </div>
                                        <div className="col-2 d-flex align-items-center justify-content-end">
                                          {menu.rating > 0 && (
                                            <>
                                              {renderStarRating(menu.rating)}
                                              <span className="font_size_10 fw-normal gray-text">
                                                {menu.rating}
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-5 mt-2">
                                          <p className="ms-2 mb-0 fw-medium">
                                            {menu.offer ? (
                                              <>
                                                <span className="font_size_14 fw-semibold text-info">
                                                  ₹
                                                  {Math.floor(
                                                    menu.price *
                                                      (1 - menu.offer / 100)
                                                  )}
                                                </span>
                                                <span className="gray-text font_size_12 text-decoration-line-through fw-normal ms-2">
                                                  ₹{menu.price}
                                                </span>
                                              </>
                                            ) : (
                                              <span className="font_size_14 fw-semibold text-info">
                                                ₹{menu.price}
                                              </span>
                                            )}
                                          </p>
                                        </div>
                                        <div className="col-7 d-flex justify-content-end pe-3 pt-2 pb-2">
                                          {user_id &&
                                            menu.outlet_id ===
                                              restaurantId && (
                                              <div
                                                className="border border-1 rounded-circle bg-white opacity-75 d-flex align-items-center justify-content-center"
                                                style={{
                                                  width: "25px",
                                                  height: "25px",
                                                  cursor: "pointer",
                                                }}
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  e.stopPropagation();
                                                  handleAddToCartClick(menu);
                                                }}
                                              >
                                                <i
                                                  className={`fa-solid ${
                                                    isMenuItemInCart(
                                                      menu.menu_id
                                                    )
                                                      ? "fa-circle-check text-success"
                                                      : "fa-plus text-secondary"
                                                  } fs-6`}
                                                ></i>
                                              </div>
                                            )}
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
              <div className="container">
                <RestaurantSocials />
              </div>
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
                  <Link
                    to="/user_app/Menu"
                    className="btn btn-outline-primary btn-sm"
                  >
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
                    <i className="fa-solid fa-lock me-2 fs-6"></i> Login
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
        <AddToCartUI
          showModal={showModal}
          setShowModal={setShowModal}
          productDetails={selectedMenu || {}}
          comment={comment}
          setComment={setComment}
          portionSize={portionSize}
          setPortionSize={setPortionSize}
          halfPrice={halfPrice}
          fullPrice={fullPrice}
          originalHalfPrice={selectedMenu?.half_price}
          originalFullPrice={selectedMenu?.full_price}
          isPriceFetching={isPriceFetching}
          handleConfirmAddToCart={handleConfirmAddToCart}
          handleSuggestionClick={(suggestion) => setComment(suggestion)}
          handleModalClick={(e) => {
            if (e.target.classList.contains("modal")) {
              setShowModal(false);
            }
          }}
        />
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}

      <Bottom />
    </div>
  );
};

export default Wishlist;
