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
//             element={<Navigate to="/HomeScreen/568400" replace />}
//           />
//           <Route
//             path="/"
//             element={<Navigate to="/HomeScreen/568400" replace />}
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
















// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import HomeScreen from "./screens/HomeScreen";
// import Signinscreen from "./screens/Signinscreen";
// import Signupscreen from "./screens/SignupScreen";
// import Verifyotp from "./screens/Verifyotp";
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

// import { RestaurantIdProvider } from "./context/RestaurantIdContext";
// import { CartProvider } from "./context/CartContext";

// function App() {
//   return (
//     <RestaurantIdProvider>
//       <CartProvider>
//         <Routes>
//           <Route
//             path="/HomeScreen/:restaurantCode/:table_number"
//             element={<HomeScreen />}
//           />{" "}
//           {/* Added table_number */}
//           <Route
//             path="/HomeScreen/:restaurantCode"
//             element={<Navigate to="/HomeScreen/568400/1" replace />}
//           />{" "}
//           {/* Adjusted for default */}
//           <Route
//             path="/HomeScreen"
//             element={<Navigate to="/HomeScreen/568400/1" replace />}
//           />{" "}
//           {/* Default route */}
//           <Route
//             path="/"
//             element={<Navigate to="/HomeScreen/568400/1" replace />}
//           />{" "}
//           {/* Redirect root to default */}
//           <Route path="/Signinscreen" element={<Signinscreen />} />
//           <Route path="/Signupscreen" element={<Signupscreen />} />
//           <Route path="/Verifyotp" element={<Verifyotp />} />
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








// -------------







// import React from "react";
// import { Routes, Route, Navigate, useParams } from "react-router-dom";
// import HomeScreen from "./screens/HomeScreen";
// import Signinscreen from "./screens/Signinscreen";
// import Signupscreen from "./screens/SignupScreen";
// import Verifyotp from "./screens/Verifyotp";
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

// import { RestaurantIdProvider } from "./context/RestaurantIdContext";
// import { CartProvider } from "./context/CartContext";

// // Utility function to validate the restaurant code
// const isValidRestaurantCode = (code) => {
//   // Replace with your actual validation logic
//   const validCodes = ["568400", "123456", "654321"]; // Example valid codes
//   return validCodes.includes(code);
// };

// // Main App Component
// function App() {
//   return (
//     <RestaurantIdProvider>
//       <CartProvider>
//         <Routes>
//           <Route
//             path="/HomeScreen/:restaurantCode/:table_number"
//             element={<HomeScreen />}
//           />
//           <Route
//             path="/HomeScreen/:restaurantCode"
//             element={<ValidateAndNavigate />}
//           />
//           <Route
//             path="/HomeScreen"
//             element={<Navigate to="/HomeScreen/568400/1" replace />}
//           />
//           <Route
//             path="/"
//             element={<Navigate to="/HomeScreen/568400/1" replace />}
//           />
//           <Route path="/Signinscreen" element={<Signinscreen />} />
//           <Route path="/Signupscreen" element={<Signupscreen />} />
//           <Route path="/Verifyotp" element={<Verifyotp />} />
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

// // Validate and redirect based on restaurant code
// const ValidateAndNavigate = () => {
//   const { restaurantCode } = useParams();

//   if (!isValidRestaurantCode(restaurantCode)) {
//     return <Navigate to="/Signinscreen" replace />;
//   }

//   return <Navigate to={`/HomeScreen/${restaurantCode}/1`} replace />;
// };

// export default App;








// -*-*-**-*-*




// import React from "react";
// import { Routes, Route, Navigate, useParams } from "react-router-dom";
// import HomeScreen from "./screens/HomeScreen";
// import Signinscreen from "./screens/Signinscreen";
// import Signupscreen from "./screens/SignupScreen";
// import Verifyotp from "./screens/Verifyotp";
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

// import {
//   RestaurantIdProvider,
//   useRestaurantId,
// } from "./context/RestaurantIdContext";
// import { CartProvider } from "./context/CartContext";

