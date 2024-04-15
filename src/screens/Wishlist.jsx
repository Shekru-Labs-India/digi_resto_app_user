// import React, { useEffect } from 'react';
// import ProductCard from '../component/Productcardwishlist';
// import { Link } from 'react-router-dom';
// import product from  '../assets/images/product/product4/1.png';
// import product1 from  '../assets/images/product/product4/2.png'
// import product2 from  '../assets/images/product/product4/3.png'
// import product3 from  '../assets/images/product/product4/4.png'
// import product4 from  '../assets/images/product/product4/5.png'
// import product5 from  '../assets/images/product/product4/5.png'
// import Bottom from '../component/bottom';
// import Swiper from 'swiper';
// import { ArrowBack, Search } from '@material-ui/icons';
// import ProductCard1 from '../component/Productcardwishlist';
// import Productcartwishlist from '../component/Productcardwishlist';
// const Wishlist = () => {


  

// //   useEffect(() => {
// //     const swiper = new Swiper('.category-slide', {
// //         slidesPerView: 'auto',
// //         spaceBetween: 10,
// //     });

// //     return () => {
// //         swiper.destroy();
// //     };
// // }, []);
//   return (
//     <div className="page-wrapper">
//       {/* Preloader */}
//       {/* <div id="preloader">
//         <div className="loader">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       </div> */}
//       {/* Preloader end*/}
      
//       {/* Header */}
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link to="/HomeScreen" className="back-btn dz-icon icon-fill icon-sm">
//               {/* <i className="fi fi-rs-angle-left"></i> */}
//               {/* <ArrowBack />  */}
//               <i className='bx bx-arrow-back' ></i>
//             </Link>
//           </div>
//           <div className="mid-content"><h5 className="title">Favourite <span className="items-badge">5</span></h5></div>
//           <div className="right-content">
//             <Link to="/Search" className="dz-icon icon-fill icon-sm">
//             {/* <Search />  */}
//             <i class='bx bx-search-alt-2' ></i>
//             </Link>
//           </div>
//         </div>
//       </header>
//       {/* Header */}
      
//       {/* Main Content Start */}
//       <main className="page-content space-top p-b70">
//         <div className="container">
//           {/* <div className="swiper category-slide mb-3">
//             <div className="swiper-wrapper">
//               <div className="swiper-slide"> 
//                 <a href="category.html" className="category-btn">Trees</a>
//               </div>
//               <div className="swiper-slide">
//                 <a href="category.html" className="category-btn">Shrubs</a>
//               </div>
//               <div className="swiper-slide"> 
//                 <a href="category.html" className="category-btn">Herbs</a>
//               </div>
//               <div className="swiper-slide"> 
//                 <a href="category.html" className="category-btn">Vines</a>
//               </div>
//               <div className="swiper-slide"> 
//                 <a href="category.html" className="category-btn">Ferns</a>
//               </div>
//               <div className="swiper-slide"> 
//                 <a href="category.html" className="category-btn">Herbs</a>
//               </div>
//               <div className="swiper-slide"> 
//                 <a href="category.html" className="category-btn">Vines</a>
//               </div>
//             </div>
//           </div> */}
//           <div className="row g-3">
//           <Productcartwishlist
//           imageUrl={product}
//           productName="Amber Orchid Oasis (M)"
//           price="89"
//           oldPrice="99"
//           restaurantName="Resto Name"
//         />

//    <Productcartwishlist
//           imageUrl={product1}
      
//           productName="Amber Orchid Oasis (M)"
//           price="89"
//           oldPrice="99"
//           restaurantName="Resto Name"
//         />
//          <Productcartwishlist
//           imageUrl={product5}
//           productName="Amber Orchid Oasis (M)"
//           price="89"
//           oldPrice="99"
//           restaurantName="Resto Name"
//         />
//          <Productcartwishlist
//           imageUrl={product2}
//           productName="Amber Orchid Oasis (M)"
//           price="89"
//           oldPrice="99"
//           restaurantName="Resto Name"
//         />
//          <Productcartwishlist
//           imageUrl={product3}
//           productName="Amber Orchid Oasis (M)"
//           price="89"
//           oldPrice="99"
//           restaurantName="Resto Name"
//         />
//          <Productcartwishlist
//           imageUrl={product4}
//           productName="Amber Orchid Oasis (M)"
//           price="89"
//           oldPrice="99"
//           restaurantName="Resto Name"
//         />
//           </div>
//         </div>
//       </main>
//       {/* Main Content End */}
//       <Bottom></Bottom>
//     </div>
//   );
// }

