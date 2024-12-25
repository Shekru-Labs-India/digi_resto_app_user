import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import config from "../component/config"
const RestaurantIdContext = createContext();

export const useRestaurantId = () => {
  return useContext(RestaurantIdContext);
};

export const RestaurantIdProvider = ({ children }) => {
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantCode, setRestaurantCode] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [restaurantStatus, setRestaurantStatus] = useState(null)
  const [isRestaurantOpen,setIsRestaurantOpen] = useState(null)
  const [sectionName, setSectionName] = useState("")
  const [socials, setSocials] = useState([]);
  const [sectionId, setSectionId] = useState(localStorage.getItem("sectionId"));
  const navigate = useNavigate();
  const location = useLocation();
  const lastFetchedCode = useRef(null);

  useEffect(() => {
    const path = location.pathname;
    const match = path.match(/\/user_app\/(\d{6})(?:\/([^\/]+))(?:\/(\d+))?/);

    if (match) {
      const [, code, table, section] = match;
      setRestaurantCode(code);
      
      if (table) {
        // First get restaurant details to get restaurant_id
        fetch(`${config.apiDomain}/user_api/get_restaurant_details_by_code`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            restaurant_code: code,
            section_id: section || null 
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.st === 1) {
              const { restaurant_id } = data.restaurant_details;
              
              // Now validate the table
              return fetch(`${config.apiDomain}/user_api/is_table_exists`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  restaurant_id: restaurant_id,
                  section_id: section || null,
                  table_id: table
                }),
              });
            } else {
              throw new Error('Failed to get restaurant details');
            }
          })
          .then(response => response.json())
          .then((data) => {
            if (data.st === 1 && data.is_table_exists) {
              // Table exists, set the table number
              setTableNumber(table);
              localStorage.setItem("tableNumber", table);
            } else {
              // Table doesn't exist, navigate to HotelList
              navigate("/user_app/HotelList");
            }
          })
          .catch((error) => {
            console.clear();
            navigate("/user_app/HotelList");
          });
      }

      if (section) {
        setSectionId(section);
        localStorage.setItem("sectionId", section);
        
        fetch(`${config.apiDomain}/user_api/get_restaurant_details_by_code`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ restaurant_code: code, section_id: section }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.st === 1) {
              const sectionDetails = data.sections.find(
                (s) => s.section_id.toString() === section
              );
              if (sectionDetails) {
                const sectionName = sectionDetails.section_name;
                localStorage.setItem("sectionName", sectionName);

                const userData = JSON.parse(
                  localStorage.getItem("userData") || "{}"
                );
                if (Object.keys(userData).length > 0) {
                  const updatedUserData = {
                    ...userData,
                    sectionId: section,
                    section_name: sectionName,
                  };
                  localStorage.setItem(
                    "userData",
                    JSON.stringify(updatedUserData)
                  );
                }
              }
            }
          })
          .catch((error) => {
            console.clear();
          });
      }
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      if (!restaurantCode || restaurantCode === lastFetchedCode.current) return;

      lastFetchedCode.current = restaurantCode;

      try {
        const response = await fetch(
          `${config.apiDomain}/user_api/get_restaurant_details_by_code`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              restaurant_code: restaurantCode,
              section_id: sectionId
            }),
          }
        );

        const data = await response.json();
        if (data.st === 1) {
          const { restaurant_id, name, account_status, is_open, section_name } = data.restaurant_details;
          setRestaurantId(restaurant_id);
          setRestaurantName(name);
          setRestaurantStatus(account_status)
          setIsRestaurantOpen(is_open)
          setSectionName(section_name)

          localStorage.setItem("restaurantId", restaurant_id);
          localStorage.setItem("restaurantName", name);
          localStorage.setItem("restaurantCode", restaurantCode);
          localStorage.setItem("restaurantStatus", account_status)
          localStorage.setItem("isRestaurantOpen", is_open)
          localStorage.setItem("sectionName", section_name)

          const userData = JSON.parse(localStorage.getItem("userData") || "{}");
          if (Object.keys(userData).length > 0) {
            const updatedUserData = {
              ...userData,
              restaurantId: restaurant_id,
              restaurantName: name,
              restaurantCode: restaurantCode,
              sectionId: sectionId
            };
            localStorage.setItem("userData", JSON.stringify(updatedUserData));
          }

          const socialsArray = [
            {
              id: 'whatsapp',
              icon: 'ri-whatsapp-line',
              name: 'WhatsApp',
              link: data.restaurant_details.whatsapp || '',
            },
            {
              id: 'facebook',
              icon: 'ri-facebook-line',
              name: 'Facebook',
              link: data.restaurant_details.facebook || '',
            },
            {
              id: 'instagram',
              icon: 'ri-instagram-line',
              name: 'Instagram',
              link: data.restaurant_details.instagram || '',
            },
            {
              id: 'website',
              icon: 'ri-global-line',
              name: 'Website',
              link: data.restaurant_details.website || '',
            },
            {
              id: 'google_review',
              icon: 'ri-google-line',
              name: 'Review',
              link: data.restaurant_details.google_review || '',
            },
            {
              id: 'google_business',
              icon: 'ri-store-2-line',
              name: 'Business',
              link: data.restaurant_details.google_business_link || '',
            }
          ].filter(item => item.link);

          localStorage.setItem("restaurantSocial", JSON.stringify(socialsArray));
          
          setSocials(socialsArray);
        } else if (data.st === 2) {
          setRestaurantId(null);
          setRestaurantName("");
          
          localStorage.removeItem("restaurantId");
          localStorage.removeItem("restaurantName");
          localStorage.removeItem("restaurantCode");
          localStorage.removeItem("restaurantSocial");
          
          
          const userData = JSON.parse(localStorage.getItem("userData") || "{}");
          if (Object.keys(userData).length > 0) {
            const updatedUserData = {
              ...userData,
              restaurantId: null,
              restaurantName: "",
              restaurantCode: ""
            };
            localStorage.setItem("userData", JSON.stringify(updatedUserData));
          }
          
          navigate("/user_app/Index");

          localStorage.setItem("restaurantStatus", false);
        } else {
          console.clear();
        }
      } catch (error) {
        console.clear();
      }
    };

    fetchRestaurantDetails();
  }, [restaurantCode, sectionId, navigate]);

  useEffect(() => {
    const storedRestaurantId = localStorage.getItem("restaurantId");
    const storedRestaurantName = localStorage.getItem("restaurantName");
    const storedRestaurantCode = localStorage.getItem("restaurantCode");
    const storedSectionId = localStorage.getItem("sectionId");

    if (storedRestaurantId) setRestaurantId(storedRestaurantId);
    if (storedRestaurantName) setRestaurantName(storedRestaurantName);
    if (storedRestaurantCode) setRestaurantCode(storedRestaurantCode);
    // if (storedSectionId) setSectionId(storedSectionId);
  }, []);

  const updateRestaurantCode = (code) => {
    setRestaurantCode(code);
    localStorage.setItem("restaurantCode", code);
  };

  const updateTableNumber = (number) => {
    setTableNumber(number);
    localStorage.setItem("tableNumber", number);
  };

  const updateSectionId = (id) => {
    setSectionId(id);
    localStorage.setItem("sectionId", id);
  };

  return (
    <RestaurantIdContext.Provider
      value={{
        restaurantId,
        restaurantName,
        restaurantCode,
        tableNumber,
        sectionId,
        updateRestaurantCode,
        updateTableNumber,
        updateSectionId,
        setRestaurantCode,
        socials,
      }}
    >
      {children}
    </RestaurantIdContext.Provider>
  );
};
