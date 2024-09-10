import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import images from "../assets/MenuDefault.png";
import Swiper from "swiper";
import { debounce } from "lodash"; // Make sure to install lodash

const ProductCard = () => {
  const [menuList, setMenuList] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const navigate = useNavigate();
  const { restaurantId } = useRestaurantId();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const customerId = userData ? userData.customer_id : null;

  const [isLoading, setIsLoading] = useState(false);

  const fetchMenuCategories = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
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
        setSelectedCategoryId(null); // Set to null initially
        fetchMenuData(null); // Fetch all menu items
      } else {
        console.error("Categories fetch error:", data.msg);
        setMenuCategories([]);
      }
    } catch (error) {
      console.error("Error fetching menu categories:", error);
      setMenuCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId]);

  const fetchMenuData = useCallback(
    async (categoryId) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const requestBody = {
          restaurant_id: restaurantId,
          cat_id: categoryId === null ? "all" : categoryId.toString(),
        };

        console.log("Fetching menu data with:", requestBody);

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

        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok) {
          if (data.st === 1) {
            if (Array.isArray(data.menu_list) && data.menu_list.length > 0) {
              const formattedMenuList = data.menu_list.map((menu) => ({
                ...menu,
                image: menu.image,
                category: toTitleCase(menu.category),
                name: toTitleCase(menu.name),
                oldPrice: Math.floor(menu.price * 1.1),
                is_favourite: menu.is_favourite === 1,
              }));
              setMenuList(formattedMenuList);
              localStorage.setItem(
                "menuItems",
                JSON.stringify(formattedMenuList)
              );
            } else {
              console.log("No menu items found for the given category");
              setMenuList([]);
            }
          } else {
            console.error("API Error:", data.msg);
            setMenuList([]);
          }
        } else {
          console.error("Network response was not ok. Status:", response.status);
          setMenuList([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMenuList([]);
      } finally {
        setIsLoading(false);
      }
    },
    [restaurantId]
  );

  const debouncedFetchMenuData = useCallback(
    debounce((categoryId) => {
      fetchMenuData(categoryId);
    }, 300),
    [fetchMenuData]
  );

  useEffect(() => {
    let isMounted = true;
    if (restaurantId && !isLoading) {
      const fetchData = async () => {
        await fetchMenuCategories();
        if (isMounted) {
          await fetchMenuData(null);
        }
      };
      fetchData();
    }
    return () => {
      isMounted = false;
    };
  }, [restaurantId, fetchMenuCategories, fetchMenuData]);

  useEffect(() => {
    const swiper = new Swiper(".category-slide", {
      slidesPerView: "auto",
      spaceBetween: 10,
    });
    return () => swiper.destroy(true, true);
  }, [menuCategories]);

  const handleLikeClick = async (menuId) => {
    if (!customerId || !restaurantId) {
      console.error("Missing required data");
      return;
    }

    const menuItem = menuList.find((item) => item.menu_id === menuId);
    const isFavorite = menuItem.is_favourite;

    const apiUrl = isFavorite
      ? "https://menumitra.com/user_api/delete_favourite_menu"
      : "https://menumitra.com/user_api/save_favourite_menu";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          menu_id: menuId,
          customer_id: customerId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1) {
          const updatedMenuList = menuList.map((item) =>
            item.menu_id === menuId
              ? { ...item, is_favourite: !isFavorite }
              : item
          );
          setMenuList(updatedMenuList);
          console.log(
            isFavorite ? "Removed from favorites" : "Added to favorites"
          );
        } else {
          console.error("Failed to update favorite status:", data.msg);
        }
      } else {
        console.error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const handleCategorySelect = useCallback(
    (categoryId) => {
      setSelectedCategoryId(categoryId);
      debouncedFetchMenuData(categoryId);
    },
    [debouncedFetchMenuData]
  );

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const handleAddToCartClick = (menu) => {
    console.log("Adding to cart:", menu);
    try {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      console.log("Current cart items:", cartItems);

      const isAlreadyInCart = cartItems.some(
        (item) => item.menu_id === menu.menu_id
      );

      if (isAlreadyInCart) {
        console.log("Item already in cart");
        alert("This item is already in the cart!");
        return;
      }

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
      console.log("Updated cart items:", updatedCartItems);
      
      // Verify that the item was added to localStorage
      const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      console.log("Stored cart items after update:", storedCartItems);

      if (storedCartItems.length === updatedCartItems.length) {
        console.log("Cart item successfully added to localStorage");
      } else {
        console.error("Failed to add cart item to localStorage");
      }

      navigate("/Cart");
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const isMenuItemInCart = (menuId) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    return cartItems.some((item) => item.menu_id === menuId);
  };

  const totalMenuCount = menuList.length;

  return (
    <div>
      <div className="dz-box">
        {menuCategories && menuCategories.length > 0 && (
          <div className="title-bar">
            <h5 className="title p-r50">Menu Category</h5>
            <Link to="/Category">
              <i
                className="ri-arrow-right-line"
                style={{ fontSize: "18px" }}
              ></i>
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
              All ({totalMenuCount})
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
                  {category.name} ({category.menu_count}){" "}
                  {/* Display menu count */}
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
                    className="detail-content category-text"
                    style={{ position: "relative" }}
                  >
                    <div
                      className="dz-quantity detail-content"
                      style={{ fontSize: "12px" }}
                    >
                      <i
                        class="ri-restaurant-line"
                        style={{ paddingRight: "5px" }}
                      ></i>
                      {menu.category}
                    </div>
                    {userData && (
                      <i
                        className={`ri-heart-${menu.is_favourite ? 'fill' : 'line'}`}
                        onClick={() => handleLikeClick(menu.menu_id)}
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0",
                          fontSize: "23px",
                          cursor: "pointer",
                          color: menu.is_favourite ? "red" : "inherit"
                        }}
                      ></i>
                    )}
                  </div>

                  {menu.name && <h4 className="item-name">{menu.name}</h4>}
                  {menu.spicy_index && (
                    <div className="offer-code">
                      {/* Displaying the spicy index using icons */}
                      {Array.from({ length: 5 }).map((_, index) =>
                        index < menu.spicy_index ? (
                          <i
                            className="ri-fire-fill"
                            style={{ fontSize: "12px" }}
                            key={index}
                          ></i>
                        ) : (
                          <i
                            className="ri-fire-line"
                            style={{ fontSize: "12px", color: "#0000001a" }}
                            key={index}
                          ></i>
                        )
                      )}
                    </div>
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
                            <i
                              className="ri-shopping-cart-2-fill"
                              style={{ fontSize: "25px" }}
                            ></i>
                          ) : (
                            <i
                              className="ri-shopping-cart-2-line"
                              style={{ fontSize: "25px" }}
                            ></i>
                          )}
                        </div>
                      ) : (
                        <i
                          className="ri-shopping-cart-2-line"
                          style={{ fontSize: "25px" }}
                        ></i>
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
