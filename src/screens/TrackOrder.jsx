import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import images from "../assets/chiken.jpg";
import SigninButton from "../constants/SigninButton";
import Bottom from "../component/bottom";
import OrderGif from "../screens/OrderGif"; // Ensure this import path is correct
import "../assets/css/custom.css";
import { useRestaurantId } from "../context/RestaurantIdContext"; // Correct import
import { ThemeProvider } from "../context/ThemeContext.js";
import LoaderGif from "./LoaderGIF.jsx";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/saga-blue/theme.css"; // Choose a theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Header from "../components/Header";

const TrackOrder = () => {
  // Define displayCartItems
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false); // State to track if order is completed
  const navigate = useNavigate();
  const { order_number } = useParams();
  const { orderId } = useParams();
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
  const handleIncrement = (menuItem) => {
    setQuantities((prev) => {
      const newQuantity = Math.min((prev[menuItem] || 1) + 1, 20);
      if (newQuantity === 20) {
        toast.current.show({
          severity: "info",
          summary: "Maximum Quantity",
          detail: `You've reached the maximum quantity for ${menuItem.menu}`,
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "success",
          summary: "Quantity Increased",
          detail: `${menuItem.menu_name} quantity increased to ${newQuantity}`,
          life: 3000,
        });
      }
      return { ...prev, [menuItem]: newQuantity };
    });
  };

  const handleDecrement = (menuItem) => {
    setQuantities((prev) => {
      const newQuantity = Math.max((prev[menuItem] || 1) - 1, 1);
      if (newQuantity === 1) {
        toast.current.show({
          severity: "info",
          summary: "Minimum Quantity",
          detail: `You've reached the minimum quantity for ${menuItem.menu_name}`,
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "success",
          summary: "Quantity Decreased",
          detail: `${menuItem.menu_name} quantity decreased to ${newQuantity}`,
          life: 3000,
        });
      }
      return { ...prev, [menuItem]: newQuantity };
    });
  };

  const calculatePrice = (menu) => {
    const quantity = quantities[menu.menu_id] || 1;
    return (parseFloat(menu.price) * quantity).toFixed(2);
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
  const getQuantity = (menuId) => quantities[menuId] || 1;

  const [orderedItems, setOrderedItems] = useState([]);
  const [pendingItems, setPendingItems] = useState(() => {
    const savedPendingItems = localStorage.getItem("pendingItems");
    return savedPendingItems ? JSON.parse(savedPendingItems) : [];
  });

  useEffect(() => {
    localStorage.setItem("pendingItems", JSON.stringify(pendingItems));
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
    setPendingItems((prevItems) =>
      prevItems.filter((item) => item.menu_id !== menuId)
    );
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

  const isItemAdded = (menuId) => {
    return (
      pendingItems.some((item) => item.menu_id === menuId) ||
      orderedItems.some((item) => item.menu_id === menuId)
    );
  };

  const handleAddToOrder = (menuItem) => {
    if (isItemAdded(menuItem.menu_id)) {
      return; // Item is already added, do nothing
    }

    const quantity = quantities[menuItem.menu_id] || 1;
    const price = parseFloat(menuItem.price);

    setPendingItems((prevItems) => [
      ...prevItems,
      {
        ...menuItem,
        quantity: quantity,
        totalPrice: (price * quantity).toFixed(2),
      },
    ]);

    // Remove the item from searchedMenu
    setSearchedMenu((prevMenu) =>
      prevMenu.filter((item) => item.menu_id !== menuItem.menu_id)
    );

    toast.current.show({
      severity: "success",
      summary: "Added to Order",
      detail: `${menuItem.menu_name} (Qty: ${quantity})`,
      life: 3000,
    });
  };

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
          setIsCompleted(
            data.lists.order_details.order_status.toLowerCase() === "completed"
          );
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

  const handleSubmitOrder = async () => {
    try {
      const response = await fetch(
        "https://menumitra.com/user_api/add_to_existing_order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderDetails.order_details.order_id,
            customer_id: customerId,
            restaurant_id: restaurantId,
            order_items: pendingItems.map((item) => ({
              menu_id: item.menu_id,
              quantity: item.quantity.toString(),
            })),
          }),
        }
      );

      const data = await response.json();

      if (data.st === 1) {
        setPendingItems([]);
        toast.current.show({
          severity: "success",
          summary: "Order Updated",
          detail: "Your order has been successfully updated.",
          life: 3000,
        });
        fetchOrderDetails(order_number);
      } else {
        throw new Error(data.msg || "Failed to update order");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to update order. Please try again.",
        life: 3000,
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
        if (data.st === 1 && Array.isArray(data.lists)) {
          const isCompleted = data.lists.some(
            (order) => order.order_number === order_number
          );
          setIsCompleted(isCompleted);
        }
      } else {
        console.error("Network response was not ok.");
      }
    } catch (error) {
      console.error("Error fetching order status:", error);
    }
  };

  const handleCategoryClick = (categoryId, categoryName) => {
    navigate(`/Category/${categoryId}`, {
      state: { categoryName: categoryName },
    });
  };

  useEffect(() => {
    if (order_number && restaurantId && customerId) {
      fetchOrderDetails(order_number);
      fetchOrderStatus();
      // handleSubmitOrder();
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
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const [day, month, year] = (date || "").split("-");
    const monthIndex = month ? parseInt(month, 10) - 1 : new Date().getMonth();
    const monthAbbr = monthNames[monthIndex] || "";

    return `${formattedHours}:${formattedMinutes} ${period} ${
      day || ""
    }-${monthAbbr}-${year || ""}`;
  };

  if (loading || !orderDetails) {
    return (
      <div id="preloader">
        <div className="loader">
          {/* <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div> */}
          <LoaderGif />
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
      <Toast ref={toast} position="bottom-center" className="custom-toast" />
      <div className="page-wrapper full-height">
        <Header title="Order Details" />

        <div className="container mt-5 pb-0">
          <div className="d-flex justify-content-between align-items-center ">
            <span className="title pb-3    ">
              {isCompleted ? (
                <>
                  <i className="ri-checkbox-circle-line pe-2"></i>
                  <span>Completed Order</span>
                </>
              ) : (
                <>
                  <i className="ri-timer-line pe-2"></i>
                  <span>Ongoing Order</span>
                </>
              )}
            </span>

            <span className="  gray-text date_margin">
              {order_details.date}
            </span>
          </div>

          <div className="card rounded-3">
            <div className="card-body p-2">
              <div className="row align-items-center mb-0">
                <div className="col-4">
                  <h5 className="card-title mb-0    ">
                    <i className="ri-hashtag pe-2    "></i>
                    {order_details.order_number}
                  </h5>
                </div>
                <div className="col-8 text-end">
                  <span className="font_size_12 gray-text  ">
                    {order_details.time}
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col-8 text-start">
                  <div className="restaurant">
                    <span className="fs-6 fw-medium">
                      <i className="ri-store-2-line pe-2 "></i>
                      {order_details.restaurant_name.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="col-4 text-end">
                  <i className="ri-user-location-line ps-0 pe-1 font_size_12 gray-text"></i>
                  <span className="fs-6 gray-text fw-medium font_size_12">
                    {order_details.table_number}
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="menu-info">
                    <span className="font_size_14  fw-semibold gray-text">
                      <i className="ri-bowl-line pe-2 "></i>
                      {order_details.menu_count} Menu
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-end">
                    <span className="text-info fs-6 fw-semibold">
                      ₹{order_details.grand_total}
                    </span>
                    <span className="text-decoration-line-through ms-2 gray-text fs-6 fw-normal">
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
          <div className="container py-0 ">
            {isCompleted ? (
              <div className="card-body text-center bg-success  rounded-3 text-white ">
                <span className="fs-6 fw-medium h-100  ">
                  Your delicious order has been served
                </span>
              </div>
            ) : (
              <div className="card-body p-0">
                <div className="card rounded-3">
                  <div className="row py-2 my-0 ps-2 pe-0 h-100">
                    <div className="col-3 d-flex align-items-center justify-content-center pe-2">
                      <OrderGif />
                    </div>
                    <div className="col-8 d-flex align-items-center justify-content-center px-0">
                      <div className="text-center mb-0">
                        <div className="fw-medium    ">
                          You have the best taste in food.
                        </div>
                        <div className="fw-medium    ">
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
          <div className="container py-0">
            {!isCompleted && (
              <div className="input-group w-100 my-2 border border-muted rounded-3">
                <span className="input-group-text py-0">
                  <i className="ri-search-line fs-3 gray-text"></i>
                </span>
                <input
                  type="search"
                  className="form-control bg-white ps-2    "
                  placeholder="Search to add more items"
                  onChange={handleSearch}
                  value={searchTerm}
                />
              </div>
            )}
          </div>

          {userData ? (
            <section className="container mt-1 py-1">
              {/* Searched menu items */}
              {!isCompleted && searchedMenu.length > 0 && (
                <div className="row g-3 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2 mt-0">
                    <div className="  mb-0 gray-text">Search Results</div>
                    <div className="  gray-text" onClick={handleClearAll}>
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
                          <div className="col-3   px-0">
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
                              onClick={() => handleMenuClick(menu.menu_id)}
                            />
                          </div>
                          <div className="col-9 py-2 pe-0 ps-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="fs-6 fw-semibold">
                                {menu.menu_name}
                              </div>
                              <div className="col-3">
                                <span
                                  className={`btn btn-color px-2 py-1   ${
                                    isItemAdded(menu.menu_id)
                                      ? "btn-secondary gray-text"
                                      : "btn-color text-white addOrder-btn"
                                  }`}
                                  onClick={() =>
                                    !isItemAdded(menu.menu_id) &&
                                    handleAddToOrder(menu)
                                  }
                                  style={{
                                    cursor: isItemAdded(menu.menu_id)
                                      ? "default"
                                      : "pointer",
                                  }}
                                >
                                  {isItemAdded(menu.menu_id) ? "Added" : "Add"}
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
                                    <span
                                      onClick={() =>
                                        handleCategoryClick(
                                          menu.menu_cat_id,
                                          menu.category_name
                                        )
                                      }
                                      style={{ cursor: "pointer" }}
                                    >
                                      <span className="text-success font_size_12">
                                        <i className="ri-restaurant-line mt-0 me-2"></i>
                                        {menu.category_name}
                                      </span>
                                    </span>
                                  </div>
                                </span>
                              </div>
                              <div className="col-4 text-center  me-0 ms-2 p-0 mt-1">
                                <span
                                  onClick={() => handleMenuClick(menu.menu_id)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <span className="    gray-text">
                                    <i className="ri-star-half-line pe-1  ratingStar"></i>
                                    {parseFloat(menu.rating).toFixed(1)}
                                  </span>
                                </span>
                              </div>
                            </div>
                            <div className="row mt-2">
                              <div className="col-8 px-0 ">
                                <span
                                  className="mb-0 mt-1 text-start "
                                  onClick={() => handleMenuClick(menu.menu_id)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <span className="ms-3 me-1 text-info fs-5 fw-semibold">
                                    ₹{calculatePrice(menu)}
                                  </span>
                                  <span className="gray-text fs-6 fw-normal text-decoration-line-through">
                                    ₹
                                    {(
                                      parseFloat(menu.oldPrice || menu.price) *
                                      (quantities[menu.menu_id] || 1)
                                    ).toFixed(2)}
                                  </span>
                                </span>
                                <span
                                  className="mb-0 mt-1 ms-3   offerSearch"
                                  onClick={() => handleMenuClick(menu.menu_id)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <span className="  px-0 text-start font_size_12 text-success">
                                    {menu.offer || "No "}% Off
                                  </span>
                                </span>
                              </div>
                              <div className="col-4">
                                <div className="d-flex justify-content-end align-items-center mt-1">
                                  <i
                                    className="ri-subtract-line   mx-2 fs-2"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleDecrement(menu.menu_id)
                                    }
                                  ></i>
                                  <span className=" ">
                                    {quantities[menu.menu_id] || 1}
                                  </span>
                                  <i
                                    className="ri-add-line mx-2  fs-2"
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

              {!isCompleted && pendingItems.length > 0 && (
                <div className="row g-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2 mt-0">
                    <h6 className="  mb-0 gray-text">Newly Added In Basket</h6>
                  </div>
                  {pendingItems.map((menu) => (
                    <div
                      key={menu.menu_id}
                      className="col-12 mt-2"
                      onClick={() =>
                        navigate(`/ProductDetails/${menu.menu_id}`, {
                          state: {
                            restaurant_id: restaurantId,
                            menu_cat_id: menu.menu_cat_id,
                          },
                        })
                      }
                    >
                      <div className="card my-2 rounded-3">
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
                                  objectFit: "cover",
                                  aspectRatio: "1/1",
                                }}
                                onError={(e) => {
                                  e.target.src = images;
                                }}
                              />
                            </div>
                            <div className="col-8 ps-2 pt-1 pe-0">
                              <div className="row">
                                <div className="col-11">
                                  <div className="fs-6 fw-semibold">
                                    {menu.menu_name}
                                  </div>
                                </div>
                                <div className="col-1 text-end px-0">
                                  <i
                                    className="ri-close-line"
                                    style={{ cursor: "pointer", zIndex: "100" }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleRemovePendingItem(menu.menu_id);
                                    }}
                                  ></i>
                                </div>
                              </div>
                              <div className="row mt-2">
                                <div className="col-8">
                                  <span className="text-success font_size_12 fw-medium">
                                    <i className="ri-restaurant-line mt-0 me-2"></i>
                                    {menu.category_name}
                                  </span>
                                </div>
                                <div className="col-4 text-end px-0">
                                  <i className="ri-star-half-line ratingStar font_size_12"></i>
                                  <span className="  gray-text font_size_12 fw-medium">
                                    {parseFloat(menu.rating).toFixed(1)}
                                  </span>
                                </div>
                              </div>
                              <div className="row mt-2">
                                <div className="col-9">
                                  <span className="  text-info">
                                    ₹{menu.price * menu.quantity}
                                  </span>
                                  <span className="gray-text   old-price text-decoration-line-through ms-2">
                                    ₹
                                    {(menu.oldPrice || menu.price) *
                                      menu.quantity}
                                  </span>
                                </div>
                                <div className="col-3 text-end px-0">
                                  <span className="quantity gray-text  ">
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
              {!isCompleted && pendingItems.length > 0 && (
                <div className="d-flex justify-content-center my-3">
                  <button
                    className="btn btn-color text-white btn-sm"
                    onClick={handleSubmitOrder}
                  >
                    Place Order ({pendingItems.length})
                  </button>
                </div>
              )}

              {!isCompleted && pendingItems.length > 0 && searchTerm !== "" && (
                <hr className="my-4 dotted-line text-primary" />
              )}
              {/* Horizontal line */}

              {/* Original menu items */}
              <div className="row ">
                <span className="gray-text ms-1 mb-2 ">
                  Existing Ordered Items
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
                      <div className="card mb-3 rounded-3">
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
                                  objectFit: "cover",
                                  aspectRatio: "1/1",
                                }}
                                onError={(e) => {
                                  e.target.src = images;
                                }}
                              />
                            </div>
                            <div className="col-8 pt-2 pb-0 pe-0 ps-2">
                              <div className="fs-6 fw-semibold">
                                {menu.menu_name}
                              </div>
                              <div className="row">
                                <div className="col-8">
                                  <i className="ri-restaurant-line mt-0 me-2 text-success fs-xs fw-medium"></i>
                                  <span className="text-success fs-xs fw-medium">
                                    {menu.category_name}
                                  </span>
                                </div>
                                <div className="col-4 text-end px-0">
                                  <span className="gray-text">
                                    <i className="ri-star-half-line ms-4 ratingStar"></i>
                                    {parseFloat(menu.rating).toFixed(1)}
                                  </span>
                                </div>
                              </div>
                              <div className="row mt-2">
                                <div className="col-9 px-0">
                                  <span className="mt-0 mb-2 customFontSize text-start fw-medium">
                                    <span className="ms-3 me-1 fs-5 fw-semibold text-info">
                                      ₹{menu.price}
                                    </span>
                                    <span className="gray-text fs-6 fw-normal text-decoration-line-through">
                                      ₹{oldPrice}
                                    </span>
                                  </span>
                                  <span className="mb-0 mt-1 ms-3   offerSearch">
                                    <span className="  px-0 text-start font_size_12 text-success">
                                      {menu.offer || "No "}% Off
                                    </span>
                                  </span>
                                </div>
                                <div className="col-3 text-end p-0">
                                  <span className="quantity gray-text  ">
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
            className="container mb-4 pt-0 z-3"
            style={{ backgroundColor: "transparent" }}
          >
            <div className="card mt-2 p-0 mb-5 ">
              <div className="card-body mx-auto rounded-3">
                <div className="row px-1 py-1">
                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center py-1">
                      <span className="ps-2 font_size_14 fw-semibold">
                        Total
                      </span>
                      <span className="pe-2 font_size_14 fw-semibold">
                        ₹{orderDetails.order_details.total_total || 0}
                      </span>
                    </div>
                    <hr className="p-0 m-0 text-primary" />
                  </div>
                  <div className="col-12 pt-0">
                    <div className="d-flex justify-content-between align-items-center py-0">
                      <span className="ps-2 font_size_14 pt-1 gray-text">
                        Service Charges
                        <span className="gray-text small-number">
                          (
                          {orderDetails.order_details.service_charges_percent ||
                            0}
                          % )
                        </span>
                      </span>
                      <span className="pe-2 font_size_14 gray-text">
                        ₹
                        {orderDetails.order_details.service_charges_amount || 0}
                      </span>
                    </div>
                  </div>
                  <div className="col-12 mb-0 py-1">
                    <div className="d-flex justify-content-between align-items-center py-0">
                      <span className="ps-2 font_size_14 gray-text">
                        GST{" "}
                        <span className="gray-text small-number">
                          {" "}
                          ({orderDetails.order_details.gst_percent || 0}% )
                        </span>
                      </span>
                      <span className="pe-2 font_size_14  text-start gray-text">
                        ₹{orderDetails.order_details.gst_amount || 0}
                      </span>
                    </div>
                  </div>
                  <div className="col-12 mb-0 pt-0 pb-1">
                    <div className="d-flex justify-content-between align-items-center py-0">
                      <span className="ps-2 font_size_14 gray-text">
                        Discount{" "}
                        <span className="gray-text small-number">
                          ({orderDetails.order_details.discount_percent || 0}% )
                        </span>
                      </span>
                      <span className="pe-2 font_size_14 gray-text">
                        -₹{orderDetails.order_details.discount_amount || 0}
                      </span>
                    </div>
                  </div>
                  <div>
                    <hr className=" p-0 m-0 text-primary" />
                  </div>
                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center py-1 fw-semibold pb-0 mb-0">
                      <span className="ps-2 font_size_14 fw-semibold fs-6">
                        Grand Total
                      </span>
                      <span className="pe-2 font_size_14 fw-semibold fs-6">
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
