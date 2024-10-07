import React, { useEffect, useState } from 'react'
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
        {/* <div className="card rounded-3">
          <a href="https://shekru-labs-india.github.io/digi_resto_app_user/#/751231/1">
            <div class="card-body py-0">
              <div class="row text-start">
                <div class="col-12">
                  <div class="row mt-2">
                    <div class="col-1 d-flex align-items-center">
                      <i class="ri-store-2-line fs-4"></i>
                    </div>
                    <div class="col-10 d-flex align-items-center">
                      <span class="menu_name fs-3 m-0">Jagdamb</span>
                    </div>
                  </div>
                  <div class="row mt-2">
                    <div class="col-1 d-flex align-items-center">
                      <i class="ri-phone-line text-primary fs-4"></i>
                    </div>
                    <div class="col-10 d-flex align-items-center">
                      <span class="text-primary fs-6">+91 8888888888</span>
                    </div>
                  </div>
                  <div class="row mt-2 pb-2">
                    <div class="col-1">
                      <i class="ri-map-pin-line gray-text fs-4"></i>
                    </div>
                    <div class="col-10 d-flex align-items-center">
                      <span class="gray-text fs-6">
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Aut, laboriosam.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div> */}
        <div className="container py-1">
          <div className="d-flex justify-content-center">
            {/* <button type="button" className="btn btn-primary my-3">
              <i className="ri-qr-scan-2-line pe-2 fs-2"></i>Scan QR
            </button> */}
          </div>
          {hotels.map((hotel) => (
            <div className="card rounded-3" key={hotel.restaurant_id}>
              <a href={hotel.resto_url}>
                <div className="card-body py-0">
                  <div className="row text-start">
                    <div className="col-12">
                      <div className="row mt-2">
                        <div className="col-1 d-flex align-items-center">
                          <i className="ri-store-2-line fs-4"></i>
                        </div>
                        <div className="col-10 d-flex align-items-center">
                          <span className="menu_name fs-5 m-0">
                            {hotel.restaurant_name}
                          </span>
                        </div>
                      </div>
                      <div className="row mt-1">
                        <div className="col-1 d-flex align-items-center">
                          <i className="ri-phone-line text-primary fs-4"></i>
                        </div>
                        <div className="col-10 d-flex align-items-center">
                          <span className="text-primary fs-6">
                            {hotel.mobile}
                          </span>
                        </div>
                      </div>
                      <div className="row mt-1 pb-1">
                        <div className="col-1">
                          <i className="ri-map-pin-line gray-text fs-4"></i>
                        </div>
                        <div className="col-10 d-flex align-items-center">
                          <span className="gray-text fs-6">{hotel.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </main>
      {/* <div className="menubar-area footer-fixed">
        <div className="toolbar-inner menubar-nav">
          <a className="nav-link" href="#/568400/1">
            <i className="ri-home-2-line fs-3"></i><span className="name">Home</span>
          </a>
          <a className="nav-link active" href="#/Wishlist">
            <i className="ri-heart-2-line fs-3"></i><span className="name">Favourite</span>
          </a>
          <a className="nav-link" href="#/Cart">
            <i className="ri-shopping-cart-line fs-3"></i><span className="name">My Cart</span>
          </a>
          <a className="nav-link" href="#/Search">
            <i className="ri-search-line fs-3"></i><span className="name">Search</span>
          </a>
          <a className="nav-link" href="#/Profile">
            <i className="ri-user-3-fill fs-3"></i><span className="name">Profile</span>
          </a>
        </div>
      </div> */}
    </div>
  );
}

export default HotelList