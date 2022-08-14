import { cardTypes } from "../constants/cardTypes";

export const isCombinationExist = (selectedCards, cards) => {
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

    if (
      cardType === cardTypes.alterTheFuture ||
      cardType === cardTypes.drawFromTheBottom ||
      cardType === cardTypes.reverse ||
      cardType === cardTypes.targetedAttack ||
      cardType === cardTypes.attack ||
      cardType === cardTypes.favor ||
      cardType === cardTypes.nope ||
      cardType === cardTypes.seeFuture ||
      cardType === cardTypes.shuffle ||
      cardType === cardTypes.skip
    ) {
      return true;
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
      return true;
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
      return true;
    }
  } else if (selectedCards.length === 5) {
    const values = Object.values(cardTypesList);

    if (values.every(item => item === 1)) {
      return true;
    }
  }

  return false;
};
