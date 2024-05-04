// import React from 'react';
// import { Link } from 'react-router-dom';
// import product from '../assets/images/product/product4/1.png'

// const TrackOrder = () => {
//     return (
//         <div className="page-wrapper">
//             {/* Header */}
//             <header className="header header-fixed style-3">
//                 <div className="header-content">
//                     <div className="left-content">
//                     <Link to="/MyOrder" className="back-btn dz-icon icon-fill icon-sm">
//                         <i className='bx bx-arrow-back' ></i>
//                         </Link>
//                     </div>
//                     <div className="mid-content"><h5 className="title">Track Order</h5></div>
//                     <div className="right-content"></div>
//                 </div>
//             </header>
//             {/* Header End */}

//             {/* Main Content Start */}
//             <main className="page-content space-top">
//                 <div className="container">
//<h4 className="title">Order menu</h4>
//                     <div className="dz-card list-style style-3 m-b30">
//                         <div className="dz-media">
//                             <a href="product-detail.html">
//                                 <img src={product} alt="" />
//                             </a>
//                         </div>
//                         <div className="dz-content">
//                             <h5 className="title"><a href="product-detail.html">Royal Bluebell Bliss (M)</a></h5>
//                             <ul className="dz-meta">
//                                 <li className="dz-price">$80<del>$95</del></li>

//                             </ul>
//                             <span className="dz-off">Category Name</span>
//                         </div>

//                     </div>

//                     <div className="dz-card list-style style-3 m-b30">
//                         <div className="dz-media">
//                             <a href="product-detail.html">
//                                 <img src={product} alt="" />
//                             </a>
//                         </div>
//                         <div className="dz-content">
//                             <h5 className="title"><a href="product-detail.html">Royal Bluebell Bliss (M)</a></h5>
//                             <ul className="dz-meta">
//                                 <li className="dz-price">$80<del>$95</del></li>

//                             </ul>
//                             <span className="dz-off">Category Name</span>
//                         </div>

//                     </div>

//                     <div className="order-status">
//                         <h4 className="title">Track order</h4>
//                         <ul className="dz-timeline style-2">
//                             <li className="timeline-item active">
//                                 <div className="active-box">
//                                     <h6 className="timeline-title"><span className="title">order placed</span> <span className="timeline-date">27 Dec 2023</span></h6>
//                                     <p className="timeline-text">We have received your order</p>
//                                 </div>
//                             </li>
//                             <li className="timeline-item active">
//                                 <div className="active-box">
//                                     <h6 className="timeline-title"><span className="title">order Confirm</span> <span className="timeline-date">27 Dec 2023</span></h6>
//                                     <p className="timeline-text">We has been confirmed</p>
//                                 </div>
//                             </li>
//                             <li className="timeline-item">
//                                 <div className="active-box">
//                                     <h6 className="timeline-title"><span className="title">Ready To ship</span> <span className="timeline-date">28 Dec 2023</span></h6>
//                                     <p className="timeline-text">We are preparing your order</p>
//                                 </div>
//                             </li>
//                             <li className="timeline-item">
//                                 <div className="active-box">
//                                     <h6 className="timeline-title"><span className="title">order placed</span> <span className="timeline-date">29 Dec 2023</span></h6>
//                                     <p className="timeline-text">Your order is ready for shipping</p>
//                                 </div>
//                             </li>
//                             <li className="timeline-item">
//                                 <div className="active-box">
//                                     <h6 className="timeline-title"><span className="title">Out for delivery</span> <span className="timeline-date">31 Dec 2023</span></h6>
//                                     <p className="timeline-text">Your order is out for delivery</p>
//                                 </div>
//                             </li>
//                         </ul>
//                     </div>
//                 </div>
//             </main>
//             {/* Main Content End */}
//         </div>
//     );
// };

// export default TrackOrder;

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import SigninButton from "../constants/SigninButton";
import Bottom from "../component/bottom";

const TrackOrder = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();
  const { order_number } = useParams();
  const handleBack = () => {
    navigate(-1);
  };
  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  useEffect(() => {
    const fetchOrderDetails = async (orderNumber) => {
      try {
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
            <Link to="" className="back-btn dz-icon icon-fill icon-sm" onClick={handleBack}>
              <i className="bx bx-arrow-back"></i>
            </Link>
          </div>
          <div className="mid-content">
            <h5 className="title">Track Order</h5>
          </div>
          <div className="right-content"></div>
        </div>
      </header>

      <main className="page-content space-top">
        {userData ? (
          <div className="container">
            <section>
              <h4 className="title">Order Menu</h4>
              {orderDetails.menu_details.map((menu) => (
                <div key={menu.menu_id} className="dz-card list-style style-3 m-b30">
                  <div className="dz-media">
                    <Link to={`/ProductDetails/${menu.menu_id}`}>
                      <img
                        style={{ height: '100px', width: '100px' }}
                        src={menu.image}
                        alt={menu.name}
                        onError={(e) => {
                          e.target.src = images;
                          e.target.style.width = "80px";
                          e.target.style.height = "80px";
                        }}
                      />
                    </Link>
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
              <h4 className="title">Track Order</h4>
              <ul className="dz-card list-style style-3 m-b30">
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
              </ul>
            </section>
          </div>
        ) : (
          <SigninButton />
        )}
      </main>
      <Bottom></Bottom>
    </div>
  );
};

export default TrackOrder;
