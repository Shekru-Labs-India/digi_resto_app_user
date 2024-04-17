import React from "react";
import { useNavigate, Link } from "react-router-dom";
import images from "../assets/MenuDefault.png";

const Productcartwishlist = ({
  image,
  name,
  price,
  oldPrice,
  restaurantName,
  onRemove,
  onAddToCart,
}) => {
  const handleRemoveClick = () => {
    // Call the onRemove callback function passed from the parent component
    onRemove();
  };
  const navigate = useNavigate();
  const handleAddToCartClick = () => {
    // Create an item object to add to cart
    const item = {
      image,
      name,
      price,
      oldPrice,
      restaurantName,
    };

    // Call the onAddToCart callback function passed from the parent component
    onAddToCart(item);
    navigate("/Cart");
  };

  return (
    <div className="col-12">
      <div className="dz-card list-style style-3">
        <div className="dz-media">
          <Link to="/ProductDetails">
            {/* <img src={image} alt={name} /> */}

            <img
            style={{width:'100px',height:'100px'}}
              src={image}
              alt={name}
              onError={(e) => {
                e.target.src = images; // Set local image source on error
                e.target.style.width = "100px"; // Example: Set width of the local image
                e.target.style.height = "100px"; // Example: Set height of the local image
              }}
            />
          </Link>
        </div>
        <div className="dz-content">
          <h5 className="title">
            <Link to="/ProductDetails"></Link>
          </h5>
          <div>
              <span>{restaurantName} </span>
            </div> 
          <ul className="dz-meta">
            <li className="dz-price">
              ₹{price}
              <del>₹{oldPrice}</del>
            </li>
            </ul>
           
          
          {/* Handle the Remove button click */}
          <div onClick={handleRemoveClick} className="remove-text">
            Remove
          </div>
          {/* Handle the Add to Cart button click */}
          <div onClick={handleAddToCartClick} className="cart-btn">
            <i className="bx bx-cart bx-sm"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productcartwishlist;
