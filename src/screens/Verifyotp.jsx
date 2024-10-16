<<<<<<< HEAD
// import React, { useState, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Logoname from "../constants/Logoname";
// import CompanyVersion from "../constants/CompanyVersion";
// import pic4 from "../assets/background.jpg";
// import { Toast } from 'primereact/toast'; // Import Toast from primereact

// const Verifyotp = () => {
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const restaurantCode = localStorage.getItem("restaurantCode");
//   const restaurantId = localStorage.getItem("restaurantId");
//   const mobile = localStorage.getItem("mobile");
//   const otpStored = localStorage.getItem("otp");
//   const toastBottomCenter = useRef(null); // Create a ref for the toast

//   const handleOtpChange = (e, index) => {
//     const value = e.target.value;
//     if (/^\d*$/.test(value)) { // Only allow digits
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);

//       // Move focus to the next input if a digit is entered
//       if (value && index < otp.length - 1) {
//         document.getElementById(`digit-${index + 2}`).focus();
//       }
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       // Move focus to the previous input if backspace is pressed and current input is empty
//       document.getElementById(`digit-${index}`).focus();
//     }
//   };

//   const handleVerify = async () => {
//     const enteredOtp = otp.join("");
//     if (!enteredOtp.trim()) {
//       setError("OTP is required");
//       return;
//     }

//     setLoading(true);

//     try {
//       const url = "https://menumitra.com/user_api/account_verify_otp";
//       const requestOptions = {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           mobile: mobile,
//           otp: otpStored || enteredOtp,
//         }),
//       };

//       const response = await fetch(url, requestOptions);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       if (data.st === 1) {
//         console.log("OTP verification success:", data);

//         const { customer_id, name, dob, mobile, restaurantId, tableNumber } =
//           data.customer_details;
//         const tempRestaurantId = localStorage.getItem("tempRestaurantId");
//         const tempTableNumber = localStorage.getItem("tempTableNumber");
//         const userData = {
//           customer_id,
//           name,
//           dob,
//           mobile,
//           restaurantId: restaurantId,
//           tableNumber: tempTableNumber || tableNumber || "1",
//           restaurantCode: restaurantCode,
//         };
//         localStorage.setItem("userData", JSON.stringify(userData));

//         // Show success toast message
//         toastBottomCenter.current.show({
//           severity: "success",
//           summary: "Success",
//           detail: "OTP verified successfully!",
//           life: 2000,
//         });

//         // Wait for 2 seconds before navigating
//         setTimeout(() => {
//           navigate(`/${userData.restaurantCode}/${userData.tableNumber}`);
//         }, 2000);

//         localStorage.removeItem("tempRestaurantId");
//         localStorage.removeItem("tempTableNumber");
//         localStorage.removeItem("lastRestaurantId");
//         localStorage.removeItem("lastTableNumber");
//         localStorage.removeItem("otp");
//         localStorage.removeItem("mobile");
//       } else {
//         setError("Incorrect OTP. Please try again.");
//         // Show error toast message
//         toastBottomCenter.current.show({
//           severity: "error",
//           summary: "Error",
//           detail: "Incorrect OTP. Please try again.",
//           life: 3000,
//         });
//       }
//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//       setError("Verification failed. Please try again.");
//       // Show error toast message
//       toastBottomCenter.current.show({
//         severity: "error",
//         summary: "Error",
//         detail: "Verification failed. Please try again.",
//         life: 3000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isOtpEntered = otp.every((digit) => digit.trim().length > 0);

//   return (
//     <div className="page-wrapper full-height">
//       <Toast ref={toastBottomCenter} position="bottom-center" />
//       <main className="page-content">
//         <div className="container pt-0 overflow-hidden">
//           <div className="dz-authentication-area dz-flex-box">
//             <div className="dz-media">
//               <img
//                 src={pic4}
//                 alt="OTP Verification"
//                 style={{ height: "250px" }}
//               />
//             </div>
//             <div className="account-section">
//               <div className="section-head">
//                 <Logoname />
//                 <h2 className="title">Enter OTP</h2>
//               </div>
//               <form onSubmit={(e) => e.preventDefault()}>
//                 <label className="form-label fs-4" htmlFor="otp">
//                   <span className="required-star">*</span>OTP
//                 </label>
//                 <div id="otp" className="digit-group">
//                   {otp.map((digit, index) => (
//                     <input
//                       key={index}
//                       className="form-control text-center"
//                       type="text"
//                       id={`digit-${index + 1}`}
//                       value={digit}
//                       onChange={(e) => handleOtpChange(e, index)}
//                       onKeyDown={(e) => handleKeyDown(e, index)}
//                       maxLength="1"
//                       style={{ width: "50px", marginRight: "5px" }}
//                     />
//                   ))}
//                 </div>
//                 <p>
//                   An Authentication Code Has Sent
//                   <span className="text-lowercase text-primary"></span>
//                 </p>
//                 {error && <p className="text-danger">{error}</p>}
//                 {loading ? (
//                   <div id="preloader">
//                     <div className="loader">
//                       <div
//                         className="spinner-border text-primary"
//                         role="status"
//                       >
//                         <span className="visually-hidden">Loading...</span>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <button
//                     className="dz-btn btn btn-thin btn-lg btn-primary rounded-xl"
//                     onClick={handleVerify}
//                     disabled={!isOtpEntered}
//                   >
//                     Verify OTP
//                   </button>
//                 )}
//               </form>
//             </div>
//             <div className="text-center mt-auto">
//               Back to{" "}
//               <Link to="/Signinscreen" className="text-underline font-w500">
//                 Sign In
//               </Link>
//             </div>
//           </div>
//         </div>
//       </main>
//       <CompanyVersion />
//     </div>
//   );
// };

