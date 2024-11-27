import React from 'react'

function RestaurantSocials() {
  const allSocialLinks = JSON.parse(localStorage.getItem("restaurantSocial") || "[]");

  if (allSocialLinks.length === 0) return null;

  // Separate links into main and social categories
  const mainLinks = allSocialLinks.filter(link => 
    ['website', 'google_business'].includes(link.id)
  );
  const socialLinks = allSocialLinks.filter(link => 
    ['whatsapp', 'facebook', 'instagram'].includes(link.id)
  );

  return (
    <div>
      <div className="divider border-success inner-divider transparent mt-5">
        <span className="bg-body">End</span>
      </div>

      {/* Top rectangular buttons */}
      <div className="container px-0 mt-3">
        <div className="row g-3">
          <div className="col-6">
            <button
              type="button"
              className="btn w-100 text-nowrap px-4 py-2 rounded-1 text-white btn-info"
              onClick={() => {
                const websiteUrl = allSocialLinks.find(
                  (link) => link.id === "website"
                )?.link;
                if (websiteUrl) {
                  const url = websiteUrl.startsWith("http")
                    ? websiteUrl
                    : `https://${websiteUrl}`;
                  window.open(url, "_blank");
                }
              }}
            >
              <i class="fa-solid fa-globe me-2"></i>
              Website
            </button>
          </div>
          <div className="col-6">
            <button
              type="button"
              className="btn w-100 text-nowrap px-4 py-2 rounded-1 text-white btn-success"
              onClick={() => {
                const businessUrl = allSocialLinks.find(
                  (link) => link.id === "google_business"
                )?.link;
                if (businessUrl) {
                  const url = businessUrl.startsWith("http")
                    ? businessUrl
                    : `https://${businessUrl}`;
                  window.open(url, "_blank");
                }
              }}
            >
              <i class="fa-brands fa-google me-2"></i>
              Business
            </button>
          </div>
        </div>
      </div>

      {/* Bottom square social buttons */}
      <div className="d-flex justify-content-between px-0 my-3">
        {/* WhatsApp Button */}
        <div className="ratio ratio-1x1" style={{ width: "50px" }}>
          <button
            type="button"
            className="btn btn-outline-primary d-flex align-items-center justify-content-center p-0 rounded-3 text-primary"
            onClick={() => {
              const whatsappUrl = allSocialLinks.find(
                (link) => link.id === "whatsapp"
              )?.link;
              if (whatsappUrl) {
                const url = whatsappUrl.startsWith("http")
                  ? whatsappUrl
                  : `https://${whatsappUrl}`;
                window.open(url, "_blank");
              }
            }}
            title="WhatsApp"
          >
            <i className="ri-whatsapp-line fs-4"></i>
          </button>
        </div>

        {/* Facebook Button */}
        <div className="ratio ratio-1x1" style={{ width: "50px" }}>
          <button
            type="button"
            className="btn btn-outline-primary d-flex align-items-center justify-content-center p-0 rounded-3"
            onClick={() => {
              const facebookUrl = allSocialLinks.find(
                (link) => link.id === "facebook"
              )?.link;
              if (facebookUrl) {
                const url = facebookUrl.startsWith("http")
                  ? facebookUrl
                  : `https://${facebookUrl}`;
                window.open(url, "_blank");
              }
            }}
            title="Facebook"
          >
            <i class="fa-brands fa-facebook"></i>
          </button>
        </div>

        {/* Instagram Button */}
        <div className="ratio ratio-1x1" style={{ width: "50px" }}>
          <button
            type="button"
            className="btn btn-outline-primary d-flex align-items-center justify-content-center p-0 rounded-3"
            onClick={() => {
              const instagramUrl = allSocialLinks.find(
                (link) => link.id === "instagram"
              )?.link;
              if (instagramUrl) {
                const url = instagramUrl.startsWith("http")
                  ? instagramUrl
                  : `https://${instagramUrl}`;
                window.open(url, "_blank");
              }
            }}
            title="Instagram"
          >
            <i className="ri-instagram-line fs-4"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestaurantSocials