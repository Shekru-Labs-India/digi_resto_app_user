import React, { useEffect, useState } from "react";
import Swiper from "swiper";
import images from "../assets/MenuDefault.png";
import { Link } from "react-router-dom";
import { useRestaurantId } from '../context/RestaurantIdContext';

const OfferAndFeatured = () => {
  const [banners, setBanners] = useState([]);
  const [menuLists, setMenuLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { restaurantId } = useRestaurantId();

  // Utility function to convert string to title case
  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (!restaurantId) {
          throw new Error("Restaurant ID is not available");
        }

        // Fetch banners and offer menu
        const response = await fetch(
          "https://men4u.xyz/user_api/get_banner_and_offer_menu_list",
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

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.st === 1) {
          // Extract banners
          const bannerUrls = data.data.banner_list
            .filter(item => item.image)
            .map(item => item.image);
          if (isMounted) {
            setBanners(bannerUrls);
          }

          // Extract menu items
          const formattedMenuLists = data.data.offer_menu_list.map((menu) => ({
            ...menu,
            name: toTitleCase(menu.category_name), // Assuming category_name is used as the name
            menu_cat_name: toTitleCase(menu.category_name),
          }));
          if (isMounted) {
            setMenuLists(formattedMenuLists);
          }
        } else {
          console.error("API Error:", data.msg);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [restaurantId]);

  useEffect(() => {
    if (banners.length > 0) {
      const swiper = new Swiper('.featured-swiper2', {
        slidesPerView: 'auto',
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
  }, [banners]);

  return (
    <div className="dz-box style-3">
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
          <div className="swiper featured-swiper2">
            <div className="swiper-wrapper">
              {banners.map((bannerUrl, index) => (
                <div className="swiper-slide" key={index}>
                  <div className="dz-media rounded-md">
                    <img
                      src={bannerUrl}
                      style={{ width: '100%', height: '160px', borderRadius: '10px' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="swiper featured-swiper">
            <div className="swiper-wrapper">
              {menuLists.map((menu) => (
                <div key={menu.menu_id} className="swiper-slide">
                  <Link to={`/ProductDetails/${menu.menu_id}`}>
                    <div className="cart-list rounded-4" style={{ backgroundColor: "#ffffff" }}>
                      <div className="dz-media media-100">
                        <img
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          src={menu.image || images}
                          alt={menu.name}
                          onError={(e) => {
                            e.target.src = images;
                          }}
                        />
                      </div>
                      <div className="dz-content" style={{ display: "block" }}>
                        <h6 className="title">{menu.name}</h6>
                        <ul className="dz-meta mt-2">
                          <li className="dz-price fs-2" style={{ color: "#4E74FC" }}>
                            ₹{menu.price}{" "}
                            <del className="fs-5 ps-2">
                              ₹{Math.floor(menu.price * 1.1)}
                            </del>
                          </li>
                          <li className="dz-offer offer-color offer-color">{menu.offer}</li> {/* Display offer */}
                        </ul>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OfferAndFeatured;
