const config = {
   //apiDomain: "https://men4u.xyz",
  apiDomain: "https://menusmitra.xyz"
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
  const index = parseInt(spicyIndex, 10);
  if (index === 1) {
    return "text-success"; // Green for level 1
  } else if (index === 2) {
    return "text-warning"; // Yellow for level 2
  } else {
    return "text-danger";  // Red for level 3 and above
  }
};

// Reusable spicy level renderer
export const renderSpicyLevel = (spicyIndex) => {
  if (!spicyIndex || spicyIndex === "0") return null; // No spicy indicator for 0 or null
  
  const index = parseInt(spicyIndex, 10);
  
  // Determine how many peppers to display (max 3)
  const totalSpicyIcons = 3;
  const displayLevel = index === 1 ? 1 : index === 2 ? 2 : 3; // 1 🫑, 2 🫑🫑, 3+ 🫑🫑🫑
  
  return Array.from({ length: totalSpicyIcons }).map((_, i) => (
    <i
      key={i}
      className={`fa-solid fa-pepper-hot font_size_10 ${
        i < displayLevel ? getSpicyLevelStyle(index) : "gray-text opacity-25"
      }`}
    ></i>
  ));
};
