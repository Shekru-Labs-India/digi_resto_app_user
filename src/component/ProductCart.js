import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import Swiper from "swiper";

const ProductCard = () => {
  const [menuList, setMenuList] = useState([]);
  const navigate = useNavigate();
  const [menuCategories, setMenuCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const filteredMenuList =
    selectedCategory === null
      ? menuList // If selectedCategory is null, show all menu items
      : menuList.filter(
          (menu) =>
            menu.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

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
        // Handle success response as needed
        console.log("Item added to favorites successfully");
        navigate("/Wishlist");
      } else {
        console.error("Failed to add item to favorites");
      }
    } catch (error) {
      console.error("Error adding item to favorites:", error);
    }
  };

  const handleAddToCartClick = (menu) => {
    const cartItem = {
      image: menu.image,
      name: menu.name,
      price: menu.price,
      oldPrice: menu.oldPrice,
      quantity: 1, // Default quantity is 1
    };

    // Simulate adding to local storage (replace with your logic)
    const updatedCartItems =
      JSON.parse(localStorage.getItem("cartItems")) || [];
    updatedCartItems.push(cartItem);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

    // Navigate to Cart screen
    navigate("/Cart");
  };

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(
          "http://194.195.116.199/user_api/get_menu_by_cat",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              restaurant_code: 611447,
              cat_id: 18,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.st === 1) {
            const formattedMenuList = data.menu_list.map((menu) => ({
              ...menu,
              image: menu.image,
              category: toTitleCase(menu.category),
              name: toTitleCase(menu.name),
              oldPrice: Math.floor(menu.price * 1.1),
            }));
            setMenuList(formattedMenuList);
          } else {
            console.error("API Error:", data.msg);
          }
        } else {
          console.error("Network response was not ok.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMenuData();
  }, []);

  useEffect(() => {
    const fetchMenuCategories = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: 13,
          }),
        };

        const response = await fetch(
          "http://194.195.116.199/user_api/get_category_list",
          requestOptions
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.st === 1 && Array.isArray(data.lists)) {
          // Convert category names to title case before setting state
          const formattedCategories = data.lists.map((category) => ({
            ...category,
            name: toTitleCase(category.name), // Convert category name to title case
          }));
          setMenuCategories(formattedCategories);
        } else {
          setMenuCategories([]);
        }
      } catch (error) {
        console.error("Error fetching menu categories:", error);
        setMenuCategories([]);
      }
    };

    fetchMenuCategories();
  }, []);

  useEffect(() => {
    const swiper = new Swiper(".category-slide", {
      slidesPerView: "auto",
      spaceBetween: 10,
    });
  }, [menuCategories]);

  return (
    <div>
      <div className="dz-box">
        <div className="title-bar">
          <h5 className="title p-r50">Menu Category</h5>
          <Link to="/Category">
            <i className="bx bx-right-arrow-alt bx-sm"></i>
          </Link>
        </div>
        <div className="swiper category-slide">
          <div className="swiper-wrapper">
            <div
              className={`category-btn swiper-slide ${
                selectedCategory === null ? "active" : ""
              }`}
              onClick={() => handleCategorySelect(null)} // Set selectedCategory to null for "ALL"
            >
              All
            </div>
            {menuCategories.map((category) => (
              //                 <div className="swiper-slide" key={category.menu_cat_id}>
              //                     <Link to={`category-btn ${selectedCategory === category.name ? 'active' : ''}`}
              // onClick={() => handleCategorySelect(category.name)} className="category-btn">{category.name}</Link>
              //                 </div>

              <div
                key={category.menu_cat_id}
                className={`category-btn swiper-slide ${
                  selectedCategory === category.name ? "active" : ""
                }`}
                onClick={() => handleCategorySelect(category.name)}
              >
                {category.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-3 grid-style-1">
        {filteredMenuList.map((menu) => (
          <div key={menu.menu_id} className="col-6">
            <div className="card-item style-6">
              <div className="dz-media">
                {/* <img
                src={menu.image}
                alt="Menu Item"
                style={{ height: "150px" }}
              /> */}
                <img
                  src={menu.image}
                  alt={menu.name}
                  style={{ height: "150px" }}
                  onError={(e) => {
                    e.target.src = images; // Set local image source on error
                  }}
                />
              </div>
              <div className="dz-content">
                <span className="product-title">
                  {menu.category}

                  <i
                    className="bx bx-heart bx-sm"
                    style={{ marginLeft: "77px" }}
                    onClick={() => handleLikeClick(13, menu.menu_id, 1)} // Customize with your parameters
                  ></i>
                </span>
                <h4 className="item-name">
                  <Link
                    to={{
                      pathname: "/ProductDetails",
                      state: {
                        restaurant_id: menu.restaurant_id, // Assuming menu object contains restaurant_id
                        menu_id: menu.menu_id,
                      },
                    }}
                  >
                    {menu.name}
                  </Link>
                </h4>
                <div className="offer-code">
                  Spicy Level: {menu.spicy_index}
                </div>
                <div className="footer-wrapper">
                  <div className="price-wrapper">
                    <h6 className="current-price">₹{menu.price}</h6>
                    <span className="old-price">₹{menu.oldPrice}</span>
                  </div>
                  <div
                    onClick={() => handleAddToCartClick(menu)}
                    className="cart-btn btn-outline-primary"
                  >
                    <i className="bx bx-cart bx-sm"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
