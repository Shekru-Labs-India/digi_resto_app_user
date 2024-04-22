
















import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

import Sidebar from './component/Sidebar';
import Checkout from './screens/Checkout';
import MenuDetails from './screens/MenuDetails';

function App() {
  return (
    
      <Routes>
     
        <Route path="/Signinscreen" element={<Signinscreen />} />
        <Route path="/Signupscreen" element={<Signupscreen />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/Verifyotp" element={<Verifyotp />} />
        <Route path="/Changepassword" element={<Changepassword />} />
        <Route path="/HomeScreen" element={<HomeScreen />} />
        {/* <Route path="/Sidebar" element={<Sidebar />} /> */}
        <Route path="/Wishlist" element={<Wishlist />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/Category" element={<Category />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/MyOrder" element={<MyOrder />} />
        {/* <Route path="/Review" element={<Review />} /> */}
        {/* <Route path="/TrackOrder" element={<TrackOrder />} /> */}
        <Route path="/Product" element={<Product />} />
        {/* <Route path="/ProductDetails" element={<ProductDetails />} /> */}
        {/* <Route path="/ProductDetails/:menu_id" component={ProductDetails} /> */}
        <Route path="/Search" element={<Search />} />
      
        <Route path="/Signinscreen" element={<Signinscreen />} />
        <Route path="/" element={<HomeScreen />} />
       
        <Route path="/ProductDetails/:menuId" element={<MenuDetails />} />
        <Route path="/TrackOrder/:order_number" element={<TrackOrder />} />
        <Route path="/Review/:order_number" element={<Review />} />
      </Routes>
   
  );
}

export default App;


