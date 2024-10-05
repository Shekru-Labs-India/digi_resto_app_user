// import React from "react";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import applogo from "../assets/logos/Menu Mitra logo 3.png";
// import Bottom from "../component/bottom";
// import HomeScreen from './HomeScreen';
// import CompanyVersion from "../constants/CompanyVersion";

// const Profile = () => {
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("userData"));

// const handleLogout = () => {
//   const { restaurantId, tableNumber } = JSON.parse(localStorage.getItem("userData") || "{}");
//   localStorage.clear();
//   localStorage.setItem("lastRestaurantId", restaurantId);
//   localStorage.setItem("lastTableNumber", tableNumber);
//   navigate("/Signinscreen");
// };


//   const toTitleCase = (str) => {
//     if (!str) {
//       return ""; // Return empty string if str is undefined or null
//     }

//     return str.replace(/\w\S*/g, function (txt) {
//       return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//     });
//   };
//   const getFirstName = (name) => {
//     if (!name) return ""; // Return empty string if name is undefined or null
//     const words = name.split(" ");
//     return words[0]; // Return the first word
//   };

//   if (!userData) {
//     // User is not logged in, render restricted version of profile
//     return (
//       <div className="page-wrapper">
//         {/* <header className="header header-fixed style-3">
//           <div className="header-content">
//             <div className="left-content">
//               <div style={{ display: "flex", alignItems: "center" }}>
//                 <div className="header-logo" style={{ marginRight: "10px" }}>
//                   <img
//                     className="logo logo-dark"
//                     src={applogo}
//                     alt="logo"
//                     style={{ width: "50px", height: "50px" }}
//                   />
//                   <img
//                     className="logo logo-white d-none"
//                     src={applogo}
//                     alt="logo"
//                     style={{ width: "50px", height: "50px" }}
//                   />
//                 </div>
//                 <span style={{ fontSize: "18px", fontWeight: "bold" }}>
//                   MenuMitra
//                 </span>
//               </div>
//             </div>
//           </div>
//         </header> */}

//         {/* Header */}
//         <header className="header header-fixed style-3">
//           <div className="header-content">
//             <div className="left-content">
//               <Link to={`/HomeScreen/${userData?.restaurantId || ''}/${userData?.tableNumber || ''}`} className="back-btn fs-3">
//                 <i className="ri-arrow-left-line fs-3"></i>
//               </Link>
//             </div>
//             <div className="mid-content">
//               <h5 className="title">Profile</h5>
//             </div>
//             <div className="right-content">
//               <Link to="/Signinscreen" className="fs-3">
//                 <i className="ri-shut-down-line"></i>
//               </Link>
//             </div>
//           </div>
//         </header>
//         <main className="page-content space-top p-b40">
//           <div className="container">
//             <div className="profile-area">
//               <div className="main-profile">
//                 <div className="media">
//                   <div className="media-40 me-2 user-image">
//                     <i
//                       className="ri-login-circle-line"
//                       style={{ fontSize: "40px", marginTop: "9px" }}
//                     ></i>
//                   </div>
//                   <h4 className="name mb-0">
//                     <span className="greetings">Hello,User</span>
//                   </h4>
//                 </div>
//               </div>
//               <div className="content-box">
//                 <ul className="row g-2">
//                   <li className="col-6">
//                     <Link
//                       to="/Menu"
//                       className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
//                     >
//                       <i className="ri-bowl-line me-2 fs-5"></i> Menu
//                     </Link>
//                   </li>
//                   <li className="col-6">
//                     <Link
//                       // to="/OrderTracking"
//                       to="/MyOrder"
//                       className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
//                     >
//                       <i className="ri-drinks-2-line me-2 fs-5"></i> My Order
//                     </Link>
//                   </li>
//                   <li className="col-6">
//                     <Link
//                       to="/Cart"
//                       className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
//                     >
//                       <i className="ri-shopping-cart-2-line me-2 fs-5"></i> Cart
//                     </Link>
//                   </li>
//                   <li className="col-6">
//                     <Link
//                       to="/"
//                       className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
//                     >
//                       <i className="ri-heart-2-line me-2 fs-5"></i> Favourite
//                     </Link>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </main>
//         <Bottom />
//       </div>
//     );
//   }

