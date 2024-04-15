// import React from 'react';
// import { Link } from 'react-router-dom';

// const Productcartwishlist = ({ imageUrl, productName, price, oldPrice, restaurantName, onRemove }) => {
//   const handleRemoveClick = () => {
//     // Call the onRemove callback function passed from the parent component
//     onRemove();
//   };

//   return (
//     <div className="col-12">
//       <div className="dz-card list-style style-3">
//         <div className="dz-media">
//           <a href="product-detail.html">
//             <img src={imageUrl} alt={productName} />
//           </a>
//         </div>
//         <div className="dz-content">
//           <h5 className="title"><a href="product-detail.html">{productName}</a></h5>
//           <ul className="dz-meta">
//             <li className="dz-price">₹{price}<del>₹{oldPrice}</del></li>
//             <li className="dz-review"> <span>{restaurantName} </span></li>
//           </ul>
//           {/* Handle the Remove button click */}
//           <div onClick={handleRemoveClick} className="remove-text">Remove </div>
//           <Link to="/Cart" className="cart-btn">  <i className='bx bx-cart bx-sm' ></i></Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Productcartwishlist;



import React from 'react';
import { useNavigate } from 'react-router-dom';

const Productcartwishlist = ({ image, name, price, oldPrice, restaurantName, onRemove, onAddToCart }) => {
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
      restaurantName
    };

    // Call the onAddToCart callback function passed from the parent component
    onAddToCart(item);
    navigate('/Cart');
  };

  return (
    <div className="col-12">
      <div className="dz-card list-style style-3">
        <div className="dz-media">
          <a href="product-detail.html">
            <img src={image} alt={name} />
          </a>
        </div>
        <div className="dz-content">
          <h5 className="title"><a href="product-detail.html">{name}</a></h5>
          <ul className="dz-meta">
            <li className="dz-price">₹{price}<del>₹{oldPrice}</del></li>
            <li className="dz-review"> <span>{restaurantName} </span></li>
          </ul>
          {/* Handle the Remove button click */}
          <div onClick={handleRemoveClick} className="remove-text">Remove</div>
          {/* Handle the Add to Cart button click */}
          <div onClick={handleAddToCartClick} className="cart-btn">
            <i className='bx bx-cart bx-sm'></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Productcartwishlist;
