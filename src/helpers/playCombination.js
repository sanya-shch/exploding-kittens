import { arrayUnion, doc, updateDoc, arrayRemove } from "firebase/firestore";

import { cardTypes } from "../constants/cardTypes";
import { db } from "../firebase";
import { randomize } from "./getCards";
import { isExplodeCard } from "./isExplode";

export const playCombination = ({
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
}) => {
  const cardTypesList = selectedCards.reduce((acc, item) => {
    if (Object.keys(acc).includes(cards[item].type)) {
      acc[cards[item].type] += 1;
    } else {
      acc[cards[item].type] = 1;
    }

    return acc;
  }, {});

  console.log({ selectedCards, cards, cardTypesList });

  if (selectedCards.length === 1) {
    const cardType = Object.keys(cardTypesList)[0];

    if (cardType === cardTypes.alterTheFuture) {
      // setCardType(selectedCards[0]);
      // TODO
    } else if (cardType === cardTypes.drawFromTheBottom) {
      if (attackCount > 0) {
        updateDoc(doc(db, "game_rooms_kitten", id), {
          player_cards: { ...playerCards, [uuid]: [...playerCards[uuid].filter(item => !selectedCards.includes(item)), cardDeck.at(-1)] },
          card_deck: arrayRemove(cardDeck.at(-1)),

          game_moves: [],
          attack_count: attackCount - 1,
          out_card_deck: arrayUnion(...selectedCards),
        });
      } else if (isExplodeCard({ cards, card: cardDeck.at(-1) })) {
        updateDoc(doc(db, "game_rooms_kitten", id), {
          player_cards: { ...playerCards, [uuid]: [...playerCards[uuid].filter(item => !selectedCards.includes(item)), cardDeck.at(-1)] },
          card_deck: arrayRemove(cardDeck.at(-1)),

          game_moves: [],
          out_card_deck: arrayUnion(...selectedCards),
        });
      } else {
        const index = playersList.findIndex(item => item === uuid);

        updateDoc(doc(db, "game_rooms_kitten", id), {
          player_cards: { ...playerCards, [uuid]: [...playerCards[uuid].filter(item => !selectedCards.includes(item)), cardDeck.at(-1)] },
          card_deck: arrayRemove(cardDeck.at(-1)),

          game_moves: [],
          current_player_uid: index === playersList.length - 1 ? playersList[0] : playersList[index + 1],
          out_card_deck: arrayUnion(...selectedCards),
        });
      }
    } else if (cardType === cardTypes.reverse) {
      if (attackCount > 0) {
        // TODO
      } else {

      }
    } else if (cardType === cardTypes.targetedAttack) {
      setPlayerSelectionModalCardType(selectedCards[0]);
    } else if (cardType === cardTypes.attack) {
      const index = playersList.findIndex(item => item === uuid);

      updateDoc(doc(db, "game_rooms_kitten", id), {
        player_cards: {...playerCards, [uuid]: playerCards[uuid].filter(item => !selectedCards.includes(item))},
        out_card_deck: arrayUnion(...selectedCards),

        game_moves: arrayUnion({ uid: uuid, cardType: cardTypes.attack }),

        attack_count: 2,
        current_player_uid: index === playersList.length - 1 ? playersList[0] : playersList[index + 1],
      });
    } else if (cardType === cardTypes.favor) {
      setPlayerSelectionModalCardType(selectedCards[0]);
    } else if (cardType === cardTypes.nope) {
      // TODO
    } else if (cardType === cardTypes.seeFuture) {
      setCardType(selectedCards[0]);
    } else if (cardType === cardTypes.shuffle) {
      updateDoc(doc(db, "game_rooms_kitten", id), {
        player_cards: { ...playerCards, [uuid]: playerCards[uuid].filter(item => !selectedCards.includes(item)) },
        out_card_deck: arrayUnion(...selectedCards),

        game_moves: arrayUnion({ uid: uuid, cardType: cardTypes.shuffle, oldCardDeck: cardDeck }),

        card_deck: randomize(cardDeck),
      });
    } else if (cardType === cardTypes.skip) {
      if (attackCount > 0) {
        updateDoc(doc(db, "game_rooms_kitten", id), {
          player_cards: { ...playerCards, [uuid]: playerCards[uuid].filter(item => !selectedCards.includes(item)) },
          out_card_deck: arrayUnion(...selectedCards),

          game_moves: arrayUnion({ uid: uuid, cardType: cardTypes.skip, attackCount }),

          attack_count: attackCount - 1,
        });
      } else {
        const index = playersList.findIndex(item => item === uuid);

        updateDoc(doc(db, "game_rooms_kitten", id), {
          player_cards: { ...playerCards, [uuid]: playerCards[uuid].filter(item => !selectedCards.includes(item)) },
          out_card_deck: arrayUnion(...selectedCards),

          game_moves: arrayUnion({ uid: uuid, cardType: cardTypes.skip }),

          current_player_uid: index === playersList.length - 1 ? playersList[0] : playersList[index + 1],
        });
      }
    }
  } else if (selectedCards.length === 2) {
    const cardTypeList = Object.keys(cardTypesList);

    if (
      (cardTypeList.length === 1 && cardTypesList[cardTypeList[0]] === 2) ||
      (
        cardTypeList.length === 2 && cardTypesList[cardTypes.feral] === 1 &&
        (
          cardTypeList.includes(cardTypes.beardCat) ||
          cardTypeList.includes(cardTypes.cattermelon) ||
          cardTypeList.includes(cardTypes.hairyPotatoCat) ||
          cardTypeList.includes(cardTypes.tacocat) ||
          cardTypeList.includes(cardTypes.rainbowRalphingCat)
        )
      )
    ) {
      setSelectedPlayerCards(selectedCards);
      setPlayerSelectionModalCardType('combo_2');
    }
  } else if (selectedCards.length === 3) {
    const cardTypeList = Object.keys(cardTypesList);

    if (
      (cardTypeList.length === 1 && cardTypesList[cardTypeList[0]] === 3) ||
      (cardTypeList.length === 2 && cardTypesList[cardTypes.feral] === 1 &&
        (
          cardTypeList.includes(cardTypes.beardCat) ||
          cardTypeList.includes(cardTypes.cattermelon) ||
          cardTypeList.includes(cardTypes.hairyPotatoCat) ||
          cardTypeList.includes(cardTypes.tacocat) ||
          cardTypeList.includes(cardTypes.rainbowRalphingCat)
        )
      )
    ) {
      setSelectedPlayerCards(selectedCards);
      setPlayerSelectionModalCardType('combo_3');
    }
  } else if (selectedCards.length === 5) {
    const values = Object.values(cardTypesList);

    if (values.every(item => item === 1)) {
      setCardFromTheDiscardedDeckModalOpen(true);
    }
  }
};
