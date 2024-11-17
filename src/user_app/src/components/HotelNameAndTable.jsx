import React from 'react';
import PropTypes from 'prop-types';
import { useRestaurantId } from '../context/RestaurantIdContext';

const HotelNameAndTable = ({ restaurantName }) => {
  const { tableNumber } = useRestaurantId();
  
  // Get table number from context, localStorage, or userData
  const displayTableNumber = tableNumber || 
    JSON.parse(localStorage.getItem("userData"))?.tableNumber || 
    localStorage.getItem("tableNumber");

  return (
    <div className="container p-0">
      <div className="d-flex justify-content-between align-items-center  my-2">
        <div className="d-flex align-items-center font_size_14 ">
          <i className="ri-store-2-line me-2 "></i>
          <span className="fw-medium">
            {restaurantName.toUpperCase() || "Restaurant Name"}
          </span>
        </div>
        <div className="d-flex align-items-center font_size_12">
          <i className="ri-map-pin-user-fill me-2 gray-text"></i>
          <span className="fw-medium gray-text">
            {displayTableNumber ? `Table ${displayTableNumber}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

HotelNameAndTable.propTypes = {
  restaurantName: PropTypes.string.isRequired,
};

export default HotelNameAndTable;
