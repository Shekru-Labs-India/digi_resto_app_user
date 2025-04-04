import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import qr_scan from "../assets/qr_scan.gif";

function ErrorPage() {
  const location = useLocation();
  const { setShowOrderTypeModal } = useRestaurantId();
  const [errorMessage, setErrorMessage] = useState(
    "Table having issue. Rescan the QR Code again!"
  );

  useEffect(() => {
    if (location.state && location.state.errorMessage) {
      setErrorMessage(location.state.errorMessage);
    }
    
    // Close OrderTypeModal if it's open when navigating to the error page
    setShowOrderTypeModal(false);
  }, [location, setShowOrderTypeModal]);

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
