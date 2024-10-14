import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import Bottom from "../component/bottom";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/saga-blue/theme.css"; // Choose a theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

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

  const userData = JSON.parse(localStorage.getItem("userData"));
  const restaurantId = userData ? userData.restaurantId : null;
  const customerId = userData ? userData.customer_id : null;

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

  return (
    <div className="page-wrapper">
      {/* Header */}
      <header className="header header-fixed style-3" style={{ zIndex: "999" }}>
        <div className="header-content">
          <div className="search-area">
            <div onClick={() => navigate(-1)} className="back-btn dz-icon">
              <i className="ri-arrow-left-line fs-3"></i>
            </div>
            <div className="mid-content">
              <span className="custom_font_size_bold me-5">Search</span>
            </div>
          </div>
        </div>

        <header className="header header-fixed style-3">
          <div className="header-content">
            <div
              className={`page-wrapper ${sidebarOpen ? "sidebar-open" : ""}`}
            >
              <header className="header header-fixed pt-2">
                <div className="header-content d-flex justify-content-between">
                  <div className="left-content">
                    <Link
                      className="back-btn dz-icon icon-sm"
                      onClick={() => navigate(-1)}
                    >
                      <i className="ri-arrow-left-line fs-2"></i>
                    </Link>
                  </div>
                  <div className="mid-content">
                    <span className="custom_font_size_bold me-3 title">
                  Search
                    </span>
                  </div>
                  <div className="right-content gap-1">
                    <div className="menu-toggler" onClick={toggleSidebar}>
                      {isLoggedIn ? (
                        <i className="ri-menu-line fs-1"></i>
                      ) : (
                        <Link to="/Signinscreen">
                          <i className="ri-login-circle-line fs-1"></i>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </header>

              {/* Dark overlay for sidebar */}
              <div
                className={`dark-overlay ${
                  sidebarOpen ? "dark-overlay active" : ""
                }`}
                onClick={toggleSidebar}
              ></div>

              {/* Sidebar */}
              <div className={`sidebar ${sidebarOpen ? "sidebar show" : ""}`}>
                <div className="author-box">
                  <div className="d-flex justify-content-start align-items-center m-0">
                    <i
                      className={
                        userData && userData.customer_id
                          ? "ri-user-3-fill fs-3"
                          : "ri-user-3-line fs-3"
                      }
                    ></i>
                  </div>
                  <div className="custom_font_size_bold">
                    <span className="ms-3 pt-4">
                      {userData?.name
                        ? `Hello, ${toTitleCase(getFirstName(userData.name))}`
                        : "Hello, User"}
                    </span>
                    <div className="mail ms-3 gray-text custom_font_size_bold">
                      {userData?.mobile}
                    </div>
                    <div className="dz-mode mt-3 me-4">
                      <div className="theme-btn" onClick={toggleTheme}>
                        <i
                          className={`ri ${
                            isDarkMode ? "ri-sun-line" : "ri-moon-line"
                          } sun`}
                        ></i>
                        <i
                          className={`ri ${
                            isDarkMode ? "ri-moon-line" : "ri-sun-line"
                          } moon`}
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
                <ul className="nav navbar-nav">
                  <li>
                    <Link className="nav-link active" to="/Menu">
                      <span className="dz-icon icon-sm">
                        <i className="ri-bowl-line fs-3"></i>
                      </span>
                      <span className="custom_font_size_bold">Menu</span>
                    </Link>
                  </li>
                  <li>
                    <Link className="nav-link active" to="/Category">
                      <span className="dz-icon icon-sm">
                        <i className="ri-list-check-2 fs-3"></i>
                      </span>
                      <span className="custom_font_size_bold">Category</span>
                    </Link>
                  </li>
                  <li>
                    <Link className="nav-link active" to="/Wishlist">
                      <span className="dz-icon icon-sm">
                        <i className="ri-heart-2-line fs-3"></i>
                      </span>
                      <span className="custom_font_size_bold">Favourite</span>
                    </Link>
                  </li>
                  <li>
                    <Link className="nav-link active" to="/MyOrder">
                      <span className="dz-icon icon-sm">
                        <i className="ri-drinks-2-line fs-3"></i>
                      </span>
                      <span className="custom_font_size_bold">My Orders</span>
                    </Link>
                  </li>
                  <li>
                    <Link className="nav-link active" to="/Cart">
                      <span className="dz-icon icon-sm">
                        <i className="ri-shopping-cart-line fs-3"></i>
                      </span>
                      <span className="custom_font_size_bold">Cart</span>
                    </Link>
                  </li>
                  <li>
                    <Link className="nav-link active" to="/Profile">
                      <span className="dz-icon icon-sm">
                        <i
                          className={
                            userData && userData.customer_id
                              ? "ri-user-3-fill fs-3"
                              : "ri-user-3-line fs-3"
                          }
                        ></i>
                      </span>
                      <span className="custom_font_size_bold">Profile</span>
                    </Link>
                  </li>
                </ul>
                {/* <div className="dz-mode mt-4 me-4">
          <div className="theme-btn" onClick={toggleTheme}>
            <i
              className={`ri ${
                isDarkMode ? "ri-sun-line" : "ri-moon-line"
              } sun`}
            ></i>
            <i
              className={`ri ${
                isDarkMode ? "ri-moon-line" : "ri-sun-line"
              } moon`}
            ></i>
          </div>
        </div> */}
                <div className="sidebar-bottom"></div>
              </div>
            </div>
          </div>
        </header>
      </header>

      {/* Main Content Start */}
      <main className="page-content p-t80 p-b40">
        <Toast ref={toast} position="bottom-center" className="custom-toast" />
        <div className="container pt-0">
          <div className="input-group w-100 my-2 border border-muted rounded-3">
            <span className="input-group-text py-0">
              <i className="ri-search-line fs-3 gray-text "></i>
            </span>
            <input
              type="search"
              className="form-control bg-white ps-2 custom_font_size_bold"
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
              <div
                className="custom_font_size_bold gray-text"
                onClick={handleClearAll}
              >
                Clear All
              </div>
            </div>
          )}

          {isLoading && <p>Loading...</p>}

          {searchedMenu.map((menu) => (
            <>
              <div className="card mb-3 rounded-4" key={menu.menu_id}>
                <div className="card-body py-0">
                  <div className="row ">
                    <div className="col-3 px-0">
                      <img
                        src={menu.image || images}
                        alt={menu.menu_name}
                        className="img-fluid rounded-start-3 rounded-end-0"
                        style={{ width: "100%", height: "100%", objectFit: "fill", aspectRatio: "1/1" }}
                        onError={(e) => {
                          e.target.src = images;
                        }}
                        onClick={() => handleMenuClick(menu.menu_id)}
                      />
                    </div>
                    <div className="col-8 pt-3 pb-0 pe-0 ps-2 ">
                      <div className="custom_font_size_bold">
                        {menu.menu_name}
                      </div>
                      <div className="row">
                        <div className="col-7 mt-1 pe-0">
                          <span
                            onClick={() => handleMenuClick(menu.menu_id)}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="mt-0">
                              <i className="ri-restaurant-line mt-0 me-2  category-text fs-xs fw-medium"></i>
                              <span className="category-text fs-xs fw-medium ">
                                {menu.category_name}
                              </span>
                            </div>
                          </span>
                        </div>

                        <div className="col-4 text-end ms-3 me-0 p-0 mt-1">
                          <span
                            onClick={() => handleMenuClick(menu.menu_id)}
                            style={{ cursor: "pointer" }}
                          >
                            <span className="custom_font_size_bold gray-text">
                              <i className="ri-star-half-line ms-4  ratingStar"></i>
                              {parseFloat(menu.rating).toFixed(1)}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-8 px-0">
                          <span
                            className="mb-0 mt-1 custom_font_size text-start fw-medium"
                            onClick={() => handleMenuClick(menu.menu_id)}
                            style={{ cursor: "pointer" }}
                          >
                            <span className="ms-3 me-1 text-info">
                              ₹{menu.price}
                            </span>
                            <span className="gray-text custom_font_size  old-price text-decoration-line-through">
                              ₹{menu.oldPrice || menu.price}
                            </span>
                          </span>

                          <span
                            className="mb-0 mt-1 ms-2 custom_font_size offerSearch"
                            onClick={() => handleMenuClick(menu.menu_id)}
                           
                          >
                            <span className="custom_font_size px-0 pe-4 text-start offer-color  offer ">
                              {menu.offer || "No "}% Off
                            </span>
                          </span>
                        </div>
                        <div className="col-4 text-center p-0 clickable-icon search-like">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikeClick(menu.menu_id);
                            }}
                          >
                            <i
                              className={`${
                                menu.is_favourite
                                  ? "ri-hearts-fill fs-3"
                                  : "ri-heart-2-line fs-3"
                              }`}
                              style={{
                                color: menu.is_favourite ? "red" : "",
                              }}
                            ></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-1 px-0 pt-2">
                      <span
                        className=" fs-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(menu.menu_id);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="ri-close-line fs-4"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

             

             
            </>
          ))}
        </div>
      </main>
      <Bottom />
    </div>
  );
};

export default Search;
