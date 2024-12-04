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