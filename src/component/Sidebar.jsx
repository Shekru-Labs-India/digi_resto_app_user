// import React, { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import { useRestaurantId } from '../context/RestaurantIdContext';
// import CompanyVersion from "../constants/CompanyVersion";

// const Sidebar = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const { table_number } = useParams();
//   const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("userData")) || {});
//   const [isDarkMode, setIsDarkMode] = useState(false); // State for theme
//   const { restaurantDetails } = useRestaurantId(); // Consume context
//   const isLoggedIn = !!localStorage.getItem('userData');

//   useEffect(() => {
//     if (table_number) {
//       const updatedUserData = { ...userData, tableNumber: table_number };
//       setUserData(updatedUserData);
//       localStorage.setItem("userData", JSON.stringify(updatedUserData));
//     }
//   }, [table_number]);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen); // Toggle the sidebar state
//   };

//   const getFirstName = (name) => {
//     if (!name) return "User"; // Return "User" if name is undefined or null
//     const words = name.split(" ");
//     return words[0]; // Return the first word
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

//   return (
//     <div className={`page-wrapper ${sidebarOpen ? "sidebar-open" : ""}`}>
//       {/* Header */}
//       <header className="header header-fixed p-3">
//         {/* <div className="header-content">
//           <div className="left-content gap-1">
//             <h3 className="title fw-medium">
//               <i class="ri-store-2-line" style={{ paddingRight: "10px" }}></i>
//               {restaurantDetails ? restaurantDetails.name : "Restaurant Name"}
//             </h3>
//           </div>
//           <div className="mid-content"></div>
//           <div className="right-content">
//             <div className="menu-toggler" onClick={toggleSidebar}>
//               {isLoggedIn ? (
//                 <i className="ri-menu-line fs-1"></i>
//               ) : (
//                 <Link to="/Signinscreen">
//                   <i
//                     className="ri-login-circle-line fs-1"
                    
//                   ></i>
//                 </Link>
//               )}
//             </div>
//           </div> 
//           <div className="right-content gap-1">
//             <h3 className="title fw-medium">
//               {restaurantDetails ? restaurantDetails.name : "Restaurant Name"}
//               <i className="ri-store-2-line ps-2"></i>
//             </h3>
//           </div>
//         </div> */}

//         <div className="header-content d-flex justify-content-between">
//           <div className="left-content">
//             <div className="menu-toggler" onClick={toggleSidebar}>
//               {isLoggedIn ? (
//                 <i className="ri-menu-line fs-1"></i>
//               ) : (
//                 <Link>
//                   <i className="ri-menu-line fs-1"></i>
//                 </Link>
//               )}
//             </div>
//           </div>
//           <div className="right-content gap-1">
//             <h3 className="title fw-medium hotel-name">
//               {userData.restaurantName.toUpperCase()}
//               <i className="ri-store-2-line ps-2"></i>
//             </h3>
//             <h6 className="title fw-medium h6 custom-text-gray table-number">
//               Table: {userData.tableNumber || ""}
//             </h6>
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
//           <div className="dz-media d-flex justify-content-center align-items-center">
//             <i className="ri-user-3-line fs-1"></i>
//           </div>
//           <div className="dz-info">
//             <div className="greetings">
//               {toTitleCase(getFirstName(userData?.name)) || "User"}
//             </div>
//             <span className="mail">{userData?.mobile}</span>
//           </div>
//         </div>
//         <ul className="nav navbar-nav">
//           <li>
//             <Link className="nav-link active" to="/Menu">
//               <span className="dz-icon icon-sm">
//                 <i
//                   className="ri-menu-search-line"
//                   style={{ fontSize: "25px" }}
//                 ></i>
//               </span>
//               <span>Menus</span>
//             </Link>
//           </li>
//           <li>
//             <Link className="nav-link active" to="/Category">
//               <span className="dz-icon icon-sm">
//                 <i className="ri-list-check-2" style={{ fontSize: "25px" }}></i>
//               </span>
//               <span>Category</span>
//             </Link>
//           </li>
//           <li>
//             <Link className="nav-link active" to="/Wishlist">
//               <span className="dz-icon icon-sm">
//                 <i className="ri-heart-2-line" style={{ fontSize: "25px" }}></i>
//               </span>
//               <span>Favourite</span>
//             </Link>
//           </li>
//           <li>
//             <Link className="nav-link active" to="/MyOrder">
//               <span className="dz-icon icon-sm">
//                 <i
//                   className="ri-restaurant-line"
//                   style={{ fontSize: "25px" }}
//                 ></i>
//               </span>
//               <span>My Orders</span>
//             </Link>
//           </li>
//           <li>
//             <Link className="nav-link active" to="/Cart">
//               <span className="dz-icon icon-sm">
//                 <i
//                   className="ri-shopping-cart-2-line"
//                   style={{ fontSize: "25px" }}
//                 ></i>
//               </span>
//               <span>Cart</span>
//             </Link>
//           </li>
//           <li>
//             <Link className="nav-link active" to="/Profile">
//               <span className="dz-icon icon-sm">
//                 <i className="ri-user-3-line" style={{ fontSize: "25px" }}></i>
//               </span>
//               <span>Profile</span>
//             </Link>
//           </li>
//         </ul>
//         <div className="dz-mode mt-4 me-4">
//           <div className="theme-btn" onClick={toggleTheme}>
//             <i
//               className={`ri ${
//                 isDarkMode ? "ri-sun-line" : "ri-moon-line"
//               } sun`}
//             ></i>
//             <i
//               className={`ri ${
//                 isDarkMode ? "ri-moon-line" : "ri-sun-line"
//               } moon`}
//             ></i>
//           </div>
//         </div>
//         <div className="sidebar-bottom">
//           <CompanyVersion />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;






