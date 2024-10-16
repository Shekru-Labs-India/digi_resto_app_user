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
            {userData && userData.tableNumber ? `Table ${userData.tableNumber}` : "Table 1"}
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
              placeholder="Search Best items for You"cd
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
                className="    gray-text"
                onClick={handleClearAll}
              >
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
                      <div className="col-3 px-0">
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
                      </div>
                      <div className="col-8 pt-3 pb-0 pe-0 ps-2">
                        <div className="font_size_14 fw-medium">{menu.menu_name}</div>
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
                        <div className="row mt-2">
                          <div className="col-8 px-0">
                            <span className="mb-0 mt-1   text-start fw-medium">
                              <span className="ms-3 me-1 font_size_14 fw-semibold text-info">
                                ₹{menu.price}
                              </span>
                              <span className="gray-text text-decoration-line-through font_size_12 fw-normal">
                                ₹{menu.oldPrice || menu.price}
                              </span>
                            </span>

                            <span className="ms-2  text-start font_size_12 text-success">
                              {menu.offer || "No "}% Off
                            </span>
                          </div>
                          <div className="col-4 text-center p-0 clickable-icon search-like">
                            <i
                              className={`${
                                menu.is_favourite
                                  ? "ri-hearts-fill fs-3"
                                  : "ri-heart-2-line fs-3"
                              }`}
                              style={{
                                color: menu.is_favourite ? "red" : "",
                                cursor: "pointer",
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleLikeClick(menu.menu_id);
                              }}
                            ></i>
                          </div>
                        </div>
                      </div>
                      <div className="col-1 px-0 pt-2">
                        <span
                          className="fs-4"
                          onClick={(e) => {
                            e.preventDefault();
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
              </Link>
            </>
          ))}
        </div>
      </main>
      <Bottom />
    </div>
  );
};

export default Search;
