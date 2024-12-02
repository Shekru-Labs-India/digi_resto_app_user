import React, { useState } from "react";
  import "../assets/css/toast.css";

const Tabs = () => {
  const [isChecked1, setIsChecked1] = useState(false);


  return (
    <div>
      <div className="tab">
        <input
          type="checkbox"
          id="chck1"
          checked={isChecked1}
          onChange={() => setIsChecked1(!isChecked1)}
        />
        <label className="tab-label" htmlFor="chck1">
          10 Oct 2024
        </label>
        {isChecked1 && (
          <div className="tab-content">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum,
            reiciendis!
          </div>
        )}
      </div>

      
    </div>
  );
};

export default Tabs;
