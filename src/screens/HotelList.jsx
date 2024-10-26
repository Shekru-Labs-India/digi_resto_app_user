import React, { useEffect, useState } from 'react'
import CompanyVersion from '../constants/CompanyVersion';
// import '../assets/styles.css'
// import '../assets/custom.css'

const HotelList = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('https://menumitra.com/user_api/get_all_restaurants');
        const data = await response.json();
        if (data.st === 1) {
          setHotels(data.restaurants);
        } else {
          console.error('Failed to fetch hotels:', data.msg);
        }
      } catch (error) {
        console.error('Error fetching hotels:', error);
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
            <div className="card rounded-3" key={hotel.restaurant_id}>
              <a href={hotel.resto_url}>
                <div className="card-body py-0">
                  <div className="row text-start">
                    <div className="col-12">
                      <div className="row mt-2">
                        <div className="col-1 d-flex align-items-center">
                          <i className="ri-store-2-line font_size_14 fw-medium"></i>
                        </div>
                        <div className="col-10 d-flex align-items-center">
                          <span className="font_size_14 fw-medium m-0">
                            {hotel.restaurant_name.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="row mt-1">
                        <div className="col-1 d-flex align-items-center">
                          <i className="ri-phone-line text-primary  "></i>
                        </div>
                        <div className="col-10 d-flex align-items-center">
                          <span className="text-primary font_size_12 ">
                            {hotel.mobile}
                          </span>
                        </div>
                      </div>
                      <div className="row mt-1 pb-1">
                        <div className="col-1">
                          <i className="ri-map-pin-line gray-text  "></i>
                        </div>
                        <div className="col-10 d-flex align-items-center">
                          <span className="gray-text font_size_14">
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
              </a>
            </div>
          ))}
          <div className="">
            <div className="my-4">
              <div class="text-center d-flex justify-content-center pt-5">
                <a
                  href="https://www.facebook.com/share/ra9cKRDkDpy2W94j/?mibextid=qi2Omg"
                  class="footer-link mx-3"
                  target="_blank"
                >
                  <i class="ri-facebook-circle-fill ri-xl "></i>
                </a>
                <a
                  href="https://www.instagram.com/autoprofito/?next=%2F"
                  class="footer-link mx-3"
                  target="_blank"
                >
                  <i class="ri-instagram-line ri-xl "></i>
                </a>
                <a
                  href="https://www.youtube.com/channel/UCgfTIIUL16SyHAQzQNmM52A"
                  class="footer-link mx-3"
                  target="_blank"
                >
                  <i class="ri-youtube-line ri-xl "></i>
                </a>
                <a
                  href="https://www.linkedin.com/company/104616702/admin/dashboard/"
                  class="footer-link mx-3"
                  target="_blank"
                >
                  <i class="ri-linkedin-fill ri-xl "></i>
                </a>
                <a
                  href="https://www.threads.net/@autoprofito"
                  class="footer-link mx-3"
                  target="_blank"
                >
                  <i class="ri-twitter-x-line ri-xl "></i>
                </a>
                <a
                  href="https://t.me/Autoprofito"
                  class="footer-link mx-3"
                  target="_blank"
                >
                  <i class="ri-telegram-line ri-xl "></i>
                </a>
              </div>
            </div>
            <p className="text-center text-md-center mt-5 gray-text">
              <i className="ri-flashlight-fill ri-lg"></i> Powered by <br />
              <a
                className="gray-text"
                href="https://www.shekruweb.com"
                target="_blank"
              >
                Shekru Labs India Pvt. Ltd.
              </a>
              <div className="">v1.1</div>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HotelList