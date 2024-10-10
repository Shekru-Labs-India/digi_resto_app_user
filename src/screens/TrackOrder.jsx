import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import images from "../assets/chiken.jpg";
import SigninButton from "../constants/SigninButton";
import Bottom from "../component/bottom";
import OrderGif from "../screens/OrderGif"; // Ensure this import path is correct
import "../assets/css/custom.css";
import { useRestaurantId } from "../context/RestaurantIdContext"; // Correct import
import { ThemeProvider } from "../context/ThemeContext.js";

const TrackOrder = () => {
  // Define displayCartItems
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false); // State to track if order is completed
  const navigate = useNavigate();
  const { order_number } = useParams();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const { restaurantId } = useRestaurantId(); // Assuming this context provides restaurant ID
  const customerId = userData ? userData.customer_id : null;
  const displayCartItems = orderDetails ? orderDetails.menu_details : [];
  const [cartDetails, setCartDetails] = useState(null);
  const [userData2, setUserData] = useState(null);

  

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("isDarkMode") === "true"
  );

 

  const isLoggedIn = !!localStorage.getItem("userData");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    localStorage.setItem("isDarkMode", newIsDarkMode);
  };

  const getFirstName = (name) => {
    if (!name) return "User";
    const words = name.split(" ");
    return words[0];
  };

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setUserData(storedUserData);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
    }
  }, [isDarkMode]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleIncrement = (menuId) => {
    setQuantities((prev) => ({
      ...prev,
      [menuId]: (prev[menuId] || 0) + 1,
    }));
  };

  const handleDecrement = (menuId) => {
    setQuantities((prev) => ({
      ...prev,
      [menuId]: Math.max((prev[menuId] || 0) - 1, 0),
    }));
  };

  const handleMenuClick = (menuId) => {
    navigate(`/ProductDetails/${menuId}`, {
      state: {
        restaurant_id: restaurantId,
        menu_cat_id: searchedMenu.find((menu) => menu.menu_id === menuId)
          ?.menu_cat_id,
      },
    });
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchedMenu, setSearchedMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef(null);

  const [quantities, setQuantities] = useState({});
  const [prices, setPrices] = useState({});

  const [orderedItems, setOrderedItems] = useState([]);
  const [pendingItems, setPendingItems] = useState(() => {
    const savedPendingItems = localStorage.getItem('pendingItems');
    return savedPendingItems ? JSON.parse(savedPendingItems) : [];
  });

  useEffect(() => {
    localStorage.setItem('pendingItems', JSON.stringify(pendingItems));
  }, [pendingItems]);

  const getCustomerId = () => {
    return userData ? userData.customer_id : null;
  };

  const getRestaurantId = () => {
    return userData ? userData.restaurantId : null;
  };

  const getCartId = () => {
    const cartId = localStorage.getItem("cartId");
    return cartId ? parseInt(cartId, 10) : 1;
  };

  const handleRemovePendingItem = (menuId) => {
    setPendingItems(prevItems => prevItems.filter(item => item.menu_id !== menuId));
  };

  const updateCartQuantity = async (menuId, quantity) => {
    const customerId = getCustomerId();
    const restaurantId = getRestaurantId();
    const cartId = getCartId();

    try {
      const response = await fetch(
        "https://menumitra.com/user_api/update_cart_menu_quantity",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: cartId,
            customer_id: customerId,
            restaurant_id: restaurantId,
            menu_id: menuId,
            quantity: quantity,
          }),
        }
      );
      const data = await response.json();
      if (data.st === 1) {
        setQuantities((prev) => ({ ...prev, [menuId]: quantity }));
        setPrices((prev) => ({ ...prev, [menuId]: data.price }));
      } else {
        console.error("Failed to update cart quantity:", data.msg);
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setSearchedMenu([]);
  };

  // ... existing useEffect hooks and functions ...

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
  };

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
  }, [debouncedSearchTerm, restaurantId, customerId]);

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const handleAddToOrder = (menuItem) => {
    setPendingItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.menu_id === menuItem.menu_id);
      if (existingItemIndex !== -1) {
        // If item already exists, update its quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        // If item doesn't exist, add it with quantity 1
        return [...prevItems, { ...menuItem, quantity: 1 }];
      }
    });
  
    // Remove the item from searchedMenu
    setSearchedMenu(prevMenu => prevMenu.filter(item => item.menu_id !== menuItem.menu_id));
  };

  const handleSubmitOrder = () => {
    // Add pendingItems to orderedItems
    setOrderedItems([...orderedItems, ...pendingItems]);
    // Clear pendingItems
    setPendingItems([]);
  };

  useEffect(() => {
    const fetchOrderDetails = async (orderNumber) => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://menumitra.com/user_api/get_order_details",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order_number: orderNumber,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.st === 1 && data.lists) {
            setOrderDetails(data.lists);
          } else {
            console.error("Invalid data format:", data);
          }
        } else {
          console.error("Network response was not ok.");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    const addToOrder = async (menu) => {
      try {
        const response = await fetch(
          "https://menumitra.com/user_api/add_to_cart",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cart_id: getCartId(),
              customer_id: getCustomerId(),
              restaurant_id: getRestaurantId(),
              menu_id: menu.menu_id,
              quantity: 1, // Start with quantity 1
              price: menu.price,
            }),
          }
        );
        const data = await response.json();
        if (data.st === 1) {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: `${menu.menu_name} added to your order`,
            life: 2000,
          });
          fetchOrderDetails(); // Refresh order details
        } else {
          console.error("Failed to add item to order:", data.msg);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to add item to order",
            life: 2000,
          });
        }
      } catch (error) {
        console.error("Error adding item to order:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "An error occurred while adding item to order",
          life: 2000,
        });
      }
    };

    const fetchOrderStatus = async () => {
      try {
        const response = await fetch(
          "https://menumitra.com/user_api/get_order_list",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              restaurant_id: restaurantId,
              order_status: "completed",
              customer_id: customerId,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (
            data.st === 1 &&
            data.lists.some((order) => order.order_number === order_number)
          ) {
            setIsCompleted(true);
          }
        } else {
          console.error("Network response was not ok.");
        }
      } catch (error) {
        console.error("Error fetching order status:", error);
      }
    };

    if (order_number && restaurantId && customerId) {
      fetchOrderDetails(order_number);
      fetchOrderStatus(); // Check if the order is completed
    }
  }, [order_number, restaurantId, customerId]);

  // const formatDateTime = (dateTime) => {
  //   const [date, time] = dateTime.split(" ");
  //   const [hours, minutes] = time.split(":");

  //   // Convert hours to 12-hour format
  //   let hours12 = parseInt(hours, 10);
  //   const period = hours12 >= 12 ? "PM" : "AM";
  //   hours12 = hours12 % 12 || 12;  // Convert 0 to 12 for midnight

  //   // Pad single-digit hours and minutes with leading zeros
  //   const formattedHours = hours12.toString().padStart(2, '0');
  //   const formattedMinutes = minutes.padStart(2, '0');

  //   return ${formattedHours}:${formattedMinutes} ${period} ${date};
  // };

  // Use above code after correcting the date format in the backend

  const formatDateTime = (dateTime) => {
    if (!dateTime) return ""; // Return empty string if dateTime is undefined or null
    
    const parts = dateTime.split(" ");
    if (parts.length < 2) return dateTime; // Return original string if it doesn't have expected parts
    
    const [date, time] = parts;
    const [hours, minutes] = (time || "").split(":");
    
    if (!hours || !minutes) return dateTime; // Return original string if hours or minutes are missing
  
    // Convert hours to 12-hour format
    let hours12 = parseInt(hours, 10);
    const period = hours12 >= 12 ? "PM" : "AM";
    hours12 = hours12 % 12 || 12; // Convert 0 to 12 for midnight
  
    // Pad single-digit hours and minutes with leading zeros
    const formattedHours = hours12.toString().padStart(2, "0");
    const formattedMinutes = minutes.padStart(2, "0");
  
    // Array of month abbreviations
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    const [day, month, year] = (date || "").split("-");
    const monthIndex = month ? parseInt(month, 10) - 1 : new Date().getMonth();
    const monthAbbr = monthNames[monthIndex] || "";
  
    return `${formattedHours}:${formattedMinutes} ${period} ${day || ""}-${monthAbbr}-${year || ""}`;
  };

  if (loading || !orderDetails) {
    return (
      <div id="preloader">
        <div className="loader">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const { order_details, menu_details } = orderDetails;

  const renderSpicyIndex = (spicyIndex) => {
    const totalFires = 5;
    return (
      <div className="spicy-index ">
        {Array.from({ length: totalFires }).map((_, index) => (
          <i
            key={index}
            className={`ri-fire-${
              index < spicyIndex ? "fill fs-6" : "line fs-6"
            }`}
            style={{
              color: index < spicyIndex ? "#eb8e57" : "#bbbaba",
            }}
          ></i>
        ))}
      </div>
    );
  };

  return (
    <>
      

      <div className="page-wrapper full-height">
        <header className="header header-fixed style-3">
          <div className="header-content">
            <div className="left-content">
              <Link
                to=""
                className="back-btn dz-icon  icon-sm"
                onClick={handleBack}
              >
                <i className="ri-arrow-left-line fs-2"></i>
              </Link>
            </div>
            <div className="mid-content">
              <span className="title custom_font_size_bold me-3">
                Order Details
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

        <div className={`page-wrapper ${sidebarOpen ? "sidebar-open" : ""}`}>
        {/* Dark overlay for sidebar */}
        <div
          className={`dark-overlay ${sidebarOpen ? "dark-overlay active" : ""}`}
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
          <div className="sidebar-bottom"></div>
        </div>
      </div>

        <div className="container" style={{ paddingBottom: "1px" }}>
          <div className="page-wrapper " style={{ marginTop: "70px" }}>
            <span className="title pb-2 custom_font_size_bold">
              {isCompleted ? (
                <div className="title pb-2 custom_font_size_bold ">
                  Completed Order
                </div>
              ) : (
                <div className="title pb-2 custom_font_size_bold ">
                  Ongoing Order
                </div>
              )}
            </span>
            <div
              className="container custom-container"
              style={{ paddingTop: "1px" }}
            ></div>
            <div className="card">
              <div className="card-body p-2">
                <div className="row align-items-center mb-0">
                  <div className="col-5">
                    <h5 className="card-title mb-0 custom_font_size_bold">
                      {order_details.order_number}
                    </h5>
                  </div>
                  <div className="col-7 text-end">
                    <span className="card-text gray-text custom_font_size_bold">
                      {formatDateTime(order_details.datetime)}
                    </span>
                  </div>
                </div>
                <div className="order-details-row">
                  <div className="restaurant-info me-0">
                    <i className="ri-store-2-line pe-2 custom_font_size_bold "></i>
                    <span className="restaurant-name custom_font_size_bold">
                      {order_details.restaurant_name.toUpperCase()}
                    </span>
                    <i className="ri-user-location-line ps-0 pe-1 custom_font_size_bold "></i>
                    <span className="table-number custom_font_size_bold">
                      {order_details.table_number}
                    </span>
                  </div>
                  <div className="menu-info">
                    <i className="ri-bowl-line pe-2 custom_font_size_bold gray-text"></i>
                    <span className="custom_font_size_bold gray-text">
                      {order_details.menu_count} Menu
                    </span>
                  </div>
                  <div className="price-info">
                    <span className="text-info custom_font_size_bold fw-medium">
                      ₹{order_details.grand_total}
                    </span>
                    <span className="text-decoration-line-through ms-2 gray-text custom_font_size_bold">
                      ₹
                      {(
                        order_details.grand_total /
                          (1 - order_details.discount_percent / 100) ||
                        order_details.grand_total
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ThemeProvider>
          {/* Conditional rendering of the green card or OrderGif based on order status */}
          <div
            className="container custom-container"
            style={{ paddingTop: "1px" }}
          >
            {isCompleted ? (
              <div
                className="card-body text-center"
                style={{
                  backgroundColor: "#cce3d1",
                  padding: "20px",
                  borderRadius: "8px",
                }}
              >
                <span
                  className="fs-6 fw-medium h-100 rounded-corner"
                  style={{ color: "#2f855a" }}
                >
                  Your delicious order has been served
                </span>
              </div>
            ) : (
              <div className="card-body p-0">
                <div className="card">
                  <div className="row py-2 ps-2 pe-0 h-100">
                    <div className="col-3 d-flex align-items-center justify-content-center pe-2">
                      <OrderGif />
                    </div>
                    <div className="col-8 d-flex align-items-center justify-content-center px-0">
                      <div className="text-center mb-0">
                        <div
                          className=" fw-medium"
                          style={{ fontSize: "14px" }}
                        >
                          You have the best taste in food.
                        </div>

                        <div
                          className=" fw-medium"
                          style={{ fontSize: "14px" }}
                        >
                          We're crafting a menu to match it perfectly.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ThemeProvider>

        <main className="page-content">
          <div className="container" style={{ paddingBottom: "1px" }}>
            <div className="input-group w-100 my-2 border border-muted rounded-3">
              <span className="input-group-text py-0">
                <i className="ri-search-line fs-3 gray-text"></i>
              </span>
              <input
                type="search"
                className="form-control bg-white ps-2 custom_font_size_bold"
                placeholder="Search to add more items"
                onChange={handleSearch}
                value={searchTerm}
              />
            </div>
          </div>

          {userData ? (
            <section className="container mt-1 py-3">
              {/* Searched menu items */}
              {searchedMenu.length > 0 && (
                <div className="row g-3 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2 mt-0">
                    <div className="customFontSizeBold mb-0 gray-text">
                      Search Results
                    </div>
                    <div
                      className="customFontSizeBold gray-text"
                      onClick={handleClearAll}
                    >
                      Clear All
                    </div>
                  </div>
                  {searchedMenu.map((menu) => (
                    <div
                      className="card my-2 px-0 rounded-3"
                      key={menu.menu_id}
                    >
                      <div className="card-body py-0">
                        <div className="row">
                          <div className="col-3  px-0">
                            <img
                              src={menu.image || images}
                              alt={menu.menu_name}
                              className="img-fluid rounded-3"
                              style={{ width: "100px", height: "105px" }}
                              onError={(e) => {
                                e.target.src = images;
                              }}
                              onClick={() => handleMenuClick(menu.menu_id)}
                            />
                          </div>
                          <div className="col-9 py-2 pe-0 ps-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="custom_font_size_bold">
                                {menu.menu_name}
                              </div>
                              <div className="col-3">
                                <span
                                  className="btn btn-sm btn-primary py-2 addOrder-btn"
                                  onClick={() => handleAddToOrder(menu)}
                                >
                                  Add
                                </span>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-7 mt-1 pe-0">
                                <span
                                  onClick={() => handleMenuClick(menu.menu_id)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <div className="mt-0">
                                    <i className="ri-restaurant-line mt-0 me-2 category-text fs-xs fw-medium"></i>
                                    <span className="category-text fs-xs fw-medium">
                                      {menu.category_name}
                                    </span>
                                  </div>
                                </span>
                              </div>
                              <div className="col-4 text-center  me-0 ms-2 p-0 mt-1">
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
                            <div className="row mt-2">
                              <div className="col-8 px-0 ">
                                <span
                                  className="mb-0 mt-1 custom_font_size text-start fw-medium"
                                  onClick={() => handleMenuClick(menu.menu_id)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <span className="ms-3 me-1 text-info">
                                    ₹{menu.price}
                                  </span>
                                  <span className="gray-text custom_font_size old-price text-decoration-line-through">
                                    ₹{menu.oldPrice || menu.price}
                                  </span>
                                </span>
                                <span
                                  className="mb-0 mt-1 ms-3 custom_font_size offerSearch"
                                  onClick={() => handleMenuClick(menu.menu_id)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <span className="custom_font_size px-0 text-start offer-color offer">
                                    {menu.offer || "No "}% Off
                                  </span>
                                </span>
                              </div>
                              <div className="col-4">
                                <div className="d-flex justify-content-end align-items-center mt-1">
                                  <i
                                    className="ri-subtract-line custom_font_size mx-2"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleDecrement(menu.menu_id)
                                    }
                                  ></i>
                                  <span className="custom_font_size">
                                    {quantities[menu.menu_id] || 0}
                                  </span>
                                  <i
                                    className="ri-add-line mx-2 custom_font_size"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleIncrement(menu.menu_id)
                                    }
                                  ></i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {pendingItems.length > 0 && (
                <div className="row g-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2 mt-0">
                    <h6 className="customFontSizeBold mb-0 gray-text">
                      Pending Items
                    </h6>
                  </div>
                  {pendingItems.map((menu) => (
                    <div key={menu.menu_id} className="col-12 mt-2">
                      <div className="card mb-3 rounded-3">
                        <div className="card-body py-0">
                          <div className="row">
                            <div className="col-3 px-0">
                              <img
                                src={menu.image || images}
                                alt={menu.menu_name}
                                className="img-fluid rounded-3"
                                style={{ width: "100px", height: "100px" }}
                                onError={(e) => {
                                  e.target.src = images;
                                }}
                              />
                            </div>
                            <div className="col-8 ps-2 pt-1 pe-0">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="customFontSizeBold ">
                                  {menu.menu_name}
                                </div>
                                <div>
                                  
                                  <i
                                    className="ri-close-line"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleRemovePendingItem(menu.menu_id)
                                    }
                                  ></i>
                                </div>
                              </div>
                              <div className="row mt-2">
                                <div className="col-7">
                                  <span className="category-text fs-xs fw-medium">
                                    {menu.category_name}
                                  </span>
                                </div>
                                <div className="col-5 text-end">
                                  <span className="custom_font_size_bold gray-text">
                                    <i className="ri-star-half-line ratingStar"></i>
                                    {parseFloat(menu.rating).toFixed(1)}
                                  </span>
                                </div>
                              </div>
                              <div className="row mt-2">
                                <div className="col-9">
                                  <span className="custom_font_size text-info">
                                    ₹{menu.price * menu.quantity}
                                  </span>
                                  <span className="gray-text custom_font_size old-price text-decoration-line-through ms-2">
                                    ₹
                                    {(menu.oldPrice || menu.price) *
                                      menu.quantity}
                                  </span>
                                </div>
                                <div className="col-3 text-center">
                                  <span className="quantity gray-text customFontSizeBold">
                                    x {menu.quantity}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Order button */}
              {pendingItems.length > 0 && (
                <div className="d-flex justify-content-center my-3">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleSubmitOrder}
                  >
                    Place Order
                  </button>
                </div>
              )}

              {pendingItems.length > 0 && searchTerm !== "" && (
                <hr className="my-4 dotted-line text-primary" />
              )}
              {/* Horizontal line */}

              {/* Original menu items */}
              <div className="row ">
                <span className="custom_font_size_bold gray-text ms-1 mb-2 ">
                  Ordered Items
                </span>
                {[...menu_details, ...orderedItems].map((menu) => {
                  const oldPrice = (
                    menu.price /
                    (1 - menu.offer / 100)
                  ).toFixed(2);
                  return (
                    <div
                      key={menu.menu_id}
                      className="col-12"
                      onClick={() =>
                        navigate(`/ProductDetails/${menu.menu_id}`, {
                          state: {
                            restaurant_id: restaurantId,
                            menu_cat_id: menu.menu_cat_id,
                          },
                        })
                      }
                    >
                      <div className="card mb-3 rounded-4">
                        <div className="card-body py-0">
                          <div className="row">
                            <div className="col-3 px-0">
                              <img
                                src={menu.image || images}
                                alt={menu.menu_name}
                                className="img-fluid rounded-4"
                                style={{ width: "100px", height: "108px" }}
                                onError={(e) => {
                                  e.target.src = images;
                                }}
                              />
                            </div>
                            <div className="col-8 pt-3 pb-0 pe-0 ps-2">
                              <div className="custom_font_size_bold">
                                {menu.menu_name}
                              </div>
                              <div className="row">
                                <div className="col-7 mt-1 pe-0">
                                  <div className="mt-0">
                                    <i className="ri-restaurant-line mt-0 me-2 category-text fs-xs fw-medium"></i>
                                    <span className="category-text fs-xs fw-medium">
                                      {menu.category_name}
                                    </span>
                                  </div>
                                </div>
                                <div className="col-4 text-end ms-3 me-0 p-0 mt-1">
                                  <span className="custom_font_size_bold gray-text">
                                    <i className="ri-star-half-line ms-4  ratingStar"></i>
                                    {parseFloat(menu.rating).toFixed(1)}
                                  </span>
                                </div>
                              </div>
                              <div className="row mt-3">
                                <div className="col-9 px-0">
                                  <span className="mb-0 mt-1 customFontSize text-start fw-medium">
                                    <span className="ms-3 me-1 text-info">
                                      ₹{menu.price}
                                    </span>
                                    <span className="gray-text custom_font_size old-price text-decoration-line-through">
                                      ₹{oldPrice}
                                    </span>
                                  </span>
                                  <span className="mb-0 mt-1 ms-3 custom_font_size offerSearch">
                                    <span className="custom_font_size px-0 text-start offer-color offer">
                                      {menu.offer || "No "}% Off
                                    </span>
                                  </span>
                                </div>
                                <div className="col-3 text-center p-0">
                                  <span className="quantity gray-text customFontSizeBold">
                                    x {menu.quantity}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : (
            <SigninButton />
          )}
        </main>

        {userData && orderDetails && (
          <div
            className="container  mb-5 pb-5 z-3"
            style={{ backgroundColor: "transparent" }}
          >
            <div className="card-body mt-2 p-0 mb-5">
              <div className="card mx-auto">
                <div className="row px-1 py-1">
                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center py-1">
                      <span className="ps-2 custom_font_size_bold fw-medium">
                        Total
                      </span>
                      <span className="pe-2 custom_font_size_bold fw-medium">
                        ₹{orderDetails.order_details.total_total || 0}
                      </span>
                    </div>
                    <hr className="me-3 p-0 m-0 text-primary" />
                  </div>
                  <div className="col-12 pt-0">
                    <div className="d-flex justify-content-between align-items-center py-0">
                      <span className="ps-2 customFontSize pt-1 gray-text">
                        Service Charges{" "}
                        <span className="gray-text small-number">
                          {" "}
                          (
                          {orderDetails.order_details.service_charges_percent ||
                            0}
                          % )
                        </span>
                      </span>
                      <span className="pe-2 customFontSize gray-text">
                        ₹
                        {orderDetails.order_details.service_charges_amount || 0}
                      </span>
                    </div>
                  </div>
                  <div className="col-12 mb-0 py-1">
                    <div className="d-flex justify-content-between align-items-center py-0">
                      <span className="ps-2 customFontSize gray-text">
                        GST{" "}
                        <span className="gray-text small-number">
                          {" "}
                          ({orderDetails.order_details.gst_percent || 0}% )
                        </span>
                      </span>
                      <span className="pe-2 customFontSize  text-start gray-text">
                        ₹{orderDetails.order_details.gst_amount || 0}
                      </span>
                    </div>
                  </div>
                  <div className="col-12 mb-0 pt-0 pb-1">
                    <div className="d-flex justify-content-between align-items-center py-0">
                      <span className="ps-2 customFontSize gray-text">
                        Discount{" "}
                        <span className="gray-text small-number">
                          {" "}
                          ({orderDetails.order_details.discount_percent || 0}% )
                        </span>
                      </span>
                      <span className="pe-2 customFontSize gray-text">
                        ₹{orderDetails.order_details.discount_amount || 0}
                      </span>
                    </div>
                  </div>
                  <div>
                    <hr className="me-3 p-0 m-0 text-primary" />
                  </div>
                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center py-1 fw-medium pb-0 mb-0">
                      <span className="ps-2 custom_font_size_bold">
                        Grand Total
                      </span>
                      <span className="pe-2 custom_font_size_bold">
                        ₹{orderDetails.order_details.grand_total || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <Bottom></Bottom>
      </div>
    </>
  );
};

export default TrackOrder;
