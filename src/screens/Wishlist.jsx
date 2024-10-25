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
import HotelNameAndTable from "../components/HotelNameAndTable";
import { useCart } from "../context/CartContext";
const Wishlist = () => {
  const [checkedItems, setCheckedItems] = useState({});
  const [expandAll, setExpandAll] = useState(false);
  const [hasFavorites, setHasFavorites] = useState(false);
  const [wishlistItems, setWishlistItems] = useState({});
  const { restaurantId, restaurantName } = useRestaurantId();
  const [isLoading, setIsLoading] = useState(true);
 

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

  const isLoggedIn = !!localStorage.getItem("userData");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuList, setMenuList] = useState({});

  const [cartItems, setCartItems] = useState(
    () => JSON.parse(localStorage.getItem("cartItems")) || []
  );

  const navigate = useNavigate();
  const toast = useRef(null);
  const { addToCart, removeFromCart, isMenuItemInCart } = useCart();

  const userData = JSON.parse(localStorage.getItem("userData"));
  const customerId = userData ? userData.customer_id : null;


  const [cartRestaurantId, setCartRestaurantId] = useState(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    return cartItems.length > 0 ? cartItems[0].restaurant_id : null;
  });

 

 

  const fetchFavoriteItems = async () => {
    if (!customerId || !restaurantId) {
      console.error("Customer ID or Restaurant ID is missing.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
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
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1 && data.lists) {
          setWishlistItems(data.lists);
          setMenuList(data.lists); // Update menuList as well
          setHasFavorites(Object.keys(data.lists).length > 0);
        } else {
          console.error("Invalid data format:", data);
          setWishlistItems({});
          setMenuList({});
          setHasFavorites(false);
        }
      } else {
        console.error("Network response was not ok:", response.statusText);
        setWishlistItems({});
        setMenuList({});
        setHasFavorites(false);
      }
    } catch (error) {
      console.error("Error fetching favourite items:", error);
      setWishlistItems({});
      setMenuList({});
      setHasFavorites(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteItems();
    updateCartRestaurantId();
  }, [customerId, restaurantId]);

  const updateCartRestaurantId = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    if (cartItems.length > 0) {
      setCartRestaurantId(cartItems[0].restaurant_id);
    } else {
      setCartRestaurantId(restaurantId);
    }
  };

  const isCartFromDifferentRestaurant = (itemRestaurantId) => {
    return cartRestaurantId && cartRestaurantId !== itemRestaurantId;
  };

  const handleAddToCartClick = async (item) => {
    if (!customerId || !restaurantId) {
      console.error("Customer ID or Restaurant ID is missing.");
      navigate("/Signinscreen");
      return;
    }

    if (isCartFromDifferentRestaurant(item.restaurant_id)) {
      toast.current.show({
        severity: "error",
        summary: "Different Restaurant",
        detail: "This item is from a different restaurant. Clear your cart first.",
        life: 3000,
      });
      return;
    }

    try {
      if (isMenuItemInCart(item.menu_id)) {
        // Remove from cart
        await removeFromCart(item.menu_id, customerId, restaurantId);
        toast.current.show({
          severity: "info",
          summary: "Removed from Cart",
          detail: item.menu_name,
          life: 2000,
        });
      } else {
        // Add to cart
        await addToCart(item, customerId, restaurantId);
        toast.current.show({
          severity: "success",
          summary: "Added to Cart",
          detail: item.menu_name,
          life: 2000,
        });
      }

      // Update cart items in local storage and state
      const updatedCartItems = await fetchCartItems();
      setCartItems(updatedCartItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

      // Update cart restaurant ID
      if (updatedCartItems.length > 0) {
        setCartRestaurantId(updatedCartItems[0].restaurant_id);
      } else {
        setCartRestaurantId(null);
      }

      // Dispatch a custom event to notify other components of the cart update
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: updatedCartItems }));

    } catch (error) {
      console.error("Error updating cart:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An error occurred while updating the cart.",
        life: 2000,
      });
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await fetch(
        "https://menumitra.com/user_api/get_cart_detail_add_to_cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: localStorage.getItem("cartId"),
            customer_id: customerId,
            restaurant_id: restaurantId,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.st === 1 && data.order_items) {
        return data.order_items;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return [];
    }
  };


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
          life: 2000,
        });
      } else {
        console.error("Failed to remove item:", data.msg || "Unknown error");
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to remove item from favorites",
          life: 2000,
        });
      }
    } catch (error) {
      console.error("Error removing favorite item:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An error occurred while removing the item",
        life: 2000,
      });
    }
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

      <Header
        title="Favourite"
        count={Object.keys(wishlistItems).reduce(
          (total, key) => total + wishlistItems[key].length,
          0
        )}
      />
      <main className="page-content space-top mb-5 pb-3">
        <div className="container py-0">
          <HotelNameAndTable
            restaurantName={restaurantName}
            tableNumber={userData?.tableNumber || "1"}
          />
        </div>
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
              {Object.keys(wishlistItems).map((restaurantName) =>
                menuList[restaurantName] &&
                menuList[restaurantName].length > 0 ? (
                  <div className="container py-0" key={restaurantName}>
                    <div className="tab pt-0">
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
                          <span className="font_size_14 fw-medium">
                            <i className="ri-store-2-line me-2"></i>
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
                            <div className="custom-card rounded-3 ">
                              <Link
                                to={`/ProductDetails/${menu.menu_id}`}
                                state={{
                                  restaurant_id: menu.restaurant_id,
                                  menu_cat_id: menu.menu_cat_id,
                                  fromWishlist: true,
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
                                          // objectFit: "fill",
                                          aspectRatio: "1/1",
                                        }}
                                        onError={(e) => {
                                          e.target.src = images;
                                          e.target.style.width = "100%";
                                          e.target.style.height = "100%";
                                          e.target.style.aspectRatio = "1/1";
                                        }}
                                      />
                                      {menu.offer && menu.offer !== "0" && (
                                        <div
                                          className="gradient_bg d-flex justify-content-center align-items-center"
                                          style={{
                                            position: "absolute",
                                            top: "-1px",
                                            left: "0px",
                                            height: "17px",
                                            width: "70px",
                                            borderRadius: "7px 0px 7px 0px",
                                            marginTop: "1px",
                                            marginLeft: "1px",
                                          }}
                                        >
                                          <span className="text-white">
                                            <i className="ri-discount-percent-line me-1 font_size_14"></i>
                                            <span className="font_size_10">
                                              {menu.offer}% Off
                                            </span>
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-9 pt-1 p-0">
                                      <div className="row">
                                        <div className="col-10">
                                          <div className="ps-2 font_size_14 fw-medium">
                                            {menu.menu_name}
                                          </div>
                                        </div>
                                        <div className="col-2 text-end font_size_10">
                                          <div
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleRemoveItemClick(
                                                restaurantName,
                                                menu.menu_id,
                                                menu.restaurant_id
                                              );
                                            }}
                                          >
                                            <i class="ri-delete-bin-line me-1 font_size_14 gray-text"></i>
                                            
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row mt-1">
                                        <div className="col-5 text-start">
                                          <span className="ps-2 font_size_12 text-success">
                                            <i className="ri-restaurant-line mt-0 me-1"></i>
                                            {menu.category_name}
                                          </span>
                                        </div>
                                        <div className="col-3 text-center">
                                          {menu.spicy_index && (
                                            <div className="">
                                              {Array.from({ length: 5 }).map(
                                                (_, index) =>
                                                  index < menu.spicy_index ? (
                                                    <i
                                                      className="ri-fire-fill font_size_14 text-danger"
                                                      key={index}
                                                    ></i>
                                                  ) : (
                                                    <i
                                                      className="ri-fire-line font_size_14 gray-text"
                                                      key={index}
                                                    ></i>
                                                  )
                                              )}
                                            </div>
                                          )}
                                        </div>
                                        <div className="col-4 text-end">
                                          <i className="ri-star-half-line font_size_14 ratingStar "></i>
                                          <span className="font_size_12  fw-normal gray-text">
                                            {menu.rating || 0.1}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="row mt-1">
                                        <div className="col-6">
                                          <p className="ms-2 mb-0 fw-medium">
                                            <span className="font_size_14 fw-semibold text-info">
                                              ₹{menu.price}
                                            </span>
                                            <span className="gray-text font_size_12 text-decoration-line-through fw-normal ms-2">
                                              ₹{menu.oldPrice || menu.price}
                                            </span>
                                          </p>
                                        </div>

                                        <div className="col-6 d-flex justify-content-end">
                                          {customerId && menu.restaurant_id === restaurantId ? (
                                            <div
                                              className="border border-1 rounded-circle bg-white opacity-75 d-flex align-items-center justify-content-center"
                                              style={{
                                                width: "25px",
                                                height: "25px",
                                              }}
                                              onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleAddToCartClick(menu);
                                              }}
                                            >
                                              <i
                                                className={`ri-shopping-cart-${
                                                  isCartFromDifferentRestaurant(
                                                    menu.restaurant_id
                                                  )
                                                    ? ""
                                                    : isMenuItemInCart(
                                                        menu.menu_id
                                                      )
                                                    ? "fill"
                                                    : "line"
                                                } fs-6`}
                                                title={
                                                  isCartFromDifferentRestaurant(
                                                    menu.restaurant_id
                                                  )
                                                    ? "Different Restaurant"
                                                    : ""
                                                }
                                              ></i>
                                            </div>
                                          ) : null}
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
                ) : null
              )}
            </>
          ) : (
            <div
              className="container overflow-hidden d-flex justify-content-center align-items-center"
              style={{ height: "78vh" }}
            >
              <div className="m-b20 dz-flex-box text-center">
                <div className="dz-cart-about">
                  <h5 className=" ">Nothing to show in favourites.</h5>
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
                <span className=" ">
                  Please log in to view your favourites.
                </span>
                <Link
                  className="btn btn-outline-primary mt-3  "
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
