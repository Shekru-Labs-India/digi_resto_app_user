import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import images from "../assets/chiken.jpg";
import SigninButton from "../constants/SigninButton";
import Bottom from "../component/bottom";
import OrderGif from "../screens/OrderGif";
import "../assets/css/custom.css";

const TrackOrder = () => {
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
              order_number: orderNumber,
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
        setLoading(false); // Set loading to false after API call
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
              <i className="ri-arrow-left-line"></i>
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
          <div className="card">
            <div className="card-body py-2">
              <div className="row align-items-center mb-0">
                <div className="col-6">
                  <h5 className="card-title mb-0">444112552222</h5>
                </div>
                <div className="col-6 text-end">
                  <span className="card-text " style={{ color: "#a5a5a5" }}>
                    31-Aug-2023 11:25 AM
                  </span>
                </div>
              </div>
              <div className="row align-items-center mt-2 ">
                <div className="col-4">
                  <p className="mb-0 fs-6" style={{}}>
                    <i className="ri-store-2-line pe-2"></i>
                    Panchmi
                  </p>
                </div>
                <div className="col-3 text-center">
                  <p className="mb-0 text-start fs-6" style={{}}>
                    <i className="ri-bowl-line pe-0"></i> 3 Menu
                  </p>
                </div>
                <div className="col-5 text-end">
                  <span
                    className="current-price fs-3 fw-medium"
                    style={{ color: "#4E74FC" }}
                  >
                    ₹400
                  </span>
                  <span
                    className=" text-decoration-line-through ms-2"
                    style={{ color: "#a5a5a5" }}
                  >
                    ₹500
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container custom-container" style={{ paddingTop: "1px" }}>
        <div className="card-body" style={{ padding: "0px" }}>
          <div className="card" style={{ height: "85px" }}>
            <div className="row py-2 px-2 h-100">
              <div className="col-2 d-flex align-items-center justify-content-center">
                <OrderGif />
              </div>
              <div className="col-10 d-flex align-items-center justify-content-center">
                <div className="text-center mb-0">
                  <div className="fs-6 fs-sm-5 fs-md-4 fw-medium">
                    You have the best taste in food.
                  </div>
                  <div className="fs-6 fs-sm-5 fs-md-4 fw-medium">
                    We're crafting a menu to match it perfectly.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <main className="page-content space-top"> */}
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
            {userData ? (
              <div className="container">
                {/* <section>
                  <h4 className="title">Order Menu</h4>
                  {orderDetails && orderDetails.menu_details && orderDetails.menu_details.map((menu) => (
                    <div key={menu.menu_id} className="dz-card list-style style-3 m-b30">
                      <div className="dz-media">
                        <img
                          style={{ height: "100px", width: "100px" }}
                          src={menu.image || images}
                          alt={menu.name}
                          onError={(e) => {
                            e.target.src = images;
                            e.target.style.width = "80px";
                            e.target.style.height = "80px";
                          }}
                        />
                      </div>
                      <div className="dz-content">
                        <h5 className="title">{toTitleCase(menu.name)}</h5>
                        <ul className="dz-meta">
                          <li className="timeline-date">
                            {menu.quantity} x ₹{menu.price}
                          </li>
                        </ul>
                        <p className="timeline-text">
                          {toTitleCase(menu.spicy_index)} | {toTitleCase(menu.veg_nonveg)}
                        </p>
                      </div>
                    </div>
                  ))}
                </section> */}
                {/* 
                <section>
                  <h4 className="title">Menu Details</h4>
                  {orderDetails && orderDetails.order_details && (
                    <ul className="dz-card list-style style-3 m-b30">
                      <li className="timeline-item active">
                        <div className="dz-content1">
                          <span className="title">
                            {toTitleCase(orderDetails.order_details.restaurant_name)}
                          </span>
                          <br />
                          <span className="timeline-date">
                            ₹{orderDetails.order_details.total_bill}
                          </span>
                          <p className="timeline-text">
                            {toTitleCase(orderDetails.order_details.order_status)}
                          </p>
                        </div>
                      </li>
                    </ul>
                  )}
                </section> */}

                <section>
                  <h4 className="title fs-3">Menu Details</h4>
                  {/* <ul className="dz-card list-style style-3 m-b30">
                    <li className="timeline-item active">
                      <div className="dz-content1">
                        <span className="title">
                          {toTitleCase(orderDetails.order_details.restaurant_name)}
                        </span>
                        <br></br>
                        <span className="timeline-date">
                          ₹{orderDetails.order_details.total_bill}
                        </span>
                        <p className="timeline-text">
                          {toTitleCase(orderDetails.order_details.order_status)}
                        </p>
                      </div>
                    </li>
                  </ul> */}
                </section>

                <div
                  className="swiper-slide search-content1"
                  // key={menu.menu_id}
                  // key={menu.menu_id}
                >
                  {/* Use onClick to fetch menu details and navigate to ProductDetails */}
                  <div
                    className="cart-list style-2 shadow-lg py-0 my-0"
                    style={{
                      padding: "0px",
                      alignItems: "flex-start",
                      height: "100px",
                    }}
                  >
                    {/* <div className="cart-list style-2" style={{padding:"0px"}}> */}
                    {/* <div className="row"> */}
                    <div className="col-2">
                      <div className="dz-media media-100">
                        <Link to={`/ProductDetails/menu_id`}>
                          <img
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "10px",
                            }}
                            src={images} // Use default image if image is null
                            onError={(e) => {
                              e.target.src = images; // Set local image source on error
                              e.target.style.width = "80px"; // Example: Set width of the local image
                              e.target.style.height = "80px"; // Example: Set height of the local image
                            }}
                          />
                        </Link>
                      </div>
                      {/* </div> */}
                    </div>
                    <div className="col-10 mt-2 px-5">
                      <div className="dz-content">
                        <h6 className="title fs-3">Chiken Thali</h6>
                        <div className="row">
                          <ul className="dz-meta">
                            <div className="col-4 mt-0 ">
                              <span style={{ color: "#0d775e" }}>
                                <i class="ri-restaurant-line"></i>
                                <li className="fs-5 fw-medium ps-2">Indian</li>
                              </span>
                            </div>
                            <div className="col-4">
                              <i
                                class="ri-fire-fill"
                                style={{ color: "#eb8e57" }}
                              ></i>
                              <i
                                class="ri-fire-fill"
                                style={{ color: "#eb8e57" }}
                              ></i>
                              <i
                                class="ri-fire-fill"
                                style={{ color: "#eb8e57" }}
                              ></i>
                              <i
                                class="ri-fire-line"
                                style={{ color: "#a5a5a5" }}
                              ></i>
                              <i
                                class="ri-fire-line"
                                style={{ color: "#a5a5a5" }}
                              ></i>
                            </div>
                            <div className="col-4">
                              <span className="d-flex text-end fw-semibold">
                                <i
                                  class="ri-star-half-line px-1"
                                  style={{ color: "#fda200" }}
                                ></i>{" "}
                                4.9
                                <div
                                  className="d-flex align-items-center justify-content-center px-1 fw-lighter"
                                  style={{ fontSize: "12px", color: "#a5a5a5" }}
                                >
                                  (121)
                                </div>
                              </span>
                            </div>
                          </ul>
                          <div
                            className="container mb-0"
                            style={{ paddingTop: "0px" }}
                          >
                            <div className="row pt-1" style={{}}>
                              <div className="col-4">
                                <div class="price-wrapper">
                                  <h6 class="current-price fs-3">₹20</h6>
                                  <span class="old-price">₹22.00</span>
                                </div>
                              </div>
                              <div className="col-4">
                                <span
                                  className="px-5"
                                  style={{ color: "#a5a5a5" }}
                                  // style={{ fontSize: "15px" }}
                                >
                                  x10
                                </span>
                              </div>
                              <div className="col-4">
                                <h6
                                  class="current-price fs-3"
                                  style={{ color: "#4E74FC" }}
                                >
                                  ₹7000
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <ul className="dz-meta">
                            <li className="dz-price">₹700</li>
                          </ul> */}
                        {/* <div className="dz-off">menu veg_nonveg</div> */}
                      </div>
                    </div>
                  </div>
                </div>
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
                          <span className="pe-2 fs-4">₹2000</span>
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
                          <span className="pe-2 fs-4">₹200</span>
                        </div>
                      </div>
                      <div>
                        {/* <hr /> */}
                        <hr className="dashed" />
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center py-1 fw-medium mb-2">
                          <span className="ps-2 fs-4 fw-medium">Total</span>
                          <span className="pe-2 fs-4 fw-medium">₹1,699.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <SigninButton />
            )}
          </>
        )}
      </main>
      <Bottom></Bottom>
    </>
  );
};

export default TrackOrder;
