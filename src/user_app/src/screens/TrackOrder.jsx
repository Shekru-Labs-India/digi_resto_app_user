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
import axios from "axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import MenuMitra from "../assets/logos/menumitra_logo_128.png";

const TrackOrder = () => {
  const titleCase = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0)?.toUpperCase() + word.slice(1))
      .join(" ");
  };

  const { state } = useLocation();
  const { order_number } = useParams();

  // Get orderId from multiple sources with fallback
  const orderId = state?.orderId || localStorage.getItem("current_order_id");

  console.log("TrackOrder: Component mounted");
  console.log("TrackOrder: State from navigation:", state);
  console.log("TrackOrder: OrderId from state:", orderId);
  console.log("TrackOrder: Order number from params:", order_number);

  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [hasGoogleReview, setHasGoogleReview] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedRating, setSelectedRating] = useState("");
  const [hasRated, setHasRated] = useState(false);
  const navigate = useNavigate();
  const [isProcessingUPI, setIsProcessingUPI] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const timeoutRef = useRef({});

  // Clean up localStorage on unmount
  useEffect(() => {
    return () => {
      localStorage.removeItem("current_order_id");
    };
  }, []);

  useEffect(() => {
    const customerName = localStorage.getItem("customerName");
    setCustomerName(customerName);
  }, []);

  const [isProcessingPhonePe, setIsProcessingPhonePe] = useState(false);
  const [isProcessingGPay, setIsProcessingGPay] = useState(false);
  const { restaurantId } = useRestaurantId(); // Assuming this context provides restaurant ID
  const [showCompleteModal, setShowCompleteModal] = useState(false);
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

  const [orderStatus, setOrderStatus] = useState("");

  // Add helper function at the top of component
  const isVegMenu = (menuType) => {
    return menuType?.toLowerCase() === "veg";
  };

  const handleMenuItemClick = (menu) => {
    const existingOrder = JSON.parse(
      localStorage.getItem("existing_order")
    ) || { order_items: [] };
    const existingOrderItem = existingOrder.order_items.find(
      (item) => item.menu_id === menu.menu_id
    );

    if (existingOrderItem && existingOrderItem.quantity >= 20) {
      window.showToast("info", "Cannot add more. Maximum limit of 20 reached.");
      return;
    }

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
    try {
      const restaurantSocial = JSON.parse(
        localStorage.getItem("restaurantSocial") || "[]"
      );
      const rateOnGoogle = restaurantSocial.find(
        (social) => social.id === "google_review"
      )?.link;
      setHasGoogleReview(!!rateOnGoogle);
    } catch (error) {
      setHasGoogleReview(false);
    }
  }, []);

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
        toast.current?.show({
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
        toast.current?.show({
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
      // console.log(
      //   "------",
      //   orderDetails.order_details.order_status.toLowerCase()
      // );

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
              final_grand_total: parsedOrderItems.final_grand_total,
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
      const filteredMenuDetails = orderDetails.menu_details?.filter(
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
    setPendingItems((prev) => prev?.filter((item) => item.menu_id !== menuId));
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
        const currentUserId =
          userData?.user_id || localStorage.getItem("user_id");
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
              // Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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
    if (!str) return ""; // Return empty string if input is undefined or null
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
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
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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

    console.log("TrackOrder: Fetching order details");
    console.log("TrackOrder: Order Number:", orderNumber);
    console.log("TrackOrder: Order ID:", orderId);
    console.log("TrackOrder: Section ID:", sectionId);

    try {
      setLoading(true);
      const response = await fetch(
        `${config.apiDomain}/user_api/get_order_details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            order_id: orderId,
            section_id: sectionId,
          }),
        }
      );

      if (response.status === 401) {
        const restaurantCode = localStorage.getItem("restaurantCode");
        const tableNumber = localStorage.getItem("tableNumber");
        const sectionId = localStorage.getItem("sectionId");
        localStorage.removeItem("user_id");
        localStorage.removeItem("userData");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("access_token");
        localStorage.removeItem("current_order_id");
        localStorage.removeItem("customerName");
        localStorage.removeItem("mobile");
        showLoginPopup();
        navigate(`/user_app/${restaurantCode}/${tableNumber}/${sectionId}`);

        return;
      }

      if (response.ok) {
        const data = await response.json();
        console.log("TrackOrder: API Response:", data);

        if (data.st === 1 && data.lists) {
          const { lists } = data;
          // Format menu items
          const formattedMenu = lists.menu_details.map((item) => ({
            ...item,
            menu_name: toTitleCase(item.menu_name),
            is_favourite: item.is_favourite === 1,
            discountedPrice: item.offer
              ? Math.floor(item.price * (1 - item.offer / 100))
              : item.price,
          }));

          // Update order details with formatted menu
          setOrderDetails({
            ...lists,
            menu_details: formattedMenu,
          });

          // Set rating if it exists
          if (lists.order_details.rating && parseInt(lists.order_details.rating) > 0) {
            setSelectedRating(parseInt(lists.order_details.rating));
            setHasRated(true);
          }

          // Handle order status
          const status = lists.order_details.order_status.toLowerCase();
          setOrderStatus(
            ["cancle", "cancelled", "canceled"].includes(status)
              ? "canceled"
              : status
          );
          setIsCompleted(
            status === "completed" ||
              ["cancle", "cancelled", "canceled"].includes(status)
          );
        } else {
          console.error("TrackOrder: Invalid response format:", data);
          window.showToast("error", "Failed to fetch order details");
        }
      }
    } catch (error) {
      console.error("TrackOrder: Error fetching order details:", error);
      window.showToast(
        "error",
        "An error occurred while fetching order details"
      );
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
        menu_details: prev.menu_details?.filter(
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
          icon: "fa-solid fa-egg", // Food type indicator color
          border: "gray-text",
          textColor: "gray-text", // Category text color - always green
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
      const filteredMenuDetails = orderDetails.menu_details?.filter(
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
        .map((word) => word.charAt(0)?.toUpperCase() + word.slice(1))
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
    const validateOrder = () => {
      console.log("TrackOrder: Starting order validation");
      try {
        // First check state or localStorage for orderId
        if (state?.orderId || localStorage.getItem("current_order_id")) {
          console.log("TrackOrder: Order ID found, validation successful");
          return true;
        }

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

        // Check placed orders
        if (!orderFound && allOrders.placed?.length > 0) {
          orderFound = allOrders.placed.some(
            (order) => order.order_number === order_number
          );
        }

        // Check completed and cancelled orders
        if (!orderFound) {
          orderFound = [
            ...Object.values(allOrders.completed || {}).flat(),
            ...Object.values(allOrders.cancelled || {}).flat(),
          ].some((order) => order.order_number === order_number);
        }

        if (!orderFound) {
          setLoading(false);
          window.showToast("error", "Order not found");
          navigate("/user_app/Index");
          return false;
        }

        return true;
      } catch (error) {
        console.error("TrackOrder: Error during order validation:", error);
        setLoading(false);
        window.showToast("error", "Something went wrong");
        navigate("/user_app/Index");
        return false;
      }
    };

    if (order_number) {
      validateOrder();
    }
  }, [order_number, navigate, state]);

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
      return (
        <i className="fa-solid fa-star font_size_10 text-warning me-1"></i>
      );
    }

    return null; // Default case
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

  const handleRating = async (rating) => {
    // If rating was already submitted, don't allow changes
    if (hasRated) {
      window.showToast("info", "You've already rated this order");
      return;
    }
    
    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/rating_to_order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },

          body: JSON.stringify({
            outlet_id: localStorage.getItem("outlet_id"),
            user_id: userId,
            order_id: orderDetails?.order_details?.order_id,
            rating: rating,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("user_id");
        localStorage.removeItem("userData");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("access_token");
        localStorage.removeItem("customerName");
        localStorage.removeItem("mobile");
        const restaurantCode = localStorage.getItem("restaurantCode");
        const tableNumber = localStorage.getItem("tableNumber");
        const sectionId = localStorage.getItem("sectionId");

        navigate(`/user_app/${restaurantCode}/${tableNumber}/${sectionId}`);
        showLoginPopup();
        return;
      }

      const data = await response.json();
      if (response.ok && data.st === 1) {
        setSelectedRating(rating);
        setHasRated(true); // Mark as rated
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Rating updated successfully",
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to update rating",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating rating:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update rating",
        life: 3000,
      });
    }
  };

  // Update the handleRateOnGoogle function
  const handleRateOnGoogle = () => {
    try {
      const restaurantSocial = JSON.parse(
        localStorage.getItem("restaurantSocial") || "[]"
      );
      const rateOnGoogle = restaurantSocial.find(
        (social) => social.id === "google_review"
      )?.link;
      if (rateOnGoogle) {
        window.open(rateOnGoogle, "_blank");
      }
    } catch (error) {
      console.clear();
    }
  };

  const handleCancelClick = () => {
    setShowCompleteModal(true);
  };

  const handlePayment = async (method) => {
    try {
      setIsProcessing(true);
      console.log("TrackOrder: Initiating payment");
      console.log("TrackOrder: Payment method:", method);
      console.log("TrackOrder: Order ID:", orderId);

      const response = await axios.post(
        `${config.apiDomain}/user_api/complete_order`,
        {
          outlet_id: localStorage.getItem("outlet_id"),
          order_id: orderId,
          payment_method: method,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      console.log("TrackOrder: Payment response:", response.data);

      if (response.data.st === 1) {
        window.showToast("success", "Payment successful!");
        setShowCompleteModal(false);
        await fetchOrderDetails(order_number);
      } else {
        throw new Error(response.data.msg || "Payment failed");
      }
    } catch (error) {
      console.error("TrackOrder: Payment error:", error);
      window.showToast(
        "error",
        error.message || "Payment failed. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // const handleGenericUPI = async () => {
  //   if (isProcessingUPI) return;

  //   try {
  //     setIsProcessingUPI(true);
  //     if (timeoutRef.current.upi) clearTimeout(timeoutRef.current.upi);

  //     const amount = Math.round(parseFloat(orderDetails.grand_total));
  //     const transactionNote = encodeURIComponent(
  //       `${customerName} is paying Rs. ${amount} to ${orderDetails.outlet_name} for order no. #${orderDetails.order_number}`
  //     );
  //     const encodedRestaurantName = encodeURIComponent(orderDetails.outlet_name);
  //     const upiId = "hivirajkadam@okhdfcbank";

  //     const paymentUrl = `upi://pay?pa=${upiId}&pn=${encodedRestaurantName}&tr=${orderDetails.order_id}&tn=${transactionNote}&am=${amount}&cu=INR&mc=1234`;

  //     await initiatePayment("upi", paymentUrl, setIsProcessingUPI, "upi");
  //   } catch (error) {
  //     console.clear();

  //     window.showToast(
  //       "error",
  //       "UPI payment initiation failed. Please try again."
  //     );
  //     setIsProcessingUPI(false);
  //   }
  // };

  // const handlePhonePe = async () => {
  //   if (isProcessingPhonePe) return;
  //   console.log(customerName);
  //   try {
  //     setIsProcessingPhonePe(true);
  //     if (timeoutRef.current.phonepe) clearTimeout(timeoutRef.current.phonepe);

  //     const amount = Math.round(parseFloat(order.grand_total));
  //     const transactionNote = encodeURIComponent(
  //       `${customerName} is paying Rs. ${amount} to ${order.outlet_name} for order no. #${order.order_number}`
  //     );
  //     const encodedRestaurantName = encodeURIComponent(order.outlet_name);
  //     const upiId = "hivirajkadam@okhdfcbank";

  //     const paymentUrl = `phonepe://pay?pa=${upiId}&pn=${encodedRestaurantName}&tr=${order.order_id}&tn=${transactionNote}&am=${amount}&cu=INR&mc=1234`;

  //     await initiatePayment(
  //       "phonepay",
  //       paymentUrl,
  //       setIsProcessingPhonePe,
  //       "phonepe"
  //     );
  //   } catch (error) {
  //     console.clear();
  //     window.showToast(
  //       "error",
  //       "PhonePe payment initiation failed. Please try again."
  //     );
  //     setIsProcessingPhonePe(false);
  //   }
  // };

  // const handleGooglePay = async () => {
  //   if (isProcessingGPay) return;

  //   try {
  //     setIsProcessingGPay(true);
  //     if (timeoutRef.current.gpay) clearTimeout(timeoutRef.current.gpay);

  //     const amount = Math.round(parseFloat(order.grand_total));

  //     const transactionNote = encodeURIComponent(
  //       `${customerName} is paying Rs. ${amount} to ${order.outlet_name} for order no. #${order.order_number}`
  //     );
  //     const encodedRestaurantName = encodeURIComponent(order.outlet_name);
  //     const upiId = "hivirajkadam@okhdfcbank";

  //     const paymentUrl = `gpay://upi/pay?pa=${upiId}&pn=${encodedRestaurantName}&tr=${order.order_id}&tn=${transactionNote}&am=${amount}&cu=INR&mc=1234`;

  //     await initiatePayment(
  //       "gpay",
  //       paymentUrl,
  //       setIsProcessingGPay,
  //       "gpay"
  //     );
  //   } catch (error) {
  //     console.clear();
  //     window.showToast(
  //       "error",
  //       "Google Pay payment initiation failed. Please try again."
  //     );
  //     setIsProcessingGPay(false);
  //   }
  // };

  const initiatePayment = async (
    method,
    paymentUrl,
    setProcessing,
    timeoutKey
  ) => {
    const response = await fetch(
      `${config.apiDomain}/user_api/complete_order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          outlet_id: localStorage.getItem("outlet_id"),
          order_id: orderDetails?.order_details?.order_id,
          payment_method: method,
        }),
      }
    );

    if (response.status === 401) {
      localStorage.removeItem("user_id");
      localStorage.removeItem("userData");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("access_token");
      localStorage.removeItem("customerName");
      localStorage.removeItem("mobile");
      const restaurantCode = localStorage.getItem("restaurantCode");
      const tableNumber = localStorage.getItem("tableNumber");
      const sectionId = localStorage.getItem("sectionId");

      navigate(`/user_app/${restaurantCode}/${tableNumber}/${sectionId}`);
      showLoginPopup();
      return;
    }

    if (response.ok) {
    }
  };

  // Add generatePDF function before return statement
  const generatePDF = async (orderDetails) => {
    try {
      if (!orderDetails?.order_details) {
        window.showToast("error", "Order details not found");
        return;
      }

      const { order_details, menu_details } = orderDetails;
      const outlet_name =
        localStorage.getItem("outlet_name") || order_details.outlet_name || "";
      const outlet_address = localStorage.getItem("outlet_address") || "-";
      const outlet_mobile = localStorage.getItem("outlet_mobile") || "-";
      const website_url = "https://menumitra.com";
      const customerName =
        localStorage.getItem("customerName") ||
        order_details.customer_name ||
        "Guest";

      // Create a hidden container with specific dimensions
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "-9999px";
      container.style.width = "800px";
      container.style.margin = "0";
      container.style.padding = "60px";
      container.style.fontSize = "16px";
      container.style.backgroundColor = "#ffffff";
      document.body.appendChild(container);

      container.innerHTML = `
        <div style="padding: 20px; max-width: 100%; margin: auto; font-family: Arial, sans-serif;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <div style="display: flex; align-items: center;">
              <img src="${MenuMitra}" alt="MenuMitra Logo" style="width: 35px; height: 35px;" />
              <span style="font-size: 20px; font-weight: bold; margin-left: 8px;">MenuMitra</span>
            </div>
            <span style="color: #d9534f; font-size: 20px; font-weight: normal;">Invoice</span>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 25px;">
            <div>
              <p style="margin: 0; font-weight: bold;">Hello, ${customerName}</p>
              <p style="margin: 5px 0 0 0; color: #333;">Thank you for shopping from our store and for your order.</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0;">Bill no: ${order_details.order_number}</p>
              <p style="margin: 5px 0 0 0; color: #666;">${
                order_details.date || ""
              } ${order_details.time || ""}</p>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <th style="text-align: left; padding: 8px 0; border-bottom: 1px solid #ddd; color: #333;">Item</th>
              <th style="text-align: center; padding: 8px 0; border-bottom: 1px solid #ddd; color: #333;">Quantity</th>
              <th style="text-align: right; padding: 8px 0; border-bottom: 1px solid #ddd; color: #333;">Price</th>
            </tr>
            ${menu_details
              .map(
                (item) => `
              <tr>
                <td style="padding: 8px 0; color: #d9534f;">${
                  item.menu_name
                }</td>
                <td style="text-align: center; padding: 8px 0;">${
                  item.quantity
                }</td>
                <td style="text-align: right; padding: 8px 0;">₹ ${item.price.toFixed(
                  2
                )}</td>
              </tr>
            `
              )
              .join("")}
          </table>

          <!-- Billing Summary -->
<div style="border-top: 2px solid #ddd; margin-top: 20px;">
  <div style="text-align: right; margin-top: 10px;">
    <!-- Total -->
    ${
      order_details.total_bill_amount
        ? `<span style="font-weight: bold;">Total:</span> ₹${order_details.total_bill_amount.toFixed(
            2
          )}</br>`
        : ""
    }

    <!-- Discount -->
    ${
      order_details.discount_percent > 0
        ? `<span style="font-weight: bold;">Discount:</span>(${
            order_details.discount_percent
          }%): <span style="color: red;">-₹${order_details.discount_amount.toFixed(
            2
          )}</span></br>`
        : ""
    }

    <!-- Special Discount -->
    ${
      order_details.special_discount
        ? `<span style="font-weight: bold;">Special Discount:</span><span style="color: red;">-₹${order_details.special_discount.toFixed(
            2
          )}</span></br>`
        : ""
    }

    <!-- Subtotal -->
    ${
      order_details.total_bill_with_discount
        ? `<span style="font-weight: bold;">Subtotal:</span> ₹${order_details.total_bill_with_discount.toFixed(
            2
          )}</br>`
        : ""
    }
    <!-- Service Charges -->
    ${
      order_details.service_charges_amount
        ? `<span style="font-weight: bold;">Service Charges (${
            order_details.service_charges_percent || ""
          }%):</span> <span style="color: green;">+₹${order_details.service_charges_amount.toFixed(
            2
          )}</span></br>`
        : ""
    }

    <!-- GST -->
    ${
      order_details.gst_amount
        ? `<span style="font-weight: bold;">GST (${
            order_details.gst_percent || ""
          }%):</span> <span style="color: green;">+₹${order_details.gst_amount.toFixed(
            2
          )}</span></br>`
        : ""
    }
<!-- Tip -->
${
  order_details.tip && order_details.tip > 0
    ? `<span style="font-weight: bold;">Tip:</span><span style="color: green;">+₹${order_details.tip.toFixed(
        2
      )}</span></br>`
    : ""
}


    <!-- Grand Total -->
    ${
      order_details.final_grand_total
        ? `<span style="font-weight: bold;">Grand Total:</span> ₹${order_details.final_grand_total.toFixed(
            2
          )}</br>`
        : ""
    }
  </div>
</div>
          <div style="display: flex; justify-content: space-between; margin-top: 30px;">
            <div>
              <p style="margin: 0 0 10px 0; font-weight: bold;">Billing Information</p>
              <p style="margin: 5px 0;">► ${outlet_name}</p>
              <p style="margin: 5px 0;">► ${outlet_address}</p>
              <p style="margin: 5px 0;">► ${outlet_mobile}</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0 0 10px 0; font-weight: bold;">Payment Method</p>
              <p style="margin: 5px 0; text-transform: uppercase;">${
                order_details.payment_method || ""
              }</p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 40px;">
            <p style="font-style: italic; margin-bottom: 20px;">Have a nice day.</p>
            <div style="margin: 20px 0;">
              <div style="display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                <img src="${MenuMitra}" alt="MenuMitra Logo" style="width: 25px; height: 25px;" />
                <span style="font-size: 16px; font-weight: bold; margin-left: 8px;">MenuMitra</span>
              </div>
            </div>
            <p style="margin: 3px 0; color: #666; font-size: 13px;">info@menumitra.com</p>
            <p style="margin: 3px 0; color: #666; font-size: 13px;">+91 9172530151</p>
            <p style="margin: 3px 0; color: #666; font-size: 13px;">${website_url}</p>
          </div>
        </div>
      `;

      try {
        // Wait for all images to load
        const images = container.getElementsByTagName("img");
        await Promise.all(
          Array.from(images).map((img) => {
            return new Promise((resolve) => {
              if (img.complete) {
                resolve();
              } else {
                img.onload = resolve;
                img.onerror = resolve;
              }
            });
          })
        );

        // Generate PDF with exact same configuration as MyOrder.js
        const canvas = await html2canvas(container, {
          scale: 3,
          width: 800,
          height: container.offsetHeight,
          backgroundColor: "#ffffff",
          windowWidth: 800,
          windowHeight: container.offsetHeight,
          logging: false,
          useCORS: true,
          allowTaint: true,
        });

        // Create PDF with A4 dimensions
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: "a4",
        });

        // Calculate dimensions to fit A4 while maintaining aspect ratio
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        // Add image with proper scaling
        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`invoice-${order_details.order_number}.pdf`);

        window.showToast("success", "Invoice downloaded successfully");
      } catch (error) {
        console.error("PDF generation error:", error);
        window.showToast("error", "Failed to generate invoice");
      } finally {
        // Clean up: Remove the temporary container
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      window.showToast("error", "Failed to generate invoice");
    }
  };

  // Add this helper function to check cooking quantity
  const checkCookingQuantity = async (menuId, halfOrFull) => {
    try {
      // Fetch current order details
      const response = await fetch(
        `${config.apiDomain}/user_api/get_order_details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            order_id: orderDetails.order_id,
            section_id: userData?.sectionId || "1",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

      const data = await response.json();
      const menuItems = data.lists?.menu_details || [];

      // Get total cooking quantity for this menu item
      const cookingQuantity = menuItems.reduce((total, item) => {
        if (
          item.menu_id === menuId &&
          item.half_or_full === halfOrFull &&
          item.status === "cooking"
        ) {
          return total + item.quantity;
        }
        return total;
      }, 0);

      return cookingQuantity;
    } catch (error) {
      console.error("Error checking cooking quantity:", error);
      return 0;
    }
  };

  // Modify the increment quantity function
  const handleIncrementQuantity = async (menu) => {
    try {
      const cookingQuantity = await checkCookingQuantity(
        menu.menu_id,
        menu.half_or_full
      );

      if (cookingQuantity >= 20) {
        window.showToast(
          "info",
          `Cannot add more. Menu ${menu.menu_name} already has maximum quantity (20) in cooking status`
        );
        return;
      }

      if (cookingQuantity + menu.quantity >= 20) {
        window.showToast(
          "info",
          `Cannot add more. Total quantity would exceed maximum limit of 20. Current cooking quantity: ${cookingQuantity}`
        );
        return;
      }

      // Proceed with increment if within limits
      setOrderDetails((prevDetails) => ({
        ...prevDetails,
        menu_details: prevDetails.menu_details.map((item) =>
          item.menu_id === menu.menu_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      }));
    } catch (error) {
      console.error("Error incrementing quantity:", error);
      window.showToast("error", "Failed to update quantity");
    }
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
                    {getDisplayStatus(orderStatus)?.toUpperCase()}
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
                      {order_details.outlet_name?.toUpperCase()}
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
                      {`${titleCase(order_details.section_name)}${
                        order_details.order_type?.toLowerCase() ===
                          "drive-through" ||
                        order_details.order_type?.toLowerCase() === "parcel"
                          ? ""
                          : ` - ${order_details.table_number}`
                      }`}
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
                      ₹{order_details.final_grand_total.toFixed(2)}
                    </span>

                    {/* Conditionally render the line-through price */}
                    {order_details.grand_total !==
                      order_details.total_bill_amount && (
                      <span className="text-decoration-line-through ms-2 gray-text font_size_12 fw-normal">
                        ₹{order_details.total_bill_amount.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {orderDetails?.order_details?.payment_method && (
                <div className="row">
                  <div className="col-6">
                    {orderDetails.order_details.order_status === "paid" && (
                      <div className="menu-info d-flex align-items-center gray-text">
                        <span className="me-2">
                          {orderDetails.order_details.payment_method ===
                            "card" && (
                            <i className="fas fa-credit-card font_size_12"></i> // FontAwesome card icon
                          )}
                          {orderDetails.order_details.payment_method ===
                            "cash" && (
                            <i className="fas fa-money-bill-wave font_size_12"></i> // FontAwesome cash icon
                          )}
                          {orderDetails.order_details.payment_method ===
                            "phonepay" && (
                            <i className="fas fa-wallet font_size_12 "></i> // FontAwesome wallet icon for UPI
                          )}
                          {orderDetails.order_details.payment_method ===
                            "gpay" && (
                            <i className="fas fa-wallet font_size_12 "></i> // FontAwesome wallet icon for UPI
                          )}
                          {orderDetails.order_details.payment_method ===
                            "upi" && (
                            <i className="fas fa-wallet font_size_12 "></i> // FontAwesome wallet icon for UPI
                          )}
                        </span>
                        <span className="font_size_12 gray-text text-capitalize">
                          {orderDetails.order_details.payment_method}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <ThemeProvider>
          <div className="container py-0">
            {!loading && orderStatus && (
              <>
                {orderStatus === "paid" ? (
                  <>
                    <div className="card-body text-center bg-success rounded-4 text-white">
                      <span className="fs-6 fw-medium h-100">
                        Your delicious order has been served
                      </span>
                    </div>
                    {/* <div className="d-flex justify-content-center pt-3 gray-text">
                      {order_details.payment_method && (
                        <div className="border border-success rounded-pill py-0 px-2 font_size_14 d-flex align-items-center">
                          <span className="me-2">
                            {order_details.payment_method === "card" && (
                              <i className="fas fa-credit-card"></i> // FontAwesome card icon
                            )}
                            {order_details.payment_method === "cash" && (
                              <i className="fas fa-money-bill-wave"></i> // FontAwesome cash icon
                            )}
                            {order_details.payment_method === "phonepay" && (
                              <i className="fas fa-wallet font_size_12 "></i> // FontAwesome wallet icon for UPI
                            )}
                            {order_details.payment_method === "gpay" && (
                              <i className="fas fa-wallet font_size_12 "></i> // FontAwesome wallet icon for UPI
                            )}
                            {order_details.payment_method === "upi" && (
                              <i className="fas fa-wallet font_size_12 "></i> // FontAwesome wallet icon for UPI
                            )}
                          </span>
                          <span>{order_details.payment_method}</span>
                        </div>
                      )}
                    </div> */}
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
                ) : orderStatus === "paid" ? (
                  <div className="card-body text-center bg-info rounded-4 text-white">
                    <span className="fs-6 fw-medium h-100 text-white">
                      Order has been paid. Thank you!
                    </span>
                  </div>
                ) : orderStatus === "served" ? (
                  <div className="card-body text-center bg-primary rounded-4 text-white">
                    <span className="fs-6 fw-medium h-100 text-white">
                      Order has been served. Enjoy your meal!
                    </span>
                  </div>
                ) : orderStatus === "cooking" ? (
                  <div className="card-body text-center bg-warning rounded-4 text-dark">
                    <span className="fs-6 fw-medium h-100 text-white">
                      Order is being cooked. Please wait patiently.
                    </span>
                  </div>
                ) : null}
              </>
            )}
            <>
              {/* {orderStatus === "served" && (
  <div className="card-body text-center btn btn-outline-success text-primary rounded-pill rounded-4  mt-3"
  onClick={(e) => {
    e.stopPropagation();
    handleCancelClick();
  }}
  >
    <span className="fs-6 fw-medium h-100">
   Complete Order
    </span>
  </div>
)} */}
            </>
            {/* <>
   {orderStatus === "placed" && (
  <div className="card-body text-center btn btn-outline-danger text-danger rounded-pill rounded-4  mt-3"
  onClick={(e) => {
    e.stopPropagation();
    handleCancelClick();
  }}
  >
    <span className="fs-6 fw-medium h-100">
   Cancel Order
    </span>
  </div>
)} 
  </> */}
          </div>

          {showCompleteModal && (
            <div
              className="modal fade show d-block"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <div className="col-6 text-start">
                      <div className="modal-title font_size_16 fw-medium">
                        Complete Order
                      </div>
                    </div>
                    <div className="col-6 text-end">
                      <div className="d-flex justify-content-end">
                        <span
                          className="m-2 font_size_16"
                          onClick={() => setShowCompleteModal(false)}
                          aria-label="Close"
                        >
                          <i className="fa-solid fa-xmark gray-text font_size_14 pe-3"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="modal-body">
                    <p className="text-center">
                      Are you sure you want to complete this order?
                    </p>
                    <div className="d-flex flex-column align-items-center gap-3">
                      {/* UPI Payment */}
                      <button
                        className="btn btn-info text-white w-100"
                        disabled={isProcessingUPI}
                        // onClick={handleGenericUPI}
                      >
                        {isProcessingUPI ? (
                          "Processing..."
                        ) : (
                          <>
                            Pay{" "}
                            <span className="fs-4 mx-1">
                              ₹{order_details.final_grand_total.toFixed(2)}
                            </span>{" "}
                            via
                            <span className="ms-2">Other UPI Apps</span>
                            <img
                              className="text-white ms-1"
                              src="https://img.icons8.com/ios-filled/50/FFFFFF/bhim-upi.png"
                              width={45}
                              alt="UPI"
                            />
                          </>
                        )}
                      </button>
                      {/* PhonePe Payment */}
                      <button
                        className="btn text-white w-100"
                        style={{ backgroundColor: "#5f259f" }}
                        disabled={isProcessingPhonePe}
                        // onClick={handlePhonePe}
                      >
                        {isProcessingPhonePe ? (
                          "Processing..."
                        ) : (
                          <>
                            Pay with PhonePe
                            <span className="fs-4 mx-1">
                              ₹{order_details.grand_total.toFixed(2)}
                            </span>
                            <img
                              className="ms-1"
                              src="https://img.icons8.com/?size=100&id=OYtBxIlJwMGA&format=png&color=000000"
                              width={45}
                              alt="PhonePe"
                            />
                          </>
                        )}
                      </button>
                      {/* Google Pay Payment */}
                      <button
                        className="btn text-white w-100"
                        style={{ backgroundColor: "#1a73e8" }}
                        disabled={isProcessingGPay}
                        // onClick={handleGooglePay}
                      >
                        {isProcessingGPay ? (
                          "Processing..."
                        ) : (
                          <>
                            Pay with Google Pay
                            <span className="fs-4 mx-1">
                              ₹{order_details.grand_total.toFixed(2)}
                            </span>
                            <img
                              className="ms-1"
                              src="https://developers.google.com/static/pay/api/images/brand-guidelines/google-pay-mark.png"
                              width={45}
                              alt="Google Pay"
                            />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="text-center">
                    <div>or make payment via:</div>
                  </div>
                  <div className="d-flex justify-content-center pt-2 mb-4">
                    {/* Card Payment */}
                    <button
                      type="button"
                      className={`px-2 bg-white mb-2 me-4 rounded-pill py-1 text-dark ${
                        paymentMethod === "card"
                          ? "bg-success text-white"
                          : "border"
                      }`}
                      onClick={() => handlePayment("card")}
                    >
                      <i className="ri-bank-card-line me-1"></i>
                      Card
                    </button>
                    {/* Cash Payment */}
                    <button
                      type="button"
                      className={`px-2 bg-white mb-2 me-2 rounded-pill py-1 text-dark ${
                        paymentMethod === "cash"
                          ? "bg-success text-white"
                          : "border border-muted"
                      }`}
                      onClick={() => handlePayment("cash")}
                    >
                      <i className="ri-wallet-3-fill me-1"></i>
                      Cash
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
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
                              {menu.offer !== 0 && menu.offer !== null && (
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
                                    <span className="ms-2 font_size_10 text-capitalize text-dark">
                                      {/* ({toTitleCase}) */}
                                    </span>
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
                                        {parseFloat(menu.rating).toFixed(1)}
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
                                <div className="col-3 text-end mt-2">
                                  <span className="font_size_14 gray-text">
                                    x {menu.quantity}
                                  </span>
                                </div>
                                {menu.comment && (
                                  <div className="row">
                                    <div className="col-12 my-2 ms-2  text-light">
                                      <i className="fa-solid fa-comment-dots"></i>{" "}
                                      {menu.comment}
                                    </div>
                                  </div>
                                )}
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

        {userId &&
          orderDetails &&
          (() => {
            const details = orderDetails.order_details || {};

            // Extract values safely
            const totalBillAmount = Number(details.total_bill_amount || 0);
            const discountAmount = Number(details.discount_amount || 0);
            const specialDiscount = Number(details.special_discount || 0);
            const charges = Number(details.charges || 0);
            const serviceChargesPercent = Number(
              details.service_charges_percent || 0
            );
            const gstPercent = Number(details.gst_percent || 0);
            const tip = Number(details.tip || 0);

            // Calculations
            const totalBillWithDiscount = totalBillAmount - discountAmount;
            const subtotal = totalBillWithDiscount - specialDiscount + charges;
            const serviceChargesAmount =
              (subtotal * serviceChargesPercent) / 100;
            const grandTotal = subtotal + serviceChargesAmount;
            const gstAmount = (grandTotal * gstPercent) / 100;
            let finalGrandTotal = grandTotal + gstAmount;

            if (tip > 0) {
              finalGrandTotal += tip;
            }

            return (
              <div className="container mb-4 pt-0 z-3">
                <div className="card mt-2 p-0 mb-3">
                  <div className="card-body mx-auto rounded-4 p-0">
                    <div className="row p-1">
                      {/* Total */}
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center py-1">
                          <span className="ps-2 font_size_14 fw-semibold">
                            Total
                          </span>
                          <span className="pe-2 font_size_14 fw-semibold">
                            ₹{totalBillAmount.toFixed(2)}
                          </span>
                        </div>
                        <hr className="p-0 m-0 text-primary w-100" />
                      </div>

                      {/* Discount */}
                      <div className="col-12 mb-0 pt-0">
                        <div className="d-flex justify-content-between align-items-center py-0">
                          <span className="ps-2 font_size_14 gray-text">
                            Discount{" "}
                            <span className="gray-text small-number">
                              ({details.discount_percent || 0}%)
                            </span>
                          </span>
                          <span className="pe-2 font_size_14 gray-text">
                            -₹{discountAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="col-12 pt-0">
                        <div className="d-flex justify-content-between align-items-center py-0 px-2 mt-1">
                          <span className="font_size_14 gray-text">
                            Special Discount
                          </span>
                          <span className="font_size_14 gray-text">
                            -₹{(specialDiscount || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Extra Charges */}
                      <div className="col-12 pt-0">
                        <div className="d-flex justify-content-between align-items-center py-0">
                          <span className="ps-2 font_size_14 pt-1 gray-text">
                            Extra Charges
                          </span>
                          <span className="pe-2 font_size_14 gray-text">
                            +₹{charges.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center py-1">
                          <span className="ps-2 font_size_14 gray-text">
                            Subtotal
                          </span>
                          <span className="pe-2 font_size_14 gray-text">
                            ₹{subtotal.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Service Charges */}
                      <div className="col-12 pt-0">
                        <div className="d-flex justify-content-between align-items-center py-0">
                          <span className="ps-2 font_size_14 pt-1 gray-text">
                            Service Charges{" "}
                            <span className="gray-text small-number">
                              ({serviceChargesPercent}%)
                            </span>
                          </span>
                          <span className="pe-2 font_size_14 gray-text">
                            +₹{serviceChargesAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* GST Charges */}
                      <div className="col-12 mb-0 py-1">
                        <div className="d-flex justify-content-between align-items-center py-0">
                          <span className="ps-2 font_size_14 gray-text">
                            GST Charges{" "}
                            <span className="gray-text small-number">
                              ({gstPercent}%)
                            </span>
                          </span>
                          <span className="pe-2 font_size_14 gray-text">
                            +₹{gstAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Tip (Only show if tip is greater than 0) */}
                      {tip > 0 && (
                        <div className="col-12 pt-0">
                          <div className="d-flex justify-content-between align-items-center py-0">
                            <span className="ps-2 font_size_14 pt-1 gray-text">
                              Tip
                            </span>
                            <span className="pe-2 font_size_14 gray-text">
                              +₹{tip.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}

                      <div>
                        <hr className="p-0 m-0 text-primary w-100" />
                      </div>

                      {/* Final Grand Total */}
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center py-1 fw-semibold pb-0 mb-0">
                          <span className="ps-2 fw-semibold fs-6">
                            Final Grand Total
                          </span>
                          <span className="pe-2 fw-semibold fs-6">
                            ₹{finalGrandTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {orderStatus === "paid" && (
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-light py-1 px-2 mb-2 me-2 rounded-pill font_size_12"
                      onClick={() => generatePDF(orderDetails)}
                    >
                      <i className="fa-solid fa-download me-2"></i>
                      Invoice &nbsp;
                    </button>
                  </div>
                )}

                {/* Order Rating Component - Only show for paid orders */}
                {orderStatus === "paid" && (
                  <div className="card mb-4">
                    <div className="card-body">
                      <h5 className="card-title text-center mb-4">
                        {hasRated ? 'Your Rating' : 'How was your order?'}
                      </h5>
                      
                      <div className="d-flex justify-content-center gap-5 mb-4">
                        <div className="text-center">
                          <input 
                            type="radio" 
                            className="btn-check" 
                            id="rating-1" 
                            name="rating" 
                            value="1" 
                            checked={parseInt(selectedRating) === 1}
                            onChange={() => handleRating(1)} 
                          />
                          <label 
                            htmlFor="rating-1" 
                            className={`btn rounded-circle p-3 ${parseInt(selectedRating) === 1 ? 'bg-danger bg-opacity-25 shadow-sm border border-danger' : 'border-0'}`}
                            aria-label="Rate as poor"
                            style={{
                              transition: 'transform 0.2s ease',
                              transform: parseInt(selectedRating) === 1 ? 'scale(1.2)' : 'scale(1)'
                            }}
                            onMouseOver={(e) => {
                              if (parseInt(selectedRating) !== 1) {
                                e.currentTarget.style.transform = 'scale(1.1)';
                              }
                            }}
                            onMouseOut={(e) => {
                              if (parseInt(selectedRating) !== 1) {
                                e.currentTarget.style.transform = 'scale(1)';
                              }
                            }}
                          >
                            <i className="fa-solid fa-face-frown text-danger fs-2"></i>
                          </label>
                        </div>
                        
                        <div className="text-center">
                          <input 
                            type="radio" 
                            className="btn-check" 
                            id="rating-3" 
                            name="rating" 
                            value="3" 
                            checked={parseInt(selectedRating) === 3}
                            onChange={() => handleRating(3)} 
                          />
                          <label 
                            htmlFor="rating-3" 
                            className={`btn rounded-circle p-3 ${parseInt(selectedRating) === 3 ? 'bg-warning bg-opacity-25 shadow-sm border border-warning' : 'border-0'}`}
                            aria-label="Rate as good"
                            style={{
                              transition: 'transform 0.2s ease',
                              transform: parseInt(selectedRating) === 3 ? 'scale(1.2)' : 'scale(1)'
                            }}
                            onMouseOver={(e) => {
                              if (parseInt(selectedRating) !== 3) {
                                e.currentTarget.style.transform = 'scale(1.1)';
                              }
                            }}
                            onMouseOut={(e) => {
                              if (parseInt(selectedRating) !== 3) {
                                e.currentTarget.style.transform = 'scale(1)';
                              }
                            }}
                          >
                            <i className="fa-solid fa-face-smile text-warning fs-2"></i>
                          </label>
                        </div>
                        
                        <div className="text-center">
                          <input 
                            type="radio" 
                            className="btn-check" 
                            id="rating-5" 
                            name="rating" 
                            value="5" 
                            checked={parseInt(selectedRating) === 5}
                            onChange={() => handleRating(5)} 
                          />
                          <label 
                            htmlFor="rating-5" 
                            className={`btn rounded-circle p-3 ${parseInt(selectedRating) === 5 ? 'bg-success bg-opacity-25 shadow-sm border border-success' : 'border-0'}`}
                            aria-label="Rate as excellent"
                            style={{
                              transition: 'transform 0.2s ease',
                              transform: parseInt(selectedRating) === 5 ? 'scale(1.2)' : 'scale(1)'
                            }}
                            onMouseOver={(e) => {
                              if (parseInt(selectedRating) !== 5) {
                                e.currentTarget.style.transform = 'scale(1.1)';
                              }
                            }}
                            onMouseOut={(e) => {
                              if (parseInt(selectedRating) !== 5) {
                                e.currentTarget.style.transform = 'scale(1)';
                              }
                            }}
                          >
                            <i className="fa-solid fa-face-laugh-beam text-success fs-2"></i>
                          </label>
                        </div>
                      </div>
                      
                      {hasRated && (
                        <div className="text-center mt-3 font_size_14 text-success">
                          <i className="fa-solid fa-check-circle me-2"></i>
                          Thank you for your feedback!
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <RestaurantSocials />
              </div>
            );
          })()}

        <Bottom></Bottom>
      </div>
    </>
  );
};

export default TrackOrder;
