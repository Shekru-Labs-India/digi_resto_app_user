import React, { useEffect, useState } from "react";
import { Link ,useNavigate} from "react-router-dom";

import config, { APP_VERSION } from "../component/config";
import logo from "../assets/logos/menumitra_logo_128.png";
import Notice from "../component/Notice";
const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
const navigate = useNavigate();
  useEffect(() => {
    const fetchHotels = async () => {
      try {
     // Store the hardcoded access token in localStorage
// localStorage.setItem(
//   "access_token",
//   ""
// );

// Fetch API request using the stored token
const response = await fetch(
  `${config.apiDomain}/user_api/get_all_restaurants`,
  // {
  //   headers: {
  //     'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
  //     'Content-Type': 'application/json'
  //   }
  // }
);

        
        const data = await response.json();
        if (data.st === 1) {
          const formattedHotels = data.outlets.map((outlets) => {
            const code = outlets.resto_url.split("user_app/")[1]?.split("/")[0];
            const urlParts = outlets.resto_url.split("/");
            const sectionId = urlParts[urlParts.length - 1];
            const tableNo = urlParts[urlParts.length - 2];

            return {
              ...outlets,
              code,
              section_id: sectionId, 
              table_no: tableNo,
            };
          });
          setHotels(formattedHotels);
          setFilteredHotels(formattedHotels);

          localStorage.removeItem("allOrderList");
        }
      } catch (error) {
        console.error('Error:', error);
      }
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
      filtered = filtered.filter((outlets) =>
        type === "veg"
          ? ["veg", "Veg", "VEG"].includes(outlets.veg_nonveg)
          : !["veg", "Veg", "VEG"].includes(outlets.veg_nonveg)
      );
    }

    // Apply open/closed filter
    if (status !== "all") {
      filtered = filtered.filter((outlets) =>
        status === "open" ? outlets.is_open === true : outlets.is_open === false
      );
    }

    setFilteredHotels(filtered);
  };

  const handleHotelClick = (outlets) => {
    if (!outlets.is_outlet_filled) {
      navigate("/user_app/Index");
    } else {
      localStorage.setItem("sectionId", outlets.section_id);
      localStorage.setItem("restaurantCode", outlets.code);
      localStorage.setItem("tableNumber", outlets.table_no);
  
      const url = `/user_app/${outlets.code}/s${outlets.section_id}/t${outlets.table_no}`;
      console.log(`Navigating to ${url}`);
      navigate(url);
    }
  };
  

  return (
    <div className="page-wrapper">
      <main className="page-content pt-0">
        <div className="d-flex flex-column">
          {/* Fixed Header with Filters */}
          <div className="container py-1 px-0">
            <div className="d-flex justify-content-between mb-3">
              <div className="btn-group btn-group-sm">
                <button
                  className={`btn fw-normal p-2 btn-outline-info shadow-lg ${
                    activeFilter === "all" ? "active text-white" : ""
                  }`}
                  onClick={() => handleFilter("all")}
                >
                  All
                </button>
                <button
                  className={`btn fw-normal p-2 btn-outline-success shadow-lg ${
                    activeFilter === "veg" ? "active text-white" : ""
                  }`}
                  onClick={() => handleFilter("veg")}
                >
                  Veg
                </button>
                <button
                  className={`btn fw-normal p-2 btn-outline-warning shadow-lg ${
                    activeFilter === "nonveg" ? "active text-white" : ""
                  }`}
                  onClick={() => handleFilter("nonveg")}
                >
                  Non-Veg
                </button>
              </div>
              <div className="btn-group btn-group-sm">
                <button
                  className={`btn p-2 btn-outline-info shadow-lg ${
                    activeStatusFilter === "all" ? "active text-white" : ""
                  }`}
                  onClick={() => handleStatusFilter("all")}
                >
                  All
                </button>
                <button
                  className={`btn p-2 btn-outline-success shadow-lg ${
                    activeStatusFilter === "open" ? "active text-white" : ""
                  }`}
                  onClick={() => handleStatusFilter("open")}
                >
                  Open
                </button>
                <button
                  className={`btn fw-normal p-2 btn-outline-warning shadow-lg ${
                    activeStatusFilter === "closed" ? "active text-white" : ""
                  }`}
                  onClick={() => handleStatusFilter("closed")}
                >
                  Closed
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Hotel List */}
          <div
            className="container py-1 px-0 flex-grow-1 scrollable-container"
            // style={{
            //   overflowY: 'auto',
            //   maxHeight: 'calc(85vh - 250px)' // Adjust based on your header and footer height
            // }}
          >
            {filteredHotels.length > 0 ? (
              filteredHotels.map((outlets) => (
                <div className="card rounded-4" key={outlets.outlet_id}>
                  {outlets.is_open ? (
                    <div onClick={() => handleHotelClick(outlets)}>
                      <CardContent outlets={outlets} />
                    </div>
                  ) : (
                    <CardContent outlets={outlets} />
                  )}
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
        </div>
        <div className="align-bottom border-top">
          <div className="d-flex justify-content-center py-0">
            <Link to="/">
              {" "}
              <div className="d-flex align-items-center mt-4 mb-0">
                <img src={logo} alt="logo" width="40" height="40" />
                <div className="text-dark mb-0 mt-1 fw-semibold font_size_18 ms-2">
                  MenuMitra
                </div>
              </div>
            </Link>
          </div>
          <div className="text-center text-md-center gray-text font_size_12 pb-5">
            <div className="my-4">
              <div className="text-center d-flex justify-content-center">
                <a
                  href="https://www.facebook.com/people/Menu-Mitra/61565082412478/"
                  className="footer-link mx-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-facebook fs-4"></i>
                </a>
                <a
                  href="https://www.instagram.com/menumitra/"
                  className="footer-link mx-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-instagram fs-4"></i>
                </a>
                <a
                  href="https://www.youtube.com/@menumitra"
                  className="footer-link mx-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-youtube fs-4"></i>
                </a>

                <a
                  href="https://x.com/MenuMitra"
                  className="footer-link mx-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-x-twitter fs-4"></i>
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
            <p className="text-center font_size_12">version {APP_VERSION}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

const CardContent = ({ outlets }) => (
  <div
    className={`card-body py-2 ${
      outlets.is_open === false ? "bg-light rounded-4" : ""
    }`}
  >
    <div className="d-flex justify-content-between align-items-center mb-2">
      <div className="d-flex align-items-center">
        <i className="fa-solid fa-store font_size_14"></i>
        <span className="font_size_14 fw-medium ms-2">
          {outlets.outlet_name?.toUpperCase()}
        </span>
      </div>

      <div className="d-flex align-items-center gap-2">
        {outlets.is_open === false && (
          <span className="badge badge-light rounded-pill">Closed</span>
        )}
        {outlets.veg_nonveg && (
          <div
            className={`border rounded-1 bg-white d-flex justify-content-center align-items-center ${
              ["veg", "Veg", "VEG"].includes(outlets.veg_nonveg)
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
                ["veg", "Veg", "VEG"].includes(outlets.veg_nonveg)
                  ? "fa-solid fa-circle text-success"
                  : "fa-solid fa-play fa-rotate-270 text-danger"
              } font_size_12`}
            ></i>
          </div>
        )}
      </div>
    </div>

    <div className="d-flex justify-content-end gap-2">
      <a
        href={`tel:${outlets.mobile}`}
        className="btn btn-outline-primary btn-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <i className="fa-solid fa-phone me-1"></i>
        Call
      </a>
      <a
        href={`https://maps.google.com/?q=${encodeURIComponent(
          outlets.address
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-outline-primary btn-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <i className="fa-solid fa-location-dot me-1"></i>
        Map
      </a>
    </div>
  </div>
);

export default HotelList;
