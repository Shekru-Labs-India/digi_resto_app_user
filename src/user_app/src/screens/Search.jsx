import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import Bottom from "../component/bottom";
import "../assets/css/toast.css";
import { useRestaurantId } from "../context/RestaurantIdContext";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { usePopup } from "../context/PopupContext";
import config from "../component/config";
import RestaurantSocials from "../components/RestaurantSocials";
import HotelNameAndTable from "../components/HotelNameAndTable";
import { renderSpicyLevel } from "../component/config";
import AddToCartUI from '../components/AddToCartUI';
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
  const { addToCart, isMenuItemInCart } = useCart();
  const { showLoginPopup } = usePopup();
  const [customerType, setCustomerType] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [originalMenu, setOriginalMenu] = useState([]); // Store original menu items
  const [foodTypes, setFoodTypes] = useState([]);
  const [selectedFoodType, setSelectedFoodType] = useState(null);
  const [priceFilter, setPriceFilter] = useState('low');
  const [spicyFilter, setSpicyFilter] = useState(null); // Add this state

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setCustomerId(storedUserData.customer_id);
    }
  }, []);

  const [userData, setUserData] = useState(() =>
    JSON.parse(localStorage.getItem("userData"))
  );

  // Fetch food types from the API
  const fetchFoodTypes = async () => {
    try {
      const response = await fetch(`${config.apiDomain}/user_api/get_food_type_list`);
      const data = await response.json();
      
      if (data.st === 1) {
        setFoodTypes(Object.values(data.food_type_list));
      }
    } catch (error) {
      console.error('Error fetching food types:', error);
    }
  };

  useEffect(() => {
    fetchFoodTypes();
  }, []);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Combined search and filter effect
  useEffect(() => {
    const fetchSearchedMenu = async () => {
      if (!restaurantId) return;

      if (debouncedSearchTerm.trim().length < 3 || debouncedSearchTerm.trim().length > 10) {
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

        const response = await fetch(`${config.apiDomain}/user_api/search_menu`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

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
      } catch (error) {}

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
        if (data.menu_detail.half_price === null) {
          setPortionSize("full");
        }
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

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      window.showToast("error", "Failed to add item to cart. Please try again");
    }
  };

  const handleModalClick = (e) => {
    if (e.target.classList.contains("modal")) {
      setShowModal(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Simply set the suggestion as the new note value
    setNotes(suggestion);
  };

  const handleUnauthorizedFavorite = () => {
    showLoginPopup();
  };

  const handleLikeClick = async (menuId) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id || userData.customer_type === "guest") {
      showLoginPopup();
      return;
    }

    const menuItem = searchedMenu.find((item) => item.menu_id === menuId);
    if (!menuItem) return;

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
        setSearchedMenu((prevMenu) =>
          prevMenu.map((item) =>
            item.menu_id === menuId
              ? { ...item, is_favourite: !isFavorite }
              : item
          )
        );

        window.dispatchEvent(
          new CustomEvent("favoriteStatusChanged", {
            detail: { menuId, isFavorite: !isFavorite },
          })
        );

        window.showToast(
          "success",
          isFavorite ? "Removed from favourite" : "Added to favourite"
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
    window.showToast(
      "warn",
      `${menuItem.menu_name} has been removed from the search list`
    );
  };



  const handleMenuClick = (menuId) => {
    const menu = searchedMenu.find((item) => item.menu_id === menuId);
    if (menu) {
      navigate(`/user_app/ProductDetails/${menuId}`, {
        state: { ...menu },
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


    
   const getFoodTypeTextStyles = (foodType) => {
     switch (foodType?.toLowerCase()) {
       case "veg":
         return {
           icon: "fa-solid fa-circle",
           textColor: "text-primary",
         };
       case "nonveg":
         return {
           icon: "fa-solid fa-play fa-rotate-270",
           textColor: "text-danger",
         };
       case "egg":
         return {
           icon: "fa-solid fa-egg",
           textColor: "text-light",
         };
       case "vegan":
         return {
           icon: "fa-solid fa-leaf",
           textColor: "text-success",
         };
       default:
         return {
           icon: "fa-solid fa-circle",
           textColor: "text-primary",
         };
     }
   };

   const getFoodTypeStyles = (foodType) => {
     switch (foodType?.toLowerCase()) {
       case "veg":
         return {
           icon: "fa-solid fa-circle text-primary",
           border: "border-primary",
         };
       case "nonveg":
         return {
           icon: "fa-solid fa-play fa-rotate-270 text-danger",
           border: "border-danger",
         };
       case "egg":
         return {
           icon: "fa-solid fa-egg text-light",
           border: "border-light",
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
    // Apply the theme class based on the current state
    if (isDarkMode) {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
    }
  }, [isDarkMode]); // Depend on isDarkMode to re-apply on state change

  const isVegMenu = (menu_veg_nonveg) => {
    return menu_veg_nonveg === "veg";
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

  // Add the standardized rating function
  const renderStarRating = (rating) => {
    const numRating = parseFloat(rating);

    if (!numRating || numRating < 0.5) {
      return <i className="font_size_10 text-warning me-1"></i>;
    }

    if (numRating >= 0.5 && numRating <= 2.5) {
      return (
        <i className="fa-solid fa-star-half-stroke font_size_10 text-warning me-1"></i>
      );
    }

    if (numRating >= 3 && numRating <= 4.5) {
      return (
        <i className="fa-solid fa-star-half-stroke font_size_10 text-warning me-1"></i>
      );
    }

    if (numRating === 5) {
      return <i className="fa-solid fa-star font_size_10 text-warning me-1"></i>;
    }

    return (
      <i className="fa-solid fa-star-half-stroke font_size_10 text-warning me-1"></i>
    );
  };

  const handleFilter = (filterType) => {
    if (!filterType) {
      setSelectedFoodType(null);
      setSearchedMenu(originalMenu);
      return;
    }

    const safeFilterType = String(filterType).toLowerCase();
    
    if (selectedFoodType === filterType) {
      setSelectedFoodType(null);
      setSearchedMenu(originalMenu);
    } else {
      setSelectedFoodType(filterType);
      const filteredMenu = originalMenu.filter(menu => {
        const menuFoodType = menu.menu_food_type ? String(menu.menu_food_type).toLowerCase() : '';
        return menuFoodType === safeFilterType;
      });
      setSearchedMenu(filteredMenu);
    }
  };

  // Update originalMenu when searchedMenu is initially loaded
  useEffect(() => {
    setOriginalMenu(searchedMenu);
  }, []); // Empty dependency array means this runs once on mount

  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    setDebouncedSearchTerm(searchValue);
    setShowHistory(searchValue.length > 0);

    if (searchValue.trim().length < 3 || searchValue.trim().length > 10) {
      setSearchedMenu([]);
      return;
    }

    setIsLoading(true);

    try {
      const requestBody = {
        restaurant_id: parseInt(restaurantId, 10),
        keyword: searchValue.trim(),
        customer_id: customerId || null,
      };

      const response = await fetch(`${config.apiDomain}/user_api/search_menu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1 && Array.isArray(data.menu_list)) {
          const formattedMenu = data.menu_list.map((menu) => ({
            ...menu,
            menu_name: toTitleCase(menu.menu_name),
            is_favourite: menu.is_favourite === 1,
            oldPrice: Math.floor(menu.price * 1.1),
          }));

          // Apply food type filter if selected
          let filteredMenu = formattedMenu;
          if (selectedFoodType) {
            const safeSelectedType = String(selectedFoodType).toLowerCase();
            filteredMenu = formattedMenu.filter(menu => {
              const menuFoodType = menu.menu_food_type ? String(menu.menu_food_type).toLowerCase() : '';
              return menuFoodType === safeSelectedType;
            });
          }

          setSearchedMenu(filteredMenu);
          setOriginalMenu(formattedMenu);
        }
      } else {
        handleError();
      }
    } catch (error) {
      console.error("Search error:", error);
      handleError();
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== debouncedSearchTerm) {
        setDebouncedSearchTerm(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle search results
  useEffect(() => {
    if (debouncedSearchTerm.trim().length >= 3 && debouncedSearchTerm.trim().length <= 10) {
      handleSearch({ target: { value: debouncedSearchTerm } });
    }
  }, [debouncedSearchTerm]);

  // Utility function to convert a string to title case
  const toTitleCase = (str) => {
    if (!str || typeof str !== 'string') return "";

    return str
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handlePriceFilter = (filterType) => {
    if (priceFilter === filterType) {
      setPriceFilter(null);
      setSearchedMenu(originalMenu);
      return;
    }

    setPriceFilter(filterType);
    let sortedMenu = [...searchedMenu];

    switch (filterType) {
      case 'under50':
        sortedMenu = originalMenu.filter(item => {
          const finalPrice = item.offer ? item.price * (1 - item.offer / 100) : item.price;
          return finalPrice <= 50;
        });
        break;

      case 'under100':
        sortedMenu = originalMenu.filter(item => {
          const finalPrice = item.offer ? item.price * (1 - item.offer / 100) : item.price;
          return finalPrice <= 100;
        });
        break;

      case 'under200':
        sortedMenu = originalMenu.filter(item => {
          const finalPrice = item.offer ? item.price * (1 - item.offer / 100) : item.price;
          return finalPrice <= 200;
        });
        break;

      case 'under500':
        sortedMenu = originalMenu.filter(item => {
          const finalPrice = item.offer ? item.price * (1 - item.offer / 100) : item.price;
          return finalPrice <= 500;
        });
        break;

      case 'under1000':
        sortedMenu = originalMenu.filter(item => {
          const finalPrice = item.offer ? item.price * (1 - item.offer / 100) : item.price;
          return finalPrice <= 1000;
        });
        break;

      case 'above1000':
        sortedMenu = originalMenu.filter(item => {
          const finalPrice = item.offer ? item.price * (1 - item.offer / 100) : item.price;
          return finalPrice > 1000;
        });
        break;

      default:
        // Reset to original order
        sortedMenu = [...originalMenu];
    }

    setSearchedMenu(sortedMenu);
  };

  const handleSpicyFilter = (filterLevel) => {
    if (spicyFilter === filterLevel) {
      setSpicyFilter(null);
      setSearchedMenu(originalMenu);
      return;
    }

    setSpicyFilter(filterLevel);
    let filteredMenu = [...originalMenu];

    if (filterLevel !== null) {
      filteredMenu = originalMenu.filter(item => parseInt(item.spicy_index, 10) === filterLevel);
    }

    setSearchedMenu(filteredMenu);
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <Header title="Search" />

      {/* Main Content Start */}
      <main className="page-content p-t80 p-b40">
        {/* <div className="container py-0">
          <div className="d-flex justify-content-between align-items-center  my-2">
            <Link to={`/user_app/restaurant/`}>
              <div className="d-flex align-items-center">
                <i className="fa-solid fa-store me-2"></i>
                <span className="fw-medium font_size_14">
                  {restaurantName.toUpperCase() || "Restaurant Name"}
                </span>
              </div>
            </Link>
            <div className="d-flex align-items-center">
              <i className="fa-solid fa-location-dot font_size_12 me-2 gray-text"></i>
              <span className="fw-medium font_size_12 gray-text">
                {`Table ${
                  JSON.parse(localStorage.getItem("userData"))?.tableNumber ||
                  localStorage.getItem("tableNumber") ||
                  "1"
                }`}
              </span>
            </div>
          </div>
        </div> */}
        <div className="container py-0">
          <HotelNameAndTable
            restaurantName={restaurantName}
            tableNumber={customerType?.tableNumber || "1"}
          />
        </div>

        <div className="container pt-0">
          <div className="input-group w-100 my-2">
            <div className="position-relative w-100">
              <input
                id="searchInput"
                type="search"
                className="form-control ps-5 border border-success rounded-5"
                placeholder="Search Best items for You"
                onChange={handleSearch}
                value={searchTerm}
                autoFocus="autofocus"
              />
              <i
                className="fa-solid fa-magnifying-glass position-absolute text-primary"
                style={{
                  left: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
                onClick={() => document.getElementById("searchInput").focus()}
              ></i>
            </div>

            {debouncedSearchTerm.trim().length >= 3 &&
              debouncedSearchTerm.trim().length <= 10 && (
                <div className="d-flex align-items-center mt-2 gap-2">
                  {/* Food Type Filter */}
                  <div className="dropdown">
                    <button
                      className="btn btn-sm btn-outline-success bg-light rounded-5 dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ height: "38px" }}
                    >
                      {selectedFoodType ? (
                        <div className="d-flex align-items-center">
                          <i
                            className={`${
                              getFoodTypeStyles(selectedFoodType).icon
                            } me-2`}
                          ></i>
                          <span>
                            {selectedFoodType.charAt(0).toUpperCase() +
                              selectedFoodType.slice(1)}
                          </span>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center">
                          <i className="fa-solid fa-filter me-2"></i>
                          <span>Type</span>
                        </div>
                      )}
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center"
                          onClick={() => handleFilter(null)}
                        >
                          <i className="fa-solid fa-utensils me-2"></i>
                          <span>All</span>
                        </button>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      {foodTypes.map((type) => (
                        <li key={type}>
                          <button
                            className="dropdown-item d-flex align-items-center"
                            onClick={() => handleFilter(type)}
                          >
                            <i
                              className={`${getFoodTypeStyles(type).icon} me-2`}
                            ></i>
                            <span>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price Filter */}
                  <div className="dropdown">
                    <button
                      className="btn btn-sm btn-outline-success bg-light rounded-5 dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ height: "38px" }}
                    >
                      <div className="d-flex align-items-center">
                        <i className="fa-solid fa-indian-rupee-sign me-2"></i>
                        <span>
                          {priceFilter === "under50"
                            ? "Under ₹50"
                            : priceFilter === "under100"
                            ? "Under ₹100"
                            : priceFilter === "under200"
                            ? "Under ₹200"
                            : priceFilter === "under500"
                            ? "Under ₹500"
                            : priceFilter === "under1000"
                            ? "Under ₹1000"
                            : priceFilter === "above1000"
                            ? "Above ₹1000"
                            : "Price"}
                        </span>
                      </div>
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center"
                          onClick={() => handlePriceFilter(null)}
                        >
                          <i className="fa-solid fa-filter-circle-xmark me-2"></i>
                          <span>All Prices</span>
                        </button>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center"
                          onClick={() => handlePriceFilter("under50")}
                        >
                          <i className="fa-solid fa-indian-rupee-sign me-2"></i>
                          <span>Under ₹50</span>
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center"
                          onClick={() => handlePriceFilter("under100")}
                        >
                          <i className="fa-solid fa-indian-rupee-sign me-2"></i>
                          <span>Under ₹100</span>
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center"
                          onClick={() => handlePriceFilter("under200")}
                        >
                          <i className="fa-solid fa-indian-rupee-sign me-2"></i>
                          <span>Under ₹200</span>
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center"
                          onClick={() => handlePriceFilter("under500")}
                        >
                          <i className="fa-solid fa-indian-rupee-sign me-2"></i>
                          <span>Under ₹500</span>
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center"
                          onClick={() => handlePriceFilter("under1000")}
                        >
                          <i className="fa-solid fa-indian-rupee-sign me-2"></i>
                          <span>Under ₹1000</span>
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center"
                          onClick={() => handlePriceFilter("above1000")}
                        >
                          <i className="fa-solid fa-indian-rupee-sign me-2"></i>
                          <span>Above ₹1000</span>
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Spicy Filter */}
                  <div className="dropdown">
                    <button
                      className="btn btn-sm btn-outline-success bg-light rounded-5 dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ height: "38px" }}
                    >
                      <div className="d-flex align-items-center">
                        <i className="fa-solid fa-pepper-hot me-2"></i>
                        <span>
                          {spicyFilter === 1
                            ? "Spicy Level 1"
                            : spicyFilter === 2
                            ? "Spicy Level 2"
                            : spicyFilter === 3
                            ? "Spicy Level 3"
                            : "Spicy"}
                        </span>
                      </div>
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center"
                          onClick={() => handleSpicyFilter(null)}
                        >
                          <i className="fa-solid fa-filter-circle-xmark me-2"></i>
                          <span>All</span>
                        </button>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center"
                          onClick={() => handleSpicyFilter(1)}
                        >
                          <i className="fa-solid fa-pepper-hot text-success me-2"></i>
                          <span>Low</span>
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center"
                          onClick={() => handleSpicyFilter(2)}
                        >
                          <i className="fa-solid fa-pepper-hot text-warning me-2"></i>
                          <span>Medium</span>
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center"
                          onClick={() => handleSpicyFilter(3)}
                        >
                          <i className="fa-solid fa-pepper-hot text-danger me-2"></i>
                          <span>High</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
          </div>

          {isLoading && <p>Loading...</p>}

          {searchedMenu.map((menu, index) => (
            <div className="py-1 px-0" key={index}>
              <div className="custom-card rounded-4 shadow-sm">
                <Link
                  to={`/user_app/ProductDetails/${menu.menu_id}`}
                  state={{
                    restaurant_id: menu.restaurant_id,
                    menu_cat_id: menu.menu_cat_id,
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
                        />
                        {/* Like Button */}
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
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleLikeClick(menu.menu_id);
                          }}
                        >
                          <i
                            className={`${
                              menu.is_favourite
                                ? "fa-solid fa-heart text-danger"
                                : "fa-regular fa-heart"
                            } fs-6`}
                          ></i>
                        </div>
                        {/* Special Star */}
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
                        {/* Food Type Indicator */}
                        <div
                          className={`border rounded-3 bg-white opacity-100 d-flex justify-content-center align-items-center ${
                            getFoodTypeStyles(menu.menu_food_type).border
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
                              getFoodTypeStyles(menu.menu_food_type).icon
                            } font_size_12`}
                          ></i>
                        </div>
                        {/* Offer Tag */}
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
                        </div>
                        <div className="row d-flex align-items-center mt-1">
                          <div className="col-6 d-flex align-items-center">
                            <span
                              className={`ps-2 font_size_10 ${
                                getFoodTypeTextStyles(menu.category_food_type)
                                  .textColor
                              }`}
                            >
                              <i
                                className={`${
                                  getFoodTypeTextStyles(menu.category_food_type)
                                    .icon
                                } ${
                                  getFoodTypeTextStyles(menu.category_food_type)
                                    .textColor
                                } font_size_10 mt-0 me-1`}
                              ></i>
                              {menu.category_name}
                            </span>
                          </div>
                          <div className="col-4 d-flex align-items-center ps-4 pe-3">
                            {menu.spicy_index && (
                              <div className="">
                                {renderSpicyLevel(menu.spicy_index)}
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
                          <div className="col-7 text-end font_size_10 d-flex align-items-center justify-content-end">
                            <div
                              className={`
                                d-flex 
                                align-items-center 
                                justify-content-center 
                                rounded-circle 
                                bg-white 
                                border-opacity-25 
                                border-secondary 
                                border
                              `}
                              style={{
                                width: "25px",
                                height: "25px",
                                cursor: "pointer",
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (userData?.customer_id) {
                                  handleAddToCartClick(menu);
                                } else {
                                  showLoginPopup();
                                }
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
        <div className="container">
          <RestaurantSocials />
        </div>
      </main>

      {showModal && (
        <AddToCartUI
          showModal={showModal}
          setShowModal={setShowModal}
          productDetails={selectedMenu || {}}
          notes={notes}
          setNotes={setNotes}
          portionSize={portionSize}
          setPortionSize={setPortionSize}
          halfPrice={halfPrice}
          fullPrice={fullPrice}
          originalHalfPrice={selectedMenu?.half_price}
          originalFullPrice={selectedMenu?.full_price}
          isPriceFetching={isPriceFetching}
          handleConfirmAddToCart={handleConfirmAddToCart}
          handleSuggestionClick={(suggestion) => setNotes(suggestion)}
          handleModalClick={(e) => {
            if (e.target.classList.contains('modal')) {
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

export default Search;
