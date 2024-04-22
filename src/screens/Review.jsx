import React, { useState } from 'react';
import { Link ,useParams,useNavigate} from 'react-router-dom';
import product from '../assets/images/product/product4/1.png';

const Review = () => {
  const [rating, setRating] = useState(4);
  const [reviewText, setReviewText] = useState('');
  const { order_number } = useParams();
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleReviewTextChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleSubmitReview = async () => {
    const requestData = {
      restaurant_id: 13,
      order_id: 3, // Replace with the actual order ID
      customer_id: 1, // Replace with the actual customer ID
      rating: rating,
      review: reviewText
    };

    try {
      const response = await fetch('http://194.195.116.199/user_api/create_review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Review submitted successfully:', data);
        // Optionally, handle success response (e.g., show a success message)
      } else {
        console.error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <header className="header header-fixed style-3">
        <div className="header-content">
          <div className="left-content">
            <Link to="/MyOrder" className="back-btn dz-icon icon-fill icon-sm">
              <i className='bx bx-arrow-back'></i>
            </Link>
          </div>
          <div className="mid-content">
            <h5 className="title">Write Review</h5>
          </div>
          <div className="right-content"></div>
        </div>
      </header>
      {/* Header End */}

      {/* Main Content */}
      <main className="page-content space-top p-b100">
        <div className="container">
          {/* Product Card */}
          {/* <div className="dz-card list-style style-3">
            <div className="dz-media">
              <img src={product} alt="" />
            </div>
            <div className="dz-content">
              <h5 className="title">
                <a href="product-detail.html">Royal Bluebell Bliss (M)</a>
              </h5>
              <ul className="dz-meta">
                <li className="dz-price">$80<del>$95</del></li>
                <li className="dz-review">
                  <i className='bx bxs-star staricons'></i>
                  <span>(2k Review)</span>
                </li>
              </ul>
              <span className="dz-off">Category Name</span>
            </div>
          </div> */}

          {/* Rating Section */}
          <div className="rating-area">
            <h2 className="title">Overall Rating</h2>
            <p className="dz-text">Your average rating is {rating.toFixed(1)}</p>
            <ul className="dz-star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <li
                  key={star}
                  className={star <= rating ? 'active' : ''}
                  onClick={() => handleRatingChange(star)}
                >
                  <i className='bx bxs-star bx-md staricons'></i>
                </li>
              ))}
            </ul>
          </div>

          {/* Review Form */}
          <div className="mb-3">
            <label className="form-label" htmlFor="reviewText">
              <span className="required-star">*</span> Review
            </label>
            <textarea
              id="reviewText"
              className="form-control"
              placeholder="Write your review..."
              value={reviewText}
              onChange={handleReviewTextChange}
            />
          </div>
        </div>
      </main>
      {/* Main Content End */}

      {/* Submit Button */}
      <div className="footer-fixed-btn bottom-0">
        <button
          className="btn btn-primary btn-lg btn-thin rounded-xl w-100"
          onClick={handleSubmitReview}
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default Review;
