import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import pic2 from "../assets/background.jpg";
import Logoname from "../constants/Logoname";
import CompanyVersion from "../constants/CompanyVersion";
import OrderGif from "./OrderGif";
import LoaderGif from "./LoaderGIF";

const Signupscreen = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkboxError, setCheckboxError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const checkboxRef = useRef(null);
  const nameInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isFormFilled()) {
      setError("Please fill all the fields correctly.");
      setCheckboxError("");
      
      if (name.trim() === "") {
        nameInputRef.current.focus();
        nameInputRef.current.classList.add("is-invalid");
      }
      if (mobile.trim() === "") {
        mobileInputRef.current.focus();
        mobileInputRef.current.classList.add("is-invalid");
      }
      
      window.showToast("error", "Please fill all fields correctly");
      return;
    }

    if (!agreed) {
      setCheckboxError("Please select the privacy!");
      setError("");
      if (checkboxRef.current) {
        checkboxRef.current.classList.add("shake");
        setTimeout(() => {
          checkboxRef.current.classList.remove("shake");
        }, 500);
      }
      window.showToast("error", "Please accept the privacy policy and terms");
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
      console.log("Signup Response:", data);

      if (data.st === 1) {
        const generatedOtp = String(Math.floor(1000 + Math.random() * 9000));
        console.log("Generated OTP:", generatedOtp);
        
        localStorage.setItem("otp", generatedOtp);
        localStorage.setItem("mobile", mobile);
        localStorage.setItem("customer_type", "regular");
        localStorage.setItem("isGuest", "false");

        window.showToast("success", "Account created successfully!");
        setShowPopup(true);
        
        setTimeout(() => {
          setShowPopup(false);
          navigate("/user_app/Verifyotp", { state: { accountCreated: true } });
        }, 2000);
      } else {
        window.showToast("error", data.msg || "Failed to create account");
        navigate("/user_app/Signinscreen");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      window.showToast("error", error.message || "Failed to create account");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateCustomerId = () => {
    return Math.floor(Math.random() * 1000000);
  };

  const handleNameChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z ]/gi, "");
    setName(value);
    if (value.trim() === "") {
      setNameError("Name is required");
      nameInputRef.current.classList.add("is-invalid");
    } else {
      setNameError("");
      nameInputRef.current.classList.remove("is-invalid");
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(value);
    if (value.trim() === "") {
      setMobileError("Mobile is required");
      mobileInputRef.current.classList.add("is-invalid");
    } else if (value.length === 10) {
      setMobileError("");
      mobileInputRef.current.classList.remove("is-invalid");
    } else {
      setMobileError("Mobile number must be exactly 10 digits");
      mobileInputRef.current.classList.add("is-invalid");
    }
  };

  const isFormFilled = () => {
    return (
      name.trim() !== "" &&
      mobile.trim() !== "" &&
      mobile.length === 10 &&
      agreed
    );
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
                <h2 className="   ">Create your account</h2>
              </div>
              <form onSubmit={handleSignUp}>
                <div className="mb-3">
                  <label className="    " htmlFor="name">
                    <span className="required-star">*</span>Name
                  </label>
                  <div className="border border-1 rounded-3">
                    <div className="input-group ">
                      <span className="input-group-text fs-3 py-0 ">
                        <i className="ri-user-3-line text-muted" />
                      </span>
                      <input
                        type="text"
                        id="name"
                        autoFocus
                        ref={nameInputRef}
                        className={`form-control ps-2 ${
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
                </div>
                <div className="m-b15">
                  <label className="   " htmlFor="mobile">
                    <span className="required-star">*</span> Mobile
                  </label>
                  <div className="border border-1 rounded-3">
                    <div className="input-group">
                      <span className="input-group-text fs-3 py-0">
                        <i className="ri-smartphone-line text-muted" />
                      </span>
                      <input
                        type="tel"
                        id="mobile"
                        ref={mobileInputRef}
                        className={`form-control     ps-2 ${
                          mobileError ? "is-invalid" : ""
                        }`}
                        placeholder="Enter Mobile Number"
                        value={mobile}
                        onChange={handleMobileChange}
                      />
                    </div>
                  </div>
                  {mobileError && (
                    <div className="invalid-feedback">{mobileError}</div>
                  )}
                </div>
                <div className="form-check m-b25" ref={checkboxRef}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={agreed}
                    id="Checked-1"
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      setCheckboxError("");
                    }}
                  />
                  <label className="form-check-label " htmlFor="Checked-1">
                    I agree to
                    <Link
                      to="/user_app/privacy"
                      className="text-underline px-1"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                    and
                    <Link
                      to="/user_app/terms"
                      className="text-underline px-1"
                      target="_blank"
                    >
                      Terms.
                    </Link>
                  </label>
                </div>
                {checkboxError && (
                  <p className="text-danger">{checkboxError}</p>
                )}
                {error && <p className="text-danger">{error}</p>}
                {loading ? (
                  <div id="preloader">
                    <div className="loader">
                      <LoaderGif />
                    </div>
                  </div>
                ) : (
                  <button
                    id="signupButton"
                    type="submit"
                    className="btn btn-success rounded-pill text-white mt-4"
                    disabled={!isFormFilled()}
                  >
                    Create Account
                  </button>
                )}
              </form>
            </div>
            <div className="text-center mt-auto  ">
              Already have an account?{" "}
              <Link to="/user_app/Signinscreen" className="text-underline    ">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
      {showPopup && (
        <div className="popup show">Account Created Successfully</div>
      )}
      <div className="text-center mt-5">
        <div className="my-4">
          <div class="text-center d-flex justify-content-center">
            <a
              href="https://www.facebook.com/share/ra9cKRDkDpy2W94j/?mibextid=qi2Omg"
              class="footer-link mx-3"
              target="_blank"
            >
              <i class="ri-facebook-circle-fill ri-xl "></i>
            </a>
            <a
              href="https://www.instagram.com/autoprofito/?next=%2F"
              class="footer-link mx-3"
              target="_blank"
            >
              <i class="ri-instagram-line ri-xl "></i>
            </a>
            <a
              href="https://www.youtube.com/channel/UCgfTIIUL16SyHAQzQNmM52A"
              class="footer-link mx-3"
              target="_blank"
            >
              <i class="ri-youtube-line ri-xl "></i>
            </a>
            <a
              href="https://www.linkedin.com/company/104616702/admin/dashboard/"
              class="footer-link mx-3"
              target="_blank"
            >
              <i class="ri-linkedin-fill ri-xl "></i>
            </a>
            <a
              href="https://www.threads.net/@autoprofito"
              class="footer-link mx-3"
              target="_blank"
            >
              <i class="ri-twitter-x-line ri-xl "></i>
            </a>
            <a
              href="https://t.me/Autoprofito"
              class="footer-link mx-3"
              target="_blank"
            >
              <i class="ri-telegram-line ri-xl "></i>
            </a>
          </div>
          <p className="text-center text-md-center mt-5 gray-text">
            <i className="ri-flashlight-fill ri-lg"></i> Powered by <br />
            <a
              className="gray-text"
              href="https://www.shekruweb.com"
              target="_blank"
            >
              Shekru Labs India Pvt. Ltd.
            </a>
            <div className="">v1.1</div>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signupscreen;