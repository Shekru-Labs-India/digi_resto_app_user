import React from 'react'

function RestaurantSocials() {
  return (
    <div>
      <div className="divider border-success inner-divider transparent mt-5">
        <span className="bg-body">End</span>
      </div>
      <div className="d-flex justify-content-between align-items-center px-4 my-3">
        <button
          type="button"
          className="btn btn-sm mb-2 btn-outline-primary text-nowrap p-2"
          style={{ minWidth: "40px" }}
        >
          <i className="ri-whatsapp-line fs-2"></i>
          <span className="d-none d-sm-inline ms-1">WhatsApp</span>
        </button>

        <button
          type="button"
          className="btn btn-sm mb-2 mx-2 btn-outline-primary text-nowrap p-2"
          style={{ minWidth: "40px" }}
        >
          <i className="ri-facebook-line fs-2"></i>
          <span className="d-none d-sm-inline ms-1">Facebook</span>
        </button>

        <button
          type="button"
          className="btn btn-sm mb-2 btn-outline-primary text-nowrap p-2"
          style={{ minWidth: "40px" }}
        >
          <i className="ri-instagram-line fs-2"></i>
          <span className="d-none d-sm-inline ms-1">Instagram</span>
        </button>

        <button
          type="button"
          className="btn btn-sm mb-2 mx-2 btn-outline-primary text-nowrap p-2"
          style={{ minWidth: "40px" }}
        >
          <i className="ri-global-line fs-2"></i>
          <span className="d-none d-sm-inline ms-1">Website</span>
        </button>

        <button
          type="button"
          className="btn btn-sm mb-2 btn-outline-primary text-nowrap p-2"
          style={{ minWidth: "40px" }}
        >
          <i className="ri-google-line fs-2"></i>
          <span className="d-none d-sm-inline ms-1">Review</span>
        </button>
      </div>
    </div>
  );
}

export default RestaurantSocials