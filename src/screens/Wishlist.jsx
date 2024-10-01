import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Bottom from "../component/bottom";
import SigninButton from "../constants/SigninButton";
import { useRestaurantId } from "../context/RestaurantIdContext"; // Ensure this context is used correctly
import images from "../assets/MenuDefault.png";

const Wishlist = () => {
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState(
    () => JSON.parse(localStorage.getItem("cartItems")) || []
  );
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

  const handleAddToCartClick = async (item) => {
    if (!customerId || !restaurantId) {
      console.error("Customer ID or Restaurant ID is missing.");
      navigate("/Signinscreen");
      return;
    }
   

    if (!isMenuItemInCart(item.menu_id)) {
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
        } else {
          console.error("Failed to add item to cart:", data.msg);
          // Revert the local storage and state update if the API call fails
          const revertedCartItems = updatedCartItems.filter(
            (cartItem) => cartItem.menu_id !== item.menu_id
          );
          localStorage.setItem("cartItems", JSON.stringify(revertedCartItems));
          setCartItems(revertedCartItems);
        }
      } catch (error) {
        console.error("Error adding item to cart:", error);
        // Revert the local storage and state update if the API call fails
        const revertedCartItems = updatedCartItems.filter(
          (cartItem) => cartItem.menu_id !== item.menu_id
        );
        localStorage.setItem("cartItems", JSON.stringify(revertedCartItems));
        setCartItems(revertedCartItems);
      }
    } else {
      alert(" This item is already in the cart");
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
  }, [customerId, restaurantId]);

  const handleRemoveItemClick = (index, menuId) => {
    removeItem(index, menuId);
  };

  return (
    <div className="page-wrapper full-height">
    <header className="header header-fixed style-3">
      <div className="header-content">
        <div className="left-content">
          <Link
            to="/HomeScreen"
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
            <span className="">({menuList.length})</span>
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
                    </div>
                    <div className="col-9 pt-2 p-0">
                      <div className="row">
                        <div className="col-7 pe-2 menu_name">
                          <div>{menu.menu_name}</div>
                        </div>
                        <div className="col-4 text-end ps-0 pe-2">
                          <i
                            className="ri-close-line  fs-4"
                            onClick={() =>
                              handleRemoveItemClick(index, menu.menu_id)
                            }
                          ></i>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-5 pe-0 ps-4">
                          <i className="ri-restaurant-line mt-0 me-2 text-primary"></i>
                          <span className="text-primary">
                            {menu.category_name}
                          </span>
                        </div>
                        <div className="col-4  px-0">
                          {menu.spicy_index && (
                            <div className="offer-code">
                              {Array.from({ length: 5 }).map((_, index) =>
                                index < menu.spicy_index ? (
                                  <i
                                    className="ri-fire-fill fs-6"
                                    style={{color:"#eb8e57"}}
                                    
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
                        <div className="col-2 text-end  px-0">
                          <span className="fs-6 fw-semibold gray-text">
                            <i className="ri-star-half-line me-1 ratingStar"></i>
                            {menu.rating || 0.1}
                          </span>
                        </div>
                      </div>

                      <div className="row mt-2 align-items-center">
                        <div className="col-5 px-0 text-start">
                          <p className="mb-0 ms-2 fs-4 fw-medium">
                            <span className="ms-3 me-2 text-info">
                              ₹{menu.price}
                            </span>
                            <span className="gray-text fs-6 text-decoration-line-through ">
                              ₹{menu.oldPrice || menu.price}
                            </span>
                          </p>
                        </div>
                        <div className="col-3 px-0 ">
                          {" "}
                          <span className="fs-6  offer-color ">
                            {menu.offer || "No "}% Off
                          </span>
                        </div>

                        <div className="col-3 text-end px-0 ">
                          <div
                            className="cart-btn"
                            onClick={() => handleAddToCartClick(menu)}
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
              </div>
            </div>
          ))
        ) : (
          <div className="container overflow-hidden d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
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
        <div className="container overflow-hidden d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
          <div className="m-b20 dz-flex-box text-center">
            <div className="dz-cart-about">
              <h5>Please log in to view your favourites.</h5>
              <Link className="btn btn-outline-primary mt-3" to="/Signinscreen">
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