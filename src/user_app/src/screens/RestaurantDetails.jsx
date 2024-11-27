import React, { useState, useEffect } from "react";
import Bottom from "../component/bottom";
import Sidebar from "../../../website/src/Components/Sidebar";
import Header from "../components/Header";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';
import config from "../component/config";
import HotelNameAndTable from "../components/HotelNameAndTable";
import img from "../assets/MenuDefault.png";

function RestaurantDetails() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [restaurantDetails, setRestaurantDetails] = useState({
    name: "",
    mobile: "",
    address: "",
    upi_id: null,
    veg_nonveg: "",
    image: null
  });
  const [countDetails, setCountDetails] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);

  

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {

        const restaurantId = localStorage.getItem("restaurantId");
        const response = await fetch(
          `${config.apiDomain}/user_api/get_restaurant_details`,
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
        const data = await response.json();
        console.log("API Response:", data);
        
        if (data.st === 1) {
          setRestaurantDetails(data.restaurant_details);
          setCountDetails(data.count);
          setCategoryList(data.categorys);
          setMenuList(data.menu_list);
        }
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      }
    };

    fetchRestaurantDetails();
  }, []);

  useEffect(() => {
    setFilteredMenus(menuList);
  }, [menuList]);

  const totalMenuCount = menuList.length || 25;

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    
    if (categoryId === "special") {
      setFilteredMenus(menuList.filter(menu => menu.is_special));
    } else if (categoryId === null) {
      setFilteredMenus(menuList);
    } else {
      setFilteredMenus(menuList.filter(menu => menu.menu_cat_id === categoryId));
    }
  };

  const openPhonePeLink = () => {
    const phonePeUrl = `phonepe://pay?pa=${restaurantDetails.upi_id}&pn=${restaurantDetails.name}&mc=1234&tid=TEST123&tr=TEST123&tn=Test payment&am=1&cu=INR`;
    window.location.href = phonePeUrl;
  };

  const openGooglePayLink = () => {
    const googlePayUrl = `tez://upi/pay?pa=${restaurantDetails.upi_id}&pn=${restaurantDetails.name}&mc=1234&tid=TEST123&tr=TEST123&tn=Test payment&am=1&cu=INR`;
    window.location.href = googlePayUrl;
  };

  return (
    <div>
      <Sidebar />
      <Header title="Restaurant Details" />

      <div className="container">
        <div className="pt-5">
          <HotelNameAndTable
            restaurantName={restaurantDetails.name || ""}
            tableNumber={"1"}
          />
        </div>

        <div class="col-12">
          <div class="">
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
                  <i className="fa-solid fa-store font_size_14 fw-medium"></i>
                  {/* <span className="card-title ms-2 ">Jagdamb</span> */}
                  <span className="card-title ms-2 ">
                    {restaurantDetails.name}
                  </span>
                </div>
                <div className="my-1">
                  <i className="fa-solid fa-phone text-primary font_size_14 fw-medium"></i>
                  <span className="card-title ms-2">
                    {restaurantDetails.mobile}
                  </span>
                </div>
                <div className="my-1">
                  <i className="fa-solid fa-location-dot gray-text text-primary font_size_14 fw-medium"></i>
                  <span className="card-title ms-2">
                    {restaurantDetails.address}
                  </span>
                </div>
              </div>

              {restaurantDetails.upi_id && (
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
                    {/* <a href="upi://pay?pa=sugatraj.2106@oksbi&pn=Tasty Diner&mc=1234&tid=ORDER123&tr=ORDER123&tn=Customer is paying Rs. 0.01 for order no. ORDER123&am=1&cu=INR">Pay Now</a> */}
                  </div>
                </div>
              )}

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
                <div className="d-flex justify-content-center align-items-center gap-3 pb-3">
                  <button 
                    className="btn rounded-pill btn-sm text-white"
                    onClick={openPhonePeLink}
                    style={{
                      backgroundColor: "#5f259f", // PhonePe purple
                      borderColor: "#5f259f",
                      minWidth: "120px"
                    }}
                  >
                    <i className="ri-checkbox-circle-line py-0 me-2"></i>PhonePe
                  </button>
                  <button 
                    className="btn rounded-pill btn-sm text-white"
                    onClick={openGooglePayLink}
                    style={{
                      background: "linear-gradient(45deg, #4285f4, #34a853, #fbbc05, #ea4335)", // Google colors
                      borderColor: "#4285f4",
                      minWidth: "120px"
                    }}
                  >
                    <i className="ri-google-line py-0 me-2"></i>Google Pay
                  </button>
                </div>
                <div className="d-flex justify-content-center align-items-center pb-3">
                  <a 
                    href={`upi://pay?pa=${restaurantDetails.upi_id}&pn=${restaurantDetails.name}&mc=1234&tid=TEST123&tr=TEST123&tn=Test payment&am=1&cu=INR`}
                    className="btn btn-primary rounded-pill btn-sm text-white"
                  >
                    <i className="ri-checkbox-circle-line pe-2"></i>Pay Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card">
            <div class="card-header d-block">
              <h5 class="card-title">Analytics</h5>
            </div>
            <div class="card-body">
              <ul class="list-group">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Total Menus
                  <span class="badge bg-primary rounded-pill">
                    {totalMenuCount}
                  </span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Total Categories
                  <span class="badge bg-primary rounded-pill">
                    {categoryList.length}
                  </span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Total Tables
                  <span class="badge bg-primary rounded-pill">
                    {countDetails?.total_tables}
                  </span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Total Offer Menus
                  <span class="badge bg-primary rounded-pill">
                    {countDetails?.total_offer_menu}
                  </span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Total Special Menus
                  <span class="badge bg-primary rounded-pill">
                    {countDetails?.total_special_menu}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="dz-category">
          <div className="title-bar">
            <h5 className="font_size_14 fw-medium">Categories</h5>
          </div>

          {/* Category Buttons Slider */}
          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView="auto"
            className="category-slide mb-3"
          >
            {/* Special button */}
            <SwiperSlide style={{ width: "auto" }}>
              <div
                className={`category-btn font_size_14 rounded-5 px-3 py-2 ${
                  selectedCategoryId === "special" ? "active" : ""
                }`}
                onClick={() => handleCategorySelect("special")}
                style={{
                  backgroundColor: "#0D9EDF",
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <i className="fa-regular fa-star me-2"></i>
                Special
                <span className="font_size_10">
                  {" "}
                  ({menuList.filter((menu) => menu.is_special)?.length || 0})
                </span>
              </div>
            </SwiperSlide>

            {/* All button */}
            <SwiperSlide style={{ width: "auto" }}>
              <div
                className={`category-btn font_size_14 border border-2 rounded-5 px-3 py-2 ${
                  selectedCategoryId === null ? "active" : ""
                }`}
                onClick={() => handleCategorySelect(null)}
                style={{
                  backgroundColor: selectedCategoryId === null ? "#0D775E" : "",
                  color: selectedCategoryId === null ? "#ffffff" : "",
                  cursor: "pointer",
                }}
              >
                All{" "}
                <span className="gray-text font_size_10">
                  ({countDetails?.total_menu || 0})
                </span>
              </div>
            </SwiperSlide>

            {/* Regular category buttons */}
            {categoryList.map((category) => (
              <SwiperSlide key={category.menu_cat_id} style={{ width: "auto" }}>
                <div
                  className={`category-btn font_size_14 border border-2 rounded-5 px-3 py-2 ${
                    selectedCategoryId === category.menu_cat_id ? "active" : ""
                  }`}
                  onClick={() => handleCategorySelect(category.menu_cat_id)}
                  style={{
                    backgroundColor:
                      selectedCategoryId === category.menu_cat_id
                        ? "#0D775E"
                        : "",
                    color:
                      selectedCategoryId === category.menu_cat_id
                        ? "#ffffff"
                        : "",
                    cursor: "pointer",
                  }}
                >
                  {category.category_name}{" "}
                  <span className=" gray-text font_size_10">
                    ({category.menu_count})
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Image Categories Slider */}
          <div className="title-bar mt-4">
            <h5 className="font_size_14 fw-medium">Menus</h5>
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
            className="dz-category-swiper mb-5 pb-3"
          >
            {filteredMenus.map((menu) => (
              <SwiperSlide key={menu.menu_id}>
                <div className="dz-category-items">
                  <a href="#" className="dz-media">
                    <img
                      src={menu.image || img}
                      alt={menu.menu_name}
                      style={{ height: 110 }}
                      onError={(e) => {
                        e.target.src = img;
                      }}
                    />
                    <div
                      className="border rounded-3 bg-white opacity-75 d-flex justify-content-center align-items-center border-success"
                      style={{
                        position: "absolute",
                        bottom: 3,
                        left: 3,
                        height: 17,
                        width: 17,
                      }}
                    >
                      <i className="fa-solid fa-circle-check text-success font_size_10" />
                    </div>
                  </a>
                  {menu.offer !== 0 && (
                    <div className="gradient_bg d-flex justify-content-center align-items-center gradient_bg_offer">
                      <span className="font_size_10 text-white">
                        {menu.offer}% Off
                      </span>
                    </div>
                  )}
                  {menu.is_special && (
                    <i
                      className="fa-regular fa-star border rounded-4 text-info bg-white opacity-75 d-flex justify-content-center align-items-center border-info"
                      style={{
                        position: "absolute",
                        top: 3,
                        right: 5,
                        height: 17,
                        width: 17,
                      }}
                    ></i>
                  )}

                  <div className="font_size_14 fw-medium text-wrap text-center">
                    <a href="#">{menu.menu_name}</a>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <Bottom />
    </div>
  );
}

export default RestaurantDetails;
