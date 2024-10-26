import React, { useState } from "react";
import "./HeartAnimation.css";

const HeartAnimation = () => {
  const [isLiked, setIsLiked] = useState(false);

  const handleClick = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="heart-container" onClick={handleClick}>
      <i className={`ri-heart-${isLiked ? 'fill' : 'line'} heart-icon ${isLiked ? 'animate' : ''}`}></i>
      {isLiked && (
        <>
          <span className="sparkle sparkle-1"></span>
          <span className="sparkle sparkle-2"></span>
          <span className="sparkle sparkle-3"></span>
          <span className="sparkle sparkle-4"></span>
        </>
      )}
    </div>
  );
};

export default HeartAnimation;
