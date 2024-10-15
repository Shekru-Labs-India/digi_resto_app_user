import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Bottom from "../component/bottom";
import SigninButton from "../constants/SigninButton";
import { useRestaurantId } from "../context/RestaurantIdContext";
import images from "../assets/MenuDefault.png";
import LoaderGif from "./LoaderGIF";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/saga-blue/theme.css"; // Choose a theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Header from "../components/Header";
import HotelNameAndTable from '../components/HotelNameAndTable';

const Wishlist = () => {
  const [checkedItems, setCheckedItems] = useState({});
  const [expandAll, setExpandAll] = useState(false);
  const [hasFavorites, setHasFavorites] = useState(false);
  
 

  const toggleChecked = (restaurantName) => {
    setCheckedItems((prev) => ({
      ...prev,
      [restaurantName]: !prev[restaurantName],
    }));
  };

  const toggleExpandAll = () => {
    const newExpandAll = !expandAll;
    setExpandAll(newExpandAll);
    const newCheckedItems = {};
    Object.keys(menuList).forEach((restaurantName) => {
      newCheckedItems[restaurantName] = newExpandAll;
    });
    setCheckedItems(newCheckedItems);
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("isDarkMode") === "true";
  });
  const { restaurantName } = useRestaurantId();
  const isLoggedIn = !!localStorage.getItem("userData");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuList, setMenuList] = useState({});

  const [cartItems, setCartItems] = useState(
    () => JSON.parse(localStorage.getItem("cartItems")) || []
  );
  const navigate = useNavigate();
  const toast = useRef(null);

  const { restaurantId: contextRestaurantId } = useRestaurantId();
  const storedRestaurantId = localStorage.getItem("RestaurantId");
  const restaurantId = contextRestaurantId || storedRestaurantId;

  const userData = JSON.parse(localStorage.getItem("userData"));
  const customerId = userData ? userData.customer_id : null;
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurantId) {
      localStorage.setItem("restaurantId", restaurantId);
    }
  }, [restaurantId]);

  const removeItem = async (restaurantName, menuId, restaurantId) => {
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
            restaurant_id: restaurantId,
            menu_id: menuId,
            customer_id: customerId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.st === 1) {
        console.log("Item removed successfully");
        return true;
      } else {
        console.error("Failed to remove item:", data.msg || "Unknown error");
        throw new Error(data.msg || "Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing favorite item:", error);
      throw error;
    }
  };

  const handleAddToCartClick = async (item) => {
    if (!customerId || !restaurantId) {
      console.error("Customer ID or Restaurant ID is missing.");
      navigate("/Signinscreen");
      return;
    }

    if (isMenuItemInCart(item.menu_id)) {
      toast.current.show({
        severity: "error",
        summary: "Item Already in Cart",
        detail: item.menu_name,
        life: 3000,
      });
      return;
    }

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
        toast.current.show({
          severity: "success",
          summary: "Added to Cart",
          detail: item.menu_name,
          life: 3000,
        });
      } else {
        const revertedCartItems = updatedCartItems.filter(
          (cartItem) => cartItem.menu_id !== item.menu_id
        );
        localStorage.setItem("cartItems", JSON.stringify(revertedCartItems));
        setCartItems(revertedCartItems);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to add item to cart.",
          life: 3000,
        });
      }
    } catch (error) {
      const revertedCartItems = updatedCartItems.filter(
        (cartItem) => cartItem.menu_id !== item.menu_id
      );
      localStorage.setItem("cartItems", JSON.stringify(revertedCartItems));
      setCartItems(revertedCartItems);
      toast.current.show({
        severity: "error",
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
          if (data.st === 1 && data.lists) {
            setMenuList(data.lists);
            setHasFavorites(Object.keys(data.lists).length > 0);
          } else {
            console.error("Invalid data format:", data);
            setHasFavorites(false);
          }
        } else {
          console.error("Network response was not ok:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching favourite items:", error);
        setHasFavorites(false);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteItems();
  }, [customerId, restaurantId]);

  
  const wishlistCount = Object.keys(menuList).reduce(
    (total, key) => total + menuList[key].length,
    0
  );

  const handleRemoveItemClick = async (
    restaurantName,
    menuId,
    restaurantId
  ) => {
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
            restaurant_id: restaurantId,
            menu_id: menuId,
            customer_id: customerId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.st === 1) {
        setMenuList((prevMenuList) => {
          const updatedMenuList = { ...prevMenuList };
          updatedMenuList[restaurantName] = updatedMenuList[
            restaurantName
          ].filter((item) => item.menu_id !== menuId);

          // Check if this was the last item in the restaurant
          if (updatedMenuList[restaurantName].length === 0) {
            delete updatedMenuList[restaurantName];
          }

          // Update hasFavorites based on the new menuList
          setHasFavorites(Object.keys(updatedMenuList).length > 0);

          return updatedMenuList;
        });

        toast.current.show({
          severity: "success",
          summary: "Item Removed",
          detail: "Item has been removed from favorites",
          life: 3000,
        });
      } else {
        console.error("Failed to remove item:", data.msg || "Unknown error");
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to remove item from favorites",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error removing favorite item:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An error occurred while removing the item",
        life: 3000,
      });
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getFirstName = (name) => {
    if (!name) return "User";
    const words = name.split(" ");
    return words[0];
  };

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    localStorage.setItem("isDarkMode", newIsDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
    }
  }, [isDarkMode]);

  if (isLoading) {
    return (
      <div id="preloader">
        <div className="loader">
          <LoaderGif />
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper full-height">
      <Toast ref={toast} position="bottom-center" className="custom-toast" />

      <Header title="Favourite" count={wishlistCount} />

      <main className="page-content space-top mb-5 pb-3">
      <HotelNameAndTable 
     restaurantName={restaurantName}
     tableNumber={userData.tableNumber}
   />
        {customerId ? (
          hasFavorites ? (
            <>
              <div className="container d-flex justify-content-end mb-1 mt-0 ps-0 py-0 ">
                <div
                  className="d-flex align-items-center cursor-pointer ps-0 py-0 icon-border"
                  onClick={toggleExpandAll}
                  role="button"
                  aria-label={expandAll ? "Collapse All" : "Expand All"}
                >
                  <span className="icon-circle">
                    <i
                      className={`ri-arrow-down-s-line arrow-icon ${
                        expandAll ? "rotated" : "rotated-1"
                      }`}
                    ></i>
                  </span>
                </div>
              </div>
              {Object.keys(menuList).map((restaurantName) => (
                <div className="container py-0">
                  <div key={restaurantName} className="tab pt-0">
                    <input
                      type="checkbox"
                      id={`chck${restaurantName}`}
                      checked={checkedItems[restaurantName] || false}
                      onChange={() => toggleChecked(restaurantName)}
                    />
                    <label
                      className="tab-label pb-0 px-0 pt-2"
                      htmlFor={`chck${restaurantName}`}
                    >
                      <span className="">
                        <span class=" fw-medium hotel-name">
                          <i class="ri-store-2-line me-2"></i>
                          {restaurantName.toUpperCase()}
                        </span>
                      </span>
                      <span className="">
                        <span className="gray-text ps-2 pe-2 small-number">
                          {menuList[restaurantName].length}
                        </span>
                        <span className="icon-circle">
                          <i
                            className={`ri-arrow-down-s-line arrow-icon pt-0 ${
                              checkedItems[restaurantName]
                                ? "rotated"
                                : "rotated-1"
                            }`}
                          ></i>
                        </span>
                      </span>
                    </label>
                    <div className="tab-content">
                      {menuList[restaurantName].map((menu, index) => (
                        <div className="container py-1 px-0" key={index}>
                          <div className="custom-card rounded-4 ">
                            <Link
                              to={`/ProductDetails/${menu.menu_id}`}
                              state={{
                                restaurant_id: menu.restaurant_id,
                                menu_cat_id: menu.menu_cat_id,
                              }}
                              className="text-decoration-none text-reset"
                            >
                              <div className="card-body py-0">
                                <div className="row">
                                  <div className="col-3 px-0">
                                    <img
                                      src={menu.image || images}
                                      alt={menu.menu_name}
                                      className="rounded-start-3 img-fluid"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "fill",
                                        aspectRatio: "1/1",
                                      }}
                                      onError={(e) => {
                                        e.target.src = images;
                                        e.target.style.width = "100px";
                                        e.target.style.height = "100px";
                                      }}
                                    />
                                  </div>
                                  <div className="col-9 pt-1 p-0">
                                    <div className="row">
                                      <div className="col-9 pe-2">
                                        <div className="ps-2 custom_font_size_bold">
                                          {menu.menu_name}
                                        </div>
                                      </div>
                                      <div className="col-2 text-end fs-4 ps-0 pe-1">
                                        <i
                                          className="ri-hearts-fill icon-adjust heart-fill"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleRemoveItemClick(
                                              restaurantName,
                                              menu.menu_id,
                                              menu.restaurant_id
                                            );
                                          }}
                                        ></i>
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-5 pe-0 ps-4">
                                        <i className="ri-restaurant-line mt-0 me-1 text-success fs-xs fw-medium"></i>
                                        <span className="text-success fs-xs fw-medium">
                                          {menu.category_name}
                                        </span>
                                      </div>
                                      <div className="col-5 text-center fireNegative ps-0">
                                        {menu.spicy_index && (
                                          <div className="offer-code">
                                            {Array.from({ length: 5 }).map(
                                              (_, index) =>
                                                index < menu.spicy_index ? (
                                                  <i
                                                    className="ri-fire-fill fs-6"
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
                                      <div className="col-2 pe-0  d-flex align-items-center ">
                                        <span className="custom_font_size  gray-text favRating wishlist-ratin pe-3">
                                          <i className="ri-star-half-line ratingStar"></i>
                                          {menu.rating || 0.1}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="row mt-2 ps-2 align-items-center">
                                      <div className="col-12 d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                          <p className="mb-0 fs-4 me-2 fw-medium">
                                            <span className="me-1 text-info custom_font_size_bold">
                                              ₹{menu.price}
                                            </span>
                                            <span className="gray-text fs-6 text-decoration-line-through custom_font_size_bold">
                                              ₹{menu.oldPrice || menu.price}
                                            </span>
                                          </p>
                                          <span className="offer-color favoffer custom_font_size">
                                            {menu.offer || "No"}% Off
                                          </span>
                                        </div>
                                        <div
                                          className="cart-btn cart-align me-2 pe-1"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleAddToCartClick(menu);
                                          }}
                                        >
                                          {isMenuItemInCart(menu.menu_id) ? (
                                            <i className="ri-shopping-cart-fill fs-2"></i>
                                          ) : (
                                            <i className="ri-shopping-cart-line fs-2"></i>
                                          )}
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
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div
              className="container overflow-hidden d-flex justify-content-center align-items-center"
              style={{ height: "78vh" }}
            >
              <div className="m-b20 dz-flex-box text-center">
                <div className="dz-cart-about">
                  <h5 className="custom_font_size">
                    Nothing to show in favourites.
                  </h5>
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
                <span className="custom_font_size">
                  Please log in to view your favourites.
                </span>
                <Link
                  className="btn btn-outline-primary mt-3 custom_font_size"
                  to="/Signinscreen"
                >
                  <i className="ri-lock-2-line me-2 "></i> Login
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
