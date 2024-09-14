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
        {/* <header className="header header-fixed style-3">
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
        </header> */}

        {/* Header */}
        <header className="header header-fixed style-3">
          <div className="header-content">
            <div className="left-content">
              <Link to="/Wishlist" className="back-btn fs-3">
                <i className="ri-arrow-left-line"></i>
              </Link>
            </div>
            <div className="mid-content">
              <h5 className="title">Profile</h5>
            </div>
            <div className="right-content">
              <Link to="/Signinscreen" className="fs-3">
                <i className="ri-shut-down-line"></i>
              </Link>
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
                      style={{ fontSize: "40px", marginTop: "9px" }}
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
                    <Link
                      to="/MyOrder"
                      className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
                    >
                      <i className="ri-checkbox-circle-line me-2 fs-5"></i> Menu
                    </Link>
                  </li>
                  <li className="col-6">
                    <Link
                      to="/OrderTracking"
                      className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
                    >
                      <i className="ri-list-ordered me-2 fs-5"></i> My Order
                    </Link>
                  </li>
                  <li className="col-6">
                    <Link
                      to="/Cart"
                      className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
                    >
                      <i className="ri-shopping-cart-line me-2 fs-5"></i> Cart
                    </Link>
                  </li>
                  <li className="col-6">
                    <Link
                      to="/Wishlist"
                      className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
                    >
                      <i className="ri-heart-line me-2 fs-5"></i> Favourite
                    </Link>
                  </li>
                </ul>
              </div>
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
              className="d-flex align-items-center gap-2 font-10"
            >
              <i
                className="ri-shut-down-line"
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
                  <div className="greetings">
                    Hello, {toTitleCase(getFirstName(userData.name)) || "User"}
                  </div>
                </h4>
              </div>
            </div>
            <div className="content-box">
              <ul className="row g-2">
                <li className="col-6">
                  <Link
                    to="/MyOrder"
                    className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
                  >
                    <i className="ri-checkbox-circle-line me-2 fs-5"></i> Menu
                  </Link>
                </li>
                <li className="col-6">
                  <Link
                    to="/OrderTracking"
                    className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
                  >
                    <i className="ri-list-ordered me-2 fs-5"></i> My Order
                  </Link>
                </li>
                <li className="col-6">
                  <Link
                    to="/Cart"
                    className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
                  >
                    <i className="ri-shopping-cart-line me-2 fs-5"></i> Cart
                  </Link>
                </li>
                <li className="col-6">
                  <Link
                    to="/Wishlist"
                    className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
                  >
                    <i className="ri-heart-line me-2 fs-5"></i> Favourite
                  </Link>
                </li>
              </ul>
            </div>
            <div className="title-bar">
              <h4 className="title mb-0 font-w500">Account Settings</h4>
            </div>

            {/* <div className="dz-list style-1 m-b20">
              <ul>
                <li>
                  <Link to="/EditProfile" className="item-content item-link">
                    <div className="list-icon">
                      <i className="ri-user-3-line"></i>
                    </div>
                    <div className="dz-inner">
                      <span className="title">Edit Profile</span>
                      <i class="ri-arrow-right-s-line"></i>
                    </div>
                  </Link>
                </li>
              </ul>
            </div> */}

            <div class="container">
              <Link to="/EditProfile" className="item-content item-link">
                <div class="row align-items-center">
                  <div class="col-auto px-0">
                    <i class="ri-user-3-line fs-4 "></i>
                  </div>
                  <div class="col text-start px-1 fs-5">Edit Profile</div>
                  <div class="col-auto text-end ms-auto">
                    <i class="ri-arrow-right-s-line"></i>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Bottom />
    </div>
  );
};

export default Profile;
