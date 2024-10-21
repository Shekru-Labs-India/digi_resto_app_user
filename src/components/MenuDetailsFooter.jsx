import React from 'react';
import { useNavigate } from 'react-router-dom';

const MenuDetailsFooter = ({
  isFromDifferentRestaurant,
  isItemOrdered,
  isMenuItemInCart,
  menuId,
  productDetails,
  quantity,
  handleAddToCart
}) => {
  const navigate = useNavigate();

  return (
    <div className="footer-fixed-btn bottom-0 pt-0 pe-0">
      <div className="container pt-0">
        <footer className="footer mb-2">
          <div className="row">
            <hr className="dashed-line me-5 pe-5" />

            <div className="col-5 ps-1 pe-0">
              <div className="d-flex align-items-center justify-content-between mb-5">
                <div className="d-flex flex-column">
                  <span className="mb-2 ps-0 menu_details-total-amount">
                    Total amount
                  </span>
                  <div className="d-flex align-items-baseline">
                    <h4 className="font_size_14 fw-semibold text-info">
                      ₹{(productDetails.price * quantity).toFixed(0)}
                    </h4>
                    <span className="text-decoration-line-through ms-2 font_size_12 fw-normal gray-text">
                      ₹{(productDetails.oldPrice * quantity).toFixed(0)}
                    </span>
                  </div>
                  <div className="font_size_12 text-success">
                    {productDetails.offer}% Off
                  </div>
                </div>
              </div>
            </div>
            <div className="col-7 px-0 text-center menu_details-add-to-cart">
              {isFromDifferentRestaurant ? (
                <button
                  className="btn btn-outline-secondary rounded-pill p-3"
                  disabled
                >
                  <div className="font-poppins text-break">
                    Different Restaurant
                  </div>
                </button>
              ) : isItemOrdered(menuId) ? (
                <button
                  className="btn btn-outline-primary rounded-pill"
                  disabled
                >
                  <i className="ri-check-line pe-1"></i>
                  <div className="font-poppins text-nowrap">Ordered</div>
                </button>
              ) : isMenuItemInCart(menuId) ? (
                <button
                  className="btn btn-color rounded-pill"
                  onClick={() => navigate("/Cart")}
                >
                  <i className="ri-shopping-cart-line pe-1 text-white"></i>
                  <div className="font-poppins text-nowrap text-white">
                    Go to Cart
                  </div>
                </button>
              ) : (
                <button
                  className="btn btn-color rounded-pill"
                  onClick={handleAddToCart}
                >
                  <i className="ri-shopping-cart-line pe-1 text-white"></i>
                  <div className="text-nowrap text-white">Add to Cart</div>
                </button>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MenuDetailsFooter;