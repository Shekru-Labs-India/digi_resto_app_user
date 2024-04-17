import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
const SigninButton = () => {
    const navigate = useNavigate();
    const handleSignInClick = () => {
        // Navigate to sign-in screen when "Sign In" button is clicked
        navigate('/Signinscreen');
      };
  return (
    
       <div className="text-center mt-5">
              {/* <p>Please sign in to view your orders.</p> */}
              <button className="btn btn-primary" onClick={handleSignInClick}>
                Sign In
              </button>
            </div>
   
  )
}

export default SigninButton
