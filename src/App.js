import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import UserApp from './user_app/src/App';
import Website from './website/src/App';

// Define hideToast first since showToast uses it
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
  const location = useLocation();
  
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "/digi_resto_app_user"
      : "/digi_resto_app_user";
  
  useEffect(() => {
    // First, remove all dynamic resources
    const removeAllDynamicResources = () => {
      // Remove all dynamic CSS
      document.querySelectorAll('link[data-dynamic="true"]').forEach(el => el.remove());
      // Remove all dynamic scripts
      document.querySelectorAll('script[data-dynamic="true"]').forEach(el => el.remove());
      // Remove any leftover styles
      const existingStyles = document.getElementById('dynamic-styles');
      if (existingStyles) existingStyles.remove();
    };

    removeAllDynamicResources();

    const isUserAppRoute = location.pathname.includes('/user_app');

    if (isUserAppRoute) {
      // User App Resources
      const userAppCSS = [
        '/user_app/src/assets/css/style.css',
        '/user_app/src/assets/css/custom.css',
        '/user_app/src/assets/css/toast.css'
      ];

      const userAppJS = [
        '/user_app/src/assets/js/jquery.js',
        '/user_app/src/assets/js/toast.js'
      ];

      loadResources(userAppCSS, userAppJS, 'user-app');
    } else {
      // Website Resources
      const websiteCSS = [
        // 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
        'https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css',
        '/website/src/assets/css/style.css',
        '/website/src/assets/css/responsive.css'
      ];

      const websiteJS = [
        'https://code.jquery.com/jquery-3.6.0.min.js',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js',
        '/website/src/assets/js/main.js'
      ];

      loadResources(websiteCSS, websiteJS, 'website');
    }

    return () => removeAllDynamicResources();
  }, [location.pathname]);

  const loadResources = async (cssFiles, jsFiles, appType) => {
    // Add a style tag to prevent FOUC (Flash of Unstyled Content)
    const styleTag = document.createElement('style');
    styleTag.id = 'dynamic-styles';
    styleTag.textContent = 'body { visibility: hidden; }';
    document.head.appendChild(styleTag);

    // Load CSS
    const cssPromises = cssFiles.map(file => {
      return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = file.startsWith('http') ? file : `${baseUrl}${file}`;
        link.setAttribute('data-dynamic', 'true');
        link.setAttribute('data-app-type', appType);
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
      });
    });

    // Load JS
    const jsPromises = jsFiles.map(file => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = file.startsWith('http') ? file : `${baseUrl}${file}`;
        script.setAttribute('data-dynamic', 'true');
        script.setAttribute('data-app-type', appType);
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    });

    try {
      // Wait for all resources to load
      await Promise.all([...cssPromises, ...jsPromises]);
      // Remove the temporary style tag to show the page
      styleTag.remove();
    } catch (error) {
      console.error('Error loading resources:', error);
      styleTag.remove(); // Remove the style tag even if there's an error
    }
  };

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

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;