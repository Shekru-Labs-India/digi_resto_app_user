import React from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
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
import Sidebar from "./component/Sidebar";
import { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { FavoritesProvider } from "./context/FavoritesContext";

import { RestaurantIdProvider } from "./context/RestaurantIdContext";
import { CartProvider } from "./context/CartContext";
import ValidateAndNavigate from "./components/ValidateAndNavigate";

import QRScreen from "./screens/QRScreen";
import AllOrderList from "./component/AllOrderList";
import 'primereact/resources/themes/saga-blue/theme.css'; // Theme
import 'primereact/resources/primereact.min.css';         // Core CSS
// import 'primeicons/primeicons.css';                       // Icons CSS


function App() {
  const { restaurantCode } = useParams();
  const restaurantId = localStorage.getItem("restaurantId");

  useEffect(() => {
    // Remove local storage object named menuItems
    localStorage.removeItem("menuItems");
  }, []); // Empty dependency array ensures this runs on mount

  return (
    <ThemeProvider>
      <RestaurantIdProvider
        restaurantCode={restaurantCode}
        restaurantId={restaurantId}
      >
        {/* <FavoritesProvider> */}
          <CartProvider>
            <Routes>
              <Route path="/AllOrderList" element={<AllOrderList />} />
            <Route
              path="/:restaurantCode/:table_number"
              element={<HomeScreen />}
            />
            <Route path="/:restaurantCode" element={<ValidateAndNavigate />} />
            <Route
              path="/"
              element={<Navigate to={`/${restaurantCode}/1`} replace />}
            />
            <Route
              path="/"
              element={<Navigate to={`/${restaurantCode}/1`} replace />}
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
            <Route path="/Menu/:categoryId?" element={<Product />} />
            <Route path="/Search" element={<Search />} />
            <Route path="/ProductDetails/:menuId" element={<MenuDetails />} />
            <Route path="/TrackOrder/:order_number" element={<TrackOrder />} />
            <Route path="/Index" element={<QRScreen />} />
            </Routes>
          </CartProvider>
        {/* </FavoritesProvider> */}
      </RestaurantIdProvider>
    </ThemeProvider>
  );
}

export default App;
