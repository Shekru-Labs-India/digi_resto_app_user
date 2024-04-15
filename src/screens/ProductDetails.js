


// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import heartIcon from '../assets/images/heart-regular-24 (1).png'; 

// const ProductDetails = () => {
//   const [productDetails, setProductDetails] = useState(null);
//   const [isLiked, setIsLiked] = useState(false);
//   const [quantity, setQuantity] = useState(0);
//   const [showQuantityError, setShowQuantityError] = useState(false); // State to manage showing quantity error
//   const navigate = useNavigate();
//   const [cartItemsCount, setCartItemsCount] = useState(0);

//  // Utility function to convert a string to title case
//  const toTitleCase = (str) => {
//   return str.replace(/\w\S*/g, function(txt) {
//     return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//   });
// };

//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       try {
//         const response = await fetch('http://194.195.116.199/user_api/get_menu_details', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             restaurant_id: 13,
//             menu_id: 8
//           })
//         });

//         if (response.ok) {
//           const data = await response.json();
//           if (data.st === 1 && data.lists) {
//             const { name, veg_nonveg, spicy_index, price, description, image } = data.lists;
//             const oldPrice = Math.floor(price * 1.1);
//             setProductDetails({ name, veg_nonveg, spicy_index, price, oldPrice, description, image });


            
//           } else {
//             console.error('Invalid data format:', data);
//           }
//         } else {
//           console.error('Network response was not ok.');
//         }
//       } catch (error) {
//         console.error('Error fetching product details:', error);
//       }
//     };

//     fetchProductDetails();
//   }, []);

//   useEffect(() => {
//     // Retrieve cart items from localStorage and update cartItemsCount
//     const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
//     setCartItemsCount(cartItems.length);
//   }, []);

//   const handleLikeClick = () => {
//     setIsLiked(!isLiked);
//   };



//   const handleAddToCart = () => {
//     if (quantity === 0) {
//       setShowQuantityError(true); // Show quantity error message
//       return;
//     }

//     if (!productDetails) return;

  

//     const cartItem = { ...productDetails, quantity };
//     let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
//     cartItems.push(cartItem);
//     localStorage.setItem('cartItems', JSON.stringify(cartItems));

//     setCartItemsCount(cartItems.length);
//     // Navigate to Cart screen after adding to cart
//     navigate('/Cart');
//   };

//   const incrementQuantity = () => {
//     setQuantity((prevQuantity) => prevQuantity + 1);
//   };

//   const decrementQuantity = () => {
//     if (quantity > 0) {
//       setQuantity((prevQuantity) => prevQuantity - 1);
//       setShowQuantityError(false); // Reset quantity error when decrementing
//     }
//   };

//   if (!productDetails) {
//     return <div>Loading...</div>;
//   }
//   const handleBack = () => {
//     navigate(-1);
//   };
 

//   return (
//     <div className="page-wrapper">
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <div className="back-btn dz-icon icon-fill icon-sm" onClick={handleBack}>
//               <i className='bx bx-arrow-back'></i>
//             </div>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">Product Details</h5>
//           </div>
//           <div className="right-content">
//             <Link to="/Cart" className="notification-badge dz-icon icon-sm icon-fill">
//               <i className='bx bx-cart bx-sm'></i>
//               <span className="badge badge-danger">{cartItemsCount}</span>
//             </Link>
//           </div>
//         </div>
//       </header>

//       <main className="page-content space-top p-b80">
//         <div className="container">
//           <div className="dz-product-preview">
//             <div className="swiper product-detail-swiper">
//               <div className="product-detail-image img">
//                 <img
//                   className="product-detail-image"
//                   src={productDetails.image}
//                   alt={productDetails.name}
//                 />
//               </div>
//               <div className="swiper-btn p-t15">
//                 <div className="swiper-pagination style-1"></div>
//               </div>
//             </div>
//           </div>
//           <div className="dz-product-detail">
//             <div className="detail-content">
//               <h3 className="title">{toTitleCase(productDetails.name)} ({toTitleCase(productDetails.veg_nonveg)})</h3>
//               <ul className="dz-top-meta mb-2">
//                 <li className="dz-review">
//                   <i className='bx bxs-star staricons'></i>
//                   <span className="r-rating">4.5</span>
//                   <span className="r-status">(470)</span>
//                 </li>
//                 <i
//                   className={`bx bx-heart bx-xs ${isLiked ? 'text-red' : ''}`}
//                   onClick={handleLikeClick}
//                   style={{ opacity: isLiked ? 1 : 'ee0a0a' }} // Set opacity based on isLiked state
//                 ></i>
//  {/* <img
//                   className="heart-icon"
//                   src={heartIcon}
//                   alt="Heart Icon"
//                   onClick={handleLikeClick}
               
//                 /> */}
                
//               </ul>
//             </div>
//             <div className="item-wrapper">
//               <div className="dz-meta-items">
//                 <div className="dz-price m-r60">
//                   <h6 className="dz-name">Price:</h6>
//                   <span className="price">₹{productDetails.price}<del>₹{productDetails.oldPrice}</del></span>
//                 </div>
               
//               </div>
//               <div className="description">
//                 <h6 className="sub-title">Spicy Index:</h6>
//                 <p className="mb-0">{toTitleCase(productDetails.spicy_index)}</p>
//               </div>
//               <div className="description">
//                 <h6 className="sub-title">Description:</h6>
//                 <p className="mb-0">{productDetails.description}</p>
//               </div>
//             </div>
//           </div>
//         </div>
       
//       </main>
     
