import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SidebarToggler } from '../component/Sidebar';

const Header = ({ title, showBack = true, showSidebar = true, count }) => {
    const navigate = useNavigate();
    const location = useLocation();

  const getScreenName = () => {
    const path = location.pathname.split('/')[1];
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="header header-fixed style-3 ">
      <div className="header-content">
        <div className="container p-0">
          <div className="row align-items-center">
            <div className="col-auto">
              {showBack && (
                <Link
                  to="#"
                  className="back-btn dz-icon icon-sm"
                  onClick={() => navigate(-1)}
                >
                  <i className="ri-arrow-left-line fs-2"></i>
                </Link>
              )}
            </div>
            <div className="col text-center">
              <span className="me-3 title font_size_16">
                {title || getScreenName()}
                {count !== undefined && count > 0 && (
                  <span className="gray-text small-number ms-1">({count})</span>
                )}
              </span>
            </div>
            <div className="col-auto">{showSidebar && <SidebarToggler />}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;