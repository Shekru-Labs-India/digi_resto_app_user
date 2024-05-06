// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

// import Sidebar from './component/Sidebar';
// import Checkout from './screens/Checkout';
// import MenuDetails from './screens/MenuDetails';
// import OrderTracking from './screens/OrderTracking';
// import { RestaurantIdProvider } from './context/RestaurantIdContext';

// function App() {
//   return (
    
//       <Routes>
 
//         <Route path="/Signinscreen" element={<Signinscreen />} />
//         <Route path="/Signupscreen" element={<Signupscreen />} />
//         <Route path="/ForgotPassword" element={<ForgotPassword />} />
//         <Route path="/Verifyotp" element={<Verifyotp />} />
//         <Route path="/Changepassword" element={<Changepassword />} />
//         <Route path="/HomeScreen" element={<HomeScreen />} />
//         {/* <Route path="/Sidebar" element={<Sidebar />} /> */}
//         <Route path="/Wishlist" element={<Wishlist />} />
//         <Route path="/Cart" element={<Cart />} />
//         <Route path="/Checkout" element={<Checkout />} />
//         <Route path="/Category" element={<Category />} />
//         <Route path="/Profile" element={<Profile />} />
//         <Route path="/EditProfile" element={<EditProfile />} />
//         <Route path="/MyOrder" element={<MyOrder />} />
//         {/* <Route path="/Review" element={<Review />} /> */}
//         {/* <Route path="/TrackOrder" element={<TrackOrder />} /> */}
//         <Route path="/Product" element={<Product />} />
//         {/* <Route path="/ProductDetails" element={<ProductDetails />} /> */}
//         {/* <Route path="/ProductDetails/:menu_id" component={ProductDetails} /> */}
//         <Route path="/Search" element={<Search />} />
      
//         <Route path="/Signinscreen" element={<Signinscreen />} />
//         <Route path="/" element={<HomeScreen />} />
//         <Route path="/OrderTracking" element={<OrderTracking />} />
//         <Route path="/ProductDetails/:menuId" element={<MenuDetails />} />
//         <Route path="/TrackOrder/:order_number" element={<TrackOrder />} />
//         <Route path="/Review/:order_number" element={<Review />} />
       
//       </Routes>
   
//   );
// }

// export default App;

// import React, { useState, useEffect } from 'react';
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

// import Sidebar from './component/Sidebar';
// import Checkout from './screens/Checkout';
// import MenuDetails from './screens/MenuDetails';
// import OrderTracking from './screens/OrderTracking';
// import { RestaurantIdProvider } from './context/RestaurantIdContext';
// function App() {

  

//   return (
//     <Routes>
//       {/* Redirect to HomeScreen with the fetched restaurant code */}
//       <Route path="/HomeScreen/:restaurantCode" element={<RestaurantIdProvider><HomeScreen /></RestaurantIdProvider>} />
//        <Route path="/HomeScreen" element={<HomeScreen />} />
//        {/* <Route path="/HomeScreen/:restaurantCode" element={<HomeScreen />} /> */}
//       <Route path="/Signinscreen" element={<Signinscreen />} />
//       <Route path="/Signupscreen" element={<Signupscreen />} />
//       <Route path="/ForgotPassword" element={<ForgotPassword />} />
//       <Route path="/Verifyotp" element={<Verifyotp />} />
//       <Route path="/Changepassword" element={<Changepassword />} />
//       {/* <Route path="/HomeScreen/:restaurantCode" element={<HomeScreen />} /> */}
//       <Route path="/Wishlist" element={<Wishlist />} />
//       <Route path="/Cart" element={<Cart />} />
//       <Route path="/Checkout" element={<Checkout />} />
//       <Route path="/Category" element={<Category />} />
//       <Route path="/Profile" element={<Profile />} />
//       <Route path="/EditProfile" element={<EditProfile />} />
//       <Route path="/MyOrder" element={<MyOrder />} />
//       <Route path="/Product" element={<Product />} />
//       <Route path="/Search" element={<Search />} />
//       <Route path="/OrderTracking" element={<OrderTracking />} />
//       <Route path="/ProductDetails/:menuId" element={<MenuDetails />} />
//       <Route path="/TrackOrder/:order_number" element={<TrackOrder />} />
//       <Route path="/Review/:order_number" element={<Review />} />
//     </Routes>
//   );
// }

// export default App;


import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import Signinscreen from './screens/Signinscreen';
import Signupscreen from './screens/SignupScreen';
import ForgotPassword from './screens/Forgotpw';
import Verifyotp from './screens/Verifyotp';
import Changepassword from './screens/Changepassword';
import Profile from './screens/Profile';
import Wishlist from './screens/Wishlist';
import Category from './screens/Category';
import Cart from './screens/Cart';
import EditProfile from './screens/EditProfile';
import MyOrder from './screens/MyOrder';
import Product from './screens/Product';
import TrackOrder from './screens/TrackOrder';
import Review from './screens/Review';
import Search from './screens/Search';
import Checkout from './screens/Checkout';
import MenuDetails from './screens/MenuDetails';
import OrderTracking from './screens/OrderTracking';
import { RestaurantIdProvider } from './context/RestaurantIdContext';

function App() {
  return (
    <Routes>
      {/* Route to HomeScreen with a specific restaurantCode */}
      <Route
        path="/HomeScreen/:restaurantCode"
        element={<RestaurantIdProvider><HomeScreen /></RestaurantIdProvider>}
      />
      
      {/* Default route for HomeScreen with a default restaurant code */}
      <Route
        path="/"
        element={<Navigate to="/HomeScreen/611447" replace />}
      />
      
      {/* Other routes */}
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
      <Route path="/Product" element={<Product />} />
      <Route path="/Search" element={<Search />} />
      <Route path="/OrderTracking" element={<OrderTracking />} />
      <Route path="/ProductDetails/:menuId" element={<MenuDetails />} />
      <Route path="/TrackOrder/:order_number" element={<TrackOrder />} />
      <Route path="/Review/:order_number" element={<Review />} />
    </Routes>
  );
}

export default App;
