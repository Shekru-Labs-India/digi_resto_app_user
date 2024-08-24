import React, { useState } from 'react';
import Bottom from './bottom';

const HomeScreen = ({ restaurantCode }) => <div>Home Screen {restaurantCode}</div>;
const Wishlist = () => <div>Wishlist</div>;
const Cart = () => <div>Cart</div>;
const Search = () => <div>Search</div>;
const Profile = () => <div>Profile</div>;

const Maincom = () => {
  const [screen, setScreen] = useState('home');
  const { restaurantCode } = useRestaurantId();

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen restaurantCode={restaurantCode} />;
      case 'wishlist':
        return <Wishlist />;
      case 'cart':
        return <Cart />;
      case 'search':
        return <Search />;
      case 'profile':
        return <Profile />;
      default:
        return <HomeScreen restaurantCode={restaurantCode} />;
    }
  };

  return (
    <div>
      {renderScreen()}
      <Bottom setScreen={setScreen} />
    </div>
  );
};

export default Maincom;
