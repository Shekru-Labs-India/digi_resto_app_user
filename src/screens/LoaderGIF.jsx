import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.js";
import LoaderGIF from "../assets/gif/loader-animated.gif";

const LoaderGif = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div>
      <img
        src={LoaderGIF}
        alt="Cooking stew"
        className="img-fluid"
      />
    </div>
  );
};

export default LoaderGif;
