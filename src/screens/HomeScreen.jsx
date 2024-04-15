import React, { useState } from 'react';
import '../assets/css/style.css'; // Replace '../path/to/external.css' with the actual path to your CSS file
import Sidebar from '../component/Sidebar';
// import MySwiper from '../component/Myswiper';
import Bottom from '../component/bottom';
import { Search } from '@material-ui/icons';


import Plantcategory from '../component/Plantcategory';
import Header from '../component/Header';
import FeaturedArea from '../component/FeaturedArea';
import OfferBanner from '../component/OfferBanner';
import PopularProducts from '../component/PopularProduct';
import ProductCart from '../component/ProductCart';
import PeopleAlsoViewed from '../component/PeopleAlsoViewed';
import ItemsCart from '../component/ItemsCart';
import NearbyArea from '../component/NearbyArea';
import ProductCard from '../component/ProductCart';
const HomeScreen = () => {

   

  return (
    <div>
       
       <div className="page-wrapper">
        {/* <Header></Header> */}
        <Sidebar></Sidebar> 

            {/* Main Content Start */}
            <main className="page-content p-t100 p-b70">
                <div className="container overflow-hidden pt-0">
                    {/* SearchBox */}
                    {/* <div className="search-box">
                        <div className="input-group">
                            <input type="search" placeholder="Search" className="form-control" />
                            <span className="input-group-text">
                            
                                <i class='bx bx-search-alt icon-search' ></i>
                            </span>
                        </div>
                    </div> */}
                    {/* SearchBox */}
                    <OfferBanner/>
                    <FeaturedArea/>
                    
                    <PopularProducts/>
                    <ProductCard/>
                    {/* <PeopleAlsoViewed/> */}
                    {/* <ItemsCart/> */}
                    <NearbyArea/>
                </div>
               
            </main>
           
            {/* Main Content End */}
        
       
{/* <MySwiper></MySwiper>
        <Plantcategory></Plantcategory> */}

        <Bottom></Bottom>
        </div>
        </div>
  );
};

export default HomeScreen;
