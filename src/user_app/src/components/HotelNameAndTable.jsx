import React from 'react';
import PropTypes from 'prop-types';
import { useRestaurantId } from '../context/RestaurantIdContext';
import { useNavigate } from 'react-router-dom';

const HotelNameAndTable = ({ restaurantName }) => {
  const { tableNumber } = useRestaurantId();
  const navigate = useNavigate();
  
  // Get table number from context, localStorage, or userData
  const displayTableNumber = tableNumber || 
    JSON.parse(localStorage.getItem("userData"))?.tableNumber || 
    localStorage.getItem("tableNumber");

  const handleRestaurantClick = () => {
    navigate('/user_app/restaurant');
  };

  return (
    <div className="container p-0">
      <div className="d-flex justify-content-between align-items-center  my-2">
        <div className="d-flex align-items-center font_size_14 ">
          <span
            className="fw-medium"
            onClick={handleRestaurantClick}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-store me-2 "></i>
            {restaurantName?.toUpperCase() || ""}
          </span>
        </div>
        <div className="d-flex align-items-center font_size_12">
          <i className="fa-solid fa-location-dot me-2 gray-text"></i>
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
