import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import png1 from "../Assets/img/product-details/1.png"
import product1 from "../Assets/img/product/1.jpg"
import product2 from "../Assets/img/product/2.jpg"
import product3 from "../Assets/img/product/3.jpg"
import product4 from "../Assets/img/product/4.jpg"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const PricingBody = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    
  <>
  
  {/* Start Page Title Area */}
  <div className="page-title-area item-bg-5">
    <div className="container">
      <div className="page-title-content">
        <h2>Pricing </h2>
        <ul>
          <li>
            <Link to="/">
              Home
              <i className="fa fa-chevron-right" />
            </Link>
          </li>
          <li>Pricing</li>
        </ul>
      </div>
    </div>
  </div>
  {/* End Page Title Area */}

  <section className="why-choose-us-three four pt-100">
  <div className='container'>

  <div className="section-title">
        
        <h2 className=""> Transparent and affordable pricing
       </h2>
        <p>
        Manage restaurant operations efficiently without burning a hole in your pockets
        </p>
      </div>

  </div>
  </section>

 

  <div className="container ">
  <h2 className="text-center fw-bold mb-4 ">
        Simple and reliable POS for all your restaurant needs
      </h2>

      {/* Statistics Section */}
      <div className="row text-center">
        {/* Clients */}
        <div className="col-md-3 mb-4">
          <i className="fa-solid fa-users text-dark mb-2 fs-1"size="3x" />
     

          <h3 className="text-danger fw-bold mt-2">75000+</h3>
          <p className="text-muted">
            <strong>Clients</strong> across India, UAE, South Africa & Canada
          </p>
        </div>

        {/* Online Order Volume */}
        <div className="col-md-3 mb-4">
          <i  className="fa-solid fa-cart-shopping text-dark mb-2 fs-1" size="100"  />
          <h3 className="text-danger fw-bold mt-2">44%</h3>
          <p className="text-muted">
            <strong>Online order volume</strong> processed by MenuMitra
          </p>
        </div>

        {/* Bills Processed */}
        <div className="col-md-3 mb-4">
          <i className="fa-solid fa-receipt text-dark mb-2 fs-1"size="3x"  />
       
          <h3 className="text-danger fw-bold mt-2">60L+</h3>
          <p className="text-muted">
            <strong>Bills processed</strong> everyday hassle free with MenuMitra POS
          </p>
        </div>

        {/* Support */}
        <div className="col-md-3 mb-4">
          <i className="fa-solid fa-phone-volume text-dark mb-2 fs-1" size="3x" />
          <h3 className="text-danger fw-bold mt-2">24/7</h3>
          <p className="text-muted">
            <strong>On-call</strong> and on-site support
          </p>
        </div>
      </div>
      <div className="row pt-100">
        <div className="col-md-6">
          <h2 className="text-danger fw-bold">MM Pro</h2>
          <p className="text-muted">
            For any restaurant looking to automate their entire operation with affordable and easy-to-use software
          </p>
          <h1 className="fw-bold">₹9,999</h1>
          <p className="text-muted">/per outlet</p>

          <button className="btn btn-danger my-3">Book A Free Demo</button>
          <ul className="list-unstyled text-muted">
            <li className="mb-2">
              <i className="fa fa-check-circle text-success me-2"></i>
              Efficient cloud-based POS system that works with every OS
            </li>
            <li className="mb-2">
              <i className="fa fa-check-circle text-success me-2"></i>
              Quick and easy inventory management
            </li>
            <li className="mb-2">
              <i className="fa fa-check-circle text-success me-2"></i>
              100+ Real-time and simplified reporting
            </li>
            <li className="mb-2">
              <i className="fa fa-check-circle text-success me-2"></i>
              Seamless online ordering system
            </li>
            <li className="mb-2">
              <i className="fa fa-check-circle text-success me-2"></i>
              24x7 support
            </li>
            <li>
              <i className="fa fa-check-circle text-success me-2"></i>
              Aggregator integrations
            </li>
          </ul>
        </div>
        <div className="col-md-6 mt-5 mt-md-0">
          <h2 className="text-danger fw-bold">MM Pro Max</h2>
          <p className="text-muted">
            Power up your MenuMitra Core with features that simplify your kitchen operations, customer management, and staff responsibilities.
          </p>
          <h1 className="fw-bold">₹14,999*</h1>
          <p className="text-muted">/ per outlet</p>
          <button className="btn btn-danger my-3">Book A Free Demo</button>

          {/* Features List */}
          <ul className="list-unstyled text-muted">
            <li className="mb-2">
              <i className="fa fa-check-circle text-info me-2"></i>
              Holistic and easy-to-use tech solution
            </li>
            <li className="mb-2">
              <i className="fa fa-check-circle text-info me-2"></i>
              Works in perfect sync with POS
            </li>
            <li>
              <i className="fa fa-check-circle text-info me-2"></i>
              Android and Windows-based apps for multiple devices
            </li>
          </ul>
        </div>
      </div>
      <div className="alert alert-light text-muted text-center bg-light mt-4">
        <strong>Note:</strong> The prices mentioned on the page are exclusive of GST & only for the outlets in India.
      </div>

      {/* Header */}
      
    </div>


   


    <div className="container mt-5">
      {/* Header */}
      <h2 className="text-center fw-bold mb-5">Trusted by some of the best restaurants</h2>

      {/* Testimonials */}
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          576: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          992: {
            slidesPerView: 2,
          },
          1200: {
            slidesPerView: 2,
          },
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        loop={true}
        modules={[Autoplay]}
        className="mySwiper"
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div className="p-3 border rounded bg-white h-100">
            <div className="d-flex align-items-center mb-2">
              <p className="mb-0">
                "MenuMitra ne hamari 90+ branches ki operations ekdum smooth kar di hai. 
                Data management ho ya phir customer service, sab kuch ek click pe available hai. 
                Franchise owners bhi khush hai aur staff bhi. Best investment for large scale operations!"
              </p>
            </div>
            <div className="text-end mt-3">
              <div>
                <strong>Rajesh Mehta</strong>
                <p className="mb-0 text-muted">Operations Head, Mumbai</p>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="p-3 border rounded bg-white h-100">
            <div className="d-flex align-items-center mb-2">
              <p className="mb-0">
                "As a South Indian restaurant chain owner, MenuMitra's multi-language support 
                is fantastic. Inventory tracking and cost management features are saving us 
                lakhs every month. Integration was smooth, and ROI is amazing!"
              </p>
            </div>
            <div className="text-end mt-3">
              <div>
                <strong>Venkatesh Iyer</strong>
                <p className="mb-0 text-muted">Restaurant Chain Owner, Bangalore</p>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide>
          <div className="p-3 border rounded bg-white h-100">
            <div className="d-flex align-items-center mb-2">
              <p className="mb-0">
                "MenuMitra ka digital menu system bahut effective hai. Hamari billing accuracy 
                95% tak improve hui hai. Customer feedback system se service quality track 
                karna aur improve karna bohot easy ho gaya hai."
              </p>
            </div>
            <div className="text-end mt-3">
              <div>
                <strong>Priya Malhotra</strong>
                <p className="mb-0 text-muted">Restaurant Manager, Delhi</p>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 4 */}
        <SwiperSlide>
          <div className="p-3 border rounded bg-white h-100">
            <div className="d-flex align-items-center mb-2">
              <p className="mb-0">
                "MenuMitra ची inventory management system एकदम झकास आहे. 
                Stock tracking आणि wastage control करणे खूप सोपे झाले आहे. 
                Customer service टीम पण खूप helpful आहे. Highly recommended!"
              </p>
            </div>
            <div className="text-end mt-3">
              <div>
                <strong>Amit Deshmukh</strong>
                <p className="mb-0 text-muted">Hotel Owner, Pune</p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* Icons Section */}
      <div className="row text-center mt-5">
        <div className="col-md-4 mb-4">
        <i className="fa-solid fa-hand-holding-dollar fs-1 mb-3"></i>

          <h6 className="fw-bold"><span className="text-danger">Less</span> than daily cost of chai</h6>
        </div>
        <div className="col-md-4 mb-4">
        <i className="fa-solid fa-money-bill-1-wave fs-1 mb-3"></i>
          <h6 className="fw-bold">Constant & <span className="text-danger">fix</span> pricing</h6>
        </div>
        <div className="col-md-4 mb-4">
        <i className="fa-solid fa-computer fs-1 mb-3"></i>

          <h6 className="fw-bold"><span className="text-danger">No</span> new hardware required</h6>
        </div>
      </div>
    </div>
  </>

  )
}

export default PricingBody