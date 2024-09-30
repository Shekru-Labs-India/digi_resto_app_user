import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import images from "../assets/chiken.jpg";
import SigninButton from "../constants/SigninButton";
import Bottom from "../component/bottom";
import OrderGif from "../screens/OrderGif"; // Ensure this import path is correct
import "../assets/css/custom.css";
import { useRestaurantId } from "../context/RestaurantIdContext"; // Correct import

const TrackOrder = () => {
  // Define displayCartItems
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false); // State to track if order is completed
  const navigate = useNavigate();
  const { order_number } = useParams();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const { restaurantId } = useRestaurantId(); // Assuming this context provides restaurant ID
  const customerId = userData ? userData.customer_id : null;
  const displayCartItems = orderDetails ? orderDetails.menu_details : [];
  const [cartDetails, setCartDetails] = useState(null);
  const handleBack = () => {
    navigate(-1);
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
        setLoading(false);
      }
    };

    const fetchOrderStatus = async () => {
      try {
        const response = await fetch(
          "https://menumitra.com/user_api/get_order_list",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              restaurant_id: restaurantId,
              order_status: "completed",
              customer_id: customerId,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (
            data.st === 1 &&
            data.lists.some((order) => order.order_number === order_number)
          ) {
            setIsCompleted(true);
          }
        } else {
          console.error("Network response was not ok.");
        }
      } catch (error) {
        console.error("Error fetching order status:", error);
      }
    };

    if (order_number && restaurantId && customerId) {
      fetchOrderDetails(order_number);
      fetchOrderStatus(); // Check if the order is completed
    }
  }, [order_number, restaurantId, customerId]);

  if (loading || !orderDetails) {
    return (
      <div id="preloader">
        <div className="loader">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const { order_details, menu_details } = orderDetails;

  const renderSpicyIndex = (spicyIndex) => {
    const totalFires = 5;
    return (
      <div className="spicy-index ms-3">
        {Array.from({ length: totalFires }).map((_, index) => (
          <i
            key={index}
            className={`ri-fire-${
              index < spicyIndex ? "fill fs-6" : "line fs-6"
            }`}
            style={{
              color: index < spicyIndex ? "#eb8e57" : "#bbbaba",
            }}
          ></i>
        ))}
      </div>
    );
  };

  return (
    <>
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <Link
              to=""
              className="back-btn dz-icon  icon-sm"
              onClick={handleBack}
            >
              <i className="ri-arrow-left-line fs-2"></i>
            </Link>
          </div>
          <div className="mid-content">
            <h5 className="title">Order Details</h5>
          </div>
        </div>
      </header>

      <div className="container" style={{ paddingBottom: "1px" }}>
        <div className="page-wrapper " style={{ marginTop: "70px" }}>
          <h4 className="title pb-2 fs-3">
            {isCompleted ? (
              <div className="title pb-2 fs-3">Completed Order</div>
            ) : (
              <div className="title pb-2 fs-3">Ongoing Order</div>
            )}
          </h4>
          <div
            className="container custom-container"
            style={{ paddingTop: "1px" }}
          ></div>
          <div className="card">
            <div className="card-body py-2">
              <div className="row align-items-center mb-0">
                <div className="col-6">
                  <h5 className="card-title mb-0">
                    {order_details.order_number}
                  </h5>
                </div>
                <div className="col-6 text-end">
                  <span className="card-text " style={{ color: "#a5a5a5" }}>
                    {order_details.datetime}
                  </span>
                </div>
              </div>
              <div className="row mt-2 align-items-center">
                <div className="col-5 text-start pe-0">
                  <p className="mb-0 fs-6 text-break">
                    <i className="ri-store-2-line pe-2"></i>
                    {order_details.restaurant_name}

                    <span className="ps-3 mb-0 fs-6 text-break">
                      <i class="ri-user-location-line pe-2"></i>
                      {order_details.table_number}
                    </span>
                  </p>
                </div>
                <div className="col-3 pe-0 ps-2">
                  <p className="mb-0 fs-6  gray-text">
                    <i className="ri-bowl-line pe-0"></i>
                    {order_details.menu_count} Menu
                  </p>
                </div>
                <div className="col-4 text-end ps-0">
                  <span
                    className="text-info fs-6 fw-medium"
                    style={{ color: "#4E74FC" }}
                  >
                    ₹{order_details.grand_total}
                  </span>
                  <span
                    className="text-decoration-line-through ms-2"
                    style={{ color: "#a5a5a5", fontSize: "0.8em" }}
                  >
                    ₹
                    {(
                      (order_details.grand_total || 0) +
                      (order_details.discount || 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional rendering of the green card or OrderGif based on order status */}
      <div className="container custom-container" style={{ paddingTop: "1px" }}>
        {isCompleted ? (
          <div
            className="card-body text-center"
            style={{
              backgroundColor: "#cce3d1",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <span
              className="fs-6 fw-medium h-100 rounded-corner"
              style={{ color: "#2f855a" }}
            >
              Your delicious order has been served
            </span>
          </div>
        ) : (
          <div className="card-body p-0">
            <div className="card">
              <div className="row py-2 px-2 h-100">
                <div className="col-3 d-flex align-items-center justify-content-center">
                  <OrderGif />
                </div>
                <div className="col-9 d-flex align-items-center justify-content-center px-0">
                  <div className="text-center mb-0">
                    <div className=" fw-medium" style={{ fontSize: "14px" }}>
                      You have the best taste in food.
                    </div>

                    <div className=" fw-medium" style={{ fontSize: "14px" }}>
                      We're crafting a menu to match it perfectly.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <main className="page-content ">
        {userData ? (
          <section className="container mt-1">
            <h4 className="title pb-2 fs-3">Menu Details</h4>
            <div className="row g-3">
              {menu_details.map((menu) => {
                const oldPrice = (menu.price / (1 - menu.offer / 100)).toFixed(
                  2
                );
                return (
                  <div key={menu.menu_id} className="col-12">
                    <div className="dz-card list-style style-3 horizontal-card">
                      <div className="dz-media">
                        <img
                          className="rounded"
                          src={menu.image || images}
                          alt={menu.menu_name}
                          onError={(e) => {
                            e.target.src = images;
                          }}
                          style={{
                            width: "108px",
                            height: "108px",
                          }}
                        />
                      </div>
                      <div className="dz-content">
                        <h5 className=" mt-2 mb-0">{menu.menu_name}</h5>
                        <div className="row">
                          <div className="col-4">
                            <i className="ri-restaurant-line pe-1 text-success"></i>
                            <span className="category-text text-success fs-6">
                              {menu.category_name}
                            </span>
                          </div>
                          <div className="col-4 text-center">
                            {renderSpicyIndex(menu.spicy_index)}
                          </div>
                          <div className="col-4 text-end pe-5">
                            <span className="rating ms-3">
                              <i className="ri-star-half-line ratingStar"></i>
                              {menu.rating}
                            </span>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="container py-0">
                            <div className="row">
                              <div className="col-4 ps-0">
                                <p className="mb-2 fs-4 fw-medium">
                                  <span className="me-2 text-info">
                                    ₹{menu.price}
                                  </span>
                                  <span className="gray-text fs-6 text-decoration-line-through">
                                    ₹{oldPrice}
                                  </span>
                                </p>
                              </div>
                              <div className="col-5  text-center">
                                <span className="fs-6 ps-2 text-primary">
                                  {menu.offer || "No "}% Off
                                </span>
                              </div>
                              <div className="col-3 text-end pe-5">
                                <span className="quantity gray-text">
                                  x {menu.quantity}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <SigninButton />
        )}
      </main>
      {userData && orderDetails && (
        <div
          className="container  mb-5 pb-5 z-3"
          style={{ backgroundColor: "transparent" }}
        >
          <div className="card-body mt-2 p-0 mb-5">
            <div className="card">
              <div className="row px-1">
                <div className="col-12 mt-2">
                  <div className="d-flex justify-content-between align-items-center py-1">
                    {/* <span className="ps-2 fs-6 w-medium h5">Total</span> */}
                    <h5 className="ps-2">Total</h5>
                    <h5 className="pe-2">
                      {" "}
                      ₹{orderDetails.order_details.total_total || 0}
                    </h5>
                    {/* <span className="pe-2 fs-6 h5">
                      ₹{orderDetails.order_details.total_total || 0}
                    </span> */}
                  </div>
                  <hr className="mt-0" />
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center py-1">
                    <span className="ps-2 fs-6 gray-text">
                      Service Charges (
                      {orderDetails.order_details.service_charges_percent}%)
                    </span>
                    <span className="pe-2 fs-6 h5">
                      ₹{orderDetails.order_details.service_charges_amount || 0}
                    </span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 mb-2">
                  <div className="d-flex justify-content-between align-items-center py-1">
                    <span className="ps-2 fs-6 gray-text">
                      GST ({orderDetails.order_details.gst_percent}%)
                    </span>
                    <span className="pe-2 fs-6 h5">
                      ₹{orderDetails.order_details.gst_amount || 0}
                    </span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 mb-1">
                  <div className="d-flex justify-content-between align-items-center py-1">
                    <span className="ps-2 fs-6 gray-text">
                      Discount (
                      {orderDetails.order_details.discount_percent || 0}%)
                    </span>
                    <span className="pe-2 fs-6 h5">
                      ₹{orderDetails.order_details.discount_amount || 0}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <hr className="" />
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center fw-medium mb-2">
                    {/* <span className="ps-2 fs-6 fw-medium h5">Grand Total</span> */}
                    <h5 className="ps-2">Grand Total</h5>
                    <h5 className="pe-2">
                      {" "}
                      ₹{orderDetails.order_details.grand_total || 0}
                    </h5>
                    {/* <span className="pe-2 fs-6 h5">
                      ₹{orderDetails.order_details.grand_total || 0}
                    </span> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Bottom></Bottom>
    </>
  );
};

export default TrackOrder;
