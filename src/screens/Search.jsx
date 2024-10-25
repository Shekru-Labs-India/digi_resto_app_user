import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import Bottom from "../component/bottom";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/saga-blue/theme.css"; // Choose a theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useRestaurantId } from "../context/RestaurantIdContext";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";

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
  const toast = useRef(null);
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
  const { addToCart } = useCart();

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setCustomerId(storedUserData.customer_id);
    }
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

  const fetchHalfFullPrices = async (menuId) => {
    setIsPriceFetching(true);
    try {
      const response = await fetch(
        "https://menumitra.com/user_api/get_full_half_price_of_menu",
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
        console.error("API Error:", data.msg);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: data.msg || "Failed to fetch price information",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching half/full prices:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch price information",
        life: 3000,
      });
    } finally {
      setIsPriceFetching(false);
    }
  };

  const handleAddToCartClick = (menu) => {
    if (!customerId) {
      navigate("/Signinscreen");
      return;
    }

    setSelectedMenu(menu);
    setPortionSize("full");
    fetchHalfFullPrices(menu.menu_id);
    setShowModal(true);
  };

  const handleConfirmAddToCart = async () => {
    if (!selectedMenu) return;

    const selectedPrice = portionSize === "half" ? halfPrice : fullPrice;

    if (!selectedPrice) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Price information is not available.",
        life: 2000,
      });
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
        customerId,
        restaurantId
      );

      toast.current.show({
        severity: "success",
        summary: "Added to Cart",
        detail: selectedMenu.menu_name,
        life: 3000,
      });

      setShowModal(false);
      setNotes("");
      setPortionSize("full");
      setSelectedMenu(null);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to add item to cart. Please try again.",
        life: 3000,
      });
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
          const updatedMenu = searchedMenu.map((item) =>
            item.menu_id === menuId
              ? { ...item, is_favourite: !isFavorite }
              : item
          );
          setSearchedMenu(updatedMenu);
          toast.current.show({
            severity: isFavorite ? "info" : "success",
            summary: isFavorite
              ? "Removed from Favourites"
              : "Added to Favourites",
            detail: `${menuItem.menu_name} has been ${
              isFavorite ? "removed from" : "added to"
            } your favourites.`,
            life: 2000,
          });
        } else {
          console.error("Failed to update favourite status:", data.msg);
        }
      } else {
        console.error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const handleRemoveItem = (menuId) => {
    const menuItem = searchedMenu.find((item) => item.menu_id === menuId);
    setSearchedMenu(searchedMenu.filter((item) => item.menu_id !== menuId));
    toast.current.show({
      severity: "warn",
      summary: "Item Removed",
      detail: `${menuItem.menu_name} has been removed from the search list.`,
      life: 2000,
    });
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

  const isMenuItemInCart = (menuId) => {
    // Implement the logic to check if the menu item is in the cart
    // This is a placeholder implementation
    return false;
  };

  const userData = JSON.parse(localStorage.getItem("userData"));

  return (
    <div className="page-wrapper">
      {/* Header */}
      <Header title="Search" />

      {/* Main Content Start */}
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

        <Toast ref={toast} position="bottom-center" className="custom-toast" />
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
            <>
              <Link
                to={`/ProductDetails/${menu.menu_id}`}
                state={{ menu_cat_id: menu.menu_cat_id }}
                className="text-decoration-none text-reset"
              >
                <div className="card mb-3 rounded-4" key={menu.menu_id}>
                  <div className="card-body py-0">
                    <div className="row">
                      <div
                        className="col-3 px-0"
                        style={{ position: "relative", left: "-1px" }}
                      >
                        <img
                          src={menu.image || images}
                          alt={menu.menu_name}
                          className="img-fluid rounded-start-3 rounded-end-0"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "fill",
                            aspectRatio: "1/1",
                          }}
                          onError={(e) => {
                            e.target.src = images;
                          }}
                        />
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
                                ? "ri-hearts-fill text-danger"
                                : "ri-heart-2-line"
                            } fs-6`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleLikeClick(menu.menu_id);
                            }}
                          ></i>
                        </div>
                      </div>
                      <div className="col-8  pb-0 pe-0 ps-2">
                        <div className="row">
                          <div className="col-7 mt-1 pe-0">
                            <span className="text-success font_size_12">
                              <i className="ri-restaurant-line mt-0 me-2"></i>
                              {menu.category_name}
                            </span>
                          </div>

                          <div className="col-4 text-end ms-3 me-0 p-0 mt-1">
                            <i className="ri-star-half-line font_size_14 ms-4 ratingStar "></i>
                            <span className="font_size_12 fw-normal gray-text">
                              {parseFloat(menu.rating).toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div className="font_size_14 fw-medium pt-3">
                          {menu.menu_name}
                        </div>

                        <div className="row mt-2">
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
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </>
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
                    className="form-control fs-6"
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
