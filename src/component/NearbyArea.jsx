import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import images from "../assets/MenuDefault.png";
import Swiper from "swiper/bundle";
import "swiper/swiper-bundle.css";
import { Toast } from "primereact/toast";
import { useCart } from "../context/CartContext";
import LoaderGif from "../screens/LoaderGIF";

const NearbyArea = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { restaurantId } = useRestaurantId();
  const { cartItems, addToCart } = useCart();
  const [customerId, setCustomerId] = useState(null);
  const toast = useRef(null);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setCustomerId(storedUserData.customer_id);
    }
  }, []);

  const toTitleCase = (str) => {
    if (!str) return "";
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  const fetchMenuData = useCallback(async () => {
    if (!restaurantId) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://menumitra.com/user_api/get_special_menu_list",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: customerId || null,
            restaurant_id: restaurantId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.st === 1 && Array.isArray(data.data.special_menu_list)) {
        const formattedMenuItems = data.data.special_menu_list.map((menu) => ({
          ...menu,
          name: toTitleCase(menu.menu_name),
          category_name: toTitleCase(menu.category_name),
          oldPrice: Math.floor(menu.price * 1.1),
          is_favourite: menu.is_favourite === 1,
        }));

        setMenuItems(formattedMenuItems);
      } else {
        console.error("Invalid data format:", data);
        setMenuItems([]);
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
      setMenuItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId, customerId]);

  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  useEffect(() => {
    const handleFocus = () => {
      fetchMenuData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchMenuData]);

  useEffect(() => {
    if (menuItems.length > 0) {
      const swiper = new Swiper(".nearby-swiper", {
        slidesPerView: "auto",
        spaceBetween: 20,
        loop: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
      });

      return () => {
        swiper.destroy();
      };
    }
  }, [menuItems]);

  const renderSpiceIcons = (spicyIndex) => {
    return Array.from({ length: 5 }).map((_, index) =>
      index < spicyIndex ? (
        <i className="ri-fire-fill font_size_14 text-danger" key={index}></i>
      ) : (
        <i className="ri-fire-line font_size_14 gray-text" key={index}></i>
      )
    );
  };

  const handleLikeClick = async (menuId) => {
    if (!customerId || !restaurantId) {
      console.error("Customer ID is missing");
      navigate("/Signinscreen");
      return;
    }

    const menuItem = menuItems.find((item) => item.menu_id === menuId);
    const isFavorite = menuItem.is_favourite;

    const apiUrl = isFavorite
      ? "https://menumitra.com/user_api/remove_favourite_menu"
      : "https://menumitra.com/user_api/save_favourite_menu";

    try {
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

        toast.current.show({
          severity: isFavorite ? "error" : "success",
          summary: "Success",
          detail: isFavorite
            ? "Removed from Favourites"
            : "Added to Favourites",
          life: 2000,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to update favorite status",
          life: 2000,
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
    if (isMenuItemInCart(menuItem.menu_id)) {
      toast.current.show({
        severity: "error",
        summary: "Item Already in Cart",
        detail: menuItem.name,
        life: 2000,
      });
      return;
    }

    try {
      await addToCart(menuItem, customerId, restaurantId);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Added to cart",
        life: 2000,
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to add to cart",
        life: 2000,
      });
    }
  };

  const isMenuItemInCart = (menuId) => {
    return cartItems.some((item) => item.menu_id === menuId);
  };

  return (
    <div className="dz-box style-2 nearby-area">
      <Toast ref={toast} position="bottom-center" className="custom-toast" />
      <div className="title-bar1 align-items-start mb-0 ">
        <div className="left">
          {menuItems.length > 0 && (
            <h4 className="font_size_14 fw-medium">Our Speciality</h4>
          )}
        </div>
      </div>
      <div className="dz-box style-3">
        <div className="swiper nearby-swiper mt-0">
          <div className="swiper-wrapper">
            {menuItems.map((menuItem) => (
              <div key={menuItem.menu_id} className="swiper-slide">
                <Link
                  to={`/ProductDetails/${menuItem.menu_id}`}
                  state={{ menu_cat_id: menuItem.menu_cat_id }}
                  className="card-link"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                  }}
                >
                  <div className="cart-list style-2-custom">
                    <div className="dz-media media-100 rounded-start-3 rounded-end-0">
                      <img
                        src={menuItem.image || images}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          aspectRatio: 1,
                        }}
                        onError={(e) => {
                          e.target.src = images;
                        }}
                        alt={menuItem.name}
                      />
                    </div>
                    <div className="row">
                      <div className="detail-content">
                        <div
                          className="font_size_12 text-success"
                          
                        >
                          <i
                            className="ri-restaurant-line pe-1"
                            
                          ></i>
                          {menuItem.category_name}


                        </div>


                      </div>
                      <span className="font_size_14 fw-medium text-wrap">
                        {menuItem.name}
                      </span>
                      <div className="row">
                        <div className="col-8">
                          <div className="offer-code mx-0">
                            {renderSpiceIcons(menuItem.spicy_index)}
                          </div>
                        </div>
                        <div className="col-4 text-center">
                          <i className="ri-star-half-line font_size_14 ratingStar"></i>
                          <span className="font_size_12 fw-normal gray-text">
                            {menuItem.rating}
                          </span>
                        </div>
                      </div>

                      <div className="row ">
                        <div className="col-8">
                          <p className="mb-0 fw-medium">
                            <span className="me-2 text-info font_size_14 fw-semibold">
                              ₹{menuItem.price}
                            </span>
                            <span className="gray-text text-decoration-line-through font_size_12 fw-normal">
                              ₹{menuItem.oldPrice || menuItem.price}
                            </span>
                          </p>
                        </div>

                        <div className="col-4">
                          <span className="font_size_12 text-success">
                            {menuItem.offer || "No "}% Off
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyArea;
