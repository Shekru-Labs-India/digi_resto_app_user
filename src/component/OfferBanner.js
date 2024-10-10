


import React, { useState, useEffect } from "react";
import Swiper from "swiper/bundle";
import "swiper/swiper-bundle.css"; // Correctly import Swiper CSS
import images from "../assets/MenuDefault.png";
import { Link } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";

const OfferBanner = () => {
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

  // Retrieve menuItems from localStorage
  const getLocalMenuItems = () => {
    const storedData = localStorage.getItem("menuItems");
    return storedData ? JSON.parse(storedData) : [];
  };

  // Save menuItems to localStorage
  const saveLocalMenuItems = (menuItems) => {
    localStorage.setItem("menuItems", JSON.stringify(menuItems));
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async (retryCount = 0) => {
      try {
        console.log("Fetching data...");
        const url =
          "https://menumitra.com/user_api/get_banner_and_offer_menu_list";
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
          }),
        };

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.st === 1 && data.data.banner_list) {
          // Fetching banners
          const bannerUrls = data.data.banner_list
            .filter((item) => item.image)
            .map((item) => item.image);
          if (isMounted) {
            setBanners(bannerUrls);
          }
        } else {
          console.error("Invalid data format:", data);
        }

        if (data.st === 1 && data.data.offer_menu_list) {
          // Fetching menu items from API and title-casing names
          const formattedMenuLists = data.data.offer_menu_list.map((menu) => ({
            ...menu,
            name: toTitleCase(menu.menu_name),

            menu_cat_name: toTitleCase(menu.category_name),

          }));

          // Merge local menu items and API data
          const localMenuItems = getLocalMenuItems();
          const mergedMenuItems = [...localMenuItems, ...formattedMenuLists];

          if (isMounted) {
            setMenuLists(mergedMenuItems);
          }

          // Save updated menu list to localStorage
          saveLocalMenuItems(mergedMenuItems);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (retryCount < 3) {
          console.log(`Retrying... (${retryCount + 1})`);
          fetchData(retryCount + 1);
        } else {
          if (isMounted) {
            setLoading(false);
          }
        }
        return;
      }
      if (isMounted) {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [restaurantId]);

  // useEffect(() => {
  //   if (banners.length > 0) {
  //     const swiper = new Swiper(".featured-swiper2", {
  //       slidesPerView: "auto",
  //       spaceBetween: 20,
  //       loop: true,
  //       autoplay: {
  //         delay: 2500,
  //         disableOnInteraction: false,
  //       },
  //     });

  //     return () => {
  //       swiper.destroy();
  //     };
  //   }
  // }, [banners]);

  useEffect(() => {
    if (menuLists.length > 0) {
      const swiper = new Swiper(".featured-swiper", {
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
  }, [menuLists]);

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
          {/* Banner Section */}
          {/* <div className="swiper featured-swiper2 ">
            <div className="swiper-wrapper">
              {banners.map((bannerUrl, index) => (
                <div className="swiper-slide" key={index}>
                  <div className="dz-media rounded-md">
                    <img
                      src={bannerUrl}
                      style={{
                        width: "100%",
                        height: "160px",
                        borderRadius: "10px",
                      }}
                      alt={`Banner ${index + 1}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* Menu Items Section */}
          <div className="swiper featured-swiper mt-3">
            <div className="swiper-wrapper">
              {menuLists.map((menu) => (
                <div key={menu.menu_id} className="swiper-slide">
                  <Link
                    to={`/ProductDetails/${menu.menu_id}`}
                    state={{ menu_cat_id: menu.menu_cat_id }}
                  >
                    <div className="cart-list rounded-4 style-2-custom">
                      <div className="dz-media media-100">
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
                      <div className="dz-content d-block">
                        <span className="customFontSize ms-0 text-wrap mb-0">
                          {menu.name}
                        </span>
                        <ul className="dz-meta mt-2">
                          <p className="mb-2 customFontSize fw-medium">
                            <span className="ms-0 me-2 text-info">
                              ₹{menu.price}
                            </span>
                            <span className="gray-text customFontSize text-decoration-line-through">
                              ₹{menu.oldPrice || menu.price}
                            </span>
                          </p>
                        </ul>
                        <div className="row">
                          <div className="col-12">
                            <span className="customFontSize offer-color">
                              {menu.offer || "No "}% Off
                            </span>
                            <span className="customFontSize fw-semibold gray-text ps-4">
                              <i className="ri-star-half-line pe-2 ratingStar"></i>
                              {menu.rating}
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
        </>
      )}
    </div>
  );
};

export default OfferBanner;