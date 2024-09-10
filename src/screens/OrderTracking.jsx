import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SigninButton from '../constants/SigninButton';
import Bottom from '../component/bottom';
import { useRestaurantId } from '../context/RestaurantIdContext';
const  OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData'));
  const customerId = userData ? userData.customer_id : null;
  const { restaurantId } = useRestaurantId();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log("OrderTracking component received new restaurant ID:", restaurantId);
  }, [restaurantId]);

  useEffect(() => {
    const fetchOngoingOrders = async () => {
      try {
        setLoading(true); 
        const response = await fetch('https://menumitra.com/user_api/get_order_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            restaurant_id: restaurantId, // Change this line
            order_status: 'Ongoing',
            customer_id: customerId
          })
        });
console.log(restaurantId)
console.log(customerId)
        if (response.ok) {
          const data = await response.json();
          if (data.st === 1 && data.lists) {
            setOrders(data.lists);
          } else {
            console.error('Invalid data format:', data);
          }
        } else {
          console.error('Network response was not ok.');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false); // Set loading to false after API call
      }
    };

    if (customerId && restaurantId) { // Add restaurantId check
      fetchOngoingOrders();
    }
  }, [customerId, restaurantId]); // Add restaurantId to dependency array

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="page-wrapper">
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <Link to="" className="back-btn dz-icon icon-fill icon-sm"  onClick={handleBack}>
              <i className="ri-arrow-left-line"></i>
            </Link>
          </div>
          <div className="mid-content">
            <h5 className="title">Track Order</h5>
          </div>
         
        </div>
      </header>
      
      <main className="page-content space-top p-b70">
        <div className="container">
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
            // User is authenticated, render ongoing orders
            <div className="default-tab style-2">
              <div className="dz-tabs">
                {/* No need for tab navigation since only ongoing orders are displayed */}
              </div>
    
              <div className="tab-content">
                <div className="tab-pane fade show active" id="home" role="tabpanel">
                  <OrdersTab orders={orders} />
                </div>
              </div>
            </div>
              ) : (
                // User is not authenticated, render sign-in button
              <SigninButton></SigninButton>
          )}
            </>
          )}
        </div>
      </main>
      <Bottom></Bottom>
    </div>
  );
};

const OrdersTab = ({ orders }) => {
  const navigate = useNavigate();

  const handleTrackOrderClick = (orderNumber) => {
    // Navigate to the track order screen with the order number
    navigate(`/TrackOrder/${orderNumber}`);
  };

  return (
    <div className="row g-3">
      {orders.map(order => (
        <div key={order.order_number} className="col-12">
          <div className="dz-card list-style style-3">
            <div className="dz-content1">
              <Link to={`/TrackOrder/${order.order_number}`}>
                <h5 className="title" style={{ fontSize: '19px', paddingTop: '10px' }}>{order.order_number}</h5>
                <ul className="dz-meta">
                  <li className="dz-price">₹{order.total_bill}</li>
                </ul>
                <span className="dz-off">{order.restaurant_name}</span>
              </Link>
              <button
                className="info-btn btn btn-primary btn-sm btn-xs font-13"
                onClick={() => handleTrackOrderClick(order.order_number)}
              >
                Track Order
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTracking;
