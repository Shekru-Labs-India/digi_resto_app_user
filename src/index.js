

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter,BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RestaurantIdProvider } from './context/RestaurantIdContext';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
   <HashRouter>
 
    {/* <React.StrictMode> */}
    <RestaurantIdProvider>
      <App />
      </RestaurantIdProvider>
    {/* </React.StrictMode> */}
   
   </HashRouter>
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
