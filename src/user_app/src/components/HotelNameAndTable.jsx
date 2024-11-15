import React from 'react';
import PropTypes from 'prop-types';

const HotelNameAndTable = ({ restaurantName, tableNumber }) => {
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
          <span className="fw-medium   gray-text">
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
