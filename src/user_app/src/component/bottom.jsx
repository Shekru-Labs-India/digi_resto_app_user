import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";
import LoaderGif from "../screens/LoaderGIF";
import Logoname from "../constants/Logoname";
import { usePopup } from '../context/PopupContext';

const Bottom = () => {
  const location = useLocation();
  const { restaurantCode } = useRestaurantId();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [userData] = useState(
    JSON.parse(localStorage.getItem("userData")) || {}
  );
  const { showPWAPopup, hideLoginPopup } = usePopup();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [view, setView] = useState('login'); // 'login', 'verify', 'signup'
  const [otp, setOtp] = useState(['', '', '', '']);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [checkboxError, setCheckboxError] = useState('');
  const checkboxRef = useRef(null);

  const isHomePath = (pathname) => {
    const homePathPattern = new RegExp(
      `^/user_app/${restaurantCode}(?:/\\d+)?$`
    );
    return homePathPattern.test(pathname);
  };

  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setCartItemCount(cartItems.length);
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  useEffect(() => {
    // Wait for page load and then show popup after 5 seconds
    const timer = setTimeout(() => {
      hideLoginPopup();
    }, 1000);

    // Add click event listener to handle clicks outside the card
    const handleClickOutside = (event) => {
      const card = document.querySelector('.offcanvas-body');
      if (card && !card.contains(event.target)) {
        hideLoginPopup();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty dependency array means this runs once on mount

  // Function to hide popup
  const handleClosePWA = () => {
    hideLoginPopup();
  };

  const handleMobileChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(value);
    if (value.length < 10) {
      setMobileError("Mobile number must be 10 digits");
      setIsMobileValid(false);
    } else {
      setMobileError("");
      setIsMobileValid(checkMobileValidity(value));
    }
  };

  const checkMobileValidity = (value) => {
    return /^\d{10}$/.test(value);
  };

  const handleSignIn = async () => {
    if (!isMobileValid) {
      setError("Mobile number must be 10 digits");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://men4u.xyz/user_api/account_login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.st === 1) {
          const otp = data.msg.match(/\d+/)[0];
          localStorage.setItem("mobile", mobile);
          localStorage.setItem("otp", otp);
          localStorage.setItem("customer_id", data.customer_id);

          setOtpSent(true);
          setView('verify');
          
          localStorage.setItem("customer_type", "registered");
          localStorage.setItem("isGuest", "false");
        } else {
          setError(data.msg || "Sign in failed. Please try again.");
        }
      } else {
        setError(data.msg || `HTTP error! Status: ${response.status}`);
        if (data.st === 2) {
          setView('signup');
        }
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://men4u.xyz/user_api/guest_login", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok && data.st === 1) {
        const userData = {
          customer_id: data.customer_details.customer_id,
          customer_type: data.customer_details.customer_type,
          name: data.customer_details.name,
          isGuest: true
        };

        localStorage.setItem("userData", JSON.stringify(userData));
        hideLoginPopup();
        
        const restaurantCode = localStorage.getItem("restaurantCode");
        const tableNumber = localStorage.getItem("tableNumber") || "1";
        
        navigate(`/user_app/${restaurantCode}/${tableNumber}`);
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        setError(data.msg || "Guest login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during guest login:", error);
      setError("Guest login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < otp.length - 1) {
        const nextInput = document.getElementById(`digit-${index + 2}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (!enteredOtp.trim()) {
      setError("OTP is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://men4u.xyz/user_api/account_verify_otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: mobile,
          otp: enteredOtp
        }),
      });

      const data = await response.json();

      if (data.st === 1) {
        const userData = {
          customer_id: data.customer_details.customer_id,
          name: data.customer_details.name,
          mobile: data.customer_details.mobile,
          customer_type: data.customer_details.customer_type
        };
        
        localStorage.setItem("userData", JSON.stringify(userData));
        hideLoginPopup();
        
        const restaurantCode = localStorage.getItem("restaurantCode");
        const tableNumber = localStorage.getItem("tableNumber") || "1";
        
        navigate(`/user_app/${restaurantCode}/${tableNumber}`);
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        setError("Incorrect OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!agreed) {
      setCheckboxError("Please accept the terms and conditions");
      if (checkboxRef.current) {
        checkboxRef.current.classList.add('shake');
        setTimeout(() => {
          checkboxRef.current.classList.remove('shake');
        }, 500);
      }
      return;
    }

    if (!name.trim() || !mobile.trim()) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://men4u.xyz/user_api/account_signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobile }),
      });

      const data = await response.json();

      if (data.st === 1) {
        const generatedOtp = String(Math.floor(1000 + Math.random() * 9000));
        localStorage.setItem("otp", generatedOtp);
        localStorage.setItem("mobile", mobile);
        localStorage.setItem("customer_type", "regular");
        localStorage.setItem("isGuest", "false");

        setView('verify');
      } else {
        setError(data.msg || "Failed to create account");
        setView('login');
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (e) => {
    setAgreed(e.target.checked);
    if (e.target.checked) {
      setCheckboxError('');
      if (checkboxRef.current) {
        checkboxRef.current.classList.remove('shake');
      }
    }
  };

  const renderContent = () => {
    switch(view) {
      case 'verify':
        return (
          <div className="account-section mt-1 px-2 py-1">
            <div className="section-head text-center mb-4">
              <h4>Verify OTP</h4>
              <span>Enter OTP sent to {mobile}</span>
            </div>
            <div
              id="otp" 
              className="digit-group d-flex justify-content-center gap-2 mb-4 mx-auto"
              style={{width: "200px"}}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="number"
                  className="form-control text-center d-flex align-items-center"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  id={`digit-${index + 1}`}
                  autoFocus={index === 0}
                  style={{
                    width: "50px", 
                    height: "50px",
                    WebkitAppearance: "none",
                    MozAppearance: "textfield"
                  }}
                />
              ))}
            </div>
            {error && <div className="text-danger mb-3">{error}</div>}
            {loading ? (
              <div className="text-center">{/* <LoaderGif /> */}</div>
            ) : (
              <div className="d-grid gap-2">
                <button
                  className="btn btn-success rounded-pill"
                  onClick={handleVerify}
                  disabled={otp.some((digit) => !digit)}
                >
                  Verify OTP
                </button>
                <button
                  className="btn btn-link"
                  onClick={() => setView("login")}
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        );

      case 'signup':
        return (
          <div className="account-section mt-1 px-2 py-1">
            <div className="section-head">
       
              <h4 className="title m-0">Create Account</h4>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label className="form-label">
                  <span className="required-star">*</span>Name
                </label>
                <input
                  type="text"
                  className={`form-control ${nameError ? 'is-invalid' : ''}`}
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {nameError && <div className="invalid-feedback">{nameError}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="required-star">*</span>Mobile Number
                </label>
                <input
                  type="tel"
                  className={`form-control ${mobileError ? 'is-invalid' : ''}`}
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={handleMobileChange}
                  maxLength="10"
                />
                {mobileError && <div className="invalid-feedback">{mobileError}</div>}
              </div>

              <div className="form-group">
                <div className="form-check" ref={checkboxRef}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={agreed}
                    onChange={handleCheckboxChange}
                    id="termsCheckbox"
                  />
                  <label className="form-check-label" htmlFor="termsCheckbox">
                    I agree to the Terms and Conditions
                  </label>
                </div>
                {checkboxError && (
                  <div className="text-danger small mt-1">{checkboxError}</div>
                )}
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              {loading ? (
                <div className="text-center">
                  {/* <LoaderGif /> */}
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-success rounded-pill w-100"
                  onClick={handleSignUp}
                  disabled={!name || !isMobileValid || !agreed}
                >
                  Create Account
                </button>
              )}
            </form>
            <div className="text-center mt-3">
              <button
                onClick={() => setView('login')}
                className="btn btn-link"
              >
                Back to Login
              </button>
            </div>
          </div>
        );

      default: // login view
        return (
          <div className="account-section mt-1 px-2 py-1">
            <div className="section-head">
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label className="form-label">
                  <span className="required-star">*</span>Mobile Number
                </label>
                <input
                  type="tel"
                  className={`form-control my-3  text-center d-flex mx-auto ${mobileError ? 'is-invalid' : ''}`}
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={handleMobileChange}
                  maxLength="10"
                />
                {mobileError && <div className="invalid-feedback">{mobileError}</div>}
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              {loading ? (
                <div className="text-center">
                  {/* <LoaderGif /> */}
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-success rounded-pill w-100 mx-auto"
                  onClick={handleSignIn}
                  disabled={!isMobileValid}
                >
                  Send OTP
                </button>
              )}
            </form>
            <div className="text-center mt-2">
              Not a member?{" "}
              <button
                onClick={() => setView('signup')}
                className="text-underline btn btn-link p-0"
              >
                Create an account
              </button>
              <div className="d-flex justify-content-center">
                <button
                  className="btn btn-outline-primary rounded-pill btn-sm mt-4"
                  onClick={handleGuestLogin}
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="menubar-area footer-fixed">
      <div className="toolbar-inner menubar-nav">
        <Link
          to={`/user_app/${restaurantCode}/${userData.tableNumber || ""}`}
          className={`nav-link ${
            isHomePath(location.pathname) ? "active" : ""
          }`}
        >
          <i className="ri-home-2-line"></i>
          <span className="name">Home</span>
        </Link>

        <Link
          to="/user_app/Wishlist"
          className={`nav-link ${
            location.pathname === "/user_app/Wishlist" ? "active" : ""
          }`}
        >
          <i className="ri-heart-3-line"></i>
          <span className="name">Favourite</span>
        </Link>

        <Link
          to="/user_app/Cart"
          className={`nav-link ${
            location.pathname === "/user_app/Cart" ? "active" : ""
          }`}
        >
          <div className="position-relative">
            <i className="ri-shopping-cart-line"></i>
            {cartItemCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="name">Cart</span>
        </Link>

        <Link
          to="/user_app/Search"
          className={`nav-link ${
            location.pathname === "/user_app/Search" ? "active" : ""
          }`}
        >
          <i className="ri-search-line"></i>
          <span className="name">Search</span>
        </Link>

        <Link
          to="/user_app/Profile"
          className={`nav-link ${
            location.pathname.includes("/user_app/Profile") ? "active" : ""
          }`}
        >
          <i
            className={
              userData?.customer_id ? "ri-user-3-fill" : "ri-user-3-line"
            }
          ></i>
          <span className="name">Profile</span>
        </Link>
      </div>

      <div
        className={`offcanvas offcanvas-bottom pwa-offcanvas ${
          showPWAPopup ? "show" : ""
        }`}
      >
        <div className="container">
          <div className="offcanvas-body">
            <div className="page-wrapper full-height">
              <main className="page-content">
                <div className="container pt-0 overflow-hidden">
                  <div className="dz-authentication-area dz-flex-box">
                    {renderContent()}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
      <div style={{ zIndex: 40, position: "relative" }}>
        {showPWAPopup && (
          <div
            className="offcanvas-backdrop pwa-backdrop show"
            style={{ zIndex: 40 }}
            onClick={handleClosePWA}
          ></div>
        )}
      </div>
    </div>
  );
};

export default Bottom;
