


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swiper from 'swiper';
import { useRestaurantId } from '../context/RestaurantIdContext';

const PopularProducts = () => {
    const [menuCategories, setMenuCategories] = useState([]);
    const { restaurantId } = useRestaurantId();
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
                        restaurant_id: restaurantId
                    })
                };

                const response = await fetch('https://menumitra.com/user_api/get_category_list', requestOptions);

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
    }, [restaurantId]);

    useEffect(() => {
        const swiper = new Swiper('.category-slide', {
            slidesPerView: 'auto',
            spaceBetween: 10,
        });

        
    }, [menuCategories]); // Re-run effect when menuCategories changes

    return (
      <div className="dz-box">
        <div className="title-bar">
          <h5 className="title p-r50">Menu Category</h5>
          <Link to="/Category">
            <i className="ri-arrow-right-fill"></i>
          </Link>
        </div>
        <div className="swiper category-slide">
          <div className="swiper-wrapper">
            {menuCategories.map((category) => (
              <div className="swiper-slide" key={category.menu_cat_id}>
                <Link
                  to={`/category/${category.menu_cat_id}`}
                  className="category-btn"
                >
                  {category.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};

export default PopularProducts;

