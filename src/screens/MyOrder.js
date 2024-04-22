




import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SigninButton from '../constants/SigninButton';

const MyOrder = () => {
  

  const [activeTab, setActiveTab] = useState('ongoing');
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://menumitra.com/user_api/get_order_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            restaurant_id: 13,
            order_status: activeTab === 'ongoing' ? 'Ongoing' : 'Completed',
            customer_id: 1
          })
        });

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
      }
    };

    fetchOrders();
  }, [activeTab]);

  const userData = JSON.parse(localStorage.getItem('userData'));
  


  

  return (
    <div className="page-wrapper">
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <Link to="/Profile" className="back-btn dz-icon icon-fill icon-sm">
              <i className="bx bx-arrow-back"></i>
            </Link>
          </div>
          <div className="mid-content">
            <h5 className="title">My Order</h5>
          </div>
          <div className="right-content">
            <Link to="/HomeScreen" className="dz-icon icon-sm icon-fill">
              <i className="bx bx-home-alt bx-sm"></i>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="page-content space-top p-b70">
        <div className="container">
          {userData ? (
            // User is authenticated, render order tabs
            <div className="default-tab style-2">
              <div className="dz-tabs">
                <ul className="nav nav-tabs" role="tablist">
                  <li className={`nav-item ${activeTab === 'ongoing' ? 'active' : ''}`}>
                    <button className={`nav-link ${activeTab === 'ongoing' ? 'active' : ''}`} onClick={() => handleTabChange('ongoing')}>
                      Ongoing
                    </button>
                  </li>
                  <li className={`nav-item ${activeTab === 'completed' ? 'active' : ''}`}>
                    <button className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => handleTabChange('completed')}>
                      Completed
                    </button>
                  </li>
                </ul>
              </div>
    
              <div className="tab-content">
                <div className={`tab-pane fade ${activeTab === 'ongoing' ? 'show active' : ''}`} id="home" role="tabpanel">
                  <OrdersTab orders={orders} type="ongoing" />
                </div>
                <div className={`tab-pane fade ${activeTab === 'completed' ? 'show active' : ''}`} id="profile" role="tabpanel">
                  <OrdersTab orders={orders} type="Completed" />
                </div>
              </div>
            </div>
          ) : (
            // User is not authenticated, render sign-in button
          <SigninButton></SigninButton>
          )}
        </div>
      </main>
    </div>
  );
};

const OrdersTab = ({ orders, type }) => {
  const filteredOrders = orders.filter(order => order.order_status.toLowerCase() === type.toLowerCase());
  const getLinkToOrder = (orderNumber) => {
    return `/TrackOrder/${orderNumber}`;
  };
  const navigate = useNavigate();
   const handleReviewClick = (orderNumber) => {
    const reviewPageUrl = `/Review/${orderNumber}`;
    navigate(reviewPageUrl); // Navigate to the review page
  };



  
  return (
    <div className="row g-3">
      {filteredOrders.map(order => (
        <div key={order.order_number} className="col-12" >
          
          <div  className="dz-card list-style style-3">
          {/* <div className="dz-card list-style style-3"> */}
            {/* <div className="dz-media"> */}
              {/* Add product image here if needed */}


              

        
             
            {/* </div> */}
            <div className="dz-content1" >
            <Link
              // to={type === 'ongoing' ? `/TrackOrder` : `/TrackOrder`}
          //  to={type === 'ongoing' ? `/TrackOrder` : `/TrackOrder`}
          to={getLinkToOrder(order.order_number)}
         
         >
              <h5 className="title" style={{fontSize:'19px', paddingTop:'10px'}}><a href="#">{order.order_number}</a></h5>
              <ul className="dz-meta">
                <li className="dz-price">₹{order.total_bill}</li>
              </ul>
              <span className="dz-off">{order.restaurant_name}</span>
              </Link>
              <button
               
                className="info-btn btn btn-primary btn-sm btn-xs font-13"
                onClick={() => handleReviewClick(order.order_number)}
              >
                {type === 'ongoing' ? 'Track Order' : 'Write Review'}
              </button>
           
            </div>
           
          </div>
          
          </div>
        
        
      ))}
    </div>
    
  );
};

export default MyOrder;

