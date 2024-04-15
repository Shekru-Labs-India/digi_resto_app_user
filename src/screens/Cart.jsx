// import React, { useState } from 'react';
// import { Link } from 'react-router-dom'; 

// import product from '../assets/images/product/product4/1.png';




// const Cart = () => {
    
//     const [count, setCount] = useState(1);

//     const increment = () => {
//         setCount((prevCount) => prevCount + 1);
//     };

//     const decrement = () => {
//         if (count > 1) {
//             setCount((prevCount) => prevCount - 1);
//         }
//     };

//     return (
//         <div className="page-wrapper full-height">
//             {/* Preloader */}
//             {/* <div id="preloader">
//                 <div className="loader">
//                     <div className="spinner-border text-primary" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                     </div>
//                 </div>
//             </div> */}
//             {/* Preloader end*/}
            
//             {/* Header */}
//             <header className="header header-fixed style-3">
//                 <div className="header-content">
//                     <div className="left-content">
//                         <Link to="/HomeScreen" className="back-btn dz-icon icon-fill icon-sm">
//                         <i className='bx bx-arrow-back' ></i>
//                         </Link>
//                     </div>
//                     <div className="mid-content"><h5 className="title">My Cart</h5></div>
//                     <div className="right-content">
//                         <Link to="/Search" className="dz-icon icon-fill icon-sm">
//                         <i class='bx bx-search-alt-2' ></i>
//                         </Link>
//                     </div>
//                 </div>
//             </header>
//             {/* Header */}
                        
//             {/* Main Content Start */}
//             <main className="page-content space-top p-b100">
//                 <div className="container overflow-hidden">
//                     <div className="m-b20 dz-flex-box"> 
//                         {/* Repeat the following structure for each item in the cart */}
//                         {/* <div className="dz-cart-about d-none">
//                             <div className="dz-icon mb-2"><i className="feather icon-shopping-cart"></i></div>
//                             <h5 className="title">Your Bag is Empty</h5>
//                             <p>Signin to links products to your account or view products already in your wishlist or bag</p>
//                             <a href="products.html" className="btn btn-outline-primary btn-sm">Return Shop</a>
//                         </div> */}
//                         <div className="dz-cart-list m-b15">
//                             <div className="dz-media">
//                                 <Link to="/ProductDetails">
//                                     <img src={product} alt="" />
//                                 </Link>
//                             </div>
//                             <div className="dz-content">
//                                 <h5 className="title"><Link to="/ProductDetails">Amber Orchid Oasis (M)</Link></h5>
//                                 <ul className="dz-meta">
//                                     <li className="dz-price">₹80<del>₹99</del></li>
//                                     <li className="dz-review"> <i className='bx bxs-star staricons'  ></i><span>(2k Review)</span></li>
//                                 </ul>
//                                 <div className=" d-flex align-items-center">
//                                 <div className="dz-stepper style-2">
//                                 <div className="dz-stepper2 input-group ">
//                                 <div className="dz-stepper2" onClick={decrement}>
//                         <i className="bx bx-minus"></i>
//                     </div>
            
//             <input className="form-control stepper-input1 text-center" type="text" value={count} readOnly />
//             <div className="dz-stepper2" onClick={increment}>
//                         <i className="bx bx-plus"></i>
//                     </div>
//         </div>
//         </div>

                                    
//                                     <a href="" className="remove"><i class='bx bx-trash'></i></a>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* Repeat the above structure for other items */}
//                     </div>
//                 </div>
//             </main>
//             {/* Main Content End */}
            
//             {/* Footer Fixed Button */}
//             <div className="footer-fixed-btn bottom-0">
//                 <ul className="total-prize">
//                     <li className="name">Subtotal</li>
//                     <li className="prize">₹3,599</li>
//                 </ul>
//                 <Link to="/Checkout" className="btn btn-lg btn-thin rounded-xl btn-primary w-100 gap-1">Proceed to Buy <b> (8 items)</b></Link>
//             </div>
//             {/* Footer Fixed Button */}
//         </div>
//     );
// };

// export default Cart;







import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Images from '../assets/category.png'

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
  }, []);

  const removeFromCart = (index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems.splice(index, 1);
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity; // Multiply price by quantity
    }, 0);
  };

  const decrementQuantity = (index) => {
    const updatedCartItems = [...cartItems];
    if (updatedCartItems[index].quantity > 1) {
      updatedCartItems[index].quantity--;
      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    }
  };

  const incrementQuantity = (index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems[index].quantity++;
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  return (
    <div className="page-wrapper full-height">
      {/* Header */}
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <Link to="/HomeScreen" className="back-btn dz-icon icon-fill icon-sm">
              <i className='bx bx-arrow-back' ></i>
            </Link>
          </div>
          <div className="mid-content">
            <h5 className="title">My Cart <span className="items-badge">{cartItems.length}</span></h5>
          </div>
          <div className="right-content">
            <Link to="/Search" className="dz-icon icon-fill icon-sm">
              <i className='bx bx-search-alt-2' ></i>
            </Link>
          </div>
        </div>
      </header>

      {/* Cart Items */}
      {cartItems.length === 0 ? (
        <main className="page-content space-top p-b100">
          <div className="container overflow-hidden">
            <div className="m-b20 dz-flex-box">
              <div className="dz-cart-about text-center">
                <h5 className="title">Your Cart is Empty</h5>
                <p>Add items to your cart from the product details page.</p>
                <Link to="/ProductDetails" className="btn btn-outline-primary btn-sm">Return to Shop</Link>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main className="page-content space-top p-b100">
          <div className="container overflow-hidden">
            {cartItems.map((item, index) => (
              <div key={index} className="m-b5 dz-flex-box">
                <div className="dz-cart-list m-b15">
                  <div className="dz-media">
                    <img src={item.image} alt={Images} />
                  </div>
                  <div className="dz-content">
                    <h5 className="title">{item.name}</h5>
                    <ul className="dz-meta">
                      <li className="dz-price">₹{item.price}<del>₹{item.oldPrice}</del></li>
                      {/* <li className="dz-review"> <i className='bx bxs-star staricons'  ></i><span>(2k Review)</span></li> */}
                    </ul>
                    <div className="d-flex align-items-center">
                      <div className="dz-stepper style-2">
                        <div className="dz-stepper2 input-group">
                          <div className="dz-stepper2">
                            <i className="bx bx-minus" onClick={() => decrementQuantity(index)}></i>
                          </div>
                          <input
                            className="form-control stepper-input1 text-center"
                            type="text"
                            value={item.quantity}
                            readOnly
                          />
                          <div className="dz-stepper2">
                            <i className="bx bx-plus" onClick={() => incrementQuantity(index)}></i>
                          </div>
                        </div>
                      </div>
                      <div className="remove" onClick={() => removeFromCart(index)}>
                        <i className='bx bx-trash'></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Footer Fixed Button */}
      {/* const hasItemsInCart = {cartItems.length > 0}; */}
      <div className="footer-fixed-btn bottom-0">
        <ul className="total-prize">
          <li className="name">Subtotal</li>
          <li className="prize">₹{calculateSubtotal()}</li>
        </ul>
       { cartItems.length>0  && <Link to="/Checkout"state={{ cartItems: cartItems }} className="btn btn-lg btn-thin rounded-xl btn-primary w-100">
          Proceed to Buy &nbsp; <b> ({cartItems.length} items)</b>
        </Link>}
      </div>
    </div>
  );
};

export default Cart;
