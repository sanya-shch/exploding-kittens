import React from 'react';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

import { db } from "../../firebase";
import * as icons from "../../assets/icons";
import { cardTypes } from "../../constants/cardTypes";
import ReactPortal from "../ReactPortal";
import MainButton from "../MainButton";

import './style.scss';

const PlayerSelectionModal = ({
  isOpen,
  handleClose,
  cardType,
  cards,
  id,
  uuid,
  playerCards,
  playersList,
  playerDataArr,
  iconPack,
  setCardTypeSelectionModalOpen,
  setSelectedPlayer,
  selectedPlayer,
  setCardSelectionModalOpen,
}) => {
  // const [selectedPlayer, setSelectedPlayer] = useState(null);

  const players = playersList.reduce((acc, item) => {
    if (item !== uuid) {
      acc.push(playerDataArr.find(findItem => findItem.uid === item));
    }

    return acc;
  }, []);

  const handleClick = () => {
    if (selectedPlayer) {
      if (cards[cardType]?.type === cardTypes.favor) {
        updateDoc(doc(db, "game_rooms_kitten", id), {
          player_cards: { ...playerCards, [uuid]: playerCards[uuid].filter(item => item !== cardType) },
          out_card_deck: arrayUnion(cardType),

          game_moves: arrayUnion({ uid: uuid, cardType: cards[cardType].type, favorPlayerUid: selectedPlayer.uid }),
        });
      } else if (cards[cardType]?.type === cardTypes.targetedAttack) {
        updateDoc(doc(db, "game_rooms_kitten", id), {
          player_cards: {...playerCards, [uuid]: playerCards[uuid].filter(item => item !== cardType)},
          out_card_deck: arrayUnion(cardType),

          game_moves: arrayUnion({ uid: uuid, cardType: cards[cardType].type }),

          attack_count: 2,
          current_player_uid: selectedPlayer.uid,
        });
      } else if (cardType === 'combo_2') {
        setCardSelectionModalOpen(true);
      } else if (cardType === 'combo_3') {
        setCardTypeSelectionModalOpen(true);
      }
    }

    handleClose();
  };

  const handleClickImg = player => {
     setSelectedPlayer(player);
  };

  if (!isOpen) return null;

  return (
    <ReactPortal wrapperId="react-portal-player-selection-modal">
      <div className="player-selection-modal">
        <div className="modal-content">
          <div className="content_block">
            {players.map(player => (
              <div
                key={player.uid}
                className={selectedPlayer?.uid === player.uid ? 'selected' : ''}
                onClick={() => handleClickImg(player)}
              >
                <img
                  src={icons[iconPack][`${iconPack}${player.icon_index}`]}
                  alt=""
                  width="65px"
                  height="65px"
                />
                <p>{player.username}</p>
              </div>
            ))}
          </div>
          <div className="btn_block">
            <MainButton
              text="Go"
              onClick={handleClick}
            />
          </div>
        </div>
      </div>
    </ReactPortal>
  )
};

export default PlayerSelectionModal;
