import React, { useState, useEffect, useRef } from "react";
import Bottom from "../component/bottom";
import Header from "../components/Header";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import config from "../component/config";
import HotelNameAndTable from "../components/HotelNameAndTable";
import img from "../assets/MenuDefault.png";
import RestaurantSocials from "../components/RestaurantSocials";
import { useRestaurantId } from "../context/RestaurantIdContext";
import { usePopup } from "../context/PopupContext";
import { useNavigate, Link } from "react-router-dom";

function RestaurantDetails() {
  const [restaurantId, setRestaurantId] = useState(localStorage.getItem("restaurantId") || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [restaurantDetails, setRestaurantDetails] = useState({
    name: "",
    mobile: "",
    address: "",
    upi_id: null,
    veg_nonveg: "",
    image: null,
  });
  const [countDetails, setCountDetails] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [isProcessingUPI, setIsProcessingUPI] = useState(false);
  const [isProcessingPhonePe, setIsProcessingPhonePe] = useState(false);
  const [isProcessingGPay, setIsProcessingGPay] = useState(false);
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);
  const timeoutRef = useRef({});
  const { showLoginPopup } = usePopup();
  const navigate = useNavigate();
 // const [restaurantId, setRestaurantId] = useState(localStorage.getItem("restaurantId") || "");

  
 useEffect(() => {
  const fetchRestaurantDetails = async () => {
    if (!restaurantId) return;

    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/get_restaurant_details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            outlet_id: localStorage.getItem("outlet_id"),
          }),
        }
      );
      const data = await response.json();

      if (data.st === 1) {
        setRestaurantDetails(data.outlet_details);
        setCountDetails(data.count);
        setCategoryList(data.categorys);
        setMenuList(data.menu_list);
        localStorage.setItem("restoUPI", data.restaurant_details.upi_id);
      }
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
    }
  };

  fetchRestaurantDetails();
}, [restaurantId]); // ✅ Track restaurantId correctly

