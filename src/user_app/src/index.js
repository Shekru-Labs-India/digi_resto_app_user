import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Import user app specific styles
import './assets/css/style.css';
import './assets/css/bootstrap.min.css';
// ... other style imports

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
