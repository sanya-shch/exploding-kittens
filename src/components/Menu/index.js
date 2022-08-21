import React, { useContext } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

import { db } from "../../firebase";
import { expansions } from "../../constants/expansions";
import { ToastContext } from "../Toast";
import ButtonCopy from "../ButtonCopy";
import Checkbox from "../Checkbox";
import FieldGuideBlock from "../FieldGuideBlock";
import MainButton from "../MainButton";

import "./style.scss";

const Menu = ({
  open,
  setOpen,
  id,
  uuid,
  gameData,
  isHost,
  ongoingGame,
  expansionsList,
}) => {
  const { setToast } = useContext(ToastContext);

  const handleClickCheckboxExt = (pack) => {
    updateDoc(doc(db, "game_rooms_kitten", id), {
      expansions: gameData?.expansions?.includes(pack)
        ? arrayRemove(pack)
        : arrayUnion(pack),
    });
  };

  const handleClickCheckboxPack = (pack) => {
    if (
      gameData?.card_packs?.length > 1 &&
      gameData?.card_packs?.includes(pack)
    ) {
      updateDoc(doc(db, "game_rooms_kitten", id), {
        card_packs: arrayRemove(pack),
      });
    } else {
      updateDoc(doc(db, "game_rooms_kitten", id), {
        card_packs: arrayUnion(pack),
      });
    }
  };

  const handleClickReset = async () => {
    await updateDoc(doc(db, "game_rooms_kitten", id), {
      ongoing_game: false,
      midgame_player_uid: [],
      card_deck: [],
      player_cards: {},
      players_list: [],
      game_moves: [],
      attack_count: 0,
      out_card_deck: [],
      current_player_uid: uuid,
    });
  };

  return (
    <div className={`menu ${open ? "menu_active" : ""}`}>
      <button className="fancy-burger" onClick={() => setOpen(!open)}>
        <span
          className={`rectangle rectangle--top rectangle--small ${
            open ? "open" : ""
          }`}
        />
        <span className={`rectangle rectangle--middle ${open ? "open" : ""}`} />
        <span
          className={`rectangle rectangle--bottom rectangle--small ${
            open ? "open" : ""
          }`}
        />
      </button>

      <div className="menu_list">
        <div className="game_id_block">
          <span>{id}</span>
          <ButtonCopy
            value={window.location.href}
            onClick={() =>
              setToast({
                type: "success",
                text: "Copy",
              })
            }
          >
            <span>Copy</span>
          </ButtonCopy>
        </div>
        {isHost && !ongoingGame && (
          <div className="packs_block">
            <p>Exploding Kittens</p>
            <Checkbox
              text="Original Edition ( 56 cards / to 5 players )"
              handleClick={() =>
                handleClickCheckboxPack(expansions.ExplodingKittensOriginal)
              }
              isChecked={gameData?.card_packs?.includes(
                expansions.ExplodingKittensOriginal
              )}
            />
            <Checkbox
              text="NSFW Edition ( 56 cards / to 5 players )"
              handleClick={() =>
                handleClickCheckboxPack(expansions.ExplodingKittensNSFW)
              }
              isChecked={gameData?.card_packs?.includes(
                expansions.ExplodingKittensNSFW
              )}
            />
            {/*<Checkbox*/}
            {/*  text="Party Pack Edition ( ??? cards - to 10 players )"*/}
            {/*  handleClick={() => handleClickCheckboxPack(expansions.ExplodingKittensParty)}*/}
            {/*  isChecked={gameData?.card_packs?.includes(expansions.ExplodingKittensParty)}*/}
            {/*/>*/}
            <p>Expansions</p>
            <Checkbox
              text="Imploding Kittens ( +20 cards )"
              handleClick={() =>
                handleClickCheckboxExt(expansions.ImplodingKittens)
              }
              isChecked={gameData?.expansions?.includes(
                expansions.ImplodingKittens
              )}
            />
            {/*<Checkbox*/}
            {/*  text="Streaking Kittens"*/}
            {/*  handleClick={() => handleClickCheckboxExt(expansions.StreakingKittens)}*/}
            {/*  isChecked={gameData?.expansions?.includes(expansions.StreakingKittens)}*/}
            {/*/>*/}
            {/*<Checkbox*/}
            {/*  text="Barking Kittens"*/}
            {/*  handleClick={() => handleClickCheckboxExt(expansions.BarkingKittens)}*/}
            {/*  isChecked={gameData?.expansions?.includes(expansions.BarkingKittens)}*/}
            {/*/>*/}
          </div>
        )}

        <FieldGuideBlock expansionsList={expansionsList} />

        {isHost && ongoingGame && (
          <div className="reset_btn">
            <MainButton text="Reset Game ↬" onClick={handleClickReset} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
