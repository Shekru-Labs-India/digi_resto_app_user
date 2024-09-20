import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import Signinscreen from "./screens/Signinscreen";
import Signupscreen from "./screens/SignupScreen";
import Verifyotp from "./screens/Verifyotp"; // Ensure Verifyotp is imported correctly
import Profile from "./screens/Profile";
import Wishlist from "./screens/Wishlist";
import Category from "./screens/Category";
import Cart from "./screens/Cart";
import EditProfile from "./screens/EditProfile";
import MyOrder from "./screens/MyOrder";
import Product from "./screens/Product";
import TrackOrder from "./screens/TrackOrder";
import Search from "./screens/Search";
import Checkout from "./screens/Checkout";
import MenuDetails from "./screens/MenuDetails";
import OrderTracking from "./screens/OrderTracking";

import { RestaurantIdProvider } from "./context/RestaurantIdContext";
import { CartProvider } from "./context/CartContext";


function App() {
  return (
    <RestaurantIdProvider>
      <CartProvider>
        <Routes>
          <Route path="/HomeScreen/:restaurantCode" element={<HomeScreen />} />
          <Route
            path="/HomeScreen"
            element={<Navigate to="/HomeScreen/681316" replace />}
          />
          <Route
            path="/"
            element={<Navigate to="/HomeScreen/681316" replace />}
          />
          <Route path="/Signinscreen" element={<Signinscreen />} />
          <Route path="/Signupscreen" element={<Signupscreen />} />
          
          <Route path="/Verifyotp" element={<Verifyotp />} />
          {/* Use lowercase 'o' */}
         
          <Route path="/Wishlist" element={<Wishlist />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Checkout" element={<Checkout />} />
          <Route path="/Category" element={<Category />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/EditProfile" element={<EditProfile />} />
          <Route path="/MyOrder" element={<MyOrder />} />
         
          <Route path="/Menu" element={<Product />} />
          <Route path="/Search" element={<Search />} />
          
          <Route path="/ProductDetails/:menuId" element={<MenuDetails />} />
          <Route path="/TrackOrder/:order_number" element={<TrackOrder />} />
          
         
        </Routes>
      </CartProvider>
    </RestaurantIdProvider>
  );
}

export default App;


















// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import HomeScreen from "./screens/HomeScreen";
// import Signinscreen from "./screens/Signinscreen";
// import Signupscreen from "./screens/SignupScreen";
// import ForgotPassword from "./screens/Forgotpw";
// import Verifyotp from "./screens/Verifyotp";
// import Changepassword from "./screens/Changepassword";
// import Profile from "./screens/Profile";
// import Wishlist from "./screens/Wishlist";
// import Category from "./screens/Category";
// import Cart from "./screens/Cart";
// import EditProfile from "./screens/EditProfile";
// import MyOrder from "./screens/MyOrder";
// import Product from "./screens/Product";
// import TrackOrder from "./screens/TrackOrder";
// import Review from "./screens/Review";
// import Search from "./screens/Search";
// import Checkout from "./screens/Checkout";
// import MenuDetails from "./screens/MenuDetails";
// import OrderTracking from "./screens/OrderTracking";
// import Faq from "./screens/Faq";
// import Test from "./component/Test";

// import { RestaurantIdProvider } from "./context/RestaurantIdContext";
// import { CartProvider } from "./context/CartContext";

// function App() {
//   return (
//     <RestaurantIdProvider>
//       <CartProvider>
//         <Routes>
//           <Route path="/HomeScreen/:restaurantCode" element={<HomeScreen />} />
//           <Route
//             path="/HomeScreen"
//             element={<Navigate to="/HomeScreen/681316" replace />}
//           />
//           <Route
//             path="/"
//             element={<Navigate to="/HomeScreen/681316" replace />}
//           />
//           <Route path="/Signinscreen" element={<Signinscreen />} />
//           <Route path="/Signupscreen" element={<Signupscreen />} />
//           <Route path="/ForgotPassword" element={<ForgotPassword />} />
//           <Route path="/Verifyotp" element={<Verifyotp />} />
//           <Route path="/Changepassword" element={<Changepassword />} />
//           <Route path="/Wishlist" element={<Wishlist />} />
//           <Route path="/Cart" element={<Cart />} />
//           <Route path="/Checkout" element={<Checkout />} />
//           <Route path="/Category" element={<Category />} />
//           <Route path="/Profile" element={<Profile />} />
//           <Route path="/EditProfile" element={<EditProfile />} />
//           <Route path="/MyOrder" element={<MyOrder />} />
//           <Route path="/Faq" element={<Faq />} />
//           <Route path="/Product" element={<Product />} />
//           <Route path="/Search" element={<Search />} />
//           <Route path="/OrderTracking" element={<OrderTracking />} />
//           <Route path="/ProductDetails/:menuCatId" element={<MenuDetails />} />
//           <Route path="/TrackOrder/:order_number" element={<TrackOrder />} />
//           <Route
//             path="/Review/:order_number/:restaurantCode"
//             element={<Review />}
//           />
//           <Route path="/testing" element={<Test />} />
//         </Routes>
//       </CartProvider>
//     </RestaurantIdProvider>
//   );
// }

// export default App;
