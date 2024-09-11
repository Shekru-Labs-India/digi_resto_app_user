


// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import pic2 from '../assets/background.jpg';
// import Logoname from '../constants/Logoname';

// const Signupscreen = () => {
//     const navigate = useNavigate();
//     const [name, setName] = useState('');
//     const [nameError, setNameError] = useState('');
//     const [mobile, setMobile] = useState('');
//     const [mobileError, setMobileError] = useState('');
//     const [dob, setDob] = useState('');
//     const [dobError, setDobError] = useState('');
//     const [agreed, setAgreed] = useState(false); // Checkbox state
//     const [error, setError] = useState('');

//     // Function to check if all required fields are filled and checkbox is ticked
//     // const isFormValid = () => {
//     //     return name.trim() !== '' && mobile.trim() !== '' && dob.trim() !== '' && agreed;
//     // };

//     // Effect to handle form validity when the checkbox state changes
//     useEffect(() => {
//         const valid = isFormValid();
//         const button = document.getElementById('signupButton');
//         if (button) button.disabled = !valid;
//     }, [name, mobile, dob, agreed]);

//     const handleSignUp = async (e) => {
//         e.preventDefault();

//         try {
//             const url = 'https://menumitra.com/user_api/account_signup';
//             const requestOptions = {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     name: name,
//                     dob: dob,
//                     mobile: mobile,
//                 }),
//             };

//             const response = await fetch(url, requestOptions);

//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }

//             const data = await response.json();

//             if (data.st === 1) {
//                 const customerId = generateCustomerId(); // Generate a unique customerId (e.g., using a random number)
//                 const userData = { name, mobile, dob, customerId };

//                 // Store user data in local storage
//                 localStorage.setItem('userData', JSON.stringify(userData));
//                 navigate('/Verifyotp');
//             } else {
//                 setError('Sign up failed. Please try again.');
//             }

//             // Clear form fields upon successful signup attempt
//             setName('');
//             setMobile('');
//             setDob('');
//         } catch (error) {
//             console.error('Error signing up:', error);
//             setError('Sign up failed. Please try again.');
//         }
//     };

//     const generateCustomerId = () => {
//         return Math.floor(Math.random() * 1000000); // Generate a random 6-digit number
//     };

//     // Function to handle name input (accepts only characters)
//     const handleNameChange = (e) => {
//         const value = e.target.value.replace(/[^A-Za-z ]/gi, ''); // Allow only letters and spaces
//         setName(value);
//         if (value.trim() === '') {
//             setNameError('Name is required');
//         } else {
//             setNameError('');
//         }
//     };

//     // Function to handle mobile input (accepts only 10-digit numbers)
//     const handleMobileChange = (e) => {
//         const value = e.target.value.replace(/\D/g, '').slice(0, 10); // Allow only digits and limit to 10
//         setMobile(value);
//         if (value.trim() === '') {
//             setMobileError('Mobile is required');
//         } else if (value.length === 10) {
//             setMobileError('');
//         } else {
//             setMobileError('Mobile number must be exactly 10 digits');
//         }
//     };
//     const isFormValid = () => {
//         return name.trim() !== '' && mobile.trim() !== '' && dob.trim() !== '' && agreed && mobileError === '';
//     };
        

//     // Function to handle date of birth input
//     const handleDobChange = (e) => {
//         const value = e.target.value;
//         setDob(value);
//         if (value.trim() === '') {
//             setDobError('Date of Birth is required');
//         } else {
//             setDobError('');
//         }
//     };

