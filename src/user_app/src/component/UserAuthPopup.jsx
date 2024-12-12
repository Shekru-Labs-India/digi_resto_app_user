import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePopup } from "../context/PopupContext";
import logo from "../assets/logos/menumitra_logo_128.png";
import config from "./config";
const UserAuthPopup = () => {
  const navigate = useNavigate();
  const { showPWAPopup, hideLoginPopup } = usePopup();
  const [mobile, setMobile] = useState("");
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("login");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [name, setName] = useState("");

  const [agreed, setAgreed] = useState(false);
  const [checkboxError, setCheckboxError] = useState("");
  const checkboxRef = useRef(null);
  const [originalPath, setOriginalPath] = useState(window.location.pathname);
  const mobileInputRef = useRef(null);

  const otpInputRefs = useRef([]);
  const [customerId, setCustomerId] = useState(null);
  const [nameError, setNameError] = useState("");
  const nameInputRef = useRef(null);
  const [isNameValid, setIsNameValid] = useState(false);

  const handleNameChange = (e) => {
    let input = e.target.value;

    // Remove any characters that are not letters or spaces
    input = input.replace(/[^a-zA-Z\s]/g, "");

    // Validate name length
    if (input.length < 3 || input.length > 15) {
      setNameError("Name must be between 3 and 15 characters.");
      setIsNameValid(false);
    } else {
      setNameError("");
      setIsNameValid(true);
    }

    // Convert to title case
    const titleCaseName = input
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    setName(titleCaseName);
  };

  const [customerType, setCustomerType] = useState("");
  useEffect(() => {
    const handleClickOutside = (event) => {
      const card = document.querySelector(".offcanvas-body");
      if (card && !card.contains(event.target)) {
        hideLoginPopup();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [hideLoginPopup]);

  useEffect(() => {
    switch (view) {
      case "login":
        mobileInputRef.current?.focus(); // Focus on mobile input when in login view
        break;
      case "signup":
        nameInputRef.current?.focus();
        break;
      case "verify":
        otpInputRefs.current[0]?.focus();
        break;
    }
  }, [view]);

  const handleMobileChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 10); // Remove non-digits and limit length to 10

    // Check if the first digit is 6, 7, 8, or 9
    if (value.length > 0 && !["6", "7", "8", "9"].includes(value[0])) {
      return; // Prevent input if it doesn't start with 6, 7, 8, or 9
    }

    setMobile(value);

    if (value.length < 10) {
      setMobileError("Mobile must be 10 digits");
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
      const response = await fetch(
        `${config.apiDomain}/user_api/account_login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile }),
        }
      );

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
        console.clear();
        setError(data.msg || `HTTP error! Status: ${response.status}`);
        if (data.st === 2) {
          setView("signup");
        }
      }
    } catch (error) {
      console.clear();
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
          isGuest: true,
        };

        localStorage.setItem("userData", JSON.stringify(userData));
        setCustomerId(data.customer_details.customer_id);
        setCustomerType(data.customer_details.customer_type);
        hideLoginPopup();

        const isDefaultRoute =
          originalPath === "/" ||
          originalPath === "/user" ||
          originalPath === "/user_app";

        if (isDefaultRoute) {
          const restaurantCode = localStorage.getItem("restaurantCode");
          const tableNumber = localStorage.getItem("tableNumber") || "1";
          navigate(`/user_app/${restaurantCode}/${tableNumber}`);
        }

        window.location.reload();
      } else {
        console.clear();

        setError(data.msg || "Guest login failed. Please try again.");
      }
    } catch (error) {
      console.clear();
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
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];

      if (!otp[index] && index > 0) {
        // If the current input is empty and the user presses Backspace, move focus back
        newOtp[index - 1] = "";
        setOtp(newOtp);
        otpInputRefs.current[index - 1]?.focus();
      } else {
        // Clear the current input
        newOtp[index] = "";
        setOtp(newOtp);
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
      const response = await fetch(
        `${config.apiDomain}/user_api/account_verify_otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobile: mobile,
            otp: enteredOtp,
          }),
        }
      );

      const data = await response.json();

      if (data.st === 1) {
        const userData = {
          customer_id: data.customer_details.customer_id,
          name: data.customer_details.name,
          mobile: data.customer_details.mobile,
          customer_type: data.customer_details.customer_type,
        };
        localStorage.setItem("customerName", data.customer_details.name);
        localStorage.setItem("userData", JSON.stringify(userData));
        setCustomerId(data.customer_details.customer_id);
        setCustomerType(data.customer_details.customer_type);
        hideLoginPopup();

        const isDefaultRoute =
          originalPath === "/" ||
          originalPath === "/user" ||
          originalPath === "/user_app";

        if (isDefaultRoute) {
          const restaurantCode = localStorage.getItem("restaurantCode");
          const tableNumber = localStorage.getItem("tableNumber") || "1";
          navigate(`/user_app/${restaurantCode}/${tableNumber}`);
        }

        window.location.reload();
      } else {
        console.clear();
        setError("Incorrect OTP. Please try again.");
      }
    } catch (error) {
      console.clear();
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
        checkboxRef.current.classList.add("shake");
        setTimeout(() => {
          checkboxRef.current.classList.remove("shake");
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
      const response = await fetch(
        `${config.apiDomain}/user_api/account_signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, mobile }),
        }
      );

      const data = await response.json();

      if (data.st === 1) {
        const generatedOtp = String(Math.floor(1000 + Math.random() * 9000));
        localStorage.setItem("otp", generatedOtp);
        localStorage.setItem("mobile", mobile);
        localStorage.setItem("customer_type", "regular");
        localStorage.setItem("isGuest", "false");

        setView("verify");
      } else {
        console.clear();
        setError(data.msg || "Failed to create account");
        setView("login");
      }
    } catch (error) {
      console.clear();
      setError(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (e) => {
    setAgreed(e.target.checked);
    if (e.target.checked) {
      setCheckboxError("");
      if (checkboxRef.current) {
        checkboxRef.current.classList.remove("shake");
      }
    }
  };

  const renderContent = () => {
    switch (view) {
      case "verify":
        return (
          <div className="account-section mt-1 px-2 py-1">
            {/* <div className="section-head"></div> */}
            <form onSubmit={(e) => e.preventDefault()}>
              <div
                className="header-content d-flex justify-content-center"
                style={{ zIndex: 1040, position: "relative" }}
              >
                <div className="mb-3">
                  <Link
                    to="/"
                    className="d-flex align-items-center text-decoration-none"
                  >
                    <img
                      src={logo}
                      alt="logo"
                      width="40"
                      height="40"
                      className="me-2"
                    />
                    <span className="text-dark fw-bolder">MenuMitra</span>
                  </Link>
                </div>
              </div>
              <div className="text-center mb-4">
                <h4 className="text-dark">Verify OTP</h4>
                <span className="text-dark">Enter OTP sent to {mobile}</span>
              </div>
              <div
                id="otp"
                className="digit-group d-flex justify-content-center gap-2 mb-4 mx-auto"
                style={{ width: "200px" }}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="number"
                    className="form-control text-center d-flex align-items-center border border-1 rounded-3 p-0"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    onInput={(e) => {
                      // Remove non-numeric characters and restrict to one digit
                      e.target.value = e.target.value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 1);
                    }}
                    id={`digit-${index + 1}`}
                    autoFocus={index === 0}
                    style={{
                      width: "50px",
                      height: "50px",
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
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
              <div onClick={() => setView("login")} className=" gray-text ">
                Back to Login
              </div>
            </div>
          </div>
        );

      case "signup":
        return (
          <div className="account-section mt-1 px-2 py-1">
            {/* <div className="section-head"></div> */}
            <form onSubmit={(e) => e.preventDefault()}>
              <div
                className="header-content d-flex justify-content-center"
                style={{ zIndex: 1040, position: "relative" }}
              >
                <div className="mb-3">
                  <Link
                    to="/"
                    className="d-flex align-items-center text-decoration-none"
                  >
                    <img src={logo} alt="logo" width="40" height="40" />
                    <span className="text-dark mb-0 ms-2 fw-bolder">
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
                  className={`form-control border border-success rounded-5 ${
                    nameError ? "is-invalid" : ""
                  }`}
                  placeholder="Enter name"
                  value={name}
                  onChange={handleNameChange}
                  autoFocus
                />
                {nameError && (
                  <div className="invalid-feedback">{nameError}</div>
                )}
              </div>

              <div className="form-group mb-3">
                <label className=" d-flex justify-content-between align-items-center text-dark">
                  <div>
                    <span className="required-star">*</span>Mobile
                  </div>
                  {mobileError && (
                    <small className="text-danger">{mobileError}</small>
                  )}
                </label>
                <div className="position-relative w-100">
                  <div
                    className="position-absolute d-flex align-items-center justify-content-center"
                    style={{
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "45px",
                      pointerEvents: "none",
                      padding: "0 12px",
                    }}
                  >
                    <i
                      className="fa-solid fa-phone text-primary"
                      style={{
                        fontSize: "18px",
                        lineHeight: 1,
                        display: "block",
                      }}
                    ></i>
                  </div>
                  <input
                    ref={mobileInputRef}
                    type="tel"
                    className={`form-control ps-5 border border-success rounded-5 ${
                      mobileError ? "is-invalid" : ""
                    }`}
                    placeholder="Enter mobile"
                    value={mobile}
                    onChange={handleMobileChange}
                    maxLength="10"
                    autoFocus
                    style={{
                      paddingLeft: "45px",
                    }}
                  />
                </div>
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
                  <label
                    className="form-check-label text-start"
                    htmlFor="termsCheckbox"
                  >
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
                  className="btn btn-success rounded-pill w-100 mx-auto text-dark"
                  onClick={handleSignUp}
                  disabled={!isNameValid || !isMobileValid || !agreed}
                >
                  Create Account
                  <i class="bx bx-check-circle ms-2"></i>
                </button>
              )}
            </form>
            <div className="text-center mt-3">
              <div onClick={() => setView("login")} className=" gray-text ">
                Back to Login
              </div>
            </div>
          </div>
        );

      default: // login view
        return (
          <div className=" mt-1 px-2 py-1">
            <div
              className="header-content d-flex justify-content-center"
              style={{ zIndex: 1040, position: "relative" }}
            >
              <div className="mb-3">
                <Link
                  to="/"
                  className="d-flex align-items-center justify-content-center"
                >
                  <img src={logo} alt="logo" width="40" height="40" />
                  <span className="text-dark mb-0 ms-2 fw-bolder">
                    MenuMitra
                  </span>
                </Link>
              </div>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group mb-3">
                <div className="form-label d-flex justify-content-between align-items-center text-dark">
                  <div className="text-dark">
                    <span className="required-star">*</span>Mobile
                  </div>
                  {mobileError && (
                    <small className="text-danger">{mobileError}</small>
                  )}
                </div>
                <div className="position-relative w-100">
                  <div
                    className="position-absolute d-flex align-items-center justify-content-center"
                    style={{
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "45px",
                      pointerEvents: "none",
                      padding: "0 12px",
                    }}
                  >
                    <i
                      className="fa-solid fa-phone text-primary"
                      style={{
                        fontSize: "18px",
                        lineHeight: 1,
                        display: "block",
                      }}
                    ></i>
                  </div>
                  <input
                    ref={mobileInputRef}
                    type="tel"
                    className={`form-control ps-5 border border-success rounded-5 bg-white ${
                      mobileError ? "is-invalid" : ""
                    }`}
                    placeholder="Enter mobile"
                    value={mobile}
                    onChange={handleMobileChange}
                    maxLength="10"
                    autoFocus
                    style={{
                      paddingLeft: "45px",
                    }}
                  />
                </div>
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              {loading ? (
                <div className="text-center">{/* <LoaderGif /> */}</div>
              ) : (
                <button
                  type="button"
                  className="btn btn-success rounded-pill w-100 mx-auto text-white"
                  onClick={handleSignIn}
                  disabled={!isMobileValid}
                >
                  Send OTP
                  <i className="bx bx-paper-plane ms-2"></i>
                </button>
              )}
            </form>
            <div className="text-center  mt-4">
              Not a member?{" "}
              <a
                className="text-underline text-primary"
                style={{ textDecoration: "none", cursor: "pointer" }}
                onClick={() => setView("signup")}
              >
                Create new account
              </a>
              <div className="d-flex justify-content-center mt-">
                <span
                  className="mt-4 text-lowercase gray-text "
                  onClick={handleGuestLogin}
                >
                  continue as guest
                </span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div
        className={`offcanvas offcanvas-bottom pwa-offcanvas border border-bottom-0 ${
          showPWAPopup ? "show" : ""
        }`}
      >
        <div className="container">
          <div className="offcanvas-body pt-0">
            <div className="page-wrapper full-height">
              <main className="page-content">
                <div className="container pt-0 overflow-hidden">
                  <div className="dz-authentication-area dz-flex-box">
                    <div className="account-section mt-1 px-2 py-1">
                      {renderContent()}
                    </div>
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
      <style>
        {`
          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}
      </style>
    </>
  );
};

export default UserAuthPopup;