//       <div className="footer-fixed-btn bottom-0">
//       {showQuantityError && <p style={{ color: 'red' ,textAlign:'center'}}>Please select a quantity.</p>}
//         <div className="d-flex align-items-center gap-2 justify-content-between">
//           <div className="dz-stepper1 input-group">
//             <div className="dz-stepper1" onClick={decrementQuantity}>
//               <i className="bx bx-minus"></i>
//             </div>
//             <input
//               className="form-control stepper-input1 text-center"
//               type="text"
//               value={quantity}
//               readOnly
//             />
//             <div className="dz-stepper1" onClick={incrementQuantity}>
//               <i className="bx bx-plus"></i>
//             </div>
//           </div>
          
//           <button onClick={handleAddToCart} className="btn btn-primary btn-lg btn-thin rounded-xl gap-3 w-100">
//             <i className='bx bx-cart bx-sm'></i>Add to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;



import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import heartIcon from '../assets/images/heart-regular-24 (1).png';

const ProductDetails = () => {
  const [productDetails, setProductDetails] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [showQuantityError, setShowQuantityError] = useState(false);
  const navigate = useNavigate();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [customer_id] = useState(1); // Set a default customer_id (for testing)

  // Utility function to convert a string to title case
  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch('http://194.195.116.199/user_api/get_menu_details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            restaurant_id: 13,
            menu_id: 8
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.st === 1 && data.lists) {
            const { name, veg_nonveg, spicy_index, price, description, image } = data.lists;
            const oldPrice = Math.floor(price * 1.1);
            setProductDetails({ name, veg_nonveg, spicy_index, price, oldPrice, description, image });
          } else {
            console.error('Invalid data format:', data);
          }
        } else {
          console.error('Network response was not ok.');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, []);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItemsCount(cartItems.length);
  }, []);

  const handleLikeClick = async () => {
    setIsLiked(!isLiked);
    try {
      const response = await fetch('http://194.195.116.199/user_api/save_favourite_menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          restaurant_id: 13,
          menu_id: 8,
          customer_id: customer_id
        })
      });

      if (response.ok) {
        console.log('Product added to favorites successfully!');
        navigate('/Wishlist');
        // Optionally, you can update local state or perform additional actions upon success
      } else {
        console.error('Failed to add product to favorites.');
      }
    } catch (error) {
      console.error('Error adding product to favorites:', error);
    }
  };

  const handleAddToCart = () => {
    if (quantity === 0) {
      setShowQuantityError(true);
      return;
    }

    if (!productDetails) return;

    const cartItem = { ...productDetails, quantity };
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.push(cartItem);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    setCartItemsCount(cartItems.length);
    navigate('/Cart');
  };

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 0) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      setShowQuantityError(false);
    }
  };

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="page-wrapper">
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <div className="back-btn dz-icon icon-fill icon-sm" onClick={handleBack}>
              <i className='bx bx-arrow-back'></i>
            </div>
          </div>
          <div className="mid-content">
            <h5 className="title">Product Details</h5>
          </div>
          <div className="right-content">
            <Link to="/Cart" className="notification-badge dz-icon icon-sm icon-fill">
              <i className='bx bx-cart bx-sm'></i>
              <span className="badge badge-danger">{cartItemsCount}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="page-content p-b80">
       
          {/* <div className="dz-product-preview"> */}
            <div className="swiper product-detail-swiper">
              <div className="product-detail-image img">
                <img
                  className="product-detail-image"
                  src={productDetails.image}
                  alt={productDetails.name}
                />
              </div>
              <div className="swiper-btn p-t15">
                <div className="swiper-pagination style-1"></div>
              </div>
            </div>
          {/* </div> */}
          <div className="container">
          <div className="dz-product-detail">
            <div className="detail-content">
              <h3 className="title">{toTitleCase(productDetails.name)} ({toTitleCase(productDetails.veg_nonveg)})<i
                  className={`bx bx-heart ${isLiked ? 'text-red' : ''}`}
                  onClick={handleLikeClick}
                  style={{ marginLeft: '210px', fontSize: '23px', cursor: 'pointer' ,position:'fixed'}}
                ></i></h3>
              
              <ul className="dz-top-meta mb-2">
                <li className="dz-review">
                  <i className='bx bxs-star staricons'></i>
                  <span className="r-rating">4.5</span>
                  <span className="r-status">(470)</span>
                </li>
                



              </ul>
            </div>
            <div className="item-wrapper">
              <div className="dz-meta-items">
                <div className="dz-price m-r60">
                  <h6 className="dz-name">Price:</h6>
                  <span className="price">₹{productDetails.price}<del>₹{productDetails.oldPrice}</del></span>
                </div>
              </div>
              <div className="description">
                <h6 className="sub-title">Spicy Index:</h6>
                <p className="mb-0">{toTitleCase(productDetails.spicy_index)}</p>
              </div>
              <div className="description">
                <h6 className="sub-title">Description:</h6>
                <p className="mb-0">{productDetails.description}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="footer-fixed-btn bottom-0">
        {showQuantityError && <p style={{ color: 'red', textAlign: 'center' }}>Please select a quantity.</p>}
        <div className="d-flex align-items-center gap-2 justify-content-between">
          <div className="dz-stepper1 input-group">
            <div className="dz-stepper1" onClick={decrementQuantity}>
              <i className="bx bx-minus"></i>
            </div>
            <input
              className="form-control stepper-input1 text-center"
              type="text"
              value={quantity}
              readOnly
            />
            <div className="dz-stepper1" onClick={incrementQuantity}>
              <i className="bx bx-plus"></i>
            </div>
          </div>
          
          <button onClick={handleAddToCart} className="btn btn-primary btn-lg btn-thin rounded-xl gap-3 w-100">
            <i className='bx bx-cart bx-sm'></i>Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
