import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import Swiper from "swiper";
import { Link } from "react-router-dom";
import { useRestaurantId } from '../context/RestaurantIdContext';
const Product = () => {
  const [menuList, setMenuList] = useState([]);

  const [categories, setCategories] = useState([]);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [filteredMenuList, setFilteredMenuList] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [sortByOpen, setSortByOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [priceRange, setPriceRange] = useState({ min: 100, max: 1000 }); // Initial price range
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const { restaurantId } = useRestaurantId();
  const [selectedCategory, setSelectedCategory] = useState(null);

  // useEffect(() => {
  //   const swiper = new Swiper(".category-slide", {
  //     slidesPerView: "auto",
  //     spaceBetween: 10,
  //   });

  //   return () => {
  //     swiper.destroy();
  //   };
  // }, []);

  useEffect(() => {
    const swiper = new Swiper(".category-slide", {
      slidesPerView: "auto",
      spaceBetween: 10,
    });
  }, [categories]);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(
          "https://menumitra.com/user_api/get_product_list",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ restaurant_id: 13, cat_id: "all" }),
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
            is_favourite: menuItem.is_favourite === 1,
          }));

          setMenuList(formattedMenuList);
          localStorage.setItem("menuItems", JSON.stringify(formattedMenuList));

          const formattedCategories = data.MenuCatList.map((category) => ({
            ...category,
            name: toTitleCase(category.name),
          }));

          setCategories(formattedCategories);

          // Initially, display all menu items
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
        "https://menumitra.com/user_api/save_favourite_menu",
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
        // Toggle is_favourite locally
        const updatedMenuList = menuList.map((menuItem) =>
          menuItem.menu_id === menuId
            ? { ...menuItem, is_favourite: !menuItem.is_favourite }
            : menuItem
        );
        setMenuList(updatedMenuList);
        localStorage.setItem("menuItems", JSON.stringify(updatedMenuList));
        navigate("/Wishlist");
      } else {
        console.error("Failed to add/remove item from favorites");
      }
    } catch (error) {
      console.error("Error adding/removing item from favorites:", error);
    }
  };

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItemsCount(cartItems.length); // Update cart items count based on stored items
  }, []);

  const handleAddToCartClick = (menuItem) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const isAlreadyInCart = cartItems.some(
      (item) => item.menu_id === menuItem.menu_id
    );

    if (isAlreadyInCart) {
      alert("This item is already in the cart!");
      return;
    }

    const cartItem = {
      image: menuItem.image,
      name: menuItem.name,
      price: menuItem.price,
      oldPrice: menuItem.oldPrice,
      quantity: 1,
      menu_id: menuItem.menu_id,
    };

    const updatedCartItems = [...cartItems, cartItem];
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setCartItemsCount(updatedCartItems.length); // Update cart items count
    navigate("/Cart");
  };

  const isMenuItemInCart = (menuId) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    return cartItems.some((item) => item.menu_id === menuId);
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
    if (categoryName === selectedCategory) {
      setSelectedCategory(null);
      setFilteredMenuList(menuList); // Show all menu items
    } else {
      setSelectedCategory(categoryName);
      const filteredItems = menuList.filter(
        (item) => toTitleCase(item.menu_cat_name) === toTitleCase(categoryName)
      );
      setFilteredMenuList(filteredItems);
    }
  };

  const toggleSortBy = () => {
    setSortByOpen(!sortByOpen);
  };

  const sortMenuByPrice = () => {
    // Get the selected sorting order (sort by name or sort by price)
    const selectedSortOrder = document.querySelector(
      'input[name="sortRadio"]:checked'
    ).id;

    // Create a copy of the filtered menu list to perform sorting
    const sortedMenu = [...filteredMenuList];

    if (selectedSortOrder === "sortRadio1") {
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
    } else if (selectedSortOrder === "sortRadio2") {
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
      return ""; // Handle undefined or null input gracefully
    }

    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handlePriceFilter = () => {
    // Filter menu items based on the selected price range
    const filteredItems = menuList.filter(
      (item) => item.price >= 100 // Filter items with price greater than or equal to 100
    );

    // Update the filteredMenuList state with the filtered items
    setFilteredMenuList(filteredItems);

    // Close the filter menu after applying the filter
    setFilterOpen(false);
  };

  return (
    <div className={`page-wrapper ${sortByOpen || filterOpen ? "open" : ""}`}>
      {/* Header */}
      <header className="header header-fixed style-3 ">
        <div className="header-content">
          <div className="left-content">
            <div
              className="back-btn dz-icon icon-fill icon-sm"
              onClick={handleBack}
            >
              <i className="bx bx-arrow-back"></i>
            </div>
          </div>
          <div className="mid-content">
            <h5 className="title">
              Menu
              {/* <span className="items-badge">{menuList.length}</span> */}
            </h5>
          </div>
          <div className="right-content">
            <Link
              to="/Cart"
              className="notification-badge dz-icon icon-sm icon-fill"
            >
              <i className="bx bx-cart bx-sm"></i>
              {userData && (
                <span className="badge badge-danger">{cartItemsCount}</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={`page-content space-top p-b80 ${
          sortByOpen || filterOpen ? "open" : ""
        }`}
      >
        {/* Category Slide */}
        <div
          className={`container pb-0 ${sortByOpen || filterOpen ? "open" : ""}`}
        >
          <div className="swiper category-slide">
            <div className="swiper-wrapper">
              <div
                className={`category-btn swiper-slide ${
                  selectedCategory === null ? "active" : ""
                }`}
                onClick={() => handleCategoryFilter(null)}
                style={{
                  backgroundColor: selectedCategory === null ? "#0D775E" : "",
                  color: selectedCategory === null ? "#ffffff" : "",
                }}
              >
                All
              </div>

              {/* Other Category Buttons */}
              {categories.map((category) => (
                <div key={category.menu_cat_id} className="swiper-slide">
                  <div
                    className="category-btn"
                    onClick={() => handleCategoryFilter(category.name)}
                  >
                    {category.name}
                  </div>
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
                        style={{ height: "150px" }}
                        onError={(e) => {
                          e.target.src = images;
                        }}
                      />
                    </Link>
                  </div>

                  <div className="dz-content">
                    <div
                      className="detail-content"
                      style={{ position: "relative" }}
                    >
                      <h3 className="product-title">{menuItem.category}</h3>

                      {userData ? (
                        <i
                          className={`bx ${
                            menuItem.is_favourite
                              ? "bxs-heart text-red"
                              : "bx-heart"
                          } bx-sm`}
                          onClick={() =>
                            handleLikeClick(13, menuItem.menu_id, 1)
                          }
                          style={{
                            position: "absolute",
                            top: "0",
                            right: "0",
                            fontSize: "23px",
                            cursor: "pointer",
                          }}
                        ></i>
                      ) : (
                        <i
                          className=" bx bx-heart"
                          style={{
                            position: "absolute",
                            top: "0",
                            right: "0",
                            fontSize: "23px",
                            cursor: "pointer",
                          }}
                        ></i>
                      )}
                    </div>

                    <h4 className="item-name">{menuItem.name}</h4>
                    <div className="offer-code">
                      Spicy Level: {menuItem.spicy_index}
                    </div>
                    <div className="footer-wrapper">
                      <div className="price-wrapper">
                        <h6 className="current-price">₹{menuItem.price}</h6>
                        <span className="old-price">₹{menuItem.oldPrice}</span>
                      </div>
                      {userData ? (
                        <div
                          onClick={() => handleAddToCartClick(menuItem)}
                          className="cart-btn"
                        >
                          {isMenuItemInCart(menuItem.menu_id) ? (
                            <i className="bx bxs-cart bx-sm"></i> // Already in cart
                          ) : (
                            <i className="bx bx-cart-add bx-sm"></i> // Add to cart
                          )}
                        </div>
                      ) : (
                        <i className="bx bx-cart-add bx-sm"></i>
                      )}
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
            <a
              href="javascript:void(0);"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <i className="bx bx-filter bx-sm"></i>Filter
            </a>
          </li>
        </ul>

        {/* Sort By Offcanvas */}
        {sortByOpen && (
          <div
            className="offcanvas offcanvas-bottom p-b60 show "
            tabIndex="-1"
            id="offcanvasBottom1"
          >
            <div className="offcanvas-header ">
              <h4 className="offcanvas-title">Sort By</h4>
              <button
                type="button"
                className="btn-close style-2"
                onClick={toggleSortBy}
                aria-label="Close"
              >
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
                    Sort by Name
                  </label>
                </div>
                <div className="form-check style-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="sortRadio"
                    id="sortRadio2"
                  />
                  <label className="form-check-label" htmlFor="sortRadio2">
                    Sort by Price
                  </label>
                </div>
              </div>
              <br></br>
              <button
                onClick={sortMenuByPrice}
                className="btn btn-primary btn-thin w-50 rounded-xl"
                style={{ marginLeft: "180px" }}
              >
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
                    <a
                      href="javascript:void(0);"
                      onClick={() => setFilterOpen(!filterOpen)}
                    >
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
          <div
            className="offcanvas offcanvas-bottom p-b60 show "
            tabIndex="-1"
            id="offcanvasBottom2"
          >
            <div className="offcanvas-header">
              <h4 className="offcanvas-title">Filters</h4>
              <button
                type="button"
                className="btn-close style-2"
                onClick={() => setFilterOpen(!filterOpen)}
                aria-label="Close"
              >
                <i className="bx bx-x bx-sm"></i>
              </button>
            </div>
            <div className="offcanvas-body">
              <div className="filter-inner-content">
                <div className="title-bar">
                  <h5 className="sub-title">Price:</h5>
                </div>
                <span>₹{priceRange.min}</span>
                <input
                  type="range"
                  min={100}
                  max={1000}
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({
                      ...priceRange,
                      min: parseInt(e.target.value),
                    })
                  }
                  className="custom-range"
                  style={{ width: "100%" }}
                />
                <input
                  type="range"
                  min={100}
                  max={1000}
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({
                      ...priceRange,
                      max: parseInt(e.target.value),
                    })
                  }
                  className="custom-range"
                  style={{ width: "100%" }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
                >
                  <span>₹{priceRange.max}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <a
                    onClick={handlePriceFilter}
                    className="btn btn-primary btn-thin w-50 rounded-xl"
                    style={{ marginLeft: "180px" }}
                  >
                    Apply
                  </a>
                  {/* <a onClick={handleResetFilter} className="btn btn-white btn-thin w-100 rounded-xl">
                  Reset
                </a> */}
                </div>

                <div className="footer fixed">
                  <ul className="dz-product-filter">
                    <li>
                      <a href="javascript:void(0);" onClick={toggleSortBy}>
                        <i className="bx bx-up-arrow-alt bx-sm"></i>Sort
                      </a>
                    </li>
                    <li>
                      <a
                        href="javascript:void(0);"
                        onClick={() => setFilterOpen(!filterOpen)}
                      >
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
      {sortByOpen || filterOpen ? (
        <div className="offcanvas-backdrop fade show"></div>
      ) : null}
    </div>
  );
};
export default Product;
