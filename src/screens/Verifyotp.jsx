

import React, { useState, useRef ,useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import Logoname from "../constants/Logoname";
import CompanyVersion from "../constants/CompanyVersion";
import pic4 from "../assets/background.jpg";
import { Toast } from "primereact/toast"; // Import Toast from primereact
import "primereact/resources/themes/saga-blue/theme.css"; // Choose a theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import OrderGif from "./OrderGif";
import LoaderGif from "./LoaderGIF";

const Verifyotp = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const restaurantCode = localStorage.getItem("restaurantCode");
  const restaurantId = localStorage.getItem("restaurantId");
  const mobile = localStorage.getItem("mobile");
  const otpStored = localStorage.getItem("otp");
  const toast = useRef(null); // Create a ref for the toast

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      // Ensure only a single digit is entered
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

     

      // Move focus to the next input if a digit is entered
      if (index < otp.length - 1) {
        const nextInput = document.getElementById(`digit-${index + 2}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  useEffect(() => {
    // Focus on the first input field when component mounts
    const firstInput = document.getElementById('digit-1');
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  const isEditable = (index) => {
    // Check if all subsequent boxes are empty
    return otp.slice(index + 1).every((digit) => digit === "");
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index]) {
        // Clear the current digit
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Move focus to the previous input if the current input is empty
        document.getElementById(`digit-${index}`).focus();
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
      const url = "https://menumitra.com/user_api/account_verify_otp";
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobile,
          otp: otpStored,
        }),
      };
  
      const response = await fetch(url, requestOptions);
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      if (data.st === 1) {
        console.log("OTP verification success:", data);
  
        const { customer_id, name, mobile } = data.customer_details;
  
        // Store only customer_id, name, and mobile in localStorage
        const userData = {
          customer_id,
          name,
          mobile
        };
        localStorage.setItem("userData", JSON.stringify(userData));
  
        // Show success toast message
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "OTP verified successfully!",
          life: 2000,
        });
  
        setTimeout(() => {
          navigate(`/${restaurantCode}/${localStorage.getItem("tableNumber") || "1"}`);
        }, 1000);
  
        localStorage.removeItem("otp");
        localStorage.removeItem("mobile");
      } else {
        setError("Incorrect OTP. Please try again.");
        // Show error toast message
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Incorrect OTP. Please try again.",
          life: 2000,
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Verification failed. Please try again.");
      // Show error toast message
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Verification failed. Please try again.",
        life: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const isOtpEntered = otp.every((digit) => digit.trim().length > 0);

  return (
    <div className="page-wrapper full-height">
      <Toast ref={toast} position="bottom-center" className="custom-toast" />
      <main className="page-content">
        <div className="container pt-0 overflow-hidden">
          <div className="dz-authentication-area dz-flex-box">
            <div className="dz-media">
              <img
                src={pic4}
                alt="OTP Verification"
                style={{ height: "250px" }}
              />
            </div>
            <div className="account-section">
              <div className="section-head">
                <Logoname />
                <span className="    ms-4 ps-2">
                  Enter OTP sent to {mobile}
                </span>
              </div>
              <form onSubmit={(e) => e.preventDefault()}>
                <label className="    ms-4 ps-1" htmlFor="otp">
                  <span className="required-star">*</span>OTP
                </label>
                <div
                  id="otp"
                  className="digit-group d-flex justify-content-center"
                >
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      className="form-control text-center border border-1 rounded-3"
                      type="tel"
                      id={`digit-${index + 1}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      disabled={!isEditable(index-1)}
                      maxLength="1"
                      style={{ width: "50px", marginRight: "5px" }}
                      autoFocus={index === 0} // Add autoFocus to the first input
                    />
                  ))}
                </div>
                {/* <p className="text-center      ">
                  An Authentication Code Has Sent
                  <span className="text-lowercase text-primary"></span>
                </p> */}
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
                    className="btn btn-success text-white rounded-pill mx-4 "
                    onClick={handleVerify}
                    disabled={otp.some((digit) => !digit.trim())}
                  >
                    Verify OTP
                  </button>
                )}
              </form>
            </div>
            <div className="text-center mt-auto  ">
              Back to{" "}
              <Link to="/Signinscreen" className="text-underline    ">
                Signin
              </Link>
            </div>
          </div>
        </div>
      </main>
      <div className="text-center mt-3 pt-5">
        <div className="my-4">
          <div class="text-center d-flex justify-content-center">
            <Link
              to="https://www.facebook.com/share/ra9cKRDkDpy2W94j/?mibextid=qi2Omg"
              class="footer-link mx-3"
              target="_blank"
            >
              <i class="ri-facebook-circle-fill ri-xl "></i>
            </Link>
            <Link
              href="https://www.instagram.com/autoprofito/?next=%2F"
              class="footer-link mx-3"
              target="_blank"
            >
              <i class="ri-instagram-line ri-xl "></i>
            </Link>
            <Link
              href="https://www.youtube.com/channel/UCgfTIIUL16SyHAQzQNmM52A"
              class="footer-link mx-3"
              target="_blank"
            >
              <i class="ri-youtube-line ri-xl "></i>
            </Link>
            <Link
              to="https://www.linkedin.com/company/104616702/admin/dashboard/"
              class="footer-link mx-3"
              target="_blank"
            >
              <i class="ri-linkedin-fill ri-xl "></i>
            </Link>
            <Link
              to="https://www.threads.net/@autoprofito"
              class="footer-link mx-3"
              target="_blank"
            >
              <i class="ri-twitter-x-line ri-xl "></i>
            </Link>
            <Link
                to="https://t.me/Autoprofito"
              class="footer-link mx-3"
              target="_blank"
            >
              <i class="ri-telegram-line ri-xl "></i>
            </Link>
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

export default Verifyotp;
 
