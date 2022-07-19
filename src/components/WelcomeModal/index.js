import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

import * as icons from "../../assets/icons";
import { db } from "../../firebase";
import RadioBlock from "../RadioBlock";
import ReactPortal from "../ReactPortal";
import Input from "../Input";
import MainButton from "../MainButton";

import './style.scss';

const WelcomeModal = ({
  isOpen,
  handleClose,
  isHost,
  iconPack,
  iconIndex,
  id,
  uuid,
  ongoingGame,
}) => {
  const [value, setValue] = useState('cat');
  const [checked, setChecked] = useState(1);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (iconPack) {
      setValue(iconPack || 'cat');
    }
    if (iconIndex) {
      setChecked(iconIndex || 1);
    }
  }, [iconPack, iconIndex]);

  const handleClick = () => {
    if (value && checked && username) {
      updateDoc(doc(db, "game_rooms_kitten", id), {
        icon_pack: value,
        icon_index: checked,
        player_data_arr: arrayUnion({ username, uid: uuid, points: 0 }),
      });

      if (ongoingGame) {
        updateDoc(doc(db, "game_rooms_kitten", id), {
          midgame_player_uid: arrayUnion(uuid),
        });
      }

      handleClose();
    }
  };

  const handleChange = event => {
    setUsername(event.target.value);
  };

  if (!isOpen) return null;

  return (
    <ReactPortal wrapperId="react-portal-start-modal">
      <div className="start-modal">
        <div className="modal-content">
          <div className="input_name_block">
            <Input
              maxLength={16}
              value={username}
              onChange={handleChange}
            />
          </div>
          {/*<div className="expansion_packs_block">*/}

          {/*</div>*/}
          <div className="content_block">
            {isHost && <RadioBlock
              value={value}
              setValue={setValue}
            />}
            <div className="icons_block">
              {Object.values(icons[value]).map((item, index) => (
                <img
                  key={`img-${index}`}
                  src={item}
                  alt=""
                  width="65px"
                  height="65px"
                  className={index + 1 === checked ? 'checked' : ''}
                  onClick={() => setChecked(index + 1)}
                />
              ))}
            </div>
          </div>
          <div className="btn_block">
            <MainButton
              text="Join"
              onClick={handleClick}
            />
          </div>
        </div>
      </div>
    </ReactPortal>
  )
};

export default WelcomeModal;
