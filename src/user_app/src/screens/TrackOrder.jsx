import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import images from "../assets/chiken.jpg";
import SigninButton from "../constants/SigninButton";
import Bottom from "../component/bottom";
import OrderGif from "../screens/OrderGif"; // Ensure this import path is correct
import "../assets/css/custom.css";
import { useRestaurantId } from "../context/RestaurantIdContext"; // Correct import
import { ThemeProvider } from "../context/ThemeContext.js";
import LoaderGif from "./LoaderGIF.jsx";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import config from "../component/config"
const TrackOrder = () => {
  // Define displayCartItems
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false); // State to track if order is completed
  const navigate = useNavigate();
  const { order_number } = useParams();
  const { orderId } = useParams();

  const { restaurantId } = useRestaurantId(); // Assuming this context provides restaurant ID

  const displayCartItems = orderDetails ? orderDetails.menu_details : [];
  const [cartDetails, setCartDetails] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("isDarkMode") === "true"
  );
  const toast = useRef(null);

  const isLoggedIn = !!localStorage.getItem("userData");
  const [showModal, setShowModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [portionSize, setPortionSize] = useState("full");
  const [halfPrice, setHalfPrice] = useState(null);
  const [fullPrice, setFullPrice] = useState(null);
  const [notes, setNotes] = useState("");
  const [isPriceFetching, setIsPriceFetching] = useState(false);
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem("userData");
    return saved ? JSON.parse(saved) : null;
  });

  // Get customer ID and type
  const customerId =
    userData?.customer_id || localStorage.getItem("customer_id");
  const customerType =
    userData?.customer_type || localStorage.getItem("customer_type");

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
        
        // Show error toast
      }
    } catch (error) {
     
      // Show error toast
    } finally {
      setIsPriceFetching(false);
    }
  };

  const handleAddToCartClick = (menu) => {
    if (!restaurantId) {
      window.showToast("error", "Restaurant information not found");
      return;
    }

    if (orderStatus === "completed" || orderStatus === "cancelled") {
      window.showToast("error", "Cannot modify completed or cancelled orders");
      return;
    }

    // Check if item is already added
    if (isItemAdded(menu.menu_id)) {
      window.showToast("info", "This item is already in your order");
      return;
    }

    setSelectedMenu(menu);
    fetchHalfFullPrices(menu.menu_id);
    setPortionSize("full");
    setNotes("");
    setShowModal(true);
  };

  const handleConfirmAddToCart = () => {
    if (!selectedMenu) return;

    const currentQuantity = quantities[selectedMenu.menu_id] || 1;

    const newMenuItem = {
      ...selectedMenu,
      price: portionSize === "half" ? halfPrice : fullPrice,
      quantity: currentQuantity,
      half_or_full: portionSize,
      notes: notes,
      isPending: true,
    };

    setPendingItems((prev) => [...prev, newMenuItem]);

    // Add the item to removed items set
    setRemovedItems((prev) => new Set([...prev, selectedMenu.menu_id]));

    // Update search results to remove the added item
    setSearchedMenu((prev) =>
      prev.filter((item) => item.menu_id !== selectedMenu.menu_id)
    );

    setShowModal(false);
    setSelectedMenu(null);
    setNotes("");

    window.showToast("success", "Item added to basket");
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

  const handleUpdatePlacedOrder = async () => {
    try {
      const updatedOrderItems = [
        ...menu_details.map((item) => ({
          menu_id: item.menu_id.toString(),
          quantity: item.quantity.toString(),
          half_or_full: item.half_or_full || "full",
          comment: item.notes || "",
        })),
        ...pendingItems.map((item) => ({
          menu_id: item.menu_id.toString(),
          quantity: item.quantity.toString(),
          half_or_full: item.half_or_full || "full",
          comment: item.notes || "",
        })),
      ];

      // Filter out removed items
      const filteredItems = updatedOrderItems.filter(
        (item) =>
          !removedItems.some(
            (removedItem) => removedItem.menu_id.toString() === item.menu_id
          )
      );

      const response = await fetch(
         `${config.apiDomain}/user_api/update_placed_order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderDetails.order_details.order_id,
            table_number: orderDetails.order_details.table_number,
            restaurant_id: restaurantId,
            order_items: filteredItems,
          }),
        }
      );

      const data = await response.json();

      if (data.st === 1) {
        window.showToast("success", "Order updated successfully");

        // Refresh order details
        fetchOrderDetails(order_number);

        // Clear pending and removed items
        setPendingItems([]);
        setRemovedItems([]);
      } else {
        throw new Error(data.msg || "Failed to update order");
      }
    } catch (error) {
      
      window.showToast("error", error.message || "Failed to update order");
    }
  };

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
        const currentCustomerId =
          userData?.customer_id || localStorage.getItem("customer_id");
        const currentCustomerType =
          userData?.customer_type || localStorage.getItem("customer_type");

        if (!currentCustomerId) {
     
          return;
        }

        const requestBody = {
          restaurant_id: parseInt(restaurantId, 10),
          keyword: debouncedSearchTerm.trim(),
          customer_id: currentCustomerId,
          customer_type: currentCustomerType,
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
         
        }
      } catch (error) {
        
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

  const handleAddToOrder = async (menuItem) => {
    if (!restaurantId) {
      
      window.showToast("error", "Restaurant information not found");
      return;
    }

    if (isItemAdded(menuItem.menu_id)) {
      window.showToast("info", "This item is already in your order");
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const currentCustomerId =
        userData?.customer_id || localStorage.getItem("customer_id");
      const currentCustomerType =
        userData?.customer_type || localStorage.getItem("customer_type");
      const cartId = localStorage.getItem("cartId"); // Get cart_id from localStorage

      if (!currentCustomerId) {
        window.showToast("error", "Please login to add items to order");
        return;
      }

      const selectedPrice = portionSize === "half" ? halfPrice : fullPrice;
      if (!selectedPrice) {
        window.showToast("error", "Price information is not available");
        return;
      }

      const quantity = quantities[menuItem.menu_id] || 1;

      // First add to pending items locally
      setPendingItems((prevItems) => [
        ...prevItems,
        {
          ...menuItem,
          quantity: quantity,
          totalPrice: (selectedPrice * quantity).toFixed(2),
          half_or_full: portionSize,
          notes: notes,
        },
      ]);

      // Remove from search results
      setSearchedMenu((prevMenu) =>
        prevMenu.filter((item) => item.menu_id !== menuItem.menu_id)
      );

      // If there's an existing order, add to it
      if (orderDetails?.order_details?.order_id) {
        const response = await fetch(
           `${config.apiDomain}/user_api/add_to_existing_order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order_id: orderDetails.order_details.order_id,
              customer_id: currentCustomerId,
              customer_type: currentCustomerType,
              restaurant_id: restaurantId,
              cart_id: cartId, // Add cart_id to request
              order_items: [
                {
                  menu_id: menuItem.menu_id,
                  quantity: quantity.toString(),
                  half_or_full: portionSize,
                  comment: notes || "",
                },
              ],
            }),
          }
        );

        const data = await response.json();

        if (data.st === 1) {
          setShowModal(false);
          // Refresh order details
          if (order_number) {
            fetchOrderDetails(order_number);
          }

          window.showToast(
            "success",
            `${menuItem.menu_name} (${portionSize}, Qty: ${quantity}) added to your order`
          );
        } else {
          throw new Error(data.msg || "Failed to add item to order");
        }
      }
    } catch (error) {
      
      window.showToast(
        "error",
        "Failed to add item to order. Please try again."
      );

      // Rollback the pending items change on error
      setPendingItems((prevItems) =>
        prevItems.filter((item) => item.menu_id !== menuItem.menu_id)
      );
      setSearchedMenu((prevMenu) => [...prevMenu, menuItem]);
    }
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

  const handleUnauthorizedFavorite = () => {
    window.showToast("info", "Please login to use favorites functionality");
   
  };

  const handleLikeClick = async (menu, e) => {
    e.preventDefault();
    e.stopPropagation();

    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id || userData.customer_type === "guest") {
      handleUnauthorizedFavorite();
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
            customer_id: userData.customer_id,
            customer_type: userData.customer_type,
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
          if (!prevDetails?.order_items) return prevDetails;
          return {
            ...prevDetails,
            order_items: prevDetails.order_items.map((item) =>
              item.menu_id === menu.menu_id
                ? { ...item, is_favourite: newFavoriteStatus }
                : item
            ),
          };
        });

        // Dispatch global event with consistent name
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
          isFavorite ? "Removed from favorites" : "Added to favorites"
        );
      }
    } catch (error) {
     
      window.showToast("error", "Failed to update favorite status");
    }
  };

  const fetchOrderDetails = async (orderNumber) => {
    try {
      setLoading(true);
      const response = await fetch(
         `${config.apiDomain}/user_api/get_order_details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_number: orderNumber,
            customer_id: customerId,
            customer_type: customerType,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1 && data.lists) {
          setOrderDetails(data.lists);
          const status = data.lists.order_details.order_status.toLowerCase();

          // Normalize cancelled status variations
          if (["cancle", "cancelled", "canceled"].includes(status)) {
            setOrderStatus("canceled");
            setIsCompleted(true); // Treat cancelled orders like completed ones
          } else if (status === "completed") {
            setOrderStatus("completed");
            setIsCompleted(true);
          } else {
            setOrderStatus(status);
            setIsCompleted(false);
          }
        }
      }
    } catch (error) {
      
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
        return "ri-close-circle-line text-danger";
      case "ongoing":
        return "ri-timer-flash-line text-warning";
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
     
      window.showToast("error", "Failed to remove item. Please try again.");
    }
  };

  const handlePlacedOrderUpdate = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const currentCustomerId = userData?.customer_id || localStorage.getItem("customer_id");
      const currentCustomerType = userData?.customer_type || localStorage.getItem("customer_type");
      const cartId = localStorage.getItem("cartId"); // Get cart_id from localStorage

      const updatedOrderItems = [
        ...menu_details.map((item) => ({
          menu_id: item.menu_id.toString(),
          quantity: item.quantity.toString(),
          half_or_full: item.half_or_full || "full",
          comment: item.notes || "",
        })),
        ...pendingItems.map((item) => ({
          menu_id: item.menu_id.toString(),
          quantity: item.quantity.toString(),
          half_or_full: item.half_or_full || "full",
          comment: item.notes || "",
        })),
      ];

      // Filter out removed items
      const filteredItems = updatedOrderItems.filter(
        (item) =>
          !removedItems.some(
            (removedItem) => removedItem.menu_id.toString() === item.menu_id
          )
      );

      const response = await fetch(
         `${config.apiDomain}/user_api/update_placed_order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderDetails.order_details.order_id,
            table_number: orderDetails.order_details.table_number,
            restaurant_id: restaurantId,
            cart_id: cartId, // Add cart_id to request
            customer_id: currentCustomerId,
            customer_type: currentCustomerType,
            order_items: filteredItems,
          }),
        }
      );

      const data = await response.json();

      if (data.st === 1) {
        window.showToast("success", "Order updated successfully");
        // Refresh order details
        fetchOrderDetails(order_number);
        // Clear pending and removed items
        setPendingItems([]);
        setRemovedItems([]);
      } else {
        throw new Error(data.msg || "Failed to update order");
      }
    } catch (error) {
     
      window.showToast("error", error.message || "Failed to update order");
    }
  };

  const handleOngoingOrderUpdate = async () => {
    if (!pendingItems.length) return;

    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const currentCustomerId = userData?.customer_id || localStorage.getItem("customer_id");
      const currentCustomerType = userData?.customer_type || localStorage.getItem("customer_type");
      const cartId = localStorage.getItem("cartId"); // Get cart_id from localStorage

      if (!cartId) {
        throw new Error("Cart ID not found");
      }

      if (!currentCustomerId) {
        window.showToast("error", "Please login to update order");
       
        return;
      }

      const requestBody = {
        order_id: orderDetails.order_details.order_id,
        customer_id: currentCustomerId,
        customer_type: currentCustomerType,
        restaurant_id: restaurantId,
        cart_id: cartId, // Add cart_id to request
        order_items: pendingItems.map((item) => ({
          menu_id: item.menu_id.toString(),
          quantity: item.quantity.toString(),
          half_or_full: item.half_or_full || "full",
          comment: item.notes || ""
        }))
      };

      

      const response = await fetch(
         `${config.apiDomain}/user_api/add_to_existing_order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        }
      );

      const data = await response.json();

      if (data.st === 1) {
        window.showToast("success", "Items added to order successfully");
        // Refresh order details
        fetchOrderDetails(order_number);
        // Clear pending items
        setPendingItems([]);
      } else {
        throw new Error(data.msg || "Failed to add items to order");
      }
    } catch (error) {
      
      window.showToast(
        "error",
        error.message || "Failed to add items to order"
      );
    }
  };

  const fetchOrderStatus = async () => {
    try {
      // Get current customer ID from localStorage or userData
      const userData = JSON.parse(localStorage.getItem("userData"));
      const currentCustomerId =
        userData?.customer_id || localStorage.getItem("customer_id");

      if (!currentCustomerId) {
        
        window.showToast("error", "Customer information not found");
        return;
      }

      if (!restaurantId) {
        
        return;
      }

      const response = await fetch(
         `${config.apiDomain}/user_api/get_order_list`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            order_status: "completed",
            customer_id: currentCustomerId,
            customer_type:
              userData?.customer_type || localStorage.getItem("customer_type"),
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
       
        window.showToast("error", "Failed to fetch order status");
      }
    } catch (error) {
      
      window.showToast("error", "Failed to check order status");
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
      state: { categoryName }
    });
  };

  useEffect(() => {
    if (order_number && restaurantId && customerId) {
      fetchOrderDetails(order_number);
      fetchOrderStatus();
      // handleSubmitOrder();
    }
  }, [order_number, restaurantId, customerId]);

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
      <div className="page-wrapper full-height pb-5">
        <Header title="Order Details" />

        <div className="container mt-5 pb-0">
          <div className="d-flex justify-content-between align-items-center mb-3">
            {orderStatus && (
              <div className="order-status d-flex align-items-center">
                <span className="d-flex align-items-center">
                  <i className={`${getStatusIcon(orderStatus)} me-2 fs-5`}></i>
                  <span className="font_size_14">
                    {getDisplayStatus(orderStatus)}
                  </span>
                </span>
              </div>
            )}

            <span className="gray-text font_size_14">{order_details.date}</span>
          </div>

          <div className="card rounded-4">
            <div className="card-body p-2">
              <div className="row align-items-center mb-0">
                <div className="col-4">
                  <span className="fs-6 fw-semibold mb-0">
                    <i className="ri-hashtag pe-2    "></i>
                    {order_details.order_number}
                  </span>
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
                    <i className="ri-store-2-line pe-2 "></i>
                    <span className="font_size_14 fw-medium">
                      {order_details.restaurant_name.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="col-4 text-end">
                  <i className="ri-map-pin-user-fill ps-0 pe-1 font_size_12 gray-text"></i>
                  <span className="fs-6 gray-text font_size_12">
                    {order_details.table_number}
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="menu-info">
                    <span className="font_size_14   gray-text">
                      <i className="ri-bowl-line pe-2 "></i>
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
            </div>
          </div>
        </div>

        <ThemeProvider>
          {/* Conditional rendering of the green card or OrderGif based on order status */}
          <div className="container py-0">
            {!loading && orderStatus && (
              <>
                {orderStatus === "completed" ? (
                  <div className="card-body text-center bg-success rounded-4 text-white">
                    <span className="fs-6 fw-medium h-100">
                      Your delicious order has been served
                    </span>
                  </div>
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

          <div className="container p-0">
            {!isCompleted &&
              orderStatus !== "canceled" &&
              orderStatus !== "cancelled" &&
              orderStatus !== "cancle" && (
                <div className="container py-0">
                  <div className="input-group w-100 my-2 border border-muted rounded-4">
                    <span className="input-group-text py-0">
                      <i className="ri-search-line fs-3 gray-text"></i>
                    </span>
                    <input
                      ref={searchInputRef}
                      type="search"
                      className="form-control bg-white ps-2"
                      placeholder="Search to add more items"
                      onChange={handleSearch}
                      value={searchTerm}
                    />
                  </div>
                </div>
              )}
          </div>

          {customerId ? (
            <section className="container mt-1 py-1">
              
              {!isCompleted &&
                orderStatus !== "canceled" &&
                orderStatus !== "cancelled" &&
                orderStatus !== "cancle" && (
                 
                  
                    
                  <div className="row g-3 mb-4">
                    {searchedMenu.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="  mb-0 gray-text">Search Results</div>
                      <div className="  gray-text" onClick={handleClearAll}>
                        Clear All
                      </div>
                    </div>
                    )}
                   
             {searchedMenu
                      .filter((menu) => !removedItems.has(menu.menu_id))
                      .map((menu) => (
                        <div key={menu.menu_id} className="col-12">
                          <div
                            className="card mb-3 rounded-4"
                            onClick={() => handleMenuItemClick(menu)}
                          >
                            <div className="card-body py-0">
                              <div className="row">
                                <div className="col-3 px-0 position-relative">
                                  <img
                                    src={menu.image || images}
                                    alt={menu.menu_name}
                                    className="img-fluid rounded-start-3 "
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
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleLikeClick(menu, e);
                                    }}
                                  >
                                    <i
                                      className={`${
                                        favoriteMenus[menu.menu_id] ||
                                        menu.is_favourite
                                          ? "ri-heart-3-fill text-danger"
                                          : "ri-heart-3-line"
                                      } fs-6`}
                                    ></i>
                                  </div>

                                  {menu.offer && (
                                    <div
                                      className="gradient_bg d-flex justify-content-center align-items-center"
                                      style={{
                                        position: "absolute",
                                        top: "0px",
                                        left: "0px",
                                        height: "15px",
                                        width: "60px",
                                        borderRadius: "7px 0px 7px 0px",
                                      }}
                                    >
                                      <span className="font_size_10 text-white">
                                        <i className="ri-percent-line me-1 "></i>
                                        {menu.offer || "No"}% Off
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="col-9 pt-1 pb-0 pe-0 ps-2">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className="font_size_14 fw-medium">
                                      {menu.menu_name}
                                    </div>
                                    <div className="col-3">
                                      <span
                                        className={`btn btn-success  px-2 py-1 ${
                                          isItemAdded(menu.menu_id)
                                            ? "btn-secondary gray-text"
                                            : "btn-success text-white addOrder-btn"
                                        }`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          !isItemAdded(menu.menu_id) &&
                                            handleAddToCartClick(menu);
                                        }}
                                        style={{
                                          cursor: isItemAdded(menu.menu_id)
                                            ? "default"
                                            : "pointer",
                                        }}
                                      >
                                        {isItemAdded(menu.menu_id)
                                          ? "Added"
                                          : "Add"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-7 mt-1 pe-0">
                                      <span>
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
                                            <span className="text-success font_size_10">
                                              <i className="ri-restaurant-line mt-0 me-2"></i>
                                              {menu.category_name}
                                            </span>
                                          </span>
                                        </div>
                                      </span>
                                    </div>
                                    <div className="col-4 text-center me-0 ms-2 p-0 mt-1">
                                      <span>
                                        <span className="font_size_10 gray-text">
                                          <i className="ri-star-half-line pe-1 ratingStar font_size_10"></i>
                                          {parseFloat(menu.rating).toFixed(1)}
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="row mt-2">
                                    <div className="col-8 px-0">
                                      <span className="mb-0 mt-1 text-start">
                                        <span className="ms-3 me-1 text-info font_size_14 fw-semibold">
                                          ₹{calculatePrice(menu)}
                                        </span>
                                        <span className="gray-text font_size_12 fw-normal text-decoration-line-through">
                                          ₹
                                          {(
                                            parseFloat(
                                              menu.oldPrice || menu.price
                                            ) * (quantities[menu.menu_id] || 1)
                                          ).toFixed(2)}
                                        </span>
                                      </span>
                                      
                                    </div>
                                    {/* <div className="col-4 increment-decrement">
                                      <div className="d-flex justify-content-end align-items-center">
                                        <i
                                          className="ri-subtract-line mx-2 fs-2"
                                          style={{ cursor: "pointer" }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDecrement(menu.menu_id);
                                          }}
                                        ></i>
                                        <span className="">
                                          {quantities[menu.menu_id] || 1}
                                        </span>
                                        <i
                                          className="ri-add-line mx-2 fs-2"
                                          style={{ cursor: "pointer" }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleIncrement(menu.menu_id);
                                          }}
                                        ></i>
                                      </div>
                                    </div> */}
                                      <div className="col-4 ">
                          <div className="d-flex justify-content-center align-items-center mt-1 bg-light rounded-pill py-1 ">
                            <div
                              className="border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center"
                              style={{
                                height: "25px",
                                width: "25px",
                              }}
                            >
                              <i
                                className="ri-subtract-line fs-6"
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDecrement(menu.menu_id);
                                }}
                              ></i>
                            </div>
                            <span className="text-light  px-2">
                            {quantities[menu.menu_id] || 1}

                            </span>
                            <div
                              className="border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center"
                              style={{
                                height: "25px",
                                width: "25px",
                              }}
                            >
                              <i
                                className="ri-add-line  fs-6"
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleIncrement(menu.menu_id);
                                }}
                              ></i>
                            </div>
                          </div>
                        </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <hr></hr>
                        </div>
                      ))}
                  </div>
                )}

              {!isCompleted && pendingItems.length > 0 && (
                <div className="row g-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <h6 className="mb-0 gray-text">Newly Added In Basket</h6>
                  </div>
                  {pendingItems.map((menu) => (
                    <div key={menu.menu_id} className="col-12 mt-2">
                      <div
                        className="card my-2 rounded-4"
                        onClick={() => handleMenuItemClick(menu)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="card-body py-0">
                          <div className="row">
                            <div className="col-3 px-0">
                              <img
                                src={menu.image || images}
                                alt={menu.menu_name}
                                // className="img-fluid rounded-start-3 rounded-end-0"
                                className="img-fluid rounded-start-3 "
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
                                <div
                                  className="border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center"
                                  style={{
                                    position: "absolute",
                                    bottom: "-2px",
                                    right: "-62px",
                                    height: "20px",
                                    width: "20px",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLikeClick(menu, e);
                                  }}
                                >
                                  <i
                                    className={`${
                                      favoriteMenus[menu.menu_id] ||
                                      menu.is_favourite
                                        ? "ri-heart-3-fill text-danger"
                                        : "ri-heart-3-line"
                                    } fs-6`}
                                  ></i>
                                </div>
                              </div>
                              {menu.offer && (
                                <div
                                  className="gradient_bg d-flex justify-content-center align-items-center"
                                  style={{
                                    position: "absolute",
                                    top: "0px",
                                    left: "0px",
                                    height: "15px",
                                    width: "60px",
                                    borderRadius: "7px 0px 7px 0px",
                                  }}
                                >
                                  <span className="font_size_10 text-white">
                                    <i className="ri-percent-line me-1 "></i>
                                    {menu.offer || "No "}% Off
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="col-8 ps-2 pt-1 pe-0">
                              <div className="row">
                                <div className="col-11">
                                  <div className="font_size_14 fw-medium">
                                    {menu.menu_name}
                                  </div>
                                </div>
                                <div className="col-1 text-end px-0">
                                  <i
                                    className="ri-close-line"
                                    style={{ cursor: "pointer" }}
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
                                  <span className="text-success font_size_10 fw-medium">
                                    <i className="ri-restaurant-line mt-0 me-2"></i>
                                    {menu.category_name}
                                  </span>
                                </div>
                                <div className="col-4 text-end px-0">
                                  <i className="ri-star-half-line ratingStar font_size_10"></i>
                                  <span className="  gray-text font_size_10 fw-medium">
                                    {parseFloat(menu.rating).toFixed(1)}
                                  </span>
                                </div>
                              </div>
                              <div className="row mt-2">
                                <div className="col-9">
                                  <span className=" font_size_14 fw-semibold text-info">
                                    ₹{menu.price * menu.quantity}
                                  </span>
                                  <span className="gray-text  font_size_12 fw-normal text-decoration-line-through ms-2">
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
              {/* {!isCompleted && pendingItems.length > 0 && (
                <div className="d-flex justify-content-center my-3">
                  {orderStatus === "placed" ? (
                    <button
                      className="btn btn-success text-white btn-sm"
                      onClick={handlePlacedOrderUpdate}
                    >
                      Update Order ({pendingItems.length})
                    </button>
                  ) : orderStatus === "ongoing" ? (
                    <button
                      className="btn btn-success text-white btn-sm"
                      onClick={handleOngoingOrderUpdate}
                    >
                      Add to Order ({pendingItems.length})
                    </button>
                  ) : null}
                </div>
              )} */}

              {!isCompleted && pendingItems.length > 0 && searchTerm !== "" && (
                <hr className="my-4 dotted-line text-primary" />
              )}
              {/* Horizontal line */}

              {/* Original menu items */}
              <div className="row">
                <span className="gray-text ms-1 mb-2">
                  Existing Ordered Items
                </span>
                {menu_details.map((menu) => (
                  <div key={menu.menu_id} className="col-12">
                    <div
                      className="card mb-3 rounded-4"
                      onClick={() => handleMenuItemClick(menu)}
                    >
                      <div className="card-body py-0">
                        <div className="row">
                          <div className="col-3 px-0 position-relative">
                            <img
                              src={menu.image || images}
                              alt={menu.menu_name}
                              className="img-fluid rounded-start-3 "
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

                            {/* Veg/Non-veg indicator */}
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

                            {/* Heart icon */}
                            <div
                              className="border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center"
                              style={{
                                position: "absolute",
                                bottom: "3px",
                                right: "3px",
                                height: "20px",
                                width: "20px",
                              }}
                              onClick={(e) => handleLikeClick(menu, e)}
                            >
                              <i
                                className={`${
                                  favoriteMenus[menu.menu_id] ||
                                  menu.is_favourite
                                    ? "ri-heart-3-fill text-danger"
                                    : "ri-heart-3-line"
                                } fs-6`}
                              ></i>
                            </div>

                            {/* Offer badge */}
                            {menu.offer && (
                              <div
                                className="gradient_bg d-flex justify-content-center align-items-center"
                                style={{
                                  position: "absolute",
                                  top: "0px",
                                  left: "0px",
                                  height: "15px",
                                  width: "60px",
                                  borderRadius: "7px 0px 7px 0px",
                                }}
                              >
                                <span className="font_size_10 text-white">
                                  <i className="ri-percent-line me-1 "></i>
                                  {menu.offer || "No"}% Off
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="col-8 ps-2 pt-1 pe-0">
                            <div className="row">
                              <div className="col-8">
                                {/* Menu Name with Delete Icon for placed orders */}
                                <div className="d-flex justify-content-between align-items-start">
                                  <span className="fw-medium font_size_14 mb-1 d-block">
                                    {menu.menu_name}
                                  </span>
                                  {orderStatus === "placed" &&
                                    isWithinPlacedWindow && (
                                      <div className="col-2 text-end">
                                        <i
                                          className="ri-close-line text-danger"
                                          style={{ cursor: "pointer" }}
                                          onClick={(e) =>
                                            handleRemoveItem(menu, e)
                                          }
                                        ></i>
                                      </div>
                                    )}
                                </div>
                                {/* Category with Spicy Index */}
                                <span className="text-success font_size_10 fw-medium">
                                  <i className="ri-restaurant-line mt-0 me-2"></i>
                                  {menu.category_name}
                                </span>
                                {/* Spicy Index next to category name */}
                                {menu.spicy_index && (
                                  <span className="ms-2 spicy-index ">
                                    {Array.from({ length: 5 }).map((_, index) =>
                                      index < menu.spicy_index ? (
                                        <i
                                          key={index}
                                          className="ri-fire-fill text-danger font_size_12 firefill offer-code"
                                        ></i>
                                      ) : (
                                        <i
                                          key={index}
                                          className="ri-fire-line gray-text font_size_12"
                                        ></i>
                                      )
                                    )}
                                  </span>
                                )}
                              </div>

                              {/* Rating */}
                              <div className="col-4 text-end px-0">
                                <i className="ri-star-half-line ratingStar font_size_10"></i>
                                <span className="gray-text font_size_10 fw-medium">
                                  {parseFloat(menu.rating).toFixed(1)}
                                </span>
                              </div>
                            </div>
                            <div className="row mt-2">
                              <div className="col-9 px-0">
                                <span className="mt-0 mb-2 text-start">
                                  <span className="ms-3 me-1 font_size_14 fw-semibold text-info">
                                    ₹{menu.price}
                                  </span>
                                  <span className="gray-text font_size_12 fw-normal text-decoration-line-through">
                                    ₹
                                    {(
                                      menu.price /
                                      (1 - menu.offer / 100)
                                    ).toFixed(2)}
                                  </span>
                                </span>
                              </div>
                              <div className="col-3 text-end p-0">
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
                          className="btn btn-outline-primary rounded-pill px-3"
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
                        <i className="ri-add-circle-line me-1 fs-4"></i>
                          Order More Items 
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            </section>
          ) : (
            <SigninButton />
          )}
        </main>

        {customerId && orderDetails && (
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
                      <span className="ps-2 fw-semibold fs-6">Grand Total</span>
                      <span className="pe-2  fw-semibold fs-6">
                        ₹{orderDetails.order_details.grand_total || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Only show invoice button if order status is completed */}
            {orderStatus === "completed" && (
              <div className="d-flex justify-content-center">
                {orderDetails.invoice_url ? (
                  <a
                    href={orderDetails.invoice_url}
                    download={`invoice_${orderDetails.order_details.order_number}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="btn btn-success rounded-pill text-white px-5">
                      Invoice &nbsp;
                      <i className="ri-download-2-line"></i>
                    </button>
                  </a>
                ) : (
                  <button className="btn btn-success rounded-pill text-white px-5">
                    Invoice &nbsp;
                    <i className="ri-download-2-line"></i>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {showModal && selectedMenu && (
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-center">
                    {selectedMenu.menu_name}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Portion Size</label>
                    <div>
                      <button
                        className={`btn ${
                          portionSize === "half"
                            ? "btn-primary"
                            : "btn-outline-primary"
                        } me-2`}
                        onClick={() => setPortionSize("half")}
                        disabled={!halfPrice}
                      >
                        Half (₹{halfPrice || "N/A"})
                      </button>
                      <button
                        className={`btn ${
                          portionSize === "full"
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => setPortionSize("full")}
                      >
                        Full (₹{fullPrice || "N/A"})
                      </button>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="notes" className="form-label">
                      Special Instructions
                    </label>
                    <textarea
                      className="form-control border-primary  "
                      id="notes"
                      rows="3"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requests?"
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleConfirmAddToCart}
                    disabled={isPriceFetching}
                  >
                    {isPriceFetching ? "Loading..." : "Add to Order"}
                  </button>
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
