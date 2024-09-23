// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import HomeScreen from "./screens/HomeScreen";
// import Signinscreen from "./screens/Signinscreen";
// import Signupscreen from "./screens/SignupScreen";
// import Verifyotp from "./screens/Verifyotp"; // Ensure Verifyotp is imported correctly
// import Profile from "./screens/Profile";
// import Wishlist from "./screens/Wishlist";
// import Category from "./screens/Category";
// import Cart from "./screens/Cart";
// import EditProfile from "./screens/EditProfile";
// import MyOrder from "./screens/MyOrder";
// import Product from "./screens/Product";
// import TrackOrder from "./screens/TrackOrder";
// import Search from "./screens/Search";
// import Checkout from "./screens/Checkout";
// import MenuDetails from "./screens/MenuDetails";
// import OrderTracking from "./screens/OrderTracking";

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
          
//           <Route path="/Verifyotp" element={<Verifyotp />} />
//           {/* Use lowercase 'o' */}
         
//           <Route path="/Wishlist" element={<Wishlist />} />
//           <Route path="/Cart" element={<Cart />} />
//           <Route path="/Checkout" element={<Checkout />} />
//           <Route path="/Category" element={<Category />} />
//           <Route path="/Profile" element={<Profile />} />
//           <Route path="/EditProfile" element={<EditProfile />} />
//           <Route path="/MyOrder" element={<MyOrder />} />
         
//           <Route path="/Menu" element={<Product />} />
//           <Route path="/Search" element={<Search />} />
          
//           <Route path="/ProductDetails/:menuId" element={<MenuDetails />} />
//           <Route path="/TrackOrder/:order_number" element={<TrackOrder />} />
          
         
//         </Routes>
//       </CartProvider>
//     </RestaurantIdProvider>
//   );
// }

// export default App;
















import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import Signinscreen from "./screens/Signinscreen";
import Signupscreen from "./screens/SignupScreen";
import Verifyotp from "./screens/Verifyotp";
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

import { RestaurantIdProvider } from "./context/RestaurantIdContext";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <RestaurantIdProvider>
      <CartProvider>
        <Routes>
          <Route
            path="/HomeScreen/:restaurantCode/:table_number"
            element={<HomeScreen />}
          />{" "}
          {/* Added table_number */}
          <Route
            path="/HomeScreen/:restaurantCode"
            element={<Navigate to="/HomeScreen/681316/8" replace />}
          />{" "}
          {/* Adjusted for default */}
          <Route
            path="/HomeScreen"
            element={<Navigate to="/HomeScreen/681316/8" replace />}
          />{" "}
          {/* Default route */}
          <Route
            path="/"
            element={<Navigate to="/HomeScreen/681316/8" replace />}
          />{" "}
          {/* Redirect root to default */}
          <Route path="/Signinscreen" element={<Signinscreen />} />
          <Route path="/Signupscreen" element={<Signupscreen />} />
          <Route path="/Verifyotp" element={<Verifyotp />} />
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
