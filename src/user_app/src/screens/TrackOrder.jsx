import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import SigninButton from "../constants/SigninButton";
import Bottom from "../component/bottom";
import OrderGif from "../screens/OrderGif"; // Ensure this import path is correct
import "../assets/css/toast.css";
import { useRestaurantId } from "../context/RestaurantIdContext"; // Correct import
import { ThemeProvider } from "../context/ThemeContext.js";
import LoaderGif from "./LoaderGIF.jsx";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import config from "../component/config";
import RestaurantSocials from "../components/RestaurantSocials.jsx";
import { renderSpicyLevel } from "../component/config";
import { usePopup } from "../context/PopupContext";
const TrackOrder = () => {
  const getFoodTypeTextStyles = (foodType) => {
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
          border: "border-muted",
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

  const titleCase = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  // Define displayCartItems
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false); // State to track if order is completed
  const navigate = useNavigate();
  const { order_number } = useParams();

  const { restaurantId } = useRestaurantId(); // Assuming this context provides restaurant ID

  const displayCartItems = orderDetails ? orderDetails.menu_details : [];
  const [cartDetails, setCartDetails] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("isDarkMode") === "true"
  );
  const toast = useRef(null);

  const isLoggedIn = !!localStorage.getItem("userData");

  const [selectedMenu, setSelectedMenu] = useState(null);
  const [portionSize, setPortionSize] = useState("full");
  const [halfPrice, setHalfPrice] = useState(null);
  const [fullPrice, setFullPrice] = useState(null);
  const [comment, setComment] = useState("");
  const [isPriceFetching, setIsPriceFetching] = useState(false);
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem("userData");
    return saved ? JSON.parse(saved) : null;
  });

  // Get user ID and role
  const userId = userData?.user_id || localStorage.getItem("user_id");
  const role = userData?.role || localStorage.getItem("role");

  const [orderStatus, setOrderStatus] = useState(null);

  // Add helper function at the top of component
  const isVegMenu = (menuType) => {
    return menuType?.toLowerCase() === "veg";
  };

  const handleMenuItemClick = (menu) => {
    navigate(`/user_app/ProductDetails/${menu.menu_id}`, {
      state: {
        menu_cat_id: menu.menu_cat_id,
        restaurant_id: menu.restaurant_id,
      },
    });
  };

  const isItemAdded = (menuId) => {
    return (
      removedItems.has(menuId) ||
      pendingItems.some((item) => item.menu_id === menuId)
    );
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

  const handleIncrement = (menuId) => {
    setQuantities((prev) => {
      const newQuantity = Math.min((prev[menuId] || 1) + 1, 20);
      if (newQuantity === 20) {
        toast.current.show({
          severity: "info",
          summary: "Maximum Quantity",
          detail: "You've reached the maximum quantity",
          life: 2000,
        });
      }
      return { ...prev, [menuId]: newQuantity };
    });

    // Also update quantity in pendingItems if the item exists there
    setPendingItems((prev) =>
      prev.map((item) => {
        if (item.menu_id === menuId) {
          return {
            ...item,
            quantity: Math.min((quantities[menuId] || 1) + 1, 20),
          };
        }
        return item;
      })
    );
  };

  const handleDecrement = (menuId) => {
    setQuantities((prev) => {
      const newQuantity = Math.max((prev[menuId] || 1) - 1, 1);
      if (newQuantity === 1) {
        toast.current.show({
          severity: "info",
          summary: "Minimum Quantity",
          detail: "You've reached the minimum quantity",
          life: 2000,
        });
      }
      return { ...prev, [menuId]: newQuantity };
    });

    // Also update quantity in pendingItems if the item exists there
    setPendingItems((prev) =>
      prev.map((item) => {
        if (item.menu_id === menuId) {
          return {
            ...item,
            quantity: Math.max((quantities[menuId] || 1) - 1, 1),
          };
        }
        return item;
      })
    );
  };

  const calculatePrice = (menu) => {
    const quantity = quantities[menu.menu_id] || 1;
    return (parseFloat(menu.price) * quantity).toFixed(2);
  };

  const handleMenuClick = (menu) => {
    navigate(`/user_app/ProductDetails/${menu.menu_id}`);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchedMenu, setSearchedMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [quantities, setQuantities] = useState({});
  const [prices, setPrices] = useState({});
  const getQuantity = (menuId) => quantities[menuId] || 1;

  const [orderItems, setOrderItems] = useState(null);
  const [pendingItems, setPendingItems] = useState(() => {
    const savedPendingItems = localStorage.getItem("pendingItems");
    return savedPendingItems ? JSON.parse(savedPendingItems) : [];
  });

  const [removedItems, setRemovedItems] = useState(new Set());

  const searchInputRef = useRef(null);
  const location = useLocation();
  const [favoriteMenus, setFavoriteMenus] = useState({});

  useEffect(() => {
    if (location.state?.orderStatus === "placed" && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [location.state, orderDetails]);

  useEffect(() => {
    localStorage.setItem("pendingItems", JSON.stringify(pendingItems));
  }, [pendingItems]);

  const [isWithinPlacedWindow, setIsWithinPlacedWindow] = useState(false);

  useEffect(() => {
    if (orderDetails?.order_details) {
      setOrderStatus(orderDetails.order_details.order_status.toLowerCase());

      if (orderDetails.order_details.order_status.toLowerCase() === "placed") {
        const orderTime = new Date(
          orderDetails.order_details.date_time
        ).getTime();
        const currentTime = new Date().getTime();
        const timeDifference = (currentTime - orderTime) / 1000;

        setIsWithinPlacedWindow(timeDifference <= 90);

        if (timeDifference <= 90) {
          const timer = setTimeout(() => {
            setIsWithinPlacedWindow(false);
            setOrderStatus("ongoing");
          }, (90 - timeDifference) * 1000);

          return () => clearTimeout(timer);
        }
      }
    }
  }, [orderDetails]);

  useEffect(() => {
    if (order_number) {
      const savedOrderItems = localStorage.getItem(
        `orderItems_${order_number}`
      );
      if (savedOrderItems) {
        const parsedOrderItems = JSON.parse(savedOrderItems);
        setOrderItems(parsedOrderItems);

        // Set initial order details if not already loaded from API
        if (!orderDetails) {
          setOrderDetails({
            menu_details: parsedOrderItems.items,
            order_details: {
              order_id: parsedOrderItems.order_id,
              order_number: order_number,
              total_total: parsedOrderItems.total_total,
              grand_total: parsedOrderItems.grand_total,
              created_at: parsedOrderItems.created_at,
              order_status: "placed",
            },
          });
        }
      }
    }
  }, [order_number]);

  useEffect(() => {
    if (orderDetails?.order_details?.created_at && orderStatus === "placed") {
      const orderTime = new Date(
        orderDetails.order_details.created_at
      ).getTime();
      const currentTime = new Date().getTime();
      const timeDiff = (currentTime - orderTime) / 1000; // Convert to seconds
      setIsWithinPlacedWindow(timeDiff <= 90);
    }
  }, [orderDetails, orderStatus]);

  useEffect(() => {
    if (orderStatus === "completed") {
      localStorage.removeItem(`removedOrderItems_${order_number}`);
      setRemovedItems([]);
    }
  }, [orderStatus, order_number]);

  useEffect(() => {
    if (orderDetails && removedItems.length > 0) {
      const filteredMenuDetails = orderDetails.menu_details.filter(
        (item) =>
          !removedItems.some(
            (removedItem) =>
              removedItem.menu_id === item.menu_id &&
              removedItem.order_id === orderDetails.order_details.order_id
          )
      );

      if (filteredMenuDetails.length !== orderDetails.menu_details.length) {
        setOrderDetails((prev) => ({
          ...prev,
          menu_details: filteredMenuDetails,
          order_details: {
            ...prev.order_details,
            total_total: filteredMenuDetails
              .reduce(
                (sum, item) => sum + parseFloat(item.price) * item.quantity,
                0
              )
              .toFixed(2),
          },
        }));
      }
    }
  }, [orderDetails, removedItems]);

  const handleRemovePendingItem = (menuId) => {
    setPendingItems((prev) => prev.filter((item) => item.menu_id !== menuId));
    setRemovedItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(menuId);
      return newSet;
    });

    // If the item exists in the original search results, add it back
    const removedItem = searchedMenu.find((item) => item.menu_id === menuId);
    if (removedItem) {
      setSearchedMenu((prev) => [...prev, removedItem]);
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
        const userData = JSON.parse(localStorage.getItem("userData"));
        const currentUserId = userData?.user_id || localStorage.getItem("user_id");
        const currentRole = userData?.role || localStorage.getItem("role");

        if (!currentUserId) {
          return;
        }

        const requestBody = {
          restaurant_id: parseInt(restaurantId, 10),
          keyword: debouncedSearchTerm.trim(),
          user_id: currentUserId,
          role: currentRole,
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
          } else {
          }
        } else {
          console.clear();
        }
      } catch (error) {
        console.clear();
      }

      setIsLoading(false);
    };

    fetchSearchedMenu();
  }, [debouncedSearchTerm, restaurantId, userId]);

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  // Update the handleLikeClick function
  useEffect(() => {
    if (orderDetails?.order_items) {
      const initialFavorites = {};
      orderDetails.order_items.forEach((item) => {
        initialFavorites[item.menu_id] =
          item.is_favourite === 1 || item.is_favourite === true;
      });
      setFavoriteMenus(initialFavorites);
    }
  }, [orderDetails]);

  useEffect(() => {
    const handleFavoriteUpdate = (event) => {
      const { menuId, isFavorite } = event.detail;

      // Update both states to ensure consistency
      setFavoriteMenus((prev) => ({
        ...prev,
        [menuId]: isFavorite,
      }));

      setOrderDetails((prevDetails) => {
        if (!prevDetails?.order_items) return prevDetails;
        return {
          ...prevDetails,
          order_items: prevDetails.order_items.map((item) =>
            item.menu_id === menuId
              ? { ...item, is_favourite: isFavorite }
              : item
          ),
        };
      });
    };

    // Listen for both event names to ensure compatibility
    window.addEventListener("favoriteUpdated", handleFavoriteUpdate);
    window.addEventListener("favoritesUpdated", handleFavoriteUpdate);
    window.addEventListener("favoriteStatusChanged", handleFavoriteUpdate);

    return () => {
      window.removeEventListener("favoriteUpdated", handleFavoriteUpdate);
      window.removeEventListener("favoritesUpdated", handleFavoriteUpdate);
      window.removeEventListener("favoriteStatusChanged", handleFavoriteUpdate);
    };
  }, []);

  const { showLoginPopup } = usePopup();

  const handleUnauthorizedFavorite = (navigate) => {
    window.showToast("info", "Please login to use favourite functionality");
    showLoginPopup();
  };

  const handleLikeClick = async (menu, e) => {
    e.preventDefault();
    e.stopPropagation();

    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.user_id || userData.role === "guest") {
      window.showToast("info", "Please login to use favourite functionality");
      showLoginPopup();
      return;
    }

    const currentRestaurantId =
      menu.restaurant_id || localStorage.getItem("restaurantId");
    const isFavorite = favoriteMenus[menu.menu_id] || false;

    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/${
          isFavorite ? "remove" : "save"
        }_favourite_menu`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: currentRestaurantId,
            menu_id: menu.menu_id,
            user_id: userData.user_id,
            role: userData.role,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.st === 1) {
        const newFavoriteStatus = !isFavorite;

        // Update local favorite status
        setFavoriteMenus((prev) => ({
          ...prev,
          [menu.menu_id]: newFavoriteStatus,
        }));

        // Update order details
        setOrderDetails((prevDetails) => {
          if (!prevDetails?.menu_details) return prevDetails;
          return {
            ...prevDetails,
            menu_details: prevDetails.menu_details.map((item) =>
              item.menu_id === menu.menu_id
                ? { ...item, is_favourite: newFavoriteStatus }
                : item
            ),
          };
        });

        // Dispatch global event
        window.dispatchEvent(
          new CustomEvent("favoriteUpdated", {
            detail: {
              menuId: menu.menu_id,
              isFavorite: newFavoriteStatus,
              restaurantId: currentRestaurantId,
            },
          })
        );

        window.showToast(
          "success",
          isFavorite ? "Removed from favourite" : "Added to favourite"
        );
      }
    } catch (error) {
      console.clear();
      window.showToast("error", "Failed to update favorite status");
    }
  };

  const fetchOrderDetails = async (orderNumber) => {
    const sectionId = localStorage.getItem("sectionId") || "";
    
    try {
      setLoading(true);
      const response = await fetch(`${config.apiDomain}/user_api/get_order_details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_number: orderNumber,
          user_id: userId,
          role: role,
          section_id: sectionId
        })
      });

      if (response.ok) {
        const { lists } = await response.json();
        if (lists) {
          // Format menu items
          const formattedMenu = lists.menu_details.map(item => ({
            ...item,
            menu_name: toTitleCase(item.menu_name),
            is_favourite: item.is_favourite === 1,
            discountedPrice: item.offer ? Math.floor(item.price * (1 - item.offer/100)) : item.price
          }));

          // Update order details with formatted menu
          setOrderDetails({
            ...lists,
            menu_details: formattedMenu
          });

          // Handle order status
          const status = lists.order_details.order_status.toLowerCase();
          setOrderStatus(["cancle", "cancelled", "canceled"].includes(status) ? "canceled" : status);
          setIsCompleted(status === "completed" || ["cancle", "cancelled", "canceled"].includes(status));
        }
      }
    } catch (error) {
      console.clear();
    } finally {
      setLoading(false);
    }
  };

  // Add this helper function to format the status display
  const getDisplayStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "canceled":
      case "cancle":
        return "Cancelled Order";
      case "ongoing":
        return "Ongoing Order";
      case "placed":
        return "Placed Order";
      case "completed":
        return "Completed Order";
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "canceled":
      case "cancle":
        return "fa-regular fa-circle-xmark text-danger";
      case "ongoing":
        return "fa-solid fa-hourglass-half text-secondary opacity-25 font_size_14";
      case "placed":
        return "ri-file-list-3-line text-primary";
      case "completed":
        return "ri-checkbox-circle-line text-success";
      default:
        return "ri-question-line";
    }
  };

  // Update the status display JSX

  useEffect(() => {
    // Simulate fetching order details
    const fetchOrderDetails = async () => {
      // Simulate API call
      const savedOrderItems = localStorage.getItem(
        `orderItems_${order_number}`
      );
      if (savedOrderItems) {
        const parsedOrderItems = JSON.parse(savedOrderItems);
        setOrderDetails(parsedOrderItems);

        // Set order status
        setOrderStatus("placed");

        // Calculate if within placed window
        const orderTime = new Date(parsedOrderItems.created_at).getTime();
        const currentTime = new Date().getTime();
        const timeDiff = (currentTime - orderTime) / 1000; // Convert to seconds
        setIsWithinPlacedWindow(timeDiff <= 90);
      }
    };

    fetchOrderDetails();
  }, [order_number]);

  const handleRemoveItem = (menu, e) => {
    e.stopPropagation();

    if (orderStatus !== "placed" || !isWithinPlacedWindow) {
      window.showToast(
        "error",
        "Items can only be removed within 90 seconds of placing the order"
      );
      return;
    }

    try {
      setOrderDetails((prev) => ({
        ...prev,
        menu_details: prev.menu_details.filter(
          (item) => item.menu_id !== menu.menu_id
        ),
      }));

      window.showToast("success", `${menu.menu_name} removed from order`);
    } catch (error) {
      console.clear();

      window.showToast("error", "Failed to remove item. Please try again.");
    }
  };

  const getFoodTypeStyles = (foodType) => {
    // Convert foodType to lowercase for case-insensitive comparison
    const type = (foodType || "").toLowerCase();

    switch (type) {
      case "veg":
        return {
          icon: "fa-solid fa-circle text-success", // Food type indicator color
          border: "border-success",
          textColor: "text-success", // Category text color - always green
          categoryIcon: "fa-solid fa-utensils text-success me-1", // Added for category
        };
      case "nonveg":
        return {
          icon: "fa-solid fa-play fa-rotate-270 text-danger", // Food type indicator color
          border: "border-danger",
          textColor: "text-success", // Category text color - always green
          categoryIcon: "fa-solid fa-utensils text-success me-1", // Added for category
        };
      case "egg":
        return {
          icon: "fa-solid fa-egg gray-text", // Food type indicator color
          border: "border-muted",
          textColor: "text-success", // Category text color - always green
          categoryIcon: "fa-solid fa-utensils text-success me-1", // Added for category
        };
      case "vegan":
        return {
          icon: "fa-solid fa-leaf text-success", // Food type indicator color
          border: "border-success",
          textColor: "text-success", // Category text color - always green
          categoryIcon: "fa-solid fa-utensils text-success me-1", // Added for category
        };
      default:
        return {
          icon: "fa-solid fa-circle text-success", // Food type indicator color
          border: "border-success",
          textColor: "text-success", // Category text color - always green
          categoryIcon: "fa-solid fa-utensils text-success me-1", // Added for category
        };
    }
  };

  useEffect(() => {
    if (orderDetails && removedItems.length > 0) {
      const filteredMenuDetails = orderDetails.menu_details.filter(
        (item) =>
          !removedItems.some(
            (removedItem) =>
              removedItem.menu_id === item.menu_id &&
              removedItem.order_id === orderDetails.order_details.order_id
          )
      );

      if (filteredMenuDetails.length !== orderDetails.menu_details.length) {
        setOrderDetails((prev) => ({
          ...prev,
          menu_details: filteredMenuDetails,
          order_details: {
            ...prev.order_details,
            total_total: filteredMenuDetails
              .reduce(
                (sum, item) => sum + parseFloat(item.price) * item.quantity,
                0
              )
              .toFixed(2),
          },
        }));
      }
    }
  }, [orderDetails, removedItems]);

  const RemainingTimeDisplay = () => {
    if (!isWithinPlacedWindow || !orderDetails?.order_details?.date_time) {
      return null;
    }

    const titleCase = (str) => {
      if (!str) return "";
      return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    const orderTime = new Date(orderDetails.order_details.date_time).getTime();
    const currentTime = new Date().getTime();
    const remainingSeconds = Math.max(
      0,
      90 - Math.floor((currentTime - orderTime) / 1000)
    );

    return (
      <div className="text-center text-warning mb-2">
        <small>
          Time remaining to modify order: {remainingSeconds} seconds
        </small>
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      if (order_number) {
        await fetchOrderDetails(order_number);
      }
    };
    fetchData();
  }, [order_number]);

  const handleCategoryClick = (categoryId, categoryName) => {
    navigate(`/user_app/Category/${categoryId}`, {
      state: { categoryName },
    });
  };

  useEffect(() => {
    if (order_number && restaurantId && userId) {
      fetchOrderDetails(order_number);
      // fetchOrderStatus();
      // handleSubmitOrder();
    }
  }, [order_number, restaurantId, userId]);

  useEffect(() => {
    const checkOrderExists = () => {
      try {
        const allOrders = JSON.parse(
          localStorage.getItem("allOrderList") || "{}"
        );

        // Check placed orders
        if (
          allOrders.placed?.some((order) => order.order_number === order_number)
        ) {
          return true;
        }

        // Check ongoing orders
        if (
          allOrders.ongoing?.some(
            (order) => order.order_number === order_number
          )
        ) {
          return true;
        }

        // Check completed orders (date-wise grouping)
        if (allOrders.completed) {
          const exists = Object.values(allOrders.completed).some((dateOrders) =>
            dateOrders.some((order) => order.order_number === order_number)
          );
          if (exists) return true;
        }

        // Check cancelled orders (handle both spellings and structures)
        if (
          allOrders.cancelled?.some(
            (order) => order.order_number === order_number
          ) ||
          allOrders.canceled?.some(
            (order) => order.order_number === order_number
          ) ||
          allOrders.cancle?.some((order) => order.order_number === order_number)
        ) {
          return true;
        }

        // If order not found anywhere
        window.showToast("error", "Order not found");
        navigate("/user_app/Index");
        return false;
      } catch (error) {
        console.clear();
      }
    };

    if (order_number && !orderDetails) {
      checkOrderExists();
    }
  }, [order_number, navigate, orderDetails]);

  // Add this check right after the component declarations
  useEffect(() => {
    const validateOrder = () => {
      try {
        const allOrders = JSON.parse(
          localStorage.getItem("allOrderList") || "{}"
        );
        let orderFound = false;

        // Check ongoing orders
        if (allOrders.ongoing?.length > 0) {
          orderFound = allOrders.ongoing.some(
            (order) => order.order_number === order_number
          );
        }

        // Check completed orders (date-wise grouping)
        if (!orderFound && allOrders.completed) {
          orderFound = Object.values(allOrders.completed).some((dateOrders) =>
            dateOrders.some((order) => order.order_number === order_number)
          );
        }

        // Check placed orders
        if (!orderFound && allOrders.placed?.length > 0) {
          orderFound = allOrders.placed.some(
            (order) => order.order_number === order_number
          );
        }

        // Check cancelled orders - handle both date-wise and array formats
        if (!orderFound) {
          // First check if cancelled orders are date-wise grouped
          const cancelTypes = ["cancelled", "canceled", "cancle"];
          for (const type of cancelTypes) {
            if (allOrders[type]) {
              // If it's an array, check directly
              if (Array.isArray(allOrders[type])) {
                orderFound = allOrders[type].some(
                  (order) => order.order_number === order_number
                );
              }
              // If it's date-wise grouped, check each date group
              else {
                orderFound = Object.values(allOrders[type]).some(
                  (dateOrders) =>
                    Array.isArray(dateOrders) &&
                    dateOrders.some(
                      (order) => order.order_number === order_number
                    )
                );
              }
              if (orderFound) break;
            }
          }
        }

        // If order is not found in any category
        if (!orderFound) {
          setLoading(false);
          window.showToast("error", "Order not found");
          navigate("/user_app/Index");
          return false;
        }

        return true;
      } catch (error) {
        console.clear();
        setLoading(false);
        window.showToast("error", "Something went wrong");
        navigate("/user_app/Index");
        return false;
      }
    };

    if (order_number) {
      validateOrder();
    }
  }, [order_number, navigate]);

  // Update the loading condition in the return statement
  if (loading && !orderDetails) {
    return (
      <div id="preloader">
        <div className="loader">
          <LoaderGif />
        </div>
      </div>
    );
  }

  const { order_details, menu_details } = orderDetails;

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
      return (
        <i className="fa-solid fa-star font_size_10 text-warning me-1"></i>
      );
    }

    return (
      <i className="fa-solid fa-star-half-stroke font_size_10 text-warning me-1"></i>
    );
  };

  // Define getOrderTypeIcon function inside the TrackOrder component
  const getOrderTypeIcon = (orderType) => {
    switch (orderType?.toLowerCase()) {
      case "parcel":
        return <i className="fa-solid fa-hand-holding-heart"></i>;
      case "drive-through":
        return <i className="fa-solid fa-car-side"></i>;
      case "dine-in":
        return <i className="fa-solid fa-utensils"></i>;
      default:
        return null;
    }
  };

  // Add this calculation function
  const calculateTotals = (orderDetails) => {
    if (!orderDetails) return {};

    const totalBill = parseFloat(orderDetails.total_bill || 0);
    const discountPercent = parseFloat(orderDetails.discount_percent || 0);
    const discountAmount = parseFloat(orderDetails.discount_amount || 0);
    const totalAfterDiscount = parseFloat(
      orderDetails.total_after_discount || 0
    );
    const serviceChargesPercent = parseFloat(
      orderDetails.service_charges_percent || 0
    );
    const serviceChargesAmount = parseFloat(
      orderDetails.service_charges_amount || 0
    );
    const gstPercent = parseFloat(orderDetails.gst_percent || 0);
    const gstAmount = parseFloat(orderDetails.gst_amount || 0);
    const grandTotal = parseFloat(orderDetails.grand_total || 0);

    return {
      totalBill,
      discountPercent,
      discountAmount,
      totalAfterDiscount,
      serviceChargesPercent,
      serviceChargesAmount,
      gstPercent,
      gstAmount,
      grandTotal,
    };
  };

  return (
    <>
      <div className="page-wrapper full-height pb-5">
        <Header title="Order Details" />

        <div className="container mt-5 pb-0">
          <div className="d-flex justify-content-between align-items-center mb-2">
            {orderStatus && (
              <div className="order-status d-flex align-items-center">
                <span className="d-flex align-items-center">
                  <i className={`${getStatusIcon(orderStatus)} me-2 fs-5`}></i>
                  <span className="font_size_14 fw-medium">
                    {getDisplayStatus(orderStatus).toUpperCase()}
                  </span>
                </span>
              </div>
            )}

            <span className="gray-text font_size_14">{order_details.date}</span>
          </div>

          <div className="card rounded-4">
            <div className="card-body p-2">
              <div className="row align-items-center mb-0">
                <div className="col-6">
                  <span className="fs-6 fw-semibold mb-0">
                    <i className="fa-solid fa-hashtag pe-2 font_size_14"></i>
                    {order_details.order_number}
                  </span>
                </div>
                <div className="col-6 text-end">
                  <span className="font_size_12 gray-text  ">
                    {order_details.time}
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col-12 text-start">
                  <div className="restaurant">
                    <i className="fa-solid fa-store pe-2 font_size_14"></i>
                    <span className="font_size_14 fw-medium">
                      {order_details.restaurant_name.toUpperCase()}
                    </span>
                  </div>
                </div>
                {/* <div className="col-4 text-end">
                  <i className="fa-solid fa-location-dot ps-0 pe-1 font_size_12 gray-text"></i>
                  <span className="gray-text font_size_12">
                    {order_details.table_number}
                  </span>
                </div> */}
              </div>
              <div className="row">
                <div className="col-6 text-start pe-0">
                  {/* <i className="fa-solid fa-location-dot ps-2 pe-1 font_size_12 gray-text"></i> */}
                  <span className="font_size_12 gray-text font_size_12 text-nowrap">
                    {getOrderTypeIcon(order_details.order_type) || (
                      <i className="fa-solid fa-utensils"></i>
                    )}
                    <span className="ms-2">
                      {order_details.order_type || "Dine In"}
                    </span>
                  </span>
                </div>
                <div className="col-6 text-end">
                  <div className="font_size_12 gray-text font_size_12 text-nowrap">
                    <span className="fw-medium gray-text">
                      <i className="fa-solid fa-location-dot ps-2 pe-1 font_size_12 gray-text"></i>
                      {titleCase(order_details.section_name)} -{" "}
                      {order_details.table_number}
                    </span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="menu-info">
                    <span className="font_size_12 gray-text">
                      <i className="fa-solid fa-bowl-rice pe-2 gray-text font_size_12"></i>
                      {order_details.menu_count} Menu
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-end">
                    <span className="text-info font_size_14 fw-semibold">
                      ₹{order_details.grand_total}
                    </span>
                    <span className="text-decoration-line-through ms-2 gray-text font_size_12 fw-normal">
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
              <div className="row">
                <div className="col-6">
                  <div className="menu-info">
                    <span className="font_size_12 gray-text">
                     
                      Payment Method: {order_details.payment_method}
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-end">
                    <span className="text-info font_size_14 fw-semibold">
                      ₹{order_details.grand_total}
                    </span>
                    <span className="text-decoration-line-through ms-2 gray-text font_size_12 fw-normal">
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
          <div className="container py-0">
            {!loading && orderStatus && (
              <>
                {orderStatus === "completed" ? (
                  <>
                    <div className="card-body text-center bg-success rounded-4 text-white">
                      <span className="fs-6 fw-medium h-100">
                        Your delicious order has been served
                      </span>
                    </div>
                    <div className="d-flex justify-content-center pt-3">
                      {order_details.payment_method && (
                        <div className="border border-success rounded-pill py-0 px-2 font_size_14">
                          Payment Method: {order_details.payment_method}
                        </div>
                      )}
                    </div>
                  </>
                ) : ["canceled", "cancelled", "cancle"].includes(
                    orderStatus
                  ) ? (
                  <div className="card-body text-center bg-danger rounded-4 text-white">
                    <span className="fs-6 fw-medium h-100">
                      This order has been cancelled
                    </span>
                  </div>
                ) : orderStatus === "placed" ? (
                  <div className="card-body p-0">
                    <div className="card rounded-4">
                      <div className="row py-2 my-0 ps-2 pe-0 h-100">
                        <div className="col-3 d-flex align-items-center justify-content-center pe-2">
                          <OrderGif />
                        </div>
                        <div className="col-8 d-flex align-items-center justify-content-center px-0">
                          <div className="text-start mb-0">
                            <div className="fw-medium">
                              Thanks for ordering!
                            </div>
                            <div className="fw-medium">
                              We'll start right away.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : orderStatus === "ongoing" ? (
                  <div className="card-body p-0">
                    <div className="card rounded-4">
                      <div className="row py-2 my-0 ps-2 pe-0 h-100">
                        <div className="col-3 d-flex align-items-center justify-content-center pe-2">
                          <OrderGif />
                        </div>
                        <div className="col-8 d-flex align-items-center justify-content-center px-0">
                          <div className="text-center mb-0">
                            <div className="fw-medium">
                              You have the best taste in food.
                            </div>
                            <div className="fw-medium">
                              We're crafting a menu to match it perfectly.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </ThemeProvider>

        <main className="page-content">
          {orderDetails?.order_details?.order_status === "placed" && (
            <RemainingTimeDisplay />
          )}

          {userId ? (
            <section className="container mt-1 py-1">
              {!isCompleted && pendingItems.length > 0 && searchTerm !== "" && (
                <hr className="my-4 dotted-line text-primary" />
              )}
              <div className="container py-0">
                <div className="row">
                  {menu_details.map((menu) => (
                    <div key={menu.menu_id} className="py-2 px-0">
                      <div
                        className="custom-card rounded-4 shadow-sm"
                        onClick={() => handleMenuItemClick(menu)}
                      >
                        <div className="card-body py-0">
                          <div className="row">
                            <div className="col-3 px-0 position-relative">
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
                                }}
                              />

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
                              {/* Offer badge */}
                              {menu.offer !== 0 && (
                                <div className="gradient_bg d-flex justify-content-center align-items-center gradient_bg_offer">
                                  <span className="font_size_10 text-white">
                                    {menu.offer || "No"}% Off
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="col-9 pt-1 p-0 pe-2">
                              {/* Menu name and remove button */}
                              <div className="row d-flex align-items-center mt-1">
                                <div className="col-10">
                                  <div className="ps-2 font_size_14 fw-medium">
                                    {menu.menu_name}
                                  </div>
                                </div>
                                {orderStatus === "placed" &&
                                  isWithinPlacedWindow && (
                                    <div className="col-2 text-end font_size_10">
                                      <div className="d-flex align-items-center justify-content-end">
                                        <i
                                          className="fa-solid fa-xmark gray-text font_size_14"
                                          onClick={(e) =>
                                            handleRemoveItem(menu, e)
                                          }
                                        ></i>
                                      </div>
                                    </div>
                                  )}
                              </div>

                              {/* Category, Spicy level, and Rating */}
                              <div className="row d-flex align-items-center mt-1">
                                <div className="col-6 d-flex align-items-center">
                                  <span className="ps-2 font_size_10 text-success">
                                    <i className="fa-solid fa-utensils text-success me-1"></i>
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

                              {/* Price and Quantity */}
                              <div className="row">
                                <div className="col-9 mt-2">
                                  <p className="ms-2 mb-0 fw-medium">
                                    <span className="font_size_14 fw-semibold text-info">
                                      ₹
                                      {menu.offer > 0
                                        ? Math.floor(
                                            menu.price * (1 - menu.offer / 100)
                                          )
                                        : menu.price}
                                    </span>
                                    {menu.offer > 0 && (
                                      <span className="gray-text font_size_12 text-decoration-line-through fw-normal ms-2">
                                        ₹{menu.price}
                                      </span>
                                    )}
                                  </p>
                                </div>
                                <div className="col-3 text-end">
                                  <span className="font_size_14 gray-text">
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

                  {/* Add Order More button outside the card, but only for placed and ongoing orders */}
                  {(orderStatus === "placed" || orderStatus === "ongoing") &&
                    !isCompleted &&
                    orderStatus !== "canceled" && (
                      <div className="col-12 mt-3 mb-4">
                        <div className="d-flex justify-content-center">
                          <button
                            className="btn btn-sm btn-outline-primary rounded-pill px-3"
                            onClick={() => {
                              navigate("/user_app/Menu", {
                                state: {
                                  existingOrderId:
                                    orderDetails?.order_details?.order_id,
                                  isAddingToOrder: true,
                                  orderStatus: orderStatus,
                                },
                              });
                            }}
                          >
                            <i className="bx bx-plus me-1 fs-4"></i>
                            Order More Items
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </section>
          ) : (
            <SigninButton />
          )}
        </main>

        {userId && orderDetails && (
          <div className="container mb-4 pt-0 z-3">
            <div className="card mt-2 p-0 mb-3 ">
              <div className="card-body mx-auto rounded-4 p-0">
                <div className="row p-1">
                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center py-1">
                      <span className="ps-2 font_size_14 fw-semibold">
                        Total
                      </span>
                      <span className="pe-2 font_size_14 fw-semibold">
                        ₹
                        {parseFloat(
                          orderDetails.order_details.total_bill_amount || 0
                        ).toFixed(2)}
                      </span>
                    </div>
                    <hr className="p-0 m-0 text-primary w-100" />
                  </div>
                  <div className="col-12 pt-0">
                    {orderDetails.order_details.discount_amount > 0 && (
                      <div className="d-flex justify-content-between align-items-center py-0 px-2 mt-1">
                        <span className="font_size_14 gray-text">
                          Total after discount
                        </span>
                        <span className="font_size_14 gray-text">
                          ₹
                          {(
                            parseFloat(
                              orderDetails.order_details.total_bill_amount
                            ) -
                            parseFloat(
                              orderDetails.order_details
                                .total_bill_with_discount
                            )
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}
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
                        {parseFloat(
                          orderDetails.order_details.service_charges_amount
                        ).toFixed(2) || 0}
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
                        ₹
                        {parseFloat(
                          orderDetails.order_details.gst_amount
                        ).toFixed(2) || 0}
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
                        -₹
                        {parseFloat(
                          orderDetails.order_details.discount_amount
                        ).toFixed(2) || 0}
                      </span>
                    </div>
                  </div>
                  <div>
                    <hr className=" p-0 m-0 text-primary w-100" />
                  </div>
                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center py-1 fw-semibold pb-0 mb-0">
                      <span className="ps-2 fw-semibold fs-6">Grand Total</span>
                      <span className="pe-2  fw-semibold fs-6">
                        ₹
                        {parseFloat(
                          orderDetails.order_details.grand_total
                        ).toFixed(2) || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {orderStatus === "completed" && (
              <div className="d-flex justify-content-end">
                {orderDetails?.order_details?.invoice_url ? (
                  <a
                    href={orderDetails.order_details.invoice_url}
                    download={`invoice_${orderDetails.order_details.order_number}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="btn btn-light py-1 px-2 mb-2 me-2 rounded-pill font_size_12">
                      <i className="fa-solid fa-download me-2"></i>
                      Invoice &nbsp;
                    </button>
                  </a>
                ) : (
                  <></>
                )}
              </div>
            )}

            <div className="d-flex flex-column align-items-center mt-4">
              <div className="d-flex justify-content-center gap-5 mb-2">
                {/* Bad Rating */}
                <div className="text-center">
                  <input
                    type="radio"
                    className="btn-check"
                    name="rating"
                    id="bad-rating"
                    value="bad"
                  />
                  <label htmlFor="bad-rating">
                    <i
                      className="fa-solid fa-face-frown text-danger"
                      style={{ fontSize: "3em" }}
                    ></i>
                    <span className="d-block mt-1 ">Bad</span>
                  </label>
                </div>

                {/* Okay Rating */}
                <div className="text-center">
                  <input
                    type="radio"
                    className="btn-check"
                    name="rating"
                    id="okay-rating"
                    value="okay"
                  />
                  <label htmlFor="okay-rating">
                    <i
                      className="fa-solid fa-face-meh text-light"
                      style={{ fontSize: "3em" }}
                    ></i>
                    <span className="d-block mt-1">Okay</span>
                  </label>
                </div>

                {/* Good Rating */}
                <div className="text-center">
                  <input
                    type="radio"
                    className="btn-check"
                    name="rating"
                    id="good-rating"
                    value="good"
                  />
                  <label htmlFor="good-rating">
                    <i
                      className="fa-solid fa-face-smile text-success"
                      style={{ fontSize: "3em" }}
                    ></i>
                    <span className="d-block mt-1">Good</span>
                  </label>
                </div>
              </div>
              <div className="btn btn-sm btn-success rounded-pill px-5 py-3 mt-4">
                <i class="fa-solid fa-star me-2"></i>
                Rate us on Google
              </div>
            </div>

            <RestaurantSocials />
          </div>
        )}

        <Bottom></Bottom>
      </div>
    </>
  );
};

export default TrackOrder;