// export default Wishlist;




// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import Bottom from '../component/bottom';
// import Productcartwishlist from '../component/Productcardwishlist';

// const Wishlist = () => {
//     const [menuList, setMenuList] = useState([]);

//     const removeItem = (indexToRemove) => {
//         // Filter out the item to be removed based on index
//         const updatedMenuList = menuList.filter((item, index) => index !== indexToRemove);
//         setMenuList(updatedMenuList);
//     };
//     // Function to convert a string to title case
//     const toTitleCase = (str) => {
//         return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
//     };

//     useEffect(() => {
//         const fetchMenuData = async () => {
//             try {
//                 const response = await fetch('http://194.195.116.199/user_api/get_favourite_list', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({
//                         customer_id: 1
//                     })
//                 });

//                 if (response.ok) {
//                     const data = await response.json();
//                     if (data.st === 1 && Array.isArray(data.lists)) {
//                         // Calculate oldPrice based on menu price
//                         const updatedMenuList = data.lists.map(menu => ({
//                             ...menu,
//                             oldPrice: Math.floor(menu.price * 1.1)
//                         }));
//                         setMenuList(updatedMenuList);
//                     } else {
//                         console.error('Invalid data format:', data);
//                     }
//                 } else {
//                     console.error('Network response was not ok.');
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         };

//         fetchMenuData();
//     }, []);

//     return (
//         <div className="page-wrapper">
//             <header className="header header-fixed style-3">
//                 <div className="header-content">
//                     <div className="left-content">
//                         <Link to="/HomeScreen" className="back-btn dz-icon icon-fill icon-sm">
//                             <i className='bx bx-arrow-back'></i>
//                         </Link>
//                     </div>
//                     <div className="mid-content"><h5 className="title">Favourite <span className="items-badge">{menuList.length}</span></h5></div>
//                     <div className="right-content">
//                         <Link to="/Search" className="dz-icon icon-fill icon-sm">
//                             <i className='bx bx-search-alt-2'></i>
//                         </Link>
//                     </div>
//                 </div>
//             </header>

//             <main className="page-content space-top p-b70">
//                 <div className="container">
//                     <div className="row g-3">
//                         {menuList.map((menu, index) => (
//                             <Productcartwishlist
//                                 key={index}
//                                 imageUrl={menu.image}
//                                 productName={toTitleCase(menu.name)}
//                                 price={menu.price}
//                                 oldPrice={menu.oldPrice}
//                                 restaurantName={toTitleCase(menu.restaurant_name)}
//                                 onRemove={() => removeItem(index)} // Pass removeItem function as onRemove prop
                              
//                             />
//                         ))}
//                     </div>
//                 </div>
//             </main>

//             <Bottom />
//         </div>
//     );
// }

// export default Wishlist;


// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import Bottom from '../component/bottom';
// import Productcartwishlist from '../component/Productcardwishlist';

// const Wishlist = () => {
//   const [menuList, setMenuList] = useState([]);

//   const removeItem = (indexToRemove) => {
//     const updatedMenuList = menuList.filter((item, index) => index !== indexToRemove);
//     setMenuList(updatedMenuList);
//   };

//   const addToCart = (item) => {
//     // Retrieve the existing cart items from localStorage or initialize as an empty array
//     const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

//     // Add the new item to the cart items list
//     const updatedCartItems = [...cartItems, item];

//     // Update localStorage with the updated cart items list
//     localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
//   };

//   const toTitleCase = (str) => {
//     return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
//   };

//   useEffect(() => {
//     const fetchMenuData = async () => {
//       try {
//         const response = await fetch('http://194.195.116.199/user_api/get_favourite_list', {
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

//   return (
//     <div className="page-wrapper">
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link to="/HomeScreen" className="back-btn dz-icon icon-fill icon-sm">
//               <i className='bx bx-arrow-back'></i>
//             </Link>
//           </div>
//           <div className="mid-content"><h5 className="title">Favourite <span className="items-badge">{menuList.length}</span></h5></div>
//           <div className="right-content">
//             <Link to="/Search" className="dz-icon icon-fill icon-sm">
//               <i className='bx bx-search-alt-2'></i>
//             </Link>
//           </div>
//         </div>
//       </header>

