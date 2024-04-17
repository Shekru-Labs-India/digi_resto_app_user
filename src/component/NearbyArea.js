import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swiper from "swiper";

import images from "../assets/MenuDefault.png";

const NearbyArea = () => {
  const swiperRef = useRef(null);
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();
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

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(
          "http://194.195.116.199/user_api/get_special_menu_list",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              restaurant_id: 13,
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
            }));
            setMenuItems(formattedMenuItems);
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

    fetchMenuData();
  }, []);

  const toTitleCase = (str) => {
    return str.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };


  const handleAddToCartClick = (menuItem) => {
    const cartItem = {
      image: menuItem.image,
      name: menuItem.name,
      price: menuItem.price,
      oldPrice: menuItem.oldPrice,
      quantity: 1, // Default quantity is 1
    };

    // Simulate adding to local storage (replace with your logic)
    const updatedCartItems =
      JSON.parse(localStorage.getItem("cartItems")) || [];
    updatedCartItems.push(cartItem);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

    // Navigate to Cart screen
    navigate("/Cart");
  };

  const handleLikeClick = async (restaurantId, menuId, customerId) => {
    try {
      const response = await fetch(
        "http://194.195.116.199/user_api/save_favourite_menu",
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
      if (response.ok) {
        // Handle success response as needed
        console.log("Item added to favorites successfully");
        navigate("/Wishlist");
      } else {
        console.error("Failed to add item to favorites");
      }
    } catch (error) {
      console.error("Error adding item to favorites:", error);
    }
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
                <div >
                <div className="card-item style-6">

                  <div className="dz-media">
                    <img src={menuItem.image}  style={{ height: "150px",width:'400px' }}
                  onError={(e) => {
                    e.target.src = images; // Set local image source on error
                  }}
                />
                  </div>
                  <div className="dz-content">
                    <span className="product-title">
                      {toTitleCase(menuItem.menu_cat_name)}
                      <i className="bx bx-heart bx-sm" 
                      style={{ marginLeft: "70px" }}  
                      onClick={() => handleLikeClick(13, menuItem.menu_id, 1)}></i>
                    </span>
                    <h4 className="item-name">
                      <a href="product-detail.html">{toTitleCase(menuItem.name)}</a>
                    </h4>
                    <div className="offer-code">Spicy Level: {toTitleCase(menuItem.spicy_index)}</div>
                    <div className="footer-wrapper">
                      <div className="price-wrapper">
                        <h6 className="current-price">₹{menuItem.price}</h6>
                        <span className="old-price">₹{menuItem.oldPrice}</span>
                      </div>
                      <div
                       onClick={() => handleAddToCartClick(menuItem)} 
                      className="cart-btn btn-outline-primary">
                        <i className="bx bx-cart bx-sm"></i>
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
