// import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import "../assets/css/style.css";
// import "../assets/css/custom.css";
// import Sidebar from "../component/Sidebar";
// import Bottom from "../component/bottom";
// import OfferBanner from "../component/OfferBanner";
// import FeaturedArea from "../component/FeaturedArea";
// import NearbyArea from "../component/NearbyArea";
// import ProductCart from "../component/ProductCart";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import OfferAndFeatured from "../component/OfferAndFeatured";

// const HomeScreen = () => {
//   const { restaurantCode } = useParams();
//   const { setRestaurantCode } = useRestaurantId();

//   useEffect(() => {
//     if (restaurantCode) {
//       console.log("Setting restaurant code:", restaurantCode);
//       setRestaurantCode(restaurantCode);
//     }
//   }, [restaurantCode, setRestaurantCode]);

//   return (
//     <div>
//       <div className="page-wrapper">
//         {/* <Header></Header> */}
//         <Sidebar></Sidebar>

//         {/* Main Content Start */}
//         <main className="page-content p-t100 p-b70">
//           <div className="container overflow-hidden pt-0">
//             {/* SearchBox */}
//             {/* <div className="search-box">
//                         <div className="input-group">
//                             <input type="search" placeholder="Search" className="form-control" />
//                             <span className="input-group-text">
                            
//                                 <i class='bx bx-search-alt icon-search' ></i>
//                             </span>
//                         </div>
//                     </div> */}
//             {/* SearchBox */}

//             {/* <OfferAndFeatured /> */}
//             <OfferBanner />
//             {/* <FeaturedArea /> */}

//             {/* <PopularProducts/> */}
//             <ProductCart />
//             {/* <PeopleAlsoViewed/> */}
//             {/* <ItemsCart/> */}
//             {/* <NearbyArea /> */}
//           </div>
//         </main>

//         {/* Main Content End */}

//         {/* <MySwiper></MySwiper>
//         <Plantcategory></Plantcategory> */}

//         <Bottom></Bottom>
//       </div>
//     </div>
//   );
// };

// export default HomeScreen;









// import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import "../assets/css/style.css";
// import "../assets/css/custom.css";
// import Sidebar from "../component/Sidebar";
// import Bottom from "../component/bottom";
// import OfferBanner from "../component/OfferBanner";
// import ProductCart from "../component/ProductCart";
// import { useRestaurantId } from "../context/RestaurantIdContext";

// const HomeScreen = () => {
//   const { restaurantCode } = useParams();
//   const { setRestaurantCode, restaurantId, restaurantDetails } =
//     useRestaurantId();

//   useEffect(() => {
//     if (restaurantCode) {
//       console.log("Setting restaurant code:", restaurantCode);
//       setRestaurantCode(restaurantCode);
//     }
//   }, [restaurantCode, setRestaurantCode]);

//   useEffect(() => {
//     // Update local storage whenever restaurantId or restaurantDetails changes
//     if (restaurantId && restaurantDetails) {
//       const userData = JSON.parse(localStorage.getItem("userData")) || {};
//       userData.restaurantId = restaurantId; // Update restaurantId
//       userData.restaurantName = restaurantDetails.name; // Update restaurant name
//       localStorage.setItem("userData", JSON.stringify(userData)); // Update local storage
//     }
//   }, [restaurantId, restaurantDetails]);

//   return (
//     <div>
//       <div className="page-wrapper">
//         <Sidebar />

//         <main className="page-content p-t100 p-b70">
//           <div className="container overflow-hidden pt-0">
//             <OfferBanner />
//             <ProductCart />
//           </div>
//         </main>

//         <Bottom />
//       </div>
//     </div>
//   );
// };

// export default HomeScreen;


























// import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import "../assets/css/style.css";
// import "../assets/css/custom.css";
// import Sidebar from "../component/Sidebar";
// import Bottom from "../component/bottom";
// import OfferBanner from "../component/OfferBanner";
// import ProductCart from "../component/ProductCart";
// import { useRestaurantId } from "../context/RestaurantIdContext";

// const HomeScreen = () => {
//   const { restaurantCode, table_number } = useParams(); // Destructure table_number from useParams
//   console.log("table_number", table_number);
//   const { setRestaurantCode, restaurantId, restaurantDetails } =
//     useRestaurantId();

//   useEffect(() => {
//     if (restaurantCode) {
//       console.log("Setting restaurant code:", restaurantCode);
//       setRestaurantCode(restaurantCode);
//     }
//   }, [restaurantCode, setRestaurantCode]);

//   useEffect(() => {
//     // Update local storage whenever restaurantId, restaurantDetails, or table_number changes
//     if (restaurantId && restaurantDetails) {
//       const userData = JSON.parse(localStorage.getItem("userData")) || {};
//       userData.restaurantId = restaurantId; // Update restaurantId
//       userData.restaurantName = restaurantDetails.name; // Update restaurant name
//       if (table_number) {
//         userData.tableNumber = table_number; // Store table_number
//       }
//       localStorage.setItem("userData", JSON.stringify(userData)); // Update local storage
//     }
//   }, [restaurantId, restaurantDetails, table_number]); // Add table_number to the dependency array

//   return (
//     <div>
//       <div className="page-wrapper">
//         <Sidebar />

//         <main className="page-content p-t100 p-b70">
//           <div className="container overflow-hidden pt-0">
//             <OfferBanner />
//             <ProductCart />
//           </div>
//         </main>

//         <Bottom />
//       </div>
//     </div>
//   );
// };

// export default HomeScreen;

















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
  const { restaurantCode, table_number } = useParams(); // Destructure table_number from useParams
  console.log("table_number", table_number); // Debugging to check table_number
  const { setRestaurantCode, restaurantId, restaurantDetails } =
    useRestaurantId();

  useEffect(() => {
    // Update the restaurant code in context if it's available
    if (restaurantCode) {
      console.log("Setting restaurant code:", restaurantCode);
      setRestaurantCode(restaurantCode);
    }
  }, [restaurantCode, setRestaurantCode]);

  useEffect(() => {
    // Update local storage when restaurantId, restaurantDetails, or table_number changes
    if (restaurantId && restaurantDetails) {
      // Get or create an empty userData object
      const userData = JSON.parse(localStorage.getItem("userData")) || {};
      userData.restaurantId = restaurantId; // Update restaurantId
      userData.restaurantName = restaurantDetails.name; // Update restaurant name

      if (table_number) {
        userData.tableNumber = table_number; // Update table_number
      }

      // Save the updated userData back to local storage
      localStorage.setItem("userData", JSON.stringify(userData));
    }
  }, [restaurantId, restaurantDetails, table_number]); // Dependency array includes table_number to update local storage

  return (
    <div>
      <div className="page-wrapper">
        <Sidebar />

        <main className="page-content p-t100 p-b70">
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
