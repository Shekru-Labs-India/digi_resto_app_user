



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EditProfile = () => {
    const [userData, setUserData] = useState({});
    const [newName, setNewName] = useState('');
    const [newMobile, setNewMobile] = useState('');
    const [newDob, setNewDob] = useState('');
    const [error, setError] = useState('');



  
    useEffect(() => {
        // Retrieve user data from localStorage when the component mounts
        const storedUserData = JSON.parse(localStorage.getItem('userData')) || {};
        setUserData(storedUserData);

        // Set initial values for form fields
        setNewName(storedUserData.name || '');
        setNewMobile(storedUserData.mobile || '');
        setNewDob(storedUserData.dob || '');
    }, []);

    const handleUpdateProfile = async () => {
        try {
            const url = 'http://194.195.116.199/user_api/account_profile_update';
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer_id: userData.customer_id,
                    name: newName,
                    dob: newDob,
                    mobile: newMobile,
                }),
            };

            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                console.log('Profile updated successfully!');
            } else {
                setError('Profile update failed. Please try again.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Profile update failed. Please try again.');
        }
    };
    const toTitleCase = (str) => {
        return str.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      };
    

    return (
        <div className="page-wrapper">
            <header className="header header-fixed style-3">
                <div className="header-content">
                    <div className="left-content">
                        <Link to="/Profile" className="back-btn dz-icon icon-fill icon-sm">
                            <i className="bx bx-arrow-back"></i>
                        </Link>
                    </div>
                    <div className="mid-content">
                        <h5 className="title">Edit Profile</h5>
                    </div>
                    <div className="right-content"></div>
                </div>
            </header>
            <main className="page-content space-top p-b80">
                <div className="container">
                    <div className="edit-profile">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="name">
                                <span className="required-star">*</span> Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="form-control"
                                placeholder="Enter Full Name"
                                value={toTitleCase(newName)}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="phone">
                                <span className="required-star">*</span> Mobile Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                className="form-control"
                                value={newMobile}
                                onChange={(e) => setNewMobile(e.target.value)}
                                disabled  // assuming mobile number should not be editable
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="dob">
                                <span className="required-star">*</span> Date of Birth
                            </label>
                            <input
                                type="date"
                                id="dob"
                                className="form-control"
                                placeholder="Enter DOB"
                                value={newDob}
                                onChange={(e) => setNewDob(e.target.value)}
                            />
                        </div>
                        {error && <p className="text-danger">{error}</p>}
                        <button
                            type="button"
                            className="btn btn-lg btn-thin rounded-xl btn-primary w-100"
                            onClick={handleUpdateProfile}
                        >
                            Update Profile
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditProfile;
