// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import images from '../assets/MenuDefault.png'

// const Search = () => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchedMenu, setSearchedMenu] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);

//     const handleSearch = async (event) => {
//         const term = event.target.value;
//         setSearchTerm(term);
//     };

//     const toTitleCase = (str) => {
//         return str.replace(/\w\S*/g, function(txt) {
//             return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//         });
//     };

//     useEffect(() => {
//         const fetchSearchedMenu = async () => {
//             if (searchTerm.trim() === '') {
//                 setSearchedMenu([]); // Clear the menu list if search term is empty
//                 return;
//             }

//             setIsLoading(true);

//             try {
//                 const response = await fetch('http://194.195.116.199/user_api/search_menu', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({
//                         restaurant_id: 13,
//                         keyword: searchTerm.trim()
//                     })
//                 });

//                 if (response.ok) {
//                     const data = await response.json();
//                     if (data.st === 1 && Array.isArray(data.lists)) {
//                         const formattedMenu = data.lists.map(menu => ({
//                             ...menu,
//                             name: toTitleCase(menu.name) // Convert menu name to title case
//                         }));
//                         setSearchedMenu(formattedMenu);
//                     } else {
//                         console.error('Invalid data format:', data);
//                     }
//                 } else {
//                     console.error('Network response was not ok.');
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }

//             setIsLoading(false);
//         };

//         fetchSearchedMenu();
//     }, [searchTerm]);

//     const handleClearAll = () => {
//         setSearchedMenu([]);
//     };

//     return (
//         <div className="page-wrapper">
//             {/* Header */}
//             <header className="header header-fixed style-3 py-2">
//                 <div className="header-content">
//                     <div className="search-area">
//                         <Link to="/HomeScreen" className="back-btn icon-fill dz-icon">
//                             <i className='bx bx-arrow-back'></i>
//                         </Link>
//                         <div className="input w-100">
//                             <input
//                                 type="search"
//                                 className="form-control rounded-md style-2"
//                                 placeholder="Search Best items for You"
//                                 onChange={handleSearch}
//                                 value={searchTerm}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </header>
//             {/* Header End */}

//             {/* Main Content Start */}
//             <main className="page-content p-t80 p-b40">
//                 <div className="container">
//                     {/* Searched Menu List */}
//                     <div className="title-bar mb-2">
//                         <h4 className="title mb-0 font-w500">Searched Menu</h4>
//                         <div className="font-w500 font-12" onClick={handleClearAll}>Clear All</div>
//                     </div>

//                     {isLoading && <p>Loading...</p>}

//                     {searchedMenu.map((menu) => (
//                         <div className="swiper-slide search-content1" key={menu.menu_id}>
//                             <div className="cart-list style-2">
//                                 <div className="dz-media media-75">
//                                     {/* <img src={menu.image} alt={menu.name} /> */}
//                                     <img

//                                      style={{
//                                         width: '100%',
//                                         height: '100%',
//                                         objectFit: "cover",
//                                       }}
//   src={menu.image}
//   alt={menu.name}
//   onError={(e) => {
//     e.target.src = images; // Set local image source on error
//     e.target.style.width = '80px'; // Example: Set width of the local image
//     e.target.style.height = '80px'; // Example: Set height of the local image
  
//   }}
// />
//                                 </div>
//                                 <div className="dz-content">
//                                     <h6 className="title">{menu.name}</h6>
//                                     <ul className="dz-meta">
//                                         <li className="dz-price">₹{menu.price.toFixed(2)}</li>
                                        
//                                     </ul>
//                                     <div className="dz-off">{menu.veg_nonveg === 'veg' ? 'Veg' : 'Non-Veg'}</div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </main>
//             {/* Main Content End */}
//         </div>
//     );
// };

// export default Search;


// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
// import images from '../assets/MenuDefault.png';
// import { useRestaurantId } from '../context/RestaurantIdContext';
// import Bottom from '../component/bottom';

