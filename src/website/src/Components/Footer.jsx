import React from "react";
import { Link } from "react-router-dom";
import logo from "../Assets/img/mm-logo-bg-fill.png";
import footerbg from "../Assets/img/footerbg.png"

const Footer = () => {
  return (
    <>
      <>
	  
      <section className="footer-top-area  border border-top shadow-lg  pt-100 "   style={{
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
      <p>
Your menus are available digitally and on your own website, letting you reduce costs and keeping your menu up-to-date in an easy and inexpensive way.</p>
     
     
     
<ul className="address">
        <li>
          <i className="fa fa-map-marker" />
          <span>Muktangan English School & Jr College, office No. 6, 2 Floor manogat, Parvati, Pune, Maharashtra 411009</span>
        </li>
        <li>
          <i className="fa fa-envelope" />
          <a href="mailto:info@menumitra.com">
            info@menumitra.com
          </a>
        </li>
        <li>
          <i className="fa fa-phone" />
          <a href="tel:+919172530151">+91 9172530151</a>
        </li>
      </ul>
      <ul className="social-icon d-flex justify-content-left">
        <li>
          <Link to="https://www.facebook.com/share/x5wymXr6w7W49vaQ/?mibextid=qi2Omg" target="_blank" rel="noreferrer">
            <i className="fa-brands fa-facebook-f"></i>
          </Link>
        </li>
        <li>
          <Link to="https://www.linkedin.com/company/102429337/admin/dashboard/" target="_blank" rel="noreferrer">
            <i className="fa-brands fa-linkedin-in"></i>
          </Link>
        </li>
        <li>
          <Link to="https://www.youtube.com/@menumitra" target="_blank" rel="noreferrer">
            <i className="fa-brands fa-youtube"></i>
          </Link>
        </li>
        <li>
          <Link to="https://t.me/MenuMitra" target="_blank" rel="noreferrer">
            <i className="fa-brands fa-telegram"></i>
          </Link>
        </li>
        <li>
          <Link to="https://www.instagram.com/menumitra/" target="_blank" rel="noreferrer">
            <i className="fa-brands fa-instagram"></i>
          </Link>
        </li>
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
              
               <div className="container pb-0">
          <div className="row ">
            <div className="col-12 text-center">
              <p className="mb-0">
                All trademarks and logos belong to their respective owners and are hereby acknowledged.
              </p>
            </div>
          </div>
          <hr className="border-white mt-0" />
        </div>
        <footer className="footer-bottom-area">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6 text-center text-lg-start">
                <p className="mb-0">
                  Copyright © 2024
                </p>
              </div>
              <div className="col-lg-6 col-md-6 text-center ">
                <p className="conditions mb-0">
                <i className="fa-solid fa-bolt"></i> Powered by
                  <span className="fw-bold ms-2">
                    <a href="https://www.shekruweb.com" target="_blank" rel="noopener noreferrer">
                      Shekru Labs India Pvt. Ltd.
                    </a>
                  </span>
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
