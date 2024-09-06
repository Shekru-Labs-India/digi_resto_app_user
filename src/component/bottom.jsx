


// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useRestaurantId } from '../context/RestaurantIdContext';

// const Bottom = () => {
//   const location = useLocation();
//   const { restaurantCode } = useRestaurantId();

//   return (
//     <div className="menubar-area footer-fixed">
//       <div className="toolbar-inner menubar-nav">
//         <Link
//           to={`/HomeScreen/${347279}`}
//           className={
//             location.pathname === `/HomeScreen/${347279}` ? "nav-link active" : "nav-link"
//           }
//         >
//           <i className="bx bx-home-alt bx-sm"></i>
//           <span className="name">Home</span>
//         </Link>
//         <Link
//           to="/Wishlist"
//           className={
//             location.pathname === "/Wishlist" ? "nav-link active" : "nav-link"
//           }
//         >
//           <i className="bx bx-heart bx-sm"></i>
//           <span className="name">Favourite</span>
//         </Link>
//         <Link
//           to="/Cart"
//           className={
//             location.pathname === "/Cart" ? "nav-link active" : "nav-link"
//           }
//         >
//           <i className="bx bx-cart bx-sm"></i>
//           <span className="name">Cart</span>
//         </Link>
//         <Link
//           to="/Search"
          // className={
          //   location.pathname === "/Search" ? "nav-link active" : "nav-link"
          // }
//         >
//           <i className="bx bx-search bx-sm"></i>
//           <span className="name">Search</span>
//         </Link>
//         <Link
//           to="/Profile"
//           className={
//             location.pathname === "/Profile" ? "nav-link active" : "nav-link"
//           }
//         >
//           {/* <Person style={{ color: location.pathname === '/Profile' ? 'white' : 'black' }} /> */}
//           <i class="bx bx-user bx-sm"></i>
//           <span className="name">Profile</span>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Bottom;

























import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useRestaurantId } from '../context/RestaurantIdContext';

const Bottom = () => {
  const location = useLocation();
  const { restaurantCode } = useRestaurantId();

  console.log("Restaurant Code in Bottom:", restaurantCode); // Debugging line

  return (
    <div className="menubar-area footer-fixed">
      <div className="toolbar-inner menubar-nav">
        <Link
          to={`/HomeScreen/${824679}`}
          className={
            location.pathname === `/HomeScreen/${824679}`
              ? "nav-link active"
              : "nav-link"
          }
        >
          <i className="ri-home-2-line bx-sm"></i>
          <span className="name">Home</span>
        </Link>
        <Link
          to="/Wishlist"
          className={
            location.pathname === "/Wishlist" ? "nav-link active" : "nav-link"
          }
        >
          <i className="ri-heart-line bx-sm"></i>
          <span className="name">Favourite</span>
        </Link>
        <Link
          to="/Cart"
          className={
            location.pathname === "/Cart" ? "nav-link active" : "nav-link"
          }
        >
          <i className="ri-shopping-cart-2-line bx-sm"></i>
          <span className="name">Cart</span>
        </Link>
        <Link
          to="/Search"
          className={
            location.pathname === "/Search" ? "nav-link active" : "nav-link"
          }
        >
          <i className="ri-search-line bx-sm"></i>
          <span className="name">Search</span>
        </Link>
        <Link
          to="/Profile"
          className={
            location.pathname === "/Profile" ? "nav-link active" : "nav-link"
          }
        >
          <i className="ri-account-circle-line bx-sm"></i>
          <span className="name">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Bottom;

