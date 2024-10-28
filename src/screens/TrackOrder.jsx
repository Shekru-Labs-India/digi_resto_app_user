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
import { useCart } from "../context/CartContext";

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
  const [removedItems, setRemovedItems] = useState(() => {
    const saved = localStorage.getItem(`removedOrderItems_${order_number}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [orderStatus, setOrderStatus] = useState(null);
  const toast = useRef(null);

  // Add helper function at the top of component
  const isVegMenu = (menuType) => {
    return menuType?.toLowerCase() === "veg";
  };

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
        // Show error toast
      }
    } catch (error) {
      console.error("Error fetching half/full prices:", error);
      // Show error toast
    } finally {
      setIsPriceFetching(false);
    }
  };

  const handleAddToCartClick = (menu) => {
    if (!restaurantId) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Restaurant information not found",
        life: 3000,
      });
      return;
    }

    if (orderStatus === "completed" || orderStatus === "cancelled") {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Cannot modify completed or cancelled orders",
        life: 3000,
      });
      return;
    }

    // Check if item is already added
    if (isItemAdded(menu.menu_id)) {
      toast.current.show({
        severity: "info",
        summary: "Info",
        detail: "This item is already in your order",
        life: 2000,
      });
      return;
    }

    setSelectedMenu(menu);
    fetchHalfFullPrices(menu.menu_id);
    setPortionSize("full");
    setNotes("");
    setShowModal(true);
  };

  const handleConfirmAddToCart = async () => {
    if (!selectedMenu || !restaurantId) return;

    const userData = JSON.parse(localStorage.getItem("userData"));
    const currentCustomerId =
      userData?.customer_id || localStorage.getItem("customer_id");
    const currentCustomerType =
      userData?.customer_type || localStorage.getItem("customer_type");

    if (!currentCustomerId) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please login to add items to order",
        life: 3000,
      });
      navigate("/Signinscreen");
      return;
    }

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

    // Create new menu item for pending basket
    const newMenuItem = {
      ...selectedMenu,
      price: selectedPrice,
      quantity: 1,
      half_or_full: portionSize,
      notes: notes,
      isPending: true, // Add this flag to identify pending items
    };

    // Add to pending items instead of direct order
    setPendingItems((prev) => [...prev, newMenuItem]);

    setShowModal(false);
    setSelectedMenu(null);
    setNotes("");

    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Item added to basket",
      life: 2000,
    });
  };

  const isItemAdded = (menuId) => {
    return (
      pendingItems.some((item) => item.menu_id === menuId) ||
      (orderDetails?.menu_details || []).some((item) => item.menu_id === menuId)
    );
  };

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

  const handleIncrement = (menuItem) => {
    setQuantities((prev) => {
      const newQuantity = Math.min((prev[menuItem] || 1) + 1, 20);
      if (newQuantity === 20) {
        toast.current.show({
          severity: "info",
          summary: "Maximum Quantity",
          detail: `You've reached the maximum quantity for ${menuItem.menu}`,
          life: 2000,
        });
      } else {
        toast.current.show({
          severity: "success",
          summary: "Quantity Increased",
          detail: `${menuItem.menu_name} quantity increased to ${newQuantity}`,
          life: 2000,
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
          life: 2000,
        });
      } else {
        toast.current.show({
          severity: "success",
          summary: "Quantity Decreased",
          detail: `${menuItem.menu_name} quantity decreased to ${newQuantity}`,
          life: 2000,
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

  const handleRemoveItem = (menu, e) => {
    e.stopPropagation();

    if (orderStatus !== "placed" || !isWithinPlacedWindow) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail:
          "Items can only be removed within 90 seconds of placing the order",
        life: 3000,
      });
      return;
    }

    try {
      const updatedRemovedItems = [
        ...removedItems,
        {
          menu_id: menu.menu_id,
          order_id: orderDetails.order_details.order_id,
          removed_at: new Date().toISOString(),
          price: menu.price,
          quantity: menu.quantity,
        },
      ];

      // Update localStorage with order number to handle multiple orders
      localStorage.setItem(
        `removedOrderItems_${order_number}`,
        JSON.stringify(updatedRemovedItems)
      );
      setRemovedItems(updatedRemovedItems);

      // Update order details locally
      setOrderDetails((prev) => ({
        ...prev,
        menu_details: prev.menu_details.filter(
          (item) => item.menu_id !== menu.menu_id
        ),
        order_details: {
          ...prev.order_details,
          total_total: (
            parseFloat(prev.order_details.total_total) -
            parseFloat(menu.price) * menu.quantity
          ).toFixed(2),
          grand_total: (
            parseFloat(prev.order_details.grand_total) -
            parseFloat(menu.price) * menu.quantity
          ).toFixed(2),
        },
      }));

      toast.current.show({
        severity: "success",
        summary: "Item Removed",
        detail: `${menu.menu_name} removed from order`,
        life: 2000,
      });
    } catch (error) {
      console.error("Error removing item:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to remove item. Please try again.",
        life: 3000,
      });
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
        "https://menumitra.com/user_api/update_placed_order",
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
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Order updated successfully",
          life: 3000,
        });

        // Refresh order details
        fetchOrderDetails(order_number);

        // Clear pending and removed items
        setPendingItems([]);
        setRemovedItems([]);
      } else {
        throw new Error(data.msg || "Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to update order",
        life: 3000,
      });
    }
  };

  const handleRemovePendingItem = (menuId) => {
    setPendingItems((prevItems) =>
      prevItems.filter((item) => item.menu_id !== menuId)
    );
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
        const userData = JSON.parse(localStorage.getItem("userData"));
        const currentCustomerId =
          userData?.customer_id || localStorage.getItem("customer_id");
        const currentCustomerType =
          userData?.customer_type || localStorage.getItem("customer_type");

        if (!currentCustomerId) {
          console.error("Customer ID not found");
          return;
        }

        const requestBody = {
          restaurant_id: parseInt(restaurantId, 10),
          keyword: debouncedSearchTerm.trim(),
          customer_id: currentCustomerId,
          customer_type: currentCustomerType,
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

  const handleAddToOrder = async (menuItem) => {
    if (!restaurantId) {
      console.error("Restaurant ID not found");
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Restaurant information not found",
        life: 3000,
      });
      return;
    }

    // Check if item is already added
    if (isItemAdded(menuItem.menu_id)) {
      toast.current.show({
        severity: "info",
        summary: "Info",
        detail: "This item is already in your order",
        life: 2000,
      });
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const currentCustomerId =
        userData?.customer_id || localStorage.getItem("customer_id");
      const currentCustomerType =
        userData?.customer_type || localStorage.getItem("customer_type");

      if (!currentCustomerId) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please login to add items to order",
          life: 3000,
        });
        return;
      }

      const selectedPrice = portionSize === "half" ? halfPrice : fullPrice;
      if (!selectedPrice) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Price information is not available",
          life: 3000,
        });
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
          "https://menumitra.com/user_api/add_to_existing_order",
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

          toast.current.show({
            severity: "success",
            summary: "Added to Order",
            detail: `${menuItem.menu_name} (${portionSize}, Qty: ${quantity}) added to your order`,
            life: 2000,
          });
        } else {
          throw new Error(data.msg || "Failed to add item to order");
        }
      }
    } catch (error) {
      console.error("Error adding item to order:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail:
          error.message || "Failed to add item to order. Please try again.",
        life: 3000,
      });

      // Rollback the pending items change on error
      setPendingItems((prevItems) =>
        prevItems.filter((item) => item.menu_id !== menuItem.menu_id)
      );
      setSearchedMenu((prevMenu) => [...prevMenu, menuItem]);
    }
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
            customer_id: customerId,
            customer_type: customerType,
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
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to fetch order details. Please try again.",
            life: 3000,
          });
        }
      } else {
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch order details. Please try again.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlacedOrderUpdate = async () => {
    if (!pendingItems.length) return;

    const userData = JSON.parse(localStorage.getItem("userData"));
    const currentCustomerId =
      userData?.customer_id || localStorage.getItem("customer_id");
    const currentCustomerType =
      userData?.customer_type || localStorage.getItem("customer_type");

    if (!currentCustomerId) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please login to update order",
        life: 3000,
      });
      navigate("/Signinscreen");
      return;
    }

    try {
      const requestBody = {
        order_id: orderDetails.order_details.order_id,
        customer_id: parseInt(currentCustomerId),
        customer_type: currentCustomerType,
        restaurant_id: restaurantId,
        table_number: orderDetails.order_details.table_number,
        order_items: [
          // Include existing items that weren't removed
          ...menu_details
            .filter(
              (item) =>
                !removedItems.some(
                  (removedItem) => removedItem.menu_id === item.menu_id
                )
            )
            .map((item) => ({
              menu_id: item.menu_id.toString(),
              quantity: item.quantity.toString(),
              half_or_full: item.half_or_full || "full",
              comment: item.notes || "",
            })),
          // Include new pending items
          ...pendingItems.map((item) => ({
            menu_id: item.menu_id.toString(),
            quantity: item.quantity.toString(),
            half_or_full: item.half_or_full || "full",
            comment: item.notes || "",
          })),
        ],
      };

      const response = await fetch(
        "https://menumitra.com/user_api/update_placed_order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (data.st === 1) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Order updated successfully",
          life: 3000,
        });

        setPendingItems([]);
        setRemovedItems([]);
        localStorage.removeItem(`removedOrderItems_${order_number}`);
        fetchOrderDetails(order_number);
      } else {
        throw new Error(data.msg || "Failed to update order");
      }
    } catch (error) {
      console.error("Error updating placed order:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to update order",
        life: 3000,
      });
    }
  };

  const handleOngoingOrderUpdate = async () => {
    if (!pendingItems.length) return;

    const userData = JSON.parse(localStorage.getItem("userData"));
    const currentCustomerId =
      userData?.customer_id || localStorage.getItem("customer_id");
    const currentCustomerType =
      userData?.customer_type || localStorage.getItem("customer_type");

    if (!currentCustomerId) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please login to add items",
        life: 3000,
      });
      navigate("/Signinscreen");
      return;
    }

    try {
      const requestBody = {
        order_id: orderDetails.order_details.order_id,
        customer_id: parseInt(currentCustomerId),
        customer_type: currentCustomerType,
        restaurant_id: restaurantId,
        table_number: orderDetails.order_details.table_number,
        order_items: pendingItems.map((item) => ({
          menu_id: item.menu_id.toString(),
          quantity: item.quantity.toString(),
          half_or_full: item.half_or_full || "full",
          comment: item.notes || "",
        })),
      };

      const response = await fetch(
        "https://menumitra.com/user_api/add_to_existing_order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (data.st === 1) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Items added to order successfully",
          life: 3000,
        });

        setPendingItems([]);
        fetchOrderDetails(order_number);
      } else {
        throw new Error(data.msg || "Failed to add items to order");
      }
    } catch (error) {
      console.error("Error adding to ongoing order:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to add items to order",
        life: 3000,
      });
    }
  };

  const fetchOrderStatus = async () => {
    try {
      // Get current customer ID from localStorage or userData
      const userData = JSON.parse(localStorage.getItem("userData"));
      const currentCustomerId =
        userData?.customer_id || localStorage.getItem("customer_id");

      if (!currentCustomerId) {
        console.error("Customer ID not found");
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Customer information not found",
          life: 3000,
        });
        return;
      }

      if (!restaurantId) {
        console.error("Restaurant ID not found");
        return;
      }

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
        console.error("Network response was not ok.");
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch order status",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching order status:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to check order status",
        life: 3000,
      });
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
    if (order_number) {
      fetchOrderDetails(order_number);
    }
  }, [order_number]);

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
            <span className="title pb-3">
              {isCompleted ? (
                <>
                  <i className="ri-checkbox-circle-line pe-2"></i>
                  <span>Completed Order</span>
                </>
              ) : order_details.order_status === "placed" ? (
                <>
                  <i className="ri-file-list-3-line pe-2"></i>
                  <span>Placed Order</span>
                </>
              ) : order_details.order_status === "canceled" ? (
                <>
                  <i className="ri-close-circle-line pe-2"></i>
                  <span>Canceled Order</span>
                </>
              ) : (
                <>
                  <i className="ri-timer-line pe-2"></i>
                  <span>Ongoing Order</span>
                </>
              )}
            </span>

            <span className="gray-text date_margin">{order_details.date}</span>
          </div>

          <div className="card rounded-3">
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
                  <i className="ri-user-location-line ps-0 pe-1 font_size_12 gray-text"></i>
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
          {orderDetails?.order_details?.order_status === "placed" && (
            <RemainingTimeDisplay />
          )}

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

          {customerId ? (
            <section className="container mt-1 py-1">
              {/* Searched menu items */}
              {!isCompleted && searchedMenu.length > 0 && (
                <div className="row g-3 mb-4">
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="  mb-0 gray-text">Search Results</div>
                    <div className="  gray-text" onClick={handleClearAll}>
                      Clear All
                    </div>
                  </div>
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
                                ></i>
                              </div>

                              {menu.offer && (
                                <div
                                  className="gradient_bg d-flex justify-content-center align-items-center"
                                  style={{
                                    position: "absolute",
                                    top: "-1px",
                                    left: "0px",
                                    height: "17px",
                                    width: "70px",
                                    borderRadius: "7px 0px 7px 0px",
                                  }}
                                >
                                  <span className="text-white">
                                    <i className="ri-discount-percent-line me-1 font_size_14"></i>
                                    <span className="font_size_10">
                                      {menu.offer || "No"}% Off
                                    </span>
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
                                    className={`btn btn-success px-2 py-1 ${
                                      isItemAdded(menu.menu_id)
                                        ? "btn-secondary gray-text"
                                        : "btn-success text-white addOrder-btn"
                                    }`}
                                    onClick={() =>
                                      !isItemAdded(menu.menu_id) &&
                                      handleAddToCartClick(menu)
                                    }
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
                                  <span
                                    onClick={() =>
                                      handleMenuClick(menu.menu_id)
                                    }
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
                                <div className="col-4 text-center me-0 ms-2 p-0 mt-1">
                                  <span
                                    onClick={() =>
                                      handleMenuClick(menu.menu_id)
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    <span className="font_size_10 gray-text">
                                      <i className="ri-star-half-line pe-1 ratingStar font_size_10"></i>
                                      {parseFloat(menu.rating).toFixed(1)}
                                    </span>
                                  </span>
                                </div>
                              </div>
                              <div className="row mt-2">
                                <div className="col-8 px-0">
                                  <span
                                    className="mb-0 mt-1 text-start"
                                    onClick={() =>
                                      handleMenuClick(menu.menu_id)
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
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
                                  <span
                                    className="mb-0 mt-1 ms-3 offerSearch"
                                    onClick={() =>
                                      handleMenuClick(menu.menu_id)
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    <span className="px-0 text-start font_size_12 text-success">
                                      {menu.offer || "No"}% Off
                                    </span>
                                  </span>
                                </div>
                                <div className="col-4 increment-decrement">
                                  <div className="d-flex justify-content-end align-items-center">
                                    <i
                                      className="ri-subtract-line mx-2 fs-2"
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        handleDecrement(menu.menu_id)
                                      }
                                    ></i>
                                    <span className="">
                                      {quantities[menu.menu_id] || 1}
                                    </span>
                                    <i
                                      className="ri-add-line mx-2 fs-2"
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
                                    bottom: "3px",
                                    right: "-75px",
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
                                  ></i>
                                </div>
                              </div>
                              <div
                                className="gradient_bg d-flex justify-content-center align-items-center"
                                style={{
                                  position: "absolute",
                                  top: "-1px",
                                  left: "0px",
                                  height: "17px",
                                  width: "70px",
                                  borderRadius: "7px 0px 7px 0px",
                                }}
                              >
                                <span className="text-white">
                                  <i className="ri-discount-percent-line me-1 font_size_14"></i>
                                  <span className="font_size_10">
                                    {menu.offer || "No "}% Off
                                  </span>
                                </span>
                              </div>
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
                                  <span className="text-success font_size_12 fw-medium">
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
              )}

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
                            >
                              <i
                                className={`${
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
                                  top: "-1px",
                                  left: "0px",
                                  height: "17px",
                                  width: "70px",
                                  borderRadius: "7px 0px 7px 0px",
                                }}
                              >
                                <span className="text-white">
                                  <i className="ri-discount-percent-line me-1 font_size_14"></i>
                                  <span className="font_size_10">
                                    {menu.offer || "No"}% Off
                                  </span>
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="col-8 ps-2 pt-1 pe-0">
                            <div className="row">
                              <div className="col-8">
                                {/* Menu Name */}
                                <span className="fw-medium font_size_14 mb-1 d-block">
                                  {menu.menu_name}
                                </span>
                                {/* Category with Spicy Index */}
                                <span className="text-success font_size_12 fw-medium">
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
              </div>
            </section>
          ) : (
            <SigninButton />
          )}
        </main>

        {customerId && orderDetails && (
          <div className="container mb-4 pt-0 z-3">
            <div className="card mt-2 p-0 mb-5 ">
              <div className="card-body mx-auto rounded-3 p-0">
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
                  <h5 className="modal-title">{selectedMenu.menu_name}</h5>
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
                      className="form-control"
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
