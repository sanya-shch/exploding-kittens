import React, { useContext } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { db } from "../../firebase";
import * as icons from "../../assets/icons";
import { ToastContext } from "../Toast";
import { expansions } from "../../constants/expansions";
import { startGame } from "../../helpers";
import UserBlock from "../UserBlock";

import "./style.scss";

const StartBlock = ({
  isHost,
  playerDataArr,
  iconPack,
  uuid,
  id,
  expansionsList,
  cardPacksList,
}) => {
  const navigate = useNavigate();

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
          type: "danger",
          text: "Select one of the game packs from the menu",
        });
      }
    } else {
      setToast({
        type: "danger",
        text: "At least 2 players are required",
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

  const handleClickDelete = async () => {
    await updateDoc(doc(db, "game_rooms_kitten", id), {
      game_room_closed: true,
    });
    await deleteDoc(doc(db, "game_rooms_kitten", id));
    await updateDoc(doc(db, "game_room_codes_kitten", "code_array"), {
      codes: arrayRemove(id),
    });
  };

  const handleKick = async (uid) => {
    await updateDoc(doc(db, "game_rooms_kitten", id), {
      banned_player_uid: arrayUnion(uid),
      player_data_arr: playerDataArr.filter((player) => player.uid !== uid),
    });
  };

  const handleClickLeave = () => {
    const player = playerDataArr.find((arr) => arr.uid === uuid);

    updateDoc(doc(db, "game_rooms_kitten", id), {
      player_data_arr: arrayRemove(player),
    });
    navigate("/");
  };

  return (
    <div className="start_block">
      <div className="player_block">
        {playerDataArr?.map((player) => (
          <UserBlock
            key={player.uid}
            imgSrc={icons[iconPack][`${iconPack}${player.icon_index + 1}`]}
            username={player.username}
            itsI={uuid === player.uid}
            numberOfCards={10}
            isHost={isHost}
            handleKick={() => handleKick(player.uid)}
            isStartBlock
          />
        ))}
      </div>
      {isHost ? (
        <div className="btn-block">
          <button onClick={handleClickDelete}>Delete Room</button>
          <button onClick={handleClickStart}>Start Game</button>
        </div>
      ) : (
        <div className="btn-block">
          <button onClick={handleClickLeave}>Leave</button>
        </div>
      )}
    </div>
  );
};

export default StartBlock;
