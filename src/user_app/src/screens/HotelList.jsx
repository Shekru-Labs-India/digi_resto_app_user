import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import '../assets/styles.css'
// import '../assets/custom.css'
import config from "../component/config";
const HotelList = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(
          `${config.apiDomain}/user_api/get_all_restaurants`
        );
        const data = await response.json();
        if (data.st === 1) {
          const formattedHotels = data.restaurants.map((hotel) => {
            const code =
              hotel.code ||
              (hotel.resto_url && hotel.resto_url.match(/\/(\d{6})\//)[1]);
            return { ...hotel, code };
          });
          setHotels(formattedHotels);

          // localStorage.removeItem("isRestaurantOpen");
          // localStorage.removeItem("restaurantStatus");
          localStorage.removeItem("allOrderList");
        } else {
        }
      } catch (error) {}
    };

    fetchHotels();
  }, []);

  return (
    <div className="page-wrapper">
      <main className="page-content pt-0">
        <div className="container py-1 px-0">
          <div className="d-flex justify-content-center"></div>
          {hotels.map((hotel) => (
            <div className="card rounded-4" key={hotel.restaurant_id}>
              <Link to={`/user_app/${hotel.code}`}>
                <div className={`card-body py-0 ${hotel.is_open === false ? "bg-light rounded-4" : ""}`}>
                  <div className="row text-start">
                    <div className="col-12">
                      <div className="row mt-2 align-items-center">
                        <div className="col-1">
                          <i className="ri-store-2-line font_size_14 fw-medium"></i>
                        </div>
                        <div className="col-7">
                          <span className="font_size_14 fw-medium m-0">
                            {hotel.restaurant_name.toUpperCase()}
                          </span>
                        </div>
                        <div className="col-4 d-flex justify-content-end pe-3">
                          {hotel.is_open === false && (
                            <span className="badge bg-danger small">
                              Closed
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="row mt-1">
                        <div className="col-1 d-flex align-items-center">
                          <i className="ri-phone-line text-primary"></i>
                        </div>
                        <div className="col-10 d-flex align-items-center">
                          <span className="text-primary font_size_12">
                            {hotel.mobile}
                          </span>
                        </div>
                      </div>
                      <div className="row mt-1 pb-1 align-items-center">
                        <div className="col-1">
                          <i className="ri-map-pin-line gray-text"></i>
                        </div>
                        <div className="col-7 d-flex align-items-center">
                          <span className="gray-text font_size_12">
                            {hotel.address}
                          </span>
                        </div>
                        <div className="col-4 d-flex justify-content-end pe-3">
                          {hotel.veg_nonveg && (
                            <div
                              className={`border rounded-1 bg-white d-flex justify-content-center align-items-center ${
                                ['veg', 'Veg', 'VEG'].includes(hotel.veg_nonveg)
                                  ? "border-success"
                                  : "border-danger"
                              }`}
                              style={{
                                height: "20px",
                                width: "20px",
                                borderWidth: "2px",
                              }}
                            >
                              <i
                                className={`${
                                  ['veg', 'Veg', 'VEG'].includes(hotel.veg_nonveg)
                                    ? "ri-checkbox-blank-circle-fill text-success"
                                    : "ri-triangle-fill text-danger"
                                } font_size_12`}
                              ></i>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="align-bottom border-top">
          <div className="text-center text-md-center mt-2 gray-text font_size_12 pb-5">
            <div className="my-4">
              <div className="text-center d-flex justify-content-center">
                <a
                  href="https://www.facebook.com/people/Menu-Mitra/61565082412478/"
                  className="footer-link mx-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ri-facebook-circle-fill ri-xl"></i>
                </a>
                <a
                  href="https://www.instagram.com/menumitra/"
                  className="footer-link mx-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ri-instagram-line ri-xl"></i>
                </a>
                <a
                  href="https://www.youtube.com/@menumitra"
                  className="footer-link mx-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ri-youtube-line ri-xl"></i>
                </a>
                <a
                  href="https://www.linkedin.com/company/102429337/admin/dashboard/"
                  className="footer-link mx-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ri-linkedin-fill ri-xl"></i>
                </a>
                <a
                  href="https://www.threads.net/@menumitra"
                  className="footer-link mx-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ri-twitter-x-line ri-xl"></i>
                </a>
                <a
                  href="https://t.me/MenuMitra"
                  className="footer-link mx-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ri-telegram-line ri-xl"></i>
                </a>
              </div>
            </div>
            <i className="ri-flashlight-fill ri-lg"></i> Powered by <br />
            <a
              className="text-success font_size_12"
              href="https://www.shekruweb.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shekru Labs India Pvt. Ltd.
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HotelList;
