import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import images from "../assets/MenuDefault.png";
import Swiper from "swiper/bundle";
import "swiper/swiper-bundle.css";
import LoaderGif from "../screens/LoaderGIF";
import debounce from "lodash/debounce";
import { useCart } from "../context/CartContext";

const NearbyArea = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { restaurantId } = useRestaurantId();
  const { cartItems, addToCart,isMenuItemInCart } = useCart();
  const [customerId, setCustomerId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [portionSize, setPortionSize] = useState('full');
  const [halfPrice, setHalfPrice] = useState(null);
  const [fullPrice, setFullPrice] = useState(null);
  const [isPriceFetching, setIsPriceFetching] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const hasFetchedData = useRef(false);

  // 1. Single useEffect for initialization and data fetching
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setCustomerId(userData.customer_id);
    }

   

    
    // Only fetch if we have a restaurantId
    if (restaurantId) {
      fetchMenuData();
    }
  }, [restaurantId]); // Only re-run if restaurantId changes

  const toTitleCase = (str) => {
    if (!str) return "";
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };


  useEffect(() => {
    const handleFavoriteUpdate = (event) => {
      const { menuId, isFavorite } = event.detail;
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item.menu_id === menuId ? { ...item, is_favourite: isFavorite } : item
        )
      );
    };
  
    const handleCartUpdate = (event) => {
      // Refresh cart status for all items
      setMenuItems((prevItems) => [...prevItems]); // Force re-render
    };
  
    window.addEventListener("favoriteStatusChanged", handleFavoriteUpdate);
    window.addEventListener("cartStatusChanged", handleCartUpdate);
  
    return () => {
      window.removeEventListener("favoriteStatusChanged", handleFavoriteUpdate);
      window.removeEventListener("cartStatusChanged", handleCartUpdate);
    };
  }, []);

  const fetchMenuData = useCallback(async () => {
    if (!restaurantId) return;
    if (hasFetchedData.current) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://menumitra.com/user_api/get_special_menu_list",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        hasFetchedData.current = true;
      } else {
        console.error("Invalid data format:", data);
        setMenuItems([]);
        window.showToast("error", "Failed to load menu items");
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
      setMenuItems([]);
      window.showToast("error", "Failed to load menu items");
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId, customerId]);

  // 3. Modify handleConfirmAddToCart to remove unnecessary API call
  const handleConfirmAddToCart = async () => {
    if (!selectedMenu) return;

    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id) {
      navigate("/Signinscreen");
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

      window.showToast("success", `${selectedMenu.name} added to cart`);

      setShowModal(false);
      setNotes('');
      setPortionSize('full');
      setSelectedMenu(null);
      
      window.dispatchEvent(new Event('cartUpdated'));

    } catch (error) {
      console.error("Error adding item to cart:", error);
      window.showToast("error", "Failed to add item to cart. Please try again.");
    }
  };

  // 5. Keep the focus handler but with a debounce
  // useEffect(() => {
  //   const handleFocus = debounce(() => {
  //     if (restaurantId) {
  //       fetchMenuData();
  //     }
  //   }, 1000);

  //   window.addEventListener("focus", handleFocus);

  //   return () => {
  //     window.removeEventListener("focus", handleFocus);
  //     handleFocus.cancel();
  //   };
  // }, [fetchMenuData]);

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


  const handleUnauthorizedFavorite = (navigate) => {
    window.showToast("info", "Please login to use favorites functionality");
    setTimeout(() => {
      navigate("/Signinscreen");
    }, 1500);
  };
  // Update handleLikeClick function
  const handleLikeClick = async (menuId) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id || userData.customer_type === 'guest') {
      handleUnauthorizedFavorite(navigate);
      return;
    }

    const menuItem = menuItems.find((item) => item.menu_id === menuId);
    const isFavorite = menuItem.is_favourite;

    try {
      const response = await fetch(
        `https://menumitra.com/user_api/${isFavorite ? 'remove' : 'save'}_favourite_menu`,
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
        setMenuItems((prevItems) =>
          prevItems.map((item) =>
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
      window.showToast("error", "Failed to update favorite status");
    }
  };

  // Add this useEffect hook to listen for favorite updates
  useEffect(() => {
    const handleFavoriteUpdate = (event) => {
      const { menuId, isFavorite } = event.detail;
      setMenuItems((prevMenuItems) =>
        prevMenuItems.map((item) =>
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
      const response = await fetch("https://menumitra.com/user_api/get_full_half_price_of_menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        window.showToast("error", "Failed to fetch price information");
      }
    } catch (error) {
      console.error("Error fetching half/full prices:", error);
      window.showToast("error", "Failed to fetch price information");
    } finally {
      setIsPriceFetching(false);
    }
  };

  // Update handleAddToCartClick function
  const handleAddToCartClick = async (menuItem) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.customer_id || !restaurantId) {
      navigate("/Signinscreen");
      return;
    }

    if (isMenuItemInCart(menuItem.menu_id)) {
      window.showToast("info", "This item is already in your cart.");
      return;
    }

    setSelectedMenu(menuItem);
    fetchHalfFullPrices(menuItem.menu_id);
    setShowModal(true);
  };

  return (
    <div className="dz-box style-2 nearby-area">
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
                      <div
                        className={`border bg-white opacity-75 d-flex justify-content-center align-items-center ${
                          menuItem.menu_veg_nonveg.toLowerCase() === "veg"
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
                            menuItem.menu_veg_nonveg.toLowerCase() === "veg"
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
                            menuItem.is_favourite
                              ? "ri-heart-3-fill text-danger"
                              : "ri-heart-3-line"
                          } fs-6`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleLikeClick(menuItem.menu_id);
                          }}
                        ></i>
                      </div>
                      {menuItem.offer !== 0 && (
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
                              {menuItem.offer}% Off
                            </span>
                          
                        </div>
                      )}
                    </div>
                    <div className="dz-content d-block">
                      <div className="category-text">
                        <div className="row mt-1">
                          <div className="col-8 text-success font_size_10">
                            <i className="ri-restaurant-line pe-1"></i>
                            {menuItem.category_name}
                          </div>
                          <div className="col-4 ps-0 text-end">
                            <span className="font_size_10 fw-normal gray-text me-2">
                              <i className="ri-star-half-line font_size_10  ratingStar me-1"></i>
                              {menuItem.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="font_size_14 fw-medium text-wrap">
                        {menuItem.name}
                      </span>
                      <div className="mt-2">
                        <div className="row">
                          <div className="col-6">
                            <div className="">
                              {renderSpiceIcons(menuItem.spicy_index)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row ">
                        <div className="col-6 pe-0 mt-1 mb-1">
                          <span className="me-2 text-info font_size_14 fw-semibold">
                            ₹{menuItem.price}
                          </span>
                          {menuItem.oldPrice && (
                            <span className="gray-text text-decoration-line-through font_size_12 fw-normal">
                              ₹{menuItem.oldPrice}
                            </span>
                          )}
                        </div>
                        <div className="d-flex justify-content-end col-6">
                          {customerId ? (
                            <Link
                              to="#"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAddToCartClick(menuItem);
                              }}
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
                              <i className={`ri-shopping-cart-${isMenuItemInCart(menuItem.menu_id) ? "fill" : "line"} fs-6`}></i>
                            </Link>
                          ) : (
                            <Link
                              to="/Signinscreen"
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
                                navigate("/Signinscreen");
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
      </div>

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
                    className="form-control fs-6 border border-primary rounded-3"
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

export default NearbyArea;
