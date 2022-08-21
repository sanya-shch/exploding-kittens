import React, { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

import { db } from "../../firebase";
import * as cardTypeIcons from "../../assets/cardTypeIcons";
import { expansions } from "../../constants/expansions";
import { cardTypes } from "../../constants/cardTypes";
import ReactPortal from "../ReactPortal";
import MainButton from "../MainButton";

import "./style.scss";

const CardTypeSelectionModal = ({
  isOpen,
  handleClose,
  cards,
  id,
  uuid,
  playerCards,
  expansionsList,
  selectedPlayer,
  selectedCards,
}) => {
  const [selectedCardType, setSelectedCardType] = useState(null);
  const handleClick = () => {
    if (selectedPlayer?.uid && selectedCardType) {
      const desiredCard = playerCards[selectedPlayer.uid].find(
        (item) => cards[item].type === selectedCardType
      );

      if (desiredCard) {
        updateDoc(doc(db, "game_rooms_kitten", id), {
          player_cards: {
            ...playerCards,
            [selectedPlayer.uid]: playerCards[selectedPlayer.uid].filter(
              (item) => item !== desiredCard
            ),
            [uuid]: [
              ...playerCards[uuid].filter(
                (item) => !selectedCards.includes(item)
              ),
              desiredCard,
            ],
          },
          out_card_deck: arrayUnion(...selectedCards),

          game_moves: arrayUnion({
            uid: uuid,
            cardType: "combo_3",
            desiredCard,
            selectedPlayerUid: selectedPlayer.uid,
          }),
        });
      } else {
        updateDoc(doc(db, "game_rooms_kitten", id), {
          player_cards: {
            ...playerCards,
            [uuid]: playerCards[uuid].filter(
              (item) => !selectedCards.includes(item)
            ),
          },
          out_card_deck: arrayUnion(...selectedCards),

          game_moves: arrayUnion({
            uid: uuid,
            cardType: "combo_3",
            selectedPlayerUid: selectedPlayer.uid,
          }),
        });
      }
    }

    handleClose();
  };

  const handleClickBlock = (cardType) => {
    setSelectedCardType(cardType);
  };

  if (!isOpen) return null;

  return (
    <ReactPortal wrapperId="react-portal-card-selection-modal">
      <div className="card-type-selection-modal">
        <div className="modal-content">
          <div className="content_block">
            <div
              onClick={() => handleClickBlock(cardTypes.defuse)}
              className={
                selectedCardType === cardTypes.defuse ? "selected" : ""
              }
            >
              <img src={cardTypeIcons.defuse} alt="" width={60} height={60} />
              <h3>Defuse</h3>
            </div>
            <div
              onClick={() => handleClickBlock(cardTypes.attack)}
              className={
                selectedCardType === cardTypes.attack ? "selected" : ""
              }
            >
              <img src={cardTypeIcons.attack} alt="" width={60} height={60} />
              <h3>Attack</h3>
            </div>
            <div
              onClick={() => handleClickBlock(cardTypes.favor)}
              className={selectedCardType === cardTypes.favor ? "selected" : ""}
            >
              <img src={cardTypeIcons.favor} alt="" width={60} height={60} />
              <h3>Favor</h3>
            </div>
            <div
              onClick={() => handleClickBlock(cardTypes.nope)}
              className={selectedCardType === cardTypes.nope ? "selected" : ""}
            >
              <img src={cardTypeIcons.nope} alt="" width={60} height={60} />
              <h3>Nope</h3>
            </div>
            <div
              onClick={() => handleClickBlock(cardTypes.shuffle)}
              className={
                selectedCardType === cardTypes.shuffle ? "selected" : ""
              }
            >
              <img src={cardTypeIcons.shuffle} alt="" width={60} height={60} />
              <h3>Shuffle</h3>
            </div>
            <div
              onClick={() => handleClickBlock(cardTypes.skip)}
              className={selectedCardType === cardTypes.skip ? "selected" : ""}
            >
              <img src={cardTypeIcons.skip} alt="" width={60} height={60} />
              <h3>Skip</h3>
            </div>
            <div
              onClick={() => handleClickBlock(cardTypes.seeFuture)}
              className={
                selectedCardType === cardTypes.seeFuture ? "selected" : ""
              }
            >
              <img
                src={cardTypeIcons.seeFuture}
                alt=""
                width={60}
                height={60}
              />
              <h3>See the Future</h3>
            </div>
            <div
              onClick={() => handleClickBlock(cardTypes.tacocat)}
              className={
                selectedCardType === cardTypes.tacocat ? "selected" : ""
              }
            >
              <img src={cardTypeIcons.tacocat} alt="" width={60} height={60} />
              <h3>Tacocat</h3>
            </div>
            <div
              onClick={() => handleClickBlock(cardTypes.cattermelon)}
              className={
                selectedCardType === cardTypes.cattermelon ? "selected" : ""
              }
            >
              <img
                src={cardTypeIcons.cattermelon}
                alt=""
                width={60}
                height={60}
              />
              <h3>Cattermelon</h3>
            </div>
            <div
              onClick={() => handleClickBlock(cardTypes.hairyPotatoCat)}
              className={
                selectedCardType === cardTypes.hairyPotatoCat ? "selected" : ""
              }
            >
              <img
                src={cardTypeIcons.hairyPotatoCat}
                alt=""
                width={60}
                height={60}
              />
              <h3>Hairy Potato Cat</h3>
            </div>
            <div
              onClick={() => handleClickBlock(cardTypes.beardCat)}
              className={
                selectedCardType === cardTypes.beardCat ? "selected" : ""
              }
            >
              <img src={cardTypeIcons.beardCat} alt="" width={60} height={60} />
              <h3>Beard Cat</h3>
            </div>
            <div
              onClick={() => handleClickBlock(cardTypes.rainbowRalphingCat)}
              className={
                selectedCardType === cardTypes.rainbowRalphingCat
                  ? "selected"
                  : ""
              }
            >
              <img
                src={cardTypeIcons.rainbowRalphingCat}
                alt=""
                width={60}
                height={60}
              />
              <h3>Rainbow-Ralphing Cat</h3>
            </div>

            {expansionsList?.includes(expansions.ImplodingKittens) && (
              <>
                <div
                  onClick={() => handleClickBlock(cardTypes.reverse)}
                  className={
                    selectedCardType === cardTypes.reverse ? "selected" : ""
                  }
                >
                  <img
                    src={cardTypeIcons.reverse}
                    alt=""
                    width={60}
                    height={60}
                  />
                  <h3>Reverse</h3>
                </div>
                <div
                  onClick={() => handleClickBlock(cardTypes.drawFromTheBottom)}
                  className={
                    selectedCardType === cardTypes.drawFromTheBottom
                      ? "selected"
                      : ""
                  }
                >
                  <img
                    src={cardTypeIcons.drawFromTheBottom}
                    alt=""
                    width={60}
                    height={60}
                  />
                  <h3>Draw from the Bottom</h3>
                </div>
                <div
                  onClick={() => handleClickBlock(cardTypes.feral)}
                  className={
                    selectedCardType === cardTypes.feral ? "selected" : ""
                  }
                >
                  <img
                    src={cardTypeIcons.feral}
                    alt=""
                    width={60}
                    height={60}
                  />
                  <h3>Feral Cat</h3>
                </div>
                <div
                  onClick={() => handleClickBlock(cardTypes.alterTheFuture)}
                  className={
                    selectedCardType === cardTypes.alterTheFuture
                      ? "selected"
                      : ""
                  }
                >
                  <img
                    src={cardTypeIcons.alterTheFuture}
                    alt=""
                    width={60}
                    height={60}
                  />
                  <h3>Alter the Future</h3>
                </div>
                <div
                  onClick={() => handleClickBlock(cardTypes.targetedAttack)}
                  className={
                    selectedCardType === cardTypes.targetedAttack
                      ? "selected"
                      : ""
                  }
                >
                  <img
                    src={cardTypeIcons.targetedAttack}
                    alt=""
                    width={60}
                    height={60}
                  />
                  <h3>Targeted Attacks</h3>
                </div>
              </>
            )}
          </div>
          <div className="btn_block">
            <MainButton
              text={selectedCardType ? "Go" : "Exit"}
              onClick={handleClick}
            />
          </div>
        </div>
      </div>
    </ReactPortal>
  );
};

export default CardTypeSelectionModal;
