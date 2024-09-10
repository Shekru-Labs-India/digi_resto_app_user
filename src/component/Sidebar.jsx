// import React, { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";

// const Sidebar = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const userDataString = localStorage.getItem("userData");
//   const userData = userDataString ? JSON.parse(userDataString) : null;
//   const [isDarkMode, setIsDarkMode] = useState(false); // State for theme
//   const [restaurantDetails, setRestaurantDetails] = useState(null); // State for restaurant details
//   const { restaurantCode } = useParams();
 
//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen); // Toggle the sidebar state
//   };

//   const getFirstName = (name) => {
//     if (!name) return "";
//     const words = name.split(" ");
//     return words[0];
//   };

//   const toTitleCase = (str) => {
//     if (!str) return "";
//     return str.replace(/\w\S*/g, function (txt) {
//       return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//     });
//   };

//   const toggleTheme = () => {
//     setIsDarkMode(!isDarkMode); // Toggle the dark mode state
//     // Add or remove 'theme-dark' class from the body
//     const body = document.body;
//     if (isDarkMode) {
//       body.classList.remove("theme-dark");
//     } else {
//       body.classList.add("theme-dark");
//     }
//   };

//   useEffect(() => {
//     const fetchRestaurantDetails = async () => {
//       try {
//         const response = await fetch(
//           `https://menumitra.com/user_api/get_restaurant_details_by_code`,
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               restaurant_code: restaurantCode,
//             }),
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           setRestaurantDetails(data.restaurant_details);
//         } else {
//           console.error('Failed to fetch restaurant details');
//         }
//       } catch (error) {
//         console.error('Error fetching restaurant details:', error);
//       }
//     };

//     if (restaurantCode) {
//       fetchRestaurantDetails();
//     }
//   }, [restaurantCode]);
//   return (
//     <div className={`page-wrapper ${sidebarOpen ? "sidebar-open" : ""}`}>
//       {/* Header */}
//       <header className="header header-fixed p-3">
//         <div className="header-content">
//           <div className="left-content gap-1">
//             {/* Display restaurantName in the title */}
//             {/* {userData ? ( */}
//               <h3 className="title font-w300">
//                 {restaurantDetails ? restaurantDetails.name : "Restaurant Name"}
//               </h3>
//             {/* // ) : (
//             //   <h3 className="title font-w300">Restaurant Name</h3>
//             // )} */}
//           </div>
//           <div className="mid-content"></div>
//           <div className="right-content">
//             {/* Toggle sidebar button */}
//             <div className="menu-toggler" onClick={toggleSidebar}>
//               <i className="bx bx-user-circle bx-lg"></i>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Dark overlay for sidebar */}
//       <div
//         className={`dark-overlay ${sidebarOpen ? "dark-overlay active" : ""}`}
//         onClick={toggleSidebar}
//       ></div>

//       {/* Sidebar */}
//       <div className={`sidebar ${sidebarOpen ? "sidebar show" : ""}`}>
//         <div className="author-box">
//           <div className="dz-media">
//             <i className="bx bx-user-circle bx-lg"></i>
//           </div>
//           <div className="dz-info">
//             <div className="greetings">
//               {toTitleCase(getFirstName(userData?.name)) || "User"}
//             </div>
//             <span className="mail">{userData?.mobile}</span>
//           </div>
//         </div>
//         <ul className="nav navbar-nav">
//           {/* Sidebar navigation links */}
//           {/* <li>
//             <Link className="nav-link active" to="/HomeScreen">
//               <span className="dz-icon icon-sm">
//                 <i className='bx bx-home-alt bx-sm'></i>
//               </span>
//               <span>Home</span>
//             </Link>
//           </li> */}
//           <li>
//             <Link className="nav-link active" to="/Product">
//               <span className="dz-icon icon-sm">
//                 {/* <i class='bx bx-shopping-bag bx-sm'></i> */}
//                 <i className="bx bx-dish bx-sm"></i>
//               </span>
//               <span>Menus</span>
//             </Link>
//           </li>

//           <li>
//             <Link className="nav-link active" to="/Category">
//               <span className="dz-icon icon-sm">
//                 <i class="bx bx-category bx-sm"></i>
//               </span>
//               <span>Category</span>
//             </Link>
//           </li>

//           <li>
//             <Link className="nav-link active" to="/Wishlist">
//               <span className="dz-icon icon-sm">
//                 <i class="bx bx-heart bx-sm"></i>
//               </span>
//               <span>Favourite</span>
//             </Link>
//           </li>

//           <li>
//             <Link className="nav-link active" to="/MyOrder">
//               <span className="dz-icon icon-sm">
//                 <i class="bx bx-notepad bx-sm"></i>
//               </span>
//               <span>My Orders</span>
//             </Link>
//           </li>

//           <li>
//             <Link className="nav-link active" to="/Cart">
//               <span className="dz-icon icon-sm">
//                 <i class="bx bx-cart bx-sm"></i>
//               </span>
//               <span>Cart</span>
//             </Link>
//           </li>

