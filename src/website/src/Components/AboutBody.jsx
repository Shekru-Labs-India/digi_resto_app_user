import React, { useEffect, useState } from "react";
import qrcode from "../Assets/img/QRcode-basedorderingsystem.jpg"
import about1 from "../Assets/img/about/1.jpg"

const AboutBody = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    
  <>
  <>
  {/* Start Page Title Area */}
  <div className="page-title-area item-bg-1">
    <div className="container">
      <div className="page-title-content">
        <h2>About Us</h2>
        <ul>
          <li>
            <a href="index.html">
              Home
              <i className="fa fa-chevron-right" />
            </a>
          </li>
          <li>About Us</li>
        </ul>
      </div>
    </div>
  </div>
  {/* End Page Title Area */}
  {/* Start About Us Area */}
  <section className="about-us-area ptb-100">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <div
            className="about-img-1 about-img-2 wow bounceInDown"
            data-wow-delay=".1s"
          >
            <img src={qrcode} alt="" />
          </div>
        </div>
        <div className="col-lg-6">
          <div className="about-content">
            <span>About Us</span>
            <h2>Benefits of Menumitra for Your Restaurant</h2>
            <p>
            MenuMitra is a digital menu app enabling contactless ordering, real-time menu updates, and inventory management. Guests can customize orders, track status, and pay easily via multiple options. With promotion tools and feedback features, it enhances customer satisfaction, streamlines operations, and provides a modern dining experience for restaurants.
            </p>
            <div className="row">
              
            <div className="col-lg-6 col-sm-6">
                <ul>
                  <li>
                    <i className="fa fa-check-circle" />
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
            <a className="default-btn default-btn-2" href="about.html">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
    <div className="shape shape-1">
      <img src="assets/img/shape/3.png" alt="Shape" />
    </div>
    <div className="shape shape-2">
      <img src="assets/img/shape/4.png" alt="Shape" />
    </div>
    <div className="shape shape-3">
      <img src="assets/img/shape/5.png" alt="Shape" />
    </div>
    <div className="shape shape-4">
      <img src="assets/img/shape/6.png" alt="Shape" />
    </div>
    <div className="shape shape-5">
      <img src="assets/img/shape/7.png" alt="Shape" />
    </div>
  </section>
  {/* End About US Area */}

  <>
  {/* Start Counter Area */}
  <section className="counter-area pt-100 pb-70">
    <div className="container">
      <div className="row">
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="single-counter">
            <i className="fa-regular fa-hand-peace" />
            <h2>
              <span className="odometer" data-count={25}>
                2
              </span>
              +
            </h2>
            <p>Years Experience</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="single-counter">
            <i className="fa fa-user-plus" />
            <h2>
              <span className="odometer" data-count={85}>
                150
              </span>
              +
            </h2>
            <p>Members</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="single-counter">
          <i class="fas fa-seedling"></i>
            <h2>
              <span className="odometer" data-count={90}>
                5
              </span>
              +
            </h2>
            <p>Our Product</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="single-counter">
          <i class="fas fa-seedling"></i>
            <h2>
              <span className="odometer" data-count={270}>
                3
              </span>
              +
            </h2>
            <p>World Wide Branch</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* End Counter Area */}

  <>
  {/* Start About Us Area */}
  <section className="about-us-area about-us-area-two pt-100">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <div className="about-content">
            <span>About Us</span>
            <h2>Revolutionizing Your Dining Experience</h2>
            <p>
              MenuMitra seamlessly integrates technology with dining, offering a contactless, efficient, and personalized experience. Our app ensures real-time menu updates, easy order customization, and multiple payment options, making dining out more enjoyable and hassle-free.
            </p>
            <div className="row">
              <div className="col-lg-6 col-sm-6">
                <ul>
                  <li>
                    <i className="fa fa-check-circle" />
                    Premium Quality
                  </li>
                  <li>
                    <i className="fa fa-check-circle" />
                    Harvest Everyday
                  </li>
                  <li>
                      <i className="fa fa-check-circle" />
                    100% Organic
                  </li>
                  <li>
                    <i className="fa fa-check-circle" />
                    Fast Delivery
                  </li>
                </ul>
              </div>
              <div className="col-lg-6 col-sm-6">
                <ul>
                  <li>
                    <i className="fa fa-check-circle" />
                    Premium Quality
                  </li>
                  <li>
                      <i className="fa fa-check-circle" />
                    Harvest Everyday
                  </li>
                  <li>
                    <i className="fa fa-check-circle" />
                    100% Organic
                  </li>
                  <li>
                    <i className="fa fa-check-circle" />
                    Fast Delivery
                  </li>
                </ul>
              </div>
            </div>
            <a className="default-btn" href="about.html">
              Learn More
            </a>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="about-img-1">
            <img src={about1} alt="" />
          </div>
        </div>
      </div>
    </div>
    <div className="shape shape-1">
      <img src="assets/img/shape/3.png" alt="Shape" />
    </div>
    <div className="shape shape-2">
      <img src="assets/img/shape/4.png" alt="Shape" />
    </div>
    <div className="shape shape-3">
      <img src="assets/img/shape/5.png" alt="Shape" />
    </div>
    <div className="shape shape-4">
      <img src="assets/img/shape/6.png" alt="Shape" />
    </div>
    <div className="shape shape-5">
      <img src="assets/img/shape/7.png" alt="Shape" />
    </div>
  </section>
  {/* End About US Area */}

  <>
  {/* Start Subscribe Area */}
  <section className="subscribe-area ptb-100">
    <div className="container">
      <div className="section-title">
        <span>Subscribe Now</span>
        <h2>Subscribe Our Newsletter</h2>
        <p>
          Sign up for our newsletter to receive the latest updates and exclusive offers.
        </p>
      </div>
      <div className="row">
        <div className="col-12">
          <form className="newsletter-form">
            <input
              type="email"
              className="form-control"
              placeholder="email address"
              name="EMAIL"
              required=""
              autoComplete="off"
            />
            <button type="submit">Subscribe</button>
            <div id="validator-newsletter" className="form-result" />
          </form>
        </div>
      </div>
    </div>
  </section>
  {/* End Subscribe Area */}
</>

</>

</>

</>

  </>

  )
}

export default AboutBody