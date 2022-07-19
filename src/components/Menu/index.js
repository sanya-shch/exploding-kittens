import React from 'react';

import './style.scss';

const Menu = ({
  open,
  setOpen,
}) => {
  return (
    <div className={`menu ${open ? 'menu_active' : ''}`}>
      <button
        className="fancy-burger"
        onClick={() => setOpen(!open)}
      >
        <span className={`rectangle rectangle--top rectangle--small ${open ? 'open' : ''}`} />
        <span className={`rectangle rectangle--middle ${open ? 'open' : ''}`} />
        <span className={`rectangle rectangle--bottom rectangle--small ${open ? 'open' : ''}`} />
      </button>

      <div className="menu_list">

      </div>
    </div>
  )
};

export default Menu;