//   // User is logged in, render full profile page
//   return (
//     <div className="page-wrapper">
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           {/* <div className="left-content">
//             <div style={{ display: "flex", alignItems: "center" }}>
//               <div className="header-logo" style={{ marginRight: "10px" }}>
//                 <img
//                   className="logo logo-dark"
//                   src={applogo}
//                   alt="logo"
//                   style={{ width: "50px", height: "50px" }}
//                 />
//                 <img
//                   className="logo logo-white d-none"
//                   src={applogo}
//                   alt="logo"
//                   style={{ width: "50px", height: "50px" }}
//                 />
//               </div>
//               <span style={{ fontSize: "18px", fontWeight: "bold" }}>
//                 MenuMitra
//               </span>
//             </div>
//           </div> */}
//           <div className="left-content">
//             <Link to={`/HomeScreen/${userData?.restaurantId || ''}/${userData?.tableNumber || ''}`} className="back-btn fs-3">
//               <i className="ri-arrow-left-line fs-3"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">Profile</h5>
//           </div>
//           <div className="right-content">
//             <div
//               onClick={handleLogout}
//               className="d-flex align-items-center gap-2 font-10"
//             >
//               <i
//                 className="ri-shut-down-line"
//                 style={{ cursor: "pointer", fontSize: "2.5em" }}
//               ></i>
//             </div>
//           </div>
//         </div>
//       </header>
//       <main className="page-content space-top p-b40">
//         <div className="container">
//           <div className="profile-area">
//             <div className="main-profile">
//               <div className="media">
//                 <div className="media-40 me-2 user-image">
//                   <i
//                     className="ri-user-3-line"
//                     style={{ fontSize: "35px", marginTop: "9px" }}
//                   ></i>
//                 </div>
//                 <h4 className="name mb-0 ">
//                   <div className="greetings fs-3 fw-medium">
//                     Hello, {toTitleCase(getFirstName(userData.name)) || "User"}
//                   </div>
//                 </h4>
//               </div>
//             </div>
//             <div className="content-box">
//               <ul className="row g-2">
//                 <li className="col-6">
//                   <Link
//                     to="/Menu"
//                     className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none fs-5"
//                   >
//                     <i className="ri-bowl-line me-2 fs-2"></i> Menu
//                   </Link>
//                 </li>
//                 <li className="col-6">
//                   <Link
//                     // to="/OrderTracking"
//                     to="/MyOrder"
//                     className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none fs-5"
//                   >
//                     <i className="ri-drinks-2-line me-2 fs-2"></i> My Order
//                   </Link>
//                 </li>
//                 <li className="col-6">
//                   <Link
//                     to="/Cart"
//                     className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none fs-5"
//                   >
//                     <i className="ri-shopping-cart-2-line me-2 fs-2"></i> Cart
//                   </Link>
//                 </li>
//                 <li className="col-6">
//                   <Link
//                     to="/Wishlist"
//                     className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none fs-5"
//                   >
//                     <i className="ri-heart-2-line me-2 fs-2"></i> Favourite
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//             <div className="title-bar">
//               <h4 className="title mb-0 font-w500">Account Settings</h4>
//             </div>

//             {/* <div className="dz-list style-1 m-b20">
//               <ul>
//                 <li>
//                   <Link to="/EditProfile" className="item-content item-link">
//                     <div className="list-icon">
//                       <i className="ri-user-3-line"></i>
//                     </div>
//                     <div className="dz-inner">
//                       <span className="title">Edit Profile</span>
//                       <i class="ri-arrow-right-s-line"></i>
//                     </div>
//                   </Link>
//                 </li>
//               </ul>
//             </div> */}

