// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import product from  '../assets/images/product/product4/1.png';
// import Restoname from '../constants/Restoname';
// const MyOrder = () => {
//   const [activeTab, setActiveTab] = useState('ongoing');

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//   };

//   return (
//     <div className="page-wrapper">
//       {/* Header */}
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link to="/Profile" className="back-btn dz-icon icon-fill icon-sm">
//             <i className='bx bx-arrow-back' ></i>
//             </Link>
//           </div>
//           <div className="mid-content"><h5 className="title">My Order</h5></div>
//           <div className="right-content">
//             <Link to="/HomeScreen" className="dz-icon icon-sm icon-fill">
//             <i class='bx bx-home-alt bx-sm'></i>
//             </Link>
//           </div>
//         </div>
//       </header>
//       {/* Header End */}

//       {/* Main Content */}
//       <main className="page-content space-top p-b70">
//         <div className="container">
//           <div className="default-tab style-2">
//             {/* Tab buttons */}
//             <div className="dz-tabs">
//               <ul className="nav nav-tabs" role="tablist">
//                 <li className={`nav-item ${activeTab === 'ongoing' ? ' active' : ''}`}>
//                 <button className={`nav-link ${activeTab === 'ongoing' ? 'active' : ''}`} onClick={() => handleTabChange('ongoing')}>   Ongoing
//             </button>
//                 </li>
//                 <li className={`nav-item ${activeTab === 'completed' ? 'active' : ''}`}>
//                 <button className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => handleTabChange('completed')}>
//               Completed
//             </button>
//                 </li>
//               </ul>
//             </div>

//             {/* Tab content */}
//             <div className="tab-content">
//               <div className={`tab-pane fade ${activeTab === 'ongoing' ? 'show active' : ''}`} id="home" role="tabpanel">
//                 {/* Render Ongoing Orders */}
//                 <OrdersTab type="ongoing" />
//               </div>
//               <div className={`tab-pane fade ${activeTab === 'completed' ? 'show active' : ''}`} id="profile" role="tabpanel">
//                 {/* Render Completed Orders */}
//                 <OrdersTab type="completed" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//       {/* Main Content End */}
//     </div>
//   );
// };

// // const OrdersTab = ({ type }) => {
// //   // Simulated data for ongoing and completed orders
// //   const orders = [
// //     {
// //       id: 1,
// //       // name: 'Amber Orchid Oasis (M)',
// //       name:'Order_Count',
// //       price: 89,
// //       originalPrice: 99,
// //       // reviewCount: 2000,
// //       // imageUrl:'../assets/images/product/product4/1.png'
// //     },
// //     {
// //         id: 2,
// //         name: 'Order_Count',
// //         price: 89,
// //         originalPrice: 99,
// //         // reviewCount: 2000,
// //         // imageUrl: '../assets/images/product/product4/1.png'
// //       },
// //     // Add more orders here as needed
// //   ];

// const OrdersTab = ({ type }) => {
//   // Define data for ongoing and completed orders
//   const ongoingOrders = [
//     { id: 1, name: 'Order_Count', price: 89, originalPrice: 99 },
//     { id: 2, name: 'Order_Count', price: 79, originalPrice: 89 }
//   ];

//   const completedOrders = [
//     { id: 3, name: 'Order_Count', price: 99, originalPrice: 109 },
//     { id: 4, name: 'Order_Count', price: 69, originalPrice: 79 }
//   ];

//   const ordersToDisplay = type === 'ongoing' ? ongoingOrders : completedOrders;

//   return (
//     <div className="row g-3">
//     {ordersToDisplay.map((order) => (
//       <div key={order.id} className="col-12">
//         {/* Wrap the entire card in a Link component */}
//         <Link
//           // to={type === 'ongoing' ? `/TrackOrder/${order.id}` : `/Review/${order.id}`}
//           to={type === 'ongoing' ? `/TrackOrder` : `/TrackOrder`}
//           className="dz-card list-style style-3"
//         >
//           <div className="dz-media">
//             {/* Add product image here if needed */}
//           </div>
//           <div className="dz-content">
//             <h5 className="title"><a href="product-detail.html">{order.name}</a></h5>
//             <ul className="dz-meta">
//               <li className="dz-price">${order.price}<del>${order.originalPrice}</del></li>
//             </ul>
//             <span className="dz-off"><Restoname /></span>
//             <button className="info-btn btn btn-primary btn-sm btn-xs font-13">
//               {type === 'ongoing' ? 'Track Order' : 'Write Review'}
//             </button>
//           </div>
//         </Link>
//       </div>
//     ))}
//   </div>
//   );
// };

// export default MyOrder;



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Restoname from '../constants/Restoname';

const MyOrder = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [orders, setOrders] = useState([]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://194.195.116.199/user_api/get_order_list', {
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

  return (
    <div className="page-wrapper">
      {/* Header */}
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <Link to="/Profile" className="back-btn dz-icon icon-fill icon-sm">
              <i className='bx bx-arrow-back'></i>
            </Link>
          </div>
          <div className="mid-content">
            <h5 className="title">My Order</h5>
          </div>
          <div className="right-content">
            <Link to="/HomeScreen" className="dz-icon icon-sm icon-fill">
              <i className='bx bx-home-alt bx-sm'></i>
            </Link>
          </div>
        </div>
      </header>
      {/* Header End */}

      {/* Main Content */}
      <main className="page-content space-top p-b70">
        <div className="container">
          <div className="default-tab style-2">
            {/* Tab buttons */}
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

            {/* Tab content */}
            <div className="tab-content">
              <div className={`tab-pane fade ${activeTab === 'ongoing' ? 'show active' : ''}`} id="home" role="tabpanel">
                {/* Render Ongoing Orders */}
                <OrdersTab orders={orders} type="ongoing" />
              </div>
              <div className={`tab-pane fade ${activeTab === 'completed' ? 'show active' : ''}`} id="profile" role="tabpanel">
                {/* Render Completed Orders */}
                <OrdersTab orders={orders} type="Completed" />
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Main Content End */}
    </div>
  );
};

const OrdersTab = ({ orders, type }) => {
  const filteredOrders = orders.filter(order => order.order_status.toLowerCase() === type.toLowerCase());

  return (
    <div className="row g-3">
      {filteredOrders.map(order => (
        <div key={order.order_number} className="col-12">
           <Link
              to={type === 'ongoing' ? `/TrackOrder/${order.order_number}` : `/TrackOrder/${order.order_number}`}
          //  to={type === 'ongoing' ? `/TrackOrder` : `/TrackOrder`}
          className="dz-card list-style style-3"
         >
          
          {/* <div className="dz-card list-style style-3"> */}
            {/* <div className="dz-media"> */}
              {/* Add product image here if needed */}


              

        

            {/* </div> */}
            <div className="dz-content" style={{marginLeft:'5px'}}>
              <h5 className="title"><a href="#">{order.order_number}</a></h5>
              <ul className="dz-meta">
                <li className="dz-price">₹{order.total_bill}</li>
              </ul>
              <span className="dz-off">{order.restaurant_name}</span>
              <button
                to={`/TrackOrder/${order.order_number}`}
                className="info-btn btn btn-primary btn-sm btn-xs font-13"
              >
                {type === 'ongoing' ? 'Track Order' : 'Write Review'}
              </button>
           
            </div>
            </Link>
          </div>
          
      
        
        
      ))}
    </div>
  );
};

export default MyOrder;






