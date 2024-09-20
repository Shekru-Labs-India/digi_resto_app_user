import React, { useState, useEffect } from 'react';
import Swiper from 'swiper';
import { useRestaurantId } from '../context/RestaurantIdContext';

const OfferBanner = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const { restaurantId } = useRestaurantId();

    useEffect(() => {
        let isMounted = true;

        const fetchData = async (retryCount = 0) => {
            try {
                console.log('Fetching data...');
                const url = 'https://menumitra.com/user_api/get_banner_and_offer_menu_list'; // Updated URL
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        restaurant_id: restaurantId
                    })
                };

                const response = await fetch(url, requestOptions);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                if (data.st === 1 && data.data.banner_list) { // Updated data structure
                    const bannerUrls = data.data.banner_list
                        .filter(item => item.image)
                        .map(item => item.image);
                    if (isMounted) {
                        setBanners(bannerUrls);
                        console.log('Data fetched:', data);
                    }
                } else {
                    console.error('Invalid data format:', data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                if (retryCount < 3) {
                    console.log(`Retrying... (${retryCount + 1})`);
                    fetchData(retryCount + 1);
                } else {
                    if (isMounted) {
                        setLoading(false);
                    }
                }
                return;
            }
            if (isMounted) {
                setLoading(false);
            }
        };

        if (restaurantId) {
            fetchData();
        }

        return () => {
            isMounted = false;
        };
    }, [restaurantId]);

    useEffect(() => {
        if (banners.length > 0) {
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
                swiper.destroy();
            };
        }
    }, [banners]);

    return (
        <div className="dz-box style-3">
            {loading ? (
                <div id="preloader">
                    <div className="loader">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="swiper featured-swiper2">
                    <div className="swiper-wrapper">
                        {banners.map((bannerUrl, index) => (
                            <div className="swiper-slide" key={index}>
                                <div className="dz-media rounded-md">
                                    <img
                                        src={bannerUrl}
                                        style={{ width: '100%', height: '160px', borderRadius: '10px' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfferBanner;
