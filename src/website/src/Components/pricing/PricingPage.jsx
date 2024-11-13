import React, { useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import "../homepage/style5756.css";

function PricingPage() {
  useEffect(() => {
    // HubSpot Form Implementation
    const loadHubSpotForm = () => {
      const script = document.createElement('script');
      script.src = "https://js.hsforms.net/forms/embed/v2.js";
      script.charset = "utf-8";
      script.type = "text/javascript";
      
      script.onload = () => {
        if (window.hbspt) {
          window.hbspt.forms.create({
            region: "na1",
            portalId: "2270269",
            formId: "10519404-1203-4494-9469-6e971d1cbcfa",
            target: '#hubspot-form-placeholder',
            css: '',
            customStyles: {
              formField: {
                borderRadius: "8px",
                borderColor: "#E5E7EB",
                backgroundColor: "#FFFFFF",
                labelColor: "#1A1A1A",
                inputColor: "#1A1A1A",
                fontSize: "16px",
                fontFamily: "inherit"
              },
              submit: {
                backgroundColor: "#C52031",
                hoverBackgroundColor: "#A41B29",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "500"
              }
            }
          });
        }
      };
      
      document.head.appendChild(script);
    };

    // Create intersection observer for lazy loading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadHubSpotForm();
          observer.disconnect();
        }
      });
    });

    // Start observing the form placeholder
    const formPlaceholder = document.querySelector('#hubspot-form-placeholder');
    if (formPlaceholder) {
      observer.observe(formPlaceholder);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <Header />
      <main className='my-5'>
        <div className="wrapper mt-5 pt-3">
          <div className="pricing_title_contents">
            <h2 className="pricing_title h2_pos">
              Transparent and affordable pricing
            </h2>
            <p className="pricing_pargaph">
              Manage restaurant operations efficiently without burning a hole in
              your pockets
            </p>
          </div>
        </div>
        <section className="pricing_pos_core section_spacing_y">
          <div className="wrapper">
            <div className="pricing_pos_core_wrapper pricing_pos_core_first_petpooja">
              <div className="pricing_pos_core_col">
                <h2 className="pricing_pos_core_heading">Petpooja POS Core</h2>
                <p className="pricing_pos_core_dec">
                  For any restaurant looking to automate their entire operation
                  with affordable and easy-to-use software
                </p>
                <h2 className="pricing_pos_core_number">₹10,000*</h2>
                <p className="pricing_pos_core_gst">first year/per outlet</p>
                <p className="pricing_pos_core_renewal">
                  +₹7,000* renewal from next year
                </p>
                <a href="#free-demo-form" className="btn btn__primary">
                  Book a free demo
                </a>
                <div className="pricing_pos_cre_points_imgs">
                  <picture>
                    <source
                      srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Petpooja-POS-core_sm.webp"
                      media="(max-width: 320px)"
                    />
                    <source
                      srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Petpooja-POS-core_md.webp"
                      media="(max-width: 480px)"
                    />
                    <source
                      srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Petpooja-POS-core_md.webp"
                      media="(max-width: 800px)"
                    />
                    <img
                      fetchpriority="high"
                      src="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Petpooja-POS-core_md.webp"
                      alt="Petpooja POS Core"
                      className="pricing_pos_core_img_resshow"
                    />
                  </picture>
                  <div className="pricing_pos_core_points">
                    <div className="pricing_pos_core_points-wrapper">
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M10.5086 6.7063L7.36825 9.84661L5.48047 7.96482"
                          stroke="#1F2937"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="pricing_pos_core_point-dec">
                        Efficient cloud-based POS system that works with every
                        OS
                      </p>
                    </div>
                    <div className="pricing_pos_core_points-wrapper">
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M10.5086 6.7063L7.36825 9.84661L5.48047 7.96482"
                          stroke="#1F2937"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="pricing_pos_core_point-dec">
                        Quick and easy inventory management
                      </p>
                    </div>
                    <div className="pricing_pos_core_points-wrapper">
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M10.5086 6.7063L7.36825 9.84661L5.48047 7.96482"
                          stroke="#1F2937"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="pricing_pos_core_point-dec">
                        100+ Real-time and simplified reporting
                      </p>
                    </div>
                    <div className="pricing_pos_core_points-wrapper">
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M10.5086 6.7063L7.36825 9.84661L5.48047 7.96482"
                          stroke="#1F2937"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="pricing_pos_core_point-dec">
                        Seamless online ordering system
                      </p>
                    </div>
                    <div className="pricing_pos_core_points-wrapper">
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M10.5086 6.7063L7.36825 9.84661L5.48047 7.96482"
                          stroke="#1F2937"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="pricing_pos_core_point-dec">24x7 support</p>
                    </div>
                    <div className="pricing_pos_core_points-wrapper">
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M10.5086 6.7063L7.36825 9.84661L5.48047 7.96482"
                          stroke="#1F2937"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="pricing_pos_core_point-dec">
                        Aggregator integrations
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pricing_pos_core_col">
                <picture>
                  <source
                    srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Petpooja-POS-core_sm.webp"
                    media="(max-width: 320px)"
                  />
                  <source
                    srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Petpooja-POS-core_md.webp"
                    media="(max-width: 480px)"
                  />
                  <source
                    srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Petpooja-POS-core_lg.webp"
                    media="(max-width: 800px)"
                  />
                  <img
                    loading="lazy"
                    src="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Petpooja-POS-core.webp"
                    alt="Petpooja POS Core"
                    className="pricing_pos_core-img"
                  />
                </picture>
              </div>
            </div>
            <p className="pricing_pos_core_note">
              <span>Note:</span> The prices mentioned on the page are exclusive
              of GST &amp; only for the outlets in India. Please contact us for
              details of outlets located outside India.
            </p>
          </div>
        </section>
        <section className="verified_suppliers_couters_all operating_system">
          <div className="wrapper">
            <div className="verified_suppliers_title">
              <h3 className="title_suppliers_verified">
                Simple and reliable POS for all your restaurant needs
              </h3>
            </div>
            <div className="verified_counter_number_row">
              <div className="verified_counter_col">
                <div className="counter_nmber_title">
                  <div
                    className="counter_wrapper"
                    style={{
                      animation:
                        "0.3s ease 0.5s 1 normal forwards running slide-up",
                    }}
                  >
                    <picture>
                      <source
                        srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Clients_xxs.webp"
                        media="(max-width: 120px)"
                      />
                      <source
                        srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Clients_xs.webp"
                        media="(max-width: 240px)"
                      />
                      <img
                        loading="lazy"
                        src="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Clients.webp"
                        alt="Clients"
                        className="operating_system_img"
                      />
                    </picture>
                    <div
                      className="operating_system_counter-wrapper"
                      style={{
                        animation:
                          "0.3s ease 0.5s 1 normal forwards running slide-up",
                      }}
                    >
                      <h3 className="counter_number_title" data-target={75000}>
                        75000
                      </h3>
                      <span className="counter_number_title_icon">+</span>
                    </div>
                  </div>
                  <p className="verified_counter_title">
                    <span>Clients</span> across India, UAE, South Africa &amp;
                    Canada
                  </p>
                </div>
              </div>
              <div className="verified_counter_col">
                <div className="counter_nmber_title">
                  <div
                    className="counter_wrapper"
                    style={{
                      animation:
                        "0.3s ease 0.5s 1 normal forwards running slide-up",
                    }}
                  >
                    <picture>
                      <source
                        srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Online-order-volume_xxs.webp"
                        media="(max-width: 120px)"
                      />
                      <source
                        srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Online-order-volume_xs.webp"
                        media="(max-width: 240px)"
                      />
                      <img
                        loading="lazy"
                        src="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Online-order-volume.webp"
                        alt="Online order volume"
                        className="operating_system_img"
                      />
                    </picture>
                    <div
                      className="operating_system_counter-wrapper"
                      style={{
                        animation:
                          "0.3s ease 0.833333s 1 normal forwards running slide-up",
                      }}
                    >
                      <h3 className="counter_number_title" data-target={44}>
                        44
                      </h3>
                      <span className="counter_number_title_icon">%</span>
                    </div>
                  </div>
                  <p className="verified_counter_title">
                    <span>Online order volume</span> on Zomato &amp; Swiggy
                    orders processed by Petpooja
                  </p>
                </div>
              </div>
              <div className="verified_counter_col">
                <div className="counter_nmber_title">
                  <div
                    className="counter_wrapper"
                    style={{
                      animation:
                        "0.3s ease 0.5s 1 normal forwards running slide-up",
                    }}
                  >
                    <picture>
                      <source
                        srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Bills-processed_xxs.webp"
                        media="(max-width: 120px)"
                      />
                      <source
                        srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Bills-processed_xs.webp"
                        media="(max-width: 240px)"
                      />
                      <img
                        loading="lazy"
                        src="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Bills-processed.webp"
                        alt="Bills-processed"
                        className="operating_system_img"
                      />
                    </picture>
                    <div
                      className="operating_system_counter-wrapper"
                      style={{
                        animation:
                          "0.3s ease 1.16667s 1 normal forwards running slide-up",
                      }}
                    >
                      <h3 className="counter_number_title" data-target={60}>
                        60
                      </h3>
                      <span className="counter_number_title_icon">L+</span>
                    </div>
                  </div>
                  <p className="verified_counter_title">
                    <span>Bills processed</span> everyday hassle free with
                    Petpooja POS
                  </p>
                </div>
              </div>
              <div className="verified_counter_col">
                <div className="counter_nmber_title">
                  <div
                    className="counter_wrapper"
                    style={{
                      animation:
                        "0.3s ease 0.5s 1 normal forwards running slide-up",
                    }}
                  >
                    <picture>
                      <source
                        srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/24_7_xxs.webp"
                        media="(max-width: 120px)"
                      />
                      <source
                        srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/24_7_xs.webp"
                        media="(max-width: 240px)"
                      />
                      <img
                        loading="lazy"
                        src="https://d28ewddc5mocr5.cloudfront.net/images/pricing/24_7.webp"
                        alt="24/7 On-call"
                        className="operating_system_img"
                      />
                    </picture>
                    <div className="operating_system_counter-wrapper">
                      <span className="counter_number_title_icon">24/7</span>
                    </div>
                  </div>
                  <p className="verified_counter_title">
                    <span>On-call</span> and on-site support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="pricing_pos_core petpooja_plus section_spacing_y">
          <div className="wrapper">
            <div className="pricing_pos_core_wrapper pricing_pos_cre_petpoojs_plus">
              <div className="pricing_pos_core_col">
                <picture>
                  <source
                    srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Petpooja-Plus_sm.webp"
                    media="(max-width: 320px)"
                  />
                  <source
                    srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Petpooja-Plus_md.webp"
                    media="(max-width: 480px)"
                  />
                  <source
                    srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Petpooja-Plus_lg.webp"
                    media="(max-width: 800px)"
                  />
                  <img
                    loading="lazy"
                    src="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Petpooja-Plus_md.webp"
                    alt="Petpooja Plus"
                    className="pricing_pos_core-img"
                  />
                </picture>
              </div>
              <div className="pricing_pos_core_col">
                <h2 className="pricing_pos_core_heading">
                  Petpooja Growth Plan
                </h2>
                <p className="pricing_pos_core_dec">
                  Power up your Petpooja Core with features that simplify your
                  kitchen operations, customer management, and staff
                  responsibilities
                </p>
                <h3 className="pricing_pos_core_number">₹20,000*</h3>
                <p className="pricing_pos_core_gst">per year / per outlet</p>
                <a href="#free-demo-form" className="btn btn__primary">
                  Book a free demo
                </a>
                <div className="pricing_pos_cre_points_imgs">
                  <picture>
                    <source
                      srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Petpooja-Plus_sm.webp"
                      media="(max-width: 320px)"
                    />
                    <source
                      srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Petpooja-Plus_md.webp"
                      media="(max-width: 480px)"
                    />
                    <source
                      srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Petpooja-Plus_lg.webp"
                      media="(max-width: 800px)"
                    />
                    <img
                      loading="lazy"
                      src="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Petpooja-Plus.webp"
                      alt="Petpooja Plus"
                      className="pricing_pos_core_img_petpooja_plus"
                    />
                  </picture>
                  <div className="pricing_pos_core_points">
                    <div className="pricing_pos_core_points-wrapper">
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M10.5086 6.7063L7.36825 9.84661L5.48047 7.96482"
                          stroke="#1F2937"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="pricing_pos_core_point-dec">
                        Holistic and easy-to-use tech solution
                      </p>
                    </div>
                    <div className="pricing_pos_core_points-wrapper">
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M10.5086 6.7063L7.36825 9.84661L5.48047 7.96482"
                          stroke="#1F2937"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="pricing_pos_core_point-dec">
                        Works in perfect sync with POS
                      </p>
                    </div>
                    <div className="pricing_pos_core_points-wrapper">
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M10.5086 6.7063L7.36825 9.84661L5.48047 7.96482"
                          stroke="#1F2937"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="pricing_pos_core_point-dec">
                        Android and Windows-based apps for multiple devices
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="petpooja_plus_services section_spacing_y">
          <div className="wrapper">
            <div className="swiper explore_addons_slider swiper-initialized swiper-horizontal swiper-pointer-events">
              <div className="explore_contents_pagination">
                <div className="exlore_title_prgh">
                  <h3 className="exlore_addons_title">
                    Marketplace features to boost your sales &amp; improve your
                    customer service
                  </h3>
                </div>
                <div className="explore_pag_prev_next">
                  <div
                    className="swiper-button-next"
                    tabIndex={0}
                    role="button"
                    aria-label="Next slide"
                    aria-controls="swiper-wrapper-e31c63922277fcc4"
                  />
                  <div
                    className="swiper-button-prev"
                    tabIndex={0}
                    role="button"
                    aria-label="Previous slide"
                    aria-controls="swiper-wrapper-e31c63922277fcc4"
                  />
                </div>
              </div>
              <div
                className="swiper-wrapper"
                id="swiper-wrapper-e31c63922277fcc4"
                aria-live="off"
                style={{
                  transitionDuration: "0ms",
                  transform: "translate3d(-3260px, 0px, 0px)",
                }}
              >
                <div
                  className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-prev"
                  data-swiper-slide-index={0}
                  role="group"
                  aria-label="1 / 4"
                  style={{ marginRight: 100 }}
                >
                  <div className="explore_slider_subtitle">
                    <h5 className="explore_subtitle">CRM</h5>
                  </div>
                  <div className="explore_subboxes">
                    <div className="expboxes_img_paragh">
                      <a href="restaurant-website.html">
                        <div className="exp_level_icons">
                          <i className="m-icon business-website-icon" />
                        </div>
                        <p className="exploresubbox_paragh">Business website</p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="restaurant-loyalty-program.html">
                        <div className="exp_level_icons">
                          <i className="m-icon loyalty-wallet-icon" />
                        </div>
                        <p className="exploresubbox_paragh">Loyalty wallet</p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="restaurant-sms-service.html">
                        <div className="exp_level_icons">
                          <i className="m-icon sms-marketing-icon" />
                        </div>
                        <p className="exploresubbox_paragh">SMS marketing</p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="customer-feedback-management.html">
                        <div className="exp_level_icons">
                          <i className="m-icon customer-feedback-icon" />
                        </div>
                        <p className="exploresubbox_paragh">
                          Customer feedback
                        </p>
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-active"
                  data-swiper-slide-index={1}
                  role="group"
                  aria-label="2 / 4"
                  style={{ marginRight: 100 }}
                >
                  <div className="explore_slider_subtitle">
                    <h5 className="explore_subtitle">Operations</h5>
                  </div>
                  <div className="explore_subboxes">
                    <div className="expboxes_img_paragh">
                      <a href="captain-ordering-app.html">
                        <div className="exp_level_icons">
                          <i className="m-icon captain-oprdering-icon" />
                        </div>
                        <p className="exploresubbox_paragh">Captain app</p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="online-order-token-management.html">
                        <div className="exp_level_icons">
                          <i className="m-icon token-management-icon" />
                        </div>
                        <p className="exploresubbox_paragh">Token management</p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="kitchen-display-system.html">
                        <div className="exp_level_icons">
                          <i className="m-icon kitchen-display-service-icon" />
                        </div>
                        <p className="exploresubbox_paragh">
                          Kitchen display service
                        </p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="reservation-manager.html">
                        <div className="exp_level_icons">
                          <i className="m-icon que-management-icon" />
                        </div>
                        <p className="exploresubbox_paragh">
                          Reservation Manager
                        </p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="index.html">
                        <div className="exp_level_icons">
                          <i className="m-icon petpooja-pay-icon" />
                        </div>
                        <p className="exploresubbox_paragh">Petpooja Pay</p>
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-next"
                  data-swiper-slide-index={2}
                  role="group"
                  aria-label="3 / 4"
                  style={{ marginRight: 100 }}
                >
                  <div className="explore_slider_subtitle">
                    <h5 className="explore_subtitle">Customer service</h5>
                  </div>
                  <div className="explore_subboxes">
                    <div className="expboxes_img_paragh">
                      <a href="waiter-calling-system.html">
                        <div className="exp_level_icons">
                          <i className="m-icon waiter-calling-system-icon" />
                        </div>
                        <p className="exploresubbox_paragh">
                          Waiter calling system
                        </p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="food-ordering-kiosk.html">
                        <div className="exp_level_icons">
                          <i className="m-icon voice-ordering-kiosk-icon" />
                        </div>
                        <p className="exploresubbox_paragh">
                          Voice ordering kiosk
                        </p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="scan-and-order.html">
                        <div className="exp_level_icons">
                          <i className="m-icon scan-pay-icon" />
                        </div>
                        <p className="exploresubbox_paragh">Scan &amp; Pay</p>
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className="swiper-slide swiper-slide-duplicate"
                  data-swiper-slide-index={3}
                  role="group"
                  aria-label="4 / 4"
                  style={{ marginRight: 100 }}
                >
                  <div className="explore_slider_subtitle">
                    <h5 className="explore_subtitle">Analytics</h5>
                  </div>
                  <div className="explore_subboxes">
                    <div className="expboxes_img_paragh">
                      <a href="online-order-reconciliation.html">
                        <div className="exp_level_icons">
                          <i className="m-icon online-order-reconcillation-icon" />
                        </div>
                        <p className="exploresubbox_paragh">
                          Online order reconcillation
                        </p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="restaurant-analytics-insights.html">
                        <div className="exp_level_icons">
                          <i className="m-icon insights-icon" />
                        </div>
                        <p className="exploresubbox_paragh">Dynamic reports</p>
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className="swiper-slide swiper-slide-prev"
                  data-swiper-slide-index={0}
                  role="group"
                  aria-label="1 / 4"
                  style={{ marginRight: 100 }}
                >
                  <div className="explore_slider_subtitle">
                    <h5 className="explore_subtitle">CRM</h5>
                  </div>
                  <div className="explore_subboxes">
                    <div className="expboxes_img_paragh">
                      <a href="restaurant-website.html">
                        <div className="exp_level_icons">
                          <i className="m-icon business-website-icon" />
                        </div>
                        <p className="exploresubbox_paragh">Business website</p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="restaurant-loyalty-program.html">
                        <div className="exp_level_icons">
                          <i className="m-icon loyalty-wallet-icon" />
                        </div>
                        <p className="exploresubbox_paragh">Loyalty wallet</p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="restaurant-sms-service.html">
                        <div className="exp_level_icons">
                          <i className="m-icon sms-marketing-icon" />
                        </div>
                        <p className="exploresubbox_paragh">SMS marketing</p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="customer-feedback-management.html">
                        <div className="exp_level_icons">
                          <i className="m-icon customer-feedback-icon" />
                        </div>
                        <p className="exploresubbox_paragh">
                          Customer feedback
                        </p>
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className="swiper-slide swiper-slide-active"
                  data-swiper-slide-index={1}
                  role="group"
                  aria-label="2 / 4"
                  style={{ marginRight: 100 }}
                >
                  <div className="explore_slider_subtitle">
                    <h5 className="explore_subtitle">Operations</h5>
                  </div>
                  <div className="explore_subboxes">
                    <div className="expboxes_img_paragh">
                      <a href="captain-ordering-app.html">
                        <div className="exp_level_icons">
                          <i className="m-icon captain-oprdering-icon" />
                        </div>
                        <p className="exploresubbox_paragh">Captain app</p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="online-order-token-management.html">
                        <div className="exp_level_icons">
                          <i className="m-icon token-management-icon" />
                        </div>
                        <p className="exploresubbox_paragh">Token management</p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="kitchen-display-system.html">
                        <div className="exp_level_icons">
                          <i className="m-icon kitchen-display-service-icon" />
                        </div>
                        <p className="exploresubbox_paragh">
                          Kitchen display service
                        </p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="reservation-manager.html">
                        <div className="exp_level_icons">
                          <i className="m-icon que-management-icon" />
                        </div>
                        <p className="exploresubbox_paragh">
                          Reservation Manager
                        </p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="index.html">
                        <div className="exp_level_icons">
                          <i className="m-icon petpooja-pay-icon" />
                        </div>
                        <p className="exploresubbox_paragh">Petpooja Pay</p>
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className="swiper-slide swiper-slide-next"
                  data-swiper-slide-index={2}
                  role="group"
                  aria-label="3 / 4"
                  style={{ marginRight: 100 }}
                >
                  <div className="explore_slider_subtitle">
                    <h5 className="explore_subtitle">Customer service</h5>
                  </div>
                  <div className="explore_subboxes">
                    <div className="expboxes_img_paragh">
                      <a href="waiter-calling-system.html">
                        <div className="exp_level_icons">
                          <i className="m-icon waiter-calling-system-icon" />
                        </div>
                        <p className="exploresubbox_paragh">
                          Waiter calling system
                        </p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="food-ordering-kiosk.html">
                        <div className="exp_level_icons">
                          <i className="m-icon voice-ordering-kiosk-icon" />
                        </div>
                        <p className="exploresubbox_paragh">
                          Voice ordering kiosk
                        </p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="scan-and-order.html">
                        <div className="exp_level_icons">
                          <i className="m-icon scan-pay-icon" />
                        </div>
                        <p className="exploresubbox_paragh">Scan &amp; Pay</p>
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className="swiper-slide"
                  data-swiper-slide-index={3}
                  role="group"
                  aria-label="4 / 4"
                  style={{ marginRight: 100 }}
                >
                  <div className="explore_slider_subtitle">
                    <h5 className="explore_subtitle">Analytics</h5>
                  </div>
                  <div className="explore_subboxes">
                    <div className="expboxes_img_paragh">
                      <a href="online-order-reconciliation.html">
                        <div className="exp_level_icons">
                          <i className="m-icon online-order-reconcillation-icon" />
                        </div>
                        <p className="exploresubbox_paragh">
                          Online order reconcillation
                        </p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="restaurant-analytics-insights.html">
                        <div className="exp_level_icons">
                          <i className="m-icon insights-icon" />
                        </div>
                        <p className="exploresubbox_paragh">Dynamic reports</p>
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-prev"
                  data-swiper-slide-index={0}
                  role="group"
                  aria-label="1 / 4"
                  style={{ marginRight: 100 }}
                >
                  <div className="explore_slider_subtitle">
                    <h5 className="explore_subtitle">CRM</h5>
                  </div>
                  <div className="explore_subboxes">
                    <div className="expboxes_img_paragh">
                      <a href="restaurant-website.html">
                        <div className="exp_level_icons">
                          <i className="m-icon business-website-icon" />
                        </div>
                        <p className="exploresubbox_paragh">Business website</p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="restaurant-loyalty-program.html">
                        <div className="exp_level_icons">
                          <i className="m-icon loyalty-wallet-icon" />
                        </div>
                        <p className="exploresubbox_paragh">Loyalty wallet</p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="restaurant-sms-service.html">
                        <div className="exp_level_icons">
                          <i className="m-icon sms-marketing-icon" />
                        </div>
                        <p className="exploresubbox_paragh">SMS marketing</p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="customer-feedback-management.html">
                        <div className="exp_level_icons">
                          <i className="m-icon customer-feedback-icon" />
                        </div>
                        <p className="exploresubbox_paragh">
                          Customer feedback
                        </p>
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-active"
                  data-swiper-slide-index={1}
                  role="group"
                  aria-label="2 / 4"
                  style={{ marginRight: 100 }}
                >
                  <div className="explore_slider_subtitle">
                    <h5 className="explore_subtitle">Operations</h5>
                  </div>
                  <div className="explore_subboxes">
                    <div className="expboxes_img_paragh">
                      <a href="captain-ordering-app.html">
                        <div className="exp_level_icons">
                          <i className="m-icon captain-oprdering-icon" />
                        </div>
                        <p className="exploresubbox_paragh">Captain app</p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="online-order-token-management.html">
                        <div className="exp_level_icons">
                          <i className="m-icon token-management-icon" />
                        </div>
                        <p className="exploresubbox_paragh">Token management</p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="kitchen-display-system.html">
                        <div className="exp_level_icons">
                          <i className="m-icon kitchen-display-service-icon" />
                        </div>
                        <p className="exploresubbox_paragh">
                          Kitchen display service
                        </p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="reservation-manager.html">
                        <div className="exp_level_icons">
                          <i className="m-icon que-management-icon" />
                        </div>
                        <p className="exploresubbox_paragh">
                          Reservation Manager
                        </p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="index.html">
                        <div className="exp_level_icons">
                          <i className="m-icon petpooja-pay-icon" />
                        </div>
                        <p className="exploresubbox_paragh">Petpooja Pay</p>
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-next"
                  data-swiper-slide-index={2}
                  role="group"
                  aria-label="3 / 4"
                  style={{ marginRight: 100 }}
                >
                  <div className="explore_slider_subtitle">
                    <h5 className="explore_subtitle">Customer service</h5>
                  </div>
                  <div className="explore_subboxes">
                    <div className="expboxes_img_paragh">
                      <a href="waiter-calling-system.html">
                        <div className="exp_level_icons">
                          <i className="m-icon waiter-calling-system-icon" />
                        </div>
                        <p className="exploresubbox_paragh">
                          Waiter calling system
                        </p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="food-ordering-kiosk.html">
                        <div className="exp_level_icons">
                          <i className="m-icon voice-ordering-kiosk-icon" />
                        </div>
                        <p className="exploresubbox_paragh">
                          Voice ordering kiosk
                        </p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="scan-and-order.html">
                        <div className="exp_level_icons">
                          <i className="m-icon scan-pay-icon" />
                        </div>
                        <p className="exploresubbox_paragh">Scan &amp; Pay</p>
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className="swiper-slide swiper-slide-duplicate"
                  data-swiper-slide-index={3}
                  role="group"
                  aria-label="4 / 4"
                  style={{ marginRight: 100 }}
                >
                  <div className="explore_slider_subtitle">
                    <h5 className="explore_subtitle">Analytics</h5>
                  </div>
                  <div className="explore_subboxes">
                    <div className="expboxes_img_paragh">
                      <a href="online-order-reconciliation.html">
                        <div className="exp_level_icons">
                          <i className="m-icon online-order-reconcillation-icon" />
                        </div>
                        <p className="exploresubbox_paragh">
                          Online order reconcillation
                        </p>
                      </a>
                    </div>
                    <div className="expboxes_img_paragh">
                      <a href="restaurant-analytics-insights.html">
                        <div className="exp_level_icons">
                          <i className="m-icon insights-icon" />
                        </div>
                        <p className="exploresubbox_paragh">Dynamic reports</p>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <span
                className="swiper-notification"
                aria-live="assertive"
                aria-atomic="true"
              />
            </div>
          </div>
        </section>
        <section className="petpoojascale_wrapper pricing_pos_core section_spacing_y">
          <div className="wrapper">
            <div className="pricing_pos_core_wrapper">
              <div className="pricing_pos_core_col">
                <h2 className="pricing_pos_core_heading">
                  Petpooja Scale Plan
                </h2>
                <p className="pricing_pos_core_dec">
                  A power-packed kit to help you automate your daily operations,
                  data &amp; invoice management, staff management, and much more
                </p>
                <h3 className="pricing_pos_core_number">₹30,000*</h3>
                <p className="pricing_pos_core_gst">per year / per outlet</p>
                <a href="#free-demo-form" className="btn btn__primary">
                  Book a free demo
                </a>
                <div className="pricing_pos_core_points">
                  <div className="pricing_pos_core_points-wrapper">
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M10.5086 6.7063L7.36825 9.84661L5.48047 7.96482"
                        stroke="#1F2937"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="pricing_pos_core_point-dec">
                      Kit for complete business automation
                    </p>
                  </div>
                  <div className="pricing_pos_core_points-wrapper">
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M10.5086 6.7063L7.36825 9.84661L5.48047 7.96482"
                        stroke="#1F2937"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="pricing_pos_core_point-dec">
                      Cloud-based advanced solutions
                    </p>
                  </div>
                  <div className="pricing_pos_core_points-wrapper">
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M10.5086 6.7063L7.36825 9.84661L5.48047 7.96482"
                        stroke="#1F2937"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="pricing_pos_core_point-dec">
                      Android and Windows-based apps
                    </p>
                  </div>
                </div>
              </div>
              <div className="pricing_pos_core_col">
                <img
                  loading="lazy"
                  src="https://d28ewddc5mocr5.cloudfront.net/images/pricing/petpooja-scale.webp"
                  alt="Petpooja Scale"
                  title="Petpooja Scale"
                  className="pricing_pos_core-img"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="trusted_restaurant section_spacing_y">
          <div className="wrapper">
            <h3 className="trusted_restaurant_heading">
              Trusted by some of the best restaurants
            </h3>
            <div className="trusted_restaurant_wrapper">
              <div className="trusted_restaurant_col">
                <picture>
                  <source
                    srcSet="https://d28ewddc5mocr5.cloudfront.net/images/testimonial/Sam_s_Pizza_xxs.webp"
                    media="(max-width: 120px)"
                  />
                  <source
                    srcSet="https://d28ewddc5mocr5.cloudfront.net/images/testimonial/Sam_s_Pizza_xs.webp"
                    media="(max-width: 240px)"
                  />
                  <img
                    loading="lazy"
                    src="https://d28ewddc5mocr5.cloudfront.net/images/testimonial/Sam_s_Pizza.webp"
                    alt="Sam's Pizza"
                    title="Sam's Pizza"
                    className="trusted_restaurant_img"
                  />
                </picture>
                <p className="trusted_restaurant_dec">
                  Petpooja has been the POS solution for our 90+ outlets for
                  over two years. And these numbers are proof of how content we
                  are with their services. Especially for a large chain like us,
                  Petpooja is the one-point data bridge between all the outlets
                  and the owner. Kudos to the team. Recommending Petpooja to
                  everyone!’
                </p>
                <div className="trusted_restaurant_profile-wrapper">
                  <picture>
                    <source
                      srcSet="https://d28ewddc5mocr5.cloudfront.net/images/testimonial/Jolly_christian_Sam_s_Pizza_xs.webp"
                      media="(max-width: 240px)"
                    />
                    <source
                      srcSet="https://d28ewddc5mocr5.cloudfront.net/images/testimonial/Jolly_christian_Sam_s_Pizza_sm.webp"
                      media="(max-width: 320px)"
                    />
                    <source
                      srcSet="https://d28ewddc5mocr5.cloudfront.net/images/testimonial/Jolly_christian_Sam_s_Pizza_md.webp"
                      media="(max-width: 480px)"
                    />
                    <img
                      loading="lazy"
                      src="https://d28ewddc5mocr5.cloudfront.net/images/testimonial/Jolly_christian_Sam_s_Pizza.webp"
                      alt="Jolly_christian_Sam_s_Pizza"
                      className="trusted_restaurant_profile-img"
                    />
                  </picture>
                  <div className="trusted_restaurant_name-wrapper">
                    <p className="trusted_restaurant_profile-name">
                      Jolly Christian
                    </p>
                    <p className="trusted_restaurant_profile-post">
                      General Manager
                    </p>
                  </div>
                </div>
              </div>
              <div className="trusted_restaurant_col">
                <img
                  loading="lazy"
                  src="https://d28ewddc5mocr5.cloudfront.net/images/testimonial/United-farmers-creamery.webp"
                  alt="United farmers creamery"
                  title="United farmers creamery"
                  className="trusted_restaurant_img"
                />
                <p className="trusted_restaurant_dec">
                  Petpooja has helped me to manage inventory levels and food
                  costs. I can track sales and expenses in real time, which
                  helps me make informed decisions about purchasing and pricing.
                  The system also provides detailed reports, which has helped me
                  reduce waste and optimize my inventory. Overall, I am
                  extremely satisfied with Petpooja and highly recommend it to
                  anyone looking to streamline their operations and improve
                  their bottom line.
                </p>
                <div className="trusted_restaurant_profile-wrapper">
                  <picture>
                    <source
                      srcSet="https://d28ewddc5mocr5.cloudfront.net/images/testimonial/Jaipratap-Singh-cloud-kitchen_xs.webp"
                      media="(max-width: 240px)"
                    />
                    <source
                      srcSet="https://d28ewddc5mocr5.cloudfront.net/images/testimonial/Jaipratap-Singh-cloud-kitchen_sm.webp"
                      media="(max-width: 320px)"
                    />
                    <source
                      srcSet="https://d28ewddc5mocr5.cloudfront.net/images/testimonial/Jaipratap-Singh-cloud-kitchen_md.webp"
                      media="(max-width: 480px)"
                    />
                    <img
                      loading="lazy"
                      src="https://d28ewddc5mocr5.cloudfront.net/images/testimonial/Jaipratap-Singh-cloud-kitchen.webp"
                      alt="Jaipratap Singh"
                      className="trusted_restaurant_profile-img"
                    />
                  </picture>
                  <div className="trusted_restaurant_name-wrapper">
                    <p className="trusted_restaurant_profile-name">
                      Jaipratap Singh
                    </p>
                    <p className="trusted_restaurant_profile-post">
                      Managing Director,
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="less_daily_chai section_spacing_y">
          <div className="wrapper">
            <div className="less_daily_chai_wrapper">
              <div className="less_daily_col">
                <picture>
                  <source
                    srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Chai_xxs.webp"
                    media="(max-width: 120px)"
                  />
                  <source
                    srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Chai_xs.webp"
                    media="(max-width: 240px)"
                  />
                  <img
                    loading="lazy"
                    src="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Chai.webp"
                    alt="Chai"
                    className="less_daily_chai_img"
                  />
                </picture>
                <p className="less_daily_chai_heading">
                  Less than daily cost of chai
                </p>
                <p className="less_daily_chai_dec">
                  Two liner description conveying importance/benefit of this
                  utility
                </p>
              </div>
              <div className="less_daily_col">
                <picture>
                  <source
                    srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Constant-fix-pricing_xxs.webp"
                    media="(max-width: 120px)"
                  />
                  <source
                    srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Constant-fix-pricing_xs.webp"
                    media="(max-width: 240px)"
                  />
                  <img
                    loading="lazy"
                    src="https://d28ewddc5mocr5.cloudfront.net/images/pricing/Constant-fix-pricing.webp"
                    alt="Constant & fix pricing"
                    className="less_daily_chai_img"
                  />
                </picture>
                <p className="less_daily_chai_heading">
                  Constant &amp; fix pricing
                </p>
                <p className="less_daily_chai_dec">
                  Two liner description conveying importance/benefit of this
                  utility
                </p>
              </div>
              <div className="less_daily_col">
                <picture>
                  <source
                    srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/No-new-hardware-required_xxs.webp"
                    media="(max-width: 120px)"
                  />
                  <source
                    srcSet="https://d28ewddc5mocr5.cloudfront.net/images/pricing/No-new-hardware-required_xs.webp"
                    media="(max-width: 240px)"
                  />
                  <img
                    loading="lazy"
                    src="https://d28ewddc5mocr5.cloudfront.net/images/pricing/No-new-hardware-required.webp"
                    alt="No new hardware required"
                    className="less_daily_chai_img"
                  />
                </picture>
                <p className="less_daily_chai_heading">
                  No new hardware required
                </p>
                <p className="less_daily_chai_dec">
                  Random interval between two emails, custom tracking domain
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="billing_faqs section_spacing_y">
          <div className="wrapper">
            <h2 className="faq_title">FAQs of pricing</h2>
            <div className="accordion_billing">
              <div className="accordion_body active">
                <div className="accordion_head">
                  <h4 className="accordion_title_pos">
                    How many POS will I need to buy to use it in multiple
                    terminals?
                  </h4>
                  <i className="m-icon chvron_right" />
                </div>
                <div className="accordion_content">
                  Petpooja POS runs smoothly with multiple billing stations!
                  Whether it is two billing stations of 10, you need just one
                  POS to manage them all without hassle.
                </div>
              </div>
              <div className="accordion_body">
                <div className="accordion_head">
                  <h4 className="accordion_title_pos">
                    Which hardware will I be required to use Petpooja POS?
                  </h4>
                  <i className="m-icon chvron_right" />
                </div>
                <div className="accordion_content">
                  Petpooja POS works smoothly with iOS, Windows, and Android
                  laptops, computers, tablets and phones.
                </div>
              </div>
              <div className="accordion_body">
                <div className="accordion_head">
                  <h4 className="accordion_title_pos">
                    Does Petpooja POS support an A4 printer?
                  </h4>
                  <i className="m-icon chvron_right" />
                </div>
                <div className="accordion_content">
                  Yes! Petpooja POS supports your regular A4 printers and WiFi,
                  LAN, USB, Dot-matrix, Laser, Label, A4 size, A5 size,
                  Bluetooth, etc.!
                </div>
              </div>
              <div className="accordion_body">
                <div className="accordion_head">
                  <h4 className="accordion_title_pos">
                    What if I’m switching from another POS?
                  </h4>
                  <i className="m-icon chvron_right" />
                </div>
                <div className="accordion_content">
                  You have nothing to worry about! We will make sure your POS
                  migration is quick so that your operations don’t get affected.
                  <ul className="accordion_content-item">
                    <li className="accordion_content-list">
                      The team will help migrate all the CRM data from your
                      previous POS to Petpooja
                    </li>
                    <li className="accordion_content-list">
                      The team will also help re-install the previous aggregator
                      setup onto Petpooja POS
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <section className="scheduale section_spacing_y">
          <div className="wrapper" id="free-demo-form">
            <div className="scheduale_row">
              <div className="scheduale_col">
                <h3 className="scheduale_form_titel">Schedule a free demo</h3>
                <p className="scheduale_form_dec">
                  Get in touch with our team to clarify your queries
                </p>
                <div 
                  id="hubspot-form-placeholder" 
                  style={{ paddingTop: "1.5rem" }}
                />
              </div>
              <div className="scheduale_col">
                <picture>
                  <source
                    srcSet="https://d28ewddc5mocr5.cloudfront.net/images/scheduale-form_sm.webp"
                    media="(max-width: 480px)"
                  />
                  <source
                    srcSet="https://d28ewddc5mocr5.cloudfront.net/images/scheduale-form_md.webp"
                    media="(max-width: 768px)"
                  />
                  <img
                    loading="lazy"
                    src="https://d28ewddc5mocr5.cloudfront.net/images/scheduale-form_md.webp"
                    alt="Schedule a free demo"
                    className="scheduale_img"
                  />
                </picture>
              </div>
            </div>
          </div>
        </section> */}
      </main>
      <Footer />
    </div>
  );
}

export default PricingPage