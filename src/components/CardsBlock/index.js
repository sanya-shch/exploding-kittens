import React, { useState, useEffect, useCallback } from 'react';
// import { arrayUnion, doc, updateDoc } from "firebase/firestore";

// import { db } from "../../firebase";
import { isCombinationExist, playCombination } from "../../helpers";

import './style.scss';

const CardsBlock = ({
  playerCards,
  uuid,
  id,
  setSelectedCards,
  selectedCards,
  cards,
  isCurrentPlayer,
  playersList,
  cardDeck,
  setCardType,
  gameMoves,
  attackCount,
  setCardFromTheDiscardedDeckModalOpen,
  setPlayerSelectionModalCardType,
}) => {
  const [dragCard, setDragCard] = useState(null);

  function dragOver(e) {
    e.preventDefault();
    // console.log('drag over');
  }

  // function dragEnter() {
  //   // console.log('drag entered');
  // }
  // function dragLeave() {
  //   // console.log('drag left');
  // }

  function dragStart({ event, cardId }) {
    // console.log('drag started');

    setSelectedCards([]);

    if (isCurrentPlayer) {
      setDragCard(cardId);

      let dropZone = document.querySelector('.drop_zone div');
      if (!dropZone) dropZone = document.querySelector('.drop_zone img');
      dropZone.classList.toggle("drag_start");
    }

    // event.dataTransfer.dropEffect = "move";
    // event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setDragImage(event.target, 100, 100);
  }

  function dragEnd() {
    // console.log('drag ended');

    if (isCurrentPlayer) {
      let dropZone = document.querySelector('.drop_zone div');
      if (!dropZone) dropZone = document.querySelector('.drop_zone img');
      dropZone.classList.toggle("drag_start");

      setDragCard(null);
    }
  }

  const dragDrop = useCallback(() => {
    // console.log('drag dropped',  dragCard);

    if (dragCard) {
      // updateDoc(doc(db, "game_rooms_kitten", id), {
      //   player_cards: { ...playerCards, [uuid]: playerCards[uuid].filter(item => item !== dragCard) },
      //   out_card_deck: arrayUnion(dragCard),
      // });

      if (isCombinationExist([...selectedCards, dragCard], cards)) {
        playCombination({
          selectedCards: [...selectedCards, dragCard],
          cards,
          id,
          playerCards,
          uuid,
          playersList,
          cardDeck,
          setCardType,
          gameMoves,
          attackCount,
          setCardFromTheDiscardedDeckModalOpen,
          setPlayerSelectionModalCardType,
        });
      }
    }
  }, [
    dragCard,
    playerCards,
    uuid,
    id,
    attackCount,
    cardDeck,
    cards,
    gameMoves,
    playersList,
    selectedCards,
    setCardFromTheDiscardedDeckModalOpen,
    setCardType,
    setPlayerSelectionModalCardType,
  ]);

  useEffect(() => {
    // const draggableItems = document.querySelectorAll('.draggable_item');
    const dropZone = document.querySelector('.drop_zone');

    if (isCurrentPlayer) {
      // draggableItems.forEach(item => {
      //   // item.addEventListener('dragstart', dragStart);
      //   item.addEventListener('dragend', dragEnd);
      // });

      // dropZone.addEventListener('dragenter', dragEnter);
      // dropZone.addEventListener('dragleave', dragLeave);
      dropZone.addEventListener('dragover', dragOver);
      dropZone.addEventListener('drop', dragDrop);
    }

    return () => {
      if (isCurrentPlayer) {
        // draggableItems.forEach(item => {
        //   // item.removeEventListener('dragstart', dragStart);
        //   item.removeEventListener('dragend', dragEnd);
        // });

        // dropZone.removeEventListener('dragenter', dragEnter);
        // dropZone.removeEventListener('dragleave', dragLeave);
        dropZone.removeEventListener('dragover', dragOver);
        dropZone.removeEventListener('drop', dragDrop);
      }
    }
  }, [dragDrop, isCurrentPlayer]);

  useEffect(() => {
    const element = document.documentElement;

    function handleMouseMove(event) {
      const newElement = document.querySelector('.drag_items');

      newElement.style.left = event.clientX + 50 + 'px';

      if (event.clientY + 105 <= window.visualViewport.height) {
        newElement.style.top = event.clientY - 200 + 'px';
      }
    }

    element.addEventListener('mousemove', handleMouseMove);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handleClick = item => {
    if (isCurrentPlayer) {
      setSelectedCards(prev => (
        prev.includes(item)
          ? prev.filter(pItem => pItem !== item)
          : prev.length < 5
            ? [...prev, item]
            : prev
      ));
    }
  };

  return (
    <div className="cards_block">
      {playerCards[uuid]?.length ? (
        playerCards[uuid].sort().map(item => (
          <div
            key={item}
            className={`draggable_item ${item} card_wrapper ${selectedCards.includes(item) ? 'selected' : ''} ${isCurrentPlayer ? '' : 'not_current_player'}`}
            tabIndex={0}
            role="button"
            onClick={() => handleClick(item)}
            onDragStart={event => dragStart({ event, cardId: item})}
            onDragEnd={dragEnd}
            draggable
          >
            <img src={cards[item].img} alt="" width={200} height={300} />
          </div>
        ))
      ) : (
        <div className="no_card">
          <p>You have no cards</p>
          <p>You must draw from the deck</p>
        </div>
      )}
    </div>
  )
};

export default CardsBlock;
