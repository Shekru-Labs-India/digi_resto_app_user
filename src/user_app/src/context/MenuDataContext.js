import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRestaurantId } from './RestaurantIdContext';
import config from "../component/config"
const MenuDataContext = createContext();

export const MenuDataProvider = ({ children }) => {
    const { restaurantId } = useRestaurantId();
    const [menuData, setMenuData] = useState({ banners: [], featured: [], nearby: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!restaurantId) return;

            try {
                const [bannerResponse, featuredResponse] = await Promise.all([
                    fetch(`${config.apiDomain}/user_api/get_banner_and_offer_menu_list`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ restaurant_id: restaurantId }),
                    }),
                    fetch(`${config.apiDomain}/user_api/get_all_menu_list_by_category`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ restaurant_id: restaurantId }),
                    }),
                ]);

                const bannerData = await bannerResponse.json();
                const featuredData = await featuredResponse.json();

                if (bannerData.st === 1) {
                    setMenuData(prev => ({ ...prev, banners: bannerData.data.banner_list }));
                }
                if (featuredData.st === 1) {
                    setMenuData(prev => ({ ...prev, featured: featuredData.data.offer_menu_list }));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [restaurantId]);

    return (
        <MenuDataContext.Provider value={{ menuData, loading }}>
            {children}
        </MenuDataContext.Provider>
    );
};

export const useMenuData = () => {
    return useContext(MenuDataContext);
};