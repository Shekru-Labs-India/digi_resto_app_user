import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pic2 from "../assets/background.jpg";
import Logoname from "../constants/Logoname";
import CompanyVersion from "../constants/CompanyVersion";


const Signupscreen = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [dob, setDob] = useState("");
  const [dobError, setDobError] = useState("");
  const [agreed, setAgreed] = useState(false); // Checkbox state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [checkboxError, setCheckboxError] = useState(""); // Checkbox error state
  const [showPopup, setShowPopup] = useState(false); // Popup visibility state
  const checkboxRef = useRef(null); // Reference to the checkbox

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isFormFilled()) {
      setError("Please fill all the fields correctly.");
      setCheckboxError(""); // Clear checkbox error if form is not filled
      return;
    }
    if (!agreed) {
      setCheckboxError("Please select the privacy!");
      setError(""); // Clear general error if checkbox is not checked
      if (checkboxRef.current) {
        checkboxRef.current.classList.add("shake");
        setTimeout(() => {
          checkboxRef.current.classList.remove("shake");
        }, 500);
      }
      return;
    }
    setLoading(true); // Set loading to true before API call

    try {
      const url = "https://menumitra.com/user_api/account_signup";
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          dob: dob,
          mobile: mobile,
        }),
      };

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.st === 1) {
        const customerId = generateCustomerId(); // Generate a unique customerId
        const userData = { name, mobile, dob, customerId };

        // Store user data in local storage
        localStorage.setItem("userData", JSON.stringify(userData));
        
        // Show success popup
        setShowPopup(true);

        // Clear form fields upon successful signup attempt
        setName("");
        setMobile("");
        setDob("");

        // Hide popup and navigate to sign-in screen after 3 seconds
        setTimeout(() => {
          setShowPopup(false);
          navigate("/Signinscreen");
        }, 3000);
      } else if (data.st === 2) {
        setError("Mobile Number already exists. Use another number.");
        setTimeout(() => {
          setError("");
        }, 3000); // Clear error message after 3 seconds
      } else {
        // Handle other specific error codes from the API
        setError("An error occurred. Please try again.");
        setTimeout(() => {
          setError("");
        }, 3000); // Clear error message after 3 seconds
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setError("An unexpected error occurred. Please try again.");
      setTimeout(() => {
        setError("");
      }, 3000); // Clear error message after 3 seconds
    } finally {
      setLoading(false); // Set loading to false after API call
    }
  };

  const generateCustomerId = () => {
    return Math.floor(Math.random() * 1000000); // Generate a random 6-digit number
  };

  const handleNameChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z ]/gi, ""); // Allow only letters and spaces
    setName(value);
    if (value.trim() === "") {
      setNameError("Name is required");
    } else {
      setNameError("");
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10); // Allow only digits and limit to 10
    setMobile(value);
    if (value.trim() === "") {
      setMobileError("Mobile is required");
    } else if (value.length === 10) {
      setMobileError("");
    } else {
      setMobileError("Mobile number must be exactly 10 digits");
    }
  };

  const isFormFilled = () => {
    return (
      name.trim() !== "" &&
      mobile.trim() !== "" &&
      dob.trim() !== "" &&
      mobileError === ""
    );
  };

  const handleDobInput = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
  
    // Automatically add hyphens as the user types
    if (value.length > 2) {
      value = value.slice(0, 2) + '-' + value.slice(2);
    }
    if (value.length > 5) {
      value = value.slice(0, 5) + '-' + value.slice(5);
    }
  
    // Limit to 10 characters (dd-mm-yyyy)
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
  
    e.target.value = value;
    setDob(value);
  };
  
  const handleDobChange = (e) => {
    const value = e.target.value;
    setDob(value);
    const datePattern = /^\d{2}-\d{2}-\d{4}$/; // Regex for dd-mm-yyyy format
    if (value.trim() === "") {
      setDobError("Date of Birth is required");
    } else if (!datePattern.test(value)) {
      setDobError("Date of Birth must be in dd-mm-yyyy format");
    } else {
      setDobError("");
    }
  };

  return (
    <div className="page-wrapper full-height">
      <main className="page-content">
        <div className="container pt-0 overflow-hidden">
          <div className="dz-authentication-area dz-flex-box">
            <div className="dz-media">
              <img src={pic2} alt="" />
            </div>
            <div className="account-section">
              <div className="section-head">
                <Logoname />
                <h2 className="title">Create your account</h2>
              </div>
              <form onSubmit={handleSignUp}>
                <div className="mb-3">
                  <label className="form-label fs-4" htmlFor="name">
                    <span className="required-star">*</span>Name
                  </label>
                  <div className="input-group">
                    <span className="input-group-text fs-3 py-0">
                      <i className="ri-user-3-line text-muted" />
                    </span>
                    <input
                      type="text"
                      id="name"
                      className={`form-control ${nameError ? "is-invalid" : ""}`}
                      placeholder="Name"
                      value={name}
                      onChange={handleNameChange}
                    />
                  </div>
                  {nameError && <div className="invalid-feedback">{nameError}</div>}
                </div>
                <div className="m-b15">
                  <label className="form-label fs-4" htmlFor="mobile">
                    <span className="required-star">*</span> Mobile
                  </label>
                  <div className="input-group">
                    <span className="input-group-text fs-3 py-0">
                      <i className="ri-smartphone-line text-muted" />
                    </span>
                    <input
                      type="tel"
                      id="mobile"
                      className={`form-control ${mobileError ? "is-invalid" : ""}`}
                      placeholder="Enter Mobile Number"
                      value={mobile}
                      onChange={handleMobileChange}
                    />
                  </div>
                  {mobileError && <div className="invalid-feedback">{mobileError}</div>}
                </div>
                <div className="m-b15">
  <label className="form-label fs-4" htmlFor="dob">
    <span className="required-star">*</span> Date of Birth
  </label>
  <div className="input-group">
    <span className="input-group-text fs-3 py-0">
      <i className="ri-calendar-line text-muted" />
    </span>
    <input
      type="text"
      id="dob"
      className={`form-control ${dobError ? "is-invalid" : ""}`}
      placeholder="dd-mm-yyyy"
      value={dob}
      onChange={handleDobChange}
      onInput={handleDobInput}
    />
  </div>
  {dobError && <div className="invalid-feedback">{dobError}</div>}
</div>
                <div className="form-check m-b25" ref={checkboxRef}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={agreed}
                    id="Checked-1"
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      setCheckboxError(""); // Clear checkbox error when checked
                    }}
                  />
                  <label className="form-check-label fs-6" htmlFor="Checked-1">
                    I agree to all Terms, Privacy, and Fees
                  </label>
                </div>
                {checkboxError && <p className="text-danger">{checkboxError}</p>}
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
                    id="signupButton"
                    type="submit"
                    className="dz-btn btn btn-thin btn-lg btn-primary rounded-xl"
                  >
                    Create Account
                  </button>
                )}
              </form>
            </div>
            <div className="text-center mt-auto">
              Already have an account?{' '}
              <Link to="/Signinscreen" className="text-underline font-w500">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
      <CompanyVersion/>
      {showPopup && (
        <div className="popup show">
          Account Created Successfully
        </div>
      )}
    </div>
  );
};

export default Signupscreen;