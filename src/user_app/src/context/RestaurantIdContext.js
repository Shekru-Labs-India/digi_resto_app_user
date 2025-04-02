import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import config from "../component/config"
import OrderTypeModal from "../components/OrderTypeModal";
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
  const [showOrderTypeModal, setShowOrderTypeModal] = useState(false);
  const [isOutletOnlyUrl, setIsOutletOnlyUrl] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const lastFetchedCode = useRef(null);

  // Helper function to strip prefixes
  const stripPrefix = (value, prefix) => {
    if (!value) return value;
    return value.toString().replace(new RegExp(`^${prefix}`), '');
  };

  useEffect(() => {
    // This useEffect is responsible for URL validation and parameter extraction
    // URL validation takes precedence over localStorage values
    // If a URL is malformed, we redirect to the error page before any data fetching occurs
    // This ensures that invalid URLs are never processed, even if localStorage contains valid values
    const path = location.pathname;
    
    // Check if path contains 'user_app/' and then do validation
    if (path.includes('/user_app/')) {
      // Check for old URL format (without prefixes) and redirect to error page
      const oldFormatPattern = /^\/user_app\/\d+\/\d+\/\d+$/;
      if (oldFormatPattern.test(path)) {
        navigate("/user_app/error", { 
          state: { 
            errorMessage: "URL format has changed. Please use the new format with proper prefixes (o, s, t)." 
          } 
        });
        return;
      }
      
      // Valid URL pattern - strict matching for restaurant URLs
      const validUrlPattern = /^\/user_app\/o(\d+)(?:\/s(\d+))?(?:\/t(\d+))?$/;
      
      // Only validate restaurant-specific URLs
      if (path.includes('/user_app/o')) {
        // Check for bad prefixes - this will catch "oa", "ss", "tr", etc.
        const badOutletPattern = /\/user_app\/o[^\/\d][^\/]*/;
        const badSectionPattern = /\/s[^\/\d][^\/]*/;
        const badTablePattern = /\/t[^\/\d][^\/]*/;
        
        // Check if this is an outlet-only URL (no section/table)
        // Pattern for outlet-only URL: /user_app/o123456/
        const outletOnlyPattern = /^\/user_app\/o\d+\/?$/;
        
        // Set the isOutletOnlyUrl state
        const isOutletOnly = outletOnlyPattern.test(path);
        setIsOutletOnlyUrl(isOutletOnly);
        
        if (isOutletOnly) {
          // This is an outlet-only URL, show the order type modal
          console.log("Outlet-only URL detected, showing order type modal");
          setShowOrderTypeModal(true);
          // We'll still continue with processing to set the restaurantCode
        }
      }
    }
    
    // Continue with normal regex match for valid URLs
    const match = path.match(/\/user_app\/o(\d+)(?:\/s(\d+))?(?:\/t(\d+))?/);
    
    if (match) {
      const [, code, section, table] = match;
      
      // Strip any prefixes that might have been included
      const cleanCode = stripPrefix(code, 'o');
      const cleanSection = section ? stripPrefix(section, 's') : section;
      const cleanTable = table ? stripPrefix(table, 't') : table;
      
      console.log(`outlet::${cleanCode}, section:${cleanSection || "undefined"}, table:${cleanTable || "undefined"}`);
      setRestaurantCode(cleanCode);

      // Determine if this is an outlet-only URL
      const isOutletOnly = !section && !table;
      setIsOutletOnlyUrl(isOutletOnly);
      console.log("++++++++++isOutletOnly+++++++++++++",isOutletOnly);
      
      if (cleanTable) {
        // First get restaurant details to get restaurant_id
        fetch(`${config.apiDomain}/user_api/get_restaurant_details_by_code`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            //  'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            outlet_code: cleanCode,
            section_id: cleanSection,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.st === 1) {
              const { outlet_id } = data.outlet_details;

              // Now validate the table
              return fetch(`${config.apiDomain}/user_api/is_table_exists`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  // 'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify({
                  outlet_id: outlet_id,
                  section_id: cleanSection || null,
                  table_number: cleanTable,
                }),
              });
            } else {
              throw new Error("Failed to get restaurant details");
            }
          })
          .then((response) => response.json())
          .then((data) => {
            if (data.st === 1 && data.is_table_exists) {
              // Table exists, set the table number
              setTableNumber(cleanTable);
              // window.showToast("info", `You are at Table Number ${table}`);
              localStorage.setItem("tableNumber", cleanTable);
            } else {
              // Table doesn't exist, navigate to HotelList
              // navigate("/user_app/HotelList");
              // window.showToast("info", `You are at Table Number ${table} and it is not exists`);
              console.log("Table not exists");
            }
          })
          .catch((error) => {
            // console.clear();
            navigate("/user_app/Index");
          });
      }

      if (cleanSection) {
        setSectionId(cleanSection);
        localStorage.setItem("sectionId", cleanSection);

        fetch(`${config.apiDomain}/user_api/get_restaurant_details_by_code`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            //  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({ outlet_code: cleanCode, section_id: cleanSection }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.st === 1) {
              const sectionDetails = data.sections.find(
                (s) => s.section_id.toString() === cleanSection
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
                    sectionId: cleanSection,
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
            // console.clear();
          });
      }
    }
  }, [location, navigate]);

  // Handle order type selection
  const handleOrderTypeSelection = (orderType) => {
    // Save the selected order type to localStorage
    localStorage.setItem("orderType", orderType);
    // Hide the modal
    setShowOrderTypeModal(false);
    console.log(`Order type selected: ${orderType}`);
  };

  useEffect(() => {
    if (!sectionId) {
      console.warn("Section ID is null or undefined. Skipping API call.");
      return; // Do not execute the API call if sectionId is not available
    }
  
    const fetchRestaurantDetails = async (restaurantCode, sectionId) => {
      // Strip any prefixes from passed parameters
      const cleanRestaurantCode = stripPrefix(restaurantCode, 'o');
      const cleanSectionId = stripPrefix(sectionId, 's');
      
      // Get code from localStorage if not provided
      const storedCode = stripPrefix(localStorage.getItem("restaurantCode"), 'o');
      
      // Validate URL patterns first
      const currentUrl = window.location.pathname;
      const urlPattern = /\/user_app\/o(\d+)(?:\/s(\d+))?(?:\/t(\d+))?/;
      const match = currentUrl.match(urlPattern);
      
      console.log("---------"+match);
      console.log("---------");
      
      let extractedCode = null;
      let extractedTableNumber = null;
      let extractedSectionId = null;

      // Prioritize URL parameters over localStorage if available
      if (match) {
          [, extractedCode, extractedSectionId, extractedTableNumber] = match;
          // Strip any prefixes that might be in the match
          extractedCode = stripPrefix(extractedCode, 'o');
          extractedSectionId = extractedSectionId ? stripPrefix(extractedSectionId, 's') : null;
          extractedTableNumber = extractedTableNumber ? stripPrefix(extractedTableNumber, 't') : null;
          
          console.log(
            `outlet::${extractedCode}, section:${
              extractedSectionId || "undefined"
            }, table:${extractedTableNumber || "undefined"}`
          );
      }

      // If we only have outlet code in URL, don't use fallbacks for table and section
      const urlHasOnlyOutlet = match && !match[2] && !match[3];
      
      // Make sure we're consistent with the state
      if (urlHasOnlyOutlet !== isOutletOnlyUrl) {
        setIsOutletOnlyUrl(urlHasOnlyOutlet);
      }
      
      // Use extracted values, but only use fallbacks if we're not in outlet-only mode
      const finalCode = extractedCode || cleanRestaurantCode || storedCode;
      const finalSectionId = isOutletOnlyUrl ? null : (extractedSectionId || cleanSectionId || stripPrefix(localStorage.getItem("sectionId"), 's'));
      
      // Validate that we have a restaurant code before proceeding
      if (!finalCode) {
        console.error("No valid restaurant code found in URL or localStorage");
        // Don't redirect here as it might create redirect loops
        return;
      }

      // Only update table number if explicitly in URL
      if (extractedTableNumber) {
        updateTableNumber(extractedTableNumber);
      } else if (isOutletOnlyUrl) {
        // Clear table number if we're in outlet-only mode
        updateTableNumber("");
        localStorage.removeItem("tableNumber");
      }

      // Debug log
      console.log("URL parsing results:", {
        isOutletOnlyUrl,
        extractedCode,
        extractedTableNumber,
        extractedSectionId,
        finalCode,
        finalSectionId
      });

      const sectionIdfromLocal = stripPrefix(localStorage.getItem("sectionId"), 's');
      console.log(sectionIdfromLocal);
      // Debug log
      // alert(sectionIdfromLocal);
      console.log("Restaurant code being used:", {
        providedCode: cleanRestaurantCode,
        storedCode: storedCode,
        finalCode: finalCode,
        // sectionId: sectionId,
        sectionId: finalSectionId,
      });

      try {
        const response = await fetch(
          `${config.apiDomain}/user_api/get_restaurant_details_by_code`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify({
              outlet_code: finalCode,
              section_id: finalSectionId, //section id switched to local storage
            }),
          }
        );

        const data = await response.json();
        if (data.st === 1) {
          const {
            outlet_id,
            name,
            account_status,
            is_open,
            section_name,
            address,
            mobile,
          } = data.outlet_details;
          setRestaurantId(outlet_id);
          setRestaurantName(name);
          setRestaurantStatus(account_status);
          setIsRestaurantOpen(is_open);
          setSectionName(section_name);

          localStorage.setItem("outlet_id", outlet_id);
          localStorage.setItem("restaurantName", name);
          localStorage.setItem("restaurantCode", finalCode); // Store clean code
          localStorage.setItem("restaurantStatus", account_status);
          localStorage.setItem("isRestaurantOpen", is_open);
          localStorage.setItem("sectionName", section_name);
          localStorage.setItem("outlet_address", address);
          localStorage.setItem("outlet_mobile", mobile);
          const userData = JSON.parse(localStorage.getItem("userData") || "{}");
          if (Object.keys(userData).length > 0) {
            const updatedUserData = {
              ...userData,
              restaurantId: outlet_id,
              restaurantName: name,
              restaurantCode: finalCode,
              sectionId: finalSectionId,
            };
            localStorage.setItem("userData", JSON.stringify(updatedUserData));
          }

          const socialsArray = [
            {
              id: "whatsapp",
              icon: "ri-whatsapp-line",
              name: "WhatsApp",
              link: data.outlet_details.whatsapp || "",
            },
            {
              id: "facebook",
              icon: "ri-facebook-line",
              name: "Facebook",
              link: data.outlet_details.facebook || "",
            },
            {
              id: "instagram",
              icon: "ri-instagram-line",
              name: "Instagram",
              link: data.outlet_details.instagram || "",
            },
            {
              id: "website",
              icon: "ri-global-line",
              name: "Website",
              link: data.outlet_details.website || "",
            },
            {
              id: "google_review",
              icon: "ri-google-line",
              name: "Review",
              link: data.outlet_details.google_review || "",
            },
            {
              id: "google_business",
              icon: "ri-store-2-line",
              name: "Business",
              link: data.outlet_details.google_business_link || "",
            },
          ].filter((item) => item.link);

          localStorage.setItem(
            "restaurantSocial",
            JSON.stringify(socialsArray)
          );
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
              restaurantCode: "",
            };
            localStorage.setItem("userData", JSON.stringify(updatedUserData));
          }

          // navigate("/user_app/Index");

          localStorage.setItem("restaurantStatus", false);
        } else {
          // console.clear();
        }
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    };
  
    fetchRestaurantDetails(restaurantCode, sectionId);
  }, [restaurantCode, sectionId, navigate, isOutletOnlyUrl]);
  

  useEffect(() => {
    const storedRestaurantId = localStorage.getItem("restaurantId");
    const storedRestaurantName = localStorage.getItem("restaurantName");
    const storedRestaurantCode = stripPrefix(localStorage.getItem("restaurantCode"), 'o');
    const storedSectionId = stripPrefix(localStorage.getItem("sectionId"), 's');

    if (storedRestaurantId) setRestaurantId(storedRestaurantId);
    if (storedRestaurantName) setRestaurantName(storedRestaurantName);
    if (storedRestaurantCode) setRestaurantCode(storedRestaurantCode);
    // if (storedSectionId) setSectionId(storedSectionId);
  }, []);

  const updateRestaurantCode = (code) => {
    // Strip any 'o' prefix if present
    const cleanCode = stripPrefix(code, 'o');
    setRestaurantCode(cleanCode);
    localStorage.setItem("restaurantCode", cleanCode);
  };

  const updateTableNumber = (number) => {
    // Strip any 't' prefix if present
    const cleanNumber = stripPrefix(number, 't');
    setTableNumber(cleanNumber);
    localStorage.setItem("tableNumber", cleanNumber);
  };

  const updateSectionId = (id) => {
    // Strip any 's' prefix if present
    const cleanId = stripPrefix(id, 's');
    setSectionId(cleanId);
    localStorage.setItem("sectionId", cleanId);
  };

  return (
    <RestaurantIdContext.Provider
      value={{
        restaurantId,
        restaurantName,
        restaurantCode,
        tableNumber,
        sectionId,
        isOutletOnlyUrl,
        updateRestaurantCode,
        updateTableNumber,
        updateSectionId,
        setRestaurantCode,
        socials,
      }}
    >
      {children}
      {showOrderTypeModal && (
        <OrderTypeModal
          onSelect={handleOrderTypeSelection}
          onClose={() => setShowOrderTypeModal(false)}
        />
      )}
    </RestaurantIdContext.Provider>
  );
};
