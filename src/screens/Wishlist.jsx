import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Bottom from "../component/bottom";
import SigninButton from "../constants/SigninButton";
import { useRestaurantId } from "../context/RestaurantIdContext"; // Ensure this context is used correctly
import images from "../assets/MenuDefault.png";
import EventEmitter from "../components/EventEmitter";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/saga-blue/theme.css"; // Choose a theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const Wishlist = () => {
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState(
    () => JSON.parse(localStorage.getItem("cartItems")) || []
  );
  const navigate = useNavigate();
  const toast = useRef(null);

  // Fetch restaurant_id from context or local storage
  const { restaurantId: contextRestaurantId } = useRestaurantId();
  const storedRestaurantId = localStorage.getItem("RestaurantId");
  const restaurantId = contextRestaurantId || storedRestaurantId;

  // Retrieve user data from local storage
  const userData = JSON.parse(localStorage.getItem("userData"));
  const customerId = userData ? userData.customer_id : null;

  // Debugging logs
  console.log("UserData from LocalStorage:", userData);
  console.log("Customer ID:", customerId);
  console.log("Restaurant ID from context/localStorage:", restaurantId);

  // Update local storage with restaurant_id
  useEffect(() => {
    if (restaurantId) {
      localStorage.setItem("restaurantId", restaurantId);
    }
  }, [restaurantId]);

  const removeItem = async (indexToRemove, menuId) => {
    if (!customerId || !menuId || !restaurantId) {
      console.error("Customer ID, Menu ID, or Restaurant ID is missing.");
      return;
    }

    try {
      const response = await fetch(
        "https://menumitra.com/user_api/remove_favourite_menu",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId, // Include restaurant_id
            menu_id: menuId,
            customer_id: customerId,
          }),
        }
      );

      if (response.ok) {
        const updatedMenuList = [...menuList];
        updatedMenuList.splice(indexToRemove, 1);
        setMenuList(updatedMenuList);

        // Show toast notification for item removed from favorites
        toast.current.show({
          severity: "success", // Green color for positive action
          summary: "Removed from Favorites",
          detail: "Item has been removed from your favorites.",
          life: 3000,
        });
      } else {
        console.error(
          "Failed to remove item from wishlist:",
          response.statusText
        );
        // Show toast notification for failure
        toast.current.show({
          severity: "error", // Red color for negative action
          summary: "Error",
          detail: "Failed to remove item from favorites.",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      // Show toast notification for error
      toast.current.show({
        severity: "error", // Red color for negative action
        summary: "Error",
        detail: "An error occurred while removing the item.",
        life: 3000,
      });
    }
  };

  const handleAddToCartClick = async (item) => {
    if (!customerId || !restaurantId) {
      console.error("Customer ID or Restaurant ID is missing.");
      navigate("/Signinscreen");
      return;
    }

    if (isMenuItemInCart(item.menu_id)) {
      // Show toast notification for item already in cart
      toast.current.show({
        severity: "warn", // Yellow color for warning
        summary: "Item Already in Cart",
        detail: item.menu_name,
        life: 3000,
      });
      return;
    }

    // Update local storage and state immediately
    const updatedCartItems = [...cartItems, { ...item, quantity: 1 }];
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);

    try {
      const response = await fetch(
        "https://menumitra.com/user_api/add_to_cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            menu_id: item.menu_id,
            customer_id: customerId,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.st === 1) {
        console.log("Item added to cart successfully.");
        localStorage.setItem("cartId", data.cart_id); // Store the cart ID in local storage

        // Show toast notification for item added to cart
        toast.current.show({
          severity: "success", // Green color for positive action
          summary: "Added to Cart",
          detail: item.menu_name,
          life: 3000,
        });
      } else {
        console.error("Failed to add item to cart:", data.msg);
        // Revert the local storage and state update if the API call fails
        const revertedCartItems = updatedCartItems.filter(
          (cartItem) => cartItem.menu_id !== item.menu_id
        );
        localStorage.setItem("cartItems", JSON.stringify(revertedCartItems));
        setCartItems(revertedCartItems);

        // Show toast notification for failure
        toast.current.show({
          severity: "error", // Red color for negative action
          summary: "Error",
          detail: "Failed to add item to cart.",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      // Revert the local storage and state update if the API call fails
      const revertedCartItems = updatedCartItems.filter(
        (cartItem) => cartItem.menu_id !== item.menu_id
      );
      localStorage.setItem("cartItems", JSON.stringify(revertedCartItems));
      setCartItems(revertedCartItems);

      // Show toast notification for error
      toast.current.show({
        severity: "error", // Red color for negative action
        summary: "Error",
        detail: "An error occurred while adding the item to the cart.",
        life: 3000,
      });
    }
  };

  const isMenuItemInCart = (menuId) => {
    return cartItems.some((item) => item.menu_id === menuId);
  };

  const toTitleCase = (text) => {
    if (!text) return "";
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    const fetchFavoriteItems = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://menumitra.com/user_api/get_favourite_list",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customer_id: customerId,
              restaurant_id: restaurantId,
            }),
          }
        );
    
        if (response.ok) {
          const data = await response.json();
          if (data.st === 1 && Array.isArray(data.lists)) {
            // Calculate old price for each item
            const updatedMenuList = data.lists.map((item) => ({
              ...item,
              oldPrice: Math.floor(item.price * 1.1), // Old price calculation
            }));
            setMenuList(updatedMenuList);
          } else {
            console.error("Invalid data format:", data);
          }
        } else {
          console.error("Network response was not ok:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching favorite items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteItems();
  }, [customerId, restaurantId]);

  const handleRemoveItemClick = (index, menuId) => {
    removeItem(index, menuId);
  };

  return (
    <div className="page-wrapper full-height">
      <Toast ref={toast} position="bottom-center" className="custom-toast" />
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <Link
             
              className="back-btn dz-icon icon-sm"
              onClick={() => navigate(-1)}
            >
              <i className="ri-arrow-left-line fs-2"></i>
            </Link>
          </div>
          <div className="mid-content">
            <h5 className="title">
              Favourite{" "}
              {userData && menuList.length > 0 && (
                <span className="gray-text small-number">({menuList.length})</span>
              )}
            </h5>
          </div>
        </div>
      </header>

      <main className="page-content space-top p-b0 mt-3 mb-5 pb-3">
        {customerId ? (
          menuList.length > 0 ? (
            menuList.map((menu, index) => (
              <div className="container py-1" key={index}>
                <div className="card">
                  <div className="card-body py-0">
                    <div className="row">
                      <div className="col-3 px-0">
                        <Link
                          to={{
                            pathname: `/ProductDetails/${menu.menu_id}`,
                          }}
                          state={{
                            restaurant_id: restaurantId,
                            menu_cat_id: menu.menu_cat_id,
                          }}
                        >
                          <img
                            src={menu.image || images}
                            alt={menu.menu_name}
                            className="rounded img-fluid"
                            style={{ width: "100px", height: "100px" }}
                            onError={(e) => {
                              e.target.src = images;
                              e.target.style.width = "100px";
                              e.target.style.height = "100px";
                            }}
                          />
                        </Link>
                      </div>
                      <div className="col-9 pt-1 p-0">
                        <div className="row">
                          <div className="col-9 pe-2 menu_name">
                            <Link
                              to={{
                                pathname: `/ProductDetails/${menu.menu_id}`,
                              }}
                              className=""
                              state={{
                                restaurant_id: restaurantId,
                                menu_cat_id: menu.menu_cat_id,
                              }}
                            >
                              <div>{menu.menu_name}</div>
                            </Link>
                          </div>
                          <div className="col-2 text-end fs-4 ps-0 pe-2 ">
                            
                              <i
                                className="ri-close-line  icon-adjust "
                                onClick={() =>
                                  handleRemoveItemClick(index, menu.menu_id)
                                }
                              ></i>
                            
                          </div>
                        </div>
                        <Link
                          to={{
                            pathname: `/ProductDetails/${menu.menu_id}`,
                          }}
                          state={{
                            restaurant_id: restaurantId,
                            menu_cat_id: menu.menu_cat_id,
                          }}
                        >
                          <div className="row">
                            <div className="col-5 pe-0 ps-4">
                              <i className="ri-restaurant-line mt-0 me-1 category-text fs-xs "></i>
                              <span className="category-text fs-xs  ">
                                {menu.category_name}
                              </span>
                            </div>
                            <div className="col-5 text-center fireNegative  ps-0 ">
                              {menu.spicy_index && (
                                <div className="offer-code">
                                  {Array.from({ length: 5 }).map((_, index) =>
                                    index < menu.spicy_index ? (
                                      <i
                                        className="ri-fire-fill fs-6 "
                                        style={{ color: "#eb8e57" }}
                                        key={index}
                                      ></i>
                                    ) : (
                                      <i
                                        className="ri-fire-line fs-6 gray-text"
                                        key={index}
                                      ></i>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="col-2 px-0 d-flex align-items-center">
                              <span className="fs-6 fw-semibold gray-text favRating">
                                <i className="ri-star-half-line me-1 ratingStar"></i>
                                {menu.rating || 0.1}
                              </span>
                            </div>
                          </div>
                        </Link>

                        <div className="row mt-2  align-items-center">
                          <div className="col-5 ps-4 pe-0 ">
                            <Link
                              to={{
                                pathname: `/ProductDetails/${menu.menu_id}`,
                              }}
                              className=""
                              state={{
                                restaurant_id: restaurantId,
                                menu_cat_id: menu.menu_cat_id,
                              }}
                            >
                              <p className="mb-0  fs-4 me-0 fw-medium">
                                <span className=" me-1 text-info">
                                ₹{menu.price}
                                </span>
                                <span className="gray-text fs-6 text-decoration-line-through ">
                                  ₹{menu.oldPrice || menu.price}
                                </span>
                              </p>
                            </Link>
                          </div>
                          <div className="col-3 ps-0 ">
                            <Link
                              to={{
                                pathname: `/ProductDetails/${menu.menu_id}`,
                              }}
                              state={{
                                restaurant_id: restaurantId,
                                menu_cat_id: menu.menu_cat_id,
                              }}
                            >
                              {" "}
                              <span className="fs-6  offer-color favoffer "   >
                                {menu.offer || "No "}% Off
                              </span>
                            </Link>
                          </div>

                          <div className="col-4 text-center px-0">
                            <div
                              className="cart-btn"
                              onClick={() => handleAddToCartClick(menu)}
                            >
                              {isMenuItemInCart(menu.menu_id) ? (
                                <i className="ri-shopping-cart-fill fs-2 ps-4"></i>
                              ) : (
                                <i className="ri-shopping-cart-line fs-2 ps-4"></i>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              className="container overflow-hidden d-flex justify-content-center align-items-center"
              style={{ height: "80vh" }}
            >
              <div className="m-b20 dz-flex-box text-center">
                <div className="dz-cart-about">
                  <h5 className="title">Nothing to show in favourites.</h5>
                  <p>Add some products to show here!</p>
                  <Link to="/Menu" className="btn btn-outline-primary btn-sm">
                    Browse Menus
                  </Link>
                </div>
              </div>
            </div>
          )
        ) : (
          <div
            className="container overflow-hidden d-flex justify-content-center align-items-center"
            style={{ height: "80vh" }}
          >
            <div className="m-b20 dz-flex-box text-center">
              <div className="dz-cart-about">
                <h5>Please log in to view your favourites.</h5>
                <Link
                  className="btn btn-outline-primary mt-3"
                  to="/Signinscreen"
                >
                  <i className="ri-lock-2-line fs-4 me-2 "></i> Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Bottom />
    </div>
  );
};

export default Wishlist;