import React, { useEffect, useRef, useState } from 'react';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

import { db } from "../../firebase";
import { cardTypes } from "../../constants/cardTypes";
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
  const modalRef = useRef(null);

  const [newCardDeck, setNewCardDeck] = useState([]);
  useEffect(() => {
      setNewCardDeck([...cardDeck]);
  }, [cardDeck]);

  const [dragEl, setDragEl] = useState(null);

  function handleDragStart({ e, card }) {

    if (cards[cardType]?.type === cardTypes.alterTheFuture) {
      setDragEl(card);

      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setDragImage(e.target, 100, 100);
    }
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    if (cards[cardType]?.type === cardTypes.alterTheFuture){
      e.dataTransfer.dropEffect = 'move';
    }

    return false;
  }

  // function handleDragEnter({ e, card }) {
  //   const item = modalRef.current?.querySelector(`.dnd_item[data-card=${card}]`);
  //
  //   if (item) item.classList.add('over');
  // }

  // function handleDragLeave({ e, card }) {
  //   const item = modalRef.current?.querySelector(`.dnd_item[data-card=${card}]`);
  //
  //   if (item) item.classList.remove('over');
  // }

  function handleDrop({ e, card }) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    if (cards[cardType]?.type === cardTypes.alterTheFuture) {
      const cardIndex = newCardDeck.findIndex(item => item === card);
      const dndCardIndex = newCardDeck.findIndex(item => item === dragEl);

      setNewCardDeck(prev => prev.reduce((acc, item, index) => {
        if (index === dndCardIndex) {
          acc.push(card);
        } else if (index === cardIndex) {
          acc.push(dragEl);
        } else {
          acc.push(item);
        }

        return acc;
      }, []));
    }

    return false;
  }

  function handleDragEnd(e) {
    if (cards[cardType]?.type === cardTypes.alterTheFuture) {
      const items = modalRef.current?.querySelectorAll('.dnd_container .dnd_item');

      items?.forEach(function (item) {
        item.classList.remove('over');
      });
      setDragEl(null);
    }
  }

  const handleClick = () => {
    if (cards[cardType]?.type === cardTypes.alterTheFuture) {
      updateDoc(doc(db, "game_rooms_kitten", id), {
        player_cards: { ...playerCards, [uuid]: playerCards[uuid].filter(item => item !== cardType) },
        out_card_deck: arrayUnion(cardType),

        card_deck: newCardDeck,
        game_moves: arrayUnion({ uid: uuid, cardType: cards[cardType]?.type, cardDeck }),
      });
    } else {
      updateDoc(doc(db, "game_rooms_kitten", id), {
        player_cards: { ...playerCards, [uuid]: playerCards[uuid].filter(item => item !== cardType) },
        out_card_deck: arrayUnion(cardType),

        game_moves: arrayUnion({ uid: uuid, cardType: cards[cardType]?.type }),
      });
    }

    handleClose();
  };

  if (!isOpen) return null;

  return (
    <ReactPortal wrapperId="react-portal-card-see-the-future-modal">
      <div className="card-see-the-future-modal" ref={modalRef}>
        <div className="modal-content">
          <div className="content_block dnd_container">
            {newCardDeck.length && newCardDeck.map((card, index) => index < 3 && (
              <div
                key={card}
                className={`dnd_item ${cards[cardType]?.type === cardTypes.alterTheFuture ? 'move' : ''}`}
                onDragStart={e => handleDragStart({ e, card })}
                // onDragEnter={e => handleDragEnter({ e, card })}
                onDragOver={handleDragOver}
                // onDragLeave={e => handleDragLeave({ e, card })}
                onDrop={e => handleDrop({ e, card })}
                onDragEnd={handleDragEnd}
                data-card={card}
                draggable
              >
                <img
                  src={cards[card].img}
                  alt={cards[card].title}
                  width={200}
                  height={300}
                />
              </div>
            ))}
          </div>
          <div className="btn_block">
            <MainButton
              text="Go"
              onClick={handleClick}
            />
          </div>
        </div>
      </div>
    </ReactPortal>
  )
};

export default CardSeeTheFutureModal;
