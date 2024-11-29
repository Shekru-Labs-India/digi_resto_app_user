import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import '../assets/styles.css'
// import '../assets/custom.css'
import config from "../component/config";
const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");

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
          setFilteredHotels(formattedHotels);

          // localStorage.removeItem("isRestaurantOpen");
          // localStorage.removeItem("restaurantStatus");
          localStorage.removeItem("allOrderList");
        } else {
        }
      } catch (error) {}
    };

    fetchHotels();
  }, []);

  const handleFilter = (type) => {
    setActiveFilter(type);
    applyFilters(type, activeStatusFilter); // Pass current status filter
  };

  const handleStatusFilter = (status) => {
    setActiveStatusFilter(status);
    applyFilters(activeFilter, status); // Pass current veg/nonveg filter
  };

  const applyFilters = (type, status) => {
    let filtered = [...hotels];

    // Apply veg/nonveg filter
    if (type !== "all") {
      filtered = filtered.filter((hotel) =>
        type === "veg"
          ? ["veg", "Veg", "VEG"].includes(hotel.veg_nonveg)
          : !["veg", "Veg", "VEG"].includes(hotel.veg_nonveg)
      );
    }

    // Apply open/closed filter
    if (status !== "all") {
      filtered = filtered.filter((hotel) =>
        status === "open" ? hotel.is_open === true : hotel.is_open === false
      );
    }

    setFilteredHotels(filtered);
  };

  return (
    <div className="page-wrapper">
      <main className="page-content pt-0">
        <div className="container py-1 px-0">
          <div className="d-flex justify-content-between mb-3">
            <div className="btn-group btn-group-sm">
              <button
                className={`btn fw-normal p-2 btn-outline-info ${
                  activeFilter === "all" ? "active text-white" : ""
                }`}
                onClick={() => handleFilter("all")}
              >
                All
              </button>
              <button
                className={`btn fw-normal p-2 btn-outline-success ${
                  activeFilter === "veg" ? "active text-white" : ""
                }`}
                onClick={() => handleFilter("veg")}
              >
                Veg
              </button>
              <button
                className={`btn fw-normal p-2 btn-outline-warning ${
                  activeFilter === "nonveg" ? "active text-white" : ""
                }`}
                onClick={() => handleFilter("nonveg")}
              >
                Non-Veg
              </button>
            </div>
            <div className="btn-group btn-group-sm">
              <button
                className={`btn p-2 btn-outline-info ${
                  activeStatusFilter === "all" ? "active text-white" : ""
                }`}
                onClick={() => handleStatusFilter("all")}
              >
                All
              </button>
              <button
                className={`btn p-2 btn-outline-success ${
                  activeStatusFilter === "open" ? "active text-white" : ""
                }`}
                onClick={() => handleStatusFilter("open")}
              >
                Open
              </button>
              <button
                className={`btn p-2 btn-outline-warning ${
                  activeStatusFilter === "closed" ? "active text-white" : ""
                }`}
                onClick={() => handleStatusFilter("closed")}
              >
                Closed
              </button>
            </div>
          </div>
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => (
              <div className="card rounded-4" key={hotel.restaurant_id}>
                <Link to={`/user_app/${hotel.code}`}>
                  <div
                    className={`card-body py-0 ${
                      hotel.is_open === false ? "bg-light rounded-4" : ""
                    }`}
                  >
                    <div className="row">
                      <div className="col-12">
                        <div className="row mt-2 d-flex justify-content-between">
                          <div className="col-1">
                            <i className="fa-solid fa-store font_size_14 "></i>
                          </div>
                          <div className="col-6 ps-0">
                            <span className="font_size_14 fw-medium m-0">
                              {hotel.restaurant_name.toUpperCase()}
                            </span>
                          </div>
                          <div className="col-4">
                            <div className="d-flex justify-content-end">
                              {hotel.is_open === false && (
                                <span className="badge btn-dark light small ">
                                  Closed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="row mt-1">
                          <div className="col-1 d-flex align-items-center">
                            <i className="fa-solid fa-phone text-primary font_size_12"></i>
                          </div>
                          <div className="col-10 d-flex align-items-center">
                            <span className="text-primary font_size_12">
                              {hotel.mobile}
                            </span>
                          </div>
                        </div>
                        <div className="row mb-2 d-flex justify-content-between">
                          <div className="col-1">
                            <i className="fa-solid fa-location-dot gray-text font_size_12"></i>
                          </div>
                          <div className="col-6 ps-0">
                            <span className="gray-text font_size_12">
                              {hotel.address}
                            </span>
                          </div>
                          <div className="col-4">
                            <div className="d-flex justify-content-end">
                              {hotel.veg_nonveg && (
                                <div
                                  className={`border rounded-1 bg-white d-flex justify-content-center align-items-center ${
                                    ["veg", "Veg", "VEG"].includes(
                                      hotel.veg_nonveg
                                    )
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
                                      ["veg", "Veg", "VEG"].includes(
                                        hotel.veg_nonveg
                                      )
                                        ? "fa-solid fa-circle text-success"
                                        : "fa-solid fa-play fa-rotate-270 text-danger"
                                    } font_size_12`}
                                  ></i>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="card rounded-4 p-0 text-center">
              <div className="card-body">
                <i className="ri-restaurant-2-line font_size_24 mb-2 text-muted"></i>
                <h5 className="text-muted mb-2">No Restaurants Found</h5>
                <p className="text-muted font_size_14">
                  {activeFilter !== "all" && activeStatusFilter !== "all"
                    ? `No ${activeFilter} restaurants are currently ${activeStatusFilter}`
                    : activeFilter !== "all"
                    ? `No ${activeFilter} restaurants available`
                    : activeStatusFilter !== "all"
                    ? `No restaurants are currently ${activeStatusFilter}`
                    : "No restaurants available at the moment"}
                </p>
              </div>
            </div>
          )}
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
                  <i className="fa-brands fa-facebook "></i>
                </a>
                <a
                  href="https://www.instagram.com/menumitra/"
                  className="footer-link mx-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a
                  href="https://www.youtube.com/@menumitra"
                  className="footer-link mx-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-youtube"></i>
                </a>
                <a
                  href="https://www.linkedin.com/company/102429337/admin/dashboard/"
                  className="footer-link mx-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-linkedin"></i>
                </a>
                <a
                  href="https://x.com/MenuMitra"
                  className="footer-link mx-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-x-twitter"></i>
                </a>
                <a
                  href="https://t.me/MenuMitra"
                  className="footer-link mx-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-telegram"></i>
                </a>
              </div>
            </div>
            <i className="fa-solid fa-bolt"></i> Powered by <br />
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
