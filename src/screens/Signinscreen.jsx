// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Logoname from "../constants/Logoname";
// import CompanyVersion from "../constants/CompanyVersion";
// import authenticationPic1 from "../assets/background.jpg";
// import welcomeback from "../assets/images/authentication/wave.svg";

// const Signinscreen = () => {
//   const [mobile, setMobile] = useState("");
//   const [isMobileValid, setIsMobileValid] = useState(false);
//   const [mobileError, setMobileError] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSignIn = async () => {
//     if (!isMobileValid) {
//       setError("Mobile number must be 10 digits");
//       return;
//     }
//     setLoading(true); // Set loading to true before API call
//     setError(null); // Clear previous errors

//     try {
//       const url = "https://menumitra.com/user_api/account_login";
//       const requestOptions = {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           mobile: mobile,
//         }),
//       };

//       const response = await fetch(url, requestOptions);
//       const data = await response.json();

//       console.log("API response:", data); // Log the API response here

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       // Check if the API response status (`st`) is 1 for success
//       if (data.st === 1) {
//         console.log("Sign-in success response:", data);

//         // Extract the OTP from the msg field
//         const otp = data.msg.match(/\d+/)[0]; // Extracts the first number (OTP) from the msg string

//         // Store the mobile number and OTP in local storage
//         localStorage.setItem("mobile", mobile); // Store mobile number
//         localStorage.setItem("otp", otp); // Store OTP

//         // Navigate to Verifyotp component
//         navigate("/Verifyotp");

//         // Optionally clear the form
//         setMobile(""); 
//       } else {
//         setError(data.msg || "Sign in failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error signing in:", error);
//       setError("Sign in failed. Please try again.");
//     } finally {
//       setLoading(false); // Set loading to false after API call
//     }
//   };

//   const handleMobileChange = (e) => {
//     let value = e.target.value.replace(/\D/g, "").slice(0, 10);
//     setMobile(value);
//     if (value.length < 10) {
//       setMobileError("Mobile number must be 10 digits");
//       setIsMobileValid(false);
//     } else {
//       setMobileError("");
//       setIsMobileValid(checkMobileValidity(value));
//     }
//   };

//   const checkMobileValidity = (value) => {
//     return /^\d{10}$/.test(value); // Ensure that the mobile number is exactly 10 digits
//   };

//   return (
//     <div className="page-wrapper full-height">
//       <main className="page-content">
//         <div className="container pt-0 overflow-hidden">
//           <div className="dz-authentication-area dz-flex-box">
//             <div className="dz-media">
//               <img
//                 src={authenticationPic1}
//                 alt="Auth Background"
//                 style={{ height: "250px" }}
//               />
//             </div>
//             <div className="account-section">
//               <div className="section-head">
//                 <Logoname />
//                 <h2 className="title">
//                   Welcome Back <img src={welcomeback} alt="wave" /> You've Been
//                   Missed!
//                 </h2>
//               </div>
//               <form onSubmit={(e) => e.preventDefault()}>
//                 <div className="m-b15">
//                   <label className="form-label" htmlFor="mobile">
//                     <span className="required-star">*</span> Mobile
//                   </label>
//                   <input
//                     type="text"
//                     id="mobile"
//                     className={`form-control ${mobileError ? "is-invalid" : ""}`}
//                     placeholder="Enter Mobile"
//                     value={mobile}
//                     onChange={handleMobileChange}
//                   />
//                   {mobileError && (
//                     <div className="invalid-feedback">{mobileError}</div>
//                   )}
//                 </div>
//                 {error && <p className="text-danger">{error}</p>}
//                 {loading ? (
//                   <div id="preloader">
//                     <div className="loader">
//                       <div className="spinner-border text-primary" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <button
//                     type="button"
//                     className="dz-btn btn btn-thin btn-lg btn-primary rounded-xl"
//                     onClick={handleSignIn}
//                     disabled={!isMobileValid}
//                   >
//                     Sign In
//                   </button>
//                 )}
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
//       <CompanyVersion />
//     </div>
//   );
// };

