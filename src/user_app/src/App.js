import React, { useEffect } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";

// Component imports (keeping only what's used in the Routes)
import QRScreen from "./screens/QRScreen";
import HomeScreen from "./screens/HomeScreen";
import "./assets/css/style.css"
import "./assets/css/custom.css"
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
import RestaurantDetails from "./screens/RestaurantDetails";

// Context imports
import { ThemeProvider } from "./context/ThemeContext";
import { RestaurantIdProvider } from "./context/RestaurantIdContext";
import { CartProvider } from "./context/CartContext";
import { PopupProvider } from "./context/PopupContext";
import Saving from "./screens/Saving";
import ErrorPage from "./screens/ErrorPage";
import OrderTypeModal from "./components/OrderTypeModal";

function App() {
  const { restaurantCode } = useParams();
  const restaurantId = localStorage.getItem("restaurantId");

  useEffect(() => {
    localStorage.removeItem("menuItems");
  }, []);

  return (
    <PopupProvider>
      <ThemeProvider>
        <RestaurantIdProvider
          restaurantCode={restaurantCode}
          restaurantId={restaurantId}
        >
          <CartProvider>
            <div className="user-app-root">
              <Routes>
                <Route path="Index" element={<QRScreen />} />

                <Route
                  path=":restaurantCode/:table_number/:section_id"
                  element={<HomeScreen />}
                />
                <Route
                  path=":restaurantCode"
                  element={<HomeScreen />}
                />
                <Route
                  path=":restaurantCode"
                  element={<ValidateAndNavigate />}
                />
                <Route path="AllOrderList" element={<AllOrderList />} />

                <Route path="Wishlist" element={<Wishlist />} />
                <Route path="Cart" element={<Cart />} />
                <Route path="Checkout" element={<Checkout />} />
                <Route path="Category" element={<Category />} />
                <Route path="savings" element={<Saving />} />
                <Route path="Profile" element={<Profile />} />
                <Route path="EditProfile" element={<EditProfile />} />
                <Route path="MyOrder" element={<MyOrder />} />
                <Route path="Menu/:categoryId?" element={<Product />} />
                <Route path="Search" element={<Search />} />
                <Route
                  path="ProductDetails/:menuId"
                  element={<MenuDetails />}
                />
                <Route
                  path="TrackOrder/:order_number"
                  element={<TrackOrder />}
                />
                <Route path="error" element={<ErrorPage />} />
                <Route path="OrderTypeModal" element={<OrderTypeModal />} />
                <Route path="/restaurant/" element={<RestaurantDetails />} />
                <Route path="" element={<Navigate to="Index" replace />} />
                <Route path="*" element={<Navigate to="Index" replace />} />
              </Routes>
            </div>
          </CartProvider>
        </RestaurantIdProvider>
      </ThemeProvider>
    </PopupProvider>
  );
}

export default App;