// 🔹 Sync restaurantId when localStorage changes
useEffect(() => {
  const handleStorageChange = () => {
    const updatedRestaurantId = localStorage.getItem("restaurantId");
    if (updatedRestaurantId !== restaurantId) {
      setRestaurantId(updatedRestaurantId);
    }
  };

  window.addEventListener("storage", handleStorageChange);
  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, [restaurantId]);

// ✅ Update filtered menu when menuList changes
useEffect(() => {
  setFilteredMenus(menuList);
}, [menuList]);

  const totalMenuCount = menuList.length || 25;

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);

    if (categoryId === "special") {
      setFilteredMenus(menuList.filter((menu) => menu.is_special));
    } else if (categoryId === null) {
      setFilteredMenus(menuList);
    } else {
      setFilteredMenus(
        menuList.filter((menu) => menu.menu_cat_id === categoryId)
      );
    }
  };

  const handleGenericUPI = () => {
    if (isProcessingUPI) return;
    try {
      setIsProcessingUPI(true);
      if (timeoutRef.current.upi) clearTimeout(timeoutRef.current.upi);

      const upiUrl = `upi://pay?pa=${
        restaurantDetails.upi_id
      }&pn=${encodeURIComponent(
        restaurantDetails.name
      )}&mc=1234&tid=TEST123&tr=TEST123&tn=Test payment&am=1&cu=INR`;
      window.location.href = upiUrl;

      timeoutRef.current.upi = setTimeout(() => {
        if (!document.hidden) {
          window.showToast?.(
            "error",
            "No UPI app found. Please install a UPI payment app."
          );
        }
        setIsProcessingUPI(false);
      }, 3000);
    } catch (error) {
      console.clear();
      setIsProcessingUPI(false);
    }
  };

  const handlePhonePe = () => {
    if (isProcessingPhonePe) return;
    try {
      setIsProcessingPhonePe(true);
      if (timeoutRef.current.phonepe) clearTimeout(timeoutRef.current.phonepe);

      const phonePeUrl = `phonepe://pay?pa=${
        restaurantDetails.upi_id
      }&pn=${encodeURIComponent(
        restaurantDetails.name
      )}&mc=1234&tid=TEST123&tr=TEST123&tn=Test payment&am=1&cu=INR`;
      window.location.href = phonePeUrl;

      timeoutRef.current.phonepe = setTimeout(() => {
        if (!document.hidden) {
          window.showToast?.(
            "error",
            "PhonePe app not found. Please install PhonePe."
          );
        }
        setIsProcessingPhonePe(false);
      }, 3000);
    } catch (error) {
      console.clear();
      setIsProcessingPhonePe(false);
    }
  };

  const handleGooglePay = () => {
    if (isProcessingGPay) return;
    try {
      setIsProcessingGPay(true);
      if (timeoutRef.current.gpay) clearTimeout(timeoutRef.current.gpay);

      const googlePayUrl = `gpay://upi/pay?pa=${
        restaurantDetails.upi_id
      }&pn=${encodeURIComponent(
        restaurantDetails.name
      )}&mc=1234&tid=TEST123&tr=TEST123&tn=Test payment&am=1&cu=INR`;
      window.location.href = googlePayUrl;

      timeoutRef.current.gpay = setTimeout(() => {
        if (!document.hidden) {
          window.showToast?.(
            "error",
            "Google Pay app not found. Please install Google Pay."
          );
        }
        setIsProcessingGPay(false);
      }, 3000);
    } catch (error) {
      console.clear();
      setIsProcessingGPay(false);
    }
  };

  useEffect(() => {
    return () => {
      Object.values(timeoutRef.current).forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
      setIsProcessingUPI(false);
      setIsProcessingPhonePe(false);
      setIsProcessingGPay(false);
    };
  }, []);

  const getFoodTypeStyles = (foodType) => {
    // Convert foodType to lowercase for case-insensitive comparison
    const type = (foodType || "").toLowerCase();

    switch (type) {
      case "veg":
        return {
          icon: "fa-solid fa-circle text-success",
          border: "border-success",
          textColor: "text-success",
          categoryIcon: "fa-solid fa-utensils text-success me-1", // Added for category
        };
      case "nonveg":
        return {
          icon: "fa-solid fa-play fa-rotate-270 text-danger",
          border: "border-danger",
          textColor: "text-success", // Changed to green for category name
          categoryIcon: "fa-solid fa-utensils text-success me-1", // Added for category
        };
      case "egg":
        return {
          icon: "fa-solid fa-egg",
          border: "gray-text",
          textColor: "gray-text", // Changed to green for category name
          categoryIcon: "fa-solid fa-utensils text-success me-1", // Added for category
        };
      case "vegan":
        return {
          icon: "fa-solid fa-leaf text-success",
          border: "border-success",
          textColor: "text-success",
          categoryIcon: "fa-solid fa-utensils text-success me-1", // Added for category
        };
      default:
        return {
          icon: "fa-solid fa-circle text-success",
          border: "border-success",
          textColor: "text-success",
          categoryIcon: "fa-solid fa-utensils text-success me-1", // Added for category
        };
    }
  };

  const handleLikeClick = async (e, menuId) => {
    e.preventDefault();
    e.stopPropagation();

    // Check for user login and type
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.user_id || userData.role === "guest") {
      window.showToast("info", "Please login to use favourite functionality");
      showLoginPopup();
      return;
    }

    // Find current menu item and its favorite status
    const menuItem = menuList.find((item) => item.menu_id === menuId);
    const isFavorite = menuItem.is_favourite;

    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/${
          isFavorite ? "remove" : "save"
        }_favourite_menu`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            menu_id: menuId,
            user_id: userData.user_id,
            role: userData.role
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("user_id");
        localStorage.removeItem("userData");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("access_token");
        localStorage.removeItem("customerName");
        localStorage.removeItem("mobile");
        showLoginPopup();
        return;
      }

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1) {
          const updatedFavoriteStatus = !isFavorite;

          // Update menuList state
          const updatedMenuList = menuList.map((item) =>
            item.menu_id === menuId
              ? { ...item, is_favourite: updatedFavoriteStatus }
              : item
          );
          setMenuList(updatedMenuList);

          // Update filteredMenuList based on current category
          setFilteredMenus(
            updatedMenuList.filter(
              (item) =>
                item.menu_cat_id === selectedCategoryId ||
                selectedCategoryId === null
            )
          );

          // Dispatch event for other components
          window.dispatchEvent(
            new CustomEvent("favoriteUpdated", {
              detail: { menuId, isFavorite: updatedFavoriteStatus },
            })
          );

          // Show success toast
          window.showToast(
            "success",
            updatedFavoriteStatus
              ? "Item has been added to your favourites."
              : "Item has been removed from your favourites."
          );
        } else {
          console.clear();
          window.showToast("error", "Failed to update favourite status");
        }
      }
    } catch (error) {
      console.clear();
      window.showToast("error", "Failed to update favourite status");
    }
  };

  const handleMenuClick = (e, menuId) => {
    e.preventDefault();
    navigate(`/menu-details/${menuId}`);
  };

  return (
    <div>
     
      <Header title="Restaurant Details" />

      <div className="container pb-0">
        <div className="pt-5">
          <HotelNameAndTable
            restaurantName={restaurantDetails.name || ""}
            tableNumber={"1"}
          />
        </div>

        <div className="col-12">
          <div className="">
            <div>
              <div className="card rounded-4">
                <img
                  src={restaurantDetails.image || img}
                  className="card-img-top rounded-4"
                  alt={restaurantDetails.name || "Restaurant Image"}
                />
              </div>
              <div className="card p-3">
                <div className="my-1">
                  <i className="fa-solid fa-store font_size_14"></i>
                  {/* <span className="card-title ms-2 ">Jagdamb</span> */}
                  <span className="card-title ms-2 ">
                    {restaurantDetails.name}
                  </span>
                </div>
                <div className="my-1">
                  <i className="fa-solid fa-phone text-primary font_size_14"></i>
                  <span className="card-title ms-2">
                    {restaurantDetails.mobile}
                  </span>
                </div>
                <div className="my-1">
                  <i className="fa-solid fa-location-dot gray-text text-primary font_size_14"></i>
                  <span className="card-title ms-2">
                    {restaurantDetails.address}
                  </span>
                </div>
              </div>

              {/* {restaurantDetails.upi_id && (
                <div
                  className="card "
                  style={{
                    border: "2px dashed silver",
                  }}
                >
                  <div className="p-3 rounded-4 d-flex justify-content-between align-items-center">
                    <span className="font_size_16">
                      UPI : {restaurantDetails.upi_id}
                    </span>
                    <a class="btn btn-info rounded-pill btn-sm text-white">
                      <i class="ri-checkbox-circle-line py-0 me-2"></i>Pay
                    </a>
                    <a href="upi://pay?pa=sugatraj.2106@oksbi&pn=Tasty Diner&mc=1234&tid=ORDER123&tr=ORDER123&tn=Customer is paying Rs. 0.01 for order no. ORDER123&am=1&cu=INR">Pay Now</a>
                  </div>
                </div>
              )} */}

              {restaurantDetails.upi_id && (
                <div
                  className="card"
                  style={{
                    border: "2px dashed silver",
                  }}
                >
                  <div className="p-3 rounded-4 d-flex justify-content-center align-items-center">
                    <span className="font_size_16">
                      UPI : {restaurantDetails.upi_id}
                    </span>
                  </div>

                  <div className="px-3 pb-3">
                    <div className="row g-2">
                      <div className="col-6">
                        <button
                          className="btn w-100 btn-sm"
                          onClick={handlePhonePe}
                          disabled={isProcessingPhonePe}
                          style={{
                            backgroundColor: "#5f259f",
                            color: "white",
                            borderRadius: "8px",
                          }}
                        >
                          {isProcessingPhonePe ? "Processing..." : "PhonePe"}
                        </button>
                      </div>

                      <div className="col-6">
                        <button
                          className="btn w-100 btn-sm"
                          onClick={handleGooglePay}
                          disabled={isProcessingGPay}
                          style={{
                            backgroundColor: "#1a73e8",
                            color: "white",
                            borderRadius: "8px",
                          }}
                        >
                          {isProcessingGPay ? "Processing..." : "Google Pay"}
                        </button>
                      </div>

                      <div className="col-12">
                        <button
                          className="btn btn-primary w-100 btn-sm"
                          onClick={handleGenericUPI}
                          disabled={isProcessingUPI}
                          style={{
                            borderRadius: "8px",
                          }}
                        >
                          {isProcessingUPI ? "Processing..." : "Other UPI Apps"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card">
            <div className="card-header d-block">
              <div className="card-title fw-semibold">Analytics</div>
            </div>
            <div className="card-body">
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Total Menus
                  <span className="badge bg-primary rounded-pill">
                    {totalMenuCount}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Total Categories
                  <span className="badge bg-primary rounded-pill">
                    {categoryList.length}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Total Tables
                  <span className="badge bg-primary rounded-pill">
                    {countDetails?.total_tables}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Total Offer Menus
                  <span className="badge bg-primary rounded-pill">
                    {countDetails?.total_offer_menu}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Total Special Menus
                  <span className="badge bg-primary rounded-pill">
                    {countDetails?.total_special_menu}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="dz-category">
          <div className="title-bar">
            <div className="font_size_14 fw-medium">Categories</div>
          </div>

          {/* Category Buttons Slider */}
          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView="auto"
            className="category-slide mb-3"
            style={{ padding: "0 5px" }}
          >
            {/* Special button */}
            <SwiperSlide style={{ width: "auto" }}>
              <div
                className="category-btn font_size_14 rounded-5 py-1"
                onClick={() => handleCategorySelect("special")}
                style={{
                  backgroundColor:
                    selectedCategoryId === "special" ? "#0D775E" : "#ffffff",
                  color:
                    selectedCategoryId === "special" ? "#ffffff" : "#000000",
                  border: "1px solid #ddd",
                  cursor: "pointer",
                  padding: "8px 16px",
                  transition: "all 0.3s ease",
                }}
              >
                <i className="fa-regular fa-star me-2"></i>
                Special
                <span
                  style={{
                    color:
                      selectedCategoryId === "special" ? "#ffffff" : "#666",
                    fontSize: "0.8em",
                  }}
                >
                  ({menuList.filter((menu) => menu.is_special)?.length || 0})
                </span>
              </div>
            </SwiperSlide>

            {/* All button */}
            <SwiperSlide style={{ width: "auto" }}>
              <div
                className="category-btn font_size_14 rounded-5 py-1"
                onClick={() => handleCategorySelect(null)}
                style={{
                  backgroundColor:
                    selectedCategoryId === null ? "#0D775E" : "#ffffff",
                  color: selectedCategoryId === null ? "#ffffff" : "#000000",
                  border: "1px solid #ddd",
                  cursor: "pointer",
                  padding: "8px 16px",
                  transition: "all 0.3s ease",
                }}
              >
                All{" "}
                <span
                  style={{
                    color: selectedCategoryId === null ? "#ffffff" : "#666",
                    fontSize: "0.8em",
                  }}
                >
                  ({countDetails?.total_menu || 0})
                </span>
              </div>
            </SwiperSlide>

            {/* Regular category buttons */}
            {categoryList.map(
              (category) =>
                category.menu_count > 0 && (
                  <SwiperSlide
                    key={category.menu_cat_id}
                    style={{ width: "auto" }}
                  >
                    <div
                      className="category-btn font_size_14 rounded-5 py-1"
                      onClick={() => handleCategorySelect(category.menu_cat_id)}
                      style={{
                        backgroundColor:
                          selectedCategoryId === category.menu_cat_id
                            ? "#0D775E"
                            : "#ffffff",
                        color:
                          selectedCategoryId === category.menu_cat_id
                            ? "#ffffff"
                            : "#000000",
                        border: "1px solid #ddd",
                        cursor: "pointer",
                        padding: "8px 16px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {category.category_name}
                      <span
                        style={{
                          color:
                            selectedCategoryId === category.menu_cat_id
                              ? "#ffffff"
                              : "#666",
                          fontSize: "0.8em",
                        }}
                      >
                        ({category.menu_count})
                      </span>
                    </div>
                  </SwiperSlide>
                )
            )}
          </Swiper>

          {/* Image Categories Slider */}
          <div className="title-bar mt-4">
            <div className="font_size_14 fw-medium">Menus</div>
          </div>

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={10}
            slidesPerView={3.5}
            autoplay={{
              delay: 2500000,
              disableOnInteraction: false,
            }}
            loop={filteredMenus.length > 3}
            className="dz-category-swiper"
          >
            {filteredMenus.map((menu) => (
              <SwiperSlide key={menu.menu_id}>
                <div className="dz-category-items">
                  <Link
                    to={`/user_app/ProductDetails/${menu.menu_id}`}
                    state={{ menu_cat_id: menu.menu_cat_id }}
                    className="dz-media position-relative"
                  >
                    <img
                      className="object-fit-cover rounded-4"
                      src={menu.image || img}
                      alt={menu.menu_name}
                      style={{ height: 110, width: "100%" }}
                      onError={(e) => {
                        e.target.src = img;
                      }}
                    />

                    {/* Special Star Icon */}
                    {menu.is_special && (
                      <i
                        className="fa-solid fa-star border border-1 rounded-circle bg-white opacity-75 d-flex justify-content-center align-items-center text-info font_size_12"
                        style={{
                          position: "absolute",
                          top: 3,
                          right: 5,
                          height: 17,
                          width: 17,
                        }}
                      ></i>
                    )}

                    {/* Veg/Non-veg Indicator */}
                    <div
                      className={`border rounded-3 bg-white opacity-100 d-flex justify-content-center align-items-center ${
                        getFoodTypeStyles(menu.menu_food_type).border
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
                          getFoodTypeStyles(menu.menu_food_type).icon
                        } font_size_12 ${
                          getFoodTypeStyles(menu.menu_food_type).textColor
                        }`}
                      ></i>
                    </div>

                    {/* Favorite Heart Icon */}
                    {/* <div
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
                            ? "fa-solid fa-heart text-danger"
                            : "fa-regular fa-heart"
                        } fs-6`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLikeClick(e, menu.menu_id);
                        }}
                      ></i>
                    </div> */}

                    {/* Offer Badge */}
                    {menu.offer !== 0 && menu.offer !== null && (
                      <div className="gradient_bg d-flex justify-content-center align-items-center gradient_bg_offer">
                        <span className="font_size_10 text-white">
                          {menu.offer}% Off
                        </span>
                      </div>
                    )}
                  </Link>

                  <div className="font_size_14 fw-medium text-wrap text-center mt-2">
                    <Link
                      to={`/user_app/ProductDetails/${menu.menu_id}`}
                      state={{ menu_cat_id: menu.menu_cat_id }}
                    >
                      {menu.menu_name}
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="container p-b80">
        <RestaurantSocials />
      </div>
      <Bottom />
    </div>
  );
}

export default RestaurantDetails;
