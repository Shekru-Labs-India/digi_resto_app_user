import React, { useEffect, useState } from "react";
import Swiper from "swiper";
import images from "../assets/MenuDefault.png";
import { Link } from "react-router-dom";
import { useRestaurantId } from '../context/RestaurantIdContext';

const FeaturedArea = () => {
  const [menuLists, setMenuLists] = useState([]);
  const { restaurantId } = useRestaurantId();

  // Utility function to convert string to title case
  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchMenuData = async (retryCount = 0) => {
      try {
        if (!restaurantId) {
          throw new Error("Restaurant ID is not available");
        }
        const response = await fetch(
          "https://menumitra.com/user_api/get_banner_and_offer_menu_list", // Updated URL
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },  
            body: JSON.stringify({
              restaurant_id: restaurantId,
            }),
          }
        );
        console.log("Restaurant ID:", restaurantId);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.st === 1) {
          const formattedMenuLists = data.data.offer_menu_list.map((menu) => ({ // Updated to use offer_menu_list
            ...menu,
            name: toTitleCase(menu.category_name), // Adjusted to use category_name
            menu_cat_name: toTitleCase(menu.category_name),
          }));
          if (isMounted) {
            setMenuLists(formattedMenuLists);
          }

          // Initialize Swiper after setting menu data
          new Swiper(".featured-swiper", {
            slidesPerView: "auto",
            spaceBetween: 20,
            loop: true,
            autoplay: {
              delay: 2500,
              disableOnInteraction: false,
            },
          });
        } else {
          console.error("API Error:", data.msg);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (retryCount < 3) {
          console.log(`Retrying... (${retryCount + 1})`);
          fetchMenuData(retryCount + 1);
        }
      }
    };

    fetchMenuData();

    return () => {
      isMounted = false;
    };
  }, [restaurantId]);

  return (
    <div className="dz-box style-3">
      <div className="swiper featured-swiper">
        <div className="swiper-wrapper">
          {menuLists.map((menu) => (
            <div key={menu.menu_id} className="swiper-slide">
              <Link to={`/ProductDetails/${menu.menu_id}`}>
                <div
                  className="cart-list rounded-4 "
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <div className="dz-media media-100 ">
                    <img
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      src={menu.image || images} // Use default image if menu.image is null
                      alt={menu.name}
                      onError={(e) => {
                        e.target.src = images; // Set local image source on error
                      }}
                    />
                  </div>
                  <div className="dz-content" style={{ display: "block" }}>
                    <h6 className="title">{/* {menu.name} */}</h6>
                    <ul className="dz-meta mt-2">
                      {/* <li className="dz-price"> */}
                      <li
                        className="dz-price fs-5"
                        style={{ color: "#4E74FC" }}
                      >
                        ₹{menu.price}{" "}
                        <del className="fs-5 ps-2">
                          ₹{Math.floor(menu.price * 1.1)}
                        </del>
                      </li>
                    </ul>
                    {/* <div
                      className="dz-quantity detail-content"
                      style={{ fontSize: "12px" }}
                    >
                      <i
                        class="ri-restaurant-line"
                        style={{ paddingRight: "5px" }}
                      ></i>
                      {menu.menu_cat_name}
                    </div> */}
                    <div className="row pt-2">
                      <div className="col-6">
                        {" "}
                        <div
                          className="fw-medium d-flex fs-6 mx-0 offer-color"
                          
                        >
                          {menu.offer} Off
                        </div>
                      </div>
                      <div className="col-6">
                        {" "}
                        <p className="fs-5 fw-semibold">
                          <i
                            class="ri-star-half-line pe-2 ratingStar"
                  
                          ></i>
                          {menu.rating}
                        </p>
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
  );
};

export default FeaturedArea;
