// import React from "react";
// import "../assets/css/style.css";
// import authenticationPic1 from "../assets/images/authentication/pic1.png";
// import welcomeback from "../assets/images/authentication/wave.svg";

// import apple from "../assets/images/social/apple-logo.svg";
// import googlemail from "../assets/images/social/google-mail.svg";
// import { Link } from "react-router-dom";
// import Logoname from "../constants/Logoname";
// import CompanyVersion from "../constants/CompanyVersion";
// const Signinscreen = () => {
//   return (
//     <div className="page-wrapper full-height">
     
//       <main className="page-content">
//         <div className="container pt-0 overflow-hidden">
//           <div className="dz-authentication-area dz-flex-box">
//             <div className="dz-media">
//               <img src={authenticationPic1} alt="" />
//             </div>
//             <div className="account-section">
//               <div className="section-head">
//             <Logoname/>

//                 <h2 className="title">
//                   Welcome Back <img src={welcomeback} alt="wave" /> You've Been
//                   Missed!
//                 </h2>
//               </div>
//               <form>
               

//                 <div className="m-b15">
//         <label className="form-label" htmlFor="mobile">
//         <span className="required-star">*</span> Mobile
//         </label>
//         <input type="text" id="mobile" className="form-control" placeholder="Enter Mobile" />
//       </div>

      
              
                
//                 <Link
//                   to="/Verifyotp"
//                   className="dz-btn btn btn-thin btn-lg btn-primary rounded-xl"
//                 >
//                   Sign In
//                 </Link>
//               </form>
              
        
//             </div>
//             <div className="text-center mt-auto">
//               Not a member?{" "}
//               <Link to="/Signupscreen" className="text-underline font-w500">
//                 Create an account
//               </Link>
            
//             </div>
            
//           </div>
         
//         </div>
       
//       </main>
     
//       <CompanyVersion/>
//     </div>
    
//   );
// };

// export default Signinscreen;



import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Logoname from "../constants/Logoname";
import CompanyVersion from "../constants/CompanyVersion";
// import authenticationPic1 from "../assets/images/authentication/pic1.png";
import authenticationPic1 from "../assets/Splashscreen.jpg";
import welcomeback from "../assets/images/authentication/wave.svg";

const Signinscreen = () => {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use useNavigate hook for navigation

  const handleSignIn = async () => {
    try {
      const url = "http://194.195.116.199/user_api/account_login";
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

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Sign in response:", data);

      if (data.st === 1) {
        // Redirect to OTP verification screen if st is 1
        navigate("/Verifyotp");
      } else {
        // Display error message if st is not 1
        setError("Sign in failed. Please try again.");
      }

      // Reset mobile number after sign in attempt
      setMobile("");
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Sign in failed. Please try again.");
    }
  };

  return (
    <div className="page-wrapper full-height">
      <main className="page-content">
        <div className="container pt-0 overflow-hidden">
          <div className="dz-authentication-area dz-flex-box">
            <div className="dz-media">
              <img src={authenticationPic1} alt="" style={{height:'250px'}}/>
            </div>
            <div className="account-section">
              <div className="section-head">
                <Logoname />
                <h2 className="title">
                  Welcome Back <img src={welcomeback} alt="wave" /> You've Been
                  Missed!
                </h2>
              </div>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="m-b15">
                  <label className="form-label" htmlFor="mobile">
                    <span className="required-star">*</span> Mobile
                  </label>
                  <input
                    type="text"
                    id="mobile"
                    className="form-control"
                    placeholder="Enter Mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
                {error && <p className="text-danger">{error}</p>}
                <button
                  type="button"
                  className="dz-btn btn btn-thin btn-lg btn-primary rounded-xl"
                  onClick={handleSignIn}
                >
                  Sign In
                </button>
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
      <CompanyVersion />
    </div>
  );
};

export default Signinscreen;
