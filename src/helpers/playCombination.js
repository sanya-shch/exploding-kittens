import { arrayUnion, doc, updateDoc, arrayRemove } from "firebase/firestore";

import { cardTypes } from "../constants/cardTypes";
import { db } from "../firebase";
import { randomize } from "./getCards";
import { isExplodeCard } from "./isExplode";
import { isEven } from "./isEven";
import { getNopeCount } from "./getNopeCount";

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
  setToast,
  setCardSelectionModalOpen,
  setSelectedPlayer,
}) => {
  const cardTypesList = selectedCards.reduce((acc, item) => {
    if (Object.keys(acc).includes(cards[item].type)) {
      acc[cards[item].type] += 1;
    } else {
      acc[cards[item].type] = 1;
    }

    return acc;
  }, {});

  if (selectedCards.length === 1) {
    const cardType = Object.keys(cardTypesList)[0];

    if (cardType === cardTypes.alterTheFuture) {
      setCardType(selectedCards[0]);
    } else if (cardType === cardTypes.drawFromTheBottom) {
      if (attackCount > 0) {
        updateDoc(doc(db, "game_rooms_kitten", id), {
          player_cards: { ...playerCards, [uuid]: [...playerCards[uuid].filter(item => !selectedCards.includes(item)), cardDeck.at(-1)] },
          card_deck: arrayRemove(cardDeck.at(-1)),

          game_moves: [{ uid: uuid, cardType: cardTypes.drawFromTheBottom, cardDeck, oldPlayerCards: playerCards[uuid] }],
          attack_count: attackCount - 1,
          out_card_deck: arrayUnion(...selectedCards),
        });
      } else if (isExplodeCard({ cards, card: cardDeck.at(-1) })) {
        updateDoc(doc(db, "game_rooms_kitten", id), {
          player_cards: { ...playerCards, [uuid]: [...playerCards[uuid].filter(item => !selectedCards.includes(item)), cardDeck.at(-1)] },
          card_deck: arrayRemove(cardDeck.at(-1)),

          game_moves: [{ uid: uuid, cardType: cardTypes.drawFromTheBottom, cardDeck, oldPlayerCards: playerCards[uuid] }],
          out_card_deck: arrayUnion(...selectedCards),
        });
      } else {
        const index = playersList.findIndex(item => item === uuid);

        updateDoc(doc(db, "game_rooms_kitten", id), {
          player_cards: { ...playerCards, [uuid]: [...playerCards[uuid].filter(item => !selectedCards.includes(item)), cardDeck.at(-1)] },
          card_deck: arrayRemove(cardDeck.at(-1)),

          game_moves: [{ uid: uuid, cardType: cardTypes.drawFromTheBottom, cardDeck, oldPlayerCards: playerCards[uuid] }],
          current_player_uid: index === playersList.length - 1 ? playersList[0] : playersList[index + 1],
          out_card_deck: arrayUnion(...selectedCards),
        });
      }
    } else if (cardType === cardTypes.reverse) {
      const reversedPlayersList = [...playersList].reverse();

      if (attackCount > 0) {
        updateDoc(doc(db, "game_rooms_kitten", id), {
          player_cards: { ...playerCards, [uuid]: playerCards[uuid].filter(item => !selectedCards.includes(item)) },
          out_card_deck: arrayUnion(...selectedCards),

          game_moves: arrayUnion({ uid: uuid, cardType: cardTypes.reverse, attackCount, playersList }),
          attack_count: attackCount - 1,
          players_list: reversedPlayersList,
        });
      } else {
        const index = reversedPlayersList.findIndex(item => item === uuid);

        updateDoc(doc(db, "game_rooms_kitten", id), {
          player_cards: { ...playerCards, [uuid]: playerCards[uuid].filter(item => !selectedCards.includes(item)) },
          out_card_deck: arrayUnion(...selectedCards),

          game_moves: arrayUnion({ uid: uuid, cardType: cardTypes.reverse, playersList }),
          current_player_uid: index === reversedPlayersList.length - 1 ? reversedPlayersList[0] : reversedPlayersList[index + 1],
          players_list: reversedPlayersList,
        });
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
      if (playersList.length > 2) {
        setPlayerSelectionModalCardType(selectedCards[0]);
      } else {
        const player = playersList.filter(item => item !== uuid);

        if (playerCards[player[0]]?.length) {
          updateDoc(doc(db, "game_rooms_kitten", id), {
            player_cards: {...playerCards, [uuid]: playerCards[uuid].filter(item => !selectedCards.includes(item))},
            out_card_deck: arrayUnion(...selectedCards),

            game_moves: arrayUnion({ uid: uuid, cardType: cardTypes.favor, favorPlayerUid: player[0] }),
          });
        } else {
          setToast({
            type: 'danger',
            text: 'The player has no cards',
          })
        }
      }
    } else if (cardType === cardTypes.nope) {
      if (gameMoves?.length) {
        const gameMovesLastItem = gameMoves.find(item => item.cardType !== cardTypes.nope);
        const nopeCount = getNopeCount(gameMoves);

        if (gameMovesLastItem.cardType === cardTypes.alterTheFuture) {
          // console.log(cardTypes.alterTheFuture);

          if (isEven(nopeCount)) {
            updateDoc(doc(db, "game_rooms_kitten", id), {
              player_cards: {...playerCards, [uuid]: playerCards[uuid].filter(item => !selectedCards.includes(item))},
              out_card_deck: arrayUnion(...selectedCards),

              card_deck: gameMovesLastItem.oldCardDeck,
              game_moves: arrayUnion({ uid: uuid, cardType: cardTypes.nope }),
            });
          } else {
            updateDoc(doc(db, "game_rooms_kitten", id), {
              player_cards: {...playerCards, [uuid]: playerCards[uuid].filter(item => !selectedCards.includes(item))},
              out_card_deck: arrayUnion(...selectedCards),

              card_deck: gameMovesLastItem.newCardDeck,
              game_moves: arrayUnion({ uid: uuid, cardType: cardTypes.nope }),
            });
          }
        } else if (gameMovesLastItem.cardType === cardTypes.drawFromTheBottom) {
          console.log(cardTypes.drawFromTheBottom);

          if (isEven(nopeCount)) {

          } else {

          }
        } else if (gameMovesLastItem.cardType === cardTypes.reverse) {
          console.log(cardTypes.reverse);

          if (isEven(nopeCount)) {

          } else {

          }
        } else if (gameMovesLastItem.cardType === cardTypes.targetedAttack) {
          console.log(cardTypes.targetedAttack);

          if (isEven(nopeCount)) {

          } else {

          }
        } else if (gameMovesLastItem.cardType === cardTypes.attack) {
          console.log(cardTypes.attack);

          if (isEven(nopeCount)) {

          } else {

          }
        } else if (gameMovesLastItem.cardType === cardTypes.favor) {
          // console.log(cardTypes.favor);

          updateDoc(doc(db, "game_rooms_kitten", id), {
            player_cards: {...playerCards, [uuid]: playerCards[uuid].filter(item => !selectedCards.includes(item))},
            out_card_deck: arrayUnion(...selectedCards),

            game_moves: arrayUnion({ uid: uuid, cardType: cardTypes.nope }),
          });
        } else if (gameMovesLastItem.cardType === 'favor_answer') {
          // console.log('favor_answer');

          if (isEven(nopeCount)) {
            updateDoc(doc(db, "game_rooms_kitten", id), {
              player_cards: {
                ...playerCards,
                [gameMovesLastItem.favoredUid]: playerCards[gameMovesLastItem.favoredUid].filter(item => item !== gameMovesLastItem.selectedCard),
                [uuid]: [...playerCards[uuid], gameMovesLastItem.selectedCard],
              },
              out_card_deck: arrayUnion(...selectedCards),

              game_moves: arrayUnion({ uid: uuid, cardType: cardTypes.nope }),
            });
          } else {
            updateDoc(doc(db, "game_rooms_kitten", id), {
              player_cards: {
                ...playerCards,
                [uuid]: playerCards[uuid].filter(item => item !== gameMovesLastItem.selectedCard),
                [gameMovesLastItem.favoredUid]: [...playerCards[gameMovesLastItem.favoredUid], gameMovesLastItem.selectedCard],
              },
              out_card_deck: arrayUnion(...selectedCards),

              game_moves: arrayUnion({ uid: uuid, cardType: cardTypes.nope }),
            });
          }
        } else if (gameMovesLastItem.cardType === cardTypes.seeFuture) {
          // console.log(cardTypes.seeFuture);

          setToast({
            type: 'danger',
            text: 'We cannot erase the player\'s memory, so it makes no sense to cancel this card.',
          });

          // if (isEven(nopeCount)) {
          //
          // } else {
          //
          // }
        } else if (gameMovesLastItem.cardType === cardTypes.shuffle) {
          console.log(cardTypes.shuffle);

          if (isEven(nopeCount)) {

          } else {

          }
        } else if (gameMovesLastItem.cardType === cardTypes.skip) {
          console.log(cardTypes.skip);

          if (isEven(nopeCount)) {

          } else {

          }
        } else if (gameMovesLastItem.cardType === 'combo_2') {
          console.log('combo_2');

          if (isEven(nopeCount)) {

          } else {

          }
        } else if (gameMovesLastItem.cardType === 'combo_3') {
          console.log('combo_3');

          if (isEven(nopeCount)) {

          } else {

          }
        } else if (gameMovesLastItem.cardType === 'combo_5') {
          console.log('combo_5');

          if (isEven(nopeCount)) {

          } else {

          }
        }
      }
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
          cardTypeList.includes(cardTypes.beardCat)
          || cardTypeList.includes(cardTypes.cattermelon)
          || cardTypeList.includes(cardTypes.hairyPotatoCat)
          || cardTypeList.includes(cardTypes.tacocat)
          || cardTypeList.includes(cardTypes.rainbowRalphingCat)

          || cardTypeList.includes(cardTypes.mommaCat)
          || cardTypeList.includes(cardTypes.zombieCat)
          || cardTypeList.includes(cardTypes.catSchrodinger)
          || cardTypeList.includes(cardTypes.shyBladderCat)
          || cardTypeList.includes(cardTypes.bikiniCat)
        )
      )
    ) {
      if (playersList.length > 2) {
        setSelectedPlayerCards(selectedCards);
        setPlayerSelectionModalCardType('combo_2');
      } else {
        const player = playersList.filter(item => item !== uuid);

        if (playerCards[player[0]]?.length) {
          setSelectedPlayerCards(selectedCards);
          setSelectedPlayer({ uid: player[0] });
          setCardSelectionModalOpen(true);
        } else {
          setToast({
            type: 'danger',
            text: 'The player has no cards',
          })
        }
      }
    }
  } else if (selectedCards.length === 3) {
    const cardTypeList = Object.keys(cardTypesList);

    if (
      (cardTypeList.length === 1 && cardTypesList[cardTypeList[0]] === 3) ||
      (cardTypeList.length === 2 && cardTypesList[cardTypes.feral] === 1 &&
        (
          cardTypeList.includes(cardTypes.beardCat)
          || cardTypeList.includes(cardTypes.cattermelon)
          || cardTypeList.includes(cardTypes.hairyPotatoCat)
          || cardTypeList.includes(cardTypes.tacocat)
          || cardTypeList.includes(cardTypes.rainbowRalphingCat)

          || cardTypeList.includes(cardTypes.mommaCat)
          || cardTypeList.includes(cardTypes.zombieCat)
          || cardTypeList.includes(cardTypes.catSchrodinger)
          || cardTypeList.includes(cardTypes.shyBladderCat)
          || cardTypeList.includes(cardTypes.bikiniCat)
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
