// import React from "react";

// const AddToCartModal = ({
//   showModal,
//   setShowModal,
//   notes,
//   setNotes,
//   portionSize,
//   setPortionSize,
//   halfPrice,
//   fullPrice,
//   isPriceFetching,
//   handleConfirmAddToCart,
//   handleModalClick,
// }) => {
//   return (
//     <>
//       <div
//         className="modal fade show d-flex align-items-center justify-content-center"
//         style={{ display: "block" }}
//         onClick={handleModalClick}
//       >
//         <div className="modal-dialog modal-dialog-centered">
//           <div
//             className="modal-content"
//             style={{
//               width: "350px",
//               margin: "auto",
//             }}
//           >
//             <div className="modal-header ps-3 pe-2">
//               <div className="col-6 text-start">
//                 <div className="modal-title font_size_16 fw-medium ">
//                   Add {menu_name} to Cart
//                 </div>
//               </div>

//               <div className="col-6 text-end">
//                 <div className="d-flex justify-content-end">
//                   <span
//                     className="btn-close m-2 font_size_12"
//                     onClick={() => setShowModal(false)}
//                     aria-label="Close"
//                   >
//                     <i className="fa-solid fa-xmark"></i>
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <div className="modal-body py-2 px-3">
//               <div className="mb-3 mt-0">
//                 <label
//                   htmlFor="notes"
//                   className="form-label d-flex justify-content-start font_size_14 fw-normal"
//                 >
//                   Special Instructions
//                 </label>
//                 <textarea
//                   className="form-control font_size_16 border border-primary rounded-4"
//                   id="notes"
//                   rows="3"
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   placeholder="Add any special instructions here..."
//                 />
//               </div>
//               <hr className="my-4" />
//               <div className="mb-2">
//                 <label className="form-label d-flex justify-content-between">
//                   Select Portion Size
//                 </label>
//                 <div className="d-flex justify-content-between">
//                   {isPriceFetching ? (
//                     <p>Loading prices...</p>
//                   ) : (
//                     <>
//                       <button
//                         type="button"
//                         className={`btn px-4 font_size_14 ${
//                           portionSize === "half"
//                             ? "btn-primary"
//                             : "btn-outline-primary"
//                         }`}
//                         onClick={() => setPortionSize("half")}
//                         disabled={!halfPrice}
//                       >
//                         Half {halfPrice ? `(₹${halfPrice})` : "(N/A)"}
//                       </button>
//                       <button
//                         type="button"
//                         className={`btn px-4 font_size_14 ${
//                           portionSize === "full"
//                             ? "btn-primary"
//                             : "btn-outline-primary"
//                         }`}
//                         onClick={() => setPortionSize("full")}
//                         disabled={!fullPrice}
//                       >
//                         Full {fullPrice ? `(₹${fullPrice})` : "(N/A)"}
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <hr className="my-4" />
//             <div className="modal-body d-flex justify-content-around px-0 pt-2 pb-3">
//               <button
//                 type="button"
//                 // className="btn btn-outline-secondary rounded-pill font_size_14"
//                 className="btn px-4 font_size_14 btn-outline-dark rounded-pill"
//                 onClick={() => setShowModal(false)}
//               >
//                 Close
//               </button>
//               <button
//                 type="button"
//                 className="btn btn-primary rounded-pill"
//                 onClick={handleConfirmAddToCart}
//                 disabled={isPriceFetching || (!halfPrice && !fullPrice)}
//               >
//                 <i className="fa-solid fa-cart-shopping pe-2 text-white"></i>
//                 Add to Cart
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="modal-backdrop fade show"></div>
//     </>
//   );
// };

// export default AddToCartModal;
