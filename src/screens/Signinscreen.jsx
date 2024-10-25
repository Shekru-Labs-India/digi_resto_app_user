  import React, { useState, useEffect, useRef } from "react";
  import { Link, useNavigate, useLocation } from "react-router-dom";
  import Logoname from "../constants/Logoname";
  import CompanyVersion from "../constants/CompanyVersion";
  import authenticationPic1 from "../assets/background.jpg";
  import { Toast } from "primereact/toast"; // Import Toast from primereact
  import "primereact/resources/themes/saga-blue/theme.css"; // Theme
  import "primereact/resources/primereact.min.css"; // Core CSS
import OrderGif from "./OrderGif";
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
    const toastBottomCenter = useRef(null); // Create a ref for the toast

    useEffect(() => {
      if (location.state && location.state.accountCreated) {
        setAccountCreated(true);
        navigate(location.pathname, { replace: true, state: {} });
      }
    }, [location, navigate]);

   const handleSignIn = async () => {
     if (!isMobileValid) {
       setError("Mobile number must be 10 digits");
       return;
     }
     setLoading(true);
     setError(null);

     try {
       const url = "https://menumitra.com/user_api/account_login";
       const requestOptions = {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ mobile }),
       };

       const response = await fetch(url, requestOptions);
       const data = await response.json();

       if (response.ok) {
         if (data.st === 1) {
           console.log("Sign-in success response:", data);

           const otp = data.msg.match(/\d+/)[0];
           localStorage.setItem("mobile", mobile);
           localStorage.setItem("otp", otp);

           setOtpSent(true);
           toastBottomCenter.current.show({
             severity: "success",
             summary: "Success",
             detail: "OTP has been sent successfully!",
             life: 2000,
           });

           navigate("/Verifyotp");
           setMobile("");
         } else {
           toastBottomCenter.current.show({
             severity: "info",
             summary: "Info",
             detail: data.msg || "Sign in failed. Please try again.",
             life: 2000,
           });
         }
       } else {
         // Use the API response message instead of the default error
         toastBottomCenter.current.show({
           severity: "warn",
           summary: "Warning",
           detail: data.msg || `HTTP error! Status: ${response.status}`,
           life: 2000,
         });

         if (data.st === 2) {
           setTimeout(() => {
             navigate("/Signupscreen");
           }, 3000);
         }
       }
     } catch (error) {
       console.error("Error signing in:", error);
       toastBottomCenter.current.show({
         severity: "error",
         summary: "Error",
         detail: "Sign in failed. Please try again.",
         life: 2000,
       });
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
        <Toast
          ref={toastBottomCenter}
          position="bottom-center"
          className="custom-toast"
        />
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
                    <div className="input-group text-muted border border-1 rounded-3">
                      <span className="input-group-text py-0">
                        <i className="ri-smartphone-line fs-3 text-muted"></i>
                      </span>
                      <input
                        type="tel"
                        id="mobile"
                        autoFocus
                        className={`form-control     ps-2 ${
                          mobileError ? "is-invalid" : ""
                        }`}
                        placeholder="Enter Mobile Number"
                        value={mobile}
                        onChange={handleMobileChange}
                        disabled={otpSent}
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
                        {/* <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div> */}
                        <LoaderGif />
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-success rounded-pill text-white mt-4"
                      onClick={handleSignIn}
                      disabled={!isMobileValid}
                    >
                      Send OTP
                    </button>
                  )}
                </form>
              </div>
              <div className="text-center mt-auto  ">
                Not a member?{" "}
                <Link to="/Signupscreen" className="text-underline    ">
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </main>
        <div className="text-center mt-3 pt-5">
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