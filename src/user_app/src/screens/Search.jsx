import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import Bottom from "../component/bottom";

import { useRestaurantId } from "../context/RestaurantIdContext";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { usePopup } from '../context/PopupContext';
import config from "../component/config"
const Search = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize state from local storage
    return localStorage.getItem("isDarkMode") === "true";
  }); // State for theme
  const isLoggedIn = !!localStorage.getItem("userData");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchedMenu, setSearchedMenu] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false); // Track if history should be shown
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { restaurantName } = useRestaurantId();
  const { restaurantId } = useRestaurantId();
  const [customerId, setCustomerId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [portionSize, setPortionSize] = useState("full");
  const [notes, setNotes] = useState("");
  const [halfPrice, setHalfPrice] = useState(null);
  const [fullPrice, setFullPrice] = useState(null);
  const [isPriceFetching, setIsPriceFetching] = useState(false);
  const { addToCart, isMenuItemInCart } =
    useCart();
  const { showLoginPopup } = usePopup();

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setCustomerId(storedUserData.customer_id);
    }
  }, []);

  const [userData, setUserData] = useState(() =>
    JSON.parse(localStorage.getItem("userData"))
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    setShowHistory(term.length > 0); // Show history only when there's input
  };

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(storedHistory);
  }, []);

  useEffect(() => {
    const fetchSearchedMenu = async () => {
      if (!restaurantId) {
        return;
      }

      if (
        debouncedSearchTerm.trim().length < 3 ||
        debouncedSearchTerm.trim().length > 10
      ) {
        setSearchedMenu([]);
        return;
      }

      setIsLoading(true);

      try {
        const requestBody = {
          restaurant_id: parseInt(restaurantId, 10),
          keyword: debouncedSearchTerm.trim(),
          customer_id: customerId || null,
        };

        const response = await fetch(
           `${config.apiDomain}/user_api/search_menu`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.st === 1 && Array.isArray(data.menu_list)) {
            const formattedMenu = data.menu_list.map((menu) => ({
              ...menu,
              menu_name: toTitleCase(menu.menu_name),
              is_favourite: menu.is_favourite === 1,
              oldPrice: Math.floor(menu.price * 1.1),
            }));
            setSearchedMenu(formattedMenu);
            // Update search history
            const updatedHistory = [
              debouncedSearchTerm,
              ...searchHistory.filter((term) => term !== debouncedSearchTerm),
            ];
            setSearchHistory(updatedHistory);
            localStorage.setItem(
              "searchHistory",
              JSON.stringify(updatedHistory)
            );
          } else {
           
          }
        } else {
         
        }
      } catch (error) {
       
      }

      setIsLoading(false);
    };

    fetchSearchedMenu();
  }, [debouncedSearchTerm, restaurantId]);

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
            cart_id: localStorage.getItem("cartId") || "",
            customer_id: userData.customer_id,
            restaurant_id: restaurantId,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.st === 1) {
        if (data.cart_id) {
          localStorage.setItem("cartId", data.cart_id);
        }
        return data.order_items || [];
      }
      return [];
    } catch (error) {
     
      return [];
    }
  };

  const handleCardClick = (menuId) => {
    navigate(`/user_app/ProductDetails/${menuId}`); // Updated path
  };

  useEffect(() => {
    const handleCartUpdate = () => {
      if (restaurantId) {
        fetchCartItems();
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [fetchCartItems, restaurantId]);

  const handleAddToCartClick = (menu) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    // if (!userData?.customer_id || userData.customer_type === 'guest') {
    //   showLoginPopup();
    //   return;
    // }

    if (isMenuItemInCart(menu.menu_id)) {
      window.showToast("info", "This item is already in your cart");
      return;
    }

    setSelectedMenu(menu);
    fetchHalfFullPrices(menu.menu_id);
    setShowModal(true);
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
      } else {
     
        window.showToast("error", "Failed to fetch price information");
      }
    } catch (error) {
    
      window.showToast("error", "Failed to fetch price information");
    } finally {
      setIsPriceFetching(false);
    }
  };

  const handleConfirmAddToCart = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    // if (!userData?.customer_id || userData.customer_type === 'guest') {
    //   showLoginPopup();
    //   return;
    // }

    if (!selectedMenu) return;

    const selectedPrice = portionSize === "half" ? halfPrice : fullPrice;

    if (!selectedPrice) {
      window.showToast("error", "Price information is not available");
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

      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
    
      window.showToast("error", "Failed to add item to cart. Please try again");
    }
  };

  const handleModalClick = (e) => {
    if (e.target.classList.contains("modal")) {
      setShowModal(false);
    }
  };

  const handleUnauthorizedFavorite = () => {
    showLoginPopup();
  };


  const handleLikeClick = async (menuId) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id || userData.customer_type === 'guest') {
      showLoginPopup();
      return;
    }

    const menuItem = searchedMenu.find((item) => item.menu_id === menuId);
    if (!menuItem) return;

    const isFavorite = menuItem.is_favourite;

    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/${isFavorite ? 'remove' : 'save'}_favourite_menu`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            menu_id: menuId,
            customer_id: userData.customer_id,
            customer_type: userData.customer_type
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.st === 1) {
        setSearchedMenu((prevMenu) =>
          prevMenu.map((item) =>
            item.menu_id === menuId ? { ...item, is_favourite: !isFavorite } : item
          )
        );

        window.dispatchEvent(
          new CustomEvent("favoriteStatusChanged", {
            detail: { menuId, isFavorite: !isFavorite },
          })
        );

        window.showToast(
          "success", 
          isFavorite ? "Removed from favorites" : "Added to favorites"
        );
      }
    } catch (error) {
      
      window.showToast("error", "Failed to update favorite status");
    }
  };

  // Add this useEffect to handle favorite updates from other components
  useEffect(() => {
    const handleFavoriteUpdate = (event) => {
      const { menuId, isFavorite } = event.detail;
      setSearchedMenu((prevMenu) =>
        prevMenu.map((item) =>
          item.menu_id === menuId ? { ...item, is_favourite: isFavorite } : item
        )
      );
    };

    window.addEventListener("favoriteStatusChanged", handleFavoriteUpdate);
    return () => {
      window.removeEventListener("favoriteStatusChanged", handleFavoriteUpdate);
    };
  }, []);

  const handleRemoveItem = (menuId) => {
    const menuItem = searchedMenu.find((item) => item.menu_id === menuId);
    setSearchedMenu(searchedMenu.filter((item) => item.menu_id !== menuId));
    window.showToast("warn", `${menuItem.menu_name} has been removed from the search list`);
  };

  const handleClearAll = () => {
    setSearchedMenu([]);
    setSearchTerm("");
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  const handleMenuClick = (menuId) => {
    const menu = searchedMenu.find(item => item.menu_id === menuId);
    if (menu) {
      navigate(`/user_app/ProductDetails/${menuId}`, {
        state: { ...menu }
      });
    }
  };

  const handleHistoryClick = (term) => {
    setSearchTerm(term);
    setDebouncedSearchTerm(term);
    setShowHistory(false); // Hide history when a term is clicked
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

  const isVegMenu = (menu_veg_nonveg) => {
    return menu_veg_nonveg.toLowerCase() === "veg";
  };

  useEffect(() => {
    const handleCartUpdate = () => {
      if (restaurantId) {
        fetchCartItems();
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [fetchCartItems, restaurantId]);

  const handleError = () => {
    window.showToast("error", "Failed to load search results");
    navigate(`/user_app/${restaurantId}/${userData?.tableNumber || "1"}`); // Updated path
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <Header title="Search" />

      {/* Main Content Start */}
      <main className="page-content p-t80 p-b40">
        <div className="container py-0">
          <div className="d-flex justify-content-between align-items-center  my-2">
            <Link to={`/user_app/restaurant/`}>
              <div className="d-flex align-items-center">
                <i className="ri-store-2-line me-2"></i>
                <span className="fw-medium font_size_14">
                  {restaurantName.toUpperCase() || "Restaurant Name"}
                </span>
              </div>
            </Link>
            <div className="d-flex align-items-center">
              <i className="ri-map-pin-user-fill font_size_12 me-2 gray-text"></i>
              <span className="fw-medium font_size_12 gray-text">
                {`Table ${
                  JSON.parse(localStorage.getItem("userData"))?.tableNumber ||
                  localStorage.getItem("tableNumber") ||
                  "1"
                }`}
              </span>
            </div>
          </div>
        </div>

        <div className="container pt-0">
          <div className="input-group w-100 my-2 border border-muted rounded-4">
            <span className="input-group-text py-0">
              <i className="ri-search-line fs-3 text-primary"></i>
            </span>
            <input
              type="search"
              className="form-control  ps-2     "
              placeholder="Search Best items for You"
              onChange={handleSearch}
              value={searchTerm}
            />
          </div>
          {/* {searchHistory.length > 0 && (
            <div className="search-history">
              <h6 className="gray-text">Search History</h6>
              <ul>
                {searchHistory.map((term, index) => (
                  <li className="h6" key={index} onClick={() => handleHistoryClick(term)}>
                    {term}
                  </li>
                ))}
              </ul>
            </div>
          )} */}

          {debouncedSearchTerm && (
            <div className="title-bar my-3 ">
              <div className="fw-normal fs-6 gray-text"></div>
              <div className="    gray-text" onClick={handleClearAll}>
                Clear All
              </div>
            </div>
          )}

          {isLoading && <p>Loading...</p>}

          {searchedMenu.map((menu) => (
            <div key={menu.menu_id} className="col-12">
              <div
                className="card mb-3 rounded-4"
                onClick={() => handleMenuClick(menu.menu_id)}
                style={{ cursor: "pointer" }}
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
                        className={`border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center`}
                        style={{
                          position: "absolute",
                          bottom: "3px",
                          right: "76%",
                          height: "20px",
                          width: "20px",
                        }}
                      >
                        <i
                          className={`${
                            menu.is_favourite
                              ? "ri-heart-3-fill text-danger"
                              : "ri-heart-3-line"
                          } fs-6`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleLikeClick(menu.menu_id);
                          }}
                        ></i>
                      </div>
                      <div
                        className={`border rounded-3 bg-white opacity-75 d-flex justify-content-center align-items-center ${
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
                              : "ri-triangle-fill text-danger"
                          } font_size_12`}
                        ></i>
                      </div>
                      {menu.offer && menu.offer !== "0" && (
                        <div className="gradient_bg d-flex justify-content-center align-items-center gradient_bg_offer">
                          <span className="font_size_10 text-white">
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
                      </div>
                      <div className="row mt-1">
                        <div className="col-5 text-start d-flex align-items-center">
                          <span className="ps-2 font_size_10 text-success">
                            <i className="ri-restaurant-line mt-0 me-1"></i>
                            {menu.category_name}
                          </span>
                        </div>
                        <div className="col-3 d-flex aign-items-center">
                          {menu.spicy_index && (
                            <div className="">
                              {Array.from({ length: 5 }).map((_, index) =>
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
                        <div className="col-4 d-flex align-items-center justify-content-end text-start">
                          <i className="ri-star-half-line font_size_10 ratingStar "></i>
                          <span className="font_size_10 fw-normal gray-text">
                            {menu.rating || 0.1}
                          </span>
                        </div>
                      </div>

                      <div className="row mt-1">
                        <div className="col-6">
                          <p className="ms-2 mb-0 fw-medium">
                            {menu.offer ? (
                              <>
                                <span className="font_size_14 fw-semibold text-info">
                                  ₹
                                  {Math.floor(
                                    menu.price * (1 - menu.offer / 100)
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

                        <div className="col-6 d-flex justify-content-end">
                          {customerId && (
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
                                  isMenuItemInCart(menu.menu_id)
                                    ? "fill text-black"
                                    : "line"
                                } fs-6`}
                              ></i>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
              {/* Updated Header */}
              <div className="modal-header ps-3 pe-2">
                <div className="col-6 text-start">
                  <div className="modal-title font_size_16 fw-medium">
                    Add to Cart
                  </div>
                </div>

                <div className="col-6 text-end">
                  <div className="d-flex justify-content-end">
                    <span
                      className="btn-close m-2 font_size_12"
                      onClick={() => setShowModal(false)}
                      aria-label="Close"
                    >
                      <i className="ri-close-line"></i>
                    </span>
                  </div>
                </div>
              </div>

              {/* Updated Body */}
              <div className="modal-body py-2 px-3">
                <div className="mb-3 mt-0">
                  <label
                    htmlFor="notes"
                    className="form-label d-flex justify-content-start font_size_14 fw-normal"
                  >
                    Special Instructions
                  </label>
                  <textarea
                    className="form-control font_size_16 border border-primary rounded-4"
                    id="notes"
                    rows="2"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any special instructions here..."
                  />
                </div>
                <hr className="my-4" />
                <div className="mb-2">
                  <label className="form-label d-flex justify-content-between">
                    Select Portion Size
                  </label>
                  <div className="d-flex justify-content-between">
                    {isPriceFetching ? (
                      <p>Loading prices...</p>
                    ) : (
                      <>
                        <button
                          type="button"
                          className={`btn px-4 font_size_14 ${
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
                          className={`btn px-4 font_size_14 ${
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

              {/* Updated Footer */}
              <div className="modal-body d-flex justify-content-around px-0 pt-2 pb-3">
                <button
                  type="button"
                  className="btn px-4 font_size_14 btn-outline-primary rounded-pill"
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
                  <i className="ri-shopping-cart-line pe-2 text-white"></i>
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

export default Search;