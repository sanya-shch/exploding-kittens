import { cardTypes } from "../constants/cardTypes";

export const getNopeCount = (gameMoves) =>
  gameMoves.reduce(
    (acc, item) => {
      if (acc[1]) {
        if (item.cardType !== cardTypes.nope) {
          acc[1] = false;
        } else {
          acc[0] += 1;
        }
      }

      return acc;
    },
    [0, true]
  )[0];
