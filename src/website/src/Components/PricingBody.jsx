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

  <section className="why-choose-us-three four pt-100">
  <div className='container'>

  <div className="section-title">
        
        <h2> Transparent and affordable pricing
       </h2>
        <p>
        Manage restaurant operations efficiently without burning a hole in your pockets
        </p>
      </div>

  </div>
  </section>

 

  <div className="container ">
      <div className="row">
        <div className="col-md-6">
          <h2 className="text-danger fw-bold">MenuMitra Pro</h2>
          <p className="text-muted">
            For any restaurant looking to automate their entire operation with affordable and easy-to-use software
          </p>
          <h1 className="fw-bold">₹9,999*</h1>
          <p className="text-muted">first year/per outlet</p>
          <p className="text-muted">+₹7,000* renewal from next year</p>
          <button className="btn btn-danger my-3">Book A Free Demo</button>
          <ul className="list-unstyled text-muted">
            <li className="mb-2">
              <i className="fa fa-check-circle  me-2"></i>
              Efficient cloud-based POS system that works with every OS
            </li>
            <li className="mb-2">
              <i className="fa fa-check-circle  me-2"></i>
              Quick and easy inventory management
            </li>
            <li className="mb-2">
              <i className="fa fa-check-circle  me-2"></i>
              100+ Real-time and simplified reporting
            </li>
            <li className="mb-2">
              <i className="fa fa-check-circle  me-2"></i>
              Seamless online ordering system
            </li>
            <li className="mb-2">
              <i className="fa fa-check-circle  me-2"></i>
              24x7 support
            </li>
            <li>
              <i className="fa fa-check-circle  me-2"></i>
              Aggregator integrations
            </li>
          </ul>
        </div>
        <div className="col-md-6">
  <img 
    src="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Petpooja-POS-core.webp" 
    alt="Petpooja POS Core" 
    className="img-fluid" 
  />
