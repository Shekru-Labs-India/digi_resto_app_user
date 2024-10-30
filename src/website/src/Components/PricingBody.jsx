import React from 'react'
import { Link } from 'react-router-dom'
import png1 from "../Assets/img/product-details/1.png"
import product1 from "../Assets/img/product/1.jpg"
import product2 from "../Assets/img/product/2.jpg"
import product3 from "../Assets/img/product/3.jpg"
import product4 from "../Assets/img/product/4.jpg"

const PricingBody = () => {
  return (
    
  <>
  
  {/* Start Page Title Area */}
  <div className="page-title-area item-bg-5">
    <div className="container">
      <div className="page-title-content">
        <h2>Pricing Details</h2>
        <ul>
          <li>
            <Link to="/">
              Home
              <i className="fa fa-chevron-right" />
            </Link>
          </li>
          <li>Pricing</li>
        </ul>
      </div>
    </div>
  </div>
  {/* End Page Title Area */}

  <section className="why-choose-us-three four ptb-100">
  <div className='container'>

  <div className="section-title">
        
        <h2>Affordable Pricing</h2>
        <p>
         Manage Restaurant Operation with Digital Touch
        </p>
      </div>

  </div>
  </section>

  <>
  {/* Start Product Details Area */}
  <section className="product-details-area ptb-100">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-lg-6 col-md-12">
          <div className="product-details-image">
            <img src={png1} alt="image" />
          </div>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className="product-details-desc">
            <h3>Menumitra Pricing for Any Restaurant</h3>
            <div className="price">
              <span className="new-price">₹999 per year</span>
              
            </div>
            <div className="product-review">
              <div className="rating">
                <i className="fa fa-star" />
                <i className="fa fa-star" />
                <i className="fa fa-star" />
                <i className="fa fa-star" />
                <i className="fa fa-star-half-alt" />
              </div>
              <a href="product-details.html#" className="rating-count">
                3 reviews
              </a>
            </div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et. Lorem ipsum dolor sit
              amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et.
            </p>
            <div className="product-add-to-cart">
              <div className="input-counter">
                <span className="minus-btn">
                  <i className="fa fa-minus" />
                </span>
                <input type="text" defaultValue={1} />
                <span className="plus-btn">
                  <i className="fa fa-plus" />
                </span>
              </div>
              <button type="submit" className="default-btn">
                <i className="fa fa-cart-plus" />
                Add to Cart
              </button>
            </div>
            <div className="buy-checkbox-btn">
              <div className="item">
                <input className="inp-cbx" id="cbx" type="checkbox" />
                <label className="cbx" htmlFor="cbx">
                  <span>
                    <svg width="12px" height="10px" viewBox="0 0 12 10">
                      <polyline points="1.5 6 4.5 9 10.5 1" />
                    </svg>
                  </span>
                  <span>I agree with the terms and conditions</span>
                </label>
              </div>
              <div className="item">
                <Link href="product-details.html#" className="default-btn">
                  book free demo
                </Link>
              </div>
            </div>
            <ul className="social-icon d-flex mt-2">
              <li>
                <Link to="https://www.facebook.com/share/x5wymXr6w7W49vaQ/?mibextid=qi2Omg" target="_blank">
                  <i className="fa-brands fa-facebook-f me-2"  />
                </Link>
              </li>
              <li>
                <Link to="https://x.com/MenuMitra" target="_blank">
                  <i className="fa-brands fa-x-twitter me-2" />
                </Link>
              </li>
              <li>
                <Link to="https://www.linkedin.com/company/102429337/admin/dashboard/" target="_blank">
                  <i className="fa-brands fa-linkedin-in me-2" />
                </Link>
              </li>
              <li>
                <Link to="https://www.youtube.com/@menumitra" target="_blank">
                <i className="fa-brands fa-youtube me-2"></i>
                </Link>
              </li>
              <li>
                <Link to="https://t.me/MenuMitra" target="_blank">
                <i className="fa-brands fa-telegram me-2"></i>
                </Link>
              </li>
              <li>
                <Link to="https://www.instagram.com/menumitra/" target="_blank">
                <i className="fa-brands fa-instagram me-2 "></i>
                </Link>
              </li>
            </ul>
          </div>
        </div>
       
      </div>
    </div>
  </section>
  {/* End Product Details Area */}

  <>
  {/* Start Product Details Area */}
  <section className="product-details-area ptb-100">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-lg-6 col-md-12">
          <div className="product-details-image">
            <img src={png1} alt="image" />
          </div>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className="product-details-desc">
            <h3>Menumitra with Manage Operation kitchen and Many More</h3>
            <div className="price">
              <span className="new-price">₹14,999 per year</span>
              
            </div>
            <div className="product-review">
              <div className="rating">
                <i className="fa fa-star" />
                <i className="fa fa-star" />
                <i className="fa fa-star" />
                <i className="fa fa-star" />
                <i className="fa fa-star-half-alt" />
              </div>
              <a href="product-details.html#" className="rating-count">
                3 reviews
              </a>
            </div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et. Lorem ipsum dolor sit
              amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et.
            </p>
            <div className="product-add-to-cart">
              <div className="input-counter">
                <span className="minus-btn">
                  <i className="fa fa-minus" />
                </span>
                <input type="text" defaultValue={1} />
                <span className="plus-btn">
                  <i className="fa fa-plus" />
                </span>
              </div>
              <button type="submit" className="default-btn">
                <i className="fa fa-cart-plus" />
                Add to Cart
              </button>
            </div>
            <div className="buy-checkbox-btn">
              <div className="item">
                <input className="inp-cbx" id="cbx" type="checkbox" />
                <label className="cbx" htmlFor="cbx">
                  <span>
                    <svg width="12px" height="10px" viewBox="0 0 12 10">
                      <polyline points="1.5 6 4.5 9 10.5 1" />
                    </svg>
                  </span>
                  <span>I agree with the terms and conditions</span>
                </label>
              </div>
              <div className="item">
                <Link href="product-details.html#" className="default-btn">
                  book free demo
                </Link>
              </div>
            </div>
            <ul className="social-icon d-flex mt-2">
              <li>
                <Link to="https://www.facebook.com/share/x5wymXr6w7W49vaQ/?mibextid=qi2Omg" target="_blank">
                  <i className="fa-brands fa-facebook-f me-2"  />
                </Link>
              </li>
              <li>
                <Link to="https://x.com/MenuMitra" target="_blank">
                  <i className="fa-brands fa-x-twitter me-2" />
                </Link>
              </li>
              <li>
                <Link to="https://www.linkedin.com/company/102429337/admin/dashboard/" target="_blank">
                  <i className="fa-brands fa-linkedin-in me-2" />
                </Link>
              </li>
              <li>
                <Link to="https://www.youtube.com/@menumitra" target="_blank">
                <i className="fa-brands fa-youtube me-2"></i>
                </Link>
              </li>
              <li>
                <Link to="https://t.me/MenuMitra" target="_blank">
                <i className="fa-brands fa-telegram me-2"></i>
                </Link>
              </li>
              <li>
                <Link to="https://www.instagram.com/menumitra/" target="_blank">
                <i className="fa-brands fa-instagram me-2 "></i>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
      </div>
    </div>
  </section>
  {/* End Product Details Area */}

  <>
  {/* Start Shop Area */}
  <section className="shop-area pb-70">
    <div className="container">
      <div className="section-title">
        <h2>Our Related Product</h2>
      </div>
      <div className="row">
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="single-product-box">
            <div className="product-image">
              <img src={product2} alt="image" />
              <div className="btn-box">
                <a href="product-details.html#">
                  <i className="flaticon-shopping-cart" />
                </a>
                <a href="product-details.html#" className="link-btn">
                  <i className="flaticon-heart" />
                </a>
                <a
                  href={product2}
                  data-imagelightbox="popup-btn"
                  className="link-btn"
                >
                  <i className="flaticon-magnifying-glass" />
                </a>
              </div>
            </div>
            <div className="product-content">
              <h3>Fresh Strawberry</h3>
              <ul>
                <li>
                  <i className="fa fa-star" />
                </li>
                <li>
                  <i className="fa fa-star" />
                </li>
                <li>
                  <i className="fa fa-star" />
                </li>
                <li>
                  <i className="fa fa-star" />
                </li>
                <li>
                  <i className="fa fa-star" />
                </li>
              </ul>
              <span>$60</span>
            </div>
            <span className="product-offer">SALE</span>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="single-product-box">
            <div className="product-image">
              <img src={product1} alt="image" />
              <div className="btn-box">
                <a href="product-details.html#">
                  <i className="flaticon-shopping-cart" />
                </a>
                <a href="product-details.html#" className="link-btn">
                  <i className="flaticon-heart" />
                </a>
                <a
                  href={product1}
                  data-imagelightbox="popup-btn"
                  className="link-btn"
                >
                  <i className="flaticon-magnifying-glass" />
                </a>
              </div>
            </div>
            <div className="product-content">
              <h3>Fresh Cucumber</h3>
              <ul>
                <li>
                  <i className="fa fa-star" />
                </li>
                <li>
                  <i className="fa fa-star" />
                </li>
                <li>
                  <i className="fa fa-star" />
                </li>
                <li>
                  <i className="fa fa-star" />
                </li>
                <li>
                  <i className="fa fa-star" />
                </li>
              </ul>
              <span>$60</span>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="single-product-box">
            <div className="product-image">
              <img src={product3} alt="image" />
              <div className="btn-box">
                <a href="product-details.html#">
                  <i className="flaticon-shopping-cart" />
                </a>
                <a href="product-details.html#" className="link-btn">
                  <i className="flaticon-heart" />
                </a>
                <a
                  href={product3}
                  data-imagelightbox="popup-btn"
                  className="link-btn"
                >
                  <i className="flaticon-magnifying-glass" />
                </a>
              </div>
            </div>
            <div className="product-content">
              <h3>Fresh Grapes</h3>
              <ul>
                <li>
                  <i className="fa fa-star" />
                </li>
                <li>
                  <i className="fa fa-star" />
                </li>
                <li>
                  <i className="fa fa-star" />
                </li>
                <li>
                  <i className="fa fa-star" />
                </li>
                <li>
                  <i className="fa fa-star" />
                </li>
              </ul>
              <span>$60</span>
            </div>
            <span className="product-offer offer-10">-10%</span>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="single-product-box">
            <div className="product-image">
              <img src={product4} alt="image" />
              <div className="btn-box">
                <a href="product-details.html#">
                  <i className="flaticon-shopping-cart" />
                </a>
                <a href="product-details.html#" className="link-btn">
                  <i className="flaticon-heart" />
                </a>
                <a
                  href={product4}
                  data-imagelightbox="popup-btn"
                  className="link-btn"
                >
                  <i className="flaticon-magnifying-glass" />
                </a>
              </div>
            </div>
            <div className="product-content">
              <h3>Fresh Orange</h3>
              <ul>
                <li>
                  <i className="fa fa-star" />
                </li>
                <li>
                  <i className="fa fa-star" />
                </li>
                <li>
                  <i className="fa fa-star" />
                </li>
                <li>
                  <i className="fa fa-star" />
                </li>
                <li>
                  <i className="fa fa-star" />
                </li>
              </ul>
              <span>$60</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* End Shop Area */}
</>

</>

</>

  </>

  )
}

export default PricingBody