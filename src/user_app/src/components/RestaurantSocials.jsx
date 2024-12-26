import React from 'react';

function RestaurantSocials() {
  const allSocialLinks = JSON.parse(localStorage.getItem("restaurantSocial") || "[]");

  if (allSocialLinks.length === 0) return null;

  const restaurantName = localStorage.getItem("restaurantName");

  const getLink = (id) => allSocialLinks.find(link => link.id === id)?.link;

  return (
    <div className="mb-0 pt-2">
      <div className="divider border-success opacity-50 inner-divider mb-0 pb-0 mb-5">
        <span className="bg-body text-muted">Follow {restaurantName}
          </span>
      </div>

      <div className="container px-0 mt-3 pb-2">
        <div className="row g-3">
          {getLink("website") && (
            <div className="col-6 mt-0">
              <button
                type="button"
                className="border border-1 bg-transparent fw-regular w-100 text-nowrap px-4 py-1 rounded-1 font_size_14 text-dark"
                onClick={() => {
                  const websiteUrl = getLink("website");
                  window.open(websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`, "_blank");
                }}
              >
                <i className="fa-solid fa-globe me-2 text-success"></i> Website
              </button>
            </div>
          )}

          {getLink("google_business") && (
            <div className="col-6 mt-0">
              <button
                type="button"
                style={{ color: "#4285F4", borderColor: "#4285F4" }}
                className="border border-1 bg-transparent fw-regular w-100 text-nowrap px-4 py-1 rounded-1 text-dark font_size_14"
                onClick={() => {
                  const businessUrl = getLink("google_business");
                  window.open(businessUrl.startsWith("http") ? businessUrl : `https://${businessUrl}`, "_blank");
                }}
              >
                <i className="fa-brands fa-google me-2" style={{ color: "#4285F4" }}></i> Business
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-between my-1">
        {getLink("youtube") && (
          <div style={{ height: "30px" }} className="me-2 w-100">
            <button
              type="button"
              style={{ color: "#FF0000", borderColor: "#FF0000" }}
              className="btn btn-outline-primary d-flex align-items-center justify-content-center p-0 rounded-3 text-primary w-100 h-100"
              onClick={() => {
                const youtubeUrl = getLink("youtube");
                window.open(youtubeUrl.startsWith("http") ? youtubeUrl : `https://${youtubeUrl}`, "_blank");
              }}
              title="YouTube"
            >
              <i className="fa-brands fa-youtube fs-4" style={{ color: "#FF0000" }}></i>
            </button>
          </div>
        )}

        {getLink("facebook") && (
          <div style={{ height: "30px" }} className="w-100">
            <button
              type="button"
              style={{ color: "#1877F2", borderColor: "#1877F2" }}
              className="btn btn-outline-primary d-flex align-items-center justify-content-center p-0 rounded-3 text-primary w-100 h-100"
              onClick={() => {
                const facebookUrl = getLink("facebook");
                window.open(facebookUrl.startsWith("http") ? facebookUrl : `https://${facebookUrl}`, "_blank");
              }}
              title="Facebook"
            >
              <i className="fa-brands fa-facebook fs-4" style={{ color: "#1877F2" }}></i>
            </button>
          </div>
        )}

        {getLink("instagram") && (
          <div style={{ height: "30px" }} className="mx-2 w-100">
            <button
              type="button"
              style={{ color: "#E4405F", borderColor: "#E4405F" }}
              className="btn btn-outline-primary d-flex align-items-center justify-content-center p-0 rounded-3 text-primary w-100 h-100"
              onClick={() => {
                const instagramUrl = getLink("instagram");
                window.open(instagramUrl.startsWith("http") ? instagramUrl : `https://${instagramUrl}`, "_blank");
              }}
              title="Instagram"
            >
              <i className="fa-brands fa-instagram fs-4" style={{ color: "#E4405F" }}></i>
            </button>
          </div>
        )}

        {getLink("whatsapp") && (
          <div style={{ height: "30px" }} className="w-100">
            <button
              type="button"
              style={{ color: "#25D366", borderColor: "#25D366" }}
              className="btn btn-outline-primary d-flex align-items-center justify-content-center p-0 rounded-3 text-primary w-100 h-100"
              onClick={() => {
                const whatsappUrl = getLink("whatsapp");
                window.open(whatsappUrl.startsWith("http") ? whatsappUrl : `https://${whatsappUrl}`, "_blank");
              }}
              title="WhatsApp"
            >
              <i className="fa-brands fa-whatsapp fs-4" style={{ color: "#25D366" }}></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantSocials;
