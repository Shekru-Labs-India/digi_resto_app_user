import React from 'react'
import Header from './Header'
import Footer from './Footer'
import {useEffect} from 'react'

function FAQs() {
      useEffect(() => {
        // HubSpot Form Implementation
        const loadHubSpotForm = () => {
          const script = document.createElement("script");
          script.src = "https://js.hsforms.net/forms/embed/v2.js";
          script.charset = "utf-8";
          script.type = "text/javascript";

          script.onload = () => {
            if (window.hbspt) {
              window.hbspt.forms.create({
                region: "na1",
                portalId: "2270269",
                formId: "10519404-1203-4494-9469-6e971d1cbcfa",
                target: "#hubspot-form-placeholder",
                css: "",
                customStyles: {
                  formField: {
                    borderRadius: "8px",
                    borderColor: "#E5E7EB",
                    backgroundColor: "#FFFFFF",
                    labelColor: "#1A1A1A",
                    inputColor: "#1A1A1A",
                    fontSize: "16px",
                    fontFamily: "inherit",
                  },
                  submit: {
                    backgroundColor: "#C52031",
                    hoverBackgroundColor: "#A41B29",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "500",
                  },
                },
              });
            }
          };

          document.head.appendChild(script);
        };

        // Create intersection observer for lazy loading
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadHubSpotForm();
              observer.disconnect();
            }
          });
        });

        // Start observing the form placeholder
        const formPlaceholder = document.querySelector(
          "#hubspot-form-placeholder"
        );
        if (formPlaceholder) {
          observer.observe(formPlaceholder);
        }

        return () => observer.disconnect();
      }, []);
  return (
    <div>
      <Header />
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
                MenuMitra POS runs smoothly with multiple billing stations!
                Whether it is two billing stations of 10, you need just one POS
                to manage them all without hassle.
              </div>
            </div>
            <div className="accordion_body">
              <div className="accordion_head">
                <h4 className="accordion_title_pos">
                  Which hardware will I be required to use MenuMitra POS?
                </h4>
                <i className="m-icon chvron_right" />
              </div>
              <div className="accordion_content">
                MenuMitra POS works smoothly with iOS, Windows, and Android
                laptops, computers, tablets and phones.
              </div>
            </div>
            <div className="accordion_body">
              <div className="accordion_head">
                <h4 className="accordion_title_pos">
                  Does MenuMitra POS support an A4 printer?
                </h4>
                <i className="m-icon chvron_right" />
              </div>
              <div className="accordion_content">
                Yes! MenuMitra POS supports your regular A4 printers and WiFi,
                LAN, USB, Dot-matrix, Laser, Label, A4 size, A5 size, Bluetooth,
                etc.!
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
                    previous POS to MenuMitra
                  </li>
                  <li className="accordion_content-list">
                    The team will also help re-install the previous aggregator
                    setup onto MenuMitra POS
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default FAQs