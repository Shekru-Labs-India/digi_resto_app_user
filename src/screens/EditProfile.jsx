




import React, { useState, useEffect ,useRef} from "react";
import { Link, useNavigate } from "react-router-dom";
import Bottom from "../component/bottom";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/saga-blue/theme.css"; // Choose a theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css"; 
import OrderGif from "./OrderGif";
import LoaderGif from "./LoaderGIF";


const EditProfile = () => {
  const [userData, setUserData] = useState({});
  const [newName, setNewName] = useState("");
  const [newMobile, setNewMobile] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef(null);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData")) || {};
    console.log("Stored user data:", storedUserData); // Debugging purpose
    setUserData(storedUserData);
    setNewName(storedUserData.name || "");
    setNewMobile(storedUserData.mobile || ""); // Ensure mobile is retrieved correctly
    
  }, []);

  const handleUpdateProfile = async () => {
    // Check if the mobile number is exactly 10 digits
    if (newMobile.length !== 10) {
      setError("Mobile number must be exactly 10 digits.");
      return; // Stop the function if the validation fails
    }

    try {
      setLoading(true);
      const url = "https://menumitra.com/user_api/account_profile_update";
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: userData?.customer_id || "",
          name: newName,
         mobile: newMobile,
        }),
      };

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.st === 1) {
        const updatedUserData = {
          ...userData,
          name: newName,
          
          mobile: newMobile,
        };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
        setError("");
        toast.current.show({
          severity: "success",
          summary: "Profile Updated",
          detail: "Your profile has been updated successfully!",
          life: 2000,
        });
        setTimeout(() => {
          navigate("/Profile");
        }, 2000);
      } else {
        setError("Profile update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Profile update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    // Allow only letters and spaces
    if (/^[A-Za-z\s]*$/.test(value)) {
      setNewName(value);
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;
    // Allow only numbers (0-9) and ensure the length is at most 10
    if (/^\d*$/.test(value) && value.length <= 10) {
      setNewMobile(value);
    }
  };

  return (
    <div className="page-wrapper">
      <Toast ref={toast} position="bottom-center" className="custom-toast" />
      <header className="header header-fixed style-3">
        <header className="header header-fixed pt-2 shadow-sm">
          <div className="header-content">
            <div className="left-content">
              <Link
                to="/Profile"
                className="back-btn dz-icon icon-fill icon-sm"
                onClick={() => navigate(-1)}
              >
                <i className="ri-arrow-left-line fs-3"></i>
              </Link>
            </div>
            <div className="mid-content">
              <span className="    me-3">Edit Profile</span>
            </div>
            <div className="right-content"></div>
          </div>
        </header>
      </header>
      <main className="page-content space-top mb-5 pb-3">
        <div className="container">
          {loading ? (
            <div id="preloader">
              <div className="loader">
                {/* <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div> */}
                <LoaderGif />
              </div>
            </div>
          ) : (
            <div className="edit-profile">
              <div className="mb-3">
                <label className="    pb-2" htmlFor="name">
                  <span className="required-star fw-light">*</span> Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-control border border-2"
                  placeholder="Enter Full Name"
                  value={toTitleCase(newName)}
                  onChange={handleNameChange}
                />
              </div>
              <div className="mb-3">
                <label className="    pb-2" htmlFor="phone">
                  <span className="required-star">*</span> Mobile
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="form-control border border-2"
                  value={newMobile}
                  onChange={handleMobileChange} // Now editable with validation
                />
              </div>

              {error && <p className="text-danger">{error}</p>}
              {successMessage && (
                <p className="text-success">{successMessage}</p>
              )}
              <div className="d-flex justify-content-center align-items-center">
                <button
                  type="button"
                  className="btn  btn-color  py-3  rounded-pill    "
                  style={{ fontFamily: "Poppins, sans-serif" }}
                  onClick={handleUpdateProfile}
                >
                  <span className="    text-white">
                    Save Changes
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Bottom />
    </div>
  );
};

export default EditProfile;
