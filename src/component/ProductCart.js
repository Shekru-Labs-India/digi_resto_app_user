import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import images from "../assets/MenuDefault.png";
import Swiper from "swiper";
import { useRestaurantId } from "../context/RestaurantIdContext";

const ProductCard = () => {
  const [menuList, setMenuList] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // Default set to null for 'All'
  const [customerId, setCustomerId] = useState(null);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const { restaurantId } = useRestaurantId();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setCustomerId(userData.customer_id);
    }
  }, []);

  useEffect(() => {
    const fetchMenuCategories = async () => {
      try {
        const response = await fetch(
          "https://menumitra.com/user_api/get_category_list",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              restaurant_id: restaurantId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.st === 1 && Array.isArray(data.lists)) {
          const formattedCategories = data.lists.map((category) => ({
            ...category,
            name: toTitleCase(category.name),
          }));
          setMenuCategories(formattedCategories);
          setSelectedCategoryId(null); // Ensure "All" is selected by default
          fetchMenuData(null); // Fetch all menu items initially
        } else {
          console.error("Categories fetch error:", data.msg);
          setMenuCategories([]);
        }
      } catch (error) {
        console.error("Error fetching menu categories:", error);
        setMenuCategories([]);
      }
    };

    if (restaurantId) {
      fetchMenuCategories();
    } else {
      console.error("Restaurant ID is not available");
    }
  }, [restaurantId]);

  useEffect(() => {
    const swiper = new Swiper(".category-slide", {
      slidesPerView: "auto",
      spaceBetween: 10,
    });
    // Ensure Swiper is destroyed on component unmount
    return () => swiper.destroy(true, true);
  }, [menuCategories]);

  const fetchMenuData = async (categoryId) => {
    try {
      const requestBody = {
        restaurant_id: restaurantId,
        cat_id: categoryId === null ? "all" : categoryId.toString(),
      };

      console.log("Fetching menu data with request:", requestBody); // Debugging line

      const response = await fetch(
        "https://menumitra.com/user_api/get_menu_by_cat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
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
            is_favourite: menu.is_favourite === 1,
          }));
          setMenuList(formattedMenuList);
          localStorage.setItem("menuItems", JSON.stringify(formattedMenuList));
          console.log("Fetched menu data:", formattedMenuList); // Debugging line
        } else {
          console.error("API Error:", data.msg);
          setMenuList([]); // Set an empty list if there's an error
        }
      } else {
        console.error("Network response was not ok.");
        setMenuList([]); // Handle network errors by clearing the list
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setMenuList([]); // Ensure menu list is empty if fetching fails
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId); // Update the state to reflect the selected category
    fetchMenuData(categoryId); // Fetch items for the selected category
  };

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const handleLikeClick = async (restaurantId, menuId) => {
    if (!customerId) {
      console.error("Customer ID is missing");
      return;
    }

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
        const updatedMenuList = menuList.map((menuItem) =>
          menuItem.menu_id === menuId
            ? { ...menuItem, is_favourite: !menuItem.is_favourite }
            : menuItem
        );
        setMenuList(updatedMenuList);
        localStorage.setItem("menuItems", JSON.stringify(updatedMenuList));
      } else {
        console.error("Failed to add/remove item from favorites");
      }
    } catch (error) {
      console.error("Error adding/removing item from favorites:", error);
    }
  };

  const handleAddToCartClick = (menu) => {
    console.log("Add to cart clicked for:", menu); // Debug: Check if function is called and which menu item

    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const isAlreadyInCart = cartItems.some(
      (item) => item.menu_id === menu.menu_id
    );

    if (isAlreadyInCart) {
      console.log("Item is already in the cart:", menu.menu_id); // Debug: Check if the item is recognized as already in the cart
      alert("This item is already in the cart!");
      return;
    }

    // Creating the cart item to be added
    const cartItem = {
      image: menu.image,
      name: menu.name,
      price: menu.price,
      oldPrice: menu.oldPrice,
      quantity: 1,
      menu_id: menu.menu_id,
    };

    const updatedCartItems = [...cartItems, cartItem];
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    console.log("Updated cart items:", updatedCartItems); // Debug: Check updated cart items in local storage

    const updatedMenuList = menuList.map((menuItem) => {
      if (menuItem.menu_id === menu.menu_id) {
        return { ...menuItem, is_favourite: "1" };
      }
      return menuItem;
    });

    setMenuList(updatedMenuList);
    navigate("/Cart");
  };

  const isMenuItemInCart = (menuId) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    return cartItems.some((item) => item.menu_id === menuId);
  };

  return (
    <div>
      <div className="dz-box">
        {menuCategories && menuCategories.length > 0 && (
          <div className="title-bar">
            <h5 className="title p-r50">Menu Category</h5>
            <Link to="/Category">
              <i className="bx bx-right-arrow-alt bx-sm"></i>
            </Link>
          </div>
        )}
        <div className="swiper category-slide">
          <div className="swiper-wrapper">
            <div
              className={`category-btn swiper-slide ${
                selectedCategoryId === null ? "active" : ""
              }`}
              onClick={() => handleCategorySelect(null)}
              style={{
                backgroundColor: selectedCategoryId === null ? "#0D775E" : "",
                color: selectedCategoryId === null ? "#ffffff" : "",
              }}
            >
              All
            </div>
            {menuCategories.map((category) => (
              <div key={category.menu_cat_id} className="swiper-slide">
                <div
                  className={`category-btn ${
                    selectedCategoryId === category.menu_cat_id ? "active" : ""
                  }`}
                  onClick={() => handleCategorySelect(category.menu_cat_id)}
                  style={{
                    backgroundColor:
                      selectedCategoryId === category.menu_cat_id
                        ? "#0D775E"
                        : "",
                    color:
                      selectedCategoryId === category.menu_cat_id
                        ? "#ffffff"
                        : "",
                  }}
                >
                  {category.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-3 grid-style-1">
        {menuList.length > 0 ? (
          menuList.map((menu) => (
            <div key={menu.menu_id} className="col-6">
              <div className="card-item style-6">
                <div className="dz-media">
                  <Link to={`/ProductDetails/${menu.menu_id}`}>
                    <img
                      src={menu.image || images}
                      alt={menu.name}
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
                    <h3 className="product-title">{menu.category}</h3>
                    {userData && (
                      <i
                        className={`bx ${
                          menu.is_favourite ? "bxs-heart text-red" : "bx-heart"
                        } bx-sm`}
                        onClick={() =>
                          handleLikeClick(restaurantId, menu.menu_id)
                        }
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
                  {menu.name && <h4 className="item-name">{menu.name}</h4>}
                  {menu.spicy_index && (
                    <div className="offer-code">{menu.spicy_index}</div>
                  )}
                  <div className="footer-wrapper">
                    <div className="price-wrapper">
                      <h6 className="current-price">₹{menu.price}</h6>
                      <span className="old-price">₹{menu.oldPrice}</span>
                    </div>
                    <div className="footer-btns">
                      {userData ? (
                        <div
                          onClick={() => handleAddToCartClick(menu)}
                          className="cart-btn"
                        >
                          {isMenuItemInCart(menu.menu_id) ? (
                            <i className="bx bxs-cart bx-sm"></i>
                          ) : (
                            <i className="bx bx-cart-add bx-sm"></i>
                          )}
                        </div>
                      ) : (
                        <i className="bx bx-cart-add bx-sm"></i>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No items available in this category.</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
