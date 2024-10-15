import React from 'react';
import PropTypes from 'prop-types';

const HotelNameAndTable = ({ restaurantName, tableNumber }) => {
  return (
    <div className="d-flex justify-content-between align-items-center  m-3">
      <div className="d-flex align-items-center">
        <i className="ri-store-2-line me-2"></i>
        <span className="fw-medium hotel-name">
          {restaurantName.toUpperCase() || "Restaurant Name"}
        </span>
      </div>
      <div className="d-flex align-items-center">
        <i className="ri-user-location-line me-2 gray-text"></i>
        <span className="fw-medium custom-text-gray">
          {tableNumber ? `Table ${tableNumber}` : ""}
        </span>
      </div>
    </div>
  );
};

HotelNameAndTable.propTypes = {
  restaurantName: PropTypes.string.isRequired,
  tableNumber: PropTypes.string,
};

export default HotelNameAndTable;