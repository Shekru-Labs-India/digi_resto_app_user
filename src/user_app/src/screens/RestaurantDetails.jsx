import React, { useState } from "react";
import Bottom from "../component/bottom";
import Sidebar from "../../../website/src/Components/Sidebar";
import Header from "../components/Header";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';

function RestaurantDetails() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  
  // Category buttons data
  const menuCategories = [
    { menu_cat_id: 1, name: "Starters", menu_count: 8 },
    { menu_cat_id: 2, name: "Main Course", menu_count: 12 },
    { menu_cat_id: 3, name: "Desserts", menu_count: 5 },
  ];

  // Image slider data
  const categories = [
    {
      id: 1,
      name: "Indoor Plants",
      image:
        "https://www.shutterstock.com/image-vector/jagdamb-name-indian-godess-marathi-600w-2193084831.jpg",
    },
    {
      id: 2,
      name: "House Plant",
      image:
        "https://www.shutterstock.com/image-vector/jagdamb-name-indian-godess-marathi-600w-2193084831.jpg",
    },
    {
      id: 3,
      name: "Paneer Butter Masala",
      image:
        "https://www.shutterstock.com/image-vector/jagdamb-name-indian-godess-marathi-600w-2193084831.jpg",
    },
    {
      id: 4,
      name: "Succulents",
      image:
        "https://www.shutterstock.com/image-vector/jagdamb-name-indian-godess-marathi-600w-2193084831.jpg",
    },
    {
      id: 5,
      name: "House Plant",
      image:
        "https://www.shutterstock.com/image-vector/jagdamb-name-indian-godess-marathi-600w-2193084831.jpg",
    },
    {
      id: 6,
      name: "Tropical",
      image:
        "https://www.shutterstock.com/image-vector/jagdamb-name-indian-godess-marathi-600w-2193084831.jpg",
    },
  ];

  const menuList = [];
  const totalMenuCount = menuList.length || 25;

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <div>
      <Sidebar />
      <Header title="Restaurant Details" />
      <div className="container mt-5">
        <div class="col-12">
          <div class="">
            <div>
              <div className="card rounded-4">
                <img
                  src="https://www.shutterstock.com/image-vector/jagdamb-name-indian-godess-marathi-600w-2193084831.jpg"
                  className="card-img-top rounded-4"
                  alt="..."
                />
              </div>
              <div className="card p-3">
                <div className="my-1">
                  <i className="ri-store-2-line font_size_14 fw-medium"></i>
                  <span className="card-title ms-2 ">Jagdamb</span>
                </div>
                <div className="my-1">
                  <i className="ri-phone-line text-primary font_size_14 fw-medium"></i>
                  <span className="card-title ms-2">9876543210</span>
                </div>
                <div className="my-1">
                  <i className="ri-map-pin-line gray-text text-primary font_size_14 fw-medium"></i>
                  <span className="card-title ms-2">Swargate Pune</span>
                </div>
              </div>
              <div
                className="card "
                style={{
                  border: "2px dashed silver",
                }}
              >
                <ul className="list-group list-group-flush rounded-4">
                  <li className="list-group-item">UPI : jagdamb@upi</li>
                  {/* <li className="list-group-item">A second item</li>
                  <li className="list-group-item">A third item</li> */}
                </ul>
              </div>
              {/* <div className="card-body">
                <a href="javascript:void(0);" className="card-link">
                  Card link
                </a>
                <a href="javascript:void(0);" className="card-link">
                  Another link
                </a>
              </div> */}
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
                  <span class="badge bg-primary rounded-pill">14</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Total Categories
                  <span class="badge bg-primary rounded-pill">2</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Total Tables
                  <span class="badge bg-primary rounded-pill">1</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Total Offer Menus
                  <span class="badge bg-primary rounded-pill">1</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Total Special Menus
                  <span class="badge bg-primary rounded-pill">1</span>
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
                {menuList.filter((menu) => menu.is_special)?.length || 5})
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
                All ({totalMenuCount})
              </div>
            </SwiperSlide>

            {/* Regular category buttons */}
            {menuCategories.map((category) => (
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
                  {category.name} ({category.menu_count})
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
              //   delay: 2500,
              delay: 25000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="dz-category-swiper mb-5 pb-3"
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <div className="dz-category-items">
                  <a href="#" className="dz-media">
                    <img src={category.image} alt={category.name} />
                    <div>
                      <div
                        className="border rounded-3 bg-white opacity-75 d-flex justify-content-center align-items-center border-success"
                        style={{
                          position: "absolute",
                          bottom: 3,
                          left: 3,
                          height: 20,
                          width: 20,
                          borderWidth: 2,
                          borderRadius: 3,
                        }}
                      >
                        <i className="ri-checkbox-blank-circle-fill text-success font_size_12" />
                      </div>
                    </div>
                  </a>
                  <div className="gradient_bg d-flex justify-content-center align-items-center gradient_bg_offer">
                    <span className="font_size_10 text-white"> 30% off</span>
                  </div>
                  <div className="border rounded-3 bg-white opacity-75 d-flex justify-content-center align-items-center border-success">
                    <i
                      className="ri-bard-line me-2"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 90,
                        height: 15,
                        width: 65,
                        borderRadius: "13px 0",
                        color: "#0d9edf",
                      }}
                    ></i>
                  </div>

                  <div className="font_size_14 fw-medium text-wrap text-center">
                    <a href="#">{category.name}</a>
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