// const Search = () => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchedMenu, setSearchedMenu] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate(); // Access the navigate function using useNavigate
//     const { restaurantId } = useRestaurantId();
//     const handleSearch = async (event) => {
//         const term = event.target.value;
//         setSearchTerm(term);
//     };

//     const toTitleCase = (str) => {
//         return str.replace(/\w\S*/g, function(txt) {
//             return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//         });
//     };

   
//     useEffect(() => {
//         const fetchSearchedMenu = async () => {
//             if (searchTerm.trim() === '') {
//                 setSearchedMenu([]); // Clear the menu list if search term is empty
//                 return;
//             }

//             setIsLoading(true);

//             try {
//                 const response = await fetch('https://menumitra.com/user_api/search_menu', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({
//                         restaurant_id:13,
//                         keyword: searchTerm.trim()
//                     })
//                 });
// console.log(restaurantId)
//                 if (response.ok) {
//                     const data = await response.json();
//                     if (data.st === 1 && Array.isArray(data.lists)) {
//                         const formattedMenu = data.lists.map(menu => ({
//                             ...menu,
//                             name: toTitleCase(menu.name) // Convert menu name to title case
//                         }));
//                         setSearchedMenu(formattedMenu);
//                     } else {
//                         console.error('Invalid data format:', data);
//                     }
//                 } 
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }

//             setIsLoading(false);
//         };

//         fetchSearchedMenu();
//     }, [searchTerm, restaurantId]);

//     const handleClearAll = () => {
//         setSearchedMenu([]);
//     };

//     return (
//         <div className="page-wrapper">
//             {/* Header */}
//             <header className="header header-fixed style-3 py-2">
//                 <div className="header-content">
//                     <div className="search-area">
//                     <div onClick={() => navigate(-1)} className="back-btn icon-fill dz-icon">
//                             <i className='bx bx-arrow-back'></i>
//                         </div>
//                         <div className="input w-100">
//                             <input
//                                 type="search"
//                                 className="form-control rounded-md style-2"
//                                 placeholder="Search Best items for You"
//                                 onChange={handleSearch}
//                                 value={searchTerm}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </header>
//             {/* Header End */}

//             {/* Main Content Start */}
//             <main className="page-content p-t80 p-b40">
//                 <div className="container">
//                     {/* Searched Menu List */}
//                     <div className="title-bar mb-2">
//                         <h4 className="title mb-0 font-w500">Searched Menu</h4>
//                         <div className="font-w500 font-12" onClick={handleClearAll}>Clear All</div>
//                     </div>

//                     {isLoading && <p>Loading...</p>}

//                     {searchedMenu.map((menu) => (
//                         <div className="swiper-slide search-content1" key={menu.menu_id}>
//                             {/* Use onClick to fetch menu details and navigate to ProductDetails */}
//                             <div className="cart-list style-2" >
//                                 <div className="dz-media media-75">
//                                 <Link to={`/ProductDetails/${menu.menu_id}`}>
//                                     <img
//                                         style={{
//                                             width: '100%',
//                                             height: '100%',
//                                             objectFit: "cover",
//                                             borderRadius: "10px",
//                                         }}
//                                         src={menu.image}
//                                         alt={menu.name}
//                                         onError={(e) => {
//                                             e.target.src = images; // Set local image source on error
//                                             e.target.style.width = '80px'; // Example: Set width of the local image
//                                             e.target.style.height = '80px'; // Example: Set height of the local image
//                                         }}
//                                     />
//                                     </Link>
//                                 </div>
//                                 <div className="dz-content">
//                                     <h6 className="title">{menu.name}</h6>
//                                     <ul className="dz-meta">
//                                         <li className="dz-price">₹{menu.price.toFixed(2)}</li>
//                                     </ul>
//                                     <div className="dz-off">{menu.veg_nonveg === 'veg' ? 'Veg' : 'Non-Veg'}</div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </main>
//             {/* Main Content End */}
//             <Bottom></Bottom>
//         </div>
//     );
// };

