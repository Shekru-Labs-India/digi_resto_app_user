


import React, { useState, useEffect, } from "react";
import Swiper from "swiper/bundle";
import "swiper/swiper-bundle.css"; // Correctly import Swiper CSS
import images from "../assets/MenuDefault.png";
import { Link ,useNavigate} from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import OrderGif from "../screens/OrderGif";
import LoaderGif from "../screens/LoaderGIF";
import HotelNameAndTable from "../components/HotelNameAndTable";
import styled, { keyframes } from "styled-components";
import { useCart } from "../context/CartContext"; // Add this import
import { Toast } from "primereact/toast"; // Add this import
import { useRef } from "react"; // Add this import

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
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart(); // Add this line
  const toast = useRef(null); // Add this line
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

  const fetchData = async () => {
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

      if (data.st === 1 ) {
        // Fetching banners
        // const bannerUrls = data.data.banner_list
        //   .filter((item) => item.image)
        //   .map((item) => item.image);
        // setBanners(bannerUrls);
      } else {
        console.error("Invalid data format:", data);
      }

      if (data.st === 1 && data.data.offer_menu_list) {
        const formattedMenuLists = data.data.offer_menu_list.map((menu) => ({
          ...menu,
          name: toTitleCase(menu.menu_name),
          menu_cat_name: toTitleCase(menu.category_name),
          oldPrice: menu.offer ? menu.price : null,
          price: menu.offer ? Math.floor(menu.price * (1 - menu.offer / 100)) : menu.price
        }));

        // Merge local menu items and API data
        const localMenuItems = getLocalMenuItems();
        const mergedMenuItems = [...localMenuItems, ...formattedMenuLists];

        setMenuLists(mergedMenuItems);

        // Save updated menu list to localStorage
        saveLocalMenuItems(mergedMenuItems);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Add a 1-second timeout before calling fetchData
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        fetchData();
      }
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

  const handleLikeClick = async (menuId) => {
    if (!customerId || !restaurantId) {
      console.error("Missing required data");
      navigate("/Signinscreen");
      return;
    }

    const menuItem = menuLists.find((item) => item.menu_id === menuId);
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

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1) {
          const updatedMenuLists = menuLists.map((item) =>
            item.menu_id === menuId
              ? { ...item, is_favourite: !isFavorite }
              : item
          );
          setMenuLists(updatedMenuLists);
        }
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };
  const handleAddToCartClick = async (menu) => {
    if (!customerId || !restaurantId) {
      console.error("Missing required data");
      navigate("/Signinscreen");
      return;
    }
    if (isMenuItemInCart(menu.menu_id)) {
      toast.current.show({
        severity: "error",
        summary: "Item Already in Cart",
        detail: menu.name,
        life: 3000,
      });
      return;
    }

    try {
      await addToCart({
        menu_id: menu.menu_id,
        name: menu.name,
        price: menu.price,
        quantity: 1,
        image: menu.image,
      });
      toast.current.show({
        severity: "success",
        summary: "Added to Cart",
        detail: menu.name,
        life: 3000,
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

 const isMenuItemInCart = (menuId) => {
   return cartItems.some((item) => item.menu_id === menuId);
 };

  return (
    <div className="dz-box style-3">
      <Toast ref={toast} />
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
                        <div
                          className="border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center"
                          style={{
                            position: "absolute",
                            bottom: "3px",
                            right: "3px",
                            height: "20px",
                            width: "20px",
                          }}
                        >
                          <i
                            className={`${
                              menu.is_favourite
                                ? "ri-hearts-fill text-danger"
                                : "ri-heart-2-line"
                            } fs-6`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleLikeClick(menu.menu_id);
                            }}
                          ></i>
                        </div>
                        {menu.offer !== 0 && (
                          <div
                            className="gradient_bg d-flex justify-content-center align-items-center"
                            style={{
                              position: "absolute",
                              top: "-1px",
                              left: "0px",
                              height: "17px",
                              width: "70px",
                              borderRadius: "0px 0px 7px 0px",
                            }}
                          >
                            <span className="text-white">
                              <i className="ri-discount-percent-line me-1 font_size_14"></i>
                              <span className="font_size_10">
                                {menu.offer}% Off
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="dz-content d-block">
                        <div className="category-text">
                          <div className="row mt-1">
                            <div className="col-8 text-success font_size_10">
                              <i className="ri-restaurant-line pe-1"></i>
                              {menu.menu_cat_name}
                            </div>
                            <div className="col-4 ps-0 text-end">
                              <span className="font_size_12 fw-normal gray-text me-2">
                                <i className="ri-star-half-line font_size_14  ratingStar me-1"></i>
                                {menu.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="font_size_14 fw-medium text-wrap">
                          {menu.name}
                        </span>
                        <div className="mt-2">
                          <div className="row">
                            <div className="col-6">
                              <div className="">
                                {renderSpiceIcons(menu.spicy_index)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row ">
                          <div className="col-6 pe-0 mt-1 mb-1">
                            <span className="me-2 text-info font_size_14 fw-semibold">
                              ₹{menu.price}
                            </span>
                            {menu.oldPrice && (
                              <span className="gray-text text-decoration-line-through font_size_12 fw-normal">
                                ₹{menu.oldPrice}
                              </span>
                            )}
                          </div>
                          <div className="d-flex justify-content-end col-6">
                            {userData ? (
                              <div
                                className="border border-1 rounded-circle bg-white opacity-75 me-1"
                                style={{
                                  border: "1px solid gray",
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "25px",
                                  height: "25px",
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleAddToCartClick(menu);
                                }}
                              >
                                <i
                                  className={`ri-shopping-cart-${
                                    isMenuItemInCart(menu.menu_id)
                                      ? "fill"
                                      : "line"
                                  } fs-6 `}
                                ></i>
                              </div>
                            ) : (
                              <div
                                style={{
                                  border: "1px solid gray",
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "25px",
                                  height: "25px",
                                }}
                              >
                                <i className="ri-shopping-cart-2-line fs-6"></i>
                              </div>
                            )}
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
    <div className="container px-3">
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