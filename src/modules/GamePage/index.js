import React, { useState, useCallback, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

import { ToastContext } from "../../components/Toast";
import { db } from "../../firebase";
import { getUserId } from "../../helpers";
import { numbersOfPlayers } from "../../constants/expansions";
import WelcomeModal from "../../components/WelcomeModal";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import StartBlock from "../../components/StartBlock";
import GameBlock from "../../components/GameBlock";

import './style.scss';

const GamePage = () => {
  let { id } = useParams();
  id = id.toUpperCase();

  const { setToast } = useContext(ToastContext);

  const uuid = getUserId();
  const navigate = useNavigate();

  const [gameData, setGameData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [ongoingGame, setOngoingGame] = useState(false);
  // const [banned, setBanned] = useState(false);
  const [isMidGamePlayer, setIsMidGamePlayer] = useState(false);

  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  const [openMenu, setOpenMenu] = useState(false);

  const [isWaitStart, setIsWaitStart] = useState(false);

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

    const currentNumberOfPlayers = gameData.player_data_arr.length;
    const possibleNumberOfPlayers = gameData.card_packs.reduce((acc, item) => acc + numbersOfPlayers[item], 0);

    if (!userExists) {
      setIsWelcomeModalOpen(true);
      setIsWaitStart(false);
    } else if (possibleNumberOfPlayers <= currentNumberOfPlayers) {
      setToast({
        type: 'info',
        text: 'There are too many players in this game',
      });
      navigate("/");
    } else {
      setIsWaitStart(true);
    }
  }, [gameData?.player_data_arr, uuid]);

  const checkIfBanned = useCallback(() => {
    if (gameData.banned_player_uid.indexOf(uuid) !== -1) {
      // setBanned(true);
      setIsWelcomeModalOpen(false);
      setToast({
        type: 'danger',
        text: 'You have been banned',
      });
      navigate("/");
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

  return (
    <>
      <Menu
        open={openMenu}
        setOpen={setOpenMenu}
        id={id}
        gameData={gameData}
        ongoingGame={ongoingGame}
        isHost={isHost}
      />
      <div className={`content ${openMenu ? 'content_active' : ''}`}>
        <Header/>
        <div className="game_page">
          {!ongoingGame && isWaitStart && (
            <StartBlock
              isHost={isHost}
              playerDataArr={gameData?.player_data_arr}
              iconPack={gameData?.icon_pack}
              uuid={uuid}
              id={id}
              expansionsList={gameData?.expansions}
              cardPacksList={gameData?.card_packs}
            />
          )}
          {ongoingGame && (
            <GameBlock
              midgamePlayerUid={gameData?.midgame_player_uid}
              playerDataArr={gameData?.player_data_arr}
              iconPack={gameData?.icon_pack}
              playerCards={gameData?.player_cards}
              cardDeck={gameData?.card_deck}
              outCardDeck={gameData?.out_card_deck}
              expansionsList={gameData?.expansions}
              cardPacksList={gameData?.card_packs}
              currentPlayerUid={gameData?.current_player_uid}
              uuid={uuid}
              id={id}
            />
          )}
          {isMidGamePlayer && (
            <div/>
          )}
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
