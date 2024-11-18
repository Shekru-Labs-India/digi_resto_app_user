import React, { useEffect, useState } from "react";
import Header from './Header'
import Footer from './Footer'
import { Link } from 'react-router-dom'
const TermsConditions = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  return (
    <div>
              <Header></Header>
      <div className="page-title-area item-bg-5">
    <div className="container">
      <div className="page-title-content">
        <h2>Terms and Conditions</h2>
        <ul>
          <li>
         
          <Link to="/">
              Legal
              <i className="fa fa-chevron-right" />
            </Link>
           
          </li>
          <li>Terms and Conditions</li>
        </ul>
      </div>
    </div>
  </div>
      <div className="container ptb-100">
      
      {/* <h1 className="text-center mb-4">Terms and Conditions</h1> */}

      <p>
        Welcome to MenuMitra! These terms and conditions outline the rules and regulations for the use of MenuMitra's
        website and services. By accessing our website or using our services, you agree to comply with these terms.
      </p>

      <h3>1. Definitions</h3>
      <p>
        - **MenuMitra**: Refers to our digital menu and restaurant management application and all associated services.
        <br />
        - **User**: Refers to anyone who uses MenuMitra's services, including hotel owners, partners, customers, and
        administrators.
      </p>

      <h3>2. User Accounts</h3>
      <p>
        To access some features of MenuMitra, you may be required to create an account. You agree to provide accurate
        and up-to-date information and to maintain the security of your account credentials. You are responsible for all
        activities under your account.
      </p>

      <h3>3. Use of Our Services</h3>
      <p>
        MenuMitra grants you a non-exclusive, non-transferable, limited license to use our services for personal and
        business purposes. You agree not to:
      </p>
      <ul>
        <li>Modify, copy, or distribute any part of our services without our consent.</li>
        <li>Use our services for any unlawful or unauthorized purposes.</li>
        <li>Attempt to interfere with the proper functioning of our services.</li>
      </ul>

      <h3>4. Payment and Subscription</h3>
      <p>
        Some features of MenuMitra may require payment or a subscription. You agree to provide accurate payment
        information and authorize us to charge your payment method. All fees are non-refundable, and subscription
        renewals will be billed automatically unless canceled.
      </p>

      <h3>5. Multi-Language and Payment Integration</h3>
      <p>
        MenuMitra offers multi-language support and integration with popular Indian payment gateways. While we strive
        for seamless operations, we are not responsible for issues caused by third-party payment providers or language
        translation errors.
      </p>

      <h3>6. Inventory and Data Management</h3>
      <p>
        MenuMitra provides features for inventory and data management. While we take steps to ensure the accuracy of
        these features, we do not guarantee that all data will be accurate or up-to-date. You are responsible for
        verifying critical information.
      </p>

      <h3>7. QR Code and Offline Functionality</h3>
      <p>
        MenuMitra allows customers to scan QR codes for menu browsing and supports offline functionality. However, we
        are not liable for any disruptions in service due to internet connectivity issues or QR code scanning problems.
      </p>

      <h3>8. Intellectual Property</h3>
      <p>
        All content and materials on MenuMitra, including logos, graphics, and software, are protected by intellectual
        property laws. You may not use our content without written permission, except for personal or business use as
        permitted by these terms.
      </p>

      <h3>9. Limitation of Liability</h3>
      <p>
        MenuMitra is provided "as is" without any warranties. We are not liable for any direct, indirect, or incidental
        damages resulting from the use or inability to use our services. Your use of our services is at your own risk.
      </p>

      <h3>10. Changes to Our Services</h3>
      <p>
        We may update or discontinue features of MenuMitra at any time. We will attempt to notify users of major
        changes, but we are not obligated to provide prior notice. Continued use of our services indicates your
        acceptance of these changes.
      </p>

      <h3>11. Privacy Policy</h3>
      <p>
        Your use of MenuMitra is also governed by our Privacy Policy. Please review our Privacy Policy for details on
        how we collect, use, and protect your information.
      </p>

      <h3>12. Governing Law</h3>
      <p>
        These terms are governed by the laws of India. Any disputes arising from the use of our services will be subject
        to the jurisdiction of Indian courts.
      </p>

      <h3>13. Contact Information</h3>
      <p>
        If you have any questions about these Terms and Conditions, please contact us at:
      </p>
      <p>
        <strong>Email:</strong> <a href="mailto:info@menumitra.com">info@menumitra.com</a>
      </p>

      <h3>14. Acceptance of These Terms</h3>
      <p>
        By using MenuMitra, you acknowledge that you have read, understood, and agree to be bound by these Terms and
        Conditions. If you do not agree with any part of these terms, you must not use our services.
      </p>
      </div>
      <Footer></Footer>
    </div>
    
  )
}

export default TermsConditions
