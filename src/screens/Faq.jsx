import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Faq = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      {/* <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <div
              onClick={() => navigate(-1)}
              className="back-btn dz-icon icon-fill icon-sm"
            >
              <i className="bx bx-arrow-back"></i>
            </div>
          </div>
          <div className="mid-content">
            <h5 className="title">FAQ's</h5>
          </div>
          <div className="right-content"></div>
        </div>
      </header> */}
      {/* Header */}

      {/* Main Content Start */}
      <main className="page-content space-top">
        <div className="container">
          <div className="accordion dz-accordion style-2" id="accordionFaq1">
            <div className="accordion-item wow fadeInUp" data-wow-delay="0.6s">
              <h2 className="accordion-header" id="heading2">
                <div className="row">
                  <div className="col-8">
                    <div
                      className={`accordion-button ${
                        activeIndex === 2 ? "" : "collapsed"
                      }`}
                      onClick={() => toggleAccordion(2)}
                      aria-expanded={activeIndex === 2}
                      aria-controls="collapse2"
                    >
                      10 Oct 2024
                    </div>
                  </div>
                  <div className="col-4">
                    {" "}
                    <i class="ri-arrow-down-s-line"></i>
                  </div>
                </div>
              </h2>
              <div
                id="collapse2"
                className={`accordion-collapse collapse ${
                  activeIndex === 2 ? "show" : ""
                }`}
                aria-labelledby="heading2"
                data-bs-parent="#accordionFaq1"
              >
                <div className="accordion-body">
                  <p className="m-b0">
                    To create orders, simply browse the menu, select desired
                    items, customize as needed, and proceed to checkout.
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
