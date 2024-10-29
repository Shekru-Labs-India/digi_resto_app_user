import React from 'react'

import updateLogo from "../assets/logos/menumitra_logo_128.png";
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
