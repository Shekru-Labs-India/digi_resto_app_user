import React from 'react';
import product1 from '../assets/images/product/1.jpg';
const PeopleAlsoViewed = () => {
    return (
        <div className="dz-box">
            <div className="title-bar">
                <h5 className="title">People Also Viewed</h5>
                <a href="products.html">See All</a>
            </div>
            <div className="row g-3 grid-style-1">
                <div className="col-6">
                    <div className="card-item style-6">
                        <a href="product-detail.html" className="dz-media">
                            <img src={product1} alt="image" />
                        </a>
                        <div className="dz-content">
                            <span className="product-title">Combo pack</span>
                            <h4 className="item-name">
                                <a href="product-detail.html">
                                    Fish + Fish Skinless + Cleaned Prawns
                                </a>
                            </h4>
                            <div className="offer-code">
                                FLAT 40% off Code: 636G8P
                            </div>
                            <div className="footer-wrapper">
                                <div className="price-wrapper">
                                    <h6 className="current-price">₹830</h6>
                                    <span className="old-price">₹1000</span>
                                </div>
                                <a href="product-detail.html" className="btn btn-xs btn-outline-primary">ADD</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PeopleAlsoViewed;
