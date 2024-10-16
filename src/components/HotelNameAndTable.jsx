import React from 'react';
import PropTypes from 'prop-types';

const HotelNameAndTable = ({ restaurantName, tableNumber }) => {
  return (
    <div className="container p-0">
      <div className="d-flex justify-content-between align-items-center  m-3 mx-1">
        <div className="d-flex align-items-center">
          <i className="ri-store-2-line me-2 fs-6"></i>
          <span className="font_size_14 fw-medium">
            {restaurantName.toUpperCase() || "Restaurant Name"}
          </span>
        </div>
        <div className="d-flex align-items-center">
          <i className="ri-user-location-line me-2 gray-text font_size_12"></i>
          <span className="fw-medium gray-text font_size_12">
            {tableNumber ? `Table ${tableNumber}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

HotelNameAndTable.propTypes = {
  restaurantName: PropTypes.string.isRequired,
  tableNumber: PropTypes.string,
};

export default HotelNameAndTable;
