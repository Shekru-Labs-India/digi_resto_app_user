import React, { useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import UserApp from './user_app/src/App'
import Website from './website/src/App'
// Import website components
import Client from './website/src/Components/Client'
import Features from './website/src/Components/Features'
import Pricing from './website/src/Components/Pricing'
import Home from './website/src/Components/Home'

const AppContent = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Remove existing resources when route changes
    const existingResources = document.querySelectorAll('[data-dynamic="true"]');
    existingResources.forEach(resource => resource.remove());

    if (location.pathname.includes('/user_app')) {
      // Load CSS files first
      loadCSS([
        '/user_app/src/assets/css/style.css',
        '/user_app/src/assets/css/custom.css',
        '/user_app/src/assets/css/toast.css'  // Add toast CSS
      ]);

      // Load JS files
      loadJSSequentially([
        '/user_app/src/assets/js/jquery.js',
        '/user_app/src/assets/js/toast.js',  // Add toast.js before custom.js
        // '/user_app/src/assets/js/custom.js'
      ]).then(() => {
        // Initialize toast function
        window.showToast = function(message, type = 'info') {
          const toast = document.createElement('div');
          toast.className = `toast toast-${type} show`;
          toast.textContent = message;
          
          document.body.appendChild(toast);
          
          setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
          }, 3000);
        };
      });
    } else {
      // Website styles
      loadCSS([
        '/assets/website/css/bootstrap.min.css',
        '/assets/website/css/style.css'
      ]);
    }
  }, [location]);

  return (
    <Routes>
      <Route path="user_app/*" element={<UserApp />} />
      <Route path="/" element={<Home />} />
      <Route path="/client" element={<Client />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const loadCSS = (files) => {
  files.forEach(file => {
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