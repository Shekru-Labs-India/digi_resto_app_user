import React from 'react'
import { Link } from 'react-router-dom';
import updateLogo from "../assets/logos/menumitra_logo_128.png";
const Logoname = () => {
  return (
    <div className="logotitle mt-3" style={{ textAlign: "center" }}>
      <h4 className="title">
        {" "}
        <Link to="/">
        <img
          src={updateLogo}
          alt="wave"
          style={{ width: "70px", height: "auto" }}
          className="logo-image"
        />{" "}
        <br></br> <h5 className="title">MenuMitra</h5>
        </Link>
      </h4>
    </div>
  );
}

export default Logoname
