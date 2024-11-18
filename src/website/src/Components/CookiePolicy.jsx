import React, { useEffect, useState } from "react";
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';


const CookiePolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  return (

    <div>
    <Header></Header>
<div className="page-title-area item-bg-5">
<div className="container">
<div className="page-title-content">
<h2>Cookie Policy</h2>
<ul>
<li>

<Link to="/">
    Legal
    <i className="fa fa-chevron-right" />
  </Link>
 
</li>
<li>Cookie Policy</li>
</ul>
</div>
</div>
</div>

    <div className="container ptb-100">
      {/* <h1 className="text-center mb-4">Cookie Policy</h1> */}
      <p>
        This Cookie Policy explains how MenuMitra ("we," "us," or "our") uses cookies and similar technologies to recognize you when you visit our website <strong>www.menumitra.com</strong> ("Website"). It explains what these technologies are, why we use them, and your rights to control our use of them.
      </p>

      <h3>1. What Are Cookies?</h3>
      <p>
        Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
      </p>

      <h3>2. Why Do We Use Cookies?</h3>
      <p>
        We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance their experience on our website. Third-party cookies are served by third-party service providers to provide functionalities like payment processing, analytics, and advertising.
      </p>

      <h3>3. Types of Cookies We Use</h3>
      <ul>
        <li>
          <strong>Essential Cookies:</strong> These cookies are necessary to provide you with services available through our website and to use some of its features, such as access to secure areas.
        </li>
        <li>
          <strong>Performance and Analytics Cookies:</strong> These cookies collect information about how our website is used to help us improve its performance. For example, we use these cookies to determine which pages are the most popular and to monitor site traffic.
        </li>
        <li>
          <strong>Functionality Cookies:</strong> These cookies allow the website to remember choices you make, such as your language preference, and provide enhanced, more personalized features.
        </li>
        <li>
          <strong>Advertising and Targeting Cookies:</strong> These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing and ensuring ads are properly displayed.
        </li>
      </ul>

      <h3>4. How Can You Control Cookies?</h3>
      <p>
        You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by setting your browser settings to accept or refuse cookies. Please note that if you choose to reject cookies, you may still use our website, but some functionalities may be restricted.
      </p>

      <h3>5. Cookies We Use</h3>
      <p>
        Below is a list of cookies we use on our website. These may be updated periodically:
      </p>
      <ul>
        <li><strong>Session Cookies:</strong> Temporary cookies that are erased when you close your browser.</li>
        <li><strong>Persistent Cookies:</strong> Cookies that remain on your device for a set period or until you delete them.</li>
        <li><strong>Third-Party Cookies:</strong> Cookies placed by third-party services like Google Analytics, payment gateways, and social media platforms.</li>
      </ul>

      <h3>6. Third-Party Services and Cookies</h3>
      <p>
        Our website may contain links to third-party websites, services, or plug-ins. We do not control the privacy practices of these third parties. We encourage you to read their privacy and cookie policies to understand how they use your information.
      </p>

      <h3>7. Updates to This Cookie Policy</h3>
      <p>
        We may update this Cookie Policy from time to time to reflect changes to our practices or for operational, legal, or regulatory reasons. We recommend checking this page periodically to stay informed about our use of cookies.
      </p>

      <h3>8. Contact Us</h3>
      <p>
        If you have any questions or concerns about our use of cookies or this Cookie Policy, please contact us:
      </p>
      <p>
        <strong>Email:</strong> <a href="mailto:info@menumitra.com">info@menumitra.com</a>
      </p>

      <p className="mt-4">
        By using our website, you agree to our use of cookies as outlined in this policy. Thank you for trusting MenuMitra.
      </p>
    </div>
    <Footer></Footer>
    </div>
  );
};

export default CookiePolicy;

