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

  const totalMenuCount = menuList.length || 25;

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
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
                  src={restaurantDetails.image || img }
                  className="card-img-top rounded-4"
                  alt={restaurantDetails.name || "Restaurant Image"}
                />
              </div>
              <div className="card p-3">
                <div className="my-1">
                  <i className="ri-store-2-line font_size_14 fw-medium"></i>
                  {/* <span className="card-title ms-2 ">Jagdamb</span> */}
                  <span className="card-title ms-2 ">
                    {restaurantDetails.name}
                  </span>
                </div>
                <div className="my-1">
                  <i className="ri-phone-line text-primary font_size_14 fw-medium"></i>
                  <span className="card-title ms-2">
                    {restaurantDetails.mobile}
                  </span>
                </div>
                <div className="my-1">
                  <i className="ri-map-pin-line gray-text text-primary font_size_14 fw-medium"></i>
                  <span className="card-title ms-2">
                    {restaurantDetails.address}
                  </span>
                </div>
              </div>
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
                  <a class="btn btn-info rounded-pill btn-sm">
                    <i class="ri-checkbox-circle-line py-0 me-2"></i>Pay
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
            <h5 className="title p-r50">Categories</h5>
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
                <i className="ri-bard-line me-2"></i>
                Special (
                {menuList.filter((menu) => menu.is_special)?.length || 0})
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
                All ({countDetails?.total_menu || 0})
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
                  {category.category_name} ({category.menu_count})
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Image Categories Slider */}
          <div className="title-bar mt-4">
            <h5 className="title p-r50">Menus</h5>
          </div>

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={10}
            slidesPerView={3.5}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            loop={true}
            className="dz-category-swiper mb-5 pb-3"
          >
            {menuList.map((menu) => (
              <SwiperSlide key={menu.menu_id}>
                <div className="dz-category-items">
                  <a href="#" className="dz-media">
                    <img
                      src={menu.image || img}
                      alt={menu.menu_name}
                      style={{ height: 110 }}
                    />
                    <div>
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
                        <i className="ri-checkbox-blank-circle-fill text-success font_size_10" />
                      </div>
                    </div>
                  </a>
                  <div className="gradient_bg d-flex justify-content-center align-items-center gradient_bg_offer">
                    <span className="font_size_10 text-white"> 30% off</span>
                  </div>
                  {menu.is_special && (
                    <div className="">
                      <i
                        className="ri-bard-line  border rounded-4 text-info bg-white opacity-75 d-flex justify-content-center align-items-center"
                        style={{
                          position: "absolute",
                          top: 3,
                          right: 5,
                          height: 17,
                          width: 17,
                        }}
                      ></i>
                    </div>
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
