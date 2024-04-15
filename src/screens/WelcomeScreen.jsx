import React, { useState, useEffect } from 'react';
import logo from '../assets/Splashscreen.jpg';
import { Link } from 'react-router-dom';
import Logoname from '../constants/Logoname';
import CompanyVersion from '../constants/CompanyVersion';

const WelcomeScreen = () => {
    const [word, setWord] = useState('Restaurant'); // Word you want to display
    const [shouldNavigate, setShouldNavigate] = useState(false);

    useEffect(() => {
        const delay = 3000; // Delay in milliseconds before navigating to Signinscreen

        // Set shouldNavigate to true after the specified delay
        const timeout = setTimeout(() => {
            setShouldNavigate(true);
        }, delay);

        return () => clearTimeout(timeout); // Clean up the timeout on component unmount
    }, []);

    // Navigate to Signinscreen when shouldNavigate becomes true
    useEffect(() => {
        if (shouldNavigate) {
            // Perform navigation logic here
            console.log('Navigate to Signinscreen');
            // You can replace the console.log with your navigation logic
        }
    }, [shouldNavigate]);

    return (
        <div className="page-wrapper">
            <div className="loader-screen" id="splashscreen">
                <div className="main-screen">
                    <div className="loader">
                      <Link to ='/Signinscreen'> </Link> 
                    </div>
                    <div className="title">
                        {/* Render the word */}
                       
                    </div>
                </div>
                <CompanyVersion/>
            </div>
        </div>
    );
};

export default WelcomeScreen;
