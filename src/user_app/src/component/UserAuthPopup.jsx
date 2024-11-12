import React, { useState, useRef, useEffect } from 'react';
import { useNavigate ,Link} from 'react-router-dom';
import { usePopup } from '../context/PopupContext';
import logo from "../assets/logos/menumitra_logo_128.png";
import config from './config'
const UserAuthPopup = () => {
  const navigate = useNavigate();
  const { showPWAPopup, hideLoginPopup } = usePopup();
  const [mobile, setMobile] = useState("");
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('login');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [checkboxError, setCheckboxError] = useState('');
  const checkboxRef = useRef(null);
  const [originalPath, setOriginalPath] = useState(window.location.pathname);
  const mobileInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const otpInputRefs = useRef([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const card = document.querySelector('.offcanvas-body');
      if (card && !card.contains(event.target)) {
        hideLoginPopup();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [hideLoginPopup]);

  useEffect(() => {
    switch(view) {
      case 'login':
        mobileInputRef.current?.focus();  // Focus on mobile input when in login view
        break;
      case 'signup':
        nameInputRef.current?.focus();
        break;
      case 'verify':
        otpInputRefs.current[0]?.focus();
        break;
    }
  }, [view]);

  const handleMobileChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 10); // Remove non-digits and limit length to 10
  
    // Check if the first digit is 6, 7, 8, or 9
    if (value.length > 0 && !['6', '7', '8', '9'].includes(value[0])) {
      return; // Prevent input if it doesn't start with 6, 7, 8, or 9
    }
  
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
      const response = await fetch(`${config.apiDomain}/user_api/account_login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (data.st === 1) {
          localStorage.setItem("mobile", mobile);
          localStorage.setItem("customer_id", data.customer_id);
          setView("verify");
          
          // Try to extract OTP if present in the message
          const otpMatch = data.msg.match(/\d+/);
          if (otpMatch) {
            const otp = otpMatch[0];
            localStorage.setItem("otp", otp);
          }
  
          localStorage.setItem("customer_type", "registered");
          localStorage.setItem("isGuest", "false");
        } else {
          setError(data.msg || "Sign in failed. Please try again.");
        }
      } else {
        setError(data.msg || `HTTP error! Status: ${response.status}`);
        if (data.st === 2) {
          setView("signup");
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
      const response = await fetch(`${config.apiDomain}/user_api/guest_login`, {
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

        const isDefaultRoute = originalPath === "/" || originalPath === "/user" || originalPath === "/user_app";
        
        if (isDefaultRoute) {
          const restaurantCode = localStorage.getItem("restaurantCode");
          const tableNumber = localStorage.getItem("tableNumber") || "1";
          navigate(`/user_app/${restaurantCode}/${tableNumber}`);
        }
        
        window.location.reload();
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
  
    // Allow only numeric input, including empty strings to clear digits
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
  
      if (value && index < otp.length - 1) {
        // Move to the next input only if there is a value
        otpInputRefs.current[index + 1]?.focus();
      } else if (!value && index > 0) {
        // If the current input is cleared, move focus back
        otpInputRefs.current[index - 1]?.focus();
      }
    }
  };
  

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      otpInputRefs.current[index - 1]?.focus();
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
      const response = await fetch(`${config.apiDomain}/user_api/account_verify_otp`, {
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

        const isDefaultRoute = originalPath === "/" || originalPath === "/user" || originalPath === "/user_app";
        
        if (isDefaultRoute) {
          const restaurantCode = localStorage.getItem("restaurantCode");
          const tableNumber = localStorage.getItem("tableNumber") || "1";
          navigate(`/user_app/${restaurantCode}/${tableNumber}`);
        }
        
        window.location.reload();
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
      const response = await fetch(`${config.apiDomain}/user_api/account_signup`, {
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
            <div className="section-head"></div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div
                className="header-content d-flex justify-content-center"
                style={{ zIndex: 1040, position: "relative" }}
              >
                <div className="mb-3">
                <Link to="/">
                  <img
                    src={logo}
                    alt="logo"
                    className="me-2"
                    width="30"
                    height="30"
                  />
                 
                  <span className="text-dark mb-0 mt-1 fw-bolder">
                    MenuMitra
                  </span>
                  </Link>
                </div>
              </div>
              <div className="text-center mb-4">
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
                    ref={el => otpInputRefs.current[index] = el}
                    type="number"
                    className="form-control text-center d-flex align-items-center"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
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
                    className="btn btn-success rounded-pill w-100 mx-auto"
                    onClick={handleVerify}
                    disabled={otp.some((digit) => !digit)}
                  >
                    Verify OTP
                  </button>
                </div>
              )}
            </form>
            <div className="text-center mt-3">
            <div
                onClick={() => setView('login')}
                className=" gray-text "
              >
                Back to Login
              </div>
            </div>
          </div>
        );

      case 'signup':
        return (
          <div className="account-section mt-1 px-2 py-1">
            <div className="section-head"></div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div
                className="header-content d-flex justify-content-center"
                style={{ zIndex: 1040, position: "relative" }}
              >
                <div className="mb-3">
                <Link to="/">
                  <img
                    src={logo}
                    alt="logo"
                    className="me-2"
                    width="30"
                    height="30"
                  />
                 
                  <span className="text-dark mb-0 mt-1 fw-bolder">
                    MenuMitra
                  </span>
                  </Link>
                </div>
              </div>
              <div className="form-group mb-3">
                <label className="form-label d-flex justify-content-start">
                  <span className="required-star">*</span>Name
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  className={`form-control border border-black ${nameError ? 'is-invalid' : ''}`}
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
                {nameError && <div className="invalid-feedback">{nameError}</div>}
              </div>

              <div className="form-group mb-3">
                <label className="form-label d-flex justify-content-start">
                  <span className="required-star">*</span>Mobile Number
                </label>
                <input
                  ref={mobileInputRef}
                  type="tel"
                  className={`form-control border border-black ${mobileError ? 'is-invalid' : ''}`}
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={handleMobileChange}
                  maxLength="10"
                  autoFocus
                />
                {mobileError && <div className="invalid-feedback">{mobileError}</div>}
              </div>

              <div className="form-group mb-3">
                <div className="form-check" ref={checkboxRef}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={agreed}
                    onChange={handleCheckboxChange}
                    id="termsCheckbox"
                    autoFocus
                  />
                  <label className="form-check-label text-start" htmlFor="termsCheckbox">
                    I agree to the Terms and Conditions
                  </label>
                </div>
                {checkboxError && (
                  <div className="text-danger small mt-1">{checkboxError}</div>
                )}
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              {loading ? (
                <div className="text-center">{/* <LoaderGif /> */}</div>
              ) : (
                <button
                  type="button"
                  className="btn btn-success rounded-pill w-100 mx-auto"
                  onClick={handleSignUp}
                  disabled={!name || !isMobileValid || !agreed}
                >
                  Create Account
                </button>
              )}
            </form>
            <div className="text-center mt-3">
              <div
                onClick={() => setView('login')}
                className=" gray-text "
              >
                Back to Login
              </div>
            </div>
          </div>
        );

      default: // login view
        return (
          <div className="account-section mt-1 px-2 py-1">
            <div className="section-head"></div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div
                className="header-content d-flex justify-content-center"
                style={{ zIndex: 1040, position: "relative" }}
              >
                <div className="mb-3">
                <Link to="/">
                  <img
                    src={logo}
                    alt="logo"
                    className="me-2"
                    width="30"
                    height="30"
                  />
                 
                  <span className="text-dark mb-0 mt-1 fw-bolder">
                    MenuMitra
                  </span>
                  </Link>
                </div>
              
              </div>
              <div className="form-group mb-3">
                <label className="form-label d-flex justify-content-start">
                  <span className="required-star">*</span>Mobile Number
                </label>
                <input
                  ref={mobileInputRef}
                  type="tel"
                  className={`form-control  text-center d-flex mx-auto border border-black ${
                    mobileError ? "is-invalid" : ""
                  }`}
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={handleMobileChange}
                  maxLength="10"
                  autoFocus
                />
                {mobileError && (
                  <div className="invalid-feedback">{mobileError}</div>
                )}
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              {loading ? (
                <div className="text-center">{/* <LoaderGif /> */}</div>
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
            <div className="text-center  mt-3">
              Not a member?{" "}
              <a
                className="text-underline text-primary"
                style={{ textDecoration: 'none', cursor: 'pointer' }}
                onClick={() => setView("signup")}
              >
                Create an account
              </a>
              <div className="d-flex justify-content-center">
                <button
                  className="btn btn-outline-primary rounded-pill btn-sm mt-4 text-lowercase"
                  onClick={handleGuestLogin}
                >
                  continue as guest
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div
        className={`offcanvas offcanvas-bottom pwa-offcanvas ${
          showPWAPopup ? "show" : ""
        }`}
      >
        <div className="container">
          <div className="offcanvas-body pt-0">
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
            onClick={hideLoginPopup}
          ></div>
        )}
      </div>
    </>
  );
};

export default UserAuthPopup;
