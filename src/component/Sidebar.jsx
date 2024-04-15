import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CompanyVersion from '../constants/CompanyVersion';
import Logoname from '../constants/Logoname';
const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle the sidebar state
  };

  return (
    <div className={`page-wrapper ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Header */}
      <header className="header header-fixed p-3">
        <div className="header-content">
          <div className="left-content gap-1">
            <h3 className="title font-w300">Restaurant Name</h3>
          </div>
          <div className="mid-content"></div>
          <div className="right-content">
            {/* Toggle sidebar button */}
            <div className="menu-toggler" onClick={toggleSidebar}>
              
              <i className='bx bx-user-circle bx-lg'></i>
            </div>
            
          </div>
        </div>
      </header>

      {/* Dark overlay for sidebar */}
      
      <div className={`dark-overlay ${sidebarOpen ? 'dark-overlay active' : ''}`} onClick={toggleSidebar}></div>
     
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar show' : ''}`}>
      
        <div className="author-box">
        
          <div className="dz-media">
          
            <i className='bx bx-user-circle bx-lg'></i>
          </div>
          <div className="dz-info">
            <h5 className="name">User</h5>
            <span className="mail">9554646464</span>
          </div>
        </div>
        <ul className="nav navbar-nav">
          <li>
            <Link className="nav-link active" to="/HomeScreen">
              <span className="dz-icon icon-sm">
              <i class='bx bx-home-alt bx-sm'></i>
              </span>
              <span>Home</span>
            </Link>
          </li>
          {/* Other list items */}

          <li>
            <Link className="nav-link active" to="/Product">
              <span className="dz-icon icon-sm">
              {/* <i class='bx bx-shopping-bag bx-sm'></i> */}
              <i className='bx bx-dish bx-sm'></i>
              </span>
              <span>Menus</span>
            </Link>
          </li>

          <li>
            <Link className="nav-link active" to="/Category">
              <span className="dz-icon icon-sm">
              <i class='bx bx-category bx-sm' ></i>
              </span>
              <span>Category</span>
            </Link>
          </li>

          <li>
            <Link className="nav-link active" to="/Wishlist">
              <span className="dz-icon icon-sm">
              <i class='bx bx-heart bx-sm' ></i>
              </span>
              <span>Favourite</span>
            </Link>
          </li>

          <li>
            <Link className="nav-link active" to="/MyOrder">
              <span className="dz-icon icon-sm">
              <i class='bx bx-notepad bx-sm' ></i>
              </span>
              <span>My Orders</span>
            </Link>
          </li>

          <li>
            <Link className="nav-link active" to="/Cart">
              <span className="dz-icon icon-sm">
              <i class='bx bx-cart bx-sm' ></i>
              </span>
              <span>Cart</span>
            </Link>
          </li>

          <li>
            <Link className="nav-link active" to="/Profile">
              <span className="dz-icon icon-sm">
              <i class='bx bx-user bx-sm' ></i>
              </span>
              <span>Profile</span>
            </Link>
          </li>

        </ul>
        <div className="dz-mode ">
          <div className="theme-btn ">
            <i className="bx bx-sun sun"></i>
            <i className="bx bx-moon moon"></i>
          </div>
        </div>
        <div className="sidebar-bottom" >
          <div className="app-info">
            {/* <h6 className="name font-w400 sub-title"><b>PlantZone</b> Plant Store</h6>  */}
            <span className="ver-info"><p className='company' style={{textAlign:'center'}}>ShekruLabs India Pvt.Ltd  <p className='company' >v1</p></p></span>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
