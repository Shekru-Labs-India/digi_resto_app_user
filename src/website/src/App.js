import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Components/Header";
import HomePage from "./Components/homepage/HomePage";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Features from "./Components/Features";
import Pricing from "./Components/Pricing";
import Client from "./Components/Client";
import PricingPage from "./Components/pricing/PricingPage";
import FAQs from "./Components/FAQs";

function App({ currentPath }) {
  const location = useLocation();
  
  const renderComponent = () => {
    switch(currentPath || location.pathname) {
      case '/faqs':
        return <FAQs />;
      case '/features':
        return <Features />;
      case '/client':
        return <Client />;
      case '/pricing':
        return <PricingPage />;
      case '/about':
        return <About />;
      case '/contact':
        return <Contact />;
      default:
        return <HomePage />;
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
