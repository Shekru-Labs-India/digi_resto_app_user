




import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import Swiper from "swiper";
import { Link } from "react-router-dom";


const Product = () => {
  const [menuList, setMenuList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [filteredMenuList, setFilteredMenuList] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [sortByOpen, setSortByOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 }); // Initial price range

  const navigate = useNavigate();
const [filterOpen, setFilterOpen] = useState(false);

const [selectedCategory, setSelectedCategory] = useState(null);



  useEffect(() => {
    const swiper = new Swiper(".category-slide", {
      slidesPerView: "auto",
      spaceBetween: 10,
    });

    return () => {
      swiper.destroy();
    };
  }, []);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(
          "http://194.195.116.199/user_api/get_product_list",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ restaurant_id: 13 }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch menu data");
        }

        const data = await response.json();

        if (data.st === 1) {
          const formattedMenuList = data.MenuList.map((menuItem) => ({
            ...menuItem,
            name: toTitleCase(menuItem.name),
            category: toTitleCase(menuItem.menu_cat_name),
            oldPrice: Math.floor(menuItem.price * 1.1),
          }));

          setMenuList(formattedMenuList);

          const formattedCategories = data.MenuCatList.map((category) => ({
            ...category,
            name: toTitleCase(category.name),
          }));

          setCategories(formattedCategories);
          setFilteredMenuList(formattedMenuList);
        } else {
          throw new Error("API request unsuccessful");
        }
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    fetchMenuData();
  }, []);

  const handleLikeClick = async (restaurantId, menuId, customerId) => {
    try {
      const response = await fetch(
        "http://194.195.116.199/user_api/save_favourite_menu",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            menu_id: menuId,
            customer_id: customerId,
          }),
        }
      );

      if (response.ok) {
        console.log("Item added to favorites successfully");
        navigate("/Wishlist");
      } else {
        console.error("Failed to add item to favorites");
      }
    } catch (error) {
      console.error("Error adding item to favorites:", error);
    }
  };

  // const handleAddToCartClick = (menu) => {
  //   const cartItem = {
  //     image: menu.image,
  //     name: menu.name,
  //     price: menu.price,
  //     oldPrice: menu.oldPrice,
  //     quantity: 1,
  //   };

  //   const CartItems =
  //     JSON.parse(localStorage.getItem("cartItems")) || [];
  //   CartItems.push(cartItem);
  //   localStorage.setItem("cartItems", JSON.stringify(CartItems));

  //   setCartItemsCount(CartItems.length);
  //   navigate("/Cart");
  // };

  const handleAddToCartClick = (menu) => {
    const cartItem = {
          image: menu.image,
           name: menu.name,
           price: menu.price,
           oldPrice: menu.oldPrice,
           quantity: 1,
         };

   const CartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
       CartItems.push(cartItem);
      localStorage.setItem("cartItems", JSON.stringify(CartItems));
  
      setCartItemsCount(CartItems.length);
      navigate("/Cart");
     };

     const handleCategorySelect = (categoryName) => {
      setSelectedCategory(categoryName);
      if (categoryName === null) {
        setFilteredMenuList(menuList); // Show all menu items
      } else {
        handleCategoryFilter(categoryName); // Filter based on selected category
      }
    };
    
    const handleCategoryFilter = (categoryName) => {
      let filteredItems;
      if (categoryName === null) {
        filteredItems = menuList; // Show all menu items
      } else {
        const formattedCategoryName = toTitleCase(categoryName);
        filteredItems = menuList.filter(
          (item) => toTitleCase(item.menu_cat_name) === formattedCategoryName
        );
      }
      setFilteredMenuList(filteredItems);
      setActiveCategory(categoryName); // Update active category
    };
    
    
  

  const toggleSortBy = () => {
    setSortByOpen(!sortByOpen);
  };

  const sortMenuByPrice = () => {
    // Get the selected sorting order (sort by name or sort by price)
    const selectedSortOrder = document.querySelector('input[name="sortRadio"]:checked').id;
  
    // Create a copy of the filtered menu list to perform sorting
    const sortedMenu = [...filteredMenuList];
  
    if (selectedSortOrder === 'sortRadio1') {
      // Sort by name in ascending order
      sortedMenu.sort((a, b) => {
        const nameA = a.name.toUpperCase(); // Ignore case for comparison
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
  
      // Then sort by price in ascending order within the same name groups
      sortedMenu.sort((a, b) => {
        if (a.name === b.name) {
          // If names are the same, sort by price in ascending order
          return a.price - b.price;
        }
        return 0;
      });
    } else if (selectedSortOrder === 'sortRadio2') {
      // Sort by price in ascending order
      sortedMenu.sort((a, b) => a.price - b.price);
  
      // Then sort by name in ascending order within the same price groups
      sortedMenu.sort((a, b) => {
        if (a.price === b.price) {
          // If prices are the same, sort by name in ascending order
          const nameA = a.name.toUpperCase(); // Ignore case for comparison
          const nameB = b.name.toUpperCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        }
        return 0;
      });
    }
  
    // Update the filteredMenuList state with the sorted menu items
    setFilteredMenuList(sortedMenu);
  
    // Close the "Sort By" offcanvas after applying the sorting
    setSortByOpen(false);
  };
  
  

  const handleBack = () => {
    navigate(-1);
  };
  // const handleFilterToggle = () => {
  //   setFilterOpen(!filterOpen);
  // };
  const toTitleCase = (text) => {
    if (!text) {
      return ''; // Handle undefined or null input gracefully
    }
    
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  };
  
 
  const handlePriceFilter = () => {
    // Filter menu items based on the selected price range
    const filteredItems = menuList.filter(
      (item) => item.price >= priceRange.min && item.price <= priceRange.max
    );
  
    // Update the filteredMenuList state with the filtered items
    setFilteredMenuList(filteredItems);
  
    // Close the filter menu after applying the filter
    setFilterOpen(false);
  };

  const handleResetFilter = () => {
    setPriceRange({ min: 0, max: 1000 }); // Reset price range to default
    setFilteredMenuList(menuList); // Reset filtered menu list to show all items
  };



  return (
    <div className={`page-wrapper ${sortByOpen || filterOpen ? 'open' : ''}`}>
      {/* Header */}
      <header className="header header-fixed style-3 ">
        <div className="header-content">
          <div className="left-content">
            <div className="back-btn dz-icon icon-fill icon-sm" onClick={handleBack}>
              <i className="bx bx-arrow-back"></i>
            </div>
          </div>
          <div className="mid-content">
            <h5 className="title">
              Menu <span className="items-badge">{menuList.length}</span>
            </h5>
          </div>
          <div className="right-content">
            <Link to="/Cart" className="notification-badge dz-icon icon-sm icon-fill">
              <i className="bx bx-cart bx-sm"></i>
              <span className="badge badge-danger">{cartItemsCount}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`page-content space-top p-b80 ${sortByOpen || filterOpen ? 'open' : ''}`}>
        {/* Category Slide */}
        <div className={`container pb-0 ${sortByOpen || filterOpen ? 'open' : ''}`}>

          <div className="swiper category-slide">
            <div className="swiper-wrapper">
            <div
      className={`category-btn swiper-slide ${selectedCategory === null ? "active" : ""}`}
      onClick={() => handleCategorySelect(null)} // Set selectedCategory to null for "ALL"
    >
      All
    </div>
    {categories.map((category) => (
      <div key={category.menu_cat_id} className="swiper-slide">
        <a
          href="#"
          className={`category-btn ${activeCategory === toTitleCase(category.name) ? "active" : ""}`}
          onClick={() => handleCategoryFilter(category.name)}
        >
          {category.name}
        </a>
      </div>
              ))}
            </div>
          </div>
        </div>

        {/* Display Filtered Menu Items */}
        <div className="container pb-0">
          <div className="row g-3 grid-style-1">
            {filteredMenuList.map((menuItem) => (
              <div key={menuItem.menu_id} className="col-6">
                <div className="card-item style-6">
                  <div className="dz-media">
                  <Link to={`/ProductDetails/${menuItem.menu_id}`}>
                    <img
                      src={menuItem.image}
                      alt={menuItem.name}
                      style={{ height: "150px" }}
                      onError={(e) => {
                        e.target.src = images;
                      }}
                    />
                     </Link>
                  </div>
                 
                  <div className="dz-content">
                    <span className="product-title">
                      {menuItem.category}
                      <i
                        className="bx bx-heart bx-sm"
                        style={{ marginLeft: "80px" ,position:'fixed'}}
                        onClick={() => handleLikeClick(13, menuItem.menu_id, 1)}
                      ></i>
                    </span>
                    <h4 className="item-name">{menuItem.name}</h4>
                    <div className="offer-code">Spicy Level: {menuItem.spicy_index}</div>
                    <div className="footer-wrapper">
                      <div className="price-wrapper">
                        <h6 className="current-price">₹{menuItem.price}</h6>
                        <span className="old-price">₹{menuItem.oldPrice}</span>
                      </div>
                      <div onClick={() => handleAddToCartClick(menuItem)} className="cart-btn btn-outline-primary">
                        <i className="bx bx-cart bx-sm"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
         
        </div>
      </main>

      {/* Footer - Sort and Filter Options */}
      <div className="footer fixed">
        <ul className="dz-product-filter">
          <li>
            <a href="javascript:void(0);" onClick={toggleSortBy}>
              <i className="bx bx-up-arrow-alt bx-sm"></i>Sort
            </a>
            
          </li>
          <li>
            <a href="javascript:void(0);" onClick={() => setFilterOpen(!filterOpen)}>
              <i className="bx bx-filter bx-sm"></i>Filter
            </a>
          </li>
        </ul>

        {/* Sort By Offcanvas */}
        {sortByOpen && (
          <div className="offcanvas offcanvas-bottom p-b60 show " tabIndex="-1" id="offcanvasBottom1">
            <div className="offcanvas-header ">
              <h4 className="offcanvas-title">Sort By</h4>
              <button type="button" className="btn-close style-2" onClick={toggleSortBy} aria-label="Close">
              <i className="bx bx-x bx-sm"></i>
              </button>
            </div>
            <div className="offcanvas-body ">
              <div className="d-flex flex-wrap gap-2 ">
                <div className="form-check style-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="sortRadio"
                    id="sortRadio1"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="sortRadio1">
                   Sort by name
                  </label>
                </div>
                <div className="form-check style-2">
                  <input className="form-check-input" type="radio" name="sortRadio" id="sortRadio2" />
                  <label className="form-check-label" htmlFor="sortRadio2">
                    Sort by price
                  </label>
                </div>
              </div>
              <button onClick={sortMenuByPrice} className="btn btn-primary mt-3">
                Apply
              </button>
              <div className="footer fixed">
        <ul className="dz-product-filter">
          <li>
            <a href="javascript:void(0);" onClick={toggleSortBy}>
              <i className="bx bx-up-arrow-alt bx-sm"></i>Sort
            </a>
            
          </li>
          <li>
            <a href="javascript:void(0);" onClick={() => setFilterOpen(!filterOpen)}>
              <i className="bx bx-filter bx-sm"></i>Filter
            </a>
          </li>
        </ul>
        </div>
              
            </div>
          </div>
        )}

        {/* Filter Offcanvas */}
        {filterOpen && (
          <div className="offcanvas offcanvas-bottom p-b60 show " tabIndex="-1" id="offcanvasBottom2">
            <div className="offcanvas-header">
              <h4 className="offcanvas-title">Filters</h4>
              <button type="button" className="btn-close style-2" onClick={() => setFilterOpen(!filterOpen)} aria-label="Close">
                <i className="bx bx-x bx-sm"></i>
              </button>
            </div>
            <div className="offcanvas-body">
            <div className="filter-inner-content">
				<div className="title-bar">
					<h5 className="sub-title">Price:</h5>
				</div>
        <input
  type="range"
  min={0}
  max={1000}
  value={priceRange.min}
  onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
  className="custom-range"
  style={{ width: "100%" }}
/>
<input
  type="range"
  min={0}
  max={1000}
  value={priceRange.max}
  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
  className="custom-range"
  style={{ width: "100%" }}
/>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                  <span>₹{priceRange.min}</span>
                  <span>₹{priceRange.max}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                <a onClick={handlePriceFilter} className="btn btn-primary btn-thin w-100 rounded-xl">
                  Apply
                </a>
                <a onClick={handleResetFilter} className="btn btn-white btn-thin w-100 rounded-xl">
                  Reset
                </a>
                </div>

                <div className="footer fixed">
        <ul className="dz-product-filter">
          <li>
            <a href="javascript:void(0);" onClick={toggleSortBy}>
              <i className="bx bx-up-arrow-alt bx-sm"></i>Sort
            </a>
            
          </li>
          <li>
            <a href="javascript:void(0);" onClick={() => setFilterOpen(!filterOpen)}>
              <i className="bx bx-filter bx-sm"></i>Filter
            </a>
          </li>
        </ul>
        </div>
              </div>
            </div>
          </div>
        )}


      </div>
      {sortByOpen || filterOpen ? <div className="offcanvas-backdrop fade show"></div> : null}

    </div>
  );
};
export default Product;



