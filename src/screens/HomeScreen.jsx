import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import "../assets/css/style.css";
import "../assets/css/custom.css";
import Sidebar from "../component/Sidebar";
import Bottom from "../component/bottom";
import OfferBanner from "../component/OfferBanner";
import FeaturedArea from "../component/FeaturedArea";
import NearbyArea from "../component/NearbyArea";
import ProductCart from "../component/ProductCart";
import { useRestaurantId } from "../context/RestaurantIdContext";
import OfferAndFeatured from "../component/OfferAndFeatured";

const HomeScreen = () => {
  const { restaurantCode } = useParams();
  const { setRestaurantCode } = useRestaurantId();

  useEffect(() => {
    if (restaurantCode) {
      console.log("Setting restaurant code:", restaurantCode);
      setRestaurantCode(restaurantCode);
    }
  }, [restaurantCode, setRestaurantCode]);

  return (
    <div>
      <div className="page-wrapper">
        {/* <Header></Header> */}
        <Sidebar></Sidebar>

        {/* Main Content Start */}
        <main className="page-content p-t100 p-b70">
          <div className="container overflow-hidden pt-0">
            {/* SearchBox */}
            {/* <div className="search-box">
                        <div className="input-group">
                            <input type="search" placeholder="Search" className="form-control" />
                            <span className="input-group-text">
                            
                                <i class='bx bx-search-alt icon-search' ></i>
                            </span>
                        </div>
                    </div> */}
            {/* SearchBox */}

            {/* <OfferAndFeatured /> */}
            <OfferBanner />
            {/* <FeaturedArea /> */}

            {/* <PopularProducts/> */}
            <ProductCart />
            {/* <PeopleAlsoViewed/> */}
            {/* <ItemsCart/> */}
            <NearbyArea />
          </div>
        </main>

        {/* Main Content End */}

        {/* <MySwiper></MySwiper>
        <Plantcategory></Plantcategory> */}

        <Bottom></Bottom>
      </div>
    </div>
  );
};

export default HomeScreen;
