import React from "react";

import "./style.scss";

const CardsLoader = ({ delay = 0 }) => {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => setReady(true), delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [delay]);

  return (
    <div className="cards_loader">
      {ready && (
        <div className="holder">
          <div id="card-holder">
            <div className="card card-back" />
            <div className="card card-front" />
            <div className="shadowA" />
            <div className="shadowB" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CardsLoader;
