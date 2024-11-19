import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.js";
import LoaderGIF from "../assets/gif/cooking.gif";

const LoaderGif = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <img
        src={LoaderGIF}
        
        className="img-fluid"
      />
      <h5 className=" ">Loading please wait...</h5>
    </div>
  );
};

export default LoaderGif;
