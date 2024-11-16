import React from "react";
import { Link } from "react-router-dom";
import logo from "../Assets/img/mm-logo-bg-fill.png";
import jpg1 from "../Assets/img/instagram/1.jpg";
import jpg2 from "../Assets/img/instagram/2.jpg";
import jpg3 from "../Assets/img/instagram/3.jpg";
import jpg4 from "../Assets/img/instagram/4.jpg";
import jpg5 from "../Assets/img/instagram/5.jpg";
import jpg6 from "../Assets/img/instagram/6.jpg";

const Footer = () => {
  return (
    <>
      <>
      <section class="footer-top-area pt-100 pb-70">
			<div class="container">
				<div class="row">
					<div class="col-lg-4 col-sm-6 col-md-6">
						<div class="single-widget">
							<a href="index.html">
								<img src="assets/img/rimu-logo.png" alt="Rimu-Logo"/>
							</a>
							<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit cupiditate ad quisquam ratione, unde exercitationem ducimus dolor sit amet consectetur adipisicing.</p>
							<ul class="address">
								<li>
									<i class="fa fa-map-marker"></i>
									123, Western Road, Melbourne Australia
								</li>
								<li>
									<i class="fa fa-envelope"></i>
									<a href="../../cdn-cgi/l/email-protection#650d0009090a25170c08104b060a08"><span class="__cf_email__" data-cfemail="0f676a6363604f7d66627a216c6062">[email&#160;protected]</span></a>
								</li>
								<li>
									<i class="fa fa-phone"></i>
									<a href="tel:123456123">+123(456)123</a>
								</li>
							</ul>
						</div>
					</div>
					<div class="col-lg-2 col-sm-6 col-md-6">
						<div class="single-widget">
							<h3>Information</h3>
							<ul class="links">
								<li>
									<a href="checkout.html">Delivery Information</a>
								</li>
								<li>
									<a href="services.html">services</a>
								</li>
								<li>
									<a href="about.html">About</a>
								</li>
								<li>
									<a href="shop-grid-view.html">Top Sellers</a>
								</li>
								<li>
									<a href="blog-grid.html">Blog Grid</a>
								</li>
								<li>
									<a href="contact.html">Contact Us</a>
								</li>
							</ul>
						</div>
					</div>
					<div class="col-lg-2 col-sm-6 col-md-6">
						<div class="single-widget">
							<h3>Customer Support</h3>
							<ul class="links">
								<li>
									<a href="index.html#">Help & Ordering</a>
								</li>
								<li>
									<a href="index.html#">Order Tracking</a>
								</li>
								<li>
									<a href="index.html#">Return & Cancelation</a>
								</li>
								<li>
									<a href="index.html#">Delivery Schedule</a>
								</li>
								<li>
									<a href="contact.html">Get a Call</a>
								</li>
								<li>
									<a href="index.html#">Online Enquiry</a>
								</li>
							</ul>
						</div>
					</div>
					<div class="col-lg-4 col-sm-6 col-md-6">
						<div class="single-widget single-widget-4">
							<h3>Instagram</h3>
							<ul class="instagram">
								<li>
									<a href="index.html#">
										<img src="assets/img/instagram/1.jpg" alt="Instagram"/>
									</a>
								</li>
								<li>
									<a href="index.html#">
										<img src="assets/img/instagram/2.jpg" alt="Instagram"/>
									</a>
								</li>
								<li>
									<a href="index.html#">
										<img src="assets/img/instagram/3.jpg" alt="Instagram"/>
									</a>
								</li>
								<li>
									<a href="index.html#">
										<img src="assets/img/instagram/4.jpg" alt="Instagram"/>
									</a>
								</li>
								<li>
									<a href="index.html#">
										<img src="assets/img/instagram/5.jpg" alt="Instagram"/>
									</a>
								</li>
								<li>
									<a href="index.html#">
										<img src="assets/img/instagram/6.jpg" alt="Instagram"/>
									</a>
								</li>
							</ul>
							<ul class="social-icon">
								<li>
									<a href="https://www.facebook.com/" target="_blank">
										<i class="fa-brands fa-facebook-f"></i>
									</a>
								</li>
								<li>
									<a href="https://www.twitter.com/" target="_blank">
										<i class="fa-brands fa-x-twitter"></i>
									</a>
								</li>
								<li>
									<a href="https://www.linkedin.com/" target="_blank">
										<i class="fa-brands fa-linkedin-in"></i>
									</a>
								</li>
								<li>
									<a href="https://www.pinterest.com/" target="_blank">
										<i class="fa-brands fa-pinterest-p"></i>
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</section>

        {/* End Footer Top Area */}
        {/* Start Footer Bottom Area */}
        <footer className="footer-bottom-area">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div>
                  <p>
                    © Rimu is Proudly Owned by{" "}
                    <span className="fw-bold">EnvyTheme</span>
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <ul className="conditions">
                  <li>
                    <a href="index.html#">Terms &amp; Conditions</a>
                  </li>
                  <li>
                    <Link to="/privacy_policy">Privacy Policy</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
        {/* End Footer Bottom Area */}
      </>
    </>
  );
};

export default Footer;
