import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate from react-router-dom
import Sidebar from './Sidebar'; // Import your Sidebar component

const Header = ({ userData, isLoggedIn, handleLogout, currentPage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  

  return (
    <div>
      <div className="page-wrapper">
        {/* Preloader */}

        {/* Preloader end*/}

        {/* Header */}
        {/* <header className="header header-fixed p-3">
          <div className="header-content">
            <div className="left-content gap-1">
             
              <h3 className="title font-w300">Restaurant Name</h3>
              
            </div>
            <div className="mid-content"></div>
            <div className="right-content">
              <a href="" className="menu-toggler" onClick={toggleSidebar}>
                <div className="media">
                   <div className="media-45 rounded-md"> 
                    
        
                     

                    <i className='bx bx-user-circle bx-md'></i> 
                  </div>
                 </div> 
              </a>
            </div>
          </div>
        </header> */}

        <header className="header header-fixed shadow-sm">
          <div className="header-content ">
            <div className="left-content">
              <Link className="back-btn fs-3" onClick={() => navigate(-1)}>
                <i className="fa-solid fa-arrow-left "></i>
              </Link>
            </div>
            <div className="mid-content">
              <span className="    me-2 title">
                {currentPage || "Loading..."}
              </span>
            </div>

            <div className="right-content gap-1">
              <div className="menu-toggler " onClick={toggleSidebar}>
                <i className="fa-solid fa-layer-group fs-3"></i>
              </div>
            </div>
          </div>
        </header>
        {/* Sidebar */}
        {isSidebarOpen && <Sidebar />}
      </div>
    </div>
  );
};

export default Header;
