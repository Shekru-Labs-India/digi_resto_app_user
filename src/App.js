


// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import HomeScreen from './screens/HomeScreen';
// import Signinscreen from './screens/Signinscreen';
// import Signupscreen from './screens/SignupScreen';
// import ForgotPassword from './screens/Forgotpw';
// import Verifyotp from './screens/Verifyotp';
// import Changepassword from './screens/Changepassword';
// import Profile from './screens/Profile';
// import Wishlist from './screens/Wishlist';
// import Category from './screens/Category';
// import Cart from './screens/Cart';
// import EditProfile from './screens/EditProfile';
// import MyOrder from './screens/MyOrder';
// import Product from './screens/Product';
// import TrackOrder from './screens/TrackOrder';
// import Review from './screens/Review';
// import Search from './screens/Search';
// import Checkout from './screens/Checkout';
// import MenuDetails from './screens/MenuDetails';
// import OrderTracking from './screens/OrderTracking';

// import { RestaurantIdProvider } from './context/RestaurantIdContext';
// import Faq from './screens/Faq';

// function App() {
//   return (
//     <RestaurantIdProvider>
//     <Routes>
         
//       {/* Route to HomeScreen with a specific restaurantCode */}
//       <Route
//         path="/HomeScreen/:restaurantCode"
//         element={<RestaurantIdProvider><HomeScreen /></RestaurantIdProvider>}
//       />
      
//       {/* Default route for HomeScreen with a default restaurant code */}
//       <Route
//         path="/"
//         element={<Navigate to="/HomeScreen/347279" replace />}
//       />
      
//       {/* Other routes */}
//       <Route path="/Signinscreen" element={<Signinscreen />} />
//       <Route path="/Signupscreen" element={<Signupscreen />} />
//       <Route path="/ForgotPassword" element={<ForgotPassword />} />
//       <Route path="/Verifyotp" element={<Verifyotp />} />
//       <Route path="/Changepassword" element={<Changepassword />} />
//       <Route path="/Wishlist" element={<Wishlist />} />
//       <Route path="/Cart" element={<Cart />} />
//       <Route path="/Checkout" element={<Checkout />} />
//       <Route path="/Category" element={<Category />} />
//       <Route path="/Profile" element={<Profile />} />
//       <Route path="/EditProfile" element={<EditProfile />} />
//       <Route path="/MyOrder" element={<MyOrder />} />
//       <Route path="/Faq" element={<Faq />} />
//       <Route path="/Product" element={<Product />} />
 
//       <Route path="/Search" element={<RestaurantIdProvider><Search /></RestaurantIdProvider>} />
//       <Route path="/OrderTracking" element={<OrderTracking />} />
//       <Route path="/ProductDetails/:menuId" element={<MenuDetails />} />
//       <Route path="/TrackOrder/:order_number" element={<TrackOrder />} />
//       <Route path="/Review/:order_number" element={<Review />} />
 
//     </Routes>
//     </RestaurantIdProvider>
//   );
// }

// export default App;
// src/App.js







import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import Signinscreen from "./screens/Signinscreen";
import Signupscreen from "./screens/SignupScreen";
import ForgotPassword from "./screens/Forgotpw";
import Verifyotp from "./screens/Verifyotp";
import Changepassword from "./screens/Changepassword";
import Profile from "./screens/Profile";
import Wishlist from "./screens/Wishlist";
import Category from "./screens/Category";
import Cart from "./screens/Cart";
import EditProfile from "./screens/EditProfile";
import MyOrder from "./screens/MyOrder";
import Product from "./screens/Product";
import TrackOrder from "./screens/TrackOrder";
import Review from "./screens/Review";
import Search from "./screens/Search";
import Checkout from "./screens/Checkout";
import MenuDetails from "./screens/MenuDetails";
import OrderTracking from "./screens/OrderTracking";
import Faq from "./screens/Faq";
import { RestaurantIdProvider } from "./context/RestaurantIdContext";

// Assuming that the component you'd like to render for the '/digi_resto_app_user' route is 'Profile'
// You can replace 'Profile' with the correct component if needed.
function App() {
  return (
    <RestaurantIdProvider>
      <Routes>
        <Route path="/HomeScreen/824679" element={<HomeScreen />} />
        <Route
          path="/HomeScreen"
          element={<Navigate to="/HomeScreen/824679" replace />}
        />
        <Route
          path="/"
          element={<Navigate to="/HomeScreen/824679" replace />}
        />
        <Route path="/Signinscreen" element={<Signinscreen />} />
        <Route path="/Signupscreen" element={<Signupscreen />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/Verifyotp" element={<Verifyotp />} />
        <Route path="/Changepassword" element={<Changepassword />} />
        <Route path="/Wishlist" element={<Wishlist />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/Category" element={<Category />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/MyOrder" element={<MyOrder />} />
        <Route path="/Faq" element={<Faq />} />
        <Route path="/Product" element={<Product />} />
        <Route path="/Search" element={<Search />} />
        <Route path="/OrderTracking" element={<OrderTracking />} />
        <Route path="/ProductDetails/:menuId" element={<MenuDetails />} />
        <Route path="/TrackOrder/:order_number" element={<TrackOrder />} />
        <Route path="/Review/:order_number/824679" element={<Review />} />

        {/* Added route for '/digi_resto_app_user' */}
        <Route path="/digi_resto_app_user" element={<Profile />} />

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </RestaurantIdProvider>
  );
}

export default App;
