// import React from 'react';
// import { Link } from 'react-router-dom';
// import pic4 from '../assets/images/authentication/pic4.png';
// import Logoname from '../constants/Logoname';
// import CompanyVersion from '../constants/CompanyVersion';
// const Verifyotp = () => {
//     return (
//         <div className="page-wrapper full-height">
//             {/* Preloader */}
            
            
//             {/* Preloader end */}

//             {/* Main Content Start */}
//             <main className="page-content">
//                 <div className="container pt-0 overflow-hidden">
//                     <div className="dz-authentication-area dz-flex-box">
//                         <div className="dz-media">
//                             <img src={pic4} alt="" />
//                         </div>
//                         <div className="account-section">
//                             <div className="section-head">
//                                 <Logoname/>
//                                 <h2 className="title">Enter (OTP)</h2>
//                                 <p>An Authentication Code Has Sent To <span className="text-lowercase text-primary">957907840</span></p>
//                             </div>
//                             <form action="https://plantzone.dexignzone.com/mobile/xhtml/submit">
//                                 <label className="form-label " htmlFor="otp"><span className="required-star">*</span>OTP</label>
//                                 <div id="otp" className="digit-group">
//                                     <input className="form-control" type="text" id="digit-2" name="digit-2" placeholder="" data-next="digit-3" data-previous="digit-1" />
//                                     <input className="form-control" type="text" id="digit-3" name="digit-3" placeholder="" data-next="digit-4" data-previous="digit-2" />
//                                     <input className="form-control" type="text" id="digit-4" name="digit-4" placeholder="" data-next="digit-5" data-previous="digit-3" />
//                                     <input className="form-control" type="text" id="digit-5" name="digit-5" placeholder="" data-next="digit-6" data-previous="digit-4" />
//                                 </div>                
//                                 <p className="m-b30">If you don’t receive code! <a href="#" className="text-underline text-danger font-w500">Resend</a></p>
//                                 <Link to="/HomeScreen" className="dz-btn btn btn-thin btn-lg btn-primary rounded-xl">Verify and proceed</Link>
//                             </form>
//                         </div>
//                         <div className="text-center mt-auto">Back To <Link to="/Signinscreen" className="text-underline font-w500">Sign In</Link></div>
//                     </div>
//                 </div>
//             </main>
//             {/* Main Content End */}
//             <CompanyVersion/>
//         </div>
//     );
// };

// export default Verifyotp;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//import pic4 from '../assets/images/authentication/pic4.png';
import pic4 from '../assets/background.jpg';
import Logoname from '../constants/Logoname';
import CompanyVersion from '../constants/CompanyVersion';

const Verifyotp = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook to navigate to different routes

    const handleVerify = async () => {
        try {
            const mobile = 8965432111; // Use the mobile number you want to send
            const url = 'http://194.195.116.199/user_api/account_verify_otp';
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mobile: mobile,
                    otp: otp
                }),
            };

            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Verification response:', data);

            if (data.st === 1) {
                // Navigate to HomeScreen on successful verification (st = 1)
                navigate('/HomeScreen'); // Redirect to HomeScreen
            } else {
                setError('Wrong OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setError('Verification failed. Please try again.');
        }
    };

    return (
        <div className="page-wrapper full-height">
            <main className="page-content">
                <div className="container pt-0 overflow-hidden">
                    <div className="dz-authentication-area dz-flex-box">
                        <div className="dz-media">
                            <img src={pic4} alt="" style={{height:'250px'}}/>
                        </div>
                        <div className="account-section">
                            <div className="section-head">
                                <Logoname />
                                <h2 className="title">Enter OTP</h2>
                                <p>An Authentication Code Has Sent <span className="text-lowercase text-primary"></span></p>
                            </div>
                            <form onSubmit={(e) => e.preventDefault()}>
                                <label className="form-label" htmlFor="otp"><span className="required-star">*</span>OTP</label>
                                <div id="otp" className="digit-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="digit-1"
                                        name="digit-1"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter Otp"
                                    />
                                </div>
                                {error && <p className="text-danger">{error}</p>}
                                {/* <p className="m-b30">If you don’t receive code! <a href="#" className="text-underline text-danger font-w500">Resend</a></p> */}
                                <button className="dz-btn btn btn-thin btn-lg btn-primary rounded-xl" onClick={handleVerify}>Verify and proceed</button>
                            </form>
                        </div>
                        <div className="text-center mt-auto">Back To <Link to="/Signinscreen" className="text-underline font-w500">Sign In</Link></div>
                    </div>
                </div>
            </main>
            <CompanyVersion />
        </div>
    );
};

export default Verifyotp;
