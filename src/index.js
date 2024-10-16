

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { HashRouter,BrowserRouter } from 'react-router-dom';

// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { RestaurantIdProvider } from './context/RestaurantIdContext';
// import { MenuDataProvider } from './context/MenuDataContext';




// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//    <HashRouter>
 
//     {/* <React.StrictMode> */}
//     <RestaurantIdProvider>
   
//       <App />
     
//       </RestaurantIdProvider>
//     {/* </React.StrictMode> */}
   
//    </HashRouter>
// );

// reportWebVitals();


// // import React from 'react';
// // import ReactDOM from 'react-dom/client';
// // import './index.css';
// // import App from './App';
// // import reportWebVitals from './reportWebVitals';

// // const root = ReactDOM.createRoot(document.getElementById('root'));

// // root.render(

// //   <BrowserRouter>
// //     <App />
// //     </BrowserRouter>

// // );

// // reportWebVitals();









import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom"; // You can switch to BrowserRouter if needed
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { RestaurantIdProvider } from "./context/RestaurantIdContext";
import { MenuDataProvider } from "./context/MenuDataContext"; // Ensure this provider is used if needed

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <HashRouter>
    {/* <React.StrictMode> */}
    <RestaurantIdProvider>
      {/* Wrap your application with other providers as needed */}
      {/* <MenuDataProvider> */}
      <App />
      {/* </MenuDataProvider> */}
    </RestaurantIdProvider>
    {/* </React.StrictMode> */}
  </HashRouter>
);

reportWebVitals();
