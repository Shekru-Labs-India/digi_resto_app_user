import React from 'react';
import { Link } from 'react-router-dom';
import pic5 from '../assets/images/authentication/pic5.png';
function Changepassword() {
    return (
        <div>
            
                <div className="page-wrapper full-height">
                    {/* Preloader */}
                    
                    {/* Preloader end*/}

                    {/* Main Content Start */}
                    <main className="page-content">
                        <div className="container pt-0 overflow-hidden">
                            <div className="dz-authentication-area dz-flex-box">
                                <div className="dz-media">
                                    <img src={pic5} alt="" />
                                </div>
                                <div className="account-section">
                                    <div className="section-head">
                                        <h2 className="title">Enter New Password</h2>
                                        <p>Your new password must be different from previously used password.</p>
                                    </div>
                                    <form>
                                        <div className="m-b15">
                                            <label className="form-label" htmlFor="dz-password">Password<span className="required-star">*</span></label>
                                            <div className="input-group input-group-icon">
                                                <input type="password" id="dz-password" className="form-control dz-password" />
                                                <span className="input-group-text show-pass">
                                                    <i className="icon feather icon-eye-off eye-close"></i>
                                                    <i className="icon feather icon-eye eye-open"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="m-b30">
                                            <label className="form-label" htmlFor="dz-password2">Confirm Password<span className="required-star">*</span></label>
                                            <div className="input-group input-group-icon">
                                                <input type="password" id="dz-password" className="form-control dz-password" />
                                                <span className="input-group-text show-pass">
                                                    <i className="icon feather icon-eye-off eye-close"></i>
                                                    <i className="icon feather icon-eye eye-open"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <Link to="/Signinscreen" className="dz-btn btn btn-thin btn-lg btn-primary rounded-xl">Continue</Link>
                                    </form>
                                </div>
                                <div className="text-center mt-auto">Back To <Link to="/Signinscreen" className="text-underline font-w500">Sign In</Link></div>
                            </div>
                        </div>
                    </main>
                    {/* Main Content End */}
                </div>
                
        
        </div>
    );
}

export default Changepassword;
