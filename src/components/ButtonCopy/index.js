import React from "react";

import "./style.scss";

const ButtonCopy = ({ children, value, onClick }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);

      if (onClick) {
        onClick();
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  return (
    <button type="button" className="copy_btn" onClick={handleCopy}>
      {children}
    </button>
  );
};

export default ButtonCopy;
