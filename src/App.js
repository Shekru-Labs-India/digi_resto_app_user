import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserApp from './user_app/src/App';
import Website from './website/src/App';

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
      iconClass = "ri-check-line";
      title = "Success";
      break;
    case "error":
      iconClass = "ri-close-circle-line";
      title = "Error";
      break;
    case "info":
      iconClass = "ri-information-line";
      title = "Info";
      break;
    case "warning":
      iconClass = "ri-alert-line";
      title = "Warning";
      break;
    default:
      iconClass = "";
      title = "Notification";
  }

  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <i class="toast-icon ${iconClass}"></i>
      <div class="message">
        <span class="text-title">${title}</span>
        <span class="text-body">${message}</span>
      </div>
    </div>
    <span class="close" onclick="window.hideToast()">✖</span>
    <div class="progress-bar"></div>`;

  toast.classList.add("show");
  setTimeout(window.hideToast, 3000);
};

const AppContent = () => {
  useEffect(() => {
    // Set app type and handle styles based on current route
    const path = window.location.pathname;
    const isUserApp = path.startsWith('/user_app');
    
    // Set data attribute for CSS switching
    document.body.dataset.appType = isUserApp ? 'user-app' : 'website';
    
    // Remove all existing app-specific stylesheets
    document.querySelectorAll('link[data-app-style]').forEach(link => link.remove());
    
    // Add appropriate stylesheets based on current app
    if (isUserApp) {
      loadStyles([
        '/assets/user_app/css/style.css',
        '/assets/user_app/css/custom.css'
      ], 'user-app');
    } else {
      loadStyles([
        '/assets/website/css/style.css',
        '/assets/website/css/responsive.css'
      ], 'website');
    }
  }, [window.location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Website />}>
        <Route index element={<Website currentPath="/" />} />
        <Route path="features" element={<Website currentPath="/features" />} />
        <Route path="client" element={<Website currentPath="/client" />} />
        <Route path="pricing" element={<Website currentPath="/pricing" />} />
      </Route>
      <Route path="/user_app/*" element={<UserApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Helper function to load styles
const loadStyles = (styleUrls, appType) => {
  styleUrls.forEach(url => {
    const link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    link.setAttribute('data-app-style', appType);
    document.head.appendChild(link);
  });
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;