import React from "react";

import "./style.scss";

const Tooltip = ({ children, text = "", position = "down" }) => {
  return (
    <div tooltip={text} flow={position}>
      {children}
    </div>
  );
};

export default Tooltip;
