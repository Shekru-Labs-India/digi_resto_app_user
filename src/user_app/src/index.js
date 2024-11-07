import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Only keep third-party CSS if absolutely necessary
import 'remixicon/fonts/remixicon.css';
import "./assets/css/custom.css";
import "./assets/css/style.css";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
