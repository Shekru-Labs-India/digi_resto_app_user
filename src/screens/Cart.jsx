// import React, { useState, useEffect } from "react";
// import { Link ,useNavigate} from 'react-router-dom';
// import images from "../assets/MenuDefault.png";
// import SigninButton from '../constants/SigninButton';
// const Cart = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const navigate = useNavigate();
//   useEffect(() => {
//     const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     setCartItems(storedCartItems);
//   }, []);

//   const removeFromCart = (index) => {
//     const updatedCartItems = [...cartItems];
//     updatedCartItems.splice(index, 1);
//     setCartItems(updatedCartItems);
//     localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
//   };

//   const calculateSubtotal = () => {
//     return cartItems.reduce((total, item) => {
//       return total + item.price * item.quantity; // Multiply price by quantity
//     }, 0);
//   };

//   const decrementQuantity = (index) => {
//     const updatedCartItems = [...cartItems];
//     if (updatedCartItems[index].quantity > 1) {
//       updatedCartItems[index].quantity--;
//       setCartItems(updatedCartItems);
//       localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
//     }
//   };

//   const incrementQuantity = (index) => {
//     const updatedCartItems = [...cartItems];
//     updatedCartItems[index].quantity++;
//     setCartItems(updatedCartItems);
//     localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
//   };
//   const userData = JSON.parse(localStorage.getItem('userData'));

//   return (
//     <div className="page-wrapper full-height">
//       {/* Header */}
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//           <Link to="/HomeScreen" className="back-btn dz-icon icon-fill icon-sm" onClick={() => navigate(-1)}>
//   <i className='bx bx-arrow-back'></i>
// </Link>

//           </div>
//           <div className="mid-content">
//             <h5 className="title">
//               My Cart {userData && <span className="items-badge">{cartItems.length}</span>}
//             </h5>
//           </div>
//           <div className="right-content">
//             <Link to="/Search" className="dz-icon icon-fill icon-sm">
//               <i className="bx bx-search-alt-2"></i>
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Cart Items */}
//       {cartItems.length === 0 ? (
//         <main className="page-content space-top p-b100">
//           <div className="container overflow-hidden">
        
//             <div className="m-b20 dz-flex-box">
//               <div className="dz-cart-about text-center">
//                 <h5 className="title">Your Cart is Empty</h5>
//                 <p>Add items to your cart from the product details page.</p>
//                 <Link
//                   to="/Product"
//                   className="btn btn-outline-primary btn-sm"
//                 >
//                   Return to Shop
//                 </Link>
//               </div>
//             </div>
         
//           </div>
//         </main>
//       ) : (
//         <main className="page-content space-top p-b100">
//            {userData ? (
//           <div className="container overflow-hidden">
         
//             {cartItems.map((item, index) => (
              
//               <div key={index} className="m-b5 dz-flex-box">
                
//                 <div className="dz-cart-list m-b10 ">
//                   <div className="dz-media">
//                   <Link to={`/ProductDetails/${item.menu_id}`}>
//                     <img
//                       style={{
//                         width: "100%",
//                         height: "110px",
//                         objectFit: "cover",
//                       }}
//                       src={item.image}
//                       alt={item.name}
//                       onError={(e) => {
//                         e.target.src = images; // Set local image source on error
//                         e.target.style.width = "100%"; // Example: Set width of the local image
//                         e.target.style.height = "100%"; // Example: Set height of the local image
//                       }}
//                     />
//                     </Link>
//                   </div>
//                   <div className="dz-content">
//                     <h5 className="title">{item.name}</h5>
//                     <ul className="dz-meta">
//                       <li className="dz-price">
//                         ₹{item.price}
//                         <del>₹{item.oldPrice}</del>
//                       </li>
//                       {/* <li className="dz-review"> <i className='bx bxs-star staricons'  ></i><span>(2k Review)</span></li> */}
//                     </ul>
//                     <div className="d-flex align-items-center">
//                       <div className="dz-stepper style-2">
//                         <div className="dz-stepper2 input-group">
//                           <div className="dz-stepper2">
//                             <i
//                               className="bx bx-minus"
//                               onClick={() => decrementQuantity(index)}
//                             ></i>
//                           </div>
//                           <input
//                             className="form-control stepper-input1 text-center"
//                             type="text"
//                             value={item.quantity}
//                             readOnly
//                           />
//                           <div className="dz-stepper2">
//                             <i
//                               className="bx bx-plus"
//                               onClick={() => incrementQuantity(index)}
//                             ></i>
//                           </div>
//                         </div>
//                       </div>
//                       <div
//                         className="remove"
//                         onClick={() => removeFromCart(index)}
//                       >
//                         <i className="bx bx-trash"></i>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
         
//           </div>
//            ) : (
//             // User is not authenticated, render sign-in button
//           <SigninButton></SigninButton>
//           )}
//         </main>
//       )}

//       {/* Footer Fixed Button */}
//       {/* const hasItemsInCart = {cartItems.length > 0}; */}
//       <div>
//       {userData &&
//       <div className="footer-fixed-btn bottom-0">
     
