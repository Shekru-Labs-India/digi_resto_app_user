import React from "react";

function OrderTypeModal({ onSelect, onClose }) {
  const getOrderTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "parcel":
        return "fa-box";
      case "delivery":
        return "fa-truck";
      case "counter":
        return "fa-cash-register";
      case "drive through":
        return "fa-car";
      default:
        return "fa-question";
    }
  };

  const handleOrderTypeSelection = (type) => {
    console.log("Selected order type:", type);
    
    // Call the onSelect prop directly without internal state change
    if (onSelect) {
      onSelect(type);
    }
  };

  return (
    <>
      {/* Background blur overlay */}
      <div 
        style={{ 
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          zIndex: 1040
        }}
      ></div>
      
      <div
        className="modal fade show"
        id="exampleModalCenter"
        style={{ display: "block" }}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Please select your order type</h5>
              <button className="btn-close" onClick={onClose} data-bs-dismiss="modal">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                {["Counter", "Drive-Through", "Delivery", "Parcel"].map(
                  (type) => (
                    <div className="col-6" key={type}>
                      <button
                        className="btn btn-outline-primary w-100 py-3 fs-6 px-2"
                        onClick={() =>
                          handleOrderTypeSelection(type.toLowerCase())
                        }
                      >
                        <i
                          className={`fa-solid ${getOrderTypeIcon(type)} me-2`}
                        ></i>
                        {type}
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderTypeModal;
