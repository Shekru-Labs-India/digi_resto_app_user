import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Faq = () => {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      {/* Header */}
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <div onClick={() => navigate(-1)} className="back-btn dz-icon icon-fill icon-sm">
              <i className="bx bx-arrow-back"></i>
            </div>
          </div>
          <div className="mid-content"><h5 className="title">FAQ's</h5></div>
          <div className="right-content"></div>
        </div>
      </header>
      {/* Header */}

      {/* Main Content Start */}
      <main className="page-content space-top">
        <div className="container">
          <div className="accordion dz-accordion style-2" id="accordionFaq1">
            <div className="accordion-item wow fadeInUp" data-wow-delay="0.4s">
              <h2 className="accordion-header" id="heading1">
                <button className="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="true" aria-controls="collapse1">
                How do I place an order on the website?

                </button>
              </h2>
              <div id="collapse1" className="accordion-collapse collapse show" aria-labelledby="heading1" data-bs-parent="#accordionFaq1">
                <div className="accordion-body">
                  <p className="m-b0">To place an order, simply scan the QR code at the restaurant or hotel, browse the menu categories, select items, add them to your cart, and proceed to checkout.

.</p>
                </div>
              </div>
            </div>
            <div className="accordion-item wow fadeInUp" data-wow-delay="0.6s">
              <h2 className="accordion-header" id="heading2">
                <button className="accordion-button " data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="true" aria-controls="collapse2">
                What steps are involved in creating orders using the User App?

                </button>
              </h2>
              <div id="collapse2" className="accordion-collapse collapse show" aria-labelledby="heading2" data-bs-parent="#accordionFaq1">
                <div className="accordion-body">
                  <p className="m-b0"> To create orders, simply browse the menu, select desired items, customize as needed, and proceed to checkout.
</p>
                </div>
              </div>
            </div>
            <div className="accordion-item wow fadeInUp" data-wow-delay="0.8s">
              <h2 className="accordion-header" id="heading3">
                <button className="accordion-button " data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="true" aria-controls="collapse3">
                Can I track the delivery status of my orders through the User App?

                </button>
              </h2>
              <div id="collapse3" className="accordion-collapse collapse show" aria-labelledby="heading3" data-bs-parent="#accordionFaq1">
                <div className="accordion-body">
                  <p className="m-b0">Yes, the app provides real-time tracking of your orders from preparation to delivery, ensuring transparency and convenience.
</p>
                </div>
              </div>
            </div>
            <div className="accordion-item wow fadeInUp" data-wow-delay="0.8s">
              <h2 className="accordion-header" id="heading4">
                <button className="accordion-button " data-bs-toggle="collapse" data-bs-target="#collapse4" aria-expanded="true" aria-controls="collapse4">
                Can I provide additional instructions or notes for my orders through the User App?

                </button>
              </h2>
              <div id="collapse4" className="accordion-collapse collapse show" aria-labelledby="heading4" data-bs-parent="#accordionFaq1">
                <div className="accordion-body">
                  <p className="m-b0">Yes, you can add specific instructions or notes for your orders, ensuring that your preferences are communicated to the restaurant.
</p>
                </div>
              </div>
            </div>
            <div className="accordion-item wow fadeInUp" data-wow-delay="1s">
              <h2 className="accordion-header" id="heading55">
                <button className="accordion-button " data-bs-toggle="collapse" data-bs-target="#collapse55" aria-expanded="true" aria-controls="collapse55">
                Can I customize my order?
                </button>
              </h2>
              <div id="collapse55" className="accordion-collapse collapse show" aria-labelledby="heading55" data-bs-parent="#accordionFaq1">
                <div className="accordion-body">
                  <p className="m-b0">Yes, you can customize your order by adding special instructions or selecting specific ingredients based on your preferences.
</p>
                </div>
              </div>
            </div>
            <div className="accordion-item wow fadeInUp" data-wow-delay="1.2s">
              <h2 className="accordion-header" id="heading5">
                <button className="accordion-button " data-bs-toggle="collapse" data-bs-target="#collapse5" aria-expanded="true" aria-controls="collapse5">What payment options are available?
                </button>
              </h2>
              <div id="collapse5" className="accordion-collapse collapse show" aria-labelledby="heading5" data-bs-parent="#accordionFaq1">
                <div className="accordion-body">
                  <p className="m-b0">We accept various payment methods including credit cards, online payment gateways, and cash on delivery for your convenience.
</p>
                </div>
              </div>
            </div>
            <div className="accordion-item wow fadeInUp" data-wow-delay="1.4s">
              <h2 className="accordion-header" id="heading6">
                <button className="accordion-button " data-bs-toggle="collapse" data-bs-target="#collapse6" aria-expanded="true" aria-controls="collapse6">How can I track the status of my order?
                </button>
              </h2>
              <div id="collapse6" className="accordion-collapse collapse show" aria-labelledby="heading6" data-bs-parent="#accordionFaq1">
                <div className="accordion-body">
                  <p className="m-b0">You can track your order status on the website. Once your order is placed, you'll receive updates on its preparation and delivery progress.
</p>
                </div>
              </div>
            </div>
            {/* <div className="accordion-item wow fadeInUp" data-wow-delay="1.6s">
              <h2 className="accordion-header" id="heading7">
                <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapse7" aria-expanded="false" aria-controls="collapse7">How can I get started with Plantzone?
                </button>
              </h2>
              <div id="collapse7" className="accordion-collapse collapse" aria-labelledby="heading7" data-bs-parent="#accordionFaq1">
                <div className="accordion-body">
                  <p className="m-b0">To get started, purchase and download the Plantzone template. Then, follow the included documentation to set up and customize your e-commerce website based on your specific requirements.</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </main>
      {/* Main Content End */}
    </div>
  );
};

export default Faq;
