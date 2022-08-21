import React from "react";

import "./style.scss";

const MainInput = ({ label, btnText, value, maxLength, onChange, onClick }) => {
  const handleChange = (event) => {
    const { value: eventValue } = event.target;
    onChange(eventValue);
  };

  return (
    <div className="main_input">
      <input
        id="register"
        type="text"
        maxLength={maxLength}
        value={value}
        onChange={handleChange}
      />
      <label htmlFor="register">
        <span>{label}</span>
      </label>
      {value && <button onClick={onClick}>{btnText}</button>}
    </div>
  );
};

export default MainInput;
