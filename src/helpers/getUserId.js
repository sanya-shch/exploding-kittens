import { v4 as uuidv4 } from "uuid";

const isUserNew = () => !window.localStorage.getItem("uuid");

const generateUserId = () => {
  window.localStorage.setItem("uuid", uuidv4());
  return window.localStorage.getItem("uuid");
};

export const getUserId = () => {
  if (isUserNew()) {
    return generateUserId();
  } else {
    return window.localStorage.getItem("uuid");
  }
};
