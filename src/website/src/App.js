import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Components/Header";

import About from "./Components/About";
import Contact from "./Components/Contact";
import Features from "./Components/Features";
import "./Assets/Css/stylewebsite.css"
import "./Assets/Css/responsive.css"
import Client from "./Components/Client";
// import PricingPage from "./Components/pricing/PricingPage";
import FAQs from "./Components/FAQs";
import PrivacyPolicy from "./Components/PrivacyPolicy";
import Home from "./Components/Home";
import Pricing from "./Components/Pricing"
import TermsConditions from "./Components/TermsConditions";
import CookiePolicy from "./Components/CookiePolicy";
import DeleteUser from "./Components/DeleteUser";

function App({ currentPath }) {
  const location = useLocation();
  
  const renderComponent = () => {
    switch(currentPath || location.pathname) {
      case '/faqs':
        return <FAQs />;
        case '/privacy_policy':
          return <PrivacyPolicy />;
          case '/cookie_policy':
            return <CookiePolicy />;
          case '/terms_conditions':
            return <TermsConditions />;
      case '/features':
        return <Features />;
      case '/client':
        return <Client />;
      // case '/pricing':
      //   return <PricingPage />;
      case '/about':
        return <About />;
        case '/pricing':
          return <Pricing />;
          case '/request_data_removal':
            return <DeleteUser />;
      case '/contact':
        return <Contact />;
      default:
        return < Home/>;
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
