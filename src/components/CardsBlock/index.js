import React, { useMemo, useState } from 'react';

import * as cardsImages from '../../constants/cards';

import './style.scss';

const CardsBlock = ({
  playerCards,
  expansionsList,
  cardPacksList,
  uuid,
  id,
}) => {
  const [selectedCards, setSelectedCards] = useState([]);

  const cards = useMemo(() => [...expansionsList, ...cardPacksList]
      .reduce((acc, item) => ({ ...acc, ...cardsImages[item]}), {}),
    [expansionsList, cardPacksList]
  );

  const handleMouseDown = event => {

  };

  return (
    <div className="cards_block">
      {playerCards?.length ? (
        playerCards.sort().map(item => (
          <div
            key={item}
            className={`card_wrapper ${selectedCards.includes(item) ? 'selected' : ''}`}
            tabIndex={0}
            role="button"
            onClick={() => setSelectedCards(prev => prev.includes(item) ? prev.filter(pItem => pItem !== item) : [...prev, item])}
            onMouseDown={handleMouseDown}
          >
            <img src={cards[item].img} alt="" width={200} height={300} />
          </div>
        ))
      ) : (
        <div>

        </div>
      )}
    </div>
  )
};

export default CardsBlock;