//             <div class="container">
//               <Link to="/EditProfile" className="item-content item-link">
//                 <div class="row align-items-center">
//                   <div class="col-auto px-0">
//                     <i class="ri-user-3-line fs-3 "></i>
//                   </div>
//                   <div class="col text-start px-1 fs-4">Edit Profile</div>
//                   <div class="col-auto text-end ms-auto">
//                     <i class="ri-arrow-right-s-line fs-4"></i>
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           </div>
//         </div> 
//       </main>
//       <div className=" text-center mt-6" style={{marginTop:'150px'}}>
//     <h6 className="" style={{ color: 'grey' }}>Powered by </h6>
//     <h6 className="" style={{ color: 'grey' }}>Shekru Labs India Pvt. Ltd.</h6>
//     <h6 className="" style={{ color: 'grey' }}>V 1.1</h6>
//   </div>
//       <Bottom />
    
//     </div>
//   );
// };

// export default Profile;



// ************

// import React from "react";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import applogo from "../assets/logos/Menu Mitra logo 3.png";
// import Bottom from "../component/bottom";
// import HomeScreen from "./HomeScreen";
// import CompanyVersion from "../constants/CompanyVersion";

// const Profile = () => {
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("userData"));

//   const handleLogout = () => {
//     const { restaurantId, tableNumber } = JSON.parse(
//       localStorage.getItem("userData") || "{}"
//     );
//     localStorage.removeItem("userData");
//     localStorage.setItem("lastRestaurantId", restaurantId);
//     localStorage.setItem("lastTableNumber", tableNumber);
//     navigate("/Signinscreen");
//   };

//   const toTitleCase = (str) => {
//     if (!str) {
//       return ""; // Return empty string if str is undefined or null
//     }

//     return str.replace(/\w\S*/g, function (txt) {
//       return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//     });
//   };

//   const getFirstName = (name) => {
//     if (!name) return ""; // Return empty string if name is undefined or null
//     const words = name.split(" ");
//     return words[0]; // Return the first word
//   };

//   if (!userData) {
//     // User is not logged in, render restricted version of profile
//     return (
//       <div className="page-wrapper">
//         <header className="header header-fixed style-3">
//           <div className="header-content">
//             <div className="left-content">
//               <Link
//                 to={`/HomeScreen/${userData?.restaurantId || ""}/${
//                   userData?.tableNumber || ""
//                 }`}
//                 className="back-btn fs-3"
//               >
//                 <i className="ri-arrow-left-line fs-3"></i>
//               </Link>
//             </div>
//             <div className="mid-content">
//               <h5 className="title">Profile</h5>
//             </div>
//             <div className="right-content">
//               <Link to="/Signinscreen" className="fs-3">
//                 {/* <i className="ri-shut-down-line"></i> */}
//               </Link>
//             </div>
//           </div>
//         </header>
//         <main className="page-content space-top p-b40">
//           <div className="container">
//             <div className="profile-area">
//               {/* <div className="main-profile">
//                 <div className="media">
//                   <div className="media-40 me-2 user-image">
//                     <i
//                       className="ri-login-circle-line"
//                       style={{ fontSize: "40px", marginTop: "9px" }}
//                     ></i>
//                   </div>
//                   <h4 className="name mb-0">
//                     <span className="">Hello,User</span>
//                   </h4>
//                 </div>
//               </div> */}

