import React, { useState, useMemo } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

import { db } from "../../firebase";
import { cardTypes } from "../../constants/cardTypes";
import ReactPortal from "../ReactPortal";
import MainButton from "../MainButton";

import "./style.scss";

const FavorCardModal = ({
  isOpen,
  handleClose,
  cards,
  id,
  uuid,
  playerCards,
  favoredUid,
}) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const nopeCard = useMemo(
    () => playerCards[uuid].find((item) => cards[item].type === cardTypes.nope),
    [playerCards, cards, uuid]
  );

  const handleClick = () => {
    if (selectedCard) {
      updateDoc(doc(db, "game_rooms_kitten", id), {
        player_cards: {
          ...playerCards,
          [uuid]: playerCards[uuid].filter((item) => item !== selectedCard),
          [favoredUid]: [...playerCards[favoredUid], selectedCard],
        },

        game_moves: arrayUnion({
          uid: uuid,
          cardType: "favor_answer",
          selectedCard,
          favoredUid,
        }),
      });
    }

    handleClose();
  };

  const handleClickImg = (card) => {
    setSelectedCard(card);
  };

  const handleClickNope = () => {
    updateDoc(doc(db, "game_rooms_kitten", id), {
      player_cards: {
        ...playerCards,
        [uuid]: playerCards[uuid].filter((item) => item !== nopeCard),
      },
      out_card_deck: arrayUnion(nopeCard),
      game_moves: arrayUnion({ uid: uuid, cardType: cardTypes.nope }),
    });

    handleClose();
  };

  if (!isOpen) return null;

  return (
    <ReactPortal wrapperId="react-portal-favor-card-modal">
      <div className="favor-card-modal">
        <div className="modal-content">
          <div className="content_block">
            {nopeCard && <button onClick={handleClickNope}>Nope</button>}
            <div className="cards">
              {playerCards[uuid].map((card) => (
                <div key={card}>
                  <img
                    src={cards[card]?.img}
                    alt=""
                    width={200}
                    height={300}
                    onClick={() => handleClickImg(card)}
                    className={selectedCard === card ? "selected" : ""}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="btn_block">
            <MainButton text="Go" onClick={handleClick} />
          </div>
        </div>
      </div>
    </ReactPortal>
  );
};

export default FavorCardModal;
