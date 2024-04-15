import React from 'react';
import '../assets/css/style.css';
import '../assets/vendor/swiper/swiper-bundle.min.css';
import authenticationPic3 from "../assets/images/authentication/pic3.png";
import { Link } from 'react-router-dom';


const ForgotPassword = () => {
    return (
        <div className="page-wrapper full-height body-bg2">
            

            <main className="page-content">
                <div className="container pt-0 overflow-hidden">
                    <div className="dz-authentication-area dz-flex-box">
                        <div className="dz-media">
                            <img src={authenticationPic3} alt="" />
                        </div>
                        <div className="account-section">
                            <div className="section-head">
                                <h2 className="title">Forgot Password</h2>
                                <p>Enter the email associated with your account and we’ll send and email to reset your password</p>
                            </div>
                            <form>
                                <div className="m-b30">
                                    <label className="form-label " htmlFor="email">Email Address<span className="required-star">*</span></label>
                                    <input type="email" id="email" className="form-control" />
                                </div>
                                <Link to="/Verifyotp" className="dz-btn btn btn-thin btn-lg btn-primary rounded-xl">Send Mail</Link>
                            </form>
                        </div>
                        <div className="text-center mt-auto">Back To <Link to="/Signinscreen" className="text-underline font-w500">Sign In</Link></div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ForgotPassword;
