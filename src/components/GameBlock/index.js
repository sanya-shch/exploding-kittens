import React, { useState, useMemo, useEffect } from 'react';

import * as cardsImages from "../../constants/cards";
import { isExplode } from "../../helpers";
import PlayersBlock from "../PlayersBlock";
import CardsBlock from "../CardsBlock";
import CardsDeckBlock from "../CardsDeckBlock";
import CardSeeTheFutureModal from "../CardSeeTheFutureModal";
import CardPutToDeckModal from "../CardPutToDeckModal";

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
  currentPlayerUid,
  playersList,
  gameMoves,
  attackCount,
  uuid,
  id,
}) => {
  const [cardSeeTheFutureModalOpen, setCardSeeTheFutureModalOpen] = useState(false);
  const [cardType, setCardType] = useState('');

  useEffect(() => {
    if (cardType) {
      setCardSeeTheFutureModalOpen(true);
    }
  }, [cardType]);

  const [cardPutToDeckModalOpen, setCardPutToDeckModalOpen] = useState(false);

  const [selectedCards, setSelectedCards] = useState([]);

  const cards = useMemo(() => [...expansionsList, ...cardPacksList]
      .reduce((acc, item) => ({ ...acc, ...cardsImages[item]}), {}),
    [expansionsList, cardPacksList]
  );

  useEffect(() => {
    switch (isExplode({
      playerCards: playerCards[uuid],
      cards,
    })) {
      case 'explode':
        console.log("explode");
        break;
      case 'not_explode':
        setCardPutToDeckModalOpen(true);
        break;
    }
  }, [cardDeck, playerCards]);

  return (
    <>
      <div className="game_block">
        <PlayersBlock
          midgamePlayerUid={midgamePlayerUid}
          playerDataArr={playerDataArr}
          iconPack={iconPack}
          playerCards={playerCards}
          uuid={uuid}
          currentPlayerUid={currentPlayerUid}
          playersList={playersList}
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
          isCurrentPlayer={currentPlayerUid === uuid}
          playersList={playersList}
          gameMoves={gameMoves}
          attackCount={attackCount}
          setCardType={setCardType}
        />

        <div/>

        <CardsBlock
          playerCards={playerCards}
          uuid={uuid}
          id={id}
          setSelectedCards={setSelectedCards}
          selectedCards={selectedCards}
          cards={cards}
          currentPlayerUid={currentPlayerUid}
          isCurrentPlayer={currentPlayerUid === uuid}
        />

        <div className="drag_items">
          {selectedCards?.map(item => (
            <img key={item} src={cards[item]?.img} alt="" />
          ))}
        </div>
      </div>

      <CardSeeTheFutureModal
        isOpen={cardSeeTheFutureModalOpen}
        handleClose={() => {
          setCardSeeTheFutureModalOpen(false);
          setCardType('');
        }}
        cardType={cardType}
        cardDeck={cardDeck}
        cards={cards}
        playerCards={playerCards}
        uuid={uuid}
        id={id}
      />

      <CardPutToDeckModal
        isOpen={cardPutToDeckModalOpen}
        handleClose={() => {
          setCardPutToDeckModalOpen(false);
        }}
        cardDeck={cardDeck}
        playerCards={playerCards}
        cards={cards}
        uuid={uuid}
        id={id}
        attackCount={attackCount}
        playersList={playersList}
      />
    </>
  )
};

export default GameBlock;
