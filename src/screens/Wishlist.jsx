 



// import React, { useState, useEffect } from 'react';
// import { Link ,useNavigate} from 'react-router-dom';

// import Bottom from '../component/bottom';
// import Productcartwishlist from '../component/Productcardwishlist';
// import SigninButton from '../constants/SigninButton';

// const Wishlist = () => {
//   const [menuList, setMenuList] = useState([]);
//   const navigate = useNavigate();
//   const removeItem = async (indexToRemove, restaurantId, menuId, customerId) => {
//     // Frontend request data
//     const requestData = {
//       restaurant_id: restaurantId,
//       menu_id: menuId,
//       customer_id: customerId
//     };

//     try {
//       const response = await fetch('https://menumitra.com/user_api/delete_favourite_menu', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(requestData)
        
//       });
//       console.log(requestData)
//       if (response.ok) {
//         // If the removal is successful, update the local menu list state
//         const updatedMenuList = [...menuList];
//         updatedMenuList.splice(indexToRemove, 1);
//         setMenuList(updatedMenuList);
//       } else {
//         console.error('Failed to remove item from wishlist');
//       }
//     } catch (error) {
//       console.error('Error removing item from wishlist:', error);
//     }
//   };

//   const addToCart = (item) => {
//     // Retrieve the existing cart items from localStorage or initialize as an empty array
//     const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

//     // Add the new item to the cart items list with a default quantity of 1
//     const updatedCartItems = [...cartItems, { ...item, quantity: 1 }];

//     // Update localStorage with the updated cart items list
//     localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
//   };

//   const toTitleCase = (str) => {
//     return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
//   };

//   useEffect(() => {
//     const fetchMenuData = async () => {
//       try {
//         const response = await fetch('https://menumitra.com/user_api/get_favourite_list', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             customer_id: 1
//           })
//         });

//         if (response.ok) {
//           const data = await response.json();
//           if (data.st === 1 && Array.isArray(data.lists)) {
//             const updatedMenuList = data.lists.map(menu => ({
//               ...menu,
//               oldPrice: Math.floor(menu.price * 1.1)
//             }));
//             setMenuList(updatedMenuList);
//           } else {
//             console.error('Invalid data format:', data);
//           }
//         } else {
//           console.error('Network response was not ok.');
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchMenuData();
//   }, []);

//   const userData = JSON.parse(localStorage.getItem('userData'));

//   return (
//     <div className="page-wrapper">
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             {/* <Link to="/HomeScreen" className="back-btn dz-icon icon-fill icon-sm">
//               <i className='bx bx-arrow-back'></i>
//             </Link> */}
//             <Link to="/HomeScreen" className="back-btn dz-icon icon-fill icon-sm" onClick={() => navigate(-1)}>
//   <i className='bx bx-arrow-back'></i>
// </Link>

//           </div>
//           <div className="mid-content"><h5 className="title">Favourite  {userData && <span className="items-badge">{menuList.length}</span>}</h5></div>
//           <div className="right-content">
//             <Link to="/Search" className="dz-icon icon-fill icon-sm">
//               <i className='bx bx-search-alt-2'></i>
//             </Link>
//           </div>
//         </div>
//       </header>

//       <main className="page-content space-top p-b70">
//         <div className="container">
//         {userData ? (
//           <div className="row g-3">
//             {menuList.map((menu, index) => (
//               <Productcartwishlist
//                 key={index}
//                 image={menu.image}
//                 name={toTitleCase(menu.name)}
//                 price={menu.price}
//                 oldPrice={menu.oldPrice}
//                 restaurantName={toTitleCase(menu.restaurant_name)}
//                 onRemove={() => removeItem(index, menu.restaurant_id, menu.menu_id, 1)} // Pass required parameters to removeItem
//                 onAddToCart={() => addToCart(menu)} // Pass addToCart function with item as onAddToCart prop
//               />
//             ))}
//           </div>
//             ) : (
//               // User is not authenticated, render sign-in button
//             <SigninButton></SigninButton>
//             )}
//         </div>
//       </main>

//       <Bottom />
//     </div>
//   );
// };

// export default Wishlist; 



// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import images from '../assets/MenuDefault.png';
// import Bottom from '../component/bottom';
// import SigninButton from '../constants/SigninButton';

