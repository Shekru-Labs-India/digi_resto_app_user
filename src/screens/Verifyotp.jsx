// import React, { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import Logoname from "../constants/Logoname";
// import CompanyVersion from "../constants/CompanyVersion";
// import pic4 from "../assets/background.jpg";

// const Verifyotp = () => {
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Get mobile and otp from location state or localStorage
//   const mobile = location.state?.mobile || localStorage.getItem("mobile");
//   const otpStored = location.state?.otp || localStorage.getItem("otp");

//   // Handle OTP change, ensuring it's trimmed
//   const handleOtpChange = (e) => {
//     setOtp(e.target.value.trim());
//   };

//   const handleVerify = async () => {
//     if (!otp.trim()) {
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
//           mobile: mobile || "", // Use mobile from state or localStorage
//           otp: otpStored || otp, // Send stored OTP if available, else use the entered OTP
//         }),
//       };

//       const response = await fetch(url, requestOptions);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       // Check for successful OTP verification
//       if (data.st === 1) {
//         console.log("OTP verification success:", data);

//         // Store customer details in local storage
//         const { customer_id, name, dob } = data.customer_details;
//         const userData = { customer_id, name, dob };
//         localStorage.setItem("userData", JSON.stringify(userData));

//         // Redirect to the next screen after successful verification
//         navigate("/HomeScreen");

//         // Optionally, clear the OTP and mobile from localStorage
//         localStorage.removeItem("otp");
//         localStorage.removeItem("mobile");
//       } else {
//         setError("Incorrect OTP. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//       setError("Verification failed. Please try again.");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="page-wrapper full-height">
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
//                 <p>An Authentication Code has been sent to {mobile}</p>
//               </div>

//               <form onSubmit={(e) => e.preventDefault()}>
//                 <label className="form-label" htmlFor="otp">
//                   <span className="required-star">*</span> OTP
//                 </label>
//                 <div className="digit-group">
//                   <input
//                     className="form-control"
//                     type="text"
//                     id="otp"
//                     value={otp}
//                     onChange={handleOtpChange}
//                     placeholder="Enter OTP"
//                   />
//                 </div>

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
//                     disabled={!otp.trim()} // Disable button if OTP is not entered
//                   >
//                     Verify and proceed
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





// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Logoname from "../constants/Logoname";
// import CompanyVersion from "../constants/CompanyVersion";
// import pic4 from "../assets/background.jpg";

// const Verifyotp = () => {
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Get mobile and otp from localStorage
//   const mobile = localStorage.getItem("mobile");
//   const otpStored = localStorage.getItem("otp");

//   const handleOtpChange = (e) => {
//     setOtp(e.target.value.trim());
//   };

//   const handleVerify = async () => {
//     if (!otp.trim()) {
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
//           mobile: mobile, // Use mobile from localStorage
//           otp: otpStored || otp, // Use stored OTP if available, else use the entered OTP
//         }),
//       };

//       const response = await fetch(url, requestOptions);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       // Check for successful OTP verification
//       if (data.st === 1) {
//         console.log("OTP verification success:", data);

//         // Store customer details in local storage
//         const { customer_id, name, dob, restaurantId, tableNumber } =
//           data.customer_details;
//         const tempRestaurantId = localStorage.getItem("tempRestaurantId");
//         const tempTableNumber = localStorage.getItem("tempTableNumber");
//         const userData = {
//           customer_id,
//           name,
//           dob,
//           restaurantId: tempRestaurantId || restaurantId,
//           tableNumber: tempTableNumber || tableNumber || "1",
//         };
//         localStorage.setItem("userData", JSON.stringify(userData));

//         // Redirect to the HomeScreen with restaurantCode and table_number
//         navigate(`/HomeScreen/${userData.restaurantId}/${userData.tableNumber}`);

//         // Clear temporary storage
//         localStorage.removeItem("tempRestaurantId");
//         localStorage.removeItem("tempTableNumber");
//         localStorage.removeItem("lastRestaurantId");
//         localStorage.removeItem("lastTableNumber");
//         localStorage.removeItem("otp");
//         localStorage.removeItem("mobile");
//       } else {
//         setError("Incorrect OTP. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//       setError("Verification failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
//   const isOtpEntered = otp.trim().length > 0;

//   return (
//     <div className="page-wrapper full-height">
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
//                 <div className="section-head">
//                   <Logoname />
//                   <h2 className="title">Enter OTP</h2>
//                 </div>
//                 <form onSubmit={(e) => e.preventDefault()}>
//                   <label className="form-label fs-4" htmlFor="otp">
//                     <span className="required-star">*</span>OTP
//                   </label>
//                   <div id="otp" className="digit-group">
                    
                     
               