// export default Signinscreen;






















// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Logoname from "../constants/Logoname";
// import CompanyVersion from "../constants/CompanyVersion";
// import authenticationPic1 from "../assets/background.jpg";
// import welcomeback from "../assets/images/authentication/wave.svg";

// const Signinscreen = () => {
//   const [mobile, setMobile] = useState("");
//   const [isMobileValid, setIsMobileValid] = useState(false);
//   const [mobileError, setMobileError] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//  const handleSignIn = async () => {
//    if (!isMobileValid) {
//      setError("Mobile number must be 10 digits");
//      return;
//    }
//    setLoading(true); // Set loading to true before API call
//    setError(null); // Clear previous errors

//    try {
//      const url = "https://menumitra.com/user_api/account_login";
//      const requestOptions = {
//        method: "POST",
//        headers: {
//          "Content-Type": "application/json",
//        },
//        body: JSON.stringify({
//          mobile: mobile,
//        }),
//      };

//      const response = await fetch(url, requestOptions);
//      const data = await response.json();

//      console.log("API response:", data); // Log the API response here

//      if (!response.ok) {
//        throw new Error(`HTTP error! Status: ${response.status}`);
//      }

//      // Check if the API response status (`st`) is 1 for success
//      if (data.st === 1) {
//        console.log("Sign-in success response:", data);

//        // Extract the OTP from the msg field
//        const otp = data.msg.match(/\d+/)[0]; // Extracts the first number (OTP) from the msg string

//        // Store the mobile number, OTP, and customer_id in local storage
//        localStorage.setItem("mobile", mobile); // Store mobile number
//        localStorage.setItem("otp", otp); // Store OTP

//        // Check if customer_details is available and store customer_id
//        if (data.customer_details && data.customer_details.customer_id) {
//          localStorage.setItem("customer_id", data.customer_details.customer_id); // Store customer_id
//        }

//        // Navigate to Verifyotp component
//        navigate("/Verifyotp");

//        // Optionally clear the form
//        setMobile("");
//      } else {
//        setError(data.msg || "Sign in failed. Please try again.");
//      }
//    } catch (error) {
//      console.error("Error signing in:", error);
//      setError("Sign in failed. Please try again.");
//    } finally {
//      setLoading(false); // Set loading to false after API call
//    }
//  };


//   const handleMobileChange = (e) => {
//     let value = e.target.value.replace(/\D/g, "").slice(0, 10);
//     setMobile(value);
//     if (value.length < 10) {
//       setMobileError("Mobile number must be 10 digits");
//       setIsMobileValid(false);
//     } else {
//       setMobileError("");
//       setIsMobileValid(checkMobileValidity(value));
//     }
//   };

//   const checkMobileValidity = (value) => {
//     return /^\d{10}$/.test(value); // Ensure that the mobile number is exactly 10 digits
//   };

//   return (
//     <div className="page-wrapper full-height">
//       <main className="page-content">
//         <div className="container pt-0 overflow-hidden">
//           <div className="dz-authentication-area dz-flex-box">
//             <div className="dz-media">
//               <img
//                 src={authenticationPic1}
//                 alt="Auth Background"
//                 style={{ height: "250px" }}
//               />
//             </div>
//             <div className="account-section">
//               <div className="section-head">
//                 <Logoname />
//                 <h2 className="title">
//                   Welcome Back <img src={welcomeback} alt="wave" /> You've Been
//                   Missed!
//                 </h2>
//               </div>
//               <form onSubmit={(e) => e.preventDefault()}>
//                 <div className="m-b15">
//                   <label className="form-label" htmlFor="mobile">
//                     <span className="required-star">*</span> Mobile
//                   </label>
//                   <input
//                     type="text"
//                     id="mobile"
//                     className={`form-control ${
//                       mobileError ? "is-invalid" : ""
//                     }`}
//                     placeholder="Enter Mobile"
//                     value={mobile}
//                     onChange={handleMobileChange}
//                   />
//                   {mobileError && (
//                     <div className="invalid-feedback">{mobileError}</div>
//                   )}
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
//                     type="button"
//                     className="dz-btn btn btn-thin btn-lg btn-primary rounded-xl"
//                     onClick={handleSignIn}
//                     disabled={!isMobileValid}
//                   >
//                     Sign In
//                   </button>
//                 )}
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
//       <CompanyVersion />
//     </div>
//   );
// };

