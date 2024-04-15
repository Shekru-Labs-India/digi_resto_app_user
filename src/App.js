// import logo from "./logo.svg";
// import "./App.css";
// import HomeScreen from "./screens/HomeScreen";
// import Bottom from "./component/bottom";
// import Signinscreen from "./screens/Signinscreen";
// import WelcomeScreen from "./screens/WelcomeScreen";
// import ForgotPassword from "./screens/Forgotpw";
// import Signupscreen from "./screens/SignupScreen";
// import Verifyotp from "./screens/Verifyotp";
// import Changepassword from "./screens/Changepassword";
// import Profile from "./screens/Profile";
// import Wishlist from "./screens/Wishlist";
// import Category from "./screens/Category";
// import Cart from "./screens/Cart";

// import {
//   BrowserRouter as Router,
//   Switch,
//   Routes,
//   Route,
//   Link,
// } from "react-router-dom";
// import EditProfile from "./screens/EditProfile";
// import MyOrder from "./screens/MyOrder";
// import Product from "./screens/Product";
// import ProductDetails from "./screens/ProductDetails";
// import TrackOrder from "./screens/TrackOrder";
// import Review from "./screens/Review";
// import Search from "./screens/Search";

// function App() {
//   return (
//     <>
//       {/* <WelcomeScreen></WelcomeScreen> */}
//       {/* <Signinscreen></Signinscreen> */}
//       {/* <ForgotPassword></ForgotPassword> */}
//       {/* <HomeScreen></HomeScreen> */}
//       {/* <Profile></Profile> */}
//       {/* <Wishlist></Wishlist> */}
//       {/* <Bottom></Bottom> */}
//       {/* <Signupscreen></Signupscreen> */}
//       {/* <Verifyotp></Verifyotp>
//    <Changepassword></Changepassword> */}
//       {/* <Category></Category> */}
//       {/* <Cart></Cart> */}
  
//       <Router>
//       {/* <Signinscreen/> */}
//       <Link to="/Signinscreen">{Signinscreen}</Link>
//       <Link to="/Signupscreen">{Signupscreen}</Link>
//       <Link to="/ForgotPassword">{ForgotPassword}</Link> 
//       <Link to="/Verifyotp">{Verifyotp}</Link> 
//       <Link to="/Changepassword">{Changepassword}</Link> 
//          <Link to="/HomeScreen">{HomeScreen}</Link> 
//          <Link to="/Wishlist">{Wishlist}</Link>
//          <Link to="/Cart">{Cart}</Link>
//          <Link to="/Category">{Category}</Link>
//          <Link to="/Profile">{Profile}</Link>
//          <Link to="/EditProfile">{EditProfile}</Link>
//          <Link to="/MyOrder">{MyOrder}</Link>
//          <Link to="/Review">{Review}</Link>
//          <Link to="/TrackOrder">{TrackOrder}</Link>
//          <Link to="/Product">{Product}</Link>
//          <Link to="/ProductDetails">{ProductDetails}</Link>
//          <Link to="/Search">{Search}</Link>
//         <Routes>
//           <Route path="/ForgotPassword" Component={ForgotPassword}></Route>  
//           <Route path="/Signinscreen" Component={Signinscreen}></Route>
//           <Route path="/Signupscreen" Component={Signupscreen}></Route>
//           <Route path="/HomeScreen" Component={HomeScreen}></Route>
//           <Route path="/Changepassword" Component={Changepassword}></Route>
//           <Route path="/Verifyotp" Component={Verifyotp}></Route>
//           <Route path="/Wishlist" Component={Wishlist}></Route>
//           <Route path="/Cart" Component={Cart}></Route>
//           <Route path="/Category" Component={Category}></Route>
//           <Route path="/Profile" Component={Profile}></Route>
//           <Route path="/EditProfile" Component={EditProfile}></Route>
//           <Route path="/MyOrder" Component={MyOrder}></Route>
//           <Route path="/TrackOrder" Component={TrackOrder}></Route>
//           <Route path="/Review" Component={Review}></Route>
//           <Route path="/Product" Component={Product}></Route>
//           <Route path="/ProductDetails" Component={ProductDetails}></Route>
//           <Route path="/Search" Component={Search}></Route>
//         </Routes>
//       </Router>
//     </>
//   );
// }

// export default App;

















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
import ProductDetails from './screens/ProductDetails';
import TrackOrder from './screens/TrackOrder';
import Review from './screens/Review';
import Search from './screens/Search';
import WelcomeScreen from './screens/WelcomeScreen';
import Sidebar from './component/Sidebar';
import Checkout from './screens/Checkout';

function App() {
  return (
    
      <Routes>
      <Route path="/WelcomeScreen" element={<WelcomeScreen />} />
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
        <Route path="/Review" element={<Review />} />
        <Route path="/TrackOrder" element={<TrackOrder />} />
        <Route path="/Product" element={<Product />} />
        <Route path="/ProductDetails" element={<ProductDetails />} />
        <Route path="/Search" element={<Search />} />
        {/* Set default route to Signinscreen */}
        <Route path="/Signinscreen" element={<Signinscreen />} />
        <Route path="/" element={<WelcomeScreen />} />
      </Routes>
   
  );
}

export default App;


