import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import shapepng1 from "../Assets/img/shape/1.png"
import shapepng2 from "../Assets/img/shape/2.png"
import shapepng3 from "../Assets/img/shape/3.png"
import shapepng10 from "../Assets/img/shape/10.png"
import shapepng8 from "../Assets/img/shape/8.png"
import shapepng4 from "../Assets/img/shape/4.png"
import shapepng5 from "../Assets/img/shape/5.png"
import shapepng6 from "../Assets/img/shape/6.png"
import shapepng7 from "../Assets/img/shape/7.png"
import shapepng9 from "../Assets/img/shape/9.png"
import bannerpng1 from "../Assets/img/banner/1.png"
import services from "../Assets/img/services/1.jpg"
import qrcode from "../Assets/img/QRcode-basedorderingsystem.jpg"
import shape from "../Assets/img/shape/1.png"
import { Link } from 'react-router-dom'
const DemoPopup = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Request Demo</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="hotelName" className="form-label">
                  Hotel Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="hotelName"
                  placeholder="Enter hotel name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="contact" className="form-label">
                  Contact No
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="contact"
                  placeholder="Enter contact number"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <textarea
                  className="form-control"
                  id="address"
                  rows="2"
                  placeholder="Enter address"
                ></textarea>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



const HomeBody = () => {
  const [showDemoPopup, setShowDemoPopup] = useState(false);

  const testimonialOptions = {
    items: 1,
    loop: true,
    margin: 10,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
  };

    useEffect(() => {
      if (showDemoPopup) {
        document.body.classList.add("no-scroll");
      } else {
        document.body.classList.remove("no-scroll");
      }
    }, [showDemoPopup]);
  

	useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  return (
    <>
      <>
        {/* Start Banner Area */}
        <section className="banner-area">
          <div className="container">
            <div className="row">
              <div className="col-lg-7">
                <div className="banner-text">
                  <span className="wow fadeInUp" data-wow-delay=".1s">
                    Scan and Order now
                  </span>
                  <h1 className="wow fadeInUp" data-wow-delay=".3s">
                    Get an Online Menu for Your Restaurant
                  </h1>
                  <p className="wow fadeInUp" data-wow-delay=".6s">
                    Manage Contactless Order and Payment
                  </p>
                  <div className="banner-btn wow fadeInUp" data-wow-delay=".9s">
                    <a
                      className="default-btn"
                      onClick={() => setShowDemoPopup(true)}
                      style={{ cursor: "pointer" }}
                    >
                      Call for demo
                    </a>

                    <DemoPopup
                      show={showDemoPopup}
                      onClose={() => setShowDemoPopup(false)}
                    />
                    <div className="video-wrap">
                      <div className="video-btn-wrap ms-5">
                        <Link to="/user_app/Index" className="video-btn">
                          <i className="fa fa-user " />
                        </Link>
                      </div>
                      <span className="watch-video ms-5">Try User App</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <div
                  className="banner-img-right wow fadeInUp"
                  data-wow-delay=".9s"
                >
                  <img src={bannerpng1} alt="Banner" />
                </div>
              </div>
            </div>
          </div>
          <div className="shape shape-text">
            <span>Organic</span>
          </div>
          <div className="shape shape-1">
            <img src={shapepng1} alt="Shape" />
          </div>
          <div className="shape shape-2">
            <img src={shapepng2} alt="Shape" />
          </div>
          <div
            className="banner-images-right wow fadeInUp"
            data-wow-delay=".9s"
          >
            <img src={bannerpng1} alt="Banner" />
          </div>
        </section>
        {/* End Banner Area */}
        {/* Start Box Area */}
        <section className="box-area pt-100 pb-70">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-md-6 ">
                <div className="single-box rounded-4">
                  <div className="box-icon">
                    <i>
                      <i className="fa-solid fa-wifi " width="40" height="40" />
                    </i>
                  </div>
                  <h3>Contactless Order</h3>
                  <p>
                    Contactless order allows customers to place orders
                    digitally, minimizing physical contact for a safer, faster,
                    and more convenient experience.
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 icon-color">
                <div className="single-box rounded-4">
                  <div className="box-icon">
                    <i>
                      <i
                        className="fa-solid fa-boxes-stacked"
                        width="40"
                        height="40"
                      />
                    </i>
                  </div>
                  <h3>Inventory Management</h3>
                  <p>
                    Inventory management optimizes stock levels, tracks goods,
                    and ensures efficient supply chain operations for reduced
                    costs and improved availability.
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 offset-md-3 offset-lg-0 icon-color">
                <div className="single-box rounded-4">
                  <div className="box-icon">
                    <i>
                      <i
                        className="fa-solid fa-people-group"
                        width="40"
                        height="40"
                        alt=""
                      />
                    </i>
                  </div>
                  <h3>Low Staff Cost</h3>
                  <p>
                    Low staff cost refers to minimizing labor expenses through
                    efficient staffing strategies, automation, or technology to
                    maximize operational profitability.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="shape shape-1">
            <img src={shapepng8} alt="" />
          </div>
          <div className="shape shape-2">
            <img src={shapepng9} alt="" />
          </div>
        </section>
        {/* End Service Area */}
        {/* Start About Us Area */}
        <section className="about-us-area pb-100">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="about-img-1 ">
                  <img src={qrcode} className="rounded-4" alt="" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="about-content">
                  <span>About Us</span>
                  <h2>Benefits of Menumitra for Your Restaurant </h2>
                  <p>
                    MenuMitra is a digital menu app enabling contactless
                    ordering, real-time menu updates, and inventory management.
                    Guests can customize orders, track status, and pay easily
                    via multiple options. With promotion tools and feedback
                    features, it enhances customer satisfaction, streamlines
                    operations, and provides a modern dining experience for
                    restaurants.
                  </p>
                  <div className="row">
                    <div className="col-lg-6 col-sm-6">
                      <ul>
                        <li>
                          <i className="fa fa-check-circle"></i>
                          Increased Efficiency And Speed Of
                        </li>
                        <li>
                          <i className="fa fa-check-circle" />
                          Improved Accuracy Of Orders
                        </li>
                        <li>
                          <i className="fa fa-check-circle" />
                          Enhanced Customer Experience
                        </li>
                        <li>
                          <i className="fa fa-check-circle" />
                          Reduced Costs And Increased
                        </li>
                        <li>
                          <i className="fa fa-check-circle" />
                          Contactless Ordering And Payments
                        </li>
                      </ul>
                    </div>
                    <div className="col-lg-6 col-sm-6">
                      <ul>
                        <li>
                          <i className="fa fa-check-circle" />
                          Real-Time Updates To Menu And
                        </li>
                        <li>
                          <i className="fa fa-check-circle" />
                          Customer Data And Insights
                        </li>
                        <li>
                          <i className="fa fa-check-circle" />
                          Marketing Opportunities
                        </li>
                        <li>
                          <i className="fa fa-check-circle" />
                          Integration With Other Applications
                        </li>
                        <li>
                          <i className="fa fa-check-circle" />
                          Error-free Orders
                        </li>
                      </ul>
                    </div>
                  </div>
                  <Link to="/features" className="default-btn">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="shape shape-1">
            <img src={shapepng2} alt="Shape" />
          </div>
          <div className="shape shape-2">
            <img src={shapepng4} alt="Shape" />
          </div>
          <div className="shape shape-3">
            <img src={shapepng5} alt="Shape" />
          </div>
          <div className="shape shape-4">
            <img src={shapepng6} alt="Shape" />
          </div>
          <div className="shape shape-5">
            <img src={shapepng7} alt="Shape" />
          </div>
        </section>
        {/* End About US Area */}

        <section className="see-product-area ptb-100">
          <div className="container">
            <div className="section-title">
              <span>All Foods</span>
              <h2>It’s About a healthier Lifestyle but in a Natural Way</h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Asperiores dignissimos libero molestiae harum dolores numquam
                velit iste modi optio.
              </p>
              <a className="default-btn" href="index.html#">
                See All Foods
              </a>
            </div>
          </div>
        </section>

        <section className="testimonial-area ptb-100">
          <div className="container">
            <div className="section-title">
              <span>Testimonial</span>
              <h2>What Our Customers Say</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
                ipsum suspendisse ultrices gravida.
              </p>
            </div>
            <div className="row testimonial-bg-color ">
              <div className="col-12 p-0">
                <div className="testimonials-wrap">
                  <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                      delay: 2500,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true
                    }}
                    pagination={{
                      clickable: true
                    }}
                    loop={true}
                    modules={[Autoplay, Pagination]}
                    className="mySwiper"
                  >
                    <SwiperSlide>
                      <div className="single-testimonial">
                        {/* <img src="assets/img/testimonial/1.jpg" alt="Restaurant Owner" /> */}
                        <h3>Rajesh Patil</h3>
                        <span>Hotel Owner, Pune</span>
                        <i className="flaticon-quote"></i>
                        <p>
                          "MenuMitra ne mera restaurant digital kar diya! Staff ki efficiency badh gayi 
                          aur customers bhi khush hai. QR code scanning se ordering system ekdum smooth 
                          ho gaya hai. Best investment for my business!"
                        </p>
                        <ul>
                          <li><i className="fa fa-star"></i></li>
                          <li><i className="fa fa-star"></i></li>
                          <li><i className="fa fa-star"></i></li>
                          <li><i className="fa fa-star"></i></li>
                          <li><i className="fa fa-star"></i></li>
                        </ul>
                      </div>
                    </SwiperSlide>

                    <SwiperSlide>
                      <div className="single-testimonial">
                        {/* <img src="assets/img/testimonial/2.jpg" alt="Restaurant Manager" /> */}
                        <h3>Suresh Deshmukh</h3>
                        <span>Restaurant Manager, Mumbai</span>
                        <i className="flaticon-quote"></i>
                        <p>
                          "MenuMitra मुळे आमच्या रेस्टॉरंटचं डिजिटलायझेशन झालं. ऑर्डर मॅनेजमेंट 
                          आता खूप सोपं झालंय. कस्टमर सर्विस इम्प्रूव्ह झाली आणि बिझनेस वाढला. 
                          एकदम झकास app आहे!"
                        </p>
                        <ul>
                          <li><i className="fa fa-star"></i></li>
                          <li><i className="fa fa-star"></i></li>
                          <li><i className="fa fa-star"></i></li>
                          <li><i className="fa fa-star"></i></li>
                          <li><i className="fa fa-star-half-o"></i></li>
                        </ul>
                      </div>
                    </SwiperSlide>

                    <SwiperSlide>
                      <div className="single-testimonial">
                        {/* <img src="assets/img/testimonial/3.jpg" alt="Cafe Owner" /> */}
                        <h3>Priya Sharma</h3>
                        <span>Cafe Owner, Bangalore</span>
                        <i className="flaticon-quote"></i>
                        <p>
                          "Being a new cafe owner, MenuMitra has been a game-changer! The digital menu 
                          system is so user-friendly, and their customer support is excellent. Saved 
                          costs on menu printing and improved order accuracy by 95%."
                        </p>
                        <ul>
                          <li><i className="fa fa-star"></i></li>
                          <li><i className="fa fa-star"></i></li>
                          <li><i className="fa fa-star"></i></li>
                          <li><i className="fa fa-star"></i></li>
                          <li><i className="fa fa-star"></i></li>
                        </ul>
                      </div>
                    </SwiperSlide>

                    <SwiperSlide>
                      <div className="single-testimonial">
                        {/* <img src="assets/img/testimonial/4.jpg" alt="Hotel Manager" /> */}
                        <h3>Amit Patel</h3>
                        <span>Hotel Manager, Nashik</span>
                        <i className="flaticon-quote"></i>
                        <p>
                          "MenuMitra ekdum mast app hai! Hamari service quality improve hui hai, 
                          customers ka time bacha hai, aur staff ko bhi manage karna easy ho gaya. 
                          Inventory tracking feature toh kamaal ka hai. Full paisa vasool!"
                        </p>
                        <ul>
                          <li><i className="fa fa-star"></i></li>
                          <li><i className="fa fa-star"></i></li>
                          <li><i className="fa fa-star"></i></li>
                          <li><i className="fa fa-star"></i></li>
                          <li><i className="fa fa-star"></i></li>
                        </ul>
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="offer-area ptb-100">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-4">
                <div className="offer-logo">
                  <p>50%</p>
                  <span>Off</span>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="offer-title">
                  <span>Deal of The Day</span>
                  <h2>We offer a bit less at Midday</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Quis ipsum suspendisse ultrices gravida sit amet,
                    consectetur adipiscing elit.
                  </p>
                  <a
                    className="default-btn"
                    href="https://templates.envytheme.com/rimu/default/shop.html"
                  >
                    Shop Now
                    <i className="flaticon-next"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    </>
  );
}

export default HomeBody