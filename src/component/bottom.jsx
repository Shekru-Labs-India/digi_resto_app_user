// import React from 'react';
// import { Home, Favorite, ShoppingCart, Description, Person } from '@material-ui/icons';
// import '../assets/css/style.css';
// import { Link } from "react-router-dom";

// const Bottom = () => {
//     return (
//         <div className="menubar-area footer-fixed">
//             <div className="toolbar-inner menubar-nav">
//                 <Link to ="/HomeScreen" className="nav-link active">
//                     <Home />
//                     <span className="name">Home</span>
//                     {/* <Link to="/Home" className="name">Home </Link> */}
//                 </Link>
//                 <Link to="/Wishlist" className="nav-link">
//                     <Favorite />
//                     <span className="name">Wishlist</span>
//                 </Link>
//                 <Link to="/Cart" className="nav-link">
//                     <ShoppingCart />
//                     <span className="name">Cart</span>
//                 </Link>
//                 <Link to="/Category" className="nav-link">
//                     <Description />
//                     <span className="name">Category</span>
//                 </Link>
//                 <Link to="/Profile" className="nav-link">
//                     <Person />
//                     <span className="name">Profile</span>
//                 </Link>
//             </div>
//         </div>
//     );
// };

// export default Bottom;


import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Favorite, ShoppingCart, Description, Person } from '@material-ui/icons';

const Bottom = () => {
  const location = useLocation();

  return (
    <div className="menubar-area footer-fixed">
      <div className="toolbar-inner menubar-nav">
        <Link to="/HomeScreen" className={location.pathname === '/HomeScreen' ? 'nav-link active' : 'nav-link'}>
          {/* <Home style={{ color: location.pathname === '/HomeScreen' ? 'white' : 'black' }} /> */}
          <i class='bx bx-home-alt bx-sm'></i>
          <span className="name">Home</span>
        </Link>
        <Link to="/Wishlist" className={location.pathname === '/Wishlist' ? 'nav-link active' : 'nav-link'}>
          {/* <Favorite style={{ color: location.pathname === '/Wishlist' ? 'white' : 'black' }} /> */}
          <i class='bx bx-heart bx-sm' ></i>
          <span className="name">Favourite</span>
        </Link>
        <Link to="/Cart" className={location.pathname === '/Cart' ? 'nav-link active' : 'nav-link'}>
          {/* <ShoppingCart style={{ color: location.pathname === '/Cart' ? 'white' : 'black' }} /> */}
          <i class='bx bx-cart bx-sm' ></i>
          <span className="name">Cart</span>
        </Link>
        {/* <Link to="/Category" className={location.pathname === '/Category' ? 'nav-link active' : 'nav-link'}>
          <Description style={{ color: location.pathname === '/Category' ? 'white' : 'black' }} /> 
          <i class='bx bx-category bx-sm' ></i>
          <span className="name">Category</span>
        </Link> */}
        <Link to="/Search" className={location.pathname === '/Search' ? 'nav-link active' : 'nav-link'}>
          {/* <Description style={{ color: location.pathname === '/Category' ? 'white' : 'black' }} /> */}
          <i class='bx bx-search bx-sm' ></i>
          <span className="name">Search</span>
        </Link>

        <Link to="/Profile" className={location.pathname === '/Profile' ? 'nav-link active' : 'nav-link'}>
          {/* <Person style={{ color: location.pathname === '/Profile' ? 'white' : 'black' }} /> */}
          <i class='bx bx-user bx-sm' ></i>
          <span className="name">Profile</span>
        </Link>
      </div>
    </div>
  );
}

export default Bottom;
