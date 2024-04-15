import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedMenu, setSearchedMenu] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (event) => {
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
            if (searchTerm.trim() === '') {
                setSearchedMenu([]); // Clear the menu list if search term is empty
                return;
            }

            setIsLoading(true);

            try {
                const response = await fetch('http://194.195.116.199/user_api/search_menu', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        restaurant_id: 13,
                        keyword: searchTerm.trim()
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
                    console.error('Network response was not ok.');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }

            setIsLoading(false);
        };

        fetchSearchedMenu();
    }, [searchTerm]);

    const handleClearAll = () => {
        setSearchedMenu([]);
    };

    return (
        <div className="page-wrapper">
            {/* Header */}
            <header className="header header-fixed style-3 py-2">
                <div className="header-content">
                    <div className="search-area">
                        <Link to="/HomeScreen" className="back-btn icon-fill dz-icon">
                            <i className='bx bx-arrow-back'></i>
                        </Link>
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
                            <div className="cart-list style-2">
                                <div className="dz-media media-75">
                                    <img src={menu.image} alt={menu.name} />
                                </div>
                                <div className="dz-content">
                                    <h6 className="title">{menu.name}</h6>
                                    <ul className="dz-meta">
                                        <li className="dz-price">₹{menu.price.toFixed(2)}</li>
                                        <li className="dz-review">
                                            <i className='bx bxs-star staricons'></i><span>(2k Review)</span>
                                        </li>
                                    </ul>
                                    <div className="dz-off">{menu.veg_nonveg === 'veg' ? 'Veg' : 'Non-Veg'}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            {/* Main Content End */}
        </div>
    );
};

export default Search;