import { cardTypes } from "../constants/cardTypes";

export const isExplode = ({ playerCards, cards }) => {
  const explodeCard = playerCards.find(item => cards[item].type === cardTypes.explodingKitten);

  if (explodeCard) {
    const defuseCard = playerCards.find(item => cards[item].type === cardTypes.defuse);

    if (defuseCard) return 'not_explode';

    return 'explode';
  }
};

export const isExplodeCard = ({ card, cards }) => cards[card].type === cardTypes.explodingKitten;
