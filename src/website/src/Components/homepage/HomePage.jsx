import React, { useEffect, useRef } from 'react';
import BlazeSlider from 'blaze-slider';
import 'blaze-slider/dist/blaze.css';
import Header from '../Header'
import Footer from '../Footer';
import jpg4 from "../../Assets/img/instagram/4.jpg";

import "./style5756.css";

function HomePage() {
   const sliderRef = useRef(null);

   useEffect(() => {
     let slider;

     const initializeSlider = () => {
       try {
         if (!sliderRef.current) {
           console.log("Slider ref not found");
           return;
         }

         slider = new BlazeSlider(sliderRef.current, {
           all: {
             slidesToShow: 1,
             slideGap: "24px",
             loop: true,
             enableAutoplay: false,
             transitionDuration: 300,
             transitionTimingFunction: "ease",
           },
         });

         const prevButton = document.querySelector(
           ".explore_pag_prev_next .blaze-prev"
         );
         const nextButton = document.querySelector(
           ".explore_pag_prev_next .blaze-next"
         );

         if (prevButton && nextButton) {
           const handlePrev = () => slider.prev();
           const handleNext = () => slider.next();

           prevButton.addEventListener("click", handlePrev);
           nextButton.addEventListener("click", handleNext);

           return () => {
             prevButton.removeEventListener("click", handlePrev);
             nextButton.removeEventListener("click", handleNext);
           };
         }
       } catch (error) {
         console.error("Slider initialization error:", error);
       }
     };

     const timeoutId = setTimeout(initializeSlider, 100);

     return () => {
       clearTimeout(timeoutId);
       if (slider && typeof slider.destroy === "function") {
         slider.destroy();
       }
     };
   }, []);

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
      {/* <Header /> */}
      <section className="hero_billings mt-5">
        <div className="wrapper">
          <div className="hero__pos_contents_img">
            <div className="hero__pos_content">
              <h1 className="hero__title">
             Do it all with contactless menu card software with AI features
              </h1>
              <p className="hero_paragph">
                Customize your restaurant menu and serve your customers with
                better add-ons, exciting offers, special menus, dynamic pricing
                and much more
              </p>
              <a href="#free-demo-form" className="btn btn__primary">
                Take a free demo
              </a>
            </div>
            <div className="hero__pos_img">
              {/* <picture>
                <source
                  srcSet="
              https://d28ewddc5mocr5.cloudfront.net/images/pos/menu-hero_sm.webp
            "
                  media="(max-width: 320px)"
                />
                <source
                  srcSet="
              https://d28ewddc5mocr5.cloudfront.net/images/pos/menu-hero_md.webp
            "
                  media="(max-width: 480px)"
                />
                <source
                  srcSet="
              https://d28ewddc5mocr5.cloudfront.net/images/pos/menu-hero_lg.webp
            "
                  media="(max-width: 800px)"
                />
                <source
                  srcSet="
              https://d28ewddc5mocr5.cloudfront.net/images/pos/menu-hero_lg.webp
            "
                  media="(max-width: 1024px)"
                />
                <img
                  fetchpriority="high"
                  src="https://d28ewddc5mocr5.cloudfront.net/images/pos/menu-hero_lg.webp"
                  alt="Restaurant POS"
                />
              </picture> */}
              <img src={jpg4}></img>
            </div>
          </div>
        </div>
      </section>
      <section className="billing_software section_spacing_y">
        <div className="wrapper">
          <div className="section_heading">
            <h2 className="titel_name">
              Restaurant menu management made easier
            </h2>
          </div>
          <div className="billing_software_row">
            <div className="billing_software_col">
              <img
                loading="lazy"
                src="https://d28ewddc5mocr5.cloudfront.net/images/pos/Item-Category.webp"
                alt="Item category, variations and add-ons"
                className="billing_software_img"
              />
              <div className="billing_software_details">
                <h4 className="billing_software_titel">
                  Item category, variations and add-ons
                </h4>
                <p className="billing_software_dec">
                  Customise your restaurant menu however you want! Create
                  item-wise variations, and add-ons with separate pricing for
                  each customisation and much more with Petpooja restaurant POS
                  software
                </p>
              </div>
            </div>
            <div className="billing_software_col">
              <img
                loading="lazy"
                src="https://d28ewddc5mocr5.cloudfront.net/images/pos/Aggregator-Menu.webp"
                alt="Aggregator menu management"
                className="billing_software_img"
              />
              <div className="billing_software_details">
                <h4 className="billing_software_titel">
                  Aggregator menu management
                </h4>
                <p className="billing_software_dec">
                  Integrate your restaurant menu with any and all food delivery
                  aggregators. Easily edit your menu items and their available
                  time, the prices and switch any items ON/OFF directly from the
                  POS in case of low inventory stock
                </p>
              </div>
            </div>
            <div className="billing_software_col">
              <img
                loading="lazy"
                src="https://d28ewddc5mocr5.cloudfront.net/images/pos/Create-Shortcodes.webp"
                alt="Create shortcodes for quick billing"
                className="billing_software_img"
              />
              <div className="billing_software_details">
                <h4 className="billing_software_titel">
                  Create shortcodes for quick billing
                </h4>
                <p className="billing_software_dec">
                  Assign item-wise shortcodes as per your convenience for faster
                  billing, significantly increasing the rate of software
                  adoption and the speed of checkout to save customers' and
                  staff's time!
                </p>
              </div>
            </div>
            <div className="billing_software_col">
              <img
                loading="lazy"
                src="https://d28ewddc5mocr5.cloudfront.net/images/pos/Multiple-Menus.webp"
                alt="Multiple menus"
                className="billing_software_img"
              />
              <div className="billing_software_details">
                <h4 className="billing_software_titel">Multiple menus</h4>
                <p className="billing_software_dec">
                  Create different dine-in areas and a separate menu for each!
                  Manage all the areas and their menus with one Petpooja
                  restaurant POS software. In addition to that, you get complete
                  pricing control over all your menus, whether physical or
                  online!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="quick_simple_billing section_spacing_y">
        <div className="wrapper">
          <div className="quick_title_paragh">
            <h2 className="quick_title h2_pos">Quick &amp; simple</h2>
            <p className="quick_paragph">
              Petpooja restaurant billing software works easily with any
              existing infrastructure
            </p>
          </div>
          <div className="quick_simple_feature">
            <div className="quick_feature_img">
              <picture>
                <source
                  srcSet="
              https://d28ewddc5mocr5.cloudfront.net/images/pos/Quick-simple_sm.webp
            "
                  media="(max-width: 320px)"
                />
                <source
                  srcSet="
              https://d28ewddc5mocr5.cloudfront.net/images/pos/Quick-simple_md.webp
            "
                  media="(max-width: 480px)"
                />
                <source
                  srcSet="
              https://d28ewddc5mocr5.cloudfront.net/images/pos/Quick-simple_lg.webp
            "
                  media="(max-width: 800px)"
                />
                <source
                  srcSet="
              https://d28ewddc5mocr5.cloudfront.net/images/pos/Quick-simple_lg.webp
            "
                  media="(max-width: 1024px)"
                />
                <img
                  loading="lazy"
                  src="https://d28ewddc5mocr5.cloudfront.net/images/pos/Quick-simple_lg.webp"
                  alt="Quick Simple Features"
                />
              </picture>
            </div>
            <div className="quick_features_all">
              <div className="feature_simple">
                <picture>
                  <source
                    srcSet="
                https://d28ewddc5mocr5.cloudfront.net/images/pos/Offline_xxs.webp
              "
                    media="(max-width: 120px)"
                  />
                  <img
                    loading="lazy"
                    src="https://d28ewddc5mocr5.cloudfront.net/images/pos/Offline.webp"
                    alt="Works Offline, cloud-based software"
                  />
                </picture>
                <p>Works offline, cloud-based software</p>
              </div>
              <div className="feature_simple">
                <picture>
                  <source
                    srcSet="
                https://d28ewddc5mocr5.cloudfront.net/images/pos/Any-hardware_xxs.webp
              "
                    media="(max-width: 120px)"
                  />
                  <img
                    loading="lazy"
                    src="https://d28ewddc5mocr5.cloudfront.net/images/pos/Any-hardware.webp"
                    alt="Works on any hardware"
                  />
                </picture>
                <p>Works on any hardware</p>
              </div>
              <div className="feature_simple">
                <picture>
                  <source
                    srcSet="
                https://d28ewddc5mocr5.cloudfront.net/images/pos/Core-Modules-Common_xxs.webp
              "
                    media="(max-width: 120px)"
                  />
                  <img
                    loading="lazy"
                    src="https://d28ewddc5mocr5.cloudfront.net/images/pos/Core-Modules-Common.webp"
                    alt="Works on major Operating systems"
                  />
                </picture>
                <p>Works on major Operating systems</p>
              </div>
              <div className="feature_simple">
                <picture>
                  <source
                    srcSet="
                https://d28ewddc5mocr5.cloudfront.net/images/pos/Keyboard_touch_xxs.webp
              "
                    media="(max-width: 120px)"
                  />
                  <img
                    loading="lazy"
                    src="https://d28ewddc5mocr5.cloudfront.net/images/pos/Keyboard_touch.webp"
                    alt="Keyboard / touchscreen view"
                  />
                </picture>
                <p>Keyboard / touchscreen view</p>
              </div>
              <div className="feature_simple">
                <picture>
                  <source
                    srcSet="
                https://d28ewddc5mocr5.cloudfront.net/images/pos/QR-code_xxs.webp
              "
                    media="(max-width: 120px)"
                  />
                  <img
                    loading="lazy"
                    src="https://d28ewddc5mocr5.cloudfront.net/images/pos/QR-code.webp"
                    alt="QR scan & order"
                  />
                </picture>
                <p>QR scan &amp; order</p>
              </div>
              <div className="feature_simple">
                <picture>
                  <source
                    srcSet="
                https://d28ewddc5mocr5.cloudfront.net/images/pos/E-bill_xxs.webp
              "
                    media="(max-width: 120px)"
                  />
                  <img
                    loading="lazy"
                    src="https://d28ewddc5mocr5.cloudfront.net/images/pos/E-bill.webp"
                    alt="E-bill receipts"
                  />
                </picture>
                <p>E-bill receipts</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="more_with_pp section_spacing_y">
        <div className="wrapper">
          <div className="section_heading">
            <h2 className="titel_name">
              One stop for all your restaurant management solutions
            </h2>
            <p className="titel_dec">
              All-in-one restaurant billing POS system that handles all your
              operations on a single screen
            </p>
          </div>
          <div className="more_with_pp_row">
            <a
              className="more_with_pp_col"
              href="online-order-management-software.html"
            >
              <picture>
                <source
                  srcSet="
              https://d28ewddc5mocr5.cloudfront.net/images/pos/Online-Ordering_xxs.webp
            "
                  media="(max-width: 120px)"
                />
                <source
                  srcSet="
              https://d28ewddc5mocr5.cloudfront.net/images/pos/Online-Ordering_xs.webp
            "
                  media="(max-width: 240px)"
                />
                <img
                  loading="lazy"
                  src="https://d28ewddc5mocr5.cloudfront.net/images/pos/Online-Ordering.webp"
                  alt="Online-Order-Management"
                  className="more_with_pp_img"
                />
              </picture>
              <p className="more_woith_pp_titel">Online Order Management</p>
              <p className="more_with_pp_dec">
                A POS system that provides you with the complete picture of your
                online order sales, aggregator commissions, and much more
              </p>
              <div className="more_with_explor_wrapper">
                <p className="explore_link more_with_explor">
                  Explore all features
                  <svg
                    width={21}
                    height={16}
                    viewBox="0 0 21 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.666 1L19.666 8M19.666 8L12.666 15M19.666 8L1.66602 8"
                      stroke="currentcolor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </p>
              </div>
            </a>
            <a className="more_with_pp_col" href="reports-and-analytics.html">
              <picture>
                <source
                  srcSet="
              https://d28ewddc5mocr5.cloudfront.net/images/pos/Reporting_xxs.webp
            "
                  media="(max-width: 120px)"
                />
                <source
                  srcSet="
              https://d28ewddc5mocr5.cloudfront.net/images/pos/Reporting_xs.webp
            "
                  media="(max-width: 240px)"
                />
                <img
                  loading="lazy"
                  src="https://d28ewddc5mocr5.cloudfront.net/images/pos/Reporting.webp"
                  alt="Restaurant-Rights-Reports"
                  className="more_with_pp_img"
                />
              </picture>
              <p className="more_woith_pp_titel">
                Restaurant Rights and Reports
              </p>
              <p className="more_with_pp_dec">
                Access multiple restaurant business reports and regulate staff
                rights to avoid fraud and pilferage, all from a single
                restaurant POS
              </p>
              <div className="more_with_explor_wrapper">
                <p className="explore_link more_with_explor">
                  Explore all features
                  <svg
                    width={21}
                    height={16}
                    viewBox="0 0 21 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.666 1L19.666 8M19.666 8L12.666 15M19.666 8L1.66602 8"
                      stroke="currentcolor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </p>
              </div>
            </a>
            <a
              className="more_with_pp_col"
              href="restaurant-billing-software.html"
            >
              <picture>
                <source
                  srcSet="
              https://d28ewddc5mocr5.cloudfront.net/images/pos/Billing_xxs.webp
            "
                  media="(max-width: 120px)"
                />
                <source
                  srcSet="
              https://d28ewddc5mocr5.cloudfront.net/images/pos/Billing_xs.webp
            "
                  media="(max-width: 240px)"
                />
                <img
                  loading="lazy"
                  src="https://d28ewddc5mocr5.cloudfront.net/images/pos/Billing.webp"
                  alt="Billing-Management"
                  className="more_with_pp_img"
                />
              </picture>
              <p className="more_woith_pp_titel">Restaurant Billing Software</p>
              <p className="more_with_pp_dec">
                Take table or area-wise orders, print KOT and accept payment.
                Manage all online orders, deliveries, and more from one single
                screen.
              </p>
              <div className="more_with_explor_wrapper">
                <p className="explore_link more_with_explor">
                  Explore all features
                  <svg
                    width={21}
                    height={16}
                    viewBox="0 0 21 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.666 1L19.666 8M19.666 8L12.666 15M19.666 8L1.66602 8"
                      stroke="currentcolor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </p>
              </div>
            </a>
            <a
              className="more_with_pp_col"
              href="restaurant-inventory-management-software.html"
            >
              <picture>
                <source
                  srcSet="
              https://d28ewddc5mocr5.cloudfront.net/images/pos/Inventory_xxs.webp
            "
                  media="(max-width: 120px)"
                />
                <source
                  srcSet="
              https://d28ewddc5mocr5.cloudfront.net/images/pos/Inventory_xs.webp
            "
                  media="(max-width: 240px)"
                />
                <img
                  loading="lazy"
                  src="https://d28ewddc5mocr5.cloudfront.net/images/pos/Inventory.webp"
                  alt="Inventory-Management"
                  className="more_with_pp_img"
                />
              </picture>
              <p className="more_woith_pp_titel">Inventory Management</p>
              <p className="more_with_pp_dec">
                Track your inventory purchases, recipe costs, and raw material
                price trends with Petpooja's restaurant inventory software
              </p>
              <div className="more_with_explor_wrapper">
                <p className="explore_link more_with_explor">
                  Explore all features
                  <svg
                    width={21}
                    height={16}
                    viewBox="0 0 21 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.666 1L19.666 8M19.666 8L12.666 15M19.666 8L1.66602 8"
                      stroke="currentcolor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </p>
              </div>
            </a>
            <a
              className="more_with_pp_col"
              href="restaurant-customer-management-software.html"
            >
              <picture>
                <source
                  srcSet="
              https://d28ewddc5mocr5.cloudfront.net/images/pos/Crm_xxs.webp
            "
                  media="(max-width: 120px)"
                />
                <source
                  srcSet="
              https://d28ewddc5mocr5.cloudfront.net/images/pos/Crm_xs.webp
            "
                  media="(max-width: 240px)"
                />
                <img
                  loading="lazy"
                  src="https://d28ewddc5mocr5.cloudfront.net/images/pos/Crm.webp"
                  alt="CRM-Management"
                  className="more_with_pp_img"
                />
              </picture>
              <p className="more_woith_pp_titel">CRM</p>
              <p className="more_with_pp_dec">
                Create customer data pools and provide customised customer
                experience to all of them! Earn their loyalty by providing
                reward points
              </p>
              <div className="more_with_explor_wrapper">
                <p className="explore_link more_with_explor">
                  Explore all features
                  <svg
                    width={21}
                    height={16}
                    viewBox="0 0 21 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.666 1L19.666 8M19.666 8L12.666 15M19.666 8L1.66602 8"
                      stroke="currentcolor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>
      
      <section className="explore_addons_boost section_spacing_y">
        <div className="explore-section">
          <div className="wrapper">
            <div className="explore_contents_pagination">
              <div className="exlore_title_prgh">
                <h3 className="exlore_addons_title">
                  Explore Add-ons that boost your business
                </h3>
                <p className="explore_paragh">
                  All-in-one restaurant billing POS system that handles all your
                  operations on a single screen
                </p>
              </div>
              <div className="explore_pag_prev_next">
                <button type="button" className="blaze-prev">
                  ←
                </button>
                <button type="button" className="blaze-next">
                  →
                </button>
              </div>
            </div>

            <div ref={sliderRef} className="blaze-slider">
              <div className="blaze-container">
                <div className="blaze-track-container">
                  <div className="swiper-wrapper blaze-track">
                    {/* Customer Service Section */}
                    <div className="swiper-slide">
                      <div className="explore_slider_subtitle">
                        <h5 className="explore_subtitle">Customer service</h5>
                      </div>
                      <div className="explore_subboxes">
                        <div className="expboxes_img_paragh">
                          <a href="waiter-calling-system.html">
                            <div className="exp_level_icons">
                              <i className="m-icon waiter-calling-system-icon"></i>
                            </div>
                            <p className="exploresubbox_paragh">Waiter calling system</p>
                          </a>
                        </div>
                        <div className="expboxes_img_paragh">
                          <a href="food-ordering-kiosk.html">
                            <div className="exp_level_icons">
                              <i className="m-icon voice-ordering-kiosk-icon"></i>
                            </div>
                            <p className="exploresubbox_paragh">Voice ordering kiosk</p>
                          </a>
                        </div>
                        <div className="expboxes_img_paragh">
                          <a href="scan-and-order.html">
                            <div className="exp_level_icons">
                              <i className="m-icon scan-pay-icon"></i>
                            </div>
                            <p className="exploresubbox_paragh">Scan & Pay</p>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Analytics Section */}
                    <div className="swiper-slide">
                      <div className="explore_slider_subtitle">
                        <h5 className="explore_subtitle">Analytics</h5>
                      </div>
                      <div className="explore_subboxes">
                        <div className="expboxes_img_paragh">
                          <a href="online-order-reconciliation.html">
                            <div className="exp_level_icons">
                              <i className="m-icon online-order-reconcillation-icon"></i>
                            </div>
                            <p className="exploresubbox_paragh">Online order reconciliation</p>
                          </a>
                        </div>
                        <div className="expboxes_img_paragh">
                          <a href="restaurant-analytics-insights.html">
                            <div className="exp_level_icons">
                              <i className="m-icon insights-icon"></i>
                            </div>
                            <p className="exploresubbox_paragh">Dynamic reports</p>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* CRM Section */}
                    <div className="swiper-slide">
                      <div className="explore_slider_subtitle">
                        <h5 className="explore_subtitle">CRM</h5>
                      </div>
                      <div className="explore_subboxes">
                        <div className="expboxes_img_paragh">
                          <a href="restaurant-website.html">
                            <div className="exp_level_icons">
                              <i className="m-icon business-website-icon"></i>
                            </div>
                            <p className="exploresubbox_paragh">Business website</p>
                          </a>
                        </div>
                        <div className="expboxes_img_paragh">
                          <a href="restaurant-loyalty-program.html">
                            <div className="exp_level_icons">
                              <i className="m-icon loyalty-wallet-icon"></i>
                            </div>
                            <p className="exploresubbox_paragh">Loyalty wallet</p>
                          </a>
                        </div>
                        <div className="expboxes_img_paragh">
                          <a href="restaurant-sms-service.html">
                            <div className="exp_level_icons">
                              <i className="m-icon sms-marketing-icon"></i>
                            </div>
                            <p className="exploresubbox_paragh">SMS marketing</p>
                          </a>
                        </div>
                        <div className="expboxes_img_paragh">
                          <a href="customer-feedback-management.html">
                            <div className="exp_level_icons">
                              <i className="m-icon customer-feedback-icon"></i>
                            </div>
                            <p className="exploresubbox_paragh">Customer feedback</p>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Operations Section */}
                    <div className="swiper-slide">
                      <div className="explore_slider_subtitle">
                        <h5 className="explore_subtitle">Operations</h5>
                      </div>
                      <div className="explore_subboxes">
                        <div className="expboxes_img_paragh">
                          <a href="captain-ordering-app.html">
                            <div className="exp_level_icons">
                              <i className="m-icon captain-oprdering-icon"></i>
                            </div>
                            <p className="exploresubbox_paragh">Captain app</p>
                          </a>
                        </div>
                        <div className="expboxes_img_paragh">
                          <a href="online-order-token-management.html">
                            <div className="exp_level_icons">
                              <i className="m-icon token-management-icon"></i>
                            </div>
                            <p className="exploresubbox_paragh">Token management</p>
                          </a>
                        </div>
                        <div className="expboxes_img_paragh">
                          <a href="kitchen-display-system.html">
                            <div className="exp_level_icons">
                              <i className="m-icon kitchen-display-service-icon"></i>
                            </div>
                            <p className="exploresubbox_paragh">Kitchen display service</p>
                          </a>
                        </div>
                        <div className="expboxes_img_paragh">
                          <a href="reservation-manager.html">
                            <div className="exp_level_icons">
                              <i className="m-icon que-management-icon"></i>
                            </div>
                            <p className="exploresubbox_paragh">Reservation Manager</p>
                          </a>
                        </div>
                        <div className="expboxes_img_paragh">
                          <a href="index.html">
                            <div className="exp_level_icons">
                              <i className="m-icon petpooja-pay-icon"></i>
                            </div>
                            <p className="exploresubbox_paragh">Petpooja Pay</p>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <section className="blog section_spacing_y">
        <div className="wrapper">
          <div className="section_heading">
            <h2 className="titel_name">Grow Your Restaurant</h2>
          </div>
          <div className="blog_row">
            <div className="blog_col">
              <div className="blod_content_row">
                <picture>
                  <source
                    srcSet="
                https://d28ewddc5mocr5.cloudfront.net/images/menu-blog/greate-restaurant_sm.webp
              "
                    media="(max-width: 320px)"
                  />
                  <source
                    srcSet="
                https://d28ewddc5mocr5.cloudfront.net/images/menu-blog/greate-restaurant_md.webp
              "
                    media="(max-width: 480px)"
                  />
                  <source
                    srcSet="
                https://d28ewddc5mocr5.cloudfront.net/images/menu-blog/greate-restaurant_lg.webp
              "
                    media="(max-width: 800px)"
                  />
                  <img
                    loading="lazy"
                    src="https://d28ewddc5mocr5.cloudfront.net/images/menu-blog/greate-restaurant.webp"
                    alt="How To Write Great Restaurant Menu Descriptions To Make Your Customers Order More?"
                    className="blog_img"
                  />
                </picture>
                <div className="blog_details">
                  <p className="blog_details_name">
                    How To Write Great Restaurant Menu Descriptions To Make Your
                    Customers Order More?
                  </p>
                  <p className="blog_deeials_dec">
                    Menu designing is an art, its science, its psychology.. in
                    short, its very important. An integral part of menu
                    designing is writing exceptionally good restaurant menu
                    descriptions. It not only represents the menu item but also
                    entices the customer to order more from your menu.
                  </p>
                  <a
                    className="read_more"
                    href="https://blog.petpooja.com/how-to-write-great-restaurant-menu-descriptions-to-make-your-customers-order-more/"
                    target="_blank"
                  >
                    Read more
                    <svg
                      width={21}
                      height={16}
                      viewBox="0 0 21 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.666 1L19.666 8M19.666 8L12.666 15M19.666 8L1.66602 8"
                        stroke="currentcolor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="blog_col">
              <div className="blod_content_row">
                <picture>
                  <source
                    srcSet="
                https://d28ewddc5mocr5.cloudfront.net/images/menu-blog/top-free-menu-restaurant_sm.webp
              "
                    media="(max-width: 320px)"
                  />
                  <source
                    srcSet="
                https://d28ewddc5mocr5.cloudfront.net/images/menu-blog/top-free-menu-restaurant_md.webp
              "
                    media="(max-width: 480px)"
                  />
                  <source
                    srcSet="
                https://d28ewddc5mocr5.cloudfront.net/images/menu-blog/top-free-menu-restaurant_lg.webp
              "
                    media="(max-width: 800px)"
                  />
                  <source
                    srcSet="
                https://d28ewddc5mocr5.cloudfront.net/images/menu-blog/top-free-menu-restaurant_xl.webp
              "
                    media="(max-width: 1024px)"
                  />
                  <img
                    loading="lazy"
                    src="https://d28ewddc5mocr5.cloudfront.net/images/menu-blog/top-free-menu-restaurant.webp"
                    alt="Top 5 Free Restaurant Menu Designing Tools For Your Restaurant"
                    className="blog_img"
                  />
                </picture>
                <div className="blog_details">
                  <p className="blog_details_name">
                    Top 5 Free Restaurant Menu Designing Tools For Your
                    Restaurant
                  </p>
                  <p className="blog_deeials_dec">
                    A menu is the soul of your restaurant! It reflects the
                    personality of your restaurant. A well-designed menu can be
                    a great brand-building tool that can leave a lasting
                    impression on your customers.
                  </p>
                  <a
                    className="read_more"
                    href="https://blog.petpooja.com/top-5-free-restaurant-menu-designing-tools-for-your-restaurant/"
                    target="_blank"
                  >
                    Read more
                    <svg
                      width={21}
                      height={16}
                      viewBox="0 0 21 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.666 1L19.666 8M19.666 8L12.666 15M19.666 8L1.66602 8"
                        stroke="currentcolor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="blog_col">
              <div className="blod_content_row">
                <picture>
                  <source
                    srcSet="
                https://d28ewddc5mocr5.cloudfront.net/images/menu-blog/secret-restuarant-menu_sm.webp
              "
                    media="(max-width: 320px)"
                  />
                  <source
                    srcSet="
                https://d28ewddc5mocr5.cloudfront.net/images/menu-blog/secret-restuarant-menu_md.webp
              "
                    media="(max-width: 480px)"
                  />
                  <source
                    srcSet="
                https://d28ewddc5mocr5.cloudfront.net/images/menu-blog/secret-restuarant-menu_lg.webp
              "
                    media="(max-width: 800px)"
                  />
                  <source
                    srcSet="
                https://d28ewddc5mocr5.cloudfront.net/images/menu-blog/secret-restuarant-menu_xl.webp
              "
                    media="(max-width: 1024px)"
                  />
                  <img
                    loading="lazy"
                    src="https://d28ewddc5mocr5.cloudfront.net/images/menu-blog/secret-restuarant-menu.webp"
                    alt="Menu Engineering- Secret to a Profitable Restaurant Menu"
                    className="blog_img"
                  />
                </picture>
                <div className="blog_details">
                  <p className="blog_details_name">
                    Menu Engineering- Secret to a Profitable Restaurant Menu
                  </p>
                  <p className="blog_deeials_dec">
                    Great thought and effort go into tailoring a Restaurant
                    Menu. Your restaurant menu is so much more than a beautiful
                    design and a list of food. It is also one of the most
                    powerful yet underrated Sales &amp; Marketing tools. Apart
                    from all the hospitality and services you provide, the
                    foremost reason customers come to your restaurant is for the
                    food you offer. And your menu is where your food gives its
                    first impression.
                  </p>
                  <a
                    className="read_more"
                    href="https://blog.petpooja.com/the-secret-to-a-profitable-restaurant-menu/"
                    target="_blank"
                  >
                    Read more
                    <svg
                      width={21}
                      height={16}
                      viewBox="0 0 21 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.666 1L19.666 8M19.666 8L12.666 15M19.666 8L1.66602 8"
                        stroke="currentcolor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <section className="billing_faqs section_spacing_y">
        <div className="wrapper">
          <h2 className="faq_title">FAQs</h2>
          <div className="accordion_billing">
            <div className="accordion_body active">
              <div className="accordion_head">
                <h4 className="accordion_title_pos">
                  Will I be able to manage multiple online menus for my large
                  chains?
                </h4>
                <i className="m-icon chvron_right" />
              </div>
              <div className="accordion_content">
                You can manage the multiple online menus for websites and
                third-party platforms for your large chains from a single
                Petpooja's owners dashboard without hassle
              </div>
            </div>
            <div className="accordion_body">
              <div className="accordion_head">
                <h4 className="accordion_title_pos">
                  How much time will it take for me to update my restaurant's
                  menu?
                </h4>
                <i className="m-icon chvron_right" />
              </div>
              <div className="accordion_content">
                You can update the entire menu of your restaurant in just one
                single click!
              </div>
            </div>
            <div className="accordion_body">
              <div className="accordion_head">
                <h4 className="accordion_title_pos">
                  Can I control my online menu on different aggregator
                  platforms?
                </h4>
                <i className="m-icon chvron_right" />
              </div>
              <div className="accordion_content">
                Yes! You can toggle on/ off your restaurant's menu on any
                third-party platform right from the billing screen. You can also
                regulate your menu's open/ close time so that you sell only when
                there is stock availability!
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default HomePage
