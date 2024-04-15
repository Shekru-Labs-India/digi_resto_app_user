// import React from 'react';
// import { Link } from 'react-router-dom';
// import Bottom from '../component/bottom';

// // Import your images here
// import pic1 from '../assets/images/category/pic1.png';
// import pic2 from '../assets/images/category/pic2.png';
// import pic3 from '../assets/images/category/pic1.png';
// import pic4 from '../assets/images/category/pic4.png';
// // import { ArrowBack } from '@material-ui/icons';

// const Category = () => {
//     const categories = [
//         { id:1, name: 'Indoor Plants', image: pic1, count: 10 },
//         { id:2,name: 'House Plants', image: pic2, count: 8 },
//         {id:3, name: 'Tropical', image: pic3, count: 12 },
//         {id:4, name: 'Succulents', image: pic4, count: 6 },
//         {id:5, name: 'Indoor Plants', image: pic1, count: 10 },
//         {id:6, name: 'House Plants', image: pic2, count: 8 },
//         {id:7, name: 'Tropical', image: pic3, count: 12 },
//         {id:8, name: 'Succulents', image: pic4, count: 6 },
//         {id:9, name: 'Succulents', image: pic4, count: 6 },

//         // Add more categories as needed

//     ];

//     const uniqueCategories = Array.from(new Set(categories.map((category) => category.id)));
//     const totalCategoriesCount = uniqueCategories.length;

//     return (
//         <div className="page-wrapper">
//             {/* Header */}
//             <header className="header header-fixed style-3">
//                 <div className="header-content">
//                     <div className="left-content">
//                         <Link to="/HomeScreen" className="back-btn dz-icon icon-fill icon-sm">
//                         <i className='bx bx-arrow-back' ></i>
//                         </Link>
//                     </div>
//                     <div className="mid-content">
//                         <h5 className="title">Category <span className="items-badge">{totalCategoriesCount}</span></h5>

//                     </div>
//                     <div className="right-content">
// 				<Link to="/Search" className="dz-icon icon-fill icon-sm">
//                 <i class='bx bx-search-alt-2' ></i>
// 				</Link>
// 			</div>
//                 </div>
//             </header>
//             {/* Header End */}

//             {/* Main Content Start */}
//             <main className="page-content space-top p-b70">
//                 <div className="container">

//             <div class="row g-3 grid-style-1">
//             {categories.map((category, index) => (
// 					 <div className="col-6" key={index}>
// 						<div class="dz-card style-4">
// 							<h6 class="title"><a href="product-detail.html">   <a href="products.html">{category.name} {category.count}</a></a></h6>
// 							<div class="dz-media">
// 								<a href="product-detail.html">
//                                 <img src={category.image} alt="Category" />
// 								</a>
// 							</div>
						
// 						</div>
// 					</div>
//                 ))}
                   
            
                        
                           
                               
//                     </div>
//                 </div>
//             </main>
//             {/* Main Content End */}

//             {/* Footer */}
//             <Bottom />
//         </div>
//     );
// };

// export default Category;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Bottom from '../component/bottom';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [totalCategoriesCount, setTotalCategoriesCount] = useState(0);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://194.195.116.199/user_api/get_category_list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        restaurant_id: 13 // Provide the restaurant_id for the API request
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data && data.st === 1 && data.lists) {
                        setCategories(data.lists);
                        setTotalCategoriesCount(data.lists.length);
                    } else {
                        console.error('Invalid data format:', data);
                    }
                } else {
                    console.error('Network response was not ok.');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []); // Empty dependency array ensures the effect runs only once
    
    const toTitleCase = (str) => {
        return str.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };
    return (
        <div className="page-wrapper">
            {/* Header */}
            <header className="header header-fixed style-3">
                <div className="header-content">
                    <div className="left-content">
                        <Link to="/HomeScreen" className="back-btn dz-icon icon-fill icon-sm">
                            <i className='bx bx-arrow-back' ></i>
                        </Link>
                    </div>
                    <div className="mid-content">
                        <h5 className="title">Category <span className="items-badge">{totalCategoriesCount}</span></h5>
                    </div>
                    <div className="right-content">
                        <Link to="/Search" className="dz-icon icon-fill icon-sm">
                            <i className='bx bx-search-alt-2' ></i>
                        </Link>
                    </div>
                </div>
            </header>
            {/* Header End */}
            
            
            {/* Main Content Start */}
            <main className="page-content space-top p-b70">
                <div className="container">
                    <div className="row g-3 grid-style-1">
                        {categories.map((category, index) => (
                            <div className="col-6" key={index}>
                                <div className="dz-card style-4 text-center">
                                    <h6 className="title">
                                        <Link to={`/ProductDetails/${category.menu_cat_id}`}>{toTitleCase(category.name)} (10)</Link>
                                    </h6>
                                    <div className="dz-media">
                                        <Link to={`/ProductDetails/${category.menu_cat_id}`}>
                                            <img 
                                            style={{ width: '100%', height: '100px', borderRadius: '10px' }}
                                            src={category.image} 
                                            alt={category.name} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            {/* Main Content End */}

            {/* Footer */}
            <Bottom />
        </div>
    );
};

export default Category;




