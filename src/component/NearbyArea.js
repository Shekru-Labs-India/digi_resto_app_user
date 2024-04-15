import React, { useEffect, useRef } from 'react';
import Swiper from 'swiper';
// import 'swiper/swiper-bundle.min.css';
import productImage from '../assets/images/product/product3/1.png';

const NearbyArea = () => {
    const swiperRef = useRef(null);

    useEffect(() => {
        const swiper = new Swiper('.product-swiper', {
            // Add your Swiper options here
            loop: true,
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: 10,
            // Add any other Swiper options you need
        });

        swiperRef.current = swiper;

        const interval = setInterval(() => {
            if (swiperRef.current) {
                swiperRef.current.slideNext();
            }
        }, 2000);

        // Clean up interval and Swiper instance on unmount
        return () => {
            clearInterval(interval);
            if (swiperRef.current) {
                swiperRef.current.destroy();
            }
        };
    }, []); // Run effect only once on mount

    return (
        <div className="dz-box style-2 nearby-area">
            <div className="title-bar1 align-items-start">
                <div className="left">
                    <h4 className="title mb-1">Special Menu</h4>
                    {/* <span>Up to 60% off + up to $107 cashback</span> */}
                </div>
                {/* <a className="mt-auto" href="products.html">See All</a> */}
            </div>
            <div className="map-area">
                {/* <img src={productImage}alt="Map" /> */}
            </div>
            <div className="swiper product-swiper swiper-center">
                <div className="swiper-wrapper">
                    <div className="swiper-slide">
                        <div className="dz-card style-4">
                            <h6 className="title"><a href="product-detail.html">Large Majesty Palm (M)</a></h6>
                            <div className="dz-media">
                                <a href="product-detail.html">
                                    <img src={productImage} alt="" />
                                </a>
                            </div>
                            <ul className="dz-meta">
                                <li className="dz-price">$80<del> $95</del></li>
                                {/* <li className="dz-status">Free delivery</li> */}
                            </ul>
                        </div>
                    </div>

                    <div className="swiper-slide">
                        <div className="dz-card style-4">
                            <h6 className="title"><a href="product-detail.html">Large Majesty Palm (M)</a></h6>
                            <div className="dz-media">
                                <a href="product-detail.html">
                                    <img src={productImage} alt="" />
                                </a>
                            </div>
                            <ul className="dz-meta">
                                <li className="dz-price">$80<del> $95</del></li>
                                {/* <li className="dz-status">Free delivery</li> */}
                            </ul>
                        </div>
                    </div>

                    <div className="swiper-slide">
                        <div className="dz-card style-4">
                            <h6 className="title"><a href="product-detail.html">Large Majesty Palm (M)</a></h6>
                            <div className="dz-media">
                                <a href="product-detail.html">
                                    <img src={productImage} alt="" />
                                </a>
                            </div>
                            <ul className="dz-meta">
                                <li className="dz-price">$80<del> $95</del></li>
                                {/* <li className="dz-status">Free delivery</li> */}
                            </ul>
                        </div>
                    </div>

                    <div className="swiper-slide">
                        <div className="dz-card style-4">
                            <h6 className="title"><a href="product-detail.html">Large Majesty Palm (M)</a></h6>
                            <div className="dz-media">
                                <a href="product-detail.html">
                                    <img src={productImage} alt="" />
                                </a>
                            </div>
                            <ul className="dz-meta">
                                <li className="dz-price">$80<del> $95</del></li>
                                {/* <li className="dz-status">Free delivery</li> */}
                            </ul>
                        </div>
                    </div>

                    <div className="swiper-slide">
                        <div className="dz-card style-4">
                            <h6 className="title"><a href="product-detail.html">Large Majesty Palm (M)</a></h6>
                            <div className="dz-media">
                                <a href="product-detail.html">
                                    <img src={productImage} alt="" />
                                </a>
                            </div>
                            <ul className="dz-meta">
                                <li className="dz-price">$80<del> $95</del></li>
                                {/* <li className="dz-status">Free delivery</li> */}
                            </ul>
                        </div>
                    </div>
                    {/* Repeat the above swiper-slide block for each product */}
                </div>
            </div>
        </div>
    );
};

export default NearbyArea;
