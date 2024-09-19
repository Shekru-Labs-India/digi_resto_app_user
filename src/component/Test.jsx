import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import images from "../assets/chiken.jpg";
import SigninButton from "../constants/SigninButton";
import Bottom from "../component/bottom";
import OrderGif from "../screens/OrderGif";
import "../assets/css/custom.css";

const Test = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { order_number } = useParams();
  const handleBack = () => {
    navigate(-1);
  };
  const toTitleCase = (str) => {
    if (!str) return ""; // Return empty string if str is null or undefined
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  useEffect(() => {
    const fetchOrderDetails = async (orderNumber) => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://menumitra.com/user_api/get_order_details",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order_number: 894622,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.st === 1 && data.lists) {
            setOrderDetails(data.lists);
          } else {
            console.error("Invalid data format:", data);
          }
        } else {
          console.error("Network response was not ok.");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails(order_number);
  }, [order_number]);

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  const userData = JSON.parse(localStorage.getItem("userData"));

  return (
    <>
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <Link
              to=""
              className="back-btn dz-icon icon-fill icon-sm"
              onClick={handleBack}
            >
              <i className="ri-arrow-left-line fs-3"></i>
            </Link>
          </div>
          <div className="mid-content">
            <h5 className="title">Track Order</h5>
          </div>
          <div className="right-content"></div>
        </div>
      </header>

      <div className="container" style={{ paddingBottom: "1px" }}>
        <div className="page-wrapper " style={{ marginTop: "70px" }}>
          <h4 className="title pb-2 fs-3">Order Menu</h4>
          {orderDetails && (
            <div className="card">
              <div className="card-body py-2">
                <div className="row align-items-center mb-0">
                  <div className="col-6">
                    <h5 className="card-title mb-0">{orderDetails.order_details.order_number}</h5>
                  </div>
                  <div className="col-6 text-end">
                    <span className="card-text " style={{ color: "#a5a5a5" }}>
                      {orderDetails.order_details.datetime}
                    </span>
                  </div>
                </div>
                <div className="row align-items-center mt-2 ">
                  <div className="col-4">
                    <p className="mb-0 fs-6">
                      <i className="ri-store-2-line pe-2"></i>
                      {toTitleCase(orderDetails.order_details.restaurant_name)}
                    </p>
                  </div>
                  <div className="col-3 text-center">
                    <p className="mb-0 text-start fs-6">
                      <i className="ri-bowl-line pe-0"></i> {orderDetails.order_details.menu_count} Menu
                    </p>
                  </div>
                  <div className="col-5 text-end">
                    <span
                      className="current-price fs-3 fw-medium"
                      style={{ color: "#4E74FC" }}
                    >
                      ₹{orderDetails.order_details.grand_total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="container custom-container" style={{ paddingTop: "1px" }}>
        <div className="card-body" style={{ padding: "0px" }}>
          <div className="card" style={{ height: "85px" }}>
            <div className="row py-2 px-2 h-100">
              <div className="col-2 h-100 p-0 ps-2">
                <OrderGif style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="col-10 d-flex align-items-center justify-content-center">
                <p className="text-center mb-0">
                  <span className="d-block d-sm-inline fs-6 fs-sm-5 fs-md-4 fw-medium">You have the best taste in food.</span>
                  <span className="d-none d-sm-inline"> </span>
                  <span className="d-block d-sm-inline fs-6 fs-sm-5 fs-md-4 fw-medium">We're crafting a menu to match it perfectly.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="page-content">
        {loading ? (
          <div id="preloader">
            <div className="loader">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {orderDetails && (
              <div className="container">
                <section>
                  <h4 className="title fs-3">Menu Details</h4>
                  {orderDetails.menu_details.map((menu, index) => (
                    <div key={index} className="card mb-3">
                      <div className="row g-0 align-items-center">
                        <div className="col-3">
                          <div className="dz-media media-100">
                            <img
                              src={menu.image}
                              alt={menu.menu_name}
                              style={{
                                width: "100%",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "10px",
                              }}
                              onError={(e) => {
                                e.target.src = images;
                                e.target.style.width = "80px";
                                e.target.style.height = "80px";
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-9">
                          <div className="card-body py-2">
                            <h6 className="title fs-3 mb-1">{toTitleCase(menu.menu_name)}</h6>
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span style={{ color: "#0d775e" }}>
                                <i className="ri-restaurant-line"></i>
                                <span className="fs-5 fw-medium ps-2">{toTitleCase(menu.category_name)}</span>
                              </span>
                              <div>
                                {[...Array(5)].map((_, i) => {
                                  const spicyIndex = parseInt(menu.spicy_index);
                                  let iconClass = 'ri-fire-line';
                                  let iconColor = '#a5a5a5';

                                  if (i < spicyIndex) {
                                    iconClass = 'ri-fire-fill';
                                    iconColor = '#eb8e57';
                                  } else if (i === spicyIndex && spicyIndex % 1 !== 0) {
                                    iconClass = 'ri-fire-fill';
                                    iconColor = '#eb8e57';
                                    return (
                                      <i
                                        key={i}
                                        className={iconClass}
                                        style={{
                                          background: `linear-gradient(to right, ${iconColor} 50%, #a5a5a5 50%)`,
                                          WebkitBackgroundClip: 'text',
                                          WebkitTextFillColor: 'transparent'
                                        }}
                                      ></i>
                                    );
                                  }

                                  return (
                                    <i
                                      key={i}
                                      className={iconClass}
                                      style={{ color: iconColor }}
                                    ></i>
                                  );
                                })}
                              </div>
                              <span className="d-flex fw-semibold">
                                <i className="ri-star-half-line px-1" style={{ color: "#fda200" }}></i>
                                {(parseFloat(menu.rating) / 20).toFixed(1)}
                                <span className="fw-lighter" style={{ fontSize: "12px", color: "#a5a5a5" }}>
                                  ({menu.rating})
                                </span>
                              </span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="price-wrapper">
                                <span className="current-price fs-3">₹{menu.price}</span>
                                <span className="old-price text-decoration-line-through ms-2" style={{ color: "#a5a5a5" }}>
                                  ₹{menu.original_price || menu.price}
                                </span>
                              </div>
                              <span style={{ color: "#a5a5a5" }}>x{menu.quantity}</span>
                              <span className="current-price fs-3" style={{ color: "#4E74FC" }}>₹{menu.net_price}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
                <div className="card-body mt-2" style={{ padding: "0px" }}>
                  <div className="card">
                    <div className="row px-1">
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center py-1">
                          <span
                            className="ps-2 fs-4"
                            style={{ color: "#a5a5a5" }}
                          >
                            Subtotal
                          </span>
                          <span className="pe-2 fs-4">₹{orderDetails.order_details.sub_total}</span>
                        </div>
                      </div>
                      <div className="col-12 mb-2">
                        <div className="d-flex justify-content-between align-items-center py-1">
                          <span
                            className="ps-2 fs-4"
                            style={{ color: "#a5a5a5" }}
                          >
                            Tax
                          </span>
                          <span className="pe-2 fs-4">{orderDetails.order_details.tax}</span>
                        </div>
                      </div>
                      <div>
                        <hr className="dashed" />
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center py-1 fw-medium mb-2">
                          <span className="ps-2 fs-4 fw-medium">Total</span>
                          <span className="pe-2 fs-4 fw-medium">₹{orderDetails.order_details.grand_total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Bottom></Bottom>
    </>
  );
};

export default Test;
