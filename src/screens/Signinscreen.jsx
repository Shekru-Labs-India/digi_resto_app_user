import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logoname from "../constants/Logoname";
import CompanyVersion from "../constants/CompanyVersion";
import authenticationPic1 from "../assets/background.jpg";
import welcomeback from "../assets/images/authentication/wave.svg";

const Signinscreen = () => {
  const [mobile, setMobile] = useState("");
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (!isMobileValid) {
      setError("Mobile number must be 10 digits");
      return;
    }
    setLoading(true); // Set loading to true before API call
    setError(null); // Clear previous errors

    try {
      const url = "https://menumitra.com/user_api/account_login";
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobile,
        }),
      };

      const response = await fetch(url, requestOptions);
      const data = await response.json();

      console.log("API response:", data); // Log the API response here

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Check if the API response status (`st`) is 1 for success
      if (data.st === 1) {
        console.log("Sign-in success response:", data);

        // Extract the OTP from the msg field
        const otp = data.msg.match(/\d+/)[0]; // Extracts the first number (OTP) from the msg string

        // Store the mobile number and OTP in local storage
        localStorage.setItem("mobile", mobile); // Store mobile number
        localStorage.setItem("otp", otp); // Store OTP

        // Navigate to Verifyotp component
        navigate("/Verifyotp");

        // Optionally clear the form
        setMobile("");

        const lastRestaurantId = localStorage.getItem("lastRestaurantId");
        const lastTableNumber = localStorage.getItem("lastTableNumber");
        if (lastRestaurantId && lastTableNumber) {
          localStorage.setItem("tempRestaurantId", lastRestaurantId);
          localStorage.setItem("tempTableNumber", lastTableNumber);
        }
      } else {
        setError(data.msg || "Sign in failed. Please try again.");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Sign in failed. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after API call
    }
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
    return /^\d{10}$/.test(value); // Ensure that the mobile number is exactly 10 digits
  };

  return (
    <div className="page-wrapper full-height">
      <main className="page-content">
        <div className="container pt-0 overflow-hidden">
          <div className="dz-authentication-area dz-flex-box">
            <div className="dz-media">
              <img src={authenticationPic1} alt="" style={{ height: "250px" }} />
            </div>
            <div className="account-section">
              <div className="section-head">
                <Logoname />
                <h2 className="title text-muted">
                  Welcome Back You've <h2 className="title mt-1 text-muted"> Been
                  Missed!</h2>
                </h2>
              </div>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="m-b15">
                  <label className="form-label fs-4" htmlFor="mobile">
                    <span className="required-star">*</span> Mobile
                  </label>
                  <div className="input-group text-muted">
                    {mobile.trim() === "" && ( 
                      <span className="input-group-text py-0">
                        <i className="ri-smartphone-line fs-3 text-muted"></i>
                      </span>
                    )}
                    <input
                      type="text"
                      id="mobile"
                      className={`form-control ${mobileError ? 'is-invalid' : ''}`}
                      placeholder="Enter Mobile Number"
                      value={mobile}
                      onChange={handleMobileChange}
                    />
                  </div>
                  {mobileError && <div className="invalid-feedback">{mobileError}</div>}
                </div>
                {error && <p className="text-danger">{error}</p>}
                {loading ? (
                  <div id="preloader">
                    <div className="loader">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="dz-btn btn btn-thin btn-lg btn-primary rounded-xl"
                    onClick={handleSignIn}
                    disabled={!isMobileValid} // Disable button if mobile is invalid
                  >
                    Sign In
                  </button>
                )}
              </form>
            </div>
            <div className="text-center mt-auto">
              Not a member?{" "}
              <Link to="/Signupscreen" className="text-underline font-w500">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <div className="text-center mt-5 pt-5">
        <div className="gray-text fs-6 mt-5">Powered by </div>
        <div className="gray-text fs-6">Shekru Labs India Pvt. Ltd.</div>
        <div className="gray-text fs-sm ">v1.1</div>
      </div>
    </div>
  );
};

export default Signinscreen;