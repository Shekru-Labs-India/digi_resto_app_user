import React, { useState } from 'react';
import Bottom from "../component/bottom";
import Header from "../components/Header";
import HotelNameAndTable from "../components/HotelNameAndTable";
import images from "../assets/MenuDefault.png";
import { useRestaurantId } from "../context/RestaurantIdContext";

function Saving() {
  const { restaurantId, restaurantName } = useRestaurantId();
  const customerType = JSON.parse(localStorage.getItem("userData"))?.customer_type;

  const [checkedItems, setCheckedItems] = useState({
    "Active Offers": true,
    "Upcoming Offers": false,
  });

  const toggleChecked = (section) => {
    setCheckedItems(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleExpandAll = () => {
    const allSections = Object.keys(checkedItems);
    const shouldExpand = allSections.some(section => !checkedItems[section]);
    
    const newCheckedItems = {};
    allSections.forEach(section => {
      newCheckedItems[section] = shouldExpand;
    });
    
    setCheckedItems(newCheckedItems);
  };

  return (
    <div className="page-wrapper full-height">
      <Header title="Savings" />
      <main className="page-content space-top p-b70">
        <div className="container px-3 py-0 mb-0">
          <HotelNameAndTable 
            restaurantName={restaurantName}
            tableNumber={customerType?.tableNumber || "1"}
          />
        </div>

        <div className="container pt-0">
          <div className="custom-card my-2 rounded-4 shadow-sm">
            <div className="card-body py-2">
              <div className="row">
                <div className="col-12 text-start">
                  <div className="restaurant">
                    {/* <i className="fa-solid fa-store pe-2 font_size_14"></i> */}
                    <span className="fw-medium font_size_14">
                      {/* {restaurantName?.toUpperCase()} */}
                      Total savings using MenuMitra
                    </span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="menu-info">
                    <i className="fa-solid fa-indian-rupee-sign pe-2 gray-text font_size_12"></i>
                    <span className="gray-text font_size_12">
                     6000/-  Saved
                    </span>
                  </div>
                </div>
                {/* <div className="col-6 text-end px-0">
                  <div className="menu-info">
                    <i className="fa-solid fa-piggy-bank pe-2 gray-text font_size_12"></i>
                    <span className="gray-text font_size_12">
                      Total Savings : ₹1000
                    </span>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end mb-2 pe-3">
          <div className="tab-label">
            <button
              className="btn btn-link text-decoration-none pe-0 pb-0"
              onClick={handleExpandAll}
            >
              <span className="d-flex align-items-center">
                <span className="text-secondary opacity-25 pe-2 font_size_10">
                  {Object.values(checkedItems).every(Boolean)
                    ? "Collapse All"
                    : "Expand All"}
                </span>
                <span className="icon-circle">
                  <i className={`fas fa-chevron-down arrow-icon ${
                    Object.values(checkedItems).every(Boolean)
                      ? "rotated"
                      : "rotated-1"
                  }`}></i>
                </span>
              </span>
            </button>
          </div>
        </div>

        <div className="container py-0">
          {/* Active Offers Section */}
          <div className="tab pt-0">
            <input
              type="checkbox"
              id="chckActiveOffers"
              checked={checkedItems["Active Offers"] || false}
              onChange={() => toggleChecked("Active Offers")}
            />
            <label className="tab-label pb-0 px-0 pt-2" htmlFor="chckActiveOffers">
              <span className="">
                <span className="font_size_14 fw-medium">
                  Visited Restaurants
                </span>
              </span>
              <span className="">
                <span className="gray-text ps-2 pe-2 small-number">2</span>
                <span className="icon-circle">
                  <i className={`fas fa-chevron-down arrow-icon pt-0 ${
                    checkedItems["Active Offers"] ? "rotated" : "rotated-1"
                  }`}></i>
                </span>
              </span>
            </label>

            <div className="tab-content">
              <div className="py-1 px-0">
                <div className="custom-card rounded-4 shadow-sm">
                  <div className="card-body py-2">
                    <div className="row">
                      <div className="col-12 text-start">
                        <div className="restaurant">
                          <i className="fa-solid fa-store pe-2 font_size_14"></i>
                          <span className="fw-medium font_size_14">
                            {restaurantName?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="menu-info">
                          <i className="fa-solid fa-user-clock pe-2 gray-text font_size_12"></i>
                          <span className="gray-text font_size_12">
                            Visited Count : 10
                          </span>
                        </div>
                      </div>
                      <div className="col-6 text-end px-0">
                        <div className="menu-info">
                          <i className="fa-solid fa-piggy-bank pe-2 gray-text font_size_12"></i>
                          <span className="gray-text font_size_12">
                            Total Savings : ₹1000
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Offers Section */}
          {/* <div className="tab pt-0">
            <input
              type="checkbox"
              id="chckUpcomingOffers"
              checked={checkedItems["Upcoming Offers"] || false}
              onChange={() => toggleChecked("Upcoming Offers")}
            />
            <label className="tab-label pb-0 px-0 pt-2" htmlFor="chckUpcomingOffers">
              <span className="">
                <span className="font_size_14 fw-medium">
                  UPCOMING OFFERS
                </span>
              </span>
              <span className="">
                <span className="gray-text ps-2 pe-2 small-number">1</span>
                <span className="icon-circle">
                  <i className={`fas fa-chevron-down arrow-icon pt-0 ${
                    checkedItems["Upcoming Offers"] ? "rotated" : "rotated-1"
                  }`}></i>
                </span>
              </span>
            </label>

            <div className="tab-content">
              <div className="py-1 px-0">
                <div className="custom-card rounded-4 shadow-sm">
                  <div className="card-body py-2">
                    <div className="row">
                      <div className="col-12 text-start">
                        <div className="restaurant">
                          <i className="fa-solid fa-store pe-2 font_size_14"></i>
                          <span className="fw-medium font_size_14">
                            {restaurantName?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="menu-info">
                          <i className="fa-solid fa-user-clock pe-2 gray-text font_size_12"></i>
                          <span className="gray-text font_size_12">
                            Visited Count : 10
                          </span>
                        </div>
                      </div>
                      <div className="col-6 text-end px-0">
                        <div className="menu-info">
                          <i className="fa-solid fa-piggy-bank pe-2 gray-text font_size_12"></i>
                          <span className="gray-text font_size_12">
                            Total Savings : ₹1000
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </main>
      <Bottom />
    </div>
  );
}

export default Saving;