import { cardTypes } from "../constants/cardTypes";

export const isExplode = ({ playerCards, cards, isImpendingImploding }) => {
  const explodeCard = playerCards?.find(
    (item) => cards[item].type === cardTypes.explodingKitten
  );

  if (explodeCard) {
    const defuseCard = playerCards.find(
      (item) => cards[item].type === cardTypes.defuse
    );

    if (defuseCard) return "not_explode";

    return "explode";
  }

  const impendingImplodingKittenCard = playerCards?.find(
    (item) => cards[item].type === cardTypes.impendingImplodingKitten
  );

  if (impendingImplodingKittenCard) {
    if (isImpendingImploding) return "explode";

    return "is_impending_imploding";
  }
};

export const isExplodeCard = ({ card, cards }) =>
  cards[card].type === cardTypes.explodingKitten;
