import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../Assets/img/MenuMitra.png'
import jpg1 from '../Assets/img/instagram/1.jpg'
import jpg2 from '../Assets/img/instagram/2.jpg'
import jpg3 from '../Assets/img/instagram/3.jpg'
import jpg4 from '../Assets/img/instagram/4.jpg'
import jpg5 from '../Assets/img/instagram/5.jpg'
import jpg6 from '../Assets/img/instagram/6.jpg'

const Footer = () => {
  return (
    
  <>
  <>
  <section className="footer-top-area pt-100 pb-70">
    <div className="container">
      <div className="row">
        <div className="col-lg-4 col-sm-6 col-md-6">
          <div className="single-widget">
          <div>
            <Link to="/">
              <img src={logo} alt="Rimu-Logo" width="60" height="60"/>
            </Link>
            
             <Link className='ms-3' to="/">
             <h4>
              Menumitra
             </h4>
             </Link>
            </div>
            <p>
            MenuMitra is a digital menu app enabling contactless ordering, real-time menu updates, and inventory management. Guests can customize orders, track status, and pay easily via multiple options. With promotion tools and feedback features, it enhances customer satisfaction, streamlines operations, and provides a modern dining experience for restaurants.
            </p>
            <ul className="address">
              <li>
                <i className="fa fa-map-marker" />
                Muktangan English School & Jr College, office No. 6, 2 Floor manogat, Parvati, Pune, Maharashtra 411009
              </li>
              <li>
                <i className="fa fa-envelope" />
                <a href="../../cdn-cgi/l/email-protection#650d0009090a25170c08104b060a08">
                  <span
                    className="__cf_email__"
                    data-cfemail="0f676a6363604f7d66627a216c6062"
                  >
                    shekrulabs@gmail.com
                  </span>
                </a>
              </li>
              <li>
                <i className="fa fa-phone" />
                <a href="tel:123456123">+91 7776827177</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-lg-2 col-sm-6 col-md-6">
          <div className="single-widget">
            <h3>Information</h3>
            <ul className="links">
              <li>
                <a href="checkout.html">Delivery Information</a>
              </li>
              <li>
                <a href="services.html">services</a>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <a href="shop-grid-view.html">Top Sellers</a>
              </li>
              <li>
                <a href="blog-grid.html">Blog Grid</a>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-lg-2 col-sm-6 col-md-6">
          <div className="single-widget">
            <h3>Customer Support</h3>
            <ul className="links">
              <li>
                <a href="index.html#">Help &amp; Ordering</a>
              </li>
              <li>
                <a href="index.html#">Order Tracking</a>
              </li>
              <li>
                <a href="index.html#">Return &amp; Cancelation</a>
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
        <div className="col-lg-4 col-sm-6 col-md-6">
          <div className="single-widget single-widget-4">
            <h3>Instagram</h3>
            <ul className="instagram">
              <li>
                <a href="index.html#">
                  <img src={jpg1} alt="Instagram" />
                </a>
              </li>
              <li>
                <a href="index.html#">
                  <img src={jpg2} alt="Instagram" />
                </a>
              </li>
              <li>
                <a href="index.html#">
                  <img src={jpg3} alt="Instagram" />
                </a>
              </li>
              <li>
                <a href="index.html#">
                  <img src={jpg4} alt="Instagram" />
                </a>
              </li>
              <li>
                <a href="index.html#">
                  <img src={jpg5} alt="Instagram" />
                </a>
              </li>
              <li>
                <a href="index.html#">
                  <img src={jpg6} alt="Instagram" />
                </a>
              </li>
            </ul>
            <ul className="social-icon">
              <li>
                <Link to="https://www.facebook.com/share/x5wymXr6w7W49vaQ/?mibextid=qi2Omg" target="_blank">
                  <i className="fa-brands fa-facebook-f" />
                </Link>
              </li>
              <li>
                <Link to="https://x.com/MenuMitra" target="_blank">
                  <i className="fa-brands fa-x-twitter" />
                </Link>
              </li>
              <li>
                <Link to="https://www.linkedin.com/company/102429337/admin/dashboard/" target="_blank">
                  <i className="fa-brands fa-linkedin-in" />
                </Link>
              </li>
              <li>
                <Link to="https://www.youtube.com/@menumitra" target="_blank">
                <i className="fa-brands fa-youtube"></i>
                </Link>
              </li>
              <li>
                <Link to="https://t.me/MenuMitra" target="_blank">
                <i className="fa-brands fa-telegram"></i>
                </Link>
              </li>
              <li>
                <Link to="https://www.instagram.com/menumitra/" target="_blank">
                <i className="fa-brands fa-instagram"></i>
                </Link>
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
              <a href="index.html#">Privacy Policy</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
  {/* End Footer Bottom Area */}
</>

  </>

  )
}

export default Footer