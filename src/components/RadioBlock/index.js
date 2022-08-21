import React from "react";

import { ReactComponent as CatSvg } from "../../assets/icons/cat-svgrepo-com.svg";
import { ReactComponent as OrigamiSvg } from "../../assets/icons/origami-svgrepo-com.svg";
import { ReactComponent as AnimalsSvg } from "../../assets/icons/fields-svgrepo-com.svg";

import "./style.scss";

const RadioBlock = ({ value = "cat", setValue }) => {
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="radio_block">
      <div className="rating-container">
        <div className="rating">
          <form className="rating-form">
            <label htmlFor="cat">
              <input
                type="radio"
                name="rating"
                className="cat"
                id="cat"
                value="cat"
                checked={value === "cat"}
                onChange={handleChange}
              />
              <CatSvg />
            </label>

            <label htmlFor="origami">
              <input
                type="radio"
                name="rating"
                className="origami"
                id="origami"
                value="origami"
                checked={value === "origami"}
                onChange={handleChange}
              />
              <OrigamiSvg />
            </label>

            <label htmlFor="animals">
              <input
                type="radio"
                name="rating"
                className="animals"
                id="animals"
                value="animals"
                checked={value === "animals"}
                onChange={handleChange}
              />
              <AnimalsSvg />
            </label>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RadioBlock;
