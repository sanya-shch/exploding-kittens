import React, { useContext } from 'react';
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { db } from "../../firebase";
import * as icons from "../../assets/icons";
import { ToastContext } from "../Toast";
import { expansions } from "../../constants/expansions";
import { startGame } from "../../helpers";
import MainButton from "../MainButton";
import UserBlock from "../UserBlock";

import './style.scss';

const StartBlock = ({
  isHost,
  playerDataArr,
  iconPack,
  uuid,
  id,
  expansionsList,
  cardPacksList,
}) => {
  const { setToast } = useContext(ToastContext);

  const handleClickStart = () => {
    if (playerDataArr?.length >= 2) {
      if (
        cardPacksList?.includes(expansions.ExplodingKittensOriginal) ||
        cardPacksList?.includes(expansions.ExplodingKittensNSFW) ||
        cardPacksList?.includes(expansions.ExplodingKittensParty)
      ) {
        startGame({ cardPacksList, expansionsList, playerDataArr, id });
      } else {
        setToast({
          type: 'danger',
          text: 'Select one of the game packs from the menu',
        });
      }
    } else {
      setToast({
        type: 'danger',
        text: 'At least 2 players are required',
      });

      // setToast({
      //   type: 'success',
      //   text: 'success',
      // });
      // setToast({
      //   type: 'danger',
      //   text: 'danger',
      // });
      // setToast({
      //   type: 'info',
      //   text: 'info',
      // });
      // setToast({
      //   type: 'none',
      //   text: 'none',
      // });
    }
  };

  const handleKick = async uid => {
    const index = playerDataArr.findIndex(player => player.uid === uid);

    const username = playerDataArr[index].username;
    const points = playerDataArr[index].points;
    const iconIndex = playerDataArr[index].icon_index;

    await updateDoc(doc(db, "game_rooms_kitten", id), {
      banned_player_uid: arrayUnion(uid),
      player_data_arr: arrayRemove({
        username,
        uid,
        points,
        iconIndex,
      }),
    });
  };

  return (
    <div className="start_block">
      <div className="player_block">
        {playerDataArr?.map(player => (
          <UserBlock
            key={player.uid}
            imgSrc={icons[iconPack][`${iconPack}${player.icon_index}`]}
            username={player.username}
            itsI={uuid === player.uid}
            numberOfCards={10}
            isHost={isHost}
            handleKick={() => handleKick(player.uid)}
            isStartBlock
          />
        ))}
      </div>
      {isHost && (
        <MainButton
          text="Start"
          onClick={handleClickStart}
        />
      )}
    </div>
  )
};

export default StartBlock;
