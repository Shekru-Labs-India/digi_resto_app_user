import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import applogo from "../assets/logos/Menu Mitra logo 3.png";
import Bottom from "../component/bottom";

const Profile = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));

  const handleLogout = () => {
    // Clear user information from local storage
    localStorage.removeItem("userData");

    // Redirect to the signin screen
    navigate("/Signinscreen");
  };

  // const toTitleCase = (str) => {
  //   return str.replace(/\w\S*/g, function (txt) {
  //     return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  //   });
  // };
  const toTitleCase = (str) => {
    if (!str) {
      return ""; // Return empty string if str is undefined or null
    }
  
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };
  const getFirstName = (name) => {
    if (!name) return ""; // Return empty string if name is undefined or null
    const words = name.split(" ");
    return words[0]; // Return the first word
  };
  
  if (!userData) {
    // User is not logged in, render restricted version of profile
    return (
      <div className="page-wrapper">
        <header className="header header-fixed style-3">
          <div className="header-content">
            <div className="left-content">
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="header-logo" style={{ marginRight: "10px" }}>
                  <img
                    className="logo logo-dark"
                    src={applogo}
                    alt="logo"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <img
                    className="logo logo-white d-none"
                    src={applogo}
                    alt="logo"
                    style={{ width: "50px", height: "50px" }}
                  />
                </div>
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                  MenuMitra
                </span>
              </div>
            </div>
          </div>
        </header>
        <main className="page-content space-top p-b40">
          <div className="container">
            <div className="profile-area">
              <div className="main-profile">
                <div className="media">
                  <div className="media-40 me-2 user-image">
                    <i
                      className="bx bx-user-circle bx-md"
                      style={{ fontSize: "20px", marginTop: "9px" }}
                    ></i>
                  </div>
                  <h4 className="name mb-0">
                    <span className="greetings">Hello,User</span>
                  </h4>
                </div>
              </div>
              <div className="content-box">
                <ul className="row g-2">
                  <li className="col-6">
                    <Link to="/MyOrder">
                      <i className="ri-list-check-3" style={{paddingRight:"5px"}}></i> My Orders
                    </Link>
                  </li>
                  <li className="col-6">
                    <Link to="/Wishlist">
                      <i className="ri-heart-line" style={{paddingRight:"5px"}}></i> Favourite
                    </Link>
                  </li>
                  <li className="col-6">
                    <Link to="/Cart">
                      <i className="ri-shopping-cart-2-line " style={{paddingRight:"5px"}}></i> Cart
                    </Link>
                  </li>
                  <li className="col-6">
                    <Link to="/OrderTracking">
                      <i className="ri-truck-line" style={{paddingRight:"5px"}}></i> Track order
                      {/* <i className="bx bxs-truck iconboxi"></i> Track order */}
                    </Link>
                  </li>
                </ul>
              </div>
{/* 
              <div className="title-bar">
                <h4 className="title mb-0 font-w500">My Activity</h4>
              </div>
              <div className="dz-list style-1">
                <ul>
                  <li>
                    <a href="faq.html" className="item-content item-link">
                      <div className="list-icon">
                        <i className="bx bx-chat bx-sm"></i>
                      </div>
                      <div className="dz-inner">
                        <span className="title">Questions & Answers</span>
                      </div>
                    </a>
                  </li>
                </ul>
              </div> */}
            </div>
          </div>
        </main>
        <Bottom />
      </div>
    );
  }

  // User is logged in, render full profile page
  return (
    <div className="page-wrapper">
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="header-logo" style={{ marginRight: "10px" }}>
                <img
                  className="logo logo-dark"
                  src={applogo}
                  alt="logo"
                  style={{ width: "50px", height: "50px" }}
                />
                <img
                  className="logo logo-white d-none"
                  src={applogo}
                  alt="logo"
                  style={{ width: "50px", height: "50px" }}
                />
              </div>
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                MenuMitra
              </span>
            </div>
          </div>
          <div className="mid-content"></div>
          <div className="right-content">
            <div
              onClick={handleLogout}
              className="d-flex align-items-center gap-2 font-10 text-danger"
            >
              <i
                className="ri-logout-box-r-line"
                // className="bx bx-log-out bx-rotate-180 bx-md"
                style={{ cursor: "pointer", fontSize: "2.5em" }}
              ></i>
            </div>
          </div>
        </div>
      </header>
      <main className="page-content space-top p-b40">
        <div className="container">
          <div className="profile-area">
            <div className="main-profile">
              <div className="media">
                <div className="media-40 me-2 user-image">
                  <i
                    className="ri-account-circle-line"
                    style={{ fontSize: "35px", marginTop: "9px" }}
                  ></i>
                </div>
                <h4 className="name mb-0">
                  {/* <span className="greetings">Hello, {toTitleCase(userData.name) || 'User'}</span> */}
                  <div className="greetings">
                    Hello, {toTitleCase(getFirstName(userData.name)) || "User"}
                  </div>
                </h4>
              </div>
            </div>
            <div className="content-box">
              <ul className="row g-2">
                <li className="col-6">
                  <Link to="/MyOrder">
                    <i
                      className="ri-list-check-3"
                      style={{ paddingRight: "5px" }}
                    ></i>{" "}
                    My Orders
                  </Link>
                </li>
                <li className="col-6">
                  <Link to="/Wishlist">
                    <i
                      className="ri-heart-line"
                      style={{ paddingRight: "5px" }}
                    ></i>{" "}
                    Favourite
                  </Link>
                </li>
                <li className="col-6">
                  <Link to="/Cart">
                    <i
                      className="ri-shopping-cart-2-line "
                      style={{ paddingRight: "5px" }}
                    ></i>{" "}
                    Cart
                  </Link>
                </li>
                <li className="col-6">
                  <Link to="/OrderTracking">
                    <i
                      className="ri-truck-line"
                      style={{ paddingRight: "5px" }}
                    ></i>{" "}
                    Track order
                  </Link>
                </li>
              </ul>
            </div>
            <div className="title-bar">
              <h4 className="title mb-0 font-w500">Account Settings</h4>
            </div>
            <div className="dz-list style-1 m-b20">
              <ul>
                <li>
                  <Link to="/EditProfile" className="item-content item-link">
                    <div className="list-icon">
                      <i className="ri-account-circle-line"></i>
                    </div>
                    <div className="dz-inner">
                      <span className="title">Edit Profile</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <a href="" class="item-content item-link">
                    <div class="list-icon">
                      {/* <i class="fi fi-rr-bell"></i> */}
                      <i class="ri-notification-3-line"></i>
                    </div>
                    <div class="dz-inner me-2">
                      <span class="title">Notifications Settings</span>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
            {/* <div className="title-bar">
              <h4 className="title mb-0 font-w500">My Activity</h4>
            </div>
            <div className="dz-list style-1">
              <ul>
                <li>
                  <Link to="/Faq" className="item-content item-link">
                    <div className="list-icon">
                      <i className="bx bx-chat bx-sm"></i>
                    </div>
                    <div className="dz-inner">
                      <span className="title">FAQ's</span>
                    </div>
                  </Link>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </main>
      <Bottom />
    </div>
  );
};

export default Profile;

