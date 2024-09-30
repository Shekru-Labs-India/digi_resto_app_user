import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import "../assets/css/style.css";
import "../assets/css/custom.css";
import Sidebar from "../component/Sidebar";
import Bottom from "../component/bottom";
import OfferBanner from "../component/OfferBanner";
import ProductCart from "../component/ProductCart";
import { useRestaurantId } from "../context/RestaurantIdContext";

const HomeScreen = () => {
  const { restaurantCode, table_number } = useParams();
  console.log("table_number", table_number);
  const { setRestaurantCode, restaurantId, restaurantDetails } =
    useRestaurantId();

  useEffect(() => {
    if (restaurantCode) {
      console.log("Setting restaurant code:", restaurantCode);
      setRestaurantCode(restaurantCode);
      localStorage.setItem("restaurantCode", restaurantCode); // Store restaurant code
    }
  }, [restaurantCode, setRestaurantCode]);

  useEffect(() => {
    if (restaurantId && restaurantDetails) {
      const userData = JSON.parse(localStorage.getItem("userData")) || {};
      userData.restaurantId = restaurantId;
      userData.restaurantName = restaurantDetails.name;

      // Use the existing tableNumber from userData if available, otherwise use the one from URL params
      userData.tableNumber = userData.tableNumber || table_number || '1';

      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("restaurantId", restaurantId); // Store restaurant ID
    }
  }, [restaurantId, restaurantDetails, table_number]);

  return (
    <div>
      <div className="page-wrapper">
        <Sidebar />

        <main className="page-content p-t80 p-b20">
          <div className="container overflow-hidden pt-0">
            <OfferBanner />
            <ProductCart />
          </div>
        </main>

        <Bottom />
      </div>
    </div>
  );
};

export default HomeScreen;