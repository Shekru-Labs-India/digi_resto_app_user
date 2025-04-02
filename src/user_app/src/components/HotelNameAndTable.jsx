import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useRestaurantId } from "../context/RestaurantIdContext";
import { useNavigate } from "react-router-dom";
import Notice from "../component/Notice";
import config from "../component/config";
import { isNonProductionDomain } from "../component/config";

const HotelNameAndTable = ({ restaurantName }) => {
  // Get isOutletOnlyUrl from context to determine display mode
  const { isOutletOnlyUrl } = useRestaurantId();
  
  // const { tableNumber } = useRestaurantId();
  const navigate = useNavigate();
  const tableNumber = localStorage.getItem("tableNumber");
  // Get table number from context, localStorage, or userData
  const displayTableNumber =
    tableNumber ||
    JSON.parse(localStorage.getItem("userData"))?.tableNumber ||
    localStorage.getItem("tableNumber");

  // Get both sectionId and sectionName
  const sectionId =
    JSON.parse(localStorage.getItem("userData"))?.sectionId ||
    localStorage.getItem("sectionId");
  const sectionName =
    JSON.parse(localStorage.getItem("userData"))?.sectionName ||
    localStorage.getItem("sectionName");
  
  // Get orderType from localStorage
  const orderType = localStorage.getItem("orderType");
    
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
        section_name: sectionName,
      };
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
    }
  }, [sectionId, sectionName]);

  const titleCase = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleRestaurantClick = () => {
    navigate("/user_app/restaurant");
  };

  const displayName = restaurantName ? restaurantName.toUpperCase() : "";

  return (
    <>
      {isNonProductionDomain() && <Notice />}
      <div className="container p-0">
        <div className="d-flex justify-content-between align-items-center my-2">
        <div className="d-flex align-items-center font_size_14">
          <span
            className="fw-medium"
            onClick={handleRestaurantClick}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-store me-2 font_size_12"></i>
            {displayName}
          </span>
        </div>

        <div className="d-flex align-items-center font_size_12">
          <i className="fa-solid fa-location-dot me-2 gray-text font_size_12"></i>
          <span className="fw-medium gray-text">
            {isOutletOnlyUrl ? (
              // For outlet-only URLs, show the order type
              <>{orderType?.toUpperCase() || ""}</>
            ) : (
              // For section/table URLs, show section name and table number
              <>
                {titleCase(sectionName || "")}
                {displayTableNumber && <> - {tableNumber}</>}
              </>
            )}
          </span>
        </div>
        </div>
      </div>
    </>
  );
};

HotelNameAndTable.propTypes = {
  restaurantName: PropTypes.string.isRequired,
};

export default HotelNameAndTable;
