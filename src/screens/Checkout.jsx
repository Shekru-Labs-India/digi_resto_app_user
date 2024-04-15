// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const Checkout = () => {
//     const navigate = useNavigate(); // Access the navigate function

//     // Handle back button click
//     const handleBack = () => {
//         navigate(-1); // Navigate back to the previous screen
//     };

//     return (
//         <div className="page-wrapper full-height">

//             {/* Header */}
//             <header className="header header-fixed style-3">
//                 <div className="header-content">
//                     <div className="left-content">
//                         <Link to="" className="back-btn dz-icon icon-fill icon-sm" onClick={handleBack}>
//                             <i className='bx bx-arrow-back'></i>
//                         </Link>
//                     </div>
//                     <div className="mid-content"><h5 className="title">Checkout</h5></div>
//                     <div className="right-content"></div>
//                 </div>
//             </header>
//             {/* Header end */}

//             {/* Main Content Start */}
//             <main className="page-content space-top p-b90">
//                 <div className="container">
//                     <div className="dz-flex-box">
//                         <div className="dz-list m-b20">
//                             <ul className="dz-list-group">
//                                 <li className="list-group-items">
//                                     <Link to="payment.html" className="item-link">
//                                         <div className="dz-icon dz-icon style-2"><i className="bx bx-credit-card font-20"></i></div>
//                                         <div className="list-content">
//                                             <h5 className="title">Payment</h5>
//                                             <p className="active-status">XXXX XXXX XXXX 3456</p>
//                                         </div>
//                                     </Link>
//                                 </li>
//                             </ul>
//                         </div>
//                         <div className="mb-3">
//                             <label className="form-label" htmlFor="notes">Additional Notes:</label>
//                             <textarea className="form-control dz-textarea" name="notes" id="notes" rows="4" placeholder="Write Here"></textarea>
//                         </div>

//                         <div className="view-cart mt-auto">
//                             <ul>
//                                 <li>
//                                     <span className="name">Royal Bluebell Bliss (M)</span>
//                                     <span className="about">2 x ₹2000.00</span>
//                                 </li>
//                                 <li>
//                                     <span className="name">Emerald Fern Fronds (M)</span>
//                                     <span className="about">2 x ₹1699.00</span>
//                                 </li>
//                                 <li className="dz-total">
//                                     <span className="name font-18 font-w600">My Order</span>
//                                     <h5 className="price">₹3,599.00</h5>
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>
//                 </div>
//             </main>
//             {/* Main Content End */}

//             {/* Footer Fixed Button */}
//             <div className="footer-fixed-btn bottom-0">
//                 <Link to="/MyOrder" className="btn btn-primary btn-lg btn-thin rounded-xl w-100">Submit Order</Link>
//             </div>
//             {/* Footer Fixed Button */}
//         </div>
//     );
// }

// export default Checkout;


import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];

  const handleBack = () => {
    navigate(-1);
  };

  // Define the calculateTotal function to compute the total price of cart items
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="page-wrapper full-height">
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <Link to="" className="back-btn dz-icon icon-fill icon-sm" onClick={handleBack}>
              <i className='bx bx-arrow-back'></i>
            </Link>
          </div>
          <div className="mid-content">
            <h5 className="title">Checkout</h5>
          </div>
          <div className="right-content"></div>
        </div>
      </header>

      <main className="page-content space-top p-b90">
        <div className="container">
          <div className="dz-flex-box">
            {/* <div className="dz-list m-b20"> */}
              <ul className="dz-list-group">
                

                <div className="mb-3">
                  <label className="form-label" htmlFor="notes">Notes For Chef:</label>
                  <textarea className="form-control dz-textarea" name="notes" id="notes" rows="4" placeholder="Write Here"></textarea>
                </div>
              
                {cartItems.length > 0 ? (
                  cartItems.map((item, index) => (
                 
                    <li key={index} className="list-group-items ">
                      
                      <div className="list-content">
                        <h5 className="title">{item.name}</h5>
                        <p className="active-status">
  {item.quantity} x ₹{item.price.toFixed(2)}
  <span className="price" style={{ fontWeight:'bold' ,marginLeft:'250px'}}>
    ₹{(item.quantity * item.price).toFixed(2)}
  </span>
</p>
                        {/* Display subtotal (quantity * price) */}
                        
                      </div>
                      
                    </li>
             
                  ))
                ) : (
                  <li>No items in the cart.</li>
                )}
              </ul>
              
            {/* </div> */}
            {cartItems.length > 0 && (
              <div className="view-cart mt-auto">
                {/* <ul>
                  <li className="dz-total">
                    <span className="name font-18 font-w600">Total</span>
                    <h5 className="price">₹{calculateTotal().toFixed(2)}</h5>
                  </li>
                </ul> */}
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="footer-fixed-btn bottom-0">
        <ul className="total-prize">
          <li className="name">Subtotal</li>
          <li className="prize">₹{calculateTotal()}</li>
        </ul>
        <Link to="/MyOrder" className="btn btn-primary btn-lg btn-thin rounded-xl w-100">Submit Order</Link>
      </div>
    </div>
  );
};

export default Checkout;



