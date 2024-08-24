import React from "react";
import "../styles/global.css"; // Ensure this path is correct and file exists
import Sidebar from "../components/Sidebar";
import Bottom from "../components/Bottom";
import OfferBanner from "../components/OfferBanner";
import FeaturedArea from "../components/FeaturedArea";
import ProductCart from "../components/ProductCart";
import NearbyArea from "../components/NearbyArea";
import { useParams } from "react-router-dom"; // Import useParams to get the restaurantCode

const HomeScreen = () => {
  const { restaurantCode } = useParams(); // Get restaurantCode from the URL
  console.log("Rendering HomeScreen with restaurantCode:", restaurantCode);

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="page-content p-t100 p-b70">
        <div className="container overflow-hidden pt-0">
          <OfferBanner />
          <FeaturedArea />
          <ProductCart restaurantId="2" />{" "}
          {/* Pass restaurantCode as restaurantId */}
          <NearbyArea />
        </div>
      </main>
      <Bottom restaurantCode="824679" /> {/* Pass restaurantCode to Bottom */}
    </div>
  );
};

export default HomeScreen;
