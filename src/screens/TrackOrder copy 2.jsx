import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import SigninButton from "../constants/SigninButton";
import Bottom from "../component/bottom";

const TrackOrder = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { order_number } = useParams();
  const handleBack = () => {
    navigate(-1);
  };
  const toTitleCase = (str) => {
    if (!str) return ''; // Return empty string if str is null or undefined
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
      }finally {
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
    <div className="page-wrapper">
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

      <main className="page-content space-top">
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
                <section>
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
                </section>

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
                </section>

                <section>
                  <h4 className="title">Menu Details</h4>
                  <ul className="dz-card list-style style-3 m-b30">
                    <li className="timeline-item active">
                      <div className="dz-content1">
                        <span className="title">
                          {/* {toTitleCase(orderDetails.order_details.restaurant_name)} */}
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
                  </ul>
                </section>

                <div
                  className="swiper-slide search-content1"
                  // key={menu.menu_id}
                  // key={menu.menu_id}
                >
                  {/* Use onClick to fetch menu details and navigate to ProductDetails */}
                  <div className="cart-list style-2">
                  {/* <div className="cart-list style-2" style={{padding:"0px"}}> */}
                    <div className="row">
                      <div className="col-4">
                        <div className="dz-media media-75">
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
                      </div>
                      <div className="col-8">
                        <div className="dz-content">
                          <h6 className="title">Chiken Thali</h6>
                          <ul className="dz-meta">
                            <i class="ri-restaurant-line"></i>
                            <li className="dz-price">Indian</li>
                            <i class="ri-fire-fill"></i>
                            <i class="ri-fire-fill"></i>
                            <i class="ri-fire-fill"></i>
                            <i class="ri-fire-line"></i>
                            <i class="ri-fire-line"></i>
                            <span className="d-flex">
                              <i class="ri-star-half-line "></i> 4.9
                              <div className="fs-6">

                               (121)
                              </div>
                            </span>
                          </ul>
                          <div class="price-wrapper">
                            <h6 class="current-price fs-3">₹20</h6>
                            <span class="old-price">₹22.00</span>
                            <span className="px-5">x10</span>
                            <h6 class="current-price fs-3">₹7000</h6>
                          </div>
                          {/* <ul className="dz-meta">
                            <li className="dz-price">₹700</li>
                          </ul> */}
                          {/* <div className="dz-off">menu veg_nonveg</div> */}
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
    </div>
  );
};

export default TrackOrder;
