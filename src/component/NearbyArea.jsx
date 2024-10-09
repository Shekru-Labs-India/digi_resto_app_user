import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swiper from "swiper";
import { useRestaurantId } from "../context/RestaurantIdContext";
import images from "../assets/MenuDefault.png";
import { Toast } from "primereact/toast";

const NearbyArea = () => {
  const swiperRef = useRef(null);
  const toast = useRef(null);
  const { restaurantId } = useRestaurantId();
  const [menuItems, setMenuItems] = useState(() => {
    const storedItems = localStorage.getItem("menuItems");
    return storedItems ? JSON.parse(storedItems) : [];
  });
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });
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
      centeredSlides: true,
      spaceBetween: 20,
      breakpoints: {
        320: { slidesPerView: 2, spaceBetween: 90 },
        480: { slidesPerView: 2, spaceBetween: -20 },
        640: { slidesPerView: 3, spaceBetween: 100 },
        1024: { slidesPerView: 3, spaceBetween: 90 },
      },
    });

    swiperRef.current = swiper;

    const interval = setInterval(() => {
      if (swiperRef.current) {
        swiperRef.current.slideNext();
      }
    }, 3000);

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
        localStorage.removeItem("menuItems");
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
            console.error("Invalid data format:", data);
          }
        } else {
          console.error("Network response was not ok:", response.statusText);
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
    if (!customerId || !restaurantId) {
      console.error("Customer ID is missing");
      navigate("/Signinscreen");
      return;
    }

    try {
      const menuItem = menuItems.find((item) => item.menu_id === menuId);
      const isFavorite = menuItem.is_favourite;

      const apiUrl = isFavorite
        ? "https://menumitra.com/user_api/remove_favourite_menu"
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

      const data = await response.json();
      if (response.ok && data.st === 1) {

        const updatedMenuItems = menuItems.map((item) =>
          item.menu_id === menuId
            ? { ...item, is_favourite: !isFavorite }
            : item
        );
  
        
      setMenuItems(updatedMenuItems);
      localStorage.setItem("menuItems", JSON.stringify(updatedMenuItems));

      toast.current.show({
        severity: isFavorite ? "error" : "success",
        summary: "Success",
        detail: isFavorite ? "Removed from Favourites" : "Added to Favourites",
        life: 3000,
      });
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update favorite status",
        life: 3000,
      });
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const handleAddToCartClick = async (menuItem) => {
    if (!customerId || !restaurantId) {
      console.error("Customer ID is missing");
      navigate("/Signinscreen");
      return;
    }

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
            menu_id: menuItem.menu_id,
            customer_id: customerId,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.st === 1) {
        const updatedCartItems = [...cartItems, { ...menuItem, quantity: 1 }];
        setCartItems(updatedCartItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        localStorage.setItem("cartId", data.cart_id);

        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Added to cart",
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to add to cart",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const isMenuItemInCart = (menuId) => {
    return cartItems.some((item) => item.menu_id === menuId);
  };

  const renderSpiceIcons = (spicyIndex) => {
    return Array.from({ length: 5 }).map((_, index) =>
      index < spicyIndex ? (
        <i className="ri-fire-fill fs-6" key={index}></i>
      ) : (
        <i
          className="ri-fire-line fs-6 gray-text"
          key={index}
        ></i>
      )
    );
  };

  return (
    <div className="dz-box style-2 nearby-area">
      <Toast ref={toast} position="bottom-center" className="custom-toast" />{" "}
      <div className="title-bar1 align-items-start mb-5">
        <div className="left">
          {menuItems.length > 0 && (
            <h4 className="title mb-1 customFontSizeBold">Special Menu</h4>
          )}
        </div>
      </div>
      <div className="swiper product-swiper swiper-center">
        <div className="swiper-wrapper">
          {menuItems.map((menuItem, index) => (
            <div className="swiper-slide col-6" key={index}>
              <div className="row g-3 grid-style-1">
                <div>
                  <div
                    className="card-item style-6 rounded-3"
                    style={{ width: "216px", height: "auto" }}
                  >
                    <div className="dz-media ">
                      <Link
                        to={`/ProductDetails/${menuItem.menu_id}`}
                        state={{ menu_cat_id: menuItem.menu_cat_id }}
                      >
                        <img
                          src={menuItem.image || images}
                          style={{ height: "100%", width: "100%", objectFit: "fill", aspectRatio: 1 }}
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
                        <Link
                          to={`/ProductDetails/${menuItem.menu_id}`}
                          state={{ menu_cat_id: menuItem.menu_cat_id }}
                        >
                          <div
                            className="dz-quantity detail-content category-text fw-medium text-truncate"
                            style={{ color: "#0a795b" }}
                          >
                            <i
                              className="ri-restaurant-line "
                              style={{ paddingRight: "5px" }}
                            ></i>
                            {toTitleCase(menuItem.category_name)}
                          </div>
                        </Link>
                        <i
                          className={` ${
                            menuItem.is_favourite
                              ? "ri-hearts-fill fs-3"
                              : "ri-heart-2-line fs-3"
                          } fs-2`}
                          onClick={() => handleLikeClick(menuItem.menu_id)}
                          style={{
                            position: "absolute",
                            top: "0",
                            right: "0",
                            fontSize: "23px",
                            cursor: "pointer",
                            color: menuItem.is_favourite
                              ? "#fe0809"
                              : "#73757b",
                          }}
                        ></i>
                      </div>
                      <span className="customFontSizeBold text-wrap">
                        <Link
                          to={`/ProductDetails/${menuItem.menu_id}`}
                          state={{ menu_cat_id: menuItem.menu_cat_id }}
                        >
                          {toTitleCase(menuItem.name)}
                        </Link>
                      </span>
                      <div className="row">
                        <div className="col-6">
                          <div className="offer-code mx-0">
                            {renderSpiceIcons(menuItem.spicy_index)}
                          </div>
                        </div>
                        <div className="col-6 text-end">
                          <i className="ri-star-half-line fs-6 pe-1 ratingStar"></i>
                          <span className="fs-6 fw-semibold gray-text ms-1">
                            {menuItem.rating}
                          </span>
                        </div>
                      </div>
                      <div className="">
                        <div className="row">
                          <div className="col-9">
                            <p className="mb-2 customFontSize fw-medium">
                              <Link
                                to={`/ProductDetails/${menuItem.menu_id}`}
                                state={{ menu_cat_id: menuItem.menu_cat_id }}
                              >
                                <span className="ms-0 me-2 text-info">
                                  ₹{menuItem.price}
                                </span>
                                <span className="gray-text customFontSize text-decoration-line-through">
                                  ₹{menuItem.oldPrice || menuItem.price}
                                </span>
                              </Link>
                            </p>
                          </div>
                          <div className="col-2 me-3">
                            <div
                              onClick={() => handleAddToCartClick(menuItem)}
                              className="cart-btn"
                            >
                              {isMenuItemInCart(menuItem.menu_id) ? (
                                <i className="ri-shopping-cart-fill fs-2"></i>
                              ) : (
                                <i className="ri-shopping-cart-line fs-2"></i>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <span className="customFontSize offer-color">
                            {menuItem.offer || "No "}% Off
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
      </div>
    </div>
  );
};

export default NearbyArea;