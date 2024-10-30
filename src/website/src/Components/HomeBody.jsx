import React from 'react'
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

import qrcode from "../Assets/img/QRcode-basedorderingsystem.jpg"

const HomeBody = () => {
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
              <a className="default-btn" href="index.html#">
              Request for Demo
              </a>
              <div className="video-wrap">
                <div className="video-btn-wrap ms-5">
                  <a
                    href="https://templates.envytheme.com/rimu/default/play-video"
                    className="video-btn"
                    data-ilb2-video='{"controls":"controls", "autoplay":false, "sources":[{"src":"assets/img/video.mp4", "type":"video/mp4"}]}'
                    data-imagelightbox="video"
                  >
                    <i className="fa fa-play " />
                  </a>
                </div>
                <span className="watch-video ms-5">Watch Video</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="banner-img-right wow fadeInUp" data-wow-delay=".9s">
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
    <div className="banner-images-right wow fadeInUp" data-wow-delay=".9s">
      <img src={bannerpng1} alt="Banner" />
    </div>
  </section>
  {/* End Banner Area */}
  {/* Start Box Area */}
  <section className="box-area pt-100 pb-70">
    <div className="container">
      <div className="row">
        <div className="col-lg-4 col-md-6">
          <div className="single-box">
            <div className="box-icon">
              <i>
            <img src="https://cdn.iconscout.com/icon/premium/png-256-thumb/contactless-payment-4582179-3802931.png?f=webp" width="40" height="40" />
            </i>
            </div>
            <h3>Contactless Order</h3>
            <p>
            Contactless order allows customers to place orders digitally, minimizing physical contact for a safer, faster, and more convenient experience.


            </p>
            <a className="read-more" href="index.html#">
              Read More
              <i className="flaticon-right" />
            </a>
            <div className="shape-3">
              <img src={shapepng3} alt="Shape" />
            </div>
            <div className="shape-4">
              <img src={shapepng10} alt="Shape" />
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 icon-color">
          <div className="single-box">
            <div className="box-icon">
            <i >
              <img src="https://cdn-icons-png.flaticon.com/512/9805/9805578.png" width="40" height="40" />
            </i>
            </div>
            <h3>Inventory Management</h3>
            <p>
            Inventory management optimizes stock levels, tracks goods, and ensures efficient supply chain operations for reduced costs and improved availability.
            </p>
            <a className="read-more" href="index.html#">
              Read More
              <i className="flaticon-right" />
            </a>
            <div className="shape-3">
              <img src={shapepng3} alt="Shape" />
            </div>
            <div className="shape-4">
              <img src={shapepng10} alt="Shape" />
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 offset-md-3 offset-lg-0 icon-color">
          <div className="single-box">
            <div className="box-icon">
            <i >
              <img src="https://www.pikpng.com/pngl/m/378-3783388_staff-icon-png-people-symbol-no-background-clipart.png" width="40" height="40" alt="" />
            </i>
            </div>
            <h3>Low Staff Cost</h3>
            <p>
            Low staff cost refers to minimizing labor expenses through efficient staffing strategies, automation, or technology to maximize operational profitability.
            </p>
            <a className="read-more" href="index.html#">
              Read More
              <i className="flaticon-right" />
            </a>
            <div className="shape-3">
              <img src={shapepng3} alt="Shape" />
            </div>
            <div className="shape-4">
              <img src={shapepng10} alt="Shape" />
            </div>
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
          <div className="about-img-1">
            <img src={qrcode} alt="" />
          </div>
        </div>
        <div className="col-lg-6">
          <div className="about-content">
            <span>About Us</span>
            <h2>Benefits of Menumitra for Your Restaurant </h2>
            <p>
            MenuMitra is a digital menu app enabling contactless ordering, real-time menu updates, and inventory management. Guests can customize orders, track status, and pay easily via multiple options. With promotion tools and feedback features, it enhances customer satisfaction, streamlines operations, and provides a modern dining experience for restaurants.
            </p>
            <div className="row">
              <div className="col-lg-6 col-sm-6">
                <ul>
                  <li>
                    <i className="flaticon-check-mark" />
                    Increased Efficiency And Speed Of
                  </li>
                  <li>
                    <i className="flaticon-check-mark" />
                    Improved Accuracy Of Orders
                  </li>
                  <li>
                    <i className="flaticon-check-mark" />
                    Enhanced Customer Experience
                  </li>
                  <li>
                    <i className="flaticon-check-mark" />
                    Reduced Costs And Increased
                  </li>
                  <li>
                    <i className="flaticon-check-mark" />
                    Contactless Ordering And Payments
                  </li>
                </ul>
              </div>
              <div className="col-lg-6 col-sm-6">
                <ul>
                  <li>
                    <i className="flaticon-check-mark" />
                    Real-Time Updates To Menu And
                  </li>
                  <li>
                    <i className="flaticon-check-mark" />
                    Customer Data And Insights
                  </li>
                  <li>
                    <i className="flaticon-check-mark" />
                    Marketing Opportunities
                  </li>
                  <li>
                    <i className="flaticon-check-mark" />
                    Integration With Other Applications
                  </li>
                  <li>
                    <i className="flaticon-check-mark" />
                    Error-free Orders
                  </li>
                </ul>
              </div>
            </div>
            <a className="default-btn" href="about.html">
              Learn More
            </a>
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
  
  
 
  
  
 
 
 
  {/* Start Subscribe Area */}
  <section className="subscribe-area ptb-100">
    <div className="container">
      <div className="section-title">
        <span>Subscribe Now</span>
        <h2>Subscribe Our Newsletter</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum
          suspendisse ultrices gravida.
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

  )
}

export default HomeBody