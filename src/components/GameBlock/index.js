import React from 'react';

import PlayersBlock from "../PlayersBlock";
import CardsBlock from "../CardsBlock";
import { revers } from "../../assets/cards"

import './style.scss';

const GameBlock = ({
  midgamePlayerUid,
  playerDataArr,
  iconPack,
  playerCards,
  cardDeck,
  outCardDeck,
  expansionsList,
  cardPacksList,
  uuid,
  id,
}) => {
  return (
    <div className="game_block">
      <PlayersBlock
        midgamePlayerUid={midgamePlayerUid}
        playerDataArr={playerDataArr}
        iconPack={iconPack}
        playerCards={playerCards}
        uuid={uuid}
        id={id}
      />

      <div className="cards_deck">
        <div className="deck">
          {cardDeck?.length ? (
            <img src={revers} alt="" width={200} height={300} />
          ) : (
            <div>

            </div>
          )}
        </div>
        <div className="out">
          {outCardDeck?.length ? (
            <img src={revers} alt="" width={200} height={300} />
          ) : (
            <div>

            </div>
          )}
        </div>
      </div>

      <CardsBlock
        playerCards={playerCards[uuid]}
        expansionsList={expansionsList}
        cardPacksList={cardPacksList}
        uuid={uuid}
        id={id}
      />
    </div>
  )
};

export default GameBlock;
