import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
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
import Faq from './screens/Faq';

function App() {
  const { restaurantCode } = useParams();
  console.log("Current restaurant code in URL:", restaurantCode);

  return (
    <RestaurantIdProvider>
      <Routes>
        {/* Route to HomeScreen with a specific restaurantCode */}
        <Route path="/HomeScreen/:restaurantCode" element={ <RestaurantIdProvider><HomeScreen /></RestaurantIdProvider>} />
        
        {/* Default route for HomeScreen with a default restaurant code */}
        <Route path="/HomeScreen" element={<Navigate to="/HomeScreen/143061" replace />} />
        <Route path="/" element={<Navigate to="/HomeScreen/143061" replace />} />
        {/* Other routes */}
        <Route path="/Signinscreen" element={<Signinscreen />} />
        
        <Route path="/Signupscreen" element={<Signupscreen />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/Verifyotp" element={<Verifyotp />} />
        <Route path="/Changepassword" element={<Changepassword />} />
        <Route path="/Wishlist" element={<RestaurantIdProvider><Wishlist /></RestaurantIdProvider>} />
        <Route path="/Cart" element={<RestaurantIdProvider><Cart /></RestaurantIdProvider>} />
        <Route path="/Checkout" element={<RestaurantIdProvider><Checkout /></RestaurantIdProvider>} />
        <Route path="/Category" element={<RestaurantIdProvider><Category /></RestaurantIdProvider>} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/MyOrder" element={<RestaurantIdProvider><MyOrder /></RestaurantIdProvider>} />
        <Route path="/Faq" element={<Faq />} />
        <Route path="/Product" element={<RestaurantIdProvider><Product /></RestaurantIdProvider>} />
        <Route path="/Search" element={<RestaurantIdProvider><Search /></RestaurantIdProvider>} />
        <Route path="/OrderTracking" element={<RestaurantIdProvider><OrderTracking /></RestaurantIdProvider>} />
        <Route path="/ProductDetails/:menuId" element={<RestaurantIdProvider><MenuDetails /></RestaurantIdProvider>} />
        <Route path="/TrackOrder/:order_number" element={<RestaurantIdProvider><TrackOrder /></RestaurantIdProvider>} />
        <Route path="/Review/:order_number/:restaurantCode" element={<RestaurantIdProvider><Review /></RestaurantIdProvider>} />
          
      

      </Routes>
    </RestaurantIdProvider>
  );
}

export default App;






