// export default Signinscreen;















// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Logoname from "../constants/Logoname";
// import CompanyVersion from "../constants/CompanyVersion";
// import authenticationPic1 from "../assets/background.jpg";
// import welcomeback from "../assets/images/authentication/wave.svg";

// const Signinscreen = () => {
//   const [mobile, setMobile] = useState("");
//   const [isMobileValid, setIsMobileValid] = useState(false);
//   const [mobileError, setMobileError] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSignIn = async () => {
//     if (!isMobileValid) {
//       setError("Mobile number must be 10 digits");
//       return;
//     }
//     setLoading(true); // Set loading to true before API call
//     setError(null); // Clear previous errors

//     try {
//       const url = "https://menumitra.com/user_api/account_login";
//       const requestOptions = {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           mobile: mobile,
//         }),
//       };

//       const response = await fetch(url, requestOptions);
//       const data = await response.json();

//       console.log("API response:", data); // Log the API response here

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       // Check if the API response status (`st`) is 1 for success
//       if (data.st === 1) {
//         console.log("Sign-in success response:", data);

//         // Extract the OTP from the msg field
//         const otp = data.msg.match(/\d+/)[0]; // Extracts the first number (OTP) from the msg string

//         // Store mobile number and OTP in local storage
//         localStorage.setItem("mobile", mobile);
//         localStorage.setItem("otp", otp);

//         // Check if customer_details is available and store user data in local storage
//         if (data.customer_details) {
//           localStorage.setItem(
//             "userData",
//             JSON.stringify({
//               customer_id: data.customer_details.customer_id,
//               name: data.customer_details.name,
//               dob: data.customer_details.dob,
//             })
//           );
//         }

//         // Assuming that menu items are also part of the API response (if available)
//         if (data.menuItems) {
//           localStorage.setItem("menuItems", JSON.stringify(data.menuItems));
//         }

//         // Navigate to Verifyotp component
//         navigate("/Verifyotp");

//         // Optionally clear the form
//         setMobile("");
//       } else {
//         setError(data.msg || "Sign in failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error signing in:", error);
//       setError("Sign in failed. Please try again.");
//     } finally {
//       setLoading(false); // Set loading to false after API call
//     }
//   };

//   const handleMobileChange = (e) => {
//     let value = e.target.value.replace(/\D/g, "").slice(0, 10);
//     setMobile(value);
//     if (value.length < 10) {
//       setMobileError("Mobile number must be 10 digits");
//       setIsMobileValid(false);
//     } else {
//       setMobileError("");
//       setIsMobileValid(checkMobileValidity(value));
//     }
//   };

//   const checkMobileValidity = (value) => {
//     return /^\d{10}$/.test(value); // Ensure that the mobile number is exactly 10 digits
//   };

