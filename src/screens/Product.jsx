import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Product = () => {
  const [categories, setCategories] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [filteredMenuList, setFilteredMenuList] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [sortByOpen, setSortByOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch('http://194.195.116.199/user_api/get_product_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ restaurant_id: 13 })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch menu data');
        }

        const data = await response.json();

        if (data.st === 1) {
          setCategories(data.MenuCatList);
          setMenuList(data.MenuList);
          setFilteredMenuList(data.MenuList);
        } else {
          throw new Error('API request unsuccessful');
        }
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    };

    fetchMenuData();
  }, []);

  const handleCategoryFilter = (category) => {
    if (category === activeCategory) {
      // If the same category is clicked again, clear the filter
      setFilteredMenuList(menuList);
      setActiveCategory(null);
    } else {
      // Filter menu items based on selected category
      const filteredItems = menuList.filter((item) => item.menu_cat_name === category);
      setFilteredMenuList(filteredItems);
      setActiveCategory(category);
    }
  };

  const toggleSortBy = () => {
    setSortByOpen(!sortByOpen);
  };

  const sortMenuByPrice = () => {
    const sortedMenu = [...filteredMenuList].sort((a, b) => a.price - b.price);
    setFilteredMenuList(sortedMenu);
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  return (
    <div className="page-wrapper">
      {/* Header - omitted for brevity */}

      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <Link to="/HomeScreen" className="back-btn dz-icon icon-fill icon-sm">
              <i className='bx bx-arrow-back'></i>
            </Link>
          </div>
          

          <div className="right-content d-flex align-items-center gap-3 lh-1 ps-2">
            <ul className="dz-tab nav nav-pills light style-1 list" role="tablist">
              <Link to="/Cart" className="notification-badge font-20" style={{ marginLeft: 'auto' }}>
                <i className='bx bx-cart bx-sm'></i>
                <span className="badge badge-danger">14</span>
              </Link>
            </ul>
          </div>
        </div>
      </header>

      {/* Main Content Start */}
      <main className="page-content space-top p-b80">
        <div className="tab-content" id="pills-tabContent">
          {/* Category Slide */}
          <div className="swiper category-slide">
            <div className="swiper-wrapper">
              {categories.map((category) => (
                <div key={category.menu_cat_id} className="swiper-slide">
                  <a
                    href="javascript:void(0);"
                    className={`category-btn ${activeCategory === category.name ? 'active' : ''}`}
                    onClick={() => handleCategoryFilter(category.name)}
                  >
                    {category.name}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Product Cards */}
          <div className="container pb-0">
            <div className="row gx-3 gy-2">
              {filteredMenuList.map((menuItem) => (
                <div key={menuItem.menu_id} className="col-6">
                  <div className="dz-card style-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <div className="dz-media" style={{ marginTop: '10px', width: '100%', height: '200px', overflow: 'hidden' }}>
                      <Link to={`/ProductDetails/${menuItem.menu_id}`}>
                        <img src={menuItem.image} alt={menuItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Link>
                    </div>
                    <div className="dz-content" style={{ textAlign: 'center', marginTop: '10px', flex: '1' }}>
                      <h6 className="title" style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                        <Link to={`/ProductDetails/${menuItem.menu_id}`}>{menuItem.name}</Link>
                      </h6>
                      <div className="dz-meta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div className="dz-price" style={{  textTransform: 'capitalize' }}>
                          ${menuItem.price}
                        </div>
                        <div className="dz-category" style={{ color: 'blue', textTransform: 'capitalize' }}>
                          {menuItem.menu_cat_name}
                        </div>
                        <a href="javascript:void(0);" className="item-bookmark">
                          <i className="feather icon-heart-on"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Sort and Filter Buttons */}
      <div className="footer fixed">
        <ul className="dz-product-filter">
          <li>
            <a href="javascript:void(0);" onClick={toggleSortBy}>
              <i className="fi fi-rr-arrow-up"></i>Sort
            </a>
          </li>
          <li>
            <a href="javascript:void(0);" onClick={toggleFilter}>
              <i className="fi fi-rr-filter"></i>Filter
            </a>
          </li>
        </ul>

        {/* Sort By Offcanvas */}
        {sortByOpen && (
          <div className="offcanvas offcanvas-bottom p-b60" tabIndex="-1" id="offcanvasBottom1" aria-labelledby="offcanvasBottomLabel1">
            {/* Sort By content - omitted for brevity */}
            <div className="sort-options">
              <button onClick={sortMenuByPrice}>Sort by Price (Low to High)</button>
            </div>
          </div>
        )}

        {/* Filter Offcanvas */}
        {filterOpen && (
          <div className="offcanvas offcanvas-bottom p-b60" tabIndex="-1" id="offcanvasBottom2" aria-labelledby="offcanvasBottomLabel2">
            {/* Filter content - omitted for brevity */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
