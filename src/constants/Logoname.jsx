import React from 'react'
import applogo from "../assets/logos/Menu Mitra logo 1.png";
import updateLogo from "../assets/logos/mmua_transparent.png";
const Logoname = () => {
  return (
    <div className="logotitle" style={{ textAlign: "center" }}>
      <h4 className="title">
        {" "}
        <img
          src={updateLogo}
          alt="wave"
          style={{ width: "70px", height: "auto" }}
          className="logo-image"
        />{" "}
        <br></br> <h5 className="title">MenuMitra</h5>
      </h4>
    </div>
  );
}

export default Logoname
