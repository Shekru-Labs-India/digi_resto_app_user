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


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import product from '../assets/images/product/product4/1.png';

const TrackOrder = () => {
  const [orderDetails, setOrderDetails] = useState(null);

  // Utility function to convert a string to title case
  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch('http://194.195.116.199/user_api/get_order_details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            order_number: 490211 // Assuming you want to fetch details for order number 499163
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.st === 1 && data.lists) {
            setOrderDetails(data.lists);
          } else {
            console.error('Invalid data format:', data);
          }
        } else {
          console.error('Network response was not ok.');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, []); // Empty dependency array ensures the effect runs only once

  if (!orderDetails) {
    return <div>Loading...</div>; // Render loading state until data is fetched
  }

  return (
    <div className="page-wrapper">
      {/* Header */}
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <Link to="/MyOrder" className="back-btn dz-icon icon-fill icon-sm">
              <i className='bx bx-arrow-back' ></i>
            </Link>
          </div>
          <div className="mid-content">
            <h5 className="title">Track Order</h5>
          </div>
          <div className="right-content"></div>
        </div>
      </header>
      {/* Header End */}

      {/* Main Content Start */}
      <main className="page-content space-top">
        <div className="container">
          {/* Menu Details Section */}
          <section>
            <h4 className="title">Order Menu</h4>
            {orderDetails.menu_details.map((menu) => (
              <div key={menu.menu_id} className="dz-card list-style style-3 m-b30">
                <div className="dz-media">
                  <img src={menu.image} alt={menu.name} />
                </div>
                <div className="dz-content">
                  <h5 className="title">{toTitleCase(menu.name)}</h5>
                  <ul className="dz-meta">
                    {/* <li className="dz-price">{menu.quantity} x ₹{menu.price}</li> */}
                    <li className="timeline-date">{menu.quantity} x ₹{menu.price}</li>
                  </ul>
                  <p className="timeline-text">{toTitleCase(menu.spicy_index)} | {toTitleCase(menu.veg_nonveg)}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Order Details Section */}
          <section>
            <h4 className="title">Track Order</h4>
            <ul className="dz-timeline style-2">
              <li className="timeline-item active">
                <div className="active-box">
                  <h6 className="timeline-title">
                    <span className="title">{toTitleCase(orderDetails.order_details.restaurant_name)}</span>
                    <span className="timeline-date">₹{orderDetails.order_details.total_bill}</span>
                  </h6>
                  <p className="timeline-text">{toTitleCase(orderDetails.order_details.order_status)}</p>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </main>
      {/* Main Content End */}
    </div>
  );
};

export default TrackOrder;
