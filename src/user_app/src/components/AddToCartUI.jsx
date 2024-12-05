// menumitra/src/user_app/src/components/AddToCartUI.jsx

import React from "react";

const AddToCartUI = ({
  showModal,
  setShowModal,
  productDetails,
  notes,
  setNotes,
  portionSize,
  setPortionSize,
  halfPrice,
  fullPrice,
  originalHalfPrice,
  originalFullPrice,
  isPriceFetching,
  handleConfirmAddToCart,
  handleSuggestionClick,
  handleModalClick,
}) => {
  if (!showModal) return null;

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
                  Add {productDetails.name} to Cart
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
                  htmlFor="notes"
                  className="form-label d-flex justify-content-start font_size_14 fw-normal"
                >
                  Special Instructions
                </label>
                <input
                  type="text"
                  className="form-control font_size_16 border border-light rounded-4"
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any special instructions here..."
                />
                <p
                  className="font_size_12 text-dark mt-2 mb-0 ms-2 cursor-pointer"
                  onClick={() => handleSuggestionClick("Make it more sweet 😋")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa-solid fa-comment-dots me-2"></i> Make it more
                  sweet 😋
                </p>
                <p
                  className="font_size_12 text-dark mt-2 mb-0 ms-2 cursor-pointer"
                  onClick={() => handleSuggestionClick("Make it more spicy")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa-solid fa-comment-dots me-2"></i> Make it more
                  spicy
                </p>
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
                      {halfPrice !== null && (
                        <div 
                          className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3"
                          onClick={() => setPortionSize("half")}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="form-check">
                            <input
                              type="radio"
                              className="form-check-input"
                              id="halfPortion"
                              name="portionSize"
                              checked={portionSize === "half"}
                              onChange={() => setPortionSize("half")}
                            />
                            <label
                              className="form-check-label font_size_14"
                              htmlFor="halfPortion"
                            >
                              Half
                            </label>
                          </div>
                          <div>
                           
                            <div className="d-flex align-items-center">
                              <span className="font_size_14 fw-semibold text-info">
                                ₹{Math.floor(halfPrice * (1 - productDetails.offer / 100))}
                              </span>
                              {productDetails.offer > 0 && (
                                <span className="gray-text font_size_12 text-decoration-line-through fw-normal ms-2">
                                  ₹{halfPrice}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      <div 
                        className="d-flex justify-content-between align-items-center"
                        onClick={() => setPortionSize("full")}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="fullPortion"
                            name="portionSize"
                            checked={portionSize === "full"}
                            onChange={() => setPortionSize("full")}
                          />
                          <label
                            className="form-check-label font_size_14"
                            htmlFor="fullPortion"
                          >
                            Full
                          </label>
                        </div>
                        <div>
                          
                          <div className="d-flex align-items-center">
                            <span className="font_size_14 fw-semibold text-info">
                              ₹{Math.floor(fullPrice * (1 - productDetails.offer / 100))}
                            </span>
                            {productDetails.offer > 0 && (
                              <span className="gray-text font_size_12 text-decoration-line-through fw-normal ms-2">
                                ₹{fullPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <hr className="my-4" />
            <div className="modal-body d-flex justify-content-around px-0 pt-2 pb-3">
              <button
                type="button"
                className="border border-1 border-muted bg-transparent px-4 font_size_14 rounded-pill text-dark"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary rounded-pill"
                onClick={handleConfirmAddToCart}
                disabled={isPriceFetching || (!halfPrice && !fullPrice)}
              >
                <i className="fa-solid fa-plus pe-1 text-white"></i>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default AddToCartUI;
