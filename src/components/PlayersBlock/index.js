import React from 'react';

import * as icons from "../../assets/icons";
import UserBlock from "../UserBlock";

import './style.scss';

const PlayersBlock = ({
  // midgamePlayerUid,
  playerDataArr,
  playerCards,
  iconPack,
  uuid,
  currentPlayerUid,
  playersList,
}) => {
  const players = playersList.reduce((acc, item) => {
    acc.push(playerDataArr.find(findItem => findItem.uid === item));

    return acc;
  }, []);

  return (
    <div className="players_block">
      {players.map((player, index) => (
        <React.Fragment key={player.uid}>
          <UserBlock
            imgSrc={icons[iconPack][`${iconPack}${player.icon_index}`]}
            username={player.username}
            itsI={uuid === player.uid}
            isCurrentPlayer={currentPlayerUid === player.uid}
            numberOfCards={playerCards[player.uid].length}
          />
          {players.length !== index + 1 && (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                 className="bi bi-caret-right-fill" viewBox="0 0 16 16">
              <path
                d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
            </svg>
          )}
        </React.Fragment>
      ))}
    </div>
  )
};

export default PlayersBlock;