//           <li>
//             <Link className="nav-link active" to="/Profile">
//               <span className="dz-icon icon-sm">
//                 <i class="bx bx-user bx-sm"></i>
//               </span>
//               <span>Profile</span>
//             </Link>
//           </li>
//           {/* Other sidebar navigation links */}
//         </ul>
//         <div className="dz-mode">
//           {/* Theme toggle button */}
//           <div className="theme-btn" onClick={toggleTheme}>
//             <i className={`bx ${isDarkMode ? "bx-sun" : "bx-moon"} sun`}></i>
//             <i className={`bx ${isDarkMode ? "bx-moon" : "bx-sun"} moon`}></i>
//           </div>
//         </div>
//         <div className="sidebar-bottom">
//           {/* App information */}
//           <div className="app-info">
//             <span className="ver-info">
//               <p className="company" style={{ textAlign: "center" }}>
//                 ShekruLabs India Pvt.Ltd <p className="company">v1</p>
//               </p>
//             </span>
//           </div>
//         </div>
//       </div>
//       {/* {restaurantId && <OfferBanner restaurantId={restaurantId} />} */}
     
//     </div>
//   );
// };

// export default Sidebar;




















import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRestaurantId } from '../context/RestaurantIdContext';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [isDarkMode, setIsDarkMode] = useState(false); // State for theme
  const { restaurantDetails } = useRestaurantId(); // Consume context

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle the sidebar state
  };

  const getFirstName = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    return words[0];
  };

  const toTitleCase = (str) => {
    if (!str) return "";
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode); // Toggle the dark mode state
    // Add or remove 'theme-dark' class from the body
    const body = document.body;
    if (isDarkMode) {
      body.classList.remove("theme-dark");
    } else {
      body.classList.add("theme-dark");
    }
  };

  return (
    <div className={`page-wrapper ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* Header */}
      <header eader className="header header-fixed p-3">
        <div className="header-content">
          <div className="left-content gap-1">
            <h3 className="title font-w300">
              <i class="ri-store-2-line" style={{ paddingRight: "10px" }}></i>
              {restaurantDetails ? restaurantDetails.name : "Restaurant Name"}
            </h3>
          </div>
          <div className="mid-content"></div>
          <div className="right-content">
            <div className="menu-toggler" onClick={toggleSidebar}>
              {/* <i className="bx bx-user-circle bx-lg"></i> */}
              <i
                class="ri-account-circle-line"
                style={{ fontSize: "48px" }}
              ></i>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`dark-overlay ${sidebarOpen ? "dark-overlay active" : ""}`}
        onClick={toggleSidebar}
      ></div>

      <div className={`sidebar ${sidebarOpen ? "sidebar show" : ""}`}>
        <div className="author-box">
          <div className="dz-media">
            <i
              className="ri-account-circle-line"
              style={{ fontSize: "45px" }}
            ></i>
          </div>
          <div className="dz-info">
            <div className="greetings">
              {toTitleCase(getFirstName(userData?.name)) || "User"}
            </div>
            <span className="mail">{userData?.mobile}</span>
          </div>
        </div>
        <ul className="nav navbar-nav">
          <li>
            <Link className="nav-link active" to="/Product">
              <span className="dz-icon icon-sm">
                <i
                  className="ri-menu-search-line"
                  style={{ fontSize: "25px" }}
                ></i>
              </span>
              <span>Menus</span>
            </Link>
          </li>
          <li>
            <Link className="nav-link active" to="/Category">
              <span className="dz-icon icon-sm">
                <i className="ri-list-check-2" style={{ fontSize: "25px" }}></i>
              </span>
              <span>Category</span>
            </Link>
          </li>
          <li>
            <Link className="nav-link active" to="/Wishlist">
              <span className="dz-icon icon-sm">
                <i className="ri-heart-line" style={{ fontSize: "25px" }}></i>
              </span>
              <span>Favourite</span>
            </Link>
          </li>
          <li>
            <Link className="nav-link active" to="/MyOrder">
              <span className="dz-icon icon-sm">
                <i
                  className="ri-restaurant-line"
                  style={{ fontSize: "25px" }}
                ></i>
              </span>
              <span>My Orders</span>
            </Link>
          </li>
          <li>
            <Link className="nav-link active" to="/Cart">
              <span className="dz-icon icon-sm">
                <i
                  className="ri-shopping-cart-2-line"
                  style={{ fontSize: "25px" }}
                ></i>
              </span>
              <span>Cart</span>
            </Link>
          </li>
          <li>
            <Link className="nav-link active" to="/Profile">
              <span className="dz-icon icon-sm">
                <i
                  className="ri-account-circle-line"
                  style={{ fontSize: "25px" }}
                  s
                ></i>
              </span>
              <span>Profile</span>
            </Link>
          </li>
        </ul>
        <div className="dz-mode">
          <div className="theme-btn" onClick={toggleTheme}>
            <i
              className={`ri ${
                isDarkMode ? "ri-sun-line" : "ri-moon-line"
              } sun`}
            ></i>
            <i
              className={`ri ${
                isDarkMode ? "ri-moon-line" : "ri-sun-line"
              } moon`}
            ></i>
          </div>
        </div>
        <div className="sidebar-bottom">
          <div className="app-info">
            <span className="ver-info">
              <p className="company" style={{ textAlign: "center" }}>
                ShekruLabs India Pvt.Ltd <span className="company">v1</span>
              </p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
