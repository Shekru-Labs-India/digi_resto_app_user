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
        <h2>Pricing </h2>
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

  <section className="why-choose-us-three four pt-100">
  <div className='container'>

  <div className="section-title">
        
        <h2 className="text-nowrap"> Transparent and affordable pricing
       </h2>
        <p>
        Manage restaurant operations efficiently without burning a hole in your pockets
        </p>
      </div>

  </div>
  </section>

 

  <div className="container ">
  <h2 className="text-center fw-bold mb-4 ">
        Simple and reliable POS for all your restaurant needs
      </h2>

      {/* Statistics Section */}
      <div className="row text-center">
        {/* Clients */}
        <div className="col-md-3 mb-4">
          <i className="fa-solid fa-users text-dark mb-2 fs-1"size="3x" />
     

          <h3 className="text-danger fw-bold mt-2">75000+</h3>
          <p className="text-muted">
            <strong>Clients</strong> across India, UAE, South Africa & Canada
          </p>
        </div>

        {/* Online Order Volume */}
        <div className="col-md-3 mb-4">
          <i  className="fa-solid fa-cart-shopping text-dark mb-2 fs-1" size="100"  />
          <h3 className="text-danger fw-bold mt-2">44%</h3>
          <p className="text-muted">
            <strong>Online order volume</strong> on Zomato & Swiggy orders processed by Petpooja
          </p>
        </div>

        {/* Bills Processed */}
        <div className="col-md-3 mb-4">
          <i className="fa-solid fa-receipt text-dark mb-2 fs-1"size="3x"  />
       
          <h3 className="text-danger fw-bold mt-2">60L+</h3>
          <p className="text-muted">
            <strong>Bills processed</strong> everyday hassle free with MenuMitra POS
          </p>
        </div>

        {/* Support */}
        <div className="col-md-3 mb-4">
          <i className="fa-solid fa-phone-volume text-dark mb-2 fs-1" size="3x" />
          <h3 className="text-danger fw-bold mt-2">24/7</h3>
          <p className="text-muted">
            <strong>On-call</strong> and on-site support
          </p>
        </div>
      </div>
      <div className="row pt-100">
        <div className="col-md-6">
          <h2 className="text-danger fw-bold">MM Pro</h2>
          <p className="text-muted">
            For any restaurant looking to automate their entire operation with affordable and easy-to-use software
          </p>
          <h1 className="fw-bold">₹9,999</h1>
          <p className="text-muted">/per outlet</p>

          <button className="btn btn-danger my-3">Book A Free Demo</button>
          <ul className="list-unstyled text-muted">
            <li className="mb-2">
              <i className="fa fa-check-circle text-success me-2"></i>
              Efficient cloud-based POS system that works with every OS
            </li>
            <li className="mb-2">
              <i className="fa fa-check-circle text-success me-2"></i>
              Quick and easy inventory management
            </li>
            <li className="mb-2">
              <i className="fa fa-check-circle text-success me-2"></i>
              100+ Real-time and simplified reporting
            </li>
            <li className="mb-2">
              <i className="fa fa-check-circle text-success me-2"></i>
              Seamless online ordering system
            </li>
            <li className="mb-2">
              <i className="fa fa-check-circle text-success me-2"></i>
              24x7 support
            </li>
            <li>
              <i className="fa fa-check-circle text-success me-2"></i>
              Aggregator integrations
            </li>
          </ul>
        </div>
        <div className="col-md-6">
          <h2 className="text-danger fw-bold">MenuMitra Pro Max</h2>
          <p className="text-muted">
            Power up your MenuMitra Core with features that simplify your kitchen operations, customer management, and staff responsibilities.
          </p>
          <h1 className="fw-bold">₹14,999*</h1>
          <p className="text-muted">per year / per outlet</p>
          <button className="btn btn-danger my-3">Book A Free Demo</button>

          {/* Features List */}
          <ul className="list-unstyled text-muted">
            <li className="mb-2">
              <i className="fa fa-check-circle text-info me-2"></i>
              Holistic and easy-to-use tech solution
            </li>
            <li className="mb-2">
              <i className="fa fa-check-circle text-info me-2"></i>
              Works in perfect sync with POS
            </li>
            <li>
              <i className="fa fa-check-circle text-info me-2"></i>
              Android and Windows-based apps for multiple devices
            </li>
          </ul>
        </div>
      </div>
      <div className="alert alert-light text-muted text-center bg-light mt-4">
        <strong>Note:</strong> The prices mentioned on the page are exclusive of GST & only for the outlets in India.
      </div>

      {/* Header */}
      
    </div>


   


    <div className="container mt-5">
      {/* Header */}
      <h2 className="text-center fw-bold mb-5">Trusted by some of the best restaurants</h2>

      {/* Testimonials */}
      <div className="row">
        {/* Testimonial 1 */}
        <div className="col-md-6 mb-4">
          <div className="p-3 border rounded bg-white">
            <div className="d-flex align-items-center mb-2">
              
              <p className="mb-0">
                MenuMitra has been the POS solution for our 90+ outlets for over two years. And these numbers are proof
                of how content we are with their services. Especially for a large chain like us, MenuMitra is the
                one-point data bridge between all the outlets and the owner. Kudos to the team. Recommending MenuMitra to
                everyone!
              </p>
            </div>
            <div className="text-end mt-3">
              <div>
                <strong>Jolly Christian</strong>
                <p className="mb-0 text-muted">General Manager</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial 2 */}
        <div className="col-md-6 mb-4">
          <div className="p-3 border rounded bg-white">
            <div className="d-flex align-items-center mb-2">
              
              <p className="mb-0">
                MenuMitra has helped me to manage inventory levels and food costs. I can track sales and expenses in real
                time, which helps me make informed decisions about purchasing and pricing. The system also provides
                detailed reports, which has helped me reduce waste and optimize my inventory. Overall, I am extremely
                satisfied with MenuMitra and highly recommend it to anyone looking to streamline their operations and
                improve their bottom line.
              </p>
            </div>
            <div className="text-end mt-3">
             
              <div>
                <strong>Jaipratap Singh</strong>
                <p className="mb-0 text-muted">Managing Director</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Icons Section */}
      <div className="row text-center mt-5">
        <div className="col-md-4 mb-4">
        <i className="fa-solid fa-hand-holding-dollar fs-1 mb-3"></i>

          <h6 className="fw-bold"><span className="text-danger">Less</span> than daily cost of chai</h6>
        </div>
        <div className="col-md-4 mb-4">
        <i className="fa-solid fa-money-bill-1-wave fs-1 mb-3"></i>
          <h6 className="fw-bold">Constant & <span className="text-danger">fix</span> pricing</h6>
        </div>
        <div className="col-md-4 mb-4">
        <i className="fa-solid fa-computer fs-1 mb-3"></i>

          <h6 className="fw-bold"><span className="text-danger">No</span> new hardware required</h6>
        </div>
      </div>
    </div>
  </>

  )
}

export default PricingBody