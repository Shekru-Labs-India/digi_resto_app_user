import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swiper from "swiper";
import { useRestaurantId } from "../context/RestaurantIdContext";
import images from "../assets/MenuDefault.png";
// import { RiFireFill, RiFireLine } from "react-icons/ri"; // Import Remixicon icons

const NearbyArea = () => {
  const swiperRef = useRef(null);
  const { restaurantId } = useRestaurantId();
  const [menuItems, setMenuItems] = useState(() => {
    const storedItems = localStorage.getItem("menuItems");
    return storedItems ? JSON.parse(storedItems) : [];
  });
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setCustomerId(userData.customer_id);
    }
  }, []);

  useEffect(() => {
    const swiper = new Swiper(".product-swiper", {
      loop: true,
      slidesPerView: "auto",
      centeredSlides: true,
      spaceBetween: 10,
    });

    swiperRef.current = swiper;

    const interval = setInterval(() => {
      if (swiperRef.current) {
        swiperRef.current.slideNext();
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      if (swiperRef.current) {
        swiperRef.current.destroy();
      }
    };
  }, []);

  const toTitleCase = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const fetchAllMenuListByCategory = async () => {
    try {
      const response = await fetch(
        "https://menumitra.com/user_api/get_all_menu_list_by_category",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: customerId || null, // Send customer_id if logged in
            restaurant_id: restaurantId,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("API response data:", data);
        // Handle the response data as needed
      } else {
        console.error("Failed to fetch menu data. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(
          "https://menumitra.com/user_api/get_all_menu_list_by_category",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customer_id: customerId || null, // Send customer_id if logged in
              restaurant_id: restaurantId,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("API response data:", data);

          if (data.st === 1 && Array.isArray(data.MenuList)) {
            const formattedMenuItems = data.MenuList.map((menu) => ({
              ...menu,
              oldPrice: Math.floor(menu.price * 1.1),
              is_favourite: menu.is_favourite === 1,
            }));

            setMenuItems(formattedMenuItems);
            localStorage.setItem(
              "menuItems",
              JSON.stringify(formattedMenuItems)
            );
          } else {
            console.error("Invalid menu data format:", data);
          }
        } else {
          console.error("Failed to fetch menu data. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    if (restaurantId) {
      fetchMenuData();
    }
  }, [restaurantId]);

  const handleLikeClick = async (menuId) => {
    if (!customerId) {
      console.error("Customer ID is missing");
      return;
    }

    try {
      const menuItem = menuItems.find((item) => item.menu_id === menuId);
      const isFavorite = menuItem.is_favourite;

      const apiUrl = isFavorite
        ? "https://menumitra.com/user_api/delete_favourite_menu"
        : "https://menumitra.com/user_api/save_favourite_menu";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          menu_id: menuId,
          customer_id: customerId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1) {
          setMenuItems((prevItems) =>
            prevItems.map((item) =>
              item.menu_id === menuId
                ? { ...item, is_favourite: !item.is_favourite }
                : item
            )
          );
          console.log(
            isFavorite ? "Removed from favorites" : "Added to favorites"
          );
        } else {
          console.error("Failed to update favorite status:", data.msg);
        }
      } else {
        console.error("Network response was not ok.");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const handleAddToCartClick = (menuItem) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const isAlreadyInCart = cartItems.some(
      (item) => item.menu_id === menuItem.menu_id
    );

    if (isAlreadyInCart) {
      alert("This item is already in the cart!");
      return;
    }

    const cartItem = {
      image: menuItem.image,
      name: menuItem.name,
      price: menuItem.price,
      oldPrice: menuItem.oldPrice,
      quantity: 1,
      menu_id: menuItem.menu_id,
    };

    const updatedCartItems = [...cartItems, cartItem];
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    navigate("/Cart");
  };

  const isMenuItemInCart = (menuId) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    return cartItems.some((item) => item.menu_id === menuId);
  };

  const renderSpiceIcons = (spicyIndex) => {
    return Array.from({ length: 5 }).map((_, index) =>
      index < spicyIndex ? (
        <i
          className="ri-fire-fill"
          style={{ fontSize: "13px" }}
          key={index}
        ></i>
      ) : (
        <i
          className="ri-fire-line"
          style={{ fontSize: "12px", color: "#0000001a" }}
          key={index}
        ></i>
      )
    );
  };

  return (
    <div className="dz-box style-2 nearby-area">
      <div className="title-bar1 align-items-start">
        <div className="left">
          <h4 className="title mb-1">Special Menu</h4>
        </div>
      </div>
      <div className="swiper product-swiper swiper-center">
        <div className="swiper-wrapper">
          {menuItems.map((menuItem, index) => (
            <div className="swiper-slide col-6" key={index}>
              <div className="row g-3 grid-style-1">
                <div>
                  <div className="card-item style-6">
                    <div className="dz-media">
                      <Link to={`/ProductDetails/${menuItem.menu_id}`}>
                        <img
                          src={menuItem.image || images}
                          style={{ height: "150px", width: "400px" }}
                          onError={(e) => {
                            e.target.src = images;
                          }}
                        />
                      </Link>
                    </div>
                    <div className="dz-content">
                      <div
                        className="detail-content"
                        style={{ position: "relative" }}
                      >
                        {/* <h3 className="product-title">
                          {toTitleCase(menuItem.menu_cat_name)}
                        </h3> */}
                        <div
                          className="dz-quantity detail-content"
                          style={{ fontSize: "12px" }}
                        >
                          <i
                            class="ri-restaurant-line"
                            style={{ paddingRight: "5px" }}
                          ></i>
                          {toTitleCase(menuItem.menu_cat_name)}
                        </div>
                        {userData ? (
                          <i
                            className={` ${
                              menuItem.is_favourite
                                ? "ri-hearts-fill text-red"
                                : "ri-heart-2-line"
                            } `}
                            onClick={() => handleLikeClick(menuItem.menu_id)}
                            style={{
                              position: "absolute",
                              top: "0",
                              right: "0",
                              fontSize: "23px",
                              cursor: "pointer",
                            }}
                          ></i>
                        ) : (
                          <i
                            className="ri-heart-line"
                            style={{
                              position: "absolute",
                              top: "0",
                              right: "0",
                              fontSize: "23px",
                              cursor: "pointer",
                            }}
                          ></i>
                        )}
                      </div>
                      <h4 className="item-name ">
                        <a href="product-detail.html">
                          {toTitleCase(menuItem.name)}
                        </a>
                      </h4>
                      <div className="offer-code">
                        {renderSpiceIcons(menuItem.spicy_index)}
                      </div>
                      <div className="footer-wrapper">
                        <div className="price-wrapper">
                          <h6 className="current-price">₹{menuItem.price}</h6>
                          <span className="old-price">
                            ₹{menuItem.oldPrice}
                          </span>
                        </div>
                        {userData ? (
                          <div
                            onClick={() => handleAddToCartClick(menuItem)}
                            className="cart-btn"
                          >
                            {isMenuItemInCart(menuItem.menu_id) ? (
                              <i
                                className="ri-shopping-cart-2-fill"
                                style={{ fontSize: "25px" }}
                              ></i>
                            ) : (
                              <i
                                className="ri-shopping-cart-2-line"
                                style={{ fontSize: "25px" }}
                              ></i>
                            )}
                          </div>
                        ) : (
                          <i
                            className="ri-shopping-cart-2-line"
                            style={{ fontSize: "25px" }}
                          ></i>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NearbyArea;
