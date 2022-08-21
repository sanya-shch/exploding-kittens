import { createContext } from "react";

const state = {
  setToast: () => undefined,
};

export const ToastContext = createContext(state);