//   return (
//     <div className="page-wrapper full-height">
//       <main className="page-content">
//         <div className="container pt-0 overflow-hidden">
//           <div className="dz-authentication-area dz-flex-box">
//             <div className="dz-media">
//               <img
//                 src={authenticationPic1}
//                 alt="Auth Background"
//                 style={{ height: "250px" }}
//               />
//             </div>
//             <div className="account-section">
//               <div className="section-head">
//                 <Logoname />
//                 <h2 className="title">
//                   Welcome Back <img src={welcomeback} alt="wave" /> You've Been
//                   Missed!
//                 </h2>
//               </div>
//               <form onSubmit={(e) => e.preventDefault()}>
//                 <div className="m-b15">
//                   <label className="form-label" htmlFor="mobile">
//                     <span className="required-star">*</span> Mobile
//                   </label>
//                   <input
//                     type="text"
//                     id="mobile"
//                     className={`form-control ${
//                       mobileError ? "is-invalid" : ""
//                     }`}
//                     placeholder="Enter Mobile"
//                     value={mobile}
//                     onChange={handleMobileChange}
//                   />
//                   {mobileError && (
//                     <div className="invalid-feedback">{mobileError}</div>
//                   )}
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
//                     type="button"
//                     className="dz-btn btn btn-thin btn-lg btn-primary rounded-xl"
//                     onClick={handleSignIn}
//                     disabled={!isMobileValid}
//                   >
//                     Sign In
//                   </button>
//                 )}
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
//       <CompanyVersion />
//     </div>
//   );
// };

// export default Signinscreen;


















// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Logoname from "../constants/Logoname";
// import CompanyVersion from "../constants/CompanyVersion";
// import authenticationPic1 from "../assets/background.jpg";
// import welcomeback from "../assets/images/authentication/wave.svg";

// const Signinscreen = () => {
//   const [mobile, setMobile] = useState("");
//   const [isMobileValid, setIsMobileValid] = useState(false);
//   const [mobileError, setMobileError] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSignIn = async () => {
//     if (!isMobileValid) {
//       setError("Mobile number must be 10 digits");
//       return;
//     }
//     setLoading(true); // Set loading to true before API call
//     setError(null); // Clear previous errors

//     try {
//       const url = "https://menumitra.com/user_api/account_login";
//       const requestOptions = {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ mobile }),
//       };

//       const response = await fetch(url, requestOptions);
//       const data = await response.json();

//       console.log("API response:", data); // Log the API response here

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       // Check if the API response status (`st`) is 1 for success
//       if (data.st === 1) {
//         console.log("Sign-in success response:", data);

//         // Extract the OTP from the msg field
//         const otp = data.msg.match(/\d+/)[0]; // Extracts the first number (OTP) from the msg string

//         // Store mobile number and OTP in local storage
//         localStorage.setItem("mobile", mobile);
//         localStorage.setItem("otp", otp);

//         // Check if customer_details is available and store user data in local storage
//         if (data.customer_details) {
//           localStorage.setItem(
//             "userData",
//             JSON.stringify({
//               customer_id: data.customer_details.customer_id,
//               name: data.customer_details.name,
//               dob: data.customer_details.dob,
//             })
//           );

//           // Store restaurant ID in local storage if available
//           const restaurantId = data.customer_details.restaurant_id;
//           if (restaurantId) {
//             localStorage.setItem("restaurantId", restaurantId);
//             console.log("Restaurant ID stored:", restaurantId); // Log the restaurant ID
//           } else {
//             console.error("Restaurant ID is missing in the response.");
//           }
//         } else {
//           console.error("Customer details are missing in the response.");
//         }

//         // Assuming that menu items are also part of the API response (if available)
//         if (data.menuItems) {
//           localStorage.setItem("menuItems", JSON.stringify(data.menuItems));
//         }

//         // Navigate to Verifyotp component
//         navigate("/Verifyotp");

//         // Optionally clear the form
//         setMobile("");
//       } else {
//         setError(data.msg || "Sign in failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error signing in:", error);
//       setError("Sign in failed. Please try again.");
//     } finally {
//       setLoading(false); // Set loading to false after API call
//     }
//   };

//   const handleMobileChange = (e) => {
//     let value = e.target.value.replace(/\D/g, "").slice(0, 10);
//     setMobile(value);
//     if (value.length < 10) {
//       setMobileError("Mobile number must be 10 digits");
//       setIsMobileValid(false);
//     } else {
//       setMobileError("");
//       setIsMobileValid(checkMobileValidity(value));
//     }
//   };

