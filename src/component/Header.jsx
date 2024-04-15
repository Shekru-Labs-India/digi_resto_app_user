import React, { useState } from 'react';
import { AccountCircle } from '@material-ui/icons';
import Sidebar from './Sidebar'; // Import your Sidebar component
import avatar from '../assets/images/avatar/1.png';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <div className="page-wrapper">
        {/* Preloader */}

        {/* Preloader end*/}

        {/* Header */}
        <header className="header header-fixed p-3">
          <div className="header-content">
            <div className="left-content gap-1">
              {/* <h3 className="title pr-50">Find Your <br /> Favorite <b className="font-w600">Plants</b></h3> */}
              <h3 className="title font-w300">Restaurant Name</h3>
              {/* <img className="mt-2" src={cactus} alt="" /> */}
            </div>
            <div className="mid-content"></div>
            <div className="right-content">
              <a href="" className="menu-toggler" onClick={toggleSidebar}>
                <div className="media">
                   <div className="media-45 rounded-md"> 
                    {/* <img className="rounded-md" src={avatar} alt="" /> */}
        
                     

                    <i className='bx bx-user-circle bx-md'></i> 
                  </div>
                 </div> 
              </a>
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