// export default Search;













import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import images from '../assets/MenuDefault.png';
import Bottom from '../component/bottom';
import { useRestaurantId } from '../context/RestaurantIdContext';


const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [searchedMenu, setSearchedMenu] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    // const restaurantId = 13; // Hardcoded restaurant ID
    // const { restaurantId } = useRestaurantId(); 
    const { restaurantId } = useRestaurantId();
  
    console.log("Restaurant ID:", restaurantId);

    // Debounce the search input to avoid too many API calls
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300); // 300ms debounce time

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    const handleSearch = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
    };

    const toTitleCase = (str) => {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };

    useEffect(() => {
        const fetchSearchedMenu = async () => {
            if (debouncedSearchTerm.trim().length < 3) {
                setSearchedMenu([]); // Clear the menu list if search term is less than 3 characters
                return;
            }

            setIsLoading(true);

            try {
                const response = await fetch('https://menumitra.com/user_api/search_menu', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        restaurant_id: restaurantId,
                        keyword: debouncedSearchTerm.trim()
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.st === 1 && Array.isArray(data.lists)) {
                        const formattedMenu = data.lists.map(menu => ({
                            ...menu,
                            name: toTitleCase(menu.name) // Convert menu name to title case
                        }));
                        setSearchedMenu(formattedMenu);
                    } else {
                        console.error('Invalid data format:', data);
                    }
                } else {
                    console.error('Response not OK:', response);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }

            setIsLoading(false);
        };

        fetchSearchedMenu();
    }, [debouncedSearchTerm,restaurantId]);
    

    const handleClearAll = () => {
        setSearchedMenu([]);
        setSearchTerm('');
    };

    return (
        <div className="page-wrapper">
            {/* Header */}
            <header className="header header-fixed style-3 py-2">
                <div className="header-content">
                    <div className="search-area">
                        <div onClick={() => navigate(-1)} className="back-btn icon-fill dz-icon">
                            <i className='bx bx-arrow-back'></i>
                        </div>
                        <div className="input w-100">
                            <input
                                type="search"
                                className="form-control rounded-md style-2"
                                placeholder="Search Best items for You"
                                onChange={handleSearch}
                                value={searchTerm}
                            />
                        </div>
                    </div>
                </div>
            </header>
            {/* Header End */}

            {/* Main Content Start */}
            <main className="page-content p-t80 p-b40">
                <div className="container">
                    {/* Searched Menu List */}
                    <div className="title-bar mb-2">
                        <h4 className="title mb-0 font-w500">Searched Menu</h4>
                        <div className="font-w500 font-12" onClick={handleClearAll}>Clear All</div>
                    </div>

                    {isLoading && <p>Loading...</p>}

                    {searchedMenu.map((menu) => (
                        <div className="swiper-slide search-content1" key={menu.menu_id}>
                            {/* Use onClick to fetch menu details and navigate to ProductDetails */}
                            <div className="cart-list style-2">
                                <div className="dz-media media-75">
                                    <Link to={`/ProductDetails/${menu.menu_id}`}>
                                        <img
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: "cover",
                                                borderRadius: "10px",
                                            }}
                                            src={menu.image || images} // Use default image if image is null
                                        alt={menu.name}
                                            onError={(e) => {
                                                e.target.src = images; // Set local image source on error
                                                e.target.style.width = '80px'; // Example: Set width of the local image
                                                e.target.style.height = '80px'; // Example: Set height of the local image
                                            }}
                                        /> 
                                        
                                    </Link>
                                </div>
                                <div className="dz-content">
                                    <h6 className="title">{menu.name}</h6>
                                    <ul className="dz-meta">
                                        <li className="dz-price">₹{menu.price.toFixed(2)}</li>
                                    </ul>
                                    <div className="dz-off">{menu.veg_nonveg === 'veg' ? 'Veg' : 'Non-Veg'}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            {/* Main Content End */}
            <Bottom />
        </div>
    );
};

export default Search;