//               <div className="main-profile">
//                 <div className="d-flex align-items-center">
//                   <h4 className="name mb-0">
//                     <div className="fw-medium">
//                       <i className="ri-user-3-line me-2 fs-3"></i>
//                       Hello, User
//                     </div>
//                   </h4>
//                 </div>
//               </div>
//               <div className="content-box">
//                 <ul className="row g-2">
//                   <li className="col-6">
//                     <Link
//                       to="/Menu"
//                       className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none fs-5"
//                     >
//                       <i className="ri-bowl-line me-2 fs-2"></i> Menu
//                     </Link>
//                   </li>
//                   <li className="col-6">
//                     <Link
//                       to="/MyOrder"
//                       className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none fs-5"
//                     >
//                       <i className="ri-drinks-2-line me-2 fs-2"></i> My Order
//                     </Link>
//                   </li>
//                   <li className="col-6">
//                     <Link
//                       to="/Cart"
//                       className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none fs-5"
//                     >
//                       <i className="ri-shopping-cart-line me-2 fs-2"></i> Cart
//                     </Link>
//                   </li>
//                   <li className="col-6">
//                     <Link
//                       to="/Wishlist"
//                       className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none fs-5"
//                     >
//                       <i className="ri-heart-2-line me-2 fs-2"></i> Favourite
//                     </Link>
//                   </li>
//                 </ul>
//               </div>
//               {/* <div className="title-bar">
//                 <h4 className="title mb-0 font-w500">Account Settings</h4>
//               </div> */}
//             </div>
//           </div>
//         </main>
//         <div className="text-center mt-6 powered-by">
//           <div className="gray-text fs-6">Powered by </div>
//           <div className="gray-text fs-6">Shekru Labs India Pvt. Ltd.</div>
//           <div className="gray-text fs-sm ">v1.1</div>
//         </div>
//         <Bottom />
//       </div>
//     );
//   }

