



import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Bottom from "../component/bottom";
import logo from "../assets/logos/mmua_transparent.png";

const Profile = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));

  const handleLogout = () => {
    const { restaurantId, tableNumber, restaurantCode } = JSON.parse(
      localStorage.getItem("userData") || "{}"
    );
    localStorage.removeItem("userData");
    localStorage.removeItem("cartItems");
    localStorage.setItem("RestaurantId", restaurantId);
    localStorage.setItem("TableNumber", tableNumber);
    localStorage.setItem("RestaurantCode", restaurantCode);
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
        <header className="header header-fixed shadow-sm">
          <div className="header-content ">
            <div className="left-content">
              <Link
                to={`/${userData?.restaurantId || ""}/${
                  userData?.tableNumber || ""
                }`}
                className="back-btn fs-3"
                onClick={() => navigate(-1)}
              >
                <i className="ri-arrow-left-line "></i>
              </Link>
            </div>
            <div className="mid-content">
              <span className="custom_font_size_bold me-2 title">Profile</span>
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
                    <div className="custom_font_size_bold">
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
                      className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
                    >
                      <i className="ri-bowl-line me-2 fs-2"></i>
                      <span className="custom_font_size">Menu</span>
                    </Link>
                  </li>
                  <li className="col-6">
                    <Link
                      to="/MyOrder"
                      className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
                    >
                      <i className="ri-drinks-2-line me-2 fs-2"></i>
                      <span className="custom_font_size">My Order</span>
                    </Link>
                  </li>
                  <li className="col-6">
                    <Link
                      to="/Cart"
                      className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
                    >
                      <i className="ri-shopping-cart-line me-2 fs-2"></i>
                      <span className="custom_font_size">Cart</span>
                    </Link>
                  </li>
                  <li className="col-6">
                    <Link
                      to="/Wishlist"
                      className="border border-2 d-flex align-items-center justify-content-center h-100 p-3 text-decoration-none"
                    >
                      <i className="ri-heart-2-line me-2 fs-2"></i>
                      <span className="custom_font_size">Favourite</span>
                    </Link>
                  </li>
                </ul>
              </div>
              {isLoggedIn && (
                <div className="container p-0">
                  <Link to="/EditProfile" className="item-content item-link">
                    <div className="title-bar">
                      <span className=" mb-0 custom_font_size_bold  ">
                        Account Settings
                      </span>
                    </div>
                    <div className="row align-items-center ms-0">
                      <div className="col-auto px-0">
                        {/* <i className={localStorage.getItem("userData") ? "ri-user-3-fill fs-3" : "ri-user-3-line fs-3"}></i> */}
                        <i className="ri-user-3-line fs-3"></i>
                      </div>
                      <div className="col text-start px-1 custom_font_size_bold">
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
          <div className="container">
            <div className="text-center">
              <img
                src={logo}
                alt="logo"
                className="me-2"
                width="30"
                height="30"
              />
              <span className="text-dark mb-0 mt-1 fw-bolder">MenuMitra</span>
            </div>
          </div>
          <div className="gray-text custom_font_size">Powered by </div>
          <div className="gray-text custom_font_size">
            Shekru Labs India Pvt. Ltd.
          </div>
          <div className="gray-text custom_font_size">v1.1</div>
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