import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import UserApp from './user_app/src/App';
import Website from './website/src/App';

const AppContent = () => {
  const location = useLocation();
  
  // Get the base URL for GitHub Pages
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? '/digi_resto_app_user'
    : '';
  
  useEffect(() => {
    // Remove existing resources
    const existingResources = document.querySelectorAll('[data-dynamic="true"]');
    existingResources.forEach(resource => resource.remove());

    // Check if the current path is a user_app route
    const isUserAppRoute = location.pathname.includes('/user_app');

    if (isUserAppRoute) {
      // User App Resources
      loadCSS([
        `${baseUrl}/user_app/src/assets/css/style.css`,
        `${baseUrl}/user_app/src/assets/css/custom.css`,
        `${baseUrl}/user_app/src/assets/css/toast.css`
      ]);

      loadJSSequentially([
        `${baseUrl}/user_app/src/assets/js/jquery.js`,
        `${baseUrl}/user_app/src/assets/js/toast.js`,
      ]).then(() => {
        // Toast initialization code...
      });
    } else {
      // Website Resources
      loadCSS([
        `${baseUrl}/website/assets/css/bootstrap.min.css`,
        `${baseUrl}/website/assets/css/animate.min.css`,
        `${baseUrl}/website/assets/css/style.css`,
        `${baseUrl}/website/assets/css/responsive.css`,
        // Add other website CSS files here
      ]);

      loadJSSequentially([
        `${baseUrl}/website/assets/js/jquery.min.js`,
        `${baseUrl}/website/assets/js/bootstrap.bundle.min.js`,
        `${baseUrl}/website/assets/js/main.js`,
        // Add other website JS files here
      ]);
    }
  }, [location, baseUrl]);

  return (
    <Routes>
      {/* Website Routes - Pass the path as a prop */}
      <Route path="/" element={<Website />}>
        <Route index element={<Website currentPath="/" />} />
        <Route path="features" element={<Website currentPath="/features" />} />
        <Route path="client" element={<Website currentPath="/client" />} />
        <Route path="pricing" element={<Website currentPath="/pricing" />} />
      </Route>
      
      {/* User App Routes */}
      <Route path="/user_app/*" element={<UserApp />} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const loadCSS = (files) => {
  files.forEach(file => {
    if (!file) return;
    const existingLink = document.querySelector(`link[href="${file}"]`);
    if (existingLink) return;

    const link = document.createElement('link');
    link.href = file;
    link.rel = 'stylesheet';
    link.setAttribute('data-dynamic', 'true');
    document.head.appendChild(link);
  });
};

const loadJSSequentially = async (files) => {
  for (const file of files) {
    if (!file) continue;
    const existingScript = document.querySelector(`script[src="${file}"]`);
    if (existingScript) continue;

    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = file;
      script.setAttribute('data-dynamic', 'true');
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    }).catch(console.error);
  }
};

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;