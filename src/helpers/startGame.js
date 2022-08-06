import { doc, updateDoc } from "firebase/firestore";
// import { numbersOfPlayers } from "../constants/expansions";
import * as cards from '../constants/cards';
import { cardTypes } from "../constants/cardTypes";
import { randomize } from "./getCards";
import { db } from "../firebase";

export const startGame = ({
  cardPacksList,
  expansionsList,
  playerDataArr,
  id,
}) => {
  // const currentNumberOfPlayers = playerDataArr.length;
  // const possibleNumberOfPlayers = cardPacksList.reduce((acc, item) => acc + numbersOfPlayers[item], 0);

  const { explodingKittenCards, defuseCards, impendingImplodingKittenCard, restOfCards } = [...expansionsList, ...cardPacksList]
    .reduce((acc, item) => [ ...acc, ...Object.values(cards[item]) ], [])
    .reduce((acc, item) => {
      if (item.type === cardTypes.explodingKitten) {
        acc.explodingKittenCards.push(item.id);
      } else if (item.type === cardTypes.defuse) {
        acc.defuseCards.push(item.id);
      } else if (item.type === cardTypes.impendingImplodingKitten) {
        acc.impendingImplodingKittenCard.push(item.id);
      } else {
        acc.restOfCards.push(item.id);
      }
      return acc;
    }, { explodingKittenCards: [], defuseCards: [], impendingImplodingKittenCard: [], restOfCards: [] });

  const shuffledRestOfCards = randomize(restOfCards);

  const deckOfCards = [];
  const playerCards = playerDataArr.reduce((acc, item, index) => {
    const defuse = defuseCards.pop();

    acc[item.uid] = [defuse, ...shuffledRestOfCards.slice(index * 7, index * 7 + 7)];

    if (playerDataArr.length === index + 1) {
      deckOfCards.push(
        ...shuffledRestOfCards.slice(index * 7 + 7, shuffledRestOfCards.length),
        ...impendingImplodingKittenCard,
      )
    } else {
      deckOfCards.push(explodingKittenCards.pop());
    }

    return acc;
  }, {});

  deckOfCards.push(defuseCards.pop());

  updateDoc(doc(db, "game_rooms_kitten", id), {
    ongoing_game: true,
    player_cards: playerCards,
    card_deck: randomize(deckOfCards),
    players_list: playerDataArr.map(item => item.uid),
  });
};
