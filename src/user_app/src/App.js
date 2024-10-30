import React, { useEffect } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";

// Component imports
import QRScreen from "./screens/QRScreen";
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
import ValidateAndNavigate from "./components/ValidateAndNavigate";
import AllOrderList from "./component/AllOrderList";


import { ThemeProvider } from "./context/ThemeContext";
import { RestaurantIdProvider } from "./context/RestaurantIdContext";
import { CartProvider } from "./context/CartContext";

function App() {
  const { restaurantCode } = useParams();
  const restaurantId = localStorage.getItem("restaurantId");

  useEffect(() => {
    localStorage.removeItem("menuItems");
  }, []);

  return (
    <ThemeProvider>
      <RestaurantIdProvider
        restaurantCode={restaurantCode}
        restaurantId={restaurantId}
      >
        <CartProvider>
          <div className="user-app-root">
            <Routes>
              <Route path="Index" element={<QRScreen />} />
              <Route path=":restaurantCode/:table_number" element={<HomeScreen />} />
              <Route path=":restaurantCode" element={<ValidateAndNavigate />} />
              <Route path="AllOrderList" element={<AllOrderList />} />

              <Route path="Signinscreen" element={<Signinscreen />} />
              <Route path="Signupscreen" element={<Signupscreen />} />
              <Route path="Verifyotp" element={<Verifyotp />} />
              <Route path="Wishlist" element={<Wishlist />} />
              <Route path="Cart" element={<Cart />} />
              <Route path="Checkout" element={<Checkout />} />
              <Route path="Category" element={<Category />} />
              <Route path="Profile" element={<Profile />} />
              <Route path="EditProfile" element={<EditProfile />} />
              <Route path="MyOrder" element={<MyOrder />} />
              <Route path="Menu/:categoryId?" element={<Product />} />
              <Route path="Search" element={<Search />} />
              <Route path="ProductDetails/:menuId" element={<MenuDetails />} />
              <Route path="TrackOrder/:order_number" element={<TrackOrder />} />
              <Route path="" element={<Navigate to="Index" replace />} />
              <Route path="*" element={<Navigate to="Index" replace />} />
            </Routes>
          </div>
        </CartProvider>
      </RestaurantIdProvider>
    </ThemeProvider>
  );
}

export default App;
