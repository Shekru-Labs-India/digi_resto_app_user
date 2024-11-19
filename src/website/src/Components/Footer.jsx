import React from "react";
import { Link } from "react-router-dom";
import logo from "../Assets/img/mm-logo-bg-fill.png";
import footerbg from "../Assets/img/footerbg.png"

const Footer = () => {
  return (
    <>
      <>
	  
      <section className="footer-top-area  border border-top shadow-lg  pt-100 pb-70"   style={{
        backgroundImage: `url(${footerbg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
		
      }}>
		
			<div className="container">
			<div className="row">
  {/* MenuMitra Section */}
  <div className="col-lg-4 col-sm-6 col-md-6 mb-3">
    <div className="single-widget">
      <Link to="/">
        <img src={logo} alt="Rimu-Logo" width="60" height="60" />
      </Link>
      <Link className="ms-3" to="/">
        <div className="fs-2 fw-semibold text-dark">MenuMitra</div>
      </Link>
      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit cupiditate ad quisquam ratione, unde exercitationem ducimus dolor sit amet consectetur adipisicing.</p>
      <ul className="address">
        <li><i className="fa fa-map-marker"></i> 123, Western Road, Melbourne Australia</li>
        <li><i className="fa fa-envelope"></i>
          <a href="../../cdn-cgi/l/email-protection#650d0009090a25170c08104b060a08">
            <span className="__cf_email__" data-cfemail="0f676a6363604f7d66627a216c6062">[email&#160;protected]</span>
          </a>
        </li>
        <li><i className="fa fa-phone"></i> <a href="tel:123456123">+123(456)123</a></li>
      </ul>
      <ul className="social-icon d-flex justify-content-center">
        <li><a href="https://www.facebook.com/" target="_blank" rel="noreferrer"><i className="fa-brands fa-facebook-f"></i></a></li>
        <li><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin-in"></i></a></li>
        <li><a href="https://www.pinterest.com/" target="_blank" rel="noreferrer"><i className="fa-brands fa-pinterest-p"></i></a></li>
      </ul>
    </div>
  </div>

  {/* Links and Customer Section - Display Side by Side in Mobile */}
  <div className="col-lg-4 col-sm-12 d-flex  flex-wrap">
    {/* Links Section */}
    <div className="col-6 mb-3">
      <div className="single-widget">
        <h3>Link</h3>
        <ul className="links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/features">Features</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/user_app/Index">User App</Link></li>
        </ul>
      </div>
    </div>

    {/* Customer Section */}
    <div className="col-6 mb-3">
      <div className="single-widget">
        <h3>Customer</h3>
        <ul className="links">
          <li><a href="index.html#">Get a demo</a></li>
          <li><a href="index.html#">Enquiry</a></li>
          <li><a href="index.html#">Help and support</a></li>
          <li><a href="index.html#">Order Tracking</a></li>
          <li><a href="contact.html">Get a Call</a></li>
        </ul>
      </div>
    </div>
  </div>

  {/* Legal Section */}
  <div className="col-lg-4 col-sm-6 col-md-6 mb-3">
    <div className="single-widget single-widget-4">
      <h3>Legal</h3>
      <ul className="links">
        <li><Link to="/terms_conditions">Terms and Conditions</Link></li>
        <li><Link to="/privacy_policy">Privacy Policy</Link></li>
        <li><Link to="/cookie_policy">Cookie Policy</Link></li>
		<li><Link to="/request_data_removal">Request Data Removal</Link></li>
		
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
				  All trademarks and logos belong to their respective owners and are hereby acknowledged. Copyright 2024.
				 
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
               
				<p className="conditions">
			   <i className="ri-flashlight-fill "></i> Powered by
                    <span className="fw-bold ms-2"><a
              className=" "
              href="https://www.shekruweb.com"
              target="_blank"
            >
              Shekru Labs India Pvt. Ltd.
            </a></span>
			   </p>
                
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
