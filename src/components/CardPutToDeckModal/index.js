import React, { useMemo, useState, useEffect, useRef } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

import { db } from "../../firebase";
// import { revers } from "../../assets/cards"
import { cardTypes } from "../../constants/cardTypes";
import ReactPortal from "../ReactPortal";
import MainButton from "../MainButton";

import "./style.scss";

const CardPutToDeckModal = ({
  isOpen,
  handleClose,
  playerCards,
  cardDeck,
  cards,
  uuid,
  id,
  attackCount,
  playersList,
}) => {
  const modalRef = useRef(null);

  const explodeCard = useMemo(
    () =>
      playerCards[uuid].find(
        (item) => cards[item].type === cardTypes.explodingKitten
      ),
    [playerCards, cards, uuid]
  );
  const defuseCard = useMemo(
    () =>
      playerCards[uuid].find((item) => cards[item].type === cardTypes.defuse),
    [playerCards, cards, uuid]
  );
  const impendingImplodingKittenCard = useMemo(
    () =>
      playerCards[uuid].find(
        (item) => cards[item].type === cardTypes.impendingImplodingKitten
      ),
    [playerCards, cards, uuid]
  );

  const [newCardDeck, setNewCardDeck] = useState([]);
  useEffect(() => {
    if (explodeCard) {
      setNewCardDeck([explodeCard, ...cardDeck]);
    }
    if (impendingImplodingKittenCard) {
      setNewCardDeck([impendingImplodingKittenCard, ...cardDeck]);
    }
  }, [cardDeck, explodeCard, impendingImplodingKittenCard]);

  const handleClick = () => {
    // console.log({ newCardDeck });

    if (explodeCard) {
      if (attackCount > 0) {
        updateDoc(doc(db, "game_rooms_kitten", id), {
          player_cards: {
            ...playerCards,
            [uuid]: playerCards[uuid].filter(
              (item) => item !== defuseCard && item !== explodeCard
            ),
          },
          out_card_deck: arrayUnion(defuseCard),
          card_deck: newCardDeck,
          // game_moves: arrayUnion({ uid: uuid, cardType: cards[defuseCard]?.type }),
          game_moves: [],
          attack_count: attackCount - 1,
        });
      } else {
        const index = playersList.findIndex((item) => item === uuid);

        updateDoc(doc(db, "game_rooms_kitten", id), {
          player_cards: {
            ...playerCards,
            [uuid]: playerCards[uuid].filter(
              (item) => item !== defuseCard && item !== explodeCard
            ),
          },
          out_card_deck: arrayUnion(defuseCard),
          card_deck: newCardDeck,
          // game_moves: arrayUnion({ uid: uuid, cardType: cards[defuseCard]?.type }),
          game_moves: [],
          current_player_uid:
            index === playersList.length - 1
              ? playersList[0]
              : playersList[index + 1],
        });
      }
    } else if (impendingImplodingKittenCard) {
      if (attackCount > 0) {
        updateDoc(doc(db, "game_rooms_kitten", id), {
          player_cards: {
            ...playerCards,
            [uuid]: playerCards[uuid].filter(
              (item) => item !== impendingImplodingKittenCard
            ),
          },
          card_deck: newCardDeck,
          game_moves: [],
          is_impending_imploding_kitten: true,
          attack_count: attackCount - 1,
        });
      } else {
        const index = playersList.findIndex((item) => item === uuid);

        updateDoc(doc(db, "game_rooms_kitten", id), {
          player_cards: {
            ...playerCards,
            [uuid]: playerCards[uuid].filter(
              (item) => item !== impendingImplodingKittenCard
            ),
          },
          card_deck: newCardDeck,
          game_moves: [],
          is_impending_imploding_kitten: true,
          current_player_uid:
            index === playersList.length - 1
              ? playersList[0]
              : playersList[index + 1],
        });
      }
    }

    handleClose();
  };

  const [dragEl, setDragEl] = useState(null);

  function handleDragStart({ e, card }) {
    if (card === explodeCard) {
      setDragEl(card);

      e.dataTransfer.effectAllowed = "move";
      // e.dataTransfer.setDragImage(e.target, 100, 100);
    }
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.dataTransfer.dropEffect = "move";

    return false;
  }

  function handleDragEnter({ e, card }) {
    if (dragEl === explodeCard) {
      const item = modalRef.current?.querySelector(
        `.dnd_item[data-card=${card}]`
      );

      if (item) item.classList.add("over");
    }
  }

  function handleDragLeave({ e, card }) {
    if (dragEl === explodeCard) {
      const item = modalRef.current?.querySelector(
        `.dnd_item[data-card=${card}]`
      );

      if (item) item.classList.remove("over");
    }
  }

  function handleDrop({ e, card }) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    if (dragEl === explodeCard) {
      const cardIndex = newCardDeck.findIndex((item) => item === card);
      const explodeCardIndex = newCardDeck.findIndex(
        (item) => item === explodeCard
      );

      setNewCardDeck((prev) =>
        prev.reduce((acc, item, index) => {
          if (index === explodeCardIndex) {
            acc.push(card);
          } else if (index === cardIndex) {
            acc.push(explodeCard);
          } else {
            acc.push(item);
          }

          return acc;
        }, [])
      );
    }

    return false;
  }

  function handleDragEnd(e) {
    if (dragEl === explodeCard) {
      const items = modalRef.current?.querySelectorAll(
        ".dnd_container .dnd_item"
      );

      items?.forEach(function (item) {
        item.classList.remove("over");
      });
    } else {
      setDragEl(null);
    }
  }

  if (!isOpen) return null;

  return (
    <ReactPortal wrapperId="react-portal-card-put-to-deck-modal">
      <div className="card-put-to-deck-modal" ref={modalRef}>
        <div className="modal-content">
          <div className="content_block dnd_container">
            {newCardDeck.map((card, index) => (
              <div
                key={card}
                className="dnd_item"
                onDragStart={(e) => handleDragStart({ e, card })}
                onDragEnter={(e) => handleDragEnter({ e, card })}
                onDragOver={handleDragOver}
                onDragLeave={(e) => handleDragLeave({ e, card })}
                onDrop={(e) => handleDrop({ e, card })}
                onDragEnd={handleDragEnd}
                data-card={card}
                draggable
              >
                {card === explodeCard || card === impendingImplodingKittenCard
                  ? "X"
                  : index + 1}
                {/*<img src={card === explodeCard ? cards[card]?.img : revers} alt="" width={200} height={300} />*/}
              </div>
            ))}
          </div>
          <div className="btn_block">
            <MainButton text="Go" onClick={handleClick} />
          </div>
        </div>
      </div>
    </ReactPortal>
  );
};

export default CardPutToDeckModal;
