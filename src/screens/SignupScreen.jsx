import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import pic2 from "../assets/background.jpg";
import Logoname from "../constants/Logoname";
import CompanyVersion from "../constants/CompanyVersion";
import { Toast } from "primereact/toast"; // Import Toast from primereact
import "primereact/resources/themes/saga-blue/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // Core CSS

const Signupscreen = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [agreed, setAgreed] = useState(false); // Checkbox state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [checkboxError, setCheckboxError] = useState(""); // Checkbox error state
  const [showPopup, setShowPopup] = useState(false); // Popup visibility state
  const checkboxRef = useRef(null); // Reference to the checkbox
  const toast = useRef(null); // Create a ref for the toast

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
          mobile: mobile,
        }),
      };

      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        // Show the API response message if available
        const errorMessage = data.msg || `HTTP error! Status: ${response.status}`;
        throw new Error(errorMessage);
      }

      if (data.st === 1) {
        const customerId = generateCustomerId(); // Generate a unique customerId
        const userData = { name, mobile, customerId };

        // Store user data in local storage
        localStorage.setItem("userData", JSON.stringify(userData));
        
        // Show success toast
        if (toast.current) {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Account created successfully!",
            life: 3000,
          });
        }

        // Clear form fields upon successful signup attempt
        setName("");
        setMobile("");

        // Hide popup and navigate to sign-in screen after 3 seconds
        setTimeout(() => {
          setShowPopup(false);
          navigate("/Signinscreen");
        }, 3000);
      } else if (data.st === 2) {
        const errorMessage = data.msg || "Mobile Number already exists. Use another number.";
        setError(errorMessage);
        // Show error toast with the response message
        if (toast.current) {
          toast.current.show({
            severity: "warn",
            summary: "Warning",
            detail: errorMessage, // Use the response message from the API
            life: 3000,
          });
        }
      } else {
        // Handle other specific error codes from the API
        
        if (toast.current) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "An error occurred. Please try again.",
            life: 3000,
          });
        }
      }
    } catch (error) {
      console.error("Error signing up:", error);

      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.message, // Use the error message
          life: 3000,
        });
      }
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
      mobileError === ""
    );
  };

  return (
    <div className="page-wrapper full-height">
      <Toast ref={toast} position="bottom-center" />{" "}
      {/* Ensure Toast is positioned at the bottom-center */}
      <main className="page-content">
        <div className="container pt-0 overflow-hidden">
          <div className="dz-authentication-area dz-flex-box">
            <div className="dz-media">
              <img src={pic2} alt="" />
            </div>
            <div className="account-section">
              <div className="section-head">
                <Logoname />
                <h2 className="custom_font_size_bold">Create your account</h2>
              </div>
              <form onSubmit={handleSignUp}>
                <div className="mb-3">
                  <label className=" custom_font_size_bold" htmlFor="name">
                    <span className="required-star">*</span>Name
                  </label>
                  <div className="input-group">
                    <span className="input-group-text fs-3 py-0">
                      <i className="ri-user-3-line text-muted" />
                    </span>
                    <input
                      type="text"
                      id="name"
                      className={`form-control custom_font_size_bold ps-2 ${
                        nameError ? "is-invalid" : ""
                      }`}
                      placeholder="Name"
                      value={name}
                      onChange={handleNameChange}
                    />
                  </div>
                  {nameError && (
                    <div className="invalid-feedback">{nameError}</div>
                  )}
                </div>
                <div className="m-b15">
                  <label className="custom_font_size_bold" htmlFor="mobile">
                    <span className="required-star">*</span> Mobile
                  </label>
                  <div className="input-group">
                    <span className="input-group-text fs-3 py-0">
                      <i className="ri-smartphone-line text-muted" />
                    </span>
                    <input
                      type="tel"
                      id="mobile"
                      className={`form-control custom_font_size_bold ps-2 ${
                        mobileError ? "is-invalid" : ""
                      }`}
                      placeholder="Enter Mobile Number"
                      value={mobile}
                      onChange={handleMobileChange}
                    />
                  </div>
                  {mobileError && (
                    <div className="invalid-feedback">{mobileError}</div>
                  )}
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
                  <label
                    className="form-check-label custom_font_size_bold"
                    htmlFor="Checked-1"
                  >
                    I agree to all Terms, Privacy, and Fees
                  </label>
                </div>
                {checkboxError && (
                  <p className="text-danger">{checkboxError}</p>
                )}
                {error && <p className="text-danger">{error}</p>}
                {loading ? (
                  <div id="preloader">
                    <div className="loader">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    id="signupButton"
                    type="submit"
                    className="dz-btn btn custom_font_size_bold btn-color text-white rounded-xl"
                  >
                    Create Account
                  </button>
                )}
              </form>
            </div>
            <div className="text-center mt-auto custom_font_size">
              Already have an account?{" "}
              <Link
                to="/Signinscreen"
                className="text-underline custom_font_size_bold"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
      <CompanyVersion />
      {showPopup && (
        <div className="popup show">Account Created Successfully</div>
      )}
    </div>
  );
};

export default Signupscreen;