import React, { useEffect, useRef } from 'react';

import './style.scss';

const MainButton = ({
  text,
  onClick,
}) => {
  const element = useRef(null);
  const spanElement = useRef(null);

  useEffect(() => {
    const mouseenter = e => {
      if (element?.current) {
        const relX = e.pageX - element.current.offsetLeft;
        const relY = e.pageY - element.current.offsetTop;

        spanElement.current.style.top = `${relY}px`;
        spanElement.current.style.left = `${relX}px`
      }
    };
    const mouseout = e => {
      if (element?.current) {
        const relX = e.pageX - element.current.offsetLeft;
        const relY = e.pageY - element.current.offsetTop;

        spanElement.current.style.top = `${relY}px`;
        spanElement.current.style.left = `${relX}px`
      }
    };

    if (element?.current) {
      element.current.addEventListener("mouseenter", mouseenter);
      element.current.addEventListener("mouseout", mouseout);
    }

    return () => {
      if (element?.current) {
        element.current.removeEventListener("mouseenter", mouseenter);
        element.current.removeEventListener("mouseout", mouseout);
      }
    }
  }, []);

  return (
    <button ref={element} className="main_button" onClick={onClick}>
      <span className="text">{text}</span>
      <span ref={spanElement} className="focus-bg" />
    </button>
  )
};

export default MainButton;
