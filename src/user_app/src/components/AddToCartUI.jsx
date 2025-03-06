// menumitra/src/user_app/src/components/AddToCartUI.jsx

import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useRestaurantId } from "../context/RestaurantIdContext";

const AddToCartUI = ({
  showModal,
  setShowModal,
  productDetails,
  comment,
  setComment,
  portionSize,
  setPortionSize,
  handleConfirmAddToCart,
  handleSuggestionClick,
  handleModalClick,
}) => {
  const [prices, setPrices] = useState({ halfPrice: null, fullPrice: null });
  const [isPriceFetching, setIsPriceFetching] = useState(true);
  const { fetchMenuPrices } = useCart();
  const { restaurantId } = useRestaurantId();
  const [quantity, setQuantity] = useState(1);
  const [commentError, setCommentError] = useState("");

  const handleQuantityChange = (action) => {
    setQuantity(prev => {
      if (action === 'increment') {
        if (prev >= 20) {
          window.showToast("info", "Maximum quantity limit reached (20)");
          return prev;
        }
        return prev + 1;
      }
      if (action === 'decrement' && prev > 1) return prev - 1;
      return prev;
    });
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;

    // ✅ Updated regex to block special characters and emojis
    const validPattern = /^[a-zA-Z0-9\-\/\s.]*$/u;

    if (!validPattern.test(value)) {
        setCommentError("Only letters, numbers, dashes (-), slashes (/), dots (.) are allowed.");
        return; // Stop further execution
    }

    setComment(value); // ✅ Update state only if valid

    if (value.length < 5) {
        setCommentError("Comment should be between 5 and 30 characters.");
    } else if (value.length > 30) {
        setCommentError("Comment should be between 5 and 30 characters.");
    } else {
        setCommentError(""); // ✅ No errors
    }
};

  

  const checkAuthAndFetchPrices = async () => {
    if (!showModal || !productDetails?.menu_id) return;
    
    setIsPriceFetching(true);
    const priceData = await fetchMenuPrices(restaurantId, productDetails.menu_id);
    
    if (priceData?.error === 'unauthorized') {
      setShowModal(false);
      return false;
    }
    
    if (priceData) {
      setPrices(priceData);
      setIsPriceFetching(false);
      return true;
    }
    
    return false;
  };

  useEffect(() => {
    if (showModal) {
      checkAuthAndFetchPrices();
    }
  }, [showModal, productDetails?.menu_id, restaurantId]);

  const handleConfirmWithQuantity = () => {
    // Create a new product object with quantity
    const productWithQuantity = {
      ...productDetails,
      quantity: quantity,
      comment: comment,
      half_or_full: portionSize,
      price: portionSize === "half" ? prices.halfPrice : prices.fullPrice,
    };
    handleConfirmAddToCart(productWithQuantity);
  };

  if (!showModal || isPriceFetching) return null;

  return (
    <>
      <div
        className="modal fade show d-flex align-items-center justify-content-center"
        style={{ display: "block" }}
        onClick={handleModalClick}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content"
            style={{
              width: "350px",
              margin: "auto",
            }}
          >
            <div className="modal-header ps-3 pe-2">
              <div className="col-10 text-start">
                <div className="modal-title font_size_16 fw-medium">
                  Add {productDetails.name || productDetails.menu_name} to
                  Checkout
                </div>
              </div>

              <div className="col-2 text-end">
                <div className="d-flex justify-content-end">
                  <button
                    className="btn p-0 fs-3 gray-text"
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  >
                    <i className="fa-solid fa-xmark gray-text font_size_14 pe-3"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-body py-2 px-3">
              <div className="mb-3 mt-0">
                <label
                  htmlFor="comment"
                  className="form-label d-flex justify-content-start font_size_14 fw-normal"
                >
                  Special Instructions
                </label>
                <input
                  type="text"
                  className="form-control font_size_16 border border-light rounded-4"
                  id="comment"
                  value={comment}
                  onChange={handleCommentChange}
                  placeholder="Add any special instructions here..."
                />
                {commentError && (
                  <div className="text-danger font_size_12 mt-1">
                    {commentError}
                  </div>
                )}
                <div className="mt-2">
                  {[
                    "Make it more sweet",
                    "Make it more spicy",
                    "Less spicy",
                    "No onion",
                  ].map((suggestion) => (
                    <p
                      key={suggestion}
                      className="font_size_12 text-dark mt-2 mb-0 ms-2 cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fa-solid fa-comment-dots me-2"></i>{" "}
                      {suggestion}
                    </p>
                  ))}
                </div>
              </div>
              <hr className="my-4" />
              <div className="mb-2">
                <label className="form-label d-flex justify-content-center">
                  Select Portion Size
                </label>
                <div className="d-flex justify-content-center">
                  {isPriceFetching ? (
                    <p>Loading prices...</p>
                  ) : (
                    <div className="w-100">
                      <div
                        className="d-flex justify-content-between align-items-center mb-3"
                        onClick={() => setPortionSize("full")}
                      >
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            checked={portionSize === "full"}
                            onChange={() => setPortionSize("full")}
                          />
                          <label className="form-check-label">Full</label>
                        </div>
                        <span>₹{prices.fullPrice}</span>
                      </div>
                      {prices.halfPrice !== null && prices.halfPrice !== 0 && (
                        <div
                          className="d-flex justify-content-between align-items-center"
                          onClick={() => setPortionSize("half")}
                        >
                          <div className="form-check">
                            <input
                              type="radio"
                              className="form-check-input"
                              checked={portionSize === "half"}
                              onChange={() => setPortionSize("half")}
                            />
                            <label className="form-check-label">Half</label>
                          </div>
                          <span>₹{prices.halfPrice}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <hr className="my-4" />
            <div className="modal-body px-3 pt-2 pb-3">
              <div className="d-flex justify-content-center">
                <div className="d-flex align-items-center" style={{ gap: "12px" }}>
                  <div className="d-flex align-items-center justify-content-between" style={{ background: "#e9ecef", borderRadius: "50px", width: "130px", padding: "4px 8px", height: "48px" }}>
                    <button 
                      className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "32px", height: "30px", minWidth: "32px", padding: "0" }}
                      type="button"
                      onClick={() => handleQuantityChange('decrement')}
                    >
                      <i className="fa-solid fa-minus text-white"></i>
                    </button>
                    <input 
                      readOnly
                      className="form-control text-center border-0 p-0 bg-transparent"
                      type="text" 
                      value={quantity} 
                      name="quantity"
                      style={{ width: "38px", minWidth: "38px" }}
                    />
                    <button 
                      className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "32px", height: "32px", minWidth: "32px", padding: "0" }}
                      type="button"
                      onClick={() => handleQuantityChange('increment')}
                    >
                      <i className="fa-solid fa-plus text-white"></i>
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary rounded-pill px-4 d-flex align-items-center"
                    onClick={handleConfirmWithQuantity}
                    disabled={
                      isPriceFetching || (!prices.halfPrice && !prices.fullPrice)
                    }
                  >
                    <span className="me-1">+</span>
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default AddToCartUI;