//     return (
//         <div className="page-wrapper full-height">
//             <main className="page-content">
//                 <div className="container pt-0 overflow-hidden">
//                     <div className="dz-authentication-area dz-flex-box">
//                         <div className="dz-media">
//                             <img src={pic2} alt="" />
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
//                                         className={`form-control ${nameError ? 'is-invalid' : ''}`}
//                                         placeholder="Enter Name"
//                                         value={name}
//                                         onChange={handleNameChange}
//                                     />
//                                     {nameError && <div className="invalid-feedback">{nameError}</div>}
//                                 </div>
//                                 <div className="m-b15">
//                                     <label className="form-label" htmlFor="mobile">
//                                         <span className="required-star">*</span> Mobile
//                                     </label>
//                                     <input
//                                         type="tel"
//                                         id="mobile"
//                                         className={`form-control ${mobileError ? 'is-invalid' : ''}`}
//                                         placeholder="Enter Mobile"
//                                         value={mobile}
//                                         onChange={handleMobileChange}
//                                     />
//                                     {mobileError && <div className="invalid-feedback">{mobileError}</div>}
//                                 </div>
//                                 <div className="m-b15">
//                                     <label className="form-label" htmlFor="dob">
//                                         <span className="required-star">*</span> Date of Birth
//                                     </label>
//                                     <input
//                                         type="date"
//                                         id="dob"
//                                         className={`form-control ${dobError ? 'is-invalid' : ''}`}
//                                         value={dob}
//                                         onChange={handleDobChange}
//                                     />
//                                     {dobError && <div className="invalid-feedback">{dobError}</div>}
//                                     {/* <DatePicker
//                                         id="dob"
//                                         className="form-control"
//                                         selected={dob}
//                                         onChange={(date) => setDob(date)} // Set the selected date to the state
//                                         showYearDropdown
//                                         scrollableYearDropdown
//                                         yearDropdownItemNumber={100}
//                                         maxDate={new Date()} // Max date is today's date
//                                         dateFormat="dd/MM/yyyy"
//                                     /> */}
//                                 </div>
//                                 <div className="form-check m-b25">
//                                     <input
//                                         className="form-check-input"
//                                         type="checkbox"
//                                         value={agreed}
//                                         id="Checked-1"
//                                         onChange={(e) => setAgreed(e.target.checked)}
//                                     />
//                                     <label className="form-check-label" htmlFor="Checked-1">
//                                         I agree to all Terms, Privacy, and Fees
//                                     </label>
//                                 </div>
//                                 {error && <p className="text-danger">{error}</p>}
//                                 <button
//                                     id="signupButton"
//                                     type="submit"
//                                     className={`dz-btn btn btn-thin btn-lg btn-primary rounded-xl ${
//                                         !isFormValid() ? 'disabled' : ''
//                                     }`}
//                                     disabled={!isFormValid()} // Disable button if form is not valid
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
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [mobile, setMobile] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [dob, setDob] = useState('');
    const [dobError, setDobError] = useState('');
    const [agreed, setAgreed] = useState(false); // Checkbox state
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state

    useEffect(() => {
        const valid = isFormValid();
        const button = document.getElementById('signupButton');
        if (button) button.disabled = !valid;
    }, [name, mobile, dob, agreed, mobileError]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true before API call

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
                const customerId = generateCustomerId(); // Generate a unique customerId (e.g., using a random number)
                const userData = { name, mobile, dob, customerId };

                // Store user data in local storage
                localStorage.setItem('userData', JSON.stringify(userData));
                navigate('/Verifyotp');
            } else {
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
        setLoading(false); // Set loading to false after API call
    };

    const generateCustomerId = () => {
        return Math.floor(Math.random() * 1000000); // Generate a random 6-digit number
    };

    const handleNameChange = (e) => {
        const value = e.target.value.replace(/[^A-Za-z ]/gi, ''); // Allow only letters and spaces
        setName(value);
        if (value.trim() === '') {
            setNameError('Name is required');
        } else {
            setNameError('');
        }
    };

    const handleMobileChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10); // Allow only digits and limit to 10
        setMobile(value);
        if (value.trim() === '') {
            setMobileError('Mobile is required');
        } else if (value.length === 10) {
            setMobileError('');
        } else {
            setMobileError('Mobile number must be exactly 10 digits');
        }
    };

    const isFormValid = () => {
        return name.trim() !== '' && mobile.trim() !== '' && dob.trim() !== '' && agreed && mobileError === '';
    };

    const handleDobChange = (e) => {
        const value = e.target.value;
        setDob(value);
        if (value.trim() === '') {
            setDobError('Date of Birth is required');
        } else {
            setDobError('');
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
                                        className={`form-control ${nameError ? 'is-invalid' : ''}`}
                                        placeholder="Enter Name"
                                        value={name}
                                        onChange={handleNameChange}
                                    />
                                    {nameError && <div className="invalid-feedback">{nameError}</div>}
                                </div>
                                <div className="m-b15">
                                    <label className="form-label" htmlFor="mobile">
                                        <span className="required-star">*</span> Mobile
                                    </label>
                                    <input
                                        type="tel"
                                        id="mobile"
                                        className={`form-control ${mobileError ? 'is-invalid' : ''}`}
                                        placeholder="Enter Mobile"
                                        value={mobile}
                                        onChange={handleMobileChange}
                                    />
                                    {mobileError && <div className="invalid-feedback">{mobileError}</div>}
                                </div>
                                <div className="m-b15">
                                    <label className="form-label" htmlFor="dob">
                                        <span className="required-star">*</span> Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        id="dob"
                                        className={`form-control ${dobError ? 'is-invalid' : ''}`}
                                        value={dob}
                                        onChange={handleDobChange}
                                    />
                                    {dobError && <div className="invalid-feedback">{dobError}</div>}
                                    {/* <DatePicker
                                        id="dob"
                                        className="form-control"
                                        selected={dob}
                                        onChange={(date) => setDob(date)} // Set the selected date to the state
                                        showYearDropdown
                                        scrollableYearDropdown
                                        yearDropdownItemNumber={100}
                                        maxDate={new Date()} // Max date is today's date
                                        dateFormat="dd/MM/yyyy"
                                    /> */}
                                </div>
                                <div className="form-check m-b25">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={agreed}
                                        id="Checked-1"
                                        onChange={(e) => setAgreed(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="Checked-1">
                                        I agree to all Terms, Privacy, and Fees
                                    </label>
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
                                        id="signupButton"
                                        type="submit"
                                        className={`dz-btn btn btn-thin btn-lg btn-primary rounded-xl ${
                                            !isFormValid() ? 'disabled' : ''
                                        }`}
                                        disabled={!isFormValid()} // Disable button if form is not valid
                                    >
                                        Create Account
                                    </button>
                                )}
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
