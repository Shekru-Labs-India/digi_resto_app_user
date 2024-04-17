import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CompanyVersion from '../constants/CompanyVersion';
import Logoname from '../constants/Logoname';

const WelcomeScreen = () => {
     // Word you want to display
    const navigate = useNavigate();

    useEffect(() => {
        const delay = 3000; // Delay in milliseconds before navigating to Signinscreen

        // Set timeout to navigate to Signinscreen after the specified delay
        const timeout = setTimeout(() => {
            // Navigate to Signinscreen
            navigate('/Signinscreen');
        }, delay);

        return () => clearTimeout(timeout); // Clean up the timeout on component unmount
    }, [navigate]); // Include navigate in the dependency array to prevent stale closures

    return (
        <div className="page-wrapper">
            <div className="loader-screen" id="splashscreen">
                <div style={{marginTop:'100px'}}>
                    {/* Render the logo or other content */}
                    <Logoname></Logoname>
                   
                </div>
                {/* Display company version component */}
                
                <CompanyVersion />
            </div>
        </div>
    );
};

export default WelcomeScreen;