</div>
      </div>
      <div className="alert alert-light text-muted text-center bg-light mt-4">
        <strong>Note:</strong> The prices mentioned on the page are exclusive of GST & only for the outlets in India. Please contact us for details of outlets located outside India.
      </div>

      {/* Header */}
      <h2 className="text-center fw-bold mb-4 pt-100">
        Simple and reliable POS for all your restaurant needs
      </h2>

      {/* Statistics Section */}
      <div className="row text-center">
        {/* Clients */}
        <div className="col-md-3 mb-4">
          <i className="fa-solid fa-users text-dark mb-2"size="3x" />
     

          <h3 className="text-danger fw-bold mt-2">75000+</h3>
          <p className="text-muted">
            <strong>Clients</strong> across India, UAE, South Africa & Canada
          </p>
        </div>

        {/* Online Order Volume */}
        <div className="col-md-3 mb-4">
          <img  className="fa-solid fa-cart-shopping text-dark mb-2" size="100"  />
          <h3 className="text-danger fw-bold mt-2">44%</h3>
          <p className="text-muted">
            <strong>Online order volume</strong> on Zomato & Swiggy orders processed by Petpooja
          </p>
        </div>

        {/* Bills Processed */}
        <div className="col-md-3 mb-4">
          <i className="fa-solid fa-receipt text-dark mb-2"size="3x"  />
       
          <h3 className="text-danger fw-bold mt-2">60L+</h3>
          <p className="text-muted">
            <strong>Bills processed</strong> everyday hassle free with MenuMitra POS
          </p>
        </div>

        {/* Support */}
        <div className="col-md-3 mb-4">
          <i className="fa-solid fa-phone-volume text-dark mb-2" size="3x" />
          <h3 className="text-danger fw-bold mt-2">24/7</h3>
          <p className="text-muted">
            <strong>On-call</strong> and on-site support
          </p>
        </div>
      </div>
    </div>


    <div className="container">
      <div className="row align-items-center">
        {/* Image Section */}
        <div className="col-md-6 text-center">
          <img
            src="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Petpooja-Plus_md.webp"
            alt="MenuMitra Pro Max Illustration"
            className="img-fluid"
          />
        </div>

        {/* Content Section */}
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
              <i className="fa fa-check-circle  me-2"></i>
              Holistic and easy-to-use tech solution
            </li>
            <li className="mb-2">
              <i className="fa fa-check-circle me-2"></i>
              Works in perfect sync with POS
            </li>
            <li>
              <i className="fa fa-check-circle me-2"></i>
              Android and Windows-based apps for multiple devices
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className="container mt-5">
      <div className="row align-items-center">
        {/* Content Section */}
        <div className="col-md-6">
          <h2 className="text-danger fw-bold">MenuMitra Scale Plan</h2>
          <p className="text-muted">
            A power-packed kit to help you automate your daily operations, data & invoice management, staff management, and much more
          </p>
          <h1 className="fw-bold">₹30,000*</h1>
          <p className="text-muted">per year / per outlet</p>
          <button className="btn btn-danger my-3">Book A Free Demo</button>

          {/* Features List */}
          <ul className="list-unstyled text-muted">
            <li className="mb-2">
              <i className="fa fa-check-circle text-success me-2"></i>
              Kit for complete business automation
            </li>
            <li className="mb-2">
              <i className="fa fa-check-circle text-success me-2"></i>
              Cloud-based advanced solutions
            </li>
            <li>
              <i className="fa fa-check-circle text-success me-2"></i>
              Android and Windows-based apps
            </li>
          </ul>
        </div>

        {/* Image Section */}
        <div className="col-md-6 text-center">
          <div className="d-flex justify-content-center align-items-center flex-wrap">
            <img
              src="https://d28ewddc5mocr5.cloudfront.net/images/pricing/petpooja-scale.webp"
              alt="MenuMitra Features Illustration"
              className="img-fluid mb-3"
              style={{ maxWidth: '90%' }}
            />
            {/* Add additional images or components here if needed */}
          </div>
        </div>
      </div>
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
              <img
                src="https://d28ewddc5mocr5.cloudfront.net/images/testimonial/United-farmers-creamery.webp" // Replace with the actual image URL
                alt="Sam's Pizza Logo"
                className="me-3"
                style={{ maxWidth: '100px' }}
              />
              <p className="mb-0">
                MenuMitra has been the POS solution for our 90+ outlets for over two years. And these numbers are proof
                of how content we are with their services. Especially for a large chain like us, MenuMitra is the
                one-point data bridge between all the outlets and the owner. Kudos to the team. Recommending MenuMitra to
                everyone!
              </p>
            </div>
            <div className="d-flex align-items-center mt-3">
              <img
                src="https://d28ewddc5mocr5.cloudfront.net/images/testimonial/Jaipratap-Singh-cloud-kitchen.webp" // Replace with the actual profile image URL
                alt="Jolly Christian"
                className="rounded-circle me-2"
                style={{ width: '40px', height: '40px' }}
              />
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
              <img
                src="https://d28ewddc5mocr5.cloudfront.net/images/testimonial/United-farmers-creamery.webp" // Replace with the actual image URL
                alt="United Tastes Logo"
                className="me-3"
                style={{ maxWidth: '100px' }}
              />
              <p className="mb-0">
                MenuMitra has helped me to manage inventory levels and food costs. I can track sales and expenses in real
                time, which helps me make informed decisions about purchasing and pricing. The system also provides
                detailed reports, which has helped me reduce waste and optimize my inventory. Overall, I am extremely
                satisfied with MenuMitra and highly recommend it to anyone looking to streamline their operations and
                improve their bottom line.
              </p>
            </div>
            <div className="d-flex align-items-center mt-3">
              <img
                src="https://d28ewddc5mocr5.cloudfront.net/images/testimonial/Jaipratap-Singh-cloud-kitchen.webp" // Replace with the actual profile image URL
                alt="Jaipratap Singh"
                className="rounded-circle me-2"
                style={{ width: '40px', height: '40px' }}
              />
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
          <img
            src="https://d28ewddc5mocr5.cloudfront.net/images/testimonial/United-farmers-creamery.webp" // Replace with your icon image
            alt="Chai Cost Icon"
            className="mb-2"
          />
          <h6 className="fw-bold">Less than daily cost of chai</h6>
        </div>
        <div className="col-md-4 mb-4">
          <img
            src="https://d28ewddc5mocr5.cloudfront.net/images/testimonial/United-farmers-creamery.webp" // Replace with your icon image
            alt="Pricing Icon"
            className="mb-2"
          />
          <h6 className="fw-bold">Constant & fix pricing</h6>
        </div>
        <div className="col-md-4 mb-4">
          <img
            src="https://d28ewddc5mocr5.cloudfront.net/images/testimonial/United-farmers-creamery.webp" // Replace with your icon image
            alt="No Hardware Icon"
            className="mb-2"
          />
          <h6 className="fw-bold">No new hardware required</h6>
        </div>
      </div>
    </div>
  </>

  )
}

export default PricingBody