// const Wishlist = () => {
//   const [menuList, setMenuList] = useState([]);
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem('userData'));
//   const customerId = userData ? userData.customer_id : null;
//   const removeItem = async (indexToRemove, restaurantId, menuId, customerId) => {
//     const requestData = {
//       restaurant_id: restaurantId,
//       menu_id: menuId,
//       customer_id: customerId
//     };

//     try {
//       const response = await fetch('https://menumitra.com/user_api/delete_favourite_menu', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(requestData)
//       });

//       if (response.ok) {
//         const updatedMenuList = [...menuList];
//         updatedMenuList.splice(indexToRemove, 1);
//         setMenuList(updatedMenuList);
//       } else {
//         console.error('Failed to remove item from wishlist');
//       }
//     } catch (error) {
//       console.error('Error removing item from wishlist:', error);
//     }
//   };

//   const addToCart = (item) => {
//     const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
//     const updatedCartItems = [...cartItems, { ...item, quantity: 1 }];
//     localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
//   };

//   const toTitleCase = (str) => {
//     return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
//   };

//   useEffect(() => {
//     const fetchMenuData = async (customerId) => {
//       try {
//         const response = await fetch('https://menumitra.com/user_api/get_favourite_list', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             customer_id: customerId
//           })
//         });
//   console.log(customerId)
//         if (response.ok) {
//           const data = await response.json();
//           if (data.st === 1 && Array.isArray(data.lists)) {
//             console.log(data.lists); // Check the structure of the lists array
//             const updatedMenuList = data.lists.map(menu => ({
//               ...menu,
//               oldPrice: Math.floor(menu.price * 1.1)
//             }));
//             setMenuList(updatedMenuList);
//           } else {
//             console.error('Invalid data format:', data);
//           }
          
//         } else {
//           console.error('Network response was not ok:', response.statusText);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
  
//  // Fetch menu data only if customerId is available
//  if (customerId) {
//   fetchMenuData(customerId);
// }
// }, [customerId]);

  
// console.log(customerId)
//   const handleRemoveItemClick = (index, restaurantId, menuId, customerId) => {
//     removeItem(index, restaurantId, menuId, customerId);
//   };

//   const handleAddToCartClick = (item) => {
//     addToCart(item);
//     navigate('/Cart');
//   };

//   return (
//     <div className="page-wrapper">
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link to="/HomeScreen" className="back-btn dz-icon icon-fill icon-sm" onClick={() => navigate(-1)}>
//               <i className="bx bx-arrow-back"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">Favourite {userData && <span className="items-badge">{menuList.length}</span>}</h5>
//           </div>
//           <div className="right-content">
//             <Link to="/Search" className="dz-icon icon-fill icon-sm">
//               <i className="bx bx-search-alt-2"></i>
//             </Link>
//           </div>
//         </div>
//       </header>

//       <main className="page-content space-top p-b70">
//         <div className="container">
//           {userData ? (
//             <div className="row g-3">
//               {menuList.map((menu, index) => (
//                 <div className="col-12" key={index}>
//                   <div className="dz-card list-style style-3">
//                     <div className="dz-media">
//                       <Link to={`/ProductDetails/${menu.menu_id}`}>
//                         <img
//                           style={{ width: '100px', height: '100px' }}
//                           src={menu.image}
//                           alt={menu.name}
//                           onError={(e) => {
//                             e.target.src = images;
//                             e.target.style.width = '100px';
//                             e.target.style.height = '100px';
//                           }}
//                         />
//                       </Link>
//                     </div>
//                     <div className="dz-content">
//                       <h5 className="title">
//                         <Link to={`/ProductDetails/${menu.menu_id}`}>{toTitleCase(menu.name)}</Link>
//                       </h5>
//                       <ul className="dz-meta">
//                         <li className="dz-price">
//                           ₹{menu.price}
//                           {menu.oldPrice && <del>₹{menu.oldPrice}</del>}
//                         </li>
//                       </ul>
//                       <div onClick={() => handleRemoveItemClick(index, menu.restaurant_id, menu.menu_id, 1)} className="remove-text">
//                         Remove
//                       </div>
//                       <div onClick={() => handleAddToCartClick(menu)} className="cart-btn">
//                         <i className="bx bx-cart bx-sm"></i>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <SigninButton />
//           )}
//         </div>
//       </main>

//       <Bottom />
//     </div>
//   );
// };

// export default Wishlist;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import images from '../assets/MenuDefault.png';
import Bottom from '../components/Bottom';
import SigninButton from '../constants/SigninButton';