// import React, { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import { useRestaurantId } from "../context/RestaurantIdContext";
// import CompanyVersion from "../constants/CompanyVersion";

// const Sidebar = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const { table_number } = useParams();
//   const [userData, setUserData] = useState(
//     JSON.parse(localStorage.getItem("userData")) || {}
//   );
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const { restaurantDetails } = useRestaurantId();
//   const isLoggedIn = !!localStorage.getItem("userData");

//   useEffect(() => {
//     if (table_number) {
//       const updatedUserData = { ...userData, tableNumber: table_number };
//       setUserData(updatedUserData);
//       localStorage.setItem("userData", JSON.stringify(updatedUserData));
//     }
//   }, [table_number]);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const getFirstName = (name) => {
//     if (!name) return "User";
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
//     setIsDarkMode(!isDarkMode);
//     const body = document.body;
//     if (isDarkMode) {
//       body.classList.remove("theme-dark");
//     } else {
//       body.classList.add("theme-dark");
//     }
//   };

//   return (
//     <div className={`page-wrapper ${sidebarOpen ? "sidebar-open" : ""}`}>
//       {/* Header */}
//       <header className="header header-fixed p-3">
//         <div className="header-content d-flex justify-content-between">
//           <div className="left-content">
//             <div className="menu-toggler" onClick={toggleSidebar}>
//               {isLoggedIn ? (
//                 <i className="ri-menu-line fs-1"></i>
//               ) : (
//                 <Link to="/Signinscreen">
//                   <i className="ri-login-circle-line fs-1"></i>
//                 </Link>
//               )}
//             </div>
//           </div>
//           <div className="right-content gap-1">
//             <h3 className="title fw-medium hotel-name">
//               {userData.restaurantName
//                 ? userData.restaurantName.toUpperCase()
//                 : "Restaurant Name"}
//               <i className="ri-store-2-line ps-2"></i>
//             </h3>
//             <h6 className="title fw-medium h6 custom-text-gray table-number">
//               Table: {userData.tableNumber || ""}
//             </h6>
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
//           <div className="dz-media d-flex justify-content-center align-items-center">
//             <i className="ri-user-3-line fs-1"></i>
//           </div>
//           <div className="dz-info">
//             <div className="greetings">
//               {toTitleCase(getFirstName(userData?.name)) || "User"}
//             </div>
//             <span className="mail">{userData?.mobile}</span>
//           </div>
//         </div>
//         <ul className="nav navbar-nav">
//           <li>
//             <Link className="nav-link active" to="/Menu">
//               <span className="dz-icon icon-sm">
//                 <i
//                   className="ri-menu-search-line"
//                   style={{ fontSize: "25px" }}
//                 ></i>
//               </span>
//               <span>Menus</span>
//             </Link>
//           </li>
//           <li>
//             <Link className="nav-link active" to="/Category">
//               <span className="dz-icon icon-sm">
//                 <i className="ri-list-check-2" style={{ fontSize: "25px" }}></i>
//               </span>
//               <span>Category</span>
//             </Link>
//           </li>
//           <li>
//             <Link className="nav-link active" to="/Wishlist">
//               <span className="dz-icon icon-sm">
//                 <i className="ri-heart-2-line" style={{ fontSize: "25px" }}></i>
//               </span>
//               <span>Favourite</span>
//             </Link>
//           </li>
//           <li>
//             <Link className="nav-link active" to="/MyOrder">
//               <span className="dz-icon icon-sm">
//                 <i
//                   className="ri-restaurant-line"
//                   style={{ fontSize: "25px" }}
//                 ></i>
//               </span>
//               <span>My Orders</span>
//             </Link>
//           </li>
//           <li>
//             <Link className="nav-link active" to="/Cart">
//               <span className="dz-icon icon-sm">
//                 <i
//                   className="ri-shopping-cart-2-line"
//                   style={{ fontSize: "25px" }}
//                 ></i>
//               </span>
//               <span>Cart</span>
//             </Link>
//           </li>
//           <li>
//             <Link className="nav-link active" to="/Profile">
//               <span className="dz-icon icon-sm">
//                 <i className="ri-user-3-line" style={{ fontSize: "25px" }}></i>
//               </span>
//               <span>Profile</span>
//             </Link>
//           </li>
//         </ul>
//         <div className="dz-mode mt-4 me-4">
//           <div className="theme-btn" onClick={toggleTheme}>
//             <i
//               className={`ri ${
//                 isDarkMode ? "ri-sun-line" : "ri-moon-line"
//               } sun`}
//             ></i>
//             <i
//               className={`ri ${
//                 isDarkMode ? "ri-moon-line" : "ri-sun-line"
//               } moon`}
//             ></i>
//           </div>
//         </div>
//         <div className="sidebar-bottom">
//           <CompanyVersion />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;





