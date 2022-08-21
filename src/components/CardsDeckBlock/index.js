import React, { useContext } from "react";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";

import { revers } from "../../assets/cards";
import { db } from "../../firebase";
import {
  isCombinationExist,
  playCombination,
  // isExplodeCard,
  getNopeCount,
  isEven,
} from "../../helpers";
import { cardTypes } from "../../constants/cardTypes";
import { ToastContext } from "../Toast";

import "./style.scss";

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
  playersList,
  gameMoves,
  attackCount,
  setCardType,
  setCardFromTheDiscardedDeckModalOpen,
  setPlayerSelectionModalCardType,
  setSelectedPlayerCards,
  setCardSelectionModalOpen,
  setSelectedPlayer,
}) => {
  const { setToast } = useContext(ToastContext);

  const isFavor = React.useMemo(() => {
    const gameMovesLastItem = gameMoves.find(
      (item) => item.cardType !== cardTypes.nope
    );
    const nopeCount = getNopeCount(gameMoves);

    return gameMovesLastItem?.cardType === cardTypes.favor && isEven(nopeCount);
  }, [gameMoves]);

  const handleClickOutDeck = () => {
    if (selectedCards.length && isCurrentPlayer) {
      if (isCombinationExist(selectedCards, cards)) {
        playCombination({
          selectedCards,
          setSelectedPlayerCards,
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
          setToast,
          setCardSelectionModalOpen,
          setSelectedPlayer,
        });
      }

      setSelectedCards([]);
    }
  };

  const handleClickDeck = () => {
    if (
      cardDeck.length &&
      (isCurrentPlayer || (gameMoves.length && !isFavor))
    ) {
      if (attackCount > 0) {
        updateDoc(doc(db, "game_rooms_kitten", id), {
          player_cards: {
            ...playerCards,
            [uuid]: [...playerCards[uuid], cardDeck[0]],
          },
          card_deck: arrayRemove(cardDeck[0]),

          game_moves: [],

          attack_count: attackCount - 1,
        });
        // } else if (isExplodeCard({ cards, card: cardDeck[0] })) {
        //   updateDoc(doc(db, "game_rooms_kitten", id), {
        //     player_cards: {
        //       ...playerCards,
        //       [uuid]: [...playerCards[uuid], cardDeck[0]],
        //     },
        //     card_deck: arrayRemove(cardDeck[0]),
        //
        //     game_moves: [],
        //   });
      } else {
        const index = playersList.findIndex((item) => item === uuid);

        updateDoc(doc(db, "game_rooms_kitten", id), {
          player_cards: {
            ...playerCards,
            [uuid]: [...playerCards[uuid], cardDeck[0]],
          },
          card_deck: arrayRemove(cardDeck[0]),

          game_moves: [],

          current_player_uid:
            index === playersList.length - 1
              ? playersList[0]
              : playersList[index + 1],
        });
      }
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
            className={`${
              isCurrentPlayer || (gameMoves.length && !isFavor)
                ? ""
                : "not_current_player"
            }`}
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
        className={`drop_zone out ${selectedCards.length ? "selected" : ""}`}
        tabIndex={0}
        role="button"
        onClick={handleClickOutDeck}
      >
        {outCardDeck?.length ? (
          <img
            src={cards[outCardDeck.at(-1)]?.img}
            alt=""
            width={200}
            height={300}
          />
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default CardsDeckBlock;
