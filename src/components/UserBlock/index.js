import React from 'react';

import './style.scss';

const UserBlock = ({
  imgSrc,
  username,
  itsI,
  isCurrentPlayer,
  numberOfCards,
  isHost,
  isStartBlock,
  handleKick,
}) => {
  return (
    <div className={`user_block ${itsI ? 'itsI' : ''} ${isCurrentPlayer ? 'is_current_player' : ''}`}>
      <p>{username}</p>
      <img
        src={imgSrc}
        alt=""
        width="65px"
        height="65px"
        loading="lazy"
      />
      {!isStartBlock && (
        <div className="card_items">
          <div/>
          <div/>
          <div/>
          <div/>
          <span>{numberOfCards}</span>
        </div>
      )}
      {isHost && isStartBlock && !itsI && (
        <button
          onClick={handleKick}
        >
          X
        </button>
      )}
    </div>
  )
};

export default UserBlock;
