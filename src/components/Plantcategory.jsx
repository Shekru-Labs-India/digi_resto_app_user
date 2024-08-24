import React from 'react'
import category from '../assets/images/category/pic1.png'
import category2 from '../assets/images/category/pic2.png'
import category3 from '../assets/images/category/pic3.png'
import '../assets/css/style.css'
const Plantcategory = () => {
  return (
    <div className="page-wrapper">
      <div className="dz-category">
            <div className="title-bar">
                <h5 className="title font-w300">Find Plant Category</h5>
            </div>
            <div className="swiper dz-category-swiper">
                <div className="swiper-wrapper">
                    <div className="swiper-slide">
                        <div className="dz-category-items">
                            <a href="category.html" className="dz-media">
                                <img src={category} alt="Category" />
                            </a>
                            <h6 className="title"><a href="category.html">Indoor Plants</a></h6>
                        </div>
                    </div>
                    <div className="swiper-slide">
                        <div className="dz-category-items">
                            <a href="category.html" className="dz-media">
                                <img src={category2} alt="Category" />
                            </a>
                            <h6 className="title"><a href="category.html">House Plant</a></h6>
                        </div>
                    </div>
                    <div className="swiper-slide">
                        <div className="dz-category-items">
                            <a href="category.html" className="dz-media">
                                <img src={category3} alt="Category" />
                            </a>
                            <h6 className="title"><a href="category.html">Tropical</a></h6>
                        </div>
                    </div>
                    <div className="swiper-slide">
                        <div className="dz-category-items">
                            <a href="category.html" className="dz-media">
                                <img src={category} alt="Category" />
                            </a>
                            <h6 className="title"><a href="category.html">Succulents</a></h6>
                        </div>
                    </div>
                    <div className="swiper-slide">
                        <div className="dz-category-items">
                            <a href="category.html" className="dz-media">
                                <img src={category2} alt="Category" />
                            </a>
                            <h6 className="title"><a href="category.html">House Plant</a></h6>
                        </div>
                    </div>
                    <div className="swiper-slide">
                        <div className="dz-category-items">
                            <a href="category.html" className="dz-media">
                                <img src={category3}alt="Category" />
                            </a>
                            <h6 className="title"><a href="category.html">Tropical</a></h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Plantcategory
