// import React, { useEffect } from 'react';
// import Swiper from 'swiper';
// // import '../assets/vendor/swiper/swiper-bundle.min.css'
// const FeaturedArea = () => {
//     useEffect(() => {
//         const swiper = new Swiper('.featured-swiper', {
//             slidesPerView: 'auto',
//             spaceBetween: 20,
//             loop: true,
//             autoplay: {
//                 delay: 2500,
//                 disableOnInteraction: false,
//             },
//         });

//         return () => {
//             swiper.destroy();
//         };
//     }, []);
    
//     return (
//         <div className="dz-box style-3">
//             <div className="swiper featured-swiper">
//                 <div className="swiper-wrapper">
//                     <div className="swiper-slide">
//                         <div className="cart-list style-2">
//                             <div className="dz-media media-75">
//                                 <img src="assets/images/product/product2/4.png" alt="" />
//                             </div>
//                             <div className="dz-content">
//                                 <h6 className="title"><a href="product-detail.html">Royal Bluebell Bliss (M)</a></h6>
//                                 <ul className="dz-meta">
//                                     <li className="dz-price">$80<del>$95</del></li>
//                                     <li className="dz-review"><i className='bx bxs-star staricons'  ></i><span>(2k Review)</span></li>
//                                 </ul>
//                                 <div className="dz-off">40% Off</div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="swiper-slide">
//                         <div className="cart-list style-2">
//                             <div className="dz-media media-75">
//                                 <img src="assets/images/product/product2/5.png" alt="" />
//                             </div>
//                             <div className="dz-content">
//                                 <h6 className="title"><a href="product-detail.html">Large Majesty Palm (M)</a></h6>
//                                 <ul className="dz-meta">
//                                     <li className="dz-price">$80<del>$95</del></li>
//                                     <li className="dz-review"><i class='bx bxs-star staricons'  ></i><span>(2k Review)</span></li>
//                                 </ul>
//                                 <div className="dz-quantity">Quantity: <span className="quantity">1</span></div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="swiper-slide">
//                         <div className="cart-list style-2">
//                             <div className="dz-media media-75">
//                                 <img src="assets/images/product/product2/6.png" alt="" />
//                             </div>
//                             <div className="dz-content">
//                                 <h6 className="title"><a href="product-detail.html">Large Majesty Palm (M)</a></h6>
//                                 <ul className="dz-meta">
//                                     <li className="dz-price">$80<del>$95</del></li>
//                                     <li className="dz-review"><i class='bx bxs-star staricons'  ></i><span>(2k Review)</span></li>
//                                 </ul>
//                                 <div className="dz-quantity">Quantity: <span className="quantity">1</span></div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FeaturedArea;

import React, { useEffect, useState } from 'react';
import Swiper from 'swiper';

const FeaturedArea = () => {
    const [menuLists, setMenuLists] = useState([]);

    // Utility function to convert string to title case
    const toTitleCase = (str) => {
        return str.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const response = await fetch('http://194.195.116.199/user_api/get_product_list_with_offer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        restaurant_id: 13, // Specify your restaurant ID here
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.st === 1) {
                        // Convert text fields to title case before setting the state
                        const formattedMenuLists = data.lists.map((menu) => ({
                            ...menu,
                            name: toTitleCase(menu.name),
                            menu_cat_name: toTitleCase(menu.menu_cat_name),
                        }));
                        setMenuLists(formattedMenuLists);

                        // Initialize Swiper after setting menu data
                        new Swiper('.featured-swiper', {
                            slidesPerView: 'auto',
                            spaceBetween: 20,
                            loop: true,
                            autoplay: {
                                delay: 2500,
                                disableOnInteraction: false,
                            },
                        });
                    } else {
                        console.error('API Error:', data.msg);
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
        <div className="dz-box style-3">
            <div className="swiper featured-swiper">
                <div className="swiper-wrapper">
                    {menuLists.map((menu) => (
                        <div key={menu.menu_id} className="swiper-slide">
                            <div className="cart-list style-2" style={{padding:0}}>
                                <div className="dz-media media-75" >
                                    <img src={menu.image} alt="" style={{
                                            width: '100%',
                                            height: '200px', // Set a fixed height for the image
                                            objectFit: 'cover', // Ensure the image covers the entire space
                                        }} />
                                </div>
                                

                                <div className="dz-content" >
                                    <h6 className="title">
                                        <a href="product-detail.html">{menu.name}</a>
                                    </h6>
                                    <ul className="dz-meta">
                                        <li className="dz-price">₹{menu.price} <del>₹{Math.floor(menu.price * 1.1)}</del></li>
                                        {/* <li className="dz-review">
                                            <i className="bx bxs-star staricons"></i>
                                            <span>(2k Review)</span>
                                        </li> */}
                                    </ul>
                                    <div className="dz-quantity">{menu.menu_cat_name}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturedArea;