// export default Verifyotp;

// canvas gpt

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

        const { customer_id, name, mobile, tableNumber } =
          data.customer_details;

        const storedUserData = JSON.parse(
          localStorage.getItem("userData") || "{}"
        );
        const storedTableNumber = localStorage.getItem("tableNumber");

        const userData = {
          customer_id,
          name,

          mobile,
          restaurantId: restaurantId,
          tableNumber:
            storedTableNumber ||
            storedUserData.tableNumber ||
            data.customer_details.tableNumber ||
            "1",
          restaurantCode: restaurantCode,
        };
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("tableNumber", userData.tableNumber);

        // Show success toast message
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "OTP verified successfully!",
          life: 2000,
        });

        // Wait for 2 seconds before navigating
        setTimeout(() => {
          navigate(`/${userData.restaurantCode}/${userData.tableNumber}`);
        }, 2000);

        localStorage.removeItem("otp");
        localStorage.removeItem("mobile");
      } else {
        setError("Incorrect OTP. Please try again.");
        // Show error toast message
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Incorrect OTP. Please try again.",
          life: 3000,
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
        life: 3000,
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
                  Enter OTP sent to{" "}{mobile}
                </span>
              </div>
              <form onSubmit={(e) => e.preventDefault()}>
                <label
                  className="    ms-4 ps-1"
                  htmlFor="otp"
                >
                  <span className="required-star">*</span>OTP
                </label>
                <div
                  id="otp"
                  className="digit-group d-flex justify-content-center"
                >
                  {otp.map((digit, index) => (
                    
                      <input
                        key={index}
                        className="form-control text-center"
                        type="tel"
                        id={`digit-${index + 1}`}
                        value={digit}
                        onChange={(e) => handleOtpChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        disabled={!isEditable(index)}
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
                    className="btn btn-color text-white rounded-pill mx-4 "
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
              <Link
                to="/Signinscreen"
                className="text-underline    "
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </main>
      <CompanyVersion />
    </div>
  );
};

export default Verifyotp;
=======
// import React, { useState, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Logoname from "../constants/Logoname";
// import CompanyVersion from "../constants/CompanyVersion";
// import pic4 from "../assets/background.jpg";
// import { Toast } from 'primereact/toast'; // Import Toast from primereact

// const Verifyotp = () => {
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const restaurantCode = localStorage.getItem("restaurantCode");
//   const restaurantId = localStorage.getItem("restaurantId");
//   const mobile = localStorage.getItem("mobile");
//   const otpStored = localStorage.getItem("otp");
//   const toastBottomCenter = useRef(null); // Create a ref for the toast

//   const handleOtpChange = (e, index) => {
//     const value = e.target.value;
//     if (/^\d*$/.test(value)) { // Only allow digits
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);

//       // Move focus to the next input if a digit is entered
//       if (value && index < otp.length - 1) {
//         document.getElementById(`digit-${index + 2}`).focus();
//       }
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       // Move focus to the previous input if backspace is pressed and current input is empty
//       document.getElementById(`digit-${index}`).focus();
//     }
//   };

//   const handleVerify = async () => {
//     const enteredOtp = otp.join("");
//     if (!enteredOtp.trim()) {
//       setError("OTP is required");
//       return;
//     }

//     setLoading(true);

//     try {
//       const url = "https://menumitra.com/user_api/account_verify_otp";
//       const requestOptions = {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           mobile: mobile,
//           otp: otpStored || enteredOtp,
//         }),
//       };

//       const response = await fetch(url, requestOptions);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       if (data.st === 1) {
//         console.log("OTP verification success:", data);

//         const { customer_id, name, dob, mobile, restaurantId, tableNumber } =
//           data.customer_details;
//         const tempRestaurantId = localStorage.getItem("tempRestaurantId");
//         const tempTableNumber = localStorage.getItem("tempTableNumber");
//         const userData = {
//           customer_id,
//           name,
//           dob,
//           mobile,
//           restaurantId: restaurantId,
//           tableNumber: tempTableNumber || tableNumber || "1",
//           restaurantCode: restaurantCode,
//         };
//         localStorage.setItem("userData", JSON.stringify(userData));

//         // Show success toast message
//         toastBottomCenter.current.show({
//           severity: "success",
//           summary: "Success",
//           detail: "OTP verified successfully!",
//           life: 2000,
//         });

//         // Wait for 2 seconds before navigating
//         setTimeout(() => {
//           navigate(`/${userData.restaurantCode}/${userData.tableNumber}`);
//         }, 2000);

//         localStorage.removeItem("tempRestaurantId");
//         localStorage.removeItem("tempTableNumber");
//         localStorage.removeItem("lastRestaurantId");
//         localStorage.removeItem("lastTableNumber");
//         localStorage.removeItem("otp");
//         localStorage.removeItem("mobile");
//       } else {
//         setError("Incorrect OTP. Please try again.");
//         // Show error toast message
//         toastBottomCenter.current.show({
//           severity: "error",
//           summary: "Error",
//           detail: "Incorrect OTP. Please try again.",
//           life: 3000,
//         });
//       }
//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//       setError("Verification failed. Please try again.");
//       // Show error toast message
//       toastBottomCenter.current.show({
//         severity: "error",
//         summary: "Error",
//         detail: "Verification failed. Please try again.",
//         life: 3000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isOtpEntered = otp.every((digit) => digit.trim().length > 0);

//   return (
//     <div className="page-wrapper full-height">
//       <Toast ref={toastBottomCenter} position="bottom-center" />
//       <main className="page-content">
//         <div className="container pt-0 overflow-hidden">
//           <div className="dz-authentication-area dz-flex-box">
//             <div className="dz-media">
//               <img
//                 src={pic4}
//                 alt="OTP Verification"
//                 style={{ height: "250px" }}
//               />
//             </div>
//             <div className="account-section">
//               <div className="section-head">
//                 <Logoname />
//                 <h2 className="title">Enter OTP</h2>
//               </div>
//               <form onSubmit={(e) => e.preventDefault()}>
//                 <label className="form-label fs-4" htmlFor="otp">
//                   <span className="required-star">*</span>OTP
//                 </label>
//                 <div id="otp" className="digit-group">
//                   {otp.map((digit, index) => (
//                     <input
//                       key={index}
//                       className="form-control text-center"
//                       type="text"
//                       id={`digit-${index + 1}`}
//                       value={digit}
//                       onChange={(e) => handleOtpChange(e, index)}
//                       onKeyDown={(e) => handleKeyDown(e, index)}
//                       maxLength="1"
//                       style={{ width: "50px", marginRight: "5px" }}
//                     />
//                   ))}
//                 </div>
//                 <p>
//                   An Authentication Code Has Sent
//                   <span className="text-lowercase text-primary"></span>
//                 </p>
//                 {error && <p className="text-danger">{error}</p>}
//                 {loading ? (
//                   <div id="preloader">
//                     <div className="loader">
//                       <div
//                         className="spinner-border text-primary"
//                         role="status"
//                       >
//                         <span className="visually-hidden">Loading...</span>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <button
//                     className="dz-btn btn btn-thin btn-lg btn-primary rounded-xl"
//                     onClick={handleVerify}
//                     disabled={!isOtpEntered}
//                   >
//                     Verify OTP
//                   </button>
//                 )}
//               </form>
//             </div>
//             <div className="text-center mt-auto">
//               Back to{" "}
//               <Link to="/Signinscreen" className="text-underline font-w500">
//                 Sign In
//               </Link>
//             </div>
//           </div>
//         </div>
//       </main>
//       <CompanyVersion />
//     </div>
//   );
// };

// export default Verifyotp;

// canvas gpt

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

        const { customer_id, name, mobile, tableNumber } =
          data.customer_details;

        const storedUserData = JSON.parse(
          localStorage.getItem("userData") || "{}"
        );
        const storedTableNumber = localStorage.getItem("tableNumber");

        const userData = {
          customer_id,
          name,

          mobile,
          restaurantId: restaurantId,
          tableNumber:
            storedTableNumber ||
            storedUserData.tableNumber ||
            data.customer_details.tableNumber ||
            "1",
          restaurantCode: restaurantCode,
        };
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("tableNumber", userData.tableNumber);

        // Show success toast message
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "OTP verified successfully!",
          life: 2000,
        });

       
        setTimeout(() => {
          navigate(`/${userData.restaurantCode}/${userData.tableNumber}`);
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
                  Enter OTP sent to{" "}{mobile}
                </span>
              </div>
              <form onSubmit={(e) => e.preventDefault()}>
                <label
                  className="    ms-4 ps-1"
                  htmlFor="otp"
                >
                  <span className="required-star">*</span>OTP
                </label>
                <div
                  id="otp"
                  className="digit-group d-flex justify-content-center"
                >
                  {otp.map((digit, index) => (
                    
                      <input
                        key={index}
                        className="form-control text-center"
                        type="tel"
                        id={`digit-${index + 1}`}
                        value={digit}
                        onChange={(e) => handleOtpChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        disabled={!isEditable(index)}
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
                    className="btn btn-color text-white rounded-pill mx-4 "
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
              <Link
                to="/Signinscreen"
                className="text-underline    "
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </main>
      <CompanyVersion />
    </div>
  );
};

export default Verifyotp;
>>>>>>> 8f7d9f1ca465a5bac3b418bb767b7df304e63fb5
