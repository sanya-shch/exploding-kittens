import React, { useState, useMemo } from 'react';

import * as cardsImages from "../../constants/cards";
import PlayersBlock from "../PlayersBlock";
import CardsBlock from "../CardsBlock";

import './style.scss';
import CardsDeckBlock from "../CardsDeckBlock";

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
  const [selectedCards, setSelectedCards] = useState([]);

  const cards = useMemo(() => [...expansionsList, ...cardPacksList]
      .reduce((acc, item) => ({ ...acc, ...cardsImages[item]}), {}),
    [expansionsList, cardPacksList]
  );

  return (
    <div className="game_block">
      <PlayersBlock
        midgamePlayerUid={midgamePlayerUid}
        playerDataArr={playerDataArr}
        iconPack={iconPack}
        playerCards={playerCards}
        uuid={uuid}
      />

      <CardsDeckBlock
        playerCards={playerCards}
        cardDeck={cardDeck}
        outCardDeck={outCardDeck}
        cards={cards}
        selectedCards={selectedCards}
        setSelectedCards={setSelectedCards}
        uuid={uuid}
        id={id}
      />

      <CardsBlock
        playerCards={playerCards}
        uuid={uuid}
        id={id}
        setSelectedCards={setSelectedCards}
        selectedCards={selectedCards}
        cards={cards}
      />

      <div className="drag_items">
        {selectedCards?.map(item => (
          <img key={item} src={cards[item]?.img} alt="" />
        ))}
      </div>
    </div>
  )
};

export default GameBlock;