//   return (
//     <div className="page-wrapper">
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link
//               to={`/HomeScreen/${userData?.restaurantId || ""}/${
//                 userData?.tableNumber || ""
//               }`}
//               className="back-btn fs-3"
//             >
//               <i className="ri-arrow-left-line fs-3"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">Profile</h5>
//           </div>
//           <div className="right-content">
//             <i className="ri-shut-down-line fs-3" onClick={handleLogout}></i>
//           </div>
//         </div>
//       </header>
//       <main className="page-content space-top p-b40">
//         <div className="container">
//           <div className="profile-area">
//             <div className="main-profile">
//               <div className="d-flex align-items-center">
//                 <h4 className="name mb-0">
//                   <div className="fw-medium">
//                     <i className="ri-user-3-line me-2 fs-3"></i>
//                     Hello, {toTitleCase(getFirstName(userData.name)) || "User"}
//                   </div>
//                 </h4>
//               </div>
//             </div>
//             <div className="content-box">
//               <ul className="row g-2">
//                 <li className="col-6">
//                   <Link
//                     to="/Menu"
//                     className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none fs-5"
//                   >
//                     <i className="ri-bowl-line me-2 fs-2"></i> Menu
//                   </Link>
//                 </li>
//                 <li className="col-6">
//                   <Link
//                     to="/MyOrder"
//                     className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none fs-5"
//                   >
//                     <i className="ri-drinks-2-line me-2 fs-2"></i> My Order
//                   </Link>
//                 </li>
//                 <li className="col-6">
//                   <Link
//                     to="/Cart"
//                     className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none fs-5"
//                   >
//                     <i className="ri-shopping-cart-line me-2 fs-2"></i> Cart
//                   </Link>
//                 </li>
//                 <li className="col-6">
//                   <Link
//                     to="/Wishlist"
//                     className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none fs-5"
//                   >
//                     <i className="ri-heart-2-line me-2 fs-3"></i> Favourite
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             {userData && userData.customer_id && (
//               <div className="container p-0">
//                 <Link to="/EditProfile" className="item-content item-link">
//                   <div className="title-bar">
//                     <h4 className="title mb-0 font-w500">Account Settings</h4>
//                   </div>
//                   <div className="row align-items-center ms-0">
//                     <div className="col-auto px-0">
//                       <i className="ri-user-3-line fs-3 "></i>
//                     </div>
//                     <div className="col text-start px-1 fs-4">Edit Profile</div>
//                     <div className="col-auto text-end ms-auto">
//                       <i className="ri-arrow-right-s-line fs-4"></i>
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//       <div className="text-center mt-6 powered-by">
//         <div className="gray-text fs-6">Powered by </div>
//         <div className="gray-text fs-6">Shekru Labs India Pvt. Ltd.</div>
//         <div className="gray-text fs-sm ">v1.1</div>
//       </div>
//       <Bottom />
//     </div>
//   );
// };

// export default Profile;



// santosh



import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Bottom from "../component/bottom";

const Profile = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));

  const handleLogout = () => {
    const { restaurantId, tableNumber } = JSON.parse(
      localStorage.getItem("userData") || "{}"
    );
    localStorage.removeItem("userData");
    localStorage.removeItem("cartItems");
    localStorage.setItem("RestaurantId", restaurantId);
    localStorage.setItem("TableNumber", tableNumber);
    navigate("/Signinscreen");
  };

  const toTitleCase = (str) => {
    if (!str) {
      return "";
    }
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const getFirstName = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    return words[0];
  };

  const renderContent = () => {
    const isLoggedIn = userData && userData.customer_id;

    return (
      <>
        <header className="header header-fixed style-3">
          <div className="header-content">
            <div className="left-content">
              <Link
                to={`/${userData?.restaurantId || ""}/${
                  userData?.tableNumber || ""
                }`}
                className="back-btn fs-3"
                onClick={() => navigate(-1)}
              >
                <i className="ri-arrow-left-line fs-3"></i>
              </Link>
            </div>
            <div className="mid-content">
              <h5 className="title">Profile</h5>
            </div>
            {isLoggedIn && (
              <div className="right-content">
                <i
                  className="ri-shut-down-line fs-3"
                  onClick={handleLogout}
                ></i>
              </div>
            )}
          </div>
        </header>
        <main className="page-content space-top p-b40">
          <div className="container">
            <div className="profile-area">
              <div className="main-profile">
                <div className="d-flex align-items-center">
                  <h4 className="name mb-0">
                    <div className="fw-medium">
                      <i
                        className={
                          isLoggedIn
                            ? "ri-user-3-fill me-2 fs-3"
                            : "ri-user-3-line me-2 fs-3"
                        }
                      ></i>
                      Hello,{" "}
                      {isLoggedIn
                        ? toTitleCase(getFirstName(userData.name))
                        : "User"}
                    </div>
                  </h4>
                </div>
              </div>
              <div className="content-box">
                <ul className="row g-2">
                  <li className="col-6">
                    <Link
                      to="/Menu"
                      className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none fs-5"
                    >
                      <i className="ri-bowl-line me-2 fs-2"></i> Menu
                    </Link>
                  </li>
                  <li className="col-6">
                    <Link
                      to="/MyOrder"
                      className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none fs-5"
                    >
                      <i className="ri-drinks-2-line me-2 fs-2"></i> My Order
                    </Link>
                  </li>
                  <li className="col-6">
                    <Link
                      to="/Cart"
                      className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none fs-5"
                    >
                      <i className="ri-shopping-cart-line me-2 fs-2"></i>Cart
                    </Link>
                  </li>
                  <li className="col-6">
                    <Link
                      to="/Wishlist"
                      className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none fs-5"
                    >
                      <i className="ri-heart-2-line me-2 fs-2"></i> Favourite
                    </Link>
                  </li>
                </ul>
              </div>
              {isLoggedIn && (
                <div className="container p-0">
                  <Link to="/EditProfile" className="item-content item-link">
                    <div className="title-bar">
                      <h4 className="title mb-0 font-w500">Account Settings</h4>
                    </div>
                    <div className="row align-items-center ms-0">
                      <div className="col-auto px-0">
                        {/* <i className={localStorage.getItem("userData") ? "ri-user-3-fill fs-3" : "ri-user-3-line fs-3"}></i> */}
                        <i className="ri-user-3-line fs-3"></i>
                      </div>
                      <div className="col text-start px-1 fs-4">
                        Edit Profile
                      </div>
                      <div className="col-auto text-end ms-auto">
                        <i className="ri-arrow-right-s-line fs-4"></i>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
        <div className="text-center mt-6 powered-by">
          <div className="gray-text fs-6">Powered by </div>
          <div className="gray-text fs-6">Shekru Labs India Pvt. Ltd.</div>
          <div className="gray-text fs-sm ">v1.1</div>
        </div>
      </>
    );
  };

  return (
    <div className="page-wrapper">
      {renderContent()}
      <Bottom />
    </div>
  );
};

export default Profile;