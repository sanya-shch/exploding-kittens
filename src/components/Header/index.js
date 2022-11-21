import React from "react";
import { useNavigate } from "react-router-dom";

import "./style.scss";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="header">
      <h1 onClick={() => navigate("/")} tabIndex={0} role="button">
        <span>EXPLODING</span> KITTENS
      </h1>
    </div>
  );
};

export default Header;
