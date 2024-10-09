import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import images from "../assets/chiken.jpg";
import SigninButton from "../constants/SigninButton";
import Bottom from "../component/bottom";
import OrderGif from "../screens/OrderGif"; // Ensure this import path is correct
import "../assets/css/custom.css";
import { useRestaurantId } from "../context/RestaurantIdContext"; // Correct import
import { ThemeProvider } from '../context/ThemeContext.js';

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

  // const formatDateTime = (dateTime) => {
  //   const [date, time] = dateTime.split(" ");
  //   const [hours, minutes] = time.split(":");

  //   // Convert hours to 12-hour format
  //   let hours12 = parseInt(hours, 10);
  //   const period = hours12 >= 12 ? "PM" : "AM";
  //   hours12 = hours12 % 12 || 12;  // Convert 0 to 12 for midnight

  //   // Pad single-digit hours and minutes with leading zeros
  //   const formattedHours = hours12.toString().padStart(2, '0');
  //   const formattedMinutes = minutes.padStart(2, '0');

  //   return `${formattedHours}:${formattedMinutes} ${period} ${date}`;
  // };

  // Use above code after correcting the date format in the backend

  const formatDateTime = (dateTime) => {
    const [date, time] = dateTime.split(" ");
    const [day, month, year] = date.split("-");
    const [hours, minutes] = time.split(":");

    // Convert hours to 12-hour format
    let hours12 = parseInt(hours, 10);
    const period = hours12 >= 12 ? "PM" : "AM";
    hours12 = hours12 % 12 || 12; // Convert 0 to 12 for midnight

    // Pad single-digit hours and minutes with leading zeros
    const formattedHours = hours12.toString().padStart(2, "0");
    const formattedMinutes = minutes.padStart(2, "0");

    // Array of month abbreviations
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    const currentMonth = new Date().getMonth(); // 0-11
    const monthIndex = month ? parseInt(month, 10) - 1 : currentMonth;
    // Get month abbreviation
    const monthAbbr = monthNames[monthIndex] || monthNames[currentMonth];

    return `${formattedHours}:${formattedMinutes} ${period} ${day}-${monthAbbr}-${year}`;
  };

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
      <div className="spicy-index ">
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
            <span className="title customFontSizeBold me-3">Order Details</span>
          </div>
        </div>
      </header>

      <div className="container" style={{ paddingBottom: "1px" }}>
        <div className="page-wrapper " style={{ marginTop: "70px" }}>
          <span className="title pb-2 customFontSizeBold">
            {isCompleted ? (
              <div className="title pb-2 customFontSizeBold ">
                Completed Order
              </div>
            ) : (
              <div className="title pb-2 customFontSizeBold ">
                Ongoing Order
              </div>
            )}
          </span>
          <div
            className="container custom-container"
            style={{ paddingTop: "1px" }}
          ></div>
          <div className="card">
            <div className="card-body p-2">
              <div className="row align-items-center mb-0">
                <div className="col-5">
                  <h5 className="card-title mb-0 customFontSizeBold">
                    {order_details.order_number}
                  </h5>
                </div>
                <div className="col-7 text-end">
                  <span className="card-text gray-text customFontSizeBold">
                    {formatDateTime(order_details.datetime)}
                  </span>
                </div>
              </div>
              <div className="order-details-row">
                <div className="restaurant-info me-0">
                  <i className="ri-store-2-line pe-2 customFontSizeBold "></i>
                  <span className="restaurant-name customFontSizeBold">
                    {order_details.restaurant_name.toUpperCase()}
                  </span>
                  <i className="ri-user-location-line ps-0 pe-1 customFontSizeBold "></i>
                  <span className="table-number customFontSizeBold">
                    {order_details.table_number}
                  </span>
                </div>
                <div className="menu-info">
                  <i className="ri-bowl-line pe-2 customFontSizeBold gray-text"></i>
                  <span className="customFontSizeBold gray-text">
                    {order_details.menu_count} Menu
                  </span>
                </div>
                <div className="price-info">
                  <span className="text-info customFontSizeBold fw-medium">
                    ₹{order_details.grand_total}
                  </span>
                  <span className="text-decoration-line-through ms-2 gray-text customFontSizeBold">
                    ₹
                    {(
                      order_details.grand_total /
                        (1 - order_details.discount_percent / 100) ||
                      order_details.grand_total
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ThemeProvider>
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
              <div className="row py-2 ps-2 pe-0 h-100">
                <div className="col-3 d-flex align-items-center justify-content-center pe-2">
                  <OrderGif />
                </div>
                <div className="col-8 d-flex align-items-center justify-content-center px-0">
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

      </ThemeProvider>

      <main className="page-content ">
        {userData ? (
          <section className="container mt-1">
            <span className="title pb-2 customFontSizeBold pb-3">
              Menu Details
            </span>
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
                        <h6 className=" mt-0 customFontSizeBold fw-medium mb-0">
                          {menu.menu_name}
                        </h6>
                        <div className="row">
                          <div className="col-5 pe-0">
                            <i className="ri-restaurant-line pe-1 category-text fs-xs fw-medium"></i>
                            <span className="category-text fs-xs fw-medium">
                              {menu.category_name}
                            </span>
                          </div>
                          <div className="col-4 text-start ms-0 px-0 ">
                            {renderSpicyIndex(menu.spicy_index)}
                          </div>
                          <div className="col-2 text-end  px-0">
                            <span className="rating gray-text fw-semibold ms-0">
                              <i className="ri-star-half-line ratingStar me-1"></i>
                              {menu.rating}
                            </span>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="container py-0">
                            <div className="row">
                              <div className="col-6 px-0 ">
                                <p className=" customFontSizeBold  fw-medium mb-0">
                                  <span className="me-1 text-info">
                                    ₹{menu.price}
                                  </span>
                                  <span className="gray-text  text-decoration-line-through">
                                    ₹{oldPrice}
                                  </span>
                                </p>
                              </div>
                              <div className="col-4  px-0 pt-1 ">
                                <span className="customFontSizeBold ps-2 offer-color ">
                                  {menu.offer || "No "}% Off
                                </span>
                              </div>
                              <div className="col-2 ps-0 pt-1 text-end">
                                <span className="quantity gray-text customFontSizeBold">
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
                  <div className="d-flex justify-content-between align-items-center pb-1 pt-0">
                    {/* <span className="ps-2 fs-6 w-medium h5">Total</span> */}
                    <span className="ps-2 customFontSizeBold fs-3 fw-medium">
                      Total
                    </span>
                    <span className="pe-2 fs-3 fw-medium customFontSizeBold">
                      {" "}
                      ₹{orderDetails.order_details.total_total || 0}
                    </span>
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
                    <span className="ps-2 customFontSizeBold gray-text">
                      Service Charges (
                      {orderDetails.order_details.service_charges_percent}%)
                    </span>
                    <span className="pe-2 customFontSizeBold">
                      ₹{orderDetails.order_details.service_charges_amount || 0}
                    </span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 ">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="ps-2 customFontSizeBold gray-text">
                      GST ({orderDetails.order_details.gst_percent}%)
                    </span>
                    <span className="pe-2 customFontSizeBold h5">
                      ₹{orderDetails.order_details.gst_amount || 0}
                    </span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 mb-1 mt-1">
                  <div className="d-flex justify-content-between align-items-center ">
                    <span className="ps-2 customFontSizeBold gray-text">
                      Discount (
                      {orderDetails.order_details.discount_percent || 0}%)
                    </span>
                    <span className="pe-2 customFontSizeBold h5">
                      ₹{orderDetails.order_details.discount_amount || 0}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <hr className="my-2" />
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center fw-medium mb-1">
                    {/* <span className="ps-2 fs-6 fw-medium h5">Grand Total</span> */}
                    <h5 className="ps-2 customFontSizeBold fw-medium">
                      Grand Total
                    </h5>
                    <h5 className="pe-2 customFontSizeBold fw-medium">
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