//       <main className="page-content space-top p-b70">
//         <div className="container">
//           <div className="row g-3">
//             {menuList.map((menu, index) => (
//               <Productcartwishlist
//                 key={index}
//                 image={menu.image}
//                 name={toTitleCase(menu.name)}
//                 price={menu.price}
//                 oldPrice={menu.oldPrice}
//                 restaurantName={toTitleCase(menu.restaurant_name)}
//                 onRemove={() => removeItem(index)} // Pass removeItem function as onRemove prop
//                 onAddToCart={addToCart} // Pass addToCart function as onAddToCart prop
//               />
//             ))}
//           </div>
//         </div>
//       </main>

//       <Bottom />
//     </div>
//   );
// };

// export default Wishlist;



// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import Bottom from '../component/bottom';
// import Productcartwishlist from '../component/Productcardwishlist';

// const Wishlist = () => {
//   const [menuList, setMenuList] = useState([]);

//   const removeItem = (indexToRemove) => {
//     const updatedMenuList = menuList.filter((item, index) => index !== indexToRemove);
//     setMenuList(updatedMenuList);
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
//         const response = await fetch('http://194.195.116.199/user_api/get_favourite_list', {
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

//   return (
//     <div className="page-wrapper">
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link to="/HomeScreen" className="back-btn dz-icon icon-fill icon-sm">
//               <i className='bx bx-arrow-back'></i>
//             </Link>
//           </div>
//           <div className="mid-content"><h5 className="title">Favourite <span className="items-badge">{menuList.length}</span></h5></div>
//           <div className="right-content">
//             <Link to="/Search" className="dz-icon icon-fill icon-sm">
//               <i className='bx bx-search-alt-2'></i>
//             </Link>
//           </div>
//         </div>
//       </header>

//       <main className="page-content space-top p-b70">
//         <div className="container">
//           <div className="row g-3">
//             {menuList.map((menu, index) => (
//               <Productcartwishlist
//                 key={index}
//                 image={menu.image}
//                 name={toTitleCase(menu.name)}
//                 price={menu.price}
//                 oldPrice={menu.oldPrice}
//                 restaurantName={toTitleCase(menu.restaurant_name)}
//                 onRemove={() => removeItem(index)} // Pass removeItem function as onRemove prop
//                 onAddToCart={() => addToCart(menu)} // Pass addToCart function with item as onAddToCart prop
//               />
//             ))}
//           </div>
//         </div>
//       </main>

//       <Bottom />
//     </div>
//   );
// };

// export default Wishlist;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Bottom from '../component/bottom';
import Productcartwishlist from '../component/Productcardwishlist';

const Wishlist = () => {
  const [menuList, setMenuList] = useState([]);

  const removeItem = async (indexToRemove, restaurantId, menuId, customerId) => {
    // Frontend request data
    const requestData = {
      restaurant_id: restaurantId,
      menu_id: menuId,
      customer_id: customerId
    };

    try {
      const response = await fetch('http://194.195.116.199/user_api/delete_favourite_menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
        
      });
      console.log(requestData)
      if (response.ok) {
        // If the removal is successful, update the local menu list state
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
    // Retrieve the existing cart items from localStorage or initialize as an empty array
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Add the new item to the cart items list with a default quantity of 1
    const updatedCartItems = [...cartItems, { ...item, quantity: 1 }];

    // Update localStorage with the updated cart items list
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const toTitleCase = (str) => {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch('http://194.195.116.199/user_api/get_favourite_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            customer_id: 1
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
          console.error('Network response was not ok.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMenuData();
  }, []);

  return (
    <div className="page-wrapper">
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <Link to="/HomeScreen" className="back-btn dz-icon icon-fill icon-sm">
              <i className='bx bx-arrow-back'></i>
            </Link>
          </div>
          <div className="mid-content"><h5 className="title">Favourite <span className="items-badge">{menuList.length}</span></h5></div>
          <div className="right-content">
            <Link to="/Search" className="dz-icon icon-fill icon-sm">
              <i className='bx bx-search-alt-2'></i>
            </Link>
          </div>
        </div>
      </header>

      <main className="page-content space-top p-b70">
        <div className="container">
          <div className="row g-3">
            {menuList.map((menu, index) => (
              <Productcartwishlist
                key={index}
                image={menu.image}
                name={toTitleCase(menu.name)}
                price={menu.price}
                oldPrice={menu.oldPrice}
                restaurantName={toTitleCase(menu.restaurant_name)}
                onRemove={() => removeItem(index, menu.restaurant_id, menu.menu_id, 1)} // Pass required parameters to removeItem
                onAddToCart={() => addToCart(menu)} // Pass addToCart function with item as onAddToCart prop
              />
            ))}
          </div>
        </div>
      </main>

      <Bottom />
    </div>
  );
};

export default Wishlist;
