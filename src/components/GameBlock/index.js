import React, {
  useState,
  useMemo,
  useEffect,
  useContext,
  lazy,
  Suspense,
} from "react";
import { doc, updateDoc } from "firebase/firestore";

import { db } from "../../firebase";
import * as cardsImages from "../../constants/cards";
import { isExplode } from "../../helpers";
import { ToastContext } from "../Toast";
import PlayersBlock from "../PlayersBlock";
import CardsBlock from "../CardsBlock";
import CardsDeckBlock from "../CardsDeckBlock";
// import CardSeeTheFutureModal from "../CardSeeTheFutureModal";
// import CardPutToDeckModal from "../CardPutToDeckModal";
// import CardFromTheDiscardedDeckModal from "../CardFromTheDiscardedDeckModal";
// import PlayerSelectionModal from "../PlayerSelectionModal";
// import CardSelectionModal from "../CardSelectionModal";
// import CardTypeSelectionModal from "../CardTypeSelectionModal";
// import FavorCardModal from "../FavorCardModal";

import "./style.scss";

const CardSeeTheFutureModal = lazy(() => import("../CardSeeTheFutureModal"));
const CardPutToDeckModal = lazy(() => import("../CardPutToDeckModal"));
const CardFromTheDiscardedDeckModal = lazy(() =>
  import("../CardFromTheDiscardedDeckModal")
);
const PlayerSelectionModal = lazy(() => import("../PlayerSelectionModal"));
const CardSelectionModal = lazy(() => import("../CardSelectionModal"));
const CardTypeSelectionModal = lazy(() => import("../CardTypeSelectionModal"));
const FavorCardModal = lazy(() => import("../FavorCardModal"));

