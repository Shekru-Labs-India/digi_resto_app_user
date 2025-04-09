import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRestaurantId } from './RestaurantIdContext';
import config from "../component/config"
import { usePopup } from './PopupContext';

const MenuDataContext = createContext();

export const MenuDataProvider = ({ children }) => {
    const { restaurantId } = useRestaurantId();
    const [menuData, setMenuData] = useState({ banners: [], featured: [], nearby: [] });
    const [loading, setLoading] = useState(true);
    const { showLoginPopup } = usePopup();

    useEffect(() => {
        const fetchData = async () => {
            if (!restaurantId) return;

            try {
                const [bannerResponse, featuredResponse] = await Promise.all([
                  fetch(
                    `${config.apiDomain}/user_api/get_banner_and_offer_menu_list`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                      },
                      body: JSON.stringify({ outlet_id: restaurantId }),
                    }
                  ),
                  fetch(
                    `${config.apiDomain}/user_api/get_all_menu_list_by_category`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                      },
                      body: JSON.stringify({ outlet_id: restaurantId }),
                    }
                  ),
                ]);

                // Check for 401 status in either response
                if (bannerResponse.status === 401 || featuredResponse.status === 401) {
                    localStorage.removeItem("user_id");
                    localStorage.removeItem("userData");
                    localStorage.removeItem("cartItems");
                    localStorage.removeItem("access_token");
                    showLoginPopup();
                    return;
                }

                const bannerData = await bannerResponse.json();
                const featuredData = await featuredResponse.json();

                if (bannerData.st === 1) {
                    setMenuData(prev => ({ ...prev, banners: bannerData.data.banner_list }));
                }
                if (featuredData.st === 1) {
                    setMenuData(prev => ({ ...prev, featured: featuredData.data.offer_menu_list }));
                }
            } catch (error) {
                console.clear();
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [restaurantId, showLoginPopup]);

    return (
        <MenuDataContext.Provider value={{ menuData, loading }}>
            {children}
        </MenuDataContext.Provider>
    );
};

export const useMenuData = () => {
    return useContext(MenuDataContext);
};