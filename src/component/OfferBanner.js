


import React, { useState, useEffect } from "react";
import Swiper from "swiper/bundle";
import "swiper/swiper-bundle.css"; // Correctly import Swiper CSS
import images from "../assets/MenuDefault.png";
import { Link } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import OrderGif from "../screens/OrderGif";
import LoaderGif from "../screens/LoaderGIF";
import HotelNameAndTable from "../components/HotelNameAndTable";
import styled, { keyframes } from 'styled-components';


const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 123, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
  }
`;

const AnimatedCard = styled.div`
  animation: ${pulse} 2s infinite;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const OfferBanner = ({latestOngoingOrder: initialLatestOngoingOrder}) => {
  const [latestOngoingOrder, setLatestOngoingOrder] = useState(initialLatestOngoingOrder);
  const [banners, setBanners] = useState([]);
  const [menuLists, setMenuLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { restaurantId } = useRestaurantId();
  const { restaurantName } = useRestaurantId();
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || {}
  );
  const customerId = userData.customer_id;

  useEffect(() => {
    if (customerId && restaurantId) {
      fetchLatestOngoingOrder();
    }
  }, [customerId, restaurantId]);

  

  const fetchLatestOngoingOrder = async () => {
    try {
      const response = await fetch("https://menumitra.com/user_api/get_order_list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          order_status: "ongoing",
          customer_id: customerId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1 && data.lists && Object.keys(data.lists).length > 0) {
          // Get the latest date
          const latestDate = Object.keys(data.lists).sort().pop();
          // Get the latest order from the latest date
          const latestOrder = data.lists[latestDate][0];
          setLatestOngoingOrder(latestOrder);
        } else {
          setLatestOngoingOrder(null);
        }
      } else {
        console.error("Network response was not ok.");
        setLatestOngoingOrder(null);
      }
    } catch (error) {
      console.error("Error fetching latest ongoing order:", error);
      setLatestOngoingOrder(null);
    }
  };


  

  const renderSpiceIcons = (spicyIndex) => {
    return Array.from({ length: 5 }).map((_, index) =>
      index < spicyIndex ? (
        <i className="ri-fire-fill font_size_14 text-danger" key={index}></i>
      ) : (
        <i className="ri-fire-line font_size_14 gray-text" key={index}></i>
      )
    );
  };

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
        
        localStorage.removeItem("menuItems");
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
          const formattedMenuLists = data.data.offer_menu_list.map((menu) => ({
            ...menu,
            name: toTitleCase(menu.menu_name),
            menu_cat_name: toTitleCase(menu.category_name),
          }));

          if (isMounted) {
            setMenuLists(formattedMenuLists);
          }

          // Save updated menu list to localStorage
          saveLocalMenuItems(formattedMenuLists);
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

      // Add a 2-second timeout before calling fetchData
  const timeoutId = setTimeout(() => {
    fetchData();
  }, 1000);

  return () => {
    isMounted = false;
    clearTimeout(timeoutId); // Clear the timeout if the component unmounts
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
            {/* <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div> */}
            <LoaderGif />
          </div>
        </div>
      ) : (
        <>
          <div className="swiper featured-swiper mt-0">
            <div className="m-0">
              <HotelNameAndTable
                restaurantName={restaurantName}
                tableNumber={userData?.tableNumber || '1'}
              />
            </div>
            <div className="swiper-wrapper">
              {menuLists.map((menu) => (
                <div key={menu.menu_id} className="swiper-slide">
                  <Link
                    to={`/ProductDetails/${menu.menu_id}`}
                    state={{ menu_cat_id: menu.menu_cat_id }}
                  >
                    <div className="cart-list  style-2-custom">
                      <div className="dz-media media-100 rounded-start-3 rounded-end-0">
                        <img
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "fill",
                            aspectRatio: "1/1",
                          }}
                          src={menu.image || images} // Use default image if menu.image is null
                          alt={menu.name}
                          onError={(e) => {
                            e.target.src = images; // Set local image source on error
                          }}
                        />
                      </div>
                      <div className="dz-content d-block">
      <span className="font_size_14 fw-medium text-wrap">
        {menu.name}
      </span>
      <div className="d-flex justify-content-between align-items-center mt-2">
        <div>
          <span className="me-2 text-info font_size_14 fw-semibold">
            ₹{menu.price}
          </span>
          <span className="gray-text text-decoration-line-through font_size_12 fw-normal">
            ₹{menu.oldPrice || menu.price}
          </span>
        </div>
        <div className="offer-code mx-0">
          {renderSpiceIcons(menu.spicy_index)}
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-8 pe-0">
          <span className="font_size_12 text-success">
            {menu.offer || "No "}% Off
          </span>
        </div>
        <div className="col-4 ps-0">
          <span className="font_size_12 fw-normal gray-text">
            <i className="ri-star-half-line font_size_14  ratingStar"></i>
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
          {latestOngoingOrder && (
    <div className="container">
      <h5 className="text-center gray-text mb-3">Latest Ongoing Order</h5>
      <Link to={`/TrackOrder/${latestOngoingOrder.order_number}`} className="text-decoration-none">
        <AnimatedCard className="custom-card my-2 rounded-3 shadow-sm">
          <div className="card-body py-2">
            <div className="row align-items-center">
              <div className="col-4">
                <span className="fw-semibold fs-6">
                  <i className="ri-hashtag pe-2"></i>
                  {latestOngoingOrder.order_number}
                </span>
              </div>
              <div className="col-8 text-end">
                <span className="gray-text font_size_12">
                  {latestOngoingOrder.date_time}
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col-8 text-start">
                <div className="restaurant">
                  <i className="ri-store-2-line pe-2"></i>
                  <span className="fw-medium font_size_14">
                    {latestOngoingOrder.restaurant_name.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="col-4 text-end">
                <i className="ri-user-location-line ps-2 pe-1 font_size_12 gray-text"></i>
                <span className="font_size_12 gray-text">
                  {latestOngoingOrder.table_number}
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="menu-info">
                  <i className="ri-bowl-line pe-2 gray-text"></i>
                  <span className="gray-text font_size_14">
                    {latestOngoingOrder.menu_count === 0
                      ? "No orders"
                      : `${latestOngoingOrder.menu_count} Menu`}
                  </span>
                </div>
              </div>
              <div className="col-6 text-end">
                <span className="text-info font_size_14 fw-semibold">
                  ₹{latestOngoingOrder.grand_total}
                </span>
                <span className="text-decoration-line-through ms-2 gray-text font_size_12 fw-normal">
                  ₹{(parseFloat(latestOngoingOrder.grand_total) * 1.1).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </AnimatedCard>
      </Link>
    </div>
  )}
        </>
      )}
    </div>
  );
};

export default OfferBanner;
