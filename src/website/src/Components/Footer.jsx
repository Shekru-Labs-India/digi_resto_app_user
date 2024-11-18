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
      <section className="footer-top-area pt-100 pb-70">
			<div className="container">
				<div className="row">
					<div className="col-lg-4 col-sm-6 col-md-6">
						<div className="single-widget">
							<Link to="/">
								<img src={logo} alt="Rimu-Logo"  width="60" height="60"/>
							</Link>
							<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit cupiditate ad quisquam ratione, unde exercitationem ducimus dolor sit amet consectetur adipisicing.</p>
							<ul className="address">
								<li>
									<i className="fa fa-map-marker"></i>
									123, Western Road, Melbourne Australia
								</li>
								<li>
									<i className="fa fa-envelope"></i>
									<a href="../../cdn-cgi/l/email-protection#650d0009090a25170c08104b060a08"><span className="__cf_email__" data-cfemail="0f676a6363604f7d66627a216c6062">[email&#160;protected]</span></a>
								</li>
								<li>
									<i className="fa fa-phone"></i>
									<a href="tel:123456123">+123(456)123</a>
								</li>
							</ul>
							<ul className="social-icon">
								<li>
									<a href="https://www.facebook.com/" target="_blank">
										<i className="fa-brands fa-facebook-f"></i>
									</a>
								</li>
								<li>
									<a href="https://www.facebook.com/" target="_blank">
										<i className="fa-brands fa-facebook-f"></i>
									</a>
								</li>
								
								<li>
									<a href="https://www.linkedin.com/" target="_blank">
										<i className="fa-brands fa-linkedin-in"></i>
									</a>
								</li>
								<li>
									<a href="https://www.pinterest.com/" target="_blank">
										<i className="fa-brands fa-pinterest-p"></i>
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="col-lg-2 col-sm-6 col-md-6">
						<div className="single-widget">
							<h3>Link</h3>
							<ul className="links">
								<li>
									<Link to="/">Home</Link>
								</li>
								<li>
									<Link to="/">Features</Link>
								</li>
								<li>
									<Link to="/">Pricing</Link>
								</li>
								<li>
									<Link to="/">About</Link>
								</li>
								<li>
									<Link to="/">Contact </Link>
								</li>
								<li >
                      <Link
                        to="/user_app/Index"
                       
                      >
                        User App
                      </Link>
                    </li>
								
							</ul>
						</div>
					</div>
					<div className="col-lg-2 col-sm-6 col-md-6">
						<div className="single-widget">
							<h3>Customer Support</h3>
							<ul className="links">
								<li>
									<a href="index.html#">Get a demo</a>
								</li>
								<li>
									<a href="index.html#">Enquiry</a>
								</li>
								<li>
									<a href="index.html#">Help and suppport</a>
								</li>
								<li>
									<a href="index.html#">Order Tracking</a>
								</li>
								<li>
									<a href="contact.html">Get a Call</a>
								</li>
								
							</ul>
						</div>
					</div>
					<div className="col-lg-4 col-sm-6 col-md-6">
						<div className="single-widget single-widget-4">
							<h3>Legal</h3>
							<ul className="links">
								<li>
									<Link to="/terms_conditions">Terms and Conditions</Link>
								</li>
								<li>
									<Link to="/privacy_policy">Privacy Policy</Link>
								</li>
								<li>
									<Link to="/cookie_policy">Cookie Policy</Link>
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
                    <Link to="/terms_conditions">Terms &amp; Conditions</Link>
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
