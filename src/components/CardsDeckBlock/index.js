import React from 'react';
import { arrayUnion, doc, updateDoc, arrayRemove } from "firebase/firestore";

import { revers } from "../../assets/cards"
import { db } from "../../firebase";

import './style.scss';

const CardsDeckBlock = ({
  playerCards,
  cardDeck,
  outCardDeck,
  uuid,
  id,
  cards,
  selectedCards,
  setSelectedCards,
  isCurrentPlayer,
}) => {
  const handleClickOutDeck = () => {
    if (selectedCards.length && isCurrentPlayer) {
      updateDoc(doc(db, "game_rooms_kitten", id), {
        player_cards: { ...playerCards, [uuid]: playerCards[uuid].filter(item => !selectedCards.includes(item)) },
        out_card_deck: arrayUnion(...selectedCards),
      });

      setSelectedCards([]);
    }
  };

  const handleClickDeck = () => {
    if (cardDeck.length && isCurrentPlayer) {
      updateDoc(doc(db, "game_rooms_kitten", id), {
        player_cards: { ...playerCards, [uuid]: [...playerCards[uuid], cardDeck[0]] },
        card_deck: arrayRemove(cardDeck[0]),
      });
    }
  };

  return (
    <div className="cards_deck">
      <div className="deck">
        {cardDeck?.length ? (
          <img
            src={revers}
            alt=""
            width={200}
            height={300}
            className={`${isCurrentPlayer ? '' : 'not_current_player'}`}
            tabIndex={0}
            role="button"
            onClick={handleClickDeck}
          />
        ) : (
          <div className="no_card">
            <p>There are no more cards in the deck</p>
          </div>
        )}
      </div>
      <div
        className={`drop_zone out ${selectedCards.length ? 'selected' : ''}`}
        tabIndex={0}
        role="button"
        onClick={handleClickOutDeck}
      >
        {outCardDeck?.length ? (
          <img src={cards[outCardDeck.at(-1)]?.img} alt="" width={200} height={300} />
        ) : (
          <div />
        )}
      </div>
    </div>
  )
};

export default CardsDeckBlock;
