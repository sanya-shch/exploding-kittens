import React, { useId } from 'react';

import './style.scss';

const Checkbox = ({
  text,
  handleClick,
  isChecked,
}) => {
  const componentID = useId();

  return (
    <div className="checkbox-rect">
      <input
        type="checkbox"
        id={`checkbox-rect-${componentID}`}
        name="check"
        checked={isChecked}
        onChange={handleClick}
      />
        <label htmlFor={`checkbox-rect-${componentID}`}>{text}</label>
    </div>
  )
};

export default Checkbox;
