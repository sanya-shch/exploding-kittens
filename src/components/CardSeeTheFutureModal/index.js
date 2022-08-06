import React from 'react';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

import { db } from "../../firebase";

import ReactPortal from "../ReactPortal";
import MainButton from "../MainButton";

import './style.scss';

const CardSeeTheFutureModal = ({
  isOpen,
  handleClose,
  cardType,
  cardDeck,
  cards,
  id,
  uuid,
  playerCards,
}) => {
  const handleClick = () => {
    updateDoc(doc(db, "game_rooms_kitten", id), {
      player_cards: { ...playerCards, [uuid]: playerCards[uuid].filter(item => item !== cardType) },
      out_card_deck: arrayUnion(cardType),

      game_moves: arrayUnion({ uid: uuid, cardType: cards[cardType]?.type }),
    });

    handleClose();
  };

  if (!isOpen) return null;

  return (
    <ReactPortal wrapperId="react-portal-card-see-the-future-modal">
      <div className="card-see-the-future-modal">
        <div className="modal-content">
          <div className="content_block">
            {cardDeck.length && cardDeck.map((item, index) => index < 3 && (
              <img
                key={item}
                src={cards[item].img}
                alt=""
                width={200}
                height={300}
                // tabIndex={0}
                // role="button"
                // onClick={handleClickImg}
              />
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

export default CardSeeTheFutureModal;