//                   <div className="input-group text-muted">
//                     {otp.trim() === "" && ( 
//                       <span className="input-group-text py-0">
//                         <i className="ri-lock-line fs-3 text-muted"></i>
//                       </span>
//                     )}
//                     <input
//                       className="form-control text-start"
//                       type="text"
//                       id="digit-1"
//                       name="digit-1"
//                       value={otp}
//                       onChange={(e) => setOtp(e.target.value)}
//                       placeholder="Enter OTP"
//                     />
//                   </div>
                    
//                   </div>
//                   <p>
//                     An Authentication Code Has Sent
//                     <span className="text-lowercase text-primary"></span>
//                   </p>
//                   {error && <p className="text-danger">{error}</p>}
//                   {loading ? (
//                     <div id="preloader">
//                       <div className="loader">
//                         <div
//                           className="spinner-border text-primary"
//                           role="status"
//                         >
//                           <span className="visually-hidden">Loading...</span>
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <button
//                       className="dz-btn btn btn-thin btn-lg btn-primary rounded-xl"
//                       onClick={handleVerify}
//                       disabled={!isOtpEntered} // Disable button if OTP is not entered
//                     >
//                       Verify OTP
//                     </button>
//                   )}
//                 </form>
//               </div>

//             <div className="text-center mt-auto">
//               Back to{" "}
//               <Link to="/Signinscreen" className="text-underline font-w500">
//                 Sign In
//               </Link>
//             </div>
//           </div>
//         </div>
//       </main>
//       <CompanyVersion/>
//     </div>
//   );
// };

// export default Verifyotp;



// cursor 




import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logoname from "../constants/Logoname";
import CompanyVersion from "../constants/CompanyVersion";
import pic4 from "../assets/background.jpg";

const Verifyotp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get mobile and otp from localStorage
  const mobile = localStorage.getItem("mobile");
  const otpStored = localStorage.getItem("otp");

  const handleOtpChange = (e) => {
    setOtp(e.target.value.trim());
  };

  const handleVerify = async () => {
    if (!otp.trim()) {
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
          mobile: mobile, // Use mobile from localStorage
          otp: otpStored || otp, // Use stored OTP if available, else use the entered OTP
        }),
      };

      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Check for successful OTP verification
      if (data.st === 1) {
        console.log("OTP verification success:", data);

        // Store customer details in local storage
        const { customer_id, name, dob, mobile, restaurantId, tableNumber } =
          data.customer_details;
        const tempRestaurantId = localStorage.getItem("tempRestaurantId");
        const tempTableNumber = localStorage.getItem("tempTableNumber");
        const userData = {
          customer_id,
          name,
          dob,
          mobile, // Store mobile number
          restaurantId: tempRestaurantId || restaurantId,
          tableNumber: tempTableNumber || tableNumber || "1",
        };
        localStorage.setItem("userData", JSON.stringify(userData));

        // Redirect to the HomeScreen with restaurantCode and table_number
        navigate(
          `/HomeScreen/${userData.restaurantId}/${userData.tableNumber}`
        );

        // Clear temporary storage
        localStorage.removeItem("tempRestaurantId");
        localStorage.removeItem("tempTableNumber");
        localStorage.removeItem("lastRestaurantId");
        localStorage.removeItem("lastTableNumber");
        localStorage.removeItem("otp");
        localStorage.removeItem("mobile");
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

  const isOtpEntered = otp.trim().length > 0;

  return (
    <div className="page-wrapper full-height">
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
                <h2 className="title">Enter OTP</h2>
              </div>
              <form onSubmit={(e) => e.preventDefault()}>
                <label className="form-label fs-4" htmlFor="otp">
                  <span className="required-star">*</span>OTP
                </label>
                <div id="otp" className="digit-group">
                  <div className="input-group text-muted">
                    {otp.trim() === "" && (
                      <span className="input-group-text py-0">
                        <i className="ri-lock-line fs-3 text-muted"></i>
                      </span>
                    )}
                    <input
                      className="form-control text-start"
                      type="text"
                      id="digit-1"
                      name="digit-1"
                      value={otp}
                      onChange={handleOtpChange}
                      placeholder="Enter OTP"
                    />
                  </div>
                </div>
                <p>
                  An Authentication Code Has Sent
                  <span className="text-lowercase text-primary"></span>
                </p>
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
                    className="dz-btn btn btn-thin btn-lg btn-primary rounded-xl"
                    onClick={handleVerify}
                    disabled={!isOtpEntered} // Disable button if OTP is not entered
                  >
                    Verify OTP
                  </button>
                )}
              </form>
            </div>
            <div className="text-center mt-auto">
              Back to{" "}
              <Link to="/Signinscreen" className="text-underline font-w500">
                Sign In
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