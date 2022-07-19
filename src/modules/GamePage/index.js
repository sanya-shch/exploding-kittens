import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../../firebase";
import { getUserId } from "../../helpers";
import WelcomeModal from "../../components/WelcomeModal";
import Header from "../../components/Header";
import Menu from "../../components/Menu";

import './style.scss';

const GamePage = () => {
  let { id } = useParams();
  id = id.toUpperCase();

  const uuid = getUserId();
  const navigate = useNavigate();

  const [gameData, setGameData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [ongoingGame, setOngoingGame] = useState(false);
  const [banned, setBanned] = useState(false);
  const [isMidGamePlayer, setIsMidGamePlayer] = useState(false);

  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  const [openMenu, setOpenMenu] = useState(false);

  const checkIfGameExists = useCallback(async () => {
    const docSnap = await getDoc(doc(db, "game_rooms_kitten", id));
    if (!docSnap.exists()) {
      navigate("/");
    }
  }, [navigate, id]);

  useEffect(() => {
    checkIfGameExists();
    const unsubscribe = onSnapshot(doc(db, "game_rooms_kitten", id), (doc) => {
      setGameData(doc.data());
      setDataLoaded(true);
    });
    return () => {
      unsubscribe();
    };
  }, [checkIfGameExists, id]);

  const checkIfUserExists = useCallback(() => {
    let userExists = false;
    gameData.player_data_arr.forEach((element) => {
      if (uuid === element.uid) {
        userExists = true;
      }
    });
    if (!userExists) {
      setIsWelcomeModalOpen(true);
    }
  }, [gameData?.player_data_arr, uuid]);

  const checkIfBanned = useCallback(() => {
    if (gameData.banned_player_uid.indexOf(uuid) !== -1) {
      setBanned(true);
      setIsWelcomeModalOpen(false);
    }
  }, [gameData?.banned_player_uid, uuid]);

  const leaveIfGameDeleted = useCallback(() => {
    if (gameData.game_room_closed) {
      navigate("/");
    }
  }, [gameData?.game_room_closed, navigate]);

  const checkGameStatus = useCallback(() => {
    if (gameData.ongoing_game) {
      setOngoingGame(true);
    } else {
      setOngoingGame(false);
    }
  }, [gameData?.ongoing_game, setOngoingGame]);

  const checkIfMidGamePlayer = useCallback(() => {
    if (gameData.midgame_player_uid.indexOf(uuid) !== -1) {
      setIsMidGamePlayer(true);
    } else {
      setIsMidGamePlayer(false);
    }
  }, [gameData?.midgame_player_uid, uuid]);

  useEffect(() => {
    if (dataLoaded) {
      leaveIfGameDeleted();
      checkIfUserExists();
      checkIfBanned();
      checkGameStatus();
      checkIfMidGamePlayer();
      if (gameData.host_uid === uuid) {
        setIsHost(true);
      }
    }
  }, [
    dataLoaded,
    gameData,
    checkGameStatus,
    checkIfBanned,
    checkIfMidGamePlayer,
    checkIfUserExists,
    leaveIfGameDeleted,
    uuid,
  ]);

  console.log({
    gameData,
    isWelcomeModalOpen,
    uuid,
  });

  return (
    <>
      <Menu
        open={openMenu}
        setOpen={setOpenMenu}
      />
      <div className={`content ${openMenu ? 'content_active' : ''}`}>
        <Header/>
        <div className="game_page">
          <WelcomeModal
            isOpen={isWelcomeModalOpen}
            handleClose={() => setIsWelcomeModalOpen(false)}
            isHost={isHost}
            iconPack={gameData?.icon_pack}
            iconIndex={gameData?.icon_index}
            id={id}
            uuid={uuid}
            ongoingGame={ongoingGame}
          />
        </div>
      </div>
    </>
  )
};

export default GamePage;
