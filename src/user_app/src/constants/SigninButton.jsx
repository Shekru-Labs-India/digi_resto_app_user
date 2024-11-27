import React from 'react';
import { Link } from 'react-router-dom';

const SigninButton = () => {
  return (
    <div className="container overflow-hidden d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
      <div className="m-b20 dz-flex-box text-center">
        <div className="dz-cart-about">
          <Link className="btn btn-outline-primary mt-3 rounded-pill" to="/Signinscreen">
            <i className="fa-solid fa-lock me-2 fs-3"></i> Login
          </Link>
          <span className="mt-4">Access fresh flavors with a quick login.</span>
        </div>
      </div>
    </div>
  );
}

export default SigninButton;
