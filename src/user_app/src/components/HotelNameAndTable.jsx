import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRestaurantId } from '../context/RestaurantIdContext';
import { useNavigate } from 'react-router-dom';

const HotelNameAndTable = ({ restaurantName }) => {
  // const { tableNumber } = useRestaurantId();
  const navigate = useNavigate();
  const tableNumber = localStorage.getItem("tableNumber");
  // Get table number from context, localStorage, or userData
  const displayTableNumber = tableNumber || 
    JSON.parse(localStorage.getItem("userData"))?.tableNumber || 
    localStorage.getItem("tableNumber");

  // Get both sectionId and sectionName
  const sectionId = JSON.parse(localStorage.getItem("userData"))?.sectionId || 
    localStorage.getItem("sectionId");
  const sectionName = JSON.parse(localStorage.getItem("userData"))?.sectionName || 
    localStorage.getItem("sectionName");
  useEffect(() => {
    // Store both sectionId and sectionName in localStorage
    if (sectionId) {
      localStorage.setItem("sectionId", sectionId);
    }
    if (sectionName) {
      localStorage.setItem("sectionName", sectionName);
    }

    // Update userData if it exists
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    if (Object.keys(userData).length > 0) {
      const updatedUserData = {
        ...userData,
        sectionId,
        section_name: sectionName
      };
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
    }
  }, [sectionId, sectionName]);

  const titleCase = (str) =>{
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  }

  const handleRestaurantClick = () => {
    navigate('/user_app/restaurant');
  };

  return (
    <div className="container p-0">
      <div className="d-flex justify-content-between align-items-center my-2">
        <div className="d-flex align-items-center font_size_14">
          <span
            className="fw-medium"
            onClick={handleRestaurantClick}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-store me-2 font_size_12"></i>
            {restaurantName?.toUpperCase() || ""}
          </span>
        </div>

        <div className="d-flex align-items-center gap-3">
          {sectionName && (
            <div className="d-flex align-items-center font_size_12">
              {/* <i className="fa-solid fa-map-marker-alt me-2 gray-text font_size_12"></i> */}
              <i class="fa-solid fa-chair me-2 gray-text font_size_12"></i>
              <span className="fw-medium gray-text">
                {titleCase(sectionName)}
              </span>
            </div>
          )}

          {displayTableNumber && (
            <div className="d-flex align-items-center font_size_12">
              <i className="fa-solid fa-location-dot me-2 gray-text font_size_12"></i>
              <span className="fw-medium gray-text">
                Table {tableNumber}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

HotelNameAndTable.propTypes = {
  restaurantName: PropTypes.string.isRequired,
};

export default HotelNameAndTable;
