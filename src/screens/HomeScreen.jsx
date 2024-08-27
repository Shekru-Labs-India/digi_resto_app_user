import React, { useState, useEffect } from "react";
import "../assets/css/style.css";
import Sidebar from "../component/Sidebar";
import Bottom from "../component/bottom";
import OfferBanner from "../component/OfferBanner";
import FeaturedArea from "../component/FeaturedArea";
import NearbyArea from "../component/NearbyArea";
import ProductCard from "../component/ProductCart"; // Ensure the correct import
import { useRestaurantId } from "../context/RestaurantIdContext"; // Assuming you have this context for restaurant info

const HomeScreen = () => {
  const { restaurantId, loading, error } = useRestaurantId();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(28); // Set menu_cat_id 28 as the default selected category
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    if (!restaurantId) return;

    // Fetch Categories
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://menumitra.com/owner_api/menu_category/listview",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ restaurant_id: restaurantId }),
          }
        );
        const data = await response.json();
        if (response.ok && data.st === 1) {
          console.log("Fetched Categories:", data.menucat_details);
          setCategories(data.menucat_details);
          // Check if menu_cat_id 28 exists in the fetched categories
          const defaultCategory = data.menucat_details.find(
            (category) => category.menu_cat_id === 28
          );
          if (defaultCategory) {
            setSelectedCategory(28);
          } else if (data.menucat_details.length > 0) {
            // If menu_cat_id 28 doesn't exist, default to the first available category
            setSelectedCategory(data.menucat_details[0].menu_cat_id);
          }
        } else {
          console.error("Failed to fetch categories:", data.msg);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    // Fetch Menu Items based on selected category
    const fetchMenuItems = async () => {
      if (!selectedCategory) return;

      try {
        const response = await fetch(
          `https://menumitra.com/owner_api/menu/listview`, // Correct the API endpoint if needed
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              restaurant_id: restaurantId,
              menu_cat_id: selectedCategory,
            }),
          }
        );
        const data = await response.json();
        console.log("Fetched Menu Items:", data.lists); // Log the fetched menu items

        if (response.ok && data.st === 1 && Array.isArray(data.lists)) {
          setMenuItems(data.lists); // Assuming 'lists' contains the menu items
        } else {
          console.error("Menu items list is not in expected format:", data);
          setMenuItems([]); // Clear menu items if the response isn't as expected
        }
      } catch (err) {
        console.error("Failed to fetch menu items", err);
        setMenuItems([]);
      }
    };

    fetchCategories();
    fetchMenuItems();
  }, [restaurantId, selectedCategory]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="page-wrapper">
      <Sidebar />

      <main className="page-content p-t100 p-b70">
        <div className="container overflow-hidden pt-0">
          {/* Offer Banner */}
          <OfferBanner />

          {/* Category Panel */}
          <div className="category-panel">
            <h2>Menu Category</h2>
            <div
              className="category-list"
              style={{
                display: "flex",
                overflowX: "auto",
                paddingBottom: "10px",
                marginBottom: "20px", // Space between category and products
              }}
            >
              {categories.map((category) => (
                <button
                  key={category.menu_cat_id}
                  onClick={() => setSelectedCategory(category.menu_cat_id)}
                  className={
                    selectedCategory === category.menu_cat_id ? "active" : ""
                  }
                  style={{
                    marginRight: "10px",
                    padding: "10px 15px", // Extra padding for a better click area
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    backgroundColor:
                      selectedCategory === category.menu_cat_id
                        ? "#28a745"
                        : "#fff",
                    color:
                      selectedCategory === category.menu_cat_id
                        ? "#fff"
                        : "#000",
                    minWidth: "100px", // Ensure buttons are consistent in size
                    textAlign: "center", // Center the text inside the button
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products Section */}
          <div className="products-section">
            {menuItems.length > 0 ? (
              <div
                className="product-grid"
                style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}
              >
                {menuItems.map((item) => (
                  <ProductCard key={item.menu_id} product={item} />
                ))}
              </div>
            ) : (
              <p>No menu items available in this category</p>
            )}
          </div>

          {/* Featured Area or Product Section */}
          <FeaturedArea />

          {/* Nearby Area Section */}
          <NearbyArea />
        </div>
      </main>

      <Bottom />
    </div>
  );
};

export default HomeScreen;
