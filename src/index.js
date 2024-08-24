import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { RestaurantIdProvider } from "./context/RestaurantIdContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <RestaurantIdProvider>
        <App />
      </RestaurantIdProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(

//   <BrowserRouter>
//     <App />
//     </BrowserRouter>

// );

// reportWebVitals();