// // Main App Component
// function App() {
//   return (
//     <CartProvider>
//       <Routes>
//         <Route
//           path="/HomeScreen/:restaurantCode/:table_number"
//           element={<HomeScreen />}
//         />
//         <Route
//           path="/HomeScreen/:restaurantCode"
//           element={<ValidateAndNavigate />}
//         />
//         <Route
//           path="/HomeScreen"
//           element={<Navigate to="/HomeScreen/568400/1" replace />}
//         />
//         <Route
//           path="/"
//           element={<Navigate to="/HomeScreen/568400/1" replace />}
//         />
//         <Route path="/Signinscreen" element={<Signinscreen />} />
//         <Route path="/Signupscreen" element={<Signupscreen />} />
//         <Route path="/Verifyotp" element={<Verifyotp />} />
//         <Route path="/Wishlist" element={<Wishlist />} />
//         <Route path="/Cart" element={<Cart />} />
//         <Route path="/Checkout" element={<Checkout />} />
//         <Route path="/Category" element={<Category />} />
//         <Route path="/Profile" element={<Profile />} />
//         <Route path="/EditProfile" element={<EditProfile />} />
//         <Route path="/MyOrder" element={<MyOrder />} />
//         <Route path="/Menu" element={<Product />} />
//         <Route path="/Search" element={<Search />} />
//         <Route path="/ProductDetails/:menuId" element={<MenuDetails />} />
//         <Route path="/TrackOrder/:order_number" element={<TrackOrder />} />
//       </Routes>
//     </CartProvider>
//   );
// }

// // Validate and redirect based on restaurant code
// const ValidateAndNavigate = () => {
//   const { restaurantCode } = useParams(); // Get restaurant code
//   const { setRestaurantCode } = useRestaurantId(); // Get setRestaurantCode from context

//   // Set restaurant code in context
//   setRestaurantCode(restaurantCode);

//   return (
//     <RestaurantIdProvider restaurantCode={restaurantCode}>
//       <RestaurantIdConsumer />
//     </RestaurantIdProvider>
//   );
// };

// // Component to consume the restaurant ID context
// const RestaurantIdConsumer = () => {
//   const { restaurantCode, error } = useRestaurantId();

//   // If there's an error related to restaurant code, redirect to Signinscreen
//   if (error) {
//     return <Navigate to="/Signinscreen" replace />;
//   }

//   // If restaurant code is valid, navigate to the home screen with table number
//   return <Navigate to={`/HomeScreen/${restaurantCode}`} replace />;
// };

// export default App;





// *-*-*-*2**-**


// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import HomeScreen from "./screens/HomeScreen";
// import Signinscreen from "./screens/Signinscreen";
// import Signupscreen from "./screens/SignupScreen";
// import Verifyotp from "./screens/Verifyotp";
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

// import { RestaurantIdProvider } from "./context/RestaurantIdContext";
// import { CartProvider } from "./context/CartContext";
// import ValidateAndNavigate from "./components/ValidateAndNavigate";

// function App() {
//   return (
//     <RestaurantIdProvider restaurantCode="568400">
//       {" "}
//       {/* Default value here */}
//       <CartProvider>
//         <Routes>
//           <Route
//             path="/HomeScreen/:restaurantCode/:table_number"
//             element={<HomeScreen />}
//           />
//           <Route
//             path="/HomeScreen/:restaurantCode"
//             element={<ValidateAndNavigate />}
//           />
//           <Route
//             path="/HomeScreen"
//             element={<Navigate to="/HomeScreen/568400/1" replace />}
//           />
//           <Route
//             path="/"
//             element={<Navigate to="/HomeScreen/568400/1" replace />}
//           />
//           <Route path="/Signinscreen" element={<Signinscreen />} />
//           <Route path="/Signupscreen" element={<Signupscreen />} />
//           <Route path="/Verifyotp" element={<Verifyotp />} />
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







// 25-09







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
import ValidateAndNavigate from "./components/ValidateAndNavigate";

function App() {
  return (
    <RestaurantIdProvider restaurantCode="568400">
      {" "}
      {/* Default value here */}
      <CartProvider>
        <Routes>
          <Route
            path="/HomeScreen/:restaurantCode/:table_number"
            element={<HomeScreen />}
          />
          <Route
            path="/HomeScreen/:restaurantCode"
            element={<ValidateAndNavigate />}
          />
          <Route
            path="/HomeScreen"
            element={<Navigate to="/HomeScreen/568400/1" replace />}
          />
          <Route
            path="/"
            element={<Navigate to="/HomeScreen/568400/1" replace />}
          />
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
