// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';

// // Only keep third-party CSS if absolutely necessary
// import 'remixicon/fonts/remixicon.css';
// import "./assets/css/custom.css";
// import "./assets/css/style.css";
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   // <React.StrictMode>
//     <App />
 
// );


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import Sentry
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

// Import third-party and custom CSS
import 'remixicon/fonts/remixicon.css';
import "./assets/css/custom.css";
import "./assets/css/style.css";

// Initialize Sentry
Sentry.init({
  dsn: "https://63027430979d0c29a0d817544a0ca358@o4508323636314112.ingest.us.sentry.io/4508323647979520",
  integrations: [
    new BrowserTracing(), // Correctly initialize BrowserTracing
  ],
  // Tracing
  tracesSampleRate: 1.0, // Capture 100% of transactions (adjust for production)
  // Add your website URL to `tracePropagationTargets`
  tracePropagationTargets: [
    "localhost", 
    "dolphin-app-889o9.ondigitalocean.app", // Your website domain
    /^https:\/\/dolphin-app-889o9\.ondigitalocean\.app\/user_app\/Index/ // Regex for your specific URL path
  ],

  // Optionally, configure Session Replay
  replaysSessionSampleRate: 0.1, // Sample at 10% (adjust for production)
  replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions where errors occur
});

// Render the React app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

