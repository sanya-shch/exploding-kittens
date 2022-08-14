import React, { useState, useMemo } from 'react';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

import { db } from "../../firebase";
import { revers } from "../../assets/cards"
import { randomize } from "../../helpers";
import ReactPortal from "../ReactPortal";
import MainButton from "../MainButton";

import './style.scss';

const CardSelectionModal = ({
  isOpen,
  handleClose,
  id,
  uuid,
  playerCards,
  selectedCards,
  selectedPlayerUid,
}) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const randomizedPlayerCards = useMemo(() => playerCards[selectedPlayerUid] && randomize(playerCards[selectedPlayerUid]), [selectedPlayerUid, playerCards]);

  const handleClick = () => {
    if (selectedCard && selectedPlayerUid) {
      updateDoc(doc(db, "game_rooms_kitten", id), {
        player_cards: {
          ...playerCards,
          [selectedPlayerUid]: playerCards[selectedPlayerUid].filter(item => item !== selectedCard),
          [uuid]: [...playerCards[uuid].filter(item => !selectedCards.includes(item)), selectedCard],
        },
        out_card_deck: arrayUnion(...selectedCards),

        game_moves: arrayUnion({ uid: uuid, cardType: 'combo_2', selectedCard, combo2PlayerUid: selectedPlayerUid }),
      });
    }

    handleClose();
  };

  const handleClickImg = card => {
    setSelectedCard(card);
  };

  if (!isOpen) return null;

  return (
    <ReactPortal wrapperId="react-portal-card-selection-modal">
      <div className="card-selection-modal">
        <div className="modal-content">
          <div className="content_block">
            {randomizedPlayerCards.map(card => (
              <div key={card} className={selectedCard === card ? 'selected' : ''}>
                <img
                  src={revers}
                  alt=""
                  width={200}
                  height={300}
                  onClick={() => handleClickImg(card)}
                />
              </div>
            ))}
          </div>
          <div className="btn_block">
            <MainButton
              text={selectedCard ? 'Go' : 'Exit'}
              onClick={handleClick}
            />
          </div>
        </div>
      </div>
    </ReactPortal>
  )
};

export default CardSelectionModal;
