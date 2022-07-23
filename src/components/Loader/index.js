import React from 'react';

import './style.scss';

const Loader = ({ delay = 0, isFullScreen = true }) => {

  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => setReady(true), delay);

    return () => {
      clearTimeout(timeout);
    }
  }, [delay]);

  return (
    <div className={`loader ${isFullScreen ? 'full-screen' : ''}`}>
      {ready && <svg>
        <circle cx="70" cy="70" r="70" />
      </svg>}
    </div>
  )
};

export default Loader;
