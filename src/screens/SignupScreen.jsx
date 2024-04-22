// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import pic2 from '../assets/background.jpg';
// import Logoname from '../constants/Logoname';

// const Signupscreen = () => {
//     const navigate = useNavigate(); // Use useNavigate hook for navigation
//     const [name, setName] = useState('');
//     const [mobile, setMobile] = useState('');
//     const [dob, setDob] = useState(null); // State for Date of Birth
//     const [agreeTerms, setAgreeTerms] = useState(false); // State for Terms agreement
//     const [error, setError] = useState('');
//     const [formComplete, setFormComplete] = useState(false); // State to track form completion

//     // Effect to update form completion status
//     useEffect(() => {
//         setFormComplete(name.trim() !== '' && mobile.trim() !== '' && dob !== null && agreeTerms);
//     }, [name, mobile, dob, agreeTerms]);

//     const handleSignUp = async (e) => {
//         e.preventDefault();

//         if (!formComplete) {
//             setError('Please fill in all required fields and agree to terms.');
//             return;
//         }

//         try {
//             const url = 'http://194.195.116.199/user_api/account_signup';
//             const requestOptions = {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     name: name,
//                     dob: dob, // Include DOB in the request payload
//                     mobile: mobile,
//                 }),
//             };

//             const response = await fetch(url, requestOptions);

//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }

//             const data = await response.json();

//             if (data.st === 1) {
//                 // If signup is successful (st = 1), navigate to OTP verification screen
//                 navigate('/Verifyotp');
//             } else {
//                 // Handle other conditions where signup might not be successful
//                 setError('Sign up failed. Please try again.');
//             }

//             // Clear form fields upon successful signup attempt
//             setName('');
//             setMobile('');
//             setDob(null);
//             setAgreeTerms(false);
//         } catch (error) {
//             console.error('Error signing up:', error);
//             setError('Sign up failed. Please try again.');
//         }
//     };

//     return (
//         <div className="page-wrapper full-height">
//             <main className="page-content">
//                 <div className="container pt-0 overflow-hidden">
//                     <div className="dz-authentication-area dz-flex-box">
//                         <div className="dz-media">
//                             <img src={pic2} alt="" style={{ height: '225px' }} />
//                         </div>
//                         <div className="account-section">
//                             <div className="section-head">
//                                 <Logoname />
//                                 <h2 className="title">Create your account</h2>
//                             </div>
//                             <form onSubmit={handleSignUp}>
//                                 <div className="mb-3">
//                                     <label className="form-label" htmlFor="name">
//                                         <span className="required-star">*</span>Name
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="name"
//                                         className="form-control"
//                                         placeholder="Enter Name"
//                                         value={name}
//                                         onChange={(e) => setName(e.target.value)}
//                                     />
//                                 </div>
//                                 <div className="m-b15">
//                                     <label className="form-label" htmlFor="mobile">
//                                         <span className="required-star">*</span> Mobile
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="mobile"
//                                         className="form-control"
//                                         placeholder="Enter Mobile"
//                                         value={mobile}
//                                         onChange={(e) => setMobile(e.target.value)}
//                                     />
//                                 </div>
//                                 <div className="m-b15">
//                                     <label className="form-label" htmlFor="dob">
//                                         <span className="required-star">*</span> Date of Birth
//                                     </label>
//                                     <br/>
//                                     <DatePicker
//                                         id="dob"
//                                         className="form-control"
//                                         selected={dob}
//                                         onChange={(date) => setDob(date)} // Set the selected date to the state
//                                         showYearDropdown
//                                         scrollableYearDropdown
//                                         yearDropdownItemNumber={100}
//                                         maxDate={new Date()} // Max date is today's date
//                                         dateFormat="dd/MM/yyyy"
//                                     />
//                                 </div>
//                                 <div className="form-check m-b25">
//                                     <input
//                                         className="form-check-input"
//                                         type="checkbox"
//                                         id="Checked-1"
//                                         checked={agreeTerms}
//                                         onChange={(e) => setAgreeTerms(e.target.checked)}
//                                     />
//                                     <label className="form-check-label" htmlFor="Checked-1">
//                                         I agree to all Terms, Privacy, and Fees
//                                     </label>
//                                 </div>
//                                 {error && <p className="text-danger">{error}</p>}
//                                 <button
//                                     type="submit"
//                                     className="dz-btn btn btn-thin btn-lg btn-primary rounded-xl"
//                                     disabled={!formComplete} // Disable button if form is incomplete
//                                 >
//                                     Sign Up
//                                 </button>
//                             </form>
//                         </div>
//                         <div className="text-center mt-auto">
//                             Already have an account?{' '}
//                             <Link to="/Signinscreen" className="text-underline font-w500">
//                                 Sign In
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default Signupscreen;







import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import pic2 from '../assets/background.jpg';
import Logoname from '../constants/Logoname';


const Signupscreen = () => {
    const navigate = useNavigate(); // Use useNavigate hook for navigation
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [dob, setDob] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            const url = 'https://menumitra.com/user_api/account_signup';
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    dob: dob,
                    mobile: mobile,
                }),
            };

            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.st === 1) {
                // If signup is successful (st = 1), save user data to localStorage
                localStorage.setItem('userData', JSON.stringify({ name, mobile, dob }));

                // Navigate to OTP verification screen
                navigate('/Verifyotp');
            } else {
                // Handle other conditions where signup might not be successful
                setError('Sign up failed. Please try again.');
            }

            // Clear form fields upon successful signup attempt
            setName('');
            setMobile('');
            setDob('');
        } catch (error) {
            console.error('Error signing up:', error);
            setError('Sign up failed. Please try again.');
        }
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
                                <h2 className="title">Create your account</h2>
                            </div>
                            <form onSubmit={handleSignUp}>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="name">
                                        <span className="required-star">*</span>Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="form-control"
                                        placeholder="Enter Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
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
                                <div className="m-b15">
                                    <label className="form-label" htmlFor="dob">
                                        <span className="required-star">*</span> Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        id="dob"
                                        className="form-control"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                    />
                                    
                                </div>
                                <div className="form-check m-b25">
                                    <input className="form-check-input" type="checkbox" value="" id="Checked-1" />
                                    <label className="form-check-label" htmlFor="Checked-1">
                                        I agree to all Terms, Privacy, and Fees
                                    </label>
                                </div>
                                {error && <p className="text-danger">{error}</p>}
                                <button type="submit" className="dz-btn btn btn-thin btn-lg btn-primary rounded-xl">
                                    Sign Up
                                </button>
                            </form>
                        </div>
                        <div className="text-center mt-auto">
                            Already have an account?{' '}
                            <Link to="/Signinscreen" className="text-underline font-w500">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Signupscreen;