//         <ul className="total-prize">
      
//           <li className="name">Subtotal</li>
//           <li className="prize">₹{calculateSubtotal()}</li>
//         </ul>
//         {cartItems.length > 0 && (
//           <Link
//             to="/Checkout"
//             state={{ cartItems: cartItems }}
//             className="btn btn-lg btn-thin rounded-xl btn-primary w-100"
//           >
//             Proceed to Buy &nbsp; <b> ({cartItems.length} items)</b>
//           </Link>
//         )}
     
//       </div>
// }
//    </div>
//     </div>
//   );
// };

// export default Cart;


import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import images from "../assets/MenuDefault.png";
import SigninButton from '../constants/SigninButton';
import { useRestaurantId } from '../context/RestaurantIdContext';
import Bottom from "../components/Bottom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { restaurantId } = useRestaurantId();
  const navigate = useNavigate();

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);
  }, []);

  useEffect(() => {
    const clearCartOnRestaurantChange = () => {
      const storedRestaurantId = localStorage.getItem("restaurantId");
      if (storedRestaurantId && restaurantId !== storedRestaurantId) {
        localStorage.removeItem("cartItems");
        setCartItems([]); // Clear cart items in state as well
      }
    };

    clearCartOnRestaurantChange();
  }, [restaurantId]);

  const removeFromCart = (index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems.splice(index, 1);
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const decrementQuantity = (index) => {
    const updatedCartItems = [...cartItems];
    if (updatedCartItems[index].quantity > 1) {
      updatedCartItems[index].quantity--;
      setCartItems(updatedCartItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    }
  };

  const incrementQuantity = (index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems[index].quantity++;
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const userData = JSON.parse(localStorage.getItem('userData'));
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous screen
  };
  return (
    <div className="page-wrapper full-height" style={{ overflowY: "auto" }}>
      {/* Header */}
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
          <Link to ="/Wishlist" className="back-btn dz-icon icon-fill icon-sm" >
              <i className='bx bx-arrow-back'></i>
            </Link>
          </div>
          <div className="mid-content">
            <h5 className="title">
              My Cart {userData && <span className="items-badge">{cartItems.length}</span>}
            </h5>
          </div>
          <div className="right-content">
            <Link to="/Search" className="dz-icon icon-fill icon-sm">
              <i className="bx bx-search-alt-2"></i>
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
                <Link
                  to="/Category"
                  className="btn btn-outline-primary btn-sm"
                >
                  Return to Shop
                </Link>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main className="page-content space-top p-b200">
          {userData ? (
            <div className="container overflow-hidden">
              {cartItems.map((item, index) => (
                <div key={index} className="m-b5 dz-flex-box">
                   
                  <div className="dz-cart-list m-b30">
                    <div className="dz-media">
                    <Link to={`/ProductDetails/${item.menu_id}`}>
                      {/* <img
                        style={{
                          width: "100%",
                          height: "110px",
                          objectFit: "cover",
                        }}
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = images;
                        }}
                      /> */}
                                       <img
            src={item.image || images} // Use default image if image is null
            alt={item.name}
            style={{
              width: "100%",
              height: "110px",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.target.src = images; // Set local image source on error
            }}
          />
                      </Link>
                    </div>
                    
                    <div>
                  
                    <div className="dz-content">
                      <h5 className="title">{item.name}</h5>
                      <ul className="dz-meta">
                        <li className="dz-price">
                          ₹{item.price}
                          <del>₹{item.oldPrice}</del>
                        </li>
                      </ul>
                      
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="dz-stepper style-2">
                          <div className="dz-stepper2 input-group">
                            <div className="dz-stepper2">
                              <i
                                className="bx bx-minus"
                                onClick={() => decrementQuantity(index)}
                              ></i>
                            </div>
                            <input
                              className="form-control stepper-input1 text-center"
                              type="text"
                              value={item.quantity}
                              readOnly
                            />
                            <div className="dz-stepper2">
                              <i
                                className="bx bx-plus"
                                onClick={() => incrementQuantity(index)}
                              ></i>
                            </div>
                          </div>
                        </div>
                       
                        <div
                          className="remove"
                          onClick={() => removeFromCart(index)}
                        >
                          <i className="bx bx-trash"></i>
                        </div>
                      </div>
                    </div>
                  </div>
               
                </div>
              ))}
            </div>
          ) : (
            <SigninButton></SigninButton>
          )}
        </main>
      )}

      {/* Footer Fixed Button */}
      {userData && (
        <div className="footer-fixed-btn bottom-40">
          <ul className="total-prize">
            <li className="name">Subtotal</li>
            <li className="prize">₹{calculateSubtotal()}</li>
          </ul>
          {cartItems.length > 0 && (
            <Link
              to="/Checkout"
              state={{ cartItems: cartItems }}
              className="btn btn-lg btn-thin rounded-xl btn-primary w-100"
            >
              Proceed to Buy &nbsp; <b> ({cartItems.length} items)</b>
            </Link>
          )}
            
        </div>
      )}
    <Bottom></Bottom>
    </div>
  );
};

export default Cart;
