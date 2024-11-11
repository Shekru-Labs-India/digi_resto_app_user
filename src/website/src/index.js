import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Only keep third-party CSS
import 'animate.css/animate.min.css';
import 'remixicon/fonts/remixicon.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Website-specific scripts
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import './assets/js/main.js';
import "./Assets/Css/responsive.css ";
import "./Assets/Css/stylewebsite.css"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
    <App />

);
