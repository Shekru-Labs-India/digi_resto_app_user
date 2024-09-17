import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import Bottom from "../component/bottom";
import SigninButton from "../constants/SigninButton";
import { useRestaurantId } from "../context/RestaurantIdContext"; // Ensure this context is used correctly

const Wishlist = () => {
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch restaurant_id from context or local storage
  const { restaurantId: contextRestaurantId } = useRestaurantId();
  const storedRestaurantId = localStorage.getItem("restaurantId");
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
      } else {
        console.error(
          "Failed to remove item from wishlist:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  const addToCart = (item) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const itemInCart = cartItems.find(
      (cartItem) => cartItem.menu_id === item.menu_id
    );

    if (!itemInCart) {
      const updatedCartItems = [...cartItems, { ...item, quantity: 1 }];
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    } else {
      console.log("Item already in cart");
    }
  };

  const isMenuItemInCart = (menuId) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    return cartItems.some((item) => item.menu_id === menuId);
  };

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const fetchFavoriteItems = async () => {
      // Check if customerId and restaurantId exist before making the API call
      if (!customerId || !restaurantId) {
        console.error("Customer ID or Restaurant ID is not available.");
        setLoading(false);
        return;
      }

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
              restaurant_id: restaurantId, // Include restaurant_id in the request
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.st === 1 && Array.isArray(data.lists)) {
            setMenuList(data.lists);
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
  }, [customerId, restaurantId]); // Ensure customerId and restaurantId are included in the dependency array

  const handleRemoveItemClick = (index, menuId) => {
    removeItem(index, menuId);
  };

  const handleAddToCartClick = (item) => {
    if (!isMenuItemInCart(item.menu_id)) {
      addToCart(item);
      navigate("/Cart");
    } else {
      console.log("Item is already in the cart");
    }
  };

  return (
    <div className="page-wrapper">
      {loading ? (
        <div id="preloader">
          <div className="loader">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <header className="header header-fixed style-3">
            <div className="header-content">
              <div className="left-content">
                <Link
                  to="/HomeScreen"
                  className="back-btn dz-icon icon-fill icon-sm"
                  onClick={() => navigate(-1)}
                >
                  <i className="ri-arrow-left-line"></i>
                </Link>
              </div>
              <div className="mid-content">
                <h5 className="title">
                  Favourite{" "}
                  {userData && (
                    <span className="items-badge">{menuList.length}</span>
                  )}
                </h5>
              </div>
              <div className="right-content">
                <Link to="/Search" className="dz-icon icon-fill icon-sm">
                  <i className="ri-search-line"></i>
                </Link>
              </div>
            </div>
          </header>

          <main className="page-content space-top p-b70">
            <div className="container">
              {userData ? (
                menuList.length > 0 ? (
                  <div className="row g-3">
                    {menuList.map((menu, index) => (
                      <div className="col-12" key={index}>
                        <div
                          className="dz-card list-style style-3"
                          style={{ position: "relative" }}
                        >
                          <div className="dz-media">
                            <Link to={`/ProductDetails/${menu.menu_id}`}>
                              <img
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  borderRadius: "15px",
                                }}
                                src={menu.image || images}
                                alt={menu.menu_name}
                                onError={(e) => {
                                  e.target.src = images;
                                  e.target.style.width = "100px";
                                  e.target.style.height = "100px";
                                }}
                              />
                            </Link>
                          </div>
                          <div className="dz-content">
                            <h5 className="title">
                              <Link to={`/ProductDetails/${menu.menu_id}`}>
                                {toTitleCase(menu.menu_name)}
                              </Link>
                            </h5>

                            <ul className="dz-meta">
                              <li
                                className="dz-price"
                                style={{ color: "#4E74FC" }}
                              >
                                ₹{menu.price}
                                {menu.oldPrice && <del>₹{menu.oldPrice}</del>}
                              </li>
                              <li>
                                <i
                                  className="ri-store-2-line"
                                  style={{
                                    paddingLeft: "20px",
                                    fontSize: "18px",
                                  }}
                                >
                                  {" "}
                                </i>
                                {menu.restaurant_name}
                              </li>
                            </ul>

                            {/* Remove Icon */}
                            <div
                              onClick={() =>
                                handleRemoveItemClick(index, menu.menu_id)
                              }
                              className="remove-text"
                              style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                cursor: "pointer",
                              }}
                            >
                              <i
                                className="ri-close-line"
                                style={{ fontSize: "18px" }}
                              ></i>
                            </div>

                            {/* Cart Icon */}
                            <div
                              onClick={() => handleAddToCartClick(menu)}
                              className="cart-btn"
                              style={{
                                position: "absolute",
                                bottom: "10px",
                                right: "10px",
                                cursor: "pointer",
                              }}
                            >
                              {isMenuItemInCart(menu.menu_id) ? (
                                <i className="ri-shopping-cart-2-fill"></i>
                              ) : (
                                <i className="ri-shopping-cart-2-line"></i>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="empty-favorites d-flex flex-column justify-content-center align-items-center w-100"
                    style={{ height: "100%" }}
                  >
                    <h5>Nothing to show in favorites.</h5>
                    <p>Add some products to show here!</p>
                    <Link to="/HomeScreen" className="btn btn-primary">
                      Browse Menus
                    </Link>
                  </div>
                )
              ) : (
                <SigninButton />
              )}
            </div>
          </main>
        </>
      )}

      <Bottom activeMenu="favourite" />
    </div>
  );
};

export default Wishlist;
