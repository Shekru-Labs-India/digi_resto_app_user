


// import React, { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import Logoname from "../constants/Logoname";
// import CompanyVersion from "../constants/CompanyVersion";
// import pic4 from "../assets/background.jpg";

// const Verifyotp = () => {
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState(null);
//   const navigate = useNavigate(); // Hook to navigate to different routes
//   const location = useLocation();
//   const mobile = location.state?.mobile || '';

//   const handleVerify = async () => {
//     try {
//       const url = "https://menumitra.com/user_api/account_verify_otp";
//       const requestOptions = {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           mobile: mobile,
//           otp: otp,
//         }),
//       };

//       const response = await fetch(url, requestOptions);

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Verification response:", data);

//       if (data.st === 1) {
//         // Navigate to HomeScreen on successful verification (st = 1)
//         navigate("/HomeScreen/347279"); // Redirect to HomeScreen
//       } else {
//         setError("Wrong OTP. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//       setError("Verification failed. Please try again.");
//     }
//   };

//   const isOtpEntered = otp.trim().length > 0;

//   return (
//     <div className="page-wrapper full-height">
//       <main className="page-content">
//         <div className="container pt-0 overflow-hidden">
//           <div className="dz-authentication-area dz-flex-box">
//             <div className="dz-media">
//               <img src={pic4} alt="" style={{ height: "250px" }} />
//             </div>
//             <div className="account-section">
//               <div className="section-head">
//                 <Logoname />
//                 <h2 className="title">Enter OTP</h2>
//                 <p>
//                   An Authentication Code Has Sent To {mobile}
//                   <span className="text-lowercase text-primary"></span>
//                 </p>
//               </div>
//               <form onSubmit={(e) => e.preventDefault()}>
//                 <label className="form-label" htmlFor="otp">
//                   <span className="required-star">*</span>OTP
//                 </label>
//                 <div id="otp" className="digit-group">
//                   <input
//                     className="form-control"
//                     type="text"
//                     id="digit-1"
//                     name="digit-1"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value)}
//                     placeholder="Enter OTP"
//                   />
//                 </div>
//                 {error && <p className="text-danger">{error}</p>}
//                 <button
//                   className="dz-btn btn btn-thin btn-lg btn-primary rounded-xl"
//                   onClick={handleVerify}
//                   disabled={!isOtpEntered} // Disable button if OTP is not entered
//                 >
//                   Verify and proceed
//                 </button>
//               </form>
//             </div>
//             <div className="text-center mt-auto">
//               Back To{" "}
//               <Link
//                 to="/Signinscreen"
//                 className="text-underline font-w500"
//               >
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


import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logoname from "../constants/Logoname";
import CompanyVersion from "../constants/CompanyVersion";
import pic4 from "../assets/background.jpg";

const Verifyotp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate(); // Hook to navigate to different routes
  const location = useLocation();
  const mobile = location.state?.mobile || '';

  const handleVerify = async () => {
    setLoading(true); // Set loading to true before API call
    try {
      const url = "https://menumitra.com/user_api/account_verify_otp";
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobile,
          otp: otp,
        }),
      };

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Verification response:", data);

      if (data.st === 1) {
        // Navigate to HomeScreen on successful verification (st = 1)
        navigate("/HomeScreen/347279"); // Redirect to HomeScreen
      } else {
        setError("Wrong OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Verification failed. Please try again.");
    }
    setLoading(false); // Set loading to false after API call
  };

  const isOtpEntered = otp.trim().length > 0;

  return (
    <div className="page-wrapper full-height">
      <main className="page-content">
        <div className="container pt-0 overflow-hidden">
          <div className="dz-authentication-area dz-flex-box">
            <div className="dz-media">
              <img src={pic4} alt="" style={{ height: "250px" }} />
            </div>
            <div className="account-section">
              <div className="section-head">
                <Logoname />
                <h2 className="title">Enter OTP</h2>
                <p>
                  An Authentication Code Has Sent To {mobile}
                  <span className="text-lowercase text-primary"></span>
                </p>
              </div>
              <form onSubmit={(e) => e.preventDefault()}>
                <label className="form-label" htmlFor="otp">
                  <span className="required-star">*</span>OTP
                </label>
                <div id="otp" className="digit-group">
                  <input
                    className="form-control"
                    type="text"
                    id="digit-1"
                    name="digit-1"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                  />
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
                    className="dz-btn btn btn-thin btn-lg btn-primary rounded-xl"
                    onClick={handleVerify}
                    disabled={!isOtpEntered} // Disable button if OTP is not entered
                  >
                    Verify and proceed
                  </button>
                )}
              </form>
            </div>
            <div className="text-center mt-auto">
              Back To{" "}
              <Link
                to="/Signinscreen"
                className="text-underline font-w500"
              >
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
