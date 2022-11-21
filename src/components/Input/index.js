import React from "react";

import "./style.scss";

const Input = ({ value, onChange, maxLength, autofocus = false }) => {
  return (
    <div className="input_container">
      <input
        type="text"
        name="name"
        className="question"
        id="nme"
        required
        autoComplete="off"
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        autoFocus={autofocus}
      />
      <label htmlFor="nme">
        <span>What's your name?</span>
      </label>
    </div>
  );
};

export default Input;