const GameBlock = ({
  midgamePlayerUid,
  playerDataArr,
  iconPack,
  playerCards,
  cardDeck,
  outCardDeck,
  expansionsList,
  cardPacksList,
  currentPlayerUid,
  playersList,
  gameMoves,
  attackCount,
  uuid,
  id,
  setOpenMenu,
}) => {
  const { setToast } = useContext(ToastContext);

  const [cardSeeTheFutureModalOpen, setCardSeeTheFutureModalOpen] =
    useState(false);
  const [cardType, setCardType] = useState("");
  useEffect(() => {
    if (cardType) {
      setCardSeeTheFutureModalOpen(true);
    }
  }, [cardType]);

  const [cardPutToDeckModalOpen, setCardPutToDeckModalOpen] = useState(false);
  const [
    cardFromTheDiscardedDeckModalOpen,
    setCardFromTheDiscardedDeckModalOpen,
  ] = useState(false);

  const [playerSelectionModalOpen, setPlayerSelectionModalOpen] =
    useState(false);
  const [playerSelectionModalCardType, setPlayerSelectionModalCardType] =
    useState("");
  const [favorCardModalOpen, setFavorCardModalOpen] = useState(false);
  useEffect(() => {
    if (playerSelectionModalCardType) {
      setPlayerSelectionModalOpen(true);
    }
  }, [playerSelectionModalCardType]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedPlayerCards, setSelectedPlayerCards] = useState(null);

  const [cardSelectionModalOpen, setCardSelectionModalOpen] = useState(false);
  const [cardTypeSelectionModalOpen, setCardTypeSelectionModalOpen] =
    useState(false);

  const [selectedCards, setSelectedCards] = useState([]);

  const cards = useMemo(
    () =>
      [...expansionsList, ...cardPacksList].reduce(
        (acc, item) => ({ ...acc, ...cardsImages[item] }),
        {}
      ),
    [expansionsList, cardPacksList]
  );

  useEffect(() => {
    switch (
      isExplode({
        playerCards: playerCards[uuid],
        cards,
      })
    ) {
      case "explode":
        updateDoc(doc(db, "game_rooms_kitten", id), {
          player_cards: { ...playerCards, [uuid]: [] },
          attack_count: 0,
          game_moves: [],
          players_list: playersList.filter((item) => item !== uuid),
        });
        setToast({
          type: "danger",
          text: "You exploded!!!",
        });
        break;
      case "not_explode":
        setCardPutToDeckModalOpen(true);
        break;
      default:
        break;
    }
  }, [cardDeck, playerCards, cards, id, playersList, setToast, uuid]);

  useEffect(() => {
    if (gameMoves.at(-1)?.favorPlayerUid === uuid) {
      setFavorCardModalOpen(true);
      setOpenMenu(false);
    }
  }, [gameMoves, setOpenMenu, uuid]);

  useEffect(() => {
    if (playersList.length === 1 && playersList[0] === uuid) {
      updateDoc(doc(db, "game_rooms_kitten", id), {
        ongoing_game: false,
        midgame_player_uid: [],
        card_deck: [],
        player_cards: {},
        players_list: [],
        game_moves: [],
        attack_count: 0,
        out_card_deck: [],
        current_player_uid: uuid,
        player_data_arr: playerDataArr.map((item) =>
          item.uid === playersList[0]
            ? { ...item, points: item.points + 1 }
            : item
        ),
      });
    }
  }, [playersList, uuid, playerDataArr]);

  return (
    <>
      <div className="game_block">
        <PlayersBlock
          midgamePlayerUid={midgamePlayerUid}
          playerDataArr={playerDataArr}
          iconPack={iconPack}
          playerCards={playerCards}
          uuid={uuid}
          currentPlayerUid={currentPlayerUid}
          playersList={playersList}
        />

        <CardsDeckBlock
          playerCards={playerCards}
          cardDeck={cardDeck}
          outCardDeck={outCardDeck}
          cards={cards}
          selectedCards={selectedCards}
          setSelectedCards={setSelectedCards}
          uuid={uuid}
          id={id}
          isCurrentPlayer={currentPlayerUid === uuid}
          playersList={playersList}
          gameMoves={gameMoves}
          attackCount={attackCount}
          setCardType={setCardType}
          setCardFromTheDiscardedDeckModalOpen={
            setCardFromTheDiscardedDeckModalOpen
          }
          setPlayerSelectionModalCardType={setPlayerSelectionModalCardType}
          setSelectedPlayerCards={setSelectedPlayerCards}
          setCardSelectionModalOpen={setCardSelectionModalOpen}
          setSelectedPlayer={setSelectedPlayer}
        />

        <CardsBlock
          playerCards={playerCards}
          uuid={uuid}
          id={id}
          setSelectedCards={setSelectedCards}
          selectedCards={selectedCards}
          cards={cards}
          currentPlayerUid={currentPlayerUid}
          isCurrentPlayer={currentPlayerUid === uuid}
          playersList={playersList}
          cardDeck={cardDeck}
          setCardType={setCardType}
          gameMoves={gameMoves}
          attackCount={attackCount}
          setCardFromTheDiscardedDeckModalOpen={
            setCardFromTheDiscardedDeckModalOpen
          }
          setPlayerSelectionModalCardType={setPlayerSelectionModalCardType}
          setCardSelectionModalOpen={setCardSelectionModalOpen}
          setSelectedPlayer={setSelectedPlayer}
        />

        <div className="drag_items">
          {selectedCards?.map((item) => (
            <img key={item} src={cards[item]?.img} alt="" />
          ))}
        </div>
      </div>

      {cardSeeTheFutureModalOpen && (
        <Suspense>
          <CardSeeTheFutureModal
            isOpen={cardSeeTheFutureModalOpen}
            handleClose={() => {
              setCardSeeTheFutureModalOpen(false);
              setCardType("");
            }}
            cardType={cardType}
            cardDeck={cardDeck}
            cards={cards}
            playerCards={playerCards}
            uuid={uuid}
            id={id}
          />
        </Suspense>
      )}

      {cardPutToDeckModalOpen && (
        <Suspense>
          <CardPutToDeckModal
            isOpen={cardPutToDeckModalOpen}
            handleClose={() => {
              setCardPutToDeckModalOpen(false);
            }}
            cardDeck={cardDeck}
            playerCards={playerCards}
            cards={cards}
            uuid={uuid}
            id={id}
            attackCount={attackCount}
            playersList={playersList}
          />
        </Suspense>
      )}

      {cardFromTheDiscardedDeckModalOpen && (
        <Suspense>
          <CardFromTheDiscardedDeckModal
            isOpen={cardFromTheDiscardedDeckModalOpen}
            handleClose={() => {
              setCardFromTheDiscardedDeckModalOpen(false);
              setSelectedPlayerCards(null);
            }}
            outCardDeck={outCardDeck}
            cards={cards}
            playerCards={playerCards}
            uuid={uuid}
            id={id}
            selectedCards={selectedPlayerCards}
          />
        </Suspense>
      )}

      {playerSelectionModalOpen && (
        <Suspense>
          <PlayerSelectionModal
            isOpen={playerSelectionModalOpen}
            handleClose={() => {
              setPlayerSelectionModalOpen(false);
              setPlayerSelectionModalCardType("");
            }}
            cardType={playerSelectionModalCardType}
            playersList={playersList}
            playerDataArr={playerDataArr}
            iconPack={iconPack}
            uuid={uuid}
            id={id}
            playerCards={playerCards}
            cards={cards}
            setCardTypeSelectionModalOpen={setCardTypeSelectionModalOpen}
            setSelectedPlayer={setSelectedPlayer}
            selectedPlayer={selectedPlayer}
            setCardSelectionModalOpen={setCardSelectionModalOpen}
            attackCount={attackCount || 0}
          />
        </Suspense>
      )}

      {favorCardModalOpen && (
        <Suspense>
          <FavorCardModal
            isOpen={favorCardModalOpen}
            handleClose={() => {
              setFavorCardModalOpen(false);
            }}
            playerCards={playerCards}
            cards={cards}
            uuid={uuid}
            id={id}
            favoredUid={gameMoves.at(-1)?.uid}
          />
        </Suspense>
      )}

      {cardTypeSelectionModalOpen && (
        <Suspense>
          <CardTypeSelectionModal
            isOpen={cardTypeSelectionModalOpen}
            handleClose={() => {
              setCardTypeSelectionModalOpen(false);
              setSelectedPlayer(null);
              setSelectedPlayerCards(null);
            }}
            expansionsList={expansionsList}
            selectedPlayer={selectedPlayer}
            playerCards={playerCards}
            cards={cards}
            uuid={uuid}
            id={id}
            selectedCards={selectedPlayerCards}
          />
        </Suspense>
      )}

      {cardSelectionModalOpen && (
        <Suspense>
          <CardSelectionModal
            isOpen={cardSelectionModalOpen}
            handleClose={() => {
              setCardSelectionModalOpen(false);
              setSelectedPlayer(null);
              setSelectedPlayerCards(null);
            }}
            playerCards={playerCards}
            uuid={uuid}
            id={id}
            selectedCards={selectedPlayerCards}
            selectedPlayerUid={selectedPlayer?.uid}
          />
        </Suspense>
      )}
    </>
  );
};

export default GameBlock;