//   const checkMobileValidity = (value) => {
//     return /^\d{10}$/.test(value); // Ensure that the mobile number is exactly 10 digits
//   };

//   return (
//     <div className="page-wrapper full-height">
//       <main className="page-content">
//         <div className="container pt-0 overflow-hidden">
//           <div className="dz-authentication-area dz-flex-box">
//             <div className="dz-media">
//               <img
//                 src={authenticationPic1}
//                 alt="Auth Background"
//                 style={{ height: "250px" }}
//               />
//             </div>
//             <div className="account-section">
//               <div className="section-head">
//                 <Logoname />
//                 <h2 className="title">
//                   Welcome Back <img src={welcomeback} alt="wave" /> You've Been
//                   Missed!
//                 </h2>
//               </div>
//               <form onSubmit={(e) => e.preventDefault()}>
//                 <div className="m-b15">
//                   <label className="form-label" htmlFor="mobile">
//                     <span className="required-star">*</span> Mobile
//                   </label>
//                   <input
//                     type="text"
//                     id="mobile"
//                     className={`form-control ${
//                       mobileError ? "is-invalid" : ""
//                     }`}
//                     placeholder="Enter Mobile"
//                     value={mobile}
//                     onChange={handleMobileChange}
//                   />
//                   {mobileError && (
//                     <div className="invalid-feedback">{mobileError}</div>
//                   )}
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
//                     type="button"
//                     className="dz-btn btn btn-thin btn-lg btn-primary rounded-xl"
//                     onClick={handleSignIn}
//                     disabled={!isMobileValid}
//                   >
//                     Sign In
//                   </button>
//                 )}
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
//       <CompanyVersion />
//     </div>
//   );
// };

// export default Signinscreen;









// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Logoname from "../constants/Logoname";
// import CompanyVersion from "../constants/CompanyVersion";
// import authenticationPic1 from "../assets/background.jpg";
// import welcomeback from "../assets/images/authentication/wave.svg";

// const Signinscreen = () => {
//   const [mobile, setMobile] = useState("");
//   const [isMobileValid, setIsMobileValid] = useState(false);
//   const [mobileError, setMobileError] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSignIn = async () => {
//     if (!isMobileValid) {
//       setError("Please enter a valid mobile number.");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch("https://example.com/api/signin", {
//         // Update with your API URL
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ mobile }),
//       });

//       const data = await response.json();

//       if (data.customer_details) {
//         const customerId = data.customer_details.customer_id;
//         const restaurantId = data.customer_details.restaurant_id;

//         localStorage.setItem(
//           "userData",
//           JSON.stringify({
//             customer_id: customerId,
//             name: data.customer_details.name,
//             dob: data.customer_details.dob,
//           })
//         );

//         if (restaurantId) {
//           localStorage.setItem("restaurantId", restaurantId);
//           console.log("Restaurant ID stored:", restaurantId);
//         } else {
//           console.error("Restaurant ID is missing in the response.");
//         }

//         navigate("/Cart"); // Redirect to Cart or desired page after successful sign-in
//       } else {
//         setError(
//           "Failed to sign in. Please check your mobile number and try again."
//         );
//       }
//     } catch (error) {
//       setError("An error occurred during sign-in. Please try again.");
//       console.error("Sign-in error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMobileChange = (e) => {
//     let value = e.target.value.replace(/\D/g, "").slice(0, 10);
//     setMobile(value);
//     if (value.length < 10) {
//       setMobileError("Mobile number must be 10 digits");
//       setIsMobileValid(false);
//     } else {
//       setMobileError("");
//       setIsMobileValid(checkMobileValidity(value));
//     }
//   };

//   const checkMobileValidity = (value) => {
//     return /^\d{10}$/.test(value);
//   };