const Wishlist = () => {
  const [menuList, setMenuList] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Add loading state

  const userData = JSON.parse(localStorage.getItem('userData'));
  const customerId = userData ? userData.customer_id : null;

  const removeItem = async (indexToRemove, restaurantId, menuId, customerId) => {
    const requestData = {
      restaurant_id: restaurantId,
      menu_id: menuId,
      customer_id: customerId
    };

    try {
      const response = await fetch('https://menumitra.com/user_api/delete_favourite_menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const updatedMenuList = [...menuList];
        updatedMenuList.splice(indexToRemove, 1);
        setMenuList(updatedMenuList);
      } else {
        console.error('Failed to remove item from wishlist');
      }
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };

  const addToCart = (item) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const updatedCartItems = [...cartItems, { ...item, quantity: 1 }];
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const isMenuItemInCart = (menuId) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    return cartItems.some(item => item.menu_id === menuId);
  };

  const toTitleCase = (str) => {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  useEffect(() => {
    const fetchMenuData = async (customerId) => {
      setLoading(true); // Set loading to true before the API call
      try {
        const response = await fetch('https://menumitra.com/user_api/get_favourite_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            customer_id: customerId
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.st === 1 && Array.isArray(data.lists)) {
            const updatedMenuList = data.lists.map(menu => ({
              ...menu,
              oldPrice: Math.floor(menu.price * 1.1)
            }));
            setMenuList(updatedMenuList);
          } else {
            console.error('Invalid data format:', data);
          }
        } else {
          console.error('Network response was not ok:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Set loading to false after the API call
      }
    };

    // Fetch menu data only if customerId is available
    if (customerId) {
      fetchMenuData(customerId);
    }
  }, [customerId]);

  const handleRemoveItemClick = (index, restaurantId, menuId, customerId) => {
    removeItem(index, restaurantId, menuId, customerId);
  };

  const handleAddToCartClick = (item) => {
    addToCart(item);
    navigate('/Cart');
  };

  return (
    <div className="page-wrapper">
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
          <header className="header header-fixed style-3">
            <div className="header-content">
              <div className="left-content">
                <Link to="/HomeScreen" className="back-btn dz-icon icon-fill icon-sm" onClick={() => navigate(-1)}>
                  <i className="bx bx-arrow-back"></i>
                </Link>
              </div>
              <div className="mid-content">
                <h5 className="title">Favourite {userData && <span className="items-badge">{menuList.length}</span>}</h5>
              </div>
              <div className="right-content">
                <Link to="/Search" className="dz-icon icon-fill icon-sm">
                  <i className="bx bx-search-alt-2"></i>
                </Link>
              </div>
            </div>
          </header>

          <main className="page-content space-top p-b70">
            <div className="container">
              {userData ? (
                <div className="row g-3">
                  {menuList.map((menu, index) => (
                    <div className="col-12" key={index}>
                      <div className="dz-card list-style style-3">
                        <div className="dz-media">
                          <Link to={`/ProductDetails/${menu.menu_id}`}>
                            <img
                              style={{ width: '100px', height: '100px' }}
                              src={menu.image || images} // Use default image if menu.image is null
                              alt={menu.name}
                              onError={(e) => {
                                e.target.src = images; // Set local image source on error
                                e.target.style.width = '100px'; // Set width of the local image
                                e.target.style.height = '100px'; // Set height of the local image
                              }}
                            />
                          </Link>
                        </div>
                        <div className="dz-content">
                          <h5 className="title">
                            <Link to={`/ProductDetails/${menu.menu_id}`}>{toTitleCase(menu.name)}</Link>
                          </h5>
                          <ul className="dz-meta">
                            <li className="dz-price">
                              ₹{menu.price}
                              {menu.oldPrice && <del>₹{menu.oldPrice}</del>}
                            </li>
                          </ul>
                          <div onClick={() => handleRemoveItemClick(index, menu.restaurant_id, menu.menu_id, 1)} className="remove-text">
                            Remove
                          </div>
                          <div onClick={() => handleAddToCartClick(menu)} className="cart-btn">
                            {isMenuItemInCart(menu.menu_id) ? (
                              <i className="bx bxs-cart bx-sm"></i>
                            ) : (
                              <i className="bx bx-cart-add bx-sm"></i>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <SigninButton />
              )}
            </div>
          </main>

          <Bottom />
        </>
      )}
    </div>
  );
};

export default Wishlist;

