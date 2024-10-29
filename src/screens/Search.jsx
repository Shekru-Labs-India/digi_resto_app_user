import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import Bottom from "../component/bottom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";

const Search = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("isDarkMode") === "true";
  });
  const isLoggedIn = !!localStorage.getItem("userData");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchedMenu, setSearchedMenu] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
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
  const { addToCart} = useCart();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setCustomerId(storedUserData.customer_id);
    }
  }, []);

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const items = await fetchCartItems();
        setCartItems(items);
      } catch (error) {
        console.error("Error loading cart items:", error);
      }
    };
    
    loadCartItems();
  }, []);

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
    setShowHistory(term.length > 0);
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
        console.error("Restaurant ID not found in userData");
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
          "https://menumitra.com/user_api/search_menu",
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
            console.error("Invalid data format:", data);
          }
        } else {
          console.error("Response not OK:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
        "https://menumitra.com/user_api/get_cart_detail_add_to_cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: localStorage.getItem("cartId"),
            customer_id: userData.customer_id,
            
            restaurant_id: restaurantId,
          }),
        }
      );
  
      const data = await response.json();
      return response.ok && data.st === 1 && data.order_items ? data.order_items : [];
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return [];
    }
  };

  const isMenuItemInCart = (menuId) => {
    return cartItems.some(item => item.menu_id === menuId);
  };

  const handleAddToCartClick = async (menu) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const storedRestaurantId = userData?.restaurantId;
    
    if (!userData?.customer_id) {
      navigate("/Signinscreen");
      return;
    }

    if (!storedRestaurantId) {
      window.showToast("error", "Restaurant information is missing");
      return;
    }

    // Check if item is already in cart
    const cartItems = await fetchCartItems();
    if (cartItems.some(item => item.menu_id === menu.menu_id)) {
      window.showToast("info", "This item is already in your cart");
      return;
    }

    try {
      setIsPriceFetching(true);
      const response = await fetch(
        "https://menumitra.com/user_api/get_full_half_price_of_menu",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurant_id: storedRestaurantId,
            menu_id: menu.menu_id,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.st === 1) {
        setHalfPrice(data.menu_detail.half_price);
        setFullPrice(data.menu_detail.full_price);
        setSelectedMenu({
          ...menu,
          restaurant_id: parseInt(storedRestaurantId, 10)
        });
        setPortionSize("full");
        setNotes("");
        setShowModal(true);
      } else {
        throw new Error(data.msg || "Failed to fetch price information");
      }
    } catch (error) {
      console.error("Error fetching half/full prices:", error);
      window.showToast("error", error.message || "Failed to fetch price information");
    } finally {
      setIsPriceFetching(false);
    }
  };

  const handleConfirmAddToCart = async () => {
    if (!selectedMenu) return;

    const userData = JSON.parse(localStorage.getItem("userData"));
    const storedRestaurantId = userData?.restaurantId;

    if (!userData?.customer_id) {
      navigate("/Signinscreen");
      return;
    }

    const selectedPrice = portionSize === "half" ? halfPrice : fullPrice;
    
    if (!selectedPrice) {
      window.showToast("error", "Price information is not available");
      return;
    }

    if (!storedRestaurantId) {
      window.showToast("error", "Restaurant information is missing");
      return;
    }

    try {
      const response = await fetch(
        "https://menumitra.com/user_api/add_to_cart",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: userData.customer_id,
            customer_type: userData.customer_type,
            restaurant_id: storedRestaurantId,
            menu_id: selectedMenu.menu_id,
            quantity: 1,
            half_or_full: portionSize,
            notes: notes,
          }),
        }
      );

      const data = await response.json();
      if (data.st === 1) {
        const updatedCartItems = await fetchCartItems();
        setCartItems(updatedCartItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        window.dispatchEvent(new CustomEvent("cartUpdated", { detail: updatedCartItems }));

        window.showToast("success", `${selectedMenu.menu_name} added successfully`);

        setShowModal(false);
        setNotes("");
        setPortionSize("full");
        setSelectedMenu(null);
      } else {
        throw new Error(data.msg || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      window.showToast("error", error.message || "Failed to add item to cart. Please try again.");
    }
  };

  const handleModalClick = (e) => {
    if (e.target.classList.contains("modal")) {
      setShowModal(false);
    }
  };

  const handleLikeClick = async (menuId) => {
    if (!customerId || !restaurantId) {
      console.error("Missing required data");
      navigate("/Signinscreen");
      return;
    }

    const menuItem = searchedMenu.find((item) => item.menu_id === menuId);
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
            customer_id: customerId,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1) {
          const updatedMenu = searchedMenu.map((item) =>
            item.menu_id === menuId
              ? { ...item, is_favourite: !isFavorite }
              : item
          );
          setSearchedMenu(updatedMenu);
          
          window.showToast(
            isFavorite ? "info" : "success",
            `${menuItem.menu_name} has been ${isFavorite ? "removed from" : "added to"} your favourites`
          );
        } else {
          throw new Error(data.msg || "Failed to update favourite status");
        }
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      window.showToast("error", "Failed to update favourite status");
    }
  };

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
    const menuItems = JSON.parse(localStorage.getItem("menuItems")) || [];
    const selectedMenuItem = menuItems.find((item) => item.menu_id === menuId);

    if (selectedMenuItem) {
      navigate(`/ProductDetails/${menuId}`, { state: { ...selectedMenuItem } });
    } else {
      console.error("Menu item not found in local storage");
    }
  };

  const handleHistoryClick = (term) => {
    setSearchTerm(term);
    setDebouncedSearchTerm(term);
    setShowHistory(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getFirstName = (name) => {
    if (!name) return "User";
    const words = name.split(" ");
    return words[0];
  };

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    localStorage.setItem("isDarkMode", newIsDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
    }
  }, [isDarkMode]);

  const userData = JSON.parse(localStorage.getItem("userData"));

  const isVegMenu = (menu_veg_nonveg) => {
    return menu_veg_nonveg.toLowerCase() === "veg";
  };

  return (
    <div className="page-wrapper">
      <Header title="Search" />

      <main className="page-content p-t80 p-b40">
        <div className="container py-0">
          <div className="d-flex justify-content-between align-items-center  my-2">
            <div className="d-flex align-items-center">
              <i className="ri-store-2-line me-2"></i>
              <span className="fw-medium font_size_14">
                {restaurantName.toUpperCase() || "Restaurant Name"}
              </span>
            </div>
            <div className="d-flex align-items-center">
              <i className="ri-user-location-line me-2 gray-text"></i>
              <span className="fw-medium font_size_12 gray-text">
                {customerId && customerId.tableNumber
                  ? `Table ${customerId.tableNumber}`
                  : "Table 1"}
              </span>
            </div>
          </div>
        </div>

        <div className="container pt-0">
          <div className="input-group w-100 my-2 border border-muted rounded-3">
            <span className="input-group-text py-0">
              <i className="ri-search-line fs-3 gray-text"></i>
            </span>
            <input
              type="search"
              className="form-control  ps-2     "
              placeholder="Search Best items for You"
              cd
              onChange={handleSearch}
              value={searchTerm}
            />
          </div>
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
              <div className="card mb-3 rounded-3">
                <div className="card-body py-0">
                  <div className="row">
                    <div className="col-3 px-0 position-relative">
                      <img
                        src={menu.image || images}
                        alt={menu.menu_name}
                        className="img-fluid rounded-start-3 rounded-end-0"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          aspectRatio: "1/1",
                        }}
                        onError={(e) => {
                          e.target.src = images;
                        }}
                      />
                      <div
                        className={`border bg-white opacity-75 d-flex justify-content-center align-items-center ${
                          isVegMenu(menu?.menu_veg_nonveg)
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
                            isVegMenu(menu?.menu_veg_nonveg)
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

                      {menu.offer > 0 && (
                        <div
                          className="gradient_bg d-flex justify-content-center align-items-center"
                          style={{
                            position: "absolute",
                            top: "0px",
                            left: "0px",
                            height: "17px",
                            width: "70px",
                            borderRadius: "7px 0px 7px 0px",
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

                    <div className="col-8 pb-0 pe-0 ps-2">
                      <div className="row">
                        <div className="col-12 mt-1">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="font_size_14 fw-medium">
                              {menu.menu_name}
                            </div>
                            <div className="text-end">
                              <i className="ri-star-half-line font_size_10 ratingStar"></i>
                              <span className="font_size_10 fw-normal gray-text">
                                {parseFloat(menu.rating).toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="row pe-0">
                          <div className="col-6 mt-1">
                            <span className="text-success font_size_12">
                              <i className="ri-restaurant-line mt-0 me-2"></i>
                              {menu.category_name}
                            </span>
                          </div>
                          <div className="col-6 pe-0 text-end">
                            {menu.spicy_index && (
                              <span className="ms-2 spicy-index">
                                {Array.from({ length: 5 }).map((_, index) =>
                                  index < menu.spicy_index ? (
                                    <i
                                      key={index}
                                      className="ri-fire-fill text-danger font_size_14 firefill offer-code"
                                    ></i>
                                  ) : (
                                    <i
                                      key={index}
                                      className="ri-fire-line gray-text font_size_14"
                                    ></i>
                                  )
                                )}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="row mt-2 pe-0">
                          <div className="col-10 px-0">
                            <span className="mb-0 mt-1 text-start fw-medium">
                              <span className="ms-3 me-1 font_size_14 fw-semibold text-info">
                                ₹{menu.price}
                              </span>
                              <span className="gray-text text-decoration-line-through font_size_12 fw-normal">
                                ₹{menu.oldPrice || menu.price}
                              </span>
                            </span>
                          </div>
                          <div className="col-2 px-0 d-flex justify-content-end">
                            {userData ? (
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
                                  handleAddToCartClick(menu);
                                }}
                              >
                                <i className={`ri-shopping-cart-${isMenuItemInCart(menu.menu_id) ? "fill" : "line"} fs-6`}></i>
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

export default Search;
