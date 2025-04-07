import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import qr_scan from "../assets/qr_scan.gif";
import { useRestaurantId } from "../context/RestaurantIdContext";

function ErrorPage() {
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState(
    "Table having issue. Rescan the QR Code again!"
  );

  // Get context values safely with defaults
  const restaurantContext = useRestaurantId() || {};
  const { isOutletOnlyUrl, setShowOrderTypeModal } = restaurantContext;

  useEffect(() => {
    // Only try to set show order type modal if the context values exist
    if (isOutletOnlyUrl !== undefined && setShowOrderTypeModal) {
      if (isOutletOnlyUrl) {
        setShowOrderTypeModal(false);
      }
    }

    if (location.state && location.state.errorMessage) {
      setErrorMessage(location.state.errorMessage);
    }
    
  }, [location, isOutletOnlyUrl, setShowOrderTypeModal]);

  // TAKE CONTEXT FORM RESTAURANT ID CONTEXT FOR HIDING THE ORDER TYPE MODAL
  // Moved the destructuring to above to safely handle undefined values

  return (
    <>
      <div className="page-content space-top">
        <div className="container">
          <div className="error-page">
            <div className="icon-bx">
              <div className="d-flex justify-content-center align-items-center mb-3">
                <img
                  src={qr_scan}
                  alt="Scan QR Code"
                  className="img-fluid rounded shadow-sm"
                  loading="lazy"
                  style={{
                    maxWidth: "220px",
                    width: "220px",
                    maxHeight: "220px",
                  }}
                />
              </div>
            </div>
            <div className="clearfix">
              {/* <h2 className="title text-primary">Sorry</h2> */}
              <p>{errorMessage}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ErrorPage;
