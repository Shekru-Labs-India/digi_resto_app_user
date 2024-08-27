


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

const Bottom = ({ restaurantCode }) => {
  const location = useLocation();

  return (
    <div className="menubar-area footer-fixed">
      <div className="toolbar-inner menubar-nav">
        <Link
          to={`/HomeScreen/${restaurantCode}`} // Use restaurantCode directly
          className={
            location.pathname === `/HomeScreen/${restaurantCode}`
              ? "nav-link active"
              : "nav-link"
          }
        >
          <i className="bx bx-home-alt bx-sm"></i>
          <span className="name">Home</span>
        </Link>
        <Link
          to="/Wishlist"
          className={
            location.pathname === "/Wishlist" ? "nav-link active" : "nav-link"
          }
        >
          <i className="bx bx-heart bx-sm"></i>
          <span className="name">Favourite</span>
        </Link>
        <Link
          to="/Cart"
          className={
            location.pathname === "/Cart" ? "nav-link active" : "nav-link"
          }
        >
          <i className="bx bx-cart bx-sm"></i>
          <span className="name">Cart</span>
        </Link>
        <Link
          to="/Search"
          className={
            location.pathname === "/Search" ? "nav-link active" : "nav-link"
          }
        >
          <i className="bx bx-search bx-sm"></i>
          <span className="name">Search</span>
        </Link>
        <Link
          to="/Profile"
          className={
            location.pathname === "/Profile" ? "nav-link active" : "nav-link"
          }
        >
          <i className="bx bx-user bx-sm"></i>
          <span className="name">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Bottom;
