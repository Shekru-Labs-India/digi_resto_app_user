import React from 'react'

import choseus from "../Assets/img/choose-us-img-four.png"
import menumitrapng from "../Assets/img/MenuMItra Key Features.png"

const Feature = () => {
  return (
    
    
  <>
   <>
  {/* Start Page Title Area */}
  <div className="page-title-area item-bg-1">
    <div className="container">
      <div className="page-title-content">
        <h2>Features</h2>
        <ul>
          <li>
            <a href="/">
              Home
              <i className="fa fa-chevron-right" />
            </a>
          </li>
          <li>Features</li>
        </ul>
      </div>
    </div>
  </div>
  {/* End Page Title Area */}
  {/* Start Why Choose Us Three Area */}
  <section className="why-choose-us-three four ptb-100">
    <div className="container">
      <div className="section-title">
        <span> Why Choose Us</span>
        <h2>Benefits of Menumitra for Your Restaurant</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum
          suspendisse ultrices gravida.
        </p>
      </div>
      <div className="row align-items-center">
        <div className="col-lg-3">
          <div className="row">
            <div className="col-lg-12 col-md-6 p-0">
              <div className="single-choose-three mr-2">
                <i className="icon flaticon-plant" />
                <h3>Contactless Ordering</h3>
                <p>Our app offers contactless ordering via QR code, with easy menu browsing.</p>
              </div>
            </div>
            <div className="col-lg-12 col-md-6 p-0">
              <div className="single-choose-three ml-2 ">
                <i className="icon flaticon-plant" />
                <h3>Order Customization</h3>
                <p>Add/remove ingredients or customize dishes spice level, vegan</p>
              </div>
            </div>
            <div className="col-lg-12 p-0 col-md-6 offset-md-3 offset-lg-0">
              <div className="single-choose-three">
                <i className="icon flaticon-plant" />
                <h3>Order Status</h3>
                <p>Notifications for order confirmation, preparation, and delivery to the table.</p>
              </div>
            </div>
            <div className="col-lg-12 p-0 col-md-6 offset-md-3 offset-lg-0">
              <div className="single-choose-three">
                <i className="icon flaticon-plant" />
                <h3>Multiple Payment Options</h3>
                <p>Integration with credit cards, digital wallets (Google Pay, Apple Pay).</p>
              </div>
            </div>
            <div className="col-lg-12 p-0 col-md-6 offset-md-3 offset-lg-0">
              <div className="single-choose-three">
                <i className="icon flaticon-plant" />
                <h3>Category Management</h3>
                <p>Organizes menu items into clear sections for easy guest navigation.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="choose-img-three four">
            <img src={choseus} alt="" />
            <div className="choose-content-wrap">
              <div className="choose-content-four">
                <h3>Farm Foods</h3>
                <span>Healthy Life with Organic Food</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="row">
            <div className="col-lg-12 col-md-6 p-0">
              <div className="single-choose-three mr-2">
                <i className="icon flaticon-plant" />
                <h3>Menu Management</h3>
                <p>The app enables real-time menu updates, showcases special offers, and adds images for enhanced visual appeal.</p>
              </div>
            </div>
            <div className="col-lg-12 col-md-6 p-0">
              <div className="single-choose-three ml-2">
                <i className="icon flaticon-plant" />
                <h3>Inventory Management</h3>
                <p>Monitor ingredient levels and notify when stock is running low.
                Auto-update menu based on available ingredients </p>
              </div>
            </div>
            <div className="col-lg-12col-md-6 offset-md-3 offset-lg-0 p-0">
              <div className="single-choose-three">
                <i className="icon flaticon-plant" />
                <h3>Staff Management</h3>
                <p>Set roles and permissions for hotel staff [kitchen, waitstaff, admin). </p>
              </div>
            </div>
            <div className="col-lg-12col-md-6 offset-md-3 offset-lg-0 p-0">
              <div className="single-choose-three">
                <i className="icon flaticon-plant" />
                <h3>Promotion & Marketing Tools</h3>
                <p>Create and launch discount campaigns or special offers directly in the app </p>
              </div>
            </div>
            <div className="col-lg-12col-md-6 offset-md-3 offset-lg-0 p-0">
              <div className="single-choose-three">
                <i className="icon flaticon-plant" />
                <h3>Ratings & Feedback</h3>
                <p>Leave ratings or comments for menu items 
                and service </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* End Why Choose Us Three Area */}
</>

  </>

  )
}

export default Feature