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
import services from "../Assets/img/services/1.jpg"
import qrcode from "../Assets/img/QRcode-basedorderingsystem.jpg"
import shape from "../Assets/img/shape/1.png"

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
             Our Services
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
  
  
    <section className="our-product-area pt-100 pb-70">
			<div className="container">
				<div className="section-title">
					<span>Our Foods</span>
					<h2>Featured Foods</h2>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.</p>
				</div>
				<div className="row">
					<div className="col-lg-12">
						<div className="shorting-menu">
							<button className="filter" data-filter="all"><i className="flaticon-grid"></i> All</button>
							<button className="filter" data-filter=".vegetables">Vegetables</button>
							<button className="filter" data-filter=".fruits">Fruits</button>
							<button className="filter" data-filter=".pumpkin">Pumpkin</button>
							<button className="filter" data-filter=".orange">Orange</button>
							<button className="filter" data-filter=".lemon">Lemon</button>
						</div>
					</div>
					<div id="Container" className="row">
						<div className="col-lg-3 col-md-6 col-sm-6 mix vegetables fruits">
							<div className="single-product-box">
								<div className="product-image">
									<img src="assets/img/product/2.jpg" alt="image"/>
									<div className="btn-box">
										<a href="index.html#">
											<i className="flaticon-shopping-cart"></i>
										</a>
										<a href="index.html#" className="link-btn">
											<i className="flaticon-heart"></i>
										</a>
										<a href="assets/img/product/2.jpg" data-imagelightbox="popup-btn" className="link-btn">
											<i className="flaticon-magnifying-glass"></i>
										</a>
									</div>
								</div>
								<div className="product-content">
									<h3>
										Fresh Strawberry	
									</h3>
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
									<span>$60</span>
								</div>
								<span className="product-offer">
									SALE
								</span>
							</div>
						</div>
						<div className="col-lg-3 col-md-6 col-sm-6 mix pumpkin orange lemon">
							<div className="single-product-box">
								<div className="product-image">
									<img src="assets/img/product/1.jpg" alt="image"/>
									<div className="btn-box">
										<a href="index.html#">
											<i className="flaticon-shopping-cart"></i>
										</a>
										<a href="index.html#" className="link-btn">
											<i className="flaticon-heart"></i>
										</a>
										<a href="assets/img/product/1.jpg" data-imagelightbox="popup-btn" className="link-btn">
											<i className="flaticon-magnifying-glass"></i>
										</a>
									</div>
								</div>
								<div className="product-content">
									<h3>
										Fresh Cucumber	
									</h3>
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
									<span>$60</span>
								</div>
							</div>
						</div>
						<div className="col-lg-3 col-md-6 col-sm-6 mix pumpkin vegetables lemon">
							<div className="single-product-box">
								<div className="product-image">
									<img src="assets/img/product/3.jpg" alt="image"/>
									<div className="btn-box">
										<a href="index.html#">
											<i className="flaticon-shopping-cart"></i>
										</a>
										<a href="index.html#" className="link-btn">
											<i className="flaticon-heart"></i>
										</a>
										<a href="assets/img/product/3.jpg" data-imagelightbox="popup-btn" className="link-btn">
											<i className="flaticon-magnifying-glass"></i>
										</a>
									</div>
								</div>
								<div className="product-content">
									<h3>
										Fresh Grapes	
									</h3>
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
									<span>$60</span>
								</div>
								<span className="product-offer offer-10">
									-10%
								</span>
							</div>
						</div>
						<div className="col-lg-3 col-md-6 col-sm-6 mix orange fruits">
							<div className="single-product-box">
								<div className="product-image">
									<img src="assets/img/product/4.jpg" alt="image"/>
									<div className="btn-box">
										<a href="index.html#">
											<i className="flaticon-shopping-cart"></i>
										</a>
										<a href="index.html#" className="link-btn">
											<i className="flaticon-heart"></i>
										</a>
										<a href="assets/img/product/4.jpg" data-imagelightbox="popup-btn" className="link-btn">
											<i className="flaticon-magnifying-glass"></i>
										</a>
									</div>
								</div>
								<div class="product-content">
									<h3>
										Fresh Orange	
									</h3>
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
									<span>$60</span>
								</div>
							</div>
						</div>
						<div className="col-lg-3 col-md-6 col-sm-6 mix fruits pumpkin ">
							<div className="single-product-box">
								<div className="product-image">
									<img src="assets/img/product/5.jpg" alt="image"/>
									<div className="btn-box">
										<a href="index.html#">
											<i className="flaticon-shopping-cart"></i>
										</a>
										<a href="index.html#" className="link-btn">
											<i className="flaticon-heart"></i>
										</a>
										<a href="assets/img/product/5.jpg" data-imagelightbox="popup-btn" className="link-btn">
											<i className="flaticon-magnifying-glass"></i>
										</a>
									</div>
								</div>
								<div className="product-content">
									<h3>
										Fresh Juices	
									</h3>
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
									<span>$60</span>
								</div>
							</div>
						</div>
						<div className="col-lg-3 col-md-6 col-sm-6 mix orange vegetables lemon">
							<div className="single-product-box">
								<div className="product-image">
									<img src="assets/img/product/6.jpg" alt="image"/>
									<div className="btn-box">
										<a href="index.html#">
											<i className="flaticon-shopping-cart"></i>
										</a>
										<a href="index.html#" className="link-btn">
											<i className="flaticon-heart"></i>
										</a>
										<a href="assets/img/product/6.jpg" data-imagelightbox="popup-btn" className="link-btn">
											<i className="flaticon-magnifying-glass"></i>
										</a>
									</div>
								</div>

								<div className="product-content">
									<h3>
										Fresh Banana	
									</h3>
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
									<span>$60</span>
								</div>
								<span className="product-offer hot-offer">
									HOT
								</span>
							</div>
						</div>
						<div className="col-lg-3 col-md-6 col-sm-6 mix orange vegetables fruits">
							<div className="single-product-box">
								<div className="product-image">
									<img src="assets/img/product/7.jpg" alt="image"/>
									<div className="btn-box">
										<a href="index.html#">
											<i className="flaticon-shopping-cart"></i>
										</a>
										<a href="index.html#" className="link-btn">
											<i className="flaticon-heart"></i>
										</a>
										<a href="assets/img/product/7.jpg" data-imagelightbox="popup-btn" className="link-btn">
											<i className="flaticon-magnifying-glass"></i>
										</a>
									</div>
								</div>

								<div className="product-content">
									<h3>
										Fresh Tomato	
									</h3>
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
									<span>$60</span>
								</div>
							</div>
						</div>
						<div className="col-lg-3 col-md-6 col-sm-6 mix lemon vegetables pumpkin">
							<div className="single-product-box">
								<div className="product-image">
									<img src="assets/img/product/8.jpg" alt="image"/>
									<div className="btn-box">
										<a href="index.html#">
											<i className="flaticon-shopping-cart"></i>
										</a>
										<a href="index.html#" className="link-btn">
											<i className="flaticon-heart"></i>
										</a>
										<a href="assets/img/product/8.jpg" data-imagelightbox="popup-btn" className="link-btn">
											<i className="flaticon-magnifying-glass"></i>
										</a>
									</div>
								</div>
								<div className="product-content">
									<h3>
										Fresh Carrots	
									</h3>
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
									<span>$60</span>
								</div>
								<span className="product-offer">
									SALE
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
 


    {/* <section className="service-area pt-100 pb-70">
			<div className="container-fluid">
				<div className="section-title">
					<span>Services</span>
					<h2>We Provide Best Services</h2>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.</p>
				</div>
				<div className="row">
					<div className="col-12 p-0">
						<div className="service-wrap owl-carousel owl-theme">
							<div className="single-service">
								<img src={services} alt="Services"/>
								<div className="service-content">
									<h3>Fresh Fish</h3>
									<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do</p>
									<a className="read-more" href="service-details.html">
										Read More
										<i className="flaticon-right"></i>
									</a>
								</div>
							</div>
							<div className="single-service">
								<img src={services} alt="Services"/>
								<div className="service-content">
									<h3>Natural Food</h3>
									<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do</p>
									<a className="read-more" href="service-details.html">
										Read More
										<i className="flaticon-right"></i>
									</a>
								</div>
							</div>
							<div className="single-service">
								<img src={services} alt="Services"/>
								<div className="service-content">
									<h3>Natural Dairy Milk</h3>
									<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do</p>
									<a className="read-more" href="service-details.html">
										Read More
										<i className="flaticon-right"></i>
									</a>
								</div>
							</div>
							<div className="single-service">
								<img src={services} alt="Services"/>
								<div className="service-content">
									<h3>Fresh Meat</h3>
									<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do</p>
									<a className="read-more" href="service-details.html">
										Read More
										<i className="flaticon-right"></i>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="shape shape-1">
				<img src={shape} alt="Shape"/>
			</div>
		</section> */}


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

    <section className="faq-area">
			<div className="container-fluid">
				<div className="row">
					<div className="col-lg-6 p-0">
						<div className="faq-img">
							<img src="assets/img/faq-img.jpg" alt=""/>
						</div>
					</div>
					<div className="col-lg-6">
						<div className="row">
							<div className="col-lg-12">
								<div className="faq-accordion ptb-100">
									<h2>Frequently Asked Questions</h2>
									<ul className="accordion">
										<li className="accordion-item">
											<a className="accordion-title active" href="javascript:void(0)">
												<i className="fa fa-plus"></i>
												What Do You Eat Orange Food?
											</a>
											<p className="accordion-content show">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis deleniti nisi necessitatibus, dolores voluptates quam blanditiis fugiat doloremque? Excepturi, minus rem error aut necessitatibus quasi voluptates assumenda ipsum provident tenetur? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magni nesciunt consectetur sed, tempore, corporis ea maiores libero.</p>
										</li>
										<li className="accordion-item">
											<a className="accordion-title" href="javascript:void(0)">
												<i className="fa fa-plus"></i>
												Why Milk is Best For Health?
											</a>
											<p class="accordion-content">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis deleniti nisi necessitatibus, dolores voluptates quam blanditiis fugiat doloremque? Excepturi, minus rem error aut necessitatibus quasi voluptates assumenda ipsum provident tenetur? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magni nesciunt consectetur sed, tempore, corporis ea maiores libero.</p>
										</li>
										<li class="accordion-item">
											<a class="accordion-title" href="javascript:void(0)">
												<i class="fa fa-plus"></i>
												Good Food For Good Health
											</a>
											<p className="accordion-content">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis deleniti nisi necessitatibus, dolores voluptates quam blanditiis fugiat doloremque? Excepturi, minus rem error aut necessitatibus quasi voluptates assumenda ipsum provident tenetur? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magni nesciunt consectetur sed, tempore, corporis ea maiores libero.</p>
										</li>
										<li className="accordion-item">
											<a className="accordion-title" href="javascript:void(0)">
												<i className="fa fa-plus"></i>
												How Can You Get Good Food?
											</a>
											<p className="accordion-content">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis deleniti nisi necessitatibus, dolores voluptates quam blanditiis fugiat doloremque? Excepturi, minus rem error aut necessitatibus quasi voluptates assumenda ipsum provident tenetur? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magni nesciunt consectetur sed, tempore, corporis ea maiores libero.</p>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>


  
 
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