import React, { useState, useEffect } from "react";
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
import { usePopup } from '../context/PopupContext';

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

const OfferBanner = () => {
  const [banners, setBanners] = useState([]);
  const [menuLists, setMenuLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { restaurantId } = useRestaurantId();
  const { restaurantName } = useRestaurantId();
  const [userData, setUserData] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [customerType, setCustomerType] = useState(null);
  const navigate = useNavigate();
  const { cartItems, addToCart, isMenuItemInCart } = useCart(); // Add this line
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [portionSize, setPortionSize] = useState('full');
  const [halfPrice, setHalfPrice] = useState(null);
  const [fullPrice, setFullPrice] = useState(null);
  const [isPriceFetching, setIsPriceFetching] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const { showLoginPopup } = usePopup();

  useEffect(() => {
    updateCartRestaurantId();
  }, []);

  const [cartRestaurantId, setCartRestaurantId] = useState(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    return cartItems.length > 0 ? cartItems[0].restaurant_id : null;
  });

  const updateCartRestaurantId = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    if (cartItems.length > 0) {
      setCartRestaurantId(cartItems[0].restaurant_id);
    } else {
      setCartRestaurantId(null);
    }
  };

  const isCartFromDifferentRestaurant = (itemRestaurantId) => {
    return cartRestaurantId && cartRestaurantId !== itemRestaurantId;
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
      if (!restaurantId) {
        console.error("Restaurant ID not found");
        return;
      }

      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem("userData"));
      
      console.log("Fetching data...");
      const url = "https://men4u.xyz/user_api/get_banner_and_offer_menu_list";
      const requestBody = {
        restaurant_id: restaurantId,
      };

      // Add customer_id and customer_type if user is logged in
      if (userData?.customer_id) {
        requestBody.customer_id = userData.customer_id;
        requestBody.customer_type = userData.customer_type;
      }

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody)
      };

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

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

  const handleUnauthorizedFavorite = () => {
   
    showLoginPopup();
  };

  const handleLikeClick = async (menuId) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData?.customer_id || userData.customer_type === 'guest') {
    handleUnauthorizedFavorite();
    return;
  }

    const menuItem = menuLists.find((item) => item.menu_id === menuId);
    const isFavorite = menuItem.is_favourite;

    try {
      const response = await fetch(
        `https://men4u.xyz/user_api/${isFavorite ? 'remove' : 'save'}_favourite_menu`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            menu_id: menuId,
            customer_id: userData.customer_id,
            customer_type: userData.customer_type
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.st === 1) {
        setMenuLists((prevMenuLists) =>
          prevMenuLists.map((item) =>
            item.menu_id === menuId ? { ...item, is_favourite: !isFavorite } : item
          )
        );

        window.dispatchEvent(
          new CustomEvent("favoriteUpdated", {
            detail: { menuId, isFavorite: !isFavorite },
          })
        );

        window.showToast("success", isFavorite ? "Removed from favorites" : "Added to favorites");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      window.showToast("error", "Failed to update favorite status. Please try again.");
    }
  };

  useEffect(() => {
    const handleFavoriteUpdate = (event) => {
      const { menuId, isFavorite } = event.detail;
      setMenuLists((prevMenuLists) =>
        prevMenuLists.map((item) =>
          item.menu_id === menuId ? { ...item, is_favourite: isFavorite } : item
        )
      );
    };
  
    window.addEventListener("favoriteUpdated", handleFavoriteUpdate);
  
    return () => {
      window.removeEventListener("favoriteUpdated", handleFavoriteUpdate);
    };
  }, []);

  const handleModalClick = (e) => {
    if (e.target.classList.contains('modal')) {
      setShowModal(false);
    }
  };

  const fetchHalfFullPrices = async (menuId) => {
    setIsPriceFetching(true);
    try {
      const response = await fetch("https://men4u.xyz/user_api/get_full_half_price_of_menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          menu_id: menuId
        }),
      });

      const data = await response.json();
      if (response.ok && data.st === 1) {
        setHalfPrice(data.menu_detail.half_price);
        setFullPrice(data.menu_detail.full_price);
      } else {
        console.error("API Error:", data.msg);
        window.showToast("error", data.msg || "Failed to fetch price information");
      }
    } catch (error) {
      console.error("Error fetching half/full prices:", error);
      window.showToast("error", "Failed to fetch price information");
    } finally {
      setIsPriceFetching(false);
    }
  };

  const handleAddToCartClick = async (menu) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id || !restaurantId) {
      console.error("Missing required data");
      navigate("/user_app/Signinscreen");
      return;
    }

    if (isCartFromDifferentRestaurant(restaurantId)) {
      window.showToast("error", "This item is from a different restaurant. Clear your cart first.");
      return;
    }

    if (isMenuItemInCart(menu.menu_id)) {
      window.showToast("info", "This item is already in your cart.");
      return;
    }

    setSelectedMenu(menu);
    fetchHalfFullPrices(menu.menu_id);
    setShowModal(true);
  };

  const handleConfirmAddToCart = async () => {
    if (!selectedMenu) return;
  
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id) {
      showLoginPopup();
      return;
    }
  
    const selectedPrice = portionSize === 'half' ? halfPrice : fullPrice;
    
    if (!selectedPrice) {
      window.showToast("error", "Price information is not available.");
      return;
    }
  
    try {
      await addToCart({
        ...selectedMenu,
        quantity: 1,
        notes,
        half_or_full: portionSize,
        price: selectedPrice,
        restaurant_id: restaurantId
      }, restaurantId);
  
      window.showToast("success", selectedMenu.name);
  
      setShowModal(false);
      setNotes('');
      setPortionSize('full');
      setSelectedMenu(null);
  
      // Update cart items
      const updatedCartItems = await fetchCartItems();
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: updatedCartItems }));
  
    } catch (error) {
      console.error("Error adding item to cart:", error);
      window.showToast("error", "Failed to add item to cart. Please try again.");
    }
  };

  

  const fetchCartItems = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id) return [];
  
    try {
      const response = await fetch(
        "https://men4u.xyz/user_api/get_cart_detail_add_to_cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: localStorage.getItem("cartId"),
            customer_id: userData.customer_id,
            customer_type: userData.customer_type,
            restaurant_id: restaurantId,
          }),
        }
      );
  
      const data = await response.json();
      return response.ok && data.st === 1 && data.order_items ? data.order_items : [];
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return [];
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setUserData(userData);
      setCustomerId(userData.customer_id);
      setCustomerType(userData.customer_type);
    }
  }, []);

  const handleCartIconClick = (e, menu) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      showLoginPopup();
    } else {
      handleAddToCartClick(menu);
    }
  };

  return (
    <div className="dz-box style-3">
      {loading ? (
        <div id="preloader">
          <div className="loader">
            <LoaderGif />
          </div>
        </div>
      ) : (
        <>
          <div className="swiper featured-swiper mt-0">
            <div className="m-0">
              <HotelNameAndTable
                restaurantName={restaurantName}
                tableNumber={userData?.tableNumber || "1"}
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
                          className={`border bg-white opacity-75 d-flex justify-content-center align-items-center ${
                            menu.menu_veg_nonveg.toLowerCase() === "veg"
                              ? "border-success"
                              : "border-danger"
                          }`}
                          style={{
                            position: "absolute",
                            bottom: "3px",
                            left: "3px",
                            height: "20px",
                            width: "20px",
                            borderWidth: "2px",
                            borderRadius: "3px",
                          }}
                        >
                          <i
                            className={`${
                              menu.menu_veg_nonveg.toLowerCase() === "veg"
                                ? "ri-checkbox-blank-circle-fill text-success"
                                : "ri-checkbox-blank-circle-fill text-danger"
                            } font_size_12`}
                          ></i>
                        </div>
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
                                ? "ri-heart-3-fill text-danger"
                                : "ri-heart-3-line"
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

                              <span className="font_size_10 text-white">
                              <i className="ri-percent-line me-1 font_size_14"></i>
                                {menu.offer}% Off
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
                              <span className="font_size_10 fw-normal gray-text me-2">
                                <i className="ri-star-half-line font_size_10  ratingStar me-1"></i>
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
                              <Link
                                to="#"
                                onClick={(e) => handleCartIconClick(e, menu)}
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
                              >
                                <i className={`ri-shopping-cart-${isMenuItemInCart(menu.menu_id) ? "fill" : "line"} fs-6`}></i>
                              </Link>
                            ) : (
                              <Link
                                to="#"
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
                                  showLoginPopup();
                                }}
                              >
                                <i className="ri-shopping-cart-2-line fs-6"></i>
                              </Link>
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
        </>
      )}

      {showModal && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          style={{ display: "block" }}
          onClick={handleModalClick}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content"
              style={{
                width: "350px",
                margin: "auto",
              }}
            >
              <div className="modal-header d-flex justify-content-center">
                <div className="modal-title font_size_16 fw-medium">
                  Add to Cart
                </div>
                <button
                  type="button"
                  className="btn-close position-absolute top-0 end-0 m-2 bg-danger text-white"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
              <div className="modal-body py-3">
                <div className="mb-3 mt-0">
                  <label
                    htmlFor="notes"
                    className="form-label d-flex justify-content-center fs-5 fw-bold"
                  >
                    Special Instructions
                  </label>
                  <textarea
                    className="form-control fs-6"
                    id="notes"
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any special instructions here..."
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label d-flex justify-content-center">
                    Select Portion Size
                  </label>
                  <div className="d-flex justify-content-center">
                    {isPriceFetching ? (
                      <p>Loading prices...</p>
                    ) : (
                      <>
                        <button
                          type="button"
                          className={`btn rounded-pill me-2 font_size_14  ${
                            portionSize === "half"
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={() => setPortionSize("half")}
                          disabled={!halfPrice}
                        >
                          Half {halfPrice ? `(₹${halfPrice})` : "(N/A)"}
                        </button>
                        <button
                          type="button"
                          className={`btn rounded-pill font_size_14 ${
                            portionSize === "full"
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={() => setPortionSize("full")}
                          disabled={!fullPrice}
                        >
                          Full {fullPrice ? `(₹${fullPrice})` : "(N/A)"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer justify-content-center">
                <button
                  type="button"
                  className="btn btn-outline-primary  rounded-pill"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary rounded-pill"
                  onClick={handleConfirmAddToCart}
                  disabled={isPriceFetching || (!halfPrice && !fullPrice)}
                >
                  <i class="ri-shopping-cart-line pe-1 text-white"></i>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default OfferBanner;
