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

  // Retrieve restaurant name from localStorage
  // const userData = JSON.parse(localStorage.getItem("restaurantName"));  
  const restaurantName = localStorage.getItem("restaurantName");

  return (
    <div className="mb-0">
      <div className="divider border-success opacity-50 inner-divider mb-0 pb-0">
        <span className="bg-body text-muted">Follow {restaurantName}</span>
      </div>

      {/* Top rectangular buttons */}
      <div className="container px-0 mt-3 pb-2">
        <div className="row g-3">
          <div className="col-6 mt-0">
            <button
              type="button"
              className="border border-info bg-transparent fw-regular w-100 text-nowrap px-4 py-1 rounded-1 text-info btn-info font_size_14"
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
          <div className="col-6 mt-0">
            <button
              type="button"
              className="border border-dark bg-transparent fw-regular w-100 text-nowrap px-4 py-1 rounded-1 text-dark font_size_14"
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
      <div className="d-flex justify-content-between my-1">
        {/* Facebook Button */}
        <div style={{ height: "30px" }} className=" w-100">
          <button
            type="button"
            style={{ color: "#1877F2", borderColor: "#1877F2" }}
            className="btn btn-outline-primary d-flex align-items-center justify-content-center p-0 rounded-3 text-primary w-100 h-100"
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
            <i
              class="fa-brands fa-facebook fs-4"
              style={{ color: "#1877F2" }}
            ></i>
          </button>
        </div>

        {/* Instagram Button */}
        <div style={{ height: "30px" }} className="mx-2 w-100">
          <button
            type="button"
            style={{ color: "#E4405F", borderColor: "#E4405F" }}
            className="btn btn-outline-primary d-flex align-items-center justify-content-center p-0 rounded-3 text-primary w-100 h-100"
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
            <i
              class="fa-brands fa-instagram fs-4"
              style={{ color: "#E4405F" }}
            ></i>
          </button>
        </div>
        {/* WhatsApp Button */}
        <div style={{ height: "30px" }} className=" w-100">
          <button
            type="button"
            style={{ color: "#25D366", borderColor: "#25D366" }}
            className="btn btn-outline-primary d-flex align-items-center justify-content-center p-0 rounded-3 text-primary w-100 h-100"
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
            <i
              class="fa-brands fa-whatsapp fs-4"
              style={{ color: "#25D366" }}
            ></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestaurantSocials;