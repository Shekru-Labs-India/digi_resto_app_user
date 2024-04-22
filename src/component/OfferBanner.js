


import React, { useState, useEffect } from 'react';
import Swiper from 'swiper';
// import Images from '../assets/category.png'

const OfferBanner = () => {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = 'https://menumitra.com/user_api/get_banner_list';
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        restaurant_id: 13
                    })
                };

                const response = await fetch(url, requestOptions);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                if (data.st === 1 && Array.isArray(data.lists)) {
                    const bannerUrls = data.lists
                        .filter(item => item.image) // Filter out items with null image
                        .map(item => item.image); // Extract image URLs
                    setBanners(bannerUrls);
                    console.log(data)
                } else {
                    console.error('Invalid data format:', data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Initialize Swiper once data is loaded
        const swiper = new Swiper('.featured-swiper2', {
            slidesPerView: 'auto',
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
        });

        return () => {
            swiper.destroy(); // Clean up Swiper instance on component unmount
        };
    }, [banners]); // Re-initialize Swiper when banners change

    return (
        <div className="dz-box style-3">
            <div className="swiper featured-swiper2">
                <div className="swiper-wrapper">
                    {banners.map((bannerUrl, index) => (
                        <div className="swiper-slide" key={index}>
                            <div className="dz-media rounded-md">
                                <img
                                    src={bannerUrl}
                                    // alt={Images}
                                    style={{ width: '100%', height: '160px', borderRadius: '10px' }} // Apply custom styling to the image
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OfferBanner;

