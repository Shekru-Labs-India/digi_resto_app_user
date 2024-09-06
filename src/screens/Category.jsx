// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import Bottom from "../component/bottom";
// import images from "../assets/category.png";
// import { useRestaurantId } from '../context/RestaurantIdContext';
// const Category = () => {
//   const [categories, setCategories] = useState([]);
//   const [totalCategoriesCount, setTotalCategoriesCount] = useState(0);
//   const { restaurantId } = useRestaurantId();
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(
//           "https://menumitra.com/user_api/get_category_list",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               restaurant_id: 13, // Provide the restaurant_id for the API request
//             }),
//           }
//         );
// // console.log(restaurantId)
//         if (response.ok) {
//           const data = await response.json();
//           if (data && data.st === 1 && data.lists) {
//             setCategories(data.lists);
//             setTotalCategoriesCount(data.lists.length);
//           } else {
//             console.error("Invalid data format:", data);
//           }
//         } else {
//           console.error("Network response was not ok.");
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, [restaurantId]); // Empty dependency array ensures the effect runs only once

//   const toTitleCase = (str) => {
//     return str.replace(/\w\S*/g, (txt) => {
//       return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//     });
//   };
//   return (
//     <div className="page-wrapper">
      
//       {/* Header */}
//       <header className="header header-fixed style-3">
//         <div className="header-content">
//           <div className="left-content">
//             <Link
//               to="/HomeScreen/347279"
//               className="back-btn dz-icon icon-fill icon-sm"
//             >
//               <i className="bx bx-arrow-back"></i>
//             </Link>
//           </div>
//           <div className="mid-content">
//             <h5 className="title">
//               Category{" "}
//               <span className="items-badge">{totalCategoriesCount}</span>
//             </h5>
//           </div>
//           <div className="right-content">
//             <Link to="/Search" className="dz-icon icon-fill icon-sm">
//               <i className="bx bx-search-alt-2"></i>
//             </Link>
//           </div>
//         </div>
//       </header>
//       {/* Header End */}

//       {/* Main Content Start */}
//       <main className="page-content space-top p-b70">
//         <div className="container">
//           <div className="row g-3 grid-style-1">
//             {categories.map((category, index) => (
//               <div className="col-6" key={index}>
//                 <div className="dz-card style-4 text-center">
//                   <h6 className="title">
//                     <Link to="/Product">
//                       {toTitleCase(category.name)} ({category.menu_count})
//                     </Link>
//                   </h6>
//                   <div className="dz-media">
//                     <Link to="/Product">
//                       {/* <img 
//                                             style={{ width: '100%', height: '100px', borderRadius: '10px' }}
//                                             src={category.image} 
//                                             alt={category.name} /> */}
//                       <img
//                         style={{
//                           width: "100%",
//                           height: "100px",
//                           borderRadius: "10px",
//                         }}
//                         src={category.image}
//                         alt={category.name}
//                         onError={(e) => {
//                           e.target.src = images; // Set local image source on error
//                           e.target.style.width = "80px"; // Example: Set width of the local image
//                           e.target.style.height = "80px"; // Example: Set height of the local image
//                         }}
//                       />
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>
//       {/* Main Content End */}

//       {/* Footer */}
//       <Bottom />
//     </div>
//   );
// };

// export default Category;






























import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import Bottom from "../component/bottom";
import images from "../assets/category.png";
import defaultImg from "../assets/MenuDefault.png"
import { useRestaurantId } from '../context/RestaurantIdContext';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [totalCategoriesCount, setTotalCategoriesCount] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state
  const { restaurantId } = useRestaurantId();
  const navigate = useNavigate(); // Initialize useNavigate

  console.log("Restaurant ID:", restaurantId);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!restaurantId) return; // Ensure restaurantId is available

      try {
        setLoading(true); // Set loading to true before API call
        const response = await fetch(
          "https://menumitra.com/user_api/get_category_list",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              restaurant_id: restaurantId, // Use restaurantId from context
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data && data.st === 1 && data.lists) {
            setCategories(data.lists);
            setTotalCategoriesCount(data.lists.length);
          } else {
            console.error("Invalid data format:", data);
          }
        } else {
          console.error("Network response was not ok.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false); // Set loading to false after API call
      }
    };

    fetchCategories();
  }, [restaurantId]);

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const handleCategoryClick = (category) => {
    navigate(`/Product?category=${category.category_id}`); // Navigate to Product screen with category ID
  };

  return (
    <div className="page-wrapper">
      {loading ? (
        <div id="preloader">
          <div className="loader">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="header header-fixed style-3">
            <div className="header-content">
              <div className="left-content">
                <Link
                  to="/HomeScreen/347279"
                  className="back-btn dz-icon icon-fill icon-sm"
                >
                  <i className="bx bx-arrow-back"></i>
                </Link>
              </div>
              <div className="mid-content">
                <h5 className="title">
                  Category{" "}
                  <span className="items-badge">{totalCategoriesCount}</span>
                </h5>
              </div>
              <div className="right-content">
                <Link to="/Search" className="dz-icon icon-fill icon-sm">
                  <i className="bx bx-search-alt-2"></i>
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
                        <Link
                          to="/Product"
                          onClick={() => handleCategoryClick(category)}
                        >
                          {toTitleCase(category.name)} ({category.menu_count})
                        </Link>
                      </h6>
                      <div className="dz-media">
                        <Link
                          to="/Product"
                          onClick={() => handleCategoryClick(category)}
                        >
                          <img
                            src={category.image || defaultImg} // Use default image if image is null
                            alt={category.name}
                            style={{ height: "150px" }}
                            onError={(e) => {
                              e.target.src = defaultImg; // Set local image source on error
                            }}
                          />
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
        </>
      )}
    </div>
  );
};

export default Category;
