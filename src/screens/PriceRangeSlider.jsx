// PriceRangeSlider.jsx
import React, { useState } from "react";
import Slider from "react-slider";

const PriceRangeSlider = ({ min, max, onChange }) => {
  const [value, setValue] = useState([min, max]);

  const handleChange = (newValue) => {
    setValue(newValue);
    onChange(newValue); // Call the callback function to notify parent component
  };

  const sliderStyles = {
    width: "300px",
    height: "10px",
    margin: "20px 0",
  };

  const thumbStyles = {
    backgroundColor: "#4a90e2",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
  };

  const trackStyles = {
    backgroundColor: "#ccc",
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: "10px" }}>Min: ${value[0]}</div>
      <div style={{ marginBottom: "10px" }}>Max: ${value[1]}</div>
      <Slider
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        style={sliderStyles}
        renderThumb={(props) => (
          <div {...props} style={{ ...props.style, ...thumbStyles }} />
        )}
        renderTrack={(props) => (
          <div {...props} style={{ ...props.style, ...trackStyles }} />
        )}
        ariaLabel={["Minimum price", "Maximum price"]}
        ariaValuetext={(state) => `$${state.valueNow}`}
      />
    </div>
  );
};

export default PriceRangeSlider;
