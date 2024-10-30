import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Components/Home";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Features from "./Components/Features";
import Pricing from "./Components/Pricing";
import Client from "./Components/Client";

function App({ currentPath }) {
  const location = useLocation();
  
  // Function to render the correct component based on path
  const renderComponent = () => {
    switch(currentPath || location.pathname) {
      case '/features':
        return <Features />;
      case '/client':
        return <Client />;
      case '/pricing':
        return <Pricing />;
      case '/about':
        return <About />;
      case '/contact':
        return <Contact />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="website-wrapper">
      <Header />
      {renderComponent()}
    </div>
  );
}

export default App;
