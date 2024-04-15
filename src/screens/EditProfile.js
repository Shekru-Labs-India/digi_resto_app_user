// import React from 'react';
// import { Link } from 'react-router-dom';
// const EditProfile = () => {
//     return (
//         <div className="page-wrapper">
//             {/* Preloader */}
//             {/* <div id="preloader">
//                 <div className="loader">
//                     <div className="spinner-border text-primary" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                     </div>
//                 </div>
//             </div> */}
//             {/* Preloader end */}

//             {/* Header */}
//             <header className="header header-fixed style-3">
//                 <div className="header-content">
//                     <div className="left-content">
//                         <Link to="/Profile" className="back-btn dz-icon icon-fill icon-sm">
//                         <i className='bx bx-arrow-back' ></i>
//                         </Link>
//                     </div>
//                     <div className="mid-content"><h5 className="title">Edit Profile</h5></div>
//                     <div className="right-content"></div>
//                 </div>
//             </header>
//             {/* Header end */}

//             {/* Main Content Start */}
//             <main className="page-content space-top p-b80">
//                 <div className="container">
//                     <div className="edit-profile">
//                         {/* <div className="profile-image">
//                             <div className="avatar-upload">
//                                 <div className="avatar-preview">
//                                     <div id="imagePreview" style={{ backgroundImage: 'url(assets/images/avatar/1.png)' }}></div>
//                                     <div className="change-btn">
//                                         <input type='file' className="form-control d-none"  id="imageUpload" accept=".png, .jpg, .jpeg" />
//                                         <label htmlFor="imageUpload">
//                                             <i className="fi fi-rr-pencil"></i>
//                                         </label>
//                                     </div>
//                                 </div>
//                             </div>	
//                         </div> */}

//                         <div className="mb-3">
//                             <label className="form-label" htmlFor="name"> <span className="required-star">*</span> Full Name</label>
//                             <input type="text" id="name" className="form-control"  placeholder='Enter Full Name' />
//                         </div>
//                         <div className="mb-3">
//                             <label className="form-label" htmlFor="phone"> <span className="required-star">*</span> Mobile Number</label>
//                             <input type="tel" id="phone" className="form-control" placeholder='Enter Mobile Number'/>
//                         </div>
//                         <div className="mb-3">
//                             <label className="form-label" htmlFor="dob"> <span className="required-star">*</span> Date of Birth</label>
//                             <input type="date" id="dob" className="form-control" placeholder='Enter DOB' />
//                         </div>
//                         {/* <div className="mb-3">
//                             <label className="form-label" htmlFor="address">Location</label>
//                             <input type="text" id="address" className="form-control" />
//                         </div> */}
//                     </div>
//                 </div>
//             </main>
//             {/* Main Content End */}

//             {/* Footer Fixed Button */}
//             <div className="footer-fixed-btn bottom-0">
//                 <Link to="/Profile" className="btn btn-lg btn-thin rounded-xl btn-primary w-100">Update Profile</Link>
//             </div>
//             {/* Footer Fixed Button */}
//         </div>
//     );
// };

// export default EditProfile;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const EditProfile = () => {
    const [name, setName] = useState('user');
    const [mobile, setMobile] = useState('5678543223');
    const [dob, setDob] = useState('');

    const handleUpdateProfile = async () => {
        try {
            const url = 'http://194.195.116.199/user_api/account_profile_update';
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    customer_id: 2, // Assuming customer_id is fixed or retrieved from auth context
                    name: name,
                    dob: dob,
                    mobile: mobile
                })
            };

            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Profile update response:', data);

            // Handle success message or navigation after profile update
            // For example, redirect to profile page
            // history.push('/Profile');
        } catch (error) {
            console.error('Error updating profile:', error);
            // Handle error message or show error notification
        }
    };

    return (
        <div className="page-wrapper">
            {/* Header */}
            <header className="header header-fixed style-3">
                <div className="header-content">
                    <div className="left-content">
                        <Link to="/Profile" className="back-btn dz-icon icon-fill icon-sm">
                            <i className='bx bx-arrow-back' ></i>
                        </Link>
                    </div>
                    <div className="mid-content"><h5 className="title">Edit Profile</h5></div>
                    <div className="right-content"></div>
                </div>
            </header>
            {/* Header end */}

            {/* Main Content Start */}
            <main className="page-content space-top p-b80">
                <div className="container">
                    <div className="edit-profile">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="name"> <span className="required-star">*</span> Full Name</label>
                            <input type="text" id="name" className="form-control" placeholder='Enter Full Name' value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="phone"> <span className="required-star">*</span> Mobile Number</label>
                            <input type="tel" id="phone" className="form-control" placeholder='Enter Mobile Number' value={mobile} onChange={(e) => setMobile(e.target.value)} />
                        </div>
                        {/* <div className="mb-3">
                            <label className="form-label" htmlFor="dob"> <span className="required-star">*</span> Date of Birth</label>
                            <input type="date" id="dob" className="form-control" placeholder='Enter DOB' value={dob} onChange={(e) => setDob(e.target.value)} />
                        </div> */}
                        <div className="mb-3">
    <label className="form-label" htmlFor="dob">
        <span className="required-star">*</span> Date of Birth
    </label>
    <br />
    <DatePicker
                                id="dob"
                                className="form-control"
                                selected={dob}
                                onChange={(date) => setDob(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Select Date of Birth"
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={100}
                                maxDate={new Date()} // Set max date to today's date
                                style={{
                                    width: '100%',
                                    padding: '0.375rem 0.75rem',
                                    fontSize: '1rem',
                                    lineHeight: '1.5',
                                    color: '#495057',
                                    backgroundColor: '#fff',
                                    borderRadius: '0.25rem',
                                    border: 'none',
                                    boxShadow: 'none',
                                    outline: 'none',
                                }}
                            />
    
</div>

                    </div>
                </div>
            </main>
            {/* Main Content End */}

            {/* Footer Fixed Button */}
            <div className="footer-fixed-btn bottom-0">
                <button className="btn btn-lg btn-thin rounded-xl btn-primary w-100" onClick={handleUpdateProfile}>Update Profile</button>
            </div>
            {/* Footer Fixed Button */}
        </div>
    );
};

export default EditProfile;
