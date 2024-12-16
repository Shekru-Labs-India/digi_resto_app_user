import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserApp from './user_app/src/App';

import QRScanner from './user_app/src/screens/QRScreen';

// Toast functionality (keeping this in main App.js since it's used globally)
window.hideToast = function() {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }
};

window.showToast = function(type, message) {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  let iconClass;
  let title;
  switch (type) {
    case "success":
      iconClass = "fa-solid fa-check text-success";
      title = "Success";
      break;
    case "error":
      iconClass = "fa-regular fa-circle-xmark text-danger";
      title = "Error";
      break;
    case "info":
      iconClass = "fa-solid fa-circle-info text-info";
      title = "Info";
      break;
    case "warning":
      iconClass = "fa-solid fa-triangle-exclamation text-warning";
      title = "Warning";
      break;
    default:
      iconClass = "";
      title = "Notification";
  }

  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-content ">
      <i class="toast-icon ${iconClass}"></i>
      <div class="message ">
        <span class="text-title text-success">${title}</span>
        <span class="text-body text-success">${message}</span>
      </div>
    </div>
    <span class="close" onclick="window.hideToast()">    <i class="fa-solid fa-xmark gray-text"></i></span>
    <div class="progress-bar"></div>`;

  toast.classList.add("show");
  setTimeout(window.hideToast, 3000);
};

const AppContent = () => {
  // const loadStyles = (styleUrls, appType) => {
  //   styleUrls.forEach(url => {
  //     const link = document.createElement('link');
  //     link.href = url;
  //     link.rel = 'stylesheet';
  //     link.type = 'text/css';
  //     link.dataset.appStyle = appType;
  //     document.head.appendChild(link);
  //   });
  // };

  // const loadScripts = (scriptUrls, appType) => {
  //   scriptUrls.forEach(url => {
  //     const script = document.createElement('script');
  //     script.src = url;
  //     script.dataset.appScript = appType;
  //     script.async = true;
  //     document.body.appendChild(script);
  //   });
  // };

  // const cleanupResources = (type) => {
  //   // Remove styles
  //   document.querySelectorAll(`link[data-app-style="${type}"]`)
  //     .forEach(link => link.remove());
    
  //   // Remove scripts
  //   document.querySelectorAll(`script[data-app-script="${type}"]`)
  //     .forEach(script => script.remove());
  // };

  // useEffect(() => {
  //   const path = window.location.pathname;
  //   const isUserApp = path.startsWith('/user_app');
  //   const appType = isUserApp ? 'user-app' : 'website';
    
  //   // Set data attribute for CSS switching
  //   document.body.dataset.appType = appType;
    
  //   // Clean up existing resources
  //   cleanupResources('user-app');
  //   cleanupResources('website');
    
  //   // Load appropriate resources
  //   if (isUserApp) {
  //     loadStyles([
  //       '/assets/user_app/css/style.css',
  //       '/assets/user_app/css/custom.css'
  //     ], 'user-app');
      
  //     loadScripts([
  //       // '/assets/user_app/js/main.js',
  //       // '/assets/user_app/js/custom.js'
  //     ], 'user-app');
  //   } else {
  //     loadStyles([
  //       '/assets/website/Css/stylewebsite.css',
  //       '/assets/website/Css/responsive.css'
  //     ], 'website');
      
  //     loadScripts([
  //       // '/assets/website/js/main.js',
  //       // '/assets/website/js/custom.js'
  //     ], 'website');
  //   }

  //   // Cleanup function
  //   return () => {
  //     cleanupResources(appType);
  //   };
  // }, [window.location.pathname]);

  return (
    <Routes>
      {/* <Route path="/" element={<Website />}> */}
        {/* <Route index element={<Website currentPath="/" />} />
        <Route path="features" element={<Website currentPath="/features" />} />
        <Route path="about" element={<Website currentPath="/about" />} />
        <Route path="privacy_policy" element={<Website currentPath="/privacy_policy" />} />
        <Route path="cookie_policy" element={<Website currentPath="/cookie_policy" />} />
        <Route path="terms_conditions" element={<Website currentPath="/terms_conditions" />} />
         <Route path="contact" element={<Website currentPath="/contact" />} />
        <Route path="pricing" element={<Website currentPath="/pricing" />} />
        <Route path="faqs" element={<Website currentPath="/faqs" />} />
        <Route path="request_data_removal" element={<Website currentPath="/request_data_removal" />} />
        */}
      {/* </Route> */}
      <Route path="/" element={<QRScanner />} />

      <Route path="/user_app/*" element={<UserApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;