//   return (
//     <div className="page-wrapper full-height">
//       <main className="page-content">
//         <div className="container pt-0 overflow-hidden">
//           <div className="dz-authentication-area dz-flex-box">
//             <div className="dz-media">
//               <img
//                 src={authenticationPic1}
//                 alt="Auth Background"
//                 style={{ height: "250px" }}
//               />
//             </div>
//             <div className="account-section">
//               <div className="section-head">
//                 <Logoname />
//                 <h2 className="title">
//                   Welcome Back <img src={welcomeback} alt="wave" /> You've Been
//                   Missed!
//                 </h2>
//               </div>
//               <form onSubmit={(e) => e.preventDefault()}>
//                 <div className="m-b15">
//                   <label className="form-label" htmlFor="mobile">
//                     <span className="required-star">*</span> Mobile
//                   </label>
//                   <input
//                     type="text"
//                     id="mobile"
//                     className={`form-control ${
//                       mobileError ? "is-invalid" : ""
//                     }`}
//                     placeholder="Enter Mobile"
//                     value={mobile}
//                     onChange={handleMobileChange}
//                   />
//                   {mobileError && (
//                     <div className="invalid-feedback">{mobileError}</div>
//                   )}
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
//                     type="button"
//                     className="dz-btn btn btn-thin btn-lg btn-primary rounded-xl"
//                     onClick={handleSignIn}
//                     disabled={!isMobileValid}
//                   >
//                     Sign In
//                   </button>
//                 )}
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
//       <CompanyVersion />
//     </div>
//   );
// };

// export default Signinscreen;





// retrived from gh----->












import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logoname from "../constants/Logoname";
import CompanyVersion from "../constants/CompanyVersion";
import authenticationPic1 from "../assets/background.jpg";
import welcomeback from "../assets/images/authentication/wave.svg";

const Signinscreen = () => {
  const [mobile, setMobile] = useState("");
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (!isMobileValid) {
      setError("Mobile number must be 10 digits");
      return;
    }
    setLoading(true); // Set loading to true before API call
    setError(null); // Clear previous errors

    try {
      const url = "https://menumitra.com/user_api/account_login";
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
      const data = await response.json();

      console.log("API response:", data); // Log the API response here

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Check if the API response status (`st`) is 1 for success
      if (data.st === 1) {
        console.log("Sign-in success response:", data);

        // Extract the OTP from the msg field
        const otp = data.msg.match(/\d+/)[0]; // Extracts the first number (OTP) from the msg string

        // Store the mobile number and OTP in local storage
        localStorage.setItem("mobile", mobile); // Store mobile number
        localStorage.setItem("otp", otp); // Store OTP

        // Navigate to Verifyotp component
        navigate("/Verifyotp");

        // Optionally clear the form
        setMobile("");
      } else {
        setError(data.msg || "Sign in failed. Please try again.");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Sign in failed. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after API call
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
    return /^\d{10}$/.test(value); // Ensure that the mobile number is exactly 10 digits
  };

  return (
    <div className="page-wrapper full-height">
      <main className="page-content">
        <div className="container pt-0 overflow-hidden">
          <div className="dz-authentication-area dz-flex-box">
            <div className="dz-media">
              <img
                src={authenticationPic1}
                alt="Auth Background"
                style={{ height: "250px" }}
              />
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
                    className={`form-control ${
                      mobileError ? "is-invalid" : ""
                    }`}
                    placeholder="Enter Mobile"
                    value={mobile}
                    onChange={handleMobileChange}
                  />
                  {mobileError && (
                    <div className="invalid-feedback">{mobileError}</div>
                  )}
                </div>
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
                    type="button"
                    className="dz-btn btn btn-thin btn-lg btn-primary rounded-xl"
                    onClick={handleSignIn}
                    disabled={!isMobileValid}
                  >
                    Sign In
                  </button>
                )}
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