import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import CompanyVersion from "../constants/CompanyVersion";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { table_number } = useParams();
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || {}
  );
  const [isDarkMode, setIsDarkMode] = useState(false); // State for theme
  const { restaurantDetails } = useRestaurantId(); // Consume context
  const isLoggedIn = !!localStorage.getItem("userData");

  useEffect(() => {
    if (table_number) {
      const updatedUserData = { ...userData, tableNumber: table_number };
      setUserData(updatedUserData);
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
    }
  }, [table_number]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle the sidebar state
  };

  const getFirstName = (name) => {
    if (!name) return "User"; // Return "User" if name is undefined or null
    const words = name.split(" ");
    return words[0]; // Return the first word
  };

  const toTitleCase = (str) => {
    if (!str) return "";
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode); // Toggle the dark mode state
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
      <header className="header header-fixed pt-2">
        <div className="header-content d-flex justify-content-between">
          <div className="left-content">
            <div className="menu-toggler" onClick={toggleSidebar}>
              {isLoggedIn ? (
                <i className="ri-menu-line fs-1"></i>
              ) : (
                <Link to="/Signinscreen">
                  <i className="ri-login-circle-line fs-1"></i>
                </Link>
              )}
            </div>
          </div>
          <div className="right-content gap-1">
            <h3 className="title fw-medium hotel-name">
              {userData.restaurantName && userData.restaurantName.length > 0
                ? userData.restaurantName.toUpperCase()
                : "Restaurant Name"}
              <i className="ri-store-2-line ps-2"></i>
            </h3>
            <h6 className="title fw-medium h6 custom-text-gray table-number">
              Table: {userData.tableNumber || ""}
            </h6>
          </div>
        </div>
      </header>

      {/* Dark overlay for sidebar */}
      <div
        className={`dark-overlay ${sidebarOpen ? "dark-overlay active" : ""}`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar show" : ""}`}>
        <div className="author-box">
          <div className="d-flex justify-content-start align-items-center m-0">
            <i
            className={
              userData && userData.customer_id
                ? "ri-user-3-fill fs-3"
                : "ri-user-3-line fs-3"
            }
          ></i>
          </div>
          <div className="fs-6">
            <span className="ms-3 pt-4">
              {userData?.name
                ? `Hello, ${toTitleCase(getFirstName(userData.name))}`
                : "Hello, User"}
            </span>
            <div className="mail ms-3 gray-text">{userData?.mobile}</div>
            <div className="dz-mode mt-3 me-4">
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
          </div>
        </div>
        <ul className="nav navbar-nav">
          <li>
            <Link className="nav-link active" to="/Menu">
              <span className="dz-icon icon-sm">
                <i className="ri-bowl-line fs-3"></i>
              </span>
              <span>Menu</span>
            </Link>
          </li>
          <li>
            <Link className="nav-link active" to="/Category">
              <span className="dz-icon icon-sm">
                <i className="ri-list-check-2 fs-3"></i>
              </span>
              <span>Category</span>
            </Link>
          </li>
          <li>
            <Link className="nav-link active" to="/Wishlist">
              <span className="dz-icon icon-sm">
                <i className="ri-heart-2-line fs-3"></i>
              </span>
              <span>Favourite</span>
            </Link>
          </li>
          <li>
            <Link className="nav-link active" to="/MyOrder">
              <span className="dz-icon icon-sm">
                <i className="ri-drinks-2-line fs-3"></i>
              </span>
              <span>My Orders</span>
            </Link>
          </li>
          <li>
            <Link className="nav-link active" to="/Cart">
              <span className="dz-icon icon-sm">
                <i className="ri-shopping-cart-line fs-3"></i>
              </span>
              <span>My Cart</span>
            </Link>
          </li>
          <li>
            <Link className="nav-link active" to="/Profile">
              <span className="dz-icon icon-sm">
                <i
                  className={
                    userData && userData.customer_id
                      ? "ri-user-3-fill fs-3"
                      : "ri-user-3-line fs-3"
                  }
                ></i>
              </span>
              <span>Profile</span>
            </Link>
          </li>
        </ul>
        {/* <div className="dz-mode mt-4 me-4">
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
        </div> */}
        <div className="sidebar-bottom">
          <CompanyVersion />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
