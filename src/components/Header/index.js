import React from "react";
import { useNavigate } from "react-router-dom";

import * as icons from "../../assets/icons";
import Tooltip from "../Tooltip";

import "./style.scss";

const Header = ({ playerDataArr, iconPack }) => {
  const navigate = useNavigate();

  return (
    <div className="header">
      <h1 onClick={() => navigate("/")} tabIndex={0} role="button">
        <span>EXPLODING</span> KITTENS
      </h1>

      <div className="players">
        {playerDataArr?.map((player) => (
          <Tooltip
            key={player.uid}
            text={`${player.username} - ${player.points}`}
          >
            <img
              src={icons[iconPack][`${iconPack}${player.icon_index}`]}
              alt=""
              width="40px"
              height="40px"
            />
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default Header;
