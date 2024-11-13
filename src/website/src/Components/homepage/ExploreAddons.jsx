import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './ExploreAddons.css';

const slides = [
  {
    title: "Customer service",
    items: [
      {
        href: "waiter-calling-system.html",
        icon: "waiter-calling-system-icon",
        text: "Waiter calling system"
      },
      {
        href: "food-ordering-kiosk.html",
        icon: "voice-ordering-kiosk-icon",
        text: "Voice ordering kiosk"
      },
      {
        href: "scan-and-order.html",
        icon: "scan-pay-icon",
        text: "Scan & Pay"
      }
    ]
  },
  {
    title: "Analytics",
    items: [
      {
        href: "online-order-reconciliation.html",
        icon: "online-order-reconcillation-icon",
        text: "Online order reconcillation"
      },
      {
        href: "restaurant-analytics-insights.html",
        icon: "insights-icon",
        text: "Dynamic reports"
      }
    ]
  },
  {
    title: "CRM",
    items: [
      {
        href: "restaurant-website.html",
        icon: "business-website-icon",
        text: "Business website"
      },
      {
        href: "restaurant-loyalty-program.html",
        icon: "loyalty-wallet-icon",
        text: "Loyalty wallet"
      },
      {
        href: "restaurant-sms-service.html",
        icon: "sms-marketing-icon",
        text: "SMS marketing"
      },
      {
        href: "customer-feedback-management.html",
        icon: "customer-feedback-icon",
        text: "Customer feedback"
      }
    ]
  },
  {
    title: "Operations",
    items: [
      {
        href: "captain-ordering-app.html",
        icon: "captain-oprdering-icon",
        text: "Captain app"
      },
      {
        href: "online-order-token-management.html",
        icon: "token-management-icon",
        text: "Token management"
      },
      {
        href: "kitchen-display-system.html",
        icon: "kitchen-display-service-icon",
        text: "Kitchen display service"
      },
      {
        href: "reservation-manager.html",
        icon: "que-management-icon",
        text: "Reservation Manager"
      },
      {
        href: "index.html",
        icon: "petpooja-pay-icon",
        text: "Petpooja Pay"
      }
    ]
  }
];

function ExploreAddons() {
  return (
    <section className="explore_addons_boost section_spacing_y">
      <div className="explore-section">
        <div className="wrapper">
          <div className="explore_addons_slider">
            <div className="explore_contents_pagination">
              <div className="exlore_title_prgh">
                <h3 className="exlore_addons_title">
                  Explore Add-ons that boost your business
                </h3>
                <p className="explore_paragh">
                  All-in-one restaurant billing POS system that handles all
                  your operations on a single screen
                </p>
              </div>
            </div>

            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={2}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{ clickable: true }}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 10
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 20
                }
              }}
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <div className="explore_slider_subtitle">
                    <h5 className="explore_subtitle">{slide.title}</h5>
                  </div>
                  <div className="explore_subboxes">
                    {slide.items.map((item, itemIndex) => (
                      <div className="expboxes_img_paragh" key={itemIndex}>
                        <a href={item.href}>
                          <div className="exp_level_icons">
                            <i className={`m-icon ${item.icon}`} />
                          </div>
                          <p className="exploresubbox_paragh">{item.text}</p>
                        </a>
                      </div>
                    ))}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExploreAddons;
