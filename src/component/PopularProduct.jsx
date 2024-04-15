// import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import Swiper from 'swiper';
// import ProductCard from './ProductCart';


// const PopularProducts = () => {
//     useEffect(() => {
//         const swiper = new Swiper('.category-slide', {
//             slidesPerView: 'auto',
//             spaceBetween: 10,
//         });

//         return () => {
//             swiper.destroy();
//         };
//     }, []);

//     return (
//         <div className="dz-box">
//             <div className="title-bar">
//                 <h5 className="title p-r50">Menu Category</h5>
//                 <Link to="/Product"><i class='bx bx-right-arrow-alt bx-sm'></i></Link>
//             </div>
//             <div className="swiper category-slide">
//                 <div className="swiper-wrapper">
//                     <div className="swiper-slide">    
//                         <Link to="/category" className="category-btn">Trees</Link>
//                     </div>
//                     <div className="swiper-slide">
//                         <Link to="/category" className="category-btn">Shrubs</Link>
//                     </div>
//                     <div className="swiper-slide">    
//                         <Link to="/category" className="category-btn">Herbs</Link>
//                     </div>
//                     <div className="swiper-slide">    
//                         <Link to="/category" className="category-btn">Vines</Link>
//                     </div>
//                     <div className="swiper-slide">    
//                         <Link to="/category" className="category-btn">Ferns</Link>
//                     </div>
//                     <div className="swiper-slide">    
//                         <Link to="/category" className="category-btn">Herbs</Link>
//                     </div>
//                     <div className="swiper-slide">    
//                         <Link to="/category" className="category-btn">Vines</Link>
//                     </div>
//                     <div className="swiper-slide">    
//                         <Link to="/category" className="category-btn">Ferns</Link>
//                     </div>
//                     <div className="swiper-slide">    
//                         <Link to="/category" className="category-btn">Herbs</Link>
//                     </div>
//                 </div>
//             </div>
//             {/* <ProductCard/>  */}
//         </div>
       
//     );
// };

// export default PopularProducts;


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swiper from 'swiper';

const PopularProducts = () => {
    const [menuCategories, setMenuCategories] = useState([]);

    // Utility function to convert string to title case
    const toTitleCase = (str) => {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };

    useEffect(() => {
        const fetchMenuCategories = async () => {
            try {
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        restaurant_id: 13
                    })
                };

                const response = await fetch('http://194.195.116.199/user_api/get_category_list', requestOptions);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                if (data.st === 1 && Array.isArray(data.lists)) {
                    // Convert category names to title case before setting state
                    const formattedCategories = data.lists.map(category => ({
                        ...category,
                        name: toTitleCase(category.name) // Convert category name to title case
                    }));
                    setMenuCategories(formattedCategories);
                } else {
                    setMenuCategories([]);
                }
            } catch (error) {
                console.error('Error fetching menu categories:', error);
                setMenuCategories([]);
            }
        };

        fetchMenuCategories();
    }, []);

    useEffect(() => {
        const swiper = new Swiper('.category-slide', {
            slidesPerView: 'auto',
            spaceBetween: 10,
        });

        return () => {
            swiper.destroy();
        };
    }, [menuCategories]); // Re-run effect when menuCategories changes

    return (
        <div className="dz-box">
            <div className="title-bar">
                <h5 className="title p-r50">Menu Category</h5>
                <Link to="/Category"><i className='bx bx-right-arrow-alt bx-sm'></i></Link>
            </div>
            <div className="swiper category-slide">
                <div className="swiper-wrapper">
                    {menuCategories.map((category) => (
                        <div className="swiper-slide" key={category.menu_cat_id}>
                            <Link to={`/category/${category.menu_cat_id}`} className="category-btn">{category.name}</Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PopularProducts;

