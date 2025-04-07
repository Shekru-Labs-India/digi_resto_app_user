import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useRestaurantId } from "../context/RestaurantIdContext";
import { useNavigate } from "react-router-dom";
import Notice from "../component/Notice";
import { isNonProductionDomain } from "../component/config";
import OrderTypeModal from "./OrderTypeModal";

const HotelNameAndTable = ({ restaurantName, tableNumber: propTableNumber }) => {
  // Get context values including the orderType state
  const { isOutletOnlyUrl, setShowOrderTypeModal, updateOrderType, orderType: contextOrderType } = useRestaurantId();
  const [showLocalOrderTypeModal, setShowLocalOrderTypeModal] = useState(false);
  
  // const { tableNumber } = useRestaurantId();
  const navigate = useNavigate();
  // Use prop tableNumber if provided, otherwise get from localStorage
  const tableNumber = propTableNumber || localStorage.getItem("tableNumber");
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
  
  // Use orderType from context instead of localStorage for immediate UI updates
  const orderType = contextOrderType;

  // No need for local state and storage event listener when using context

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

  const handleOrderTypeModal = () => {
    // Always use local modal to avoid the localStorage check in context
    setShowLocalOrderTypeModal(true);
  };

  const handleOrderTypeSelection = (type) => {
    if (updateOrderType) {
      // Use the context function which updates both localStorage and context state
      updateOrderType(type);
    } else {
      // Fallback to direct localStorage update
      localStorage.setItem("orderType", type);
    }
    setShowLocalOrderTypeModal(false);
  };

  const handleCloseModal = () => {
    setShowLocalOrderTypeModal(false);
  };

  // Check if using outlet-only URL flow
  // If isOutletOnlyUrl comes from context, use it directly; otherwise check localStorage
  const useOutletOnly = typeof isOutletOnlyUrl === 'boolean' ? 
    isOutletOnlyUrl : 
    localStorage.getItem("isOutletOnlyUrl") === "true";

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

        <div 
          className="d-flex align-items-center font_size_12" 
          onClick={useOutletOnly ? handleOrderTypeModal : undefined} 
          style={{ cursor: useOutletOnly ? "pointer" : "default" }}
        >
          <i className="fa-solid fa-location-dot me-2 gray-text font_size_12"></i>
          <span className="fw-medium gray-text">
            {useOutletOnly ? (
              // For outlet-only URLs, show the order type
              <>{orderType?.toUpperCase() || ""}</>
            ) : (
              // For section/table URLs, show section name and table number
              <>
                {sectionId === null ? (
                  orderType?.toUpperCase() || ""
                ) : (
                  <>
                    {titleCase(sectionName === null ? "" : sectionName || "")}
                    {displayTableNumber && <> - {displayTableNumber}</>}
                  </>
                )}
              </>
            )}
          </span>
        </div>
        </div>
      </div>
      
      {showLocalOrderTypeModal && (
        <OrderTypeModal 
          onSelect={handleOrderTypeSelection} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
};

HotelNameAndTable.propTypes = {
  restaurantName: PropTypes.string.isRequired,
  tableNumber: PropTypes.string,
};

export default HotelNameAndTable;
