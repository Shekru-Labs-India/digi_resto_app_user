import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CompanyVersion from '../constants/CompanyVersion';
// import '../assets/styles.css'
// import '../assets/custom.css'
import config from "../component/config"
const HotelList = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch( `${config.apiDomain}/user_api/get_all_restaurants`);
        const data = await response.json();
        if (data.st === 1) {
          const formattedHotels = data.restaurants.map((hotel) => {
            const code = hotel.code || (hotel.resto_url && hotel.resto_url.match(/\/(\d{6})\//)[1]);
            return { ...hotel, code };
          });
          setHotels(formattedHotels);
        } else {
       
        }
      } catch (error) {
       
      }
    };

    fetchHotels();
  }, []);

  return (
    <div className="page-wrapper full-height">
      <main className="page-content pt-0">
        <div className="container py-1 px-0">
          <div className="d-flex justify-content-center"></div>
          {hotels.map((hotel) => (
            <div className="card rounded-4" key={hotel.restaurant_id}>
              {hotel.code ? (
                <Link to={`/user_app/${hotel.code}`}>
                  <div className="card-body py-0">
                    <div className="row text-start">
                      <div className="col-12">
                        <div className="row mt-2">
                          <div className="col-1 d-flex align-items-center">
                            <i className="ri-store-2-line font_size_14 fw-medium"></i>
                          </div>
                          <div className="col-10 d-flex align-items-center">
                            <span className="font_size_14 fw-medium m-0">
                              {hotel.restaurant_name.toUpperCase()} <div className="badge badge-info">Test Data</div>
                            </span>
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
                        <div className="row mt-1 pb-1">
                          <div className="col-1">
                            <i className="ri-map-pin-line gray-text"></i>
                          </div>
                          <div className="col-10 d-flex align-items-center">
                            <span className="gray-text font_size_12">
                              {hotel.address
                                .split(" ")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1).toLowerCase()
                                )
                                .join(" ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="card-body py-0">
                  <p>Code not available</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <div className="align-bottom">
        <div className="text-center text-md-center mt-2 gray-text font_size_12 fixed-bottom pb-5">
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
    </div>
  );
};

export default HotelList;