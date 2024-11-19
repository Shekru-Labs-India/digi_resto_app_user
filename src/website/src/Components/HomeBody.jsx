import React, { useEffect, useState } from "react";

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
const HomeBody = () => {

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
              <a className="default-btn" href="index.html#">
             Our Services
              </a>
              <div className="video-wrap">
                <div className="video-btn-wrap ms-5">
                  <Link
                    to="/user_app/Index"
                    className="video-btn"
                   
                  >
                    <i className="fa fa-user " />
                  </Link>
                </div>
                <span className="watch-video ms-5">Try User App</span>
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
        <div className="col-lg-4 col-md-6 ">
          <div className="single-box rounded-4">
            <div className="box-icon">
              <i>
            <i className="fa-solid fa-wifi" width="40" height="40" />
            </i>
            </div>
            <h3>Contactless Order</h3>
            <p>
            Contactless order allows customers to place orders digitally, minimizing physical contact for a safer, faster, and more convenient experience.


            </p>
           
          </div>
        </div>
        <div className="col-lg-4 col-md-6 icon-color">
          <div className="single-box rounded-4">
            <div className="box-icon">
            <i >
              <i className="fa-solid fa-boxes-stacked"  width="40" height="40" />
            </i>
            </div>
            <h3>Inventory Management</h3>
            <p>
            Inventory management optimizes stock levels, tracks goods, and ensures efficient supply chain operations for reduced costs and improved availability.
            </p>
           
          </div>
        </div>
        <div className="col-lg-4 col-md-6 offset-md-3 offset-lg-0 icon-color">
          <div className="single-box rounded-4">
            <div className="box-icon">
            <i >
              <i className="fa-solid fa-people-group" width="40" height="40" alt="" />
            </i>
            </div>
            <h3>Low Staff Cost</h3>
            <p>
            Low staff cost refers to minimizing labor expenses through efficient staffing strategies, automation, or technology to maximize operational profitability.
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
            <img src={qrcode} className="rounded-4"alt="" />
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
            <Link to="/about" className="default-btn" >
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
					<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores dignissimos libero molestiae harum dolores numquam velit iste modi optio.</p>
					<a className="default-btn" href="index.html#">See All Foods</a>
				</div>
			</div>
		</section>
  
  
   
 


   





    <section className="testimonial-area ptb-100">
			<div className="container">
				<div className="section-title">
					<span>Testimonial</span>
					<h2>What Our Customers Say</h2>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.</p>
				</div>
				<div className="row testimonial-bg-color">
					<div className="col-lg-6 col-md-6 p-0">
						<div className="client-img">
							<img src="assets/img/testimonial/6.jpg" alt=""/>
							<div className="video-wrap">
								<div className="video-btn-wrap">
									<a href="https://templates.envytheme.com/rimu/default/play-video" className="video-btn"  data-ilb2-video='{"controls":"controls", "autoplay":false, "sources":[{"src":"assets/img/video.mp4", "type":"video/mp4"}]}' data-imagelightbox="video">
										<i className="fa fa-play"></i>
									</a>
								</div>
							</div>
						</div>
					</div>
					<div className="col-lg-6 col-md-6 p-0">
						<div className="testimonials-wrap owl-carousel owl-theme">
							<div className="single-testimonial">
								<img src="assets/img/testimonial/1.jpg" alt=""/>
								<h3>Amelia Daniel</h3>
								<span>Chairman and founder</span>
								<i className="flaticon-quote"></i>
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore  dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus  viverra maecenas accumsan lacus vel facilisis.</p>
								<ul>
									<li>
										<i className="fa fa-star"></i>
									</li>
									<li>
										<i className="fa fa-star"></i>
									</li>
									<li>
										<i className="fa fa-star"></i>
									</li>
									<li>
										<i className="fa fa-star"></i>
									</li>
									<li>
										<i className="fa fa-star"></i>
									</li>
								</ul>
							</div>
							
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
							<span>Deal  of The Day</span>
							<h2>We offer a bit less at Midday</h2>
							<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida sit amet, consectetur adipiscing elit.</p>
							<a className="default-btn" href="https://templates.envytheme.com/rimu/default/shop.html">
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

  )
}

export default HomeBody