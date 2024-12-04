const config = {
  apiDomain: "https://men4u.xyz",
  // apiDomain: "https://menusmitra.xyz"
};

export default config;




export const APP_VERSION = "1.0.0";

// You can add other app-wide constants here
export const APP_CONFIG = {
  version: APP_VERSION,
  buildDate: process.env.REACT_APP_BUILD_DATE || new Date().toISOString(),
  environment: process.env.NODE_ENV,
};



export const PRODUCTION_DOMAIN = "menumitra.com";
// Helper function to check if we're on production domain
export const isNonProductionDomain = () => {
  const currentDomain = window.location.hostname;
  return (
    currentDomain !== PRODUCTION_DOMAIN &&
    currentDomain !== `www.${PRODUCTION_DOMAIN}`
  );
};








// Helper function to get spicy level styles
export const getSpicyLevelStyle = (spicyIndex) => {
  // Convert spicyIndex (1-5) to display level (1-3)
  const displayLevel = Math.ceil(spicyIndex / 2);
  
  switch (displayLevel) {
    case 1: // spicyIndex 1-2
      return "text-success"; // Green for mild
    case 2: // spicyIndex 3-4
      return "text-warning"; // Yellow for medium
    case 3: // spicyIndex 5
      return "text-danger";  // Red for hot
    default:
      return "gray-text opacity-25"; // Default/inactive state
  }
};

// Reusable spicy level renderer
export const renderSpicyLevel = (spicyIndex) => {
  // If spicyIndex is 0 or null/undefined, don't render anything
  if (!spicyIndex || spicyIndex === "0") return null;
  
  // Convert 5-level scale to 3-level display
  const displayLevel = Math.ceil(parseInt(spicyIndex, 10) / 2);
  
  return Array.from({ length: 3 }).map((_, index) => (
    <i
      key={index}
      className={`fa-solid fa-pepper-hot font_size_10 ${
        index < displayLevel 
          ? getSpicyLevelStyle(spicyIndex) 
          : "gray-text opacity-25"
      }`}
    ></i>
  ));
};