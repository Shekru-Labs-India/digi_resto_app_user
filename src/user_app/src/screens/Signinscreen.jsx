import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logoname from "../constants/Logoname";
import authenticationPic1 from "../assets/background.jpg";
import LoaderGif from "./LoaderGIF";

const Signinscreen = () => {
  const [mobile, setMobile] = useState("");
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [accountCreated, setAccountCreated] = useState(false);

  useEffect(() => {
    if (location.state && location.state.accountCreated) {
      setAccountCreated(true);
      navigate(`/user_app${location.pathname}`, { replace: true, state: {} });
    }
  }, [location, navigate]);

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
        window.showToast("success", "Guest login successful!");
        
        const restaurantCode = localStorage.getItem("restaurantCode");
        const tableNumber = localStorage.getItem("tableNumber") || "1";
        
        navigate(`/user_app/${restaurantCode}/${tableNumber}`);
      } else {
        window.showToast("error", data.msg || "Guest login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during guest login:", error);
      window.showToast("error", "Guest login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!isMobileValid) {
      setError("Mobile number must be 10 digits");
      window.showToast("error", "Please enter a valid 10-digit mobile number");
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
          window.showToast("success", "OTP has been sent successfully!");

          navigate("/user_app/Verifyotp");
          setMobile("");
          
          localStorage.setItem("customer_type", "registered");
          localStorage.setItem("isGuest", "false");
        } else {
          window.showToast("info", data.msg || "Sign in failed. Please try again.");
        }
      } else {
        window.showToast("warn", data.msg || `HTTP error! Status: ${response.status}`);

        if (data.st === 2) {
          setTimeout(() => {
            navigate("/user_app/Signupscreen");
          }, 3000);
        }
      }
    } catch (error) {
      console.error("Error signing in:", error);
      window.showToast("error", "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
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
    return /^\d{10}$/.test(value);
  };

  return (
    <div className="page-wrapper full-height">
      <main className="page-content">
        <div className="container pt-0 overflow-hidden">
          <div className="dz-authentication-area dz-flex-box">
            <div className="dz-media">
              <img
                src={authenticationPic1}
                alt=""
                style={{ height: "250px" }}
              />
            </div>
            <div className="account-section">
              <div className="section-head">
                <Logoname />
                <div className="d-flex justify-content-center">
                  <span className="    ">
                    Welcome Back You've{" "}
                    <span className="    mt-1 "> Been Missed!</span>
                  </span>
                </div>
              </div>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-2">
                  <label className="my-2" htmlFor="mobile">
                    <span className="required-star">*</span> Mobile
                  </label>
                  <div className=" border border-1 rounded-3 input-group text-muted">
                    <span className="input-group-text py-0">
                      <i className="ri-smartphone-line fs-3 text-muted"></i>
                    </span>
                    <input
                      type="tel"
                      id="mobile"
                      className={`form-control     ps-2 ${
                        mobileError ? "is-invalid" : ""
                      }`}
                      placeholder="Enter Mobile Number"
                      value={mobile}
                      onChange={handleMobileChange}
                      disabled={otpSent}
                      autoFocus
                    />
                  </div>
                  {mobileError && (
                    <div className="invalid-feedback">{mobileError}</div>
                  )}
                </div>
                {error && <p className="text-danger">{error}</p>}
                {loading ? (
                  <div id="preloader">
                    <div className="loader">
                      <LoaderGif />
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-success rounded-pill text-white mt-4"
                      onClick={handleSignIn}
                      disabled={!isMobileValid}
                    >
                      Send OTP
                    </button>
                  </>
                )}
              </form>
            </div>
            <div className="text-center mt-auto  ">
              Not a member?{" "}
              <Link to="/user_app/Signupscreen" className="text-underline    ">
                Create an account
              </Link>
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
        </div>
      </main>

      <div className="text-center mt-3 pt-5">
        <div className="my-4">
          <div class="text-center d-flex justify-content-center">
            <a
              href="https://www.facebook.com/people/Menu-Mitra/61565082412478/"
              class="footer-link mx-3"
              target="_blank"
            >
              <i class="ri-facebook-circle-fill ri-xl "></i>
            </a>
            <a
              href="https://www.instagram.com/menumitra/"
              class="footer-link mx-3"
              target="_blank"
            >
              <i class="ri-instagram-line ri-xl "></i>
            </a>
            <a
              href="https://www.youtube.com/@menumitra"
              class="footer-link mx-3"
              target="_blank"
            >
              <i class="ri-youtube-line ri-xl "></i>
            </a>
            <a
              href="https://www.linkedin.com/company/102429337/admin/dashboard/"
              class="footer-link mx-3"
              target="_blank"
            >
              <i class="ri-linkedin-fill ri-xl "></i>
            </a>
            <a
              href="https://www.threads.net/@menumitra"
              class="footer-link mx-3"
              target="_blank"
            >
              <i class="ri-twitter-x-line ri-xl "></i>
            </a>
            <a
              href="https://t.me/MenuMitra"
              class="footer-link mx-3"
              target="_blank"
            >
              <i class="ri-telegram-line ri-xl "></i>
            </a>
          </div>
        </div>
        <p className="text-center text-md-center mt-5">
          <i className="ri-flashlight-fill ri-lg"></i> Powered by <br />
          <a href="https://www.shekruweb.com" target="_blank">
            Shekru Labs India Pvt. Ltd.
          </a>
          <div className="">v1.1</div>
        </p>
      </div>
    </div>
  );
};

export default Signinscreen;
