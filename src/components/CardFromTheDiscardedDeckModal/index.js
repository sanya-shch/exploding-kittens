import React, { useState } from 'react';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

import { db } from "../../firebase";

import ReactPortal from "../ReactPortal";
import MainButton from "../MainButton";

import './style.scss';

const CardFromTheDiscardedDeckModal = ({
  isOpen,
  handleClose,
  outCardDeck,
  cards,
  id,
  uuid,
  playerCards,
  selectedCards,
}) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleClick = () => {
    if (selectedCard) {
      updateDoc(doc(db, "game_rooms_kitten", id), {
        player_cards: { ...playerCards, [uuid]: [...playerCards[uuid].filter(item => !selectedCards.includes(item)), selectedCard] },
        out_card_deck: arrayUnion(...selectedCards),

        game_moves: arrayUnion({ uid: uuid, cardType: 'combo_5', playerCards: playerCards[uuid], outCardDeck }),
      });
    }

    handleClose();
  };

  const handleClickImg = card => {
    setSelectedCard(card);
  };

  if (!isOpen) return null;

  return (
    <ReactPortal wrapperId="react-portal-card-from-discarded-deck-modal">
      <div className="card-from-discarded-deck-modal">
        <div className="modal-content">
          <div className="content_block">
            {outCardDeck.map(card => (
              <div key={`${card}-from-discarded-deck`}>
                <img
                  src={cards[card]?.img}
                  alt=""
                  width={200}
                  height={300}
                  onClick={() => handleClickImg(card)}
                  className={selectedCard === card ? 'selected' : ''}
                />
              </div>
            ))}
          </div>
          <div className="btn_block">
            <MainButton
              text="Exit"
              onClick={handleClick}
            />
          </div>
        </div>
      </div>
    </ReactPortal>
  )
};

export default CardFromTheDiscardedDeckModal;
